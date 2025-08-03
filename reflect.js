const { isPrototypeOf } = {}
    , { apply, getOwnPropertyDescriptor, getPrototypeOf } = Reflect,
    reflect = {
        __proto__: Reflect,
        isInstance(proto, constructor) {
            return isPrototypeOf.call(constructor?.prototype, proto)
        },
        call(func, thisArg, ...args) {
            return apply(func, thisArg, args)
        },
        bind: Function.apply.bind(Function.bind),
        getPropertyDescriptor(target, prop, ignore) {
            let val
            do if (val = getOwnPropertyDescriptor(target, prop)) return val
            while ((target = getPrototypeOf(target)) !== ignore)
        },
        getPropertyNames(target) {
            let val = [],
                push = [].push.bind(val), 
                i
            for (i in target) push(i)
            return val
        }
    }
export default reflect