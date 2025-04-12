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
import { FormDataManager as form } from './proxies.js'
Object.hasOwn ??= (obj, prop) => hasOwnProperty.call(obj, prop)
const regex = {
    dot: /\./g,
    space: /\s/g,
    onXYZ: /^on.+$/
},
    me = Symbol('base'),
    all = new WeakMap,
    revokes = new WeakMap,
    bounded = new WeakMap
function gen() {
    return `${Math.random()}${Math.random()}`.replace(regex.dot, '')
}
function bindIfNecessary(maybeFunc, to) {
    // Make sure we just re-use the same function
    return typeof
        maybeFunc === 'function' ?
        bounded.get(maybeFunc) ?? bounded.set(maybeFunc, maybeFunc.bind(to)).get(maybeFunc) : maybeFunc
}
function genericGet(t, prop) {
    if (typeof prop !== 'symbol' && !isNaN(prop)) {
        let out = t[prop]
        return out && prox(out)
    }
    if (Array.prototype.hasOwnProperty(prop) && typeof [][prop] === 'function') return [][prop].bind(t)
    let out = t[prop]
    return bindIfNecessary(out, t)
}
function ariaOrDataOrCustom(i) {
    let { 0: char } = i
    if (char === '_') i = i.replace(char, 'aria-')
    else if (char === '$') i = i.replace(char, 'data-')
    else if (char === '@') i = i.replace(char, '--')
    return i
}
const customRules = css.getDefaultStyleSheet()
const handlers = {
    // Other proxies
    querySelector: {
        get(t, p) {
            return prox(t.querySelector(p))
        }
    },
    styles: {
        get(target, prop) {
            if (prop === 'cssFloat') prop = 'float'
            return prop.startsWith('--') ? target.getPropertyValue(prop) :
                target.getPropertyValue(css.dashVendor(prop, 'inherit'))
        },
        set(target, prop, value) {
            if (prop === 'cssFloat') prop = 'float'
            if (prop.startsWith('--')) target.setProperty(prop, value)
            else value ?
                target.setProperty(css.dashVendor(prop, value), value) :
                this.deleteProperty(target, prop)
            return 7
        },
        deleteProperty(target, prop) {
            if (prop === 'cssFloat') prop = 'float'
            return prop.startsWith('--') ? target.removeProperty(prop) :
                target.removeProperty(css.dashVendor(prop, 'inherit')),
                3
        },
        has(target, prop) {
            if (prop === 'cssFloat') prop = 'float'
            return this.get(target, prop)
        }
    },
    attr: {
        get(t, p) {
            p = ariaOrDataOrCustom(p)
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
            p = ariaOrDataOrCustom(p)
            return t.hasAttribute(p)
        }
        /*  get(t, prop) {
              debugger
              let el = t[ATTR]
              return prop in t ? t[prop] : el.getAttribute(prop)
          },
          set(t, prop, value, r) {
              debugger
              let el = t[ATTR]
              value ? el.setAttribute(prop, value) : this.deleteProperty({
                  el
              }, prop)
              return true
          },
          has(t, prop) {
              debugger
              let el = t[ATTR]
              return el.hasAttribute(prop)
          },
          deleteProperty(t, prop) {
              debugger
              let el = t[ATTR]
              el.removeAttribute(prop)
              return true
          },*/

    },
    /* CSSStyleDeclaration: {
     get(target, prop) {
         if (prop in target) return target[prop]
         if (prop.startsWith('__')) return this.get(target, prop.replace(/_/g, '-'))
         let out = target[prop]
             , fixedProp = css.vendor(css.toCaps(prop), 'inherit')
             , maybe = target.getPropertyValue(fixedProp)
         if (typeof prop === 'string' && CSS.supports(fixedProp, 'inherit'))
             return maybe === '' ? null : maybe // && window.CSSStyleValue?.parse(p, maybe) || maybe
         return bindIfNecessary(out, target)
     },
     set(t, prop, value) {
         if (prop.startsWith('__')) return t[prop.replace(/_/g, '-')] = value
         let p = css.toCaps(css.vendor(css.toDash(prop), value))
         if (CSS.supports(css.toDash(p), value))
             t.setProperty(p, value)
         else if (prop in t)
             t[prop] = value
         else badCSS(prop, value)
         return true
     },
     deleteProperty(t, prop) {
         if (prop.startsWith('__'))
             t.removeProperty(prop.replace(/_/g, '-'))
         else {
             let fixed = css.vendor(css.toDash(prop), 'inherit')
             CSS.supports(fixed, 'inherit') ?
                 t.removeProperty(css.toCaps(fixed))
                 : delete t[prop]
         }
         return true
     }
    },*/
    HTMLCollection: {
        get: genericGet,
        set(t, prop, value) {
            if (!isNaN(prop)) {
                let out = t[prop]
                out && base(out).replaceWith(base(value))
            } else t[prop] = value
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
    /*NamedNodeMap: {
    get(t, prop) {
        let out = genericGet(t, prop)
        return out instanceof Attr ? out.value : out
    },
    set(t, prop, value) {
        t.setNamedItem(prop, value)
        return true
    },
    deleteProperty(t, prop) {
        try {
            t.removeNamedItem(prop)
        }
        finally {
            return true
        }
    },
    }*/
}
// Main [[Prototype]] is on this class
// let ATTR = Symbol('💿')
let states = Symbol('💾')
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
                .push($(`<samp style="font-size:30px; color:red;">INVALID STATE</samp>`))
                .currentState = null
            reportError(identifier)
            throw TypeError(`Invalid state`)
        }
        let { cached: cache, callback } = t.get(identifier)
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
            let { events } = el
            if (!events) return
            let clone = prox(newBatch[index])
            let staticEvents = h.allEvents.get(base(el))
            events.forEach(eventThing)
            function eventThing(name) {
                let { listener, passive, capture, handler, prevents, stopProp, once, stopImmediateProp, onlyTrusted } = staticEvents.get(name)
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
        ie?.unobserve(my)
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
        let { lastElementChild } = this
        while (lastElementChild)
            prox(lastElementChild).destroy(), { lastElementChild } = this
    }
    $(html, props, ...children) {
        let out = $(html, props, ...children)
        out.parent = this
        return out
    }
    on(events, useHandler) {
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
            let newOne = events[i] = value.bind(this)
            Object.defineProperty(newOne, h.unbound, {
                value
            })
        }
        h.on(base(this), events, useHandler)
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
    debounce(events, interval) {
        for (let i in events) {
            let old = events[i]
            events[i] = DebouncedFunction
            let waiting = false
            function enable() {
                waiting = false
            }
            function DebouncedFunction(...args) {
                if (!waiting) {
                    let me = prox(args[0].target)
                    waiting = true
                    setTimeout(enable, interval)
                    old.apply(me, args)
                }
            }
        }
        this.on(events)
    }
    delegate(events, filter, includeSelf) {
        let me = base(this)
        filter ??= function () { }
        for (let i in events) {
            let old = events[i]
            events[i] = DelegationFunction
            function DelegationFunction(...args) {
                let { target } = args[0],
                    pr = prox(target);
                (me !== target || includeSelf) && (filter(pr) ?? 1) && old.apply(pr, args)
            }
        }
        this.on(events)
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
            if (regex.onXYZ.test(i)) throw TypeError(`Inline event handlers are deprecated`)
            i = ariaOrDataOrCustom(i)
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
    fadeOut(duration = 500) {
        return this.animate([{}, _.nopacity], {
            duration,
            easing: 'ease',
            iterations: 1
        }).finished.then(() => this.hide(3))
    }
    fadeIn(duration = 500) {
        this.show(3)
        return this.animate([_.nopacity, _.onepacity], {
            duration,
            easing: 'ease',
            iterations: 1
        }).finished
    }
    fadeFromTo(from, to, {
        duration = 500,
        easing = 'ease'
    } = {}) {
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
        let { parent: p } = this
        parent = $(parent)
            ; (this.parent = parent).parent = p
    }
    unwrap() {
        let { parent } = this
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
    * @param {Integer} t
    * # 1 - 5 
    */
    hide(t) {
        switch (t) {
            case 1:
            default: this.setAttr(_.hidden); break
            case 2: base(this).style.visibility = 'hidden'; break
            case 3: base(this).style.display = 'none'; break
            case 4: this.styles.contentVisibility = 'hidden'; break
            case 5: this.setStyles({
                opacity: '0', '@user-input': 'none', '@user-focus': 'none', '@user-select': 'none', 'pointer-events': 'none',
                '@user-modify': 'read-only',
            })
                .setAttr({ _hidden: "true", contenteditable: 'false' })
                break
        }
    }
    /**
    * 
    * @param {Integer} t
    * # 1 - 5
    */
    show(t) {
        switch (t) {
            case 1:
            default: this.setAttr(_.notHidden); break
            case 2: base(this).style.visibility = 'visible'; break
            case 3: base(this).style.display = ''; break
            case 4: this.styles.contentVisibility = ''; break
            case 5: this.setStyles({
                opacity: '', '@user-input': '', '@user-focus': '', '@user-select': '', 'pointer-events': '',
                '@user-modify': '',
            })
                .setAttr({ _hidden: "", contenteditable: '' })
                break

        }
    }
    /**
    * @deprecated
    */
    hide2() {
        base(this).style.visibility = 'hidden'
    }
    /**
    * @deprecated
    */
    show2() {
        debugger
        base(this).style.visibility = 'visible'
    }
    /**
    * @deprecated
    */
    hide3() {
        debugger
        base(this).style.display = 'none'
    }
    /**
    * @deprecated
    */
    show3() {
        debugger
        base(this).style.display = ''
    }
    /**
    * @deprecated
    */
    hide4() {
        debugger
        this.styles.contentVisibility = 'hidden'
    }
    /**
    * @deprecated
    */
    show4() {
        debugger
        this.styles.contentVisibility = ''
    }
    /**
    * @deprecated
    */
    hide5() {
        debugger
        this.setStyles({
            opacity: '0', '@user-input': 'none', '@user-focus': 'none', '@user-select': 'none', 'pointer-events': 'none',
            '@user-modify': 'read-only',
        })
            .setAttr({ _hidden: "true", contenteditable: 'false' })
    }
    /**
    * @deprecated
    */
    show5() {
        debugger
        this.setStyles({
            opacity: '', '@user-input': '', '@user-focus': '', '@user-select': '', 'pointer-events': '',
            '@user-modify': '',
        })
            .setAttr({ _hidden: "", contenteditable: 'true' })
    }
    equals(other) {
        let temp = $(other)
        let out = base(temp).isEqualNode(base(this))
        temp.destroy?.()
        return out
    }
    initForm() {
        return new form(base(this))
    }
    push(...args) {
        let frag = doc
        args.flat(1 / 0).forEach(a)
        base(this).appendChild(frag)
        function a(child) {
            frag.appendChild(base(child))
        }
    }
    unshift(...args) {
        let frag = doc
        args.flat(1 / 0).forEach(a)
        base(this).prepend(frag)
        function a(child) {
            frag.appendChild(base(child))
        }
    }
    //  i tried SO hard to make treewalker useful but it did NOT impress me!
    treeWalker(filter, whatToShow = NodeFilter.SHOW_ELEMENT) {
        let walker = document.createTreeWalker(base(this), whatToShow, filter_func)
        filter ??= function () { }
        return out()
        function* out() {
            let current
            while (current = walker.nextNode()) yield getValid(current) ? prox(current) : current
        }
        function filter_func(node) {
            return (filter(node) ?? true) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    }
    *[Symbol.iterator]() {
        yield* Array.from(base(this).getElementsByTagName('*'), prox)
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
            }
            finally { continue }
    }
    addSelfRule(selector, cssStuff) {
        const og = selector
        try {
            if (!base(this).hasAttribute('id'))
                do var id = gen()
                while (document.getElementById(id))
            else var id = base(this).getAttribute('id')
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
    animate(keyframes, options = {}) {
        options.timing ??= 'ease'
        options.iterations ??= 1
        keyframes.forEach(forEach)
        return base(this).animate(keyframes, options)
        function forEach(frame) {
            for (let prop in frame) {
                let val = `${frame[prop]}`
                frame[css.capVendor(prop, val)] ??= val
            }
            // Firefox warns of empty string
        }
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
    get first() {
        let { firstElementChild } = base(this)
        return prox(firstElementChild)
    }
    get last() {
        let { lastElementChild } = base(this)
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
        other = base(other),
            me = base(this)
        for (let attr of other.attributes) me.setAttribute(attr.nodeName, attr.nodeValue)
    }
}.prototype)
const prototype = Object.create(null)
const TEXT_THINGIES = new Set('textContent innerText innerHTML outerHTML outerText'.split(' '))
TEXT_THINGIES.forEach(txt =>
    Object.defineProperty(prototype, txt, {
        get() {
            return base(this)[txt]
        },
        set(val) {
            let me = base(this)
            if (me.childElementCount) throw TypeError(`Cannot set '${txt}', element has children`)
            me[txt] = val
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
{
    function forEach(i) {
        if (i !== 'constructor') {
            let v = props[i]
            if (typeof v.value === 'function') {
                let old = v.value
                props[i].value = {
                    [i](...a) {
                        //  This function is for automatically returning the 'this'
                        //  value if the original return value is undefined
                        if (!all.has(base(this))) throw TypeError(`Illegal invocation`)
                        let r = old.apply(this, a)
                        return typeof r === 'undefined' ? this : r
                    }
                }[i]
                //  Just want to keep the original function name intact
            }
            Object.defineProperty(prototype, i, v)
        }
    }
    Reflect.ownKeys(props).forEach(forEach)
    // 🖨 Copy everything
}
const prototypeDescriptors = Object.getOwnPropertyDescriptors(prototype)
function base(element) {
    // 🌱 Get the root element
    return element[me] ?? prox(element)[me]
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
if (typeof ContentVisibilityAutoStateChangeEvent === 'undefined') {
    var ie = new IntersectionObserver(handle, {
        threshold: [0, 1]
    })
    function handle(entries) {
        for (let { length: i } = entries; i--;) {
            let me = entries[i],
                target = me.target
            let val = getComputedStyle(target).getPropertyValue('--content-visibility')
            let event = new CustomEvent('contentvisibilityautostatechange', { bubbles: true, detail: { skipped: !me.isIntersecting } })
            target.dispatchEvent(event)
        }
    }
}
function prox(target) {
    if (target === null) return null
    if (!getValid(target))
        throw TypeError(`Illegal invocation`) // get out
    // 🥅 Goal:
    // 🪪 Make an object with a [[Prototype]] being the target element
    // 🪤 Also put a proxy around said object
    // 🚫 I can't use class ... extends ..., 
    // ❌ or 'setPrototypeOf' since it's bad i guess?
    // ✅ Only option is 'Object.create' or { __proto__: ... }
    if (!all.has(target)) {
        // ++$.len
        let bleh = { value: target }
            , { revoke: styleRevoke, proxy: styleProxy } = Proxy.revocable(target.style, handlers.styles)
            , { revoke: childRevoke, proxy: childProxy } = Proxy.revocable(target.children, handlers.HTMLCollection)
            , { revoke: querySelectorRevoke, proxy: querySelectorProxy } = Proxy.revocable(target, handlers.querySelector)
            , { revoke: attrRevoke, proxy: attrProxy } = Proxy.revocable(target, handlers.attr)
            , baseThingy = {
                ...prototypeDescriptors,
                [me]: bleh,
                fromQuery: {
                    value: querySelectorProxy
                },
                [states]: {
                    value: new Map
                },
                selfRules: {
                    value: Object.create(null)
                },
                // beforestatechange: reuse.nullThing,
                // afterstatechange: reuse.nullThing,
                state: reuse.state,
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
            , { proxy, revoke } = Proxy.revocable(
                Object.seal(Object.create(target, baseThingy)), {
                get(targ, prop) {
                    return targ.hasOwnProperty(prop) ? targ[prop] :
                        bindIfNecessary(target[prop], target)
                    // ⛓️‍💥 'Illegal invocation' if function is not bound
                },
                set(targ, prop, value) {
                    return (targ.hasOwnProperty(prop) ? targ : target)[prop] = value, 1
                },
            })
        if (target instanceof HTMLUnknownElement ||
            target.ownerDocument.defaultView?.HTMLUnknownElement.prototype.isPrototypeOf(target))
            console.warn(`Unknown element: '${target.tagName}'`)
        function RevokeAllProxies() {
            //  Make sure we have *NO* possible references left
            revoke(childRevoke(attrRevoke(styleRevoke(querySelectorRevoke()))))
        }
        revokes.set(proxy, RevokeAllProxies)
        all.set(target, proxy)
        ie?.observe(target)
        return proxy
    }
    return all.get(target)
}

function getValid(target) {
    return target &&
        (target instanceof Element ||
            target.ownerDocument?.defaultView?.Element.prototype.isPrototypeOf(target) ||
            Element.prototype.isPrototypeOf(target))
}
const doc = document.createDocumentFragment()
const parser = new DOMParser
let temp, div, range, parsingDoc, classRegex = /\.[\w-]+/g,
    htmlRegex = /[\w-]+/,
    idRegex = /#\w+/,
    typeRegex = /%\w+/
const parseModeMap = new Map(Object.entries({
    write(html) {
        parsingDoc ??= document.implementation.createHTMLDocument()
        parsingDoc.write(html)
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
/**
* # Be careful of html injection when using a string!!
*/
function $(html, props, ...children) {
    if (getValid(html)) return prox(html) // Redirect
    if (html[0] === '<' && html.at(-1) === '>')
        var element = prox(parseModeMap.get(parseMode)?.(html) ?? parseModeMap.get('')(html))
    else {
        html === 'fencedframe' && typeof HTMLFencedFrameElement === 'undefined' && (html = 'iframe')
        var element = prox(document.createElement(html.match(htmlRegex)[0]))
        let classes = html.match(classRegex)?.map(slice),
            id = html.match(idRegex)?.[0].slice(1),
            type = html.match(typeRegex)?.[0].slice(1)
        element.setAttr({
            class: classes?.join(' '),
            id,
            type
        })
    }
    if ([element, ...element.getElementsByTagName('*')].some(allElementStuff)) throw TypeError(`Inline event handlers are deprecated`)
    if (element.tagName === 'SCRIPT' || element.querySelector('script')) {
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
        let { hasOwn } = Object
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
    }
    else if (typeof props === 'string' || getValid(props)) {
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
let parseMode = 'mozInnerScreenY' in window ? 'createRange' : 'template'
//  createRange seems to be *slightly* faster on firefox
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

function badAttrName(attr) {
    return regex.onXYZ.test(attr.nodeName)
}

function allElementStuff(e) {
    return [].some.call(e.attributes, badAttrName)
}

function destroyEach(ch) {
    prox(ch).destroy()
}

function slice(o) {
    return o.slice(1)
}
/*class CUSTOM_ELEMENT_SPRITE extends HTMLElement {
static observedAttributes = 'steps x y src width height'.split(' ')
#style = null
get #animation() {
return prox(this.#sprite).getAnimations()[0]
}
#sprite = null
#steps = []
attributeChangedCallback(name, oldValue, newValue) {
this.#attch()
switch (name) {
    case 'steps': {
        this.#steps = JSON.parse(newValue)
    }
        break
    case 'src': {
        this.#sprite.style.setProperty('--sprite', `url(${newValue})`)
        break
    }
    case 'width':
    case 'height': {
        this.#sprite.style.setProperty(`--${name}`, `${newValue}px`)
    }
        break
    case 'x':
    case 'y': {
        this.#sprite.style.setProperty(`--grid-${name}`, newValue)
    }
        break
    case 'state': switch (newValue) {
        case 'running':
            this.#animation.play()
            break
        case 'paused':
            this.#animation.pause()
            break
        case 'stopped':
            this.#animation.cancel()
            break
    }
        break
}

}
adoptedCallback() {
debugger
}
constructor() {
super()
this.#attch()
}
#updateAnim() {
this.#animation?.cancel()
// let settings = []
let me = prox(this),
    sprite = prox(this.#sprite)
let { width, height } = me.attr
width = +width | 0
height = +height | 0
let inBetween = ''
console.log(this.#style.sheet.cssRules.length)
sprite.setStyles({
    animation: `anim 1s steps(var(--grid-x),end) infinite   `
});
;[].cssText = ` @keyframes anim {
0% {
background-position-x: 0px
}
${inBetween}
100% {
background-position-x: calc(var(--width) * -1 * var(--grid-x))
}
}`
}
#attch() {
let g = () => {
    this.#animation?.cancel()
    this.#updateAnim()
}
if (this.shadowRoot) {
    this.#sprite = this.shadowRoot.querySelector('div')
    this.#style = this.shadowRoot.querySelector("style")
    g()
    return this.shadowRoot
}
let shadow = this.attachShadow({
    mode: 'open'
})
shadow.appendChild(spriteTemplate.content.cloneNode(true))
this.#sprite = shadow.querySelector('div')
this.#style = this.shadowRoot.querySelector("style")
g()
return shadow
}
connectedCallback() {
this.#attch()
do this.#style.textContent =
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
@property --grid-x {
syntax: "<integer>";
initial-value: 8;
inherits: false;
}
@property --grid-y {
syntax: "<integer>";
initial-value: 8;
inherits: false;
}
div {
width:  var(--width);
height: var(--height);
background-color:red;
background-image: var(--sprite);
background-repeat:no-repeat;
background-size: calc(var(--width) * var(--grid-x)) calc(var(--height) * var(--grid-y));
}
@keyframes anim {
0% {
background-position-x: 0px;
}
100% {
background-position-x: calc(var(--width) * -1 * var(--grid-x));
}
}
`
while (!this.#style.sheet.cssRules.length)
}
}
const spriteTemplate = $('<template><style></style><div></div></template>')
customElements.define('img-sprite', CUSTOM_ELEMENT_SPRITE)*/
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
if (location.host.includes('localhost')) window.$ = $