const sym = Symbol("🔔"), //For keeping track of events
    //But to also not potentially collide with existing keys
    { warn, groupCollapsed, groupEnd, debug } = console,
    { isArray } = Array
export const allEvents = new WeakMap
//const eventRegistry = new FinalizationRegistry(function ([key, set]) { set.delete(key) })
function verifyEventName(target, name) {
    name = name.toLowerCase()
    if (`on${name}` in target) return name
    //Fallback if we can
    if (`onwebkit${name}` in target) return `webkit${name}`
    if (`onmoz${name}` in target) return `moz${name}`
    if (`onms${name}` in target) return `ms${name}`
    if (name.match(/^domcontentloaded$/i) && target instanceof Document ||
        name.match(/^(animation(cancel|remove))$/i) && 'onremove' in target)
        return name
    //Some events like the one above don't have a handler

    // Ooops!
    throw TypeError(`🔇 Cannot listen for '${name}' events`)
}
export function wait(ms) {
    return new Promise(res)
    function res(resolve) {
        setTimeout(resolve, ms)
    }
}
export function getEventNames(target) {
    (sym in target) || Object.defineProperty(target, sym, { value: new Set })
    return target[sym]
}
export function hasEvent(target, eventName) {
    return target[sym]?.has(eventName)
}
export function on(target, events, useHandler) {
    if (!(target instanceof EventTarget)) throw TypeError("🚫 Invalid event target")
    if (!(target[sym] instanceof Set))
        //This will hold the NAMES of the events
        Object.defineProperty(target, sym, { value: new Set })
    try {
        groupCollapsed(`on(${target[Symbol.toStringTag] || target.constructor?.name || target})`)
        console.dirxml(target)
        const myEvents = target[sym]
        if (typeof events === 'function') events = [[events.name, events]]
        else if (isArray(events)) events = Object.fromEntries(events)
        for (let eventName in events) {
            let func = events[eventName]
            const once = eventName.includes('_'),
                prevents = eventName.includes('$'),
                passive = eventName.includes('^'),
                capture = eventName.includes('%'),
                options = {
                    capture,
                    //once: false,
                    passive,
                }
            eventName = eventName.replace(/[_$^%]|bound /g, '')
            eventName = verifyEventName(target, eventName)
            if (myEvents.has(eventName)) {
                queueMicrotask(()=>warn(`🔕 Duplicate '${eventName}' listener!`))
                continue
            }
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
            })
            //    eventRegistry.register(func, [eventName, myEvents])
            if (useHandler) target[`on${eventName}`] = func
            else {
                target.addEventListener(eventName, func, options)
                allEvents.has(target) || allEvents.set(target, new Map)
                //A Map to hold the names & events
                const myGlobalEventMap = allEvents.get(target)
                myGlobalEventMap.set(eventName, func)
                myEvents.add(eventName)
            }
            console.info(`🔔 '${eventName}' event added`)
        }
    } catch (e) {
        queueMicrotask(() => reportError(e))
    } finally {
        groupEnd()
    }
    return target
}
on.once = function once(target, events, useHandler) {
    if (Array.isArray(events)) events = events.map(function ([event, name]) { return [event, `${name}_`] })
    else for (let n in events) {
      let {name} = events[n]
      events[`_${n}`] = events[n] 
  delete events[n]
    } 
    return on(target, events, useHandler)
}
export function off(target, ...eventNames) {
    if (!(target instanceof EventTarget) || !(target[sym] instanceof Set) || !allEvents.has(target))
        throw TypeError("🚫 Invalid event target")
    if (!eventNames.length) return null
    try {
        groupCollapsed(`off(${target[Symbol.toStringTag] || target.constructor?.name || target})`)
        console.dirxml(target)
        const map = allEvents.get(target),
            mySet = target[sym]
        for (let { length } = eventNames; length--;) {
            const name = verifyEventName(eventNames[length], target),
                func = map.get(name)
            target.removeEventListener(name, func)
            map.has(name) && console.info(`🔕 '${name}' event removed`)
            map.delete(name)
            mySet.delete(name)
            map.size || allEvents.delete(target)
        }
    } catch (e) {
        queueMicrotask(() => reportError(e))
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
                    // This is an accessor so you cannot use 'delete'
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
export function namedFunction(name, func) {
    return { [name]: func }[name]
}