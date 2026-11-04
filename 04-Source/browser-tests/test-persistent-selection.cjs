const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.style={};this.hidden=false;this.attributes={};this.dataset={};this.isConnected=true;this.textContent=''}
 append(e){e.parent=this;this.children.push(e)}
 remove(){this.isConnected=false;if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}
 contains(e){return this===e||this.children.some(c=>c.contains(e))}
 replaceChildren(){this.children=[]}
 setAttribute(k,v){this.attributes[k]=v}
 matches(query){return !!this.protected||(this.tagName==='a'&&(query.split(',').includes('a')||query.includes('a[href]')&&this.attributes.href!==undefined))}
 getBoundingClientRect(){return {left:0,top:0,right:1000,bottom:600,width:1000,height:600,toJSON(){return this}}}
}
let comicNodes=[];
const events=new Map(),windowEvents=new Map(),requests=[];let receive;
const document={head:new Element('head'),body:new Element('body'),createElement:t=>new Element(t),getElementById(id){return walk(this.body).find(n=>n.id===id)||null},querySelectorAll:()=>comicNodes,addEventListener:(type,fn)=>{if(!events.has(type))events.set(type,new Set());events.get(type).add(fn)},removeEventListener:(type,fn)=>events.get(type)?.delete(fn)};
function walk(n){return [n,...n.children.flatMap(walk)]}
const window={addEventListener:(t,f)=>{if(!windowEvents.has(t))windowEvents.set(t,new Set());windowEvents.get(t).add(f)},removeEventListener:(t,f)=>{windowEvents.get(t)?.delete(f);if(!windowEvents.get(t)?.size)windowEvents.delete(t)},visualViewport:null};
const chrome={runtime:{id:'test',onMessage:{addListener:f=>receive=f,removeListener(){}},sendMessage:async m=>{requests.push(m);return {ok:true}}}};
const ctx=vm.createContext({getComputedStyle:e=>({display:e.hidden?'none':'block',visibility:'visible',opacity:'1'}),chrome,document,window,innerWidth:1000,innerHeight:600,scrollX:0,scrollY:0,URL,MutationObserver:class{observe(){}disconnect(){}},setTimeout,clearTimeout});
vm.runInContext(fs.readFileSync('extension/reader-core.js','utf8')+'\n'+fs.readFileSync('extension/content.js','utf8'),ctx);
function button(text){return walk(document.body).find(e=>e.tagName==='button'&&e.textContent===text)}
function emit(type,extra={}){const e={isTrusted:true,button:0,buttons:1,pointerType:'mouse',pointerId:1,clientX:100,clientY:100,composedPath:()=>[document.body],preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true},...extra};for(const fn of events.get(type)||[])fn(e);return e}
function drag(x,y,x2,y2){emit('pointerdown',{clientX:x,clientY:y});emit('pointermove',{clientX:x2,clientY:y2});emit('pointerup',{clientX:x2,clientY:y2})}
function message(type,payload={}){let result;receive({type,...payload},{id:'test'},v=>result=v);return result}
message('configure',{adapter:null,mode:'source',language:'zh-Hans'});button('Select area').onclick({isTrusted:true});assert(button('Stop selecting'));
emit('pointerdown');emit('pointerup');assert.equal(requests.length,0,'a simple click must not run OCR');
// Migaku annotates the viewer/body; those are content, not its own controls.
const annotatedBody=new Element('body');annotatedBody.attributes.class='migaku-sentence-group -mgk-active';
const annotatedViewer=new Element('section');annotatedViewer.attributes.class='migaku-sentence-group -mgk-parsed-group';
for(const n of [annotatedBody,annotatedViewer])n.matches=query=>query.includes('[class*="migaku" i]');
assert(emit('pointerdown',{composedPath:()=>[new Element('canvas'),annotatedViewer,annotatedBody]}).prevented,'Migaku-decorated ancestors must allow starting the selection before reader swipe handlers');emit('pointerup');
const migakuUI=new Element('div');migakuUI.matches=query=>query.includes('#MigakuShadowDom');
assert(!emit('pointerdown',{composedPath:()=>[migakuUI,annotatedBody]}).prevented,'actual Migaku UI must remain usable');
const readerAnchor=new Element('a');assert(emit('pointerdown',{composedPath:()=>[readerAnchor]}).prevented,'no-href reader navigation overlay must allow drag initiation');emit('pointerup');const realLink=new Element('a');realLink.setAttribute('href','/chapter');assert(!emit('pointerdown',{composedPath:()=>[realLink]}).prevented,'real navigation link remains clickable');
drag(100,100,300,200);assert.equal(requests.filter(r=>r.type==='read').length,1);assert.equal(message('geometry').left,100);assert.equal(requests.find(r=>r.type==='read').mode,'source','manual routing preserves selected reading preference');
drag(400,250,650,400);assert.equal(requests.filter(r=>r.type==='read').length,2,'second drag requires no selection-button click');assert.equal(message('geometry').left,400);assert(button('Stop selecting'));assert(emit('click',{clientX:650,clientY:400}).prevented,'drag release click is swallowed');
// Cancellation/alternate input must preserve the last completed area and never OCR accidentally.
for(const extra of [{ctrlKey:true},{metaKey:true},{altKey:true},{shiftKey:true},{pointerType:'touch'},{isTrusted:false},{button:2}]){
 assert(!emit('pointerdown',extra).prevented);assert.equal(message('areaState').selecting,false);
}
for(const cancel of ['pointercancel','blur','resize']){
 emit('pointerdown');emit('pointermove',{clientX:250,clientY:250});
 if(cancel==='pointercancel')emit(cancel);else for(const f of windowEvents.get(cancel)||[])f();
 assert.equal(message('areaState').selecting,false);assert.equal(message('geometry').left,400);assert.equal(requests.filter(r=>r.type==='read').length,2);
}
emit('pointerdown');emit('pointermove',{clientX:250,clientY:250});ctx.scrollY=50;emit('pointerup',{clientX:250,clientY:250});assert.equal(requests.filter(r=>r.type==='read').length,2,'scroll during drag cancels the pending read');ctx.scrollY=0;
ctx.innerWidth=900;assert.equal(message('areaState').invalidated,true,'resize invalidates a stored area');assert(message('geometry').error);ctx.innerWidth=1000;assert.equal(message('areaState').invalidated,false);
message('status',{text:'Recognizing',busy:true});assert(!emit('pointerdown').prevented,'busy reader must not start another gesture');message('statusDone');
for(const path of [[document.getElementById('ocrcompanion-reader')],[Object.assign(new Element('button'),{protected:true})],[Object.assign(new Element('migaku'),{protected:true})]])assert(!emit('pointerdown',{composedPath:()=>path}).prevented,'panel, reader controls and Migaku must bypass selection');
assert(!emit('pointerdown',{shiftKey:true}).prevented,'Shift lookup bypasses drag selection');
emit('pointerdown');emit('pointermove',{clientX:200,clientY:200});assert(!emit('wheel').prevented,'wheel scrolling must not be blocked');assert.equal(message('areaState').selecting,false);
emit('keydown',{key:'Escape'});assert(button('Select area'));assert.equal(message('areaState').active,true,'Escape retains the last crop');
drag(100,100,400,400);assert.equal(requests.filter(r=>r.type==='read').length,2,'Escape exits persistent selection');
message('configure',{adapter:null,mode:'capture',language:'zh-Hans'});button('Clear area').onclick({isTrusted:true});assert.equal(walk(document.body).find(e=>e.tagName==='select'&&e.title==='Read mode').value,'source','clear restores the prior mode');assert.equal(message('areaState').active,false);assert.equal(message('geometry'),null);
button('Select area').onclick({isTrusted:true});button('Stop selecting').onclick({isTrusted:true});drag(100,100,400,400);assert.equal(requests.filter(r=>r.type==='read').length,2);
// Capture-only adapters crop actual comic nodes rather than generic page UI.
const adapters=JSON.parse(fs.readFileSync('extension/adapters.json'));
for(const name of ['Sunday Webry','Comic Gardo','Kurage Bunch','Comic Action','Magapoke','Kadocomi']){
 const adapter=adapters.find(a=>a.name===name);
 const make=(left,top,right,bottom)=>{const e=new Element('canvas');e.width=1125;e.height=1600;e.getBoundingClientRect=()=>({left,top,right,bottom,width:right-left,height:bottom-top,toJSON(){return {left,top,right,bottom}}});return e};
 comicNodes=[make(1100,0,1500,600),make(100,-200,500,800),make(600,500,1000,1100)];
 message('configure',{adapter,mode:'auto',language:'ja-JP'});
 const crop=message('geometry');assert.equal(crop.left,100,name);assert.equal(crop.top,0,name);assert.equal(crop.right,1000,name);assert.equal(crop.bottom,600,name);
 assert(button('Use reader page controls').disabled,'horizontal reader navigation must not trigger generic page scrolling');
 const spreadBefore=message('view');comicNodes[2].width++;assert.notEqual(message('view').target,spreadBefore.target,'second visible canvas change invalidates the spread');
 const before=message('view');comicNodes=[make(200,0,600,600)];assert.notEqual(message('view').target,before.target,'page replacement invalidates capture target');
 comicNodes=[];assert.equal(message('geometry'),null,'missing comic does not invent crop bounds');
}
for(const name of ['Mangaben','Creative Comic']){
 message('configure',{adapter:adapters.find(a=>a.name===name),mode:'auto',language:'zh-Hans'});
 assert.equal(button('Use reader page controls').disabled,true,name+' must not advertise unreliable script navigation');
 assert.equal(button('Read page').disabled,false,name+' reading remains available');
 button('Use reader page controls').onclick({isTrusted:true}); // handler also refuses forced invocation
}
// A legacy/malicious navigation selector cannot cause javascript: execution.
let navigationClicks=0,scrollCalls=0;
document.querySelector=()=>({click(){navigationClicks++}});window.scrollBy=()=>{scrollCalls++};
message('configure',{adapter:{selector:'img',imageHosts:[],nextSelector:'a[href="javascript:pageNext();"]'},mode:'auto',language:'zh-Hans'});
button('Next page ↓').onclick({isTrusted:true});assert.equal(navigationClicks,0,'Never click a page JavaScript URL from content script');assert.equal(scrollCalls,1,'Safe generic scrolling remains available');
// Controls stay compact, result nodes survive progress/errors, and retry is offered.
assert.equal(walk(document.body).find(e=>e===button('Capture visible area').parent).parent.tagName,'details');
message('result',{data:{lines:[{text:'保留这句话'}],seconds:.2},method:'visible area',image:null});
const recognized=walk(document.body).find(e=>e.tagName==='p'&&e.textContent==='保留这句话');
message('status',{text:'Recognizing…',busy:true});assert(recognized.isConnected);assert(button('Retry').hidden);
message('status',{text:'Helper unavailable',busy:false});message('statusDone');assert(recognized.isConnected);assert.equal(button('Retry').hidden,false);
message('result',{data:{lines:[],seconds:.1},method:'visible area',image:null});assert(button('Retry').hidden);
assert(document.head.children.some(e=>e.textContent.includes('[hidden]{display:none!important}')),'panel hidden state is protected from site CSS');ctx.__ocrcompanionReader.destroy();assert.equal(document.head.children.length,0,'scoped stylesheet cleaned up');assert([...events.values()].every(set=>set.size===0),'all document listeners cleaned up');assert.equal(windowEvents.size,0);
console.log('PASS: two consecutive drag reads, no OCR on click, panel/control/Migaku/Shift bypass, scrolling, Escape/pause/clear behavior and listener cleanup.');
