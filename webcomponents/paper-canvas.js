import * as v from '../v4.js'
import { vect } from "../num.js"
import '../css.js'
const css = window[Symbol.for('[[CSSModule]]')]
// import * as h from '../handle.js'
// let internals = Symbol()
function pointerup(p) {
    if (p.button === 2) return
    this.releasePointerCapture(p.pointerId)
    this.holding = false
    this.internals?.setFormValue(this.value)
    this.internals?.setValidity({ valueMissing: false }, 'Draw something')
}

function pointermove(p) {
    if (p.button === 2) return
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
        ctx.moveTo(lastLoc.x / zoom, lastLoc.y / zoom)
        ctx.lineTo(x / zoom, y / zoom)
        ctx.stroke()
        lastLoc.set(x, y)
    }
}
function pointerdown(p) {
    if (p.button === 2) return this.undo()
        this.setPointerCapture(p.pointerId)
    let { undoBuffer, ctx } = this
    undoBuffer.push(ctx.getImageData(0, 0, 250, 250))
    while (this.undoBuffer.length > this.maxBufferSize) undoBuffer.shift()
    this.holding = true
    let { lastLoc } = this
    let zoom = this.canvas.currentCSSZoom || 1
    lastLoc.set(p.offsetX, p.offsetY)
    ctx.beginPath()
    // let {currentCSSZoom: zoom} = this
    ctx.arc(lastLoc.x / zoom, lastLoc.y / zoom, 0, 0, 6)
    ctx.stroke()
    ctx.fill()
    // ctx.strokeRect(p.offsetX/zoom, p.offsetY/zoom, .5,.5)
}
class PaperCanvas extends HTMLElement {
    static formAssociated = true
    static observedAttributes = 'maxbuffersize color brushsize width height'.split(' ')
    undoBuffer = []
    maxBufferSize = 10
    // syncWithForm() {
    // let i = this[internals]
    // return this.toFile().then(i.setFormValue.bind(i))
    // // }
    // static formAssociated = true
    undo() {
        let { undoBuffer, ctx } = this
        if (!undoBuffer.length) return
        ctx.clearRect(0, 0, 250, 250)
        ctx.putImageData(undoBuffer.pop(), 0, 0)
        if (!undoBuffer.length) {
            this.internals?.setValidity({ valueMissing: true }, 'Draw something')
        }
    }
    constructor() {
        super()
        this.internals?.setValidity({ valueMissing: true }, 'Draw something')
    }
    internals = this.closest('form')?.contains(this) ? this.attachInternals() : null
    holding = false
    lastLoc = vect(0 / 0, 0 / 0)
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
    static #BASE_CONTEXT_ATTRIBUTES = {
        lineJoin: 'round',
        lineCap: 'round',
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
        let t = v.Proxify(this)
        this.hasAttribute('tabindex') || this.setAttribute('tabindex', 0)
        let shadow = this.attachShadow({ mode: 'open' })
        let width = +t.getAttribute('width') || 250
        let height = +t.getAttribute('height') || 250
        let canvas = this.canvas = v.esc`<canvas id="canvas" style="image-rendering:auto;width:${width}px;height:${height}px" width="${width}" height="${height}">`
        this.ctx = Object.assign(canvas.getContext('2d', { willReadFrequently: true }), PaperCanvas.#BASE_CONTEXT_ATTRIBUTES)
        this.ctx.fillRect(0, 0, width, height)
        shadow.adoptedStyleSheets = [style]
        v.Proxify(shadow).pushNode(canvas)
        t.on({
            pointermove,
            pointerdown,
            pointerup,
            $contextmenu
        }, new AbortController)
    }
}
function $contextmenu(){}
let style = new CSSStyleSheet
style.replaceSync(`:host{
        ${css.toCSS({
    cursor: 'crosshair',
    '--user-select': 'none',
    'touch-action': 'none',
    'background-color': 'white',
    display: 'inline-grid',
    border: '1px solid black',
})}}`)
if (customElements.get('paper-canvas') !== PaperCanvas) {
    let d = customElements.whenDefined('paper-canvas')
    customElements.define('paper-canvas', PaperCanvas)
    await d
}