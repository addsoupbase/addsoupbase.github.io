let FunctionCache = new WeakMap
// For now [[Target]] = the object which you want to wrap
const OriginalFunction = Symbol('[[TargetFunction]]') // The function that gets wrapped
const Extends = Symbol('[[Extends]]') // is this already a proxy?
const TargetInterface = Symbol('[[TargetInterface]]') // the interface that [[Target]] implements (doesn't HAVE to be an interface)
export const WrapperTarget = Symbol('[[WrapperTarget]]') // the Wrapper's reference to [[Target]]
export const OriginalObject = Symbol('[[Target]]') // [[Target]] itself
// Structure is:
// Proxy -> Wrapper -> [[Target]]
export class Base {
    // first create a base class 
    get [Extends]() {
        // left at here: Wrapper object isnt being proxied
        return Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor !== Base
    }
    constructor(target) {
        this[WrapperTarget] = target
    }
}
export class Handler {
    get target() { return this.#base }
    #base
    get(Wrapper, prop, receiver = Wrapper) {
        if (prop === OriginalObject) return Wrapper[WrapperTarget]
        let out
        let wrapperObjectTarget = Wrapper[WrapperTarget]
        if (prop === Extends) return Wrapper[Extends]
        if (prop in Wrapper) { out = Reflect.get(Wrapper, prop, receiver) }
        else if (wrapperObjectTarget) out = Reflect.get(wrapperObjectTarget, prop, wrapperObjectTarget)
        return typeof out === 'function' ? cacheBoundProxy(out) : out
    }
    set(Wrapper, prop, value, receiver = Wrapper) {
        if (prop === Extends) return Wrapper[prop] = true
        let myTarget = this.#base
        if (prop in Wrapper) Reflect.set(Wrapper, prop, value, receiver)
        let base = Wrapper[myTarget]
        if (base && prop in base) return Reflect.set(base, prop, value)
        let wrapperObjectTarget = Wrapper[WrapperTarget]
        if (wrapperObjectTarget) return Reflect.set(wrapperObjectTarget, prop, value, wrapperObjectTarget)
        throw TypeError(`Cannot implicitly create property '${String(prop)}'`)
    }
    /*has(t, prop) {
        return prop in t || prop in t[this.#base]
    }*/
    /*getPrototypeOf(Wrapper) {
        return Wrapper[this.#base]
    }
    setPrototypeOf(Wrapper, prototype) {
        Wrapper[this.#base] = prototype
        return true
    }*/
    apply(func, thisArg, args) {
        switch (args.length) {
            case 0: return func.call(thisArg)
            case 1: return func.call(thisArg, args[0])
            case 2: return func.call(thisArg, args[0], args[1])
            case 3: return func.call(thisArg, args[0], args[1], args[2])
        }
        return func.apply(thisArg, args)
    }
    construct(constructor, args, newTarget) {
        if (typeof newTarget !== 'function') switch (args.length) {
            case 0: return new constructor
            case 1: return new constructor(args[0])
            case 2: return new constructor(args[0], args[1])
            case 3: return new constructor(args[0], args[1], args[2])
            default: return new constructor(...args)
        }
        return Reflect.construct(constructor, args, newTarget)
    }
    constructor(symbol = OriginalObject) {
        console.assert(typeof symbol === 'symbol', 'Wrong argument', symbol)
        this.#base = symbol
    }
}

export function cacheBoundProxy(MyFunc) {
    let Original = MyFunc[OriginalFunction]
    // if (typeof base !== 'symbol' && typeof base !== 'string') throw TypeError('Base must be symbol-keyed')
    do if (FunctionCache.has(Original)) return FunctionCache.get(Original)
    while (Original = MyFunc[OriginalFunction])
    let o = {
        [MyFunc.name](...args) {
            let thisArg = this
            let base = getTarget(thisArg)
            if (thisArg[MyFunc.name] !== MyFunc) MyFunc = (thisArg = base || thisArg)[MyFunc.name] ?? MyFunc
            switch (args.length) {
                case 0: return MyFunc.call(thisArg)
                case 1: return MyFunc.call(thisArg, args[0])
                case 2: return MyFunc.call(thisArg, args[0], args[1])
                case 3: return MyFunc.call(thisArg, args[0], args[1], args[2])
            }
            return Reflect.apply(MyFunc, thisArg, args)
        }
    }[MyFunc.name]
    o[OriginalFunction] = MyFunc[OriginalFunction] = MyFunc
    FunctionCache.set(MyFunc, o)
    return o
}
export function ProxyProtoGenerator(myClass, Interface = Object, { handler = new Handler(OriginalObject) } = {}) {
    let cache = new WeakMap // Memoize
    let { prototype } = myClass ??= Object
    let descriptors = prototype && Object.getOwnPropertyDescriptors(prototype)
    if (descriptors && descriptors.constructor) {
        descriptors.constructor.value = myClass
    }
    Out.prototype = myClass.prototype
    function Out(Target) {
        if (cache.has(Target)) return cache.get(Target)
        if (!(new.target)) return new Out(Target)
        let YourInterface = Target[TargetInterface]
        let upgrade = Interfaces.get(YourInterface)
        let out
        if (upgrade.prototype instanceof myClass && new.target !== Out) {
            out = Reflect.construct(myClass, [Target], upgrade)
        }
        else {
            // ONLY put the proxy if this is the end of the inheritance chain,
            // to prevent a proxy of a proxy
            out = new Proxy(new myClass(Target), handler)
        }
        cache.set(Target, out)
        return out
    }
    Interface !== Object && classify(Interface, Out, myClass)
    return Out
}
export default ProxyProtoGenerator
let Interfaces = new Map
export function proxify(target) {
    let Interface = target[TargetInterface]
    let myProxy = Interfaces.get(Interface)
    if (myProxy) return myProxy(target)
    throw TypeError(`Can't proxy a ${target[Symbol.toStringTag]}`)
}
function getTarget(TargetOrWrapper) {
    return TargetOrWrapper[OriginalObject]
}
export function classify(Interface, ProxyMaker, myClass) {
    // Recognize that objects of this interface will be for this proxy
    let prototype = Object.getPrototypeOf(Interface.prototype)
    let already = prototype[TargetInterface]
    console.log(`Setting up ${Interface.name}${already ? ` from existing ${prototype[Symbol.toStringTag]}`:''}`)
    Interface.prototype[TargetInterface] = Interface
    Interfaces.set(Interface, ProxyMaker)
}
export function raw(target) {
    return target.valueOf()
}
export function getProxyConstructor(target) {
    return Interfaces.get(target[TargetInterface])
}