> Historical OCR Companion for Migaku audit retained for provenance. The rebranded beta uses the same OCR/Migaku approach; this is not a new all-site live sweep. Raw local development evidence paths mentioned below are not bundled.

# Reading workflow improvements — experimental 1.6.0

Chrome extension 1.6.0; screen app 0.1.2. Frozen 1.5.3 unchanged.

## Comic overlay

Read page and Select area remain visible; Clear area appears when applicable. Options contains OCR language, capture mode, screenshot override, reader navigation and image preview. The scope label distinguishes visible comic pages, full source mode, selected area and expired selection. Match OCR language (under Options) to Migaku's study language.

Drag the header to move the panel; drag its bottom-right resize grip to change width. Position and width are stored in extension-local storage across tabs/restarts; no recognized text is stored there. Restored positions are clamped to the current viewport. The panel height follows content and remains scrollable. Collapse and Close remain in the header.

Progress uses the existing status area and aria-busy state. Previous recognized text stays visible while OCR runs and if it fails. A failed read offers Retry. Successful results replace the text as before, so Migaku can parse fresh nodes. Controls can still receive unwanted Migaku annotations on generic sites; no unverified suppression mechanism was introduced.

Live Bilibili: 1 line/.36 s (a long narration paragraph), automatic pinyin/status markings; compact Options closed by default; moved panel persisted after full page reload. Width resizing and restored width after a second reload visibly verified. Options expands correctly. A read during changing page/tab state showed the new Retry control; final retry recovery and screen-reader live history remain follow-up checks until recorded below.

## Screen reader

Capture history is kept only in page memory: up to ten non-empty captures, with a one-million-character aggregate retention target (one individual capture can be up to the existing 700,000-character input limit). Previous capture pauses updates, allowing study without replacement. Back to latest resumes live updates. Pause updates remains available. Clear history removes retained text from this tab. Closing/reloading the tab discards history; the helper may still supply its current capture. Intermediate captures made between polling intervals cannot be recovered.

The introduction explains the page purpose and matching study language. Capture labels identify the OCR language; application-name provenance is not collected. Recognized content is always inserted as text, never HTML. Unchanged polls and status-only updates preserve existing Migaku nodes.

Successive captures already update the same connected reader rather than creating tabs. The existing Mac menu option “Bring Chrome forward after capture” controls focus after recognition; turn it off for background updates. Selection hides the app's setup window. Explicit Open reader can still open another tab, and app relaunch starts a new local session; those cases are not cross-session tab deduplication.

## Tests

- 13 browser JavaScript suites plus 13 native protocol tests passed.
- Reader tests passed, including text-injection safety, unchanged Migaku nodes, pause/clear and history navigation with a status-only pending update.
- Swift tests: 23 reader access-policy cases, multilingual JSON round-trip and nine screen-capture geometry cases passed.
- Universal arm64/x86_64 app build and ad-hoc signature verification passed. Not notarized.

## Update

Reload the existing extension folder to preserve its ID/pairing. The extension requires no helper update for overlay features. For screen history, quit the old screen experiment via its OCR menu, then open the app in this package's 01-App folder. Existing browser-helper pairing remains unchanged. Use its Open reader action for the new session; old reader tabs belong to old sessions.

No Migaku profile or vocabulary change is required. This is experimental and has not been tested on another Mac.

## Live screen-reader update

The rebuilt app opened its new local reader with history controls. Its live status explicitly reports that Screen & System Audio Recording permission is needed for this rebuilt copy. No captured text was available, so real capture-history/Migaku navigation remains unverified; no permission reset was performed automatically. The new ad-hoc-signed build can require macOS permission approval again.

## Completed live history check

After the user relaunched and captured twice, the new reader showed Capture 2 of 2. Previous capture restored the first English capture and enabled paused mode. Back to latest restored the Chinese capture, and Migaku automatically displayed pinyin and vocabulary markings. No vocabulary changes were made. Evidence: work/ui-improvements-1.6.0/history-latest.{png,txt}. The initial permission blocker is resolved for this tested session.

A stale “Viewing an earlier capture” status after returning to latest was found during this check. Reader source and the packaged app assets now restore the latest live status on both resume paths; regression tests cover both paths. The label-only correction is unit-tested, not yet live-rechecked in the relaunched app. The running app caches reader assets at startup, so this small correction takes effect on its next relaunch.
