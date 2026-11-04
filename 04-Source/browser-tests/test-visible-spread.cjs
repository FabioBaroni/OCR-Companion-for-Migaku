const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({URL});vm.runInContext(fs.readFileSync('extension/reader-core.js','utf8'),ctx);const c=ctx.OCRCompanionCore;
const v={offsetLeft:20,offsetTop:10,width:1000,height:600};
const left={left:-100,top:-40,right:500,bottom:900},right={left:510,top:-40,right:1120,bottom:900},off={left:1200,top:20,right:1800,bottom:500};
const r=c.visibleBounds([left,right,off],v);assert.deepEqual(JSON.parse(JSON.stringify(r)),{left:20,top:10,right:1020,bottom:610});
assert.equal(c.visibleBounds([off],v),null);assert.equal(c.visibleBounds([],v),null);
const single=c.visibleBounds([right],v);assert.equal(single.left,510);assert.equal(single.right,1020);
for(const dpi of [1,1.25,2,3]){
 const t=c.captureTransform(v,r,1000*dpi,600*dpi);assert.equal(t.pixelWidth,1000*dpi);assert.equal(t.pixelHeight,600*dpi);
 const b=c.mapBox({x:.5,y:0,width:.5,height:1},t);assert.equal(b.left,520);assert.equal(b.top,10);assert.equal(b.width,500);
}
assert.equal(c.sameView({target:'left,right'}, {target:'left,changed-right'}),false);
console.log('PASS: visible spread union clips to viewport; offscreen/single/empty surfaces; fractional/high-DPI mapping and changed-spread rejection.');

for(const [w,h] of [[1280,720],[320,240],[200,100]]){const p=c.panelPlacement({left:5000,top:5000,width:800},w,h);assert(p.left>=0&&p.top>=0);assert(p.left+p.width<=w);assert(p.top<=h-64);}
assert.equal(c.panelPlacement({width:NaN,left:Infinity,top:-20},1000,600).width,380);
