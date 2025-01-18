/*Some useful functions to remember:
queryObjects
reportError
monitor
monitorEvents
*/
import sym, { on, off } from './handle.js'
const
    { isArray } = Array,
    { warn } = console,
    frag = typeof document !== 'undefined' ? document.createDocumentFragment.bind(document) : null,
    deprecatedTags = /^(tt|acronym|big|center|dir|font|frame|frameset|marquee|nobr|noembed|noframes|param|plaintext|rb|rtc|strike|tt|xmp)$/i,
    svgTags = /^(animate|animateMotion|animateTransform|circle|clipPath|defs|desc|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|foreignObject|g|glyph|glyphRef|hkern|image|line|linearGradient|marker|mask|metadata|missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|stop|svg|switch|symbol|text|textPath|tref|tspan|use|view|vkern)$/i
//These SVG tags have to be treated differently
export class HTMLElementWrapper {
    [Symbol.toPrimitive]() {
        return this.cont.outerHTML
    }
    *[Symbol.iterator]() {
        yield* this.getElementsByTagName("*")
    }
    #cont = null
    getElementById(id) {
        return getElementById.call(this, id)
    }
    getElementsByClassName(classs) {
        return getElementsByClassName.call(this, classs)
    }
    getElementsByTagName(name) {
        return getElementsByTagName.call(this, name)
    }
    getElementsByName(name) {
        return getElementsByName.call(this, name)
    }
    querySelector(selector) {
        return querySelector.call(this, selector)
    }
    querySelectorAll(selector) {
        return querySelectorAll.call(this, selector)
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
    static select(element) {
        return HTMLElementWrapper.all.has(element) || new HTMLElementWrapper({ from: element })
    }
    //Store every instance
    static all = new WeakMap
    static #HANDLER = {
        get(target, prop) {
            const { cont } = target
            if (prop === 'cont') return cont
            if (prop in target) return target[prop]
            if (typeof prop === 'string' && cont.hasAttribute(prop)) return cont.getAttribute(prop)
            let out = cont[prop]
            if (typeof out === 'function') target[prop] = out = out.bind(cont)
            else if (out instanceof HTMLElement) out = getProxy(out)
            return out
        },
        set(target, prop, value) {
            const { cont } = target
            if (prop in target)
                return Reflect.set(target, prop, value)
            if (typeof prop === 'string' && cont.hasAttribute(prop)) {
                let worked = 1
                try { cont.setAttribute(prop, value) }
                catch {
                    try { cont.attributeStyleMap.set(prop, value) }
                    catch { --worked }
                }
                finally { return worked }
            }
            return Reflect.set(cont, prop, value)
        }
    }
    styles = new Map
    hide() {
        this.styleMe({ display: 'none' })
    }
    show() {
        this.styleMe({ display: '' })
    }
    fadeout(duration = 500) {
        return this.animate([
            { opacity: '' },
            { opacity: 0 }
        ], { easing: 'ease', duration, fill: 'forwards' })
            .finished
    }
    wrap(html) {
        const { parent } = this
        if (typeof html === 'string') {
            const parsed = new DOMParser().parseFromString(html, 'text/html'),
                { firstChild } = parsed.body
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
        return this.animate([
            { opacity: 0 },
            { opacity: '' }
        ], { easing: 'ease', duration, fill: 'forwards' })
            .finished
    }
    styleMe(styles) {
        if (!isArray(styles)) styles = Object.entries(styles)
        for (let { length } = styles; length--;) {
            let [prop, val] = styles[length]
            val = `${val}`
            if (!val.trim()) this.styles.delete(prop)
            else if (!CSS.supports(prop, val)) warn(`⛓️‍💥 Unrecognized CSS in '${prop}: ${val}'`)
            else this.styles.set(prop, val)
        }
        const final = extractCSSFromObject(Array.from(this.styles.entries()))
        return this.cont.style.cssText = final
    }
    /**
* New element
* @param {String} tag An HTML element tag 
* @param {Object | String} seed Object that describes the element
* @returns Proxy instance
*/
    constructor(seed = 'div') {
        if (typeof seed === 'string') seed = { tag: seed }
        let { from, tag = 'div', parent, offsprings, os } = seed,
            kids = offsprings ?? os,
            classes
        if (tag.includes(',')) {
            [tag, classes] = tag.split(',')
            classes = classes.trim().split(' ')
        }
        if (tag.includes(':')) {
            [tag, seed.type] = tag.split(':')
        }
        if (tag.match(svgTags))
            this.#cont = from ?? document.createElementNS('http://www.w3.org/2000/svg', tag)
        else this.#cont = from ?? document.createElement(tag)
        this.#cont = new WeakRef(this.#cont)
        if (new.target.all.has(this.cont)) {
            reportError(TypeError('Something went wrong!'));
        }
        if (deprecatedTags.test(tag)) warn(`♿️ Deprecated '${seed.tag}' tag usage`)
        this.attr = new Proxy(this.cont, new.target.#attr)
        const proxy = new Proxy(this, new.target.#HANDLER)
        new.target.all.set(this.cont, proxy)
        // new.target.cleanup.register(this.cont,console.log)
        if (kids) proxy.offsprings = kids
        if (parent) proxy.parent = parent
        classes && proxy.classList.add.apply(proxy.classList, classes)
        this.#start(seed)
        return proxy
    }
    // static cleanup = new FinalizationRegistry(func => {
    // alert('Revoked')
    //    func()
    // })
    get cont() {
        return this.#cont.deref()
    }
    destroy() {
        const { offsprings, cont } = this
        for (let { length } = offsprings; length--;) {
            const kid = offsprings[length]
            kid.destroy()
        }
        cont[sym]?.size && off(cont, ...cont[sym])
        cont.getAnimations({ subtree: true }).forEach(removeAnimations)
        do cont.remove()
        while (cont.parentElement) function removeAnimations(anim) { anim.cancel() }
    }
    #start(seed) {
        let keys = Object.keys(seed),
            { cont } = this
        for (let { length } = keys; length--;) {
            const prop = keys[length]
            if (prop === 'resize')
                this.styleMe({ resize: seed.resize ?? 'both' })
            else if (prop === 'readonly')
                this.attr.readonly = true
            else if (prop === 'hidden')
                cont.toggleAttribute('hidden', true)
            else if (prop === 'open')
                cont.toggleAttribute('open', true)
            else if (prop === 'autofocus')
                queueMicrotask(() => cont.focus())
            else if (prop in cont)
                try { cont[prop] = seed[prop] }
                catch { cont.setAttribute(prop, seed[prop]) }
            else if (cont.hasAttribute(prop))
                cont.setAttribute(prop, seed[prop])
        }
        if ('events' in seed) this.on(seed.events)
        if ('styles' in seed) this.styleMe(seed.styles)
        if ('txt' in seed) this.txt = seed.txt
        if (seed.tag === 'button' || seed.type === 'button') this.styleMe({ cursor: 'pointer' })
        if ('offsprings' in seed && 'os' in seed) warn('🚼 Child was overwritten')
        if ('attributes' in seed)
            Object.assign(this.attr, seed.attributes)
    }
    on(events) {
        let k = this
        events = (isArray(events) ? events : Object.entries(events)).map(function ([name, event]) {
            return [name, event.bind(k)]
        })
        return on(this.cont, events)
    }
    off(...names) {
        off(this.cont, ...names)
    }
    setAttributes(attributes) {
        if (!isArray(attributes)) attributes = Object.entries(attributes)
        for (let [attr, val] of attributes) this.cont.setAttribute(attr, val)
    }
    set parent(element) {
        if (element == null) return this.cont.remove()
        element = getProxy(element)
        element.appendChild(this.cont)
    }
    get parent() {
        return getProxy(this.cont.parentElement)
    }
    get offsprings() {
        return Array.from(this.cont.children, getProxy)
    }
    get txt() {
        return this.textContent
    }
    set txt(val) {
        this.textContent = val
    }
    static {
        const { prototype, } = this;
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
        const { lastElementChild } = this.cont
        if (lastElementChild) {
            this.cont.removeChild(lastElementChild)
            return getProxy(lastElementChild)
        }
    }
    push(...children) {
        return children.length && this.cont.appendChild.apply(this.cont, children)
    }
    unshift(...children) {
        return children.length && this.cont.prepend.apply(this.cont, children)
    }
    shift() {
        const { firstChild } = this
        this.cont.removeChild(firstChild)
        return firstChild
    }
    at(index) {
        return this.offsprings.at(index)
    }
    forEach(func, thisArg) {
        this.offsprings.forEach(func, thisArg)
    }
    every(testFunc) {
        return this.offsprings.every(testFunc)
    }
    find(testFunc) {
        return this.offsprings.find(testFunc)
    }
    static #attr = {
        get(target, prop) {
            return target.getAttribute(prop)
        },
        set(target, prop, value) {
            target.setAttribute(prop, value)
            return true
        },
        deleteProperty(target, prop) {
            target.removeAttribute(prop)
            return true
        },
        has(target, prop) {
            return target.hasAttribute(prop)
        }
    }
    empty() {
        const fragment = frag()
        this.offsprings.forEach(({ cont }) => {
            this.cont.removeChild(cont)
            fragment.appendChild(cont)
        })
        return fragment
    }
    destroyChildren() {
        const { offsprings } = this
        for (let { length } = offsprings; length--;)
            offsprings[length].destroy()
    }
    set offsprings(children) {
        let fragment
        if (children.length <= 1) fragment = HTMLElementWrapper.deverifyTarget(children[0])
        else for (let i = 0, { length } = children; i < length; ++i)
            (fragment ??= frag()).appendChild(HTMLElementWrapper.deverifyTarget(children[i]))
        fragment && this.cont.appendChild(fragment)
    }
    #eval(code) {
        Function(`with(this)void class{static{${code}}}`).call(this)
    }
    get tagname() {
        return this.cont.tagName
    }
}
const { from } = Array
export function getElementsByTagName(tag) {
    return from((this ?? document).getElementsByTagName(tag), getProxy)
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
export default HTMLElementWrapper = new Proxy(HTMLElementWrapper, {
    apply(target, _, args) {
        let [tag, seed = {}] = args
        if (seed instanceof HTMLElement || seed instanceof target) seed = { parent: seed }
        seed.tag = tag
        return new target(seed)
    },
    construct(_, args) {
        return HTMLElementWrapper(...args)
    }
})
export async function importFont(name, src) {
    if (!name || !src) throw TypeError('More arguments needed')
    const font = new FontFace(name, `url(${src})`)
    await font.load()
    document.fonts.add(font)
    return font
}
let addedStyleRules = null
/**
 * @param {Object} obj key/value pairs that match CSS
 * @returns {String}
 */
function extractCSSFromObject(obj) {
    const arr = []
    if (!isArray(obj)) obj = Object.entries(obj)
    for (let [prop, val] of obj)
        arr.push(`${prop}:${val}`)
    return `${arr.join(';')};`
}
/** 
 *  ⚠️ Should only be used for dynamic/default CSS
 * @param {String} selector A valid CSS selector (something like . or #)
 * @param {Object} rule An object which describes the selector 
 */
export function registerCSS(selector, rule) {
    const { sheet } =
        addedStyleRules ??= HTMLElementWrapper('style', { parent: document.head })
    sheet.insertRule(`${selector}{${extractCSSFromObject(rule)}}`)
}
if (frag) queueMicrotask(() => {
    registerCSS('dialog', {
        transition: 'opacity 1s linear',
        "font-family": "Arial",
        "text-align": "center",
        width: "300px",
        height: "150px",
        "word-break": "break-word"
    })
    registerCSS('.centerx,.center', {
        'justify-self': 'center',
        margin: 'auto'
    })
    registerCSS('.centery,.center', {
        'align-self': 'center',
        inset: 0,
        position: 'fixed'
    })
})
export const CSSSyntax = {
    __proto__: null,
    boxShadow({ offsetX = '0px', offsetY = '0px', blurRadius = '', spreadRadius = '', color = '#000000' }) {
        return `${color} ${offsetX} ${offsetY} ${blurRadius} ${spreadRadius}`.replaceAll('  ', '')
    },
    dropShadow({ color = '#000000', offsetX = '0px', offsetY = '0px', standardDeviation = '' }) {
        return `${color} ${offsetX} ${offsetY} ${standardDeviation}`
    }
}

class StorageProxy {
    static #handler = {
        get(target, prop) {
            if (!isNaN(prop) && +prop > -1)
                return target.key(prop)
            if (prop === 'clear' || prop === 'length') return target[prop]
            return target.getItem(prop)
        },
        has(target, prop) {
            return target.getItem(prop) != null
        },
        deleteProperty(target, prop) {
            target.removeItem(prop)
            return true
        },
        set(target, prop, value) {
            target.setItem(prop, value)
            return true
        }
    }
    constructor(storage) {
        if (storage instanceof Storage)
            return new Proxy(storage, StorageProxy.#handler)
        throw TypeError("Illegal constructor")
    }
}
export const lstorage = typeof localStorage !== 'undefined' &&
    new StorageProxy(localStorage),
    sstorage = typeof sessionStorage !== 'undefined' &&
        new StorageProxy(sessionStorage)
export function Alert(t, e) {
    const old = querySelector('dialog')
    old?.close(), old?.destroy()
    return new Promise((o => { function n(t) { o(t), r.destroy() } let r = HTMLElementWrapper("dialog", { events: { close() { n(t) } }, parent: document.body, os: [HTMLElementWrapper("h1", { txt: t }), HTMLElementWrapper("p", { txt: e }), HTMLElementWrapper("form", { events: { submit() { n("OK") } }, method: "dialog", os: [HTMLElementWrapper("button", { styles: { width: "200px", height: "30px" }, txt: "OK" })] })] }); r.showModal() }))
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
            target.set(prop, val)
            return true
        },
        has(target, prop) {
            return target.has(prop)
        },
        deleteProperty(target, prop) {
            target.delete(prop)
            return true
        }
    })
}
on(window, {
    offline() {
        reportError(new DOMException(`⛓️‍💥 Disconnected at ${Date().toLocaleTimeString()}`, 'NetworkError'))
    },
    online() {
        console.log(`🛜 Reconnected at ${Date().toLocaleTimeString()}`)
    }
}, true)