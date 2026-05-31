// VERY IMPORTANT:
// do NOT use the `zoom` or `scale` css property
// it behaves strangely
const supportsMod = CSS.supports('width', 'mod(1px,1px)')
export const SlideShow = function (_) {
    if (_) return _
    const subPixel = matchMedia(`(resolution: 0.3125dppx)  or (resolution: 0.9375dppx) or (resolution: 1.5625dppx) or (resolution: 2.1875dppx) or (resolution: 1.1320754716981132dppx) or (resolution: 1.3636363636363635dppx) or (resolution: 2.142857142857143dppx)`)
    subPixel.addEventListener('change', change)
    function change(n) {
        d.dispatchEvent(new CustomEvent('subpixelrenderingchange', {
            detail: {
                isSubPixelRendering: n.matches,
                suggestedZoom: suggestedZooms[devicePixelRatio] || 1
            }
        }))
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
            this.#anim.setAttribute('values', this.#anim.getAttribute('values').split(';').reverse().join(';'))
        }
        static isLoaded(...srces) {
            return srces.every(o => bitmaps.has(new URL(o, location)))
        }
        static preload(...sources) {
            let out = []
            for (let { padLeft = 0, padTop = 0, framesX = 1, framesY = 1, src, duras, image, reversed, crop = true } of sources) {
                if (typeof duras === 'string') duras = duras.split(sep).filter(Boolean).map(map)
                let url = new URL(src, d.baseURI)
                let s = url.toString()
                if (image) {
                    load(image, image.width / framesX, image.height / framesY, true)
                    continue
                }
                let n = new Image
                n.setAttribute('fetchpriority', 'high')
                n.decoding = 'sync'
                n.src = src
                if (url.origin !== origin)
                    n.crossOrigin = 'anonymous'
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
                        values: vals.join(';'),
                        displayedFrames: vals.length
                    }
                    bitmaps.set(s, out)
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
                    n.addEventListener('error', e => {
                        controller.abort(e)
                        reject(e)
                    }, reject, { signal })
                    n.addEventListener('load', () => {
                        controller.abort()
                        let width = n.naturalWidth / framesX
                        let height = n.naturalHeight / framesY
                        createImageBitmap(n).then(o => load(o, width, height)).then(resolve)
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
            return this.#anim.getAttribute('values').split(sep).map(n => (n && -n) | 0)
        }
        set values(v) {
            let a = this.#anim
            a.setAttribute('values', a.getAttribute('values').split(sep).join(';'))
        }
        get width() {
            return this.#width
        }
        get height() {
            return this.#height
        }
        async extract(speed = .048, indexes = [this.index], selector) {
            let module = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')
                , JSZip = module.default
                , zip = JSZip()
                , offsets = this.values
                , { width, height, canvasElement } = this
                , frameGroups = compressAll(offsets)
                , H = height * indexes.length
                , c = new OffscreenCanvas(width, H)
                , ctx = c.getContext('2d')
                , listContent = []
                , x = 0
            for (const { n, count } of frameGroups) {
                for (let i of indexes)
                    ctx.drawImage(canvasElement, -n, 0)
                zip.file(`${x}.png`, await c.convertToBlob())
                ctx.clearRect(0, 0, width, H)
                listContent.push(`file '${x}.png'`, `duration ${count * speed}`)
                ++x
            }
            let lastFrame = x - 1
            listContent.push(`file '${lastFrame}.png'`, 'duration 0.04')
            zip.file('list.txt', listContent.join('\n'))
            let shellScript = `#!/bin/sh
ffmpeg -f concat -safe 0 -i list.txt \\
       -vf "split[s0][s1];[s0]palettegen=reserve_transparent=on[p];[s1][p]paletteuse" \\
       -loop 0 '${selector}.gif'`
            zip.file('make_gif.sh', shellScript)
            zip.file('style.css', `width:${width}px;height:${height}px;object-position: 0 calc(-${height}px * var(--SPRITE_INDEX, 0))`)
            return await zip.generateAsync({ type: 'blob' })
            // dont forget to include object-fit: none
            // or as an alternative, you can use background-image instead
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
        #width = 0
        #height = 0
        set dur(val) {
            this.setAttribute('dur', val)
        }
        get canvasElement() { return this.#sprite }
        async attributeChangedCallback(attr, oldVal, val) {
            switch (attr) {
                case 'index': {
                    let mod = val == 0 ? val : val % this.framesY
                    this.dispatchEvent(new Event('indexEvent', { bubbles: true, cancelable: true })) && this.#fe.style.setProperty('--index', isNaN(mod) ? val : mod)
                }
                    break
                case 'src': {
                    let u = new URL(val, this.baseURI).toString()
                    let isSpecial = val[0] === '$'
                    if (u !== val && !isSpecial) return this.setAttribute('src', u)
                    // if (this.getAttribute('loading') === 'lazy') return
                    let canvas = this.#sprite
                    canvas.setAttribute('src', isSpecial ? val : u)
                    let ctx = this.#ctx
                    let b = false
                    while (!bitmaps.has(u)) {
                        if (!b) {
                            if ((this.hasAttribute('framesx') || this.hasAttribute('framesy'))) {
                                let n = {
                                    framesX: this.getAttribute('framesx') | 0,
                                    framesY: this.getAttribute('framesy') | 0,
                                    src: this.src,
                                    duras: this.getAttribute('values')?.split(sep).filter(Boolean).map(map)
                                }
                                await SlideShow.preload(n)[0]
                                break
                            }
                            this.#framesX = this.#framesY = 0
                            this.#internals?.states.add('--broken')
                            this.#once || ctx.clearRect(0, 0, canvas.width, canvas.height)
                            b = true
                            console.warn(`Sprite not loaded: ${u}`)
                        }
                        await new Promise(requestAnimationFrame)
                    }
                    this.#internals?.states.delete('--broken')
                    let { padLeft, padTop, bitmap, framesX, framesY, frameHeight, frameWidth, values, displayedFrames } = bitmaps.get(u)
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
                        bitmaps.delete(this.src)
                    }
                    else ctx.drawImage(bitmap, 0, 0)
                    fe.style.setProperty('--height', framesY * frameHeight)
                    fe.style.setProperty('--frame-h', frameHeight)
                    this.#anim.setAttribute('values', values)
                    // this.#anim.setAttribute('to', values.at(-1))
                    this.#updateTotalDuration()
                    if (this.hasAttribute('autoplay'))
                        this.play()
                    if (!supportsMod) this.index = this.index
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
        #container
        #internals = this.attachInternals()
        #displayedFrames = 0
        disconnectedCallback() {
            let a = this.#anim
            a.removeEventListener('repeatEvent', repeat)
            a.removeEventListener('endEvent', end)
            this.dispatchEvent(new Event('disconnected'))
        }
        connectedCallback() {
            let a = this.#anim
            a.addEventListener('repeatEvent', repeat)
            a.addEventListener('endEvent', end)
            this.dispatchEvent(new Event('connected'))
            this.hasAttribute('role') || (this.role = 'img')
            this.hasAttribute('paused') || requestAnimationFrame(this.restart.bind(this))
        }
        #state = 'playing'
        get state() {
            return this.#state
        }
        play() {
            this.#svg.unpauseAnimations()
            if (this.#state === 'ended') this.time = 0
            this.#state = 'playing'
            // needed bc it's broken
        }
        #disable() {
            this.#anim.removeEventListener('endEvent', end)
        }
        #enable() {
            this.#anim.addEventListener('beginEvent', addEnd, { once: true })
        }
        restart() {
            let t = this.#anim
            this.#disable()
            this.time = 0
            this.play()
            let n = t.getAttributeNode('href')
            t.removeAttributeNode(n)
            t.setAttributeNode(n)
            this.#enable()
        }
        #once
        constructor() {
            super()
            this.#once = false//this.hasAttribute('unique')
            this.#internals?.states.add('--broken')
            let shadow = this.attachShadow({ mode: 'open' })
            shadow.appendChild(svg.cloneNode(true))
            this.#svg = shadow.querySelector('svg')
            this.#anim = shadow.querySelector('animate')
            // this.#anim.remove()
            let { opaque } = this
            this.#sprite = shadow.querySelector('canvas')
            if (isSafari) {
                let id = SlideShow.#safariID++
                this.#ctx = d.getCSSCanvasContext('2d', `sprite_${id}`, 0, 0)
                shadow.querySelector('foreignObject').style.backgroundImage = `-webkit-canvas(sprite_${id})`
            }
            else this.#ctx = this.#sprite.getContext(this.#once ? 'bitmaprenderer' : '2d', { alpha: !opaque })
            this.#ctx.imageSmoothingEnabled = false
            this.#sprite.toggleAttribute('moz-opaque', opaque)
            this.#fe = shadow.querySelector('foreignObject')
            shadow.adoptedStyleSheets = [sheet]
            this.#container = shadow.firstChild
            this.pause()
            // this.#container.addEventListener('contentvisibilityautostatechange', visible)
        }
        get repeatCount() {
            return this.#anim.getAttribute('repeatCount')
        }
        get fill() {
            return this.#anim.getAttribute('fill')
        }
        set fill(fill) {
            this.#anim.setAttribute('fill', fill)
        }
        set repeatCount(v) {
            let { time, state: playing } = this
            if (isNaN(v) || v < 0) v = 'indefinite'
            let a = this.#anim
            this.#disable()
            a.setAttribute('repeatCount', v)
            this.time = time
            playing && this.play()
            this.#enable()
        }
        pause() {
            if (this.dispatchEvent(new Event('pauseEvent', { bubbles: true, cancelable: true }))) {
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
            let dur = this.#anim.getSimpleDuration()
            return this.#state !== 'ended' ? this.#svg.getCurrentTime() % dur : dur
        }
        end() {
            this.time = this.dur * 100
            this.#state = 'ended'
        }
        get frame() {
            return Math.floor(this.time / this.dur)
        }
        resume() {
            this.dispatchEvent(new Event('resumeEvent', { bubbles: true, cancelable: true })) && this.#svg.unpauseAnimations()
        }
        #updateTotalDuration() {
            if (this.#displayedFrames === 0) return
            let total = this.dur * this.#displayedFrames
            this.#anim.setAttribute('dur', total)
        }
        static setState(p, v) {
            p.#state = v
        }
        static #subPixel = subPixel
    }
    const suggestedZooms = {
        1.1320754716981132: 1.46,
        1.3636363636363635: 1.1,
        2.142857142857143: 1.037
    }
    suggestedZooms[0.3125] = suggestedZooms[0.9375] =
        suggestedZooms[1.5625] = suggestedZooms[2.1875] = 1.2
    let d = document
        , svg = d.createRange().createContextualFragment('<div aria-hidden="true" part="sprite" id="sprite"><svg><foreignObject width=100 height=100 id="fe" x=0 style="background-size:auto;background-repeat:no-repeat"><canvas style="position:relative"></canvas></foreignObject><animate fill="freeze" from="0" begin="0s" href="#fe" calcMode=discrete attributeName=x repeatCount="indefinite"/></svg></div>')
        , bitmaps = new Map
        , sheet = new CSSStyleSheet
        , isSafari = 'onwebkitmouseforceup' in window
    //:host([loading="lazy"]) #sprite{content-visibility:auto}
    // let before = `content: attr(alt);left:-30px;font-size:smaller;position:relative;font-family:monospace`
    let broken = 'background-image:url(data:image/webp;base64,UklGRmQAAABXRUJQVlA4TFgAAAAvH8AHAA8w/xHzHwZHkSTLShU7t4+Dj5OPs2LniASk4OzZiOh/jDHGGtpCR+gEnaELdIWUXJEb8kBO5EwuZCQmq2STHJIpmZMlKeEq3ISH8BG+wk/4jzEG);width:32px;height:32px;image-rendering:auto;'
    // let d = devicePixelRatio+"" ;if(d.length > 5 && d.at(-1) === '5')console.log(devicePixelRatio)
    // ^ this SEEMS to work for detecting if subpixel rendering is happening
    const modThing = supportsMod ? 'calc((mod(calc(var(--index,0)*var(--frame-h,0)),var(--height,0))*-1px))' : 'calc(var(--index, 0) * var(--frame-h, 0) * -1px)'
    sheet.replaceSync(
        // this resolution bit is the subpixel rendering devicePixelRatios
        `${Object.getOwnPropertyDescriptor(Element.prototype, 'currentCSSZoom').value ? '' :
            `@property --dpr-zoom{syntax:"<number>";inherits:true;initial-value:1}:host(:not([precise])){zoom:var(--dpr-zoom,1)!important}@media (resolution:0.3125dppx) or (resolution:0.9375dppx) or (resolution:1.5625dppx) or (resolution:2.1875dppx){:host(:not([precise])){--dpr-zoom:1.2}}@media (resolution:1.1320754716981132dppx){:host(:not([precise])){--dpr-zoom:1.46}}@media (resolution:1.3636363636363635dppx){:host(:not([precise])){--dpr-zoom:1.1}}@media (resolution:2.142857142857143dppx){:host(:not([precise])){--dpr-zoom:1.037}}`}
        #sprite{display:flex}svg,div{width:100%}div{contain:paint;pointer-events:all;overflow:clip;transform:translate(-50%,-50%) scale(calc(1 / var(--dpr-zoom, 1)));}foreignObject{y:${modThing};}:host{${isSafari ? 'filter: none !important;' : ''}isolation:isolate;user-select:none;-webkit-user-select:none;-moz-user-select:none;-webkit-tap-highlight-color: transparent;touch-action:pinch-zoom;pointer-events:none !important;transform-origin:0 0;display:flex;width:0;height:0;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated}:host(:--broken){width:32px;height:32px;content:attr(aria-label);background-size:cover;}:host(:state(--broken)){width:32px;height:32px;content:attr(aria-label);background-size:cover;}:host(:--broken) div{${broken}}:host(:state(--broken)) div{${broken}}`)
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
    function repeat(e) {
        let t = e.target.getRootNode().host
        t.dispatchEvent(new Event('repeatEvent', { bubbles: true }))
    }
    function end(e) {
        let t = e.target.getRootNode().host
        SlideShow.setState(t, 'ended')
        t.dispatchEvent(new Event('endEvent', { bubbles: true }))
    }
    function addEnd() {
        this.addEventListener('endEvent', end)
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
export const {isLoaded} = SlideShow