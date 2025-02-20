const sym = Symbol.for("🔔")
export const unbound = Symbol('⛓️‍💥')
//  Don't collide, and make sure its usable across realms!!
let { warn, groupCollapsed, groupEnd } = console,
    { isArray } = Array
export const allEvents = new WeakMap
function isValidET(target) {
    return (target instanceof EventTarget) || (
        target instanceof (target.ownerDocument?.defaultView.EventTarget ?? target.EventTarget)
    )
}
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
        groupCollapsed(`on(${target[Symbol.toStringTag] || target.constructor?.name || Object.getPrototypeOf(target).constructor[Symbol.toStringTag] || Object.getPrototypeOf(target).constructor.name || target})`)
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
            function Func(...args) {
                let [event] = args
                stopProp && event.stopPropagation()
                func.apply(null, args)
                once && off(this, eventName)
                if (prevents) {
                    event.cancelable ?
                        event.preventDefault() :
                        queueMicrotask(w)
                    function w() { warn(`🔊 '${eventName}' events are not cancelable`) }
                }
            }
            Object.defineProperty(Func, unbound, {
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
                target[`on${eventName} `] = Func
            }
            else target.addEventListener(eventName, Func, options)
            allEvents.has(target) || allEvents.set(target, new Map)
            //A Map to hold the names & events
            const myGlobalEventMap = allEvents.get(target)
            myGlobalEventMap.set(eventName, { passive, capture, listener: Func, handler: !!useHandler, prevents, stopProp, once })
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
        function f([event, name]) { return [event, `${name} _`] }
    }
    else for (let n in events) {
        let { name } = events[n]
        events[`_${n} `] = events[n]
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
            handler ? (target[`on${name} `] = null) : target.removeEventListener(name, listener, { capture, passive })
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
        const handleName = `on${eventName} `
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