import $,{define} from '../yay.js'
import * as css from '../csshelper.js'
import {vect} from '../num.js'
let touching = Symbol('👉')
    , touchpos = Symbol('📍')
    , ball = Symbol('🕹')
    , maxPullDistance = 60

class Joystick extends HTMLElement {
    [ball] = null;
    [touching] = false
    x = 0
    y = 0
    angle = 0

    static #import(e) {
        vect = e.vect
    }

    static #pointercancel(e) {
        this[ball].setStyles({
            transform: `rotateZ(${this.angle}rad)`
        })
        this.x = this.y = 0
        this.releasePointerCapture(e.pointerId)
        this[touching] = false
        this.dispatchEvent(new CustomEvent('release'))
    }

    static #events = {
        pointercancel: this.#pointercancel,
        pointerup: this.#pointercancel,
        pointermove(e) {
            if (!this[touching] || !vect) return
            let {length} = (this[touchpos] ??= vect(0, 0)).set(e.offsetX, e.offsetY).subtract(maxPullDistance)
            let t = this[touchpos]
            if (length > maxPullDistance) {
                t.x = t.x * maxPullDistance / length
                t.y = t.y * maxPullDistance / length
            }
            let {x, y, angle} = this[touchpos].clone.divide(maxPullDistance)
            this[ball].setStyles({
                transform: `translate${t.toString('px')} rotateZ(${angle}rad)`
            })
            this.angle = angle
            this.x = x
            this.y = y
            this.dispatchEvent(new CustomEvent('move'))
        },
        pointerdown(e) {
            this[touching] = true
            this.setPointerCapture(e.pointerId)
            this.dispatchEvent(new CustomEvent('hold'))
        }
    }


    constructor() {
        super()
        let t = $(this)
        for (let i in Joystick.#events) this[`on${i}`] = Joystick.#events[i]
        let shadow = t.attachShadow({mode: 'closed'})
        shadow.appendChild($('style', {
            textContent: `
                div {
                ${css.toCSS({
                width: '50px',
                'border-radius': '100%',
                height: '50px',
                'background-color': '#000',
                position: 'relative'
            })}
                }
                :host {
                ${css.toCSS({
                width: '120px',
                height: '120px',
                'touch-action': 'none',
                'place-items': 'center',
                'place-content': 'center',
                opacity: 0.5,
                'background-color': '#6a7b80',
                display: 'flex',
                // position: 'fixed',
                'border-radius': '100%',
            })}
                }
                `
        }).valueOf())
        shadow.appendChild(
            (this[ball] = $('<div part="ball"></div>')).valueOf()
        )
    }
}
define('touch-joystick', Joystick)