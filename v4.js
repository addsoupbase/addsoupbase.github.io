// most recent attempt (and hopefully the best!)
import Proxify, { css } from './HTMLProxy.js'
export { css, Proxify }
import { base } from './BaseProxy.js'
const D = document
function isHTMLSyntax(string) {
    let trim = string.trim()
    return trim[0] === '<' && trim.at(-1) === '>'
}
function label(r) { return r[Symbol.toStringTag] }
var parse = (parse = new Range).createContextualFragment.bind(parse)
export function ce(htmlOrTag) {
    let elt
    if (isHTMLSyntax(htmlOrTag)) {
        elt = parse(htmlOrTag).firstElementChild
    }
    else {
        let tag = htmlOrTag.match(Regex.tag)?.[0]
        elt = D.createElement(tag)
        elt.className = htmlOrTag.match(Regex.class)?.map(o => o.substring(1)).join(' ') || ''
        let id = htmlOrTag.match(Regex.id)?.[0].substring(1) || ''
        if (id) elt.id = id
        //@dev console.assert(elt.matches(htmlOrTag))
    }
    //@dev console.assert(Element.prototype.isPrototypeOf(elt), `Output wasn't an element (${label(elt)})`)
    return Proxify(elt)
}
const Regex = {
    tag: /[\w-]+/i,
    class: /\.([\w-]+)/g,
    id: /#([\w-]+)/,
    evtAttr: /^\(([_$^%&!?@#<>|\w]+)\)$/,
    comment: /^@Replace #\d+$/
}
export let body = D.body && Proxify(D.body)
const nodeCache = new Map
function handleSub(sub, replace) {
    if (sub === Object(sub)) {
        if (typeof sub === 'function') {
            let r = sub.toString()
            replace.map.set(r, sub)
            return escapeHTML(r)
        }
        sub = base(sub)
        if (Node.prototype.isPrototypeOf(sub)) {
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
    const hasSubs = !!subs.length
    if (!hasSubs) {
        if (nodeCache.has(strings)) return Proxify(nodeCache.get(strings).cloneNode(true))
        let out = ce(strings.join(''))
        let node = base(out)
        nodeCache.set(strings, node.cloneNode(true))
        return out
    }
    let result = []
        , replace = { map: new Map, toReplace: 0 }
    for (let i = 0, n = strings.length, { length } = subs; i < n; ++i) {
        let sub = subs[i]
        result.push(`${strings[i]}${i < length ? handleSub(sub, replace) : ''}`)
    }
    let out = ce(result.join(''))
    let node = base(out)
    // conclusion: TreeWalker > XPath & NodeIterator
    let { map } = replace
    if (replace.toReplace) {
        let walker = D.createTreeWalker(base(out), 128, commentFilter)
        let o
        while (o = walker.nextNode()) o.replaceWith(map.get(o.textContent))
    }
    if (node.hasAttributes()) {
        let events = {}
        let attr = node.getAttributeNames()
        let config = { enumerable: true, writable: true, configurable: true }
        for (let i = attr.length; i--;) {
            let a = attr[i]
            let match = a.match(Regex.evtAttr)
            if (match) {
                let func = config.value = map.get(node.getAttribute(a))
                node.removeAttribute(a)
                if (typeof func !== 'function') throw TypeError(`Invalid event handler for ${match[1]}`)
                Object.defineProperty(events, match[1], config)
            }
        }
        out.on(events)
    }
    return out
}
export const esc = $
export default $
function commentFilter(e) {
    return Regex.comment.test(e.textContent) ? 1 : 3
}
export const id = new Proxy({ __proto__: null }, {
    // ownKeys() {
    //     return[].map.call(D.querySelectorAll('[id]'), Proxify)
    // },
    get(_, id) {
        let o = D.getElementById(id)
        if (o) return Proxify(o)
        throw ReferenceError(`Cannot find element #${String(id)}`)
    },
    deleteProperty(_, id) {
        D.getElementById(id)?.remove()
        return true
    },
})
export function div(strings, ...subs) {
    let n = esc(strings, ...subs)
    let a = ce('div')
    n.parent = a
    return a
}
export function sel(t) {
    if (Element.prototype.isPrototypeOf(t)) return Proxify(t)
    throw TypeError(`Target must be an element: ${label(t)}`)
}
function escapeHTML(s) { (a ??= D.createElement('p')).textContent = s; return a.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;') } let a

//@dev window.$ = esc