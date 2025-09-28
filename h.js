//# allFunctionsCalledOnLoad
// ^ idk what that actually does
!function () {
    'use strict'
    ''.includes || (String.prototype.includes = function (a, b) { return !!~this.indexOf(a, b) })
    function h(globalThis, Reflect) {
        /*let WeakSet = globalThis.WeakSet || function () {
            let a = new WeakMap
            return {
                add: function (t) { return a.set(t, true), this },
                has: function (t) { return a.has(t) },
                delete: function (t) { return a.delete(t) }
            }
        }*/
        //// let queueMicrotask = globalThis.queueMicrotask || setImmediate || setTimeout
        let MODULE = globalThis.Symbol ? Symbol.for("[[HModule]]") : '[[HModule]]'
        if (globalThis[MODULE]) return globalThis[MODULE]
        let $ = {}
        let sym = globalThis.Symbol ? Symbol.for("[[Events]]") : '[[Events]]',
            //  Don't collide, and make sure its usable across realms!!
            apply = Reflect.apply,
            gpo = Reflect.getPrototypeOf,
            // gopd = Reflect.getOwnPropertyDescriptor,
            dp = Reflect.defineProperty,
            ownKeys = Reflect.ownKeys
        //// , logger = { __proto__: null }
        //// {
        //// let aa = '%c@handle.js +color:pink;'.split('+')
        //// ,c = aa[0], cc = aa[1]
        //// function DelayedLog() {
        //// let args = [].slice.call(arguments)
        //// args.unshift(1, c, cc)
        //// queueMicrotask(this.bind.apply(this, args))
        //// }
        //// function LogOutOfGroup() {
        //// let args = [].slice.call(arguments)
        //// args.unshift(1, c, cc)
        //// setTimeout(this.bind.apply(this, args))
        //// }
        //// for (let i in console) {
        // Because the groupCollapsed() method was suppressing errors, delay them instead
        //// let old = console[i]
        //// if (typeof old === 'function')
        //// logger[i] = DelayedLog.bind(old),
        //// logger[i+"Late"] = LogOutOfGroup.bind(old)
        //// }
        //// }
        let source = Function.toString.call.bind(Function.prototype.toString)
        //// let warn=logger.warn, groupCollapsed=logger.groupCollapsed, groupEnd= logger.groupEnd
        let isArray = Array.isArray
        const allEvents = $.allEvents = new WeakMap
        //{
        //let { addEventListener, removeEventListener, dispatchEvent } = globalThis.EventTarget?.prototype ?? AbortSignal.prototype
        //if (source(addEventListener) !== source(Function.prototype).replace('function ', 'function addEventListener')
        //|| source(removeEventListener) !== source(Function.prototype).replace('function ', 'function removeEventListener')
        //|| source(dispatchEvent) !== source(Function.prototype).replace('function ', 'function dispatchEvent'))
        //    // adds ~20ms
        //    try {
        //        console.warn('Monkeypatch detected: ', addEventListener, removeEventListener, dispatchEvent)
        //        // in case they monkeypatch the EventTarget.prototype
        //        let n = document.createElement('iframe'),
        //            el = document.head ?? document
        //        el.append(n),
        //            { addEventListener, removeEventListener, dispatchEvent } = n.contentWindow
        //        n.contentWindow.close()
        //        el.removeChild(n)
        //        n = null
        //    } catch (e) {
        //        console.error(e)
        //    }
        //}
        // let verified = new WeakSet
        function nodeType(node) {
            return node.nodeType
            /*try {
                return (get = get || Function.call.bind(Object.getOwnPropertyDescriptor(Node.prototype, 'nodeType').get))(node)
            }
            catch {
                return 0 / 0
            }*/
        }

        function isValidET(target) {
            /*  let o
               let b
               let c
               let bool = target &&
                   (verified.has(target) || target instanceof EventTarget
                       || (o = target.ownerDocument) && (o = o.defaultView) && o.EventTarget.prototype.isPrototypeOf(target)
                       || (b = target.defaultView) && b.EventTarget.prototype.isPrototypeOf(target)
                       || (c = target.EventTarget) && c.prototype.isPrototypeOf(target)
                       || lastResort(target)) /*'addEventListener removeEventListener dispatchEvent'.split(' ').every(lastResort, target)*/
            // bool && verified.add(target)
            return 'addEventListener' in target && 'removeEventListener' in target && 'dispatchEvent' in target
        }

        function lastResort(target) {
            /*   let a = `${addEventListener}`,
                   d = `${dispatchEvent}`,
                   r = `${removeEventListener}`*/
            try {
                while (target = gpo(target)) {
                    // let ael = gopd(target, 'addEventListener')?.value,
                    //     rel = gopd(target, 'removeEventListener')?.value,
                    //     de = gopd(target, 'dispatchEvent')?.value,
                    //     label = gopd(target, Symbol.toStringTag)?.value
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
            } catch (e) {
                return false
            }
        }
        function getLabel(obj) {
            return {}.toString.call(obj).slice(8, -1).trim() || 'Object'
        }
        $.getLabel = getLabel
        let f
        function requestFile(accept, multiple) {
            f = f || Object.assign(document.createElement('input'), {
                type: 'file'
            })
            return new Promise(executor)
            function executor(resolve, oncancel) {
                function n() {
                    multiple ? resolve(f.files) : resolve([].at.call(f.files, -1))
                }
                return Object.assign(f, {
                    accept: accept,
                    multiple: multiple,
                    oncancel: oncancel,
                    onchange: n
                }).showPicker()
            }
        }
        $.requestFile = $.reqFile = requestFile
        let isAnimation = / /.test.bind(/^(animation(?:cancel|remove))$/),
            isFocus = / /.test.bind(/^(?:focus(?:in|out))$/),
            isDOMThing = / /.test.bind(/^(?:DOM(?:Activate|MouseScroll|Focus(?:In|Out)|(?:Attr|CharacterData|Subtree)Modified|NodeInserted(?:IntoDocument)?|NodeRemoved(?:FromDocument)?))$/),
            isMediaQuery = / /.test.bind(/^(?:\(.+\))$/)
        const reqFile = requestFile
        // let MSEventSyntax = /((?:(?<a>g)ot|(?<a>l)ost)(?<b>p)ointer(?<c>c)apture)|(?<a>p)ointer(?:(?<b>d)own|(?<b>c)ancel|(?<b>u)p|(?<b>e)nter|(?<b>l)eave|(?<b>m)ove|(?<b>o)(?:ut|ver))/
        function getIEPointerEvent(name) {
            let n = name.split('pointer')
                , prefix = n[0] && (name[0] === 'g' ? 'Got' : 'Lost')
                , p = n[1]
            return 'MS' + prefix + 'Pointer' + p[0].toUpperCase() + p.slice(1)
        }
        function getIEGestureEvent(name) {
                  let a = name.split('gesture')[1]
                  return 'MSGesture' + a[0].toUpperCase() + a.slice(1)
        }
        function verifyEventName(target, name) {
            let original = name
            name = name.toLowerCase()
            let valid = (customEvents.has(name) || 'on' + name in target ||
                ((original === 'DOMContentLoaded' && nodeType(target) === 9)
                    || (isAnimation(original) && 'onremove' in target)
                    || isFocus(original)
                    || (isDOMThing(original)))
                //Some events like the ones above don't have a handler
                || isMediaQuery(original)
            )
            if (!valid) {
                let v
                if ((v = 'onwebkit' + name) in target || (v = 'onmoz' + name) in target || (v = 'onms' + name) in target) return v.slice(2) + original
                if ((v = name.slice(0, 7)) === 'pointer') {
                    if ((v = 'mouse' + v) in target) return v // Better than nothing
                    return getIEPointerEvent(name)
                }
                if (name === 'wheel') {
                    if ((v = 'onmousewheel') in target) return v.slice(2) // iOS doesn't support 'wheel' events yet
                    if (typeof MouseScrollEvent === 'function') return'DOMMouseScroll' // If they don't support the first 2, this one will work ~100% of the time
                    return 'MozMousePixelScroll' // The last resort, since there's no way to detect support with this one
                }
                if (v === 'gesture') return getIEGestureEvent(name)
                if (name === 'inertiastart') return'MSInertiaStart' 
                //// logger.warnLate("'"+original+"' events might not be available on the following EventTarget:", target)
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
            let e = val.event,
                t = val.target
            t.dispatchEvent(e)
            this.delete(val)
        }
        let invalid = TypeError.bind(1, "🚫 Invalid event target")
        function delayedDispatch(id, target, event) {
            if (!isValidET(target)) throw invalid()
            delayedEvents.has(id) || delayedEvents.set(id, new Set)
            let set = delayedEvents.get(id)
            set.size || dispatchAllDelayed(id)
            set.add({
                target: target,
                event: event
            })
        }
        $.delayedDispatch = delayedDispatch
        function wait(ms) {
            return new Promise(resolveWithDelay.bind(1, ms))
        }
        $.wait = wait
        function resolveWithDelay(ms, resolve) {
            setTimeout(resolve, ms)
        }
        function getEventNames(target) {
            target.hasOwnProperty(sym) || dp(target, sym, { value: new Set })
            return target[sym]
        }
        $.getEventNames = getEventNames
        function hasEvent(target, eventName) {
            let a = target[sym]
            return !!(a && a.has(eventName))
        }
        $.hasEvent = hasEvent
        const CURRENT_TARGET = $.CURRENT_TARGET = '@',
            AUTO_ABORT = $.AUTO_ABORT = '#',
            TRUSTED = $.TRUSTED = '?',
            ONCE = $.ONCE = '_',
            PREVENT_DEFAULT = $.PREVENT_DEFAULT = '$',
            PASSIVE = $.PASSIVE = '^',
            CAPTURE = $.CAPTURE = '%',
            STOP_PROPAGATION = $.STOP_PROPAGATION = '&',
            STOP_IMMEDIATE_PROPAGATION = $.STOP_IMMEDIATE_PROPAGATION = '!'
        /*export const {
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
        */
        const customEvents = new Set
        function addCustomEvent(names) {
            for (let name in names) customEvents[names[name] ? 'add' : 'delete'](name.toLowerCase())
        }
        $.addCustomEvent = addCustomEvent
        const formatEventName = /[_$^%&!?@#]|^(?:bound )+/g
        function supportOrientationChangeEvent(target, eventName, label) {
            if (eventName === 'change' && label === 'ScreenOrientation') {
                let n = ['msonorientationchange', 'mozonorientationchange', 'orientationchange'].find(Reflect.has.bind(1, target))
                    , out = {
                        target: screen,
                        name: n
                    }
                if (!n) {
                    out.target = globalThis
                    out.name = 'orientationchange'
                }
                //// logger.warn("'"+eventName+"' was changed to '"+out.name+"' on "+getLabel(out.target))
                return out
            }
        }
        const FLAG_ONCE = 1,
            FLAG_PREVENTS = 2,
            FLAG_PASSIVE = 4,
            FLAG_CAPTURE = 8,
            FLAG_STOP_PROP = 16,
            FLAG_STOP_IMMEDIATE_PROPAGATION = 32,
            FLAG_ONLY_TRUSTED = 64,
            FLAG_ONLY_CURRENT_TARGET = 128,
            FLAG_AUTO_ABORT = 256
        function on(target, events, controller) {
            if (arguments.length > 3 && getLabel(controller) !== 'AbortController') {
                debugger
                controller = arguments[3]
            }
            if (!isValidET(target)) throw invalid()
            let names = ownKeys(events)
            if (!names.length) return target
            let label = getLabel(target)
            //// try {
            //// groupCollapsed("on("+label+")")
            //// logger.dirxml(target)
            const myEvents = getEventNames(target)
            if (typeof events === 'function') {
                let a = {}
                a[events.name] = events
                events = a
            }
            else if (isArray(events))
                events = Object.fromEntries(events)
            for (let i = names.length; i--;) {
                let eventName = names[i],
                    includes = ''.includes.bind(eventName)
                let func = events[eventName]
                const once = +includes(ONCE) && FLAG_ONCE,
                    prevents = +includes(PREVENT_DEFAULT) && FLAG_PREVENTS,
                    passive = +includes(PASSIVE) && FLAG_PASSIVE,
                    capture = +includes(CAPTURE) && FLAG_CAPTURE,
                    stopProp = +includes(STOP_PROPAGATION) && FLAG_STOP_PROP,
                    stopImmediateProp = +includes(STOP_IMMEDIATE_PROPAGATION) && FLAG_STOP_IMMEDIATE_PROPAGATION,
                    onlyTrusted = +includes(TRUSTED) && FLAG_ONLY_TRUSTED,
                    onlyCurrentTarget = +includes(CURRENT_TARGET) && FLAG_ONLY_CURRENT_TARGET,
                    autoabort = +includes(AUTO_ABORT) && FLAG_AUTO_ABORT,
                    options = {
                        capture: !!capture,
                        //once
                        passive: !!passive,
                    }
                const flags = once | prevents | passive | capture | stopProp | stopImmediateProp | onlyTrusted | onlyCurrentTarget | autoabort
                let newTarget = target
                if (flags & FLAG_PASSIVE && flags & FLAG_PREVENTS) throw TypeError("Cannot call 'preventDefault' on a passive function")
                eventName = verifyEventName(newTarget, eventName.replace(formatEventName, ''))
                let b = supportOrientationChangeEvent(target, eventName, label)
                if (b) {
                    newTarget = b.target
                    eventName = b.name
                }
                if (myEvents.has(eventName) && controller == null) {
                    console.warn("🔕 Skipped duplicate '" + eventName + "' listener. Call on() again with the signal parameter to bypass this.")
                    continue
                }
                controller && (options.once = !!once, options.signal = controller.signal)
                let type = getLabel(func)
                if (type === 'GeneratorFunction') {
                    let args = []
                    autoabort && args.push(controller.abort.bind(controller))
                    args.push(off.bind(null, target, eventName))
                    let iterator = apply(func, target, args)
                    func = iterator.next.bind(iterator)
                    // the first 'yield' has no value, for some reason 
                    //    ;(func = iterator.next.bind(iterator))() 
                }
                const listener = EventWrapper.bind(newTarget,
                    func, controller,
                    controller && controller.abort.bind(controller, 'Automatic abort'),
                    flags)
                if (autoabort && getLabel(controller) !== 'AbortController') throw TypeError("AbortController required if '#' (autoabort) is present")

                newTarget.addEventListener(eventName, listener, options /*,onlyTrusted*/)
                // if (eventName === 'load' && /^(?:HTMLIFrameElement|Window)$/.test(getLabel(target)) && (target.contentWindow || target).document?.readyState === 'complete') {
                // setTimeout(listener.bind(target, new Event('load')))
                // logger.warnLate(`'${eventName}' event was fired before listener was added`, target)
                // }
                if (controller) {
                    //// logger.info("📡 '"+eventName+"' event added")
                }
                else {
                    allEvents.has(newTarget) || allEvents.set(newTarget, new Map)
                    //A Map to hold the names & events
                    const myGlobalEventMap = allEvents.get(newTarget)
                    myGlobalEventMap.set(eventName, {
                        __proto__: null,
                        flags: flags,
                        listener: listener,
                    })
                    myEvents.add(eventName)
                    //// logger.info("🔔 '"+eventName+"' event added")
                }
            }
            //// }
            //// finally {
            //// groupEnd()
            //// }
            return target
        }
        $.on = on
        const customEventHandler = {
            has: function (t, p) {
                return p in t || p in Object(t.detail)
            },
            set: function (t, p, v) {
                return Reflect.set(p in t ? t : t.detail, p, v)
            },
            get: function (t, p) {
                if (p in t) return t[p]
                let detail = t.detail
                if (p in Object(detail)) {
                    let out = detail[p]
                    return typeof out === 'function' ? out.bind(detail) : out
                }
            }
        }
        function EventWrapper(f, s, abrt, flags) {
            let args = [].slice.call(arguments, 4)
            const t = flags & FLAG_ONLY_TRUSTED,
                oct = flags & FLAG_ONLY_CURRENT_TARGET,
                p = flags & FLAG_PREVENTS,
                sp = flags & FLAG_STOP_PROP,
                sip = flags & FLAG_STOP_IMMEDIATE_PROPAGATION,
                aa = flags & FLAG_AUTO_ABORT,
                once = flags & FLAG_ONCE
            let event = args[0],
                label = getLabel(event),
                name = event.type,
                currentTarget = event.currentTarget,
                detail = event.detail,
                push = args.push.bind(args)
            label === 'CustomEvent' ? event = args[0] = new Proxy(event, customEventHandler)
                : label === 'MouseScrollEvent' && (event.deltaZ = 0,
                    event.axis === 2 ?
                        (event.deltaX = 0, event.deltaY = 50 * detail) : event.axis === 1 &&
                        (event.deltaX = 50 * detail, event.deltaY = 0))
            s && push(abrt)
            push(off.bind(null, this, name))
            let result
            t && event.isTrusted || !t && (!oct || oct && (event.target || event.srcElement) === currentTarget) &&
                (result = apply(f, this, args),
                    p && (event.cancelable ? event.defaultPrevented ? console.warn("'" + name + "' event has already been cancelled") : event.preventDefault() : console.warn("🔊 '" + name + "' events are not cancelable"), event.returnValue = !p),
                    sp && (event.cancelBubble = !event.stopPropagation()),
                    sip && event.stopImmediatePropagation(),
                    aa && abrt(),
                    (once || (result && result.hasOwnProperty('value') && result.hasOwnProperty('done') && result.done === true)) && off(currentTarget, name))
        }

        function off(target
            // ...eventNames
        ) {
            let eventNames = [].slice.call(arguments, 1)
            if (!isValidET(target)) throw invalid()
            if (!eventNames.length || !allEvents.has(target)) return null
            let label = getLabel(target)
            //// try {
            //// groupCollapsed("off("+label+")")
            //// logger.dirxml(target)
            const map = allEvents.get(target),
                mySet = target[sym]
            for (let i = eventNames.length; i--;) {
                let newTarget = target
                    , name = verifyEventName(newTarget, eventNames[i]),
                    settings = map.get(name),
                    listener = settings.listener
                if (typeof name === 'object') {
                    newTarget = name.target
                    name = name.name
                }
                let b = supportOrientationChangeEvent(target, name, label)
                if (b) {
                    newTarget = b.target
                    name = b.name
                }
                newTarget.removeEventListener(name, listener, settings)
                map.delete(name)
                //// && logger.info("🔕 '"+name+"' event removed")
                mySet.delete(name)
                map.size || allEvents.delete(newTarget)
            }
            //// }
            //// finally {
            //// groupEnd()
            //// }
        }
        $.off = off
        function until(target, eventName, failureName, filter, timeout) {
            if (typeof filter === 'number') {
                timeout = filter
                filter = null
            }
            return new Promise(waitForEvent)
            function waitForEvent(resolve, reject) {
                let id = timeout && setTimeout(function (err) {
                    reject(err)
                    controller.abort(RangeError("⏰ Promise for '" + eventName + "' expired after " + timeout + "ms"))
                }, timeout)
                    , controller = new AbortController
                    , e = {}
                function hey(event, abort) {
                    if (!filter || (typeof filter === 'function' && filter(event))) try {
                        resolve(event)
                    } catch (e) {
                        reject(e)
                    } finally {
                        timeout && clearTimeout(id)
                        abort()
                    }
                }
                e[eventName] = hey
                if (failureName) {
                    function what(e, abort) {
                        try {
                            reject(e)
                        } catch (e) {
                            reportError(e)
                        } finally {
                            timeout && clearTimeout(id)
                            abort()
                        }
                    }
                    e[failureName] = what
                }
                on(target, e, controller)
            }
        }
        $.until = until
        let objectURLS,
            registry

        function getObjUrl(thingy) {
            if ((objectURLS = objectURLS || new WeakMap).has(thingy)) return objectURLS.get(thingy)
            let url = URL.createObjectURL(thingy);
            (registry = registry || new FinalizationRegistry(URL.revokeObjectURL)).register(thingy, url)
            objectURLS.set(thingy, url)
            return url
        }
        $.getObjUrl = getObjUrl
        let anchor
        function download(blob, title) {
            (anchor = anchor || document.createElement('a')).download = title || 'download'
            anchor.href = getObjUrl(blob)
            anchor.click()
        }
        $.download = download
        function delegate(me, events, filter, includeSelf, controller) {
            filter = filter || function () { }
            for (let i in events) {
                if (i.includes('@')) throw SyntaxError("Conflicting usage of a 'currentTarget' only delegating event handler")
                let old = events[i]
                events[i] = DelegationFunction
                function DelegationFunction(
                    // ...args
                ) {
                    let target = arguments[0].target
                    let res = filter(target);
                    (me !== target || includeSelf) && (res == null ? 1 : res) && apply(old, target, arguments)
                }
            }
            return on(me, events, controller)
        }
        $.delegate = delegate
        function dispatch(target, event) {
            return target.dispatchEvent(typeof event === 'string' ? new Event(event) : event)
        }
        $.dispatch = dispatch
        return constructor.prototype[MODULE] = $
    }
    let x = typeof globalThis === 'undefined' ? window : globalThis
    return h(x, x.Reflect || { apply: function (target, thisArg, args) { return target.apply(thisArg, args) }, getPrototypeOf: Object.getPrototypeOf || function (t) { return t.__proto__ }, /*getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,*/ defineProperty: Object.defineProperty, ownKeys: Object.getOwnPropertyNames, has: function (t, p) { return t in p } })
}()
