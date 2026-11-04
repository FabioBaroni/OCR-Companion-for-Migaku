const fs=require('fs'),vm=require('vm'),assert=require('assert');
function element(initial={}){const values=new Map(Object.entries(initial));return {style:{getPropertyValue:k=>values.get(k)?.[0]||'',getPropertyPriority:k=>values.get(k)?.[1]||'',setProperty:(k,v,p='')=>values.set(k,[v,p]),removeProperty:k=>values.delete(k)},values}}
const panel=element(),toolbar=element({opacity:['0.8','important'],transition:['opacity 1s','']}),comic=element(),migaku=element({opacity:['0.65',''],transition:['all .2s','important']});
const document={getElementById:id=>id==='ocrcompanion-reader'?panel:id==='MigakuShadowDom'?migaku:null,querySelectorAll:selector=>selector==='.manga-reader-ui'?[toolbar]:[]};
const chrome={storage:{local:{remove:async()=>{}}},action:{onClicked:{addListener(){}}},runtime:{onMessage:{addListener(){}}},scripting:{executeScript:async({func,args})=>func(...args)}};
const ctx=vm.createContext({chrome,document,requestAnimationFrame:cb=>cb(),setTimeout,clearTimeout,console});
vm.runInContext((fs.readFileSync('extension/reader-core.js','utf8')+'\n'+fs.readFileSync('extension/background.js','utf8').replace(/^importScripts[^\n]*\n/,'')),ctx);
(async()=>{
 await vm.runInContext("overlays(7,true,['.manga-reader-ui'])",ctx);
 assert.deepEqual(panel.values.get('opacity'),['0','important']);assert.deepEqual(toolbar.values.get('opacity'),['0','important']);assert(!comic.values.has('opacity'));assert.deepEqual(migaku.values.get('opacity'),['0','important']);
 await vm.runInContext('overlays(7,false)',ctx);
 assert(!panel.values.has('opacity'));assert.deepEqual(toolbar.values.get('opacity'),['0.8','important']);assert(!comic.values.has('opacity'));
 assert.deepEqual(toolbar.values.get('transition'),['opacity 1s','']);assert(!panel.values.has('transition'));assert.deepEqual(migaku.values.get('opacity'),['0.65','']);assert.deepEqual(migaku.values.get('transition'),['all .2s','important']);
 console.log('PASS: capture hides only selected controls; restores original CSS value and priority; leaves comic unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1});
