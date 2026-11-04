import AppKit
import CoreGraphics

@MainActor final class SetupWizard: NSObject, NSWindowDelegate {
    weak var owner: SetupDelegate?
    let window=NSWindow(contentRect:NSRect(x:0,y:0,width:650,height:640),styleMask:[.titled,.closable,.miniaturizable],backing:.buffered,defer:false)
    let state=WizardPlan()
    var info=NSTextField(wrappingLabelWithString:"")
    var nextButton:NSButton!
    var permissionRequested=false
    var permissionButton:NSButton?
    var restartProcess:Process?
    var isRestarting=false
    var restartMessage:String?
    init(owner:SetupDelegate) {
        self.owner=owner;super.init();window.title="Guided setup — OCR Companion for Migaku";window.center();window.isReleasedWhenClosed=false;window.delegate=self
    }
    func show() { owner?.window.orderOut(nil);render();window.makeKeyAndOrderFront(nil);NSApp.activate(ignoringOtherApps:true) }
    func line(_ value:String,_ parent:NSStackView,small:Bool=false) { owner?.label(value,in:parent,small:small) }
    func button(_ title:String,_ action:Selector,_ parent:NSStackView) { let b=NSButton(title:title,target:self,action:action);b.bezelStyle = .rounded;parent.addArrangedSubview(b) }
    func render() {
        window.contentView?.subviews.forEach{$0.removeFromSuperview()}
        guard let owner else { return };let form=owner.stack(in:window)
        let heading=NSTextField(labelWithString:state.phase.title);heading.font = .boldSystemFont(ofSize:24);form.addArrangedSubview(heading)
        line("Step \(state.position+1) of \(state.phases.count)",form,small:true)
        switch state.phase {
        case .welcome:
            line("We’ll connect the Chrome extension and enable screen capture. Both features will be ready; choose what to use whenever you need it.",form)
            line("Have Google Chrome and Migaku installed. There is one macOS Screen & System Audio Recording permission for this app. No microphone or audio capture is needed.",form,small:true)
        case .chrome:
            line("1. Click Prepare extension folder. Keep this folder: Chrome loads the extension from it.\n2. In Chrome, open Extensions, enable Developer mode and choose Load unpacked. Select the prepared folder.\n3. Open the extension’s settings, click Connect Mac app and confirm the connection here. No copying an ID is needed.",form)
            button("Prepare extension folder…",#selector(prepareExtension),form)
            button("Open Chrome Extensions",#selector(openChromeExtensions),form)
            line("Already installed? Open its settings and click Connect Mac app. Once Chrome shows Connected, return here and continue.",form,small:true)
        case .permission:
            line("Enable OCR Companion for Migaku under macOS Screen & System Audio Recording. This is one permission; the app only captures screen pixels when you ask.",form)
            let permission=NSButton(title:"Enable screen recording…",target:self,action:#selector(enablePermission));permission.bezelStyle = .rounded;form.addArrangedSubview(permission);permissionButton=permission
            line("The first click requests permission. If macOS opens its settings, enable the app there and return here. We will not open a second settings window automatically.",form,small:true)
            line("If permission needs a restart, Restart & finish setup will close and reopen this installed app for you. Setup is checked again automatically; no extra setup step is required after restart. If reopening fails, open the app from Applications to resume.",form,small:true)
            line("After setup: use ▣ OCR → Capture screen area… (Option + Shift + S), Capture same area again (Option + Shift + R), or Open reading page. On a web page, click the Chrome extension icon. Match the language in Migaku.",form,small:true)
        case .ready:
            line("Chrome extension: click its toolbar icon on a readable page to recognize text in the page overlay.",form)
            line("Screen capture: use ▣ OCR → Capture screen area… (Option + Shift + S). Read the same area again with Option + Shift + R. Open reading page from the menu to study the result.",form)
            line("Choose the same language in OCR Companion and Migaku. Enable Migaku Full power for automatic markings. Settings & setup remains available from ▣ OCR.",form,small:true)
        }
        info=NSTextField(wrappingLabelWithString:"");form.addArrangedSubview(info);info.widthAnchor.constraint(equalTo:form.widthAnchor).isActive=true
        let nav=NSStackView();nav.spacing=10;form.addArrangedSubview(nav)
        if state.position>0 { button("Back",#selector(back),nav) }
        nextButton=NSButton(title:state.phase == .ready ? "Done":"Continue",target:self,action:#selector(next));nextButton.bezelStyle = .rounded;nav.addArrangedSubview(nextButton)
        if state.phase != .ready { button("Set up later",#selector(later),nav) };refresh()
    }
    func refresh() {
        guard let owner else { return }
        switch state.phase {
        case .welcome: info.stringValue="";nextButton?.isEnabled=true
        case .chrome:
            let connected=owner.extensionConnectionReady();info.stringValue=connected ? "● Connection configured on this Mac. Chrome checks the helper automatically." : "● Not connected. Follow the steps above; this status updates when you return."
            info.textColor=connected ? .systemGreen:.systemRed;nextButton?.isEnabled=connected
        case .permission:
            let allowed=CGPreflightScreenCaptureAccess();if allowed { restartMessage=nil }
            info.stringValue=restartMessage ?? (allowed ? "● Screen recording is available. Finish setup to start using the app.":permissionRequested ? "● After enabling the toggle in macOS, restart here to apply it. The running app cannot yet use screen recording.":"● Screen recording is not available yet. Click Enable screen recording to begin.")
            info.textColor=allowed ? .systemGreen:.systemRed
            permissionButton?.isHidden=allowed
            permissionButton?.title=permissionRequested ? "Open recording settings…":"Enable screen recording…"
            nextButton?.title=allowed ? "Finish setup":"Restart & finish setup"
            nextButton?.isEnabled=allowed || permissionRequested
        case .ready: let ready=state.canContinue(connection:owner.extensionConnectionReady(),permission:CGPreflightScreenCaptureAccess());info.stringValue=ready ? "Setup is complete. Both features are ready to use.":"A required setup condition changed. Go Back to check connection or permission.";info.textColor=ready ? .systemGreen:.systemRed;nextButton?.isEnabled=ready
        }
    }
    func completeSetup() {
        let d=UserDefaults.standard;d.set(true,forKey:"setupWizardCompleted");d.removeObject(forKey:"setupWizardPosition");d.removeObject(forKey:"setupWizardRestartPending");d.removeObject(forKey:"setupWizardPermissionRequested")
    }
    @objc func next() {
        refresh();guard nextButton.isEnabled else { return }
        if state.phase == .ready { window.orderOut(nil);return }
        if state.phase == .permission {
            if !CGPreflightScreenCaptureAccess() { restartAndFinish();return }
            guard owner?.extensionConnectionReady() == true else { state.position=1;render();return }
            completeSetup();state.position=3;render();nextButton.title="Done";return
        }
        state.position+=1;saveProgress();render()
    }
    @objc func back() { state.position=max(0,state.position-1);saveProgress();render() }
    func saveProgress() { UserDefaults.standard.set(state.position,forKey:"setupWizardPosition") }
    func restartAndFinish() {
        guard let helper=Bundle.main.executableURL?.deletingLastPathComponent().deletingLastPathComponent().appendingPathComponent("Helpers/ocrcompanion-restart") else { return }
        let process=Process();process.executableURL=helper;process.arguments=[String(ProcessInfo.processInfo.processIdentifier)]
        do {
            try process.run();restartProcess=process
            saveProgress();let d=UserDefaults.standard;d.set(false,forKey:"setupWizardCompleted");d.set(false,forKey:"setupWizardDeferred");d.set(true,forKey:"setupWizardRestartPending");d.synchronize()
            isRestarting=true;NSApp.terminate(nil)
        } catch { info.stringValue="Could not restart automatically: \(error.localizedDescription). Quit and reopen the app manually; setup will resume." }
    }
    @objc func later() { UserDefaults.standard.set(true,forKey:"setupWizardDeferred");window.orderOut(nil);owner?.showExtensionSetup() }
    func windowShouldClose(_ sender:NSWindow)->Bool { if isRestarting { return true };later();return false }
    @objc func enablePermission() {
        if permissionRequested { owner?.openRecordingSettings();return }
        permissionRequested=true;restartMessage=nil;UserDefaults.standard.set(true,forKey:"setupWizardPermissionRequested");UserDefaults.standard.synchronize()
        _=CGRequestScreenCaptureAccess();refresh()
    }
    @objc func prepareExtension() {
        guard let source=Bundle.main.resourceURL?.appendingPathComponent("ChromeExtension") else { return }
        let destination=FileManager.default.urls(for:.applicationSupportDirectory,in:.userDomainMask)[0].appendingPathComponent("OCRCompanion/ChromeExtension",isDirectory:true)
        do {
            let fm=FileManager.default
            // Never overwrite a user's loaded folder silently.
            if !fm.fileExists(atPath:destination.path) { try fm.createDirectory(at:destination.deletingLastPathComponent(),withIntermediateDirectories:true);try fm.copyItem(at:source,to:destination) }
            NSWorkspace.shared.selectFile(nil,inFileViewerRootedAtPath:destination.path)
            info.stringValue="Extension folder opened in Finder. Choose this same folder in Chrome’s Load unpacked dialog. Existing folder contents are preserved."
        } catch { info.stringValue="Could not prepare the folder: \(error.localizedDescription). You can use 02-Chrome-Extension from the release ZIP instead." }
    }
    @objc func openChromeExtensions() {
        guard let app=NSWorkspace.shared.urlForApplication(withBundleIdentifier:"com.google.Chrome"),let url=URL(string:"chrome://extensions/") else { info.stringValue="Install Google Chrome, then return to this step.";return }
        NSWorkspace.shared.open([url],withApplicationAt:app,configuration:NSWorkspace.OpenConfiguration())
    }
}
