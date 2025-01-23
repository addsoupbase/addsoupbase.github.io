const { min, max, round } = Math
class COLOR_MANAGER {
    static #canvas
    static handler = {
        get(target, prop) {
            if (CSS.supports('color', prop)) {
                const canvas = COLOR_MANAGER.#canvas
                canvas.strokeStyle = prop
                return canvas.strokeStyle
            }
            if (prop in target) return target[prop]
            throw TypeError('CSS does not support the color \'' + prop + '\'')
        }
    }
    //Darken hex color
    dhk(e, f = 40) { let $ = parseInt((e = ('' + e).replace(/^#/, "")).substring(0, 2), 16), a = parseInt(e.substring(2, 4), 16), r = parseInt(e.substring(4, 6), 16); return $ = round($ * (1 - f / 100)), a = round(a * (1 - f / 100)), r = round(r * (1 - f / 100)), $ = min(255, max(0, $)), a = min(255, max(0, a)), r = min(255, max(0, r)), "#" + [$, a, r].map(function (e) { let f = e.toString(16); return 1 === f.length ? "0" + f : f }).join('') }
    choose() {
        return `#${ran.frange(0, 0x1000000).toString(16).padStart(6, 0)}`
    }
    opposite(colour) {
        if (0 === colour.indexOf("#") && (colour = colour.slice(1)), 3 === colour.length && (colour = colour[0] + colour[0] + colour[1] + colour[1] + colour[2] + colour[2]), 6 !== colour.length) throw TypeError('Invalid HEX color.')
        let f = (255 - parseInt(colour.slice(0, 2), 16)).toString(16),
            $ = (255 - parseInt(colour.slice(2, 4), 16)).toString(16),
            a = (255 - parseInt(colour.slice(4, 6), 16)).toString(16)
        return `#${f.padStart(0, 2)}${$.padStart(0, 2)}${a.padStart(0, 2)}`
    }
    log(colour) {
        console.log(`%c ${colour}`, `color:${colour};font-size:100px;background-color:${colour}`)
    }
    constructor() {
        if ('undefined'.match(RegExp([typeof OffscreenCanvasRenderingContext2D, typeof OffscreenCanvas, typeof CanvasRenderingContext2D].join('|')))) return null
        new.target.#canvas = new OffscreenCanvas(0, 0).getContext('2d')
    }
}
export function Color(r = 255, g = 255, b = 255, a = 1) {
    if (!new.target) return new Color(r, g, b, a)
    if (typeof r === 'string' && (() => { try { color[r] } catch { return false }; return true })()) {
        r = color[r]
    }
    if (typeof r !== 'string') { }
    else if (typeof r === 'string' && r.startsWith('#')) {
        let hex = r.slice(1)
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
        r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16),
            a = 1
    }
    else if (typeof r === 'string' && r.startsWith('rgb')) {
        let [_, red, green, blue] = r.match(/\d+/g)
        r = +red, g = +green, b = +blue, a = 1
    }
   /* else if (typeof r === 'string' && r.startsWith('hsl')) {
        let [_, h, s, l] = r.match(/\d+/g)
        r = +h, g = +s, b = +l, a = 1
    }
    else if (typeof r === 'string' && r.startsWith('hsv')) {
        let [_, h, s, v] = r.match(/\d+/g)
        r = +h, g = +s, b = +v, a = 1
    }
    else if (typeof r === 'string' && r.startsWith('lab')) {
        let [_, l, a, b] = r.match(/\d+/g)
        r = +l, g = +a, b = +b, a = 1
    }*/
    else if (typeof r === 'string' && r.startsWith('rgba')) {
        let [_, red, green, blue, alpha] = r.match(/\d+/g)
        r = +red, g = +green, b = +blue, a = +alpha
    }
   /* else if (typeof r === 'string' && r.startsWith('hsla')) {
        let [_, h, s, l, alpha] = r.match(/\d+/g)
        r = +h, g = +s, b = +l, a = +alpha
    }
    else if (typeof r === 'string' && r.startsWith('hsva')) {
        let [_, h, s, v, alpha] = r.match(/\d+/g)
        r = +h, g = +s, b = +v, a = +alpha
    }*/
    Object.assign(this, { r, g, b, a })
}
Object.defineProperties(Color.prototype, {
    toString: {
        value(format) {
            switch (format) {
                default: return `#${this.r.toString(16).padStart(2, 0)}${this.g.toString(16).padStart(2, 0)}${this.b.toString(16).padStart(2, 0)}`
                case 'rgb': return `rgb(${this.r},${this.g},${this.b})`
                case 'rgba': return `rgba(${this.r},${this.g},${this.b},${this.a})`
                case 'hex2': return `#${this.r.toString(16).padStart(2, 0)}${this.g.toString(16).padStart(2, 0)}${this.b.toString(16).padStart(2, 0)}${this.a.toString(16).padStart(2, 0)}`
                //case 'hsl': return `hsl(${this.r},${this.g}%,${this.b}%)`
                //case 'hsla': return `hsla(${this.r},${this.g}%,${this.b}%,${this.a})`
                //case 'hsv': return `hsv(${this.r},${this.g}%,${this.b}%)`
                //case 'hsva': return `hsva(${this.r},${this.g}%,${this.b}%,${this.a})`
                //case 'lab': return `lab(${this.r},${this.g},${this.b})`
            }
        }
    },
    flip: {
        value() {
            Object.assign(this, Color(color.opposite(this.toString())))
        }
    },
    0: {
        get() {
            return this.r
        },
        set(r) {
            this.r = r
        }
    },
    1: {
        get() {
            return this.g
        },
        set(g) {
            this.g = g
        }
    },
    2: {
        get() {
            return this.b
        },
        set(b) {
            this.b = b
        }
    },
    3: {
        get() {
            return this.a
        },
        set(a) {
            this.a = a
        }
    },
    opacity: {
        get() {
            return this.a
        },
        set(opacity) {
            this.a = opacity
        }
    },
    [Symbol.iterator]: {
        *value() {
            yield this.r
            yield this.g
            yield this.b
            yield this.a
        }
    }
})
const color = new Proxy(new COLOR_MANAGER, COLOR_MANAGER.handler)
export default color