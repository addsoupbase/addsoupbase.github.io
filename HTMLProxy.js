import Proxify, { ProxyFactory, base } from './BaseProxy.js'
import { EventTargetProxy, h } from './EventTargetProxy.js'
import './css.js'
export default Proxify
export const css = window[Symbol.for('[[CSSModule]]')]
const D = document
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
function frag(nodes) {
    let n = document.createDocumentFragment()
    nodes = [].slice.call(nodes)
    for (let i = 0, l = nodes.length; i < l; ++i)
        n.appendChild(nodes[i])
    return n
}
let dash = /-./g,
    azregex = /[A-Z]/g
class Node$ extends EventTargetProxy {
    *[Symbol.iterator]() {
        let n = this.childNodes
        for (let i = 0, l = n.length; i < l; ++i) yield Proxify(n[i])
    }
    static #observers = {
        r: null,
        // p: null,
        i: null,
        m: null,
    }
    unobserve(type) {
        let observers = Node$.#observers
        switch (type.toLowerCase()) {
            case 'resize':
            case 'resizeobserver':
            case 'r':
                type = 'resize'
                observers.r.unobserve(me)
                break
            case 'intersection':
            case 'intersectionobserver':
            case 'i':
                type = 'intersection'
                observers.i.unobserve(me)
                break
            case 'mutation':
            case 'mutationobserver':
            case 'm':
                type = 'mutation'
                break
            default: throw Error(`Invalid observer type "${type}"`)
        }
        Proxify(this).off(`v4:${type}`)
    }
    static #observerCallback(type) {
        type = `v4:${type}`
        return Callback
        function Callback(changes) {
            for (let i = changes.length; i--;)
                changes[i].target.dispatchEvent(new CustomEvent(type, {
                    detail: Proxify(record),
                    bubbles: true
                }))
        }
    }
    /**
     * ### `event.targetNode` is the node that had something changed (won't always be the same as `this`).
     * The event bubbles too.
     */
    observe(type, settings, flags) {
        if (!settings.callback) throw Error(`'callback' property required`)
        let ob = Node$.#observers
        switch (type.toLowerCase()) {
            default: throw Error(`Invalid observer type "${type}"`)
            case 'mutation':
            case 'mutationobserver':
            case 'm': {
                type = 'mutation'
                ob.m ??= new MutationObserver(Node$.#observerCallback(type))
                ob.m.observe(this, settings)
            }
                break
            case 'intersection':
            case 'intersectionobserver':
            case 'i': {
                type = 'intersection'
                ob.i ??= new IntersectionObserver(Node$.#observerCallback(type))
                ob.i.observe(this, settings)
            }
                break
            case 'resize':
            case 'resizeobserver':
            case 'r': {
                type = 'resize'
                ob.i ??= new ResizeObserver(Node$.#observerCallback(type))
                ob.i.observe(this, settings)
            }
                break
        }
        Proxify(this).on({ [`${flags || ''}v4:${type}`]: settings.callback })
    }
    adopt(frag) {
        this.appendChild(base(frag))
        return Proxify(this)
    }
    import(frag) {
        frag = base(frag)
        this.appendChild(frag.cloneNode(true))
        return Proxify(frag)
    }
    delegate(events, filter, includeSelf, controller) {
        events = { ...events }
        for (let i in events) {
            let old = events[i]
            events[i] = Wrapped
            function Wrapped(e, off, abort) {
                let me = Proxify(this)
                e = Proxify(e)
                return abort ? old.call(me, e, off, abort) :
                    off ? old.call(me, e, off) :
                        old.call(me, e)
            }
        }
        return Proxify(h.delegate(this, events, filter, includeSelf, controller))
    }
    purge(deep = true) {
        let me = Proxify(this)
        me.off(true)
        me.remove()
        me.empty(deep)
        Proxify.Destroy(me)
        return null
    }
    kill() {
        return this.purge()
    }
    set parent(node) {
        base(node).appendChild(this)
    }
    get parent() {
        let a = this.parentNode
        return a && Proxify(a)
    }
    get clone() {
        return Proxify(this.cloneNode(true))
    }
    nodeAt(index) {
        let n = [].at.call(this.childNodes, index)
        return n ? Proxify(n) : null
    }
    pushNode(...nodes) {
        let a = frag(nodes.map(base))
        this.appendChild(a)
        return Proxify(this)
    }
    removeNode() {
        this.remove ? this.remove() : this.parentNode?.removeChild(this)
    }
    nodeIndexOf(node) {
        return [].indexOf.call(this.childNodes, base(node))
    }
    get lastNode() {
        let c = this.lastChild
        return c && Proxify(c)
    }
    set lastNode(val) {
        this.appendChild(base(val))
    }
    get firstNode() {
        let c = this.firstChild
        return c && Proxify(c)
    }
    set firstNode(node) {
        let l = this.firstChild
        l ? this.insertBefore(base(node), l) : this.appendChild(base(node))
    }
    get nodes() {
        return [].map.call(this.childNodes, Proxify)
    }
    destroyChildren() {
        return Proxify(this).empty(true)
    }
    empty(kill) {
        if (kill) {
            let l
            while (l = this.lastElementChild) Proxify(l).purge(true)
        }
        else {
            let n = frag(this.childNodes)
            return n
        }
        return Proxify(this)
    }
    /*set nodes(childs) {
        let me = this
        if (me.replaceChildren)
            return me.replaceChildren(...childs)
        let children = me.childNodes
        for (let i = children.length; i--;)
            me.removeChild(base(children[i]))
        if (childs !== void 0) for (let i = 0, len = childs.length; i < len; ++i)
            me.appendChild(base(childs[i]))
    }*/
    get prevNode() {
        let n = this.previousSibling
        return n && Proxify(n)
    }
    set prevNode(val) {
        let parent = this.parentNode
        if (!parent) throw TypeError('Cannot set prevNode on orphan')
        parent.insertBefore(base(val), this)
    }
    get nextNode() {
        let n = this.nextSibling
        return n && Proxify(n)
    }
    set nextNode(val) {
        let parent = this.parentNode
        if (!parent) throw TypeError('Cannot set nextNode on orphan')
        let next = this.nextSibling
        val = base(val)
        next ? parent.insertBefore(val, next) : parent.appendChild(val)
    }
}
const NodeProxy = new ProxyFactory(Node$)
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
    let all = [
        "offsetLeft",
        "offsetTop",
        "offsetWidth",
        "offsetHeight",
        "offsetParent",
        "clientLeft",
        "clientTop",
        "clientWidth",
        "clientHeight",
        "scrollWidth",
        "scrollHeight",
        "scrollTop",
        "scrollLeft"
    ]
    for (let i = all.length; i--;) Cacher.define(ReflowCache, all[i])
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
            , str = ''
        for (let key in c) {
            let val = c[key]
            str += `${toDash(key)}:${val};`
        }
        this[Cacher.Target].cssText += str
    }
}
class Element$ extends NodeProxy {
    static AnimationCache = new Map;
    *[Symbol.iterator]() {
        let k = this.children
        for (let i = 0, l = k.length; i < l; ++i) yield Proxify(k[i])
    }
    getComputedStyle() { return getComputedStyle(this) }
    setParent(node) {
        let n = Proxify(this)
        n.parent = node
        return n
    }
    // with(...nodes) {
    //     P(this).pushNode(...nodes)
    //     return P(nodes[0])
    // }
    get last() {
        let o = this.lastElementChild
        return o && Proxify(o)
    }
    set last(n) {
        this.appendChild(base(n))
    }
    eltAt(index) {
        let n = [].at.call(this.children, index)
        return n ? Proxify(n) : null
    }
    animFrom(animationName, { duration = 1000, delay = 0, direction = duration > 0 ? 'normal' : 'reverse',
        iterations = 1 / 0, fill = 'forwards',
        composite = 'accumulate',
        easing = 'ease' } = {}) {
        let frames = Element$.AnimationCache.get(animationName)
        if (!frames) {
            let thing
            dance: {
                let rules = D.styleSheets
                for (let i = rules.length; i--;) {
                    let b = rules[i].cssRules
                    for (let ii = b.length; ii--;) {
                        let a = b[ii]
                        if (a.type === 7 && a.name === animationName) {
                            thing = a
                            break dance
                        }
                    }
                }
                throw TypeError(`Animation not found: ${animationName}`)
            }
            let fr = []
            let t = thing.cssRules
            for (let i = t.length; i--;) {
                let { style } = t[i]
                let a = {}
                for (let ii = style.length; ii--;) {
                    let prop = style[ii]
                    a[prop] = style[prop]
                }
                fr.push(a)
            }
            Element$.AnimationCache.set(animationName, frames = fr.reverse())
        }
        let n = new Animation(new KeyframeEffect(this, frames, {
            duration: Math.abs(duration),
            iterations,
            fill,
            delay,
            easing,
            composite,
            direction
        }))
        n.play()
        return n
    }
    fadeOut(duration = 500, { keepSpace, easing = 'ease' } = {}) {
        // idk if 'filter: opacity()' or 'opacity' is better for animating, we can see i guess
        let n = this.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration,
            iterations: 1,
            easing,
            composite: 'replace',
            fill: 'forwards'
        })
        n.finished.then(() => {
            this.style[keepSpace ? 'visibility' : 'display'] = keepSpace ? 'hidden' : 'none'
        })
        return n
    }
    fadeIn(duration = 500, { easing = 'ease' } = {}) {
        let me = this.style
        me.visibility = me.display = ''
        return this.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration,
            iterations: 1,
            easing,
            composite: 'replace',
            fill: 'forwards'
        })
    }
}
const ElementProxy = new ProxyFactory(Element$)
{
    let p = 'innerHTML outerHTML innerText outerText textContent'.split(' ')
    for (let i = p.length; i--;) {
        let key = p[i]
        Object.defineProperty(Element$.prototype, key, {
            get() {
                return this[key]
            },
            set(val) {
                if (this.childElementCount) throw TypeError(`Cannot set ${key} since <${this.tagName.toLowerCase()}> has child elements. Use insertAdjacentText/insertAdjacentHTML instead`)
                this[key] = val
            }
        })
    }
}
class HTMLElement$ extends ElementProxy {
    #style = null
    #calc = null
    #savedDisplay = ''
    hide() {
        let { style } = this
        let display = style.display
        if (display === 'none') display = ''
        Proxify.GetWrapper(this).#savedDisplay = display
        style.display = 'none'
    }
    show() {
        this.style.display = Proxify.GetWrapper(this).#savedDisplay
    }
    get calc() {
        return Proxify.GetWrapper(this).#style ||= new ReflowCache(this)
    }
    get styles() {
        return Proxify.GetWrapper(this).#style ||= new StyleCache(this.style)
    }
    setStyle(o) {
        return Object.assign(Proxify(this).styles, o)
    }
}
const HTMLElementProxy = new ProxyFactory(HTMLElement$)
class MouseEvent$ {
    #layerX = null
    #layerY = null
    #offsetX = null
    #offsetY = null
    get layerX() { return Proxify.GetWrapper(this).#layerX ??= this.layerX }
    get layerY() { return Proxify.GetWrapper(this).#layerY ??= this.layerY }
    get offsetX() { return Proxify.GetWrapper(this).#offsetX ??= this.offsetX }
    get offsetY() { return Proxify.GetWrapper(this).#offsetY ??= this.offsetY }
} new ProxyFactory(MouseEvent$)
class RecordOrEntry {
    #targetNode = null
    get targetNode() {
        return Proxify.GetWrapper(this).#targetNode ??= this.target && Proxify(this.target)
    }
    get entryType() {
        return this.type
    }
}
new ProxyFactory(class MutationRecord$ extends RecordOrEntry {
    #removedNodes = null
    get removedNodes() {
        return Proxify.GetWrapper(this).#removedNodes ??= this.removedNodes && [].slice.call(this.removedNodes)
    }
    #addedNodes = null
    get addedNodes() {
        return Proxify.GetWrapper(this).#addedNodes ??= this.addedNodes && [].slice.call(this.addedNodes)
    }
    #nextSibling = null
    get nextSibling() {
        return Proxify.GetWrapper(this).#nextSibling ??= this.nextSibling && Proxify(this.nextSibling)
    }
    #previousSibling = null
    get previousSibling() {
        return Proxify.GetWrapper(this).#previousSibling ??= this.previousSibling && Proxify(this.previousSibling)
    }
})
new ProxyFactory(class ResizeObserverEntry$ extends RecordOrEntry { })
new ProxyFactory(class IntersectionObserverEntry$ extends RecordOrEntry { })