> Historical OCR Companion for Migaku audit retained for provenance. The rebranded beta uses the same OCR/Migaku approach; this is not a new all-site live sweep. Raw local development evidence paths mentioned below are not bundled.

# Overlay capture improvements — experimental 1.5.5

Implemented 3 November 2026. Existing Mac helper and pairing unchanged; no new permissions, OCR dependencies or site adapters. Frozen 1.5.3 remains unchanged.

## Changes

- During screenshots, hide `#MigakuShadowDom` with the existing transient opacity mechanism. Original inline opacity/transition values and priorities are restored in the existing capture finally path, including capture errors. Hiding changes no layout and does not stop Migaku’s observer or parsing.
- Capture-only canvas adapters now crop the union of all visible eligible comic surfaces, clipped to the visual viewport. This fixes choosing only the largest half of a spread. Source-image readers keep their previous single-source behavior; explicit manual areas retain precedence.
- The capture view signature includes every visible comic surface, so replacing/moving/resizing the second canvas also invalidates a pending result. Display-none, visibility-hidden/collapse and opacity-zero surfaces are excluded. Existing scroll, URL, zoom/resize and selected-area expiry checks remain.

This uses the existing screenshot pipeline and coordinate transform. It adds no spatial word overlay or architectural layer. Reading order is still Apple Vision’s result order; union capture is not a guarantee of Japanese right-to-left page ordering.

## Validation

`node tests/run-regression.cjs --json`: **13 JavaScript suites plus the native suite passed; native suite contains 13 protocol tests**. Includes 37 capture-matrix and 40 reader-lifecycle cases. JavaScript syntax checks passed for content.js and background.js.

New/expanded tests cover spread union, clipping, offscreen/empty/single surfaces, fractional/Retina pixel transforms, a second canvas changing, persistent selection precedence, and exact restoration of Migaku toolbar CSS. Relevant fixtures were updated to model computed visibility and the intentionally expanded crop rather than expecting the old single-page crop.

Live Chrome after the user reloaded 1.5.5:

- Shonen Jump+ SPY×FAMILY episode 1: both visible pages contributed dialogue; Japanese screenshot OCR returned **38 lines/.44 s**, with automatic Migaku segmentation/furigana/unknown markings. In the preceding build, a two-page view could select the blank/title half alone. Not a full-chapter or universal reader-layout proof.
- Cubari Imgur sample: deliberately pinned Migaku toolbar visible before reading; **13 lines/.31 s**, actual Japanese speech automatically annotated. OCR output omitted the visible Migaku “Ambitious” and comprehension counters. Toolbar restored afterwards; reader controls/artwork noise remain in a generic full viewport capture. Restored toolbar to unpinned after testing.
- Mandarin profile restored; Simplified Chinese OCR preference restored. No known-word entries were changed.

Evidence: `work/overlay-improvements-1.5.5/shonenjumpplus.{txt,png}` and `cubari.{txt,png}`. Earlier 55-site results remain dated 1.5.4 observations; they have not all been reverified on 1.5.5.

## Remaining recommendations

Generic panel controls can still be annotated by Migaku, particularly with English selected. No reliable supported exclusion contract has been established here. Applying guessed classes/attributes risks suppressing recognized text as well; control isolation needs a separately explained change and live parsing/accessibility checks. Bilibili’s existing text-only compatibility root is preserved.

The prior report’s cover/advert-only and unavailable samples remain explicitly partial/unavailable. These two capture fixes do not establish access or end-to-end parsing on those samples. Low-resolution vertical OCR, incidental reader controls, page reading order, another Mac and later Migaku versions remain testing work.

## Changed files

`outputs/OCR Companion for Migaku-Chrome/{background.js,content.js,reader-core.js,manifest.json}` and matching experimental source mirror; `tests/{test-visible-spread.cjs,test-persistent-selection.cjs,run-regression.cjs}`; `work/site-tests/test-capture-visibility.cjs`; documentation and separate experimental 1.5.5 archive. No frozen release files changed.
