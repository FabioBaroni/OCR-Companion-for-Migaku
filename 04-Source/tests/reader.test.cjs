const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../reader/reader.js'),'utf8');
function setup(hash,response){
 const elements=new Map();
 function el(){return {textContent:'',hidden:false,children:[],handlers:{},append(x){this.children.push(x)},replaceChildren(){this.children=[]},addEventListener(n,f){this.handlers[n]=f},setAttribute(){}}}
 for(const id of ['text','empty','clear','status','pause','sample','local-note','previous','latest','next','reader-title','capture-label'])elements.set('#'+id,el());
 let requested,historyPath,timer;
 const context={document:{querySelector:s=>elements.get(s),createElement:el,hidden:false},location:{hash},history:{replaceState(a,b,path){historyPath=path}},URLSearchParams,AbortSignal:{timeout:()=>({})},fetch:async(path,options)=>{requested={path,options};return response},setTimeout:f=>{timer=f},console};
 vm.runInNewContext(source,context);
 return {elements,context,get requested(){return requested},get historyPath(){return historyPath},get timer(){return timer}};
}
(async()=>{
 const key='a'.repeat(64),injection='<img src=x onerror=alert(1)>我';
 let payload={revision:1,textRevision:1,text:injection,status:'Ready',language:'zh-Hans'};
 const s=setup('#session='+key,{status:200,ok:true,json:async()=>payload});
 await new Promise(setImmediate);
 assert.equal(s.historyPath,'/');assert.equal(s.requested.path,'/state');
 assert.equal(s.requested.options.headers['X-OCRCompanion-Session'],key);
 assert.equal(s.elements.get('#text').children[0].textContent,injection);
 assert.equal(s.elements.get('#text').lang,'zh-Hans');
 const node=s.elements.get('#text').children[0];await s.timer();
 assert.equal(s.elements.get('#text').children[0],node,'Unchanged polls must preserve Migaku nodes');
 payload={...payload,revision:2,status:'Recognizing…'};await s.timer();
 assert.equal(s.elements.get('#text').children[0],node,'Status-only changes must preserve Migaku nodes');
 s.elements.get('#clear').handlers.click();assert.equal(s.elements.get('#text').hidden,true);
 await s.timer();assert.equal(s.elements.get('#text').hidden,true,'Cleared text must not return on unchanged poll');
 const paused=setup('#session='+key,{status:200,ok:true,json:async()=>({revision:2,textRevision:2,text:'新的句子',status:'Ready',language:'zh-Hans'})});
 paused.elements.get('#pause').handlers.click();await new Promise(setImmediate);
 assert.equal(paused.elements.get('#text').children.length,0);paused.elements.get('#pause').handlers.click();
 assert.equal(paused.elements.get('#text').children[0].textContent,'新的句子');
 const denied=setup('#session='+key,{status:403,ok:false});await new Promise(setImmediate);
 assert.match(denied.elements.get('#status').textContent,/Session expired/);assert.equal(denied.timer,undefined);
 const demo=setup('',null);assert.equal(demo.requested,undefined);demo.elements.get('#sample').handlers.click();assert.equal(demo.elements.get('#text').children.length,3);
 // History is local, preserves prior text, pauses browsing, and resumes latest safely.
 const hist=setup('#session='+key,{status:200,ok:true,json:async()=>payload});await new Promise(setImmediate);
 payload={revision:10,textRevision:10,text:'Second capture',status:'Ready',language:'en-US'};await hist.timer();
 hist.elements.get('#previous').handlers.click();assert.equal(hist.elements.get('#text').children[0].textContent,injection);
 payload={...payload,revision:11,status:'Recognizing…'};await hist.timer();
 hist.elements.get('#latest').handlers.click();assert.equal(hist.elements.get('#text').children[0].textContent,'Second capture');assert.equal(hist.elements.get('#status').textContent,'Recognizing…','Resuming latest must restore live status');
 hist.elements.get('#previous').handlers.click();hist.elements.get('#latest').handlers.click();assert.equal(hist.elements.get('#status').textContent,'Recognizing…','No-pending resume restores live status too');
 payload={revision:12,textRevision:12,text:'Third capture',status:'Ready',language:'en-US'};await hist.timer();
 hist.elements.get('#previous').handlers.click();hist.elements.get('#previous').handlers.click();assert.equal(hist.elements.get('#reader-title').textContent,'Earlier capture');
 hist.elements.get('#next').handlers.click();assert.equal(hist.elements.get('#text').children[0].textContent,'Second capture');
 hist.elements.get('#next').handlers.click();assert.equal(hist.elements.get('#text').children[0].textContent,'Third capture');assert.equal(hist.elements.get('#reader-title').textContent,'Latest capture');
 hist.elements.get('#clear').handlers.click();assert.equal(hist.elements.get('#capture-label').textContent,'No captures yet');
 console.log('Passed reader rendering, text injection safety, capability handling, unchanged-node preservation, clear, pause/resume, expired-session and demo checks');
})().catch(e=>{console.error(e);process.exitCode=1});
