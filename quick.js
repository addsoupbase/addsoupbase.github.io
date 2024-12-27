const sym = Symbol("🔑"), //For keeping track of events
    { warn, error } = console
/*function warn(message) {
    console.warn(`%c${message}`,'font-size:13px;')
}
function error(message) {
    console.error(`%c${message}`,'font-size:13px;')
}*/
export const allEvents = new WeakMap
const __eventGarbageCollection = new FinalizationRegistry(function ([key, set]) { set.delete(key) })
function verifyEventName(target, name) {
    name = name?.toLowerCase?.()
    if (name === 'domcontentloaded' && target === document) return
    //Some events like the one above don't have a handler
    if (!(`on${name}` in target)) throw TypeError(`Cannot listen for '${name}' events`)
    //Check if handler with name exists
}
export function on(target, events) {
    if (!(target instanceof EventTarget)) throw TypeError("Invalid event target")
    if (!(target[sym] instanceof Set))
        //This will hold the NAMES of the events
        Object.defineProperty(target, sym, { value: new Set })

    const myEvents = target[sym]
    if (!Array.isArray(events)) events = Object.entries(events)

    for (let [eventName, func] of events) {
        const options = {
            capture: false,
            once: false,
            passive: false,
        }

        if (myEvents.has(eventName)) {
            warn(`🔕 Duplicate '${eventName}' listener`)
            continue
        }
        const corn = target[core]
        func = func.bind(corn instanceof elem ? corn : target)
        if (eventName.includes('_')) {
            //Make an event that only triggers once,
            //and then is discarded
            eventName = eventName.replace('_', '')
            const oldFunc = func
            func = (...args) => {
                oldFunc.apply(null, args)
                off(target, eventName)
            }
        }
        if (eventName.includes('$')) {
            const oldFunc = func
            eventName = eventName.replace('$', '')
            func = (...args) => {
                args[0]?.preventDefault()
                oldFunc.apply(null, args)
            }
        }
        verifyEventName(target, eventName)
        //event.target will be the proxy if it exists
        __eventGarbageCollection.register(func, [eventName, myEvents])
        target.addEventListener(eventName, func, options)
        if (!allEvents.has(target)) allEvents.set(target, new Map)
        //A Map to hold the names & events
        const myGlobalEventMap = allEvents.get(target)
        myGlobalEventMap.set(eventName, func)
        myEvents.add(eventName)
    }
    return events
}
export function off(target, ...eventNames) {
    if (!(target instanceof EventTarget) || !(target[sym] instanceof Set) || !allEvents.has(target))
        throw TypeError("Invalid event target")

    const map = allEvents.get(target),
        mySet = target[sym]
    for ({ length } = eventNames; length--;) {
        const name = eventNames[length],
            func = map.get(name)
        target.removeEventListener(name, func)
        map.delete(name)
        mySet.delete(name)
        if (!map.size) allEvents.delete(target)
    }
}
export function until(target, eventName, timeout/* = 600000*/) {
    return new Promise(function (resolve, reject) {
        const id = timeout && setTimeout(reject, timeout, RangeError(`⏰ Promise for '${eventName}' expired after ${timeout} ms`))
        on(target, {
            [eventName](event) {
                try { resolve(event) }
                catch (e) { reject(e) }
                finally {
                    off(target, eventName)
                    timeout && clearTimeout(id)
                }
            }
        })
    })
}

const cont = Symbol('⛓'), //Access the HTMLElement instance from elem
    core = Symbol('🧿'),  //The opposite
    frag = document.createDocumentFragment.bind(document),
    deprecatedTags = /^(tt|acronym|big|center|dir|font|frame|frameset|marquee|nobr|noembed|noframes|param|plaintext|rb|rtc|strike|tt|xmp)$/i,
    svgTags = /^(animate|animateMotion|animateTransform|circle|clipPath|defs|desc|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|foreignObject|g|glyph|glyphRef|hkern|image|line|linearGradient|marker|mask|metadata|missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|stop|svg|switch|symbol|text|textPath|tref|tspan|use|view|vkern)$/i
//These have to be treated differently
export class elem {
    [cont] = null
    toString() {
        return this[cont].outerHTML
    }
    static verifyTarget(element) {
        //Okay this is really confusing but it works so
        if (element instanceof elem) return element
        else if (element?.[core] instanceof elem) return element[core]
        else if (element?.[cont] instanceof elem) return element[cont]
        else return element ? elem.select(element) : element
    }
    static deverifyTarget(Elem) {
        //The opposite
        if (!(Elem[core] instanceof elem)) return Elem[core]
        return Elem[cont]
    }
    static select(element) {
        return elem.all.has(element) || new elem({ from: element })
    }
    static all = new WeakSet
    //Store every instance
    static #HANDLER = {
        get(target, prop) {
            const content = target[cont]
            if (prop in target) return target[prop]
            if (typeof prop === 'string' && content.hasAttribute(prop)) return content.getAttribute(prop)
            let out = content[prop]
            if (typeof out === 'function') out = out.bind(content)
            return out
        },
        set(target, prop, value) {
            const content = target[cont]
            if (prop in target) {
                target[prop] = value
                return true
            }
            if (typeof prop === 'string' && content.hasAttribute(prop)) {
                content.setAttribute(prop, value)
                return true
            }
            content[prop] = value
            return true
        }
    }
    styles = new Map
    hide() {
        this.styleMe({ display: 'none' })
    }
    show() {
        this.styleMe({ display: '' })
    }
    styleMe(styles) {
        if (!Array.isArray(styles)) styles = Object.entries(styles)
        for (let { length } = styles; length--;) {
            const [prop, val] = styles[length]
            this.styles.set(prop, val)
            if (!val.trim()) this.styles.delete(prop)
            if (val && !CSS.supports(prop, val)) warn(`⛓️‍💥 Unrecognized CSS in '${prop}: ${val}'`)
        }
        const final = extractCSSFromObject([...this.styles.entries()])
        return this[cont].style.cssText = final
    }
    constructor(seed = 'div') {
        if (elem.all.has(this)) throw ReferenceError('Duplicate element')
        if (typeof seed === 'string') seed = { tag: seed }
        let { from, tag = 'div', parent, offsprings, os } = seed,
            kids = offsprings ?? os,
            classes = { length: 0 }
        if (tag.includes(',')) {
            [tag, classes] = tag.split(',')
            classes = classes.trim().split(' ')
        }
        if (tag.includes(':')) {
            [tag, seed.type] = tag.split(':')
        }
        if (tag.match(svgTags))
            this[cont] = from ?? document.createElementNS('http://www.w3.org/2000/svg', tag)
        else this[cont] = from ?? document.createElement(tag)
        if (deprecatedTags.test(tag)) warn(`♿️ Deprecated '${seed.tag}' tag usage`)
        this.__properties__ = new Map
        const out = new Proxy(this, elem.#HANDLER)
        this[cont][core] = out
        if (kids) out.offsprings = kids
        if (parent) out.parent = parent
        for (let { length } = classes; length--;) out.classList.add(classes[length])
        this.#start(seed)
        return out
    }
    destroy() {
        const { offsprings } = this
        for (let { length } = offsprings; length--;) {
            const kid = offsprings[length]
            while (kid.parent) kid.destroy()
        }
        this[cont].remove()
    }
    #start(seed) {
        let keys = Object.keys(seed),
            me = this[cont]
        for (let { length } = keys; length--;) {
            const prop = keys[length]
            if (prop === 'resize') {
                this.styleMe({ resize: seed.resize ?? 'both' })
            }
            else if (prop === 'readonly') {
                me.setAttribute('readonly', true)
            }
            else if (prop === 'hidden') {
                me.toggleAttribute('hidden', true)
            }
            else if (prop === 'open') {
                me.toggleAttribute('open', true)
            }
            else if (prop === 'autofocus')
                setTimeout(function () { me.focus() })
            else if (prop in me)
                try { me[prop] = seed[prop] }
                catch { me.setAttribute(prop, seed[prop]) }
            else if (me.hasAttribute(prop)) {
                me.setAttribute(prop, seed[prop])
            }

        }
        if ('events' in seed) on(me, seed.events)
        if ('styles' in seed) this.styleMe(seed.styles)
        if ('txt' in seed) this.txt = seed.txt
        if (seed.tag === 'button' || seed.type === 'button') this.styleMe({ cursor: 'pointer' })

        if ('offsprings' in seed && 'os' in seed) warn('🚼 Child was overwritten')
        elem.all.add(this)

    }
    on(events) {
        return on(this[cont], events)
    }
    off(...names) {
        off.apply(this[cont], names)
    }
    set parent(element) {
        element = elem.verifyTarget(element)
        element.appendChild(this[cont])
    }
    get parent() {
        return elem.verifyTarget(this[cont].parentElement)
    }
    get offsprings() {
        return Array.from(this[cont].children, elem.verifyTarget)
    }
    get txt() {
        return this[cont].textContent
    }
    set txt(val) {
        if (this[cont].childElementCount) throw TypeError('Cannot set textContent of a parent element')
        this[cont].textContent = val
    }
    empty() {
        const fragment = frag()
        this.offsprings.forEach(function (child) {
            child = elem.deverifyTarget(child)
            this.removeChild(child)
            fragment.appendChild(child)
        })
        return fragment
    }
    destroyChildren() {
        let { offsprings } = this
        for (let { length } = offsprings; length--;)
            offsprings[length].destroy()
    }
    set offsprings(children) {
        const fragment = frag()
        for (let i = 0, { length } = children; i < length; ++i) {
            let kid = elem.deverifyTarget(children[i])
            fragment.appendChild(kid)
        }
        this[cont].appendChild(fragment)
    }

    /*get properties() {
        return this.__properties__
    } */
    #logLevel = null
    set size({ width, height }) {
        if (width)
            this[cont].setAttribute('width', width)
        if (height)
            this[cont].setAttribute('height', height)
    }
    get tagname() {
        return this[cont].tagName
    }
    get __logLevel__() {
        return this.#logLevel
    }
    set __logLevel__(val) {
        this.#logLevel = val
    }
    __createProperty__(prop, val) {
        if (this.__hasProperty__(prop)) {
            error(prop)
            throw TypeError('The property above already exists in this object')
        }
        return this.__properties__.set(prop, val)
    }
    __setProperty__(prop, val) {
        if (!this.__hasProperty__(prop)) {
            error(prop)
            throw TypeError('The property above does not exist in this object')
        }
        return this.__properties__.set(prop, val)
    }
    get __element__() {
        return this[cont]
    }
    __deleteProperty__(prop) {
        if (!this.__hasProperty__(prop)) {
            error(prop)
            throw TypeError('The property above does not exist in this object')
        }
        return this.__properties__.delete(prop)
    }
    __hasProperty__(prop) {
        return this.__properties__.has(prop)
    }
    __set__(prop, val) {
        if (this.__hasProperty__(prop)) return this.__setProperty__(prop, val)
        return this.__createProperty__(prop, val)
    }
    __getProperty__(prop) {
        if (!this.__hasProperty__(prop)) {
            error('Property: ', prop)
            throw TypeError('The property above does not exist in this object')
        }
        return this.__properties__.get(prop)
    }
    __deleteProperties__() {
        return this.__properties__.clear()
    }
}
/**
 * > New element
 * @param {String} tag An HTML element tag 
 * @param {Object} seed Object that describes the element
 * @returns Proxy instance
 */
function $(tag, seed) {
    if (seed instanceof HTMLElement || seed instanceof elem) seed = { parent: seed }
    return new elem({ ...seed, tag })
}

export default $
export const SYMBOLS = [cont, core, sym]
    , setup = {
        get body() {
            return $('body', { parent: document.documentElement, from: document.body ?? document.createElement('body') })
        }
    }
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
    if (!Array.isArray(obj)) obj = Object.entries(obj)
    for (let [prop, val] of obj)
        arr.push(`${prop}:${val}`)
    return arr.join(';') + ';'
}
/** 
 *  ⚠️ Should only be used for dynamic CSS
 * @param {String} selector A valid CSS selector (something like . or #)
 * @param {Object} rule An object which describes the selector 
 */
export function registerCSS(selector, rule) {
    const { sheet } =
        addedStyleRules ??= $('style', { parent: document.head })
    sheet.insertRule(`${selector}{${extractCSSFromObject(rule)}}`)
}
/*class Dialog {
    constructor(parent,children) {
        return $('dialog',{
            parent,
            os:children
        })
    }
}*/
export function Alert(t,e) {
    let old = document.querySelector('dialog')
    old?.close()
    old?.[core].destroy()
    return new Promise((o=>{function n(t){o(t),r.destroy()}let r=$("dialog",{events:{close(){n(t)}},styles:{"font-family":"Arial","text-align":"center",width:"300px",height:"150px","word-break":"break-word"},parent:document.body,os:[$("h1",{txt:t}),$("p",{txt:e}),$("form",{events:{submit(){n("OK")}},method:"dialog",os:[$("button",{styles:{width:"200px",height:"30px"},txt:"OK"})]})]});r.showModal()}))}
export const disabled = true,
    resize = null,
    multiple = true,
    required = true,
    readonly = true,
    inert = true,
    hidden = 'hidden',
    open = true,
    autofocus = true
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