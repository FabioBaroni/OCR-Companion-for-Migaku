# Beta 9 validation — 2026-11-04

Universal arm64/x86_64 app rebuilt from the bundled source. Ad-hoc signature verified with codesign --verify --deep --strict. Packaged extension, bundled app extension and source are checked byte-for-byte.

Passed: 11 extension suites (URL matching, capture geometry, races, selection, site adapters and lifecycle); reader JavaScript; 23 Swift reader policy cases and nine screen-geometry cases; pairing UI and Swift URL validation; setup wizard state plan; Migaku bootstrap/registration checks. Native protocol and restart argument checks are recorded in TEST-RESULTS.txt at the archive root.

The user's supplied Tonari video shows actual selected-area OCR and Migaku annotations/dictionary output. This is not a fresh live sweep of all 55 websites. The archived compatibility report keeps its original verification boundaries. Real first-run permission/restart and another Mac remain unverified.
