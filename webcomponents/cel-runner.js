// Okaay attempt #3 of spritesheet webcomponent
// Mainly just for the Pokemon sprites from https://sprites.pmdcollab.org/
const animationName = '.'
const name = 'cel-runner'
const sheet = new CSSStyleSheet
function updateGlobalSheet(src, img, x, y) {
    // Why tf did they separate :host and :host()??
    // i spent like 30 mins trying to figure out why it wasn't working
    let rule = `:host([src="${CSS.escape(src)}"]){background-image:url("${src}");--cel-runner-width:${img.naturalWidth}px !important;--cel-runner-height:${img.naturalHeight}px !important;--frames-x:${x | 0};--frames-y:${y | 0}}`
    sheet.insertRule(rule)
}
function iterEvent() {
    return new Event('spriteended', { bubbles: true })
}
function iter(e) {
    if (e.animationName === animationName) this.dispatchEvent(iterEvent())
}
class CelRunner extends HTMLElement {
    static observedAttributes = ['src', 'frames-x', 'frames-y', 'dura', 'index', 'direction', 'total']
    get onspriteended() {
        return this.#onspriteended
    }
    #onspriteended = null
    set onspriteended(val) {
        let old = this.#onspriteended
        if (old)
            this.removeEventListener('spriteended', old)
        if (val === Object(val))
            this.addEventListener('spriteended', this.#onspriteended = val)
        else this.#onspriteended = null
    }
    static loaded = new Set
    static preload(...sources) {
        for (let i = sources.length; i--;) {
            let { src, x = 8, y = 8 } = sources[i]
            src = new URL(src, document.baseURI).toString()
            if (CelRunner.loaded.has(src)) continue
            CelRunner.loaded.add(src)
            let im = new Image
            im.src = src
            im.onload = () => {
                updateGlobalSheet(src, im, x, y)
            }
            im.decode()
        }
    }
    connectedCallback() {
        this.addEventListener('animationiteration', iter, true)
        // called when connected to DOM for the first time
        let shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = (

            `<style>
            :host{
            display:block !important; 
            background-repeat: no-repeat;
            --dura: 400ms;
            --cel-runner-width: 100px;
            --cel-runner-height: 100px;
            --index: 0;
            position: relative;
            translate: -50% -50%;
            background-size: var(--cel-runner-width) var(--cel-runner-height) !important;
            width: calc(var(--cel-runner-width) / var(--frames-x, 1)) !important;
            height: calc(var(--cel-runner-height) / var(--frames-y, 1)) !important;
            animation-name: \\.;
            animation-duration: calc(var(--frames-x) * var(--dura));
            animation-timing-function: steps(var(--frames-x), end);
            animation-iteration-count: infinite;
            animation-fill-mode: forwards;
            animation-direction: var(--direction, normal);
            image-rendering: pixelated;
            background-position-y: calc(var(--index) * (var(--cel-runner-height) / var(--frames-y)) * -1);
            }  
            @keyframes \\. {
            0% {
                background-position-x: 0%;
            }
            100% {
                background-position-x: calc(var(--cel-runner-width) * -1)
            }
        }
</style>`)
        shadow.adoptedStyleSheets = [sheet]
    }
    get #animation() {
        return this.getAnimations().find(o => o.animationName === '.')
    }
    reset(fireIter) {
        this.#animation.currentTime = 0
        if (fireIter) this.dispatchEvent(iterEvent())
    }
    pause() {
        this.#animation.pause()
    }
    resume() {
        this.#animation.play()
    }
    pauseOtherAnims() {
        let a = this.#animation
        this.getAnimations().forEach(o => o !== a && o.pause())
    }
    disconnectedCallback() {
        // called when removed from DOM (e.g. remove(), replaceWith())
    }
    adoptedCallback() {
        // called when `ownerDocument` changes
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        // called when setAttribute is called
        switch (attr) {
            case 'total':
                if (!this.hasAttribute('total')) this.style.animationDuration = 'calc(var(--frames-x) * var(--dura))'
                else this.style.animationDuration = 'var(--dura)'
                break
            case 'src':
                let url = new URL(newVal, this.baseURI).toString()
                if (url !== newVal) return this.setAttribute('src', url)
                if (!CelRunner.loaded.has(newVal)) {
                    let x = this.getAttribute('frames-x'), y = this.getAttribute('frames-y')
                    CelRunner.preload({ src: newVal, x: +x || 8, y: +y || 8 })
                    //@devif (!x || !y)  console.warn(`Sprite not explicitly defined ${!x ? 'x' : ''}${!y ? 'y' : ''}: "${newVal}"`)
                }
                break
            case 'index':
                newVal %= (this['frames-y'] | 0) || 8
                newVal |= 0
            // case 'frames-x':
            // case 'frames-y':
            default:
                this.style.setProperty(`--${attr}`, newVal)
                break
        }
    }
}
export default CelRunner.preload
let { observedAttributes } = CelRunner
for (let i = observedAttributes.length; i--;) {
    let prop = observedAttributes[i]
    Object.defineProperty(CelRunner.prototype, prop, {
        get() {
            return this.getAttribute(prop) ?? ''
        },
        set(val) {
            this.setAttribute(prop, val)
        }
    })
}
if (customElements.get(name) !== CelRunner) {
    let d = customElements.whenDefined(name)
    customElements.define(name, CelRunner)
    await d
}