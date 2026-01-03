//// var h = 
(function handle(globalThis) {
    'use strict'
    //// var queueMicrotask = globalThis.queueMicrotask || globalThis.setImmediate || setTimeout
    var MODULE = Symbol.for("[[HModule]]")
    if (globalThis[MODULE]) return globalThis[MODULE]
    var $ = {},
        sym = Symbol.for("[[Events]]"),
        //  Don't collide, and make sure its usable across realms!!
        apply = Reflect.apply,
        dp = Reflect.defineProperty,
        ownKeys = Reflect.ownKeys
    //// , logger = { __proto__: null }
    //// !function(){
    //// var aa = '%c@handle.js +color:pink;'.split('+')
    //// ,c = aa[0], cc = aa[1]
    //// function DelayedLog() {
    //// var args = [].slice.call(arguments)
    //// args.unshift(1, c, cc)
    //// queueMicrotask(this.bind.apply(this, args))
    //// }
    //// function LogOutOfGroup() {
    //// var args = [].slice.call(arguments)
    //// args.unshift(1, c, cc)
    //// setTimeout(this.bind.apply(this, args))
    //// }
    //// for (var i in console) {
    // Because the groupCollapsed() method was suppressing errors, delay them instead
    //// var old = console[i]
    //// if (typeof old === 'function')
    //// old=old.bind(console),
    //// logger[i] = DelayedLog.bind(old),
    //// logger[i+"Late"] = LogOutOfGroup.bind(old)
    //// }
    //// }()
    ////var source = Function.toString.call.bind(Function.prototype.toString)
    //// , warn=logger.warn, groupCollapsed=logger.groupCollapsed, groupEnd= logger.groupEnd
    var isArray = Array.isArray
        , allEvents = $.allEvents = new WeakMap
    //// globalThis.allEvents = allEvents
    function isValidET(target) {
        return target === Object(target) && 'addEventListener' in target && 'removeEventListener' in target && 'dispatchEvent' in target
    }
    $.isValid = isValidET
    function getLabel(obj) {
        return {}.toString.call(obj).slice(8, -1).trim() || 'Object'
    }
    $.getLabel = getLabel
    var f
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
    function emptyFileInput() {
        f = Object.assign(document.createElement('input'), {
            type: 'file'
        })
    }
    $.emptyFileInput = emptyFileInput
    $.requestFile = $.reqFile = requestFile
    var test = handle.bind.bind(/ /.test),
        isAnimation = test(/^(animation(?:cancel|remove))$/),
        isFocus = test(/^(?:focus(?:in|out))$/),
        isDOMThing = test(/^(?:DOM(?:Activate|MouseScroll|Focus(?:In|Out)|(?:Attr|CharacterData|Subtree)Modified|NodeInserted(?:IntoDocument)?|NodeRemoved(?:FromDocument)?))$/),
        isMediaQuery = test(/^(?:\(.+\))$/)
    // var reqFile = requestFile
    var isTouch = test(/^(?:touch(?:cancel|end|move|start|forcechange))$/)
    // var MSEventSyntax = /((?:(?<a>g)ot|(?<a>l)ost)(?<b>p)ointer(?<c>c)apture)|(?<a>p)ointer(?:(?<b>d)own|(?<b>c)ancel|(?<b>u)p|(?<b>e)nter|(?<b>l)eave|(?<b>m)ove|(?<b>o)(?:ut|ver))/
    function getIEPointerEvent(name) {
        var n = name.split('pointer')
            , prefix = n[0] && (name[0] === 'g' ? 'Got' : 'Lost')
            , p = n[1]
        return 'MS' + prefix + 'Pointer' + p[0].toUpperCase() + p.substring(1)
    }
    function getIEGestureEvent(name) {
        var a = name.split('gesture')[1]
        return 'MSGesture' + a[0].toUpperCase() + a.substring(1)
    }
    function pointerToMouse(e, target) {
        if (e === 'cancel') e = 'out'
        if ('on' + (e = 'mouse' + e) in target) return e
    }
    // var vendors = /^(?:webkit|ms|moz)(?!$)/
    function verifyEventName(target, name) {
        var original = name
        name = name.toLowerCase()
        var valid = (customEvents.has(name) || 'on' + name in target ||
            ((original === 'DOMContentLoaded' && target.nodeType === 9)
                || (isAnimation(original) && 'onremove' in target)
                || isFocus(original)
                || isTouch(original)
                || (isDOMThing(original)))
            //Some events like the ones above don't have a handler
            || isMediaQuery(original)
        )
        if (!valid) {
            var v
            if ((v = 'onwebkit' + name) in target || (v = 'onmoz' + name) in target || (v = 'onms' + name) in target) return v.substring(2) + original
            if ((v = name.substring(0, 7)) === 'pointer') {
                var canB = pointerToMouse(name.substring(7), target)
                if (canB) return canB
                if (IE) return getIEPointerEvent(name)
            }
            if (name === 'wheel') {
                if ((v = 'onmousewheel') in target) return v.substring(2) // iOS doesn't support 'wheel' events yet
                if (typeof MouseScrollEvent === 'function') return 'DOMMouseScroll' // If they don't support the first 2, this one will work ~100% of the time
                return 'MozMousePixelScroll' // The last resort, since there's no way to detect support with this one
            }
            if (IE && v === 'gesture') return getIEGestureEvent(name)
            if (name === 'inertiastart') return 'MSInertiaStart'
            //// logger.warnLate("'"+original+"' events might not be available on the following EventTarget:", target)
        }
        return original
    }
    var delayedEvents = new Map
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
        var e = val.event,
            t = val.target
        t.dispatchEvent(e)
        this.delete(val)
    }
    var invalid = TypeError.bind(1, "🚫 Invalid event target")
    function delayedDispatch(id, target, event) {
        if (!isValidET(target)) throw invalid()
        delayedEvents.has(id) || delayedEvents.set(id, new Set)
        var set = delayedEvents.get(id)
        set.size || dispatchAllDelayed(id)
        set.add({
            target: target,
            event: event
        })
    }
    $.delayedDispatch = delayedDispatch
    function wait(ms) {
        return new Promise(resolveWithDelay.bind(void 0, ms))
    }
    $.wait = wait
    function resolveWithDelay(ms, resolve) {
        setTimeout(resolve, ms)
    }
    function dispatchEvent(type, target, init, constr) {
        type = verifyEventName(target, type)
        var event = new (constr || Event)(type, init)
        return target.dispatchEvent(event)
    }
    $.dispatchEvent = dispatchEvent
    function getEventNames(target) {
        var a = target.hasOwnProperty(sym) ? target[sym] : (dp(target, sym, { value: a = new Set }), a)
        return a
    }
    $.getEventNames = getEventNames
    function hasEvent(target, eventName) {
        var a = target[sym]
        return !!(a && a.has(eventName))
    }
    $.hasEvent = hasEvent
    var CURRENT_TARGET = $.CURRENT_TARGET = '@',
        AUTO_ABORT = $.AUTO_ABORT = '#',
        TRUSTED = $.TRUSTED = '?',
        ONCE = $.ONCE = '_',
        PREVENT_DEFAULT = $.PREVENT_DEFAULT = '$',
        PASSIVE = $.PASSIVE = '^',
        CAPTURE = $.CAPTURE = '%',
        STOP_PROPAGATION = $.STOP_PROPAGATION = '&',
        STOP_IMMEDIATE_PROPAGATION = $.STOP_IMMEDIATE_PROPAGATION = '!',
        // FireFox only:
        WANTS_UNTRUSTED = $.WANTS_UNTRUSTED = '|', // not really sure what this even does
        ONLY_ORIGINAL_TARGET = $.ONLY_ORIGINAL_TARGET = '>',
        ONLY_EXPLICIT_ORIGINAL_TARGET = $.ONLY_EXPLICIT_ORIGINAL_TARGET = '<'
    /*export var {
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
    var customEvents = new Set
    function addCustomEvent(names) {
        for (var name in names) customEvents[names[name] ? 'add' : 'delete'](name.toLowerCase())
    }
    $.addCustomEvent = addCustomEvent
    var formatEventName = /[_$^%&!?@#<>|]|^(?:bound )+/g
    function supportOrientationChangeEvent(target, eventName, label) {
        if (eventName === 'change' && label === 'ScreenOrientation') {
            var n = ['msonorientationchange', 'mozonorientationchange', 'orientationchange'].find(Reflect.has.bind(1, target))
                , out = {
                    target: screen,
                    name: n
                }
            if (!n) {
                var hi
                if ('ondeviceorientation' in globalThis || (hi = 'onorientationchange' in globalThis)) {
                    out.target = globalThis
                    if (hi) out.name = 'orientationchange'
                }
            }
            //// logger.warn("'"+eventName+"' was changed to '"+out.name+"' on "+getLabel(out.target))
            return out
        }
    }
    var SUPPORTS_OPTIONS_PARAM = function () {
        var out = false
            , h = { get capture() { out = true } }
            // that's genius!
            , f = '',
            g = Function.prototype
        addEventListener(f, g, h)
        removeEventListener(f, g, h)
        return out
    }()
    var FLAG_ONCE = 1,
        FLAG_PREVENTS = 2,
        FLAG_PASSIVE = 4,
        FLAG_CAPTURE = 8,
        FLAG_STOP_PROP = 16,
        FLAG_STOP_IMMEDIATE_PROPAGATION = 32,
        FLAG_ONLY_TRUSTED = 64,
        FLAG_ONLY_CURRENT_TARGET = 128,
        FLAG_AUTO_ABORT = 256,
        FLAG_WANTS_UNTRUSTED = 512,
        FLAG_ONLY_ORIGINAL_TARGET = 1024,
        FLAG_ONLY_EXPLICIT_ORIGINAL_TARGET = 2048
    function on(target, events, controller, _) {
        if (typeof _ !== 'undefined' && getLabel(controller) !== 'AbortController') {
            debugger
            controller = _
        }
        if (!isValidET(target)) throw invalid()
        var names = ownKeys(events)
        if (!names.length) return target
        var label = getLabel(target)
        //// try {
        //// groupCollapsed("on("+label+")")
        //// logger.dirxml(target)
        var myEvents = getEventNames(target)
        if (typeof events === 'function') !function () {
            var a = {}
            a[events.name] = events
            events = a
        }()
        else if (isArray(events))
            events = Object.fromEntries(events)
        for (var i = names.length; i--;) {
            var eventName = names[i],
                includes = ''.includes.bind(eventName),
                func = events[eventName],
                once = +includes(ONCE) && FLAG_ONCE,
                prevents = +includes(PREVENT_DEFAULT) && FLAG_PREVENTS,
                passive = +includes(PASSIVE) && FLAG_PASSIVE,
                capture = +includes(CAPTURE) && FLAG_CAPTURE,
                stopProp = +includes(STOP_PROPAGATION) && FLAG_STOP_PROP,
                stopImmediateProp = +includes(STOP_IMMEDIATE_PROPAGATION) && FLAG_STOP_IMMEDIATE_PROPAGATION,
                onlyTrusted = +includes(TRUSTED) && FLAG_ONLY_TRUSTED,
                onlyCurrentTarget = +includes(CURRENT_TARGET) && FLAG_ONLY_CURRENT_TARGET,
                autoabort = +includes(AUTO_ABORT) && FLAG_AUTO_ABORT,
                wantsUntrusted = +includes(WANTS_UNTRUSTED) && FLAG_WANTS_UNTRUSTED,
                onlyOriginalTarget = +includes(ONLY_ORIGINAL_TARGET) && FLAG_ONLY_ORIGINAL_TARGET,
                onlyExplicitOriginalTarget = +includes(ONLY_EXPLICIT_ORIGINAL_TARGET) && FLAG_ONLY_EXPLICIT_ORIGINAL_TARGET,
                options = {
                    capture: !!capture,
                    //once
                    passive: !!passive
                },
                flags = once | prevents | passive | capture | stopProp | stopImmediateProp | onlyTrusted | onlyCurrentTarget | autoabort | wantsUntrusted | onlyOriginalTarget | onlyExplicitOriginalTarget,
                newTarget = target
            if (flags & FLAG_PASSIVE && flags & FLAG_PREVENTS) {
                // let {caller} = on, a = []
                // do a.push(caller); while(caller = caller.caller)
                // console.log(...a)
                throw TypeError("Cannot call 'preventDefault' on a passive function")
            }
            eventName = verifyEventName(newTarget, eventName.replace(formatEventName, ''))
            var b = supportOrientationChangeEvent(target, eventName, label)
            if (b) {
                newTarget = b.target
                eventName = b.name
            }
            if (myEvents.has(eventName) && controller == null) throw TypeError("Duplicate '" + eventName + "' listener not allowed if 'signal' parameter is absent")
            // console.warn
            controller && (options.once = !!once, options.signal = controller.signal)
            var type = getLabel(func)
            if (type === 'GeneratorFunction') {
                var args = []
                autoabort && args.push(controller.abort.bind(controller))
                args.push(off.bind(null, target, eventName))
                var iterator = func.call(target, args[0])
                    , started = false
                func = function (e) {
                    started || (started = iterator.next())
                    return iterator.next(e)
                }
                // func = iterator.next.bind(iterator)
                // the first 'yield' has no value, for some reason 
                //    ;(func = iterator.next.bind(iterator))() 
            }
            var listener = EventWrapper.bind(newTarget, func, controller, controller && controller.abort.bind(controller, 'Automatic abort (#)'), flags)
            if (autoabort && getLabel(controller) !== 'AbortController') throw TypeError("AbortController required if #autoabort flag is present")
            newTarget.addEventListener(eventName, listener, SUPPORTS_OPTIONS_PARAM ? options : options.capture/*, typeof scrollMaxX === 'number' && wantsUntrusted*/)
            if (controller) {
                //// logger.info("📡 '"+eventName+"' event added", controller)
            }
            else {
                allEvents.has(newTarget) || allEvents.set(newTarget, new Map)
                // A Map to hold the names & events
                var myGlobalEventMap = allEvents.get(newTarget)
                myGlobalEventMap.set(eventName, {
                    // __proto__: null,
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
    var SAFARI = $.safari = typeof ongestureend !== 'undefined' || typeof onwebkitmouseforceup !== 'undefined'
        , FIREFOX = $.firefox = typeof scrollMaxX === 'number'
        , IE = $.ie = typeof msAnimationStartTime === 'number'
        , CHROME = $.chrome = typeof chrome === 'object'  // chromium based (opera, edge, brave)
    function compatOn(variants) {
        if (CHROME) var data = variants.chrome
        else if (FIREFOX) data = variants.firefox
        else if (SAFARI) data = variants.safari
        else if (IE) data = variants.ie
        return (data = data || variants.otherwise) && on.apply(null, data)
    }
    $.compatOn = compatOn
    var customEventHandler = typeof Proxy === 'function' && {
        has: function (t, p) {
            return p in t || p in Object(t.detail)
        },
        set: function (t, p, v) {
            return (p in t ? t : t.detail)[p] = v, true
        },
        get: function (t, p) {
            if (p in t) return t[p]
            var detail = t.detail
            if (p in Object(detail)) {
                var out = detail[p]
                return typeof out === 'function' ? out.bind(detail) : out
            }
        }
    }
    function EventWrapper(f, s, abrt, flags) {
        var args = [].slice.call(arguments, EventWrapper.length),
            t = flags & FLAG_ONLY_TRUSTED,
            oct = flags & FLAG_ONLY_CURRENT_TARGET,
            p = flags & FLAG_PREVENTS,
            sp = flags & FLAG_STOP_PROP,
            sip = flags & FLAG_STOP_IMMEDIATE_PROPAGATION,
            aa = flags & FLAG_AUTO_ABORT,
            once = flags & FLAG_ONCE,
            originalTarget = flags & FLAG_ONLY_ORIGINAL_TARGET,
            explicitOriginalTarget = flags & FLAG_ONLY_EXPLICIT_ORIGINAL_TARGET,
            event = args[0],
            label = getLabel(event),
            name = event.type,
            currentTarget = event.currentTarget,
            detail = event.detail
        switch (label) {
            case 'CustomEvent':
                event = args[0] = new Proxy(event, customEventHandler)
                break
            case 'MouseScrollEvent':
                event.deltaZ = 0
                if (event.axis === 2) {
                    event.deltaX = 0
                    event.deltaY = 50 * detail
                }
                else if (event.axis === 1) {
                    event.deltaX = 50 * detail
                    event.deltaY = 0
                }
                break
        }
        s && args.push(abrt)
        args.push(off.bind(void 0, this, name))
        if (t && event.isTrusted || !t && (!originalTarget || !('originalTarget' in event) || event.originalTarget === currentTarget) && (!explicitOriginalTarget || !('explicitOriginalTarget' in event) || event.explicitOriginalTarget === currentTarget) && (!oct || (event.target || event.srcElement) === currentTarget)) {
            switch (args.length) {
                case 2: var result = f.call(this,event, args[1])
                    break
                case 3: result = f.call(this,event, args[1], args[2])
                    break
                default: result = apply(f, this, args)
            }
            if (p)
                if (event.cancelable)
                    if (event.defaultPrevented) console.warn("'" + name + "' event has already been cancelled")
                    else event.returnValue = !event.preventDefault()
                else console.warn("🔊 '" + name + "' events are not cancelable")
            if (sp) event.cancelBubble = !event.stopPropagation()
            sip && event.stopImmediatePropagation()
            aa && abrt()
            if (once || (result && result.propertyIsEnumerable('value') && result.propertyIsEnumerable('done') && result.done === true)) off(currentTarget, name)
        }
        // return result
    }
    function off(target
        // ,...eventNames
    ) {
        var eventNames = [].slice.call(arguments, off.length)
        if (!isValidET(target)) throw invalid()
        if (!eventNames.length || !allEvents.has(target)) return null
        var label = getLabel(target)
        //// try {
        //// groupCollapsed("off("+label+")")
        //// logger.dirxml(target)
        var map = allEvents.get(target),
            mySet = target[sym]
        for (var i = eventNames.length; i--;) {
            var newTarget = target
                , name = verifyEventName(newTarget, eventNames[i]),
                settings = map.get(name),
                listener = settings.listener
            if (typeof name === 'object') {
                newTarget = name.target
                name = name.name
            }
            var b = supportOrientationChangeEvent(target, name, label)
            if (b) {
                newTarget = b.target
                name = b.name
            }
            var capture = !!(settings.flags & FLAG_CAPTURE)
            newTarget.removeEventListener(name, listener, SUPPORTS_OPTIONS_PARAM ? { capture: capture } : capture)
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
    function filterResult(event, filter) {
        if (typeof filter !== 'function') return true
        var hi = { __proto__: null }
        hi[event.type] = event
        return filter(hi)
    }
    function until(target, settings, _, $, t) {
        if (typeof settings === 'object') {
            var events = settings.events,
                failures = settings.failure,
                filter = settings.filter,
                timeout = settings.timeout
        }
        else {
            events = settings
            failures = _
            timeout = t
            if (typeof (filter = $) === 'number') {
                timeout = filter
                filter = null
            }
        }
        return new Promise(waitForEvent)
        function waitForEvent(resolve, reject) {
            var controller = new AbortController
            if (timeout > 0) {
                if (AbortSignal.timeout) {
                    var n = AbortSignal.timeout(timeout)
                    n.onabort = function () {
                        var reason = n.reason
                        reject(reason)
                        controller.abort(reason)
                    }
                }
                else {
                    var id = setTimeout(function () {
                        var err = RangeError("⏰ Promise for '" + events + "' expired after " + timeout + "ms")
                        reject(err)
                        controller.abort(err)
                    }, timeout)
                }
            }
            var e = {}
            function onsuccess(event, abort) {
                if (filterResult(event, filter)) try {
                    resolve(event)
                } catch (e) {
                    reject(e)
                } finally {
                    timeout && clearTimeout(id)
                    abort()
                }
            }
            if (typeof events === 'string') events = events.split(' ')
            for (var i = events.length; i--;) e[events[i]] = onsuccess
            if (failures) for (var i = (failures = typeof failures === 'string' ? failures.split(' ') : failures).length,onfail; i--;) e[failures[i]] = onfail || (onfail =
                function onfail(event, abort) {
                    if (filterResult(event, filter))
                        try {
                            reject(event)
                        } catch (e) {
                            reportError(e)
                        } finally {
                            timeout && clearTimeout(id)
                            abort()
                        }
                })
            on(target, e, controller)
        }
    }
    $.until = until
    var objectURLS,
        registry
    function getObjUrl(thingy) {
        if ((objectURLS = objectURLS || new WeakMap).has(thingy)) return objectURLS.get(thingy)
        var url = URL.createObjectURL(thingy);
        (registry = registry || new FinalizationRegistry(URL.revokeObjectURL)).register(thingy, url)
        objectURLS.set(thingy, url)
        return url
    }
    $.getObjUrl = getObjUrl
    var anchor
    function download(blob, title) {
        (anchor = anchor || document.createElement('a')).download = title || 'download'
        anchor.href = getObjUrl(blob)
        anchor.click()
    }
    $.download = download
    function delegate(me, events, filter, includeSelf, controller) {
        filter = filter || function () { }
        for (var i in events) {
            if (i.includes('@')) throw SyntaxError("Conflicting usage of a 'currentTarget' only delegating event handler")
            var old = events[i]
            events[i] =
                function DelegationFunction(t) {
                    var target = t.target
                    var res = filter(target);
                    if ((me !== target || includeSelf) && (res == null ? true : res)) {
                        switch (arguments.length) {
                            case 1: return old.call(target, t)
                            case 2: return old.call(target, t, arguments[1])
                        }
                        return apply(old, target, arguments)
                    }
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
}(typeof globalThis === 'undefined' ? window : globalThis ////,!this
))