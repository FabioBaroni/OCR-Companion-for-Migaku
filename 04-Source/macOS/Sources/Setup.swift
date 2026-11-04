import AppKit
import Foundation
import VisionKit
import CoreGraphics

@MainActor final class SettingsDocumentView: NSView { override var isFlipped: Bool { true } }

@MainActor final class SetupDelegate: NSObject, NSApplicationDelegate {
    let screenController = ScreenController()
    let hostName = "local.ocrcompanion.reader"
    let version = "1.1.1"
    var window: NSWindow!
    let extensionID = NSTextField(string:"")
    let status = NSTextField(wrappingLabelWithString:"")
    var appSupport: URL { FileManager.default.urls(for:.applicationSupportDirectory,in:.userDomainMask)[0] }
    var hostRoot: URL { appSupport.appendingPathComponent("OCRCompanion/NativeHost",isDirectory:true) }
    var registration: URL { appSupport.appendingPathComponent("Google/Chrome/NativeMessagingHosts/\(hostName).json") }
    var manualSection: NSStackView!
    let connectionInfo=NSTextField(wrappingLabelWithString:"")
    let permissionInfo=NSTextField(wrappingLabelWithString:"")
    var pendingPairingURLs: [URL] = []
    var approvingPairing = false
    var wizard: SetupWizard?
    func stack(in window:NSWindow)->NSStackView {
        let scroll=NSScrollView(frame:window.contentView!.bounds);scroll.autoresizingMask=[.width,.height];scroll.hasVerticalScroller=true;scroll.autohidesScrollers=true;scroll.drawsBackground=false
        window.contentView!.addSubview(scroll)
        let document=SettingsDocumentView();document.translatesAutoresizingMaskIntoConstraints=false;scroll.documentView=document
        let stack=NSStackView();stack.orientation = .vertical;stack.alignment = .leading;stack.spacing=16;stack.translatesAutoresizingMaskIntoConstraints=false;document.addSubview(stack)
        NSLayoutConstraint.activate([document.widthAnchor.constraint(equalTo:scroll.contentView.widthAnchor),stack.leadingAnchor.constraint(equalTo:document.leadingAnchor,constant:26),stack.trailingAnchor.constraint(equalTo:document.trailingAnchor,constant:-26),stack.topAnchor.constraint(equalTo:document.topAnchor,constant:26),stack.bottomAnchor.constraint(equalTo:document.bottomAnchor,constant:-26)])
        return stack
    }
    func label(_ text:String,in stack:NSStackView,small:Bool=false) {
        let field=NSTextField(wrappingLabelWithString:text);field.translatesAutoresizingMaskIntoConstraints=false
        if small { field.font = .systemFont(ofSize:12);field.textColor = .secondaryLabelColor }
        stack.addArrangedSubview(field);field.widthAnchor.constraint(equalTo:stack.widthAnchor).isActive=true
    }
    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.regular)
        let mainMenu=NSMenu(),applicationItem=NSMenuItem();mainMenu.addItem(applicationItem)
        let applicationMenu=NSMenu();applicationMenu.addItem(withTitle:"Quit OCR Companion for Migaku",action:#selector(NSApplication.terminate(_:)),keyEquivalent:"q")
        applicationItem.submenu=applicationMenu;NSApp.mainMenu=mainMenu
        window=NSWindow(contentRect:NSRect(x:0,y:0,width:660,height:650),styleMask:[.titled,.closable,.miniaturizable],backing:.buffered,defer:false)
        window.title="Settings & setup — OCR Companion for Migaku";window.center();window.isReleasedWhenClosed=false
        let home=stack(in:window)
        let heading=NSTextField(labelWithString:"Settings & setup");heading.font = .boldSystemFont(ofSize:24);home.addArrangedSubview(heading)
        let guided=NSButton(title:"Run setup wizard…",target:self,action:#selector(showWizard));guided.bezelStyle = .rounded;home.addArrangedSubview(guided)
        label("Capture actions are in the ▣ OCR menu. Closing this window keeps screen capture and shortcuts available. Choose Quit in the menu to stop the app.",in:home,small:true)
        label("Chrome extension connection",in:home)
        home.addArrangedSubview(connectionInfo);connectionInfo.widthAnchor.constraint(equalTo:home.widthAnchor).isActive=true
        label("In Chrome extension settings, click Connect Mac app and approve the request here. The connection is checked automatically in Chrome.",in:home,small:true)
        let manual=NSButton(checkboxWithTitle:"Manual connection & troubleshooting",target:self,action:#selector(toggleManual(_:)));home.addArrangedSubview(manual)
        manualSection=NSStackView();manualSection.orientation = .vertical;manualSection.alignment = .leading;manualSection.spacing=10
        home.addArrangedSubview(manualSection);manualSection.widthAnchor.constraint(equalTo:home.widthAnchor).isActive=true;home.detachesHiddenViews=true
        extensionID.isEditable=true;extensionID.isSelectable=true;extensionID.placeholderString="Paste the Chrome extension ID here";extensionID.font = .monospacedSystemFont(ofSize:14,weight:.regular)
        manualSection.addArrangedSubview(extensionID);extensionID.widthAnchor.constraint(equalTo:manualSection.widthAnchor).isActive=true
        let buttons=NSStackView();buttons.spacing=10
        for (title,action) in [("Connect Chrome extension",#selector(install)),("Remove native helper",#selector(remove))] { let button=NSButton(title:title,target:self,action:action);button.bezelStyle = .rounded;buttons.addArrangedSubview(button) }
        manualSection.addArrangedSubview(buttons);manualSection.isHidden=true
        status.isSelectable=true;status.textColor = .secondaryLabelColor;home.addArrangedSubview(status);status.widthAnchor.constraint(equalTo:home.widthAnchor).isActive=true
        label("Screen recording permission",in:home)
        home.addArrangedSubview(permissionInfo);permissionInfo.widthAnchor.constraint(equalTo:home.widthAnchor).isActive=true
        let permissions=NSButton(title:"Open macOS recording settings…",target:self,action:#selector(openRecordingSettings));permissions.bezelStyle = .rounded;home.addArrangedSubview(permissions)
        let foreground=NSButton(checkboxWithTitle:"Bring Chrome forward after capture",target:self,action:#selector(setForeground(_:)));foreground.state=screenController.bringReaderForward ? .on:.off;home.addArrangedSubview(foreground)
        label("Off keeps you in the source app. When enabled, Chrome comes forward after recognition; it may not select the reading tab.",in:home,small:true)
        label("OCR Companion for Migaku · 1.0.0 beta 9\nCreated by Baroni Fabio (pentestguru).\nUnofficial companion app. Not affiliated with Migaku.",in:home,small:true)
        screenController.onShowSettings={ [weak self] in self?.refreshSetupStatus() }
        refreshSetupStatus();window.makeKeyAndOrderFront(nil);NSApp.activate(ignoringOtherApps:true)
        screenController.start(setupWindow:window)
        if !UserDefaults.standard.bool(forKey:"setupWizardCompleted") && !UserDefaults.standard.bool(forKey:"setupWizardDeferred") { presentWizard(resume:true) }
        processPairingURLs()
    }
    func applicationDidBecomeActive(_ notification: Notification) { if window != nil { refreshSetupStatus();wizard?.refresh() } }
    func refreshSetupStatus() {
        permissionInfo.stringValue=CGPreflightScreenCaptureAccess() ? "Allowed. Screen capture is ready." : "Not allowed yet. Enable this app in macOS recording settings, then relaunch if requested."
        if extensionConnectionReady(),let bytes=try? Data(contentsOf:registration),let manifest=try? JSONSerialization.jsonObject(with:bytes) as? [String:Any],let origin=(manifest["allowed_origins"] as? [String])?.first,let id=URL(string:origin)?.host,valid(id) {
            connectionInfo.stringValue="● Connection configured. Chrome checks the helper from its settings page.";connectionInfo.textColor = .systemGreen;if extensionID.stringValue.isEmpty && !approvingPairing { extensionID.stringValue=id }
        } else { connectionInfo.stringValue="● Not connected. Start with Connect Mac app in Chrome extension settings.";connectionInfo.textColor = .systemRed }
    }
    func extensionConnectionReady() -> Bool {
        guard let data=try? Data(contentsOf:registration),let m=try? JSONSerialization.jsonObject(with:data) as? [String:Any],m["name"] as? String == hostName,let path=m["path"] as? String,path.hasPrefix(hostRoot.path+"/"),FileManager.default.isExecutableFile(atPath:path),let origins=m["allowed_origins"] as? [String],origins.count==1,let id=URL(string:origins[0])?.host,valid(id) else { return false }
        return true
    }
    @objc func showWizard() { presentWizard(resume:false) }
    func presentWizard(resume:Bool) {
        let guided=SetupWizard(owner:self);wizard=guided
        if resume {
            let d=UserDefaults.standard
            guided.state.position=max(0,min(d.integer(forKey:"setupWizardPosition"),guided.state.phases.count-1))
            if d.bool(forKey:"setupWizardRestartPending") || (d.bool(forKey:"setupWizardPermissionRequested") && guided.state.position==2) {
                d.removeObject(forKey:"setupWizardRestartPending")
                if extensionConnectionReady() && CGPreflightScreenCaptureAccess() {
                    d.set(true,forKey:"setupWizardCompleted");d.removeObject(forKey:"setupWizardPosition");d.removeObject(forKey:"setupWizardPermissionRequested");guided.state.position=3
                } else {
                    guided.state.position=extensionConnectionReady() ? 2:1
                    guided.restartMessage="Setup resumed. macOS still has not made screen recording available. Check its toggle; no further restart happens automatically."
                }
            }
        }
        guided.show()
    }
    @objc func showExtensionSetup() { refreshSetupStatus();window.makeKeyAndOrderFront(nil);NSApp.activate(ignoringOtherApps:true) }
    @objc func toggleManual(_ sender:NSButton) { manualSection.isHidden=sender.state != .on;if !manualSection.isHidden { window.makeFirstResponder(extensionID) } }
    @objc func setForeground(_ sender:NSButton) { screenController.bringReaderForward=sender.state == .on }
    @objc func openRecordingSettings() { if let url=URL(string:"x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture") { NSWorkspace.shared.open(url) } }
    func application(_ application: NSApplication, open urls: [URL]) {
        // Bounded requests; no callback URL, shell command or remote endpoint is accepted.
        if pendingPairingURLs.isEmpty { pendingPairingURLs.append(contentsOf:urls.prefix(1)) }
        processPairingURLs()
    }
    func processPairingURLs() {
        guard window != nil, !approvingPairing, !pendingPairingURLs.isEmpty else { return }
        let url=pendingPairingURLs.removeFirst()
        guard let id=PairingLink.extensionID(from:url) else {
            showExtensionSetup();status.stringValue="Invalid connection link. Use Connect Mac app in Chrome, or paste the extension ID manually.";return
        }
        approvingPairing=true;NSApp.activate(ignoringOtherApps:true)
        showExtensionSetup();extensionID.stringValue=id
        let alert=NSAlert();alert.messageText="Connect this Chrome extension?"
        alert.informativeText="Extension ID: \(id)\n\nApprove only if you just clicked Connect Mac app in your Chrome extension settings. A website can also open a connection link. Connecting authorizes this ID to use local OCR and replaces any existing OCR Companion connection."
        alert.addButton(withTitle:"Connect extension");alert.addButton(withTitle:"Cancel")
        if alert.runModal() == .alertFirstButtonReturn { install() }
        else { status.stringValue="Connection cancelled. No registration was changed." }
        approvingPairing=false;pendingPairingURLs.removeAll();if wizard?.window.isVisible == true { wizard?.refresh();window.orderOut(nil);wizard?.window.makeKeyAndOrderFront(nil) }
    }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { false }
    func valid(_ id:String) -> Bool { id.utf8.count == 32 && id.range(of:"^[a-p]{32}$",options:.regularExpression) != nil }
    func writeJSON(_ object:[String:Any],to url:URL) throws {
        try JSONSerialization.data(withJSONObject:object,options:[.prettyPrinted,.sortedKeys]).write(to:url,options:.atomic)
        try FileManager.default.setAttributes([.posixPermissions:0o600],ofItemAtPath:url.path)
    }
    @objc func install() {
        let id = extensionID.stringValue.trimmingCharacters(in:.whitespacesAndNewlines)
        guard valid(id) else { status.stringValue="Paste the full extension ID: exactly 32 lowercase letters a–p.";return }
        guard ImageAnalyzer.isSupported else { status.stringValue="Apple Live Text is not supported on this Mac.";return }
        do {
            let fm=FileManager.default,folder=hostRoot.appendingPathComponent(version,isDirectory:true)
            try fm.createDirectory(at:folder,withIntermediateDirectories:true,attributes:[.posixPermissions:0o700])
            try fm.setAttributes([.posixPermissions:0o700],ofItemAtPath:hostRoot.path)
            let binary=folder.appendingPathComponent("ocrcompanion-native")
            try Data(contentsOf:Bundle.main.bundleURL.appendingPathComponent("Contents/Helpers/ocrcompanion-native")).write(to:binary,options:.atomic)
            try fm.setAttributes([.posixPermissions:0o700],ofItemAtPath:binary.path)
            let origin="chrome-extension://\(id)/"
            try writeJSON(["allowed_origins":[origin],"protocol":1],to:folder.appendingPathComponent("allowed-origins.json"))
            try fm.createDirectory(at:registration.deletingLastPathComponent(),withIntermediateDirectories:true,attributes:[.posixPermissions:0o700])
            try writeJSON(["name":hostName,"description":"OCR Companion Apple Live Text helper","path":binary.path,"type":"stdio","allowed_origins":[origin]],to:registration)
            refreshSetupStatus();wizard?.refresh();status.stringValue="Connection saved. Chrome checks automatically; its status should turn green. You can close this window."
        } catch { status.stringValue="Installation failed: \(error.localizedDescription)" }
    }
    @objc func remove() {
        let alert=NSAlert();alert.messageText="Uninstall the OCR Companion native helper?";alert.informativeText="Removes this macOS user’s OCR Companion registration and installed native-helper versions. The Chrome extension and your old HTTP helper are not removed.";alert.addButton(withTitle:"Uninstall");alert.addButton(withTitle:"Cancel")
        guard alert.runModal() == .alertFirstButtonReturn else { return }
        do {
            let fm=FileManager.default
            if fm.fileExists(atPath:registration.path) {
                let bytes=try Data(contentsOf:registration)
                guard let manifest=try JSONSerialization.jsonObject(with:bytes) as? [String:Any],manifest["name"] as? String == hostName,let path=manifest["path"] as? String,path.hasPrefix(hostRoot.path+"/") else {
                    status.stringValue="Registration differs from this installer. No files were removed.";return
                }
                try fm.removeItem(at:registration)
            }
            if fm.fileExists(atPath:hostRoot.path) { try fm.removeItem(at:hostRoot) }
            refreshSetupStatus();status.stringValue="Native helper removed for this macOS user."
        } catch { status.stringValue="Uninstall failed: \(error.localizedDescription)" }
    }
}
@main struct Setup {
    @MainActor static func main() {
        let app=NSApplication.shared,delegate=SetupDelegate();app.delegate=delegate
        app.run();withExtendedLifetime(delegate){}
    }
}
