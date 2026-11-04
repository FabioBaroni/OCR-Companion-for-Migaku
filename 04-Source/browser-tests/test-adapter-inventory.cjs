const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const adapters=JSON.parse(fs.readFileSync('extension/adapters.json'));
const ctx=vm.createContext({URL});vm.runInContext(fs.readFileSync('extension/reader-core.js','utf8'),ctx);
const core=ctx.OCRCompanionCore;
const paths={'Kuaikan':'/webs/comic-next/682699','Webtoon':'/en/fantasy/sample/viewer?title_no=1&episode_no=1','QQ Comics':'/ComicView/index/id/644371/cid/2','Baozi':'/comic/chapter/test/0_0.html','Mangaben':'/m12345/','Bilibili Manga':'/mc29481/553156','Creative Comic':'/reader/sample','GlobalComix':'/read/sample/1','Manhuahao':'/read/sample','36mh':'/manhua/sample/1.html','Dumanwu':'/chapter/sample','Dongman Manhua':'/viewer?title_no=1&episode_no=1','Shonen Jump+':'/episode/123','Tonari no Young Jump':'/episode/123','Comic Days':'/episode/123','Naver Webtoon':'/webtoon/detail?titleId=1&no=2','Sunday Webry':'/episode/123','Comic Gardo':'/episode/123','Kurage Bunch':'/episode/123','Comic Action':'/episode/123','Magapoke':'/title/12/episode/34','Kadocomi':'/detail/KC_020122_S/episodes/KC_0201220000200011_E'};
assert.equal(adapters.length,22);assert.equal(new Set(adapters.map(a=>a.name)).size,22);assert.equal(Object.keys(paths).length,adapters.length);
let urls=0;
for(const adapter of adapters){
 assert(adapter.selector&&adapter.hosts.length);assert(!('nextSelector' in adapter),'No legacy JavaScript-link navigation hook: '+adapter.name);assert(['zh-Hans','zh-Hant','ja-JP','ko-KR','en-US'].includes(adapter.language));
 if(adapter.captureOnly){if(adapter.name!=='Mangaben')assert.equal(adapter.imageHosts.length,0,adapter.name+' should not require CDN access');assert(['canvas','renderedImage'].includes(adapter.kind))}
 for(const host of adapter.hosts){
  const url='https://'+host+paths[adapter.name];assert.equal(core.matchAdapter(adapters,url)?.name,adapter.name,url);urls++;
  assert.equal(core.matchAdapter(adapters,'https://'+host+'.evil.example'+paths[adapter.name]),null);
  assert.equal(core.matchAdapter(adapters,'https://evil.example/'+host+paths[adapter.name]),null);
  assert.equal(core.matchAdapter(adapters,'file://'+host+paths[adapter.name]),null);
 }
}
for(const url of ['https://comic.naver.com/webtoon/detail?titleId=-1&no=2','https://comic.naver.com/webtoon/detail?titleId=1e2&no=2','https://comic.naver.com/webtoon/detail?titleId=1&no=0x10','https://pocket.shonenmagazine.com/title/x/episode/2','https://comic-walker.com/detail/KC_123_S/episodes/x','https://comic-action.com/episode/123/extra'])assert.equal(core.matchAdapter(adapters,url),null,url);
console.log('PASS: all 22 adapter configurations / '+urls+' hostname-route fixtures, lookalike domains, unsupported protocols, malformed routes and numeric query rules. URL matching is not live website verification.');
