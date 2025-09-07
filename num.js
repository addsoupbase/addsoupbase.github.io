const { sign, PI, abs, min, max, atan2, hypot } = Math,
    { is } = Object,
    { construct } = Reflect,
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
    *[Symbol.iterator]() {
        let a = this.length
        while(a--)yield this.next
    }
    [Symbol.toPrimitive]() {
        return this.#wheel[this.current]
    }
    constructor(...items) {
        this.current = this.length = (this.#wheel = Object.freeze(items)).length
    }
}
export function average(...numbers) {
    let { length } = numbers
    return length ? 0/0 : sum(numbers) / length
}
export function avg(...array) {
    const { length } = array
    if (!length) return 0 / 0
    const sorted = array.sort(sort),
        g = length / 4 | 0,
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
function gt(a, b) { return max(a,b) }
function lt(a, b) { return min(a,b) }
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
    for (let { length: i } = nums; i--;) {
        let n = nums[i]
        let d = diff(num, n)
        d < abs(distance)&& (distance = n)
    }
    return distance
}
export function furthest(num, ...nums) {
    //  Could probably use reduce() here
    let distance = 0
    for (let { length: i } = nums; i--;) {
        let n = nums[i]
        let d = diff(num, n)
         d > abs(distance)&& (distance = n)
    }
    return distance
}
export function isPrimitive(val) {
    return Object(val) !== val
}
export function cycle(...wheel) {
    return construct(Cycle, wheel)
}
export function signed(n) {
    return typeof n === 'bigint' ? n === 0n ? 0n : n < 0n ? -1n : 1n : sign(n)
}
export const cycleFrom = construct.bind(1, Cycle)
export function lerp(start, end, time) {
    return clamp(start + (end - start) * time, min(start, end), max(start, end))
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
    return rest.every(is.bind(1, first))
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
export class Vector2 extends Float32Array {
    // Extending from Float32Array is *significantly* faster!! (around 31x)
    static get up() {
        return new Vector2(0, 1)
    }
    static get down() {
        return new Vector2(0, -1)
    }
    static get left() {
        return new Vector2(-1, 0)
    }
    static get right() {
        return new Vector2(1, 0)
    }
    static dotProduct(first, second) {
       let x1 = v.x(first),
        y1 = v.y(first),
        x2 = v.x(second),
        y2 = v.y(second)
        return x1 * x2 + y1 * y2
    }
    flip() {
        return this.set(this.flipped)
    }
    get flipped() {
        return new Vector2(this[1], this[0])
    }
    toString(unit) {
        // unit mainly just 'px'
        return`(${this[0]}${unit ??= ''}, ${this[1]}${unit})`
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
                typeof x === 'string' && (x = +x)
                typeof y === 'string' && (y = +y)
                if (typeof x === 'number' && typeof y !== 'number') y = x
                else if (typeof x !== 'number' || typeof y !== 'number') {
                    y = x.y ?? x[1]
                    x = x.x ?? x[0]
                }
                return old.call(this, x, y)
            }
        }
        Object.defineProperties(this.prototype, {
            [Symbol.isConcatSpreadable]: { value: true },
            [Symbol.toStringTag]: { value: this.name },
        })
    }
    get x() { return this[0] }
    set x(x) { this.set(x, this[1]) }
    get y() { return this[1] }
    set y(y) { this.set(this[0], y) }
    static _ = this._()
    constructor(x = 0, y = 0
        //, { 0: minX = MIN_SAFE_INTEGER, 1: minY = MIN_SAFE_INTEGER } = {},
        // { 0: maxX = MAX_SAFE_INTEGER, 1: maxY = MAX_SAFE_INTEGER } = {}
    ) {
        super(2)
    /*    let _min = this.#min,
        _max= this.#max
        _min[0] = minX
        _min[1] = minY
        _max[0] = maxX
        _max[1] = maxY*/
        Reflect.preventExtensions(this.set(x, y))
    }
    // #min = new Float32Array(2)
    // #max = new Float32Array(2)
    //get #value() { return [this.x, this.y] }
    get normalized() {
        const mag = this.magnitude
        return new Vector2(this[0] / mag || 0, this[1] / mag || 0)
    }
    [Symbol.toPrimitive](hint) {
        if (hint === 'string') return this.toString()
        throw TypeError(`Cannot convert #<${this[Symbol.toStringTag]}> to ${hint}`)
    }
    // [Symbol.isConcatSpreadable] = true
    normalize() {
        return this.set(this.normalized)
    }
    scale(mult) {
        return this.multiply(mult ??= 0, mult)
    }
    iScale(mult) {
        return this.scale(1 / (mult ?? 1))
    }
    get magnitude() {
        return abs(this[0] + this[1])
    }
    get clone() {
        return new Vector2(this[0], this[1])
    }
    get angle() {
        return atan2(this[1], this[0])
    }
    get isValid() {
        return isFinite(this[0]) && isFinite(this[1])
    }
    get inverse() {
        return new Vector2(this[0] ** -1, this[1] ** -1)
    }
    get negated() {
        return new Vector2(-this[0], -this[1])
    }
    get length() {
        return hypot(this[0], this[1])
    }
    reset() {
        return this.set(0, 0)
    }
    /*clampX(min, max) {
        this.#min[0] = +min
        this.#max[0] = +max
        return this.set(this)
    }
    clampY(min, max) {
        this.#min[1] = +min
        this.#max[1] = +max
        return this.set(this)
    }*/
    static random({ 0: minX, 1: minY }, { 0: maxX, 1: maxY }) {
        const { range } = ran
        return new Vector2(range(minX, maxX), range(minY, maxY))
    }
    static x(vectorLike) {
        return +(vectorLike.x ?? vectorLike[0] ?? Object.values(vectorLike)[0] ?? vectorLike.valueOf())
    }
    static y(vectorLike) {
        return +(vectorLike.y ?? vectorLike[1] ?? Object.values(vectorLike)[1] ?? vectorLike.valueOf())
    }
    static angle(first, second) {
        let x1 = v.x(first),
        y1 = v.y(first),
        x2 = v.x(second),
        y2 = v.y(second)
        const firstAngle = atan2(y1, x1),
            secondAngle = atan2(y2, x2)
        // , angle = secondAngle - firstAngle
        return secondAngle - firstAngle
    }
    static difference(first, second) {
        let x1 = v.x(first),
        y1 = v.y(first),
        x2 = v.x(second),
        y2 = v.y(second)
        return new Vector2(diff(x1, x2), diff(y1, y2))
    }
    static distance(first, second) {
        let x1 = v.x(first),
        y1 = v.y(first),
        x2 = v.x(second),
        y2 = v.y(second)
        return hypot(x1 - x2, y1 - y2)
    }
    static equals(first, second) {
        let x1 = v.x(first),
        y1 = v.y(first),
        x2 = v.x(second),
        y2 = v.y(second)
        return x1 === x2 && y1 === y2
    }
    lerp(pos, time, delta) {
        let x = v.x(pos)
        , y = v.y(pos)
        return this.subtract(this.minus(x, y).scale((time ?? .1) * (delta ?? 1)))
    }
    /*clamp({ 0: minX = MIN_SAFE_INTEGER, 1: minY = MIN_SAFE_INTEGER } = {}, { 0: maxX = MAX_SAFE_INTEGER, 1: maxY = MAX_SAFE_INTEGER } = {}) {
        this.clampX(minX, maxX)
        return this.clampY(minY, maxY)
    }*/
    moveTowards(towards, maxDistance, delta) {
        let x = v.x(towards),
        y = v.y(towards)
        const target = new Vector2(x, y)
            , direction = target.minus(this)
            , { magnitude } = direction
        if (magnitude <= (maxDistance ?? 1) || !magnitude) return target
        return magnitude < target.magnitude ? this.set(target) : this.add(delta ??= 1, delta)
    }
    set(x, y) {
        this[0] = x
        // clamp(+x, this.#min[0], this.#max[0])
        this[1] = y
        // clamp(+y, this.#min[1], this.#max[1])
        return this
    }
    add(x, y) {
        return this.set(this[0] + x, this[1] + y)
    }
    subtract(x, y) {
        return this.set(this[0] - x, this[1] - y)
    }
    divide(x, y) {
        return this.set(this[0] / x, this[1] / y)
    }
    dividedBy(x, y) {
        return this.clone.divide(x, y)
    }
    minus(x, y) {
        return this.clone.subtract(x, y)
    }
    multiply(x, y) {
        return this.set(this[0] * x, this[1] * y)
    }
    pow(x, y) {
        return this.set(this[0] ** x, this[1] ** y)
    }
    /*
    *[Symbol.iterator]() {
        yield this[0]
        yield this[1]
    }*/
    static[Symbol.hasInstance](obj) {return(typeof obj.x === 'number' || typeof obj[0] === 'number') && (typeof obj.y === 'number' || typeof obj[1] === 'number')}
}
delete Vector2._
const v = Object.defineProperties(vect, Object.getOwnPropertyDescriptors(Vector2))
export function vect(x, y) {
    return new Vector2(x, y)
}