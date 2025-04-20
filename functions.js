export function debounce(func, interval) {
    let waiting = false
    return DebouncedFunction
    function enable() {
        waiting = false
    }
    function DebouncedFunction(...args) {
        if (!waiting) {
            waiting = true
            setTimeout(enable, interval)
            func.apply(this, args)
        }
        return !waiting
    }
}
/*
export function throttle(func, interval) {
    let toCall = [],
        thisArg = this,
        i = setInterval(() => CallNext.next(), interval)
    CallNext = CallNext()
    return ThrottledFunction
    function* CallNext() {
        let o
        while (1) yield(o = toCall.pop()) && (func.apply(thisArg, o[0]), o[1](o))
        // else if (!toCall.length) i = clearInterval(i)
        // else if (i == null) i = setInterval(CallNext, interval)
    }
    function ThrottledFunction(...args) {
        // i ??=)
        return new Promise(Resolver)
        function Resolver(resolve) {
            toCall.unshift([args, resolve])
        }
    }
}*/