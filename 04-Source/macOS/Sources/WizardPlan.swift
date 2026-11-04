import Foundation

enum WizardPhase { case welcome, chrome, permission, ready
    var title:String { switch self {case .welcome:return "Welcome — let’s get set up";case .chrome:return "Connect the Chrome extension";case .permission:return "Allow screen capture";case .ready:return "You’re ready"} }
}
final class WizardPlan {
    var position=0
    let phases:[WizardPhase] = [.welcome,.chrome,.permission,.ready]
    func canContinue(connection:Bool,permission:Bool)->Bool {
        switch phase {case .welcome:return true;case .chrome:return connection;case .permission:return permission;case .ready:return connection && permission}
    }
    var phase:WizardPhase { phases[min(max(0,position),phases.count-1)] }
}
