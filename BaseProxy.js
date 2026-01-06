// For now [[Target]] = the object which you want to wrap
const TargetInterface = Symbol('[[TargetInterface]]') // the interface that [[Target]] implements (doesn't HAVE to be an interface)
export const WrapperTarget = Symbol('[[Target]]') // [[Target]] itself
export const WrapperItself = Symbol('[[WrapperThis]]') // get wrapper without the proxy getting in the way
const InterfaceWrapping = Symbol('[[CurrentInterface]]')
const Revoke = Symbol('[[Revoke]]')
const Destroy = Symbol('[[DestroyMethod]]')
const Cache = Symbol('[[Cache]]')
function destroy() {
    let Target = this[WrapperTarget]
    this.constructor[Cache].delete(Target)
    this[Revoke]()
}
// Structure is:
// Proxy -> Wrapper -> [[Target]]
export class Handler {
    get(Wrapper, prop) {
        if (prop === WrapperItself) return Wrapper
        let target = Wrapper[WrapperTarget]
        let toGet = target, out
        let receiver = toGet
        if (prop === WrapperTarget) return target
        if (prop in Wrapper) toGet = receiver = Wrapper
        out = Reflect.get(toGet, prop, target)
        return typeof out === 'function' ? cacheFunction(out) : out
    }
    set(Wrapper, prop, value) {
        let assign = Wrapper[WrapperTarget]
        if (prop in Wrapper) assign = Wrapper
        return Reflect.set(assign, prop, value)
    }
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
        if (newTarget) switch (args.length) {
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
    const o = {
        [MyFunc.name](...args) {
            const thisArg = getTarget(this)
            switch (args.length) {
                case 0: return MyFunc.call(thisArg)
                case 1: return MyFunc.call(thisArg, args[0])
                case 2: return MyFunc.call(thisArg, args[0], args[1])
                case 3: return MyFunc.call(thisArg, args[0], args[1], args[2])
            }
            return MyFunc.apply(thisArg, args)
        }
    }[MyFunc.name]
    FunctionCache.set(MyFunc, o)
    return o
}
function label(t) { return t[Symbol.toStringTag] }
const defaultHandler = new Handler
export function ProxyFactory(myClass, Interface = Object, handler = defaultHandler) {
    let cache = new WeakMap // Memoize
    Generator.prototype = myClass.prototype
    myClass[Cache] = cache
    function Generator(Target) {
        console.assert(Target instanceof Interface, `Expected a #<${Interface.name}>, instead got a #<${label(Target)}>`, Target)
        if (cache.has(Target)) return cache.get(Target)
        if (new.target && new.target !== Generator) var out = Reflect.construct(myClass, [Target], new.target)
        // There is an upgrade available!
        else {
            // initial call is executed (once) in this block
            // ONLY put the proxy if this is the end of the inheritance chain,
            // to prevent a proxy of a proxy
            ////for(let key of Reflect.ownKeys(myClass.prototype))key !== 'constructor'&&key in Interface.prototype&&console.warn(`Overwrite ${String(key)} on ${myClass.name}`) 
            let instance = new myClass(Target)
            let { proxy, revoke } = Proxy.revocable(Object.defineProperty(instance, WrapperTarget, { value: Target }), handler)
            instance[Revoke] = revoke
            instance[Destroy] = destroy
            out = proxy
            cache.set(Target, out)
        }
        return out
    }
    if (Interface !== Object) {
        myClass[InterfaceWrapping] = Interface
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
Object.defineProperty(proxify, 'Upgrade', {
    value(any) {
        let upgrade = any[TargetInterface]
        let myClass = any.constructor[InterfaceWrapping]
        if (myClass.prototype.isPrototypeOf(upgrade.prototype)) {
            console.debug(`Upgrading a #<${myClass.name}> to a #<${label(any[WrapperTarget])}>`)
            let Target = any[WrapperTarget]
            any[Destroy]()
            any = proxify(Target)
        }
        return any
    }
})
function getTarget(Wrapper) {
    return Wrapper[WrapperTarget]
}
function classify(Interface, Generator) {
    // Recognize that objects of this interface will be for this proxy
    let prototype = Object.getPrototypeOf(Interface.prototype)
        , downgrade = prototype[TargetInterface]
    console.debug(`Setting up ${Interface.name}()${downgrade ? ` from existing ${label(prototype)}()` : ''}`)
    Interface.prototype[TargetInterface] = Interface
    Interfaces.set(Interface, Generator)
}
export function base(obj) {
    return obj[WrapperTarget] ?? obj
}