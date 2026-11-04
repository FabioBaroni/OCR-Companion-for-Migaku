import AppKit
import Darwin

// A short-lived child waits for this app to exit, then reopens that same bundle.
// No shell, arbitrary URL, network endpoint or user-supplied path is accepted.
@main struct RestartLauncher {
    static func main() {
        guard CommandLine.arguments.count == 2,let parent=Int32(CommandLine.arguments[1]),parent>1 else { exit(2) }
        let executable=URL(fileURLWithPath:CommandLine.arguments[0]).resolvingSymlinksInPath()
        let bundle=executable.deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
        guard bundle.pathExtension == "app",let info=NSDictionary(contentsOf:bundle.appendingPathComponent("Contents/Info.plist")),info["CFBundleIdentifier"] as? String == "local.ocrcompanion.app" else { exit(2) }
        let deadline=Date().addingTimeInterval(20)
        while kill(parent,0)==0 { if Date()>deadline { exit(3) };Thread.sleep(forTimeInterval:0.1) }
        let configuration=NSWorkspace.OpenConfiguration();configuration.activates=true
        var finished=false,success=false
        NSWorkspace.shared.openApplication(at:bundle,configuration:configuration) { _,error in success=error==nil;finished=true }
        let launchDeadline=Date().addingTimeInterval(20)
        while !finished && Date()<launchDeadline { RunLoop.current.run(until:Date().addingTimeInterval(0.1)) }
        exit(success ? 0:4)
    }
}
