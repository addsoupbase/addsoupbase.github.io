//# allFunctionsCalledOnLoad
// ^ idk what that actually does
const sym = Symbol.for("🔔")
    //  Don't collide, and make sure its usable across realms!!
    // export const unbound = Symbol('⛓️‍💥')
    , { apply, getPrototypeOf: gpo, getOwnPropertyDescriptor: gopd, defineProperty: dp, ownKeys } = Reflect
    , logger = { __proto__: null }
{
    let { 0: c, 1: cc } = '%c@handle.js +color:pink;'.split('+')
    function DelayedLog(...args) {
        args.unshift(1, c, cc)
        queueMicrotask(this.bind.apply(this, args))
    }
    function LogOutOfGroup(...args) {
        args.unshift(1, c, cc)
        setTimeout(this.bind.apply(this, args))
    }
    for (let i in console) {
        // Because the groupCollapsed() method was suppressing errors, delay them instead
        let old = console[i]
        if (typeof old !== 'function') continue
        logger[i] = DelayedLog.bind(old)
        logger[`${i}Late`] = LogOutOfGroup.bind(old)
    }
    // str.push(`${i}(...args)${DelayedLog.toString().match(/\{.*}/s)[0].replace('old.bind.apply(old',`super.${i}.bind(1`)}, ${i}Late(...args)${LogOutOfGroup.toString().match(/\{.*}/s)[0].replace('old.bind.apply(old',`super.${i}.bind(1`)}`)
}
// console.debug(str.join(','))
let { warn, groupCollapsed, groupEnd } = logger,
    { isArray } = Array
export const allEvents = new WeakMap
let add,remove,dispatch
{
    let { addEventListener, removeEventListener, dispatchEvent } = globalThis.EventTarget?.prototype ?? AbortSignal.prototype
    if (Function.prototype.toString.call(addEventListener) !== Function.prototype.toString().replace('function ', 'function addEventListener'))
        // adds ~20ms
    try {
        console.warn('Monkeypatch detected: ', addEventListener)
        // in case they monkeypatch the EventTarget.prototype
        let n = document.createElement('iframe'),
        el = document.head ?? document
        el.append(n),
        { addEventListener, removeEventListener, dispatchEvent } = n.contentWindow
        n.contentWindow.close()
        el.removeChild(n)
        n = null
    } catch (e) {
        console.error(e)
    }
    add = addEventListener.call.bind(addEventListener)
    remove = removeEventListener.call.bind(removeEventListener)
    dispatch = dispatchEvent.call.bind(dispatchEvent)
}
let verified = new WeakSet
function isValidET(target) {
    let bool = target &&
        (verified.has(target) || target instanceof EventTarget
            || target.ownerDocument?.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            || target.defaultView?.EventTarget.prototype.isPrototypeOf(target)
            || target.EventTarget?.prototype.isPrototypeOf(target)
            || lastResort(target)) /*'addEventListener removeEventListener dispatchEvent'.split(' ').every(lastResort, target)*/
    bool && verified.add(target)
    return !!bool
}

function lastResort(target) {
    let a = `${addEventListener}`,
        d = `${dispatchEvent}`,
        r = `${removeEventListener}`,
        { toString } = Function.prototype
    try {
        while (target = gpo(target)) {
            let ael = gopd(target, 'addEventListener')?.value,
                rel = gopd(target, 'removeEventListener')?.value,
                de = gopd(target, 'dispatchEvent')?.value,
                label = gopd(target, Symbol.toStringTag)?.value
            if (label === 'EventTarget'
                // && target.constructor.name === 'EventTarget'
                // && typeof ael === 'function'
                // && typeof rel === 'function'
                // && typeof de === 'function'
                && toString.call(ael) === a
                && toString.call(de) === d
                && toString.call(rel) === r)
                return true
        }
        return false
    } catch {
        return false
    }
}

export function getLabel(obj) {
    return {}.toString.call(obj).slice(8, -1) || 'Object'
    /*
    try {
        let proto
        return obj[Symbol.toStringTag] || obj.constructor?.name || (proto = gpo(obj)).constructor[Symbol.toStringTag] || proto.constructor?.name || 'Object'
    } catch {
        return {}.toString.call(obj).slice(8, -1) || 'Unknown'
    }*/
}
let f
export function requestFile(accept, multiple) {
    f ??= Object.assign(document.createElement('input'), {
        type: 'file'
    })
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

export const reqFile = requestFile

function verifyEventName(target, name) {
    let original = name
    name = name.toLowerCase()
    let valid = (customEvents.has(name) || `on${name}` in target ||
        ((original === 'DOMContentLoaded' && (target instanceof Document || target instanceof HTMLDocument || target.ownerDocument?.defaultView?.HTMLDocument.prototype.isPrototypeOf(target) || target.ownerDocument?.defaultView?.Document.prototype.isPrototypeOf(target) || target.defaultView?.Document.prototype.isPrototypeOf(target) || target.defaultView?.HTMLDocument?.prototype.isPrototypeOf(target)))
            || (/^(animation(?:cancel|remove))$/i.test(original) && 'onremove' in target)
            || /^(?:focus(?:in|out))$/i.test(original)
            || (/^(?:DOM(?:Activate|MouseScroll|Focus(?:In|Out)|(?:Attr|CharacterData|Subtree)Modified|NodeInserted(?:IntoDocument)?|NodeRemoved(?:FromDocument)?))$/.test(original)))
        //Some events like the ones above don't have a handler
    )
    if (!valid) {
        if (`onwebkit${name}` in target) return `webkit${original}`
        if (`onmoz${name}` in target) return `moz${original}`
        if (`onms${name}` in target) return `ms${original}`
        if (name.startsWith('pointer')) return `mouse${name.slice(7)}` // Better than nothing
        if (name === 'wheel') {
            if ('onmousewheel' in target) return 'mousewheel' // iOS doesn't support 'wheel' events yet
            if (typeof MouseScrollEvent === 'function') return 'DOMMouseScroll' // If they don't support the first 2, this one will work ~100% of the time
            return 'MozMousePixelScroll' // The last resort, since there's no way to detect support with this one
        }
        logger.warnLate(`'${original}' events might not be available on the following object:`, target)
    }
    return original
}

const delayedEvents = new Map
    , giveItSomeTime = function (hold, secondparam) {
        hold === globalThis.requestIdleCallback &&
            (secondparam = { timeout: 1000 })
        return delay
        function delay(callback) {
            return hold(callback, secondparam)
        }
    }(globalThis.queueMicrotask ?? globalThis.requestIdleCallback ?? globalThis.setImmediate ?? globalThis.setTimeout, 100)

function dispatchAllDelayed(id) {
    giveItSomeTime(emitPendingEvents.bind(delayedEvents.get(id)))
}
function emitPendingEvents() {
    this.forEach(dispatchAndDelete, this)
}
function dispatchAndDelete(val) {
    let { target: t, event: e } = val
    dispatch(t, e)
    this.delete(val)
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
    return new Promise(resolveWithDelay.bind(1, ms))
}
function resolveWithDelay(ms, resolve) {
    setTimeout(resolve, ms)
}
export function getEventNames(target) {
    target.hasOwnProperty(sym) || dp(target, sym, { value: new Set })
    return target[sym]
}

export function hasEvent(target, eventName) {
    return !!target[sym]?.has(eventName)
}

export const {
    currentTarget: CURRENT_TARGET, autoAbort: AUTO_ABORT, trusted: TRUSTED, once: ONCE,
    preventDefault: PREVENT_DEFAULT, passive: PASSIVE,
    capture: CAPTURE, stopPropagation: STOP_PROPAGATION, stopImmediatePropagation: STOP_IMMEDIATE_PROPAGATION
} = {
    currentTarget: '@', //Only call function if event.target === event.currentTarget
    autoAbort: '#', //Automatically abort all listeners with the same signal
    trusted: '?', //Only call function if (event.isTrusted)
    once: '_', //Automatically removed after first call
    preventDefault: '$',  //Automatically calls event.preventDefault() if possible
    passive: '^',
    capture: '%',
    stopPropagation: '&', //Automatically calls event.stopPropagation()
    stopImmediatePropagation: '!', //Automatically calls event.stopImmediatePropagation()
}
const customEvents = new Set

export function addCustomEvent(names) {
    for (let name in names) customEvents[names[name] ? 'add' : 'delete'](name.toLowerCase())
}

const formatEventName = /[_$^%&!?@#\d]|bound /g

export function on(target, events, signal) {
    arguments.length > 3 && getLabel(signal) !== 'AbortController' && (signal = arguments[3])
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    let names = ownKeys(events)
    if (!names.length) return target
    try {
        groupCollapsed(`on(${getLabel(target)})`)
        logger.dirxml(target)
        const myEvents = getEventNames(target)
        if (typeof events === 'function') events = {
            [events.name]: events
        }
        else if (isArray(events))
            events = Object.fromEntries(events)
        for (let { length: i } = names; i--;) {
            let eventName = names[i],
                includes = ''.includes.bind(eventName)
            const func = events[eventName],
                once = includes(ONCE),
                prevents = includes(PREVENT_DEFAULT),
                passive = includes(PASSIVE),
                capture = includes(CAPTURE),
                stopProp = includes(STOP_PROPAGATION),
                stopImmediateProp = includes(STOP_IMMEDIATE_PROPAGATION),
                onlyTrusted = includes(TRUSTED),
                onlyCurrentTarget = includes(CURRENT_TARGET),
                autoabort = includes(AUTO_ABORT),
                options = {
                    capture,
                    //once
                    passive,
                }
            if (prevents && passive) throw TypeError("Cannot call 'preventDefault' on a passive function")
            eventName = verifyEventName(target, eventName.replace(formatEventName, ''))
            if (myEvents.has(eventName) && signal == null) {
                logger.warnLate(`🔕 Skipped duplicate '${eventName}' listener. Call on() again with the signal parameter to bypass this.`)
                continue
            }
            signal && (options.once = once, options.signal = signal.signal)
            const listener = EventWrapper.bind(
                target, func, signal, 
                signal?.abort.bind(signal, 'Automatic abort'),
                onlyTrusted,
                onlyCurrentTarget,
                prevents, stopProp,
                stopImmediateProp,
                autoabort,
                once,
                eventName,
            )
            if (autoabort && getLabel(signal) !== 'AbortController') throw TypeError("AbortController required if '#' (autoabort) is present")
            add(target, eventName, listener, options)
            if (signal) logger.info(`📡 '${eventName}' event added`)
            else {
                allEvents.has(target) || allEvents.set(target, new Map)
                //A Map to hold the names & events
                const myGlobalEventMap = allEvents.get(target)
                myGlobalEventMap.set(eventName, {
                    __proto__: null,
                    onlyCurrentTarget,
                    passive,
                    capture,
                    onlyTrusted,
                    listener,
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
    }
    finally {
        groupEnd()
    }
    return target
}

function EventWrapper(f,s,abrt,t,oct,p,sp,sip,aa,once,name,...args) {
    let { 0: event } = args,
        label = getLabel(event),
        { currentTarget } = event,
        { detail } = event
    if (label === 'CustomEvent')
        for (let i in detail)
            // i wish for in included symbols :<
            i in event ? console.warn(`The '${i}' property of a CustomEvent was ignored since it would overwrite an existing property: `, event[i]) : event[i] = detail[i]
    else if (label === 'MouseScrollEvent')
        event.deltaZ = 0,
            event.axis === 2 ?
                (event.deltaX = 0, event.deltaY = 50 * detail) : event.axis === 1 &&
                (event.deltaX = 50 * detail, event.deltaY = 0)
    s&&args.push(abrt)
    args.push(off.bind(null, this, name))
    t&&event.isTrusted||!t&&(!oct||oct&&(event.target??event.srcElement)===currentTarget) &&
        (apply(f, this, args),
            p && (event.cancelable ? event.defaultPrevented ? console.warn(`'${name}' event has already been cancelled`) : event.preventDefault() : warn(`🔊 '${name}' events are not cancelable`), event.returnValue = !p),
            sp && (event.cancelBubble = true, event.stopPropagation()),
            sip && event.stopImmediatePropagation(),
            aa && abrt(),
            once && off(currentTarget, name))
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
            remove(target, name, listener, settings)
            map.delete(name) && logger.info(`🔕 '${name}' event removed`)
            mySet.delete(name)
            map.size || allEvents.delete(target)
        }
    }
    finally {
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
function nothing() { }
export function delegate(me, events, filter, includeSelf, signal) {
    filter ??= nothing
    for (let i in events) {
        if (i.includes('@')) throw SyntaxError("Conflicting usage of a 'currentTarget' only delegating event handler")
        let old = events[i]
        events[i] = DelegationFunction
        function DelegationFunction(...args) {
            let { target } = args[0];
            (me !== target || includeSelf) && (filter(target) ?? 1) && apply(old, target, args)
        }
    }
    return on(me, events, signal)
}
/*if(`${location}`.includes('localhost')) {
    try {
        let log = console.debug.bind(1,'%c[PressureObserver] ','color:pink;')
        function callback(changes) {
    log.apply(1,changes)
        }
        let observer = new PressureObserver(callback)
        await observer.observe('cpu', {
            sampleInterval: 1000,
        })
    }
    catch (e) {
        console.error(e)
    }
}*/