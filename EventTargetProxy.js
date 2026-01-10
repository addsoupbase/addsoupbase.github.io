import Proxify, { ProxyFactory } from './BaseProxy.js'
import './h.js'
export default Proxify
export const h = window[Symbol.for('[[HModule]]')]
function wrap(func, target, events, ...args) {
    let me = Proxify(target)
    events = { ...events }
    for (let i in events) {
        let old = events[i]
        events[i] = Wrapped
        function Wrapped(e, off, abort) {
            e = Proxify(e)
            return abort ? old.call(me, e, off, abort) : off ? old.call(me, e, off) : old.call(me, e)
        }
    }
    return func(target, events, ...args)
}
class EventTarget$ {
    until(settings) {
        return Proxify(h.until(this, settings))
    }
    debounce(events, interval) {
        return Proxify(wrap(h.debounce, this, events, interval))
    }
    on(events, controller) {
        return Proxify(wrap(h.on, this, events, controller))
    }
    off(...names) {
        if (names[0] === true && names.length === 1) return h.off(this, ...h.getEventNames(this))
        switch (names.length) {
            case 0: return
            case 1: return h.off(this, names[0])
            case 2: return h.off(this, names[0], names[1])
            case 3: return h.off(this, names[0], names[1], names[2])
            default: return h.off.apply(void 0, this, names)
        }
    }
}
export const EventTargetProxy = new ProxyFactory(EventTarget$)
