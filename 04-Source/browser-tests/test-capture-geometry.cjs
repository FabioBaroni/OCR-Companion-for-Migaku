const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('extension/reader-core.js','utf8')+'\n'+fs.readFileSync('extension/background.js','utf8').replace(/^importScripts[^\n]*\n/,'');
async function capture({move=false,cropFails=false,manual=false,decodeFails=false}={}){
 const view={width:1000,height:600,offsetLeft:0,offsetTop:0,scrollX:0,scrollY:800,scale:1,revision:1,target:'comic'},events=[];let views=0;
 const chrome={runtime:{onMessage:{addListener(){}}},action:{onClicked:{addListener(){}}},storage:{local:{remove:async()=>{}}},scripting:{executeScript:async({args})=>events.push(args[0]?'hide':'restore')},tabs:{query:async()=>[{id:1}],get:async()=>({url:'https://comic.test/page'}),captureVisibleTab:async()=>{events.push('capture');return 'data:image/png;base64,AQID'},sendMessage:async(id,m)=>m.type==='geometry'?{left:100,top:50,right:900,bottom:550,manual}:{...view,scrollY:move&&views++?801:800}}};
 class Canvas{constructor(w,h){this.width=w;this.height=h}getContext(){return {drawImage(){}}}async convertToBlob(){if(cropFails)throw Error('encoding failed');return new Blob([new Uint8Array([4,5,6])])}}
 const ctx=vm.createContext({chrome,URL,Uint8Array,ArrayBuffer,Blob,atob,btoa,setTimeout,clearTimeout,createImageBitmap:async()=>{if(decodeFails)throw Error('decode failed');return ({width:2000,height:1200,close(){events.push('closed')}})},OffscreenCanvas:Canvas});vm.runInContext(code,ctx);
 try{return {result:await vm.runInContext("screenshot({id:1,windowId:2,url:'https://comic.test/page'},null)",ctx),events}}catch(error){return {error,events}}
}
(async()=>{
 let r=await capture();assert(!r.error);assert.equal(r.result.capture.pixelWidth,1600);assert.equal(r.result.capture.cssLeft,100);assert.equal(r.result.capture.cssTop,50);assert.equal(Buffer.from(r.result.bytes).toString('hex'),'040506');assert(r.events.includes('closed'));
 r=await capture({cropFails:true});assert(!r.error);assert.equal(r.result.capture.pixelWidth,2000);assert.equal(r.result.capture.cssLeft,0);assert.equal(Buffer.from(r.result.bytes).toString('hex'),'010203','fallback must keep original bytes and full-image transform');
 r=await capture({manual:true,cropFails:true});assert.match(r.error.message,/No image was sent/);
 r=await capture({manual:true,decodeFails:true});assert.match(r.error.message,/No image was sent/);
 r=await capture({move:true});assert.match(r.error.message,/reader moved/);assert.equal(r.events.at(-1),'restore');
 console.log('PASS: Retina screenshot crop/bytes/transform agree, encoding failure preserves full-image transform, movement rejects capture and restores overlays.');
})().catch(e=>{console.error(e);process.exitCode=1});
