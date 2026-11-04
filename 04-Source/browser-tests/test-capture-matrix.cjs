const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('extension/reader-core.js','utf8')+'\n'+fs.readFileSync('extension/background.js','utf8').replace(/^importScripts[^\n]*\n/,'');
async function fixture(o={}){
 const v={width:1000,height:600,offsetLeft:0,offsetTop:0,scrollX:0,scrollY:900,scale:1,revision:1,target:'page',...o.view},events=[],draws=[];let captured=false;
 const rect=o.rect===undefined?{left:100,top:50,right:900,bottom:550,manual:!!o.manual}:o.rect;
 const chrome={runtime:{onMessage:{addListener(){}}},action:{onClicked:{addListener(){}}},storage:{local:{remove:async()=>{}}},scripting:{executeScript:async x=>events.push(x.args[0]?'hide':'restore')},tabs:{query:async()=>[{id:captured&&o.tabChange?2:1}],get:async()=>({url:captured&&o.urlChange?'https://test/new':'https://test/chapter'}),captureVisibleTab:async()=>{events.push('capture');if(o.captureError)throw Error('Chrome capture failed');captured=true;return 'data:image/png;base64,AQID'},sendMessage:async(id,m)=>m.type==='geometry'?rect:{...v,...(captured?o.change||{}:{})}}};
 class Canvas{constructor(w,h){this.width=w;this.height=h;events.push(['canvas',w,h])}getContext(){return o.noContext?null:{drawImage(...a){draws.push(a.slice(1))}}}async convertToBlob(){if(o.encodeError)throw Error('encode failed');return new Blob([new Uint8Array([4,5,6])])}}
 const ctx=vm.createContext({chrome,URL,Uint8Array,ArrayBuffer,Blob,atob,btoa,setTimeout,clearTimeout,OffscreenCanvas:Canvas,createImageBitmap:async()=>{if(o.decodeError)throw Error('decode failed');return {width:o.pw||2000,height:o.ph||1200,close(){events.push('closed')}}}});vm.runInContext(code,ctx);
 try{return {result:await vm.runInContext(`screenshot({id:1,windowId:2,url:'https://test/chapter'},null,${!!o.expectedManual})`,ctx),events,draws}}catch(error){return {error,events,draws}}
}
(async()=>{
 let count=0;
 for(const ratio of [1,1.1,1.25,1.5,2,2.2,3])for(const manual of [false,true]){
  const r=await fixture({pw:1000*ratio,ph:600*ratio,manual});assert(!r.error);assert.equal(r.result.capture.pixelWidth,Math.ceil(900*ratio)-Math.floor(100*ratio));assert.equal(r.result.capture.pixelHeight,Math.ceil(550*ratio)-Math.floor(50*ratio));assert.deepEqual(r.draws[0].slice(4),[0,0,r.result.capture.pixelWidth,r.result.capture.pixelHeight]);assert.equal(Buffer.from(r.result.bytes).toString('hex'),'040506');assert(r.events.includes('closed'));assert.equal(r.events.filter(e=>e==='restore').length,1);count++;
 }
 for(const view of [{width:500,height:300,offsetLeft:120,offsetTop:80,scale:2},{width:1000,height:600,offsetLeft:0,offsetTop:0,scale:1}]){
  const r=await fixture({view,rect:{left:0,top:0,right:2000,bottom:1600,manual:true}});assert(!r.error);assert.equal(r.result.capture.pixelLeft,0);assert.equal(r.result.capture.pixelWidth,2000);assert.equal(r.result.capture.pixelHeight,1200);count++;
 }
 for(const key of ['scrollX','scrollY','width','height','offsetLeft','offsetTop','scale','revision','target']){
  const r=await fixture({change:{[key]:key==='target'?'new-page':9999}});assert.match(r.error.message,/moved or changed/);assert.equal(r.events.at(-1),'restore');assert.equal(r.draws.length,0);count++;
 }
 for(const o of [{tabChange:true},{urlChange:true},{captureError:true},{rect:{error:'selected area expired'}},{rect:{left:1100,top:0,right:1200,bottom:300,manual:true}},{expectedManual:true,rect:null}]){
  const r=await fixture(o);assert(r.error);assert.equal(r.events.filter(e=>e==='restore').length,1);count++;
 }
 for(const o of [{encodeError:true},{decodeError:true},{noContext:true}])for(const manual of [false,true]){
  const r=await fixture({...o,manual});if(manual)assert.match(r.error.message,/No image was sent/);else{assert(!r.error);assert.equal(Buffer.from(r.result.bytes).toString('hex'),'010203');if(r.result.capture)assert.equal(r.result.capture.pixelWidth,2000)}count++;
 }
 console.log('PASS: '+count+' capture matrix cases (7 bitmap scales, manual/automatic clipping, visual viewport, races, missing geometry, Chrome/decoder/encoder/context failures and restoration).');
})().catch(e=>{console.error(e);process.exitCode=1});
