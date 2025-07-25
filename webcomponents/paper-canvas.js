import $, {define} from '../yay.js'
import {vect} from "../num.js"
import * as css from '../csshelper.js'
// import * as h from '../handle.js'
function pointerup(p) {
    if (p.button === 2) return
    this.holding = false
}

function pointermove(p) {
    if (p.button === 2) return
    let {offsetX: x, offsetY: y} = p

    if (this.holding) {
        let {lastLoc, ctx} = this
        if (p.touches) {
            let touches = p.touches[0]
            x = touches.clientX-this.offsetLeft - touches.radiusX
            y =  touches.clientY-this.offsetTop - touches.radiusY
        }
        ctx.beginPath()
        // let {currentCSSZoom: zoom} = this
        ctx.moveTo(lastLoc.x, lastLoc.y )
        ctx.lineTo(x, y )
        ctx.stroke()
        lastLoc.set(x,y)
    }
}
function pointerdown(p) {
    if (p.button === 2) return this.undo()
    let {undoBuffer, ctx} = this
    undoBuffer.push(ctx.getImageData(0, 0, 250, 250))
    while(this.undoBuffer.length > this.maxBufferSize) undoBuffer.shift()
    this.holding = true
    if ('pointerId' in p) this.setPointerCapture(p.pointerId)
    let {lastLoc} = this
    lastLoc.set(p.offsetX, p.offsetY)
    ctx.beginPath()
    // let {currentCSSZoom: zoom} = this
    ctx.arc(lastLoc.x,lastLoc.y,0,0,6)
    ctx.stroke()
    ctx.fill()
    // ctx.strokeRect(p.offsetX/zoom, p.offsetY/zoom, .5,.5)
}
class PaperCanvas extends HTMLElement {
    static observedAttributes = 'maxbuffersize '.split(' ')
    undoBuffer = []
    maxBufferSize = 10
    undo() {
        let {undoBuffer, ctx} = this
        if (!undoBuffer.length) return
        ctx.clearRect(0, 0, 250, 250)
        ctx.putImageData(undoBuffer.pop(), 0, 0)
    }
    holding = false
    lastLoc = vect(0/0,0/0)
    canvas = null
    ctx = null
    set alpha(val) {
        this.ctx = this.canvas.setAttr({'-moz-opaque': !val}).getContext('2d', {
            alpha: val,willReadFrequently:true
        })
        this.undoBuffer.length = 0
    }
    get alpha() {
        return !('-moz-opaque'in $(this).attr) && this.ctx.getContextAttributes().alpha
    }
    static #BASE_CONTEXT_ATTRIBUTES = {
        lineJoin: 'round',
        lineCap: 'round',
        fillStyle: 'white'
    }
    connectedCallback() {
        let t = $(this)
        let shadow = this.attachShadow({mode: 'open'})
        let canvas = this.canvas = $('canvas #canvas', {
            attr: {
                width:250,
                height:250
            }
        })
        this.ctx = Object.assign(canvas.getContext('2d', {willReadFrequently:true}), PaperCanvas.#BASE_CONTEXT_ATTRIBUTES)
        $.push(shadow, canvas, style.cloneNode(true))
        t.on({
            pointermove,
            pointerdown,
            pointerup
        })
    }
}
let style = $('style', {
    textContent:`:host{${css.toCSS({
        '--user-select':'none',
        cursor:'crosshair',
        'touch-action':'none',
        'background-color':'white',
        display:'inline-flex',
        border:'1px solid black'
    })}}`
})
define('paper-canvas', PaperCanvas)