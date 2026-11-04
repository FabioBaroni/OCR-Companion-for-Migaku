import Foundation
import CoreGraphics
struct ScreenCrop {
    let sourceRect: CGRect
    let pixelWidth: Int
    let pixelHeight: Int
}
struct ScreenGeometry {
    static func crop(_ region: CGRect, displaySize: CGSize, scale: CGFloat) -> ScreenCrop? {
        guard [region.minX,region.minY,region.width,region.height,displaySize.width,displaySize.height,scale].allSatisfy({$0.isFinite}),
              region.minX>=0,region.minY>=0,region.width>=12,region.height>=12,scale>0,scale<=4,
              region.maxX<=displaySize.width,region.maxY<=displaySize.height else { return nil }
        let width=(region.width*scale).rounded(.up),height=(region.height*scale).rounded(.up)
        guard width<=20000,height<=20000,width*height<=40_000_000 else { return nil }
        return ScreenCrop(sourceRect:CGRect(x:region.minX,y:displaySize.height-region.maxY,width:region.width,height:region.height),pixelWidth:Int(width),pixelHeight:Int(height))
    }
}
