import P, { ProxyFactory, base, WrapperItself } from './BaseProxy.js'
export default P
import { EventTargetProxy } from './EventTargetProxy.js'
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
class Node$ extends EventTargetProxy {
    *[Symbol.iterator]() {
        let n = this.childNodes
        for (let i = 0, l = n.length; i < l; ++i) yield P(n[i])
    }
    nodeAt(index) {
        let n = [].at.call(this.childNodes, index)
        return n ? P(n) : null
    }
    pushNode(...nodes) {
        for (let i = 0, l = nodes.length; i < l; ++i) this.appendChild(base(nodes[i]))
    }
    removeNode() {
        this.remove ? this.remove() : this.parentNode?.removeChild(this)
    }
    nodeIndexOf(node) {
        return [].indexOf.call(this.childNodes, base(node))
    }
    /*splice(start, count, ...items) {
        let o = P(this).slice(start, count)
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
        return c && P(c)
    }
    set lastNode(val) {
        this.appendChild(base(val))
    }
    get firstNode() {
        let c = this.firstChild
        return c && P(c)
    }
    set firstNode(node) {
        let l = this.firstChild
        l ? this.insertBefore(base(node), l) : this.appendChild(base(node))
    }
    get nodes() {
        return [].map.call(this.childNodes, P)
    }
    set nodes(childs) {
        let me = this
        if (me.replaceChildren) {
            return me.replaceChildren(...childs)
        }
        let children = me.childNodes
        for (let i = children.length; i--;)
            me.removeChild(children[i])
        if (childs !== void 0) for (let i = 0, len = childs.length; i < len; ++i)
            me.appendChild(childs[i])
    }
    get prevNode() {
        let n = this.previousSibling
        return n && P(n)
    }
    set prevNode(val) {
        if (!parent) throw TypeError(`Cannot set prev on orphan`)
        let parent = this.parentNode
        parent.insertBefore(base(val), this)
    }
    get nextNode() {
        let n = this.nextSibling
        return n && P(n)
    }
    set nextNode(val) {
        let parent = this.parentNode
        if (!parent) throw TypeError(`Cannot set next on orphan`)
        let next = this.nextSibling
        next ? parent.insertBefore(base(val), next) : parent.appendChild(base(val))
    }
}
export const NodeProxy = new ProxyFactory(Node$)
class Cacher {
    // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    static Target = Symbol('[[Target]]')
    $cache = { __proto__: null }
    constructor(target) {
        this[Cacher.Target] = target
    }
    #queued = false
    #queueReset() {
        if (!this.#queued) {
            this.#queued = true
            requestAnimationFrame(() => {
                debugger
                try {
                    this.$finish()
                }
                finally {
                    this.$cache = { __proto__: null }
                    this.#queued = false
                }
            })
        }
    }
    $getPropertyCache(key) {
        let cache = this.$cache
        if (key in cache) return cache[key]
        let value = this[Cacher.Target][key]
        Object.defineProperty(cache, key, {
            value,
            writable: true,
            configurable: true
        })
        return value
    }
    $setPropertyCache(key, value) {
        Object.defineProperty(this.$cache, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        })
        this.#queueReset()
    }
    static define(cl, key) {
        Object.defineProperty(cl.prototype, key, {
            get() {
                return this.$getPropertyCache(key)
            },
            set(val) {
                this.$setPropertyCache(key, val)
            }
        })
    }
}
class ReflowCache extends Cacher {
    $setPropertyCache(key, value) {
        super.$setPropertyCache(key, parseFloat(value))
    }
    $finish() {
        let target = this[Cacher.Target]
        let cache = this.$cache
        for (let i in cache) target[i] = cache[i]
    }
}
{
    let all = 'offsetLeft offsetTop offsetWidth offsetHeight offsetParent clientLeft clientTop clientWidth clientHeight scrollWidth scrollHeight scrollTop scrollLeft'.split(' ')
    for (let i = all.length; i--;) {
        let key = all[i]
        Cacher.define(ReflowCache, key)
    }
}
class StyleCache extends Cacher {
    static ran = false
    /*$setPropertyCache(key, value) {
        try {value = CSSStyleValue.parse(key, value)}
        catch{}
        super.$setPropertyCache(key,value)
    }*/
    /*$getPropertyCache(key) {
        let val = super.$getPropertyCache(key)
        try {
            return CSSStyleValue.parse(key, val)
        }
        catch {
            return val
        }
    }*/
    constructor(t) {
        super(t)
        if (!StyleCache.ran) {
            StyleCache.ran = true
            let keys = Object.keys(this[Cacher.Target])
            for (let i = keys.length; i--;)
                Cacher.define(StyleCache, keys[i])
        }
    }
    $finish() {
        let c = this.$cache
        let str = ''
        for (let key in c) {
            let val = c[key]
            str += `${toDash(key)}:${val};`
        }
        this[Cacher.Target].cssText = str
    }
}
class Element$ extends NodeProxy {
    *[Symbol.iterator]() {
        let k = this.children
        for (let i = 0, l = k.length; i < l; ++i) yield P(k[i])
    }
    get last() {
        let o = this.lastElementChild
        return o && P(o)
    }
    set last(n) {
        this.appendChild(base(n))
    }
    eltAt(index) {
        let n = [].at.call(this.children, index)
        return n ? P(n) : null
    }
    fadeOut(duration = 500, { keepSpace, easing = 'ease' } = {}) {
        // idk if 'filter: opacity()' or 'opacity' is better for animating, we can see i guess
        let n = this.animate([{ filter: 'opacity(100%)' }, { filter: 'opacity(0%)' }], {
            duration,
            iterations: 1,
            easing,
            composite: 'replace',
            fill: 'forwards'
        })
        n.finished.then(() => {
            P(this).styles[keepSpace ? 'visibility' : 'display'] = keepSpace ? 'hidden' : 'none'
        })
        return n
    }
    fadeIn(duration = 500, { easing } = {}) {
        let me = P(this).styles
        me.visibility = me.display = ''
        return this.animate([{ filter: 'opacity(0%)' }, { filter: 'opacity(100%)' }], {
            duration,
            iterations: 1,
            easing,
            composite: 'replace',
            fill: 'forwards'
        })
    }
}
let ElementProxy = new ProxyFactory(Element$)
class HTMLElement$ extends ElementProxy {
    #style = null
    #calc = null
    get calc() {
        super.#calc
        return P.GetWrapper(this).#style ||= new ReflowCache(this)
    }
    get styles() {
        return P.GetWrapper(this).#style ||= new StyleCache(this.style)
    }
}
export const HTMLElementProxy = new ProxyFactory(HTMLElement$)
class MouseEvent$ {
    #layerX = null
    #layerY = null
    #offsetX = null
    #offsetY = null
    get layerX() { return P.GetWrapper(this).#layerX ??= this.layerX }
    get layerY() { return P.GetWrapper(this).#layerY ??= this.layerY }
    get offsetX() { return P.GetWrapper(this).#offsetX ??= this.offsetX }
    get offsetY() { return P.GetWrapper(this).#offsetY ??= this.offsetY }
}
new ProxyFactory(MouseEvent$)