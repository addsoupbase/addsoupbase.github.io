const {sign, PI, abs,min,max,atan2,hypot} = Math,
    {is} = Object,
    {isFinite,MIN_SAFE_INTEGER, MAX_SAFE_INTEGER,} = Number
class MATH {
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
        return new this.#cycle(wheel)
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
    #cycle = class {
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
let math = new MATH
export default math
class Vector2 {
    get [Symbol.toStringTag]() { return this.constructor.name }
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
    toString(unit = '') { 
    return`(${this.#x}${unit}, ${this.#y}${unit})` 
    }
   
    static {
        Object.defineProperties(this.prototype, { x: { get() { return this.#x }, set(x) { this.set(x, this.#y) }, enumerable: 1 }, y: { get() { return this.#y }, set(y) { this.set(this.#x, y) }, enumerable: 1 } })
    }
    constructor(x = 0, y = 0,
        [minX = MIN_SAFE_INTEGER, minY = MIN_SAFE_INTEGER] = [],
        [maxX = MAX_SAFE_INTEGER, maxY = MAX_SAFE_INTEGER] = []) {
        Object.preventExtensions(Object.seal(this))
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
        if (hint === 'number') throw TypeError(`Cannot convert ${this[Symbol.toStringTag]} to number`)
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
  /*  static x(vectorLike) {
        return +(vectorLike.x ?? vectorLike[0] ?? values(vectorLike)[0] ?? vectorLike)
    }
    static y(vectorLike) {
        return +(vectorLike.y ?? vectorLike[1] ?? values(vectorLike)[1] ?? vectorLike)
    }*/
    static angle([x1, y1], [x2, y2]) {
        const firstAngle = atan2(y1, x1),
            secondAngle = atan2(y2, x2),
            angle = secondAngle - firstAngle
        return angle
    }
    static difference([x1, y1], [x2, y2]) {
        return v(abs(x1-x2), abs(y1-y2))
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
    apply(target, x, args) { return Reflect.construct(target,args,target) }
})
const v = vect