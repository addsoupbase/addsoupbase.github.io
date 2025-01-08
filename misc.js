const { floor, random, min, max, sign, PI, abs, atan2, hypot, round } = Math,
    { is, values } = Object,
    { from } = Array,
    { isInteger, isFinite, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER } = Number,
    { fromCodePoint } = String
class RANDOM {
    get coin() {
        return this.chance(50)
    }
    get invert() {
        return this.choose(1, -1)
    }
    choose(...deck) {
        return deck[floor(random() * deck.length)]
    }
    jackpot(range) {
        return!this.frange(0, range)
    }
    chance(odds) {
        return this.jackpot(100 / odds)
    }
    range(MIN, MAX) {
        return random() * (MAX - MIN) + MIN
    }
    frange(MIN, MAX) {
        return floor(this.range(MIN, MAX))
    }
    get ran() {
        return random()
    }
    get pseudo() {
        return performance.now() % 1e3 / 1e3
    }
    get pseudo2() {
        return Date.now() % 1e3 / 1e3
    }
    get crypto() {
        return crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff
    }
    shuffle(...item) {
        for (let i = 0, { length } = item; i < length; ++i) {
            const pick = floor(random() * (i + 1));
            [item[i], item[pick]] = [item[pick], item[i]]
        }
        return item
    }
    gen(length = 6) {
        return from({ length }, this.#gen).join('')
    }
    #gen() {
        return fromCodePoint(floor(random() * 0x110000))
    }
    randomizer(charCount = 6) {
        return new Proxy({ charCount }, { get: this.#randomizer })
    }
    #randomizer(target, prop) {
        return target[prop] ??= this.gen(target.charCount)
    }
}
class MATH {
   /* isInt(num) {
        return isInteger(num)
    }*/
    maxBigInt(bigInt, ...bigInts) {
        if (bigInt == null) throw TypeError('More arguments needed')
        let maximum = bigInt
        for (let { length } = bigInts; length--;) {
            const num = bigInts[length]
            if (typeof num !== typeof bigInt) throw TypeError("Cannot mix types")
            if (num > maximum) maximum = num
        }
        return maximum
    }
    minBigInt(bigInt, ...bigInts) {
        if (bigInt == null) throw TypeError('More arguments needed')
        let minimum = bigInt
        for (let { length } = bigInts; length--;) {
            const num = bigInts[length]
            if (typeof num !== typeof bigInt) throw TypeError("Cannot mix types")
            if (num < minimum) minimum = num
        }
        return minimum
    }
    sqrt(num) {
        const SIGN = sign(num),
            absolute = abs(num)
        return absolute ** .5 * SIGN
    }
    isWithinRange(val, floor, ceiling) {
        return this.clamp(val, floor, ceiling) === val
    }
    sanitize(num) {
        return num === +num && num != null && isFinite(num)
    }
    compare(first, ...rest) {
        return rest.every(n)
        function n(o) { return is(o, first) }
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
        #wheel = null
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
    placeholder = '$'
    formatNumber(num) {
        return (+num).toLocaleString()
    }
    upper(string) {
        return string[0].toUpperCase() + string.slice(1)
    }
    replace(string, ...subs) {
        let allMatches = string.match(RegExp('\\' + this.placeholder, 'g'))
        if (subs.length !== allMatches?.length) throw RangeError("Invalid input")
        let newstring = string
        subs.forEach(char => { newstring = newstring.replace(this.placeholder, char) })
        return newstring
    }
    formatWord(str) {
        return /[aeiou]/i.test(str[0]) ? 'an ' + str : 'a ' + str
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
        const lastTwoDigits = o % 100, me = (o + "").at(-1)
        if ((lastTwoDigits >= 11 && lastTwoDigits <= 13) || !this.#map.has(me))
            return o + "th"
        return o + this.#map.get(me)
    }
}
class ARR {
    assemble(arrayLike, ...sequence) {
        const out = []
        for (let { length } = sequence, i = 0; i < length; ++i) out.push(arrayLike.at(sequence[i]))
        return out
    }
    with(length, filler) {
        return typeof filler === 'function'? 
        from({ length }, filler): 
        Array(length).fill(filler)
    }
    *backwards(arrayLike) {
        for (let { length } = arrayLike; length--;) yield arrayLike[length]
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
        const slot = item.indexOf(firstIndex),
            slot2 = item.indexOf(secondIndex)
        if (slot !== -1 && slot2 !== -1) return item.swap(slot, slot2)
        throw RangeError("Index out of range")
    }
}
class Vector2 {
    get [Symbol.toStringTag]() { return 'Vector2' }
    static get up() {
        return v(0, 1)
    }
    static get down() {
        return v(0, -1)
    }
    static get left() {
        return v(-1, 0)
    }
    static get right() {
        return v(1, 0)
    }
    static dotProduct([x1, y1], [x2, y2]) {
        return x1 * x2 + y1 * y2
    }
    flip() {
        return this.set(this.flipped)
    }
    get flipped() {
        return v(this.#y, this.#x)
    }
    toString(unit = '') { return '(' + this.#x + unit + ', ' + this.#y + unit + ')' }
    constructor(x = 0, y = 0,
        [minX = MIN_SAFE_INTEGER, minY = MIN_SAFE_INTEGER] = [],
        [maxX = MAX_SAFE_INTEGER, maxY = MAX_SAFE_INTEGER] = []) {
        Object.defineProperties(this, { x: { get() { return this.#x }, set(x) { this.set(x, this.#y) }, enumerable: 1 }, y: { get() { return this.#y }, set(y) { this.set(this.#x, y) }, enumerable: 1 } })
        Object.seal(this)
        this.#min = { x: minX, y: minY }
        this.#max = { x: maxX, y: maxY }
        this.set(x, y)
    }
    #min
    #max
    #x = NaN
    #y = NaN
    //get #value() { return [this.x, this.y] }
    get 0() { return this.#x }
    set 0(x) { this.x = x }
    get 1() { return this.#y }
    set 1(y) { this.y = y }
    get normalized() {
        const mag = this.magnitude
        return v(this.#x / mag || 0, this.#y / mag || 0)
    }
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') throw TypeError("Cannot convert Vector2 to number")
        return this.toString()
    }
    normalize() {
        return this.set(this.normalized)
    }
    scale(mult = 0) {
        return this.multiply(mult, mult)
    }
    get magnitude() {
        return abs(this.#x + this.#y)
    }
    get clone() {
        return v(...this)
    }
    get angle() {
        return atan2(this.#y, this.#x)
    }
    get isValid() {
        const { x, y } = this
        return x === +x && y === +y
    }
    get inverse() {
        const { x, y } = this
        return v(x ** -1, y ** -1)
    }
    get negated() {
        const { x, y } = this
        return v(-x, -y)
    }
    get length() {
        return hypot(this.#x, this.#y)
    }
    nullify() {
        return this.scale(0)
    }
    clampX(min, max) {
        if (min instanceof v && max == null)
            [min, max] = min
        this.#min.x = +min
        this.#max.x = +max
        return this.set(this)
    }
    clampY(min, max) {
        if (min instanceof v && max == null)
            [min, max] = min
        this.#min.y = +min
        this.#max.y = +max
        return this.set(this)
    }
    static random([minX, minY], [maxX, maxY]) {
        const { range } = ran
        return v(range(minX, maxX), range(minY, maxY))
    }
    static x(vectorLike) {
        return +(vectorLike.x ?? vectorLike[0] ?? values(vectorLike)[0] ?? vectorLike)
    }
    static y(vectorLike) {
        return +(vectorLike.y ?? vectorLike[1] ?? values(vectorLike)[1] ?? vectorLike)
    }
    static angle([x1, y1], [x2, y2]) {
        const firstAngle = atan2(y1, x1),
            secondAngle = atan2(y2, x2),
            angle = secondAngle - firstAngle
        return angle
    }
    static difference([x1, y1], [x2, y2]) {
        const { diff } = math
        return v(diff(x1, x2), diff(y1, y2))
    }
    static distance([x1, y1], [x2, y2]) {
        return hypot(x1 - x2, y1 - y2)
    }
    static equals([x1, y1], [x2, y2]) {
        return (x1 === x2) && (y1 === y2)
    }
    lerp([x = y, y = x], time = 0.1, delta = 1) {
        return this.subtract((this.minus(x, y)).scale(time * delta))
    }
    clamp([minX = MIN_SAFE_INTEGER, minY = MIN_SAFE_INTEGER] = [], [maxX = MAX_SAFE_INTEGER, maxY = MAX_SAFE_INTEGER] = []) {
        this.clampX(minX, maxX)
        return this.clampY(minY, maxY)
    }
    moveTowards([x, y], maxDistance = 1, delta = 1) {
        const target = vect(x, y)
            , direction = target.minus(this)
            , magnitude = direction.magnitude
        if (magnitude <= maxDistance || !magnitude) return target
        return magnitude < step.magnitude ? this.set(target) : this.add(step)
    }
    set(x, y) {
        if (x instanceof v && y == null)
            [x, y] = x
        const { clamp } = math
        this.#x = clamp(+x, this.#min.x, this.#max.x)
        this.#y = clamp(+y, this.#min.y, this.#max.y)
        return this
    }
    add(x, y) {
        if (x instanceof v && y == null)
            [x, y] = x
        return this.set(this.#x + x, this.#y + y)
    }
    subtract(x, y) {
        if (x instanceof v && y == null)
            [x, y] = x
        return this.set(this.#x - x, this.#y - y)
    }
    divide(x, y) {
        if (x instanceof v && y == null)
            [x, y] = x
        return this.set(this.#x / x, this.#y / y)
    }
    dividedBy(x, y) {
        return this.clone.divide(x, y)
    }
    minus(x, y) {
        if (x instanceof v && y == null)
            [x, y] = x
        return this.clone.subtract(x, y)
    }
    multiply(x, y) {
        if (x instanceof v && y == null)
            [x, y] = x
        return this.set(this.#x * x, this.#y * y)
    }
    pow(x, y) {
        if (x instanceof v && y == null)
            [x, y] = x
        return this.set(this.#x ** x, this.#y ** y)
    }
    *[Symbol.iterator]() {
        yield this.#x
        yield this.#y
    }
}
export const vect = new Proxy(Vector2, {
    apply(target, useless, args) { return new target(...args) }
})
const v = vect
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
        return '#' + ran.frange(0, 0x1000000).toString(16).padStart(6, 0)
    }
    opposite(colour) {
        if (0 === colour.indexOf("#") && (colour = colour.slice(1)), 3 === colour.length && (colour = colour[0] + colour[0] + colour[1] + colour[1] + colour[2] + colour[2]), 6 !== colour.length) throw TypeError('Invalid HEX color.')
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
console.debug('📥 ' + import.meta.url + ' imported')