import { IBoundsData, ILeaferCanvas, IOffsetBoundsData } from '@leafer/interface'
import { BoundsHelper, LeafHelper } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/draw'

import { drawWorldShadow } from './Shadow'


const { toOffsetOutBounds } = BoundsHelper
const offsetOutBounds = {} as IOffsetBoundsData

export function innerShadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void {

    let copyBounds: IBoundsData, spreadScale: number

    const { __nowWorld: nowWorld, __layout } = ui
    const { innerShadow } = ui.__
    const { worldCanvas, bounds, shapeBounds, scaleX, scaleY } = shape

    const other = current.getSameCanvas()
    const end = innerShadow.length - 1

    toOffsetOutBounds(bounds, offsetOutBounds)

    innerShadow.forEach((item, index) => {

        let otherScale = 1 // 关联 scaleFixed 逻辑

        if (item.scaleFixed) {
            const sx = Math.abs(nowWorld.scaleX)
            if (sx > 1) otherScale = 1 / sx
        }

        other.save()

        other.setWorldShadow((offsetOutBounds.offsetX + item.x * scaleX * otherScale), (offsetOutBounds.offsetY + item.y * scaleY * otherScale), item.blur * scaleX * otherScale)

        spreadScale = item.spread ? 1 - item.spread * 2 / (__layout.boxBounds.width + (__layout.strokeBoxSpread || 0) * 2) * otherScale : 0

        drawWorldShadow(other, offsetOutBounds, spreadScale, shape)

        other.restore()

        if (worldCanvas) {
            other.copyWorld(other, bounds, nowWorld, 'copy')
            other.copyWorld(worldCanvas, nowWorld, nowWorld, 'source-out')
            copyBounds = nowWorld
        } else {
            other.copyWorld(shape.canvas, shapeBounds, bounds, 'source-out')
            copyBounds = bounds
        }

        other.fillWorld(copyBounds, ColorConvert.string(item.color), 'source-in')

        LeafHelper.copyCanvasByWorld(ui, current, other, copyBounds, item.blendMode)

        if (end && index < end) other.clearWorld(copyBounds, true)

    })

    other.recycle(copyBounds)

}


