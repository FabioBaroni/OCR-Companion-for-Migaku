> Historical OCR Companion for Migaku audit retained for provenance. The rebranded beta uses the same OCR/Migaku approach; this is not a new all-site live sweep. Raw local development evidence paths mentioned below are not bundled.

# Migaku automatic parsing inside the comic overlay — experimental

Status: automatic in-overlay parsing verified on Bilibili sample pages 4 and 5; generic Kuaikan regression passed. Extension trial 1.5.4. Mac app remains 0.1.1, unchanged. Frozen 1.5.3 is unchanged.

## Observations

The standalone Chrome reading page automatically parses captured Chinese text and displays vocabulary status. On the Bilibili manga sample, the current floating overlay recognizes text but does not automatically show markings. Migaku's own menu was checked: enabled on this site, Full power selected. Switching Lightweight → Full power reloads the page, so a late-created compatibility container is lost.

Read-only installed-code inspection of Migaku 1.32.0-earlyaccess.3 found a Bilibili-specific parse-root selection path. Its non-video branch searches for `.bili-feed4`; that root does not belong to the manga reader's native layout. The static explanation was followed by a successful live test: after the opt-in early root was enabled, Migaku automatically parsed actual native OCR results in the floating panel.


## Trial

- `migaku-compat.js`: on exactly `manga.bilibili.com`, create one layout-neutral `display:contents` reading root with the recognized Bilibili content class. Move that same early root into the panel as the recognized-text container; only OCR text is within Migaku’s Bilibili observation root, keeping dropdown labels and controls outside it. Other hosts retain `document.body` mounting.
- `migaku-registration.js`: only after explicit opt-in and a granted optional origin permission, register this small bootstrap at document_start. Remove registration if the setting or permission is removed.
- Options provide Enable/Disable Bilibili compatibility controls. Optional access is only `https://manga.bilibili.com/*`. Required permissions and existing image-host permissions are unchanged.
- Bootstrap runs no OCR, native helper call, account lookup or remote request. It does not open another tab or synthesize Migaku input/events. Migaku supplies its own parsing and vocabulary markings.
- No screenshot-reader routing is added. The comic overlay remains the primary output.

## Validation

The existing ten JavaScript suites and thirteen native protocol tests pass. New tests cover exact-host isolation, no body yet, idempotence, neutral layout, unchanged required privileges, opt-in gating, document_start registration, event serialization, permission revocation and disabling/re-enabling.

User approved optional access specifically to manga.bilibili.com; Chrome displayed that exact origin and it was allowed. Live checks:

- Existing Full power setting verified before the trial; it was restored after a temporary Lightweight test.
- Final extension reload and full comic reload, then fresh native screenshot OCR on Bilibili page 4: three lines, .36 seconds; automatic word annotations and pinyin; Migaku comprehension displayed 75%.
- Scroll to page 5 and Read page: two OCR lines, .49 seconds, with new text automatically parsed; no Shift needed to trigger parsing.
- Shift lookup on 流言: Migaku dictionary displayed definitions and Unknown status above the overlay.
- Kuaikan sample https://www.kuaikanmanhua.com/webs/comic-next/682699: native full-source OCR returned one line in .30 seconds, automatically parsed by Migaku. This was a cover/short-text sample, not a comprehensive interior-chapter regression.
- Text-only compatibility root kept Bilibili dropdown labels clean in the final trial. Generic Kuaikan can still show Migaku’s annotation artifacts in dropdown labels; that existing behavior was not changed.

Follow-up: the [55-entry overlay compatibility audit](WEBSITE-COMPATIBILITY.md) now records Chinese, Japanese, Korean and English live checks, with cover-only, crop-limited and unavailable results separated from verified comic dialogue. Later Migaku versions, another browser and vocabulary-status changes during an open result remain unverified. Do not generalize representative tests to universal support.

## Risks

This relies on an observed content-container selector in one Migaku version. It is a small isolated compatibility shim, not a supported Migaku API. Future Migaku or Bilibili updates may change the behavior. Full power and the matching study language must be enabled in Migaku. Existing OCR and Shift lookup remain available without opt-in.

## Files and distribution

Working extension files changed: manifest.json, background.js, content.js, options.html, options.js; new migaku-compat.js and migaku-registration.js. A separate experimental source copy is in work/OCR Companion for Migaku-Screen-Experiment/extension. No native binary was rebuilt. The frozen 1.5.3 archive checksum was checked unchanged. The optional permission persists until the user disables it or revokes the origin in Chrome.
