import { ProxyFactory, proxify } from './BaseProxy.js'
export default proxify
// import './h.js'
let h = Symbol.for('[[HModule]]')
typeof window[h] === 'undefined' && await import('./h.js')
h = window[h]
class EventTarget$ {
    on(events, controller) {
        let me = proxify(this)
        for (let i in events) {
            let old = events[i]
            events[i] = Wrapped
            function Wrapped(e) {
                return old.call(me, proxify(e))
            }
        }
        return h.on(this, events, controller)
    }
    off(...names) {
        if (names[0] === true && names.length===1) return h.off(this, ...h.getEventNames(this))
        switch (names.length) {
            case 0: return
            case 1: return h.off(this, names[0])
            case 2: return h.off(this, names[0], names[1])
            case 3: return h.off(this, names[0], names[1], names[2])
            default: return h.off(this, ...names)
        }
    }
}
// const descriptors = Object.getOwnPropertyDescriptors(prototype)
export const EventTargetProxy = new ProxyFactory(EventTarget$)
