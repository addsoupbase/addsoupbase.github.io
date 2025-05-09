
const sym = Symbol.for("🔔")
export const unbound = Symbol('⛓️‍💥')
//  Don't collide, and make sure its usable across realms!!
let {warn, groupCollapsed, groupEnd} = console,
    {isArray} = Array
export const allEvents = new WeakMap

function isValidET(target) {
    return target &&
        (target instanceof EventTarget
            || target.ownerDocument?.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            // || EventTarget.prototype.isPrototypeOf(target)
            || target.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            || target.EventTarget?.prototype.isPrototypeOf(target)
            // || (typeof target.addEventListener === 'function' && typeof target.removeEventListener === 'function' && typeof target.dispatchEvent === 'function')
        )
}

export let reqFile
if (0/*typeof showOpenFilePicker !== 'undefined'*/) reqFile = async function supported(accept, multiple) {
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

        function requestFile(accept, multiple) {
            return new Promise(executor)

            function executor(resolve, oncancel) {
                return Object.assign(f, {
                    accept,
                    multiple,
                    oncancel,
                    onchange() {
                        multiple ? resolve(f.files) : resolve([].at.call(f.files, -1))
                    }
                }).showPicker()
            }
        }

        reqFile = requestFile
    }
}

//const eventRegistry = new FinalizationRegistry(function ([key, set]) { set.delete(key) })
function verifyEventName(target, name) {
    let original = name
    name = name.toLowerCase()
    if (`on${name}` in target) return original
    if (`onwebkit${name}` in target) return `webkit${original}`
    if (`onmoz${name}` in target) return `moz${original}`
    if (`onms${name}` in target) return `ms${original}`
    if (/^domcontentloaded$/i.test(original) &&
        (globalThis.Document?.prototype.isPrototypeOf(target)
            || globalThis.HTMLDocument?.prototype.isPrototypeOf(target)
            || target.ownerDocument?.defaultView?.HTMLDocument.prototype.isPrototypeOf(target)
            || target.ownerDocument?.defaultView?.Document.prototype.isPrototypeOf(target))
        ||
        /^(animation(?:cancel|remove))$/i.test(original) && 'onremove' in target)
        return original
    //Some events like the one above don't have a handler
    customEvents.has(name) || queueMicrotask(console.warn.bind(1, `'${original}' events might not be available on the following object:`, target))
    return original
    // throw TypeError(`🔇 Cannot listen for '${original}' events`)
}

const delayedEvents = new Map
const giveItSomeTime = function (hold) {
    let secondparam = 100 //idk some random timeout
    if (hold === globalThis.requestIdleCallback)
        secondparam = {timeout: 1000}
    return delay

    function delay(callback) {
        return hold(callback, secondparam)
    }
}(globalThis.requestIdleCallback ?? globalThis.queueMicrotask ?? globalThis.setImmediate ?? globalThis.setTimeout)

function dispatchAllDelayed(id) {
    let all = delayedEvents.get(id)
    giveItSomeTime(emitPendingEvents)

    function emitPendingEvents() {
        for (let {target, event} of all)
            target.dispatchEvent(event)
        all.clear()
    }
}

export function delayedDispatch(id, target, event) {
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    delayedEvents.has(id) || delayedEvents.set(id, new Set)
    let set = delayedEvents.get(id)
    set.size || dispatchAllDelayed(id)
    set.add({
        target,
        event
    })
}

export function wait(ms) {
    return new Promise(resolveWithDelay)

    function resolveWithDelay(resolve) {
        setTimeout(resolve, ms)
    }
}

/*const AbortSignals = new Map

export function abort(id, reason) {
    let signal = AbortSignals.get(id)
    if (!signal) throw TypeError('Signal not found')
    signal.controller.abort(reason)
    signal.count = 0
    console.info('🛜 Aborted on signal', id, reason ? ` with reason: ${reason}.` : ' ')
}*/

export function getEventNames(target) {
    target.hasOwnProperty(sym) || Object.defineProperty(target, sym, {value: new Set})
    return target[sym]
}

export function hasEvent(target, eventName) {
    return target[sym]?.has(eventName) ?? false
}

export const {
    currentTarget: CURRENT_TARGET, autoAbort: AUTO_ABORT, trusted: TRUSTED, once: ONCE,
    preventDefault: PREVENT_DEFAULT, passive: PASSIVE,
    capture: CAPTURE, stopPropagation: STOP_PROPAGATION, stopImmediatePropagation: STOP_IMMEDIATE_PROPAGATION
} = Object.freeze({
    currentTarget: '@', //Only call function if event.target === event.currentTarget
    autoAbort: '#', //Automatically abort all listeners with the same signal
    trusted: '?', //Only call function if (event.isTrusted)
    once: '_', //Automatically removed after first call
    preventDefault: '$',  //Automatically calls event.preventDefault() if possible
    passive: '^',
    capture: '%',
    stopPropagation: '&', //Automatically calls event.stopPropagation()
    stopImmediatePropagation: '!', //Automatically calls event.stopImmediatePropagation()
})
const customEvents = new Set
export const sig = Symbol.for('🔊')

export function addCustomEvent(names) {
    for (let name in names)
        (names[name] ? customEvents.add : customEvents.delete).call(customEvents, name.toLowerCase())
}

const formatEventName = /[_$^%&!?@#\d]|bound /g
export function on(target, events, useHandler, signal) {
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
            const once = eventName.includes(ONCE),
                prevents = eventName.includes(PREVENT_DEFAULT),
                passive = eventName.includes(PASSIVE),
                capture = eventName.includes(CAPTURE),
                stopProp = eventName.includes(STOP_PROPAGATION),
                stopImmediateProp = eventName.includes(STOP_IMMEDIATE_PROPAGATION),
                onlyTrusted = eventName.includes(TRUSTED),
                onlyCurrentTarget = eventName.includes(CURRENT_TARGET),
                autoabort = eventName.includes(AUTO_ABORT),
                options = {
                    capture,
                    //once
                    passive,
                }
            eventName = verifyEventName(target, eventName.replace(formatEventName, ''))
            if (myEvents.has(eventName) && signal == null) {
                queueMicrotask(warn.bind(1, `🔕 Skipped duplicate '${eventName}' listener`))
                continue
            }
            if (signal) {
                options.once = once
                options.signal = signal.signal
            }
            let Remove = target.removeEventListener.bind(target, eventName, ProxyFunction, options),
                Abort = signal?.abort.bind(signal)
            function ProxyFunction(...args) {
                let {0: event} = args
                if (event.constructor.name === 'CustomEvent') {
                    let {detail} = event
                    // , keys = Reflect.ownKeys(detail)
                    for (let i in detail) {
                        // i wish for in included symbols :<
                        if (i in event) {
                            warn(`The '${i.toString()}' property of a CustomEvent was ignored since it would overwrite an existing property `, event[i])
                            continue
                        }
                        event[i] = detail[i]
                    }
                }
                signal && args.push(Abort, Remove)
                onlyTrusted && event.isTrusted || !onlyTrusted && (!onlyCurrentTarget || onlyCurrentTarget && event.target === event.currentTarget) &&
                (func.apply(target, args),
                stopImmediateProp && event.stopImmediatePropagation(),
                stopProp && event.stopPropagation(),
                prevents && (event.cancelable ? event.preventDefault() : warn(`🔊 '${eventName}' events are not cancelable`)),
                autoabort && Abort?.(),
                once && off(event.currentTarget, eventName))
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
            if (signal)
                console.info(`📡 '${eventName}' event added`)
            // with signal`, signal)
            else {
                allEvents.has(target) || allEvents.set(target, new Map)
                //A Map to hold the names & events
                const myGlobalEventMap = allEvents.get(target)
                myGlobalEventMap.set(eventName, {
                    onlyCurrentTarget,
                    passive,
                    capture,
                    onlyTrusted,
                    listener: ProxyFunction,
                    handler: !!useHandler,
                    prevents,
                    stopProp,
                    once,
                    stopImmediateProp,
                    autoabort,
                })
                myEvents.add(eventName)
                console.info(`🔔 '${eventName}' event added`)
            }
        }
    } catch (e) {
        queueMicrotask(reportError.bind(globalThis, e))
    } finally {
        groupEnd()
    }
    return target
}

{
    function a({0: event, 1: name}) {
        return [event, `${name}_`]
    }

    Object.assign(on,
        {
            once(target, events, useHandler) {
                if (Array.isArray(events))
                    events = events.map(a)
                else for (let n in events) {
                    let {name} = events[n]
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
        for (let {length} = eventNames; length--;) {
            const name = verifyEventName(target, eventNames[length]),
                {listener, capture, passive, handler} = map.get(name)
            handler ? (target[`on${name}`] = null) : target.removeEventListener(name, listener, {capture})
            map.has(name) && console.info(`🔕 '${name}' event removed`)
            map.delete(name)
            mySet.delete(name)
            map.size || allEvents.delete(target)
        }
    } catch (e) {
        queueMicrotask(reportError.bind(globalThis, e))
    } finally {
        groupEnd()
    }
}

export function until(target, eventName, failureName, timeout/* = 600000*/) {
    return new Promise(UntilClosure)

    function UntilClosure(resolve, reject) {
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
        else */
        let e = {
            [`#${eventName}1`](event) {
                try {
                    resolve(event)
                } catch (e) {
                    reject(e)
                } finally {
                    timeout && clearTimeout(id)
                }
            }
        }
        failureName && (e[`#${failureName}1`] = function (e) {
            try {
                reject(e)
            } finally {
                timeout && clearTimeout(id)
            }
        })
        on(target, e, target[handleName] === null)
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
    anchor.href = getObjUrl(blob)
    anchor.click()
}