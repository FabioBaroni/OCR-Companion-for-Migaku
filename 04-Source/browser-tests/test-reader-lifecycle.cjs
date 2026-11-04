const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('extension/reader-core.js','utf8')+'\n'+fs.readFileSync('extension/background.js','utf8').replace(/^importScripts[^\n]*\n/,'');
const adapters=JSON.parse(fs.readFileSync('extension/adapters.json'));
function fixture(options={}){
 const events=[],payloads=[];let handler,hold,ocrCount=0;
 const state={url:options.url||'https://www.kuaikanmanhua.com/webs/comic-next/682699',view:{width:1000,height:600,offsetLeft:0,offsetTop:0,scrollX:0,scrollY:0,scale:1,revision:1,target:'page-1'}};
 const chrome={runtime:{id:'test',getURL:p=>'chrome-extension://test/'+p,onMessage:{addListener:f=>handler=f},connectNative(){let callback,disconnect;return {onMessage:{addListener:f=>callback=f},onDisconnect:{addListener:f=>disconnect=f},disconnect(){},postMessage(p){payloads.push(p);if(p.action==='health'){queueMicrotask(()=>callback({ok:true,supported:true}));return}ocrCount++;const deliver=()=>{options.onOCR?.(state);callback(options.response||{ok:true,lines:[{text:'dialogue'}],seconds:.1})};if(options.holdOCR)hold=deliver;else queueMicrotask(deliver)}}}},action:{onClicked:{addListener(){}},setBadgeText:async()=>{},setTitle:async()=>{}},storage:{local:{get:async()=>options.saved||{},set:async p=>events.push({type:'saved',p}),remove:async()=>{}}},scripting:{executeScript:async x=>events.push(x.args?.[0]===true?'hide':x.args?.[0]===false?'restore':'mount')},tabs:{get:async()=>({id:7,windowId:2,url:state.url}),query:async()=>[{id:7}],captureVisibleTab:async()=>{events.push('capture');return 'data:image/png;base64,AQID'},sendMessage:async(id,m)=>{events.push(m);switch(m.type){case 'view':return {...state.view};case 'areaState':return options.area||{};case 'geometry':return null;case 'source':return options.sourceError?{error:'source blocked'}:{dataUrl:'data:image/png;base64,AQID'};default:return {ok:true}}}},declarativeNetRequest:{updateSessionRules:async()=>{}}};
 const ctx=vm.createContext({chrome,fetch:async()=>({json:async()=>adapters}),URL,AbortSignal,Uint8Array,ArrayBuffer,Blob,atob,btoa,setTimeout,clearTimeout,queueMicrotask,createImageBitmap:async()=>({width:2000,height:1200,close(){}})});vm.runInContext(code,ctx);
 return {ctx,state,events,payloads,run:(m={})=>{ctx.request=m;return vm.runInContext('run(request,7)',ctx)},release:()=>hold(),get waiting(){return !!hold},send:(m,sender={id:'test',url:'https://comic.test',tab:{id:7}})=>new Promise(resolve=>{if(handler(m,sender,resolve)!==true)resolve(undefined)})};
}
(async()=>{
 let cases=0;
 for(const mode of ['capture','source'])for(const key of ['scrollY','scrollX','width','height','offsetLeft','offsetTop','scale','revision','target']){
  const f=fixture({onOCR:s=>s.view[key]=key==='target'?'page-2':s.view[key]+1});
  await assert.rejects(f.run({mode,language:'ja-JP'}),/moved or changed/,'stale '+mode+' '+key);assert(!f.events.some(e=>e.type==='result'));assert(f.events.some(e=>e.type==='statusDone'));cases++;
 }
 for(const mode of ['source','capture']){
  const f=fixture({onOCR:s=>s.url='https://www.kuaikanmanhua.com/webs/comic-next/new-chapter'});
  await assert.rejects(f.run({mode}),/changed/,'chapter URL change during '+mode);assert(!f.events.some(e=>e.type==='result'));cases++;
 }
 for(const [saved,message,expected] of [[{language:'ko-KR'}, {},'ko-KR'],[{language:'ko-KR'},{language:'ja-JP'},'ja-JP'],[{}, {language:'zh-Hant'},'zh-Hant'],[{}, {language:'en-US'},'en-US'],[{}, {language:'it-IT'},'it-IT']]){
  const f=fixture({saved});await f.run({mode:'source',...message});assert.equal(f.payloads.find(p=>p.action==='ocr').language,expected);cases++;
 }
 for(const [url,expected] of [['https://www.webtoons.com/zh-hant/a','zh-Hant'],['https://comic-action.com/episode/123','ja-JP'],['https://comic.naver.com/webtoon/detail?titleId=1&no=1','ko-KR']]){
  const f=fixture({url});await f.run({mode:'capture'});assert.equal(f.payloads.find(p=>p.action==='ocr').language,expected);cases++;
 }
 for(const request of [{mode:'invalid'},{language:'xx-XX'}]){const f=fixture();await assert.rejects(f.run(request),/Unsupported/);assert.equal(f.payloads.length,0);cases++}
 for(const area of [{selecting:true},{invalidated:true}]){const f=fixture({area});await assert.rejects(f.run(),/selection|expired/);assert.equal(f.payloads.length,0);cases++}
 {const f=fixture({holdOCR:true});const first=f.run({mode:'capture'});for(let i=0;i<300&&!f.waiting;i++)await Promise.resolve();assert(f.waiting);await assert.rejects(f.run(),/already running/);f.release();await first;f.release();assert.equal(f.events.filter(e=>e.type==='result').length,1);cases++}
 {const f=fixture({sourceError:true});await assert.rejects(f.run({mode:'source'}),/source blocked/);await f.run({mode:'capture'});assert.equal(f.events.filter(e=>e.type==='result').length,1,'failed read releases busy lock');cases++}
 {const f=fixture({response:{ok:true,lines:[],seconds:.1}});const r=await f.run({mode:'auto'});assert.equal(r.lines,0);assert.equal(f.payloads.filter(p=>p.action==='ocr').length,2,'empty source uses exactly one screenshot fallback');cases++}
 {const f=fixture({response:{ok:true,lines:'malformed'}});await assert.rejects(f.run({mode:'capture'}),/Invalid OCR response/);assert(!f.events.some(e=>e.type==='result'));cases++}
 {const f=fixture();assert.equal(await f.send({type:'read'},{id:'other'}),undefined);assert.equal((await f.send({type:'read'},{id:'test',url:'file:///x',tab:{id:7}})).ok,false);assert.equal((await f.send({type:'health'})).ok,false);assert.equal((await f.send({type:'preferences',language:'bad'})).ok,false);assert(!f.events.some(e=>e.type==='saved'));cases+=4}
 console.log('PASS: '+cases+' reader lifecycle cases (stale source/capture, chapter URL, preferences, concurrency/recovery, empty/malformed OCR and message origin guards).');
})().catch(e=>{console.error(e);process.exitCode=1});
