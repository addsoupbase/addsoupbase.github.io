//# allFunctionsCalledOnLoad
// ^ idk what that actually does
const sym = Symbol.for("🔔")
//  Don't collide, and make sure its usable across realms!!
// export const unbound = Symbol('⛓️‍💥')
let {warn, groupCollapsed, groupEnd} = console,
    {isArray} = Array
export const allEvents = new WeakMap
function isValidET(target) {   
    return target &&
        (target instanceof EventTarget
            || target.ownerDocument?.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            || target.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            || target.EventTarget?.prototype.isPrototypeOf(target))
}
function getLabel(obj) {
    try {
    return obj[Symbol.toStringTag] || obj.constructor?.name || Object.getPrototypeOf(obj).constructor[Symbol.toStringTag] || Object.getPrototypeOf(obj).constructor?.name
    }
    catch {
        return{}.toString.call(obj)
    }
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
function verifyEventName(target, name) {
    let original = name
    name = name.toLowerCase()
    if (`on${name}`in target) return original
    if (`onwebkit${name}`in target) return`webkit${original}`
    if (`onmoz${name}`in target) return`moz${original}`
    if (`onms${name}`in target) return`ms${original}`
    if (/^domcontentloaded$/i.test(original) &&
        (globalThis.Document?.prototype.isPrototypeOf(target)
            || globalThis.HTMLDocument?.prototype.isPrototypeOf(target)
            || target.ownerDocument?.defaultView?.HTMLDocument.prototype.isPrototypeOf(target)
            || target.ownerDocument?.defaultView?.Document.prototype.isPrototypeOf(target))
        ||
        /^(animation(?:cancel|remove))$/i.test(original) && 'onremove'in target)
        return original
    //Some events like the one above don't have a handler
    customEvents.has(name) || queueMicrotask(console.warn.bind(1, `'${original}' events might not be available on the following object:`, target))
    return original
}
const delayedEvents = new Map
    , giveItSomeTime = function (hold) {
    let secondparam = 100 //idk some random timeout
    if (hold === globalThis.requestIdleCallback)
        secondparam = {timeout: 1000}
    return delay
    function delay(callback) {
        return hold(callback, secondparam)
    }
}(globalThis.queueMicrotask??globalThis.requestIdleCallback??globalThis.setImmediate??globalThis.setTimeout)
function dispatchAllDelayed(id) {
    let all = delayedEvents.get(id)
    giveItSomeTime(emitPendingEvents)
    function emitPendingEvents() {
        all.forEach(dispatchAndDelete)
    }
}
function dispatchAndDelete(val, i, set) {
    let {target:t, event:e} = val
    t.dispatchEvent(e)
    set.delete(val)
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
} = ({
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
export function addCustomEvent(names) {
    for(let name in names) customEvents[names[name]?'add':'delete'](name.toLowerCase())
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
        groupCollapsed(`on(${getLabel(target)})`)
        console.dirxml(target)
        const myEvents = getEventNames(target)
        if (typeof events === 'function') events = {
            [events.name]: events
        }
        else if (isArray(events))
            events = Object.fromEntries(events)
        // if (signal) signal.signal.onabort = console.debug.bind(1, 'Aborted: ', signal)
        for (let eventName in events) {
            const func = events[eventName],
             once = eventName.includes(ONCE),
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
            let Remove = target.removeEventListener.bind(target, eventName, EventHandlerWrapperFunction, options),
                Abort = AutoAbort.bind(signal)
            function EventHandlerWrapperFunction(...args) {
                let {0: event} = args
                if (getLabel(event) === 'CustomEvent') {
                    let {detail} = event
                    for (let i in detail) {
                        // i wish for in included symbols :<
                        if (i in event) {
                            warn(`The '${i}' property of a CustomEvent was ignored since it would overwrite an existing property: `, event[i])
                            continue
                        }
                        event[i] = detail[i]
                    }
                }
                signal&&args.push(Abort, Remove)
                onlyTrusted&&event.isTrusted || !onlyTrusted && (!onlyCurrentTarget || onlyCurrentTarget && event.target === event.currentTarget) &&
                (Reflect.apply(func,target, args),
                stopImmediateProp && event.stopImmediatePropagation(),
                stopProp && event.stopPropagation(),
                prevents&&(event.cancelable?event.preventDefault():warn(`🔊 '${eventName}' events are not cancelable`)),
                autoabort&&Abort(),
                once&&off(event.currentTarget, eventName))
            }
           /* Object.defineProperty(EventHandlerWrapperFunction, unbound, {
                value: func,
                configurable: 1
            })*/
            if (useHandler)
                // console.warn('Using handler property is deprecated')
                target[`on${eventName}`] = EventHandlerWrapperFunction
            else target.addEventListener(eventName, EventHandlerWrapperFunction, options)
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
                    listener: EventHandlerWrapperFunction,
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
function AutoAbort() {
    this.abort('Automatic abort')
}
export function off(target, ...eventNames) {
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    if (!eventNames.length || !allEvents.has(target)) return null
    try {
        groupCollapsed(`off(${getLabel(target)})`)
        console.dirxml(target)
        const map = allEvents.get(target),
            mySet = target[sym]
        for (let {length} = eventNames; length--;) {
            const name = verifyEventName(target, eventNames[length]),
                settings = map.get(name),
                {listener, capture, passive, handler} = settings
            handler?target[`on${name}`]=null:target.removeEventListener(name,listener,settings)
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
    return new Promise(waitForEvent)
    function waitForEvent(resolve, reject) {
        const str = `⏰ Promise for '${eventName}' expired after ${timeout} ms`
            , id = timeout && setTimeout(err => {
            reject(err)
            signal.abort(str)
        }, timeout, RangeError(str))
            , handleName = `on${eventName}`
        let signal = new AbortController
            , e = {
            [`#${eventName}`](event) {
                try {
                    resolve(event)
                } catch (e) {
                    reject(e)
                } finally {
                    timeout && clearTimeout(id)
                }
            }
        }
        failureName && Object.assign(e, {
            [`#${failureName}`](e) {
                try {
                    reject(e)
                } catch (e) {
                    reportError(e)
                } finally {
                    timeout && clearTimeout(id)
                }
            }
        })
        on(target, e, target[handleName] === null, signal)
    }
}
let objectURLS,
    registry
export function getObjUrl(thingy) {
    if ((objectURLS ??= new WeakMap).has(thingy)) return objectURLS.get(thingy)
    let url = URL.createObjectURL(thingy);
    (registry ??= new FinalizationRegistry(URL.revokeObjectURL)).register(thingy, url)
    objectURLS.set(thingy, url)
    return url
}
let anchor
export function download(blob, title) {
    (anchor ??= document.createElement('a')).download = title ?? 'download'
    anchor.href = getObjUrl(blob)
    anchor.click()
}
