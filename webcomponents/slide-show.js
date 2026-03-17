// VERY IMPORTANT:
// do NOT use the `zoom` or `scale` css property
// it behaves strangley
let svg = document.createRange().createContextualFragment('<div><svg><animate from="0" begin="0s" href="#fe" calcMode=discrete attributeName=x repeatCount="indefinite"/><foreignObject width=100 height=100 id="fe" x=0><canvas></canvas></foreignObject></svg></div>')
let bitmaps = new Map
let sheet = new CSSStyleSheet
let isSafari = 'onwebkitmouseforceup'in window
console.log(isSafari)
/*:host(:state(broken)){width:30px;height:30px;background-color:red;transform:translate(-50%,-50%)}*/
sheet.replaceSync('div{overflow:hidden;transform:translate(-50%,-50%);}foreignObject{y:calc((rem(calc(var(--index,0)*var(--frame-h,0)),var(--height,0))*-1px) - 1px)}svg{contain:paint layout;cursor:pointer;pointer-events:all;position:relative}:host{pointer-events:none !important;transform-origin:0 0;display:flex;width:0;height:0;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated}')
let dimensions = new Map
class SlideShow extends HTMLElement {
    static observedAttributes = 'values src dur index'.split(' ')
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
                    let paddedWidth = width + 2
                    let paddedHeight = height + 2
                    duras ??= Array(framesX | 0).fill(1)
                    let url = new URL(src, document.baseURI).toString()
                    dimensions.set(url, [framesX, framesY, width, height])
                    sheet.insertRule(`:host([src="${url}"]){width:${width}px;height:${height}px}`, 1)
                    console.log(width,height)
                    isSafari && sheet.insertRule(`:host([src="${url}"]) div{width:${width}px;height:${height}px}`, 1)
                    let padded = document.createElement('canvas')
                    padded.width = framesX * paddedWidth
                    padded.height = framesY * paddedHeight
                    let ctx = padded.getContext('2d')
                    ctx.imageSmoothingEnabled = false
                    for (let row = 0; row < framesY; row++)
                        // you need to add 1 invisible pixel in each axis because it's broken for some reason!
                        for (let col = 0; col < framesX; col++)
                            ctx.drawImage(n, col * width, row * height, width, height, col * paddedWidth + 1, row * paddedHeight + 1, width, height)
                    createImageBitmap(padded).then(o => {
                        let total = duras.reduce(add, 0)
                            , vals = []
                            , times = []
                            , acc = 0
                        duras.forEach((d, i) => {
                            vals.push(`${(-i * paddedWidth) - 1}`)
                            times.push(acc / total)
                            acc += d
                        })
                        vals.push(vals[vals.length - 1])
                        times.push(1)
                        let out = { bitmap: o, framesX, framesY, paddedWidth, paddedHeight, duras: vals.join(';') }
                        bitmaps.set(url, out)
                        resolve(out)
                    })
                }
            }))
        }
        return out
    }
    get index() {
        return +this.getAttribute('index') || 0
    }
    set index(index) {
        this.setAttribute('index', +index || 0)
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
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                while (!bitmaps.has(u)) {
                    b || this.#internals.states.add('broken')
                    b = true
                    await new Promise(requestAnimationFrame)
                }
                this.#internals.states.delete('broken')
                let { bitmap, framesX, framesY, paddedHeight, paddedWidth, duras } = bitmaps.get(u)
                let fe = this.#fe
                let width = canvas.width = framesX * paddedWidth
                let height = canvas.height = framesY * paddedHeight
                fe.setAttribute('width', width)
                fe.setAttribute('height', height)
                ctx.imageSmoothingEnabled = false
                ctx.drawImage(bitmap, 0, 0)
                fe.style.setProperty('--height', framesY * paddedHeight)
                fe.style.setProperty('--frame-h', paddedHeight)
                this.#anim.setAttribute('values', duras)
                break
            }
            case 'dur':
                this.#anim.setAttribute(attr, val)
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
    disconnectedCallback() {
        this.pause()
    }
    set dur(val) {
        this.setAttribute('dur', val)
    }
    get dur() {
        return CSSStyleValue.parse('animation-duration', this.getAttribute('dur'))
    }
    connectedCallback() {
        // needed bc it's broken
        let anim = this.#anim
        anim.removeAttribute('href')
        requestAnimationFrame(() => { anim.setAttribute('href', '#fe'); this.time = 0; this.resume() })
    }
    #internals = this.attachInternals()
    constructor() {
        super()
        this.#internals.states.add('broken')
        let shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(svg.cloneNode(true))
        this.#svg = shadow.querySelector('svg')
        this.#anim = shadow.querySelector('animate')
        this.#anim.addEventListener('repeatEvent', repeat)
        this.#ctx = (this.#sprite = shadow.querySelector('canvas')).getContext('2d')
        this.#fe = shadow.querySelector('foreignObject')
        shadow.adoptedStyleSheets = [sheet]
        this.#container = shadow.firstChild
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
}
function repeat(e) {
    e.target.getRootNode().host.dispatchEvent(new Event('repeatEvent', { bubbles: true }))
}
function add(a, b) { return a + b }
customElements.define('slide-show', SlideShow)
export default SlideShow.preload
try { await customElements.whenDefined('slide-show') }
catch (e) { console.debug(e) }