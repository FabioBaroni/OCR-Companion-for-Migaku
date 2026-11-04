// Shared, dependency-free rules. Page geometry is in layout-viewport CSS pixels.
globalThis.OCRCompanionCore=(()=>{
 function matchAdapter(entries,url){
  const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return null;
  return entries.find(a=>a.hosts.includes(u.hostname)&&(a.pathPattern?new RegExp(a.pathPattern).test(u.pathname):u.pathname.startsWith(a.path))&&(!a.queryKeys||a.queryKeys.every(k=>/^\d+$/.test(u.searchParams.get(k)||''))))||null;
 }
 function languageFor(adapter,url){
  if(adapter?.name==='Webtoon')return new URL(url).pathname.startsWith('/zh-hant/')?'zh-Hant':adapter.language;
  return adapter?.language||'zh-Hans';
 }
 function sameView(a,b){
  if(!a||!b)return false;
  return ['scrollX','scrollY','width','height','offsetLeft','offsetTop','scale','revision','target'].every(k=>a[k]===b[k]);
 }
 function captureTransform(view,rect,pixelWidth,pixelHeight){
  if(!(view.width>0&&view.height>0&&pixelWidth>0&&pixelHeight>0))throw new Error('Invalid capture dimensions.');
  const sx=pixelWidth/view.width,sy=pixelHeight/view.height;
  let left=0,top=0,right=pixelWidth,bottom=pixelHeight;
  if(rect){
   left=Math.max(0,Math.floor((rect.left-view.offsetLeft)*sx));top=Math.max(0,Math.floor((rect.top-view.offsetTop)*sy));
   right=Math.min(pixelWidth,Math.ceil((rect.right-view.offsetLeft)*sx));bottom=Math.min(pixelHeight,Math.ceil((rect.bottom-view.offsetTop)*sy));
   if(!(right>left&&bottom>top))throw new Error('Comic is outside the visible viewport.');
  }
  return {pixelLeft:left,pixelTop:top,pixelWidth:right-left,pixelHeight:bottom-top,scaleX:sx,scaleY:sy,cssLeft:view.offsetLeft+left/sx,cssTop:view.offsetTop+top/sy,view};
 }
 // Future native boxes must explicitly use bottom-left normalized image coordinates.
 // This maps capture boxes, not full-source images or arbitrary CSS transforms.
 function mapBox(box,t){
  const {x,y,width,height}=box;
  if(![x,y,width,height].every(Number.isFinite)||x<0||y<0||width<=0||height<=0||x+width>1.000001||y+height>1.000001)throw new Error('Invalid OCR box.');
  return {left:t.cssLeft+x*t.pixelWidth/t.scaleX,top:t.cssTop+(1-y-height)*t.pixelHeight/t.scaleY,width:width*t.pixelWidth/t.scaleX,height:height*t.pixelHeight/t.scaleY};
 }
 // Union of visible comic surfaces in layout-viewport CSS pixels. This includes
 // both halves of a spread, but never expands a capture beyond the viewport.
 function visibleBounds(rects,v){
  const clips=rects.map(r=>({left:Math.max(v.offsetLeft,r.left),top:Math.max(v.offsetTop,r.top),right:Math.min(v.offsetLeft+v.width,r.right),bottom:Math.min(v.offsetTop+v.height,r.bottom)})).filter(r=>r.right>r.left&&r.bottom>r.top);
  if(!clips.length)return null;
  return {left:Math.min(...clips.map(r=>r.left)),top:Math.min(...clips.map(r=>r.top)),right:Math.max(...clips.map(r=>r.right)),bottom:Math.max(...clips.map(r=>r.bottom))};
 }
 function panelPlacement(saved,width,height){
  const number=(value,fallback)=>Number.isFinite(value)?value:fallback;
  const w=Math.max(0,Math.min(Math.max(280,number(saved.width,380)),width-32));
  return {width:w,left:Math.max(0,Math.min(number(saved.left,width-w-18),width-w-16)),top:Math.max(0,Math.min(number(saved.top,18),height-64))};
 }
 function areaViewport(v){return [v.width,v.height,v.offsetLeft,v.offsetTop,v.scale].join(':')}
 function selectionRect(start,end,v){
  if(![start.x,start.y,end.x,end.y].every(Number.isFinite))throw new Error('Invalid selection.');
  const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
  const left=clamp(Math.min(start.x,end.x),v.offsetLeft,v.offsetLeft+v.width),right=clamp(Math.max(start.x,end.x),v.offsetLeft,v.offsetLeft+v.width);
  const top=clamp(Math.min(start.y,end.y),v.offsetTop,v.offsetTop+v.height),bottom=clamp(Math.max(start.y,end.y),v.offsetTop,v.offsetTop+v.height);
  if(right-left<16||bottom-top<16)throw new Error('Drag an area at least 16 pixels wide and high.');
  return {left,top,right,bottom};
 }
 return {matchAdapter,languageFor,sameView,captureTransform,mapBox,visibleBounds,panelPlacement,areaViewport,selectionRect};
})();
