const sym = Symbol.for("🔔")
export const unbound = Symbol('⛓️‍💥')
//  Don't collide, and make sure its usable across realms!!
let { warn, groupCollapsed, groupEnd } = console,
    { isArray } = Array
export const allEvents = new WeakMap
function isValidET(target) {
    return (target instanceof EventTarget) || (
        target instanceof (target.ownerDocument?.defaultView.EventTarget ?? target.EventTarget))
}
if (typeof showOpenFilePicker !== 'undefined') var reqFile = async function supported(accept, multiple) {
    let settings = {
        multiple,
        id: 602,
        startIn:'downloads'
    }
    if (accept) settings.types = [{
        accept: {
            [accept]: []
        }
    }]
    let out = await showOpenFilePicker(settings)
    return multiple ? out : [].at.call(out, -1)
}
else {
    let f = globalThis.document?.createElement('input')
    if (f) {
        f.type = 'file'
        var reqFile = (accept, multiple) =>
            new Promise((resolve, oncancel) =>
                Object.assign(f, {
                    accept,
                    multiple,
                    oncancel,
                    onchange: () => multiple ? resolve(f.files) : resolve([].at.call(f.files, -1))
                }).showPicker()
            )
    }
}
window.reqFile = reqFile
export { reqFile }
//const eventRegistry = new FinalizationRegistry(function ([key, set]) { set.delete(key) })
function verifyEventName(target, name) {
    name = name.toLowerCase()
    if (`on${name}` in target) return name
    if (`onwebkit${name}` in target) return `webkit${name}`
    if (`onmoz${name}` in target) return `moz${name}`
    if (`onms${name}` in target) return `ms${name}`
    if (/^domcontentloaded$/i.test(name) && target instanceof target.ownerDocument.defaultView.Document ||
        /^(animation(cancel|remove))$/i.test(name) && 'onremove' in target)
        return name
    //Some events like the one above don't have a handler
    throw TypeError(`🔇 Cannot listen for '${name}' events`)
}
export function wait(ms) {
    return new Promise(res)
    function res(resolve) {
        setTimeout(resolve, ms)
    }
}
export function getEventNames(target) {
    Object.hasOwn(target, sym) || Object.defineProperty(target, sym, { value: new Set })
    return target[sym]
}
export function hasEvent(target, eventName) {
    return target[sym]?.has(eventName) ?? false
}
export function on(target, events, useHandler) {
    if (Array.isArray(target)) {
        groupCollapsed('on(...)')
        for (let t of target) on(t, events, useHandler)
        console.groupEnd()
        return target
    }
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    Object.hasOwn(target, sym) ||
        //This will hold the NAMES of the events
        Object.defineProperty(target, sym, { value: new Set })
    try {
        groupCollapsed(`on(${target[Symbol.toStringTag] || target.constructor?.name || Object.getPrototypeOf(target).constructor[Symbol.toStringTag] || Object.getPrototypeOf(target).constructor.name || target})`)
        console.dirxml(target)
        const myEvents = target[sym]
        if (typeof events === 'function') events = {
            [events.name]: events
        }
        else if (isArray(events)) events = Object.fromEntries(events)
        for (let eventName in events) {
            let func = events[eventName]
            const once = eventName.includes('_'),
                prevents = eventName.includes('$'),
                passive = eventName.includes('^'),
                capture = eventName.includes('%'),
                stopProp = eventName.includes('&'),
                options = {
                    capture,
                    //once: false,
                    passive,
                }
            eventName = verifyEventName(target, eventName.replace(/[_$^%&]|bound /g, ''))
            if (myEvents.has(eventName)) {
                queueMicrotask(w)
                function w() { warn(`🔕 Duplicate '${eventName}' listener was not added`) }
                continue
            }
            function ProxyFunction(...args) {
                let { 0: event } = args
                stopProp && event.stopPropagation()
                func.apply(null, args)
                once && off(this, eventName)
                if (prevents) {
                    event.cancelable ?
                        event.preventDefault() :
                        // queueMicrotask(w)
                        // function w() { 
                        warn(`🔊 '${eventName}' events are not cancelable`)
                    // }
                }
            }
            Object.defineProperty(ProxyFunction, unbound, {
                value: func
            })
            /*
            func = new Proxy(func, {
                apply(targ, _, args) {
                    let out = targ.apply(null, args)
                    once && off(target, eventName)
                    if (prevents) {
                        let [event] = args
                        event.cancelable ?
                            event.preventDefault() :
                            queueMicrotask(()=>warn(`🔊 '${eventName}' events are not cancelable`))
                    }
                    return out
                }
            })*/
            //    eventRegistry.register(func, [eventName, myEvents])
            if (useHandler) {
                console.warn('Using handler property is deprecated')
                target[`on${eventName}`] = ProxyFunction
            }
            else target.addEventListener(eventName, ProxyFunction, options)
            allEvents.has(target) || allEvents.set(target, new Map)
            //A Map to hold the names & events
            const myGlobalEventMap = allEvents.get(target)
            myGlobalEventMap.set(eventName, { passive, capture, listener: ProxyFunction, handler: !!useHandler, prevents, stopProp, once })
            myEvents.add(eventName)
            useHandler || console.info(`🔔 '${eventName}' event added`)
        }
    } catch (e) {
        queueMicrotask(r)
        function r() { reportError(e) }
    } finally {
        groupEnd()
    }
    return target
}
on.once = function once(target, events, useHandler) {
    if (Array.isArray(events)) {
        events = events.map(f)
        function f([event, name]) { return [event, `${name}_`] }
    }
    else for (let n in events) {
        let { name } = events[n]
        events[`_${n}`] = name
        delete events[n]
    }
    return on(target, events, useHandler)
}
export function off(target, ...eventNames) {
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    if (!eventNames.length || !allEvents.has(target)) return null
    try {
        groupCollapsed(`off(${target[Symbol.toStringTag] || target.constructor?.name || target})`)
        console.dirxml(target)
        const map = allEvents.get(target),
            mySet = target[sym]
        for (let { length } = eventNames; length--;) {
            const name = verifyEventName(target, eventNames[length]),
                { listener, capture, passive, handler } = map.get(name)
            handler ? (target[`on${name}`] = null) : target.removeEventListener(name, listener, { capture, passive })
            map.has(name) && (handler || console.info(`🔕 '${name}' event removed`))
            map.delete(name)
            mySet.delete(name)
            map.size || allEvents.delete(target)
        }
    } catch (e) {
        queueMicrotask(r)
        function r() { reportError(e) }
    } finally {
        groupEnd()
    }
}
export function until(target, eventName, timeout/* = 600000*/) {
    return new Promise(un)
    function un(resolve, reject) {
        const id = timeout && setTimeout(reject, timeout, RangeError(`⏰ Promise for '${eventName}' expired after ${timeout} ms`))
        const handleName = `on${eventName}`
        if (target[handleName] === null) {
            //Use the handler property if we can
            target[handleName] = handler
            function handler(event) {
                try { resolve(event) }
                catch (e) { reject(e) }
                finally {
                    target[handleName] = null
                    timeout && clearTimeout(id)
                }
            }
        }
        else on(target, {
            //Use the addEventListener
            [eventName](event) {
                try { resolve(event) }
                catch (e) { reject(e) }
                finally {
                    off(target, eventName)
                    timeout && clearTimeout(id)
                }
            }
        })
    }
}
const objectURLS = new WeakMap
const regist = new FinalizationRegistry(URL.revokeObjectURL)
export function getObjUrl(thingy) {
    if (objectURLS.has(thingy)) return objectURLS.get(thingy)
    let url = URL.createObjectURL(thingy)
    regist.register(thingy, url)
    objectURLS.set(thingy, url)
    return url
}