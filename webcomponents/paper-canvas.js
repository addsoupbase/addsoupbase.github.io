// import { vect } from "../num.js"
import '../css.js'
let structure = document.createRange().createContextualFragment('<div><div id="holder" part="holder"><slot name="before"></slot><canvas part="paper"></canvas><slot name="after"></slot></div><div part="controls" id="controls"><slot name="controls"></slot></div></div></>')
const css = window[Symbol.for('[[CSSModule]]')]
// import * as h from '../handle.js'
// let internals = Symbol()
let papers = document.getElementsByTagName('paper-canvas')
function b4(e) {
    [].some.call(papers, o => o.matches(':valid')) && e.preventDefault()
}
addEventListener('beforeunload', b4)
function offscreen(width, height) {
    if (typeof OffscreenCanvas === 'function') return new OffscreenCanvas(width, height)
    let n = document.createElement('canvas')
    n.width = width
    n.height = height
    return n
}
function pointerup(p) {
    let paper = this.getRootNode().host
    if (p.button === 2 || paper.resizing) return
    this.releasePointerCapture(p.pointerId)
    paper.holding = false
    let v = paper.value
    let i = paper.internals
    if (v instanceof Promise) v.then(file => {
        i?.setFormValue(file)
        i?.setValidity({ valueMissing: false }, 'Draw something')
    })
    else {
        i?.setFormValue(v)
        i?.setValidity({ valueMissing: false }, 'Draw something')
    }
}
function keydown(e) {
    let { shiftKey } = e
    let paper = this.getRootNode().host
    if (shiftKey) {
        this.resizing = !paper.resizing
        this.holding = false
        e.preventDefault()
    }
}
function pointermove(p) {
    let paper = this.getRootNode().host
    if (p.button === 2 || paper.resizing) return
    let { offsetX: x, offsetY: y } = p
    let zoom = paper.canvas.currentCSSZoom || 1
    if (paper.holding) {
        let { lastLoc, ctx } = paper
        if (p.touches) {
            let touches = p.touches[0]
            x = touches.clientX - touches.radiusX
            y = touches.clientY - touches.radiusY
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
    let paper = this.getRootNode().host
    if (paper.resizing) return
    if (p.button === 2) return paper.undo()
    this.setPointerCapture(p.pointerId)
    let { ctx, canvas } = paper
    paper.snapshot()
    paper.holding = true
    let { lastLoc } = paper
    let zoom = paper.canvas.currentCSSZoom || 1
    lastLoc[0] = p.offsetX
    lastLoc[1] = p.offsetY
    ctx.beginPath()
    // let {currentCSSZoom: zoom} = this
    ctx.arc(lastLoc[0] / zoom, lastLoc[1] / zoom, 0, 0, 6)
    ctx.stroke()
    ctx.fill()
    // ctx.strokeRect(p.offsetX/zoom, p.offsetY/zoom, .5,.5)
}
if (Object.getOwnPropertyDescriptor(ShadowRoot.prototype, 'adoptedStyleSheets')) {
    let style = new CSSStyleSheet
    style.replaceSync(`
    @property --brush-color {
        syntax: "<color>";
        inherits: true;
        initial-value: black;
    }
    @property --brush-size {
        syntax: "<length>";
        inherits: true;
        initial-value: 1px;
    }
    :where(#controls) {
        width: max-content;
        margin: auto;
    }
    #holder {
        ${css.toCSS({ 'user-select': 'none' })}
    }
    canvas {
        justify-self:center;
        touch-action: none;
        image-rendering: auto;
        outline: 1px solid black;
        background: repeating-conic-gradient(white 0 25%, lightgrey 0 50%) 50% / 12.5px 12.5px content-box;
        -webkit-touch-callout: none;
        cursor: inherit;
        -webkit-tap-highlight-color: transparent !important
    }
    :host([resizing]){resize:both !important;cursor:revert;outline-style:dashed;outline-width:2px;}
    :host{
    cursor:unset !important;
    width: max-content;
    height: max-content;
    overflow: visible;
    display: inline-grid;
}`)
    class PaperCanvas extends HTMLElement {
        static formAssociated = true
        static observedAttributes = 'maxbuffersize color brushsize width height'.split(' ')
        undoBuffer = []
        maxBufferSize = 25
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
            ctx.drawImage(undoBuffer.pop(), 0, 0)
            this.internals?.setValidity({ valueMissing: !undoBuffer.length }, 'Draw something')
        }
        snapshot() {
            let { undoBuffer, ctx, canvas } = this
            let n = offscreen(canvas.width, canvas.height)
            n.getContext('2d').drawImage(canvas, 0, 0)
            undoBuffer.push(n)
            while (this.undoBuffer.length > this.maxBufferSize) undoBuffer.shift()
        }
        get colorElement() {
            return this.#colorElement
        }
        get brushElement() { return this.#brushElement }
        #colorElement = null
        #brushElement = null
        static #dataList
        static get #colorList() {
            return this.#dataList ||= document.createRange().createContextualFragment(`<datalist style="display:none" id="fallback">${''.split('black white lightpink pink lightred red darkered orange yellow lightgreen green darkgreen cyan teal blue indigo violet grey').map(o => `<option value="${o}"></option>`).join('')}</datalist>`)
        }
        constructor() {
            super()
            this.addEventListener('beforesubmit', removeEventListener.bind(window,'beforeunload', b4))
            let c = this.#colorElement = this.querySelector('[data-is="color"]')
            if (typeof scrollMaxX === 'number' && c) {
                c.type = 'text'
                c.style.maxWidth = '50%'
                c.style.width = 'fit-content'
                c.after(PaperCanvas.#colorList.cloneNode(true))
                c.setAttribute('list', 'fallback')
                c.addEventListener('input', setValidity)
            }
            this.#brushElement = this.querySelector('[data-is="brushsize"]')
            this.internals?.setValidity({ valueMissing: true }, 'Draw something')
            let shadow = this.attachShadow({ mode: 'open' })
            let width = +this.getAttribute('width') || 250
            let height = +this.getAttribute('height') || 250
            // v.esc`<canvas id="canvas" style="width:${width}px;height:${height}px" width="${width}" height="${height}">`
            shadow.appendChild(structure.cloneNode(true))
            let canvas = this.canvas = shadow.querySelector('canvas')
            if (this.#colorElement)
                canvas.addEventListener('wheel', scroll, { passive: false })
            canvas.style.width = `${canvas.width = width}px`
            canvas.style.height = `${canvas.height = height}px`
            this.ctx = Object.assign(canvas.getContext('2d'), PaperCanvas.BASE_CONTEXT_ATTRIBUTES)
            this.ctx.fillRect(0, 0, width, height)
            this.color = 'black'
            shadow.adoptedStyleSheets = [style]
            canvas.addEventListener('contextmenu', norightclick)
            this.addEventListener('input', input)
            this.addEventListener('click', click)
            // t.observe('resize', {
            //     callback: resizeCanvas
            // })
        }
        #form = this.closest('form')
        internals = this.#form?.contains(this) ? this.attachInternals() : null
        holding = false
        lastLoc = Float64Array.of(0, 0)
        canvas = null
        ctx = null
        get value() {
            let { width, height } = this.canvas
            switch (this.getAttribute('type')) {
                default: return this.dataURL(1)
                case 'file': return new Promise(resolve => this.canvas.toBlob(resolve, { type: 'image/webp', quality: 1 })).then(blob => new File([blob], `${this.getAttribute('name') || 'untitled'}.png`, { type: 'image/png' }))
            }
        }
        dataURL(quality = 1) {
            return this.canvas.toDataURL('image/webp', quality)
        }
        toBlob(quality) {
            return new Promise(resolve => {
                this.canvas.toBlob(resolve, 'image/webp', 1)
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
            this.snapshot()
            this.brushsize = 1
            let { width, height } = this.canvas, { ctx } = this
            let old = ctx.fillStyle
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, width, height)
            ctx.fillStyle = old
            this.internals?.setValidity({ valueMissing: true }, 'Draw something')
        }
        #saved = PaperCanvas.BASE_CONTEXT_ATTRIBUTES
        #save() {
            let s = this.#saved
            s.strokeStyle = this.color
            s.fillStyle = 'black'
            s.lineCap =
                s.lineJoin = 'round'
        }
        #restore() {
            Object.assign(this.ctx, this.#saved)
        }
        attributeChangedCallback(name, _, newValue) {
            if (this.canvas) switch (name) {
                case 'width':
                    var val = parseFloat(newValue) || 1
                    this.#save()
                    this.canvas.width = val
                    this.canvas.style.width = `${val}px`
                    this.#restore()
                    break
                case 'height':
                    var val = parseFloat(newValue) || 1
                    this.#save()
                    this.canvas.height = val
                    this.canvas.style.height = `${val}px`
                    this.#restore()
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
        set brushsize(size) {
            this.setAttribute('brushsize', size)
            this.style.setProperty('--brush-size', `${Math.max(parseFloat(size), 1)}px`)
        }
        set color(color) {
            this.ctx.fillStyle = this.ctx.strokeStyle = color
            let colorPicker = this.#colorElement
            this.style.setProperty('--brush-color', color)
        }
        get color() {
            return this.ctx.fillStyle
        }
        disconnectedCallback() {
            [pointermove, pointerdown, pointerup].forEach(removeListeners, this.canvas)
        }
        connectedCallback() {
            [pointermove, pointerdown, pointerup].forEach(addListeners, this.canvas)
            this.role = this.role || 'application'
            let color = this.#colorElement
            if (color) this.color = color.value ?? color.textContent.trim()
            let brushsize = this.#brushElement
            if (brushsize) this.brushsize = brushsize.value ?? brushsize.textContent
            this.hasAttribute('tabindex') || (this.tabIndex = 0)
        }
    }
    if (customElements.get('paper-canvas') !== PaperCanvas) {
        // let d = customElements.whenDefined('paper-canvas')
        customElements.define('paper-canvas', PaperCanvas)
        // await d
    }
}
else {
    customElements.get('paper-canvas') || customElements.define('paper-canvas', class extends HTMLElement { connectedCallback() { this.closest('form')?.style.setProperty('display', 'none', 'important') } })
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
        // Object.assign(ctx, this.#saved)
        t.color = c
    }
}
function norightclick(e) { e.preventDefault() }
function input(t) {
    let changed = t.target,
        is = changed.dataset.is
    switch (is) {
        case 'color':
            this.color = changed.value ?? changed.textContent.trim()
            break
        case 'brushsize':
            this.brushsize = changed.value ?? changed.textContent
            break
    }
}
function addListeners(o) {
    this.addEventListener(o.name, o)
}
function removeListeners(o) {
    this.removeEventListener(o.name, o)
}
function scroll(e) {
    let paper = e.target.getRootNode().host
    let brush = paper.brushElement
    if ('value' in brush) {
        brush.value = paper.brushsize -= ((brush.min || 1) / (brush.max || 10)) * (Math.sign(e.deltaY) / (((brush.step || .01)) / 6))
        brush.dispatchEvent(new Event('change', { cancelable: true, bubbles: true }))
        e.preventDefault()
    }
}
function click(e) {
    let t = e.target
    if (t.dataset.is === 'undo') {
        e.preventDefault()
        t.closest('paper-canvas').undo()
    }
}
function setValidity() {
    if (CSS.supports('color', this.value)) this.setCustomValidity('')
    else this.setCustomValidity('Invalid Color')
}