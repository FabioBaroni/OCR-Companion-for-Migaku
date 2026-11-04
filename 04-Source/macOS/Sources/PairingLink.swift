import Foundation

enum PairingLink {
    static func extensionID(from url: URL) -> String? {
        guard url.absoluteString.utf8.count <= 256,
              let parts = URLComponents(url:url,resolvingAgainstBaseURL:false),
              parts.scheme == "ocrcompanion", parts.host == "connect",
              parts.user == nil, parts.password == nil, parts.port == nil,
              parts.fragment == nil, parts.path.isEmpty || parts.path == "/",
              let items=parts.queryItems, items.count == 1,
              items[0].name == "extension_id", let id=items[0].value, id.utf8.count == 32,
              id.range(of:"^[a-p]{32}$",options:.regularExpression) != nil else { return nil }
        return id
    }
}
