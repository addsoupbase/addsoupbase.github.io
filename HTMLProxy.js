import Proxify, { ProxyFactory, base, proxifySafe } from './BaseProxy.js'
import { EventTargetProxy, h } from './EventTargetProxy.js'
import './css.js'
export default Proxify
export const css = window[Symbol.for('[[CSSModule]]')]
const D = document
function tlc(o) {
    return `-${o.toLowerCase()}`
}
function toDash(prop) {
    return prop.startsWith('--') ? prop :
        prop.replace(azregex, tlc)
}
function frag(nodes) {
    let n = D.createDocumentFragment()
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
    replace(n) {
        this.parentNode.replaceChild(base(n), this)
    }
    *twSelectorAll(whatToShow = 2 ** 32 + 1, filter) {
        let t = D.createTreeWalker(this.valueOf(), whatToShow, filter),
            a
        while (a = t.nextNode()) yield a
    }
    xpath(xpath, resultType, nsResolver) {
        return D.evaluate(xpath, this, nsResolver, resultType)
    }
    xpathSelector(xpath, nsResolver) {
        return proxifySafe(Proxify(this).xpath(xpath, 9, nsResolver).singleNodeValue)
    }
    *xpathSelectorAll(xpath, nsResolver) {
        let n = this.xpath(xpath, 7, nsResolver), a
        for (let i = 0, x = n.snapshotLength; i < x; ++i) yield Proxify(n.snapshotItem(i))
    }
    static #observers = {
        r: null,
        // p: null,
        i: null,
        m: null,
    }
    to(other) {
        base(other).appendChild(this)
        return Proxify(this)
    }
    is(other) { return this.isEqualNode(other && base(other)) }
    setCanvasBg(id) {
        if (D.getCSSCanvasContext)
            // safari needs this to work
            // By the way this took HOURS to solve
            this.style.backgroundImage = `-webkit-canvas(${id})`
        this.dataset.v4UnreliableCanvasBackground = id
    }
    unobserve(type) {
        let observers = Node$.#observers
        type = type.toLowerCase()
        switch (true) {
            case /^r(?:esize(?:observer)?)?$/.test(type):
                type = 'resize'
                observers.r.unobserve(this)
                break
            case /^i(?:ntersection(?:observer)?)?$/.test(type):
                type = 'intersection'
                observers.i.unobserve(this)
                break
            case /^m(?:utation(?:observer)?)?$/.test(type):
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
            for (let i = changes.length; i--;) {
                let record = changes[i]
                record.target.dispatchEvent(new CustomEvent(type, {
                    detail: Proxify(record),
                    bubbles: true
                }))
            }
        }
    }
    /**
     * ### `event.targetNode` is the node that had something changed (won't always be the same as `this`).
     * The event bubbles too.
     */
    observe(type, settings, flags) {
        if (!settings.callback) throw Error(`'callback' property required`)
        let ob = Node$.#observers
        type = type.toLowerCase()
        switch (true) {
            default: throw Error(`Invalid observer type "${type}"`)
            case /^m(?:utation(?:observer)?)?$/.test(type):
                type = 'mutation'
                    ; (ob.m ??= new MutationObserver(Node$.#observerCallback(type)))
                        .observe(this, settings)
                break
            case /^i(?:ntersection(?:observer)?)?$/.test(type):
                type = 'intersection'
                    ; (ob.i ??= new IntersectionObserver(Node$.#observerCallback(type)))
                        .observe(this, settings)
                break
            case /^r(?:esize(?:observer)?)?$/.test(type):
                type = 'resize';
                (ob.r ??= new ResizeObserver(Node$.#observerCallback(type))).observe(this, settings)
                break
        }
        Proxify(this).on({ [`${flags || ''}v4:${type}`]: settings.callback })
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
    destroy() {
        return Proxify(this).purge(true)
    }
    purge(deep = true) {
        let me = Proxify(this)
        me.off(true)
        me.isConnected && me.remove()
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
        return proxifySafe(this.parentNode)
    }
    get clone() {
        return Proxify(this.cloneNode(true))
    }
    nat(index) {
        return proxifySafe([].at.call(this.childNodes, index))
    }
    unshiftNode(...nodes) {
        let a = frag(nodes.map(base))
        this.insertBefore(a, this.firstChild)
        return Proxify(this)
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
        return proxifySafe(this.lastChild)
    }
    set lastNode(val) {
        this.appendChild(base(val))
    }
    get firstNode() {
        return proxifySafe(this.firstChild)
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
            let l = this.children
            for (let i = l.length; i--;) Proxify(l[i]).purge(true)
        }
        else return frag(this.childNodes)
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
        return proxifySafe(this.previousSibling)
    }
    set prevNode(val) {
        let parent = this.parentNode
        if (!parent) throw TypeError('Cannot set prevNode on orphan')
        parent.insertBefore(base(val), this)
    }
    get nextNode() {
        return proxifySafe(this.nextSibling)
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
        this.#queueReset()
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
    static #ran = false
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
        if (!StyleCache.#ran) {
            StyleCache.#ran = true
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
export class Element$ extends NodeProxy {
    static AnimationCache = new Map;
    *[Symbol.iterator]() {
        let k = this.children
        for (let i = 0, l = k.length; i < l; ++i) yield Proxify(k[i])
    }
    eltIndexOf(elt) {
        return [].indexOf.call(this.children, base(elt))
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
        return proxifySafe(this.lastElementChild)
    }
    set last(n) {
        this.appendChild(base(n))
    }
    at(index) {
        return proxifySafe([].at.call(this.children, index))
    }
    eltAt(o) { return Proxify(this).at(o) }
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
                , t = thing.cssRules
            for (let i = t.length; i--;) {
                let { style } = t[i]
                    , a = {}
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
class AbstractElement extends ElementProxy {
    #style = null
    #calc = null
    #savedDisplay = ''
    // it needs to exist because idk why but these properties aren't on Element()
    // SVGElement() and HTMLElement() do a separate implementation of the same properties
    // so something like Reflect.get(SVGElement.prototype, 'style', document.body) throws
    // why? i have no idea!
    constructor(n) {
        if (new.target === AbstractElement) throw TypeError(`Abstract class can't be constructed`)
        super(n)
    }
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
class SVGElement$ extends AbstractElement {
    get ownerSVG() {
        return proxifySafe(this.ownerSVGElement)
    }
    get viewportSVG() {
        return proxifySafe(this.viewportElement)
    }
}
class HTMLElement$ extends AbstractElement { }
const HTMLElementProxy = new ProxyFactory(HTMLElement$)
{
    let p = 'innerHTML outerHTML innerText outerText textContent'.split(' ')
    for (let i = p.length; i--;) {
        let key = p[i]
        Object.defineProperty(HTMLElement$.prototype, key, {
            get() {
                return this[key]
            },
            set(val) {
                if (this.childElementCount) throw TypeError(`Cannot set ${key} since ${this.tagName} element has child elements. Use insertAdjacentText/insertAdjacentHTML instead`)
                this[key] = val
            }
        })
    }
}
new ProxyFactory(SVGElement$)
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
        return Proxify.GetWrapper(this).#targetNode ??= proxifySafe(this.target)
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
        return Proxify.GetWrapper(this).#nextSibling ??= proxifySafe(this.nextSibling)
    }
    #previousSibling = null
    get previousSibling() {
        return Proxify.GetWrapper(this).#previousSibling ??= proxifySafe(this.previousSibling)
    }
})
new ProxyFactory(class ResizeObserverEntry$ extends RecordOrEntry {
    get width() {
        return this.contentRect?.width ?? this.contentBoxSize[0].inlineSize
    }
    get height() {
        return this.contentRect?.height ?? this.contentBoxSize[0].blockSize
    }
})
new ProxyFactory(class IntersectionObserverEntry$ extends RecordOrEntry { })