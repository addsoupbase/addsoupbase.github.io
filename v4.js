// most recent attempt (and hopefully the best!)
import Proxify, { css, Element$ } from './HTMLProxy.js'
export { css, Proxify }
import { base, Handler } from './BaseProxy.js'
const D = document
function label(r) { return r[Symbol.toStringTag] }
var parse = (parse = new Range).createContextualFragment.bind(parse)
let rawCache = new Map
let frequent = new Set
Element$.prototype.$ || Object.defineProperty(Element$.prototype, '$', {
    value(...args) {
        let out = $(...args).to(this)
        return out
    }
})
export function ce(htmlOrTag) {
    let node = rawCache.get(htmlOrTag)
    if (node) return Proxify(node.cloneNode(true))
    if (Regex.frag.test(htmlOrTag))
        node = parse(htmlOrTag.replace(Regex.frag, '$1'))
    else if (isHTMLSyntax(htmlOrTag))
        // let n = parse(htmlOrTag)
        // if (n.childElementCount !== 1) console.warn(`Multiple elements returned: ${htmlOrTag}, pass an array instead`) // $(['<div></div>']) is a DocumentFragment
        node = parse(htmlOrTag).firstElementChild//n.childElementCount === 1 ? n.firstElementChild : n
    else {
        let tag = htmlOrTag.match(Regex.tag)?.[0]
        node = D.createElement(tag)
        let className = htmlOrTag.match(Regex.class)?.map(o => o.substring(1)).join(' ')
        if (className) node.className = className
        let id = htmlOrTag.match(Regex.id)?.[0].substring(1) || ''
        if (id) node.id = id
    }
    if (!node) throw SyntaxError(`Malformed HTML`, { cause: htmlOrTag })
    if (frequent.has(htmlOrTag))
        rawCache.set(htmlOrTag, node.cloneNode(true))
    else {
        if (frequent.size > 512) frequent.clear()
        frequent.add(htmlOrTag)
    }
    return Proxify(node)
}
const Regex = {
    tag: /[\w-]+/i,
    class: /\.([\w-]+)/g,
    id: /#([\w-]+)/,
    evtAttr: /^\(([_$^%&!?@#<>|\w]+)\)$/,
    comment: /^@Replace #\d+$/,
    html: /^\s*<.*>\s*$/s,
    apos: /'/g,
    q: /"/g,
    frag: /^\s*<>(.*)<\/>\s*$/s
}
const isHTMLSyntax = / /.test.bind(Regex.html)
export let body = D.body && Proxify(D.body)
const nodeCache = new Map
function handleSub(sub, replace) {
    if (sub === Object(sub)) {
        if (sub instanceof String) return sub.toString() // Don't escape
        if (typeof sub === 'function') {
            let r = sub.toString()
            replace.map.set(r, sub)
            return escapeHTML(r)
        }
        if (Node.prototype.isPrototypeOf(sub = base(sub))) {
            let comment = `@Replace #${++replace.toReplace}`
            // this bit is really helpful:
            // $`<form>${$`<button (click)="${function(e){
            // if (someCondition) e.preventDefault()
            // }}"></button>`}</form>`
            // the parenthesis around the event name are required!!
            // i can add flags to them as well:
            // $`<div (%_$click)=${...}></div>`
            replace.map.set(comment, sub)
            return `<!--${comment}-->`
        }
    }
    return escapeHTML(String(sub))
}
export function $(strings, ...subs) {
    if (typeof strings === 'string') return ce(strings) // $(`<p>Example</p>`)
    if (Array.isArray(strings) && !('raw' in strings))
        return ce(`<>${strings.join('')}</>`) // $([`<h1>Heading</h1>`, `<p>Example</p>`])
    // ^ returns a DocumentFragment
    if (!subs.length) {
        let { raw } = strings
        if (nodeCache.has(raw)) return Proxify(nodeCache.get(raw).cloneNode(true))
        let out = ce(strings.join(''))
        let node = base(out)
        nodeCache.set(raw, node.cloneNode(true))
        return out // $`<p>Example</p>`
    }
    let result = []
        , replace = { map: new Map, toReplace: 0 }
    for (let i = 0, n = strings.length, { length } = subs; i < n; ++i)
        result.push(`${strings[i]}${i < length ? handleSub(subs[i], replace) : ''}`)
    let out = ce(result.join(''))
    let node = base(out) // <-- Either a DocumentFragment or an Element depending on if you did $`<><p>hello</p></>` or not
    //@dev console.assert(node instanceof DocumentFragment || node instanceof Element, node.constructor)
    let { map } = replace
    if (replace.toReplace)
        for (let o of treeWalker(base(out), 128, commentFilter)) o.replaceWith(map.get(o.textContent))
    // conclusion: TreeWalker > XPath & NodeIterator
    let type = node.nodeType
    // switch (type) {
    // case 1: // element
    // case 9: // document
    // case 11: // document fragment
    doEvents(out, map, type)
    // }
    return out
    // $`<p (click)="${ event => { ... } }">${example}</p>`
    // ^ the subs are escaped safely but others are handled
    // specially (is that a word?) like functions
}
function doEvents(n, map, type) {
    let node = base(n)
        , config = { enumerable: true, writable: true, configurable: true }
        , all = [].slice.call(node.querySelectorAll('*'))
    type === 1 && all.push(node)
    for (let i = all.length; i--;) {
        let node = all[i]
        if (node.hasAttributes()) {
            let events = {}
                , attr = node.getAttributeNames()
            for (let i = attr.length; i--;) {
                let a = attr[i]
                    , match = a.match(Regex.evtAttr)
                if (match) {
                    let func = config.value = map.get(node.getAttribute(a)),
                        m = match[1]
                    node.removeAttribute(a)
                    if (typeof func !== 'function' && typeof func?.handleEvent !== 'function') throw TypeError(`Invalid event handler for ${m}`)
                    Object.defineProperty(events, m, config)
                }
            }
            Proxify(node).on(events)
        }
    }
}
export const esc = $
export default $
function commentFilter(e) {
    return Regex.comment.test(e.textContent) ? 1 : 3
}
export const id = new Proxy({ __proto__: null }, {
    get(_, id) {
        let o = D.getElementById(id)
        if (o) return Proxify(o)
        throw ReferenceError(`Cannot find element #${String(id)}`)
    },
    deleteProperty(_, id) {
        D.getElementById(id)?.remove()
        return true
    }
})
export function sel(t) {
    if (Element.prototype.isPrototypeOf(t)) return Proxify(t)
    throw TypeError(`Target must be an element: ${label(t)}`)
}
export function escapeTagged(strings, ...subs) {
    let out = ''
    for (let i = 0, n = strings.length, { length } = subs; i < n; ++i)
        out += `${strings[i]}${i < length ? escapeHTML(subs[i]) : ''}`
    return out
}
export function escapeHTML(s) { (a ??= D.createElement('p')).textContent = s; return a.innerHTML.replace(Regex.q, '&quot;').replace(Regex.apos, '&#39;') } let a
//@dev window.$ = esc
//@dev 'body'in window || Object.defineProperty(window, 'body', {get() {return Proxify(document.querySelector('body'))}})
//@dev window.escapeHTML = txt => escapeHTML(prompt(txt))
//@dev window.esc = escapeTagged
//@dev window.cache = rawCache
function* treeWalker(root, whatToShow, filter) {
    let walker = D.createTreeWalker(root, whatToShow, filter)
    let o
    while (o = walker.nextNode()) yield o
}

let isApple = !!D.getCSSCanvasContext
let isFirefox = !!D.mozSetImageElement
let contexts = new Map
export function getContext(type, id, width, height, settings, fallbackURL) {
    // -moz-element() only works on Firefox
    // -paint() only works on chrome, as well as very limited in what you can do
    // -webkit-canvas() only works on safari, and needed a workaround to do so!
    if (contexts.has(id)) return contexts.get(id)
    let s = CSS.escape(id)
    css.write(
        `[data-v4-unreliable-canvas-background="${s}"] {
        background-image: paint(${s});
        background-image: -webkit-canvas(${s});
        background-image: -moz-element(#${s})
}`
    )
    if (isApple) {
        let o = D.getCSSCanvasContext(type, id, width, height)
        contexts.set(id, o)
        return o
    }
    if (isFirefox) {
        let o = D.createElement('canvas')
        o.width = width
        o.height = height
        D.mozSetImageElement(id, o)
        return o.getContext(type, settings)
    }
    fallbackURL && CSS.paintWorklet.addModule(fallbackURL)
    contexts.set(id, null)
    return null
}
const watchHandler = {
    has(t, p) {
        return p in Watcher.getTarget(t)
    },
    get(t, p) {
        // Remember: the functions can't be bound so that 
        // array generic methods work as expected (they target the proxy)
        return Watcher.getTarget(t)[p]
    },
    set(t, p, v, r) {
        Watcher.queue(t, p)
        return Reflect.set(Watcher.getTarget(t), p, v)
    }
}
class Volatile {
    static #handle(sub, target) {
        let type = typeof sub
        if (type === 'function') return sub(target)
        if (type === 'string' || type === 'number' || type === 'symbol') return target[sub]
        throw TypeError(`Wrong type: ${type}`)
    }
    #sets = new Map
    save(p, prop, setNow) {
        this.#sets.set(p, prop)
        if (setNow) p[prop] = this.toString()
    }
    delete(p) {
        this.#sets.delete(p)
    }
    emit() {
        let myVal
        for (let [set, prop] of this.#sets)
            set[prop] = myVal ??= this.toString()
    }
    toString() {
        let strings = this.#strings, subs = this.#subs, target = this.#target
        let result = ''
        for (let i = 0, n = strings.length, { length } = subs; i < n; ++i)
            result += `${strings[i]}${i < length ? Volatile.#handle(subs[i], target) : ''}`
        return result
    }
    #strings
    #subs
    #target
    constructor(targetObj, strings, subs) {
        this.#target = targetObj
        this.compile(strings, ...subs)
    }
    compile(strings, ...subs) {
        this.#strings = strings
        this.#subs = subs
    }
}
function LookerFunction(strings, ...subs) {
    let out = new Volatile(Watcher.getTarget(this), strings, subs)
    Watcher.addToVolatile(this, out)
    return out
}
class Watcher extends function () {
    return callee
    function callee(...args) {
        return LookerFunction.apply(callee, args)
    }
} {
    #volatiles = new Set
    static addToVolatile(t, vol) {
        t.#volatiles.add(vol)
    }
    static getVolatiles(t) { return t.#volatiles }
    static getTarget(t) {
        return t.#target
    }
    static getProps(t) { return t.#watchingProps }
    static emitVolatiles(t, prop) {
        let volatiles = t.#volatiles
        volatiles.forEach(vol => vol.emit(prop))
    }
    static queue(callee, prop) {
        let q = callee.#queued
        if (!q.size) callee.#method.call(window, () => {
                try {
                    let watchingProps = Watcher.getProps(callee)
                    let thing
                    if (watchingProps.size) thing = watchingProps.intersection(q)
                        else thing = q
                    thing.forEach(prop => {
                        Watcher.emitVolatiles(callee, prop)
                    })
                }
                finally {
                    q.clear()
                }
            })
        q.add(prop)
    }
    #queued = new Set
    #target
    #watchingProps
    #method
    constructor(obj, props, method) {
        super()
        this.#method = method
        this.#target = obj
        this.#watchingProps = new Set(props)
    }
}
function Observer(obj, props, method = queueMicrotask) {
    return new Proxy(new Watcher(obj, props, method), watchHandler)
}
// this was kinda fun to make :D
// (at 5:14am as of writing)
/*
let arr = new Observer([], ['length'])
let volatile = arr`This array has this many elements: ${'length'}`
volatile.save(document.body, 'textContent', true)
setInterval(() => {
    arr.push(1)
},200)
*/