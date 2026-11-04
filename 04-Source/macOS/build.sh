#!/bin/zsh
set -euo pipefail
cd -- "${0:A:h}"
mkdir -p Build/ModuleCache
app='Build/Beta9/OCR Companion for Migaku.app'
mkdir -p "$app/Contents/MacOS" "$app/Contents/Resources/Reader" "$app/Contents/Helpers"
for architecture in arm64 x86_64; do
  xcrun swiftc -module-cache-path "$PWD/Build/ModuleCache" -parse-as-library -O -target "${architecture}-apple-macosx13.0" Sources/NativeHost.swift -o "Build/native-${architecture}"
  xcrun swiftc -module-cache-path "$PWD/Build/ModuleCache" -parse-as-library -O -target "${architecture}-apple-macosx14.0" Sources/RestartLauncher.swift -o "Build/restart-${architecture}"
  xcrun swiftc -module-cache-path "$PWD/Build/ModuleCache" -parse-as-library -O -target "${architecture}-apple-macosx14.0" Sources/WizardPlan.swift Sources/SetupWizard.swift Sources/PairingLink.swift Sources/Setup.swift Sources/ScreenController.swift Sources/ReaderServer.swift Sources/ScreenGeometry.swift -o "Build/setup-${architecture}"
done
lipo -create Build/native-arm64 Build/native-x86_64 -output "$app/Contents/Helpers/ocrcompanion-native"
lipo -create Build/setup-arm64 Build/setup-x86_64 -output "$app/Contents/MacOS/OCR Companion for Migaku"
lipo -create Build/restart-arm64 Build/restart-x86_64 -output "$app/Contents/Helpers/ocrcompanion-restart"
cp ReleaseConfig.json "$app/Contents/Resources/ReleaseConfig.json"
cp ../reader/* "$app/Contents/Resources/Reader/"
mkdir -p "$app/Contents/Resources/ChromeExtension"
cp ../extension/* "$app/Contents/Resources/ChromeExtension/"
cat > "$app/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>local.ocrcompanion.app</string><key>CFBundleName</key><string>OCR Companion for Migaku</string><key>CFBundleExecutable</key><string>OCR Companion for Migaku</string><key>CFBundlePackageType</key><string>APPL</string><key>CFBundleShortVersionString</key><string>1.0.0</string><key>CFBundleVersion</key><string>12</string><key>LSMinimumSystemVersion</key><string>14.0</string><key>NSHighResolutionCapable</key><true/>
<key>CFBundleURLTypes</key><array><dict><key>CFBundleURLName</key><string>local.ocrcompanion.pairing</string><key>CFBundleURLSchemes</key><array><string>ocrcompanion</string></array></dict></array></dict></plist>
PLIST
codesign --force --sign - "$app/Contents/Helpers/ocrcompanion-native"
codesign --force --sign - "$app/Contents/Helpers/ocrcompanion-restart"
codesign --force --sign - "$app"
codesign --verify --deep --strict "$app"
print "Built $app (experimental; ad-hoc signed, not notarized)"
