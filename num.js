const { sign, PI, abs, min, max, atan2, hypot } = Math,
    { is } = Object,
    { isFinite, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER, } = Number
function reduce(a, b) {
    return a + b
}
function sum(arr) {
    return arr.reduce(reduce, -0)
}
sum = Math.sumPrecise ?? sum
function sort(a, b) {
    return a - b
}

// function noConstructor() {
// console.warn("Use this as a factory function instead of the constructor")
// }
export function safe(num) {
    return clamp(num, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)
}
export function safeInt(num) {
    return safe(num) | 0
}
class Cycle {
    #wheel = null
    move(step) {
        this.current += (step | 0) || 1
        let { current, length } = this
        if (current < 0) this.current = length - 1
        else if (current >= length) this.current = 0
        return this.#wheel[this.current % length]
    }
    get next() {
        return this.move(1)
    }
    get prev() {
        return this.move(-1)
    }
    *[Symbol.iterator](){
        let a = this.length
        for(;a--;yield this.next);
    }
    [Symbol.toPrimitive](){
        return this.#wheel[this.current]
    }
    constructor(...items) {
        this.current = this.length = (this.#wheel =Object.freeze(items)).length
    }
}
export function average(...numbers) {
    let { length } = numbers
    if (!length) return NaN
    return sum(numbers)/length
}
export function avg(...array) {
    const {length} = array
    if (!length) return NaN
    const sorted = array.sort(sort),
        g = length/4|0,
         q1 = sorted[g],
        q3 = sorted[3 * g],
        IQR = q3 - q1,
        upperFence = q3 + 1.5 * IQR,
        lowerFence = q1 - 1.5 * IQR,
        filtered = sorted.filter(filter)
    return filtered.reduce(reduce) / filtered.length
    function filter(x) {
        return x >= lowerFence && x <= upperFence
    }
}
export function median(...numbers) {
    let { length } = numbers
        , sorted = numbers.sort(sort),
        middle = length / 2 | 0
    return length % 2 ? sorted[middle] : (sorted[middle] + sorted[middle - 1]) / 2
}
function gt(a, b) { return a>b?a:b }
function lt(a, b) { return a<b?a:b }
export function mode(...numbers) {
    let obj = []
    for (let { length: i } = numbers; i--;) {
        let n = numbers[i]
        obj[n] = (obj[n] | 0) + 1
    }
    return obj.indexOf(obj.reduce(gt))
}
export function range(...numbers) {
    return max.apply(1, numbers) - min.apply(1, numbers)
}
export function factorial(n) {
    return n ? n-- * factorial(n) : n ** (n - n)
}
export function closest(num, ...nums) {
    let distance = 1 / 0
    for (let { length } = nums; length--;) {
        let n = nums[length]
        let d = diff(num, n)
        if (d < abs(distance)) distance = n
    }
    return distance
}
export function furthest(num, ...nums) {
    //  Could probably use reduce() here
    let distance = 0
    for (let { length } = nums; length--;) {
        let n = nums[length]
        let d = diff(num, n)
        if (d > abs(distance)) distance = n
    }
    return distance
}
export function isPrimitive(val) {
    return Object(val)!==val
}
export function cycle(...wheel) {
    // new.target && noConstructor()
    return new Cycle(...wheel)
}
export function signed(n) {
    return typeof n==='bigint'?n===0n?0n:n<0n?-1n:1n:sign(n)
}
export function cycleFrom(arrayLike) {
    // new.target && noConstructor()
    return cycle.apply(1, arrayLike)
}
export function lerp(start, end, time) {
    return clamp(start + (end - start) * time, min(start,end), max(start,end))
}
export function* derp(start, end, time) {
    while (start < end) yield start = lerp(start, end, time)
    return end
}
export function clamp(val, MIN, MAX) {
    return min(MAX, max(MIN, val))
}
export function diff(a, b) {
    return abs(sort(a, b))
}
export function toDeg(rad) {
    return rad * 180 / PI
}
export function toRad(deg) {
    return deg * PI / 180
}
export function compare(first, ...rest) {
    return rest.every(n)
    function n(o) { return is(o, first) }
}
export const sanitize = isFinite
export function isWithinRange(val, floor, ceiling) {
    return clamp(val, floor, ceiling) === val
}
export function sqrt(num) {
    const SIGN = sign(num),
        absolute = abs(num)
    return absolute ** .5 * SIGN
}
export function minBigInt(...BigInts) {
    return BigInts.reduce(lt)
}
export function maxBigInt(...BigInts) {
    return BigInts.reduce(gt)
}
export class Vector2 {
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
    static dotProduct(first, second) {
        let { 0: x1, 1: y1 } = first
        let { 0: x2, 1: y2 } = second
        x1 ??= first.x
        y1 ??= first.y
        x2 ??= second.x
        y2 ??= second.y
        return x1 * x2 + y1 * y2
    }
    flip() {
        return this.set(this.flipped)
    }
    get flipped() {
        return v(this.#y, this.#x)
    }
    toString(unit) {
        return `(${this.#x}${unit??=''}, ${this.#y}${unit})`
    }
    static _() {
        // Older browsers cant have static init blocks
        delete this._
        let props = Object.getOwnPropertyDescriptors(this.prototype)
        for (let i in props) {
            let { [i]: p } = props
            if ('get' in p || 'set' in p || p.value?.length !== 2) continue
            let { value: old } = p
            delete this.prototype[i]
            Object.defineProperty(this.prototype, i, {
                value: makeItANumber
            })
            function makeItANumber(x, y) {
                if (typeof x === 'number' && typeof y !== 'number') y = x
                else if (typeof x !== 'number' || typeof y !== 'number') {
                    y = x.y ?? x[1]
                    x = x.x ?? x[0]
                }

                return old.call(this, x, y)
            }
        }
        Object.defineProperties(this.prototype, {
            [Symbol.toStringTag]: { value: this.name },
            x: { get() { return this.#x }, set(x) { this.set(x, this.#y) }, enumerable: 1 }, y: { get() { return this.#y }, set(y) { this.set(this.#x, y) }, enumerable: 1 }
        })
    }
    static _ = this._()
    constructor(x = 0, y = 0,
        { 0: minX = MIN_SAFE_INTEGER, 1: minY = MIN_SAFE_INTEGER } = {},
        { 0: maxX = MAX_SAFE_INTEGER, 1: maxY = MAX_SAFE_INTEGER } = {}) {
        Object.freeze(this)
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
        if (hint === 'string') return this.toString()
        throw TypeError(`Cannot convert #<${this[Symbol.toStringTag]}> to ${hint}`)
    }
    normalize() {
        return this.set(this.normalized)
    }
    scale(mult) {
        return this.multiply(mult??=0, mult)
    }
    iScale(mult) {
        return this.scale(1 / (mult??1))
    }
    get magnitude() {
        return abs(this.#x + this.#y)
    }
    get clone() {
        return v(this.#x, this.#y)
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
    reset() {
        return this.set(0, 0)
    }
    clampX(min, max) {
        this.#min.x = +min
        this.#max.x = +max
        return this.set(this)
    }
    clampY(min, max) {
        this.#min.y = +min
        this.#max.y = +max
        return this.set(this)
    }
    static random({ 0: minX, 1: minY }, { 0: maxX, 1: maxY }) {
        const { range } = ran
        return v(range(minX, maxX), range(minY, maxY))
    }
    static x(vectorLike) {
        return +(vectorLike.x ?? vectorLike[0] ?? Object.values(vectorLike)[0] ?? vectorLike)
    }
    static y(vectorLike) {
        return +(vectorLike.y ?? vectorLike[1] ?? Object.values(vectorLike)[1] ?? vectorLike)
    }
    static angle(first, second) {
        let { 0: x1, 1: y1 } = first
            , { 0: x2, 1: y2 } = second
        x1 ??= first.x
        y1 ??= first.y
        x2 ??= second.x
        y2 ??= second.y
        const firstAngle = atan2(y1, x1),
            secondAngle = atan2(y2, x2)
            // , angle = secondAngle - firstAngle
        return secondAngle - firstAngle
    }
    static difference(first, second) {
        let { 0: x1, 1: y1 } = first
        let { 0: x2, 1: y2 } = second
        x1 ??= first.x
        y1 ??= first.y
        x2 ??= second.x
        y2 ??= second.y
        return v(diff(x1, x2), diff(y1, y2))
    }
    static distance(first, second) {
        let { 0: x1, 1: y1 } = first
        let { 0: x2, 1: y2 } = second
        x1 ??= first.x
        y1 ??= first.y
        x2 ??= second.x
        y2 ??= second.y
        return hypot(x1 - x2, y1 - y2)
    }
    static equals(first, second) {
        let { 0: x1, 1: y1 } = first
        let { 0: x2, 1: y2 } = second
        x1 ??= first.x
        y1 ??= first.y
        x2 ??= second.x
        y2 ??= second.y
        return x1 === x2 && y1 === y2
    }
    lerp(pos, time, delta) {
        let { 0: x = 0, 1: y = 0 } = pos
        x ??= pos.x
        y ??= pos.y
        return this.subtract(this.minus(x, y).scale((time??.1) * (delta??1)))
    }
    clamp({ 0: minX = MIN_SAFE_INTEGER, 1: minY = MIN_SAFE_INTEGER } = {}, { 0: maxX = MAX_SAFE_INTEGER, 1: maxY = MAX_SAFE_INTEGER } = {}) {
        this.clampX(minX, maxX)
        return this.clampY(minY, maxY)
    }
    moveTowards(towards, maxDistance, delta) {
        let { 0: x, 1: y } = towards
        x ??= towards.x
        y ??= towards.y
        const target = vect(x, y)
            , direction = target.minus(this)
            , { magnitude } = direction
        if (magnitude <= (maxDistance??1) || !magnitude) return target
        return magnitude < step.magnitude ? this.set(target) : this.add(delta??=1, delta)
    }
    set(x, y) {
        this.#x = clamp(+x, this.#min.x, this.#max.x)
        this.#y = clamp(+y, this.#min.y, this.#max.y)
        return this
    }
    add(x, y) {
        return this.set(this.#x + x, this.#y + y)
    }
    subtract(x, y) {
        return this.set(this.#x - x, this.#y - y)
    }
    divide(x, y) {
        return this.set(this.#x / x, this.#y / y)
    }
    dividedBy(x, y) {
        return this.clone.divide(x, y)
    }
    minus(x, y) {
        return this.clone.subtract(x, y)
    }
    multiply(x, y) {
        return this.set(this.#x * x, this.#y * y)
    }
    pow(x, y) {
        return this.set(this.#x ** x, this.#y ** y)
    }
    *[Symbol.iterator]() {
        yield this.#x
        yield this.#y
    }
}
delete Vector2._
const v = Object.defineProperty(Object.defineProperties(vect, Object.getOwnPropertyDescriptors(Vector2)), Symbol.hasInstance, {
    value(obj) {
        try {
        let x,y,
            iterator = obj[Symbol.iterator]?.(),
            {0: xx, 1:yy} = Object.values(obj)
        return (typeof obj.x === 'number' || typeof obj[0] === 'number' || typeof xx === 'number' || typeof([x] = iterator) === 'number') &&
            (typeof obj.y === 'number' || typeof obj[1] === 'number' || typeof yy === 'number' || typeof([y] = iterator) === 'number')
        }
        catch {
            return false
        }
    }
})
export function vect(x, y) {
    // new.target && noConstructor()
    return new Vector2(x, y)
}