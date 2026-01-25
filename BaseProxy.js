// For now [[Target]] = the object which you want to wrap
const TargetInterface = Symbol('[[TargetInterface]]') // the interface that [[Target]] implements (doesn't HAVE to be an interface)
//@devconst InterfaceWrapping = Symbol('[[CurrentInterface]]')
const Cache = Symbol('[[Cache]]')
let { apply } = Reflect
const Destroyers = new WeakMap
class SpecialProxy extends function MakeProxy(target, handler) {
    let { proxy, revoke } = Proxy.revocable(target, handler)
    Destroyers.set(proxy, revoke)
    return proxy
    } {
    #wrapper
    #handler
    #cstr
    //@dev#target
    #destroy() {
        let wrapper = this.#wrapper
        if (this.#wrapper) {
            targets.delete(this, wrapper)
            this.#cstr[Cache].delete(getTarget(wrapper))
            Destroyers.get(this)()
            Destroyers.delete(this)
            //@devthis.#target =
            this.#wrapper = this.#handler = null
        }
        else throw ReferenceError('Proxy revoked twice')
    }
    static destroy(t) {
        t.#destroy()
    }
    static isProxy(t) {
        return #wrapper in t
    }
    static getHandler(t) {
        return t.#handler
    }
    static getWrapper(t) {
        return t.#wrapper
    }
    constructor(a, b) {
        super(a, b)
        this.#wrapper = a
        this.#handler = b
        //@devthis.#target = arguments[2]
        this.#cstr = a.constructor
    }
}
const targets = new WeakMap
/* 
proxy does not allow lying about non-writable non-configurable props
and so it throws which is easier for me
*/
function readonly(target, prop, value) {
    Reflect.defineProperty(target, prop, { value })
    return target
}
// Structure is:
// Proxy -> Wrapper -> [[Target]]
export class Handler {
    has(Wrapper, p) {
        return p in Wrapper || p in targets.get(Wrapper)
    }
    get(Wrapper, prop) {
        let target = targets.get(Wrapper)
        let toGet = target, out
        let receiver = toGet
        if (prop in Wrapper) {
            toGet = receiver = Wrapper
            if (prop in target) receiver = target
        }
        out = Reflect.get(toGet, prop, target, receiver)
        return typeof out === 'function' ? cacheFunction(out) : out
    }
    set(Wrapper, prop, value) {
        let Target = Wrapper, Receiver = Target
        if (prop in Wrapper) Receiver = targets.get(Wrapper)
        else Target = Receiver = targets.get(Wrapper)
        return Reflect.set(Target, prop, value, Receiver)
    }
    apply(func, thisArg, args) {
        if (thisArg === void 0) switch (args.length) {
            case 0: return func()
            case 1: return func(args[0])
            case 2: return func(args[0], args[1])
            case 3: return func(args[0], args[1], args[2])
        }
        switch (args.length) {
            case 0: return func.call(thisArg)
            case 1: return func.call(thisArg, args[0])
            case 2: return func.call(thisArg, args[0], args[1])
            case 3: return func.call(thisArg, args[0], args[1], args[2])
        }
        return apply(func, thisArg, args)
    }
    construct(constructor, args, newTarget) {
        if (!newTarget || newTarget === constructor) switch (args.length) {
            case 0: return new constructor
            case 1: return new constructor(args[0])
            case 2: return new constructor(args[0], args[1])
            case 3: return new constructor(args[0], args[1], args[2])
            default: return new constructor(...args)
        }
        return Reflect.construct(constructor, args, newTarget)
    }
}
let FunctionCache = new WeakMap
export function cacheFunction(MyFunc) {
    if (typeof MyFunc.prototype === 'object') return MyFunc // it's a class
    if (FunctionCache.has(MyFunc)) return FunctionCache.get(MyFunc)
    var o = {
        [o = MyFunc.name](...args) {
            const thisArg = getTarget(SpecialProxy.getWrapper(this))
            switch (args.length) {
                case 0: return MyFunc.call(thisArg)
                case 1: return MyFunc.call(thisArg, args[0])
                case 2: return MyFunc.call(thisArg, args[0], args[1])
                case 3: return MyFunc.call(thisArg, args[0], args[1], args[2])
            }
            return apply(MyFunc, thisArg, args)
        }
    }[o]
    FunctionCache.set(MyFunc, o)
    return o
}
function label(t) { return t[Symbol.toStringTag] }
const defaultHandler = new Handler
export function ProxyFactory(myClass, Interface = globalThis[myClass.name.replace(/\$$/, '')] ?? Object, handler = defaultHandler) {
    let cache = new WeakMap // Memoize
    readonly(Generator, 'prototype', myClass.prototype)
    readonly(myClass, Cache, cache)
    function Generator(Target) {
        //@dev console.assert(Interface.prototype.isPrototypeOf(Target), `Expected a #<${Interface.name}>, instead got a #<${label(Target)}>`, Target)
        if (cache.has(Target)) return cache.get(Target)
        if (new.target && new.target !== Generator) var out = Reflect.construct(myClass, [Target], new.target)
        // There is an upgrade available!
        else {
            // initial call is executed (once) in this block
            // ONLY put the proxy if this is the end of the inheritance chain,
            // to prevent a proxy of a proxy
            //@devfor(let key of Reflect.ownKeys(myClass.prototype))key !== 'constructor'&&key in Interface.prototype&&!Object.getOwnPropertyDescriptor(myClass.prototype,key).get&&console.warn(`Overwrite ${String(key)} on ${myClass.name}`) 
            let instance = new myClass(Target)
            targets.set(instance, Target)
            let proxy = new SpecialProxy(instance, handler, Target)
            cache.set(Target, out = proxy)
            //@devif (proxify(Target) !== proxify(Target)) throw ReferenceError('Proxy identity check failed')
        }
        return out
    }
    if (Interface !== Object) {
        //@devreadonly(myClass, InterfaceWrapping, Interface)
        classify(Interface, Generator)
    }
    return Generator
}
let Interfaces = new Map
export default proxify
export function proxify(any) {
    let Interface = any[TargetInterface]
    let Generator = Interfaces.get(Interface)
    return Generator ? Generator(any) : any
    // throw TypeError(`Cannot proxy a #<${getLabel(target)}>`)
}
Object.defineProperties(proxify, {
    Base: {
        value: base
    },
    IsProxy: {
        value(any) {
            return SpecialProxy.isProxy(any)
        }
    },
    Upgrade: {
        value(proxy) {
            let Target = getTarget(SpecialProxy.getWrapper(proxy))
            SpecialProxy.destroy(proxy)
            return proxify(Target)
        }
    },
    /*GetWrapper: {
        value(t) {
            return SpecialProxy.getWrapper(proxify(t))
        }
    },*/
    Destroy: {
        value(proxy) {
            SpecialProxy.destroy(proxy)
        }
    }
})
function getTarget(Wrapper) {
    return targets.get(Wrapper)
}
function classify(Interface, Generator) {
    // Recognize that objects of this interface will be for this proxy
    /*@devlet prototype = Object.getPrototypeOf(Interface.prototype)
        , downgrade = prototype[TargetInterface]
    console.debug(`* Setting up proxy for ${Interface.name}${downgrade ? ` from existing ${label(prototype)}` : ''}`)*/
    Interface.prototype[TargetInterface] = Interface
    Interfaces.set(Interface, Generator)
}
export function base(obj) {
    return getTarget(obj) ?? obj
}
//@dev window.proxify = proxify