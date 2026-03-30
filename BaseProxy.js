// For now [[Target]] = the object which you want to wrap
const TargetInterface = Symbol('[[TargetInterface]]') // the interface that [[Target]] implements (doesn't HAVE to be an interface)
//@devconst InterfaceWrapping = Symbol('[[CurrentInterface]]')
const Cache = Symbol('[[Cache]]')
let { apply } = Reflect
const Revokes = new WeakMap
class SpecialProxy extends function (target, handler) {
    let { proxy, revoke } = Proxy.revocable(target, handler)
    Revokes.set(proxy, revoke)
    return proxy
} {
    #wrapper
    #handler
    #cstr
    //@dev#target
    #destroy() {
        let wrapper = this.#wrapper
        if (wrapper) {
            targets.delete(this, wrapper)
            this.#cstr[Cache].delete(getTarget(wrapper))
            Revokes.get(this)()
            Revokes.delete(this)
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
        if (prop in Wrapper) toGet = Wrapper
        out = Reflect.get(toGet, prop, target)
        return typeof out === 'function' ? cacheFunction(out) : out
    }
    set(Wrapper, prop, value) {
        let Target = Wrapper, Receiver = Target
        if (prop in Wrapper) Receiver = targets.get(Wrapper)
        else Target = Receiver = targets.get(Wrapper)
        return Reflect.set(Target, prop, value, Receiver)
    }
    apply(func, thisArg, args) {
        let nil = thisArg === void 0
        switch (args.length) {
            case 0: return nil ? func() : func.call(thisArg)
            case 1: return nil ? func(args[0]) : func.call(thisArg, args[0])
            case 2: return nil ? func(args[0], args[1]) : func.call(thisArg, args[0], args[1])
            case 3: return nil ? func(args[0], args[1], args[2]) : func.call(thisArg, args[0], args[1], args[2])
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
let apple = Handler.prototype.apply
const FunctionCache = new WeakMap
export function cacheFunction(f) {
    if (typeof f.prototype === 'object') return f // it's a class
    if (FunctionCache.has(f)) return FunctionCache.get(f)
    var o = {
        [o = f.name](...args) {
            return apple(f, getTarget(SpecialProxy.getWrapper(this)), args)
        }
    }[o]
    FunctionCache.set(f, o)
    return o
}
//@devfunction label(t) { return {}.toString.call(t).slice(8,-1)}
const defaultHandler = new Handler
export function ProxyFactory(myClass, Interface = globalThis[myClass.name.replace(/\$$/, '')] ?? Object, handler = defaultHandler) {
    let cache = new WeakMap // Memoize
    readonly(Generator, 'prototype', myClass.prototype) // We must make sure the new object has the right prototype
    readonly(myClass, Cache, cache)
    function Generator(Target) {
        //@devif (SpecialProxy.isProxy(Target)) throw ReferenceError(`Cannot proxify an existing Proxy of interface #<${Interface.name}>`)
        //@dev console.assert(Interface.prototype.isPrototypeOf(Target), `Expected a #<${Interface.name}>, instead got a #<${label(Target)}>`, Target)
        if (cache.has(Target)) return cache.get(Target)
        if (new.target && new.target !== Generator) return Reflect.construct(myClass, [Target], new.target) // There is an upgrade available!
        // initial call is executed (once)
        // ONLY put the proxy if this is the end of the inheritance chain,
        // to prevent a proxy of a proxy
        //@devfor(let key of Reflect.ownKeys(myClass.prototype))key !== 'constructor'&&key in Interface.prototype&&!Object.getOwnPropertyDescriptor(myClass.prototype,key).get&&console.warn(`Overwrite ${String(key)} on ${myClass.name}`) 
        let instance = new myClass(Target)
        targets.set(instance, Target)
        let proxy = new SpecialProxy(instance, handler, Target)
        cache.set(Target, proxy)
        //@devif (proxy !== proxify(Target)) throw ReferenceError('Proxy identity check failed')
        return proxy
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
export function proxifySafe(any) {
    return any === Object(any) ? proxify(any) : any
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
    GetWrapper: {
        value(t) {
            return SpecialProxy.getWrapper(proxify(t))
        }
    },
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
    return SpecialProxy.isProxy(obj) ? getTarget(SpecialProxy.getWrapper(obj))
        : obj
}
export function proxy(obj) {
    return SpecialProxy.isProxy(obj) ? obj
        : proxify(obj)
}
//@dev window.proxify = proxify
const watchHandler = {
    deleteProperty(t, p) {
        return Reflect.deleteProperty(Watcher.getTarget(t), p)
    },
    defineProperty(t, p, v) {
        return Reflect.defineProperty(Watcher.getTarget(t), p, v)
    },
    has(t, p) {
        return p in Watcher.getTarget(t)
    },
    get(t, p) {
        // Remember: the functions can't be bound so that 
        // array generic methods work as expected (they target the proxy)
        return Watcher.getTarget(t)[p]
    },
    set(t, p, v, r) {
        Watcher.queue(t, p)
        return Reflect.set(Watcher.getTarget(t), p, v)
    },
    ownKeys(t) { return Reflect.ownKeys(Watcher.getTarget(t)) }
}
class Volatile {
    static #handle(sub, target, vol) {
        let type = typeof sub
        if (type === 'function') return vol.process(sub(target))
        if (type === 'string' || type === 'number' || type === 'symbol') return vol.process(target[sub])
        throw TypeError(`Wrong type: ${type}`)
    }
    #sets = new Map
    process(value) {
        return value // meant to be overridden by subclasses
        // So for like if you want it to auto escape html!!
    }
    subscribe(p, prop, setNow) {
        this.#sets.set(p, prop)
        if (setNow) p[prop] = this.valueOf()
    }
    unsubscribe(p) {
        this.#sets.delete(p)
    }
    emit() {
        let myVal
        for (let [set, prop] of this.#sets)
            set[prop] = myVal ??= this.valueOf()
    }
    valueOf() {
        let strings = this.#strings, subs = this.#subs, target = this.#target
        if (typeof strings === 'function')
            return strings(target)
        let result = ''
        for (let i = 0, n = strings.length, { length } = subs; i < n; ++i)
            result += `${strings[i]}${i < length ? Volatile.#handle(subs[i], target, this) : ''}`
        return result
    }
    updateOnCompile = false
    #strings
    #subs
    #target
    constructor(targetObj, strings, subs) {
        this.#target = targetObj
        this.compile(strings, ...subs)
    }
    compile(strings, ...subs) {
        this.#strings = strings
        this.#subs = subs
        this.updateOnCompile && this.emit()
    }
}
function LookerFunction(strings, ...subs) {
    let out = new Volatile(Watcher.getTarget(this), strings, subs)
    Watcher.addToVolatile(this, out)
    return out
}
class Watcher extends function () {
    return callee
    function callee(...args) {
        return LookerFunction.apply(callee, args)
    }
} {
    #volatiles = new Set
    static addToVolatile(t, vol) {
        t.#volatiles.add(vol)
    }
    static getVolatiles(t) { return t.#volatiles }
    static getTarget(t) {
        return t.#target
    }
    static getProps(t) { return t.#watchingProps }
    static emitVolatiles(t, prop) {
        let volatiles = t.#volatiles
        volatiles.forEach(vol => vol.emit(prop))
    }
    static queue(callee, prop) {
        let q = callee.#queued
        if (!q.size) callee.#method.call(window, () => {
            try {
                let watchingProps = Watcher.getProps(callee)
                let thing
                if (watchingProps.size) thing = watchingProps.intersection(q)
                else thing = q
                thing.forEach(prop => {
                    Watcher.emitVolatiles(callee, prop)
                })
            }
            finally {
                q.clear()
            }
        })
        q.add(prop)
    }
    #queued = new Set
    #target
    #watchingProps
    #method
    constructor(obj, props, method) {
        super()
        this.#method = method
        this.#target = obj
        this.#watchingProps = new Set(props)
    }
}
export function Observer(obj, { props, inherits = Watcher, method = queueMicrotask } = {}) {
    return new Proxy(new inherits(obj, props, method), watchHandler)
}
/*
let first = document.createElement('output')
let second = document.createElement('output')
first.style.display = second.style.display = 'block'
document.body.append(first, second)
let yards = new Observer({ yard: 1 })
let yardsToMeters = yards`${'yard'
    } yard${({ yard }) => yard === 1 ? '' : 's'
    } is ${({ yard }) => (yard / 1.094).toFixed(2)
    } meters!`
yardsToMeters.subscribe(first, 'textContent', true)
let yardsToInches = yards`It's also ${({ yard }) => yard * 36} inches.`
yardsToInches.subscribe(second, 'textContent', true)
yardsToInches.updateOnCompile = true
setInterval(() => {
    if (++yards.yard === 12) {
        yardsToInches.compile`Or ${({ yard }) => (yard / 1760).toFixed(4)} miles!`
    }
}, 300)
*/