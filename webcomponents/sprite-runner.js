import $, { define, base, prox, css, h } from '../yay.js'
// import {cell} from '../img.js
function cell(width, height, cols, rows, x, y) {
    let h = height / rows
        , w = width / cols
    return [w * x % width, h * y % height, w, h]
}
const elementName = new URL(import.meta.url).pathname.split('/').at(-1).slice(0, -3)
class Sprite extends HTMLElement {
    static observedAttributes = 'cols rows index'.split(' ')
    static {
        let o = this.observedAttributes,
            { prototype } = this
        for (let i = o.length; i--;) {
            let prop = o[i]
            Object.defineProperty(prototype, prop, {
                get() {
                    return this.getAttribute(prop) | 0
                },
                set(val) {
                    this.setAttribute(prop, val | 0)
                }
            })
        }
        o.push('src', 'dir')
    }
    get framedura() {
        return +this.getAttribute('dura') || 0
    }
    set framedura(dura) {
        this.setAttribute('dura', +dura || 0)
    }
    #shadow = this.attachShadow({ mode: 'open' })
    #image
    get src() {
        return this.#image.src
    }
    set src(src) {
        this.#image.src = src
    }
    #part
    // #sheet
    constructor() {
        super()
        // preload the images so no flicker happens
        let shadow = this.#shadow
        shadow.innerHTML =
            `<div style="display:inline-block;overflow:hidden;image-rendering:pixelated;"><img part="sprite" id="sprite" style="position:relative"></div>
        <style>:host {display: block}
#sprite{animation-iteration-count:infinite;animation-play-state:running;animation-direction:normal}
  @keyframes slideshow {
        from{transform: translateX(0%)}
        to{transform: translateX(-100%)}
        }
</style>`
        let img = this.#image = shadow.getElementById('sprite')
        img.addEventListener('load', this.#recalc.bind(this))
        this.#part = img.parentElement
        let preload = this.getAttribute('preload')?.split(' ')
        if (preload)for(let i = preload.length; i--;) {
            let link = preload[i]
            if (!document.head.querySelector(`link[rel="preload"][as="image"][href="${link}"]`)) {
                let el = document.createElement('link')
                el.rel = 'preload'
                el.as = 'image'
                el.href = link
                document.head.appendChild(el)
            }
        }
        // this.#sheet = shadow.lastElementChild
    }
    connectedCallback() {
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'img')
    }
    play() {
        let img = this.#image
        let {style} = img
        style.animationDuration = `${this.framedura || 100}ms`
        style.animationTimingFunction = `steps(${this.cols}, end)`
        if (this.hasAttribute('reset')) {
            style.animationName = 'none'
            img.offsetHeight // trigger reflow
        }
        style.animationName = 'slideshow'
    }
    #cell(x = 0, y = 0) {
        let img = this.#image
        return cell(img.naturalWidth, img.naturalHeight, this.cols, this.rows, x, y)
    }
    #recalc() {
        let part = this.#part
        let { 2: width, 3: height } = this.#cell(0, 0)
        if (isNaN(width) || isNaN(height)) return
        part.style.width = `${width}px`
        part.style.height = `${height}px`
        if (this.hasAttribute('autoplay')) this.play()
        this.#image.style.top = `-${this.index * (this.#image.naturalHeight / this.rows) % this.#image.naturalHeight}px`
    }
    attributeChangedCallback(attr, oldv, newv) {
        switch (attr) {
            case 'cols':
            case 'rows':
            case 'index':
                this.#image.complete && this.#recalc()
                break
            default: {
                this[attr] = newv
            }
        }
    }
}
define(elementName, Sprite)