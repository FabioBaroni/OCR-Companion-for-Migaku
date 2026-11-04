import Foundation
@main struct WizardPlanTests {
 static func main() {
  let plan=WizardPlan();precondition(plan.phases == [.welcome,.chrome,.permission,.ready]);precondition(plan.canContinue(connection:false,permission:false))
  plan.position=1;precondition(!plan.canContinue(connection:false,permission:true));precondition(plan.canContinue(connection:true,permission:false))
  plan.position=2;precondition(!plan.canContinue(connection:true,permission:false));precondition(plan.canContinue(connection:false,permission:true))
  plan.position=3;precondition(!plan.canContinue(connection:true,permission:false));precondition(!plan.canContinue(connection:false,permission:true));precondition(plan.canContinue(connection:true,permission:true))
  plan.position = -1;precondition(plan.phase == .welcome);plan.position=999;precondition(plan.phase == .ready)
  print("PASS: fixed setup for both features, single permission step, connection/permission/finish gates and bounds.")
 }
}
