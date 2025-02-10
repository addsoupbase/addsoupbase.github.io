import { on, off, getEventNames } from './handle.js'
import * as css from './csshelper.js'
window.t = css.vendor
const all = new WeakMap
const me = Symbol('base')
const __revoke__ = Symbol('revoke')
function badCSS(prop, value) {
    console.warn(`😵‍💫 Unrecognized CSS at '${prop}: ${value}'`)
}
let bounded = new WeakMap
function bind(maybeFunc, to) {
    // ♻️ Make sure we just re-use the same function
    // ♻️ instead of making a new one every time
    if (typeof maybeFunc === 'function') {
        if (!bounded.has(maybeFunc)) 
            bounded.set(maybeFunc, maybeFunc.bind(to))
        return bounded.get(maybeFunc)
    }
    return maybeFunc
}
function genericGet(t, prop) {
    if (!isNaN(prop)) {
        let out = t[prop]
        return out && prox(out)
    }
    if (Array.prototype.hasOwnProperty(prop) && typeof [][prop] === 'function') return [][prop].bind(t)
    let out = t[prop]
    return bind(out, t)
}
const handlers = {
    // 🚮 Replacements because these interfaces aren't very good...
    CSSStyleDeclaration: {
        get(target, prop) {
            if (prop in target) return target[prop]
            let out = target[prop]
            let fixedProp = css.vendor(css.toCaps(prop), 'inherit')
            let maybe = target[fixedProp]
            if (typeof prop === 'string' && CSS.supports(fixedProp, 'inherit')) {
                if (maybe === '') return null
                return maybe/*maybe && window.CSSStyleValue?.parse(p, maybe) ||*/
            }
            return bind(out, target)
        },
        set(t, prop, value) {
            let p = css.vendor(css.toCaps(prop), value)
            if (CSS.supports(p, value)) 
                t[p] = value
            else if (prop in t) 
                t[prop] = value
            else badCSS(prop, value)
            return true
        },
        deleteProperty(t, prop) {
            let fixed = css.vendor(css.toCaps(prop), 'inherit')
            if (CSS.supports(fixed, 'inherit')) 
                t.removeProperty(fixed)
            else delete t[prop]
            return true
        }
    },
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
    NamedNodeMap: {
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
    }
}
// ❗️ Main [[Prototype]] is on this class
// 🖨 properties are copied over
let props = Object.getOwnPropertyDescriptors(class {
    // 🖋 Class syntax is easier to use
    destroy() {
        for (let { animations } = this, { length } = animations; length--;) animations[length].cancel()
        let { lastElementChild } = this
        while (lastElementChild) {
            prox(lastElementChild).destroy();
            ({ lastElementChild } = this)
        }
        let my = base(this)
        do my.remove()
        while (document.contains(my))
        let myevents = getEventNames(my)
        myevents.size && this.off(...myevents)
        this[__revoke__]()
    }
    $(html) {
        return $(html).parent = this
    }
    on(events, useHandler) {
        if (typeof events === 'function') events = events.bind(this)
        else if (Array.isArray(events)) events = events.map(o => o.bind(this))
        else for (let i in events) events[i] = events[i].bind(this)
        on(base(this), events, useHandler)
        return this
    }
    off(...events) {
        off(base(this), ...events)
        return this
    }
    get events() {
        return getEventNames(base(this))
    }
    setStyles(styles) {
        let out = []
        let passed = null
        for (let i in styles) {
            passed ??= true
            let val = styles[i]
            let fixed = css.vendor(css.toCaps(i), val)
            let text = `${fixed}: ${val}`
            if (val) {
                passed &&= CSS.supports(fixed, val)
                out.push(text)
            } else delete this.style[i]
        }
        base(this).style.cssText = out.join(';')
        return passed
    }
    setAttributes(attr) {
        let me = base(this)
        for (let i in attr) {
            let val = attr[i]
            if (typeof val === 'boolean') me.toggleAttribute(i, val)
            else if (val === '' || val == null) me.removeAttribute(i)
            else me.setAttribute(i, val)
        }
    }
    get animations() {
        return base(this).getAnimations()
    }
    get allAnimations() {
        return base(this).getAnimations({ subtree: true })
    }
    appendChild(...args) {
        let frag = document.createDocumentFragment()
        args.flat(1 / 0).forEach(child => {
            frag.appendChild(base(child))
        }, frag)
        return base(this).appendChild(frag), this
    }
    treeWalker(filter, whatToShow = NodeFilter.SHOW_ELEMENT) {
        let walker = document.createTreeWalker(base(this), whatToShow, filter_func)
        return out()
        function* out() {
            let current
            while (current = walker.nextNode()) yield current instanceof HTMLElement ? prox(current) : current
        }
        function filter_func(node) {
            return filter?.(node) ?? true ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    }
    *[Symbol.iterator]() {
        yield* this.treeWalker()
    }
    get [Symbol.toPrimitive]() {
        throw TypeError('Cannot convert Element to a primitive value')
        // 🔏 Don't want to accidentally convert to a string for stuff like
        //append, prepend, etc.
    }
    query(selector) {
        return this.treeWalker(function (node) { return node.matches(selector) }).next().value
    }
    queryAll(selector) {
        return Array.from(this.treeWalker(function (node) { return node.matches(selector) }))
    }
    animate(keyframes, options) {
        for (let frame of keyframes) for (let prop in frame) {
            let p = frame[prop]
            if (p)  frame[css.toCaps(css.vendor(css.toDash(prop), p))] = p
            delete frame[prop]
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
        return prox(base(this).nextElementSibling)
    }
    get before() {
        return prox(base(this).previousElementSibling)
    }
    set parent(parent) {
        parent ? base(parent).appendChild(base(this)) : base(this).remove()
    }
    get parent() {
        let parent = base(this).parentElement
        return parent && prox(parent)
    }
}.prototype)
const prototype = Object.create(null)
for (let txt of ['textContent', 'innerText', 'innerHTML']) {
    Object.defineProperty(prototype, txt, {
        get() {
            return base(this)[txt]
        },
        set(val) {
            if (base(this).childElementCount) throw TypeError(`Cannot set '${txt}', element has children`)
            base(this)[txt] = val
        }
    })
}
for (let set of ['beforebegin', 'afterbegin', 'beforeend', 'afterend']) {
    Object.defineProperty(prototype, set, {
        set(val) {
            typeof val === 'object' 
            ? base(this).insertAdjacentElement(set, base(val))
            : base(this).insertAdjacentHTML(set, val)
        }
    })
}
for (let i of Reflect.ownKeys(props)) {
    // 🖨 Copy everything
    if (i.match?.(/^constructor|prototype|name|length|caller|arguments$/)) continue
    Object.defineProperty(prototype, i, props[i])
}
function base(element) {
    // 🌱 Get the root element
    return element[me] ?? prox(element)[me]
}
function prox(target) {
    if (!(target instanceof HTMLElement)) throw TypeError(`😠 Invalid target: ${target}`) // get out

    // 🥅 Goal:
    // 🪪 Make an object with a [[Prototype]] being the target element
    // 🪤 Also put a proxy around said object
    // 🚫 I can't use class ... extends ..., 
    // ❌ or 'setPrototypeOf' since it's bad i guess?
    // ✅ Only option is 'Object.create' or { __proto__: ... }
    if (!all.has(target)) {
        let { proxy, revoke } = Proxy.revocable(
            Object.create(target, {
                ...Object.getOwnPropertyDescriptors(prototype),
                [me]: {
                    value: target
                },
                // 📜 Those interfaces from before...
                children: {
                    value: new Proxy(target.children, handlers.HTMLCollection)
                },
                attributes: {
                    value: new Proxy(target.attributes, handlers.NamedNodeMap)
                },
                style: {
                    value: new Proxy(target.style, handlers.CSSStyleDeclaration)
                }
            }), {
            get(targ, prop) {
                if (Object.hasOwn(targ, prop)) return targ[prop]
                let out = target[prop]
                return bind(out, target)
                // ⛓️‍💥 'Illegal invocation' if function is not bound
            },
            set(targ, prop, value) {
                if (Object.hasOwn(targ, prop)) return !void (targ[prop] = value)
                if (prop in target) return !void (target[prop] = value)
            },
        })
        if (target instanceof HTMLUnknownElement) {
            // ⏰ I will add the SVG elements later
            console.warn(`🤨 Unrecognized element '${target.tagName}'`)
        }
        Object.defineProperty(proxy, __revoke__, { value: revoke })
        all.set(target, proxy)
    }
    return all.get(target)
}
function $(html, props = {}, ...children) {
    if (html instanceof HTMLElement) return prox(html) // Redirect
    let element,
        classes = [],
        id = '',
        type = ''
    if (!html.startsWith('<')) {
        element = prox(document.createElement(html.match(/\w+/)[0]))
        classes = html.match(/\.\w+/g)?.map(o => o.slice(1))
        id = html.match(/#\w+/)?.[0].slice(1)
        type = html.match(/%\w+/)?.[0].slice(1)
        element.setAttributes({ class: classes && classes.join(' '), id, type })
    }
    else element = prox(document.adoptNode(new DOMParser().parseFromString(html, 'text/html').body.firstElementChild))
    /*
                   <!-- beforebegin -->
                           <element>
                    <!-- afterbegin -->
                           <new element>
                    <!-- beforeend -->
                           </element>
                   <!-- afterend -->
    */
   if ('parent'in props) element.parent = props.parent
    'events' in props && element.on(props.events)

    if ('innerHTML' in props)
        element.innerHTML = props.innerHTML
    if ('textContent' in props || 'txt' in props)
        element.textContent = props.textContent ?? props.txt
    if ('innerText' in props)
        element.innerText = props.innerText

    // 🛑 Make sure we add elements AFTER the textContent/innerText/innerHTML
    if ('beforebegin' in props)
        element.beforebegin = props.beforebegin
    if ('afterbegin' in props)
        element.afterbegin = props.afterbegin
    if ('beforeend' in props)
        element.beforeend = props.beforeend
    if ('afterend' in props)
        element.afterend = props.afterend

    children.length && element.appendChild(children)
    return element
}
export default $