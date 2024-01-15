export * from '@leafer/node'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { Creator, LeaferCanvas } from '@leafer/node'
import { InteractionBase } from '@leafer/interaction'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => { return new InteractionBase(target, canvas, selector, options) },
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager)
} as ICreator)
