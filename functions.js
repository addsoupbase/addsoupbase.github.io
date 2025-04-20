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
export function throttle(func, interval) {
    let toCall = [],
        thisArg = this,
        i
    return ThrottledFunction
    function CallNext() {
        let o = toCall.pop()
        if (o) func.apply(thisArg, o[0]), o[1](o)
        else if (!toCall.length) i = clearInterval(i)
        else if (i == null) i = setInterval(CallNext, interval)
    }
    function ThrottledFunction(...args) {
        i ??= setInterval(CallNext, interval)
        return new Promise(Resolver)
        function Resolver(resolve) {
            toCall.unshift([args, resolve])
        }
    }
}