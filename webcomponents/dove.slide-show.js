// VERY IMPORTANT:
// do NOT use the `zoom` or `scale` css property
// it behaves strangely
const supportsMod = CSS.supports('width', 'mod(1px,1px)')
export const SlideShow = function (_) {
    if (_) return _
    /*const subPixel = matchMedia(`(resolution: 0.3125dppx)  or (resolution: 0.9375dppx) or (resolution: 1.5625dppx) or (resolution: 2.1875dppx) or (resolution: 1.1320754716981132dppx) or (resolution: 1.3636363636363635dppx) or (resolution: 2.142857142857143dppx)`)
    subPixel.addEventListener('change', change)
    function change(n) {
        d.dispatchEvent(new CustomEvent('subpixelrenderingchange', {
            detail: {
                isSubPixelRendering: n.matches,
                suggestedZoom: suggestedZooms[devicePixelRatio] || 1
            }
        }))
    }*/
    function addToObserve(n) {
        observer.observe(n)
    }
    let lazies = new Map
    let lives = new Map
    {
        function c(n) {
            for (let i = n.length; i--;) {
                let entry = n[i]
                if (entry.intersectionRatio)
                    SlideShow.finishLazyLoad(entry.target.src)
            }
        }
        var observer = new IntersectionObserver(c)
    }
    class SlideShow extends HTMLElement {
        static #safariID = 0
        static observedAttributes = 'values src dur index repeat imagesmoothing'.split(' ')
        get imageSmoothing() {
            let n = this.#ctx
            return n.imageSmoothingEnabled ? n.imageSmoothingQuality : 'none'
        }
        set imageSmoothing(v) { this.setAttribute('imagesmoothing', v) }
        get opaque() {
            return this.hasAttribute('opaque')
        }
        reverse() {
            this.#anim.setAttribute('values', mapValues(this.values.reverse()))
        }
        static isLoaded(...srces) {
            return srces.every(o => datas.has(new URL(o, location)))
        }
        static #lazyLoad(s, type) {
            function a(resolve) {
                switch (type) {
                    default:
                        lazies.set(s, resolve)
                        break
                    case 'live':
                        lives.set(s, resolve)
                }
            }
            switch (type) {
                case 'lazy':
                    d.querySelectorAll(`slide-show[src="${CSS.escape(s)}"]`).forEach(addToObserve)
            }
            let out = new Promise(a)
            return out
        }
        static preload(...sources) {
            let out = []
            for (let { loading, padLeft = 0, padTop = 0, framesX = 1, framesY = 1, src, duras, image, reversed, crop = true } of sources) {
                if (typeof duras === 'string') duras = duras.split(sep).filter(Boolean).map(map)
                let url = new URL(src, d.baseURI)
                let s = url.toString()
                if (image) {
                    function a() {
                        load(image, image.width / framesX, image.height / framesY, true)
                    }
                    image.decode ? image.decode().then(a) : a()
                    continue
                }
                let img = new Image
                switch (loading) {
                    case 'lazy':
                        SlideShow.#lazyLoad(s).then(go)
                        break
                    case 'live':
                        SlideShow.#lazyLoad(s, 'live').then(go)
                        break
                    default: go()
                }
                function go() {
                    img.setAttribute('fetchpriority', 'high')
                    img.decoding = 'sync'
                    img.src = src
                    if (url.origin !== origin)
                        img.crossOrigin = 'anonymous'
                }
                async function load(o, width, height, isSpecial) {
                    let vals = []
                    if (typeof duras?.[0]?.length === 'number')
                        for (let i = 0, v = duras.length; i < v; ++i)
                            for (let { 0: frame, 1: dura } = duras[i]; dura--;)
                                vals.push(`${width * -frame}`)
                    else for (let i = 0, repeats = duras && duras.length === framesX ? duras : Array(framesX).fill(1); i < framesX; ++i)
                        for (let r = repeats[i]; r--;)
                            vals.push(`${-i * width}`)
                    reversed && vals.reverse()
                    let out = {
                        src: url,
                        bitmap: o,
                        framesX,
                        framesY,
                        frameWidth: width,
                        padLeft,
                        padTop,
                        frameHeight: height,
                        values: vals,
                        displayedFrames: vals.length
                    }
                    datas.set(s, out)
                    let selector = `:host([src="${isSpecial ? src : s}"])`
                    let w = width,
                        h = height
                    if (crop) {
                        let { left, right, bottom, top } = await doWorkerStuffs(await createImageBitmap(o), width, height)
                        w = (right - (left - 1)) + Math.abs(padLeft)
                        h = bottom + 1 + Math.abs(padTop)
                        let x = -(left + padLeft)
                        sheet.insertRule(isSafari ? `${selector} foreignObject {translate:${x}px ${modThing}}` : `${selector} canvas {left: ${x}px;}`)
                        // sheet.insertRule(`${selector} foreignObject{transform:translateY(${-top/2}px)}`)
                    }
                    sheet.insertRule(`${selector} div{width:${w}px;height:${h}px;}`)
                    sheet.insertRule(`${selector} {width:${w}px;height:${h}px;}`)
                    return out
                }
                out.push(new Promise((resolve, reject) => {
                    let controller = new AbortController,
                        { signal } = controller
                    img.addEventListener('error', e => {
                        controller.abort(e)
                        reject(e)
                    }, reject, { signal })
                    img.addEventListener('load', () => {
                        controller.abort()
                        let width = img.naturalWidth / framesX
                        let height = img.naturalHeight / framesY
                        createImageBitmap(img).then(o => load(o, width, height)).then(resolve)
                    }, { signal })
                }))
            }
            return out
        }
        get src() { return this.getAttribute('src') }
        set src(t) {
            if (this.#once && this.hasAttribute('src')) throw TypeError(`Cannot change src of static sprite`)
            this.setAttribute('src', t)
            this.play()
        }
        #padTop = 0
        #padLeft = 0
        get padLeft() { return this.#padLeft }
        get padTop() { return this.#padTop }
        get values() {
            return this.#anim.getAttribute('values').split(';').map(o => Math.abs(o.split(',')[0]))
        }
        set values(v) {
            let a = this.#anim
            a.setAttribute('path', v)
        }
        get width() {
            return this.#width
        }
        get height() {
            return this.#height
        }
        async download(name = 'sprite', speed = 120, indexes = Array.from({ length: this.framesY }, (_, i) => i)) {
            let module = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')
            , JSZip = module.default
            , zip = new JSZip()
            , offsets = this.values
            , frameGroups = compressAll(offsets)
            , { width, height, canvasElement } = this
            , H = height * indexes.length
            , canvas = new OffscreenCanvas(width, H)
            , ctx = canvas.getContext('2d')
            , listContent = []
            let groupIndex = 0
            let lastFrame
            for (let { n, count } of frameGroups) {
                for (let row of indexes) {
                    let sy = row * height
                    let dy = row * height
                    ctx.drawImage(
                        canvasElement,
                        n, sy, width, height,
                        0, dy, width, height
                    )
                }
                let blob = await canvas.convertToBlob()
                , fileName = `${groupIndex}.png`
                zip.file(fileName, blob)
                ctx.clearRect(0, 0, width, H)
                listContent.push(`${fileName} -d ${lastFrame = count * speed} -q 100 -m 6`)
                ++groupIndex
            }
            const shellScript = `img2webp -loop 0 ${listContent.join(' ')} -o ${name}.webp && webpmux -duration ${lastFrame},0 ${name}.webp -o ${name}.webp && exit`
            zip.file('g.sh', shellScript)
            zip.file('style.txt', `width:${width}px;height:${height}px;object-position: calc(-${width}px * var(--Y, 0)) calc(-${height}px * var(--X, 0));`)
            return await zip.generateAsync({ type: 'blob' })
        }
        #framesY = 0
        #framesX = 0
        get framesY() {
            return this.#framesY
        }
        get framesX() {
            return this.#framesX
        }
        get index() {
            return +this.getAttribute('index') || 0
        }
        set index(index) {
            this.setAttribute('index', +index || 0)
        }
        get dur() {
            let val = this.getAttribute('dur')
            return val ? parseFloat(val) : (1 / 32)
        }
        get totalDur() {
            return this.#anim.getSimpleDuration()
        }
        #width = 0
        #height = 0
        set dur(val) {
            this.setAttribute('dur', val)
        }
        static finishLazyLoad(...srces) {
            for (let i = srces.length; i--;) {
                let src = new URL(srces[i], location).toString()
                let isLazy = lazies.has(src)
                let z = lazies.get(src) || lives.get(src)
                if (!z) continue
                z()
                lazies.delete(src)
                lives.delete(src)
                isLazy && d.querySelectorAll(`slide-show[src="${CSS.escape(src)}"]`).forEach(observer.unobserve, observer)
            }
        }
        get canvasElement() { return this.#sprite }
        async attributeChangedCallback(attr, oldVal, val) {
            switch (attr) {
                case 'index': {
                    let mod = val == 0 ? val : val % this.framesY
                    this.dispatchEvent(new Event('indexEvent', cb)) && this.#fe.style.setProperty('--index', isNaN(mod) ? val : mod)
                }
                    break
                case 'src': {
                    let u = new URL(val, this.baseURI).toString()
                    let isSpecial = val[0] === '$'
                    if (u !== val && !isSpecial) return this.setAttribute('src', u)
                    observer.unobserve(this)
                    if (lazies.has(u)) observer.observe(this)
                    // if (this.getAttribute('loading') === 'lazy') return
                    let canvas = this.#sprite
                    canvas.setAttribute('src', isSpecial ? val : u)
                    let ctx = this.#ctx
                    let b = false
                    while (!datas.has(u)) {
                        if (!b) {
                            if ((this.hasAttribute('framesx') || this.hasAttribute('framesy'))) {
                                let n = {
                                    loading: this.getAttribute('loading'),
                                    framesX: this.getAttribute('framesx') | 0,
                                    framesY: this.getAttribute('framesy') | 0,
                                    src: this.src,
                                    duras: this.getAttribute('values')?.split(sep).filter(Boolean).map(map)
                                }
                                await SlideShow.preload(n)[0]
                                break
                            }
                            this.#framesX = this.#framesY = 0
                            this.#internals.states.add('--broken')
                            this.#once || ctx.clearRect(0, 0, canvas.width, canvas.height)
                            b = true
                            console.warn(`Sprite not loaded: ${u}`)
                        }
                        await new Promise(requestAnimationFrame)
                    }
                    this.#internals.states.delete('--broken')
                    let { padLeft, padTop, bitmap, framesX, framesY, frameHeight, frameWidth, values, displayedFrames } = datas.get(u)
                    this.#padLeft = padLeft
                    this.#padTop = padTop
                    this.#width = frameWidth
                    this.#height = frameHeight
                    this.#framesX = framesX
                    this.#framesY = framesY
                    this.#displayedFrames = displayedFrames
                    let fe = this.#fe
                    let width = canvas.width = framesX * frameWidth
                    let height = canvas.height = framesY * frameHeight
                    this.#ctx.imageSmoothingEnabled = true
                    this.#ctx.imageSmoothingQuality = 'high'
                    if (isSafari) {
                        let c = this.#ctx.canvas
                        c.width = width
                        c.height = height
                    }
                    fe.setAttribute('width', width)
                    fe.setAttribute('height', height)
                    if (this.#once) {
                        (ctx.transferFromImageBitmap || ctx.transferImageBitmap).call(ctx, bitmap)
                        datas.delete(this.src)
                    }
                    else ctx.drawImage(bitmap, 0, 0)
                    fe.style.setProperty('--height', framesY * frameHeight)
                    fe.style.setProperty('--frame-h', frameHeight)
                    this.#anim.setAttribute('values', mapValues(values))
                    // this.#anim.setAttribute('to', values.at(-1))
                    this.#updateTotalDuration()
                    if (this.hasAttribute('autoplay'))
                        this.play()
                    if (!supportsMod) this.index = this.index
                    this.dispatchEvent(new Event('load'))
                    break
                }
                case 'dur':
                    this.#updateTotalDuration()
                    break
                case 'repeat':
                    this.#anim.setAttribute('repeatCount', val)
                    break
                case 'imagesmoothing': if (!this.#once)
                    if (val === 'none' || !val) {
                        this.#ctx.imageSmoothingEnabled = false
                    }
                    else {
                        this.#ctx.imageSmoothingEnabled = true
                        this.#ctx.imageSmoothingQuality = val
                    }
                    break
                case 'values':
                    this.#anim.setAttribute('values', val.split(sep).map(o => `${o},0`).join(';'))
                    break
                default:
                    this.#sprite.setAttribute(attr, val)
                    break
            }
        }
        #sprite
        #anim
        #ctx
        #fe
        #svg
        #internals = this.attachInternals()
        #displayedFrames = 0
        disconnectedCallback() {
            let a = this.#anim
            a.removeEventListener('repeatEvent', repeat)
            a.removeEventListener('endEvent', end)
            this.dispatchEvent(new Event('disconnected'))
            this.shadowRoot.replaceChildren()
        }
        #dom
        connectedCallback() {
            let a = this.#anim
            if (lives.has(this.src)) finishLazyLoad(this.src)
            this.dispatchEvent(new Event('connected'))
            this.hasAttribute('role') || (this.role = 'img')
            this.#disable()
            this.hasAttribute('paused') ? this.restart() : this.#enable()
            requestAnimationFrame(() => {
                this.view()
            })
        }
        view() {
            this.time = 0
            this.shadowRoot.appendChild(this.#dom)
            if (typeof scrollMaxX === 'number') {
                this.#svg.appendChild(this.#anim)
                this.#anim.setAttribute('href', '#fe')
                this.restart()
            }
            this.hasAttribute('paused') && this.pause()
        }
        #state = 'playing'
        get #canPlay() {
            return this.checkVisibility ? this.checkVisibility() : true
        }
        get state() {
            return this.#canPlay ? this.#state : 'idle'
        }
        play() {
            // if (!this.#canPlay) throw new DOMException('Element must be rendered', 'InvalidStateError')
            this.#svg.unpauseAnimations()
            if (this.#state === 'ended') this.time = 0
            this.#state = 'playing'
        }
        #disable() {
            this.#anim.removeEventListener('endEvent', end)
        }
        #enable() {
            if (!this.shadowRoot.firstChild) requestAnimationFrame(this.addEventListener.bind(this.#anim, 'beginEvent', addListeners, { once: true }))
            else typeof scrollMaxX === 'number' ? addListeners.call(this.#anim) : this.#anim.addEventListener('beginEvent', addListeners, { once: true })
        }
        restart() {
            let t = this.#anim
            this.#disable()
            this.time = 0
            this.#enable()
            this.play()
            // t.setAttribute('href','#fe')
        }
        #once
        constructor() {
            super()
            this.#once = false//this.hasAttribute('unique')
            this.#internals.states.add('--broken')
            let shadow = this.attachShadow({ mode: 'open' })
            shadow.appendChild(svg.cloneNode(true))
            this.#svg = shadow.querySelector('svg')
            let anim = this.#anim = d.createElementNS("http://www.w3.org/2000/svg", 'animateTransform')
            anim.setAttribute('attributeName', 'transform')
            anim.setAttribute('fill', 'freeze')
            anim.setAttribute('calcMode', 'discrete')
            anim.setAttribute('type', 'translate')
            anim.setAttribute('repeatCount', 'indefinite')
            // this.#anim.remove()
            let { opaque } = this
            this.#sprite = shadow.querySelector('canvas')
            let FO = shadow.querySelector('foreignObject')
            FO.appendChild(anim)
            if (isSafari) {
                let id = SlideShow.#safariID++
                this.#ctx = d.getCSSCanvasContext('2d', `sprite_${id}`, 0, 0)
                FO.style.backgroundImage = `-webkit-canvas(sprite_${id})`
            }
            else this.#ctx = this.#sprite.getContext(this.#once ? 'bitmaprenderer' : '2d', { alpha: !opaque })
            this.#ctx.imageSmoothingEnabled = false
            this.#sprite.toggleAttribute('moz-opaque', opaque)
            this.#fe = shadow.querySelector('foreignObject')
            shadow.adoptedStyleSheets = [sheet]
            this.#dom = shadow.firstChild
            shadow.replaceChildren()
            // this.pause()
        }
        get repeatCount() {
            return this.#anim.getAttribute('repeatCount') | 0
        }
        get fill() {
            return this.#anim.getAttribute('fill')
        }
        set fill(fill) {
            this.#anim.setAttribute('fill', fill === 'remove' ? 'remove' : 'freeze')
        }
        set repeatCount(v) {
            let { time, state: playing } = this
            if (isNaN(v) || v < 0) v = 'indefinite'
            let a = this.#anim
            this.#disable()
            a.setAttribute('repeatCount', v | 0 || 'indefinite')
            this.time = time
            playing && this.play()
            this.#enable()
        }
        pause() {
            if (this.dispatchEvent(new Event('pauseEvent', cb))) {
                this.#svg.pauseAnimations()
                this.#state = 'paused'
            }
        }
        set time(t) {
            this.#svg.setCurrentTime(+t || 0)
            this.dispatchEvent(new Event('seekEvent'))
            if (this.#state === 'ended') this.#state = 'playing'
        }
        get time() {
            let a = this.#anim
            try {
                return a.getStartTime(), a.getCurrentTime() % a.getSimpleDuration()
            }
            catch (e) {
                if (e.name === 'InvalidStateError') return a.getSimpleDuration()
                throw e
            }
        }
        end() {
            this.time = this.dur * 100
            this.#state = 'ended'
        }
        get frame() {
            return Math.floor(this.time / this.dur)
        }
        resume() {
            this.dispatchEvent(new Event('resumeEvent', cb)) && this.#svg.unpauseAnimations()
        }
        #updateTotalDuration() {
            if (this.#displayedFrames === 0) return
            let total = this.dur * this.#displayedFrames
            this.#anim.setAttribute('dur', total)
            this.time = 0
        }
        static setState(p, v) {
            p.#state = v
        }
        // static #subPixel = subPixel
    }
    function mapValues(values) {
        return values.map(doTransform).join(';')
    }
    function doTransform(o) {
        return `${o},0`
    }
    /*const suggestedZooms = {
        1.1320754716981132: 1.46,
        1.3636363636363635: 1.1,
        2.142857142857143: 1.037
    }
    suggestedZooms[0.3125] = suggestedZooms[0.9375] =
        suggestedZooms[1.5625] = suggestedZooms[2.1875] = 1.2*/
    let d = document
        , svg = d.createRange().createContextualFragment(
            /*html*/`<div aria-hidden="true" part="sprite" id="sprite"><svg><foreignObject width=100 height=100 id="fe" x=0 style="background-size:auto;background-repeat:no-repeat"><canvas style="position:relative"></canvas></foreignObject></svg></div>`)
        , datas = new Map
        , sheet = new CSSStyleSheet
        , isSafari = 'onwebkitmouseforceup' in window
    //:host([loading="lazy"]) #sprite{content-visibility:auto}
    // let before = `content: attr(alt);left:-30px;font-size:smaller;position:relative;font-family:monospace`
    let broken = 'background-image:url(data:image/webp;base64,UklGRmQAAABXRUJQVlA4TFgAAAAvH8AHAA8w/xHzHwZHkSTLShU7t4+Dj5OPs2LniASk4OzZiOh/jDHGGtpCR+gEnaELdIWUXJEb8kBO5EwuZCQmq2STHJIpmZMlKeEq3ISH8BG+wk/4jzEG);width:32px;height:32px;image-rendering:auto;'
    // let d = devicePixelRatio+"" ;if(d.length > 5 && d.at(-1) === '5')console.log(devicePixelRatio)
    // ^ this SEEMS to work for detecting if subpixel rendering is happening
    const modThing = supportsMod ? 'calc((mod(calc(var(--index,0)*var(--frame-h,0)),var(--height,0))*-1px))' : 'calc(var(--index, 0) * var(--frame-h, 0) * -1px)'
    sheet.replaceSync(
        // `@property --dpr-zoom{syntax:"<number>";inherits:true;initial-value:1}:host(:not([precise])){zoom:var(--dpr-zoom,1)!important}@media (resolution:0.3125dppx) or (resolution:0.9375dppx) or (resolution:1.5625dppx) or (resolution:2.1875dppx){:host(:not([precise])){--dpr-zoom:1.2}}@media (resolution:1.1320754716981132dppx){:host(:not([precise])){--dpr-zoom:1.46}}@media (resolution:1.3636363636363635dppx){:host(:not([precise])){--dpr-zoom:1.1}}@media (resolution:2.142857142857143dppx){:host(:not([precise])){--dpr-zoom:1.037}}`+
        // this resolution bit is the subpixel rendering devicePixelRatios
        `#sprite{display:flex}svg,div{width:100%}foreignObject{y:${modThing}}div{contain:paint;pointer-events:all;overflow:clip;transform:translate(-50%,-50%) scale(calc(1 / var(--dpr-zoom, 1)));}:host{isolation:isolate;user-select:none;-webkit-user-select:none;-moz-user-select:none;-webkit-tap-highlight-color: transparent;touch-action:pinch-zoom;pointer-events:none !important;transform-origin:0 0;display:flex;width:0;height:0;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated}:host(:--broken){width:32px;height:32px;content:attr(aria-label);background-size:cover;}:host(:state(--broken)){width:32px;height:32px;content:attr(aria-label);background-size:cover;}:host(:--broken) div{${broken}}:host(:state(--broken)) div{${broken}}`)
    // the mass amount of resolution dppx is each individual DPR that causes the subpixel rendering
    // which causes the sprite to jitter on the x-axis
    // this zoom + inverse scale seems to fix it!
    // you can opt out by using the precise attribute (if for example getBoundingClientRect returns inaccurate values, which is what happened)
    let sep = /[^-\d\s]/g
    function compressAll(arr) {
        return arr.reduce(reducer, [])
    }
    function reducer(acc, val, idx, src) {
        idx === 0 || val !== src[idx - 1] ? acc.push({ n: val, count: 1 }) : ++acc[acc.length - 1].count
        return acc
    }
    let bubbles = { bubbles: true }
    let cb = { bubbles: true, cancelable: true }
    function repeat(e) {
        e.target.getRootNode().host.dispatchEvent(new Event('repeatEvent', bubbles))
    }
    function begin(e) {
        e.target.getRootNode().host.dispatchEvent(new Event('beginEvent', bubbles))
    }
    function end(e) {
        let t = e.target.getRootNode().host
        if (t.shadowRoot.firstChild && t.time === t.totalDur) {
            SlideShow.setState(t, 'ended')
            t.dispatchEvent(new Event('endEvent', bubbles))
        }
    }
    function addListeners() {
        this.addEventListener('endEvent', end)
        this.addEventListener('repeatEvent', repeat)
    }
    // function visible(n) {
    //     let t = n.target
    //     let host = t.getRootNode().host
    //     host.removeAttribute('loading')
    //     host.src = host.src
    // }
    customElements.define('slide-show', SlideShow)
    // try { await (customElements.whenDefined('slide-show')) }
    // catch (e) { if (e.name !== 'ReferenceError') throw e }
    function map(n) {
        if (!n.match(/\d+/g).length) return +n
        let o = n.split(/\D/).map(Number)
        o[1] ||= 1
        return o
    }
    return SlideShow
}(customElements.get('slide-show'))
export default SlideShow.preload
let worker/*${return`= new Worker('data:text/javascript,' + encodeURIComponent(${JSON.stringify(minify({['spriteworker.js']:await inline('./spriteworker.js')}, 'text/javascript').code)}),{name:'slide-show'})`}*/
function doWorkerStuffs(bitmap, width, height) {
    let channel = new MessageChannel
    let { port1, port2 } = channel
    port2.start()
    worker.postMessage({ bitmap, width, height }, [bitmap, channel.port2])
    return new Promise((resolve, reject) => {
        function finish() {
            port1.removeEventListener('messageerror', err)
            port1.removeEventListener('message', msg)
        }
        function msg({ data }) {
            port2.close()
            port1.close()
            data.name ? reject(data) : resolve(data)
            finish()
        }
        function err(n) {
            finish()
            reject(n.data)
        }
        port1.start()
        port1.addEventListener('message', msg)
        port1.addEventListener('messageerror', err)
    })
}
export const { isLoaded, finishLazyLoad } = SlideShow