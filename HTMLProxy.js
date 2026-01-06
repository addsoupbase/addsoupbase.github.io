import { ProxyFactory, proxify, base, WrapperItself } from './BaseProxy.js'
export default proxify
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
class NodeProxyClass extends EventTargetProxy {
    nodeAt(index) {
        let n = [].at.call(this.childNodes, index)
        return n ? proxify(n) : null
    }
    remove() {
        this.remove ? this.remove() : this.parentNode?.removeChild(this)
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
export const NodeProxy = new ProxyFactory(NodeProxyClass, Node)
class Cacher {
    static Target = Symbol('[[CSSStyleDeclarationTarget]]')
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
                this.$finish()
                this.$cache = { __proto__: null }
                this.#queued = false
            })
        }
    }
    $transform(key) { return String(key) }
    $getPropertyCache(key) {
        key = this.$transform(key)
        let cache = this.$cache
        if (key in cache) {
            return cache[key]
        }
        let value = this[Cacher.Target][key]
        Object.defineProperty(cache, key, {
            value,
            writable: true,
            configurable: true
        })
        return value
    }
    $setPropertyCache(key, val) {
        key = this.$transform(key)
        this.$cache[key] = val
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
    $finish() {
        let target = this[Cacher.Target]
        let cache = this.$cache
        for (let i in cache) {
            target[i] = +cache[i]
        }
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
    $transform(key) { return toDash(key) }
    constructor(t) {
        super(t)
        if (!StyleCache.ran) {
            StyleCache.ran = true
            let keys = Object.keys(this[Cacher.Target])
            for (let i = keys.length; i--;) {
                Cacher.define(StyleCache, keys[i])
            }
        }
    }
    $finish() {
        let c = this.$cache
        let str = ''
        for (let key in c) {
            let val = c[key]
            str += `${key}:${val}`
        }
        this[Cacher.Target].cssText = str
    }
}
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
let ElementProxy = new ProxyFactory(ElementProxyClass, Element)
class HTMLElementProxyClass extends ElementProxy {
    #style = null
    #calc = null
    get calc() {
        return proxify(this)[WrapperItself].#style ||= new ReflowCache(this)
    }
    get styles() {
        return proxify(this)[WrapperItself].#style ||= new StyleCache(this.style)
    }
}
export const HTMLElementProxy = new ProxyFactory(HTMLElementProxyClass, HTMLElement)

/*class MouseEventProxyClass {

}
class MouseEventHandler extends Cacher {

}
{
    let props = 'layerX layerY offsetX offsetY'.split(' ')
    for (let i = props.length; i--;) {
        Cacher.define(MouseEventHandler, props[i])
    }
}
new ProxyFactory(MouseEventProxyClass, MouseEvent, new MouseEventHandler)
console.log(proxify(new MouseEvent({})))*/