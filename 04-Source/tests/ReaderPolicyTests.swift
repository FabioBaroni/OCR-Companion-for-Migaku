import Foundation
import CoreGraphics
@main struct PolicyTests {
    static func main() throws {
        let policy=ReaderPolicy(port:43187,key:String(repeating:"a",count:64))
        let assets=["/":Data("reader".utf8),"/reader.js":Data("script".utf8),"/reader.css":Data("style".utf8)]
        let sample=ReaderSnapshot(revision:7,text:"我喜欢学习。\n日本語\n한국어",status:"Ready",language:"zh-Hans")
        func request(_ path:String="/",method:String="GET",host:String="127.0.0.1:43187",extra:String="")->String {
            "\(method) \(path) HTTP/1.1\r\nHost: \(host)\r\n\(extra)"
        }
        var count=0
        func check(_ source:String,_ code:Int) {
            let reply=policy.route(source,snapshot:sample,assets:assets)
            precondition(reply.status==code,"Expected \(code), received \(reply.status) for \(source)");count+=1
        }
        check(request(),200)
        check(request("/reader.js"),200)
        check(request("/reader.css"),200)
        check(request("/state"),403)
        let auth="X-OCRCompanion-Session: \(policy.key)\r\nSec-Fetch-Site: same-origin\r\n"
        check(request("/state",extra:auth),200)
        let data=policy.route(request("/state",extra:auth),snapshot:sample,assets:assets).body
        let decoded = try JSONDecoder().decode(ReaderSnapshot.self,from:data)
        precondition(decoded.text==sample.text)
        check(request("/state",extra:"X-OCRCompanion-Session: bad\r\nSec-Fetch-Site: same-origin\r\n"),403)
        check(request("/state",extra:auth+"Origin: https://evil.example\r\n"),403)
        check(request(host:"evil.example"),403)
        check(request(host:"localhost:43187"),403)
        check(request(host:"127.0.0.1:43188"),403)
        check(request(extra:"Sec-Fetch-Site: cross-site\r\n"),403)
        check(request(extra:"Sec-Fetch-Site: same-site\r\n"),403)
        check(request(extra:"Origin: null\r\n"),403)
        check(request(method:"POST"),405)
        check(request(method:"OPTIONS"),405)
        check(request(extra:"Host: evil.example\r\n"),400)
        check(request(extra:"Transfer-Encoding: chunked\r\n"),403)
        check(request(extra:"Content-Length: 12\r\n"),403)
        check(request("/../macOS/Sources/Setup.swift"),404)
        check(request("/%2e%2e/secret"),404)
        check(request("/?session=secret"),404)
        check(request("/ocr"),404)
        check("invalid",400)
        let size=CGSize(width:1440,height:900)
        let rect=CGRect(x:100,y:150,width:300,height:200)
        for scale: CGFloat in [1,1.5,2] {
            let crop=ScreenGeometry.crop(rect,displaySize:size,scale:scale)!
            precondition(crop.sourceRect==CGRect(x:100,y:550,width:300,height:200))
            precondition(crop.pixelWidth==Int(300*scale) && crop.pixelHeight==Int(200*scale))
        }
        precondition(ScreenGeometry.crop(CGRect(x:-1,y:0,width:300,height:200),displaySize:size,scale:2)==nil)
        precondition(ScreenGeometry.crop(CGRect(x:1400,y:0,width:300,height:200),displaySize:size,scale:2)==nil)
        precondition(ScreenGeometry.crop(CGRect(x:0,y:0,width:300,height:10),displaySize:size,scale:2)==nil)
        precondition(ScreenGeometry.crop(rect,displaySize:size,scale: .infinity)==nil)
        precondition(ScreenGeometry.crop(rect,displaySize:size,scale:0)==nil)
        precondition(ScreenGeometry.crop(CGRect(x:0,y:0,width:10000,height:10000),displaySize:CGSize(width:10000,height:10000),scale:2)==nil)
        print("Passed \(count) reader access-policy cases, multilingual JSON round-trip and 9 capture-geometry cases")
    }
}
