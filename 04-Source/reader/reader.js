'use strict';
const text = document.querySelector('#text');
const empty = document.querySelector('#empty');
const clear = document.querySelector('#clear');
const status = document.querySelector('#status');
const fragment = new URLSearchParams(location.hash.slice(1));
const session = fragment.get('session');
// The capability stays in memory and is never sent as a URL, cookie or log field.
if (session) history.replaceState(null, '', '/');
let revision = -1;
let renderedTextRevision = -1;
let clearedRevision = -1;
let paused = false;
let pending = null;
let stopped = false;
let latestStatus = 'Ready';
// Session-only history: never persist recognized text to browser storage.
const captures = []; let historyIndex = -1; let capturedRevision = -1;
const previous = document.querySelector('#previous');
const latest = document.querySelector('#latest');
const next = document.querySelector('#next');
const readerTitle = document.querySelector('#reader-title');
const captureLabel = document.querySelector('#capture-label');
function historyControls() {
  previous.disabled = historyIndex <= 0;
  next.disabled = historyIndex < 0 || historyIndex >= captures.length - 1;
  readerTitle.textContent=historyIndex >= 0 && historyIndex < captures.length - 1 ? 'Earlier capture' : 'Latest capture';
  latest.disabled = historyIndex < 0 || historyIndex === captures.length - 1;
  captureLabel.textContent = historyIndex < 0 ? 'No captures yet' : `Capture ${historyIndex + 1} of ${captures.length} · ${captures[historyIndex].language}`;
}
function remember(data) {
  if (data.textRevision === capturedRevision) return;
  capturedRevision = data.textRevision;
  if (!data.text.trim()) return;
  captures.push({text:data.text, language:data.language || 'zh-Hans', id:data.textRevision});
  while (captures.length > 10 || (captures.length > 1 && captures.reduce((n,c)=>n+c.text.length,0)>1000000)) { captures.shift(); historyIndex = Math.max(-1,historyIndex-1); }
  historyControls();
}
previous.addEventListener('click', () => {
  if (historyIndex <= 0) return;
  historyIndex--; paused = true; pause.textContent = 'Resume updates'; pause.setAttribute('aria-pressed','true');
  const item=captures[historyIndex];render(item.text,item.language);historyControls();status.textContent='Viewing an earlier capture · Updates paused';
});
next.addEventListener('click', () => {
  if(historyIndex < 0 || historyIndex >= captures.length-1)return;
  if(historyIndex===captures.length-2){returnToLatest();return;}
  historyIndex++;paused=true;pause.textContent='Resume updates';pause.setAttribute('aria-pressed','true');const item=captures[historyIndex];render(item.text,item.language);historyControls();status.textContent='Viewing an earlier capture · Updates paused';
});
function returnToLatest() {
  paused=false; pause.textContent='Pause updates';pause.setAttribute('aria-pressed','false');
  if(pending){renderedTextRevision=-1;show(pending);pending=null;}else if(captures.length){historyIndex=captures.length-1;const item=captures[historyIndex];render(item.text,item.language);renderedTextRevision=item.id;historyControls();status.textContent=latestStatus;}
}
latest.addEventListener('click',returnToLatest);
const pause = document.querySelector('#pause');
function render(value, language) {
  // Never interpret recognized text as HTML. Fresh nodes allow Migaku to parse updates.
  text.replaceChildren();
  for (const line of value.split('\n').filter(line => line.trim())) {
    const p = document.createElement('p'); p.textContent = line; text.append(p);
  }
  text.lang = language || 'zh-Hans';
  text.hidden = !value.trim(); empty.hidden = !!value.trim(); clear.hidden = !value.trim();
}
function show(data) {
  revision = data.revision; status.textContent = data.status;
  if (data.textRevision !== renderedTextRevision && clearedRevision !== data.textRevision) {
    render(data.text, data.language); renderedTextRevision = data.textRevision; historyIndex = captures.findIndex(c=>c.id===data.textRevision); historyControls();
  }
}
document.querySelector('#sample').addEventListener('click', () => {
  render('不好意思，少年，我这里可没关于她的书。\nこれはサンプルの文章です。\n이것은 예시 문장입니다.', 'zh-Hans');
  status.textContent = 'Sample text · Not a live capture';
});
clear.addEventListener('click', () => {
  clearedRevision = pending?.textRevision ?? renderedTextRevision; pending=null; captures.length=0;historyIndex=-1;historyControls();render('', 'zh-Hans'); status.textContent = 'Text hidden in this tab. Capture again for new text.';
});
pause.addEventListener('click', () => {
  paused = !paused; pause.textContent = paused ? 'Resume updates' : 'Pause updates';
  pause.setAttribute('aria-pressed', String(paused));
  if (!paused && pending) { renderedTextRevision=-1;show(pending); pending = null; } else if(!paused&&captures.length){historyIndex=captures.length-1;const item=captures[historyIndex];render(item.text,item.language);renderedTextRevision=item.id;historyControls();status.textContent=latestStatus;}
});
async function poll() {
  if (stopped) return;
  try {
    const response = await fetch('/state', {headers: {'X-OCRCompanion-Session': session}, cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(5000)});
    if (response.status === 403) { stopped = true; throw new Error('Session expired. Open the reader again from the OCR Companion menu.'); }
    if (!response.ok) throw new Error('Reader unavailable. Check that OCR Companion is running.');
    const data = await response.json();
    if (!Number.isSafeInteger(data.revision) || !Number.isSafeInteger(data.textRevision) || typeof data.text !== 'string' || data.text.length > 700000 || typeof data.status !== 'string') throw new Error('Invalid reader response.');
    latestStatus=data.status;remember(data);
    if (data.revision !== revision) {
      if (paused) { pending = data; status.textContent = 'Updates paused · Resume when you finish reading'; }
      else show(data);
    }
  } catch (error) { status.textContent = error.message || 'Connection interrupted. Retrying…'; }
  if (!stopped) setTimeout(poll, document.hidden ? 2000 : 750);
}
if (session && /^[a-f0-9]{64}$/.test(session)) {
  document.querySelector('#sample').hidden = true;
  document.querySelector('#local-note').textContent = 'Screen captures and recognition stay on this Mac. This page receives text locally. Migaku’s own dictionary, translation and card features follow your Migaku settings.';
  poll();
} else {
  pause.hidden = true;
  status.textContent = 'Preview · Open the connected reader from OCR Companion';
}
