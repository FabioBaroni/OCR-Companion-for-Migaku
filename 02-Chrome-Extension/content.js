(()=>{
 const VERSION='1.6.9',ID='ocrcompanion-reader';
 if(globalThis.__ocrcompanionReader?.version===VERSION){globalThis.__ocrcompanionReader.show();return;}
 globalThis.__ocrcompanionReader?.destroy();
 document.getElementById(ID)?.remove();
 let adapter=null,busy=false,previewURL=null,revision=0,area=null,selectionUI=null,selectionMode=false;
 const changed=e=>{if(!panel.contains(e.target))revision++};
 document.addEventListener('scroll',changed,true);
 const nodeIDs=new WeakMap();let nextNodeID=0;
 const mutations=new MutationObserver(records=>{const img=visible();if(img&&records.some(r=>r.target===img))revision++});
 const panelStyle=document.createElement('style');panelStyle.textContent='#ocrcompanion-reader[hidden],#ocrcompanion-reader [hidden]{display:none!important}';document.head.append(panelStyle);
 const panel=document.createElement('section');panel.id=ID;
 panel.style.cssText='box-sizing:border-box;position:fixed;right:18px;bottom:18px;width:380px;min-width:min(280px,90vw);max-width:90vw;max-height:76vh;overflow:auto;resize:horizontal;background:#fff;color:#172531;border:2px solid #39889e;border-radius:12px;box-shadow:0 4px 28px #0005;padding:14px;z-index:2147483001;font:14px/1.5 system-ui;user-select:text;text-align:left';
 function el(tag,text,parent=panel){const e=document.createElement(tag);if(text)e.textContent=text;parent.append(e);return e}
 function button(label,parent){const e=el('button',label,parent);e.style.cssText='font:13px system-ui;padding:6px 9px;border:1px solid #afc7cf;background:#f3f8fa;color:#172531;border-radius:6px;cursor:pointer';return e}
 const header=el('div');header.style.cssText='display:flex;gap:8px;align-items:center;cursor:move';
 const title=el('strong','OCR Companion · Page reader',header);title.style.flex='1';title.title='Version '+VERSION;
 const collapse=button('−',header),close=button('Close',header);collapse.title='Collapse / expand';
 const body=el('div'),controls=el('div','',body);controls.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin:12px 0';
 const read=button('Read page',controls),capture=button('Capture visible area',controls),next=button('Next page ↓',controls);
 const selectArea=button('Select area',controls),clearArea=button('Clear area',controls);clearArea.hidden=true;
 const advanced=el('details','',body);const advancedSummary=el('summary','Options',advanced);advancedSummary.style.cssText='cursor:pointer;font-size:13px;margin:8px 0';const advancedControls=el('div','',advanced);advancedControls.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin:8px 0';advancedControls.append(capture);advancedControls.append(next);
 const areaNote=el('p','',body);areaNote.style.cssText='font-size:12px;color:#52616d';areaNote.hidden=true;
 const language=el('select','',advancedControls);language.title='OCR language — choose the same study language in Migaku';language.style.cssText='font:13px system-ui;padding:6px;max-width:100%';
 for(const [value,label] of [['zh-Hans','Simplified Chinese'],['zh-Hant','Traditional Chinese'],['ja-JP','Japanese'],['ko-KR','Korean'],['en-US','English'],['fr-FR','French'],['de-DE','German'],['es-ES','Spanish'],['it-IT','Italian'],['pt-BR','Portuguese']]){const o=el('option',label,language);o.value=value}
 const mode=el('select','',advancedControls);mode.title='Read mode';mode.style.cssText='font:13px system-ui;padding:6px';
 for(const [value,label] of [['auto','Automatic'],['source','Full source only'],['capture','Visible area only']]){const o=el('option',label,mode);o.value=value}
 const scope=el('p','Visible page content',body);scope.style.cssText='font-size:12px;font-weight:600;margin:8px 0';
 const status=el('p','Ready. Scroll to a comic page and click Read page.',body);status.setAttribute('role','status');status.style.cssText='font-size:12px;color:#52616d;overflow-wrap:anywhere';
 const text=globalThis.OCRCompanionMigakuCompat?.ensureRoot()||el('div','',body);if(text.parentNode!==body)body.append(text);text.style.cssText='font-size:23px;line-height:1.9;user-select:text;overflow-wrap:anywhere';
 const retry=button('Retry',body);retry.hidden=true;retry.onclick=e=>{if(e.isTrusted)sendRead(mode.value)};
 const footer=el('div','',body);footer.style.cssText='display:flex;gap:8px;margin:10px 0';const copy=button('Copy text',footer),settings=button('Connection settings…',advancedControls);
 const note=el('p','Choose the same language here and in Migaku. Enable Migaku Full power for automatic word markings; use Shift for lookup. OCR runs on your Mac.',body);note.style.cssText='font-size:11px;color:#65717b';
 const details=el('details','',advanced);el('summary','OCR image preview',details);const info=el('div','No image captured yet.',details);info.style.fontSize='11px';const image=el('img','',details);image.alt='Exact image sent to local OCR';image.style.cssText='display:block;max-width:100%;height:auto';
 document.body.append(panel);
 mutations.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src','class','width','height']});
 function candidates(){if(!adapter)return [];const seen=new Set();return Array.from(document.querySelectorAll(adapter.selector)).filter(img=>{const r=img.getBoundingClientRect();if(r.width<150||r.height<=0)return false;if(adapter.kind==='canvas')return img.width>=300&&img.height>=100;if(adapter.kind==='renderedImage')return img.naturalWidth>=300;try{const u=new URL(img.currentSrc||img.src);if(u.protocol!=='https:'||!adapter.imageHosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))||img.naturalWidth<300||seen.has(u.href))return false;seen.add(u.href);return true}catch{return false}})}
 function visible(){return candidates().map(img=>{const r=img.getBoundingClientRect();return {img,area:Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0))*Math.max(0,Math.min(r.right,innerWidth)-Math.max(r.left,0))}}).sort((a,b)=>b.area-a.area).find(x=>x.area>0)?.img}
 function captureSurfaces(){return adapter?.captureOnly&&adapter?.kind==='canvas'?candidates().filter(img=>{const s=getComputedStyle(img);return s.display!=='none'&&s.visibility!=='hidden'&&s.visibility!=='collapse'&&s.opacity!=='0'}):[visible()].filter(Boolean)}
 function view(){const v=window.visualViewport,img=visible();return {scrollX,scrollY,width:v?.width||innerWidth,height:v?.height||innerHeight,offsetLeft:v?.offsetLeft||0,offsetTop:v?.offsetTop||0,scale:v?.scale||1,revision,target:JSON.stringify(captureSurfaces().filter(img=>OCRCompanionCore.visibleBounds([img.getBoundingClientRect()],{offsetLeft:v?.offsetLeft||0,offsetTop:v?.offsetTop||0,width:v?.width||innerWidth,height:v?.height||innerHeight})).map(img=>[nodeIDs.has(img)?nodeIDs.get(img):(nodeIDs.set(img,++nextNodeID),nextNodeID),img.currentSrc||img.src||'',img.width,img.height,img.getBoundingClientRect().toJSON()]))}}
 function areaState(){return {active:!!area,invalidated:!!area&&area.viewport!==OCRCompanionCore.areaViewport(view()),selecting:!!selectionUI}}
 function areaControls(){title.textContent=selectionMode?'OCR Companion · Drag to read':'OCR Companion · Page reader';clearArea.hidden=!area&&!selectionMode;areaNote.hidden=!area&&!selectionMode;read.textContent=area?'Read selected area':'Read page';scope.textContent=area?(areaState().invalidated?'Selected area · expired after zoom or resize':'Selected area · Clear area returns to automatic reading'):(mode.value==='source'?'Full source page':'Visible page content');selectArea.textContent=selectionMode?'Stop selecting':'Select area';selectArea.setAttribute('aria-pressed',String(selectionMode));areaNote.textContent=selectionMode?'Drag on the comic to read another area. Scroll normally. Escape stops selecting.':areaState().invalidated?'Area expired after zoom or resize. Select again or clear it.':area?'Selected area active. Reused at the same screen position after scrolling; cleared on reload.':''}
 function finishGesture(){if(!selectionUI)return;selectionUI.overlay?.remove();panel.hidden=selectionUI.wasHidden;selectionUI=null}
 function eligible(e){
  if(!selectionMode||busy||!e.isTrusted||e.button!==0||e.shiftKey||e.ctrlKey||e.metaKey||e.altKey||e.pointerType==='touch')return false;
  const path=e.composedPath();return !path.some(n=>n===panel||n.matches?.('a[href],button,input,select,textarea,summary,[role="button"],[role="slider"],[role="scrollbar"],[role="menuitem"],[contenteditable]:not([contenteditable="false"]),#MigakuShadowDom'));
 }
 function startGesture(e){if(selectionUI)cancelGesture();if(!eligible(e))return;const point={x:e.clientX,y:e.clientY};selectionUI={pointerId:e.pointerId,start:point,startView:view(),wasHidden:panel.hidden,overlay:null,box:null,dragged:false};e.preventDefault();e.stopImmediatePropagation()}
 function moveGesture(e){
  const g=selectionUI;if(!g||e.pointerId!==g.pointerId||!e.isTrusted)return;if(!e.buttons){cancelGesture();return}
  const dx=e.clientX-g.start.x,dy=e.clientY-g.start.y;
  if(!g.dragged&&(Math.abs(dx)<16||Math.abs(dy)<16))return;
  e.preventDefault();e.stopImmediatePropagation();g.dragged=true;
  if(!g.overlay){const overlay=document.createElement('div');overlay.id='ocrcompanion-area-selector';overlay.style.cssText='position:fixed;inset:0;z-index:2147483646;pointer-events:none;user-select:none';const box=document.createElement('div');box.style.cssText='position:absolute;border:2px solid #65e3ff;background:#65e3ff18;box-sizing:border-box';overlay.append(box);document.body.append(overlay);g.overlay=overlay;g.box=box;panel.hidden=true}
  Object.assign(g.box.style,{left:Math.min(g.start.x,e.clientX)+'px',top:Math.min(g.start.y,e.clientY)+'px',width:Math.abs(dx)+'px',height:Math.abs(dy)+'px'});
 }
 let suppressClick=null,clickTimer;
 function releaseGesture(e){
  const g=selectionUI;if(!g||e.pointerId!==g.pointerId||!e.isTrusted)return;
  if(!g.dragged){finishGesture();return}
  e.preventDefault();e.stopImmediatePropagation();suppressClick={x:e.clientX,y:e.clientY};clearTimeout(clickTimer);clickTimer=setTimeout(()=>{suppressClick=null},400);
  try{if(!OCRCompanionCore.sameView(g.startView,view()))throw new Error('The page moved. Drag the area again.');const rect=OCRCompanionCore.selectionRect(g.start,{x:e.clientX,y:e.clientY},view());area={rect,viewport:OCRCompanionCore.areaViewport(view()),priorMode:area?.priorMode||mode.value};finishGesture();panel.hidden=false;areaControls();sendRead(mode.value)}catch(error){finishGesture();panel.hidden=false;status.textContent=error.message}
 }
 function selectionClick(e){if(suppressClick&&e.isTrusted){const match=Math.abs(e.clientX-suppressClick.x)<4&&Math.abs(e.clientY-suppressClick.y)<4;suppressClick=null;if(match){e.preventDefault();e.stopImmediatePropagation()}}}
 function selectionKey(e){if(selectionMode&&e.isTrusted&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finishGesture();selectionMode=false;areaControls();status.textContent='Selection mode stopped. Your last area is kept.'}}
 function cancelGesture(){if(selectionUI){finishGesture();areaControls();status.textContent='Drawing cancelled. Drag again when the page is still.'}}
 document.addEventListener('pointerdown',startGesture,true);document.addEventListener('pointermove',moveGesture,true);document.addEventListener('pointerup',releaseGesture,true);document.addEventListener('pointercancel',cancelGesture,true);document.addEventListener('click',selectionClick,true);document.addEventListener('keydown',selectionKey,true);document.addEventListener('wheel',cancelGesture,{capture:true,passive:true});window.addEventListener('blur',cancelGesture);window.addEventListener('resize',cancelGesture);window.visualViewport?.addEventListener('resize',cancelGesture);
 function destroySelection(){finishGesture();clearTimeout(clickTimer);for(const [type,fn] of [['pointerdown',startGesture],['pointermove',moveGesture],['pointerup',releaseGesture],['pointercancel',cancelGesture],['click',selectionClick],['keydown',selectionKey],['wheel',cancelGesture]])document.removeEventListener(type,fn,true);window.removeEventListener('blur',cancelGesture);window.removeEventListener('resize',cancelGesture);window.visualViewport?.removeEventListener('resize',cancelGesture)}
 selectArea.onclick=e=>{if(!e.isTrusted||busy)return;finishGesture();selectionMode=!selectionMode;areaControls();status.textContent=selectionMode?'Selection mode on. Drag on the comic; scroll and page controls still work.':'Selection mode stopped.'};clearArea.onclick=e=>{if(!e.isTrusted||busy)return;finishGesture();selectionMode=false;if(area?.priorMode)mode.value=area.priorMode;area=null;areaControls();status.textContent='Area cleared. Automatic reading restored.'};
 function geometry(){if(area){if(areaState().invalidated)throw new Error('Selected area expired. Select again or clear it.');return {...area.rect,manual:true}}return OCRCompanionCore.visibleBounds(captureSurfaces().map(img=>img.getBoundingClientRect()),view())}
 async function source(){if(!adapter)throw new Error('No full-page adapter for this reader.');if(adapter.captureOnly)throw new Error('This reader uses Chrome screenshot capture.');const img=visible();if(!img)throw new Error('No loaded comic page is visible.');if(!['canvas','renderedImage'].includes(adapter.kind))return {src:img.currentSrc||img.src};const canvas=document.createElement('canvas');canvas.width=img.naturalWidth||img.width;canvas.height=img.naturalHeight||img.height;if(canvas.width*canvas.height>16000000)throw new Error('Source image is too large.');const ctx=canvas.getContext('2d');if(!ctx)throw new Error('No canvas drawing context.');ctx.drawImage(img,0,0);const dataUrl=canvas.toDataURL('image/png');if(typeof dataUrl!=='string'||!dataUrl.startsWith('data:image/png;base64,'))throw new Error('Reader returned an empty image.');return {dataUrl}}
 async function sendRead(selectedMode){if(busy)return;try{const r=await chrome.runtime.sendMessage({type:'read',language:language.value,mode:selectedMode});if(!r?.ok){status.textContent=(r?.error||'OCR failed.')+(text.textContent?' Previous text is kept.':'');retry.hidden=false}}catch(e){status.textContent=e.message;retry.hidden=false}}
 read.onclick=e=>{if(e.isTrusted)sendRead(mode.value)};capture.onclick=e=>{if(e.isTrusted)sendRead('capture')};
 // Never execute page javascript: links; navigation uses scrolling or native reader controls.
 next.onclick=e=>{if(!e.isTrusted)return;if(adapter?.manualNavigation)return;if(adapter?.scrollStep){window.scrollBy({top:innerHeight*.8,behavior:'smooth'});return}const img=visible(),all=candidates(),target=all[all.indexOf(img)+1];if(target)target.scrollIntoView({block:'start',behavior:'smooth'});else window.scrollBy({top:innerHeight*.8,behavior:'smooth'})};
 language.onchange=()=>{chrome.runtime.sendMessage({type:'preferences',language:language.value});text.lang=({'zh-Hans':'zh-CN','zh-Hant':'zh-TW'})[language.value]||language.value;status.textContent='Language changed. Read again and select the same language in Migaku.'};
 mode.onchange=()=>{areaControls();chrome.runtime.sendMessage({type:'preferences',mode:mode.value})};
 collapse.onclick=()=>{body.hidden=!body.hidden;collapse.textContent=body.hidden?'+':'−'};close.onclick=()=>{finishGesture();selectionMode=false;areaControls();panel.hidden=true};settings.onclick=()=>chrome.runtime.sendMessage({type:'settings'});
 copy.onclick=async()=>{try{await navigator.clipboard.writeText(Array.from(text.querySelectorAll('p')).map(p=>p.dataset.original||p.textContent).join('\n'));status.textContent='Text copied.'}catch{status.textContent='Copy unavailable. Select the text and press Command+C.'}};
 header.onpointerdown=e=>{if(e.target.closest('button')||!e.isTrusted)return;const r=panel.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;header.setPointerCapture(e.pointerId);header.onpointermove=e=>{panel.style.right='auto';panel.style.bottom='auto';panel.style.left=Math.max(0,Math.min(innerWidth-panel.offsetWidth,e.clientX-dx))+'px';panel.style.top=Math.max(0,Math.min(innerHeight-50,e.clientY-dy))+'px'};header.onpointerup=()=>{header.onpointermove=null;savePlacement()}};
 function message(m,sender,reply){
  if(sender.id!==chrome.runtime.id)return;
  if(m.type==='configure'){panel.hidden=!!selectionUI;adapter=m.adapter;next.disabled=!!adapter?.manualNavigation;next.textContent=adapter?.manualNavigation?'Use reader page controls':'Next page ↓';language.value=m.language||adapter?.language||'zh-Hans';mode.value=m.mode||'auto';text.lang=({'zh-Hans':'zh-CN','zh-Hant':'zh-TW'})[language.value]||language.value;areaControls();status.textContent=(adapter?.name||'Generic website')+' · ready';reply({ok:true});return}
  if(m.type==='areaState'){reply(areaState());return}
  if(m.type==='source'){source().then(reply,e=>reply({error:e.message}));return true}
  if(m.type==='view'){reply(view());return}
  if(m.type==='geometry'){try{reply(geometry())}catch(e){reply({error:e.message})}return}
  if(m.type==='status'){status.textContent=m.text;busy=!!m.busy;panel.setAttribute('aria-busy',String(busy));retry.hidden=busy;if(!busy&&text.textContent)status.textContent+=' Previous text is kept.';read.disabled=capture.disabled=selectArea.disabled=clearArea.disabled=busy;reply({ok:true});return}
  if(m.type==='statusDone'){busy=false;panel.setAttribute('aria-busy','false');read.disabled=capture.disabled=selectArea.disabled=clearArea.disabled=false;reply({ok:true});return}
  if(m.type==='result'){retry.hidden=true;body.hidden=false;collapse.textContent='−';text.replaceChildren();for(const line of m.data.lines){const p=el('p',line.text,text);p.dataset.original=line.text;p.style.margin='8px 0'}status.textContent=`${m.data.lines.length} lines · ${Number(m.data.seconds).toFixed(2)} s · ${m.method}`+(m.fallback?' · source unavailable':'');if(previewURL)URL.revokeObjectURL(previewURL);previewURL=m.image;image.src=previewURL;image.onload=()=>{info.textContent=`${image.naturalWidth} × ${image.naturalHeight} · ${m.method}`};reply({ok:true});return}
 }
 let placementReady=false,placementTimer;
 function applyPlacement(saved){if(!saved)return;const p=OCRCompanionCore.panelPlacement(saved,innerWidth,innerHeight);Object.assign(panel.style,{right:'auto',bottom:'auto',left:p.left+'px',top:p.top+'px',width:p.width+'px'})}
 function savePlacement(){if(!placementReady||panel.hidden||body.hidden)return;clearTimeout(placementTimer);placementTimer=setTimeout(()=>{const r=panel.getBoundingClientRect();chrome.storage?.local?.set({overlayPlacement:{left:r.left,top:r.top,width:r.width}}).catch(()=>{})},200)}
 const resizePlacement=()=>{if(placementReady){const r=panel.getBoundingClientRect();applyPlacement({left:r.left,top:r.top,width:r.width})}};window.addEventListener('resize',resizePlacement);
 const placementObserver=typeof ResizeObserver==='function'?new ResizeObserver(savePlacement):null;placementObserver?.observe(panel);
 if(chrome.storage?.local)chrome.storage.local.get('overlayPlacement').then(saved=>{applyPlacement(saved.overlayPlacement);placementReady=true}).catch(()=>{placementReady=true});else placementReady=true;
 chrome.runtime.onMessage.addListener(message);
 globalThis.__ocrcompanionReader={version:VERSION,show(){if(selectionUI)return;if(!panel.isConnected)document.body.append(panel);panel.hidden=false},destroy(){placementObserver?.disconnect();clearTimeout(placementTimer);window.removeEventListener('resize',resizePlacement);chrome.runtime.onMessage.removeListener(message);document.removeEventListener('scroll',changed,true);mutations.disconnect();destroySelection();if(previewURL)URL.revokeObjectURL(previewURL);panelStyle.remove();panel.remove()}};
})();
