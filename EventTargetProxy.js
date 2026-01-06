import { ProxyProtoGenerator, proxify } from './BaseProxy.js'
export {proxify} from './BaseProxy.js'
// import './h.js'
let _ = Symbol.for('[[HModule]]')
typeof window[_] === 'undefined' && await import('./h.js')
const h = window[_]
class EventTargetProxyClass {
    on(events, controller) {
        let me = proxify(this)
        let a = me.baseClassObject
        for (let i in events)
            events[i] = events[i].bind(me)
        return h.on(this, events, controller)
    }
    off(...names) {
        let base = this
        switch (names.length) {
            case 0: return
            case 1: return h.off(base, names[0])
            case 2: return h.off(base, names[0], names[1])
            case 3: return h.off(base, names[0], names[1], names[2])
            default: return h.off(base, ...names)
        }
    }
}
// const descriptors = Object.getOwnPropertyDescriptors(prototype)
export const EventTargetProxy = new ProxyProtoGenerator(EventTargetProxyClass, EventTarget)
export default EventTargetProxy