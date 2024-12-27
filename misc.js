const { floor, random, min, max, PI, abs, atan2, hypot, round } = Math,
    { is, values } = Object,
    { isInteger, isFinite, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER } = Number,
    { fromCodePoint } = String
class RANDOM {
    get coin() {
        return this.choose(true, false)
    }
    choose(...deck) {
        return deck[floor(random() * deck.length)]
    }
    range(MIN, MAX) {
        return random() * (MAX - MIN) + MIN
    }
    frange(MIN, MAX) {
        return floor(this.range(MIN, MAX))
    }
    pseudo() {
        return performance.now() % 1
    }
    truly() {
        return crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff
    }
    shuffle(...item) {
        for (let a = 0, { length } = item; a < length; ++a) {
            const pick = floor(random() * (a + 1));
            [item[a], item[pick]] = [item[pick], item[a]]
        }
        return item
    }
    gen(length = 6) {
        return Array.from({ length }, this.#gen).join('');
    }
    #gen() {
        return fromCodePoint(floor(random() * 0x110000))
    }
    randomizer(charCount = 6) {
        return new Proxy({ __chars__: charCount }, { get: this.#randomizer })
    }
    #randomizer(target, prop) {
        return target[prop] ??= gen(target.__chars__)
    }
}
class MATH {
    isInt(num) {
        return isInteger(num)
    }
    sanitize(num) {
        return num === +num && num != null && isFinite(num)
    }
    equality(first, ...rest) {
        return rest.every(function (o) { return is(o, first) })
    }
    toRad(deg) {
        return deg * PI / 180
    }
    toDeg(rad) {
        return rad * 180 / PI
    }
    diff(a, b) {
        return abs(a - b)
    }
    clamp(val, MIN, MAX) {
        return min(MAX, max(MIN, val))
    }
    cycle(...wheel) {
        return new MATH.#cycle(wheel)
    }
    average(...numbers) {
        if (!numbers.length) return NaN
        const sorted = numbers.toSorted(this.#sort)
        return sorted.reduce(this.#reduce) / sorted.length
    }
    #reduce(a, b) {
        return a + b
    }
    #sort(a, b) {
        return a - b
    }
    static #cycle = class {
        #wheel
        move(step = 1) {
            this.old = this.current
            this.current += (step | 0) || 1
            return this.#wheel[this.old % this.length]
        }
        get next() {
            return this.move(1)
        }
        get previous() {
            return this.move(-1)
        }
        *[Symbol.iterator]() {
            for (; ;)yield this.next
        }
        constructor(items) {
            this.old = this.current = 0
            this.length = items.length
            this.#wheel = items
        }
    }

}
class STRING {
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    ALPHABET = this.alphabet.toUpperCase()
    numbers = '0123456789'
    months = 'January February March April May June July August September October November December'.split(' ')
    days = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')
    formatNumber(num) {
        return (+num).toLocaleString()
    }
    shorten(str, length, tail) {
        if (!length) throw RangeError('Length must be present')
        let out = str.slice(0, length)
        return str.length > length ? out += tail || '' : out
    }
    clip(str, length) {
        return str.slice(length, str.length - length)
    }
    reverse(str) {
        return str.split('').toReversed().join('')
    }
    cap(str) {
        return str[0].toUpperCase() + str.slice(1)
    }
    #map = new Map(Object.entries({ 1: 'st', 2: 'nd', 3: 'rd' }))
    toOrdinal(o) {
        const lastTwoDigits = o % 100, me = (o + "").at(-1);
        if ((lastTwoDigits >= 11 && lastTwoDigits <= 13) || !this.#map.has(me))
            return o + "th"; return o + this.#map.get(me)
    }
}
class ARR {
    assemble(arrayLike, ...sequence) {
        const out = []
        for (let { length } = sequence, i = 0; i < length; ++i) out.push(arrayLike.at(sequence[i]));
        return out
    }
    center(array) {
        return array[(array.length / 2) | 0]
    }
    insert(array, item, index) {
        return array.splice(index, 0, item)
    }
    remove(item, index) {
        return typeof item === 'string' ?
            item.slice(0, index) + item.slice(index + 1) :
            item.splice(index, 1)
    }
    swap(item, first, second) {
        [item[first], item[second]] = [item[second], item[first]]
        return item
    }
    swapInside(item, firstIndex, secondIndex) {
        const slot = item.indexOf(firstIndex), slot2 = item.indexOf(secondIndex);
        if (slot !== -1 && slot2 !== -1) return item.swap(slot, slot2);
        throw RangeError("Index out of range")
    }

}

export class Vector2 {
    get [Symbol.toStringTag]() { return 'Vector2' }
    toString() { return '(' + this.x + ', ' + this.y + ')' }
    constructor(x = 0, y = 0, MIN = MIN_SAFE_INTEGER, MAX = MAX_SAFE_INTEGER) {
        if (y == null) {
            y = v.y(x)
            x = v.x(x)
        }
        Object.seal(this)
        this.#min = MIN
        this.#max = MAX
        this.set(x, y)
    }
    #min = NaN
    #max = NaN
    x = NaN
    y = NaN
    //get #value() { return [this.x, this.y] }
    get 0() { return this.x }
    set 0(x) { this.x = x }
    get 1() { return this.y }
    set 1(y) { this.y = y }
    get normalized() {
        const mag = this.magnitude
        return new v(this.x / mag || 0, this.y / mag || 0)
    }
    normalize() {
        return this.set(this.normalized)
    }
    get magnitude() {
        return abs(this.x + this.y)
    }
    get angle() {
        return atan2(this.y, this.x)
    }
    get isValid() {
        const { x, y } = this
        return x === +x && y === +y
    }
    get inverse() {
        const { x, y } = this
        return new v(x ** -1, y ** -1)
    }
    get negated() {
        const { x, y } = this
        return new v(-x, -y)
    }
    get length() {
        return hypot(this.x, this.y)
    }
    static random(minX, maxX, minY, maxY) {
        const { range } = ran
        return new v(range(minX, maxX), range(minY, maxY))
    }
    static x(vectorLike) {
        return vectorLike.x ?? vectorLike[0] ?? values(vectorLike)[0]
    }
    static y(vectorLike) {
        return vectorLike.y ?? vectorLike[1] ?? values(vectorLike)[1]
    }
    static angle(first, second) {
        const firstAngle = atan2(v.y(first), v.x(first)),
            secondAngle = atan2(v.y(second), v.x(second)),
            angle = secondAngle - firstAngle
        return abs(angle)
    }
    static difference(x1, y1, x2, y2) {
        if (x2 == null && y2 == null) {
            x2 = v.x(y1)
            y2 = v.y(y1)
            y1 = v.y(x1)
            x1 = v.x(x1)
        }
        const { diff } = math
        return new v(diff(x1, x2), diff(y1, y2))
    }
    static distance(x1, x2, y1, y2) {
        if (x2 == null && y2 == null) {
            x2 = v.x(y1)
            y2 = v.y(y1)
            y1 = v.y(x1)
            x1 = v.x(x1)
        }
        return hypot(x1 - x2, y1 - y2)
    }
    static equals(x1, x2, y1, y2) {
        if (x2 == null && y2 == null) {
            x2 = v.x(y1)
            y2 = v.y(y1)
            y1 = v.y(x1)
            x1 = v.x(x1)
        }
        return (x1 === x2) && (y1 === y2)
    }
    lerp({ to, time = 0.1 }) {
        return this.subtract((this.minus(to)).multiply(time, time))
    }
    set(x, y) {
        if (y == null) {
            y = v.y(x)
            x = v.x(x)
        }
        const { clamp } = math
        this.x = clamp(+x, this.#min, this.#max)
        this.y = clamp(+y, this.#min, this.#max)
        return this
    }
    add(x, y) {
        if (y == null) {
            y = v.y(x)
            x = v.x(x)
        }
        this.set(this.x + x, this.y + y)
        return this
    }
    subtract(x, y) {
        if (y == null) {
            y = v.y(x)
            x = v.x(x)
        }
        this.set(this.x - x, this.y - y)
        return this
    }
    divide(x, y) {
        if (y == null) {
            y = v.y(x)
            x = v.x(x)
        }
        this.set(this.x / x, this.y / y)
        return this
    }
    multiply(x, y) {
        if (y == null) {
            y = v.y(x)
            x = v.x(x)
        }
        this.set(this.x * x, this.y * y)
        return this
    }
    pow(x, y) {
        if (y == null) {
            y = v.y(x)
            x = v.x(x)
        }
        this.set(this.x ** x, this.y ** y)
        return this
    }
    *[Symbol.iterator]() {
        yield this.x
        yield this.y
    }
}
const v = Vector2
class COLOR_MANAGER {
    static #canvas
    static handler = {
        get(target, prop) {
            if (CSS.supports('color', prop)) {
                COLOR_MANAGER.#canvas.strokeStyle = prop
                return COLOR_MANAGER.#canvas.strokeStyle
            }
            if (prop in target) return target[prop]
            throw TypeError('CSS does not support the color "' + prop + '"')
        }
    }
    //Darken hex color
    dhk(e, f = 40) {
        let { clamp } = math, $ = parseInt((e = ('' + e).replace(/^#/, "")).substring(0, 2), 16), a = parseInt(e.substring(2, 4), 16), r = parseInt(e.substring(4, 6), 16); return $ = round($ * (1 - f / 100)), a = round(a * (1 - f / 100)), r = round(r * (1 - f / 100)), $ = clamp($, 255, 0), a = clamp(a, 255, 0), r = clamp(r, 255, 0), "#" + [$, a, r].map(e => { let f = e.toString(16); return 1 === f.length ? "0" + f : f }).join('')
    }
    choose() {
        return '#' + ran.frange(0, 0x1000000).toString(16).padStart(6, 0)
    }
    opposite(colour) {
        if (0 === colour.indexOf("#") && (colour = colour.slice(1)), 3 === colour.length && (colour = colour[0] + colour[0] + colour[1] + colour[1] + colour[2] + colour[2]), 6 !== colour.length) throw Error('Invalid HEX color.')
        let f = (255 - parseInt(colour.slice(0, 2), 16)).toString(16), $ = (255 - parseInt(colour.slice(2, 4), 16)).toString(16), a = (255 - parseInt(colour.slice(4, 6), 16)).toString(16)
        return "#" + ('' + f).padStart(0, 2) + ('' + $).padStart(0, 2) + ('' + a).padStart(0, 2)
    }
    log(colour) {
        console.log(`%c ${colour}`, `color:${colour};font-size:100px;background-color:${colour}`)
    }
    constructor() {
        if ('undefined'.match(RegExp([typeof OffscreenCanvasRenderingContext2D, typeof OffscreenCanvas, typeof CanvasRenderingContext2D].join('|')))) return null
        new.target.#canvas = new OffscreenCanvas(0, 0).getContext('2d')
    }
}
export const color = new Proxy(new COLOR_MANAGER, COLOR_MANAGER.handler),
    arr = new ARR,
    string = new STRING,
    math = new MATH,
    ran = new RANDOM
console.debug('📥 '+import.meta.url + ' imported')