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
const color = new Proxy(new COLOR_MANAGER, COLOR_MANAGER.handler)
export default color