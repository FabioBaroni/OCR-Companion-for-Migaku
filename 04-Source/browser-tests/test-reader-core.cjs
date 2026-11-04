const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({URL});vm.runInContext(fs.readFileSync('extension/reader-core.js','utf8'),ctx);
const core=ctx.OCRCompanionCore,adapters=JSON.parse(fs.readFileSync('extension/adapters.json'));
for(const [url,name] of [
 ['https://shonenjumpplus.com/episode/10834108156648240735','Shonen Jump+'],
 ['https://tonarinoyj.jp/episode/12207421984439043089?foo=1','Tonari no Young Jump'],
 ['https://comic-days.com/episode/12207421984407384715','Comic Days'],
 ['https://comic.naver.com/webtoon/detail?titleId=20853&no=1&week=finish','Naver Webtoon'],
 ['https://manga.bilibili.com/mc29481/553156','Bilibili Manga'],
 ['https://www.kuaikanmanhua.com/webs/comic-next/682699','Kuaikan'],
 ['https://www.twbzmg.com/comic/chapter/foo/0_0.html','Baozi']
])assert.equal(core.matchAdapter(adapters,url)?.name,name,url);
// New capture-only adapters: exact routes, no new source-host access.
for(const [host,path,name] of [
 ['www.sunday-webry.com','/episode/12207421984467638420','Sunday Webry'],
 ['comic-gardo.com','/episode/12207421983834473688','Comic Gardo'],
 ['kuragebunch.com','/episode/10834108156628843112','Kurage Bunch'],
 ['comic-action.com','/episode/4855956445111972974','Comic Action'],
 ['pocket.shonenmagazine.com','/title/02221/episode/441664','Magapoke'],
 ['comic-walker.com','/detail/KC_020122_S/episodes/KC_0201220000200011_E','Kadocomi']
]){
 const adapter=core.matchAdapter(adapters,'https://'+host+path+'?episodeType=latest');
 assert.equal(adapter?.name,name);assert.equal(adapter.captureOnly,true);assert.equal(adapter.manualNavigation,true);assert.equal(adapter.kind,'canvas');assert.equal(adapter.language,'ja-JP');assert.deepEqual(adapter.imageHosts,[]);
 for(const bad of ['https://'+host+'.evil.test'+path,'https://'+host+path+'/extra','https://'+host+'/search'])assert.equal(core.matchAdapter(adapters,bad),null,bad);
}
for(const url of ['https://pocket.shonenmagazine.com/title/1/episode/no','https://comic-walker.com/detail/foo/episodes/bar'])assert.equal(core.matchAdapter(adapters,url),null,url);
for(const url of ['https://shonenjumpplus.com/episode/123/extra','https://shonenjumpplus.com/episode/not-an-id','https://shonenjumpplus.com.evil.test/episode/123','https://comic-days.com/series/123','https://comic.naver.com/webtoon/list?titleId=1&no=1','https://comic.naver.com/webtoon/detail?titleId=1','https://comic.naver.com/webtoon/detail?titleId=x&no=1','file:///episode/123'])assert.equal(core.matchAdapter(adapters,url),null,url);
assert.equal(core.languageFor(core.matchAdapter(adapters,'https://comic.naver.com/webtoon/detail?titleId=1&no=2'),'https://comic.naver.com/webtoon/detail?titleId=1&no=2'),'ko-KR');
assert.equal(core.languageFor({name:'Webtoon',language:'en-US'},'https://www.webtoons.com/zh-hant/a'),'zh-Hant');
const view={width:1000,height:600,offsetLeft:0,offsetTop:0,scrollX:0,scrollY:900,scale:1,revision:1,target:'page'};
for(const scale of [1,1.25,2,3]){
 const t=core.captureTransform(view,{left:100,top:50,right:900,bottom:550},1000*scale,600*scale);
 const b=core.mapBox({x:.25,y:.5,width:.5,height:.25},t);
 assert(Math.abs(b.left-300)<=1/scale);assert(Math.abs(b.top-175)<=1/scale);assert(Math.abs(b.width-400)<=2/scale);assert(Math.abs(b.height-125)<=2/scale);
 assert(Math.abs(core.mapBox({x:0,y:0,width:1,height:1},t).top-50)<=1/scale);
}
const zoom={...view,width:500,height:300,offsetLeft:120,offsetTop:80,scale:2};
const t=core.captureTransform(zoom,{left:170,top:100,right:570,bottom:350},2000,1200);
assert.equal(t.cssLeft,170);assert.equal(t.cssTop,100);assert.equal(t.pixelWidth,1600);
assert.equal(core.mapBox({x:0,y:0,width:1,height:1},t).height,250);
assert(core.sameView(view,{...view}));for(const key of ['scrollY','scrollX','scale','width','height','offsetLeft','offsetTop','revision','target'])assert(!core.sameView(view,{...view,[key]:'changed'}));
assert.throws(()=>core.mapBox({x:0,y:0,width:2,height:1},t));
assert.throws(()=>core.captureTransform(view,{left:1100,top:0,right:1200,bottom:200},1000,600));
const previous=JSON.parse(fs.readFileSync('browser-tests/fixtures/prior-results.json'));
for(const test of previous.tests.filter(t=>t.result==='pass'))assert(core.matchAdapter(adapters,test.chapter_url),test.site+' regression URL');
const manifest=JSON.parse(fs.readFileSync('extension/manifest.json'));
assert(!manifest.host_permissions.some(h=>/shonenjumpplus|tonarinoyj|comic-days|comic.naver|sunday-webry|comic-gardo|kuragebunch|comic-action|shonenmagazine|comic-walker/.test(h)));
console.log('PASS: exact new reader URLs, negative matching, language defaults, capture coordinates at 1×/1.25×/2×/3×, visual viewport offsets, invalid boxes, scroll/zoom/DOM invalidation; no new host permissions.');

for(const name of ['Mangaben','Creative Comic'])assert.equal(adapters.find(a=>a.name===name).manualNavigation,true,'Do not imply reliable scripted page turns on '+name);
