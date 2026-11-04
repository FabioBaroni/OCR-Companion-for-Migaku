import AppKit
import ScreenCaptureKit
import VisionKit
import Carbon.HIToolbox

private func hotKeyHandler(_ next: EventHandlerCallRef?, _ event: EventRef?, _ context: UnsafeMutableRawPointer?) -> OSStatus {
    guard let context, let event else { return OSStatus(eventNotHandledErr) }
    var value = EventHotKeyID()
    guard GetEventParameter(event, EventParamName(kEventParamDirectObject), EventParamType(typeEventHotKeyID), nil, MemoryLayout<EventHotKeyID>.size, nil, &value) == noErr else { return OSStatus(eventNotHandledErr) }
    let controller = Unmanaged<ScreenController>.fromOpaque(context).takeUnretainedValue()
    DispatchQueue.main.async { if value.id == 1 { controller.selectArea() } else { controller.readAgain() } }
    return noErr
}

@MainActor final class SelectionWindow: NSWindow {
    override var canBecomeKey: Bool { true }
}

@MainActor final class AreaView: NSView {
    var from: NSPoint?
    var to: NSPoint?
    var onFinish: ((NSRect?) -> Void)?
    override var acceptsFirstResponder: Bool { true }
    override func draw(_ dirtyRect: NSRect) {
        NSColor.black.withAlphaComponent(0.28).setFill(); bounds.fill()
        if let from, let to {
            let rect = NSRect(x: min(from.x,to.x), y:min(from.y,to.y), width:abs(to.x-from.x), height:abs(to.y-from.y))
            NSColor.white.withAlphaComponent(0.12).setFill(); rect.fill()
            NSColor.systemGreen.setStroke(); let path=NSBezierPath(rect:rect); path.lineWidth=2; path.stroke()
        }
        let label = "Drag around text • Escape to cancel"
        label.draw(at: NSPoint(x:24,y:bounds.height-50), withAttributes:[.foregroundColor:NSColor.white,.font:NSFont.boldSystemFont(ofSize:19)])
    }
    override func mouseDown(with event: NSEvent) { from=convert(event.locationInWindow,from:nil); to=from; needsDisplay=true }
    override func mouseDragged(with event: NSEvent) {
        let point = convert(event.locationInWindow,from:nil)
        to=NSPoint(x:max(0,min(bounds.width,point.x)),y:max(0,min(bounds.height,point.y))); needsDisplay=true
    }
    override func mouseUp(with event: NSEvent) {
        mouseDragged(with:event)
        guard let from, let to else { return }
        let rect=NSRect(x:min(from.x,to.x),y:min(from.y,to.y),width:abs(to.x-from.x),height:abs(to.y-from.y))
        onFinish?(rect.width >= 12 && rect.height >= 12 ? rect : nil)
    }
    override func keyDown(with event: NSEvent) { if event.keyCode == 53 { onFinish?(nil) } }
}

@MainActor final class ScreenController: NSObject, NSMenuItemValidation {
    struct Region {
        let displayID: CGDirectDisplayID
        let screenFrame: NSRect
        let scale: CGFloat
        let rect: NSRect // AppKit local display points, bottom-left origin
    }
    let server=ReaderServer()
    var readerURL: URL?
    var statusItem: NSStatusItem!
    var selectionWindows: [NSWindow]=[]
    var region: Region?
    var busy=false
    var language="zh-Hans"
    var bringReaderForward=false
    var shortcuts: [EventHotKeyRef]=[]
    var handler: EventHandlerRef?
    weak var setupWindow: NSWindow?
    var onShowSettings: (() -> Void)?
    var languageMenuItem: NSMenuItem?
    let stateItem=NSMenuItem(title:"Starting local reader…",action:nil,keyEquivalent:"")

    func start(setupWindow: NSWindow) {
        self.setupWindow=setupWindow
        statusItem=NSStatusBar.system.statusItem(withLength:NSStatusItem.variableLength)
        statusItem.button?.title="▣ OCR"
        let menu=NSMenu()
        add(menu,"Capture screen area…  ⌥⇧S",#selector(selectArea))
        add(menu,"Capture same area again  ⌥⇧R",#selector(readAgain))
        add(menu,"Open reading page",#selector(openReader))
        menu.addItem(.separator())
        let languages=NSMenu()
        for (code,title) in [("zh-Hans","Chinese — Simplified"),("zh-Hant","Chinese — Traditional"),("ja-JP","Japanese"),("ko-KR","Korean"),("en-US","English"),("fr-FR","French"),("de-DE","German"),("es-ES","Spanish"),("it-IT","Italian"),("pt-BR","Portuguese")] {
            let item=NSMenuItem(title:title,action:#selector(setLanguage(_:)),keyEquivalent:""); item.target=self; item.representedObject=code; item.state=code==language ? .on:.off; languages.addItem(item)
        }
        let choice=NSMenuItem(title:"OCR language: Chinese — Simplified",action:nil,keyEquivalent:""); choice.submenu=languages;languageMenuItem=choice;menu.addItem(choice)
        menu.addItem(.separator()); add(menu,"Settings & setup…",#selector(showSetup)); add(menu,"Quit",#selector(quit))
        statusItem.menu=menu
        registerHotKeys()
        do {
            try server.start { [weak self] result in
                DispatchQueue.main.async {
                    guard let self else { return }
                    switch result {
                    case .success(let url): self.readerURL=url; self.stateItem.title="Ready · Screen OCR"
                    case .failure(let error): self.report("Reader unavailable: \(error.localizedDescription)")
                    }
                }
            }
        } catch { report("Reader unavailable: \(error.localizedDescription)") }
    }
    func add(_ menu:NSMenu,_ title:String,_ action:Selector) {
        let item=NSMenuItem(title:title,action:action,keyEquivalent:""); item.target=self; menu.addItem(item)
    }
    func registerHotKeys() {
        var type=EventTypeSpec(eventClass: OSType(kEventClassKeyboard),eventKind:UInt32(kEventHotKeyPressed))
        let result=InstallEventHandler(GetApplicationEventTarget(),hotKeyHandler,1,&type,Unmanaged.passUnretained(self).toOpaque(),&handler)
        guard result == noErr else { return }
        for (id,key) in [(UInt32(1),UInt32(kVK_ANSI_S)),(UInt32(2),UInt32(kVK_ANSI_R))] {
            var reference: EventHotKeyRef?
            if RegisterEventHotKey(key,UInt32(optionKey | shiftKey),EventHotKeyID(signature:0x4d4f4352,id:id),GetApplicationEventTarget(),0,&reference)==noErr, let reference { shortcuts.append(reference) }
        }
        if shortcuts.count != 2 { report("A shortcut is unavailable. Use the OCR Companion menu instead.") }
    }
    @objc func openReader() {
        guard let url=readerURL else { report("The local reader is not ready yet."); return }
        guard let chrome=NSWorkspace.shared.urlForApplication(withBundleIdentifier:"com.google.Chrome") else {
            report("Install Google Chrome to use the Migaku reader. No other browser will be opened."); return
        }
        // Native macOS URL delivery opens in the installed Chrome/profile, not a WebView.
        // Explicit Open Reader may open another tab; captures themselves never create tabs.
        let config=NSWorkspace.OpenConfiguration(); config.activates=true
        NSWorkspace.shared.open([url],withApplicationAt:chrome,configuration:config) { _,error in
            if let error { DispatchQueue.main.async { self.report("Could not open Chrome: \(error.localizedDescription)") } }
        }
    }
    @objc func selectArea() {
        guard !busy, selectionWindows.isEmpty else { return }
        guard readerURL != nil else { report("The local reader is not ready yet."); return }
        guard ImageAnalyzer.isSupported else { report("Apple Live Text is not supported on this Mac."); return }
        guard CGPreflightScreenCaptureAccess() else {
            _ = CGRequestScreenCaptureAccess()
            report("Allow OCR Companion for Migaku in System Settings → Privacy & Security → Screen & System Audio Recording, then retry. A relaunch may be required."); return
        }
        hideAppWindows()
        for screen in NSScreen.screens {
            guard let id=(screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber)?.uint32Value else { continue }
            let window=SelectionWindow(contentRect:screen.frame,styleMask:.borderless,backing:.buffered,defer:false)
            window.level = .screenSaver; window.backgroundColor = .clear; window.isOpaque=false; window.isReleasedWhenClosed=false
            window.collectionBehavior=[.canJoinAllSpaces,.fullScreenAuxiliary]; window.ignoresMouseEvents=false
            let view=AreaView(frame:NSRect(origin:.zero,size:screen.frame.size))
            view.onFinish={ [weak self] rect in
                guard let self else { return }
                self.dismissSelection()
                guard let rect else { return }
                self.region=Region(displayID:id,screenFrame:screen.frame,scale:screen.backingScaleFactor,rect:rect)
                // Allow the selection overlay to disappear before acquiring a frame.
                Task { try? await Task.sleep(nanoseconds:180_000_000); self.readAgain() }
            }
            window.contentView=view; selectionWindows.append(window); window.makeKeyAndOrderFront(nil); window.makeFirstResponder(view)
        }
        NSApp.activate(ignoringOtherApps:true)
    }
    func hideAppWindows() {
        for window in NSApp.windows where window.isVisible { window.orderOut(nil) }
    }
    func dismissSelection() { for window in selectionWindows { window.orderOut(nil); window.close() }; selectionWindows.removeAll() }
    @objc func readAgain() {
        guard !busy, selectionWindows.isEmpty else { return }
        guard let region else { selectArea(); return }
        guard CGPreflightScreenCaptureAccess() else { report("Screen capture permission is missing. Choose Select screen area again."); return }
        guard let screen=NSScreen.screens.first(where:{ ($0.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber)?.uint32Value==region.displayID }),screen.frame==region.screenFrame,screen.backingScaleFactor==region.scale else {
            self.region=nil; report("Display layout or scaling changed. Select the screen area again."); return
        }
        hideAppWindows()
        busy=true; let selectedLanguage=language
        stateItem.title="Recognizing selected area…"; server.publish(status:"Recognizing selected area…",language:selectedLanguage)
        Task {
            defer { busy=false }
            do {
                let content=try await SCShareableContent.excludingDesktopWindows(false,onScreenWindowsOnly:true)
                guard let display=content.displays.first(where:{$0.displayID==region.displayID}) else { throw failure("Selected display is unavailable. Select an area again.") }
                let own=content.applications.filter{$0.processID==ProcessInfo.processInfo.processIdentifier}
                let filter=SCContentFilter(display:display,excludingApplications:own,exceptingWindows:[])
                let config=SCStreamConfiguration()
                guard let crop=ScreenGeometry.crop(region.rect,displaySize:region.screenFrame.size,scale:region.scale) else { throw failure("Selected area is invalid or too large. Select a smaller region.") }
                config.sourceRect=crop.sourceRect; config.width=crop.pixelWidth; config.height=crop.pixelHeight; config.showsCursor=false
                let image=try await SCScreenshotManager.captureImage(contentFilter:filter,configuration:config)
                guard ImageAnalyzer.supportedTextRecognitionLanguages.contains(selectedLanguage) else { throw failure("This macOS version does not support the selected recognition language.") }
                var options=ImageAnalyzer.Configuration(.text); options.locales=[selectedLanguage]
                let analysis=try await ImageAnalyzer().analyze(image,orientation:.up,configuration:options)
                guard analysis.transcript.utf8.count<=700_000 else { throw failure("Recognized text is too large. Select a smaller region.") }
                let count=analysis.transcript.split(separator:"\n").count
                server.publish(text:analysis.transcript,status:count==0 ? "No text found. Try a tighter area or another recognition language." : "\(count) lines recognized · Apple Live Text",language:selectedLanguage)
                stateItem.title=count==0 ? "No text found" : "\(count) lines recognized"
                if bringReaderForward { NSRunningApplication.runningApplications(withBundleIdentifier:"com.google.Chrome").first?.activate(options:[]) }
            } catch { report("Screen OCR failed: \(error.localizedDescription)") }
        }
    }
    func failure(_ message:String)->NSError { NSError(domain:"OCRCompanion",code:1,userInfo:[NSLocalizedDescriptionKey:message]) }
    func report(_ message:String) {
        stateItem.title=message; server.publish(status:message,language:language)
        let alert=NSAlert(); alert.messageText="OCR Companion for Migaku"; alert.informativeText=message; alert.addButton(withTitle:"OK"); alert.runModal()
    }
    @objc func setLanguage(_ item:NSMenuItem) {
        guard let code=item.representedObject as? String else { return }; language=code;languageMenuItem?.title="OCR language: \(item.title)"
        for sibling in item.menu?.items ?? [] { sibling.state=sibling===item ? .on:.off }
        server.publish(status:"Recognition language changed. Capture again; select the matching language in Migaku too.",language:language)
    }
    @objc func toggleForeground(_ item:NSMenuItem) { bringReaderForward.toggle(); item.state=bringReaderForward ? .on:.off }
    @objc func clearText() { server.clear() }
    @objc func showSetup() { onShowSettings?();setupWindow?.makeKeyAndOrderFront(nil); NSApp.activate(ignoringOtherApps:true) }
    func validateMenuItem(_ item: NSMenuItem) -> Bool {
        if item.action == #selector(readAgain) { return region != nil && !busy }
        if item.action == #selector(selectArea) { return !busy }
        if item.action == #selector(openReader) { return readerURL != nil }
        return true
    }
    @objc func quit() { NSApp.terminate(nil) }
}
