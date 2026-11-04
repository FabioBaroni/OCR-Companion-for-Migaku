importScripts('reader-core.js','migaku-registration.js');
globalThis.OCRCompanionMigakuRegistration?.start(chrome);
const NATIVE_HOST='local.ocrcompanion.reader',LIMIT=16*1024*1024,RULE_ID=19473;
const LANGUAGES=new Set(['zh-Hans','zh-Hant','ja-JP','ko-KR','en-US','fr-FR','de-DE','es-ES','it-IT','pt-BR']);
const MODES=new Set(['auto','source','capture']);
let busy=false,adapterPromise;
const adapters=()=>adapterPromise??=fetch(chrome.runtime.getURL('adapters.json')).then(r=>r.json());
const {matchAdapter,languageFor,captureTransform,sameView}=OCRCompanionCore;
function nativeRequest(payload){
 return new Promise((resolve,reject)=>{
  let port,done=false,timer;
  const finish=(error,data)=>{if(done)return;done=true;clearTimeout(timer);try{port?.disconnect()}catch{};error?reject(error):resolve(data)};
  try{
   port=chrome.runtime.connectNative(NATIVE_HOST);
   port.onMessage.addListener(data=>finish(null,data));
   port.onDisconnect.addListener(()=>{const detail=chrome.runtime.lastError?.message||'The native helper disconnected.';finish(new Error('Native helper unavailable. Run OCR Companion for Migaku with the extension ID shown in Settings. '+detail))});
   timer=setTimeout(()=>finish(new Error('Apple Live Text timed out. Try a smaller visible area.')),70000);
   port.postMessage(payload);
  }catch(e){finish(new Error('Cannot start the native helper. Run OCR Companion for Migaku and connect this extension. '+e.message))}
 });
}
function base64(bytes){const chunks=[];for(let i=0;i<bytes.length;i+=32768)chunks.push(String.fromCharCode(...bytes.subarray(i,i+32768)));return btoa(chunks.join(''))}
async function helper(path,bytes){
 const payload={v:1,action:bytes?'ocr':'health'};
 if(bytes){if(!bytes.byteLength||bytes.byteLength>LIMIT)throw new Error('Image must be under 16 MB.');payload.language=path.slice('/ocr/'.length);payload.image=base64(bytes)}
 const data=await nativeRequest(payload);
 if(!data||data.ok!==true)throw new Error(data?.error||'Invalid native helper response.');
 if(!bytes&&data.supported===false)throw new Error('Apple Live Text is not supported on this Mac.');
 return data;
}
// Old HTTP credentials are no longer used, including after an upgrade.
chrome.storage.local.remove('token').catch(()=>{});
async function mount(tabId,settings){await chrome.scripting.executeScript({target:{tabId},files:['reader-core.js','migaku-compat.js','content.js']});const tab=await chrome.tabs.get(tabId);const adapter=matchAdapter(await adapters(),tab.url);await chrome.tabs.sendMessage(tabId,{type:'configure',adapter,language:settings.language||languageFor(adapter,tab.url),mode:settings.mode});return {tab,adapter,language:settings.language||languageFor(adapter,tab.url)}}
async function status(tabId,text,busy){await chrome.tabs.sendMessage(tabId,{type:'status',text,busy}).catch(()=>{})}
function decodeDataURL(url){if(typeof url!=='string'||!/^data:image\/(png|jpeg|webp);base64,/.test(url))throw new Error('Invalid image data.');const binary=atob(url.slice(url.indexOf(',')+1));if(binary.length>LIMIT)throw new Error('Image exceeds 16 MB. Use a smaller visible area.');return Uint8Array.from(binary,c=>c.charCodeAt(0))}
async function toDataURL(bytes,type='image/png'){return `data:${type};base64,`+base64(bytes)}
function allowedImage(url,adapter){const u=new URL(url);return u.protocol==='https:'&&adapter?.imageHosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))}
async function download(src,adapter,pageURL){
 if(!allowedImage(src,adapter))throw new Error('Image host is not configured for this reader.');
 const referrer=adapter.referrer==='page'?pageURL:adapter.referrer;
 try{
  if(referrer)await chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:[RULE_ID],addRules:[{id:RULE_ID,priority:1,action:{type:'modifyHeaders',requestHeaders:[{header:'referer',operation:'set',value:referrer}]},condition:{urlFilter:'|'+src+'|',initiatorDomains:[chrome.runtime.id],resourceTypes:['xmlhttprequest']}}]});
  const response=await fetch(src,{credentials:'include',signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error('Image server returned HTTP '+response.status);
  const declared=Number(response.headers.get('content-length'));if(declared>LIMIT)throw new Error('Source exceeds 16 MB.');
  const reader=response.body.getReader(),chunks=[];let size=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>LIMIT){await reader.cancel();throw new Error('Source exceeds 16 MB.')}chunks.push(value)}}finally{reader.releaseLock()}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
  if(!size)throw new Error('Empty source image.');
  let type=(response.headers.get('content-type')||'image/jpeg').split(';')[0];if(!['image/png','image/jpeg','image/webp','image/gif','image/avif'].includes(type))type='image/jpeg';
  return {bytes,image:await toDataURL(bytes,type)};
 }finally{if(referrer)await chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:[RULE_ID]}).catch(()=>{})}
}
async function overlays(tabId,hide,selectors=[]){await chrome.scripting.executeScript({target:{tabId},func:async(hide,selectors)=>{
 if(hide){
  const elements=new Set(['ocrcompanion-local','ocrcompanion-capture-overlay','ocrcompanion-reader','ocrcompanion-area-selector','MigakuShadowDom'].map(id=>document.getElementById(id)).filter(Boolean));
  for(const selector of selectors)for(const e of document.querySelectorAll(selector))elements.add(e);
  globalThis.__ocrcompanionCaptureHidden=Array.from(elements,e=>({e,properties:['opacity','transition'].map(name=>({name,value:e.style.getPropertyValue(name),priority:e.style.getPropertyPriority(name)}))}));
  for(const {e} of globalThis.__ocrcompanionCaptureHidden){e.style.setProperty('transition','none','important');e.style.setProperty('opacity','0','important')}
  await new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;resolve()};requestAnimationFrame(()=>requestAnimationFrame(finish));setTimeout(finish,300)});
 }else{
  for(const {e,properties} of globalThis.__ocrcompanionCaptureHidden||[]){for(const {name,value,priority} of properties){if(value)e.style.setProperty(name,value,priority);else e.style.removeProperty(name)}}
  delete globalThis.__ocrcompanionCaptureHidden;
 }
},args:[hide,selectors]})}
async function screenshot(tab,adapter,expectedManual=false){
 await overlays(tab.id,true,adapter?.captureHideSelectors||[]);let image,rect,before;
 try{const [active]=await chrome.tabs.query({active:true,windowId:tab.windowId});if(active?.id!==tab.id)throw new Error('Keep the comic tab selected in its Chrome window, then try again.');before=await chrome.tabs.sendMessage(tab.id,{type:'view'});rect=await chrome.tabs.sendMessage(tab.id,{type:'geometry'});if(rect?.error)throw new Error(rect.error);if(expectedManual&&!rect?.manual)throw new Error('Selected area unavailable. Select it again.');image=await chrome.tabs.captureVisibleTab(tab.windowId,{format:'png'});const [after]=await chrome.tabs.query({active:true,windowId:tab.windowId});if(after?.id!==tab.id||(await chrome.tabs.get(tab.id)).url!==tab.url)throw new Error('The comic tab changed during capture. Try again.');const end=await chrome.tabs.sendMessage(tab.id,{type:'view'});if(before&&end&&!sameView(before,end))throw new Error('The reader moved or changed during capture. Keep it still and try again.');}finally{await overlays(tab.id,false).catch(()=>{})}
 if(rect?.manual&&(!before||![before.width,before.height,before.offsetLeft,before.offsetTop].every(Number.isFinite)))throw new Error('Selected-area geometry unavailable. No image was sent to OCR.');
 let bytes=decodeDataURL(image),capture=null;
 // Capture still works if bitmap cropping is unavailable, but no mapping is claimed.
 if(before){
  let bitmap;
  try{bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));}catch{if(rect?.manual)throw new Error('Cannot crop the selected area in this browser. No image was sent to OCR.');}
  if(bitmap){try{
   const full=captureTransform(before,null,bitmap.width,bitmap.height);
   capture=full;
   if(rect){const crop=captureTransform(before,rect,bitmap.width,bitmap.height);
    try{const canvas=new OffscreenCanvas(crop.pixelWidth,crop.pixelHeight);canvas.getContext('2d').drawImage(bitmap,crop.pixelLeft,crop.pixelTop,crop.pixelWidth,crop.pixelHeight,0,0,crop.pixelWidth,crop.pixelHeight);bytes=new Uint8Array(await (await canvas.convertToBlob({type:'image/png'})).arrayBuffer());image=await toDataURL(bytes);capture=crop;}catch(error){if(rect.manual)throw new Error('Selected-area capture failed. No image was sent to OCR.');/* Preserve full screenshot and its matching transform. */}
   }
  }finally{bitmap.close()}}
 }
 return {bytes,image,capture,manual:!!rect?.manual};
}
async function run(message,tabId){
 if(busy)throw new Error('OCR is already running. Please wait.');busy=true;
 try{
  const saved=await chrome.storage.local.get(['language','mode']);const settings={language:message.language??saved.language??'',mode:message.mode??saved.mode??'auto'};
  if(settings.language&&!LANGUAGES.has(settings.language))throw new Error('Unsupported OCR language.');if(!MODES.has(settings.mode))throw new Error('Unsupported read mode.');
  const info=await mount(tabId,settings);if(!/^https?:\/\//.test(info.tab.url||''))throw new Error('Open a normal comic website.');
  const area=await chrome.tabs.sendMessage(tabId,{type:'areaState'});if(area?.selecting)throw new Error('Finish or cancel area selection first.');if(area?.invalidated)throw new Error('Selected area expired after zoom or resize. Select again or clear it.');if(area?.active)settings.mode='capture';
  await status(tabId,'Checking local helper…',true);await helper('/health');
  let input,data,sourceView=null,method='source page',fallback=false;
  if(settings.mode!=='capture'){
   try{
    await status(tabId,'Reading the full source page…',true);
    sourceView=await chrome.tabs.sendMessage(tabId,{type:'view'});
    const source=await chrome.tabs.sendMessage(tabId,{type:'source'});if(source?.error)throw new Error(source.error);
    input=source.dataUrl?{bytes:decodeDataURL(source.dataUrl),image:source.dataUrl}:await download(source.src,info.adapter,info.tab.url);
    data=await helper('/ocr/'+info.language,input.bytes);if(!Array.isArray(data.lines))throw new Error('Invalid OCR response.');
    if(!data.lines.length&&settings.mode==='auto')throw new Error('No source text recognized.');
   }catch(e){if(settings.mode==='source')throw e;fallback=true;input=null;data=null}
  }
  if(!data){await status(tabId,'Capturing the visible comic area…',true);input=await screenshot(info.tab,info.adapter,!!area?.active);method=input.manual?'selected area':'visible area';await status(tabId,'Recognizing with Apple Live Text…',true);data=await helper('/ocr/'+info.language,input.bytes);if(!Array.isArray(data.lines))throw new Error('Invalid OCR response.')}
  if((await chrome.tabs.get(tabId)).url!==info.tab.url)throw new Error('The comic tab changed while recognizing. Read again.');
  const expectedView=input.capture?.view||sourceView;
  if(expectedView&&!sameView(expectedView,await chrome.tabs.sendMessage(tabId,{type:'view'})))throw new Error('The reader moved or changed while recognizing. Read again.');
  await chrome.tabs.sendMessage(tabId,{type:'result',data,method,image:input.image,capture:input.capture||null,fallback});return {ok:true,lines:data.lines.length,method};
 }catch(e){await status(tabId,e.message,false);throw e}finally{busy=false;await chrome.tabs.sendMessage(tabId,{type:'statusDone'}).catch(()=>{})}
}
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 if(sender.id!==chrome.runtime.id)return;
 const fromPage=!!sender.tab&&!sender.url?.startsWith(chrome.runtime.getURL('')); 
 const tabId=fromPage?sender.tab.id:message.tabId;
 if(!['read','open','settings','health','preferences'].includes(message.type))return;
 if(fromPage&&!/^https?:\/\//.test(sender.url||'')){reply({ok:false,error:'Invalid page origin.'});return;}
 (async()=>{
  if(message.type==='preferences'){const preferences={};if(message.language!==undefined){if(message.language!==''&&!LANGUAGES.has(message.language))throw new Error('Unsupported language.');preferences.language=message.language}if(message.mode!==undefined){if(!MODES.has(message.mode))throw new Error('Unsupported mode.');preferences.mode=message.mode}await chrome.storage.local.set(preferences);return {ok:true}}
  if(message.type==='settings'){await chrome.runtime.openOptionsPage();return {ok:true}}
  if(message.type==='health'){if(fromPage)throw new Error('Open Helper settings to test configuration.');const health=await helper('/health');return {ok:true,health}}
  if(!Number.isInteger(tabId))throw new Error('No active comic tab.');
  if(message.type==='read')return run(message,tabId);
  const saved=await chrome.storage.local.get(['language','mode']);await mount(tabId,{language:message.language??saved.language,mode:message.mode??saved.mode});return {ok:true};
 })().then(reply,e=>reply({ok:false,error:e.message}));return true;
});

// One invocation opens the panel and performs one read; no intermediate popup.
chrome.action.onClicked.addListener(async tab=>{
 if(busy||!Number.isInteger(tab.id))return;
 await chrome.action.setBadgeText({tabId:tab.id,text:''});
 await chrome.action.setTitle({tabId:tab.id,title:'Read page with OCR Companion'});
 try{await run({},tab.id)}catch(e){
  await chrome.action.setBadgeText({tabId:tab.id,text:'!'}).catch(()=>{});
  await chrome.action.setTitle({tabId:tab.id,title:e.message}).catch(()=>{});
 }
});
