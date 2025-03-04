import { on, off, getEventNames, allEvents, unbound } from './handle.js'
import * as css from './csshelper.js'
const me = Symbol('base')
const all = new WeakMap
const revokes = new WeakMap
const bounded = new WeakMap
function bindIfNecessary(maybeFunc, to) {
    // ♻️ Make sure we just re-use the same function
    // ♻️ instead of making a new one every time
    return typeof
        maybeFunc === 'function'
        ? bounded.get(maybeFunc) ?? bounded.set(maybeFunc, maybeFunc.bind(to))
            .get(maybeFunc)
        : maybeFunc
}
function genericGet(t, prop) {
    if (!isNaN(prop)) {
        let out = t[prop]
        return out && prox(out)
    }
    if (Array.prototype.hasOwnProperty(prop) && typeof [][prop] === 'function') return [][prop].bind(t)
    let out = t[prop]
    return bindIfNecessary(out, t)
}
const handlers = {
    // 🚮 Replacements because these interfaces aren't very good...
    styles: {
        get(target, prop) {
            return prop.startsWith('--') ? target.getPropertyValue(prop)
                : target.getPropertyValue(css.dashVendor(prop, 'inherit'))
        },
        set(target, prop, value) {
            if (prop.startsWith('--')) target.setProperty(prop, value)
            else value ?
                target.setProperty(css.dashVendor(prop, value), value)
                : this.deleteProperty(target, prop)
            return true
        },
        deleteProperty(target, prop) {
            return prop.startsWith('--') ? target.removeProperty(prop)
                : target.removeProperty(css.dashVendor(prop, 'inherit')),
                true
        },
        has(target, prop) {
            return this.get(target, prop)
        }
    },
    attr: {
        get(t, prop) {
            let el = t[ATTR]
            return prop in t ? t[prop] : el.getAttribute(prop)
        },
        set(t, prop, value, /*r*/) {
            let el = t[ATTR]
            value ? el.setAttribute(prop, value) : this.deleteProperty({ el }, prop)
            return true
        },
        has(t, prop) {
            let el = t[ATTR]
            return el.hasAttribute(prop)
        },
        deleteProperty(t, prop) {
            let el = t[ATTR]
            el.removeAttribute(prop)
            return true
        },

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
            }
            else t[prop] = value
            return true
        },
        deleteProperty(t, prop) {
            if (!isNaN((prop))) {
                let obj = this.get(t, prop)
                obj && prox(obj).destroy()
            }
            return true
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
// ❗️ Main [[Prototype]] is on this class
// 🖨 properties are copied over
let ATTR = Symbol('💿')
let states = Symbol('💾')
let onstatechange = Symbol('📸')
let props = Object.getOwnPropertyDescriptors(class _ {
    // 🖋 Class syntax is easier to use
    static cancel(o) { o.cancel() }
    static pause(o) { o.pause() }
    static play(o) { o.playState === 'paused' && o.play() }
    static finish(o) { o.finish() }
    static restart(o) { o.play(o.currentTime = 0) }
    /*get [states]() {
        return Object.defineProperty(this, 'states', {
            value: new Map
        })[states]
    }*/
    createState(identifier, child, callback) {
        //if ( !(typeof identifier).match(/number|string|symbol|bigint/)) throw TypeError(`State must be a primitive`)
        console.assert(/number|string|symbol|bigint/.test(typeof identifier), `State should be a primitive:\n %o`, identifier)
        let cached = $('template')
        callback && (cached[onstatechange] = callback)
        cached.content.appendChild(base(child))
        this[states].set(identifier, cached)
        return cached.content
    }
    getState(identifier) {
        return this[states].get(identifier)?.content
    }
    deleteState(identifier) {
        if (this[states].has(identifier)) {
            let state = this[states].get(identifier)
            state.remove()
            this[states].delete(identifier)
            return true
        }
        return false
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
        if (!this[states].has(identifier)/* || !(typeof identifier).match(/number|string|symbol|bigint/)*/) {
            this.destroyChildren()
            this.push($(`<code style="font-size:30px">INVALID STATE: ${identifier}</code>`))
            this.currentState = null
            throw TypeError(`Unknown state: '${identifier}'`)
        }
        console.assert(/number|string|symbol|bigint/.test(typeof identifier), `State should be a primitive:\n %o`, identifier)
        let frag = this[states].get(identifier)
        frag[onstatechange]?.call(frag.content)
        frag = frag.content
        console.log(frag)
        debugger
        let cached = frag.cloneNode(true)
        let staticBatch = [...frag.querySelectorAll('*')]
        let newBatch = [...cached.querySelectorAll('*')]
        this.beforestatechange?.(cached)
        staticBatch.forEach((el, index) => {
            el = prox(el)
            el.beforestatechange?.(cached)
            let { events } = el
            if (!events) return
            let clone = prox(newBatch[index])
            let staticEvents = allEvents.get(base(el))
            events.forEach(name => {
                let { listener, passive, capture, handler, prevents, stopProp, once } = staticEvents.get(name)
                if (once) name = `_${name}`
                if (passive) name = `^${name}`
                if (capture) name = `%${name}`
                if (stopProp) name = `&${name}`
                if (prevents) name = `$${name}`
                clone.on({ [name]: listener[unbound][unbound] }, handler, true)
            })
        })
        this.destroyChildren()
        base(this).appendChild(cached)
        for (let desc of this)
            prox(desc).afterstatechange?.()
        this.afterstatechange?.()
        this.lastState = this.currentState
        this.currentState = identifier
    }
    get orphans() {
        let me = base(this)
        let out = document.createDocumentFragment(),
            { firstElementChild } = me
        while (firstElementChild) {
            me.removeChild(firstElementChild)
            out.appendChild(firstElementChild);
            ({ firstElementChild } = me)
        }
        return out
    }
    get clone() {
        return prox(this.cloneNode(true))
    }
    destroy() {
        this.cancelAnims()
        this[states].clear()
        let { lastElementChild } = this
        while (lastElementChild)
            prox(lastElementChild).destroy(),
                { lastElementChild } = this
        let my = base(this)
        do my.remove()
        while (document.contains(my))
        let myevents = getEventNames(my)
        myevents.size && this.off(...myevents)
        all.delete(base(this))
        revoke(this)
    }
    destroyChildren() {
        let { lastElementChild } = this
        while (lastElementChild)
            prox(lastElementChild).destroy(),
                { lastElementChild } = this
    }
    $(html, props, ...children) {
        let out = $(html, props, ...children)
        out.parent = this
        return out
    }
    on(events, useHandler) {
        if (typeof events === 'function') events = Object.defineProperty(events.bind(this), unbound, { value: events })
        else if (Array.isArray(events)) events = events.map(value => {
            console.warn(value)
            return Object.defineProperty(value.bind(this), unbound, { value })
        }
        )
        else for (let i in events) {
            let value = events[i]
            let newOne = events[i] = events[i].bind(this)
            newOne[unbound] = value
            Object.defineProperty(newOne, unbound, { value })
        }
        on(base(this), events, useHandler)
        return this
    }
    off(...events) {
        off(base(this), ...events)
        return this
    }
    delegate(events, filter, includeSelf) {
        let me = base(this)
        for (let i in events) {
            let old = events[i]
            events[i] = func
            function func(...args) {
                let { target } = args[0],
                    pr = prox(target);
                (me !== target || includeSelf) && (filter?.(pr) ?? 1) && old.apply(pr, args)
            }
        }
        this.on(events)
        return this
    }
    get events() {
        return getEventNames(base(this))
    }
    setStyles(styles) {
        for (let prop in styles) {
            let ogValue = styles[prop]
            let fixedProp = css.toCaps(css.vendor(css.toDash(prop), ogValue))
            ogValue ? this.style[fixedProp] = ogValue //out.push(`${fixedProp}: ${ogValue}`)
                : delete this.style[fixedProp]
        }
        //base(this).style.cssText = out.join(';')
    }
    setAttributes(attr) {
        let me = base(this)
        let bad = /^on.+$/
        for (let i in attr) {
            let val = attr[i]
            if (bad.test(i)) throw TypeError(`Inline event handlers are deprecated`)
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
        return this
    }
    get anims() {
        return base(this).getAnimations()
    }
    get allAnims() {
        return base(this).getAnimations({ subtree: true })
    }
    cancelAnims() {
        this.allAnims.forEach(_.cancel)
        return this
    }
    resumeAnims() {
        this.allAnims.forEach(_.play)
        return this
    }
    pauseAnims() {
        this.allAnims.forEach(_.pause)
        return this
    }
    finishAnims() {
        this.allAnims.forEach(_.finish)
        return this
    }
    restartAnims() {
        this.allAnims.forEach(_.restart)
        return this
    }
    fadeOut(duration = 500) {
        return this.animate([{}, { opacity: 0 }], { duration, easing: 'ease', iterations: 1 }).finished.then(() => this.hide3())
    }
    fadeIn(duration = 500) {
        this.show3()
        return this.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease', iterations: 1 }).finished
    }
    replaceWith(...elements) {
        base(this).replaceWith(...elements.map(base))
    }
    hide() {
        return this.setAttributes({ hidden: true })
    }
    show() {
        return this.setAttributes({ hidden: false })
    }
    hide2() {
        base(this).style.visibility = 'hidden'
        return this
    }
    show2() {
        base(this).style.visibility = 'visible'
        return this
    }
    hide3() {
        base(this).style.display = 'none'
        return this
    }
    show3() {
        base(this).style.display = ''
        return this
    }
    hide4() {
        base(this).style.contentVisibility = 'hidden'
        return this
    }
    show4() {
        base(this).style.contentVisibility = ''
        return this
    }
    equals(other) {
        let temp = $(other)
        let out = base(temp).isEqualNode(base(this))
        temp.destroy?.()
        return out
    }
    push(...args) {
        let frag = document.createDocumentFragment()
        args.flat(1 / 0).forEach(a)
        base(this).appendChild(frag)
        return this
        function a(child) {
            frag.appendChild(base(child))
        }
    }
    treeWalker(filter, whatToShow = NodeFilter.SHOW_ELEMENT) {
        let walker = document.createTreeWalker(base(this), whatToShow, filter_func)
        return out()
        function* out() {
            let current
            while (current = walker.nextNode()) yield current instanceof current.ownerDocument.defaultView.HTMLElement ? prox(current) : current
        }
        function filter_func(node) {
            return (filter?.(node) ?? true) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    }
    get [Symbol.iterator]() {
        return base(this).querySelectorAll('*')[Symbol.iterator]
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
    animate(keyframes, options) {
        options.timing ??= 'ease'
        options.iterations ??= 1
        for (let frame of keyframes)
            for (let prop in frame)
                frame[css.toCaps(css.vendor(css.toDash(prop), `${frame[prop]}`))] ??= `${frame[prop]}`
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
        return nextElementSibling && prox(nextElementSibling)
    }
    get before() {
        let { previousElementSibling } = base(this)
        return previousElementSibling && prox(previousElementSibling)
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
}.prototype)
const prototype = Object.create(null)
'textContent innerText innerHTML outerHTML outerText'.split(' ').forEach(txt =>
    Object.defineProperty(prototype, txt, {
        get() {
            return base(this)[txt]
        },
        set(val) {
            if (base(this).childElementCount) throw TypeError(`Cannot set '${txt}', element has children`)
            base(this)[txt] = val
        }
    })
)
'beforebegin afterbegin beforeend afterend'.split(' ').forEach(set =>
    Object.defineProperty(prototype, set, {
        set(val) {
            typeof val === 'object'
                ? base(this).insertAdjacentElement(set, base(val))
                : base(this).insertAdjacentHTML(set, val)
        }
    })
)
CopyStuff: {
    function forEach(i) { i === 'constructor' || Object.defineProperty(prototype, i, props[i]) }
    Reflect.ownKeys(props).forEach(forEach)
    // 🖨 Copy everything
}
const prototypeDescriptors = Object.getOwnPropertyDescriptors(prototype)
function base(element) {
    // 🌱 Get the root element
    return element[me] ?? prox(element)[me]
}
const flags = {
    //  General Purpose binary flag
    value: 0,
    writable: 1,
    enumerable: 1
},
    plc = {
        value: null,
        writable: 1
    },
    state = {
        get() {
            return this.currentState
        },
        set(val) {
            this.setState(val)
        }
    }
function prox(target) {
    if (target === null) return null
    if (!(target instanceof (target.ownerDocument.defaultView?.HTMLElement ?? HTMLElement))
        && !(target instanceof (target.ownerDocument.defaultView?.SVGElement ?? SVGElement)))
        throw TypeError(`Invalid target: ${target}`) // get out

    // 🥅 Goal:
    // 🪪 Make an object with a [[Prototype]] being the target element
    // 🪤 Also put a proxy around said object
    // 🚫 I can't use class ... extends ..., 
    // ❌ or 'setPrototypeOf' since it's bad i guess?
    // ✅ Only option is 'Object.create' or { __proto__: ... }
    if (!all.has(target)) {
        let bleh = { value: target }
        let { proxy, revoke } = Proxy.revocable(
            Object.seal(Object.create(target, {
                ...prototypeDescriptors,
                [me]: bleh,
                [states]: {
                    value: new Map
                },
                [onstatechange]: plc,
                beforestatechange: plc,
                afterstatechange: plc,
                state,
                currentState: { value: null, enumerable: 1, writable: 1 },
                lastState: { value: null, enumerable: 1, writable: 1 },
                flags,
                children: {
                    value: new Proxy(target.children, handlers.HTMLCollection)
                },
                attr: {
                    value: new Proxy(Object.create(null, { [ATTR]: bleh, length: { get() { return target.attributes.length } } }), handlers.attr)
                },
                styles: {
                    value: new Proxy(target.style, handlers.styles)
                }
            })), {
            get(targ, prop) {
                return targ.hasOwnProperty(prop) ? targ[prop]
                    : bindIfNecessary(target[prop], target)
                // ⛓️‍💥 'Illegal invocation' if function is not bound
            },
            set(targ, prop, value) {
                return (targ.hasOwnProperty(prop) ? targ : target)[prop] = value, 1
            },
        })
        if (target instanceof (target.ownerDocument.defaultView?.HTMLUnknownElement ?? HTMLUnknownElement))
            // ⏰ I will add the SVG elements later
            console.warn(`Unrecognized element '${target.tagName}'`)
        revokes.set(proxy, revoke)
        all.set(target, proxy)
    }
    return all.get(target)
}
function $(html, props, ...children) {
    if (html.ownerDocument && html instanceof (html.ownerDocument.defaultView?.HTMLElement ?? HTMLElement)) return prox(html) // Redirect
    if (html[0] === '<' && html.at(-1) === '>') {
        switch (parseMode) {
            //  This one seems to be the fastest by a tad
            //  but it's hard to tell...
            default: var element = document.adoptNode(new DOMParser().parseFromString(html, 'text/html').body.firstElementChild)
                break
            case 'write': {
                let doc = document.implementation.createHTMLDocument()
                doc.write(html)
                var element = document.adoptNode(doc.body.firstElementChild)
            }
                break
            case 'setHTMLUnsafe': {
                let temp = document.createElement('template')
                temp.setHTMLUnsafe(html)
                var element = document.adoptNode(temp.content.firstElementChild)
            }
                break
            case 'innerHTML': {
                let n = document.createElement('div')
                n.innerHTML = html
                var element = n.removeChild(n.firstElementChild)
            }
                break
            case 'createHTMLDocument': {
                let n = document.implementation.createHTMLDocument('')
                n.body.innerHTML = html
                var element = document.adoptNode(n.body.firstElementChild)
            }
                break
            case 'createRange':
                //  Def the slowest
                var element = document.adoptNode(document.createRange().createContextualFragment(html).firstElementChild)
                break
            case 'template': {
                //  Contender
                let temp = document.createElement('template')
                temp.innerHTML = html
                var element = document.adoptNode(temp.content.firstElementChild)
            }
                break
            case 'parseHTMLUnsafe':
                var element = document.adoptNode(Document.parseHTMLUnsafe(html).body.firstElementChild)
                break
        }
        element = prox(element)
    }
    else {
        html === 'fencedframe' && typeof HTMLFencedFrameElement === 'undefined' && (html = 'iframe')
        var element = prox(document.createElement(html.match(/\w+/)[0]))
        let classes = html.match(/\.[\w-]+/g)?.map(slice),
            id = html.match(/#\w+/)?.[0].slice(1),
            type = html.match(/%\w+/)?.[0].slice(1)
        element.setAttributes({ class: classes?.join(' '), id, type })
        function slice(o) { return o.slice(1) }
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
    /*
                   <!-- beforebegin -->
                           <element>
                    <!-- afterbegin -->
                           <new element>
                    <!-- beforeend -->
                           </element>
                   <!-- afterend -->
    */
    if (props) {
        function reuse(p) { if (p in props) element[p] = props[p] }
        if ('parent' in props) element.parent = props.parent
        'events' in props && element.on(props.events)
        'innerHTML innerText textContent outerHTML outerText'.split(' ').forEach(reuse)
        if ('txt' in props) element.textContent = props.txt
        // 🛑 Make sure we add elements AFTER the textContent/innerText/innerHTML
        'beforebegin afterbegin beforeend afterend'.split(' ').forEach(reuse)
        'attributes' in props && element.setAttributes(props.attributes)
        'styles' in props && element.setStyles(props.styles)
        'start' in props && props.start.call(element)
    }
    children.length && element.push(children)
    return element
}
function revoke(targ) {
    revokes.get(targ)?.()
    revokes.delete(targ)
}
export default $
Object.defineProperties($, {
    qs: {
        value(selector) {
            return prox(base($.doc).querySelector(selector))
        }
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
        get() { return prox(document.body) }
    },
    head: {
        get() { return prox(document.head) }
    },
    doc: {
        get() { return prox(document.documentElement) }
    }
})
for (let o of document.getElementsByTagName('noscript')) o.remove()
let parseMode = 'mozInnerScreenY' in window ? 'createRange' : 'default'
//  createRange seems to be *slightly* faster on firefox
void async function () {
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
    let { default: a } = await import('./math.js')
    for (let n of `template createRange createHTMLDocument innerHTML parseHTMLUnsafe default template setHTMLUnsafe write`.split(' ')) {
        obj[n] = []
        for (let i = 4; i--;) {
            obj[n].push(test(3000, n))
        }
        obj[n] = a.average(...obj[n])
    }
    console.log(obj)
}