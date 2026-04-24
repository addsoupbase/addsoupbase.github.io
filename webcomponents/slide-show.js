// VERY IMPORTANT:
// do NOT use the `zoom` or `scale` css property
// it behaves strangely
let d = document
    , svg = d.createRange().createContextualFragment('<div aria-hidden="true" part="sprite" id="sprite"><svg><foreignObject width=100 height=100 id="fe" x=0><canvas></canvas></foreignObject><animate fill="freeze" from="0" begin="0s" href="#fe" calcMode=discrete attributeName=x repeatCount="indefinite"/></svg></div>')
    , bitmaps = new Map
    , sheet = new CSSStyleSheet
    , isSafari = 'onwebkitmouseforceup' in window
//:host([loading="lazy"]) #sprite{content-visibility:auto}
// let before = `content: attr(alt);left:-30px;font-size:smaller;position:relative;font-family:monospace`
let broken = 'background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==);width:32px;height:32px;image-rendering:auto;'
sheet.replaceSync(`#sprite{display:flex}svg,div{width:100%}div{border:.02vmax solid transparent;contain:paint;pointer-events:all;overflow:clip;transform:translate(-50%,-50%);}foreignObject{y:calc((rem(calc(var(--index,0)*var(--frame-h,0)),var(--height,0))*-1px))}:host{user-select:none;-webkit-user-select:none;-moz-user-select:none;touch-action:pinch-zoom;pointer-events:none !important;transform-origin:0 0;display:flex;width:0;height:0;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated}:host(:--broken){width:32px;height:32px;content:attr(aria-label);background-size:cover;}:host(:state(--broken)){width:32px;height:32px;content:attr(aria-label);background-size:cover;}:host(:--broken) div{${broken}}:host(:state(--broken)) div{${broken}}`)
// ^ forgot to comment this when i added it but:
// the (transparent) border seems to fix the 1px overlap issue, but the sprite is ever so slightly offset when the zoom is really low, but there's no other FCKING WAY TO FIX IT SO IT WILL HAVE TO DO
let sep = /[^-\d]/g
const compressAll = arr => arr.reduce((acc, val, idx, src) => {
    if (idx === 0 || val !== src[idx - 1]) {
        acc.push({ n: val, count: 1 })
    } else {
        acc[acc.length - 1].count++
    }
    return acc
}, [])
class SlideShow extends HTMLElement {
    static observedAttributes = 'values src dur index repeat imagesmoothing'.split(' ')
    get imageSmoothing() { return this.getAttribute('imagesmoothing') }
    set imageSmoothing(v) { this.setAttribute('imagesmoothing', v) }
    get opaque() {
        return this.hasAttribute('opaque')
    }
    static preload(...sources) {
        let out = []
        for (let { framesX = 1, framesY = 1, src, duras } of sources) {
            let n = new Image
            n.fetchPriority = 'high'
            n.decoding = 'sync'
            n.src = src
            out.push(new Promise((resolve, reject) => {
                n.onerror = reject
                n.onload = () => {
                    let width = n.naturalWidth / framesX
                    let height = n.naturalHeight / framesY
                    let url = new URL(src, d.baseURI)
                    let s = url.toString()
                    sheet.insertRule(`:host([src="${s}"]){width:${width}px;height:${height}px}`, 1)
                    isSafari && sheet.insertRule(`:host([src="${s}"]) div{width:${width}px;height:${height}px}`, 1)
                    createImageBitmap(n).then(o => {
                        let repeats = duras && duras.length === framesX ? duras : Array(framesX).fill(1)
                        let vals = []
                        for (let i = 0; i < framesX; i++) {
                            let repeat = repeats[i]
                            for (let r = 0; r < repeat; r++)
                                vals.push(`${-i * width}`)
                        }
                        let out = {
                            src: url,
                            bitmap: o,
                            framesX,
                            framesY,
                            frameWidth: width,
                            frameHeight: height,
                            values: vals.join(';'),
                            displayedFrames: vals.length
                        }
                        bitmaps.set(s, out)
                        resolve(out)
                    })
                }
            }))
        }
        return out
    }
    get src() { return this.getAttribute('src') }
    set src(t) {
        if (this.#once && this.hasAttribute('src')) throw TypeError(`Can't change src of static sprite`)
        this.setAttribute('src', t)
        this.play()
    }
    get values() {
        return this.#anim.getAttribute('values').split(sep).map(n => (n && -n) | 0)
    }
    set values(v) {
        let a = this.#anim
        a.setAttribute('values', a.getAttribute('values').split(sep).join(';'))
    }
    get width() {
        return this.#width
    }
    get height() {
        return this.#height
    }
    async extract(speed = .048, indexes = [this.index], selector) {
        let module = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')
        let JSZip = module.default
        let zip = JSZip()
        let offsets = this.values
        let { width, height, canvasElement } = this
        let frameGroups = compressAll(offsets)
        let H = height * indexes.length
        let c = new OffscreenCanvas(width, H)
        let ctx = c.getContext('2d')
        let listContent = []
        let x = 0
        for (const { n, count } of frameGroups) {
            for (let i of indexes)
                ctx.drawImage(canvasElement, -n, 0)
            zip.file(`${x}.png`, await c.convertToBlob())
            ctx.clearRect(0, 0, width, H)
            listContent.push(`file '${x}.png'`, `duration ${count * speed}`)
            x++
        }
        let lastFrame = x - 1
        listContent.push(`file '${lastFrame}.png'`, 'duration 0.04')
        zip.file('list.txt', listContent.join('\n'))
        let shellScript = `#!/bin/sh
ffmpeg -f concat -safe 0 -i list.txt \\
       -vf "split[s0][s1];[s0]palettegen=reserve_transparent=on[p];[s1][p]paletteuse" \\
       -loop 0 '${selector}.gif'`
        zip.file('make_gif.sh', shellScript)
        zip.file('style.css',`width:${width}px;height:${height}px;object-position: 0 calc(-${height}px * var(--SPRITE_INDEX, 0))`)
        return await zip.generateAsync({ type: 'blob' })
    }
    #framesY = 0
    #framesX = 0
    get framesY() {
        return this.#framesY
    }
    get framesX() {
        return this.#framesX
    }
    get index() {
        return +this.getAttribute('index') || 0
    }
    set index(index) {
        this.setAttribute('index', +index || 0)
    }
    get dur() {
        let val = this.getAttribute('dur')
        return val ? parseFloat(val) : (1 / 32)
    }
    #width = 0
    #height = 0
    set dur(val) {
        this.setAttribute('dur', val)
    }
    get canvasElement() { return this.#sprite }
    async attributeChangedCallback(attr, oldVal, val) {
        switch (attr) {
            case 'index':
                this.dispatchEvent(new Event('indexEvent', { bubbles: true, cancelable: true })) && this.#fe.style.setProperty('--index', +val)
                break
            case 'src': {
                let u = new URL(val, this.baseURI).toString()
                if (u !== val) return this.setAttribute('src', u)
                // if (this.getAttribute('loading') === 'lazy') return
                let canvas = this.#sprite
                canvas.setAttribute('src', u)
                let ctx = this.#ctx
                let b = false
                while (!bitmaps.has(u)) {
                    if (!b) {
                        if ((this.hasAttribute('framesx') || this.hasAttribute('framesy'))) {
                            await SlideShow.preload({
                                framesX: this.getAttribute('framesx') | 0,
                                framesY: this.getAttribute('framesy') | 0,
                                src: this.src,
                                values: this.getAttribute('values')?.split(sep).map(Number)
                            })[0]
                            break
                        }
                        this.#framesX = this.#framesY = 0
                        this.#internals?.states.add('--broken')
                        this.#once || ctx.clearRect(0, 0, canvas.width, canvas.height)
                        b = true
                        console.warn(`Sprite not loaded: ${u}`)
                    }
                    await new Promise(requestAnimationFrame)
                }
                this.#internals?.states.delete('--broken')
                let { bitmap, framesX, framesY, frameHeight, frameWidth, values, displayedFrames } = bitmaps.get(u)
                this.#width = frameWidth
                this.#height = frameHeight
                this.#framesX = framesX
                this.#framesY = framesY
                this.#displayedFrames = displayedFrames
                let fe = this.#fe
                let width = canvas.width = framesX * frameWidth
                let height = canvas.height = framesY * frameHeight
                fe.setAttribute('width', width)
                fe.setAttribute('height', height)
                if (this.#once) {
                    (ctx.transferFromImageBitmap || ctx.transferImageBitmap).call(ctx, bitmap)
                    bitmaps.delete(this.src)
                }
                else ctx.drawImage(bitmap, 0, 0)
                fe.style.setProperty('--height', framesY * frameHeight)
                fe.style.setProperty('--frame-h', frameHeight)
                this.#anim.setAttribute('values', values)
                if (this.src.includes('Lunala-Hop')) debugger
                // this.#anim.setAttribute('to', values.at(-1))
                this.#updateTotalDuration()
                if (this.hasAttribute('autoplay'))
                    this.play()
                break
            }
            case 'dur':
                this.#updateTotalDuration()
                break
            case 'repeat':
                this.#anim.setAttribute('repeatCount', val)
                break
            case 'imagesmoothing': if (!this.#once)
                if (val === 'none' || !val) {
                    this.#ctx.imageSmoothingEnabled = false
                }
                else {
                    this.#ctx.imageSmoothingEnabled = true
                    this.#ctx.imageSmoothingQuality = val
                }
                break
            default:
                this.#sprite.setAttribute(attr, val)
                break
        }
    }
    #sprite
    #anim
    #ctx
    #fe
    #svg
    #container
    #internals = this.attachInternals()
    #displayedFrames = 0
    disconnectedCallback() {
        this.pause()
    }
    connectedCallback() {
        this.hasAttribute('role') || (this.role = 'img')
        if (this.hasAttribute('autoplay')) {
            this.play()
        }
    }
    play() {
        let anim = this.#anim
        this.#fe.after(anim)
        requestAnimationFrame(() => { this.time = 0; anim.beginElement() })
        // needed bc it's broken
    }
    #once
    constructor() {
        super()
        this.#once = this.hasAttribute('unique')
        this.#internals?.states.add('--broken')
        let shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(svg.cloneNode(true))
        this.#svg = shadow.querySelector('svg')
        this.#anim = shadow.querySelector('animate')
        this.#anim.addEventListener('repeatEvent', repeat)
        this.#anim.addEventListener('endEvent', end)
        this.#anim.remove()
        let { opaque } = this
        this.#ctx = (this.#sprite = shadow.querySelector('canvas')).getContext(this.#once ? 'bitmaprenderer' : '2d', { alpha: !opaque })
        this.#sprite.toggleAttribute('moz-opaque', opaque)
        this.#fe = shadow.querySelector('foreignObject')
        shadow.adoptedStyleSheets = [sheet]
        this.#container = shadow.firstChild
        // this.#container.addEventListener('contentvisibilityautostatechange', visible)
    }
    get repeatCount() {
        return this.#anim.getAttribute('repeatCount')
    }
    set repeatCount(v) {
        this.#anim.setAttribute('repeatCount', v)
    }
    pause() {
        this.dispatchEvent(new Event('pauseEvent', { bubbles: true, cancelable: true })) && this.#svg.pauseAnimations()
    }
    set time(t) {
        this.#svg.setCurrentTime(+t || 0)
        this.dispatchEvent(new Event('seekEvent'))
    }
    get time() {
        return this.#svg.getCurrentTime()
    }
    resume() {
        this.dispatchEvent(new Event('resumeEvent', { bubbles: true, cancelable: true })) && this.#svg.unpauseAnimations()
    }
    #updateTotalDuration() {
        if (this.#displayedFrames === 0) return
        let total = this.dur * this.#displayedFrames
        this.#anim.setAttribute('dur', total)
    }
}
function repeat(e) {
    let t = e.target.getRootNode().host
    t.dispatchEvent(new Event('repeatEvent', { bubbles: true }))
}
function end(e) {
    let t = e.target.getRootNode().host
    t.dispatchEvent(new Event('endEvent', { bubbles: true }))
}
// function visible(n) {
//     let t = n.target
//     let host = t.getRootNode().host
//     host.removeAttribute('loading')
//     host.src = host.src
// }
function add(a, b) { return a + b }
customElements.define('slide-show', SlideShow)
export default SlideShow.preload
// try { await (customElements.whenDefined('slide-show')) }
// catch (e) { if (e.name !== 'ReferenceError') throw e }