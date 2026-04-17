import * as v from '../v4.js'
// import { vect } from "../num.js"
import '../css.js'
const css = window[Symbol.for('[[CSSModule]]')]
// import * as h from '../handle.js'
// let internals = Symbol()
function pointerup(p) {
    if (p.button === 2 || this.resizing) return
    this.releasePointerCapture(p.pointerId)
    this.holding = false
    this.internals?.setFormValue(this.value)
    this.internals?.setValidity({ valueMissing: false }, 'Draw something')
}
function keydown(e) {
    let { shiftKey } = e
    if (shiftKey) {
        this.resizing = !this.resizing
        this.holding = false
        e.preventDefault()
    }
}

function pointermove(p) {
    if (p.button === 2 || this.resizing) return
    let { offsetX: x, offsetY: y } = p
    let zoom = this.canvas.currentCSSZoom || 1
    if (this.holding) {
        let { lastLoc, ctx } = this
        if (p.touches) {
            let touches = p.touches[0]
            x = touches.clientX - this.offsetLeft - touches.radiusX
            y = touches.clientY - this.offsetTop - touches.radiusY
        }
        ctx.beginPath()
        // let {currentCSSZoom: zoom} = this
        ctx.moveTo(lastLoc[0] / zoom, lastLoc[1] / zoom)
        ctx.lineTo(x / zoom, y / zoom)
        ctx.stroke()
        lastLoc[0] = x
        lastLoc[1] = y
    }
}
function pointerdown(p) {
    if (this.resizing) return
    if (p.button === 2) return this.undo()
    this.setPointerCapture(p.pointerId)
    let { undoBuffer, ctx, canvas } = this
    undoBuffer.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    while (this.undoBuffer.length > this.maxBufferSize) undoBuffer.shift()
    this.holding = true
    let { lastLoc } = this
    let zoom = this.canvas.currentCSSZoom || 1
    lastLoc[0] = p.offsetX
    lastLoc[1] = p.offsetY
    ctx.beginPath()
    // let {currentCSSZoom: zoom} = this
    ctx.arc(lastLoc[0] / zoom, lastLoc[1] / zoom, 0, 0, 6)
    ctx.stroke()
    ctx.fill()
    // ctx.strokeRect(p.offsetX/zoom, p.offsetY/zoom, .5,.5)
}
class PaperCanvas extends HTMLElement {
    static formAssociated = true
    static observedAttributes = 'maxbuffersize color brushsize width height'.split(' ')
    undoBuffer = []
    maxBufferSize = 10
    #resizing
    get resizing() { return this.#resizing }
    set resizing(b) {
        this.toggleAttribute('resizing', this.#resizing = !!b)
    }
    // syncWithForm() {
    // let i = this[internals]
    // return this.toFile().then(i.setFormValue.bind(i))
    // // }
    // static formAssociated = true
    undo() {
        let { undoBuffer, ctx } = this
        if (!undoBuffer.length) return
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        ctx.putImageData(undoBuffer.pop(), 0, 0)
        if (!undoBuffer.length) {
            this.internals?.setValidity({ valueMissing: true }, 'Draw something')
        }
    }
    constructor() {
        super()
        this.internals?.setValidity({ valueMissing: true }, 'Draw something')
        let t = v.Proxify(this)
        let shadow = this.attachShadow({ mode: 'open' })
        let width = +t.getAttribute('width') || 250
        let height = +t.getAttribute('height') || 250
        let canvas = this.canvas = v.esc`<canvas id="canvas" style="image-rendering:auto;width:${width}px;height:${height}px" width="${width}" height="${height}">`
        this.ctx = Object.assign(canvas.getContext('2d', { willReadFrequently: true }), PaperCanvas.BASE_CONTEXT_ATTRIBUTES)
        this.ctx.fillRect(0, 0, width, height)
        this.color = 'black'
        shadow.adoptedStyleSheets = [style]
        v.Proxify(shadow).pushNode(canvas)
        t.on({
            pointermove,
            pointerdown,
            pointerup,
            // keydown,
            $contextmenu
        }, new AbortController)
        // t.observe('resize', {
        //     callback: resizeCanvas
        // })
    }
    internals = this.closest('form')?.contains(this) ? this.attachInternals() : null
    holding = false
    lastLoc = Float64Array.of(0, 0)
    canvas = null
    ctx = null
    get value() {
        switch (this.getAttribute('type')) {
            default: return this.dataURL(1)
            case 'file': return new File([this.ctx.getImageData(0, 0, 255, 255)], `${this.getAttribute('name') || 'untitled'}.png`, { type: 'image/png' })
        }
    }
    dataURL(quality = 1) {
        return this.canvas.toDataURL('image/png', quality)
    }
    toBlob() {
        return new Promise(resolve => {
            this.canvas.toBlob(resolve, 'image/png', 1)
        })
    }
    async toFile(title = `${crypto.randomUUID()}`) {
        let a = await this.toBlob()
        return new File([a], `${title}.png`, { type: 'image/png' })
    }
    // [internals] = this.attachInternals()
    // set alpha(val) {
    //     this.ctx = this.canvas.setAttr({ '-moz-opaque': !val }).getContext('2d', {
    //         alpha: val, willReadFrequently: true,
    //         desynchronized: true
    //     })
    //     this.undoBuffer.length = 0
    // }
    get alpha() {
        return !this.hasAttribute('moz-opaque') && this.ctx.getContextAttributes().alpha
    }
    static BASE_CONTEXT_ATTRIBUTES = {
        lineJoin: 'round',
        lineCap: 'round',
        strokeStyle: 'black',
        fillStyle: 'white'
    }
    formResetCallback() {
        this.undoBuffer.length = 0
        let { width, height } = this.canvas
        this.ctx.clearRect(0, 0, width, height)
        this.internals?.setValidity({ valueMissing: true })
    }
    attributeChangedCallback(name, _, newValue) {
        if (this.canvas) switch (name) {
            case 'width':
                var val = parseFloat(newValue) || 1
                this.canvas.width = val
                this.canvas.styles.width = `${val}px`
                break
            case 'height':
                var val = parseFloat(newValue) || 1
                this.canvas.height = val
                this.canvas.styles.height = `${val}px`
                break
            case 'brushsize':
                this.ctx.lineWidth = parseFloat(newValue) || 1
                break
            case 'color':
                this.ctx.strokeStyle =
                    this.ctx.fillStyle = newValue
                break
        }
    }
    get brushsize() {
        return this.ctx.lineWidth
    }
    set brushsize(val) {
        this.setAttribute('brushsize', val)
    }
    set color(color) {
        this.ctx.fillStyle = this.ctx.strokeStyle = color
    }
    get color() {
        return this.ctx.fillStyle
    }
    connectedCallback() {
        this.hasAttribute('tabindex') || this.setAttribute('tabindex', 0)
    }
}
function resizeCanvas(n) {
    let t = n.targetNode
    let { canvas, ctx } = t
    let { inlineSize: width, blockSize: height } = n.contentBoxSize?.[0] ?? n.contentRect
    if (t.resizing && width && height && width !== canvas.width && height !== canvas.height) {
        let c = t.color
        let data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        canvas.style.width = `${canvas.width = width}px`
        canvas.style.height = `${canvas.height = height}px`
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)
        ctx.putImageData(data, 0, 0)
        Object.assign(ctx, PaperCanvas.BASE_CONTEXT_ATTRIBUTES)
        t.color = c
    }
}
function $contextmenu() { }
let style = new CSSStyleSheet
style.replaceSync(`
    :host([resizing]){resize:both !important;cursor:revert;outline-style:dashed;outline-width:2px;}
    :host{
    ${css.toCSS({
    cursor: 'crosshair',
    width: 'max-content',
    height: 'max-content',
    'user-select': 'none',
    'touch-action': 'none',
    overflow: 'hidden',
    'background-color': 'white',
    display: 'inline-grid',
    outline: '1px solid black',
})}}`)
if (customElements.get('paper-canvas') !== PaperCanvas) {
    let d = customElements.whenDefined('paper-canvas')
    customElements.define('paper-canvas', PaperCanvas)
    await d
}