function connectionState(state){const dot=document.getElementById('connection-indicator');dot.className='connection-state '+state;dot.title=state==='connected'?'Connected':state==='disconnected'?'Not connected':'Checking connection';}
const status=document.getElementById('status'),test=document.getElementById('test');
document.getElementById('extension-id').value=chrome.runtime.id;
document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(chrome.runtime.id);status.textContent='Extension ID copied. Paste it into OCR Companion for Migaku.'}catch{status.textContent='Select and copy the extension ID above.'}};
let connectionGeneration=0,connectionTimer;
async function checkConnection(automatic=false,generation=connectionGeneration){
 if(generation!==connectionGeneration)return false;
 if(!automatic){clearTimeout(connectionTimer);connectionGeneration++;generation=connectionGeneration;test.disabled=true;connectionState('checking');status.textContent='Checking the native helper…'}
 try{
  const result=await chrome.runtime.sendMessage({type:'health'});
  if(generation!==connectionGeneration)return false;
  if(!result?.ok)throw new Error(result?.error||'Native helper check failed.');
  connectApp.hidden=true;connectionState('connected');status.textContent='Connected to Apple Live Text · helper '+result.health.version+'. You can now read comic pages.';clearTimeout(connectionTimer);test.disabled=false;return true;
 }catch(error){if(generation===connectionGeneration&&!automatic){connectionState('disconnected');status.textContent=error.message};return false}
 finally{if(generation===connectionGeneration&&!automatic)test.disabled=false}
}
test.onclick=()=>checkConnection();
const connectApp=document.getElementById('connect-app');
connectApp.href='ocrcompanion://connect?extension_id='+encodeURIComponent(chrome.runtime.id);
connectApp.onclick=()=>{
 clearTimeout(connectionTimer);const generation=++connectionGeneration;
 connectionState('checking');status.textContent='Approve the connection in the Mac app. Checking automatically for up to 90 seconds…';
 const deadline=Date.now()+90000;
 async function pollConnection(){
  if(generation!==connectionGeneration)return;
  if(await checkConnection(true,generation))return;
  if(generation!==connectionGeneration)return;
  if(Date.now()>=deadline){connectionState('disconnected');status.textContent='Not connected yet. Install/open the Mac app and approve the connection, then click Check connection. Manual setup is available below.';return}
  connectionTimer=setTimeout(pollConnection,1500);
 }
 connectionTimer=setTimeout(pollConnection,1500);
 // Keep the trusted anchor navigation so Chrome can ask to open the Mac app.
};
window.addEventListener('pagehide',()=>{connectionGeneration++;clearTimeout(connectionTimer)});


const compatStatus=document.getElementById('compat-status');
document.getElementById('enable-bilibili').onclick=async()=>{
 try{
  const granted=await chrome.permissions.request({origins:['https://manga.bilibili.com/*']});
  if(!granted){compatStatus.textContent='Permission declined. OCR and Shift lookup still work.';return}
  await chrome.storage.local.set({bilibiliMigakuEnabled:true});
  compatStatus.textContent='Enabled. Reload the Bilibili comic once, then read it. Migaku must be in Full power mode.';
 }catch(error){compatStatus.textContent=error.message}
};
document.getElementById('disable-bilibili').onclick=async()=>{
 try{await chrome.storage.local.set({bilibiliMigakuEnabled:false});await chrome.permissions.remove({origins:['https://manga.bilibili.com/*']});compatStatus.textContent='Disabled. Reload the comic to remove the compatibility container.'}catch(error){compatStatus.textContent=error.message}
};
chrome.storage.local.get('bilibiliMigakuEnabled').then(value=>{compatStatus.textContent=value.bilibiliMigakuEnabled?'Bilibili compatibility is enabled.':'Bilibili compatibility is off. Basic OCR needs no extra page access.'});

document.getElementById('reconnect').onclick=()=>{connectApp.hidden=false;status.textContent='Click Connect Mac app above to reconnect or change the extension connection.'};
const initialGeneration=connectionGeneration;
checkConnection(true,initialGeneration).then(ok=>{if(!ok&&initialGeneration===connectionGeneration){connectionState('disconnected');status.textContent='Not connected. Click Connect Mac app to finish setup.'}});
