// Bilibili's manga host is classified as a Bilibili video site by Migaku 1.32.
// Give the reader a local content root recognized by its page observer.
// No Migaku APIs, account data, storage or private messages are accessed.
(()=>{
 const HOST='manga.bilibili.com',ID='ocrcompanion-reading-root';
 function ensureRoot(){
  if(location.hostname!==HOST||!document.body)return null;
  let root=document.getElementById(ID);
  if(!root){root=document.createElement('div');root.id=ID;root.className='bili-feed4';root.style.display='contents';document.body.append(root)}
  return root;
 }
 globalThis.OCRCompanionMigakuCompat={ensureRoot};
 if(location.hostname===HOST){
  if(document.body)ensureRoot();
  else {
   const observer=new MutationObserver(()=>{if(document.body){ensureRoot();observer.disconnect()}});
   observer.observe(document,{childList:true,subtree:true});
   document.addEventListener('DOMContentLoaded',()=>{ensureRoot();observer.disconnect()},{once:true});
  }
 }
})();
