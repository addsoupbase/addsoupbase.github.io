// most recent attempt (and hopefully the best!)
import Proxify, {css} from './HTMLProxy.js'
export {css}
export {Proxify}
import { base } from './BaseProxy.js'
const D = document
function isHTMLSyntax(string) {
    let trim = string.trim()
    return trim[0] === '<' && trim.at(-1) === '>'
}
const parse = Range.prototype.createContextualFragment.bind(new Range)
export function ce(htmlOrTag) {
    let elt
    if (isHTMLSyntax(htmlOrTag)) {
        elt = D.adoptNode(parse(htmlOrTag).firstElementChild)
    }
    else {
        let tag = htmlOrTag.match(Regex.tag)?.[0]
        elt = D.createElement(tag)
        elt.className = htmlOrTag.match(Regex.class)?.map(o=>o.substring(1)).join(' ') || ''
        let id = htmlOrTag.match(Regex.id)?.[0].substring(1) || ''
        if (id) elt.id = id
        console.assert(elt.matches(htmlOrTag))
    }
    console.assert(Element.prototype.isPrototypeOf(elt), `Output wasn't an element (${elt[Symbol.toStringTag]})`)
    return Proxify(elt)
}
const Regex = {
    tag: /[\w-]+/i,
    class: /\.([\w-]+)/g,
    id: /#([\w-]+)/,
    evtAttr: /^\(([_$^%&!?@#<>|]?\w+)\)$/,
}
export let body = document.body && Proxify(document.body)
export function esc(strings, ...subs) {
    let result = []
    , replace = new Map
    , toReplace = 0
    , embeds = false
    function handleSub(sub) {
        if (sub === Object(sub)) {
            embeds = true
            if (typeof sub === 'function') {
                let r = escapeHTML(sub.toString())
                replace.set(r, sub)
                return r
            }
            sub = base(sub)
            if (Node.prototype.isPrototypeOf(sub)) {
                let comment = `@Replace #${toReplace++}`
                // this bit is really helpful:
                // esc`<div><h1>${'Some <escaped> text'}</h1> ${esc`<button>Click me</button>`.on({click(){alert('hello!')}})}</div>`
                replace.set(comment, sub)
                return `<!--${comment}-->`
            }
        }
        return escapeHTML(String(sub))
    }
    for (let i = 0, n = strings.length, { length } = subs; i < n; ++i) {
        let sub = subs[i]
        result.push(`${strings[i]}${i < length ? handleSub(sub) : ''}`)
    }
    let out = ce(result.join(''))
    let node = base(out)
    let events = {}
    if (embeds) {
        // literally the only use of XPath
        let xpath = document.evaluate("//comment()[contains(., '@Replace #')]", base(out), null, 7, null)
            , o
            , i = 0
        while (o = xpath.snapshotItem(i++)) o.replaceWith(replace.get(o.textContent))
        let attr = node.getAttributeNames()
        for (let i = attr.length; i--;) {
            let a = attr[i]
            let match = a.match(Regex.evtAttr)
            if (match) {
                match = match[1]
                let func = node.getAttribute(a)
                node.removeAttribute(a)
                Object.defineProperty(events, match, {value: replace.get(func), enumerable:true})
            }
        }
    }
    return out.on(events)
}
export const id = new Proxy({ __proto__: null }, {
    // ownKeys() {
    //     return[].map.call(document.querySelectorAll('[id]'), Proxify)
    // },
    get(_, id) {
        return Proxify(document.getElementById(id))
    },
    deleteProperty(_, id) {
        document.getElementById(id)?.remove()
        return true
    },
    set() { }
})
export function div(strings, ...subs) {
    let n = esc(strings, ...subs)
    let a = ce('div')
    n.parent = a
    return a
}
export function sel(target) {
    return Proxify(target)
}
function escapeHTML(s) { (a ??= D.createElement('p')).textContent = s; return a.innerHTML } let a