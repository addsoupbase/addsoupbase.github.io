import { ProxyProtoGenerator, $, proxify, raw, Handler } from './BaseProxy.js'
import { EventTargetProxy } from './EventTargetProxy.js'
// function clamp(value, min, max) {
//     return Math.max(Math.min(value, max), min)
// }
const hasOwn = Object.hasOwn
    , isEnumerable = Object.call.bind(propertyIsEnumerable)
function tlc(o) {
    return '-' + o.toLowerCase()
}
function tuc(c) {
    return c[1].toUpperCase()
}
function toCaps(prop) {
    return prop.includes('-') && prop.startsWith('--') ? prop : (prop[0] === '-' ? prop.substring(1) : prop).replace(dash, tuc)
}
function toDash(prop) {
    return prop.startsWith('--') ? prop :
        prop.replace(azregex, tlc)
}
let dash = /-./g,
    azregex = /[A-Z]/g
class NodeProxyClass extends EventTargetProxy {
    nodeAt(index) {
        let n = [].at.call(this.childNodes, index)
        return n ? proxify(n) : null
    }
    remove() {
        this.parentNode?.removeChild(this)
    }
    nodeIndexOf(node) {
        return [].indexOf.call(this.childNodes, base(node))
    }
    /*splice(start, count, ...items) {
        let o = proxify(this).slice(start, count)
    },
    slice(start, end) {
        start = +clamp(start, 0, this.childNodes.length - 1) | 0
        end = +clamp(end, 0, this.childNodes.length - 1) | 0
        let o = document.createRange()
        o.setStart(this.childNodes[start], 0)
        o.setEnd(this.childNodes[end], 0)
        return o
    },*/
    get lastNode() {
        let c = this.lastChild
        return c && proxify(c)
    }
    set lastNode(val) {
        this.appendChild(base(val))
    }
    get firstNode() {
        let c = this.firstChild
        return c && proxify(c)
    }
    set firstNode(node) {
        let l = this.firstChild
        l ? this.insertBefore(base(node), l) : this.appendChild(base(node))
    }
    get nodes() {
        return [].map.call(this.childNodes, proxify)
    }
    set nodes(childs) {
        let me = this
        let children = me.childNodes
        for (let i = children.length; i--;) {
            me.removeChild(children[i])
        }
        if (childs !== void 0) for (let i = 0, len = childs.length; i < len; ++i) {
            me.appendChild(childs[i])
        }
    }
    get prev() {
        let node = this.previousSibling
        return node === null ? null : proxify(node)
    }
    set prev(val) {
        let me = this
        let parent = me.parentNode
        if (parent === null) throw TypeError(`Cannot set siblings on an orphan`)
        parent.before(base(val))
    }
}
const base = raw
const NodeProxy = new ProxyProtoGenerator(NodeProxyClass, Node)
export default NodeProxy
class CachePropertyHandler extends Handler {
    #queued = false
    format(p) { return p }
    setFinalValue(vals, t) {
        for (let key in vals) t[key] = vals[key]
    }
    #reset(t) {
        this.#queued = false
        let me = this.target ?? t[$]
        let keys = Object.getOwnPropertyNames(t)
        let toSet = { __proto__: null }
        for (let i = keys.length; i--;) {
            let key = keys[i]
            if (isEnumerable(t, key)) toSet[key] = t[key]
            delete t[key]
        }
        this.setFinalValue(toSet, me)
    }
    queueReset(t) {
        if (this.#queued) return
        this.#queued = true
        requestAnimationFrame(() => {
            this.#reset(t)
        })
    }
    set(t, p, value, r) {
        let allowed = this.constructor.allowedProperties
        if (allowed && !allowed.has(p)) return false
        p = this.format(p)
        if (!isEnumerable(t, p)) {
            Object.defineProperty(t, p, { value, configurable: true, enumerable: true })
            this.queueReset(t)
        }
        return true
    }
    get(t, p, r) {
        let allowed = this.constructor.allowedProperties
        if (allowed && !allowed.has(p)) return false
        p = this.format(p)
        if (hasOwn(t, p)) {
            return t[p]
        }
        let value = super.get(t, p, r)
        Object.defineProperty(t, p, { value, configurable: true })
        this.queueReset(t)
        return value
    }
}
class ReflowCache extends CachePropertyHandler {
    static allowedProperties = new Set('offsetLeft offsetTop offsetWidth offsetHeight offsetParent clientLeft clientTop clientWidth clientHeight scrollWidth scrollHeight scrollTop scrollLeft'.split(' '))
    #target
    get target() {
        return this.#target
    }
    constructor(targ) {
        super()
        this.#target = targ
    }
    static {
        let proto = this.prototype
        this.allowedProperties.forEach(o => {
            Object.defineProperty(proto, o, {
                get() {
                    return this.get(base(this.#target), o)
                },
                set(val) {
                    this.set(base(this.#target), o, val)
                }
            })
        })
    }
}
class HTMLElementReflowAvoiderProxyClass{}
//const HTMLElementReflowAvoiderProxy = 
new ProxyProtoGenerator(HTMLElementReflowAvoiderProxyClass, HTMLElementReflowAvoiderProxyClass, {
    handler: new ReflowCache,
})
class CSSStyleDeclarationHandler extends CachePropertyHandler {
    format(p) {
        return toDash(p)
    }
    setFinalValue(vals, t) {
        let str = ''
        for (let key in vals)
            str += `${key}:${vals[key]}`
        t.cssText = str
    }
    set(t, p, v, r) {
        let b = t[$]
        if (!hasOwn(b, p)) return !(p in b) || Reflect.set(b, p, v, r) // don't throw if css prop is unsupported
        return super.set(t, p, v, r)
    }
    get(t, p, r) {
        let b = t[$]
        if (!hasOwn(b, p)) return b[p]
        return super.get(t, p, r)
    }
}
const CSSStyleDeclarationProxy = new ProxyProtoGenerator(CSSStyleDeclarationHandler, CSSStyleDeclaration, {
    handler: new CSSStyleDeclarationHandler
})
class ElementProxyClass extends NodeProxy {
    fadeOut(duration = 500, { keepSpace, easing = 'ease' } = {}) {
        let n = this.animate([, { opacity: 0 }], {
            duration,
            iterations: 1,
            easing,
            fill: 'forwards'
        })
        n.finished.then(() => {
            proxify(this).styles[keepSpace ? 'visibility' : 'display'] = keepSpace ? 'hidden' : 'none'
        })
        return n
    }
    fadeIn(duration = 500, { easing } = {}) {
        debugger
        let me = proxify(this).styles
        me.visibility = me.display = ''
        return this.animate([{ opacity: me.opacity || '' }, { opacity: 1 }], {
            duration,
            iterations: 1,
            easing,
            fill: 'forwards'
        })
    }
}
let ElementProxy = new ProxyProtoGenerator(ElementProxyClass, Element)
class HTMLElementProxyClass extends ElementProxy {
    get calc() {
        let out = new ReflowCache(this)
        Object.defineProperty(this, 'calc', { value: out })
        return out
    }
    get styles() {
        return proxify(this.style)
    }
}
const _HTMLElement = new ProxyProtoGenerator(HTMLElementProxyClass, HTMLElement)