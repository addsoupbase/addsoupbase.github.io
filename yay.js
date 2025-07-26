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
function bind(target) {
    return new Proxy(target, bindHandler)
}
let bindHandler = {
    get(target, prop) {
        return target[prop].bind(target)
    }
}
const { get, set, apply, getOwnPropertyDescriptor, ownKeys } = Reflect,
    { revocable } = Proxy,
    { create, preventExtensions, defineProperty, defineProperties, getOwnPropertyDescriptors, assign } = Object
import*as h from'./handle.js'
import*as css from'./csshelper.js'
function from(ArrayLike, map, thisArg) {
    // Array.from checks @@iterator first, which would be slower in cases where it is callable
    return ArrayLike.length >= 0 ? map ? [].map.call(ArrayLike, map, thisArg) : [].slice.call(ArrayLike) : map ? Array.from(ArrayLike, map, thisArg) : typeof ArrayLike[Symbol.iterator] !== 'undefined' ? [...ArrayLike] : []
}
function debounce(func, interval) {
    let waiting = false
    return DebouncedFunction
    function enable() { 
        waiting = false
    }
    function DebouncedFunction(...args) {
        if (!waiting) {
            waiting = true
            setTimeout(enable, interval)
            apply(func, this, args)
        }
        return !waiting
    }
}

Object.hasOwn ?? defineProperty(Object, 'hasOwn', {
    value: hasOwnProperty.call.bind(hasOwnProperty),
    writable: 1,
    configurable: 1
})
const { hasOwn } = Object
    , regex = {
        dot: /\./g,
        space: /\s/g,
        onXYZ: /^on\w+$/
    },
    me = Symbol('[[Target]]'),
    saved = Symbol('[[SavedAttributes]]'),
    all = new WeakMap,
    revokes = new WeakMap,
    busy = Symbol('[[DeprecatedBusy]]'),
    mediaQueries = Symbol('[[ObservedMediaQueries]]')
function gen() {
    return `${Math.random()}${Math.random()}`.replace(regex.dot, '')
}

const { get: BoundGet, set: BoundSet, has: BoundHas } = bind(new WeakMap)
function cacheFunction(maybeFunc) {
    // Make sure we just re-use the same function
    /*if (typeof maybeFunc === 'function') {
        if (!Object.hasOwn(to, maybeFunc.name)) defineProperty(prox(to), maybeFunc.name, {
            value: maybeFunc.bind(to),
            writable: 1,
            configurable: 1
        })
        return to[maybeFunc.name]
    }*/
    // There was like a catastrophic bug but i fixed it bc im the best
    if (typeof maybeFunc === 'function') {
        if (BoundHas(maybeFunc)) return BoundGet(maybeFunc)
        // let wrapper = new Proxy(maybeFunc,handlers.function)
        const { name } = maybeFunc
            , wrapper = {
                [name](...a) {
                    // Regular wrapper function for method,
                    // for usage instead of making a new one for every instance with bind()
                    return apply(maybeFunc, base(this), a)
                }
            }[name]  // keep the original function name just in case
        BoundSet(maybeFunc, wrapper)
        return wrapper
    }
    return maybeFunc
}
const arrHasOwn = hasOwnProperty.bind(Array.prototype)
function genericGet(t, prop) {
    let out = t[prop]
    if (typeof prop !== 'symbol' && !isNaN(prop))
        return out && prox(out)
    if (arrHasOwn(prop) && typeof [][prop] === 'function') return [][prop].bind(t)
    return cacheFunction(out, t)
}

function ariaOrData(i) {
    let { 0: char } = i
    if (char === '_') return i.replace(char, 'aria-')
    if (char === '$') return i.replace(char, 'data-')
    return i
}
let vendorRegex = /^(?:webkit|moz|ms)/
function doVendor(target, prop, r) {
    if (typeof prop === 'symbol') return this.apply(1, arguments)
    try {
        let p = prop
        prop = prop.replace(vendorRegex, '')
        let slice = prop.slice(1),
            tuc = prop[0].toUpperCase()
        if (p in target) return this.apply(1, arguments)
        if ((p = `webkit${tuc}${slice}`) in target) return this(target, p, r)
        if ((p = `moz${tuc}${slice}`) in target) return this(target, p, r)
        if ((p = `ms${tuc}${slice}`) in target) return this(target, p, r)
    }
    catch {
        return this.apply(1, arguments)
    }
}
let getVendor = doVendor.bind(get),
    setVendor = doVendor.bind(set)
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
                return val ?? (this.cached.set(p, val = handlers.styles.get(t, p)), val)
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
                return targ.hasOwnProperty(prop) ? get(targ, prop, r) :
                    cacheFunction(get(a, prop, a), a)
                // ⛓️‍💥 'Illegal invocation' if function is not bound
            },
            // ownKeys(target){
                // don't expose any implementation details
                // return Object.getOwnPropertyNames(target).concat(Symbol.iterator,Symbol.toPrimitive)
            // },
            set(targ, prop, value) {
                let t = targ.hasOwnProperty(prop) ? targ : this[0]
                return set(t, prop, value, t)
            }
        },
        querySelector: {
            get(t, p) {
                return prox(t.querySelector(p))
            }
        },
        styles: attrStyleMap ? {
            // Behave somewhat like a string, for compatibility with browsers that don't support attributeStyleMap
            proxy: {
                has(t, p) {
                    return p in new String || p in t
                },
                get(t, p) {
                     return p in new String? ''[p].bind(`${t}`): t[p]
                },
            },
            get(target, prop) {
                let out = prop.startsWith('--') ? target.get(prop) : target.get(css.dashVendor(prop, 'inherit'))
                return out && new Proxy(Object.freeze(out), handlers.styles.proxy)
            },
            set(target, prop, value) {
                value == null || value === '' ? this.deleteProperty(target, prop)
                    : prop.startsWith('--') ? target.set(prop, value) : target.set(css.dashVendor(prop, `${value}`), value)
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
                prop.startsWith('--') ? target.setProperty(prop, value)
                    : target.setProperty(css.dashVendor(prop, `${value}`), value)
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
let computed = Symbol('[[ComputedStyles]]')
// let styles = Symbol('stop')
// let shadow = Symbol('🌴')
let props = getOwnPropertyDescriptors(class _
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
    toJSON() {
        let me = base(this)
        return me.getHTML?.({ serializableShadowRoots: true }) ?? me.outerHTML
    }

    xpath(xpath, callback, type, thisArg) {
        let i = document.evaluate(xpath, base(this), null, type ?? 0, null),
            el,
            n = 0,
            next = i.iterateNext.bind(i)
        while (el = next()) apply(callback, thisArg, [el instanceof HTMLElement ? prox(el) : el, n++, i])
    }

    get orphans() {
        let me = base(this)
        if (me.tagName === 'TEMPLATE')
            return me.content
        let out = document.createDocumentFragment(),
            { firstElementChild } = me
        while (firstElementChild)
            out.appendChild(me.removeChild(firstElementChild)), { firstElementChild } = me
        return out
    }

    pass() {
        let { orphans } = this
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
        let my = base(this.resetSelfRules()
            .cancelAnims().destroyChildren())
        // let myStates = this[states]
        /*for (let [key, {
            cached: val
        }] of myStates) {
            myStates.delete(key)
            for (let el of val.content.querySelectorAll('*'))
                prox(el).destroy()
        }*/
        // $.last === this&& ($.last = null)
        do my.remove()
        while (my.isConnected /*document.contains(my)*/)
        let myevents = h.getEventNames(my)
        myevents.size && this.off(...myevents)
        all.delete(my)
        // inte?.unobserve(my)
        // resi.unobserve(my)
        revoke(this)
        return null
    }

    destroyChildren() {
        let { lastElementChild } = this
        while (lastElementChild)
            prox(lastElementChild).destroy(), { lastElementChild } = this
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
    static ProxyEventWrapperFunction(me, ...args) {
        apply(this, me, args)
    }
    on(events, controller) {
        arguments.length > 2 && h.getLabel(controller) !== 'AbortController' && (controller = arguments[2])
        // There used to be a 'useHandler' parameter
        let me = this
        if (typeof events === 'function') events = _.ProxyEventWrapperFunction.bind(old, me)
        else for (let i in events) events[i] = _.ProxyEventWrapperFunction.bind(events[i], me)
        h.on(base(this), events, controller)
    }

    off(...events) {
        events.unshift(base(this))
        apply(h.off, null, events)
    }

    set(prop, val) {
        base(this)[prop] = val
    }

    getByTag(tag) {
        return from(base(this).getElementsByTagName(tag), prox)
    }

    debounce(events, interval, controller) {
        for (let i in events) events[i] = debounce(events[i], interval)
        this.on(events, controller)
    }

    /* throttle(events, interval) {
         for (let i in events) {
             let old = events[i]
             events[i] = f.throttle(old, interval)
         }
         this.on(events)
 }*/
    static DelegationFunction(me, includeSelf, filter, ...args) {
        let { target } = args[0],
            pr = prox(target);
        (me !== target || includeSelf) && (filter(pr) ?? 1) && apply(this, pr, args)
    }
    delegate(events, filter, includeSelf, controller) {
        let me = base(this)
        filter ??= function () {
        }
        for (let i in events) {
            if (i.includes('@')) throw SyntaxError("Conflicting usage of a 'currentTarget' only delegating event handler")
            events[i] = _.DelegationFunction.bind(events[i], me, includeSelf, filter)
        }
        this.on(events, false, controller)
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
        assign(this.styles, styles)
        //base(this).style.cssText = out.join(';')
    }

    static canBeDisabled = /^HTML(?:Button|FieldSet|Opt(?:Group|tion)|Select|TextArea|Input)Element$/

    set disabled(val) {
        if (val) {
            if (_.canBeDisabled.test(h.getLabel(base(this)))) this.setAttr({ disabled: true })
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
            if (_.canBeDisabled.test(h.getLabel(base(this)))) this.setAttr({ disabled: false })
            else this.restoreAttr('contenteditable', 'inert')
                .setAttr({ _disabled: 'false' })
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
            let s = this[saved] = { __proto__: null },
                attributes = me.getAttributeNames()
            for (let { length: i } = attributes; i--;) {
                let attr = attributes[i],
                    val = me.getAttribute(attr)
                s[attr] = val || true
            }
        } else {
            let s = this[saved]
            for (let { length: i } = attributes; i--;) {
                let attr = attributes[i],
                    val = me.getAttribute(attr)
                s[attr] = val === '' ? true : me.getAttribute(attr)
            }
        }
    }

    restoreAttr(...attributes) {
        let s = this[saved]
        if (!attributes.length) attributes = base(this).getAttributeNames()
        for (let { length: i } = attributes; i--;) {
            let attr = attributes[i]
            this.setAttr({ [attr]: s[attr] })
        }
    }

    setAttr(attr) {
        let me = base(this),
            test = / /.test.bind(regex.onXYZ)
        for (let i in attr) {
            let n = i.split(',')
                , val = attr[i]
            if (test(i)) throw TypeError('Inline event handlers are deprecated')
            /*   switch (i) {
                   case 'disabled': me.setAttribute('aria-disabled', !!val); break
                   case 'checked': me.setAttribute('aria-checked', !!val); break
                   case 'hidden': me.setAttribute('aria-hidden', !!val); break
                   case 'required': me.setAttribute('aria-required', !!val); break
                   case 'readonly': me.setAttribute('aria-readonly', !!val); break
                   case 'placeholder': me.setAttribute('aria-placeholder', val); break
               }*/
            for (let { length: a } = n; a--;) {
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
        apply(base(this).replaceWith, base(this), elements.map(base))
    }

    wrap(parent) {
        let { parent: p } = this
            ; (this.parent = $(parent)).parent = p
    }

    unwrap() {
        let { parent } = this
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
     * @param {integer} t
     * # 1 - 5
     */
    hide(t) {
        switch (t) {
            case 1:
            default:
                this.setAttr(_.hidden)
                break
            case 2:
                base(this).style.visibility = 'hidden'
                break
            case 3:
                base(this).style.display = 'none'
                break
            case 4:
                this.setStyles({ '--content-visibility': 'hidden' })
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
                    .setAttr({ _hidden: "true", contenteditable: 'false', inert: true })
                break
        }
    }

    /**
     *
     * @param {integer} t
     * # 1 - 5
     */
    show(t) {
        switch (t) {
            case 1:
            default:
                this.setAttr(_.notHidden)
                break
            case 2:
                base(this).style.visibility = 'visible'
                break
            case 3:
                base(this).style.display = ''
                break
            case 4:
                this.setStyles({ '--content-visibility': '' })
                break
            case 5:
                this.setStyles({
                    opacity: '',
                    '--user-input,--user-focus,--user-select,pointer-events,--user-modify,--interactivity': '',
                })
                    .setAttr({ _hidden: "", contenteditable: '', inert: false })
                break
        }
    }
    static queries = new Map
    static querySyntax = / /.test.bind(/^(?:\(.+\))$/)
    match(queries, flags, controller) {
        flags ??= ''
        let my = this[mediaQueries]
        for (let i in queries) {
            let query = i
                , val = queries[i]
            _.querySyntax(query) || (query = `(${query})`)
            query = matchMedia(query).media // Create a dummy to correctly format the string first
            if (my.has(query) && !controller) {
                console.warn(`Skipped duplicate media listener for ${query}`)
                continue
            }
            if (!_.queries.has(query)) {
                let media = matchMedia(query)
                let listening = new Set
                function dispatchAll(element) {
                    element = base(element)
                    h.delayedDispatch(query, element, new CustomEvent(query, {
                        detail
                    }))
                }
                h.on(media, {
                    change() {
                        listening.forEach(dispatchAll)
                    }
                })
                let detail = {
                    mediaQuery: media,
                    get matches() {
                        return media.matches
                    },
                    listening
                }
                _.queries.set(query, detail)
            }
            let detail = _.queries.get(query)
            let { mediaQuery:{matches}, listening } = detail
            listening.add(this)
            this.on({
                [`${flags}${query}`]: val
            }, controller)
            matches && h.delayedDispatch(query, base(this), new CustomEvent(query, { detail }))
        }
    }
    equals(other) {
        let temp = $(other)
        let out = base(temp).isEqualNode(base(this))
        temp?.destroy()
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
    static filter(node) {
        return this(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    }
    treeWalker(whatToShow, callback, filter, thisArg) {
        let walker = document.createTreeWalker(base(this), whatToShow ?? NodeFilter.SHOW_ALL, _.filter.bind(filter ??= function () {
            return 1
        })), current,
            i = 0,
            next = walker.nextNode.bind(walker)
        while (current = next()) apply(callback, thisArg ?? this, [getValid(current) ? prox(current) : current, i++, walker])
    }

    *[Symbol.iterator]() {
        let all = base(this).getElementsByTagName('*')
        for (let { length: i } = all; i--;) yield prox(all[i])
    }

    [Symbol.toPrimitive]() {
        throw TypeError('Cannot convert Element to a primitive value')
        // Don't want to accidentally convert to a string for stuff like
        // append, prepend, etc.
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
        for (let i in this.selfRules) try {
            customRules.deleteRule([].indexOf.call(customRules.cssRules, this.selfRules[i]))
        } catch (e) {
            console.debug(e)
        }
    }


    addSelfRule(selector, cssStuff) {
        const og = selector
        let id
        try {
            let me = base(this)
            if (me.hasAttribute('id')) id = me.getAttribute('id')
            else do id = gen()
            while (document.getElementById(id))
            if (selector.includes('::')) selector = css.pev(selector)
            else if (selector.includes(':')) selector = css.pcv(selector)
            const final = `#${CSS.escape(id)} ${selector}{${(css.toCSS(cssStuff))}}`
            let existing = this.selfRules[css.formatStr(selector.replace(regex.space, ''))]
            existing ? existing.insertRule(final) :
                (this.selfRules[css.formatStr(selector.replace(regex.space, ''))] = customRules.cssRules[customRules.insertRule(final)])
            this.setAttr({
                id
            })
        } catch {
            css.badCSS(`⛓️‍💥 Unrecognized CSS rule at '${og}'`)
        }
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
    static badForReducedMotion = /^(?:transform|scale|zoom|translate|rotate)$/
    animate(keyframes, options) {
        (options ??= {}).timing ??= 'ease'
        options.iterations ??= 1
        options.pseudoElement &&= css.pev(options.pseudoElement)
        keyframes.forEach(_.forEach)
        if (css.reducedMotion.matches) {
            let test = / /.test.bind(_.badForReducedMotion)
            loop: for (let i = keyframes.length; i--;) {
                let val = keyframes[i]
                for (let i in val) if (test(i)) {
                    options.duration = 0
                    break loop
                }
            }
        }
        return base(this).animate(keyframes, options)
    }

    set after(val) {
        base(this).after(base(val))
    }

    set before(val) {
        base(this).before(base(val))
    }

    get after() {
        let { nextElementSibling } = base(this)
        return prox(nextElementSibling)
    }

    get before() {
        let { previousElementSibling } = base(this)
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
        let { firstElementChild } = base(this)
        return prox(firstElementChild)
    }

    get last() {
        let { lastElementChild } = base(this)
        return prox(lastElementChild)
    }

    get length() {
        return base(this).getElementsByTagName('*').length
    }
    get isBusy() {
        return this.attr._busy === 'true'
    }
    set isBusy(val) {
        this.attr._busy = `${!!val}`
    }
    /**
    * @deprecated
    */
    get busy() {
        debugger
        return this[busy]
    }

    /**
     * @deprecated
     */
    set busy(val) {
        this.isBusy = val
    }
    /**
     * @deprecated
     */
    [busy](busy) {
        debugger
        this.setAttr({
            _busy: `${!!busy}`
        })
            .setStyles({
                cursor: busy ? 'progress' : ''
            })
    }

    copyAttr(other) {
        let me = base(this),
            attr = other.getAttributeNames(),
            getAttribute = other.getAttribute.bind(base(other)),
            setAttribute = me.setAttribute.bind(me)
        for (let { length: i } = attr; i--;) {
            let name = attr[i]
            setAttribute(name, getAttribute(name))
        }
    }
}.prototype
)
const prototype = { __proto__: null }
    , TEXT_THINGIES = new Set('outerHTML outerText innerHTML innerText textContent'.split(' '))
TEXT_THINGIES.forEach(txt =>
    defineProperty(prototype, txt, {
        configurable: false,
        get() {
            return base(this)[txt]
        },
        set(val) {
            let me = base(this),
                count = me.childElementCount
            if (count) throw TypeError(`Failed to set property '${txt}' on '${h.getLabel(base(this))}': Node has ${plural('child', 'children', count)}`)
            me[txt] = safeHTML(val)
        }
    })
)
const HTML_PLACING = new Set('beforebegin afterbegin beforeend afterend'.split(' '))
{
    let getters = {
        beforebegin() {
            let me = base(this),
                out = me.previousSibling
            return getValid(out) ? prox(out) : out
        },
        afterbegin() {
            let me = base(this),
                out = me.firstChild
            return getValid(out) ? prox(out) : out
        },
        beforeend() {
            let me = base(this),
                out = me.lastChild
            return getValid(out) ? prox(out) : out
        },
        afterend() {
            let me = base(this),
                out = me.nextSibling
            return getValid(out) ? prox(out) : out
        }
    }
    HTML_PLACING.forEach(set =>
        defineProperty(prototype, set, {
            configurable: false,
            set(val) {
                if (h.getLabel(val) === "Text") return base(this).insertAdjacentText(set, val.textContent)
                let b = base(val)
                getValid(b) ?
                    base(this).insertAdjacentElement(set, b) :
                    base(this).insertAdjacentHTML(set, val)
            },
            get: getters[set],
        })
    )
}
// !('scrollTopMax'in Element.prototype || 'scrollLeftMax' in Element.prototype) && Object.defineProperties(Element.prototype,)
'offsetLeft offsetTop offsetWidth offsetHeight offsetParent clientLeft clientTop clientWidth clientHeight scrollWidth scrollHeight scrollTopMax scrollLeftMax'
    .split(' ').forEach(prop => {
        // Reading these properties causes reflows/layout-shift/repaint whatever its called idk
        let cached = null,
            queued = false

        function resetThingy() {
            cached = null
            queued = false
            reads = 0
        }
        let reset = requestAnimationFrame.bind(window, resetThingy)
        defineProperty(prototype, prop, {
            configurable: false,
            get() {
                ++reads
                queued || (reset(), queued = true)
                if (prop === 'scrollTopMax' || prop === 'scrollLeftMax') {
                    let a = cached ??= base(this)[prop]
                    if (a == null) {
                        switch (prop) {
                            case 'scrollTopMax': a = this.scrollHeight - this.clientHeight
                                break
                            case 'scrollLeftMax': a = this.scrollWidth - this.clientWidth
                                break
                        }
                        cached = a
                    }
                    return cached
                }
                return cached ??= base(this)[prop]
            }
        })
    })
// i just like using emojis sorry
ownKeys(props).forEach(i => {
    if (i !== 'constructor') {
        let v = props[i],
            { value } = v
        v.configurable = false
        typeof value === 'function' && (v.value = {
            [i](...a) {
                //  This function is for automatically returning the 'this'
                //  value if the original return value is undefined
                let me = prox(this), b = base(this)
                if (!getValid(b) || !all.has(b)) throw TypeError('Illegal input')
                let r = apply(value, me, a)
                return typeof r === 'undefined' ? me : r
            }
        }[i]) //  Just want to keep the original function name intact
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
        defineProperty(prototype, i, v)
    }
})
{
    let styleMe = getOwnPropertyDescriptor(prototype, 'setStyles')
    defineProperties(prototype,
        {
            setAttributes: getOwnPropertyDescriptor(prototype, 'setAttr'),
            kill: getOwnPropertyDescriptor(prototype, 'destroy'),
            killChildren: getOwnPropertyDescriptor(prototype, 'destroyChildren'),
            styleMe,
            setStyle: styleMe
        }
    )
}
// 🖨 Copy everything
const prototypeDescriptors = getOwnPropertyDescriptors(prototype)
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
    ContentVisibilityAutoStateChangeEvent !== 'function' || typeof mozInnerScreenX === 'number')  /*Firefox is weird again*/ {
    inte = new IntersectionObserver(IntersectionObserverCallback, {
        threshold: [0, Number.MIN_VALUE]
    })
    function IntersectionObserverCallback(entries) {
        for (let { length: i } = entries; i--;) {
            let me = entries[i],
                { target } = me
            target = $(target)
            if (target.computed.getPropertyValue('--content-visibility').trim() === 'auto') {
                let skipped = !me.isIntersecting
                target.setStyle({
                    visibility: skipped ? 'hidden' : 'visible'
                })
                h.delayedDispatch('contentvisibilityautostatechange', base(target), new CustomEvent('contentvisibilityautostatechange', {
                    bubbles: true,
                    detail: { skipped }
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
let waitingForImport = new Set('img-sprite touch-joystick seek-bar paper-canvas'.split(' '))
export async function importWebComponent(name) {
    imported.has(name) || (await import(`./webcomponents/${name}.js`), imported.add(name), waitingForImport.delete(name))
}
function observeAll(node) {
    let n = node.tagName.toLowerCase()
    waitingForImport.has(n) && importWebComponent(n)
    // if (node instanceof CUSTOM_ELEMENT_SPRITE) node.getAttributeNames().forEach(refreshAttributes, node)
    inte?.observe(node)
    let observe = resi.observe.bind(resi)
    observe(node)
    observe(node, { box: 'border-box' })
    observe(node, { box: 'device-pixel-content-box' })
}

function unobserveAll(node) {
    inte?.unobserve(node)
    resi.unobserve(node)
}

function MutationObserverCallback(entry) {
    for (let { length: ii } = entry; ii--;) {
        let me = entry[ii],
            { addedNodes, removedNodes } = me
        for (let { length: i } = addedNodes, node; i--;)
            if ((node = addedNodes[i]) instanceof Element || node?.ownerDocument?.defaultView.Element.prototype.isPrototypeOf(node))
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
        for (let { length: i } = removedNodes, node; i--;)
            if ((node = removedNodes[i]) instanceof Element || node?.ownerDocument?.defaultView.Element.prototype.isPrototypeOf(node))
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

const muta = new MutationObserver(MutationObserverCallback)
muta.observe(document.documentElement, {
    subtree: true,
    childList: true
})

/*
RESIZE OBSERVER STUFFS
*/
function ResizeLoop(o) {
    let { borderBoxSize, contentBoxSize, devicePixelContentBoxSize } = o
    h.delayedDispatch('ResizeObserver', o.target, new CustomEvent('re-scale', {
        bubbles: true,
        detail: {
            borderBoxSize: borderBoxSize[0] ?? borderBoxSize,
            contentBoxSize: contentBoxSize[0] ?? contentBoxSize,
            contentRect: o.contentRect,
            devicePixelContentBoxSize: devicePixelContentBoxSize[0] ?? devicePixelContentBoxSize,
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
;[].forEach.call(document.getElementsByTagName('*'),observeAll)

/*
PERFORMANCE OBSERVER STUFFS
*/
let painted = false
function PerformanceLoop(o) {
    let detail,
        title = o.entryType
    switch (title) {
        case 'layout-shift': {
            let { sources } = o
            for (let { length: i } = sources; i--;) {
                let { node, currentRect, previousRect } = sources[i]
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
            title = 'long-task'
        // [top, parent].forEach(o=>o!== window && delayedDispatch(o.entryType,o, new CustomEvent(title, {
        //     detail
        // })))
        // console.warn(o)
        case "long-animation-frame":
        case 'first-input':
            // detail.actualTarget = o.target
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
            let { type } = detail
            delete detail.type
            detail.navigationType = type
            break
        case 'element':
            title = 'element-load'
            detail = o
        case 'paint':
            switch (o.name) {
                case 'first-paint':
                    painted = true
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
let supported = Set.prototype.has.bind(new Set(PerformanceObserver.supportedEntryTypes)),
    observe = perf.observe.bind(perf)
ownKeys(entryTypes).forEach(type =>
    supported(type) && observe({ type, buffered: true })
)
observe = null
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
    function a(e) { return e.attributeStyleMap } function b(e) { return e.style }
}()

function ApplyBatchedStyles(value, key, map) {
    try {
        handlers.styles.set(this, key, value)
        map.delete(key)
    } catch (e) {
        console.debug(e)
        // Proxy is likely revoked
        map.clear()
    }
}

function BatchStyle(target) {

    return revocable(target, {
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
    if (target[me]) return target
    if (!getValid(target))
        throw TypeError("Target must implement the 'Element' interface")
    // 🥅 Goal:
    // 🪪 Make an object with a [[Prototype]] being the target element
    // 🪤 Also put a proxy around said object
    // 🚫 I can't use class ... extends ...,
    // ❌ or 'setPrototypeOf' since it's bad i guess?
    // ✅ Only option is 'create' or { __proto__: ... }
    if (!all.has(target)) {
        // ++$.len
        let bleh = { value: target }
            // , { revoke: styleRevoke, proxy: styleProxy } = revocable(getStyleThingy(target), handlers.styles)
            , { revoke: childRevoke, proxy: childProxy } = revocable(target.children, handlers.HTMLCollection)
            , { revoke: querySelectorRevoke, proxy: querySelectorProxy } = revocable(target, handlers.querySelector)
            , { revoke: attrRevoke, proxy: attrProxy } = revocable(target, handlers.attr)
            , { proxy: batchStyleProxy, revoke: batchRevoke } = BatchStyle(getStyleThingy(target))
            , propertiesToDefine = {
                ...prototypeDescriptors,
                [me]: bleh,
                fromQuery: {
                    value: querySelectorProxy
                },
                [saved]: {
                    value: { __proto__: null }
                },
                [computed]: reuse.nullThing,
                /*  [states]: {
                      value: new Map
                  },*/
                selfRules: {
                    value: { __proto__: null }
                },
                // state: reuse.state,
                // [shadow]: reuse.junk,
                currentState: reuse.junk,
                lastState: reuse.junk,
                flags: reuse.flags,
                age: {
                    value: performance.now()
                },
                [mediaQueries]: {
                    value: new Set
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
                // [styles]: {
                // value: styleProxy
                // }
            }
            , { proxy, revoke } = revocable(
                preventExtensions(create(target, propertiesToDefine)), create(handlers.main, [{ value: target }])
            )
            ; (target instanceof HTMLUnknownElement ||
                target.ownerDocument.defaultView?.HTMLUnknownElement.prototype.isPrototypeOf(target)) &&
                console.warn(`Unknown element: '${target.tagName.toLowerCase()}'`)
        revokes.set(proxy, RevokeAllProxies.bind(1, revoke, childRevoke, attrRevoke,/* styleRevoke,*/ batchRevoke, querySelectorRevoke))
        all.set(target, proxy)
        return proxy
    }
    return all.get(target)
}

function RevokeAllProxies(...args) {
    //  Make sure we have *NO* possible references left
    args.forEach(apply)
}
function getValid(target) {
    try {
        return !!(target && (target instanceof Element || target.ownerDocument?.defaultView?.Element.prototype.isPrototypeOf(target)))
        //|| Element.prototype.isPrototypeOf(target)
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
    let type = typeof html
    // if (type === 'number') return prox(document.getElementsByTagName('*')[html])
    type === 'string' && (html = html.trim())
    let element
    if (html?.[0] === '<' && html.endsWith('>')) {
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
    // $.last = element
    let b = base(element)
    if (from(b.querySelectorAll('*'), prox).concat(element).some(allElementStuff)) throw TypeError('Inline event handlers are deprecated')
    if (element.tagName === 'SCRIPT' || b.querySelector('script')) {
        debugger
        throw new DOMException('Potential script injection', 'SecurityError')
    }
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
        let reuse = assignIfOwn.bind(1, props, element)
        reuse('parent')
        hasOwn(props, 'events') && element.on(props.events)
        TEXT_THINGIES.forEach(reuse)
        hasOwn(props, 'txt') && (element.textContent = props.txt)
        // add elements AFTER the textContent/innerHTML/whatever
        HTML_PLACING.forEach(reuse);
        (hasOwn(props, 'attr') || hasOwn(props, 'attributes')) && element.setAttr(props.attributes ?? props.attr)
        hasOwn(props, 'styles') && element.setStyles(props.styles)
        hasOwn(props, 'start') && props.start.call(element)
    } else if (typeof props === 'string' || getValid(props))
        children.unshift(props),
            props = null
    children.length && element.push(children.map(elemIfString))
    return element
}
'currentCSSZoom' in Element.prototype || Object.defineProperty(Element.prototype, 'currentCSSZoom', {
    get() {
        return +(getComputedStyle(this).getPropertyValue('zoom') || 1 * this.parentElement?.CSSZoom || 1)
    }
})
function assignIfOwn(props, element, p) {
    hasOwn(props, p) && (element[p] = props[p])
}
function elemIfString(o) {
    return typeof o === 'string' ? $(o) : o
}
function revoke(targ) {
    revokes.get(targ)?.()
    revokes.delete(targ)
}

export default defineProperties($, {
    // random: {
    // value() {
    // return
    // }
    // },
    //len:0,
    hasFullscreen: {
        get() {
            return !!(document.fullscreen || document.fullscreenElement || window.fullScreen)
        }
    },
    push: {
        value(node, ...children) {
            apply(node.append, node, children.map(base))
            return node
        }
    },
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
            return from(base($.doc).querySelectorAll(selector), prox)
        }
    },
    /*
    last: {
        writable: 1,
        value: null,
    },*/
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
            return props.xpath.value.call(node ?? document, xpath, type)
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
//  createRange seems to be *slightly* faster on firefox
let parseMode = 'mozInnerScreenY' in window ? 'createRange' : ''
function badAttrName(name) {
    return regex.onXYZ.test(name)
}

function allElementStuff(e) {
    return e.getAttributeNames().some(badAttrName)
    // return [].some.call(e.attributes, badAttrName)
}

export const define = function () {
    let dfn
    if (Function.prototype.toString.call(customElements.define) === `${Function.prototype}`.replace('function ', 'function define')) return customElements.define.bind(customElements)
    console.warn("Monkeypatch detected: ", customElements.define)
    return define
    function define(...args) {
        if (!dfn) {
            let n = $('iframe', {
                parent: document.head
            })
            dfn = n.contentWindow.CustomElementRegistry.prototype.define.bind(customElements)
            n.destroy()
            n = null
        }
        return dfn.apply(1, args)
    }
}()
typeof mozInnerScreenX === 'number' && !supported('paint') && addEventListener('MozAfterPaint', () => painted ||= !dispatchEvent(new Event('first-paint')), { once: true })
supported = null
// diary stuff
if (location.pathname.startsWith('/entries') && (location.host === 'localhost:3000' || location.host === 'addsoupbase.github.io')) document.querySelector('script[src="../../diary.js"]') ?? import('./diary.js');
/localhost/.test(origin) && (window.$ = $)