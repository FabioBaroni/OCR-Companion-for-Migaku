# OCR Companion for Migaku

Created by **Baroni Fabio (pentestguru)**.

**1.0.0 beta 9 · Experimental macOS + Google Chrome release**

Unofficial companion app. Not affiliated with, endorsed by, or made by Migaku.

Turn visible text into selectable text you can study with Migaku. Read comics inside their Chrome tab, or capture text from a game or Mac app and study it in the dedicated Chrome reader. OCR does not translate by itself; use Migaku for lookup and its learning features.

## Guided first-run setup

The wizard sets up **both** Chrome page reading and screen capture. There is no workflow-choice step; use whichever feature you need afterwards.

1. **Connect Chrome:** prepare/load the extension folder, open extension settings, click Connect Mac app and confirm in the app. Chrome checks the helper automatically.
2. **Allow screen recording:** one macOS permission covers screen capture. Click Enable screen recording. macOS may offer to open its recording settings; enable OCR Companion there and return. The app does not immediately open a second Settings page. The same button offers Open recording settings if you need to return there.
3. **Finish:** if permission is usable immediately, Finish setup completes it without a restart. If macOS requires a relaunch, click Restart & finish setup. The app saves progress, quits and reopens its own installed copy. It rechecks permission and connection automatically and completes setup if both are ready. Usage instructions are shown before restarting. The final Ready screen is informational; Done only dismisses it.

If permission is still unavailable after reopening, the wizard stays on the required step and does not restart in a loop. If automatic reopening fails, open the app from Applications; progress is retained. Do not use an old reader tab after an app restart—open a new reading page from the OCR menu.

Set up later defers the wizard. Run it again from **Settings & setup… → Run setup wizard…**. A green dot and text indicate configured/connected; red indicates unavailable/not connected; Chrome has a separate checking state. Mac configuration is local registration, while Chrome checks actual helper access.

The optional prepared Chrome extension folder is `~/Library/Application Support/OCRCompanion/ChromeExtension`. Existing loaded folder contents are preserved. The release ZIP's 02-Chrome-Extension folder remains available for manual installation.


## Before you start

- macOS 14 or newer, on hardware supported by Apple Live Text. The app includes Apple Silicon and Intel binaries; availability is checked at runtime.
- Installed Google Chrome and your own working Migaku extension/account. This package does not include Migaku or provide access to paid Migaku features.
- No Terminal, Python, Node.js, compiler or Apple Developer account is needed to use the built app. Development tools are needed only to rebuild the source.
- The app is ad-hoc signed, without an Apple Developer ID or notarization. A macOS warning on first launch is expected. This beta has been tested on one Mac; testing by others is welcome.

## Install the Mac app

1. Extract the ZIP completely. Move **OCR Companion for Migaku.app** from **01-Mac-App** into Applications. Keep one installed copy.
2. Open the app. If macOS blocks it because the developer cannot be verified, review the source if you wish, then use **System Settings → Privacy & Security → Open Anyway** for this specific app. Follow the confirmation shown by macOS. Do not disable Gatekeeper globally.
3. The app opens a local reader in installed Google Chrome and adds **▣ OCR** to the Mac menu bar. Closing its settings window leaves the menu running.
4. Screen capture needs **Screen & System Audio Recording** (called Screen Recording on some macOS versions). Grant it to this installed app when prompted, then quit/reopen if macOS requests it. OCR does not require microphone/audio capture or Accessibility access.

Apple's first-launch instructions: https://support.apple.com/en-gb/102445

**Both functions are included:** the wizard sets up Chrome page reading and screen capture together. Use either whenever needed.

## Install the Chrome extension for comic tabs

1. Keep **02-Chrome-Extension** in a permanent location. Chrome loads files from this folder; do not delete or move it afterwards.
2. In Google Chrome, open **chrome://extensions**, enable **Developer mode**, choose **Load unpacked**, and select **02-Chrome-Extension**. Select the folder containing manifest.json, not the whole ZIP or release folder.
3. Pin **OCR Companion for Migaku** from Chrome's Extensions menu if convenient.
4. Move the Mac app into Applications and open it once so macOS can register its connection link.
5. Open the Chrome extension's **Options / Extension options**, then click **Connect Mac app**.
6. Allow Chrome/macOS to open OCR Companion if prompted. The app comes forward with the extension ID already supplied and a **Connect this Chrome extension?** confirmation. Click **Connect extension** only if you initiated this request.
7. Return to Chrome. Its settings page checks the helper automatically for up to 90 seconds. Once it shows **Connected to Apple Live Text**, setup is complete. You can also click **Check connection**.
8. Leave only one comic OCR extension/userscript active. Tampermonkey is not required.

**Manual fallback:** expand **Manual connection / troubleshooting** in Chrome and click **Copy ID for manual setup**. In the Mac OCR menu choose **Settings & setup…**, expand **Manual connection & troubleshooting**, paste into its editable field, and click **Connect Chrome extension**. The ID field in Chrome is intentionally read-only.

Pairing is specific to the Chrome extension ID. Each tester copies their own ID; never substitute the developer's ID. A changed folder/profile can produce a different ID and require reconnecting. Connecting replaces this user's existing OCR Companion for Migaku native-host registration, so keep the extension folder in its permanent location after setup.

## Read a comic in the same tab

1. Open a comic chapter you can normally access and scroll until the text is visible.
2. Click the extension icon once, or use **Option + Shift + O**. The in-tab overlay opens and reads immediately.
3. Read the selectable text beside the comic. Enable Migaku for that site, select **Full power**, and choose the matching study language for automatic vocabulary markings. Shift lookup remains available. Migaku may need initial language setup.
4. Click **Read page** after scrolling or turning a page. Use the site's own page controls when the overlay says **Use reader page controls**.
5. Drag the overlay header to move it; use its bottom-right grip to resize its width. Position and width are remembered locally and clamped to the current window.
6. **Options** contains OCR language, read mode, Capture visible area, navigation and OCR image preview. The preview shows the image actually sent to local OCR. Match OCR language to Migaku's study language independently; the app does not detect Migaku's language.

**Automatic mode** tries a supported full-source adapter and falls back to the visible screenshot. On generic websites, screenshot capture is the fallback. **Full source only** refuses fallback; **Visible area only** uses the current view. Automatic canvas cropping includes visible pages of a spread; reading order and small vertical lettering can still be imperfect.

### Optional area selection

Normal reading needs no drawn rectangle. Use **Select area** when menus, captions or artwork cause unwanted text. Drag around the text; it reads automatically. After the first selection you can drag another area without clicking Select area again. Wheel scrolling still works. **Escape / Stop selecting** pauses drawing but keeps the last area. **Clear area** returns to automatic reading. Selected areas reuse the same screen position after scrolling and expire after zoom/resize; they clear on reload.

The scope label distinguishes visible pages, full source and selected/expired area. Progress leaves the previous result visible. Failures keep previous text and offer **Retry**. Wait until the reader finishes moving/loading before retrying.

### Bilibili automatic word markings

On manga.bilibili.com, extension settings offer **Enable Bilibili compatibility**. It requests optional automatic access only to that manga domain and prepares a text container before Migaku loads. Reload the comic after enabling it. It does not capture or run OCR automatically. This is experimental compatibility with the tested Migaku version, not a Migaku API. It can be disabled in settings.

## Read a game, app or other screen text

1. Start the Mac app and leave its OCR menu running. Bring the target app/game and text into view.
2. Press **Option + Shift + S**, or choose **Capture screen area…** from **▣ OCR**. Draw around the text. Escape cancels.
3. The app hides its setup windows during selection. Recognition runs locally, and the result updates its connected reader in Google Chrome. Select that tab to study it with Migaku.
4. When text changes in the same location, press **Option + Shift + R** or choose **Capture same area again**. Keep the target visible: this captures current screen pixels, including anything covering the area.
5. Set **OCR language** in the OCR menu. Match it to Migaku's selected study language.
6. **Bring Chrome forward after capture**, in Settings & setup, is optional and off by default. It activates Chrome after recognition; it does not guarantee selecting the reader tab. Keep it off to stay in the game/app and view results later.

Captures update the same connected tab rather than opening a tab per capture. Explicit **Open reading page** can open another tab. Restarting the app starts a new session, so old tabs will stop receiving updates. Reloading a reader loses its in-memory connection key; reopen it from the OCR menu. Use one connected tab while testing. The reading page has Previous capture, Next capture and Back to latest; its heading distinguishes an earlier capture from the latest one.

### Capture history

The reader retains up to ten non-empty captures in page memory, with an aggregate text limit. **Previous capture** pauses updates while you study an older result. **Back to latest** resumes live updates. **Pause updates** is also available directly. **Clear history** removes that tab's history; **Clear history in this tab** clears the current reading tab; other tabs can retain their own text. Other open reader tabs can retain their own history. Closing/reloading a tab discards its history; the helper still holds its latest text until cleared or quit. Captures between polling intervals may be missed.

## Languages and website support

OCR language choices: Simplified Chinese, Traditional Chinese, Japanese, Korean, English, French, German, Spanish, Italian and Portuguese. Engine availability is checked on the Mac. Migaku learning-language support and setup are separate; not every OCR language has been verified with Migaku.

The website report lists **all 55 requested website entries**, with tested chapter links and limitations. The earlier automatic-parsing sweep classified **23 Working, 15 Partial and 17 Unavailable**. Those are dated sample-based observations, not a universal guarantee or a fresh full sweep of this renamed build. Baozi/Twmanga share a sample; Bilibili is the manga host and Bookwalker uses its trial viewer. Covers/notices and inaccessible readers are not treated as verified comic-dialogue passes.

Examples with actual comic text and automatic Migaku annotations include Bilibili Manga, Tencent Comics, Twmanga, Manhuagui, Webtoon, MangaOne, Tonari, Kadocomi, Magapoke, Gangan Online, Comic Gardo, Comic Action, Naver Webtoon, Ridi, Bomtoon, Kakao Webtoon, Lezhin, GlobalComix, Tappytoon and Cubari. Scope varies by sample; read the detailed report before assuming a whole site works. The extension can try other normal websites through generic capture without a dedicated adapter.

See **WEBSITE-COMPATIBILITY.md** for the full list. Protected pages, login/region gates, browser internal pages, other extensions' pages and some fullscreen/DRM content may be unavailable. No restricted access is bypassed. Games, multiple monitors, arbitrary display arrangements and fullscreen applications still need broader testing.

## Troubleshooting

- **Native helper unavailable:** open extension settings, click Connect Mac app and confirm in the app, then Check connection. Manual setup is available below if the app does not open. Recheck that you are using the same Chrome profile.
- **Recording permission repeats:** quit other app copies; enable the exact installed copy in System Settings and relaunch. Rebuilt ad-hoc apps can need permission approval again. Do not repeatedly reset permissions without checking the actual app path/message.
- **Reader says Failed to fetch / session expired:** the app quit or restarted, or the tab lost its key on reload. Use Open reader from the running app; close obsolete tabs yourself.
- **No text / wrong text:** verify language, visible target and crop. Use OCR image preview for browser captures. Retry after lazy loading finishes. Tiny/decorative/vertical text and artwork can confuse OCR.
- **Capture rejected because the tab/page moved:** keep the comic tab selected in its Chrome window and stop scrolling/page turns until recognition finishes, then Retry.
- **No automatic word markings:** enable Migaku on that site, Full power and the matching study language. Allow a moment after OCR for Migaku to parse. On Bilibili, try its optional compatibility setting. Shift lookup is a fallback. Some generic panel controls can also be annotated; this remains unresolved.
- **Shortcuts do nothing:** another app may own the shortcut. Use the OCR menu or Chrome extension button. A game can intercept keys.
- **Old CSP error on Mangaben:** old extension errors can remain after updating. Current navigation never executes javascript: page links. Use native reader controls and test a new read before treating old errors as current failures.

## Privacy and technical summary

Comic OCR uses Chrome Native Messaging to a local Apple VisionKit ImageAnalyzer helper. The helper's allowed_origins registration accepts the extension ID you connect. It uses Chrome's length-prefixed JSON protocol; there is no shared distribution token or browser OCR library. The native helper can run without the menu-bar app staying open after installation.

Screen OCR uses Apple's ScreenCaptureKit on demand and serves bundled HTML/CSS/JS plus a read-only current-text feed on **127.0.0.1**, using a random port and a fresh random 256-bit session key on every app launch. The key is initially in a URL fragment, removed by the page and kept in memory; authenticated polling uses a request header. Host/Origin/fetch-site/method/route limits protect the feed. It is not exposed to your network and has no HTTP screenshot, file-read, upload, OCR-control or remote-control endpoint. It is not a defense against malware or browser extensions already able to read the page.

Screenshots and recognized text are processed in memory. There is no bundled cloud OCR, analytics or transcript file. Browser page/history/extensions and Migaku can see what you intentionally display; Migaku's own networking follows its settings. Website image downloads still contact the image servers. Do not capture sensitive material you do not want available to Migaku or other authorized browser extensions.

Current internal identifiers: native host **local.ocrcompanion.reader**, user data **~/Library/Application Support/OCRCompanion/NativeHost**, and app bundle ID **local.ocrcompanion.app**. These identifiers belong to this app and its paired Chrome extension. The extension manifest version is **1.6.8**, shown with release label **1.0.0 beta 9**; native protocol/helper remains **1 / 1.1.1**.

## Source, removal and beta feedback

**04-Source** contains the exact release sources, build scripts and tests. Read SOURCE-AND-TESTS.md before rebuilding. No developer certificate, pairing file, session key or private token is distributed. Source is included for inspection; a separate open-source license has not been selected for this beta.

To remove: optionally use **Settings & setup… → Manual connection & troubleshooting → Remove native helper** (this removes the shared OCR Companion for Migaku native-host registration for your macOS user), remove the Chrome extension in chrome://extensions, quit the OCR app and delete its installed copy. Close reader tabs. Screen-recording permission can be removed in System Settings. Keeping an unpacked extension folder alone does not run it.

**Testing from others is welcome.** When reporting on Discord, include beta version, macOS version, Mac model/chip, Chrome/Migaku versions, language, comic URL or target app, the action taken, expected/actual result and exact error. Include a cropped screenshot only if comfortable sharing its contents. Never post tokens, reader URL fragments, personal text or unrelated browser information. Especially useful: clean-install experience, Intel Macs, second displays, zoom changes, Japanese vertical text, Korean and game capture.

## Automatic pairing details

Chrome's trusted Connect Mac app link uses `ocrcompanion://connect?extension_id=<this extension ID>`. The Mac app accepts only that exact route and one valid 32-character extension ID, rejecting callback URLs, extra parameters, credentials, ports and fragments. It asks for confirmation before installing/replacing the registration. There is no new pairing server, secret URL token, broad host permission or automatic screenshot. A website can attempt to invoke the scheme, which is why confirmation remains essential.

## Selecting comic text with Migaku enabled

Use **Read page** for automatic capture. **Select area** is optional: click it once, then drag around a speech bubble. Drag again to replace the area without clearing it first. Escape or **Stop selecting** pauses dragging; **Clear area** returns to automatic reading. Shift remains available for Migaku lookup. Enable Migaku on that website, use Full power, and select the same learning language in Migaku and OCR Companion. OCR alone does not enable Migaku or change your known-word profile.
