#!/bin/zsh
set -euo pipefail
cd -- "${0:A:h}/.."
mkdir -p macOS/Build/ModuleCache
node --check reader/reader.js
node tests/reader.test.cjs
xcrun swiftc -module-cache-path macOS/Build/ModuleCache macOS/Sources/ReaderServer.swift macOS/Sources/ScreenGeometry.swift tests/ReaderPolicyTests.swift -o tests/policy-tests
./tests/policy-tests

node tests/pairing-options.test.cjs
xcrun swiftc -module-cache-path macOS/Build/ModuleCache macOS/Sources/PairingLink.swift tests/PairingLinkTests.swift -o macOS/Build/pairing-tests
./macOS/Build/pairing-tests

xcrun swiftc -module-cache-path macOS/Build/ModuleCache macOS/Sources/WizardPlan.swift tests/WizardPlanTests.swift -o macOS/Build/wizard-tests
./macOS/Build/wizard-tests
