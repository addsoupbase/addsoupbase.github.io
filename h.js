//# allFunctionsCalledOnLoad
// ^ idk what that actually does
!function () {
    'use strict'

    ''.includes || (String.prototype.includes = function (a, b) { return !!~this.indexOf(a, b) })
    function h(globalThis, Reflect) {
        /*var WeakSet = globalThis.WeakSet || function () {
            var a = new WeakMap
            return {
                add: function (t) { return a.set(t, true), this },
                has: function (t) { return a.has(t) },
                delete: function (t) { return a.delete(t) }
            }
        }*/
        typeof Symbol === 'function' || function () {
            function a(b) { return String(Math.random() + String(b) + performance.now() + String(Date.now())) }
            a.for = function (o) { return '[]!@@@#*&$(@)' + o + 'U*(#R&HG&OHfih98geprji;)' }
            globalThis.Symbol = a
        }()
        //// var queueMicrotask = globalThis.queueMicrotask || globalThis.setImmediate || setTimeout
        var MODULE = Symbol.for("[[HModule]]")
        if (globalThis[MODULE]) return globalThis[MODULE]
        var $ = {}
        var sym = Symbol.for("[[Events]]"),
            //  Don't collide, and make sure its usable across realms!!
            apply = Reflect.apply,
            gpo = Reflect.getPrototypeOf,
            // gopd = Reflect.getOwnPropertyDescriptor,
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
        var source = Function.toString.call.bind(Function.prototype.toString)
            //// , warn=logger.warn, groupCollapsed=logger.groupCollapsed, groupEnd= logger.groupEnd
            , isArray = Array.isArray
            , allEvents = $.allEvents = new WeakMap
        //{
        //var { addEventListener, removeEventListener, dispatchEvent } = globalThis.EventTarget?.prototype ?? AbortSignal.prototype
        //if (source(addEventListener) !== source(Function.prototype).replace('function ', 'function addEventListener')
        //|| source(removeEventListener) !== source(Function.prototype).replace('function ', 'function removeEventListener')
        //|| source(dispatchEvent) !== source(Function.prototype).replace('function ', 'function dispatchEvent'))
        //    // adds ~20ms
        //    try {
        //        console.warn('Monkeypatch detected: ', addEventListener, removeEventListener, dispatchEvent)
        //        // in case they monkeypatch the EventTarget.prototype
        //        var n = document.createElement('iframe'),
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
        // var verified = new WeakSet
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
            /*  var o
               var b
               var c
               var bool = target &&
                   (verified.has(target) || target instanceof EventTarget
                       || (o = target.ownerDocument) && (o = o.defaultView) && o.EventTarget.prototype.isPrototypeOf(target)
                       || (b = target.defaultView) && b.EventTarget.prototype.isPrototypeOf(target)
                       || (c = target.EventTarget) && c.prototype.isPrototypeOf(target)
                       || lastResort(target)) /*'addEventListener removeEventListener dispatchEvent'.split(' ').every(lastResort, target)*/
            // bool && verified.add(target)
            return 'addEventListener' in target && 'removeEventListener' in target && 'dispatchEvent' in target
        }

        function lastResort(target) {
            /*   var a = `${addEventListener}`,
                   d = `${dispatchEvent}`,
                   r = `${removeEventListener}`*/
            try {
                while (target = gpo(target)) {
                    // var ael = gopd(target, 'addEventListener')?.value,
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
        var isAnimation = / /.test.bind(/^(animation(?:cancel|remove))$/),
            isFocus = / /.test.bind(/^(?:focus(?:in|out))$/),
            isDOMThing = / /.test.bind(/^(?:DOM(?:Activate|MouseScroll|Focus(?:In|Out)|(?:Attr|CharacterData|Subtree)Modified|NodeInserted(?:IntoDocument)?|NodeRemoved(?:FromDocument)?))$/),
            isMediaQuery = / /.test.bind(/^(?:\(.+\))$/)
        // var reqFile = requestFile
        var isTouch = / /.test.bind(/^(?:touch(?:cancel|end|move|start|forcechange))$/)
        // var MSEventSyntax = /((?:(?<a>g)ot|(?<a>l)ost)(?<b>p)ointer(?<c>c)apture)|(?<a>p)ointer(?:(?<b>d)own|(?<b>c)ancel|(?<b>u)p|(?<b>e)nter|(?<b>l)eave|(?<b>m)ove|(?<b>o)(?:ut|ver))/
        function getIEPointerEvent(name) {
            var n = name.split('pointer')
                , prefix = n[0] && (name[0] === 'g' ? 'Got' : 'Lost')
                , p = n[1]
            return 'MS' + prefix + 'Pointer' + p[0].toUpperCase() + p.slice(1)
        }
        function getIEGestureEvent(name) {
            var a = name.split('gesture')[1]
            return 'MSGesture' + a[0].toUpperCase() + a.slice(1)
        }
        // var vendors = /^(?:webkit|ms|moz)(?!$)/
        function verifyEventName(target, name) {
            var original = name
            name = name.toLowerCase()
            var valid = (customEvents.has(name) || 'on' + name in target ||
                ((original === 'DOMContentLoaded' && nodeType(target) === 9)
                    || (isAnimation(original) && 'onremove' in target)
                    || isFocus(original)
                    || isTouch(original)
                    || (isDOMThing(original)))
                //Some events like the ones above don't have a handler
                || isMediaQuery(original)
            )
            if (!valid) {
                var v
                if ((v = 'onwebkit' + name) in target || (v = 'onmoz' + name) in target || (v = 'onms' + name) in target) return v.slice(2) + original
                if ((v = name.slice(0, 7)) === 'pointer') {
                    if ((v = 'mouse' + v) in target) return v // Better than nothing
                    if (ie) return getIEPointerEvent(name)
                }
                if (name === 'wheel') {
                    if ((v = 'onmousewheel') in target) return v.slice(2) // iOS doesn't support 'wheel' events yet
                    if (typeof MouseScrollEvent === 'function') return 'DOMMouseScroll' // If they don't support the first 2, this one will work ~100% of the time
                    return 'MozMousePixelScroll' // The last resort, since there's no way to detect support with this one
                }
                if (ie && v === 'gesture') return getIEGestureEvent(name)
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
            return new Promise(resolveWithDelay.bind(1, ms))
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
            target.hasOwnProperty(sym) || dp(target, sym, { value: new Set })
            return target[sym]
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
                , obj = {get capture(){out=true}}
                // that's genius!
                , args = ['',console.debug,obj]
            addEventListener.apply(globalThis, args)
            removeEventListener.apply(globalThis, args)
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
        function on(target, events, controller) {
            if (arguments.length > 3 && getLabel(controller) !== 'AbortController') {
                debugger
                controller = arguments[3]
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
                    includes = ''.includes.bind(eventName)
                var func = events[eventName]
                var once = +includes(ONCE) && FLAG_ONCE,
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
                        passive: !!passive,
                    }
                var flags = once | prevents | passive | capture | stopProp | stopImmediateProp | onlyTrusted | onlyCurrentTarget | autoabort | wantsUntrusted | onlyOriginalTarget | onlyExplicitOriginalTarget
                var newTarget = target
                if (flags & FLAG_PASSIVE && flags & FLAG_PREVENTS) throw TypeError("Cannot call 'preventDefault' on a passive function")
                eventName = verifyEventName(newTarget, eventName.replace(formatEventName, ''))
                var b = supportOrientationChangeEvent(target, eventName, label)
                if (b) {
                    newTarget = b.target
                    eventName = b.name
                }
                if (myEvents.has(eventName) && controller == null) {
                    console.warn("🔕 Skipped duplicate '" + eventName + "' listener. Call on() again with the signal parameter to bypass this.")
                    continue
                }
                controller && (options.once = !!once, options.signal = controller.signal)
                var type = getLabel(func)
                if (type === 'GeneratorFunction') {
                    var args = []
                    autoabort && args.push(controller.abort.bind(controller))
                    args.push(off.bind(null, target, eventName))
                    var iterator = apply(func, target, args)
                    func = iterator.next.bind(iterator)
                    // the first 'yield' has no value, for some reason 
                    //    ;(func = iterator.next.bind(iterator))() 
                }
                var listener = EventWrapper.bind(newTarget,
                    func, controller,
                    controller && controller.abort.bind(controller, 'Automatic abort (#)'),
                    flags)
                if (autoabort && getLabel(controller) !== 'AbortController') throw TypeError("AbortController required if #autoabort flag is present")
                newTarget.addEventListener(eventName, listener, SUPPORTS_OPTIONS_PARAM ? options : !!capture/*, typeof scrollMaxX === 'number' && wantsUntrusted*/)
                // if (eventName === 'load' && /^(?:HTMLIFrameElement|Window)$/.test(getLabel(target)) && (target.contentWindow || target).document?.readyState === 'complete') {
                // setTimeout(listener.bind(target, new Event('load')))
                // logger.warnLate(`'${eventName}' event was fired before listener was added`, target)
                // }
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
        var safari = $.safari = typeof webkitConvertPointFromPageToNode === 'function'
            , firefox = $.firefox = typeof scrollMaxX === 'number'
            , ie = $.ie = typeof msAnimationStartTime === 'number'
            , chrome = $.chrome = typeof webkitRequestFileSystem === 'function'
        function compatOn(variants) {
            var data
            if (chrome) data = variants.chrome
            else if (firefox) data = variants.firefox
            else if (safari) data = variants.safari
            else if (ie) data = variants.ie
            return (data = data || variants.otherwise) && on.apply(null, data)
        }
        $.compatOn = compatOn
        var customEventHandler = typeof Proxy === 'function' && {
            has: function (t, p) {
                return p in t || p in Object(t.detail)
            },
            set: function (t, p, v) {
                return Reflect.set(p in t ? t : t.detail, p, v, t)
            },
            get: function (t, p) {
                if (p in t) return t[p]
                var detail = t.detail
                if (p in Object(detail)) {
                    var out = Reflect.get(detail, p, t)
                    return typeof out === 'function' ? out.bind(detail) : out
                }
            }
        }
        function EventWrapper(f, s, abrt, flags) {
            var args = [].slice.call(arguments, 4)
            var t = flags & FLAG_ONLY_TRUSTED,
                oct = flags & FLAG_ONLY_CURRENT_TARGET,
                p = flags & FLAG_PREVENTS,
                sp = flags & FLAG_STOP_PROP,
                sip = flags & FLAG_STOP_IMMEDIATE_PROPAGATION,
                aa = flags & FLAG_AUTO_ABORT,
                once = flags & FLAG_ONCE,
                originalTarget = flags & FLAG_ONLY_ORIGINAL_TARGET,
                explicitOriginalTarget = flags & FLAG_ONLY_EXPLICIT_ORIGINAL_TARGET
            var event = args[0],
                label = getLabel(event),
                name = event.type,
                currentTarget = event.currentTarget,
                detail = event.detail,
                push = args.push.bind(args)
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
            s && push(abrt)
            push(off.bind(null, this, name))
            if (t && event.isTrusted || !t && (!originalTarget || !('originalTarget' in event) || event.originalTarget === currentTarget) && (!explicitOriginalTarget || !('explicitOriginalTarget' in event) || event.explicitOriginalTarget === currentTarget) && (!oct || (event.target || event.srcElement) === currentTarget)) {
                var result = apply(f, this, args)
                if (p)
                    if (event.cancelable)
                        if (event.defaultPrevented) console.warn("'" + name + "' event has already been cancelled")
                        else event.returnValue = !event.preventDefault()
                    else console.warn("🔊 '" + name + "' events are not cancelable")
                if (sp) event.cancelBubble = !event.stopPropagation()
                sip && event.stopImmediatePropagation()
                aa && abrt()
                if (once || (result && result.hasOwnProperty('value') && result.hasOwnProperty('done') && result.done === true)) off(currentTarget, name)
            }
        }
        function off(target
            // ,...eventNames
        ) {
            var eventNames = [].slice.call(arguments, 1)
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
                newTarget.removeEventListener(name, listener, SUPPORTS_OPTIONS_PARAM ? {capture: capture} : capture)
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
                var id = timeout && setTimeout(function (err) {
                    reject(err)
                    controller.abort(RangeError("⏰ Promise for '" + eventName + "' expired after " + timeout + "ms"))
                }, timeout)
                    , controller = new AbortController
                    , e = {}
                function onsuccess(event, abort) {
                    if (!filter || (typeof filter === 'function' && filter(event, null))) try {
                        resolve(event)
                    } catch (e) {
                        reject(e)
                    } finally {
                        timeout && clearTimeout(id)
                        abort()
                    }
                }
                e[eventName] = onsuccess
                if (failureName)
                    e[failureName] = function (e, abort) {
                        if (!filter || (typeof filter === 'function' && filter(null, e)))
                            try {
                                reject(e)
                            } catch (e) {
                                reportError(e)
                            } finally {
                                timeout && clearTimeout(id)
                                abort()
                            }
                    }
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
                    function DelegationFunction(
                        // ...args
                    ) {
                        var target = arguments[0].target
                        var res = filter(target);
                        (me !== target || includeSelf) && (res == null ? true : res) && apply(old, target, arguments)
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
    var x = typeof globalThis === 'undefined' ? window : globalThis
    return h(x, x.Reflect || { apply: function (target, thisArg, args) { return target.apply(thisArg, args) }, getPrototypeOf: Object.getPrototypeOf || function (t) { return t.__proto__ }, /*getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,*/ defineProperty: Object.defineProperty, ownKeys: Object.getOwnPropertyNames, has: function (t, p) { return t in p } })
}()
