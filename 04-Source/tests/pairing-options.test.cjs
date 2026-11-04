const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../extension/options.js'),'utf8');
function fixture(){const nodes=new Map(),timers=[];let result={ok:false,error:'not found'};const id='b'.repeat(32);const events={};
 const ctx={document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{});return nodes.get(id)}},window:{addEventListener:(n,f)=>events[n]=f},chrome:{runtime:{id,sendMessage:async()=>result},storage:{local:{get:async()=>({}),set:async()=>{}}},permissions:{}},navigator:{clipboard:{writeText:async()=>{}}},encodeURIComponent,Date,setTimeout:f=>{timers.push(f);return timers.length},clearTimeout:()=>{}};
 vm.runInNewContext(code,ctx);return {nodes,timers,events,setResult:r=>result=r,id};}
(async()=>{
 const f=fixture(),connect=f.nodes.get('connect-app'),status=f.nodes.get('status');assert.equal(connect.href,'ocrcompanion://connect?extension_id='+f.id);
 connect.onclick();assert.match(status.textContent,/Approve/);assert.equal(f.timers.length,1);
 await f.timers.shift()();assert.match(status.textContent,/Approve/);
 f.setResult({ok:true,health:{version:'1.1.1'}});await f.timers.shift()();assert.match(status.textContent,/Connected to Apple Live Text/);assert.equal(connect.hidden,true);assert.match(f.nodes.get('connection-indicator').className,/connected$/);
 const g=fixture();g.nodes.get('connect-app').onclick();g.events.pagehide();g.setResult({ok:true,health:{version:'1.1.1'}});await g.timers.shift()();assert(!g.nodes.get('status').textContent.startsWith('Connected'));
 const h=fixture();await new Promise(setImmediate);assert.match(h.nodes.get('connection-indicator').className,/disconnected$/);
 console.log('PASS: handoff uses runtime extension ID; polling recovers after native registration; page exit cancels stale checks.');
})().catch(e=>{console.error(e);process.exitCode=1});
