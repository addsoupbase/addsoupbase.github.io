const sym = Symbol.for("🔔")
export const unbound = Symbol('⛓️‍💥')
//  Don't collide, and make sure its usable across realms!!
let { warn, groupCollapsed, groupEnd } = console,
    { isArray } = Array
export const allEvents = new WeakMap
function isValidET(target) {
    return target &&
        (target instanceof EventTarget
        || target.ownerDocument?.defaultView?.EventTarget.prototype.isPrototypeOf(target)
        || EventTarget.prototype.isPrototypeOf(target)
        || (typeof target.addEventListener === 'function' && typeof target.removeEventListener === 'function' && typeof target.dispatchEvent === 'function'))
    // || target instanceof globalThis.EventTarget
}
if (0/*typeof showOpenFilePicker !== 'undefined'*/) var reqFile = async function supported(accept, multiple) {
    let settings = {
        multiple,
        id: 602,
        startIn: 'downloads'
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
export { reqFile }
//const eventRegistry = new FinalizationRegistry(function ([key, set]) { set.delete(key) })
function verifyEventName(target, name) {
    let original = name
    name = name.toLowerCase()
    if (`on${name}` in target) return original
    if (`onwebkit${name}` in target) return `webkit${original}`
    if (`onmoz${name}` in target) return `moz${original}`
    if (`onms${name}` in target) return `ms${original}`
    if (/^domcontentloaded$/i.test(original) &&
        (target instanceof Document
            || target.ownerDocument?.defaultView?.Document.prototype.isPrototypeOf(target))
        ||
        /^(?:animation(?:cancel|remove))$/i.test(original) && 'onremove' in target)
        return original
    //Some events like the one above don't have a handler
    queueMicrotask(warn)
    function warn() { console.warn(`'${original}' events might not be available on the following object:`, target) }
    return original
    // throw TypeError(`🔇 Cannot listen for '${original}' events`)
}
export function wait(ms) {
    return new Promise(res)
    function res(resolve) {
        setTimeout(resolve, ms)
    }
}
const AbortSignals = new Map
export function abort(id, reason) {
    let signal = AbortSignals.get(id)
    if (!signal) throw TypeError(`Signal not found`)
    signal.controller.abort(reason)
    signal.count = 0
    console.info(`🛜 Aborted on signal`, id, reason ? ` with reason "${reason}".` : ' ')
}
export function getEventNames(target) {
    target.hasOwnProperty(sym) || Object.defineProperty(target, sym, { value: new Set })
    return target[sym]
}
export function hasEvent(target, eventName) {
    return target[sym]?.has(eventName) ?? false
}
Object.assign(on, {
    '_': `Event is automatically removed after 1st call`,
    '$': `Automatically calls 'preventDefault', if possible`,
    '^': `Passive event listener`,
    '%': `Capture event`,
    '&': `Stop propagation`,
    '!': `Stop immediate propagation`,
    '?': 'Only trusted events',
    trusted: '?',
    once: '_',
    preventDefault: '$',
    passive: '^',
    capture: '%',
    stopPropagation: '&',
    stopImmediatePropagation: '!',
})
const formatEventName = /[_$^%&!?\d]|bound /g
const matchDigits = /\d+/
export function on(target, events, useHandler) {
    if (Array.isArray(target)) {
        groupCollapsed('on(...)')
        target.forEach(func)
        function func(t) {
            on(t, events, useHandler)
        }
        console.groupEnd()
        return target
    }
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    let manualSignal
    try {
        groupCollapsed(`on(${target[Symbol.toStringTag] || target.constructor?.name || Object.getPrototypeOf(target).constructor[Symbol.toStringTag] || Object.getPrototypeOf(target).constructor.name || target})`)
        console.dirxml(target)
        const myEvents = getEventNames(target)
        if (typeof events === 'function') events = {
            [events.name]: events
        }
        else if (isArray(events)) {
            // if (2 in events) {
            // manualSignal = events[2]
            // delete events[2]
            // }
            events = Object.fromEntries(events)
        }
        for (let eventName in events) {
            let func = events[eventName]
            const once = eventName.includes('_'),
                prevents = eventName.includes('$'),
                passive = eventName.includes('^'),
                capture = eventName.includes('%'),
                stopProp = eventName.includes('&'),
                stopImmediateProp = eventName.includes('!'),
                onlyTrusted = eventName.includes('?'),
                options = {
                    capture,
                    //once
                    passive,
                }
            let signal = eventName.match(matchDigits)?.[0]
            // if (once && signal) throw TypeError(`Cannot have a one time event with a signal as well`)
            if (manualSignal == null && signal)
                signal = +signal
            else if (manualSignal != null) signal = manualSignal
            eventName = verifyEventName(target, eventName.replace(formatEventName, ''))
            if (myEvents.has(eventName) && signal == null) {
                queueMicrotask(w)
                function w() { warn(`🔕 Skipped duplicate '${eventName}' listener`) }
                continue
            }
            let controller
            if (signal != null && !AbortSignals.has(signal)) {
                AbortSignals.set(signal, {
                    __proto__: null,
                    count: 1,
                    controller: controller = new AbortController
                })
            } else if (signal != null) {
                let me = AbortSignals.get(signal)
                controller = me.controller
                ++me.count
            }
            if (controller) {
                options.once = once
                options.signal = controller.signal
            }
            function Abort() {
                abort(signal)
            }
            function Remove() {
                target.removeEventListener(eventName, ProxyFunction, options)
            }
            function ProxyFunction(...args) {
                let { 0: event } = args
                if (event.constructor.name === 'CustomEvent') for (let i in event.detail) {
                    if (i in event) continue
                    event[i] = event.detail[i]
                }
                controller && args.push(Abort, Remove)
                onlyTrusted && event.isTrusted || !onlyTrusted && func.apply(target, args)
                stopImmediateProp && event.stopImmediatePropagation()
                stopProp && event.stopPropagation()
                prevents && (event.cancelable ? event.preventDefault() : warn(`🔊 '${eventName}' events are not cancelable`))
                once && off(this, eventName)
            }
            Object.defineProperty(ProxyFunction, unbound, {
                value: func,
                configurable: 1,
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
            if (useHandler)
                // console.warn('Using handler property is deprecated')
                target[`on${eventName}`] = ProxyFunction
            else target.addEventListener(eventName, ProxyFunction, options)
            if (controller)
                console.info(`📡 '${eventName}' event added with signal`, signal)
            else {
                allEvents.has(target) || allEvents.set(target, new Map)
                //A Map to hold the names & events
                const myGlobalEventMap = allEvents.get(target)
                myGlobalEventMap.set(eventName, { passive, capture, onlyTrusted, listener: ProxyFunction, handler: !!useHandler, prevents, stopProp, once, stopImmediateProp })
                myEvents.add(eventName)
                useHandler || console.info(`🔔 '${eventName}' event added`)
            }
        }
    } catch (e) {
        queueMicrotask(r)
        function r() { reportError(e) }
    } finally {
        groupEnd()
    }
    return target
}
{
    function a({ 0: event, 1: name }) { return [event, `${name}_`] }
    Object.assign(on,
        {
            once(target, events, useHandler) {
                if (Array.isArray(events))
                    events = events.map(a)
                else for (let n in events) {
                    let { name } = events[n]
                    events[`_${n}`] = name
                    delete events[n]
                }
                return on(target, events, useHandler)
            }
        }
    )
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
        const id = timeout && setTimeout(err => {
            reject(err)
            off(target, eventName)
        }, timeout, RangeError(`⏰ Promise for '${eventName}' expired after ${timeout} ms`))
            , handleName = `on${eventName}`
        /*if (target[handleName] === null) {
            //  Use the handler property if we can
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
        else */on(target, {
                [`${eventName}_`](event) {
                    try { resolve(event) }
                    catch (e) { reject(e) }
                    finally {
                        timeout && clearTimeout(id)
                    }
                }
            })
    }
}
let objectURLS,
    registry
export function getObjUrl(thingy) {
    registry ??= new FinalizationRegistry(URL.revokeObjectURL)
    objectURLS ??= new WeakMap
    if (objectURLS.has(thingy)) return objectURLS.get(thingy)
    let url = URL.createObjectURL(thingy)
    registry.register(thingy, url)
    objectURLS.set(thingy, url)
    return url
}
let anchor
export function download(blob, title) {
    anchor ??= document.createElement('a')
    anchor.download = title || 'download'
    anchor.href = anchor.src = getObjUrl(blob)
    anchor.click()
}