/* 
ok this is the last version i swear (hopefully)
so this one has something unique that i was TRYING to make for months:
you can add durations for the individual frames
i don't think CSS @keyframes can do this!!
and also it now:
 • correctly transforms from the center
 • doesn't interfere with external transforms
 • can use offset-path correctly now!
*/
let svg = document.createRange().createContextualFragment('<svg><animate begin="0s" href="#fe" calcMode=discrete attributeName=x repeatCount="indefinite"/><foreignObject x=-1 width=100 height=100 id="fe"><canvas></canvas></foreignObject></svg>')
let bitmaps = new Map
let sheet = new CSSStyleSheet
sheet.replaceSync('foreignObject{y:calc(rem(calc(var(--index,0)*(var(--height)/var(--frames-y))),var(--height))*-1px)}svg{contain:paint layout;cursor:pointer;pointer-events:all;transform:translate(-50%,-50%);position:relative}:host{pointer-events:none !important;transform-origin:0 0;display:flex;width:0;height:0;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated}')
let dimensions = new Map
class SlideShow extends HTMLElement {
    static observedAttributes = 'values href dur index'.split(' ')
    static preload(...sources) {
        let out = []
        for (let { framesX = 1, framesY = 1, src, duras } of sources) {
            let n = new Image
            n.src = src
            n.fetchPriority = 'high'
            n.decoding = 'sync'
            n.onload = () => {
                let width = n.naturalWidth / framesX
                let height = n.naturalHeight / framesY
                duras ??= Array(framesX).fill(1)
                let url = new URL(src, document.baseURI).toString()
                dimensions.set(url, [framesX, framesY, width, height])
                sheet.insertRule(`:host([href="${url}"]){width:${width - 1}px;height:${height - 1}px;}`)
                out.push(createImageBitmap(n).then(o => {
                    o.framesX = framesX
                    o.framesY = framesY
                    o.duras = duras.map((o, i) => `${(-i * width) - 1}`.repeat(o || 1)).join(';')
                    bitmaps.set(url, o)
                }))
            }
        }
        return out
    }
    get index() {
        return +this.getAttribute('index') || 0
    }
    set index(index) {
        this.dispatchEvent(new Event('indexEvent', { bubbles: true, cancelable: true })) && this.setAttribute('index', +index || 0)
    }
    connectedCallback() {
        this.#anim.replaceWith(this.#anim = this.#anim.cloneNode(true))
        this.time = 0
    }
    async attributeChangedCallback(attr, oldVal, val) {
        switch (attr) {
            case 'index':
                this.#fe.style.setProperty('--index', +val)
                break
            case 'href': {
                let u = new URL(val, this.baseURI).toString()
                if (u !== val) return this.setAttribute('href', u)
                let canvas = this.#sprite
                let ctx = this.#ctx
                while (!bitmaps.has(val)) await new Promise(requestAnimationFrame)
                let bitmap = bitmaps.get(val)
                let fe = this.#fe
                fe.setAttribute('width', canvas.width = bitmap.width)
                fe.setAttribute('height', canvas.height = bitmap.height)
                ctx.imageSmoothingEnabled = true
                ctx.imageSmoothingQuality = 'high'
                ctx.drawImage(bitmap, 0, 0)
                this.#fe.style.setProperty('--height', bitmap.height)
                this.#fe.style.setProperty('--frames-y', bitmap.framesY)
                this.#anim.setAttribute('values', bitmap.duras)
            }
                break
            default:
                this.#sprite.setAttribute(attr, val)
                break
            case 'dur':
                this.#anim.setAttribute(attr, val)
                break
        }
    }
    #sprite
    #anim
    #ctx
    #fe
    #svg
    disconnectedCallback() {
        this.pause()
    }
    // there is a 1px offset and idk how to fix it
    connectedCallback() {
        let anim = this.#anim
        anim.removeAttribute('href')
        // needed because for some reason when adding the node to the DOM the animation stops
        requestAnimationFrame(() => { anim.setAttribute('href', '#fe'); this.time = 0; this.resume() })
    }
    constructor() {
        super()
        let shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(svg.cloneNode(true))
        this.#svg = shadow.firstChild
            ; (this.#anim = shadow.querySelector('animate')).addEventListener('repeatEvent', repeat)
        this.#ctx = (this.#sprite = shadow.querySelector('canvas')).getContext('2d')
        this.#fe = shadow.querySelector('foreignObject')
        shadow.adoptedStyleSheets = [sheet]
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
customElements.define('slide-show', SlideShow)
export default SlideShow.preload
try { await (customElements.whenDefined('slide-show')) } // fix for no top level await
catch (e) { console.debug(e) }