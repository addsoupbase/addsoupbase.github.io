import $, { define } from '../yay.js'
import { vect } from "../num.js"
import * as css from '../csshelper.js'
// import * as h from '../handle.js'

function pointerup(p) {
    if (p.button === 2) return
    this.holding = false
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
    let { undoBuffer, ctx } = this
    undoBuffer.push(ctx.getImageData(0, 0, 250, 250))
    while (this.undoBuffer.length > this.maxBufferSize) undoBuffer.shift()
    this.holding = true
    if ('pointerId' in p) this.setPointerCapture(p.pointerId)
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
    static observedAttributes = 'maxbuffersize color brushsize width height'.split(' ')
    undoBuffer = []
    maxBufferSize = 10
    get undo() {
        return PaperCanvas.undo
    }
    static undo() {
        let { undoBuffer, ctx } = this
        if (!undoBuffer.length) return
        ctx.clearRect(0, 0, 250, 250)
        ctx.putImageData(undoBuffer.pop(), 0, 0)
    }
    holding = false
    lastLoc = vect(0 / 0, 0 / 0)
    canvas = null
    ctx = null
    dataURL(quality = 1) {
        return this.canvas.toDataURL('image/png', quality)
    }
    set alpha(val) {
        this.ctx = this.canvas.setAttr({ '-moz-opaque': !val }).getContext('2d', {
            alpha: val, willReadFrequently: true
        })
        this.undoBuffer.length = 0
    }
    get alpha() {
        return !('-moz-opaque' in $(this).attr) && this.ctx.getContextAttributes().alpha
    }
    static #BASE_CONTEXT_ATTRIBUTES = {
        lineJoin: 'round',
        lineCap: 'round',
        fillStyle: 'white'
    }
    attributeChangedCallback(name, oldValue, newValue) {
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
    connectedCallback() {
        let t = $(this)
        let shadow = this.attachShadow({ mode: 'open' })
        let width = t.attr.width || 250
        let height = t.attr.height || 250
        let canvas = this.canvas = $('canvas #canvas', {
            attr: {
                width,
                height
            }
        })
        this.canvas.styles.height = `${height}px`
        this.canvas.styles.width = `${width}px`
        this.ctx = Object.assign(canvas.getContext('2d', { willReadFrequently: true }), PaperCanvas.#BASE_CONTEXT_ATTRIBUTES)
        $.push(shadow, canvas, style.cloneNode(true))
        t.on({
            pointermove,
            pointerdown,
            pointerup
        }, new AbortController)
    }
}
let style = $('style', {
    textContent: `:host{${css.toCSS({
        '--user-select': 'none',
        cursor: 'crosshair',
        'touch-action': 'none',
        'background-color': 'white',
        display: 'inline-flex',
        border: '1px solid black'
    })}}`
})
define('paper-canvas', PaperCanvas)