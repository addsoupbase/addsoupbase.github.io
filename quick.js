// This file was attempt 2
// Goto yay.js for attempt 3
// Goto favourites/utils.js for attempt 1
debugger
console.warn('Using old version')
/* 
Things i learned from 1 -> 2:
• Proxies and how to use them
• Using loops more
• Using modules instead of global variables
• Stop worrying about code golf
• handle.js
• just use the console instead of making my own 🙄
*/


/*Some useful functions to remember:
queryObjects
reportError
monitor
monitorEvents
*/
import { on, off, getEventNames} from './handle.js'
import * as css from './csshelper.js'
const {
    isArray
} = Array, {
    warn,
} = console,
    frag = document.createDocumentFragment.bind(document),
    deprecatedTags = /^(tt|acronym|big|center|dir|font|frame|frameset|marquee|nobr|noembed|noframes|param|plaintext|rb|rtc|strike|tt|xmp)$/i,
    svgTags = /^(animate|animateMotion|animateTransform|circle|clipPath|defs|desc|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|foreignObject|g|glyph|glyphRef|hkern|image|line|linearGradient|marker|mask|metadata|missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|stop|svg|switch|symbol|text|textPath|tref|tspan|use|view|vkern)$/i
//These SVG tags have to be treated differently
, __revoke__ = Symbol('revoke')
export class HTMLElementWrapper {
    [Symbol.toPrimitive]() {
        return this.cont.outerHTML
    }
    *[Symbol.iterator]() {
        yield* this.getElementsByTagName("*")
    }
   #cont = null
    getElementById(id) {
        return getElementById.call(this.cont, id)
    }
    getElementsByClassName(classs) {
        return getElementsByClassName.call(this.cont, classs)
    }
    getElementsByTagName(name) {
        return getElementsByTagName.call(this.cont, name)
    }
    getElementsByName(name) {
        return getElementsByName.call(this.cont, name)
    }
    querySelector(selector) {
        return querySelector.call(this.cont, selector)
    }
    querySelectorAll(selector) {
        return querySelectorAll.call(this.cont, selector)
    }
    batch(...children) {
        let fragment
        children = children.flat(1 / 0)
        if (children.length <= 1) fragment = HTMLElementWrapper.deverifyTarget(children[0])
        else for (let i = 0, {length} = children; i < length; ++i)
            (fragment ??= frag()).appendChild(HTMLElementWrapper.deverifyTarget(children[i]))
        fragment && this.cont.appendChild(fragment)
        return this
        // this.cont.append(...children.map(HTMLElementWrapper.deverifyTarget))
    }
    static#childHandler = {
        get(target, prop) {
            let out = target[prop]
            if (out instanceof HTMLElement) out = getProxy(out)
            return out
        },
        set(target, prop, value) {
            let n = target[prop]
            if (n instanceof HTMLElement) return!getProxy(n).replaceWith(value)
            return Reflect.set(target, prop, value)
        }
    }
    before(elem) {
        this.cont.before(HTMLElementWrapper.deverifyTarget(elem))
        return this
    }
    after(elem) {
        this.cont.after(HTMLElementWrapper.deverifyTarget(elem))
        return this
    }
    static verifyTarget(element) {
        //Okay this is really confusing but it works so
        const exists = HTMLElementWrapper.all.get(element)
        if (element instanceof HTMLElementWrapper) return element
        if (exists instanceof HTMLElementWrapper) return exists
        return element ? HTMLElementWrapper.select(element) : element
    }
    static deverifyTarget(elemInstance) {
        //The opposite
        if (!(elemInstance.cont instanceof HTMLElementWrapper)) return elemInstance.cont
        return HTMLElementWrapper.all.get(elemInstance)
    }
    static select(from) {
        return HTMLElementWrapper.all.has(from) || new HTMLElementWrapper({from})
    }
    //Store every instance
    static all = new WeakMap
    static#HANDLER = {
        get(target, prop) {
            const {
                cont
            } = target
            if (prop === 'cont') return cont
            if (typeof prop !== 'symbol' && !isNaN(prop)) return target.children[prop]
            if (prop in target) return target[prop]
            let out = cont[prop]
            if (typeof out === 'function') Object.defineProperty(target, prop, { value: out = out.bind(cont), configurable: 1, writable: 1 })
            else if (out instanceof HTMLElement) out = getProxy(out)
            return out
        },
        set(target, prop, value) {
            const {cont} = target
            if (prop in target)
                return Reflect.set(target, prop, value)
            return Reflect.set(cont, prop, value)
        }
    }
    get styles() {
        if (this.cont) 
        return Object.defineProperty(this, 'styles', {
            value: new Map,
            enumerable: 1
        }).styles
        throw TypeError("Illegal invocation")
    }
    displayNone() {
        this.styleMe('display', 'none')
        return this
    }
    conceal() {
        this.styleMe('visibility', 'hidden')
        return this
    }
    reveal() {
        this.styleMe('visibility', 'visible')
        return this
    }
    hide() {
        //  important to note that this does NOT hide children
        this.attr.hidden = true
        return this
    }
    show() {
        this.attr.hidden = false
        return this
    }
    fadeout(duration = 500) {
        return this.animate([{
        },
        {
            opacity: 0
        }
        ], {
            easing: 'ease',
            duration,
            fill: 'forwards'
        })
            .finished
    }
    wrap(html) {
        const {
            parent
        } = this
        if (typeof html === 'string') {
            const parsed = new DOMParser().parseFromString(html, 'text/html'),
                {
                    firstChild
                } = parsed.body
            firstChild.appendChild(this.cont)
            parent.appendChild(firstChild)
            return firstChild
        }
        this.parent = html
        parent.appendChild(html)
        return html
    }
    async fadeAndDestroy(duration = 500) {
        await this.fadeout(duration)
        this.destroy()
    }
    fadein(duration = 500) {
        return this.animate([{
            opacity: 0
        },
        {
        }
        ], {
            easing: 'ease',
            duration,
            fill: 'forwards'
        })
            .finished
    }

    resetStyles() {
        this.styles.clear()
        this.cont.style.cssText = ''
        return this
    }
    styleMe(styles, _) {
        if (typeof styles === 'string' && _ != null) {
            styles = {
                [styles]: _
            }
            _ = undefined
        }
        if (!isArray(styles)) styles = Object.entries(styles)
        for (let {
            length
        } = styles; length--;) {
            let [prop, val] = styles[length]
            prop = css.toDash(prop)
            val = `${val}`
                prop = css.vendor(prop, val)
         
            if (!val.trim()) {
                this.styles.delete(css.vendor(prop, 'inherit'))
                continue
            }
            let parsedValue = parseFloat(val),
                lastSegment = val.split(parsedValue).at(-1)
            if (lastSegment === '%' || lastSegment in CSS) val = css.convertToCSSMethod(val)
            this.styles.set(prop, val)
        }
        const final = css.toCSS(Array.from(this.styles.entries()))
        this.cont.style.cssText = final
        return this.styles
    }
    /**
     * New element
     * @param {String} tag An HTML element tag 
     * @param {Object | String} seed Object that describes the element
     * @returns Proxy instance
     */
    constructor(seed) {
        if (typeof seed === 'string') seed = {
            raw: seed
        }
        let {
            from,
            raw = 'div',
            parent,
            offsprings,
            os
        } = seed,
            kids = offsprings ?? os,

            [tag] = raw.match(/\w+/),
            id = raw.match(/#\w+/)?.[0].slice(1),
            classs = raw.match(/\.[-\w]+/g)?.map(o => o.slice(1)),
            text = raw.match(/<.*>/)?.[0].replace(/[<>]/g, ''),
            type = raw.match(/!\w+/)?.[0].slice(1)
        if (tag.match(svgTags))
            this.#cont = (id && document.getElementById(id)) || from || document.createElementNS('http://www.w3.org/2000/svg', tag)
        else this.#cont = (id && document.getElementById(id)) || from || document.createElement(tag)
        if (type) this.#cont.type = type
        if (id) this.#cont.id = id
        if (text) this.#cont.textContent = text
        if (this.#cont instanceof HTMLUnknownElement) warn(`Unsupported element '${tag}'`)
        this.#cont = new WeakRef(this.#cont)
        if (new.target.all.has(this.cont))
            reportError(TypeError('Something went wrong!'))
        if (deprecatedTags.test(tag)) warn(`♿️ Deprecated '${tag}' element usage`)
        const {proxy,revoke} = Proxy.revocable(this, new.target.#HANDLER)
        new.target.all.set(this.cont, proxy)
        Object.defineProperty(this, __revoke__, {value: revoke})
        new.target.#expiry.register(this.cont, revoke)
        if (parent) proxy.parent = parent
        if (kids) proxy.batch(kids)
        classs && proxy.classList.add.apply(proxy.classList, classs)
        this.children = new Proxy(this.cont.children, HTMLElementWrapper.#childHandler)
        this.#start(seed)
        return proxy
    }
    get attr() {
       return Object.defineProperty(this, 'attr', {
            value: new Proxy(this, HTMLElementWrapper.#attr),
            configurable: 1,
            enumerable: 1
        }).attr
    }
   #start(seed) {
        if ('events'in seed) this.on(seed.events)
        if ('styles'in seed) this.styleMe(seed.styles)
        if ('txt'in seed) this.txt = seed.txt
        if (seed.tag === 'button' || seed.type === 'button') this.styleMe('cursor', 'pointer')
        if ('offsprings'in seed && 'os'in seed) warn('🚼 Child was overwritten')
        if ('attributes'in seed || 'attr'in seed) this.setAttributes(seed.attributes || seed.attr)
    }
    static#expiry = new FinalizationRegistry(regi)
    get cont() {
        return this.#cont.deref()
    }
    destroy() {
        const {
            children,
            cont
        } = this
        let t = getEventNames(cont)
        t?.size && this.off(...t)
        cont.getAnimations({
            subtree: true
        }).forEach(removeAnimations)
        while (children.length) children[0].destroy()
        do cont.remove()
        while (cont.parentElement)
        function removeAnimations(anim) {
            anim.cancel()
        }
        this[__revoke__]()
        return null
    }
    on(events, useHandler) {
        let me = this
        if (typeof events === 'string' && typeof useHandler === 'function') {
            events = [[events, useHandler]]
            useHandler = false
        }
        events = (isArray(events) ? events : Object.entries(events)).map(map)
        return events.length && on(this.cont, events)
        function map([name, event]) {
            return [name, event.bind(me)]
        }
    }
    off(...names) {
        off(this.cont, ...names)
        return this
    }
    setAttributes(attributes) {
        if (!isArray(attributes)) attributes = Object.entries(attributes)
        for (let [attr, val] of attributes) this.cont.setAttribute(attr, val)
        return this
    }
    set parent(element) {
        return element == null
            ? this.cont.remove()
            : getProxy(element).appendChild(this.cont)
    }
    get parent() {
        return getProxy(this.cont.parentElement)
    }
    get txt() {
        return this.textContent
    }
    set txt(val) {
        this.textContent = val
    }
    static {
        const {
            prototype,
        } = this;
        //Safeguards
        ['innerHTML', 'innerText', 'textContent'].forEach(go)
        function go(name) {
            Object.defineProperty(prototype, name, {
                get() {
                    return this.cont[name]
                },
                set(value) {
                    if (this.cont.childElementCount) throw TypeError(`🔏 Cannot set '${name}' of a parent element`)
                    this.cont[name] = value
                }
            })
        }
    }
    pop() {
        const {
            lastElementChild
        } = this.cont
        if (lastElementChild) {
            this.cont.removeChild(lastElementChild)
            return getProxy(lastElementChild)
        }
        return null
    }
    static#attr = {
        get(target, prop) {
            return target.cont.getAttribute(prop)
        },
        set(target, prop, value) {
            if (value == null) this.deleteProperty(target, prop)
            else if (typeof value === 'boolean') target.cont.toggleAttribute(prop, value)
            else target.cont.setAttribute(prop, value)
            if (prop === 'autofocus') queueMicrotask(() => target.cont.focus())
            return 8
        },
        deleteProperty(target, prop) {
            return!target.cont.removeAttribute(prop)
        },
        has(target, prop) {
            return target.cont.hasAttribute(prop)
        }
    }
    empty() {
        const fragment = frag(),
            { children } = this
        while (children.length) {
            let { cont } = children[0]
            this.removeChild(cont)
            fragment.appendChild(cont)
        }
        return fragment
    }
    destroyChildren() {
        const {
            children
        } = this
        while (children.length) children[0].destroy()
        return this
    }
    animate(keyframes, options) {
        for (let { length } = keyframes; length--;) {
            let frame = keyframes[length]
            for (let [prop, val] of Object.entries(frame)) {
                try {
                    let hasValue = frame[prop].trim()
                    delete frame[prop]
                    if (hasValue) frame[css.toCaps(css.vendor(css.toDash(prop), val))] = val
                }
                finally { continue }
            }
        }
        return this.cont.animate(keyframes, options)
    }
    eval() {
        //Function(`with(this)void class{static{${code}}}`).call(this)
        return eval(arguments[0])
    }
}
const {from} = Array
export const elem = HTMLElementWrapper
export function getElementsByTagName(tag) {
    if (!this) {
        if (tag === 'img') return from(document.images, getProxy)
        if (tag === 'a') return from(document.links, getProxy)
        if (tag === 'embed') return from(document.embeds, getProxy)
        if (tag === 'script') return from(document.scripts, getProxy)
    }
    return from((this ?? document).getElementsByTagName(tag), getProxy)
        .concat(from((this ?? document).getElementsByTagNameNS('http://www.w3.org/2000/svg', tag), getProxy))
}
export function getElementsByClassName(CLASS) {
    return from((this ?? document).getElementsByClassName(CLASS), getProxy)
}
export function getElementsByName(name) {
    return from((this ?? document).getElementsByName(name), getProxy)
}
export function getElementsByTagNameNS(name) {
    return from((this ?? document).getElementsByTagNameNS(name), getProxy)
}
export function getElementById(id) {
    return getProxy((this ?? document).getElementById(id))
}
export function querySelector(selector) {
    return getProxy((this ?? document).querySelector(selector))
}
export function querySelectorAll(selector) {
    return from((this ?? document).querySelectorAll(selector), getProxy)
}
export function getProxy(element) {
    return HTMLElementWrapper.verifyTarget(element)
}
for (let func of new Set([getElementsByClassName, getElementsByTagName, getElementsByName, getElementsByTagNameNS, getElementById, querySelector, querySelectorAll, getProxy])) {
    Object.defineProperty(HTMLElementWrapper, func.name, {
        value: func.bind(null)
    })
}
export default HTMLElementWrapper = new Proxy(HTMLElementWrapper, {
    apply(target, _, args) {
        let [raw, seed, ...children] = args
        seed ??= {}
        if (raw instanceof HTMLElement) return getProxy(raw)
        if (seed instanceof HTMLElement || seed instanceof target) seed = {
            parent: seed
        }
        seed.raw = raw
        if (children.length) seed.os = children
        return new target(seed)
    },
    construct(_, args) {
        return HTMLElementWrapper(...args)
    }
})

export function Alert(t, e) {
    const old = querySelector('dialog')
    old?.close(), old?.destroy()
    return new Promise((o => {
        function n(t) {
            o(t), r.destroy()
        }
        let r = HTMLElementWrapper("dialog", {
            events: {
                close() {
                    n(t)
                }
            },
            parent: document.body,
            os: [HTMLElementWrapper("h3", {
                txt: t
            }), HTMLElementWrapper("p", {
                txt: e
            }), HTMLElementWrapper("form", {
                events: {
                    submit() {
                        n("OK")
                    }
                },
                method: "dialog",
                os: [HTMLElementWrapper("button", {
                    styles: {
                        width: "200px",
                        height: "30px"
                    },
                    txt: "OK"
                })]
            })]
        });
        r.fadein()
        r.showModal()
    }))
}
export const [
    disabled,
    resize,
    multiple,
    required,
    readonly,
    inert,
    hidden,
    open,
    autofocus
] = Array(9).fill(true)
export function FormDataManager(FormDataInstance) {
    if (!(FormDataInstance instanceof FormData)) FormDataInstance = new FormData(FormDataInstance)
    return new Proxy(FormDataInstance, {
        get(target, prop) {
            return target.get(prop)
        },
        set(target, prop, val) {
            return !target.set(prop, val)
        },
        has(target, prop) {
            return target.has(prop)
        },
        deleteProperty(target, prop) {
            return !target.delete(prop)
        }
    })
}
location.href.startsWith('http://localhost')
&& top  === window 
&& on(window, {
    offline() {
        reportError(new DOMException(`⛓️‍💥 Disconnected at ${new Date().toLocaleTimeString()}`, 'NetworkError'))
    },
    online() {
        console.debug(`🛜 Reconnected at ${new Date().toLocaleTimeString()}`)
    },
    error() {
        console.debug(`Something happened @ ${new Date().toLocaleTimeString()}:`)
    }
}, true)
function regi(revoke) {
    revoke()
}