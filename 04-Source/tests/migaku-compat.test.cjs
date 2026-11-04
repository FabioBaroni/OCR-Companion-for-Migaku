const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../extension/migaku-compat.js'),'utf8');
function fixture(host,body=true){
 const roots=new Map();let created=0;let observed=false;
 const parent=body?{append(node){roots.set(node.id,node)}}:null;
 const ctx={location:{hostname:host},MutationObserver:class{observe(){observed=true}disconnect(){}},document:{addEventListener(){},body:parent,getElementById:id=>roots.get(id),createElement:()=>{created++;return {style:{}}}}};
 vm.runInNewContext(source,ctx);return {ctx,roots,get created(){return created}};
}
for(const host of ['www.kuaikanmanhua.com','www.bilibili.com','manga.bilibili.com.evil.test','evil-manga.bilibili.com']){
 const f=fixture(host);assert.equal(f.ctx.OCRCompanionMigakuCompat.ensureRoot(),null);assert.equal(f.created,0);
}
const f=fixture('manga.bilibili.com');const root=f.ctx.OCRCompanionMigakuCompat.ensureRoot();
assert.equal(root.id,'ocrcompanion-reading-root');assert.equal(root.className,'bili-feed4');assert.equal(root.style.display,'contents');
assert.equal(f.ctx.OCRCompanionMigakuCompat.ensureRoot(),root);assert.equal(f.created,1);
assert.equal(fixture('manga.bilibili.com',false).ctx.OCRCompanionMigakuCompat.ensureRoot(),null);
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../extension/manifest.json'),'utf8'));
const stable=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/frozen-permissions.json'),'utf8'));
assert.deepEqual(manifest.host_permissions,stable.host_permissions);assert.deepEqual(manifest.permissions,stable.permissions);
console.log('PASS: exact-host isolation, deferred body, idempotent root, layout-neutral container and unchanged privileges');

assert.deepEqual(manifest.optional_host_permissions,['https://manga.bilibili.com/*']);
