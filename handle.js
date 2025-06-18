//# allFunctionsCalledOnLoad
// ^ idk what that actually does
const sym = Symbol.for("🔔")
//  Don't collide, and make sure its usable across realms!!
// export const unbound = Symbol('⛓️‍💥')
const logger = {__proto__:null}
for(let i in console) {
    // Because the groupCollapsed() method was suppressing errors, delay them instead
    let old = console[i]
    if (typeof old !== 'function') continue
    logger[i] = DelayedLog
    logger[`${i}Late`] = LogOutOfGroup
    function DelayedLog(...args) {
        args.unshift(1)
        queueMicrotask(old.bind.apply(old, args))
    }
    function LogOutOfGroup(...args) {
        args.unshift(1)
        setTimeout(old.bind.apply(old, args))
    }
}
let { warn, groupCollapsed, groupEnd } = logger,
    { isArray } = Array
export const allEvents = new WeakMap
let { addEventListener, removeEventListener, dispatchEvent } = globalThis.EventTarget?.prototype ?? AbortSignal.prototype
if (globalThis.document)
    try {
        // in case they monkeypatch the EventTarget.prototype
        let n = document.createElement('iframe'),
            el = document.head ?? document
        el.append(n),
            { addEventListener, removeEventListener, dispatchEvent } = n.contentWindow
        el.removeChild(n)
        n = null
    } catch (e) {
        logger.debug(e)
    }
function isValidET(target) {
    return target &&
        (target instanceof EventTarget
            || target.ownerDocument?.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            || target.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            || target.EventTarget?.prototype.isPrototypeOf(target)
            || lastResort(target)) /*'addEventListener removeEventListener dispatchEvent'.split(' ').every(lastResort, target)*/
}

function lastResort(target) {
    try {
        let { toString } = Function.prototype
        do if (target[Symbol.toStringTag] === 'EventTarget'
            && target.constructor.name === 'EventTarget'
            && typeof target.addEventListener === 'function'
            && typeof target.removeEventListener === 'function'
            && typeof target.dispatchEvent === 'function'
            && toString.call(target.addEventListener) === `${addEventListener}`
            && toString.call(target.dispatchEvent) === `${dispatchEvent}`
            && toString.call(target.removeEventListener) === `${removeEventListener}`)
            return true
        while (target = Object.getPrototypeOf(target))
        return false
    } catch {
        return false
    }
}

function getLabel(obj) {
    try {
        return obj[Symbol.toStringTag] || obj.constructor?.name || Object.getPrototypeOf(obj).constructor[Symbol.toStringTag] || Object.getPrototypeOf(obj).constructor?.name
    } catch {
        return {}.toString.call(obj)
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
export const file = reqFile

function verifyEventName(target, name) {
    let original = name
    name = name.toLowerCase()
    let valid = (`on${name}` in target ||
        ((/^DOMContentLoaded$/.test(original) && (globalThis.Document?.prototype.isPrototypeOf(target) || target.contentWindow?.EventTarget.prototype.isPrototypeOf(target) || globalThis.HTMLDocument?.prototype.isPrototypeOf(target) || target.ownerDocument?.defaultView?.HTMLDocument.prototype.isPrototypeOf(target) || target.ownerDocument?.defaultView?.Document.prototype.isPrototypeOf(target)))
            || (/^(animation(?:cancel|remove))$/i.test(original) && 'onremove' in target)
            || /^(?:focus(?:in|out))$/i.test(original)
            || (/^(?:DOM(?:Activate|MouseScroll|Focus(?:In|Out)|(?:Attr|CharacterData|Subtree)Modified|NodeInserted(?:IntoDocument)?|NodeRemoved(?:FromDocument)?))$/.test(original)))
    )
    if (!valid) {
        if (`onwebkit${name}` in target) name = `webkit${original}`
        else if (`onmoz${name}` in target) name = `moz${original}`
        else if (`onms${name}` in target) name = `ms${original}`
        else {
            if (name.startsWith('pointer')) name = `mouse${name.slice(7)}`
            else if (name === 'wheel') {
                if ('onmousewheel' in target) name = 'mousewheel'
                else if ('MouseScrollEvent' in window) name = 'DOMMouseScroll'
                else name = 'MozMousePixelScroll'
            } else name = original
        }
        customEvents.has(name) || logger.warnLate(`'${original}' events might not be available on the following object:`, target)
        return name
    } else if (`on${name}` in target || valid) return original
    //Some events like the one above don't have a handler
    customEvents.has(original) || logger.warnLate(`'${original}' events might not be available on the following object:`, target)
    return original
}

const delayedEvents = new Map
    , giveItSomeTime = function (hold) {
        let secondparam = 100 //idk some random timeout
        if (hold === globalThis.requestIdleCallback)
            secondparam = { timeout: 1000 }
        return delay
        function delay(callback) {
            return hold(callback, secondparam)
        }
    }(globalThis.queueMicrotask ?? globalThis.requestIdleCallback ?? globalThis.setImmediate ?? globalThis.setTimeout)

function dispatchAllDelayed(id) {
    let all = delayedEvents.get(id)
    giveItSomeTime(emitPendingEvents)

    function emitPendingEvents() {
        all.forEach(dispatchAndDelete)
    }
}

function dispatchAndDelete(val, i, set) {
    let { target: t, event: e } = val
    dispatchEvent.call(t, e)
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
    target.hasOwnProperty(sym) || Object.defineProperty(target, sym, { value: new Set })
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
    for (let name in names) customEvents[names[name] ? 'add' : 'delete'](name.toLowerCase())
}

const formatEventName = /[_$^%&!?@#\d]|bound /g

export function on(target, events, signal) {
    if (arguments.length > 3 && getLabel(signal) !== 'AbortController') signal = arguments[3]
    // if (typeof unused !== 'undefined') debugger
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    if (!Object.keys(events).length) return target
    try {
        groupCollapsed(`on(${getLabel(target)})`)
        logger.dirxml(target)
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
                logger.warnLate(`🔕 Skipped duplicate '${eventName}' listener`)
                continue
            }
            if (signal) {
                options.once = once
                options.signal = signal.signal
            }
            let Remove = target.removeEventListener.bind(target, eventName, EventHandlerWrapperFunction, options),
                Abort = AutoAbort.bind(signal)

            function EventHandlerWrapperFunction(...args) {
                let { 0: event } = args
                if (getLabel(event) === 'CustomEvent') {
                    let { detail } = event
                    for (let i in detail) {
                        // i wish for in included symbols :<
                        if (i in event) {
                            logger.warnLate(`The '${i}' property of a CustomEvent was ignored since it would overwrite an existing property: `, event[i])
                            continue
                        }
                        event[i] = detail[i]
                    }
                } else if (getLabel(event) === 'MouseScrollEvent') {
                    event.deltaZ = 0
                    if (event.axis === 2)
                        event.deltaX = 0,
                            event.deltaY = 50 * event.detail
                    else if (event.axis === 1)
                        event.deltaX = 50 * event.detail,
                            event.deltaY = 0
                }
                signal && args.push(Abort, Remove)
                onlyTrusted && event.isTrusted || !onlyTrusted && (!onlyCurrentTarget || onlyCurrentTarget && event.target === event.currentTarget) &&
                    (Reflect.apply(func, target, args),
                        prevents && (event.cancelable ? event.preventDefault() : warn(`🔊 '${eventName}' events are not cancelable`)),
                        stopProp && event.stopPropagation(),
                        stopImmediateProp && event.stopImmediatePropagation(),
                        autoabort && Abort(),
                        once && off(event.currentTarget, eventName))
            }
            addEventListener.call(target, eventName, EventHandlerWrapperFunction, options)
            if (signal)
                logger.info(`📡 '${eventName}' event added`)
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
                    prevents,
                    stopProp,
                    once,
                    stopImmediateProp,
                    autoabort
                })
                myEvents.add(eventName)
                logger.info(`🔔 '${eventName}' event added`)
            }
        }
    } catch (e) {
        throw e
        // queueMicrotask(reportError.bind(globalThis, e))
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
        logger.dirxml(target)
        const map = allEvents.get(target),
            mySet = target[sym]
        for (let { length } = eventNames; length--;) {
            const name = verifyEventName(target, eventNames[length]),
                settings = map.get(name),
                { listener } = settings
            removeEventListener.call(target, name, listener, settings)
            map.has(name) && logger.info(`🔕 '${name}' event removed`)
            map.delete(name)
            mySet.delete(name)
            map.size || allEvents.delete(target)
        }
    } catch (e) {
        throw e
        // queueMicrotask(reportError.bind(globalThis, e))
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
        on(target, e, 1, signal)
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