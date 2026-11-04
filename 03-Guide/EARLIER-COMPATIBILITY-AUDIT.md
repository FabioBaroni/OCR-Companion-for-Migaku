> Historical OCR Companion for Migaku audit retained for provenance. The rebranded beta uses the same OCR/Migaku approach; this is not a new all-site live sweep. Raw local development evidence paths mentioned below are not bundled.

# Comic-site compatibility audit

Updated: **3 November 2026**. Experimental OCR Companion for Migaku — Local Reader **1.5.2**, native helper **1.1.0**, macOS/Chrome on the development Mac. All **55 supplied URLs** are accounted for. This is a sample-based audit, not certification of an entire catalogue. Historical passes from 1.1.x/1.2.1 remain labeled in the evidence; the latest follow-ups used 1.4.0–1.5.0 with the same native OCR pipeline. See [comic-site-followup.md](comic-site-followup.md) for dated results and [persistent-area-selection.md](persistent-area-selection.md) for consecutive-drag testing.

Version 1.5.1 adds broader regression coverage and rejects stale full-source and changed-chapter results; see [regression-testing.md](regression-testing.md). The extended 1.5.2 follow-up adds a Manhuagui comic pass and accounts for all 55 rows, keeping actual OCR checks, access gates, prior safety denials and shared aliases distinct. See [extended-website-regression.md](EARLIER-OCR-REGRESSION.md).

## Main findings and evidence boundaries

Generic Chrome screenshot → native Apple OCR remains the common foundation. New public samples passed on MangaOne, Gangan Online, ebookjapan, Kakao Page, Kakao Webtoon, MANGA Plus, Tapas (selected area), Bomtoon, Lezhin and Tappytoon/INKR, alongside the existing Chinese and Japanese adapters. Webtoon Traditional Chinese and Baozi → Twmanga routing are now independently verified. Version 1.5.0 adds six capture-only Japanese adapters with fresh cropped comic OCR passes; Toomics Korean now passes too. Only Bilibili’s supplied video-root URL and BookWalker’s requested main-host scope remain Partial. See [partial-reader-improvements.md](partial-reader-improvements.md) for exact results and limits.

The final RIDI and Cubari samples now pass native OCR (selected-area tests). Naver Series was investigated on two titles but remains **Unavailable** for end-to-end testing: episode lists stayed empty and its official guide directs readers to a separately installed desktop viewer. No entries remain uninvestigated/Untested; Unavailable still does not establish compatibility. Unavailable records distinguish network/region/login/tool restrictions from extension failures. No paid or restricted access was bypassed. Working means only the stated sample/method/language. OCR accuracy, other chapters, every navigation mode and every zoom level are not guaranteed.

Version 1.4.1 adds one isolated panel-style fix: enforce the HTML hidden attribute inside OCR Companion for Migaku so site CSS cannot reveal collapsed controls. Kakao Webtoon exposed the issue; hidden controls and collapse were retested there. No additional host permissions, adapter, OCR service or native helper update was needed.

**OCR-to-page coordinates are not implemented on any site.** The native helper returns transcript lines containing text only. Screenshot cropping computes image bounds, and now preserves capture transforms, but does not expose recognized-word/line rectangles. Existing selectable panel text and Migaku Shift lookup can work independently of spatial mapping. No site in this report is verified for text precisely overlaid on its original speech bubbles. This finding applies equally to every row, including Working rows.

The broader survey uses official roots, linked catalog/episode pages and live Chrome tests where reached. Some web responses are cached (notably Champion Cross five months, TakeComic three months, and some episodes several weeks/months). “Retrieved” records accessible evidence, not a fresh network uptime guarantee. Timeouts, 403/503, a robots denial, and tool failures do not prove a site is globally inactive. Unknown renderers remain unknown; similarity of URLs is not renderer evidence.

## Classification and estimates

- **Working:** Existing OCR-to-selectable-text workflow verified end-to-end on the linked sample in the current native implementation. Does not promise every chapter, source mode, screenshot mode, zoom, locale, Migaku highlighting or spatial mapping.
- **Partial:** A related reader or part of the workflow works, with the precise limits stated.
- **Unsupported:** Actual current implementation failure confirmed on visible comic content. None assigned merely because a site could not be reached.
- **Untested:** No end-to-end result for the requested site/locale; a root or candidate may have been found.
- **Unavailable:** Reader testing prevented by a concrete availability, access or tool limitation. This is not an extension verdict.

“Existing support” describes source configuration, not a second success rating. “Generic capture only” means user-invoked active-tab capture is available in the code, **not verified on that website**. Reader types are observed on the sample or explicitly labeled uninspected. Difficulty estimates concern getting a useful visible-content capture/crop/navigation experience; they exclude access to restricted content and the separate global coordinate project. Low ≈ configuration/small crop adapter; Medium ≈ dynamic reader/navigation work; High ≈ substantial reader/access investigation. Unknown means insufficient evidence to estimate responsibly.

Priorities are independent of effort: **P0** major platform/high learning value/straightforward useful integration; **P1** valuable next addition; **P2** niche, low-confidence or expensive relative to verified benefit. Priority does not imply legal access, reliable service or a working implementation.

## Compatibility matrix

| Website | Language | Existing support | Verified working | Reader type | Difficulty | Priority | Notes |
| ------- | -------- | ---------------- | ---------------- | ----------- | ---------- | -------- | ----- |
| [www.kuaikanmanhua.com](https://www.kuaikanmanhua.com) | Chinese, Simplified | Kuaikan adapter | **Working** | HTML images | Low | P0 | [Site 1](#site-1): Native source OCR passed. Image CDN kkmh.com is configured; scrolling must expose a loaded page. |
| [ac.qq.com](https://ac.qq.com) | Chinese, Simplified | QQ Comics adapter | **Working** | HTML image reader | Low | P0 | [Site 2](#site-2): Native source OCR passed. Referrer and acimg.cn access are configured; recheck dynamic page replacement after chapter changes. |
| [www.baozimh.com](https://www.baozimh.com) | Chinese, Traditional | Baozi adapter; reader alias | **Working** | Lazy AMP/HTML images; vertical chapter | Low–Medium | P0 | [Site 3](#site-3): Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested. |
| [www.colamanga.com](https://www.colamanga.com) | Chinese | Generic capture only | **Unavailable** | Unknown; no reader reached | Unknown | P2 | [Site 4](#site-4): A Colamanga-to-Yoyomanga root route is now observed. The selected title still returns Origin is unreachable 523; no OCR verdict and no general outage claim. |
| [www.manben.com](https://www.manben.com) | Chinese, Simplified | Mangaben adapter; capture only | **Working** | Paginated HTML image/custom reader | Low–Medium | P0 | [Site 5](#site-5): Native screenshot OCR passed on an interior page. Slow loading, watermarks and page numbers; use reader pagination. Source extraction was unreliable, hence capture-only configuration. Version 1.5.2 disables unreliable scripted Next page; use native page controls/scrolling. Native navigation plus interior OCR was reverified. |
| [www.dongmanmanhua.cn](https://www.dongmanmanhua.cn) | Chinese, Simplified | Dongman adapter configured | **Unavailable** | HTML images; 1-pixel transparent placeholders | Medium | P0 | [Site 6](#site-6): Rechecked live Chrome. Dismissed informational youth-mode notice without changing settings, scrolled, and confirmed all five comic images still naturalWidth/naturalHeight 1 with transparent src. Reader visibly blank after notice. No actual comic OCR possible; underlying cause not established. |
| [www.bilibili.com](https://www.bilibili.com) | Chinese, Simplified | Generic on www; Bilibili Manga adapter on manga subdomain | **Partial** | Video root; manga canvas reader verified separately | Low–Medium | P0 | [Site 7](#site-7): The supplied www host is not the comic reader. manga.bilibili.com screenshot OCR passed. Canvas extraction failed previously; capture works. Adapter hides navigation; turn off danmaku to avoid comments in OCR. |
| [www.creative-comic.tw](https://www.creative-comic.tw) | Chinese, Traditional | Creative Comic canvas adapter | **Working** | Canvas custom reader | Low–Medium | P0 | [Site 8](#site-8): Native canvas-source OCR passed, including vertical Traditional Chinese. Reader needs loading/scrolling before a useful page is visible; screenshot fallback remains available. Version 1.5.2 disables unreliable scripted Next page; use native page controls/scrolling. Native navigation plus interior OCR was reverified. |
| [www.manhuagui.com](https://www.manhuagui.com) | Chinese (Simplified sample tested) | Generic capture only | **Working** | HTML image custom paginated reader | Low–Medium | P1 | [Site 9](#site-9): Generic native screenshot OCR verified actual Chinese comic dialogue on a public Robin chapter. No source adapter needed. One selected viewport at normal zoom; visible ads/controls can contaminate other captures. Traditional Chinese accuracy and entire catalogue not verified. |
| [www.manhuahao.com](https://www.manhuahao.com) | Chinese, Simplified | Manhuahao rendered-image adapter | **Working** | Blob-backed HTML images | Low–Medium | P1 | [Site 10](#site-10): Native source OCR passed on an interior page. Blob images require rendered-image extraction or screenshot; changing page nodes can invalidate selection. |
| [www.36mh.org](https://www.36mh.org) | Chinese, Simplified | 36mh adapter | **Working** | Lazy-loaded HTML images | Low | P1 | [Site 11](#site-11): Native source OCR passed. Image host 546457.xyz is configured. Wait for naturalWidth rather than placeholder dimensions before reading. |
| [www.dumanwu.com](https://www.dumanwu.com) | Chinese, Simplified | Dumanwu adapter | **Working** | HTML image chapter | Low | P1 | [Site 12](#site-12): Native source OCR passed. shimolife.com/referrer configured; preview and decorative lettering can produce noise. Full catalogue access not established. |
| [www.webtoons.com/zh-hant/](https://www.webtoons.com/zh-hant/) | Chinese, Traditional | Webtoon adapter; zh-hant locale default fixed | **Working** | Lazy HTML images | Low | P0 | [Site 13](#site-13): Actual public first episode opened in Chrome; source OCR returned dialogue. Locale explicitly selected. Full chapter traversal not tested. |
| [www.twmanga.com](https://www.twmanga.com) | Chinese, Traditional | Baozi adapter matches chapter path | **Working** | Lazy AMP/HTML images; vertical chapter | Low–Medium | P1 | [Site 14](#site-14): Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested. |
| [www.yoyomanga.com](https://www.yoyomanga.com) | Chinese | Generic capture only | **Unavailable** | Unknown; reader unavailable | Unknown | P2 | [Site 15](#site-15): Root/catalog availability does not establish chapter access. Selected title still failed with origin-unreachable 523; no actual comic OCR. |
| [manga.line.me](https://manga.line.me) | Japanese | Generic capture only | **Unavailable** | Region gate; no comic pixels | Medium | P0 | [Site 16](#site-16): Live Chrome explicitly states service only available from Japan. No bypass attempted; no OCR verdict. |
| [manga-one.com](https://manga-one.com) | Japanese | Generic capture only | **Working** | HTML images in custom paginated reader | Medium | P0 | [Site 17](#site-17): Actual public first page loaded after JS initialization. Generic screenshot recognized 16 lines including reader labels; optional manual crop recognized 13 comic lines without footer UI. No source adapter. Automatic language/global preference and pagination need manual controls; whole chapter not traversed. |
| [viewer.bookwalker.jp](https://viewer.bookwalker.jp) | Japanese | Generic capture only | **Partial** | Viewport canvas trial reader; horizontal spreads | Medium–High | P1 | [Site 18](#site-18): Focused reader with a central click before Left. Public trial now displays actual interior dialogue; native OCR returned Japanese dialogue plus artwork/small-text errors. Requested viewer.bookwalker.jp itself still not reached; only viewer-trial.bookwalker.jp verified. No paid-reader or exact-host support claim. |
| [takecomic.jp](https://takecomic.jp) | Japanese | Generic capture only | **Unavailable** | Network-access restriction notice | Medium | P1 | [Site 19](#site-19): Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict. |
| [tonarinoyj.jp](https://tonarinoyj.jp) | Japanese | Capture-only canvas adapter | **Working** | Canvas GigaViewer; horizontal pages | Low–Medium | P0 | [Site 20](#site-20): 1.2.x live native screenshot pass: 8 lines, 0.31 s, Japanese selected. Comic crop returned vertical dialogue. Manual horizontal reader controls remain necessary. |
| [www.sunday-webry.com](https://www.sunday-webry.com) | Japanese | Sunday Webry capture-only adapter | **Working** | Canvas custom reader | Low–Medium | P0 | [Site 21](#site-21): Cropped one visible canvas on opening and after a native page turn. Site metadata/control labels excluded. Editorial notes printed inside comic and furigana recognition errors remain. |
| [www.comico.jp](https://www.comico.jp) | Japanese | Generic capture only | **Unavailable** | Service wind-down/library-only access; no anonymous chapter reached | Medium | P2 | [Site 22](#site-22): Official 17 Aug 2026 notice, updated 15 Sep, states new releases/signup stopped 31 Aug, sales/rentals stopped 28 Sep 2026, service ends 6 Jan 2027. Purchased-library reading remains until then. Root now emphasizes library/migration; no public chapter verified. Not yet fully closed, and not an OCR failure. |
| [shonenjumpplus.com](https://shonenjumpplus.com) | Japanese | Capture-only canvas adapter | **Working** | Canvas GigaViewer; horizontal pages | Low–Medium | P0 | [Site 23](#site-23): 1.2.x live native screenshot pass on public Spy Family page: 22 lines, 0.28 s, Japanese selected. Crop excludes surrounding promotional area. Use the reader's own horizontal page controls; OCR accuracy is imperfect. |
| [comic.pixiv.net](https://comic.pixiv.net) | Japanese | Generic capture only | **Unavailable** | Unknown; automation safety block | Medium | P1 | [Site 24](#site-24): Live browser navigation explicitly rejected by site-safety policy. No alternate tool/browser/network route attempted. No conclusion about public site availability or extension compatibility. |
| [comic-days.com](https://comic-days.com) | Japanese | Capture-only canvas adapter | **Working** | Canvas GigaViewer; horizontal pages | Low–Medium | P0 | [Site 25](#site-25): 1.2.1 live native Japanese OCR pass: 13 lines, 0.17 s, on public first episode. Comic crop excludes controls/reward text. Use site controls for horizontal pagination. |
| [comic-walker.com](https://comic-walker.com) | Japanese | Kadocomi capture-only adapter | **Working** | Canvas custom reader | Medium | P0 | [Site 26](#site-26): Clicked native left page-turn arrow, then recognized interior dialogue. Automatic crop excluded site header/metadata. Selector uses the observed pageCanvasWrapper class stem rather than generated hash; future DOM changes may need maintenance. |
| [pocket.shonenmagazine.com](https://pocket.shonenmagazine.com) | Japanese | Magapoke capture-only adapter | **Working** | Canvas custom reader | Medium | P0 | [Site 27](#site-27): Actual first comic page cropped automatically. Result excludes fullscreen/zoom controls, chapter metadata and social links; embedded English dialogue remains part of comic. Use native pagination. |
| [www.ganganonline.com](https://www.ganganonline.com) | Japanese | Generic capture only | **Working** | HTML images; horizontal custom spread reader | Medium | P0 | [Site 28](#site-28): Actual public comic spread loaded anonymously. Generic capture recognized Japanese dialogue without site-UI contamination in this viewport. Use reader controls; extension Next page does not implement this pagination. No source adapter; whole chapter/zoom variants untested. |
| [manga.nicovideo.jp](https://manga.nicovideo.jp) | Japanese | Generic capture only | **Unavailable** | Unknown; automation safety block | Medium | P1 | [Site 29](#site-29): Live browser action explicitly rejected by site-safety policy. No alternate route attempted. No conclusion about global site availability or extension behavior. |
| [kuragebunch.com](https://kuragebunch.com) | Japanese | Kurage Bunch capture-only adapter | **Working** | Canvas custom reader | Low–Medium | P1 | [Site 30](#site-30): Scrolled vertically past cover to dialogue. Automatic crop excluded fullscreen/zoom labels. Scroll normally using wheel; extension navigation is intentionally disabled in this conservative adapter. |
| [piccoma.com](https://piccoma.com) | Japanese | Generic capture only | **Unavailable** | Region gate; no comic pixels | Medium–High | P0 | [Site 31](#site-31): Live Chrome explicitly states this page can only be viewed from Japan. No bypass attempted; no OCR verdict. |
| [ebookjapan.yahoo.co.jp](https://ebookjapan.yahoo.co.jp) | Japanese | Generic capture only | **Working** | Canvas custom viewer; paginated spreads | Medium | P0 | [Site 32](#site-32): Observed free book listing opened anonymous /viewer/free/ route. Dismissed new-viewer notice and used native Left key through cover/contents to real dialogue. No adapter/host additions. Campaign free window advertised through Nov 18; availability can change. Whole book and purchased content untested. |
| [www.cmoa.jp](https://www.cmoa.jp) | Japanese | Generic capture only | **Unavailable** | Access restriction notice | Medium | P1 | [Site 33](#site-33): Live Chrome explicitly says access from abroad or VPN environments is restricted. Did not change network/security settings or attempt bypass. No comic pixels or OCR verdict. |
| [comic-gardo.com](https://comic-gardo.com) | Japanese | Comic Gardo capture-only adapter | **Working** | Canvas custom reader | Low–Medium | P1 | [Site 34](#site-34): Used native page controls twice past title spread. Native screenshot recognized interior dialogue without surrounding title/promotion/UI. Small Japanese/furigana errors remain. |
| [comic-action.com](https://comic-action.com) | Japanese | Comic Action capture-only adapter | **Working** | Canvas custom reader | Low–Medium | P1 | [Site 35](#site-35): Used native page controls twice to interior dialogue. Automatic canvas crop returned comic text without site metadata. Stylized lettering/furigana errors remain. |
| [championcross.jp](https://championcross.jp) | Japanese | Generic capture only | **Unavailable** | Network-access restriction notice | Medium | P1 | [Site 36](#site-36): Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict. |
| [comic.naver.com](https://comic.naver.com) | Korean | Capture-only image adapter | **Working** | HTML images; long vertical strips | Low–Medium | P0 | [Site 37](#site-37): 1.2.1 live native Korean OCR pass: 4 lines, 0.24 s. At 110% Chrome zoom / DPR 2.2: 3 lines, 0.21 s, 1100 px comic crop. Long strips use incremental window scrolling; browser zoom restored. |
| [page.kakao.com](https://page.kakao.com) | Korean | Generic capture only | **Working** | Lazy/positioned HTML image tiles; vertical webtoon | Medium–High | P0 | [Site 38](#site-38): Explicitly free first webtoon episode opened without login. Opening panels had no dialogue and returned 0/1 lines; scrolled into actual dialogue, which native OCR read. Decorative marks also recognized. No adapter; paid episodes and whole chapter untested. |
| [ridibooks.com](https://ridibooks.com) | Korean | Generic capture only | **Working** | HTML images; horizontal spread preview reader | Medium–High | P1 | [Site 39](#site-39): Public preview reached through the official free-comic selection and book Preview link, without login. Used the visible previous arrow to move cover 1/89 to interior spread 2/89. Native Korean OCR recognized narration/dialogue in generic and selected-area modes. Manual crop still included page counter/artwork noise; it is not a perfect automatic comic-bound crop. Only sample spread/navigation tested; purchased books and all zooms unverified. |
| [www.bomtoon.com](https://www.bomtoon.com) | Korean | Generic capture only | **Working** | Lazy HTML images; vertical custom reader | Medium–High | P2 | [Site 40](#site-40): Public free first episode opened without login or age verification. Scrolled past opening art to narration; Korean native OCR recognized the visible caption. Reader UI can contaminate other viewports; optional crop available. Full chapter not traversed. |
| [series.naver.com](https://series.naver.com) | Korean | Generic capture only | **Unavailable** | Empty browser episode list; official separate desktop comic viewer | Medium–High | P1 | [Site 41](#site-41): Live all-ages free title 13704861 and second title 2184106 both showed empty episode lists. Closing the viewer tip and selecting first-episode order did not expose chapters. Official /comic/viewer/install/guide offers Windows/Mac desktop viewers and instructs login in that viewer. No public browser comic pixels or native OCR test was possible here. No viewer installed or login performed. This is an environment/access limitation, not a confirmed failure on a visible browser comic or a claim that every title is native-only. |
| [webtoon.kakao.com](https://webtoon.kakao.com) | Korean | Generic capture only | **Working** | Positioned HTML image tiles; vertical scroll reader | Medium–High | P0 | [Site 42](#site-42): Free first episode/intro opened anonymously; Korean comic prose recognized before and after scrolling. Site CSS overrode hidden panel controls; v1.4.1 scoped hidden rule fixed it, verified Clear area display:none and actual collapse. No adapter needed; paid access/whole series untested. |
| [www.toomics.com](https://www.toomics.com) | Korean / localized international | Generic capture only | **Working** | Lazy HTML images; vertical reader | Medium | P1 | [Site 43](#site-43): Selected Korean through official language menu. Catalog-linked non-adult version first free episode opened without login or age verification. Scrolled to actual dialogue; native Korean OCR returned three dialogue lines plus two sound effects. No adapter needed. Italian locale also passed in earlier evidence; other chapters/modes untested. |
| [www.mrblue.com](https://www.mrblue.com) | Korean | Generic capture only | **Unavailable** | Login gate; comic renderer unverified | Medium–High | P1 | [Site 44](#site-44): Live root and public series wt_000079023 loaded. First free episode opened a reader tab requiring login. No login or OCR attempted. |
| [www.webtoons.com](https://www.webtoons.com) | Multilingual; tested English | Webtoon adapter | **Working** | Lazy-loaded HTML images | Low | P0 | [Site 45](#site-45): Native source OCR passed with English selected. Different locales/free windows require their own checks; Traditional Chinese row remains separate. Scroll past title-only covers. |
| [www.lezhin.com](https://www.lezhin.com) | Multilingual; root Korean | Generic capture only | **Working** | Blob-backed HTML images; vertical reader | Medium | P1 | [Site 46](#site-46): All-ages first free episode opened without login. Native screenshot recognized narration; decorative/arrow noise also returned. Scroll past copyright opening panel. No source adapter or full chapter test. |
| [globalcomix.com](https://globalcomix.com) | Multilingual; tested English | GlobalComix adapter | **Working** | HTML images/custom paginated reader | Low–Medium | P0 | [Site 47](#site-47): Native source OCR passed on free Monica+Michael sample. Reader CDN access configured. Page/spread zoom and alternate reader layouts still need broader tests. |
| [mangadex.org](https://mangadex.org) | Multilingual | Generic capture only | **Unavailable** | Unknown; browser access blocked | Unknown | P0 | [Site 48](#site-48): No alternate route attempted. Manual testing required; neither site closure nor extension failure established. High user value keeps priority P0 despite unknown effort. |
| [mangaplus.shueisha.co.jp](https://mangaplus.shueisha.co.jp) | Multilingual | Generic capture only | **Working** | Lazy HTML images; vertical web viewer | Medium | P0 | [Site 49](#site-49): Free English RuriDragon chapter 53 opened via observed viewer link; optional cookies rejected. Scrolled past cover/text-free panels to dialogue. Native screenshot recognized it. No adapter/permissions added. Other locales, app-only free reading and paid chapters untested. |
| [tapas.io](https://tapas.io) | Multilingual; tested English UI/title | Generic capture; no adapter | **Working** | Lazy HTML images; vertical scroll with sticky sidebar/header | Low–Medium | P0 | [Site 50](#site-50): Native generic capture recognized actual interior dialogue after scrolling, alongside extensive sidebar/header/cookie text. Optional selected-area capture returned only the speech bubble. Prior title-only evidence is superseded. Reader canonicalized series URL to /episode/2135770 while scrolling. Paid/locked episodes not tested. |
| [www.tappytoon.com](https://www.tappytoon.com) | Multilingual | Generic capture only | **Working** | Lazy HTML images; vertical reader | Medium | P1 | [Site 51](#site-51): Free Solo Leveling episode 1 opened anonymously through catalog. Native English OCR recognized actual narration after scrolling past art. Paid episodes and other locales untested. |
| [comick.io](https://comick.io) | Multilingual | Generic capture only | **Unavailable** | Unknown; reader not reached | Unknown | P2 | [Site 52](#site-52): No alternate route/tool/browser attempted. No liveness, closure, redirect or OCR verdict can be established here. |
| [bato.to](https://bato.to) | Multilingual | Generic capture only | **Unavailable** | Other: redirected closure destination | Unknown | P2 | [Site 53](#site-53): Observed destination states this website has been closed due to copyright infringement. No Bato reader reached; no mirrors/replacements followed or notice counted as OCR compatibility. |
| [cubari.moe](https://cubari.moe) | Multilingual; content-dependent | Generic capture only | **Working** | HTML images; custom paginated/scrollable Imgur reader | Low–Medium | P1 | [Site 54](#site-54): Concrete publicly indexed Imgur-backed comic sample loaded on exact cubari.moe host. Used Right twice past introductory pages to actual Japanese dialogue (URL settled on page 3). Generic OCR returned dialogue plus sidebar/artwork noise (13 lines/.34 s); selected speech-bubble crop returned one clean Japanese sentence. No new adapter or permissions. Other Cubari backends, manifest formats, languages, whole-chapter traversal and all zooms untested; no MangaDex proxy used. |
| [comics.inkr.com](https://comics.inkr.com) | Multilingual; tested listing English | Generic capture only | **Working** | Lazy HTML images in custom zoomable vertical reader | Medium | P1 | [Site 55](#site-55): Public free preview opened without account. Dismissed marketing offer, scrolled past covers to interior dialogue. Native OCR recognized three comic sentences at displayed 59% reader zoom. Other zoom levels, paid pages and full chapter untested. |

Status totals: Working: **37**, Partial: **2**, Unsupported: **0**, Untested: **0**, Unavailable: **16**.

## Pipeline, permissions and coordinate assessment shared by all sites

The current flow is user invocation → inject the text panel → native helper health check → source attempt in Automatic mode → screenshot fallback → Apple Live Text/VisionKit in the Mac host → selectable DOM paragraphs. “Read page” reads one selected source image or the current visible area; it does not OCR an entire chapter automatically. **Full source only** fails on sites without a source adapter; use **Automatic** or **Visible area only** when testing generic readers.

| Check | Current behavior and audit implication |
| --- | --- |
| Cross-origin/CORS | Chrome tab screenshots capture composited visible pixels; they do not require reading a tainted canvas or downloading each cross-origin image. This is the preferred route for new sites. Direct source extraction still depends on allowed image hosts, extension host permissions, correct referrer, cookies and readable canvas pixels. A CDN extraction failure is not a screenshot failure. |
| Extension permissions | `activeTab`, `scripting`, `storage`, `nativeMessaging`, `declarativeNetRequestWithHostAccess`; source host permissions only for configured CDNs. User invocation grants ordinary active-tab access; unlisted websites are not categorically blocked by the current manifest. Invoke again on a changed origin/new reader tab. Browser-internal pages are outside this workflow. No new broad host permissions are needed just to test generic visible capture. |
| Dynamic DOM / SPA | Adapter candidates are queried at read time. Generic capture has no comic selector. Tab/URL changes, scroll revisions, visual viewport size/offset/scale and selected comic identity/rectangle are checked during screenshot capture and before result delivery. Same-canvas pixel redraws without observable DOM changes remain a limitation; reread after navigating. |
| Lazy loading / vertical scroll | Only loaded, visible pixels exist for screenshots. Scroll within the reader and wait for real comic pixels. A placeholder or title-only cover is not evidence of OCR failure. No whole-chapter stitching, automatic lazy-load sweep or deduplication is implemented. |
| Zoom / scaling | Screenshot cropping uses bitmap-width/viewport-width and bitmap-height/viewport-height ratios rather than assuming devicePixelRatio. Useful at a stable viewport, but browser zoom, pinch/visual viewport, CSS transforms, multi-column pages and fullscreen have not been systematically verified. At low zoom OCR loses resolution. |
| Pagination / internal scrollers | Extension Next page uses a configured next selector, the next image, or window scrolling. It does not generally drive horizontal carousel readers, iframe scrollers or virtualized page navigation. Use the site's controls until an adapter is validated. |
| UI / comments / background images | Screenshot captures visible menus, ads, cookie notices, watermarks and danmaku too. Bilibili has specific hide selectors; new sites do not. Background images and composited canvases are plausible screenshot inputs, but no untested renderer is promoted to Working on that basis. |
| Protected/restricted content | No login, purchase, app-only access, age/region restriction or protected capture bypass was attempted. Generic screenshot cannot make absent/blocked/black content readable. Public catalog text is not proof of anonymous chapter access. Region restrictions remain unknown unless stated in a site record. |
| Native OCR language | Select Japanese (`ja-JP`), Korean (`ko-KR`) or the appropriate Chinese/Latin language before a test. The saved choice is global and takes precedence over adapter defaults. Unconfigured sites default to Simplified Chinese; Webtoon zh-hant defaults to Traditional Chinese unless a saved language overrides it. Language dropdown availability alone does not verify accuracy for every site. |
| Native limits | Current host accepts bounded images (16 MiB encoded-image input limit, 40 MP/20k side validation); source conversion has additional limits. Screenshot is a sensible fallback for very tall pages. Errors should be recorded with the exact mode and preview. |
| Coordinates: M0 on all 55 rows | Host returns `lines: [{text: ...}]`, no boxes. `geometry()` returns selected element viewport bounds only. Capture now retains its actual crop/scale/view metadata and has tested rectangle-conversion math; the native OCR response still supplies no boxes. Text panel positioning is independent of the comic. Correct OCR-coordinate mapping cannot currently be verified. |

For future spatial mapping, keep Apple OCR and first choose a native API that exposes recognized-region rectangles. Return rectangles, coordinate origin/convention and image dimensions; preserve the exact capture crop, scale, scroll position, visual viewport and page revision with the request/result. With bottom-left normalized OCR boxes, conversion into viewport CSS coordinates would be `left = cropLeft + x * imageWidth / scaleX`, `top = cropTop + (1-y-height) * imageHeight / scaleY`. Add scroll offsets only for document-coordinate overlays. Reject stale results after scroll/zoom/page replacement; separately handle contain/cover letterboxing, transforms, iframes and source-image versus screenshot dimensions. Native box output and positional overlays remain a proposed design. Capture transform retention and conversion math are implemented and unit tested in 1.2.1; real text-box mapping is not verified because boxes are absent.

## Per-site evidence and adapter recommendation

Every record inherits the permissions, scaling, scrolling, restriction and **M0 coordinate limitation** above. “Plausible” below is an engineering inference, never a verification claim. When no reader was reached, exact rendering, capture behavior, coordinates on live content, region rules and navigation remain unverified rather than being guessed.

<a id="site-1"></a>

### 1. www.kuaikanmanhua.com

**Domain/redirect:** Catalog retrieved; no redirect reported. [Requested URL](https://www.kuaikanmanhua.com).

**Public chapter/sample:** [Candidate or tested page](https://www.kuaikanmanhua.com/webs/comic-next/682699). Native regression: pass; source page; 2 lines. Verified native source OCR and Migaku annotations earlier in this same build session.

**Rendering and existing support:** HTML images. Kuaikan adapter. Native source OCR passed. Image CDN kkmh.com is configured; scrolling must expose a loaded page.

**Latest regression:** Earlier representative regression — Earlier v1.5.1 regression. Native full-source Simplified Chinese: 1 line / .17 s; After scrolling: source-empty fallback returned 0 lines / .05 s. Scrolled sections showed white/brand placeholders; no second text-rich source pass established. Do not count placeholders as a successful interior dialogue test. Baseline source transport passed; lazy loading remains an observed limitation.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-2"></a>

### 2. ac.qq.com

**Domain/redirect:** Catalog retrieved; no redirect reported. [Requested URL](https://ac.qq.com).

**Public chapter/sample:** [Candidate or tested page](https://ac.qq.com/ComicView/index/id/644371/cid/2). Native regression: pass; source page; 7 lines. Simplified Chinese selected.

**Rendering and existing support:** HTML image reader. QQ Comics adapter. Native source OCR passed. Referrer and acimg.cn access are configured; recheck dynamic page replacement after chapter changes.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass after retry. Source OCR: 7 lines/.31 s, actual narration, 1320x2200 preview; Starting Read during Next page smooth scroll rejected stale result; Final v1.5.2 settled Next page recovery: different source dialogue 1 line/.17 s. Retry after the smooth scroll/layout settles; no stale result was delivered.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-3"></a>

### 3. www.baozimh.com

**Domain/redirect:** Live Chrome follow-up: Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested. [Requested URL](https://www.baozimh.com).

**Public chapter/sample:** [Candidate or tested page](https://www.twmanga.com/comic/chapter/yaoshenji-taxuedongman/0_0.html). Native OCR: 7 lines; source page; zh-Hant. Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested.

**Rendering and existing support:** Lazy AMP/HTML images; vertical chapter. Baozi adapter; reader alias. Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass after retry. Initial lazy-layout source read rejected as reader changed; Next page then settled retry recognized interior prose: 7 lines/.31 s, 800x1131 source. Alias reader checked once, not two independent root-to-reader routes; global Simplified Chinese preference used.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-4"></a>

### 4. www.colamanga.com

**Domain/redirect:** Live requested root landed on a Yoyomanga COLAMANGA-branded catalogue. [Requested URL](https://www.colamanga.com).

**Public chapter/sample:** [Candidate or tested page](https://www.yoyomanga.com/manga-hg70402/). Catalog-linked title returned Cloudflare 523; no comic reader verified.

**Rendering and existing support:** Unknown; no reader reached. Generic capture only. A Colamanga-to-Yoyomanga root route is now observed. The selected title still returns Origin is unreachable 523; no OCR verdict and no general outage claim.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Requested Colamanga root landed on a Yoyomanga COLAMANGA-branded catalogue; Selected catalog-linked title /manga-hg70402/ returned Cloudflare 523. This now establishes an observed root redirect in this session; still no readable comic chapter. Not a global outage claim.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-5"></a>

### 5. www.manben.com

**Domain/redirect:** Catalog retrieved; no redirect reported. [Requested URL](https://www.manben.com).

**Public chapter/sample:** [Candidate or tested page](https://www.manben.com/m426476/). Native regression: pass; visible area; 9 lines. Native Chrome capture of narration page; reader initially loaded slowly. Page number/watermark also recognized.

**Rendering and existing support:** Paginated HTML image/custom reader. Mangaben adapter; capture only. Native screenshot OCR passed on an interior page. Slow loading, watermarks and page numbers; use reader pagination. Source extraction was unreliable, hence capture-only configuration. Version 1.5.2 disables unreliable scripted Next page; use native page controls/scrolling. Native navigation plus interior OCR was reverified.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass with navigation issue. Screenshot cover OCR 4 lines/.30 s; Extension Next page then read: same cover 4 lines/.29 s; Native visible right-arrow click reached interior spread 2/8; Simplified Chinese interior cropped screenshot: 9 lines/.37 s; After user reload: v1.5.2 Use reader page controls disabled; Read page remains available and cover OCR 4 lines/.44 s. Extension Next page failed to establish page change; native reader arrow works. Use native page controls.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-6"></a>

### 6. www.dongmanmanhua.cn

**Domain/redirect:** Live Chrome follow-up: Rechecked live Chrome. Dismissed informational youth-mode notice without changing settings, scrolled, and confirmed all five comic images still naturalWidth/naturalHeight 1 with transparent src. Reader visibly blank after notice. No actual comic OCR possible; underlying cause not established. [Requested URL](https://www.dongmanmanhua.cn).

**Public chapter/sample:** [Candidate or tested page](https://www.dongmanmanhua.cn/COMEDY/hualeshenme/%E7%AC%AC1%E8%AF%9D-%E5%81%A5%E5%BF%98%E5%A4%A7%E8%B5%9B/viewer?title_no=810&episode_no=1). No end-to-end comic OCR verified. Rechecked live Chrome. Dismissed informational youth-mode notice without changing settings, scrolled, and confirmed all five comic images still naturalWidth/naturalHeight 1 with transparent src. Reader visibly blank after notice. No actual comic OCR possible; underlying cause not established.

**Rendering and existing support:** HTML images; 1-pixel transparent placeholders. Dongman adapter configured. Rechecked live Chrome. Dismissed informational youth-mode notice without changing settings, scrolled, and confirmed all five comic images still naturalWidth/naturalHeight 1 with transparent src. Reader visibly blank after notice. No actual comic OCR possible; underlying cause not established.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Chapter UI loaded after navigation timeout; All five comic img natural dimensions remained 1x1. No actual comic pixels; no OCR verdict.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-7"></a>

### 7. www.bilibili.com

**Domain/redirect:** Web retrieval redirected to /blackboard/fe/activity-CjJbuaD7Xw.html, a browser-compatibility page. [Requested URL](https://www.bilibili.com).

**Public chapter/sample:** [Candidate or tested page](https://manga.bilibili.com/mc29481/553156?from=manga_detail). Native regression: pass; visible area; 2 lines. Retested extension 1.1.1: both dialogue blocks, no navigation noise.

**Rendering and existing support:** Video root; manga canvas reader verified separately. Generic on www; Bilibili Manga adapter on manga subdomain. The supplied www host is not the comic reader. manga.bilibili.com screenshot OCR passed. Canvas extraction failed previously; capture works. Adapter hides navigation; turn off danmaku to avoid comments in OCR.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass on manga host. Simplified Chinese cropped screenshot 4 lines/.29 s, 1290x1398; actual dialogue without reader toolbar; After scroll: different dialogue 2 lines/.20 s, 1290x748. Requested www video root remains Partial; this verifies actual manga.bilibili.com only.

**Pipeline/adapter assessment:** Use the already verified manga.bilibili.com adapter and capture-only route. No reason to extract its canvas or add OCR services. The www video landing page needs no comic adapter.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-8"></a>

### 8. www.creative-comic.tw

**Domain/redirect:** Catalog retrieved; no redirect reported. [Requested URL](https://www.creative-comic.tw).

**Public chapter/sample:** [Candidate or tested page](https://www.creative-comic.tw/zh/reader_comic/8050). Native regression: pass; source page (canvas); 7 lines. Vertical Traditional Chinese dialogue; extension 1.1.1.

**Rendering and existing support:** Canvas custom reader. Creative Comic canvas adapter. Native canvas-source OCR passed, including vertical Traditional Chinese. Reader needs loading/scrolling before a useful page is visible; screenshot fallback remains available. Version 1.5.2 disables unreliable scripted Next page; use native page controls/scrolling. Native navigation plus interior OCR was reverified.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass with navigation issue. Traditional Chinese cover canvas source: 1 line/.20 s, 1440x2206; Extension Next page and read still returned same cover, 1 line/.19 s; Native vertical scroll reached actual interior page; Traditional Chinese source narration: 7 lines/.28 s; Repeated extension Next page after readiness still returned same source, 7 lines/.29 s; After user reload: v1.5.2 Use reader page controls disabled; native scroll and interior source OCR still work, 7 lines/.32 s (Simplified Chinese saved preference). Native wheel scrolling works; extension Next page did not advance reliably. Use native scrolling/reader controls.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-9"></a>

### 9. www.manhuagui.com

**Domain/redirect:** Root/catalog and linked public reader now reachable in live Chrome. [Requested URL](https://www.manhuagui.com).

**Public chapter/sample:** [Candidate or tested page](https://www.manhuagui.com/comic/32602/441493.html). New live 1.5.2 Chinese dialogue OCR: 2 lines/.27 s after native page turns and scrolling.

**Rendering and existing support:** HTML image custom paginated reader. Generic capture only. Generic native screenshot OCR verified actual Chinese comic dialogue on a public Robin chapter. No source adapter needed. One selected viewport at normal zoom; visible ads/controls can contaminate other captures. Traditional Chinese accuracy and entire catalogue not verified.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — New pass. Previously unavailable root/catalog now loaded; Official catalog Start Reading link opened public chapter; Native Next page twice reached comic interior page 3/25; Scrolled and read Simplified Chinese dialogue via generic capture: 2 lines/.27 s, actual comic visible, extension 1.5.2. No adapter added. Generic screenshots can include ads/controls if visible; selected viewport avoided them. One public chapter/page, not full catalogue.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-10"></a>

### 10. www.manhuahao.com

**Domain/redirect:** Catalog retrieved; no redirect reported. [Requested URL](https://www.manhuahao.com).

**Public chapter/sample:** [Candidate or tested page](https://www.manhuahao.com/duolaameng-GzA4d/1.html). Native regression: pass; source page (blob image); 4 lines. Interior page after cover; blob-image extraction.

**Rendering and existing support:** Blob-backed HTML images. Manhuahao rendered-image adapter. Native source OCR passed on an interior page. Blob images require rendered-image extraction or screenshot; changing page nodes can invalidate selection.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Cover source 4 lines/.41 s, 1000x1331; After scrolling: different comic image/title/SFX 4 lines/.25 s, 1000x1419. Traditional Chinese global preference used on Simplified source; no full chapter or dialogue-accuracy claim.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-11"></a>

### 11. www.36mh.org

**Domain/redirect:** Catalog retrieved; no redirect reported. [Requested URL](https://www.36mh.org).

**Public chapter/sample:** [Candidate or tested page](https://www.36mh.org/manhua/502128-201080.html). Native regression: pass; source page; 2 lines. Native source OCR.

**Rendering and existing support:** Lazy-loaded HTML images. 36mh adapter. Native source OCR passed. Image host 546457.xyz is configured. Wait for naturalWidth rather than placeholder dimensions before reading.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Source 2 lines/.19 s, 1000x781; After scrolling: different source text 2 lines/.19 s. Traditional Chinese global preference used on Simplified source; two source selections only.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-12"></a>

### 12. www.dumanwu.com

**Domain/redirect:** Catalog retrieved; no redirect reported. [Requested URL](https://www.dumanwu.com).

**Public chapter/sample:** [Candidate or tested page](https://www.dumanwu.com/GGZaGZe/XcDuQuuf.html). Native regression: pass; source page; 11 lines. Preview chapter; decorative Latin lettering is less accurate.

**Rendering and existing support:** HTML image chapter. Dumanwu adapter. Native source OCR passed. shimolife.com/referrer configured; preview and decorative lettering can produce noise. Full catalogue access not established.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass after retry. Initial source read rejected due layout change; Scrolled and retried: source recognized promo text 11 lines/.35 s, 1200x2133. Promotional preview episode rather than long dialogue; Traditional Chinese preference used.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-13"></a>

### 13. www.webtoons.com/zh-hant/

**Domain/redirect:** Live Chrome follow-up: Actual public first episode opened in Chrome; source OCR returned dialogue. Locale explicitly selected. Full chapter traversal not tested. [Requested URL](https://www.webtoons.com/zh-hant/).

**Public chapter/sample:** [Candidate or tested page](https://www.webtoons.com/zh-hant/fantasy/the-shepherd-wizard/%E7%AC%AC1%E8%A9%B1/viewer?title_no=9978&episode_no=1). Native OCR: 1 lines; source page; zh-Hant. Actual public first episode opened in Chrome; source OCR returned dialogue. Locale explicitly selected. Full chapter traversal not tested.

**Rendering and existing support:** Lazy HTML images. Webtoon adapter; zh-hant locale default fixed. Actual public first episode opened in Chrome; source OCR returned dialogue. Locale explicitly selected. Full chapter traversal not tested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Traditional Chinese source opening notice 7 lines/.26 s; Scroll to comic dialogue: 1 line/.16 s, 900x1280. One episode, only normal zoom.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-14"></a>

### 14. www.twmanga.com

**Domain/redirect:** Live Chrome follow-up: Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested. [Requested URL](https://www.twmanga.com).

**Public chapter/sample:** [Candidate or tested page](https://www.twmanga.com/comic/chapter/yaoshenji-taxuedongman/0_0.html). Native OCR: 7 lines; source page; zh-Hant. Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested.

**Rendering and existing support:** Lazy AMP/HTML images; vertical chapter. Baozi adapter matches chapter path. Live www.baozimh.com automatic browser verification completed without intervention; catalog first chapter explicitly redirected to www.twmanga.com. Existing Baozi adapter source OCR read interior narration after Next page. This is observed routing, not an assumed alias. Comic image uses Simplified Chinese despite Traditional reader UI; zh-Hant OCR choice recognized it. Other aliases/chapters untested.

**Latest regression:** Shared Baozi/Twmanga sample — Shared reader pass. Initial lazy-layout source read rejected as reader changed; Next page then settled retry recognized interior prose: 7 lines/.31 s, 800x1131 source. Alias reader checked once, not two independent root-to-reader routes; global Simplified Chinese preference used. This is the SAME tested Twmanga chapter as the Baozi row, not an independent second root-to-reader retest.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-15"></a>

### 15. www.yoyomanga.com

**Domain/redirect:** Catalog reachable through Colamanga root route; selected title returned Cloudflare 523. [Requested URL](https://www.yoyomanga.com).

**Public chapter/sample:** [Candidate or tested page](https://www.yoyomanga.com/manga-hg70402/). Fresh selected-title request returned Cloudflare 523; no reader verified.

**Rendering and existing support:** Unknown; reader unavailable. Generic capture only. Root/catalog availability does not establish chapter access. Selected title still failed with origin-unreachable 523; no actual comic OCR.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Catalog reachable through Colamanga route; Concrete title request returned Cloudflare Origin is unreachable 523. No comic reader/OCR tested; root availability does not verify chapters.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-16"></a>

### 16. manga.line.me

**Domain/redirect:** Live Chrome follow-up: Live Chrome explicitly states service only available from Japan. No bypass attempted; no OCR verdict. [Requested URL](https://manga.line.me).

**Public chapter/sample:** [Candidate or tested page](https://manga.line.me/title/Z0004080?type=periodic). No end-to-end comic OCR verified. Live Chrome explicitly states service only available from Japan. No bypass attempted; no OCR verdict.

**Rendering and existing support:** Region gate; no comic pixels. Generic capture only. Live Chrome explicitly states service only available from Japan. No bypass attempted; no OCR verdict.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Explicit live Japan-only service gate. No region bypass or OCR test.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-17"></a>

### 17. manga-one.com

**Domain/redirect:** Live Chrome follow-up: Actual public first page loaded after JS initialization. Generic screenshot recognized 16 lines including reader labels; optional manual crop recognized 13 comic lines without footer UI. No source adapter. Automatic language/global preference and pagination need manual controls; whole chapter not traversed. [Requested URL](https://manga-one.com).

**Public chapter/sample:** [Candidate or tested page](https://manga-one.com/manga/2084/chapter/191459?type=chapter&sort_type=desc&page=1&limit=10). Native OCR: 13 lines; selected area; ja-JP. Actual public first page loaded after JS initialization. Generic screenshot recognized 16 lines including reader labels; optional manual crop recognized 13 comic lines without footer UI. No source adapter. Automatic language/global preference and pagination need manual controls; whole chapter not traversed.

**Rendering and existing support:** HTML images in custom paginated reader. Generic capture only. Actual public first page loaded after JS initialization. Generic screenshot recognized 16 lines including reader labels; optional manual crop recognized 13 comic lines without footer UI. No source adapter. Automatic language/global preference and pagination need manual controls; whole chapter not traversed.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Generic Japanese screenshot 16 lines/.31 s; Optional selected comic area: 14 lines/.27 s, 850x1160. First public page only; external pagination not retested.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-18"></a>

### 18. viewer.bookwalker.jp

**Domain/redirect:** Live Chrome public sample reached at https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=be1a44f6-eeb2-4577-889b-5da45b2362a9&cty=1 [Requested URL](https://viewer.bookwalker.jp).

**Public chapter/sample:** [Candidate or tested page](https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=be1a44f6-eeb2-4577-889b-5da45b2362a9&cty=1). Native 1.5.0 follow-up: 44 lines; generic visible area on related trial host; ja-JP. Focused reader with a central click before Left. Public trial now displays actual interior dialogue; native OCR returned Japanese dialogue plus artwork/small-text errors. Requested viewer.bookwalker.jp itself still not reached; only viewer-trial.bookwalker.jp verified. No paid-reader or exact-host support claim.

**Rendering and existing support:** Viewport canvas trial reader; horizontal spreads. Generic capture only. Focused reader with a central click before Left. Public trial now displays actual interior dialogue; native OCR returned Japanese dialogue plus artwork/small-text errors. Requested viewer.bookwalker.jp itself still not reached; only viewer-trial.bookwalker.jp verified. No paid-reader or exact-host support claim.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass on trial host. Reader focus/keyboard attempt reached interior spread; browser locator key operation timed out but screenshot confirmed actual dialogue; Native generic Japanese OCR 45 lines/.57 s. Requested main host remains Partial. Only trial-host interior recognition reverified, not reliable keyboard pagination or full-book access.

**Pipeline/adapter assessment:** Generic screenshot is the first test, plausibly usable if the comic is actually visible. No dedicated adapter is yet demonstrated necessary. Add one only for observed crop, language, scroll or pagination problems; direct image-host permissions are optional and should follow evidence.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-19"></a>

### 19. takecomic.jp

**Domain/redirect:** Live Chrome follow-up: Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict. [Requested URL](https://takecomic.jp).

**Public chapter/sample:** [Candidate or tested page](https://takecomic.jp/series/3f846451aff2d/new). No end-to-end comic OCR verified. Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict.

**Rendering and existing support:** Network-access restriction notice. Generic capture only. Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Explicit live restriction for some network environments. No bypass or OCR test.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-20"></a>

### 20. tonarinoyj.jp

**Domain/redirect:** Root/episode metadata retrieved; public episode also loaded in Chrome. [Requested URL](https://tonarinoyj.jp).

**Public chapter/sample:** [Candidate or tested page](https://tonarinoyj.jp/episode/12207421984439043089). Implementation follow-up: public episode captured with new adapter; 8 lines / 0.31 s. Surrounding catalog/promotional blocks excluded; some noise remains in image.

**Rendering and existing support:** Canvas GigaViewer; horizontal pages. Capture-only canvas adapter. 1.2.x live native screenshot pass: 8 lines, 0.31 s, Japanese selected. Comic crop returned vertical dialogue. Manual horizontal reader controls remain necessary.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. 8 lines/.26 s cropped screenshot; 12 lines/.29 s cropped screenshot after page turn. Dialogue before/after native next-page control. Japanese explicitly selected. One canvas per read, normal zoom; small-character/artwork errors remain.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-21"></a>

### 21. www.sunday-webry.com

**Domain/redirect:** Live Chrome public sample reached at https://www.sunday-webry.com/episode/12207421984467638420 [Requested URL](https://www.sunday-webry.com).

**Public chapter/sample:** [Candidate or tested page](https://www.sunday-webry.com/episode/12207421984467638420). Native 1.5.0 follow-up: 24 lines; automatic comic-cropped screenshot; ja-JP. Cropped one visible canvas on opening and after a native page turn. Site metadata/control labels excluded. Editorial notes printed inside comic and furigana recognition errors remain.

**Rendering and existing support:** Canvas custom reader. Sunday Webry capture-only adapter. Cropped one visible canvas on opening and after a native page turn. Site metadata/control labels excluded. Editorial notes printed inside comic and furigana recognition errors remain.

**Latest regression:** Earlier representative regression — Earlier v1.5.1 regression. 100%: native Japanese automatic crop 24 lines / .40 s; 110% via native Chrome View > Zoom In; DOM DPR 2.2000000477, width 1173: automatic crop 21 lines / .36 s; 110% selected crop: 18 lines / .26 s; preview 596 x 485 pixels; Restored Actual Size, DPR 2, width 1291: stored crop read rejected with Selected area expired after zoom or resize; Clear area, native next-page control, read: automatic crop recovered, 19 lines / .26 s; Site expanded-reader overlay: native crop recognized comic text; this overlay does not use document.fullscreenElement; Native Chrome View > Enter Full Screen verified by subsequent Exit Full Screen menu; viewport 1512 x 771 / DPR 2: 21 lines / .38 s; Exited native fullscreen; restored 1291 x 699 / DPR 2, 100% zoom and Simplified Chinese preference. One displayed canvas per read. Printed editorial text and furigana errors remain; not a spatial OCR-box test.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-22"></a>

### 22. www.comico.jp

**Domain/redirect:** Live Chrome follow-up: Official 17 Aug 2026 notice, updated 15 Sep, states new releases/signup stopped 31 Aug, sales/rentals stopped 28 Sep 2026, service ends 6 Jan 2027. Purchased-library reading remains until then. Root now emphasizes library/migration; no public chapter verified. Not yet fully closed, and not an OCR failure. [Requested URL](https://www.comico.jp).

**Public chapter/sample:** [Candidate or tested page](https://www.comico.jp/document/notice/detail?detail=/document/notice/service/serviceclose/2026-08-17). No end-to-end comic OCR verified. Official 17 Aug 2026 notice, updated 15 Sep, states new releases/signup stopped 31 Aug, sales/rentals stopped 28 Sep 2026, service ends 6 Jan 2027. Purchased-library reading remains until then. Root now emphasizes library/migration; no public chapter verified. Not yet fully closed, and not an OCR failure.

**Rendering and existing support:** Service wind-down/library-only access; no anonymous chapter reached. Generic capture only. Official 17 Aug 2026 notice, updated 15 Sep, states new releases/signup stopped 31 Aug, sales/rentals stopped 28 Sep 2026, service ends 6 Jan 2027. Purchased-library reading remains until then. Root now emphasizes library/migration; no public chapter verified. Not yet fully closed, and not an OCR failure.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Loaded root focuses on library, migration agreement and service-closure notice; no anonymous comic reader exposed. No agreement accepted. Prior official notice schedules closure 6 Jan 2027; not a claim of already fully closed.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-23"></a>

### 23. shonenjumpplus.com

**Domain/redirect:** Root fetch timed out; public episode loaded in Chrome. [Requested URL](https://shonenjumpplus.com).

**Public chapter/sample:** [Candidate or tested page](https://shonenjumpplus.com/episode/10834108156648240735). Implementation follow-up: public comic canvas captured with the new adapter; 22 lines / 0.28 s. Tested at Retina DPR 2. No word-box mapping.

**Rendering and existing support:** Canvas GigaViewer; horizontal pages. Capture-only canvas adapter. 1.2.x live native screenshot pass on public Spy Family page: 22 lines, 0.28 s, Japanese selected. Crop excludes surrounding promotional area. Use the reader's own horizontal page controls; OCR accuracy is imperfect.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. 3 lines/.19 s cropped screenshot; 1 line/.17 s cropped screenshot after page turn. Narration then series title after native page turn. Japanese explicitly selected. One canvas per read, normal zoom; small-character/artwork errors remain.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-24"></a>

### 24. comic.pixiv.net

**Domain/redirect:** Live Chrome follow-up: Live browser navigation explicitly rejected by site-safety policy. No alternate tool/browser/network route attempted. No conclusion about public site availability or extension compatibility. [Requested URL](https://comic.pixiv.net).

**Public chapter/sample:** [Candidate or tested page](https://comic.pixiv.net). No end-to-end comic OCR verified. Live browser navigation explicitly rejected by site-safety policy. No alternate tool/browser/network route attempted. No conclusion about public site availability or extension compatibility.

**Rendering and existing support:** Unknown; automation safety block. Generic capture only. Live browser navigation explicitly rejected by site-safety policy. No alternate tool/browser/network route attempted. No conclusion about public site availability or extension compatibility.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Not retried: prior safety block. Earlier explicit browser site-safety denial retained; no new navigation attempted. No alternate route/tool/browser attempted. Prior blocked evidence only, not fresh availability or OCR testing.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-25"></a>

### 25. comic-days.com

**Domain/redirect:** Root/first episode metadata retrieved; public episode also loaded in Chrome. [Requested URL](https://comic-days.com).

**Public chapter/sample:** [Candidate or tested page](https://comic-days.com/episode/12207421984407384715). Implementation follow-up: native Japanese OCR on cropped public canvas, 13 lines / 0.17 s. An initial broad mutation check caused a false stale-read error; narrowed to comic changes and successfully retested.

**Rendering and existing support:** Canvas GigaViewer; horizontal pages. Capture-only canvas adapter. 1.2.1 live native Japanese OCR pass: 13 lines, 0.17 s, on public first episode. Comic crop excludes controls/reward text. Use site controls for horizontal pagination.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. 13 lines/.22 s cropped screenshot; 8 lines/.28 s cropped screenshot after page turn. Narration then printed promotional/editorial title page after native page turn. Japanese explicitly selected. One canvas per read, normal zoom; small-character/artwork errors remain.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-26"></a>

### 26. comic-walker.com

**Domain/redirect:** Live Chrome public sample reached at https://comic-walker.com/detail/KC_020122_S/episodes/KC_0201220000200011_E?episodeType=latest [Requested URL](https://comic-walker.com).

**Public chapter/sample:** [Candidate or tested page](https://comic-walker.com/detail/KC_020122_S/episodes/KC_0201220000200011_E?episodeType=latest). Native 1.5.0 follow-up: 8 lines; automatic comic-cropped screenshot; ja-JP. Clicked native left page-turn arrow, then recognized interior dialogue. Automatic crop excluded site header/metadata. Selector uses the observed pageCanvasWrapper class stem rather than generated hash; future DOM changes may need maintenance.

**Rendering and existing support:** Canvas custom reader. Kadocomi capture-only adapter. Clicked native left page-turn arrow, then recognized interior dialogue. Automatic crop excluded site header/metadata. Selector uses the observed pageCanvasWrapper class stem rather than generated hash; future DOM changes may need maintenance.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. 8 lines/.25 s, comic-only crop; Native left page turn: different dialogue 10 lines/.24 s. Japanese, normal zoom, actual comic text. Not whole chapter/all layouts.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-27"></a>

### 27. pocket.shonenmagazine.com

**Domain/redirect:** Live Chrome public sample reached at https://pocket.shonenmagazine.com/title/02221/episode/441664 [Requested URL](https://pocket.shonenmagazine.com).

**Public chapter/sample:** [Candidate or tested page](https://pocket.shonenmagazine.com/title/02221/episode/441664). Native 1.5.0 follow-up: 8 lines; automatic comic-cropped screenshot; ja-JP. Actual first comic page cropped automatically. Result excludes fullscreen/zoom controls, chapter metadata and social links; embedded English dialogue remains part of comic. Use native pagination.

**Rendering and existing support:** Canvas custom reader. Magapoke capture-only adapter. Actual first comic page cropped automatically. Result excludes fullscreen/zoom controls, chapter metadata and social links; embedded English dialogue remains part of comic. Use native pagination.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. 8 lines/.23 s, comic-only crop; Native next-page arrow: different dialogue 15 lines/.30 s. Japanese, normal zoom, actual comic text. Not whole chapter/all layouts.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-28"></a>

### 28. www.ganganonline.com

**Domain/redirect:** Live Chrome follow-up: Actual public comic spread loaded anonymously. Generic capture recognized Japanese dialogue without site-UI contamination in this viewport. Use reader controls; extension Next page does not implement this pagination. No source adapter; whole chapter/zoom variants untested. [Requested URL](https://www.ganganonline.com).

**Public chapter/sample:** [Candidate or tested page](https://www.ganganonline.com/title/2544/chapter/133970). Native OCR: 33 lines; generic visible area; ja-JP. Actual public comic spread loaded anonymously. Generic capture recognized Japanese dialogue without site-UI contamination in this viewport. Use reader controls; extension Next page does not implement this pagination. No source adapter; whole chapter/zoom variants untested.

**Rendering and existing support:** HTML images; horizontal custom spread reader. Generic capture only. Actual public comic spread loaded anonymously. Generic capture recognized Japanese dialogue without site-UI contamination in this viewport. Use reader controls; extension Next page does not implement this pagination. No source adapter; whole chapter/zoom variants untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Generic Japanese screenshot 33 lines/.35 s; After native ArrowLeft horizontal movement: different comic text 24 lines/.36 s. Viewport includes parts of neighboring pages; no dedicated bounds adapter. Native movement was not a full chapter traversal.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-29"></a>

### 29. manga.nicovideo.jp

**Domain/redirect:** Live Chrome follow-up: Live browser action explicitly rejected by site-safety policy. No alternate route attempted. No conclusion about global site availability or extension behavior. [Requested URL](https://manga.nicovideo.jp).

**Public chapter/sample:** [Candidate or tested page](https://manga.nicovideo.jp). No end-to-end comic OCR verified. Live browser action explicitly rejected by site-safety policy. No alternate route attempted. No conclusion about global site availability or extension behavior.

**Rendering and existing support:** Unknown; automation safety block. Generic capture only. Live browser action explicitly rejected by site-safety policy. No alternate route attempted. No conclusion about global site availability or extension behavior.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Not retried: prior safety block. Earlier explicit browser site-safety denial retained; no new navigation attempted. No alternate route/tool/browser attempted. Prior blocked evidence only, not fresh availability or OCR testing.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-30"></a>

### 30. kuragebunch.com

**Domain/redirect:** Live Chrome public sample reached at https://kuragebunch.com/episode/10834108156628843112 [Requested URL](https://kuragebunch.com).

**Public chapter/sample:** [Candidate or tested page](https://kuragebunch.com/episode/10834108156628843112). Native 1.5.0 follow-up: 3 lines; automatic comic-cropped screenshot; ja-JP. Scrolled vertically past cover to dialogue. Automatic crop excluded fullscreen/zoom labels. Scroll normally using wheel; extension navigation is intentionally disabled in this conservative adapter.

**Rendering and existing support:** Canvas custom reader. Kurage Bunch capture-only adapter. Scrolled vertically past cover to dialogue. Automatic crop excluded fullscreen/zoom labels. Scroll normally using wheel; extension navigation is intentionally disabled in this conservative adapter.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Scrolled to interior dialogue: 3 lines/.21 s, 1600x1216 crop; Further vertical scroll: 18 lines/.30 s, 1600x1398 crop. Japanese, normal zoom, actual comic text. Not whole chapter/all layouts.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-31"></a>

### 31. piccoma.com

**Domain/redirect:** Live Chrome follow-up: Live Chrome explicitly states this page can only be viewed from Japan. No bypass attempted; no OCR verdict. [Requested URL](https://piccoma.com).

**Public chapter/sample:** [Candidate or tested page](https://piccoma.com/web/product/54851?etype=episode). No end-to-end comic OCR verified. Live Chrome explicitly states this page can only be viewed from Japan. No bypass attempted; no OCR verdict.

**Rendering and existing support:** Region gate; no comic pixels. Generic capture only. Live Chrome explicitly states this page can only be viewed from Japan. No bypass attempted; no OCR verdict.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Explicit live Japan-only page gate. No region bypass or OCR test.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-32"></a>

### 32. ebookjapan.yahoo.co.jp

**Domain/redirect:** Live Chrome follow-up: Observed free book listing opened anonymous /viewer/free/ route. Dismissed new-viewer notice and used native Left key through cover/contents to real dialogue. No adapter/host additions. Campaign free window advertised through Nov 18; availability can change. Whole book and purchased content untested. [Requested URL](https://ebookjapan.yahoo.co.jp).

**Public chapter/sample:** [Candidate or tested page](https://ebookjapan.yahoo.co.jp/viewer/free/B00060070546/). Native OCR: 11 lines; generic visible area; ja-JP. Observed free book listing opened anonymous /viewer/free/ route. Dismissed new-viewer notice and used native Left key through cover/contents to real dialogue. No adapter/host additions. Campaign free window advertised through Nov 18; availability can change. Whole book and purchased content untested.

**Rendering and existing support:** Canvas custom viewer; paginated spreads. Generic capture only. Observed free book listing opened anonymous /viewer/free/ route. Dismissed new-viewer notice and used native Left key through cover/contents to real dialogue. No adapter/host additions. Campaign free window advertised through Nov 18; availability can change. Whole book and purchased content untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass after retry. Initial loading read rejected as reader changed; Settled generic Japanese OCR 12 lines/.29 s; Native ArrowLeft then different interior dialogue 18 lines/.31 s. Free campaign sample, header/page-number UI included; no paid books.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-33"></a>

### 33. www.cmoa.jp

**Domain/redirect:** Live Chrome follow-up: Live Chrome explicitly says access from abroad or VPN environments is restricted. Did not change network/security settings or attempt bypass. No comic pixels or OCR verdict. [Requested URL](https://www.cmoa.jp).

**Public chapter/sample:** [Candidate or tested page](https://www.cmoa.jp). No end-to-end comic OCR verified. Live Chrome explicitly says access from abroad or VPN environments is restricted. Did not change network/security settings or attempt bypass. No comic pixels or OCR verdict.

**Rendering and existing support:** Access restriction notice. Generic capture only. Live Chrome explicitly says access from abroad or VPN environments is restricted. Did not change network/security settings or attempt bypass. No comic pixels or OCR verdict.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Live page explicitly restricts access from abroad/VPN environments. No network/security settings changed; no OCR test.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-34"></a>

### 34. comic-gardo.com

**Domain/redirect:** Live Chrome public sample reached at https://comic-gardo.com/episode/12207421983834473688 [Requested URL](https://comic-gardo.com).

**Public chapter/sample:** [Candidate or tested page](https://comic-gardo.com/episode/12207421983834473688). Native 1.5.0 follow-up: 13 lines; automatic comic-cropped screenshot; ja-JP. Used native page controls twice past title spread. Native screenshot recognized interior dialogue without surrounding title/promotion/UI. Small Japanese/furigana errors remain.

**Rendering and existing support:** Canvas custom reader. Comic Gardo capture-only adapter. Used native page controls twice past title spread. Native screenshot recognized interior dialogue without surrounding title/promotion/UI. Small Japanese/furigana errors remain.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. 13 lines/.20 s cropped screenshot; 39 lines/.37 s cropped screenshot after page turn. Different interior dialogue/narration after native page turn. Japanese explicitly selected. One canvas per read, normal zoom; small-character/artwork errors remain.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-35"></a>

### 35. comic-action.com

**Domain/redirect:** Live Chrome public sample reached at https://comic-action.com/episode/4855956445111972974 [Requested URL](https://comic-action.com).

**Public chapter/sample:** [Candidate or tested page](https://comic-action.com/episode/4855956445111972974). Native 1.5.0 follow-up: 21 lines; automatic comic-cropped screenshot; ja-JP. Used native page controls twice to interior dialogue. Automatic canvas crop returned comic text without site metadata. Stylized lettering/furigana errors remain.

**Rendering and existing support:** Canvas custom reader. Comic Action capture-only adapter. Used native page controls twice to interior dialogue. Automatic canvas crop returned comic text without site metadata. Stylized lettering/furigana errors remain.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. 21 lines/.27 s cropped screenshot; 9 lines/.22 s cropped screenshot after page turn. Different comic dialogue after native page turn. Japanese explicitly selected. One canvas per read, normal zoom; small-character/artwork errors remain.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-36"></a>

### 36. championcross.jp

**Domain/redirect:** Live Chrome follow-up: Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict. [Requested URL](https://championcross.jp).

**Public chapter/sample:** [Candidate or tested page](https://championcross.jp/episodes/1a98c6de7d6c5). No end-to-end comic OCR verified. Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict.

**Rendering and existing support:** Network-access restriction notice. Generic capture only. Live Chrome explicitly reports that access from some network environments is currently restricted. No comic pixels/reader reached; no bypass attempted and no OCR verdict.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Explicit live restriction for some network environments. No bypass or OCR test.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-37"></a>

### 37. comic.naver.com

**Domain/redirect:** Root redirected to /index; public episode loaded in Chrome. [Requested URL](https://comic.naver.com).

**Public chapter/sample:** [Candidate or tested page](https://comic.naver.com/webtoon/detail?titleId=20853&no=1&week=finish). Implementation follow-up: actual first episode and Korean language selected. Normal and 110% Chrome zoom recognized comic text; preview widths 1000 and 1100 pixels respectively. Positional word mapping unavailable.

**Rendering and existing support:** HTML images; long vertical strips. Capture-only image adapter. 1.2.1 live native Korean OCR pass: 4 lines, 0.24 s. At 110% Chrome zoom / DPR 2.2: 3 lines, 0.21 s, 1100 px comic crop. Long strips use incremental window scrolling; browser zoom restored.

**Latest regression:** Earlier representative regression — Earlier v1.5.1 regression. Vertical comic automatic crop returned Korean dialogue plus artwork noise: 5 lines / .29 s; Select area once, first bubble crop: 2 lines / .06 s; Second drag without pressing Select area: 2 lines / .05 s; Wheel scroll while continuous selection active moved comic normally; Escape paused selection and retained area; Clear area restored normal Read page; Next page incremental scroll invoked; After Clear area and Next page, normal automatic crop returned 2 lines / .23 s. One public episode, normal Retina scale. Exact speech-bubble overlay coordinates are not implemented. Decorative lettering and low-resolution OCR errors remain.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-38"></a>

### 38. page.kakao.com

**Domain/redirect:** Live Chrome follow-up: Explicitly free first webtoon episode opened without login. Opening panels had no dialogue and returned 0/1 lines; scrolled into actual dialogue, which native OCR read. Decorative marks also recognized. No adapter; paid episodes and whole chapter untested. [Requested URL](https://page.kakao.com).

**Public chapter/sample:** [Candidate or tested page](https://page.kakao.com/content/56566288/viewer/56605697/). Native OCR: 3 lines; generic visible area; ko-KR. Explicitly free first webtoon episode opened without login. Opening panels had no dialogue and returned 0/1 lines; scrolled into actual dialogue, which native OCR read. Decorative marks also recognized. No adapter; paid episodes and whole chapter untested.

**Rendering and existing support:** Lazy/positioned HTML image tiles; vertical webtoon. Generic capture only. Explicitly free first webtoon episode opened without login. Opening panels had no dialogue and returned 0/1 lines; scrolled into actual dialogue, which native OCR read. Decorative marks also recognized. No adapter; paid episodes and whole chapter untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Korean generic screenshot after scroll: actual sentence plus noise, 2 lines/.28 s; Further scroll: changed Korean text 4 lines/.30 s. Generic viewport includes artwork noise; free episode only.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-39"></a>

### 39. ridibooks.com

**Domain/redirect:** Live Chrome follow-up: Public preview reached through the official free-comic selection and book Preview link, without login. Used the visible previous arrow to move cover 1/89 to interior spread 2/89. Native Korean OCR recognized narration/dialogue in generic and selected-area modes. Manual crop still included page counter/artwork noise; it is not a perfect automatic comic-bound crop. Only sample spread/navigation tested; purchased books and all zooms unverified. [Requested URL](https://ridibooks.com).

**Public chapter/sample:** [Candidate or tested page](https://ridibooks.com/books/1690002234/preview). Native OCR: 9 lines; selected area; generic visible capture also returned dialogue; ko-KR. Public preview reached through the official free-comic selection and book Preview link, without login. Used the visible previous arrow to move cover 1/89 to interior spread 2/89. Native Korean OCR recognized narration/dialogue in generic and selected-area modes. Manual crop still included page counter/artwork noise; it is not a perfect automatic comic-bound crop. Only sample spread/navigation tested; purchased books and all zooms unverified.

**Rendering and existing support:** HTML images; horizontal spread preview reader. Generic capture only. Public preview reached through the official free-comic selection and book Preview link, without login. Used the visible previous arrow to move cover 1/89 to interior spread 2/89. Native Korean OCR recognized narration/dialogue in generic and selected-area modes. Manual crop still included page counter/artwork noise; it is not a perfect automatic comic-bound crop. Only sample spread/navigation tested; purchased books and all zooms unverified.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Cover/title screenshot 6 lines/.27 s; Native previous-arrow control progressed to interior spread: Korean dialogue 14 lines/.36 s. Generic viewport includes header/page count; only public preview.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-40"></a>

### 40. www.bomtoon.com

**Domain/redirect:** Live Chrome follow-up: Public free first episode opened without login or age verification. Scrolled past opening art to narration; Korean native OCR recognized the visible caption. Reader UI can contaminate other viewports; optional crop available. Full chapter not traversed. [Requested URL](https://www.bomtoon.com).

**Public chapter/sample:** [Candidate or tested page](https://www.bomtoon.com/viewer/n_guild/01). Native OCR: 1 lines; generic visible area; ko-KR. Public free first episode opened without login or age verification. Scrolled past opening art to narration; Korean native OCR recognized the visible caption. Reader UI can contaminate other viewports; optional crop available. Full chapter not traversed.

**Rendering and existing support:** Lazy HTML images; vertical custom reader. Generic capture only. Public free first episode opened without login or age verification. Scrolled past opening art to narration; Korean native OCR recognized the visible caption. Reader UI can contaminate other viewports; optional crop available. Full chapter not traversed.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Scrolled phone-message text 2 lines/.22 s; Art-only view returned 0 lines/.09 s; Further scroll reached actual speech bubble and phone artwork: 9 lines/.25 s. Embedded phone/advert text belongs to comic image. No source adapter; normal zoom only.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-41"></a>

### 41. series.naver.com

**Domain/redirect:** Live Chrome follow-up: Live all-ages free title 13704861 and second title 2184106 both showed empty episode lists. Closing the viewer tip and selecting first-episode order did not expose chapters. Official /comic/viewer/install/guide offers Windows/Mac desktop viewers and instructs login in that viewer. No public browser comic pixels or native OCR test was possible here. No viewer installed or login performed. This is an environment/access limitation, not a confirmed failure on a visible browser comic or a claim that every title is native-only. [Requested URL](https://series.naver.com).

**Public chapter/sample:** [Candidate or tested page](https://series.naver.com/comic/detail.series?productNo=13704861). No end-to-end comic OCR verified. Live all-ages free title 13704861 and second title 2184106 both showed empty episode lists. Closing the viewer tip and selecting first-episode order did not expose chapters. Official /comic/viewer/install/guide offers Windows/Mac desktop viewers and instructs login in that viewer. No public browser comic pixels or native OCR test was possible here. No viewer installed or login performed. This is an environment/access limitation, not a confirmed failure on a visible browser comic or a claim that every title is native-only.

**Rendering and existing support:** Empty browser episode list; official separate desktop comic viewer. Generic capture only. Live all-ages free title 13704861 and second title 2184106 both showed empty episode lists. Closing the viewer tip and selecting first-episode order did not expose chapters. Official /comic/viewer/install/guide offers Windows/Mac desktop viewers and instructs login in that viewer. No public browser comic pixels or native OCR test was possible here. No viewer installed or login performed. This is an environment/access limitation, not a confirmed failure on a visible browser comic or a claim that every title is native-only.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Live free-series episode table still empty; separate PC comic-viewer install notice present. No software installed/login performed. No visible browser comic pixels; not all-title native-only claim.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-42"></a>

### 42. webtoon.kakao.com

**Domain/redirect:** Live Chrome follow-up: Free first episode/intro opened anonymously; Korean comic prose recognized before and after scrolling. Site CSS overrode hidden panel controls; v1.4.1 scoped hidden rule fixed it, verified Clear area display:none and actual collapse. No adapter needed; paid access/whole series untested. [Requested URL](https://webtoon.kakao.com).

**Public chapter/sample:** [Candidate or tested page](https://webtoon.kakao.com/viewer/%EC%98%A4%EB%AC%B4%EB%9D%BC%EC%9D%B4%EC%8A%A4-%EC%9E%BC%EC%9E%BC-001/7594). Native OCR: 6 lines; generic visible area; ko-KR. Free first episode/intro opened anonymously; Korean comic prose recognized before and after scrolling. Site CSS overrode hidden panel controls; v1.4.1 scoped hidden rule fixed it, verified Clear area display:none and actual collapse. No adapter needed; paid access/whole series untested.

**Rendering and existing support:** Positioned HTML image tiles; vertical scroll reader. Generic capture only. Free first episode/intro opened anonymously; Korean comic prose recognized before and after scrolling. Site CSS overrode hidden panel controls; v1.4.1 scoped hidden rule fixed it, verified Clear area display:none and actual collapse. No adapter needed; paid access/whole series untested.

**Latest regression:** Earlier representative regression — Earlier v1.5.1 regression. Native Korean visible-area OCR: 9 lines / .39 s; Clear area control remains hidden when no selection exists; Collapsing panel hides Read page; expanding restores it; Reread after collapse/expand returned 9 lines / .27 s. Public introductory episode only; generic capture includes UI/noise. Not every Kakao reader or paid episode tested.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-43"></a>

### 43. www.toomics.com

**Domain/redirect:** Live Chrome public sample reached at https://global.toomics.com/kr/webtoon/detail/code/188048/ep/1/toon/6984 [Requested URL](https://www.toomics.com).

**Public chapter/sample:** [Candidate or tested page](https://global.toomics.com/kr/webtoon/detail/code/188048/ep/1/toon/6984). Native 1.5.0 follow-up: 5 lines; generic visible area; ko-KR. Selected Korean through official language menu. Catalog-linked non-adult version first free episode opened without login or age verification. Scrolled to actual dialogue; native Korean OCR returned three dialogue lines plus two sound effects. No adapter needed. Italian locale also passed in earlier evidence; other chapters/modes untested.

**Rendering and existing support:** Lazy HTML images; vertical reader. Generic capture only. Selected Korean through official language menu. Catalog-linked non-adult version first free episode opened without login or age verification. Scrolled to actual dialogue; native Korean OCR returned three dialogue lines plus two sound effects. No adapter needed. Italian locale also passed in earlier evidence; other chapters/modes untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Korean comic speech plus visible non-adult-version notice: 3 lines/.23 s; Further scroll: restaurant-sign text 1 line/.20 s. Generic screenshot includes visible site notice, which area selection can exclude. Free non-adult version only.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-44"></a>

### 44. www.mrblue.com

**Domain/redirect:** Live Chrome follow-up: Live root and public series wt_000079023 loaded. First free episode opened a reader tab requiring login. No login or OCR attempted. [Requested URL](https://www.mrblue.com).

**Public chapter/sample:** [Candidate or tested page](https://viewer.mrblue.com/comics/wt_000079023/1?ppt=PPT02). No end-to-end comic OCR verified. Live root and public series wt_000079023 loaded. First free episode opened a reader tab requiring login. No login or OCR attempted.

**Rendering and existing support:** Login gate; comic renderer unverified. Generic capture only. Live root and public series wt_000079023 loaded. First free episode opened a reader tab requiring login. No login or OCR attempted.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Actual viewer explicitly requires login. No login or OCR performed.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-45"></a>

### 45. www.webtoons.com

**Domain/redirect:** Root redirected to /en/; English chapter verified. [Requested URL](https://www.webtoons.com).

**Public chapter/sample:** [Candidate or tested page](https://www.webtoons.com/en/thriller/i-dare-you/episode-1/viewer?title_no=10036&episode_no=1). Native regression: pass; source page; 2 lines. English OCR explicitly selected.

**Rendering and existing support:** Lazy-loaded HTML images. Webtoon adapter. Native source OCR passed with English selected. Different locales/free windows require their own checks; Traditional Chinese row remains separate. Scroll past title-only covers.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. English source 2 lines/.19 s; After scroll: different English dialogue, 2 lines/.18 s. One public episode at normal zoom.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-46"></a>

### 46. www.lezhin.com

**Domain/redirect:** Live Chrome follow-up: All-ages first free episode opened without login. Native screenshot recognized narration; decorative/arrow noise also returned. Scroll past copyright opening panel. No source adapter or full chapter test. [Requested URL](https://www.lezhin.com).

**Public chapter/sample:** [Candidate or tested page](https://www.lezhin.com/ko/comic/brianoslab/1). Native OCR: 3 lines; generic visible area; ko-KR. All-ages first free episode opened without login. Native screenshot recognized narration; decorative/arrow noise also returned. Scroll past copyright opening panel. No source adapter or full chapter test.

**Rendering and existing support:** Blob-backed HTML images; vertical reader. Generic capture only. All-ages first free episode opened without login. Native screenshot recognized narration; decorative/arrow noise also returned. Scroll past copyright opening panel. No source adapter or full chapter test.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Korean narration after scroll 3 lines/.25 s; Further scroll: embedded English dialogue/Korean SFX plus controls, 4 lines/.33 s. Generic viewport; arrows and decorative noise remain.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-47"></a>

### 47. globalcomix.com

**Domain/redirect:** Root and free reader loaded. [Requested URL](https://globalcomix.com).

**Public chapter/sample:** [Candidate or tested page](https://globalcomix.com/read/38fc7391-262a-4780-91ca-9c3eb1fe0f66/1). Native regression: pass; source page; 8 lines. Free Monica+Michael chapter; English OCR explicitly selected.

**Rendering and existing support:** HTML images/custom paginated reader. GlobalComix adapter. Native source OCR passed on free Monica+Michael sample. Reader CDN access configured. Page/spread zoom and alternate reader layouts still need broader tests.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. English source 8 lines/.23 s, 940x1000; After scroll: different English narration, 9 lines/.30 s. One free reader, no full chapter test.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-48"></a>

### 48. mangadex.org

**Domain/redirect:** No domain-liveness conclusion: automation safety policy blocked access. [Requested URL](https://mangadex.org).

**Public chapter/sample:** No publicly accessible comic chapter confirmed in this audit. Root/catalog evidence alone is insufficient.

**Rendering and existing support:** Unknown; browser access blocked. Generic capture only. No alternate route attempted. Manual testing required; neither site closure nor extension failure established. High user value keeps priority P0 despite unknown effort.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Not retried: prior safety block. Earlier explicit browser site-safety denial retained; no new navigation attempted. No alternate route/tool/browser attempted. Prior blocked evidence only, not fresh availability or OCR testing.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-49"></a>

### 49. mangaplus.shueisha.co.jp

**Domain/redirect:** Live Chrome follow-up: Free English RuriDragon chapter 53 opened via observed viewer link; optional cookies rejected. Scrolled past cover/text-free panels to dialogue. Native screenshot recognized it. No adapter/permissions added. Other locales, app-only free reading and paid chapters untested. [Requested URL](https://mangaplus.shueisha.co.jp).

**Public chapter/sample:** [Candidate or tested page](https://mangaplus.shueisha.co.jp/viewer/1030735). Native OCR: 13 lines; generic visible area; en-US. Free English RuriDragon chapter 53 opened via observed viewer link; optional cookies rejected. Scrolled past cover/text-free panels to dialogue. Native screenshot recognized it. No adapter/permissions added. Other locales, app-only free reading and paid chapters untested.

**Rendering and existing support:** Lazy HTML images; vertical web viewer. Generic capture only. Free English RuriDragon chapter 53 opened via observed viewer link; optional cookies rejected. Scrolled past cover/text-free panels to dialogue. Native screenshot recognized it. No adapter/permissions added. Other locales, app-only free reading and paid chapters untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Initial scrolled view: clipped text 1 line/.21 s; Art-only view: 0 lines/.20 s; Scrolled back to dialogue: English comic text 4 lines/.26 s. Generic viewport, one free episode. Zero text on art-only view is not failure.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-50"></a>

### 50. tapas.io

**Domain/redirect:** Live Chrome follow-up: Native generic capture recognized actual interior dialogue after scrolling, alongside extensive sidebar/header/cookie text. Optional selected-area capture returned only the speech bubble. Prior title-only evidence is superseded. Reader canonicalized series URL to /episode/2135770 while scrolling. Paid/locked episodes not tested. [Requested URL](https://tapas.io).

**Public chapter/sample:** [Candidate or tested page](https://tapas.io/episode/2135770). Native OCR: 1 lines; selected area; en-US. Native generic capture recognized actual interior dialogue after scrolling, alongside extensive sidebar/header/cookie text. Optional selected-area capture returned only the speech bubble. Prior title-only evidence is superseded. Reader canonicalized series URL to /episode/2135770 while scrolling. Paid/locked episodes not tested.

**Rendering and existing support:** Lazy HTML images; vertical scroll with sticky sidebar/header. Generic capture; no adapter. Native generic capture recognized actual interior dialogue after scrolling, alongside extensive sidebar/header/cookie text. Optional selected-area capture returned only the speech bubble. Prior title-only evidence is superseded. Reader canonicalized series URL to /episode/2135770 while scrolling. Paid/locked episodes not tested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass with crop limitation. English generic viewport: comic dialogue plus UI, 31 lines/.37 s; Optional selection: 2 lines/.23 s, 980x640 crop; recognizable first part of speech. Drawn rectangle clipped part of the sentence; this sweep is not a clean complete-sentence crop pass. Earlier full-bubble pass remains dated evidence. Generic UI noise persists.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-51"></a>

### 51. www.tappytoon.com

**Domain/redirect:** Live Chrome follow-up: Free Solo Leveling episode 1 opened anonymously through catalog. Native English OCR recognized actual narration after scrolling past art. Paid episodes and other locales untested. [Requested URL](https://www.tappytoon.com).

**Public chapter/sample:** [Candidate or tested page](https://www.tappytoon.com/en/chapters/623723039?). Native OCR: 2 lines; generic visible area; en-US. Free Solo Leveling episode 1 opened anonymously through catalog. Native English OCR recognized actual narration after scrolling past art. Paid episodes and other locales untested.

**Rendering and existing support:** Lazy HTML images; vertical reader. Generic capture only. Free Solo Leveling episode 1 opened anonymously through catalog. Native English OCR recognized actual narration after scrolling past art. Paid episodes and other locales untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. After initial scroll: HUFF, 1 line/.17 s; After further scroll: two English narration sentences, 2 lines/.26 s. Public free episode; other layouts/paid content untested.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-52"></a>

### 52. comick.io

**Domain/redirect:** Fresh Chrome action explicitly denied by site-safety policy. [Requested URL](https://comick.io).

**Public chapter/sample:** No publicly accessible comic chapter confirmed in this audit. Root/catalog evidence alone is insufficient.

**Rendering and existing support:** Unknown; reader not reached. Generic capture only. No alternate route/tool/browser attempted. No liveness, closure, redirect or OCR verdict can be established here.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Blocked by test environment. Fresh Chrome navigation explicitly rejected by site-safety policy. No alternate route/tool/browser attempted. No liveness or OCR verdict.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-53"></a>

### 53. bato.to

**Domain/redirect:** Requested root now visibly redirects to a closure notice. [Requested URL](https://bato.to).

**Public chapter/sample:** No publicly accessible comic chapter confirmed in this audit. Root/catalog evidence alone is insufficient.

**Rendering and existing support:** Other: redirected closure destination. Generic capture only. Observed destination states this website has been closed due to copyright infringement. No Bato reader reached; no mirrors/replacements followed or notice counted as OCR compatibility.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Unavailable for OCR. Requested root redirected to closure notice stating THIS WEBSITE HAS BEEN CLOSED DUE TO COPYRIGHT INFRINGEMENT. No Bato reader exists at the observed destination. Did not follow mirrors/replacements or count notice text as comic OCR.

**Pipeline/adapter assessment:** No end-to-end verdict possible. First obtain a reachable, publicly readable sample through permitted access. If comic pixels are visible in Chrome, test generic screenshot before considering a dedicated adapter; its need is presently unknown.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-54"></a>

### 54. cubari.moe

**Domain/redirect:** Live Chrome follow-up: Concrete publicly indexed Imgur-backed comic sample loaded on exact cubari.moe host. Used Right twice past introductory pages to actual Japanese dialogue (URL settled on page 3). Generic OCR returned dialogue plus sidebar/artwork noise (13 lines/.34 s); selected speech-bubble crop returned one clean Japanese sentence. No new adapter or permissions. Other Cubari backends, manifest formats, languages, whole-chapter traversal and all zooms untested; no MangaDex proxy used. [Requested URL](https://cubari.moe).

**Public chapter/sample:** [Candidate or tested page](https://cubari.moe/read/imgur/w34V8PI/1/3/). Native OCR: 1 lines; selected area; ja-JP. Concrete publicly indexed Imgur-backed comic sample loaded on exact cubari.moe host. Used Right twice past introductory pages to actual Japanese dialogue (URL settled on page 3). Generic OCR returned dialogue plus sidebar/artwork noise (13 lines/.34 s); selected speech-bubble crop returned one clean Japanese sentence. No new adapter or permissions. Other Cubari backends, manifest formats, languages, whole-chapter traversal and all zooms untested; no MangaDex proxy used.

**Rendering and existing support:** HTML images; custom paginated/scrollable Imgur reader. Generic capture only. Concrete publicly indexed Imgur-backed comic sample loaded on exact cubari.moe host. Used Right twice past introductory pages to actual Japanese dialogue (URL settled on page 3). Generic OCR returned dialogue plus sidebar/artwork noise (13 lines/.34 s); selected speech-bubble crop returned one clean Japanese sentence. No new adapter or permissions. Other Cubari backends, manifest formats, languages, whole-chapter traversal and all zooms untested; no MangaDex proxy used.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Japanese generic screenshot 13 lines/.36 s, including UI/noise; Selected bubble: one clean Japanese sentence, 1 line/.11 s, 414x572 crop. One Imgur-backed sample; other backends not retested. No MangaDex proxy used.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

<a id="site-55"></a>

### 55. comics.inkr.com

**Domain/redirect:** Live Chrome follow-up: Public free preview opened without account. Dismissed marketing offer, scrolled past covers to interior dialogue. Native OCR recognized three comic sentences at displayed 59% reader zoom. Other zoom levels, paid pages and full chapter untested. [Requested URL](https://comics.inkr.com).

**Public chapter/sample:** [Candidate or tested page](https://comics.inkr.com/title/5118-emma-capucine/chapter/196064-free-preview). Native OCR: 3 lines; generic visible area; en-US. Public free preview opened without account. Dismissed marketing offer, scrolled past covers to interior dialogue. Native OCR recognized three comic sentences at displayed 59% reader zoom. Other zoom levels, paid pages and full chapter untested.

**Rendering and existing support:** Lazy HTML images in custom zoomable vertical reader. Generic capture only. Public free preview opened without account. Dismissed marketing offer, scrolled past covers to interior dialogue. Native OCR recognized three comic sentences at displayed 59% reader zoom. Other zoom levels, paid pages and full chapter untested.

**Latest regression:** Extended sweep, 1.5.1–1.5.2 — Pass. Scrolled past cover/title: English dialogue 3 lines/.30 s; Further scroll: different English dialogue 4 lines/.20 s. Generic visible-area capture; public preview only.

**Pipeline/adapter assessment:** Retain the recorded generic capture or configured adapter. The linked native OCR result verifies only the stated method; other modes, layouts and navigation still need independent tests.

**Coordinates:** M0; no OCR boxes or page mapping implemented. Crop geometry alone does not satisfy this requirement.

## Remaining backlog and architecture recommendations

| Priority | Work | Estimated effort | Evidence/next action |
| --- | --- | --- | --- |
| P0 | Dongman image loading | Medium investigation | Repeated live chapter still has transparent 1-pixel placeholders. Obtain visible comic pixels before adapting OCR. |
| P0 | LINE Manga / Piccoma | Access prerequisite; adapter effort unknown | Explicit Japan-only gates here. Authorized beta testers in supported regions can test generic capture. |
| P0 | Magapoke / Sunday Webry / Kadocomi wider regression | Low–Medium | Fresh cropped interior OCR passes in 1.5.0. Test further zoom, fullscreen and chapter changes; native reader controls remain required. |
| P1 | Naver Series | Access/reader prerequisite; effort unknown | Two live title episode lists stayed empty. Official guide requires a separate desktop viewer with login. No browser OCR verdict; do not add an adapter without visible browser comic pixels. |
| P1 | RIDI / Cubari broader regression | Low–Medium | Public sample OCR now passes. Test additional books/backends and zoom/navigation combinations; Cubari selected area removes observed sidebar noise. |
| P1 | BookWalker | Medium | Interior trial-host OCR now passes; requested main viewer host and purchased-reader scope remain unverified. |
| P1 | Comic Gardo / Kurage / Comic Action wider regression | Low–Medium | Fresh automatic comic-crop passes in 1.5.0; test more layouts/zoom and improve vertical navigation only with evidence. |
| P1 | MrBlue / Cmoa / restricted comici sites | Access prerequisite | Login or explicit network/abroad restrictions; no OCR verdict. |
| P1 | Toomics wider regression | Low–Medium | Korean public non-adult free episode now passes; paid chapters and other layouts remain untested. |
| P2 | Unreachable Chinese/P2 international sites | Unknown | Recheck normal availability before selector work. Tool safety blocks need manual user testing, not automated alternate access. |
| P2 | comico | Low value / service transition | Official notice schedules closure 6 January 2027; anonymous reader not found. Preserve notice/date in evidence. |

Keep screenshot transport generic. Source extraction is optional; avoid adding CDN permissions to fix a screenshot-only problem. Maintain small declarative reader bounds/navigation overrides rather than separate OCR implementations. Manual crop already handles many UI-noise cases and remains optional. A future improvement is consistent per-site language preferences without overriding a user's explicit choice.

Capture transforms, crop clipping, high-DPI ratios and stale-result checks have automated coverage. Live tests include vertical scroll, horizontal page changes, selected-area OCR and INKR's displayed 59% reader zoom; there is no exhaustive device/browser-zoom matrix or second-Mac test. Keep beta testing those combinations. The native transcript currently lacks bounding boxes, so speech-bubble-aligned output requires a separate native API evaluation before any architectural change. Preserve the current selectable DOM text and Migaku Shift lookup meanwhile; automatic Migaku known-word coloring remains a separate limitation.

For every new Working claim, record final chapter URL, date, language, exact OCR method and actual interior text. A matching URL, cover-only result or visible catalog does not establish full comic support. Test other layouts/modes independently.

## Local implementation and evidence references

- `outputs/OCR Companion for Migaku-Chrome/manifest.json`: version and permission inventory.
- `outputs/OCR Companion for Migaku-Chrome/adapters.json`: exact hosts, paths, selectors, source CDNs, language defaults and capture-only settings.
- `outputs/OCR Companion for Migaku-Chrome/background.js`: native transport; active-tab validation; screenshot/crop math; automatic source fallback; result payload.
- `outputs/OCR Companion for Migaku-Chrome/content.js`: candidate/visible element selection, geometry, pagination and selectable text panel.
- `outputs/OCR Companion for Migaku-Native/macOS/Sources/NativeHost.swift`: VisionKit ImageAnalyzer and transcript-only response.
- `work/native-site-regression/results.json`: 11 earlier native passes and unavailable samples. Its old Colamanga row points at Yoyomanga; this audit deliberately separates the actual requested domains.
- `work/comic-audit-web-evidence.json`: saved web retrieval excerpts, including canonical URLs and failures. Linked first-party pages in the individual records are the public references; no third-party architectural guesses are treated as observations.
- `work/comic-audit/audit-data.json`: the 55 structured audit records, including fresh Jump+/Naver/Tapas observations documented in this report. These new observations are manual browser-session records, not automated regression logs.

Limitations: availability is from this environment/date, not a global outage monitor; access and free windows can change. Several readers remain Partial or blocked. Naver Series could not expose a public browser chapter here; RIDI and Cubari now have sample-based native passes. This report explicitly retains Untested/Unavailable and unknown renderers instead of presenting inferred compatibility as verified functionality. Only free/public content was investigated. Source/image URLs with transient access parameters are omitted from the report; use the linked reader page to obtain current content normally.

## Automatic Migaku overlay parsing

OCR support does not by itself verify automatic vocabulary markings. See the separate [55-entry Migaku overlay audit](WEBSITE-COMPATIBILITY.md) for actual 1.5.4 parsing checks and their limitations. The frozen 1.5.3 documentation archive remains unchanged.
