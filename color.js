import * as math from './num.js'
const { min, max, round } = Math,
    colors = new Map,
    canvas = new OffscreenCanvas(0, 0).getContext('2d'),
    handler = {
        get(target, prop) {
            'use strict'
            if (CSS.supports('color', prop)) {
                if (!colors.has(prop)) {
                    canvas.fillStyle = prop
                    colors.set(prop, Color(canvas.fillStyle))
                }
                return colors.get(prop)
            }
            if (prop in target) return target[prop]
            throw TypeError(`Invalid color '${prop}'`)
        },
        apply(target, _, args) {
            'use strict'
            return new target(...args)
        }
    }
const Color = new Proxy(class {
    //Darken Hex Colour
    //Don't ask why there's a "k" there
    static dhk(e, f = 40) { let $ = parseInt((e = ('' + e).replace(/^#/, "")).substring(0, 2), 16), a = parseInt(e.substring(2, 4), 16), r = parseInt(e.substring(4, 6), 16); return $ = round($ * (1 - f / 100)), a = round(a * (1 - f / 100)), r = round(r * (1 - f / 100)), $ = min(255, max(0, $)), a = min(255, max(0, a)), r = min(255, max(0, r)), "#" + [$, a, r].map(function (e) { let f = e.toString(16); return 1 === f.length ? "0" + f : f }).join('') }
    static choose() {
        return `#${(Math.floor(Math.random() * 0x1000000)).toString(16).padStart(6, 0)}`
    }
    static opposite(colour) {
        if (0 === colour.indexOf("#") && (colour = colour.slice(1)), 3 === colour.length && (colour = colour[0] + colour[0] + colour[1] + colour[1] + colour[2] + colour[2]), 6 !== colour.length) throw SyntaxError('Invalid HEX color.')
        let f = (255 - parseInt(colour.slice(0, 2), 16)).toString(16),
            $ = (255 - parseInt(colour.slice(2, 4), 16)).toString(16),
            a = (255 - parseInt(colour.slice(4, 6), 16)).toString(16)
        return `#${[f, $, a].map(bleh2).join('')}`
    }
    static log(colour) {
        console.log(`%c${colour}`, `color:${colour};font-size:100px;background-color:${colour}`)
    }
    #r = 255
    #g = 255
    #b = 255
    #a = 1
    // No static init blocks allowed
    static _() {
        delete this._
        let enumerable = 1
        Object.defineProperties(this.prototype, {
            r: {
                enumerable,
                get() {
                    return this.#r
                },
                set(r) {
                    this.#r = math.clamp(r, 0, 255) || 0
                }
            },
            g: {
                enumerable,
                get() {
                    return this.#g
                },
                set(g) {
                    this.#g = math.clamp(g, 0, 255) || 0
                }
            },
            b: {
                enumerable,
                get() {
                    return this.#b
                },
                set(b) {
                    this.#b = math.clamp(b, 0, 255) || 0
                }
            },
            a: {
                enumerable,
                get() {
                    return this.#a
                },
                set(a) {
                    this.#a = math.clamp(a, 0, 1)
                    if (!this.#a && this.#a !== 0) this.#a = 1
                }
            }
        })
        return this
    }

    constructor(r, g, b, a) {
        if (typeof r === 'string' && r[0] !== '#')
            try {
                ({ r, g, b, a } = Color[r])
            }
            catch {
                r = 255
                g ??= 255
                b ??= 255
                a ??= 1
            }
        else if (typeof r === 'string' && r.startsWith('#'))
            ({ 0: r, 1: g, 2: b, 3: a } = hexToRgb(r).match(thingy))
        Object.freeze(Object.assign(this, { r, g, b, a }))
    }
    toString(format) {
        switch (format) {
            default: return `#${[this.r, this.g, this.b].map(toHex).join('')}`
            case 'rgb': return `rgb(${this.r} ${this.g} ${this.b})`
            case 'rgba': return `rgba(${this.r} ${this.g} ${this.b} ${this.a})`
            case 'hex2': return `#${[this.r, this.g, this.b, this.a * 255].map(toHex).join('')}`
            case 'hsl': {
                let { 0: h, 1: s, 2: l } = this.hsl
                return `hsl(${h} ${s}% ${l}%)`
            }
            case 'hsla': {
                let { 0: h, 1: s, 2: l } = this.hsl
                return `hsla(${h} ${s}% ${l}% ${this.#a})`
            }
        }
    }
    #copy(c) {
        let { r, g, b, a } = c
        return Object.assign(this, { r, g, b, a })
    }
    invert() {
        return this.#copy(Color(Color.opposite(`${this}`)))
    }
    get 0() {
        return this.r
    }
    set 0(r) {
        this.r = r
    }
    get 1() {
        return this.#g
    }
    set 1(g) {
        this.g = g
    }
    get 2() {
        return this.#b
    }
    set 2(b) {
        this.b = b
    }
    get 3() {
        return this.#a
    }
    get hsl() {
        let r = this.#r / 255,
            g = this.#g / 255,
            b = this.#b / 255
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b)
        let c = max - min
        let hue, shift, segment
        let luminance = (max + min) / 2
        let saturation = luminance <= 0.5 ? ((max - min) / (max + min)) :
            ((max - min) / (2 - max - min))
        if (!c) hue = 0
        else {
            switch (max) {
                case r:
                    segment = (g - b) / c
                    shift = 0 / 60       // R° / (360° / hex sides)
                    if (segment < 0)           // hue > 180, full rotation
                        shift = 360 / 60         // R° / (360° / hex sides)

                    break;
                case g:
                    segment = (b - r) / c
                    shift = 120 / 60     // G° / (360° / hex sides)
                    break
                case b:
                    segment = (r - g) / c
                    shift = 240 / 60    // B° / (360° / hex sides)
                    break
            }
            hue = segment + shift
        }
        return [hue * 60, saturation * 100, luminance * 100]
    }
    get h() {
        return `${this.hsl[0]}`
    }
    get s() {
        return `${this.hsl[1]}%`
    }
    get l() {
        return `${this.hsl[2]}%`
    }
    set 3(a) {
        this.a = a
    }
    get opacity() {
        return this.#a
    }
    set opacity(a) {
        this.a = a
    }
    get opposite() {
        let out = Color(`${this}`)
        out.invert()
        return out
    }
    darkenBy(amount) {
        return this.#copy(Color(Color.dhk(`${this}`, amount)))
    }
    *[Symbol.iterator]() {
        yield this.r
        yield this.g
        yield this.b
        yield this.a
    }
}._(), handler)
export default Color
function toHex(o) {
    return (o | 0).toString(16).padStart(2, 0)
}
export function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
export function hexToRgb(hex) {
    if (hex[0] === '#')
        hex = hex.slice(1)
    if (hex.length === 3) hex = hex.split('').map(bleh).join('')
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16),
        a = 1
    return `rgb(${r} ${g} ${b} ${a})`
}
function bleh(c) {
    return `${c}${c}`
}
function bleh2(o) {
    return o.padStart(0, 2)
}
const thingy = /\d+/g