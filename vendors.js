import { vendor, registerCSS } from './csshelper.js'
let scheduler = window.scheduler ?? {
    yield() {
        return new Promise(res => {
            requestAnimationFrame(res)
        })
    }
}
let inherits = true
CSS.registerProperty({
    name: '--user-select',
    initialValue: 'auto',
    inherits
})
await scheduler.yield()
CSS.registerProperty({
    name: '--user-modify',
    initialValue: 'auto',
    inherits: false
})
await scheduler.yield()
CSS.registerProperty({
    name: '--force-broken-image-icon',
    syntax: '<integer>',
    initialValue: 0,
    inherits: false
})
await scheduler.yield()
CSS.registerProperty({
    name: '--float-edge',
    initialValue: 'content-box',
    inherits: false
})
await scheduler.yield()
CSS.registerProperty({
    name: '--image-region',
    inherits,
    initialValue: 'auto',
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-orient',
    initialValue: 'inline-axis',
    inherits: false
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-align',
    initialValue: 'stretch',
    inherits: false
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-direction',
    initialValue: 'normal',
    inherits: false
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-flex',
    inherits: false,
    initialValue: 0,
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-flex-group',
    inherits: false,
    initialValue: 0,
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-lines',
    inherits: false,
    initialValue: 'single'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-ordinal-group',
    inherits: false,
    initialValue: 1
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-decoration-break',
    inherits: false,
    initialValue: 'slice'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-pack',
    inherits: false,
    initialValue: 'start'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--user-input',
    inherits,
    initialValue: 'auto'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--box-reflect',
    inherits: false,
    initialValue: 'none'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--text-stroke-color',
    inherits,
    syntax: '<color>',
    initialValue: 'currentcolor'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--text-stroke-width',
    inherits,
    syntax: '<length>',
    initialValue: 0
})
await scheduler.yield()
CSS.registerProperty({
    name: '--text-security',
    inherits: false,
    initialValue: 'none'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--text-fill-color',
    inherits,
    initialValue: 'currentcolor'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--line-clamp',
    inherits: false,
    initialValue: 'none'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--font-smoothing',
    inherits,
    initialValue: 'auto'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--mask-position-x',
    inherits: false,
    syntax: '<length-percentage>',
    initialValue: '0%'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--mask-position-y',
    inherits: false,
    syntax: '<length-percentage>',
    initialValue: '0%'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--tap-highlight-color',
    inherits,
    syntax: '<color>',
    initialValue: 'black'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--touch-callout',
    inherits,
    syntax: '<color>',
    initialValue: 'black'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--window-dragging',
    inherits: false,
    initialValue: 'drag'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--padding-start',
    inherits: false,
    initialValue: '0px'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--stack-sizing',
    inherits,
    initialValue: 'stretch-to-fit'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--appearance',
    inherits: false,
    initialValue: 'auto'
})
await scheduler.yield()
CSS.registerProperty({
    name: '--mask-composite',
    inherits: false,
    initialValue: 'source-over'
})
const universal = {}
'user-select user-modify force-broken-image-icon float-edge image-region box-orient box-align box-direction box-flex box-group box-lines box-ordinal-group box-decoration-break box-pack user-input box-reflect mask-composite appearance stack-sizing text-stroke-color text-stroke-width text-security text-fill-color line-clamp font-smoothing mask-position-x mask-position-y window-dragging padding-start'
.split(' ').forEach(o => {
    universal[vendor(o, `var(--${o})`,)] = `var(--${o})`
})
registerCSS('*', universal)