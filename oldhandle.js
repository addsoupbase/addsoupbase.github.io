!function(globalThis) {
    'use strict'
    if (globalThis.EventTarget) {
    EventTarget.prototype.addEventListener = EventTarget.prototype.addEventListener || EventTarget.prototype.attachEvent
    EventTarget.prototype.removeEventListener = EventTarget.prototype.removeEventListener || EventTarget.prototype.detachEvent
    }
    String.prototype.includes || Object.defineProperty(String.prototype, 'includes', {
        writable: 1,
        configurable: 1,
        value: function (str) {
            return this.indexOf(str) !== -1
        }
    })
    Object.fromEntries = Object.fromEntries || function (entries) {
        var out = {}
        entries.forEach(function (entry) {
            out[entry[0]] = entry[1]
        })
        return out
    }
    var queueMicrotask = (globalThis.queueMicrotask || globalThis.setImmediate || function (callback) {
        setTimeout(callback)
    })
    var gen = globalThis.Symbol
    if (gen == null) gen = function (desc) {
        desc = ((desc+'') || 'oiemrnebh').split('').map(function (n) {
            return n.repeat(10)
        }).join('')
        return desc.split('').map(function (n) {
            return n.charCodeAt()
        }).join(desc)
    }
    else gen = gen.for
    var sym = gen("🔔")
//  Don't collide, and make sure its usable across realms!!
    var isArray = Array.isArray
        , allEvents = new WeakMap
        , isValidET = function (target) {
        return !!(target.addEventListener && target.removeEventListener)
        if (target) {
            if (target instanceof EventTarget) return true
            var ownerDocument = target.ownerDocument
            if (t != null) {
                var defaultView = ownerDocument.defaultView
                if (defaultView != null) {
                    var is1 = defaultView.EventTarget.prototype.isPrototypeOf(target)
                    if (is1) return true
                }
            }
            var dfltView = target.defaultView
            if (dfltView != null) {
                var is2 = dfltView.EventTarget.prototype.isPrototypeOf(target)
                if (is2) return true
            }
            var evtrg = target.EventTarget
            if (evtrg != null) {
                var is3 = evtrg.isPrototypeOf(target)
                if (is3) return true
            }
        }
        return false
    }

    var getLabel = function (obj) {
        try {
            return obj.constructor.name || Object.getPrototypeOf(obj).constructor.name
        } catch (e) {
            return {}.toString.call(obj)
        }
    }

    var verifyEventName = function (target, name) {
        var original = name
        name = name.toLowerCase()
        var c1 = globalThis.Document
        if (c1 != null) c1 = c1.prototype.isPrototypeOf(target)
        var c2 = globalThis.HTMLDocument
        if (c2 != null) c2 = c2.prototype.isPrototypeOf(target)
        var c3 = target.ownerDocument
        if (c3 != null) {
            c3 = c3.defaultView
            if (c3 != null)
                c3 = c3.HTMLDocument.prototype.isPrototypeOf(target) || c3.Document.prototype.isPrototypeOf(target)
        }
        if (!(('on' + name) in target) && !(/^domcontentloaded$/i.test(original) &&
                (c1 || c2 || c3) ||
                /^(animation(?:cancel|remove))$/i.test(original) && 'onremove' in target)
            && !(/^focus(?:in|out)$/.test(name))
        ) {
            if (('onwebkit' + name) in target) name = 'webkit' + original
            else if (('onmoz' + name) in target) name = 'moz' + original
            else if (('onms' + name) in target) name = 'ms' + original
            else {
                if (/^pointer/.test(name)) name = 'mouse' + name.slice(7)
                else if (name === 'wheel') {
                    if ('onmousewheel' in target) name = 'mousewheel'
                    else if ('MouseScrollEvent' in globalThis) name = 'DOMMouseScroll'
                    else name = 'MozMousePixelScroll'
                } else name = original
            }
            // customEvents.has(name) || queueMicrotask(console.warn.bind(1, ["'", original, "'", 'events might not be available on the following object:'].join(''), target))
            return name
        } else if (('on' + name) in target) return original
        //Some events like the one above don't have a handler
        // customEvents.has(original) || queueMicrotask(console.warn.bind(1, ["'", original, "'", 'events might not be available on the following object:'].join(''), target))
        return original
    }

    var delayedEvents = new Map
        , giveItSomeTime = function (hold) {
        var secondparam = 100 //idk some random timeout
        if (hold === globalThis.requestIdleCallback)
            secondparam = {timeout: 1000}
        return function delay(callback) {
            return hold(callback, secondparam)
        }
    }(globalThis.queueMicrotask || globalThis.requestIdleCallback || globalThis.setImmediate || globalThis.setTimeout)

    var dispatchAllDelayed = function (id) {
        var all = delayedEvents.get(id)
        giveItSomeTime(function () {
            all.forEach(dispatchAndDelete)
        })
    }

    var dispatchAndDelete = function (val, i, set) {
        var t = val.target,
            e = val.event
        t.dispatchEvent(e)
        set.delete(val)
    }

    var delayedDispatch = function (id, t, e) {
        if (!isValidET(t)) throw TypeError("🚫 Invalid event target")
        delayedEvents.has(id) || delayedEvents.set(id, new Set)
        var set = delayedEvents.get(id)
        set.size || dispatchAllDelayed(id)
        set.add({
            target: t,
            event: e,
        })
    }
    var wait = function (ms) {
        return {
            then: function (fn, fail) {
                try {
                    setTimeout(fn, ms)
                } catch (e) {
                    typeof fail === 'function' && fail(e)
                }
            },
        }
    }
    var getEventNames = function (target) {
        target.hasOwnProperty(sym) || Object.defineProperty(target, sym, {value: new Set})
        return target[sym]
    }
    var hasEvent = function (target, eventName) {
        return target[sym] ? target[sym].has(eventName) : false
    }
    var CURRENT_TARGET = '@',
        AUTO_ABORT = '#',
        TRUSTED = '?',
        ONCE = '_',
        PREVENT_DEFAULT = '$',
        PASSIVE = '^',
        CAPTURE = '%',
        STOP_PROPAGATION = '&',
        STOP_IMMEDIATE_PROPAGATION = '!',
        customEvents = new Set
    var addCustomEvent = function (names) {
        for (let name in names) customEvents[names[name] ? 'add' : 'delete'](name.toLowerCase())
    }
    var formatEventName = /[_$^%&!?@#\d]|bound /g
    var on = function (target, events, unused, signal) {
        if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
        if (!Object.keys(events).length) return target
        try {
            // groupCollapsed(['on(', getLabel(target), ')'].join(''))
            // console.log(target)
            var myEvents = getEventNames(target)
            if (typeof events === 'function') {
                var temp1 = events.name,
                    temp2 = events
                events = {}
                events[temp1] = temp2
            } else if (isArray(events))
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
                        capture: capture,
                        //once
                        passive: passive,
                    }
                eventName = verifyEventName(target, eventName.replace(formatEventName, ''))
                if (myEvents.has(eventName) && signal == null) {
                    // queueMicrotask(warn.bind(1, ["🔕 Skipped duplicate '", eventName, "' listener"].join('')))
                    continue
                }
                if (signal) {
                    options.once = once
                    options.signal = signal.signal
                }
                var EventHandlerWrapperFunction = function() {
                    var args = [].slice.call(arguments)
                        , event = args[0]
                    if (getLabel(event) === 'CustomEvent') {
                        var detail = event.detail
                        for (var i in detail) {
                            // i wish for in included symbols :<
                            if (i in event) {
                                // warn(["The '", i, "' property of a CustomEvent was ignored since it would overwrite an existing property: "].join(''), event[i])
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
                    (func.apply(target, args),
                    prevents && (event.cancelable ? event.preventDefault() : 1/*warn(["🔊 '", eventName, "' events are not cancelable"].join('')*/),
                    stopProp && event.stopPropagation(),
                    stopImmediateProp && event.stopImmediatePropagation(),
                    autoabort && Abort(),
                    once && off(event.currentTarget, eventName))
                }
                var Remove = target.removeEventListener.bind(target, eventName, EventHandlerWrapperFunction, options),
                    Abort = AutoAbort.bind(signal)



                target.addEventListener(eventName, EventHandlerWrapperFunction, options)
                    allEvents.has(target) || allEvents.set(target, new Map)
                    //A Map to hold the names & events
                    var myGlobalEventMap = allEvents.get(target)
                    myGlobalEventMap.set(eventName, {
                        onlyCurrentTarget: onlyCurrentTarget,
                        passive: passive,
                        capture: capture,
                        onlyTrusted: onlyTrusted,
                        listener: EventHandlerWrapperFunction,
                        prevents: prevents,
                        stopProp: stopProp,
                        once: once,
                        stopImmediateProp: stopImmediateProp,
                        autoabort: autoabort,
                    })
                    myEvents.add(eventName)
                    // console.info(["🔔 '", eventName, "' event added"].join(''))

            }
        } catch (e) {
            // queueMicrotask(console.error.bind(globalThis, e))
        } finally {
            // groupEnd()
        }
        return target
    }

    var AutoAbort = function() {
        this.abort('Automatic abort')
    }

    var off = function (target) {
        var eventNames = [].slice.call(arguments, 1)
        if (!isValidET(target)) throw TypeError("🚫 Invalid event target")
        if (!eventNames.length || !allEvents.has(target)) return null
        try {
            // groupCollapsed(["off(", getLabel(target), ")"].join(''))
            // console.log(target)
            var map = allEvents.get(target),
                mySet = target[sym]
            for (var length = eventNames.length; length--;) {
                var name = verifyEventName(target, eventNames[length]),
                    settings = map.get(name),
                    listener = settings.listener
                target.removeEventListener(name, listener, settings)
                // map.has(name) && console.info(["🔕 '", name, "' event removed"].join(''))
                map.delete(name)
                mySet.delete(name)
                map.size || allEvents.delete(target)
            }
        } catch (e) {
            // queueMicrotask(console.error.bind(globalThis, e))
        } finally {
            // groupEnd()
        }
    }
    /*export function until(target, eventName, failureName, timeout) {
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
            on(target, e, 1, signal)
        }
    }*/
    var anchor
        , download = function (blob, title) {
        (anchor = anchor || document.createElement('a')).download = title == null ? 'download' : title
        anchor.href = URL.createObjectURL(blob)
        anchor.click()
    }
    return globalThis.h = Object.seal({
        __proto__: null,
        download: download,
        allEvents: allEvents,
        delayedDispatch: delayedDispatch,
        wait: wait,
        getEventNames: getEventNames,
        hasEvent: hasEvent,
        CURRENT_TARGET: CURRENT_TARGET,
        AUTO_ABORT: AUTO_ABORT,
        TRUSTED: TRUSTED,
        ONCE: ONCE,
        PREVENT_DEFAULT: PREVENT_DEFAULT,
        PASSIVE: PASSIVE,
        CAPTURE: CAPTURE,
        STOP_PROPAGATION: STOP_PROPAGATION,
        STOP_IMMEDIATE_PROPAGATION: STOP_IMMEDIATE_PROPAGATION,
        customEvents: customEvents,
        addCustomEvent: addCustomEvent,
        on: on,
        off: off
    })
}((Object.defineProperty(constructor.prototype,"__global__",{configurable:1,get:function(){delete Object.getPrototypeOf(this).__global__;return this}}),__global__))