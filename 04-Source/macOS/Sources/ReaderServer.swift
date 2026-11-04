import Foundation
import Network
import Security

struct ReaderSnapshot: Codable {
    var revision: Int = 0
    var textRevision: Int = 0
    var text: String = ""
    var status: String = "Ready. Select a screen area in OCR Companion."
    var language: String = "zh-Hans"
}
struct ReaderReply {
    var status: Int
    var type: String = "text/plain; charset=utf-8"
    var body: Data = Data()
}
// Pure request policy, also exercised without starting the app.
struct ReaderPolicy {
    let port: UInt16
    let key: String
    var origin: String { "http://127.0.0.1:\(port)" }
    func route(_ request: String, snapshot: ReaderSnapshot, assets: [String: Data]) -> ReaderReply {
        let lines = request.components(separatedBy: "\r\n")
        guard let first = lines.first else { return ReaderReply(status: 400) }
        let start = first.split(separator: " ", omittingEmptySubsequences: false)
        guard start.count == 3, start[2] == "HTTP/1.1" else { return ReaderReply(status: 400) }
        guard start[0] == "GET" else { return ReaderReply(status: 405) }
        var headers: [String: String] = [:]
        for line in lines.dropFirst() where !line.isEmpty {
            guard let colon = line.firstIndex(of: ":") else { return ReaderReply(status: 400) }
            let name = line[..<colon].lowercased()
            guard headers[name] == nil else { return ReaderReply(status: 400) }
            headers[name] = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
        }
        guard headers["host"] == "127.0.0.1:\(port)", headers["transfer-encoding"] == nil,
              headers["content-length"] == nil || headers["content-length"] == "0" else { return ReaderReply(status: 403) }
        if let source = headers["origin"], source != origin { return ReaderReply(status: 403) }
        if let site = headers["sec-fetch-site"], !["same-origin", "none"].contains(site) { return ReaderReply(status: 403) }
        let path = String(start[1])
        if path == "/state" {
            guard headers["x-ocrcompanion-session"] == key, headers["sec-fetch-site"] == "same-origin" else { return ReaderReply(status: 403) }
            return ReaderReply(status: 200, type: "application/json; charset=utf-8", body: (try? JSONEncoder().encode(snapshot)) ?? Data())
        }
        let types = ["/": "text/html; charset=utf-8", "/reader.css": "text/css; charset=utf-8", "/reader.js": "text/javascript; charset=utf-8"]
        guard let type = types[path], let body = assets[path] else { return ReaderReply(status: 404) }
        return ReaderReply(status: 200, type: type, body: body)
    }
}

final class ReaderServer {
    private let queue = DispatchQueue(label: "local.ocrcompanion.screen-reader")
    private var listener: NWListener?
    private var snapshot = ReaderSnapshot()
    private var connections: [UUID: NWConnection] = [:]
    private var assets: [String: Data] = [:]
    private(set) var policy: ReaderPolicy!
    var url: URL { URL(string: policy.origin + "/#session=" + policy.key)! }
    func start(ready: @escaping (Result<URL, Error>) -> Void) throws {
        var random = [UInt8](repeating: 0, count: 32)
        guard SecRandomCopyBytes(kSecRandomDefault, random.count, &random) == errSecSuccess else {
            throw NSError(domain: "OCRCompanion", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not create a secure reader session."])
        }
        let key = random.map { String(format: "%02x", $0) }.joined()
        guard let root = Bundle.main.resourceURL?.appendingPathComponent("Reader") else { throw CocoaError(.fileNoSuchFile) }
        for (path, file) in ["/": "index.html", "/reader.css": "reader.css", "/reader.js": "reader.js"] {
            assets[path] = try Data(contentsOf: root.appendingPathComponent(file))
        }
        let parameters = NWParameters.tcp
        // Bind only IPv4 loopback; never expose the reader to the LAN.
        parameters.requiredLocalEndpoint = .hostPort(host: "127.0.0.1", port: .any)
        let listener = try NWListener(using: parameters)
        self.listener = listener
        listener.newConnectionHandler = { [weak self] connection in self?.accept(connection) }
        var completed = false
        listener.stateUpdateHandler = { [weak self] state in
            guard let self else { return }
            switch state {
            case .ready:
                guard !completed, let port = listener.port else { return }; completed = true
                self.policy = ReaderPolicy(port: port.rawValue, key: key)
                ready(.success(self.url))
            case .failed(let error): if !completed { completed = true; ready(.failure(error)) }
            default: break
            }
        }
        listener.start(queue: queue)
    }
    func publish(text: String? = nil, status: String, language: String) {
        queue.async {
            if let text { self.snapshot.text = text; self.snapshot.textRevision += 1 }
            self.snapshot.status = status; self.snapshot.language = language
            self.snapshot.revision += 1
        }
    }
    func clear() { publish(text: "", status: "Text cleared. Ready for another capture.", language: "zh-Hans") }
    private func accept(_ connection: NWConnection) {
        guard connections.count < 16 else { connection.cancel(); return }
        let id = UUID(); connections[id] = connection
        connection.stateUpdateHandler = { [weak self] state in
            if case .cancelled = state { self?.connections.removeValue(forKey: id) }
            if case .failed = state { self?.connections.removeValue(forKey: id) }
        }
        connection.start(queue: queue)
        queue.asyncAfter(deadline: .now() + 5) { connection.cancel() }
        receive(connection, data: Data())
    }
    private func receive(_ connection: NWConnection, data: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 8192) { [weak self] bytes, _, complete, error in
            guard let self else { connection.cancel(); return }
            var data = data; if let bytes { data.append(bytes) }
            guard data.count <= 8192 else { self.send(ReaderReply(status: 413), connection); return }
            if let range = data.range(of: Data("\r\n\r\n".utf8)) {
                guard range.upperBound == data.endIndex, let request = String(data: data[..<range.lowerBound], encoding: .utf8), let policy = self.policy else {
                    self.send(ReaderReply(status: 400), connection); return
                }
                self.send(policy.route(request, snapshot: self.snapshot, assets: self.assets), connection)
            } else if complete || error != nil { connection.cancel() }
            else { self.receive(connection, data: data) }
        }
    }
    private func send(_ response: ReaderReply, _ connection: NWConnection) {
        let reason = response.status == 200 ? "OK" : "Request rejected"
        let headers = "HTTP/1.1 \(response.status) \(reason)\r\nContent-Type: \(response.type)\r\nContent-Length: \(response.body.count)\r\nConnection: close\r\nCache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\nReferrer-Policy: no-referrer\r\nContent-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'\r\n\r\n"
        var bytes = Data(headers.utf8); bytes.append(response.body)
        connection.send(content: bytes, completion: .contentProcessed { _ in connection.cancel() })
    }
}
