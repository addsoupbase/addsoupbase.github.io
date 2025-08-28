//# allFunctionsCalledOnLoad
// ^ idk what that actually does
const sym = Symbol.for("[[Events]]")
    //  Don't collide, and make sure its usable across realms!!
    , { apply, getPrototypeOf: gpo, getOwnPropertyDescriptor: gopd, defineProperty: dp, ownKeys } = Reflect
    // , logger = { __proto__: null }
// {
    // let { 0: c, 1: cc } = '%c@handle.js +color:pink;'.split('+')
    // function DelayedLog(...args) {
        // args.unshift(1, c, cc)
        // queueMicrotask(this.bind.apply(this, args))
    // }
    // function LogOutOfGroup(...args) {
        // args.unshift(1, c, cc)
        // setTimeout(this.bind.apply(this, args))
    // }
    // for (let i in console) {
        // Because the groupCollapsed() method was suppressing errors, delay them instead
        // let old = console[i]
        // if (typeof old === 'function')
            // logger[i] = DelayedLog.bind(old),
                // logger[`${i}Late`] = LogOutOfGroup.bind(old)
    // }
// }
let source = Function.toString.call.bind(Function.prototype.toString)
// let { warn, groupCollapsed, groupEnd } = logger,
let { isArray } = Array
export const allEvents = new WeakMap
let add, remove, dip
/*{
    let { addEventListener, removeEventListener, dispatchEvent } = globalThis.EventTarget?.prototype ?? AbortSignal.prototype
    if (source(addEventListener) !== source(Function.prototype).replace('function ', 'function addEventListener')
    || source(removeEventListener) !== source(Function.prototype).replace('function ', 'function removeEventListener')
    || source(dispatchEvent) !== source(Function.prototype).replace('function ', 'function dispatchEvent'))
        // adds ~20ms
        try {
            console.warn('Monkeypatch detected: ', addEventListener, removeEventListener, dispatchEvent)
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
        }*/
add = addEventListener.call.bind(addEventListener)
remove = removeEventListener.call.bind(removeEventListener)
dip = dispatchEvent.call.bind(dispatchEvent)
let verified = new WeakSet
let get
function nodeType(node) {
    try {
        return (get = get || Function.call.bind(Object.getOwnPropertyDescriptor(Node.prototype, 'nodeType').get))(node)
    }
    catch {
        return 0 / 0
    }
}

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
        r = `${removeEventListener}`
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
                && source(ael) === a
                && source(de) === d
                && source(rel) === r)
                return true
        }
        return false
    } catch {
        return false
    }
}

export function getLabel(obj) {
    return {}.toString.call(obj).slice(8, -1).trim() || 'Object'
}
let f
export function requestFile(accept, multiple) {
    f = f || Object.assign(document.createElement('input'), {
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
let isMediaQuery = / /.test.bind(/^(?:\(.+\))$/)
function verifyEventName(target, name) {
    let original = name
    name = name.toLowerCase()
    let valid = (customEvents.has(name) || `on${name}` in target ||
        ((original === 'DOMContentLoaded' && nodeType(target) === 9)
            || (/^(animation(?:cancel|remove))$/.test(original) && 'onremove' in target)
            || /^(?:focus(?:in|out))$/.test(original)
            || (/^(?:DOM(?:Activate|MouseScroll|Focus(?:In|Out)|(?:Attr|CharacterData|Subtree)Modified|NodeInserted(?:IntoDocument)?|NodeRemoved(?:FromDocument)?))$/.test(original)))
        //Some events like the ones above don't have a handler
        || isMediaQuery(original)
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
        // logger.warnLate(`'${original}' events might not be available on the following EventTarget:`, target)
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
    }(globalThis.queueMicrotask || globalThis.requestIdleCallback || globalThis.setImmediate || setTimeout, 100)

function dispatchAllDelayed(id) {
    giveItSomeTime(emitPendingEvents.bind(delayedEvents.get(id)))
}
function emitPendingEvents() {
    this.forEach(dispatchAndDelete, this)
}
function dispatchAndDelete(val) {
    let { target: t, event: e } = val
    dip(t, e)
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
    currentTarget: '@', //Only call function if (event.target === event.currentTarget)
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
const formatEventName = /[_$^%&!?@#]|bound /g
function supportOrientationChangeEvent(target, eventName, label) {
    if (eventName === 'change' && label === 'ScreenOrientation') {
        let n = ['msonorientationchange', 'mozonorientationchange', 'orientationchange'].find(Reflect.has.bind(1, target))
            , out = {
                target: screen,
                name: n
            }
        if (!n) {
            out.target = window
            out.name = 'orientationchange'
        }
        // logger.warn(`'${eventName}' was changed to '${out.name}' on ${getLabel(out.target)}`)
        return out
    }
}
export function on(target, events, controller) {
    arguments.length > 3 && getLabel(controller) !== 'AbortController' && (controller = arguments[3])
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    let names = ownKeys(events)
    if (!names.length) return target
    let label = getLabel(target)
    // try {
        // groupCollapsed(`on(${label})`)
        // logger.dirxml(target)
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
            let newTarget = target
            if (prevents && passive) throw TypeError("Cannot call 'preventDefault' on a passive function")
            eventName = verifyEventName(newTarget, eventName.replace(formatEventName, ''))
            let b = supportOrientationChangeEvent(target, eventName, label)
            if (b) {
                newTarget = b.target
                eventName = b.name
            }
            if (myEvents.has(eventName) && controller == null) {
                // logger.warnLate(`🔕 Skipped duplicate '${eventName}' listener. Call on() again with the signal parameter to bypass this.`)
                continue
            }
            controller && (options.once = once, options.signal = controller.signal)
            const listener = EventWrapper.bind(newTarget, [
                func, controller,
                controller?.abort.bind(controller, 'Automatic abort'),
                onlyTrusted,
                onlyCurrentTarget,
                prevents, stopProp,
                stopImmediateProp,
                autoabort,
                once,
                eventName])
            if (autoabort && getLabel(controller) !== 'AbortController') throw TypeError("AbortController required if '#' (autoabort) is present")
            add(newTarget, eventName, listener, options, /*onlyTrusted*/)
            // if (eventName === 'load' && /^(?:HTMLIFrameElement|Window)$/.test(getLabel(target)) && (target.contentWindow || target).document?.readyState === 'complete') {
            // setTimeout(listener.bind(target, new Event('load')))
            // logger.warnLate(`'${eventName}' event was fired before listener was added`, target)
            // }
            if (controller) {
                // logger.info(`📡 '${eventName}' event added`)
            } 
            else {
                allEvents.has(newTarget) || allEvents.set(newTarget, new Map)
                //A Map to hold the names & events
                const myGlobalEventMap = allEvents.get(newTarget)
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
                // logger.info(`🔔 '${eventName}' event added`)
            }
        }
    // }
    // finally {
        // groupEnd()
    // }
    return target
}
const customEventHandler = {
    has(t, p) {
        return p in t || p in Object(t.detail)
    },
    set(t, p, v) {
        return Reflect.set(p in t ? t : t.detail, p, v)
    },
    get(t, p) {
        if (p in t) return t[p]
        let { detail } = t
        if (p in Object(detail)) {
            let out = detail[p]
            return typeof out === 'function' ? out.bind(detail) : out
        }
    }
}
function EventWrapper({ 0: f, 1: s, 2: abrt, 3: t, 4: oct, 5: p, 6: sp, 7: sip, 8: aa, 9: once, 10: name }, ...args) {
    let { 0: event } = args,
        label = getLabel(event),
        { currentTarget } = event,
        { detail } = event,
        push = args.push.bind(args)
    if (label === 'CustomEvent') event = args[0] = new Proxy(event, customEventHandler)
    else if (label === 'MouseScrollEvent')
        event.deltaZ = 0,
            event.axis === 2 ?
                (event.deltaX = 0, event.deltaY = 50 * detail) : event.axis === 1 &&
                (event.deltaX = 50 * detail, event.deltaY = 0)
    s && push(abrt)
    push(off.bind(null, this, name))
    t && event.isTrusted || !t && (!oct || oct && (event.target || event.srcElement) === currentTarget) &&
        (apply(f, this, args),
            p && (event.cancelable ? event.defaultPrevented ? console.warn(`'${name}' event has already been cancelled`) : event.preventDefault() : warn(`🔊 '${name}' events are not cancelable`), event.returnValue = !p),
            sp && (event.cancelBubble = !event.stopPropagation()),
            sip && event.stopImmediatePropagation(),
            aa && abrt(),
            once && off(currentTarget, name))
}

export function off(target, ...eventNames) {
    if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
    if (!eventNames.length || !allEvents.has(target)) return null
    let label = getLabel(target)
    // try {
        // groupCollapsed(`off(${label})`)
        // logger.dirxml(target)
        const map = allEvents.get(target),
            mySet = target[sym]
        for (let i = eventNames.length; i--;) {
            let newTarget = target
            const name = verifyEventName(newTarget, eventNames[i]),
                settings = map.get(name),
                { listener } = settings
            if (typeof name === 'object') {
                newTarget = name.target
                name = name.name
            }
            let b = supportOrientationChangeEvent(target, name, label)
            if (b) {
                newTarget = b.target
                name = b.name
            }
            remove(newTarget, name, listener, settings)
            map.delete(name) 
            // && logger.info(`🔕 '${name}' event removed`)
            mySet.delete(name)
            map.size || allEvents.delete(newTarget)
        }
    // }
    // finally {
        // groupEnd()
    // }
}

export function until(target, eventName, failureName, filter, timeout) {
    if (typeof filter === 'number') {
        timeout = filter
        filter = null
    }
    return new Promise(waitForEvent)
    function waitForEvent(resolve, reject) {
        let id = timeout && setTimeout(err => {
            let str = `⏰ Promise for '${eventName}' expired after ${timeout} ms`
            reject(err)
            controller.abort(RangeError(str))
        }, timeout)
            , controller = new AbortController
            , e = {
                [`${eventName}`](event, abort) {
                    if (!filter || (typeof filter === 'function' && filter(event))) try {
                        resolve(event)
                    } catch (e) {
                        reject(e)
                    } finally {
                        timeout && clearTimeout(id)
                        abort()
                    }
                }
            }
        failureName && Object.assign(e, {
            [`${failureName}`](e, abort) {
                try {
                    reject(e)
                } catch (e) {
                    reportError(e)
                } finally {
                    timeout && clearTimeout(id)
                    abort()
                }
            }
        })
        on(target, e, controller)
    }
}

let objectURLS,
    registry

export function getObjUrl(thingy) {
    if ((objectURLS = objectURLS || new WeakMap).has(thingy)) return objectURLS.get(thingy)
    let url = URL.createObjectURL(thingy);
    (registry = registry || new FinalizationRegistry(URL.revokeObjectURL)).register(thingy, url)
    objectURLS.set(thingy, url)
    return url
}

let anchor

export function download(blob, title) {
    (anchor = anchor || document.createElement('a')).download = title || 'download'
    anchor.href = getObjUrl(blob)
    anchor.click()
}

export function delegate(me, events, filter, includeSelf, controller) {
    filter = filter || function () { }
    for (let i in events) {
        if (i.includes('@')) throw SyntaxError("Conflicting usage of a 'currentTarget' only delegating event handler")
        let old = events[i]
        events[i] = DelegationFunction
        function DelegationFunction(...args) {
            let { target } = args[0];
            let res = filter(target)
                (me !== target || includeSelf) && (res == null ? 1 : res) && apply(old, target, args)
        }
    }
    return on(me, events, controller)
}
export function dispatch(target, event) {
    return dip(target, typeof event === 'string' ? new Event(event) : event)
}