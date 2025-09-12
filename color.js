import * as math from './num.js'
const inBrowser = !!globalThis.document
/*async function getBlob(ctx) {
    if (inBrowser) {
        return new Promise(executor)
        function executor(resolve) {
            return ctx.canvas.toBlob(resolve)
        }
    }
    else {
        function executor(ctx) {
            return new Promise(ctx.canvas.convertToBlob.bind(ctx.canvas))
        }
    }
}*/
function createCanvas(w, h, alpha) {
    if (inBrowser) {
        let out = document.createElement('canvas')
        out.width = +w || 0
        out.height = +h || 0
        out.toggleAttribute('moz-opaque', !alpha)
        return out.getContext('2d', { alpha })
    }
    return new OffscreenCanvas(w || 0, h || 0).getContext('2d', { alpha })
}

const { min, max, round } = Math,
    colors = new Map,
    canvas = createCanvas(),
    handler = {
        get(target, prop) {
            if (prop in target) return target[prop]
            if (CSS.supports('color', prop)) {
                if (!colors.has(prop)) {
                    canvas.fillStyle = prop
                    colors.set(prop, new Color(canvas.fillStyle))
                }
                return colors.get(prop)
            }
            throw TypeError(`Invalid color '${prop}'`)
        },
        apply(...{ 0: target, 2: args }) {
            return Reflect.construct(target, args)
        }
    }
const Color = new Proxy(class $ extends Uint8ClampedArray {
    //Darken Hex Colour
    //Don't ask why there's a "k" there
    static dhk(e, f = 40) {
        let $ = parseInt((e = String(e).replace(/^#/, "")).substring(0, 2), 16), a = parseInt(e.substring(2, 4), 16),
            r = parseInt(e.substring(4, 6), 16)
        return $ = round($ * (1 - f / 100)), a = round(a * (1 - f / 100)), r = round(r * (1 - f / 100)), $ = min(255, max(0, $)), a = min(255, max(0, a)), r = min(255, max(0, r)), "#" + [$, a, r].map(function (e) {
            let f = e.toString(16)
            return 1 === f.length ? "0" + f : f
        }).join('')
    }

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
    // No static init blocks allowed
    static _() {
        delete this._
        // let enumerable = 1
        Object.defineProperties(this.prototype, {
            [Symbol.toStringTag]: {
                value: 'Color'
            },
            r: {
                // enumerable,
                get() {
                    return this[0]
                },
                set(r) {
                    this[0] = r
                }
            },
            g: {
                // enumerable,
                get() {
                    return this[1]
                },
                set(g) {
                    this[1] = g
                }
            },
            b: {
                // enumerable,
                get() {
                    return this[2]
                },
                set(b) {
                    this[2] = b
                }
            },
            a: {
                // enumerable,
                get() {
                    return this[3] / 255
                },
                set(a) {
                    this[3] = a * 255
                }
            }
        })
        return this
    }
    /*static #img = /(?:data|blob):|\.(?:webp|a?png|jpe?g|gif|(?:av|jf)if|pjp(?:eg)?)/i
    static #executor(src) {
        let image = new Image(1, 1)
        image.src = src
        function GetColorFromPixel(resolve, reject) {
            async function onload() {
                let ctx = createCanvas(4, 4)
                ctx.drawImage(image, 0, 0, 4, 4)
                let { data } = ctx.getImageData(0, 0, 4, 4)
                let reds = [],
                    greens = [],
                    blues = []
                for (let i = 0, { length } = data; i < length; i += 3) {
                    let r = data[i],
                        g = data[i + 1],
                        b = data[i + 1],
                        a = data[i + 1]
                    if (a < 1) continue
                    reds.push(r)
                    greens.push(g)
                    blues.push(b)
                }
                resolve(Color(math.avg.apply(1, reds), math.avg.apply(1, greens), math.avg.apply(1, blues)))
            }
            image.onload = onload
            image.onerror = reject
        }

        return new Promise(GetColorFromPixel)
    }*/

    constructor(r, g, b, a) {
        super(4)
        if (typeof r === 'number' && g == null && b == null && a == null) {
            let n = numToRgb(r)
            r = n[0]
            g = n[1]
            b = n[2]
            a = n[3]
        }
        else if (typeof r === 'string' && r[0] !== '#') {
            // if ($.#img.test(r))
            //     return $.#executor(r)
            try {
                ({ r, g, b, a } = Color[r])
            } catch {
                r = 255
                g ??= 255
                b ??= 255
                a ??= 1
            }
        } else if (typeof r === 'string' && r.startsWith('#'))
            ({ 0: r, 1: g, 2: b, 3: a } = hexToRgb(r).match(thingy))
        Reflect.preventExtensions(Object.assign(this, { r, g, b, a }))
    }

    toString(format) {
        switch (format) {
            default:
                return `#${[this.r, this.g, this.b].map(toHex).join('')}`
            case 'rgb':
                return `rgb(${this.r} ${this.g} ${this.b})`
            case 'rgba':
                return `rgb(${this.r} ${this.g} ${this.b} / ${this.a})`
            case 'hex2':
                return `#${[this.r, this.g, this.b, this.a * 255].map(toHex).join('')}`
            case 'hsl': {
                let { 0: h, 1: s, 2: l } = this.hsl
                return `hsl(${h} ${s}% ${l}%)`
            }
            case 'hsla': {
                let { 0: h, 1: s, 2: l } = this.hsl
                return `hsl(${h} ${s}% ${l}% / ${this.a})`
            }
        }
    }

    #copy(c) {
        let { r, g, b, a } = c
        return Object.assign(this, { r, g, b, a })
    }

    invert() {
        return this.#copy(new $($.opposite(String(this))))
    }

    get hsl() {
        let r = this.r / 255,
            g = this.g / 255,
            b = this.b / 255
            , MAX = max(r, g, b),
            MIN = min(r, g, b)
            , c = MAX - MIN
            , hue, shift, segment
            , luminance = (MAX + MIN) / 2
            , saturation = luminance <= 0.5 ? ((MAX - MIN) / (MAX + MIN)) :
                ((MAX - MIN) / (2 - MAX - MIN))
        if (!c) hue = 0
        else {
            switch (MAX) {
                case r:
                    segment = (g - b) / c
                    shift = 0 / 60       // R° / (360° / hex sides)
                    if (segment < 0)           // hue > 180, full rotation
                        shift = 360 / 60         // R° / (360° / hex sides)
                    break
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
        return String(this.hsl[0])
    }

    get s() {
        return `${this.hsl[1]}%`
    }

    get l() {
        return `${this.hsl[2]}%`
    }
    valueOf() {
        let r = this[0] << 16,
        g = this[1] << 8,
        b = this[2] << 4
        return r | g | b
    }
    get opacity() {
        return this.a
    }

    set opacity(a) {
        this.a = a
    }

    get opposite() {
        let out = new $(String(this))
        out.invert()
        return out
    }

    darkenBy(amount) {
        return this.#copy(new $($.dhk(String(this), amount)))
    }
}._(), handler)
export default Color

function toHex(o) {
    return (o | 0).toString(16).padStart(2, 0)
}

export function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
export function numToRgb(num) {
    let r = num >> 16 & 255,
    g = num >> 8 & 255,
    b = num >> 4 & 255
    // ,a = num >> 2 & 255
    return Uint8Array.of(r,g,b,255)
    // return `rgb(${r} ${g} ${b} / ${a / 255})`
}
export function hexToRgb(hex) {
    if (hex[0] === '#')
        hex = hex.slice(1)
    if (hex.length === 3) hex = hex.split('').map(bleh).join('')
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16),
        a = 1
    return `rgb(${r} ${g} ${b} / ${a})`
}

function bleh(c) {
    return `${c}${c}`
}

function bleh2(o) {
    return o.padStart(0, 2)
}

const thingy = /\d+/g