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
let svg = document.createRange().createContextualFragment('<svg><animate href="#fe" calcMode="discrete" attributeName="x" repeatCount="indefinite" /><foreignObject width=100 height=100 id="fe"><canvas></foreignObject></svg>')
let bitmaps = new Map
let sheet = new CSSStyleSheet
sheet.replaceSync('foreignObject{will-change:x}canvas{contain:paint;}svg{cursor:pointer;pointer-events:all;transform:translate(-50%,-50%)}:host{pointer-events:none !important;transform-origin:0 0;display:flex;width:0;height:0;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated}')
let dimensions = new Map
class SlideShow extends HTMLElement {
    static observedAttributes = 'values href dur'.split(' ')
    static preload(...sources) {
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
                sheet.insertRule(`:host([href="${url}"]){width:${width}px;height:${height}px;}`)
                createImageBitmap(n).then(o => {
                    o.framesX = framesX
                    o.framesY = framesY
                    o.duras = duras.map((o, i) => `${-i * width}`.repeat(o || 1)).join(';')
                    bitmaps.set(url, o)
                })
            }
        }
    }
    async attributeChangedCallback(attr, oldVal, val) {
        switch (attr) {
            case 'href': {
                let u = new URL(val, this.baseURI).toString()
                if (u !== val) return this.setAttribute('href', u)
                while (!bitmaps.has(val)) await new Promise(requestAnimationFrame)
                let bitmap = bitmaps.get(val)
                let canvas = this.#sprite
                let fe = canvas.parentNode
                fe.setAttribute('width', canvas.width = bitmap.width)
                fe.setAttribute('height', canvas.height = bitmap.height)
                this.#ctx.drawImage(bitmap, 0, 0)
                this.#anim.setAttribute('values', bitmap.duras)
            }
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
    constructor() {
        super()
        let shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(svg.cloneNode(true))
        this.#anim = shadow.querySelector('animate')
        this.#ctx = (this.#sprite = shadow.querySelector('canvas')).getContext('2d')
        shadow.adoptedStyleSheets = [sheet]
    }
}
customElements.define('slide-show', SlideShow)
try{await(customElements.whenDefined('slide-show'))} // fix for no top level await
catch(e){console.debug(e)}