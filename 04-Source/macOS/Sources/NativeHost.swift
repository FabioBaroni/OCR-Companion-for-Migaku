import Foundation
import VisionKit
import ImageIO

// stdout is exclusively Chrome's length-prefixed native messaging protocol.
@main struct NativeHost {
    static let version = "1.1.1"
    static let maxFrame = 24 * 1024 * 1024
    static let maxImage = 16 * 1024 * 1024
    static let maxResponse = 900_000
    static let languages: Set<String> = ["zh-Hans","zh-Hant","ja-JP","ko-KR","en-US","fr-FR","de-DE","es-ES","it-IT","pt-BR"]
    struct Failure: Error { let code: String; let message: String }
    static func fail(_ code: String, _ message: String) -> Failure { Failure(code:code,message:message) }
    static func readExact(_ count: Int) throws -> Data? {
        var bytes = Data(); bytes.reserveCapacity(count)
        while bytes.count < count {
            guard let part = try FileHandle.standardInput.read(upToCount:count-bytes.count), !part.isEmpty else {
                if bytes.isEmpty { return nil }
                throw fail("truncated_message", "Incomplete native message.")
            }
            bytes.append(part)
        }
        return bytes
    }
    static func emit(_ payload: [String:Any]) {
        guard var bytes = try? JSONSerialization.data(withJSONObject:payload,options:[.sortedKeys]) else { return }
        if bytes.count > maxResponse {
            bytes = try! JSONSerialization.data(withJSONObject:["ok":false,"error":"Recognized text is too large. Capture a smaller area.","code":"response_too_large"])
        }
        var length = UInt32(bytes.count)
        do {
            try withUnsafeBytes(of:&length) { try FileHandle.standardOutput.write(contentsOf:Data($0)) }
            try FileHandle.standardOutput.write(contentsOf:bytes)
        } catch { exit(1) }
    }
    static func callerAllowed() -> Bool {
        guard CommandLine.arguments.count == 2 else { return false }
        let origin = CommandLine.arguments[1]
        guard origin.range(of:"^chrome-extension://[a-p]{32}/$",options:.regularExpression) != nil else { return false }
        let executable = URL(fileURLWithPath:CommandLine.arguments[0]).standardizedFileURL.resolvingSymlinksInPath()
        let config = executable.deletingLastPathComponent().appendingPathComponent("allowed-origins.json")
        guard let bytes = try? Data(contentsOf:config), bytes.count < 4096,
              let object = try? JSONSerialization.jsonObject(with:bytes) as? [String:Any],
              let origins = object["allowed_origins"] as? [String] else { return false }
        return origins.contains(origin)
    }
    static func process(_ request: [String:Any]) async throws -> [String:Any] {
        guard let protocolVersion = request["v"] as? Int, protocolVersion == 1 else { throw fail("protocol_version","Unsupported native protocol version.") }
        guard let action = request["action"] as? String else { throw fail("invalid_request","Missing action.") }
        if action == "health" {
            return ["ok":true,"protocol":1,"version":version,"engine":"Apple Live Text","supported":ImageAnalyzer.isSupported,
                    "languages":ImageAnalyzer.supportedTextRecognitionLanguages.filter { languages.contains($0) }]
        }
        guard action == "ocr" else { throw fail("invalid_action","Unsupported action.") }
        guard let language = request["language"] as? String, languages.contains(language) else { throw fail("invalid_language","Unsupported OCR language.") }
        guard let encoded = request["image"] as? String, !encoded.isEmpty, encoded.utf8.count <= ((maxImage+2)/3)*4,
              let imageData = Data(base64Encoded:encoded), !imageData.isEmpty, imageData.count <= maxImage else {
            throw fail("invalid_image","Provide a valid base64 image under 16 MB.")
        }
        guard let source = CGImageSourceCreateWithData(imageData as CFData,[kCGImageSourceShouldCache:false] as CFDictionary),
              let properties = CGImageSourceCopyPropertiesAtIndex(source,0,nil) as? [CFString:Any],
              let width = properties[kCGImagePropertyPixelWidth] as? NSNumber,
              let height = properties[kCGImagePropertyPixelHeight] as? NSNumber,
              width.int64Value > 0, height.int64Value > 0, width.int64Value <= 20000, height.int64Value <= 20000,
              width.int64Value * height.int64Value <= 40_000_000 else {
            throw fail("invalid_image","Invalid image or image dimensions exceed the 40-megapixel limit.")
        }
        guard ImageAnalyzer.isSupported else { throw fail("unsupported_mac","Apple Live Text is not supported on this Mac.") }
        guard ImageAnalyzer.supportedTextRecognitionLanguages.contains(language) else { throw fail("unsupported_language","This macOS version does not support the selected OCR language.") }
        guard let image = CGImageSourceCreateImageAtIndex(source,0,[kCGImageSourceShouldCache:false] as CFDictionary) else { throw fail("decode_failed","The image could not be decoded.") }
        let orientationValue = (properties[kCGImagePropertyOrientation] as? NSNumber)?.uint32Value ?? 1
        let orientation = CGImagePropertyOrientation(rawValue:orientationValue) ?? .up
        var configuration = ImageAnalyzer.Configuration(.text); configuration.locales = [language]
        let start = Date()
        do {
            let analysis = try await ImageAnalyzer().analyze(image,orientation:orientation,configuration:configuration)
            guard analysis.transcript.utf8.count <= 700_000 else { throw fail("response_too_large","Recognized text is too large. Capture a smaller area.") }
            let lines = analysis.transcript.split(separator:"\n").map { ["text":String($0)] }
            return ["ok":true,"lines":lines,"seconds":Date().timeIntervalSince(start),"engine":"Apple Live Text (VisionKit)"]
        } catch let e as Failure { throw e }
        catch { let e = error as NSError; throw fail("ocr_failed","Apple Live Text failed (\(e.domain), \(e.code)).") }
    }
    static func main() async {
        guard callerAllowed() else { emit(["ok":false,"code":"unauthorized_origin","error":"This extension is not connected. Run OCR Companion for Migaku and connect the extension ID shown in Settings."]); return }
        while true {
            do {
                guard let header = try readExact(4) else { return }
                let length = header.withUnsafeBytes { $0.loadUnaligned(as:UInt32.self) }
                guard length > 0, length <= maxFrame else { emit(["ok":false,"code":"invalid_length","error":"Native message exceeds the allowed size."]); return }
                guard let body = try readExact(Int(length)), let request = try JSONSerialization.jsonObject(with:body) as? [String:Any] else { throw fail("invalid_request","Expected a JSON object.") }
                do { emit(try await process(request)) }
                catch let e as Failure { emit(["ok":false,"code":e.code,"error":e.message]) }
                catch { emit(["ok":false,"code":"internal_error","error":"Native helper failed."]) }
            } catch let e as Failure { emit(["ok":false,"code":e.code,"error":e.message]); return }
            catch { emit(["ok":false,"code":"invalid_request","error":"Malformed native message."]); return }
        }
    }
}
