let cache = new WeakMap
let proxySymbol = Symbol.for('[[Proxy]]')
export class Handler {
    #base
    get symbol() {
        return this.#base
    }
    get(t, prop, r = t) {
        let symbol = this.#base
        let base
        let out
        if (prop in t) {
            out = Reflect.get(t, prop, r)
        }
        else if (base = t[symbol]) out = base[prop]
        return typeof out === 'function' ? cacheBoundProxy(out) : out
    }
    set(t, prop, value, r = t) {
        let $ = this.#base
        if (prop in t) Reflect.set(t, prop, value, r)
        let base = t[$]
        if (prop in base) return Reflect.set(base, prop, value)
        if (t[$]) return Reflect.set(t, prop, value, r)
        throw TypeError(`Cannot implicitly create property '${String(prop)}'`)
    }
    /*has(t, prop) {
        return prop in t || prop in t[this.#base]
    }*/
    getPrototypeOf(t) {
        return t[this.#base]
    }
    setPrototypeOf(t, prototype) {
        t[this.#base] = prototype
        return true
    }
    apply(t, thisArg, args) {
        switch (args.length) {
            case 0: return t.call(thisArg)
            case 1: return t.call(thisArg, args[0])
            case 2: return t.call(thisArg, args[0], args[1])
            case 3: return t.call(thisArg, args[0], args[1], args[2])
            default: return t.apply(thisArg, args)
        }
    }
    construct(t, args, newTarget) {
        if (typeof newTarget !== 'function') switch (args.length) {
            case 0: return new t
            case 1: return new t(args[0])
            case 2: return new t(args[0], args[1])
            case 3: return new t(args[0], args[1], args[2])
            default: return Reflect.construct(t, args, newTarget)
        }
        return Reflect.construct(t, args)
    }
    constructor(symbol = $) {
        this.#base = symbol
    }
}

export function cacheBoundProxy(func) {
    let f = func[original]
    // if (typeof base !== 'symbol' && typeof base !== 'string') throw TypeError('Base must be symbol-keyed')
    do if (cache.has(f)) return cache.get(f)
    while (f = func[original])
    let o = {
        [func.name](...args) {
            let thisArg = this
            if (thisArg[func.name] !== func) func = (thisArg = thisArg[$])[func.name] ?? func
            switch (args.length) {
                case 0: return func.call(thisArg)
                case 1: return func.call(thisArg, args[0])
                case 2: return func.call(thisArg, args[0], args[1])
                case 3: return func.call(thisArg, args[0], args[1], args[2])
                default: return Reflect.apply(func, thisArg, args)
            }
        }
    }[func.name]
    o[original] = func[original] = func
    cache.set(func, o)
    return o
}
let original = Symbol('[[TargetFunction]]')
// let nested = Symbol('[[isNested]]')
export const $ = Symbol('[[Target]]')
export function ProxyProtoGenerator(myClass, wraps = Object, { handler = new Handler($) } = {}) {
    let cache = new WeakMap
    let { prototype } = myClass ??= Object
    let descriptors = prototype && Object.getOwnPropertyDescriptors(prototype)
    if (descriptors && descriptors.constructor) {
        descriptors.constructor.value = myClass
    }
    ProxyMaker.prototype = prototype
    wraps !== Object && classify(wraps, ProxyMaker, proxySymbol)
    let Super = function (target) {
        let obj = Object.create(myClass.prototype)
        return obj
    }

    return ProxyMaker
    function ProxyMaker(target) {
        let t = getBase(target)
        let a = t[proxySymbol]
        if (a && a !== wraps) {
            if (a.prototype instanceof wraps)
                return proxify(t, proxySymbol)
        }
        if (cache.has(t)) {
            return cache.get(t)
        }
        //for (let n of Reflect.ownKeys(base)) if (n in target) console.warn(`Overwrite of property ${String(n)} on ${target.constructor.name}`)
        var wrapperObj = Super(target)
        Object.defineProperty(wrapperObj, Symbol.toStringTag, { value: `Proxy.for(${wraps.name})` })
        wrapperObj[$] = target
        // if (Object.hasOwn(target, $)) wrapperObj[nested] = true
        descriptors && Object.defineProperties(wrapperObj, descriptors)
        let out = new Proxy(wrapperObj, handler)
        cache.set(t, out)
        return out
    }
}
export default ProxyProtoGenerator
let proxyTypes = new Map
export function proxify(target) {
    let a = target[proxySymbol]
    return proxyTypes.get(a)?.(target) || target
}
function getBase(proxy) {
    while (Object.hasOwn(proxy, $))
        proxy = proxy[$]
    return proxy
}
export function classify(Class, proxyMaker) {
    Class.prototype[proxySymbol] = Class
    proxyTypes.set(Class, proxyMaker)
}
export function raw(target) {
    return target.valueOf()
}
