// VERY IMPORTANT:
// do NOT use the `zoom` or `scale` css property
// it behaves strangely
let svg = document.createRange().createContextualFragment('<div part="sprite"><svg><foreignObject width=100 height=100 id="fe" x=0><canvas></canvas></foreignObject><animate fill="freeze" from="0" begin="0s" href="#fe" calcMode=discrete attributeName=x repeatCount="indefinite"/></svg></div>')
let bitmaps = new Map
let sheet = new CSSStyleSheet
let isSafari = 'onwebkitmouseforceup' in window
let after = 'transform:translate(-50%, -50%);position:absolute;left:-15px;top:-15px;image-rendering:pixelated;content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==);width:30px;height:30px'
sheet.replaceSync(`:host(:--broken)::after{${after}}:host(:state(--broken))::after{${after}}div{pointer-events:all;overflow:hidden;transform:translate(-50%,-50%);}foreignObject{y:calc((rem(calc(var(--index,0)*var(--frame-h,0)),var(--height,0))*-1px))}svg{contain:paint layout;position:relative}:host{user-select:none;-webkit-user-select:none;-moz-user-select:none;touch-action:pinch-zoom;pointer-events: none !important;transform-origin:0 0;display:flex;width:0;height:0;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated}`)
let dimensions = new Map
class SlideShow extends HTMLElement {
    static observedAttributes = 'values src dur index repeat'.split(' ')
    static preload(...sources) {
        let out = []
        for (let { framesX = 1, framesY = 1, src, duras } of sources) {
            let n = new Image
            n.src = src
            n.fetchPriority = 'high'
            n.decoding = 'sync'
            out.push(new Promise((resolve, reject) => {
                n.onerror = reject
                n.onload = () => {
                    let width = n.naturalWidth / framesX
                    let height = n.naturalHeight / framesY
                    let url = new URL(src, document.baseURI).toString()
                    dimensions.set(url, [framesX, framesY, width, height])
                    sheet.insertRule(`:host([src="${url}"]){width:${width}px;height:${height}px}`, 1)
                    isSafari && sheet.insertRule(`:host([src="${url}"]) div{width:${width}px;height:${height}px}`, 1)
                    let canvas = document.createElement('canvas')
                    canvas.width = framesX * width
                    canvas.height = framesY * height
                    let ctx = canvas.getContext('2d')
                    ctx.imageSmoothingEnabled = false
                    ctx.drawImage(n, 0, 0)
                    createImageBitmap(canvas).then(o => {
                        let repeats = duras && duras.length === framesX ? duras : Array(framesX).fill(1)
                        let vals = []
                        for (let i = 0; i < framesX; i++) {
                            let repeat = repeats[i]
                            for (let r = 0; r < repeat; r++)
                                vals.push(`${-i * width}`)
                        }
                        let out = {
                            bitmap: o,
                            framesX,
                            framesY,
                            paddedWidth: width,
                            paddedHeight: height,
                            values: vals.join(';'),
                            displayedFrames: vals.length
                        }
                        bitmaps.set(url, out)
                        resolve(out)
                    })
                }
            }))
        }
        return out
    }
    get src() { return this.getAttribute('src') }
    set src(t) {
        this.setAttribute('src', t)
        this.play()
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
    set dur(val) {
        this.setAttribute('dur', val)
    }
    async attributeChangedCallback(attr, oldVal, val) {
        switch (attr) {
            case 'index':
                this.dispatchEvent(new Event('indexEvent', { bubbles: true, cancelable: true })) && this.#fe.style.setProperty('--index', +val)
                break
            case 'src': {
                let u = new URL(val, this.baseURI).toString()
                if (u !== val) return this.setAttribute('src', u)
                let canvas = this.#sprite
                canvas.setAttribute('src', u)
                let ctx = this.#ctx
                let b = false
                while (!bitmaps.has(u)) {
                    if (!b) {
                        this.#internals?.states.add('--broken')
                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        b = true
                        console.warn(`Sprite not loaded: ${u}`)
                    }
                    await new Promise(requestAnimationFrame)
                }
                this.#internals?.states.delete('--broken')
                let { bitmap, framesX, framesY, paddedHeight, paddedWidth, values, displayedFrames } = bitmaps.get(u)
                this.#displayedFrames = displayedFrames
                let fe = this.#fe
                let width = canvas.width = framesX * paddedWidth
                let height = canvas.height = framesY * paddedHeight
                fe.setAttribute('width', width)
                fe.setAttribute('height', height)
                ctx.imageSmoothingEnabled = false
                ctx.drawImage(bitmap, 0, 0)
                fe.style.setProperty('--height', framesY * paddedHeight)
                fe.style.setProperty('--frame-h', paddedHeight)
                this.#anim.setAttribute('values', values)
                this.#anim.setAttribute('to', values.at(-1))
                this.#updateTotalDuration()
                break
            }
            case 'dur':
                this.#updateTotalDuration()
                break
            case 'repeat':
                this.#anim.setAttribute('repeatCount', val)
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
        this.hasAttribute('autoplay') && this.play()
    }
    play() {
        let anim = this.#anim
        this.#fe.after(anim)
        requestAnimationFrame(() => { this.time = 0; anim.beginElement() })
        // needed bc it's broken
    }
    constructor() {
        super()
        this.#internals?.states.add('--broken')
        let shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(svg.cloneNode(true))
        this.#svg = shadow.querySelector('svg')
        this.#anim = shadow.querySelector('animate')
        this.#anim.addEventListener('repeatEvent', repeat)
        this.#anim.addEventListener('endEvent', end)
        this.#anim.remove()
        this.#ctx = (this.#sprite = shadow.querySelector('canvas')).getContext('2d')
        this.#fe = shadow.querySelector('foreignObject')
        shadow.adoptedStyleSheets = [sheet]
        this.#container = shadow.firstChild
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
function add(a, b) { return a + b }
customElements.define('slide-show', SlideShow)
export default SlideShow.preload
try { await (customElements.whenDefined('slide-show')) }
catch (e) { if (e.name !== 'ReferenceError') throw e }