//  The journey begins...
// Most recent attempt
// Goto quick.js for 2nd attempt
// Goto favourites/utils.js for 1st attempt
/*
Things i learned from 2nd -> 3rd:
• Composition
• Make it less confusing
• Recycling Objects
• using Symbols
• finally settled on WeakMap
*/

// import {plural} from "./str.js"
function plural(singular, plural, count) {
    return Math.sign(count = +count) === count && count ? `${count} ${singular}` : `${count.toLocaleString()} ${plural}`
}

import * as h from './handle.js'
import * as css from './csshelper.js'

const f = {
    debounce(func, interval) {
        let waiting = false
        return DebouncedFunction

        function enable() {
            waiting = false
        }

        function DebouncedFunction(...args) {
            if (!waiting) {
                waiting = true
                setTimeout(enable, interval)
                Reflect.apply(func, this, args)
            }
            return !waiting
        }
    }
}
Object.hasOwn ?? Object.defineProperty(Object, 'hasOwn', {
    value: (obj, prop) => ({}).hasOwnProperty.call(obj, prop),
    writable: 1,
    configurable: 1
})
const regex = {
        dot: /\./g,
        space: /\s/g,
        onXYZ: /^on\w+$/
    },
    me = Symbol('do not touch'),
    saved = Symbol('触らないでください'),
    all = new WeakMap,
    revokes = new WeakMap

function gen() {
    return `${Math.random()}${Math.random()}`.replace(regex.dot, '')
}

const BoundFunctions = new WeakMap

function cacheFunction(maybeFunc) {
    // Make sure we just re-use the same function
    /*if (typeof maybeFunc === 'function') {
        if (!Object.hasOwn(to, maybeFunc.name)) Object.defineProperty(prox(to), maybeFunc.name, {
            value: maybeFunc.bind(to),
            writable: 1,
            configurable: 1
        })
        return to[maybeFunc.name]
    }*/
    // There was like a catastrophic bug but i fixed it bc im the best
    if (typeof maybeFunc === 'function') {
        if (BoundFunctions.has(maybeFunc)) return BoundFunctions.get(maybeFunc)
        // let wrapper = new Proxy(maybeFunc,handlers.function)
        const {name} = maybeFunc
            , wrapper = {
            [name](...a) {
                // Regular wrapper function for method,
                // for usage instead of making a new one for every instance with bind()
                return Reflect.apply(maybeFunc, base(this), a)
            }
        }[name]  // keep the original function name just in case
        BoundFunctions.set(maybeFunc, wrapper)
        return wrapper
    }
    return maybeFunc
}

function genericGet(t, prop) {
    let out = t[prop]
    if (typeof prop !== 'symbol' && !isNaN(prop))
        return out && prox(out)
    if (Array.prototype.hasOwnProperty(prop) && typeof [][prop] === 'function') return [][prop].bind(t)
    return cacheFunction(out, t)
}

function ariaOrData(i) {
    let {0: char} = i
    if (char === '_') return i.replace(char, 'aria-')
    if (char === '$') return i.replace(char, 'data-')
    return i
}

const attrStyleMap = 'StylePropertyMap' in window
    , customRules = css.getDefaultStyleSheet()
    , handlers = {
    // Other proxies
    batchThing: {
        cached: null,
        QueueBatchThing() {
            this.queued || (requestAnimationFrame(this.HandleStyleUpdates.bind(this)), this.queued = true)
        },
        HandleStyleUpdates() {
            this.queued = false
            this.cached.forEach(ApplyBatchedStyles, this.target)
            writes = reads = 0
        },
        get(t, p) {
            ++reads
            p = css.toCaps(p)
            let val = this.cached.get(p)
            return val ?? (this.cached.set(p, val = t[p]), val)
        },
        set(t, p, v) {
            ++writes
            p = css.toCaps(p)
            if (v === this.cached.get(p)) return 1
            this.cached.set(p, v)
            this.QueueBatchThing()
            return 1
        },
        deleteProperty(t, p) {
            return this.set(t, p, '')
        }
    },
    main: {
        // just create as few closures as possible
        get(targ, prop, r) {
            let a = this[0]
            return targ.hasOwnProperty(prop) ? Reflect.get(targ, prop, r) :
                cacheFunction(Reflect.get(a, prop, a), a)
            // ⛓️‍💥 'Illegal invocation' if function is not bound
        },
        set(targ, prop, value) {
            return Reflect.set(targ.hasOwnProperty(prop) ? targ : this, prop, value)
        }
    },
    querySelector: {
        get(t, p) {
            return prox(t.querySelector(p))
        }
    },
    styles: attrStyleMap ? {
        get(target, prop) {
            return prop.startsWith('--') ? target.get(prop) : target.get(css.dashVendor(prop, 'inherit'))
        },
        set(target, prop, value) {
            if (value == null || value === '') this.deleteProperty(target, prop)
            else prop.startsWith('--') ? target.set(prop, value) : target.set(css.dashVendor(prop, `${value}`), value)
            return 7
        },
        deleteProperty(target, prop) {
            return prop.startsWith('--') ? target.delete(prop) :
                target.delete(css.dashVendor(`${prop}`, 'inherit')),
                3
        },
    } : {
        get(target, prop) {
            return prop.startsWith('--') ? target.getPropertyValue(prop) :
                target.getPropertyValue(css.dashVendor(prop, 'inherit'))
        },
        set(target, prop, value) {
            if (prop.startsWith('--')) target.setProperty(prop, value)
            else target.setProperty(css.dashVendor(prop, `${value}`), value)
            return 7
        },
        deleteProperty(target, prop) {
            return prop.startsWith('--') ? target.removeProperty(prop) :
                target.removeProperty(css.dashVendor(prop, 'inherit')),
                3
        },
        has(target, prop) {
            return this.get(target, prop)
        }
    },
    attr: {
        get(t, p) {
            p = ariaOrData(p)
            return prox(t).getAttribute(p)
        },
        set(t, p, v) {
            return prox(t).setAttr({
                [p]: v
            })
        },
        deleteProperty(t, p) {
            return prox(t).setAttr({
                [p]: ''
            })
        },
        has(t, p) {
            p = ariaOrData(p)
            return t.hasAttribute(p)
        }
    },
    HTMLCollection: {
        get: genericGet,
        set(t, prop, value) {
            if (isNaN(prop))
                t[prop] = value
            else {
                let out = t[prop]
                out && base(out).replaceWith(base(value))
            }
            return 4
        },
        deleteProperty(t, prop) {
            if (!isNaN((prop))) {
                let obj = this.get(t, prop)
                obj && prox(obj).destroy()
            }
            return 6
        }
    },
}
// Main [[Prototype]] is on this class
// let ATTR = Symbol('💿')
// let states = Symbol('💾')
let computed = Symbol('no')
let styles = Symbol('stop')
// let shadow = Symbol('🌴')
let props = Object.getOwnPropertyDescriptors(class _
        extends null {
        static cancel(o) {
            o.cancel()
        }

        static pause(o) {
            o.pause()
        }

        static play(o) {
            o.playState === 'paused' && o.play()
        }

        static finish(o) {
            o.finish()
        }

        static restart(o) {
            o.currentTime = 0
            o.play()
        }

        get isVisible() {
            let rect = base(this).getBoundingClientRect()
                , viewHeight = Math.max($(document.documentElement)?.clientHeight || 0, innerHeight)
            return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
        }

        getComputedStyle() {
            return this.computed
        }

        get computed() {
            return this[computed] ??= getComputedStyle(base(this))
        }

        /*
            createState(identifier, child, callback) {
                let t = this[states]
                if (t.has(identifier)) throw Error("Already present")
                //if (!(typeof identifier).match(/number|string|symbol|bigint/)) throw TypeError(`State must be a primitive`)
                // console.assert(/number|string|symbol|bigint/.test(typeof identifier), `State should be a primitive:\n %o`, identifier)
                let cached = $('template')
                cached.content.appendChild(base(child))
                t.set(identifier, {
                    cached,
                    callback
                })
                return cached.content
            }

            getState(identifier) {
                return this[states].get(identifier)?.cached.content ?? null
            }

            editState(id, func) {
                func(this[states].get(id).cached.content)
            }

            deleteState(identifier) {
                let t = this[states]
                if (t.has(identifier)) {
                    let state = t.get(identifier).cached;
                    [].forEach.call(state.content.querySelectorAll('*'), destroyEach)
                    t.delete(identifier)
                }
            }
            setState(identifier) {
                if (identifier === null) {
                    this.lastState = this.currentState
                    this.currentState = null
                    return this.destroyChildren()
                }
                let t = this[states]
                if (!t.has(identifier)) {
                    this.destroyChildren()
                    .push($('<samp style="font-size:30px; color:red;">INVALID STATE</samp>'))
                        .currentState = null
                    reportError(identifier)
                    throw TypeError('Invalid state')
                }
                let {cached: cache, callback} = t.get(identifier)
                    , frag = cache.content
                    , cached = document.importNode(frag, true)
                    , staticBatch = [...frag.querySelectorAll('*')]
                    , newBatch = [...cached.querySelectorAll('*')]
                    , withIds = []
                staticBatch.forEach(forEach)
                this.destroyChildren()
                callback?.apply(cached, withIds)
                base(this).appendChild(cached)
                this.lastState = this.currentState
                this.currentState = identifier

                function forEach(el, index) {
                    el = prox(el)
                    el.hasAttribute('id') && withIds.push(el) // its considered important
                    let {events} = el
                    if (!events) return
                    let clone = prox(newBatch[index])
                    let staticEvents = h.allEvents.get(base(el))
                    events.forEach(eventThing)

                    function eventThing(name) {
                        let {
                            listener,
                            passive,
                            capture,
                            handler,
                            prevents,
                            stopProp,
                            once,
                            stopImmediateProp,
                            onlyTrusted
                        } = staticEvents.get(name)
                        if (once) name = `_${name}`
                        if (passive) name = `^${name}`
                        if (capture) name = `%${name}`
                        if (stopProp) name = `&${name}`
                        if (prevents) name = `$${name}`
                        if (onlyTrusted) name = `?${name}`
                        if (stopImmediateProp) name = `!${name}`
                        clone.on({
                            [name]: listener[h.unbound][h.unbound]
                        }, handler)
                    }
                }
            }
        */
        toJSON() {
            return base(this).outerHTML
        }

        xpath(xpath, callback, type, thisArg) {
            let i = document.evaluate(xpath, base(this), null, type ?? 0, null),
                el,
                n = 0
            while (el = i.iterateNext()) callback.call(thisArg, el instanceof HTMLElement ? prox(el) : el, n++, i)
        }

        get orphans() {
            let me = base(this)
            if (me.tagName === 'TEMPLATE')
                return me.content
            let out = document.createDocumentFragment(),
                {firstElementChild} = me
            while (firstElementChild)
                out.appendChild(me.removeChild(firstElementChild)), {firstElementChild} = me
            return out
        }

        pass() {
            let {orphans} = this
            this.destroy()
            return orphans
        }

        empty() {
            return this.orphans
        }

        get clone() {
            return prox(base(this).cloneNode(true))
        }

        destroy() {
            this.resetSelfRules()
            .cancelAnims()
            // let myStates = this[states]
            /*for (let [key, {
                cached: val
            }] of myStates) {
                myStates.delete(key)
                for (let el of val.content.querySelectorAll('*'))
                    prox(el).destroy()
            }*/
            if ($.last === this) $.last = null
            let my = base(this.destroyChildren())
            do my.remove()
            while (my.isConnected /*document.contains(my)*/)
            let myevents = h.getEventNames(my)
            myevents.size && Reflect.apply(this.off, this, myevents)
            all.delete(my)
            // inte?.unobserve(my)
            // resi.unobserve(my)
            revoke(this)
            return null
        }

        destroyChildren() {
            let {lastElementChild} = this
            while (lastElementChild)
                prox(lastElementChild).destroy(), {lastElementChild} = this
        }

        /**
         * @deprecated
         * */
        $(html, props, ...children) {
            debugger
            let out = $(html, props, ...children)
            out.parent = this
            return out
        }

        on(events, signal) {
            if (arguments.length > 2) signal = arguments[2]
            let me = this
            if (typeof events === 'function') {
                let old = events
                events = ProxyEventWrapperFunction

                function ProxyEventWrapperFunction(...args) {
                    // just avoid bind()
                    Reflect.apply(old, me, args)
                }
            } else for (let i in events) events[i] = function (old) {
                return ProxyEventWrapperFunction

                function ProxyEventWrapperFunction(...args) {
                    Reflect.apply(old, me, args)
                }
            }(events[i])
            h.on(base(this), events, signal)
        }

        off(...events) {
            Reflect.apply(h.off, null, [base(this)].concat(events))
        }

        set(prop, val) {
            base(this)[prop] = val
        }

        getByTag(tag) {
            return Array.from(base(this).getElementsByTagName(tag), prox)
        }

        debounce(events, interval, signal) {
            for (let i in events) {
                let old = events[i]
                events[i] = f.debounce(old, interval)
            }
            this.on(events, signal)
        }

        /* throttle(events, interval) {
             for (let i in events) {
                 let old = events[i]
                 events[i] = f.throttle(old, interval)
             }
             this.on(events)
     }*/
        delegate(events, filter, includeSelf, signal) {
            let me = base(this)
            filter ??= function () {
            }
            for (let i in events) {
                if (i.includes('@')) throw SyntaxError("Conflicting usage of a 'currentTarget' only delegating event handler")
                let old = events[i]
                events[i] = DelegationFunction

                function DelegationFunction(...args) {
                    let {target} = args[0],
                        pr = prox(target);
                    (me !== target || includeSelf) && (filter(pr) ?? 1) && Reflect.apply(old, pr, args)
                }
            }
            this.on(events, false, signal)
        }

        get events() {
            return h.getEventNames(base(this))
        }

        setStyles(styles) {
            /* for (let prop in styles) {
                 let ogValue = styles[prop]
                 let fixedProp = css.toCaps(css.vendor(css.toDash(prop), ogValue))
                 ogValue ? this.style[fixedProp] = ogValue //out.push(`${fixedProp}: ${ogValue}`)
                     :
                     delete this.style[fixedProp]
             }
             return this*/
            Object.assign(this.styles, styles)
            //base(this).style.cssText = out.join(';')
        }

        static canBeDisabled = /^HTML(?:Button|FieldSet|OptGroup|Option|Select|TextArea|Input)Element$/

        set disabled(val) {
            if (val) {
                if (_.canBeDisabled.test(h.getLabel(base(this)))) this.setAttr({disabled: true})
                else this.saveAttr('contenteditable', 'inert')
                .setAttr({
                    _disabled: 'true',
                    contenteditable: false,
                    inert: true
                }).setStyles({
                    // '--user-focus':'none',
                    '--user-modify': 'read-only',
                    '--user-input': 'none',
                    // 'pointer-events': 'none',
                    '--interactivity': 'inert'
                })
            } else {
                if (_.canBeDisabled.test(h.getLabel(base(this)))) this.setAttr({disabled: false})
                else this.restoreAttr('contenteditable', 'inert')
                .setAttr({_disabled: 'false'})
                .setStyles({
                    '--user-modify': '', '--user-input': '',
                    // 'pointer-events':'',
                    '--interactivity': ''
                })
            }
        }

        get disabled() {
            return 'disabled' in this.attr || 'aria-disabled' in this.attr
        }

        saveAttr(...attributes) {
            let me = base(this)
            if (!attributes.length) {
                let s = this[saved] = {__proto__: null},
                    attributes = me.getAttributeNames()
                for (let {length: i} = attributes; i--;) {
                    let attr = attributes[i],
                        val = me.getAttribute(attr)
                    s[attr] = val || true
                }
            } else {
                let s = this[saved]
                for (let {length: i} = attributes; i--;) {
                    let attr = attributes[i],
                        val = me.getAttribute(attr)
                    s[attr] = val === '' ? true : me.getAttribute(attr)
                }
            }
        }

        restoreAttr(...attributes) {
            let s = this[saved]
            if (!attributes.length) attributes = base(this).getAttributeNames()
            for (let {length: i} = attributes; i--;) {
                let attr = attributes[i]
                this.setAttr({[attr]: s[attr]})
            }
        }

        setAttr(attr) {
            let me = base(this)
            for (let i in attr) {
                let n = i.split(',')
                let val = attr[i]
                if (regex.onXYZ.test(i)) throw TypeError('Inline event handlers are deprecated')
                /*   switch (i) {
                       case 'disabled': me.setAttribute('aria-disabled', !!val); break
                       case 'checked': me.setAttribute('aria-checked', !!val); break
                       case 'hidden': me.setAttribute('aria-hidden', !!val); break
                       case 'required': me.setAttribute('aria-required', !!val); break
                       case 'readonly': me.setAttribute('aria-readonly', !!val); break
                       case 'placeholder': me.setAttribute('aria-placeholder', val); break
                   }*/
                for (let {length: a} = n; a--;) {
                    let prop = ariaOrData(n[a])
                    if (typeof val === 'boolean') me.toggleAttribute(prop, val)
                    else if (val === '' || val == null) me.removeAttribute(prop)
                    else me.setAttribute(prop, val)
                }
            }
        }

        get anims() {
            return base(this).getAnimations()
        }

        static subtree = {
            subtree: true
        }

        get allAnims() {
            return base(this).getAnimations(_.subtree)
        }

        cancelAnims() {
            this.allAnims.forEach(_.cancel)
        }

        resumeAnims() {
            this.allAnims.forEach(_.play)
        }

        pauseAnims() {
            this.allAnims.forEach(_.pause)
        }

        finishAnims() {
            this.allAnims.forEach(_.finish)
        }

        restartAnims() {
            this.allAnims.forEach(_.restart)
        }

        static nopacity = {
            opacity: 0
        }
        static onepacity = {
            opacity: 1
        }
        static defaultDura = 500

        fadeOut(duration) {
            duration ||= _.defaultDura
            return this.animate([{}, _.nopacity], {
                duration,
                easing: 'ease',
                // composite: 'replace',
                iterations: 1
            }).finished.then(this.hide.bind(this, 3))
        }

        fadeIn(duration) {
            duration ||= _.defaultDura
            this.show(3)
            return this.animate([_.nopacity, _.onepacity], {
                duration,
                easing: 'ease',
                iterations: 1,
                // composite: 'replace',
            }).finished
        }

        fadeFromTo(from, to, settings) {
            let duration = (settings ??= {}).duration || _.defaultDura
                , easing = settings.easing ?? 'ease'
            return this.animate([{
                opacity: from
            }, {
                opacity: to
            }], {
                duration,
                easing,
                composite: 'replace',
                fill: 'forwards'
            })
        }

        replace(...elements) {
            Reflect.apply(HTMLElement.prototype.replaceWith, base(this), elements.map(base))
        }

        wrap(parent) {
            let {parent: p} = this
            ;(this.parent = $(parent)).parent = p
        }

        unwrap() {
            let {parent} = this
                , c = this.pass()
            parent.appendChild(c)
            return null
        }

        trade(other) {
            other = $(other)
            let o = other.orphans,
                oo = this.orphans
            other.appendChild(oo)
            this.appendChild(o)
        }

        static hidden = {
            hidden: true
        }
        static notHidden = {
            hidden: false
        }

        /**
         *
         * @param {int} t
         * # 1 - 5
         */
        hide(t) {
            switch (t) {
                case 1:
                default:
                    this.setAttr(_.hidden);
                    break
                case 2:
                    base(this).style.visibility = 'hidden';
                    break
                case 3:
                    base(this).style.display = 'none';
                    break
                case 4:
                    this.setStyles({'--content-visibility': 'hidden'});
                    break
                case 5:
                    this.setStyles({
                        opacity: '0',
                        '--user-input': 'none',
                        '--user-focus': 'none',
                        '--user-select': 'none',
                        'pointer-events': 'none',
                        '--user-modify': 'read-only',
                        '--interactivity': 'inert'
                    })
                    .setAttr({_hidden: "true", contenteditable: 'false', inert: true})
                    break
            }
        }

        /**
         *
         * @param {int} t
         * # 1 - 5
         */
        show(t) {
            switch (t) {
                case 1:
                default:
                    this.setAttr(_.notHidden);
                    break
                case 2:
                    base(this).style.visibility = 'visible';
                    break
                case 3:
                    base(this).style.display = '';
                    break
                case 4:
                    this.setStyles({'--content-visibility': ''});
                    break
                case 5:
                    this.setStyles({
                        opacity: '',
                        '--user-input,--user-focus,--user-select,pointer-events,--user-modify,--interactivity': '',
                    })
                    .setAttr({_hidden: "", contenteditable: '', inert: false})
                    break
            }
        }

        equals(other) {
            let temp = $(other)
            let out = base(temp).isEqualNode(base(this))
            temp.destroy?.()
            return out
        }

        static append(child) {
            doc.appendChild(base(child))
        }

        push(...args) {
            args.flat(1 / 0).forEach(_.append)
            base(this).appendChild(doc)
        }

        unshift(...args) {
            args.flat(1 / 0).forEach(_.append)
            base(this).prepend(doc)
        }

        //  i tried SO hard to make treewalker useful but it did NOT impress me!
        treeWalker(whatToShow, callback, filter, thisArg) {
            let walker = document.createTreeWalker(base(this), whatToShow ?? NodeFilter.SHOW_ALL, filter_func)
            filter ??= function () {
                return 1
            }
            let current,
                i = 0, skip = NodeFilter.FILTER_SKIP,
                accept = NodeFilter.FILTER_ACCEPT
            while (current = walker.nextNode()) callback.call(thisArg ?? this, getValid(current) ? prox(current) : current, i++, walker)

            function filter_func(node) {
                return filter(node) ? accept : skip
            }
        }

        * [Symbol.iterator]() {
            let all = base(this).getElementsByTagName('*')
            for (let {length: i} = all; i--;) yield prox(all[i])
        }

        [Symbol.toPrimitive]() {
            throw TypeError('Cannot convert Element to a primitive value')
            // Don't want to accidentally convert to a string for stuff like
            //append, prepend, etc.
        }

        /*find(selector) {
        return this.treeWalker(func).next().value
        function func(node) { return node.matches(selector) }
        }
        findAll(selector) {
        return [...this.treeWalker(func)]
        function func(node) { return node.matches(selector) }
        }*/
        resetSelfRules() {
            for (let i in this.selfRules)
                try {
                    customRules.deleteRule([].indexOf.call(customRules.cssRules, this.selfRules[i]))
                } finally {
                }
        }

        addSelfRule(selector, cssStuff) {
            const og = selector
            let id
            try {
                if (base(this).hasAttribute('id')) id = base(this).getAttribute('id')
                else do id = gen()
                while (document.getElementById(id))
                if (selector.includes('::')) selector = css.pev(selector)
                else if (selector.includes(':')) selector = css.pcv(selector)
                const final = `#${CSS.escape(id)} ${selector}{${(css.toCSS(cssStuff))}}`
                let existing = this.selfRules[css.formatStr(selector.replace(regex.space, ''))]
                // for (let i = 5; i--;) try {
                existing ? existing.insertRule(final) :
                    (this.selfRules[css.formatStr(selector.replace(regex.space, ''))] = customRules.cssRules[customRules.insertRule(final)])
                this.setAttr({
                    id
                })
            } catch {
                css.badCSS(`⛓️‍💥 Unrecognized CSS rule at '${og}'`)
            }
            // }
            // catch(e) {
            // if (!i) throw e
            // await new Promise(requestAnimationFrame)
            // continue
            // }
        }

        static forEach(frame) {
            for (let prop in frame) {
                let val = `${frame[prop]}`
                frame[css.capVendor(prop, val)] ??= val
            }
            // Firefox warns of empty string
        }

        until(good, bad, timeout) {
            return h.until(base(this), good, bad, timeout)
        }

        animate(keyframes, options) {
            (options ??= {}).timing ??= 'ease'
            options.iterations ??= 1
            options.pseudoElement &&= css.pev(options.pseudoElement)
            keyframes.forEach(_.forEach)
            return base(this).animate(keyframes, options)
        }

        set after(val) {
            base(this).after(base(val))
        }

        set before(val) {
            base(this).before(base(val))
        }

        eval(script) {
            // mimic inline event handlers (rarely needed)
            return Function('with(document)with(this)return eval(arguments[0])').call(base(this), script)
        }

        get after() {
            let {nextElementSibling} = base(this)
            return prox(nextElementSibling)
        }

        get before() {
            let {previousElementSibling} = base(this)
            return prox(previousElementSibling)
        }

        set parent(parent) {
            parent ? base(parent).appendChild(base(this)) : base(this).remove()
        }

        get parent() {
            let parent = base(this).parentElement
            return prox(parent)
        }

        /* get gc() {
        // Ensure objects are being properly garbage collected
             return new Promise(callback => {
                 cleanup.register(base(this), {age:this.age,callback})
             })
         }*/
        get first() {
            let {firstElementChild} = base(this)
            return prox(firstElementChild)
        }

        get last() {
            let {lastElementChild} = base(this)
            return prox(lastElementChild)
        }

        get ancestors() {
            return base(this).getElementsByTagName('*').length
        }

        busy(busy) {
            this.setAttr({
                _busy: `${!!busy}`
            })
            .setStyles({
                cursor: busy ? 'progress' : ''
            })
        }

        copyAttr(other) {
            let me = base(this),
                attr = other.getAttributeNames()
            for (let {length: i} = attr; i--;) {
                let name = attr[i]
                me.setAttribute(name, other.getAttribute(name))
            }
        }
    }.prototype
)
const prototype = Object.create(null)
    , TEXT_THINGIES = new Set('outerHTML outerText innerHTML innerText textContent'.split(' '))
TEXT_THINGIES.forEach(txt =>
    Object.defineProperty(prototype, txt, {
        get() {
            return base(this)[txt]
        },
        set(val) {
            let me = base(this),
                count = me.childElementCount
            if (count) throw TypeError(`Cannot set property '${txt}': Element has ${plural('child', 'children', count)}`)
            me[txt] = safeHTML(val)
        }
    })
)
const HTML_PLACING = new Set('beforebegin afterbegin beforeend afterend'.split(' '))
HTML_PLACING.forEach(set =>
    Object.defineProperty(prototype, set, {
        set(val) {
            typeof val === 'object' ?
                base(this).insertAdjacentElement(set, base(val)) :
                base(this).insertAdjacentHTML(set, val)
        }
    })
)
'offsetLeft offsetTop offsetWidth offsetHeight offsetParent clientLeft clientTop clientWidth clientHeight scrollWidth scrollHeight'
.split(' ').forEach(prop => {
    // Reading these properties causes reflows/layout-shift/repaint whatever its called idk
    let cached = null,
        queued = false

    function resetThingy() {
        cached = null
        queued = false
        reads = 0
    }

    Object.defineProperty(prototype, prop, {
        get() {
            ++reads
            queued || (requestAnimationFrame(resetThingy), queued = true)
            return cached ??= base(this)[prop]
        }
    })
})
// i just like using emojis sorry
Reflect.ownKeys(props).forEach(i => {
    if (i !== 'constructor') {
        let v = props[i],
            {value} = v
        if (typeof value === 'function') {
            v.value = {
                [i](...a) {
                    //  This function is for automatically returning the 'this'
                    //  value if the original return value is undefined
                    let me = prox(this), b = base(this)
                    if (!getValid(b) || !all.has(b)) throw TypeError('Invalid calling object')
                    let r = Reflect.apply(value, me, a)
                    return typeof r === 'undefined' ? me : r
                }
            }[i] //  Just want to keep the original function name intact
        }
        /* else {
             let { set, get } = v
              v.set &&= {
                 [set.name](val) {
                     let b = base(this), me = prox(this)
                     if (!getValid(b) || !all.has(b)) throw TypeError('Invalid calling object')
                     set.call(me, val)
                 }
             }[set.name]
             v.get &&= {
                 [get.name]() {
                     let b = base(this), me = prox(this)
                     if (!getValid(b) || !all.has(b)) throw TypeError('Invalid calling object')
                     return get.call(b)
                 }
             }[get.name]
         }*/
        Object.defineProperty(prototype, i, v)
    }
})
Object.defineProperties(prototype,
    {
        setAttributes: Reflect.getOwnPropertyDescriptor(prototype, 'setAttr'),
        kill: Reflect.getOwnPropertyDescriptor(prototype, 'destroy'),
        killChildren: Reflect.getOwnPropertyDescriptor(prototype, 'destroyChildren'),
        styleMe: Reflect.getOwnPropertyDescriptor(prototype, 'setStyles'),
        setStyle: Reflect.getOwnPropertyDescriptor(prototype, 'setStyles')
    }
)
// 🖨 Copy everything
const prototypeDescriptors = Object.getOwnPropertyDescriptors(prototype)

export function base(element) {
    // 🌱 Get the root element
    return element[me] ?? element
}

// Don't mind these objects
const reuse = {
    flags: {
        //  General Purpose binary flag
        value: 0,
        writable: 1,
        enumerable: 1
    },
    nullThing: {
        value: null,
        writable: 1
    },
    /*   state: {
           get() {
               return this.currentState
           },
           set(val) {
               this.setState(val)
           }
       },*/
    junk: {
        value: null,
        enumerable: 1,
        writable: 1
    }
}
/*
INTERSECTION OBSERVER STUFFS
(only for firefox and browsers without contentvis...event)
*/
let inte
if (typeof
    ContentVisibilityAutoStateChangeEvent !== 'function' || 'mozInnerScreenX' in window)  /*Firefox is weird again*/ {
    inte = new IntersectionObserver(IntersectionObserverCallback, {
        threshold: [0, Number.MIN_VALUE]
    })

    function IntersectionObserverCallback(entries) {
        for (let {length: i} = entries; i--;) {
            let me = entries[i],
                {target} = me
            if ($(target).computed.getPropertyValue('--content-visibility').trim() === 'auto') {
                h.delayedDispatch('contentvisibilityautostatechange', target, new CustomEvent('contentvisibilityautostatechange', {
                    bubbles: true,
                    detail: {skipped: !me.isIntersecting}
                }))
            }
        }
    }
}
/*
MUTATION OBSERVER STUFFS
*/
/*function refreshAttributes(attr) {
    this.setAttribute(attr, this.getAttribute(attr))
}*/
const imported = new Set

function observeAll(node) {
    let n = node.tagName.toLowerCase()
    switch (n) {
        case 'img-sprite':
        case 'touch-joystick':
        case 'seek-bar':
            imported.has(n) || (import(`./webcomponents/${n}.js`), imported.add(n))
    }
    // if (node instanceof CUSTOM_ELEMENT_SPRITE) node.getAttributeNames().forEach(refreshAttributes, node)
    inte?.observe(node)
    resi.observe(node)
}

function unobserveAll(node) {
    inte?.unobserve(node)
    resi.unobserve(node)
}

function MutationObserverCallback(entry) {
    for (let {length: ii} = entry; ii--;) {
        let me = entry[ii],
            {addedNodes, removedNodes} = me
        for (let {length: i} = addedNodes; i--;) {
            let node = addedNodes[i]
            if (node instanceof Element || node?.ownerDocument?.defaultView.Element.prototype.isPrototypeOf(node)) {
                /*  queueMicrotask(() => {
                      document.dispatchEvent(new CustomEvent('subtree-modified', {
                          // bubbles: true,
                          detail: {
                              node,
                              added: true,
                          }
                      }))
                  })*/
                observeAll(node)
            }
        }
        for (let {length: i} = removedNodes; i--;) {
            let node = removedNodes[i]
            if (node instanceof Element || node?.ownerDocument?.defaultView.Element.prototype.isPrototypeOf(node)) {
                /*   queueMicrotask(() => {
                       document.dispatchEvent(new CustomEvent('subtree-modified', {
                           // bubbles: true,
                           detail: {
                               node,
                               added: false,
                           }
                       }))
                   })*/
                unobserveAll(node)
            }
        }
    }
}

const muta = new MutationObserver(MutationObserverCallback)
muta.observe(document.documentElement, {
    subtree: true,
    childList: true
})

/*
RESIZE OBSERVER STUFFS
*/
function ResizeLoop(o) {
    h.delayedDispatch('ResizeObserver', o.target, new CustomEvent('re-scale', {
        bubbles: true,
        detail: {
            borderBoxSize: o.borderBoxSize,
            contentBoxSize: o.contentBoxSize,
            contentRect: o.contentRect,
            devicePixelContentBoxSize: o.devicePixelContentBoxSize,
            actualTarget: o.target
        }
    }))
}

h.addCustomEvent({
    're-scale': true
})

function ResizeObserverCallback(entries) {
    entries.forEach(ResizeLoop)
}

const resi = new ResizeObserver(ResizeObserverCallback)
;[].forEach.call(document.getElementsByTagName('*'), observeAll)

/*
PERFORMANCE OBSERVER STUFFS
*/
function PerformanceLoop(o) {
    let detail,
        title = o.entryType
    switch (title) {
        case 'layout-shift': {
            let {sources} = o
            for (let {length: i} = sources; i--;) {
                let {node, currentRect, previousRect} = sources[i]
                node && h.delayedDispatch('layout-shift', node, new CustomEvent('layout-shift', {
                    bubbles: true,
                    detail: {
                        currentRect,
                        previousRect
                    }
                }))
            }
        }
            return
        case 'longtask':
            title = 'long-task';
        // [top, parent].forEach(o=>o!== window && delayedDispatch(o.entryType,o, new CustomEvent(title, {
        //     detail
        // })))
        // console.warn(o)
        case "long-animation-frame":
            detail = o
            break
        case 'first-input':
            detail = o
            detail.actualTarget = o.target
            break
        case 'largest-contentful-paint':
            detail = o
            break
        case 'resource':
            title = 'network-request'
            detail = o
            break
        case 'navigation':
            title = 'page-navigate'
            detail = o.toJSON()
            let {type} = detail
            delete detail.type
            detail.navigationType = type
            break
        case 'element':
            title = 'element-load'
            detail = o
        case 'paint':
            switch (o.name) {
                case 'first-paint':
                case 'first-contentful-paint':
                    title = o.name
                    detail = {
                        time: o.startTime,
                        name: o.name
                    }
                    break
            }
            break
    }
    h.delayedDispatch(o.entryType, window, new CustomEvent(title, {
        detail
    }))
}

function PerformanceObserverCallback(entr) {
    entr.getEntries().forEach(PerformanceLoop)
}

const entryTypes = {
    paint: 'PerformancePaintTiming' in window,
    'first-input': 'PerformanceEventTiming' in window,
    'layout-shift': 'LayoutShift' in window,
    'largest-contentful-paint': 'LargestContentfulPaint' in window,
    'long-animation-frame': 'PerformanceLongAnimationFrameTiming' in window,
    longtask: 'PerformanceLongTaskTiming' in window,
    resource: 'PerformanceResourceTiming' in window,
    navigation: 'PerformanceNavigationTiming' in window,
    element: 'PerformanceElementTiming' in window
    // taskattribution: 'TaskAttributionTiming 'in window
}
const perf = new PerformanceObserver(PerformanceObserverCallback)
Object.keys(entryTypes).forEach(type => {
    perf.observe({type, buffered: true})
})
h.addCustomEvent(entryTypes)
h.addCustomEvent({
    longtask: false,
    element: false,
    paint: false,
    'first-paint': entryTypes.paint,
    'first-contentful-paint': entryTypes.paint,
    'element-load': entryTypes.element,
    'long-task': entryTypes.longtask,
    'network-request': entryTypes.resource,
    resource: false,
    navigation: false,
    'page-navigate': entryTypes.navigation,
    // taskattribution: false,
    // 'task-attribution':true
})
const getStyleThingy = function () {
    return attrStyleMap ? a : b

    function a(e) {
        return e.attributeStyleMap
    }

    function b(e) {
        return e.style
    }
}()

function ApplyBatchedStyles(value, key, map) {
    try {
        this[key] = value
        map.delete(key)
    } catch {
        // Proxy is likely revoked
        map.clear()
    }
}

function BatchStyle(target) {
    return Proxy.revocable(target, {
        __proto__: handlers.batchThing,
        queued: false,
        cached: new Map,
        target,
    })
}

let writes = 0, reads = 0

/*const cleanup = new FinalizationRegistry(({callback, age})=>{
    callback(performance.now() -age)
})
*/
export function prox(target) {
    if (target === null) return null
    if (target[styles]) return target
    if (!getValid(target))
        throw TypeError("Target must implement the 'Element' interface")
    // 🥅 Goal:
    // 🪪 Make an object with a [[Prototype]] being the target element
    // 🪤 Also put a proxy around said object
    // 🚫 I can't use class ... extends ...,
    // ❌ or 'setPrototypeOf' since it's bad i guess?
    // ✅ Only option is 'Object.create' or { __proto__: ... }
    if (!all.has(target)) {
        // ++$.len
        let bleh = {value: target}
            , {revoke: styleRevoke, proxy: styleProxy} = Proxy.revocable(getStyleThingy(target), handlers.styles)
            , {revoke: childRevoke, proxy: childProxy} = Proxy.revocable(target.children, handlers.HTMLCollection)
            , {revoke: querySelectorRevoke, proxy: querySelectorProxy} = Proxy.revocable(target, handlers.querySelector)
            , {revoke: attrRevoke, proxy: attrProxy} = Proxy.revocable(target, handlers.attr)
            , {proxy: batchStyleProxy, revoke: batchRevoke} = BatchStyle(styleProxy)
            , propertiesToDefine = {
                ...prototypeDescriptors,
                [me]: bleh,
                fromQuery: {
                    value: querySelectorProxy
                },
                [saved]: {
                    value: {__proto__: null}
                },
                [computed]: reuse.nullThing,
                /*  [states]: {
                      value: new Map
                  },*/
                selfRules: {
                    value: Object.create(null)
                },
                // state: reuse.state,
                // [shadow]: reuse.junk,
                currentState: reuse.junk,
                lastState: reuse.junk,
                flags: reuse.flags,
                age: {
                    value: performance.now()
                },
                children: {
                    value: childProxy
                },
                attr: {
                    value: attrProxy
                },
                styles: {
                    value: batchStyleProxy
                },
                [styles]: {
                    value: styleProxy
                }
            }
            , {proxy, revoke} = Proxy.revocable(
                Object.seal(Object.create(target, propertiesToDefine)), Object.create(handlers.main, [{value: target}])
                // defineProperty(target, prop) {
                // console.debug(prop)
                // if (prop in target) return Reflect.defineProperty(...arguments)
                // throw TypeError('Object not mutable')
                // }
            )
        ;(target instanceof HTMLUnknownElement ||
            target.ownerDocument.defaultView?.HTMLUnknownElement.prototype.isPrototypeOf(target)) &&
        console.warn(`Unknown element: '${target.tagName.toLowerCase()}'`)

        function RevokeAllProxies() {
            //  Make sure we have *NO* possible references left
            revoke()
            childRevoke()
            attrRevoke()
            styleRevoke()
            batchRevoke()
            querySelectorRevoke()
        }

        revokes.set(proxy, RevokeAllProxies)
        all.set(target, proxy)
        return proxy
    }
    return all.get(target)
}

function getValid(target) {
    try {
        return !!target &&
            (target instanceof Element ||
                target.ownerDocument?.defaultView?.Element.prototype.isPrototypeOf(target)
                //|| Element.prototype.isPrototypeOf(target)
            )
    } catch {
        return false
    }
}

const doc = document.createDocumentFragment()
    , parser = new DOMParser
let temp, div, range, parsingDoc, classRegex = /(?<=\.)[\w-]+/g,
    htmlRegex = /[\w-]+/,
    idRegex = /(?<=#)[\w-]+/,
    typeRegex = /(?<=%)\w+/
const parseModeMap = new Map(Object.entries({
    write(html) {
        (parsingDoc ??= document.implementation.createHTMLDocument())
        .open().write(html)
        parsingDoc.close()
        return document.adoptNode(parsingDoc.body.firstElementChild)
    },
    setHTMLUnsafe(html) {
        (temp ??= document.createElement('template'))
        .setHTMLUnsafe(html)
        return document.adoptNode(temp.content.firstElementChild)
    },
    innerHTML(html) {
        (div ??= document.createElement('div'))
            .innerHTML = html
        return div.removeChild(div.firstElementChild)
    },
    createHTMLDocument(html) {
        (parsingDoc ??= document.implementation.createHTMLDocument()).body.outerHTML = html
        return document.adoptNode(parsingDoc.body.firstElementChild)
    },
    createRange(html) {
        return document.adoptNode((range ??= document.createRange()).createContextualFragment(html).firstElementChild)
    },
    template(html) {
        //  Contender
        (temp ??= document.createElement('template')).innerHTML = html
        return document.adoptNode(temp.content.firstElementChild)
    },
    parseHTMLUnsafe(html) {
        return document.adoptNode(Document.parseHTMLUnsafe(html).body.firstElementChild)
    },
    ''(html) {
        let t = parser.parseFromString(html, 'text/html')
        return document.adoptNode(t.body.firstElementChild)
    }
}))

function safeHTML(o) {
    return o
}

/*if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
it's like being weird for some reason idfk how to use trusted types policy thing
    let t = trustedTypes.createPolicy("default", {
        createHTML: safeHTML,
        createScriptURL: safeHTML,
        createScript: safeHTML
    })
    safeHTML = t.createHTML.bind(t)
}*/
/**
 * # Be careful of html injection when using a string!!
 */
function $(html, props, ...children) {
    if (getValid(html)) return prox(html) // Redirect
    if (typeof html === 'string') html = html.trim()
    let element
    if (html[0] === '<' && html.endsWith('>')) {
        html = safeHTML(html)
        element = prox(parseModeMap.get(parseMode)?.(html) ?? parseModeMap.get('')(html))
    } else {
        element = prox(document.createElement(html.match(htmlRegex)?.[0]))
        let classes = html.match(classRegex),
            id = html.match(idRegex)?.[0],
            type = html.match(typeRegex)?.[0],
            toSet = {}
        classes && (toSet.class = classes.join(' '))
        id && (toSet.id = id)
        type && (toSet.type = type)
        element.setAttr(toSet)
    }
    $.last = element
    let b = base(element)
    if (Array.from(b.querySelectorAll('*'), prox).concat(element).some(allElementStuff)) throw TypeError('Inline event handlers are deprecated')
    if (element.tagName === 'SCRIPT' || b.querySelector('script')) {
        debugger
        throw new DOMException('Potential script injection', 'SecurityError')
    }
    /*{
    let attributes = {}
    if (element.type === 'checkbox') attributes.role = 'checkbox'
    else if (element.type === 'range') attributes.role = 'slider'
    switch (element.tagName.toLowerCase()) {
        case 'dialog': attributes['aria-dialog'] = true; break
        case 'button': attributes['aria-button'] = true; break
        case 'form': attributes['aria-form'] = true; break
    }
    element.setAttributes(attributes)
    }*/
    // i wanted to do the aria stuff SO bad,
    // but its better to just leave it as-is
    /*
               <beforebegin>
                       <element>
                 <afterbegin>
                       <new-element>
                <beforeend>
                       </element>
               <afterend>
    */
    if (props && !getValid(props) && typeof props !== 'string') {
        let {hasOwn} = Object

        function reuse(p) {
            hasOwn(props, p) && (element[p] = props[p])
        }

        reuse('parent')
        hasOwn(props, 'events') && element.on(props.events)
        TEXT_THINGIES.forEach(reuse)
        hasOwn(props, 'txt') && (element.textContent = props.txt)
        // add elements AFTER the textContent/innerHTML/whatever
        HTML_PLACING.forEach(reuse);
        (hasOwn(props, 'attr') || hasOwn(props, 'attributes')) && element.setAttr(props.attributes ?? props.attr)
        hasOwn(props, 'styles') && element.setStyles(props.styles)
        hasOwn(props, 'start') && props.start.call(element)
    } else if (typeof props === 'string' || getValid(props)) {
        children.unshift(props)
        props = null
    }
    children.length && element.push(children.map(elemIfString))
    return element
}

function elemIfString(o) {
    return typeof o === 'string' ? $(o) : o
}

function revoke(targ) {
    revokes.get(targ)?.(revokes.delete(targ))
}

export default Object.defineProperties($, {
    // random: {
    // value() {
    // return
    // }
    // },
    //len:0,
    0: {
        get() {
            return $(window.$0 ?? document.activeElement)
        }
    },
    qs: {
        value(selector) {
            return prox(base($.doc).querySelector(selector))
        }
    },
    /**
     *  @deprecated
     */
    byId: {
        value: new Proxy(document, {
            get(t, p) {
                return prox(t.getElementById(p))
            }
        })
    },
    reads: {
        get() {
            return reads
        }
    },
    writes: {
        get() {
            return writes
        }
    },
    byQuery: {
        value: new Proxy(document, {
            get(t, p) {
                return prox(t.querySelector(p))
            }
        })
    },
    qsa: {
        value(selector) {
            return Array.from(base($.doc).querySelectorAll(selector), prox)
        }
    },
    last: {
        writable: 1,
        value: null,
    },
    setup: {
        value(id) {
            let te = prox(document.getElementById(id) ?? document.querySelector('template'))
            document.body.appendChild(document.importNode(te.content, true))
            te.destroy()
        }
    },
    /**
     *  @deprecated
     */
    gid: {
        value(id) {
            return prox(document.getElementById(id))
        }
    },
    filter: {
        value(filter) {
            return this.qsa('*').filter(filter)
        }
    },
    body: {
        get() {
            return prox(document.body)
        }
    },
    head: {
        get() {
            return prox(document.head)
        }
    },
    xpath: {
        value(xpath, node, type) {
            return props.xpath.call(node ?? document, xpath, type)
        }
    },
    prototype: {
        value: prototype
    },
    doc: {
        get() {
            return prox(document.documentElement)
        }
    }
})
$.id = $.byId
let parseMode = 'mozInnerScreenY' in window ? 'createRange' : ''

//  createRange seems to be *slightly* faster on firefox
function badAttrName(name) {
    return regex.onXYZ.test(name//.nodeName
    )
}

function allElementStuff(e) {
    return e.getAttributeNames().some(badAttrName)
    // return [].some.call(e.attributes, badAttrName)
}

export const define = function () {
    let dfn
    return define
    function define(...args) {
        if (!dfn) {
            let n = $('iframe', {
                parent: document.head
            })
            dfn = n.contentWindow.customElements.define.bind(customElements)
            n.destroy()
            n=null
        }
        return dfn.apply(1, args)
    }
}()
/*export function info(heading, message, parent, yes, no) {
return new Promise(resolve => {
parent ??= $.body
let backdrop = $('div.alertbackdrop', {
    parent
})
let p = $('<form class="alertdialog" aria-modal="true" role="alertdialog"></form>', {
    parent: backdrop
})
let section = p.$('section')
let head = typeof heading === 'string' ? $('h1', {
    textContent: heading,
}) : heading
head.parent = section
let msg = typeof message === 'string' ? $('p', {
        textContent: message
    }) :
    msg
msg.parent = section
let button = typeof yes === 'undefined' ? $(`<button class="cute-green-button" autofocus>Okay</button>`) : yes
backdrop.push(button)
backdrop.fadeIn().then(() => {
    button.on({
        async _click() {
            this.fadeOut(300)
            await p.fadeOut(300)
            await backdrop.fadeOut(300)
            backdrop.destroy()
            resolve()
        }
    })
})
})
}*/
// function reduce(a, b) {
// return a + b
// }
/*
1 || async function () {
    console.log("Test enabled")
    if (location.href.startsWith('http://localhost')) window.test = function (count = 1000, mode = parseMode) {
        parseMode = mode
        let time = performance.now()
        //  console.time(parseMode)
        while (count--) $('<div><p>hello</p></div>').destroy()
        // console.timeEnd(parseMode)
        return performance.now() - time
    }
    let obj = {}
    let {
        default: a
    } = await import('./math.js')
    for (let n of `template createRange createHTMLDocument innerHTML parseHTMLUnsafe default template setHTMLUnsafe write`.split(' ')) {
        obj[n] = []
        for (let i = 4; i--;) {
            obj[n].push(test(3000, n))
        }
        obj[n] = a.average(...obj[n])
    }
    console.log(obj)
}()
*/
/*$.body.on({
    contentvisibilityautostatechange({ target, skipped }) {
        if (target.matches('img[src]') || target.matches('img[data-src]')) {
            target = $(target)
            if (skipped) {
                let { src } = target.attr
                target.attr.src = 'data:image/png,'
                target.setAttr({ $src: src })
            }
            else if (target.attr.$src) {
                target.setAttr({ src: target.attr.$src })
            }
        }
    }
})*/
if (location.host.includes('localhost')) {
    Object.assign(window, {
        $: {
            h, css, $
        }
    })
}
window.Proxy = window.Proxy || function () {
    // i just made this one because i was bored lol
    'use strict'
    var old
    try {
        // Works on rhino engine
        ({
            __proto__: null, __noSuchMethod__: function () {
            }
        }).a()
        old = true
    } catch (e) {
        old = false
    }
    var spreadArgs = function (args) {
        var arr = [].slice.call(args)
        arr.unshift(1)
        return arr
    }

    function revocable(target, handler) {
        if (this instanceof Proxy || this instanceof revocable) throw TypeError("Proxy.revocable is not a constructor")
        if (target === null || (typeof target !== 'object' && typeof target !== 'function') || handler === null || (typeof handler !== 'object' && typeof handler !== 'function')) throw TypeError('Cannot create proxy with a non-object as target or handler')
        var original = target
            , define = typeof target === 'function' ? function () {
                var obj = {}
                    , func = obj[original.name] = function () {
                    if (this instanceof func) {
                        if (revoked) throw TypeError("Cannot perform 'construct' on a proxy that has been revoked")
                        if ('construct' in handler) {
                            var o = handler.construct(original, [].slice.call(arguments), this.constructor)
                            if (o === null || (typeof o !== 'object' && typeof o !== 'function')) throw TypeError("'construct' on proxy: trap returned non-object ('" + (o && (o.toString || {}.toString).call(o)) + "')")
                            return o
                        }
                        return new (original.bind.apply(original, spreadArgs(arguments)))()
                    } else {
                        if (revoked) throw TypeError("Cannot perform 'apply' on a proxy that has been revoked")
                        if ('apply' in handler) return handler.apply(original, this, arguments)
                        return original.apply(obj, arguments)
                    }
                }
                var poisonPill = function () {
                    throw TypeError("'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them")
                }
                poisonPill = {
                    get: poisonPill,
                    set: poisonPill
                }
                return Object.defineProperty(Object.defineProperty(Object.defineProperty(Object.defineProperty(Object.defineProperty(Object.defineProperty(Object.defineProperty((Object.setPrototypeOf || function (func, target) {
                                (Object.getOwnPropertyDescriptor(Object.prototype, '__proto__') || {
                                    set: function () {
                                    }
                                }).set.call(func, target)
                                return func
                            })(func, original),
                            'bind', {
                                value: Function.prototype.bind
                            }), 'call', {
                            value: Function.prototype.call
                        }), 'apply', {
                            value: Function.prototype.apply
                        }), 'name', {
                            value: original.name
                        }), 'caller', Object.getOwnPropertyDescriptor(Function.prototype, 'caller') || poisonPill),
                        'arguments', Object.getOwnPropertyDescriptor(Function.prototype, 'arguments') || poisonPill),
                    'length', {
                        value: original
                    })
            }() : {__proto__: original},
            revoked = false,
            has = {}.hasOwnProperty.bind(define)
        if (old && 'get' in handler) Object.defineProperty(define, '__noSuchMethod__', {
            configurable: 1,
            value: 1 && function (prop, args) {
                return handler.get(define, prop, define, true).apply(1, args)
            }
        })
        do {
            var props = Object.getOwnPropertyNames(target).map(function (prop) {
                    var o = Object.getOwnPropertyDescriptor(target, prop)
                        , out = {}
                        , obj = out[prop] = {}
                    for (var p in o) obj[p] = o[p]
                    return out
                }),
                doThing = function (i) {
                    if (!has(i))
                        Object.defineProperty(define, i, {
                            enumerable: props.enumerable,
                            get: function () {
                                if (revoked) throw TypeError("Cannot perform 'get' on a proxy that has been revoked")
                                if ('get' in handler) return handler.get(original, i, original)
                                var val = original[i]
                                return typeof val === 'function' ? val.bind(original) : val
                            },
                            set: function (value) {
                                if (revoked) throw TypeError("Cannot perform 'set' on a proxy that has been revoked")
                                if ('set' in handler) {
                                    var r = handler.set(original, i, value, original)
                                    if (!r) throw TypeError("'set' on proxy: trap returned falsish for property '" + i + "'")
                                } else original[i] = value
                            }
                        })
                }
            props.forEach(function (prop) {
                for (var i in prop) doThing(i)
            })
        }
        while (target = Object.getPrototypeOf(target))
        return {
            proxy: define,
            revoke: 1 && function () {
                revoked = target = handler = original = define = true
            }
        }
    }

    function Proxy(target, handler) {
        if (!(this instanceof Proxy)) throw TypeError("Constructor Proxy requires 'new'")
        return revocable(target, handler).proxy
    }

    return Object.defineProperty(Proxy, 'revocable', {
        value: revocable,
        writable: 1,
        configurable: 1,
    })
}()