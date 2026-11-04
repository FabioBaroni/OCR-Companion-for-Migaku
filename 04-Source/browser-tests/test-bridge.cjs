const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=(fs.readFileSync('extension/reader-core.js','utf8')+'\n'+fs.readFileSync('extension/background.js','utf8').replace(/^importScripts[^\n]*\n/,''));
function fixture(){let receive,disconnect,timer;let closed=0,sent;const chrome={runtime:{id:'test',getURL:p=>'chrome-extension://test/'+p,onMessage:{addListener(){}},connectNative:name=>{assert.equal(name,'local.ocrcompanion.reader');return {onMessage:{addListener:f=>receive=f},onDisconnect:{addListener:f=>disconnect=f},disconnect:()=>closed++,postMessage:p=>sent=p}}},storage:{local:{remove:async()=>{}}},action:{onClicked:{addListener(){}}}};
 const ctx=vm.createContext({chrome,Uint8Array,ArrayBuffer,atob,btoa,URL,setTimeout:f=>{timer=f;return 1},clearTimeout(){}});vm.runInContext(code,ctx);return {ctx,chrome,get closed(){return closed},get sent(){return sent},reply:x=>receive(x),drop:()=>disconnect(),timeout:()=>timer()}}
(async()=>{
 let f=fixture(),p=vm.runInContext("nativeRequest({v:1,action:'health'})",f.ctx);f.reply({ok:true});assert((await p).ok);assert.equal(f.closed,1);
 f=fixture();p=vm.runInContext("nativeRequest({v:1,action:'health'})",f.ctx);f.chrome.runtime.lastError={message:'host not found'};f.drop();await assert.rejects(()=>p,/Run OCR Companion for Migaku/);assert.equal(f.closed,1);
 f=fixture();p=vm.runInContext("nativeRequest({v:1,action:'health'})",f.ctx);f.timeout();await assert.rejects(()=>p,/timed out/);assert.equal(f.closed,1);
 f=fixture();p=vm.runInContext("helper('/ocr/ja-JP',new Uint8Array([1,2,3]))",f.ctx);assert.equal(f.sent.image,'AQID');assert.equal(f.sent.language,'ja-JP');assert.equal(f.sent.action,'ocr');f.reply({ok:true,lines:[]});await p;
 f=fixture();p=vm.runInContext("helper('/health')",f.ctx);f.reply({ok:true,supported:false});await assert.rejects(()=>p,/not supported/);
 console.log('PASS: native response, disconnect diagnostics, timeout cleanup, byte/language transfer, unsupported-Mac handling.');
})().catch(e=>{console.error(e);process.exitCode=1});
