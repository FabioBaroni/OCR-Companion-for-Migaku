import Foundation
@main struct PairingLinkTests {
 static func main() {
  let id=String(repeating:"a",count:32)
  for value in ["ocrcompanion://connect?extension_id=\(id)","ocrcompanion://connect/?extension_id=\(id)"] { precondition(PairingLink.extensionID(from:URL(string:value)!)==id) }
  for value in ["https://connect?extension_id=\(id)","ocrcompanion://other?extension_id=\(id)","ocrcompanion://connect/path?extension_id=\(id)","ocrcompanion://user@connect?extension_id=\(id)","ocrcompanion://connect:80?extension_id=\(id)","ocrcompanion://connect?extension_id=\(id)#x","ocrcompanion://connect?extension_id=\(id)&extension_id=\(id)","ocrcompanion://connect?extension_id=\(id)&callback=https://example.com","ocrcompanion://connect?extension_id=ABC","ocrcompanion://connect?extension_id=\(id)%0A","ocrcompanion://connect?extension_id=\(String(repeating:"a",count:300))"] {
   precondition(PairingLink.extensionID(from:URL(string:value)!)==nil,value)
  }
  print("PASS: exact pairing route/ID; rejects foreign scheme/host/path, credentials, port, fragments, duplicate/extra query items, malformed/oversized IDs.")
 }
}
