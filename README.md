# OCR Companion for Migaku

Created by **Baroni Fabio (pentestguru)**.

**Read text from comics, games and apps with Migaku.**

OCR Companion for Migaku turns text visible on your Mac into selectable text you can study in Google Chrome. For comics, the text appears in an overlay in the original tab. For games and other apps, a dedicated Chrome reader receives your screen captures.

> **Experimental beta — 1.0.0 beta 9.** Tested on one Mac so far. Recognition, website compatibility and display behavior can vary. Feedback and testing on other Macs are welcome.
>
> **Unofficial companion app. Not affiliated with, endorsed by, or made by Migaku.** Migaku is installed separately and its features remain subject to your Migaku account and settings.

## Guided first-run setup

The wizard sets up **both** Chrome page reading and screen capture. There is no workflow-choice step; use whichever feature you need afterwards.

1. **Connect Chrome:** prepare/load the extension folder, open extension settings, click Connect Mac app and confirm in the app. Chrome checks the helper automatically.
2. **Allow screen recording:** one macOS permission covers screen capture. Click Enable screen recording. macOS may offer to open its recording settings; enable OCR Companion there and return. The app does not immediately open a second Settings page. The same button offers Open recording settings if you need to return there.
3. **Finish:** if permission is usable immediately, Finish setup completes it without a restart. If macOS requires a relaunch, click Restart & finish setup. The app saves progress, quits and reopens its own installed copy. It rechecks permission and connection automatically and completes setup if both are ready. Usage instructions are shown before restarting. The final Ready screen is informational; Done only dismisses it.

If permission is still unavailable after reopening, the wizard stays on the required step and does not restart in a loop. If automatic reopening fails, open the app from Applications; progress is retained. Do not use an old reader tab after an app restart—open a new reading page from the OCR menu.

Set up later defers the wizard. Run it again from **Settings & setup… → Run setup wizard…**. A green dot and text indicate configured/connected; red indicates unavailable/not connected; Chrome has a separate checking state. Mac configuration is local registration, while Chrome checks actual helper access.

The optional prepared Chrome extension folder is `~/Library/Application Support/OCRCompanion/ChromeExtension`. Existing loaded folder contents are preserved. The release ZIP's 02-Chrome-Extension folder remains available for manual installation.


## What it does

- **Read comics without switching tabs:** show recognized text beside the artwork.
- **Capture text outside the browser:** select a region in a game or Mac app and send its recognized text to a Chrome reading page.
- **Use Migaku on recognized text:** dictionary lookup and, on compatible pages with Full power enabled, automatic vocabulary markings.
- **Read locally:** uses Apple's OCR engine, without an additional paid OCR service or JavaScript OCR library.
- **Choose your capture:** automatic source/screenshot fallback, source-only reading, visible-area capture or an optional drawn region.
- **Keep a comfortable layout:** move and resize the comic overlay; its position and width are remembered.
- **Revisit screen captures:** browse up to ten recent non-empty captures in the reader's session-only history.

OCR extracts text; it does not translate by itself. Use Migaku for dictionary lookup and its other learning features.

## Requirements

| Requirement | Details |
| --- | --- |
| macOS | macOS 14 or newer, with hardware supported by Apple Live Text |
| Mac architecture | Universal build includes Apple Silicon and Intel binaries; OCR support is checked at runtime |
| Browser | Installed Google Chrome |
| Migaku | Your own installed and configured Migaku extension/account |
| Screen capture | Screen Recording / Screen & System Audio Recording permission for the Mac app |

No Terminal, Python, Node.js, compiler or Apple Developer account is needed to **use the built app**. Development tools are needed only to build or test the source.

The Mac app is **ad-hoc signed, not Developer ID signed or notarized**. First launch may require approval in macOS settings. The Chrome extension is installed using **Load unpacked**, rather than the Chrome Web Store.

## Download and install

Download and extract the ZIP from this repository's **Releases** section. Open `START-HERE.html` for the complete guide.

### Mac app

1. Move `01-Mac-App/OCR Companion for Migaku.app` into Applications.
2. Quit older screen-capture builds, then open the installed app.
3. If macOS blocks it because the developer cannot be verified, follow the app-specific **System Settings → Privacy & Security → Open Anyway** process. Review the included source before running it if you wish. Do not disable Gatekeeper globally. See [Apple's instructions](https://support.apple.com/en-gb/102445).
4. Allow screen-recording access when prompted. Relaunch if macOS requests it.

The app shows **Settings & setup** and adds **▣ OCR** to the menu bar. Use **Open reading page** when you want screen reading; it no longer opens a reader tab automatically at startup. Closing its settings window leaves it running. Screen OCR does not need Chrome extension pairing.

### Chrome extension — for comic-tab reading

1. Keep `02-Chrome-Extension` in a permanent location.
2. Open `chrome://extensions` in Google Chrome and enable **Developer mode**.
3. Choose **Load unpacked** and select `02-Chrome-Extension`, the folder containing `manifest.json`.
4. Install **OCR Companion for Migaku.app** in Applications and open it once.
5. In the extension's settings, click **Connect Mac app**. Chrome/macOS may ask to open OCR Companion.
6. In the Mac app's confirmation, click **Connect extension** if you just initiated this connection.
7. Return to Chrome. The page checks automatically and displays **Connected to Apple Live Text**. **Check connection** is also available.

No copy and paste is needed. If the app does not open, use **Manual connection / troubleshooting** below the button. Manual pairing is in **Settings & setup… → Manual connection & troubleshooting**. The ID displayed in Chrome is read-only; only the Mac app's manual field is editable.

Each user pairs their own extension ID. No shared token file is distributed, and no Terminal helper needs to stay open. The connection link only carries the extension ID; the app asks for confirmation because other websites can also open such links. Pinning the extension makes its Read action easier to reach.

## Read comics in the same tab

Open a readable chapter, scroll to the comic text, then click the extension icon or press **Option + Shift + O**. The overlay opens and starts reading.

Click **Read page** again after scrolling or turning a page. Use the website's native page controls when prompted. Drag the overlay header to move it and its bottom-right grip to resize its width.

**Options** contains the OCR language, reading mode, capture override, navigation and image preview. The preview shows the image actually sent to OCR.

| Mode | Behavior |
| --- | --- |
| **Automatic** | Tries the supported full-source adapter, then falls back to a screenshot |
| **Full source only** | Reads the source image without screenshot fallback; unavailable on some readers |
| **Visible area only** | Reads the current visible area |
| **Optional selected area** | Reads a rectangle you draw, taking precedence over normal capture |

Area selection is optional. After enabling **Select area**, drag around the desired text. You can draw another region without clicking Select area again. Scroll normally; **Escape / Stop selecting** pauses drawing while retaining the last region. **Clear area** restores automatic reading. Selected regions expire after zoom or resize and clear on reload.

The scope label shows what will be read. Progress and errors preserve the previous recognized text; failed reads offer **Retry**.

### Migaku settings

Choose the **same language** in OCR Companion and Migaku. The app does not detect or change Migaku's study language.

Enable Migaku for the site and select **Full power** for automatic word markings. Parsing may take a moment after OCR finishes. Shift lookup remains available as a fallback.

For `manga.bilibili.com`, extension settings offer optional **Bilibili compatibility**. Enable it and reload the comic to prepare the reading container before Migaku starts scanning. It requires optional access only to that manga domain and does not automatically capture screenshots or run OCR.

## Read games, apps and other screen text

1. Leave the Mac app running and bring the target text into view.
2. Press **Option + Shift + S**, or choose **Capture screen area…** from the OCR menu.
3. Drag around the text. The app hides its setup windows during selection; Escape cancels.
4. Open the connected Chrome reader and study the recognized text with Migaku.
5. When the text changes in the same location, press **Option + Shift + R**, or choose **Capture same area again**.

Keep the source visible when rereading: capture uses current screen pixels, including anything covering the selected region. Choose the OCR language from the menu's **OCR language** submenu.

**Bring Chrome forward after capture**, in Settings & setup, is optional and off by default. It activates Chrome after recognition but does not guarantee selecting the reader tab. Leave it off for background updates while staying in your game/app.

Captures update the same connected reader rather than opening a new tab for every capture. Explicitly choosing **Open reading page** can open another tab.

### Capture history

- **Previous capture** pauses updates while you study earlier text.
- **Back to latest** returns to the newest capture and resumes updates.
- **Pause updates** keeps the current text stable.
- **Clear history** clears that reader tab's retained text.

History is kept only in page memory, limited to ten non-empty captures and an aggregate text limit. Closing or reloading the tab discards it. Other reader tabs may retain their own history. Clearing history affects only the current tab; closing the app also ends its current transcript session.

Restarting the app starts a new session. Old tabs stop receiving updates. Reloading a reader loses its in-memory connection key; reopen it through the OCR menu. Captures between polling intervals may be missed.

## Languages

OCR choices include:

- Simplified and Traditional Chinese
- Japanese and Korean
- English, French, German, Spanish, Italian and Portuguese

OCR-engine availability is checked on the Mac. Migaku language support and setup are separate; not every OCR language has been verified with Migaku.

## Website compatibility

The [full website report](03-Guide/WEBSITE-COMPATIBILITY.md) accounts for **55 requested website entries**. The earlier automatic-parsing sweep recorded **23 Working, 15 Partial and 17 Unavailable** entries.

These are **dated, sample-based observations**, not a guarantee for every chapter or a fresh all-site sweep of the renamed beta. Baozi/Twmanga share one sample; Bilibili testing uses its manga host, and Bookwalker testing uses its trial viewer.

Examples where actual comic text received automatic Migaku annotations:

| Language/sample | Websites |
| --- | --- |
| Chinese | Bilibili Manga, Tencent Comics, Baozi/Twmanga, Manhuagui, Webtoon |
| Japanese | MangaOne, Tonari, Kadocomi, Magapoke, Gangan Online, Comic Gardo, Comic Action, Cubari |
| Korean | Naver Webtoon, Ridi, Bomtoon, Kakao Webtoon, Lezhin |
| English | Webtoon, GlobalComix, Tappytoon |

Scope varies by sample; consult the report for limitations. Other normal websites may work through generic screenshot capture without a dedicated adapter. Matching a URL alone does not establish support.

## Known limitations

- OCR can misread small text, vertical lettering, decorative fonts, sound effects and artwork.
- Automatic spread capture does not guarantee correct Japanese page/reading order.
- Generic captures may include website controls. Optional area selection can help.
- Migaku may annotate some overlay control labels; this remains unresolved.
- Bilibili's automatic-parsing compatibility relies on observed Migaku behavior and may change after updates.
- Browser internal pages, other extensions' pages, protected/DRM content and region/login restrictions may prevent capture or access. The app does not bypass them.
- Games, fullscreen applications, multiple displays and arbitrary display arrangements need broader testing.
- A clean install on another Mac has not yet been verified. Rebuilt ad-hoc app versions may require macOS permission approval again.

## Privacy and architecture

**Comic tabs:** the extension uses Chrome Native Messaging to call a local Apple VisionKit `ImageAnalyzer` helper. The helper registration accepts the extension ID you connect. Images and OCR results are processed in memory; there is no bundled cloud OCR service.

**Screen capture:** the Mac app uses Apple's ScreenCaptureKit on demand. It serves bundled HTML/CSS/JavaScript and a read-only text feed on `127.0.0.1`, with a random port and a fresh random 256-bit session key per launch. The page removes the initial key fragment from its displayed URL and keeps the key in memory for authenticated polling. Host, Origin, fetch-site, method and route checks restrict access.

The screen reader is not exposed to the LAN and has no HTTP screenshot, file-read, upload or remote-control endpoint. This is not a defense against malware or browser extensions already authorized to read the page.

There is no bundled analytics, cloud OCR or transcript file. Website image requests still contact their image servers. Text displayed in Chrome is intentionally available to Migaku; its dictionary, translation and card networking follows **Migaku's own settings**. Other authorized browser extensions may also read displayed text.

Internal identifiers use the new name: native host `local.ocrcompanion.reader`, app bundle ID `local.ocrcompanion.app`, helper `ocrcompanion-native` and user helper directory `~/Library/Application Support/OCRCompanion/NativeHost`.

## Source and development

The release archive is organized as follows:

```text
01-Mac-App/             Universal macOS app
02-Chrome-Extension/    Load-unpacked Chrome extension
03-Guide/              User guide, compatibility audit and validation notes
04-Source/             Exact release sources, build scripts and tests
START-HERE.html        User-friendly installation and usage guide
SHA256SUMS.txt         Checksums of packaged files
```

Source is included for inspection. **A separate open-source license has not been selected for this beta.** No Migaku code, developer certificate, private session key or preconfigured user extension ID is bundled.

To build on a development Mac with Xcode Command Line Tools:

```sh
cd 04-Source
zsh macOS/build.sh
```

To run the development checks from `04-Source`:

```sh
node browser-tests/run.cjs
node tests/migaku-compat.test.cjs
node tests/migaku-registration.test.cjs
zsh tests/run.sh
python3 tests/test_protocol.py
```

Node.js, Python 3 and Xcode tools are development-only requirements. The protocol tests expect the app included in the release archive at `../01-Mac-App`; they launch a temporary helper copy without installing or pairing it. See [source and test details](04-Source/SOURCE-AND-TESTS.md).

The beta passed extension and reader JavaScript tests, 13 native-protocol cases, 23 Swift reader-access policy cases, multilingual round-trip tests and nine screen-capture geometry cases. Universal builds and ad-hoc signatures were verified. Automated tests do not establish universal website or game compatibility.

## Feedback and beta testing

**Testing from others is welcome**, particularly on Intel Macs, clean installations, second displays, vertical Japanese text, Korean readers and games.

When reporting an issue, include:

- Release, macOS, Chrome and Migaku versions
- Mac model/chip and relevant display/zoom setup
- OCR language and Migaku study language
- Comic URL or target app, steps, expected result and actual result
- The exact error message and, if appropriate, a cropped screenshot

Do not post private captured text, connection-key fragments or unrelated browser information. Share screenshots only when you are comfortable making their contents public.

## Removal

Optionally use **Settings & setup… → Manual connection & troubleshooting → Remove native helper** to remove the shared OCR Companion native helper registration for your macOS user. Remove the Chrome extension, quit and delete the Mac app, and close its reader tabs. Screen-recording permission can be removed in System Settings.

If another earlier installation uses the same native-host registration, removing it also disconnects that installation.

## Included demo

See 05-Demo for a short captioned video of manual selection, Japanese OCR and Migaku lookups on Tonari. See 03-Guide/RELEASE-NOTES.md for this beta’s changes and limitations.
