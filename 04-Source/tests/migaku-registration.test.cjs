const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../extension/migaku-registration.js'),'utf8');
const flush=async()=>{await new Promise(setImmediate);await new Promise(setImmediate)};
function fixture(enabled,permitted,initial=[]){
 let scripts=initial;const listeners={},calls=[];const state={enabled,permitted};
 const api={storage:{local:{get:async()=>({bilibiliMigakuEnabled:state.enabled})},onChanged:{addListener:f=>listeners.change=f}},permissions:{contains:async()=>state.permitted,onAdded:{addListener:f=>listeners.add=f},onRemoved:{addListener:f=>listeners.remove=f}},scripting:{getRegisteredContentScripts:async()=>scripts,registerContentScripts:async values=>{scripts.push(...values);calls.push('register')},unregisterContentScripts:async({ids})=>{scripts=scripts.filter(s=>!ids.includes(s.id));calls.push('unregister')}}};
 const ctx={console};vm.runInNewContext(source,ctx);ctx.OCRCompanionMigakuRegistration.start(api);
 return {state,listeners,calls,get scripts(){return scripts}};
}
(async()=>{
 for(const [enabled,permitted] of [[false,false],[false,true],[true,false]]){const f=fixture(enabled,permitted);await flush();assert.equal(f.scripts.length,0)}
 const f=fixture(true,true);await flush();assert.equal(f.scripts.length,1);
 assert.equal(f.scripts[0].runAt,'document_start');assert.equal(f.scripts[0].matches[0],'https://manga.bilibili.com/*');assert.equal(f.scripts[0].persistAcrossSessions,true);
 f.listeners.add();f.listeners.add();await flush();assert.equal(f.calls.filter(c=>c==='register').length,1);
 f.state.permitted=false;f.listeners.remove();await flush();assert.equal(f.scripts.length,0);
 f.state.permitted=true;f.listeners.add();await flush();assert.equal(f.scripts.length,1);
 f.state.enabled=false;f.listeners.change({bilibiliMigakuEnabled:{}},'local');await flush();assert.equal(f.scripts.length,0);
 const migrated=fixture(true,true,[{id:'previous-beta-bootstrap',js:['migaku-compat.js']},{id:'unrelated',js:['other.js']}]);await flush();assert(!migrated.scripts.some(s=>s.id==='previous-beta-bootstrap'));assert(migrated.scripts.some(s=>s.id==='unrelated'));assert(migrated.scripts.some(s=>s.id==='ocrcompanion-bilibili-migaku'));
 const ctx={console};vm.runInNewContext(source,ctx);ctx.OCRCompanionMigakuRegistration.start({});
 console.log('PASS: optional access never requested implicitly; early registration, repeated events, revocation, disable and re-enable lifecycle');
})().catch(e=>{console.error(e);process.exitCode=1});
