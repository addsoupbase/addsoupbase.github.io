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
import * as h from './handle.js'
import * as css from './csshelper.js'
import * as f from './functions.js'

if (!Object.hasOwn) Object.defineProperty(Object, 'hasOwn', {
    value: (obj, prop) => ({}).hasOwnProperty.call(obj, prop),
    writable: 1,
    configurable: 1
})
const regex = {
        dot: /\./g,
        space: /\s/g,
        onXYZ: /^on\w+$/
    },
    me = Symbol('base'),
    all = new WeakMap,
    revokes = new WeakMap

function gen() {
    return `${Math.random()}${Math.random()}`.replace(regex.dot, '')
}

const BoundFunctions = new WeakMap

function cacheFunction(maybeFunc, to) {
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
                return maybeFunc.apply(base(this), a)
            }
        }[name]  // keep the original function name just in case
        BoundFunctions.set(maybeFunc, wrapper)
        return wrapper
    }
    return maybeFunc
}

function genericGet(t, prop) {
    if (typeof prop !== 'symbol' && !isNaN(prop)) {
        let out = t[prop]
        return out && prox(out)
    }
    if (Array.prototype.hasOwnProperty(prop) && typeof [][prop] === 'function') return [][prop].bind(t)
    let out = t[prop]
    return cacheFunction(out, t)
}

function ariaOrData(i) {
    let {0: char} = i
    if (char === '_') i = i.replace(char, 'aria-')
    else if (char === '$') i = i.replace(char, 'data-')
    return i
}

const customRules = css.getDefaultStyleSheet()
const handlers = {
    // Other proxies
    main: {
        // just create as few closures as possible
        get(targ, prop) {
            let a = this[0]
            return targ.hasOwnProperty(prop) ? targ[prop] :
                cacheFunction(a[prop], a)
            // ⛓️‍💥 'Illegal invocation' if function is not bound
        },
        set(targ, prop, value) {
            return (targ.hasOwnProperty(prop) ? targ : this[0])[prop] = value, 1
        }
    },
    querySelector: {
        get(t, p) {
            return prox(t.querySelector(p))
        }
    },
    styles: Object.fromEntries(Object.entries({
            get(target, prop) {
                return prop.startsWith('--') ? target.getPropertyValue(prop) :
                    target.getPropertyValue(css.dashVendor(prop, 'inherit'))
            },
            set(target, prop, value) {
                if (prop.startsWith('--')) target.setProperty(prop, value)
                else value ?
                    target.setProperty(css.dashVendor(prop, value), value) :
                    this.deleteProperty(target, prop)
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
        })
        //  Don't know why but below isn't working on firefox only like usual
        /* .map(({ 0: key, 1: value }) => ({
             0: key,
             StyleFunction(...args) {
                 if (args[1] === 'cssFloat') args[1] = 'float'
                 // there might be some other props on other objects that are/were reserved words, like class
                 return value.apply(this, args)
             }
         })
     )*/
    ),
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
let states = Symbol('💾')
let computed = Symbol('🔬')
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
        o.play(o.currentTime = 0)
    }

    get isVisible() {
        let rect = base(this).getBoundingClientRect()
            , viewHeight = Math.max(document.documentElement.clientHeight, innerHeight)
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
    }

    get computed() {
        return this[computed] ??= getComputedStyle(base(this))
    }

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

    toJSON() {
        return base(this).outerHTML
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
        return prox(this.cloneNode(true))
    }

    /**
     * @deprecated
     */
    kill() {
        return this.destroy()
    }

    destroy() {
        this.resetSelfRules()
            .cancelAnims()
        let myStates = this[states]
        for (let [key, {
            cached: val
        }] of myStates) {
            myStates.delete(key)
            for (let el of val.content.querySelectorAll('*'))
                prox(el).destroy()
        }
        this.destroyChildren()
        let my = base(this)
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

    /**
     * @deprecated
     */
    killChildren() {
        this.destroyChildren()
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

    on(events, useHandler, signal) {
        if (typeof events === 'function') events = Object.defineProperty(events.bind(this), h.unbound, {
            value: events
        })
        else if (Array.isArray(events)) events = events.map(value =>
            Object.defineProperty(value.bind(this), h.unbound, {
                value
            })
        )
        else for (let i in events) {
                let value = events[i]
                Object.defineProperty(events[i] = value.bind(this), h.unbound, {
                    value
                })
            }
        h.on(base(this), events, useHandler, signal)
    }

    off(...events) {
        h.off(base(this), ...events)
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
                (me !== target || includeSelf) && (filter(pr) ?? 1) && old.apply(pr, args)
            }
        }
        this.on(events,false,signal)
    }

    get events() {
        return h.getEventNames(base(this))
    }

    /**
     * @deprecated
     */
    styleMe(styles) {
        this.setStyles(styles)
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

    setAttr(attr) {
        let me = base(this)
        for (let i in attr) {
            let val = attr[i]
            if (regex.onXYZ.test(i)) throw TypeError('Inline event handlers are deprecated')
            i = ariaOrData(i)
            /*   switch (i) {
                   case 'disabled': me.setAttribute('aria-disabled', !!val); break
                   case 'checked': me.setAttribute('aria-checked', !!val); break
                   case 'hidden': me.setAttribute('aria-hidden', !!val); break
                   case 'required': me.setAttribute('aria-required', !!val); break
                   case 'readonly': me.setAttribute('aria-readonly', !!val); break
                   case 'placeholder': me.setAttribute('aria-placeholder', val); break
               }*/
            if (typeof val === 'boolean') me.toggleAttribute(i, val)
            else if (val === '' || val == null) me.removeAttribute(i)
            else me.setAttribute(i, val)
        }
    }

    /**
     * @deprecated
     */
    setAttributes(attr) {
        this.setAttr(attr)
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
            iterations: 1
        }).finished.then(this.hide.bind(this, 3))
    }

    fadeIn(duration) {
        duration ||= _.defaultDura
        this.show(3)
        return this.animate([_.nopacity, _.onepacity], {
            duration,
            easing: 'ease',
            iterations: 1
        }).finished
    }

    fadeFromTo(from, to, settings) {
        settings ??= {}
        let duration = settings.duration || _.defaultDura
            , easing = settings.easing ?? 'ease'
        return this.animate([{
            opacity: from
        }, {
            opacity: to
        }], {
            duration,
            easing,
            fill: 'forwards'
        })
    }

    replace(...elements) {
        base(this).replaceWith(...elements.map(base))
    }

    wrap(parent) {
        let {parent: p} = this
        parent = $(parent)
        ;(this.parent = parent).parent = p
    }

    unwrap() {
        let {parent} = this
        let c = this.pass()
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
                })
                    .setAttr({_hidden: "true", contenteditable: 'false'})
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
                    opacity: '', '--user-input': '', '--user-focus': '', '--user-select': '', 'pointer-events': '',
                    '--user-modify': '',
                })
                    .setAttr({_hidden: "", contenteditable: ''})
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
    treeWalker(whatToShow, filter) {
        let walker = document.createTreeWalker(base(this), whatToShow ?? NodeFilter.SHOW_ALL, filter_func)
        filter ??= function () {
        }
        return out()

        function* out() {
            let current
            while (current = walker.nextNode()) yield getValid(current) ? prox(current) : current
        }

        function filter_func(node) {
            return (filter(node) ?? true) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    }

    * [Symbol.iterator]() {
        let all = base(this).getElementsByTagName('*')
        for (let {length: i} = all; i--;) yield prox(all[i])
    }

    get [Symbol.toPrimitive]() {
        throw TypeError('Cannot convert Element to a primitive value')
        // 🔏 Don't want to accidentally convert to a string for stuff like
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
            if (selector.includes('::')) selector = css.supportedPElementVendor(selector)
            else if (selector.includes(':')) selector = css.supportedPClassVendor(selector)
            const final = `#${CSS.escape(id)}  ${selector}{${(css.toCSS(cssStuff))}}`
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
        options ??= {}
        options.timing ??= 'ease'
        options.iterations ??= 1
        options.pseudoElement &&= css.supportedPElementVendor(options.pseudoElement)
        keyframes.forEach(_.forEach)
        return base(this).animate(keyframes, options)
    }

    set after(val) {
        base(this).after(base(val))
    }

    set before(val) {
        base(this).before(base(val))
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

    get first() {
        let {firstElementChild} = base(this)
        return prox(firstElementChild)
    }

    get last() {
        let {lastElementChild} = base(this)
        return prox(lastElementChild)
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
}.prototype)
const prototype = Object.create(null)
    , TEXT_THINGIES = new Set('textContent innerText innerHTML outerHTML outerText'.split(' '))
TEXT_THINGIES.forEach(txt =>
    Object.defineProperty(prototype, txt, {
        get() {
            return base(this)[txt]
        },
        set(val) {
            let me = base(this)
            if (me.childElementCount) throw TypeError(`Cannot set '${txt}', element has children`)
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
                    if (!all.has(base(this))) throw TypeError('Bad input')
                    let r = value.apply(this, a)
                    return typeof r === 'undefined' ? this : r
                }
            }[i] //  Just want to keep the original function name intact
        }
        Object.defineProperty(prototype, i, v)
    }
})
// 🖨 Copy everything
const prototypeDescriptors = Object.getOwnPropertyDescriptors(prototype)

function base(element) {
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
    state: {
        get() {
            return this.currentState
        },
        set(val) {
            this.setState(val)
        }
    },
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
if (typeof ContentVisibilityAutoStateChangeEvent !== 'function'
    || 'mozInnerScreenX' in window  // Firefox is weird again
) {
    inte = new IntersectionObserver(IntersectionObserverCallback, {
        threshold: [0, Number.MIN_VALUE]
    })

    function IntersectionObserverCallback(entries) {
        for (let {length: i} = entries; i--;) {
            let me = entries[i],
                target = me.target
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
function observeAll(node) {
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
let later = []

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
            title = 'long-task'
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
    paint:false,
    'first-paint':entryTypes.paint,
    'first-contentful-paint':entryTypes.paint,
    'element-load': entryTypes.element,
    'long-task': entryTypes.longtask,
    'network-request': entryTypes.resource,
    resource: false,
    navigation: false,
    'page-navigate': entryTypes.navigation,
    // taskattribution: false,
    // 'task-attribution':true
})


function prox(target) {
    if (target === null) return null
    if (target[states]) return target
    if (!getValid(target))
        throw TypeError('Bad input') // get out
    // 🥅 Goal:
    // 🪪 Make an object with a [[Prototype]] being the target element
    // 🪤 Also put a proxy around said object
    // 🚫 I can't use class ... extends ...,
    // ❌ or 'setPrototypeOf' since it's bad i guess?
    // ✅ Only option is 'Object.create' or { __proto__: ... }
    if (!all.has(target)) {
        // ++$.len
        let bleh = {value: target}
            , {revoke: styleRevoke, proxy: styleProxy} = Proxy.revocable(target.style, handlers.styles)
            , {revoke: childRevoke, proxy: childProxy} = Proxy.revocable(target.children, handlers.HTMLCollection)
            , {revoke: querySelectorRevoke, proxy: querySelectorProxy} = Proxy.revocable(target, handlers.querySelector)
            , {revoke: attrRevoke, proxy: attrProxy} = Proxy.revocable(target, handlers.attr)
            , propertiesToDefine = {
            ...prototypeDescriptors,
            [me]: bleh,
            fromQuery: {
                value: querySelectorProxy
            },
            [computed]: reuse.nullThing,
            [states]: {
                value: new Map
            },
            selfRules: {
                value: Object.create(null)
            },
            state: reuse.state,
            // [shadow]: reuse.junk,
            currentState: reuse.junk,
            lastState: reuse.junk,
            flags: reuse.flags,
            children: {
                value: childProxy
            },
            attr: {
                value: attrProxy
            },
            styles: {
                value: styleProxy
            }
        }
            , {proxy, revoke} = Proxy.revocable(
            Object.seal(Object.create(target, propertiesToDefine)), Object.create(handlers.main, {0: {value: target}})
            // defineProperty(target, prop) {
            // console.debug(prop)
            // if (prop in target) return Reflect.defineProperty(...arguments)
            // throw TypeError('Object not mutable')
            // }
        )
        if (target instanceof HTMLUnknownElement ||
            target.ownerDocument.defaultView?.HTMLUnknownElement.prototype.isPrototypeOf(target))
            console.warn(`Unknown element: '${target.tagName.toLowerCase()}'`)

        function RevokeAllProxies() {
            //  Make sure we have *NO* possible references left
            revoke()
            childRevoke()
            attrRevoke()
            styleRevoke()
            querySelectorRevoke()
        }

        revokes.set(proxy, RevokeAllProxies)
        all.set(target, proxy)
        return proxy
    }
    return all.get(target)
}

function getValid(target) {
    return target &&
        (target instanceof Element ||
            target.ownerDocument?.defaultView?.Element.prototype.isPrototypeOf(target)
            //|| Element.prototype.isPrototypeOf(target)
        )
}

const doc = document.createDocumentFragment()
    , parser = new DOMParser
let temp, div, range, parsingDoc, classRegex = /(?<=\.)[\w-]+/g,
    htmlRegex = /[\w-]+/,
    idRegex = /(?<=#)\w+/,
    typeRegex = /(?<=%)\w+/
const parseModeMap = new Map(Object.entries({
    write(html) {
        parsingDoc ??= document.implementation.createHTMLDocument()
        parsingDoc.open().write(html)
        parsingDoc.close()
        return document.adoptNode(parsingDoc.body.firstElementChild)
    },
    setHTMLUnsafe(html) {
        temp ??= document.createElement('template')
        temp.setHTMLUnsafe(html)
        return document.adoptNode(temp.content.firstElementChild)
    },
    innerHTML(html) {
        div ??= document.createElement('div')
        div.innerHTML = html
        return div.removeChild(div.firstElementChild)
    },
    createHTMLDocument(html) {
        parsingDoc ??= document.implementation.createHTMLDocument()
        parsingDoc.body.outerHTML = html
        return document.adoptNode(parsingDoc.body.firstElementChild)
    },
    createRange(html) {
        return document.adoptNode((range ??= document.createRange()).createContextualFragment(html).firstElementChild)
    },
    template(html) {
        //  Contender
        temp ??= document.createElement('template')
        temp.innerHTML = html
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
    if (html[0] === '<' && html.at(-1) === '>') {
        html = safeHTML(html)
        element = prox(parseModeMap.get(parseMode)?.(html) ?? parseModeMap.get('')(html))
    } else {
        // html === 'fencedframe' && typeof HTMLFencedFrameElement === 'undefined' && (html = 'iframe')
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
    byId: {
        value: new Proxy(document, {
            get(t, p) {
                return prox(t.getElementById(p))
            }
        })
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
    setup: {
        value(id) {
            let te = prox(document.getElementById(id) ?? document.querySelector('template'))
            document.body.appendChild(document.importNode(te.content, true))
            te.destroy()
        }
    },
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
    doc: {
        get() {
            return prox(document.documentElement)
        }
    }
})
$.id=$.byId
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

function destroyEach(ch) {
    prox(ch).destroy()
}

try {
    class AnimatedSprite extends HTMLElement {
        static observedAttributes = 'cols rows src width height duration direction index alt'.split(' ')

        #ANIMATE() {
            let p = prox(this)
            if (this.#axis === 'horizontal') {
                p.setStyles({
                    'background-position-y': `calc((mod(var(--axis), var(--grid-height))*var(--height)) * -1)`,
                    animation: `horizontal ${this.#duration * this.getAttribute('cols') | 0}ms steps(var(--grid-width), end) ${this.#direction} infinite`
                })
            } else if (this.#axis === 'vertical') {
                p.setStyles({
                    'background-position-x': `calc((mod(var(--axis), var(--grid-width))*var(--width)) * -1)`,
                    animation: `vertical ${this.#duration * this.getAttribute('rows') | 0}ms steps(var(--grid-height), end) ${this.#direction} infinite`
                })
            }
        }

        #duration = 1000
        #axis = 'horizontal'
        #direction = 'normal'

        async attributeChangedCallback(name, oValue, nValue) {
            let p = prox(this)
            if (/^(?:cols|rows)$/.test(name)) {
                p.setStyles({
                    [`--grid-${name === 'cols' ? 'width' : 'height'}`]: `${nValue}`
                })
                this.#ANIMATE()
            } else if (/^(?:width|height)$/.test(name)) {
                if (!CSS.supports('width', nValue)) nValue += 'px'
                p.setStyles({
                    [`--${name}`]: nValue
                })
                this.#ANIMATE()

            } else if (name === 'alt') {
                p.setStyles({
                    '--alt': `"${this.getAttribute('alt')}"`
                })
            } else if (name === 'src') {
                let thingy = {
                    '--sprite': `url(${nValue})`,
                }
                try {
                    let n = await fetch(nValue)
                    if (!n.ok) {
                        thingy['--sprite'] = ''
                        thingy['--alt'] = `"${this.getAttribute('alt')}"`
                    } else thingy['--alt'] = ''
                } catch {
                    thingy['--alt'] = `"${this.getAttribute('alt')}"`
                } finally {
                    p.setStyles(thingy)
                }
                this.#ANIMATE()
            } else if (name === 'axis') {
                if (nValue !== 'horizontal' && nValue !== 'vertical') nValue = 'horizontal'
                this.#axis = nValue
            } else if (name === 'duration') {
                this.#duration = nValue
                this.#ANIMATE()
            } else if (name === 'direction') {
                if (!/^(?:normal|reverse|alternate(?:-reverse)?)$/.test(nValue)) nValue = 'normal'
                this.#direction = nValue
                this.#ANIMATE()
            } else if (name === 'index') {
                p.setStyles({
                    '--axis': (nValue | 0) % (this.#axis === 'horizontal' ? p.attr.rows : p.attr.cols)
                })
            }
        }

        connectedCallback() {
            this.attachShadow({mode: 'open'}).appendChild(base($(`style`, {
                textContent:
                    `
@property --sprite {
  syntax: "<image>";
  inherits: false;
  initial-value: url("");
}
@property --width {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 30px;
}
@property --height {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 30px;
}
@property --grid-width {
  syntax: "<integer>";
  initial-value: 8;
  inherits: false;
}
@property --grid-height {
  syntax: "<integer>";
  initial-value: 8;
  inherits: false;
}
@property --alt {
  syntax: "*";
  initial-value: "";
  inherits: false;
}
:host {
        ${css.toCSS({
                        width: 'var(--width)',
                        '--axis': 0,
                        display: 'block',
                        height: 'var(--height)',
                        'background-image': 'var(--sprite)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'calc(var(--width) * var(--grid-width)) calc(var(--height) * var(--grid-height))'
                    })}
}
:host::before {
                        content:var(--alt);
}
@keyframes horizontal {
  0% {
  ${css.toCSS({
                        'background-position-x': '0px'
                    })}
  }
  100% {
  ${css.toCSS({
                        'background-position-x': 'calc(var(--width) * -1 * var(--grid-width))'
                    })}
  }
}
@keyframes vertical {
  0% {
  ${css.toCSS({
                        'background-position-y': '0px'
                    })}
  }
  100% {
   ${css.toCSS({
                        'background-position-y': 'calc(var(--height) * -1 * var(--grid-height))'
                    })}
  }
}
`
            })))
        }
    }
    let define = Object.getPrototypeOf(customElements).define.bind(customElements)
        define( 'img-sprite', AnimatedSprite)

    /****/
    class SeekBar extends HTMLElement {
        connectedCallback() {
            let p = $(this)
            let shadow = p.attachShadow({mode: 'open'})
            let div = $('div #meter')
            let style = $('style', {
                textContent:
                    `
                #meter {
                ${css.toCSS({
                        height: '14px',
                        '--dur': '1s',
                        transition: 'width var(--dur) linear',
                        'background-image': `repeating-linear-gradient(-45deg, transparent, transparent 1rem,darkred 1rem,darkred 2rem)`,
                        width: '150px',
                        'background-size': '300px 100%',
                        'border-radius': '10px',
                        animation: 'cycle 5s linear infinite',
                        'background-color': 'red'
                    })}
                }
                @keyframes cycle {
                100% {
                ${css.toCSS({
                        'background-position-x': '-135px'
                    })}
                }
                }
                :host { 
                ${css.toCSS({
                        width: '150px',
                        overflow: 'hidden',
                        'box-shadow': `0px 4px 7px 0px rgba(0,0,0,0.3)`,
                        height: '14px',
                        display: 'block',
                        'border-radius': '10px',
                        border: 'solid 2px black'
                    })}
                }
                `
            })
            shadow.appendChild(style.valueOf())
            shadow.appendChild(div.valueOf())
            p.on({
                _click() {
                    this.animate([
                        {transform: 'rotateZ(3deg)', 'background-color': 'red'}, {transform: 'rotateZ(-3deg)'}, {}
                    ], {
                        duration: 40,
                        iterations: 4,
                        easing: 'ease-in'
                    })
                    div.style.width = '0'
                }
            })
        }
    }
    define('seek-bar', SeekBar)
} catch (e) {
    reportError(e)
}
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
        $, css, h
    })
}