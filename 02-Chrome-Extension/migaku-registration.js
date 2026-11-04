(()=>{
 const ID='ocrcompanion-bilibili-migaku',ORIGIN='https://manga.bilibili.com/*';
 function start(api){
  if(!api.permissions||!api.scripting.getRegisteredContentScripts)return;
  let chain=Promise.resolve();
  async function apply(){
   const settings=await api.storage.local.get('bilibiliMigakuEnabled');
   const permitted=await api.permissions.contains({origins:[ORIGIN]});
   const registered=await api.scripting.getRegisteredContentScripts();
   // Remove obsolete registrations owned by this bootstrap after an update.
   const obsolete=registered.filter(s=>s.id!==ID&&s.js?.includes('migaku-compat.js'));
   if(obsolete.length)await api.scripting.unregisterContentScripts({ids:obsolete.map(s=>s.id)});
   const scripts=registered.filter(s=>s.id===ID);
   if(settings.bilibiliMigakuEnabled&&permitted){
    if(!scripts.length)await api.scripting.registerContentScripts([{id:ID,matches:[ORIGIN],js:['migaku-compat.js'],runAt:'document_start',persistAcrossSessions:true}]);
   }else if(scripts.length)await api.scripting.unregisterContentScripts({ids:[ID]});
  }
  const sync=()=>chain=chain.catch(()=>{}).then(apply).catch(error=>console.warn('OCRCompanion compatibility setup:',error.message));
  api.permissions.onAdded.addListener(sync);api.permissions.onRemoved.addListener(sync);
  api.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.bilibiliMigakuEnabled)sync()});
  sync();
 }
 globalThis.OCRCompanionMigakuRegistration={start};
})();
