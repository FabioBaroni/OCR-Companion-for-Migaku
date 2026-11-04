# Source and verification

Exact beta source: extension/, reader/, macOS/Sources and macOS/ReleaseConfig.json. The Mac app uses Apple frameworks only. Runtime users need no developer tools. No Migaku code is bundled.

To rebuild on a development Mac with Xcode Command Line Tools: from 04-Source run `zsh macOS/build.sh`. This produces a universal ad-hoc-signed app in macOS/Build. Rebuilding can change macOS permission identity.

From 04-Source run:

- `node browser-tests/run.cjs` — eleven extension suites.
- `node tests/pairing-options.test.cjs` — automatic connection health/handoff.
- `node tests/migaku-compat.test.cjs` and `node tests/migaku-registration.test.cjs`.
- `zsh tests/run.sh` — reader JavaScript, 23 Swift access-policy cases and nine screen-geometry cases.
- `python3 tests/test_protocol.py` — thirteen tests against the exact native helper in ../01-Mac-App. It launches a temporary copy without installing/pairing; all state is temporary.

Node.js, Python 3 and Xcode tools are development-only requirements for these checks. browser-tests/fixtures/prior-results.json contains public chapter URL fixtures, not proof of fresh compatibility. App protocol remains 1 / native helper 1.1.1. Beta 2 renames internal identifiers as well: reconnect the extension in the new app.

A separate open-source license has not been selected; source is provided for review with this beta.

Restart-helper argument safety checks: `python3 tests/test_restart.py`. These reject invalid invocations without quitting or opening an app. The valid self-restart/permission transition needs a live user test.
