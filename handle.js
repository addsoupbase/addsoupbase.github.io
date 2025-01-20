const sym = Symbol("🔔"), //For keeping track of events
    //But to also not potentially collide with existing keys
    { warn } = console,
    { isArray } = Array
export default sym
export const allEvents = new WeakMap
const eventGarbageCollectionCallback = new FinalizationRegistry(function ([key, set]) { set.delete(key) })

function verifyEventName(target, name) {

    if (name.match(/^domcontentloaded$/i) && target instanceof Document ||
        name.match(/^(animation(cancel|end|remove))$/i) && 'onremove' in target
    ) return
    //Some events like the one above don't have a handler
    if (!(`on${name.toLowerCase()}` in target)) throw TypeError(`🔇 Cannot listen for '${name}' events`)
    //Check if handler with name exists
}
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
export function on(target, events, useHandler) {
    if (!(target instanceof EventTarget)) throw TypeError("🚫 Invalid event target")
    if (!(target[sym] instanceof Set))
        //This will hold the NAMES of the events
        Object.defineProperty(target, sym, { value: new Set })
    console.groupCollapsed(`on(${target[Symbol.toStringTag] || target.constructor?.name || target})`)
    console.log(`Target: `,target)
    const myEvents = target[sym]
    if (!isArray(events)) events = Object.entries(events)
    for (let [eventName, func] of events) {
        const options = {
            capture: false,
            once: false,
            passive: false,
        }
        let once = eventName.includes('_'),
            prevents = eventName.includes('$')
            eventName = eventName.replace(/[_$]/g, '')
        
        if (myEvents.has(eventName)) {
            warn(`🔕 Duplicate '${eventName}' listener on `, target)
            continue
        }
        verifyEventName(target, eventName)
        func = new Proxy(func, {
            apply(targ, _, argArray) {
                once && off(target, eventName)
                if (prevents) {
                    const [event] = argArray
                    event.cancelable ?
                        event.preventDefault() :
                        warn(`🔊 '${eventName}' events are not cancelable`)
                }
                return targ.apply(null, argArray)
            }
        })
        eventGarbageCollectionCallback.register(func, [eventName, myEvents])
        if (useHandler) target[`on${eventName}`] = func
        else {
            target.addEventListener(eventName, func, options)
            if (!allEvents.has(target)) allEvents.set(target, new Map)
            //A Map to hold the names & events
            const myGlobalEventMap = allEvents.get(target)
            myGlobalEventMap.set(eventName, func)
            myEvents.add(eventName)
        }
        console.debug(`🔔 '${eventName}' event added`)
    }
    console.groupEnd()
    return target
}
export function off(target, ...eventNames) {
    if (!(target instanceof EventTarget) || !(target[sym] instanceof Set) || !allEvents.has(target))
        throw TypeError("🚫 Invalid event target")
    console.groupCollapsed(`off(${target[Symbol.toStringTag] || target.constructor?.name || target})`)
    console.log(`Target: `,target)
    const map = allEvents.get(target),
        mySet = target[sym]
    for (let { length } = eventNames; length--;) {
        const name = eventNames[length],
            func = map.get(name)
        map.has(name) && console.debug(`🔕 '${name}' event removed`)
        target.removeEventListener(name, func)
        map.delete(name)
        mySet.delete(name)
        map.size || allEvents.delete(target)
    }
    console.groupEnd()
}
export function until(target, eventName, timeout/* = 600000*/) {
    return new Promise(un)
    /*                  */
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
                    delete target[handleName]
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
