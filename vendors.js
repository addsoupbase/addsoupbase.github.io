import { vendor, registerCSS } from './csshelper.js'
let scheduler = window.scheduler ?? {
    yield() {
        return new Promise(requestAnimationFrame)
    }
}
let inherits = true
try {
    CSS.registerProperty({
        //  Most important one
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
    /*await scheduler.yield()
    CSS.registerProperty({
        name: '--padding-start',
        inherits: false,
        initialValue: 0
    })*/
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
    await scheduler.yield()
    CSS.registerProperty({
        name: '--image-rect',
        inherits,
        initialValue: 'auto'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--context-properties',
        inherits,
        initialValue: 'none'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--outline-radius',
        inherits: false,
        initialValue: '0 0 0 0'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--window-shadow',
        inherits: false,
        initialValue: 'default'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--binding',
        inherits: false,
        initialValue: 'none'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--user-focus',
        inherits: false,
        initialValue: 'none'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--text-blink',
        inherits: false,
        initialValue: 'none'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--content-zoom-limit',
        inherits: false,
        initialValue: '400% 100%'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--accelerator',
        inherits: false,
        initialValue: false
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--initial-letter',
        inherits: false,
        initialValue: 'normal'
    })
    await scheduler.yield()
    CSS.registerProperty({
        name: '--order',
        inherits: false,
        initialValue: 0
    })
}
catch (e) {
    console.error(e)
}
finally {
    const universal = {}
    'user-select user-modify accelerator initial-letter text-blink order content-zoom-limit user-focus binding outline-radius window-shadow force-broken-image-icon float-edge image-region context-properties image-rect box-orient box-align box-direction box-flex box-group box-lines box-ordinal-group box-decoration-break box-pack user-input box-reflect mask-composite appearance stack-sizing text-stroke-color text-stroke-width text-security text-fill-color line-clamp font-smoothing mask-position-x mask-position-y window-dragging'
        .split(' ').forEach(o => {
            universal[vendor(o, `var(--${o})`)] = `var(--${o})`
        })
    registerCSS('*', universal)
}
