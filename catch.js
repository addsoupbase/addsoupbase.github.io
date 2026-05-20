// import *as v from './v4.js'
let d = document
import './h.js'
import load, { SlideShow } from './webcomponents/slide-show.js'
const h = window[Symbol.for('[[HModule]]')]
let loaded = false
export { load }
export const POKE_BALL = 0,
GREAT_BALL = 1,
SAFARI_BALL = 2,
ULTRA_BALL = 3,
MASTER_BALL = 4,
NET_BALL = 5,
DIVE_BALL = 6,
DREAM_BALL = 7

export async function pokeball() {
    if (loaded) return
    let n = new Image
    n.src = 'data:image/webp;base64,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'
    try {
        n.decoding = 'sync'
        n.setAttribute('fetchpriority', 'high')
        await h.until(n, { resolve: 'load', reject: 'error' })
    }
    catch (e) {
        n.src = new URL('./ball.png', import.meta.url)
        await h.until(n, { resolve: 'load', reject: 'error' })
    }
    let { 0: catc, 1: thro } = await Promise.all([createImageBitmap(n, 0, 0, 320, 320), createImageBitmap(n, 320, 0, 320, 320)])
    let opts = { framesX: 8, framesY: 8 }
    let out = Promise.all(load({ src: '$catch', duras: '0 6;1 18;0 13;2 1;3 1;4 1;3 1;2 1;0 11;5 1;6 1;7 1;6 1;5 1;0 11;2 1;3 1;4 1;3 1;2 1;0 10;', image: catc, ...opts }, { reversed: true, src: '$throw', image: thro, ...opts }))
    await out
    loaded = true
    return out
}
try {
    await (pokeball())
}
catch (e) {
    if (!(e.name === 'ReferenceError' && e.message.includes('await'))) throw e
}
class Pokedex extends HTMLElement {

}
export function catchAnimation(n, delay = 640, duration = 400) {
    return n.animate([{
        transform: 'scale(1,1)', filter: 'brightness(0%) invert(1) opacity(90%)'
    }, { filter: 'opacity(60%) brightness(0%) invert(1)' }, {
        transform: 'scale(0.25,0.25)', filter: 'opacity(0%) brightness(0%) invert(1)'
    }], {
        duration,
        iterations: 1,
        delay,
        composite: 'add',
        easing: 'ease-in'
    })
}
export function stopAnims(n) {
    for (let x = n.getAnimations({ subtree: true }), i = x.length; i--;) x[i].commitStyles()
}
export function setField(bg) {
    function pointerdown(n) {
        let t = n.target.closest('slide-show')
        if (t && t.dispatchEvent(new CustomEvent('beforecatch', {
            detail: {
                original: n,
                field: bg
            }, bubbles: true, cancelable: true
        }))) {
            let rect = t.shadowRoot.firstChild.getBoundingClientRect()
            let { width, height, x, y } = rect
            let pokeball = d.createElement('slide-show')
            pokeball.src = '$throw'
            pokeball.style.position = 'absolute'
            pokeball.toggleAttribute('autoplay', true)
            pokeball.dur = .05
            t.after(pokeball)
            let cy = Math.round(rect.y + (height / 2))
            t.dispatchEvent(new CustomEvent('catch', {
                bubbles: true,
                detail: {
                    pokeball,
                    field: bg,
                    centerX: Math.round(rect.x + (width / 2)),
                    centerY: cy,
                    width,
                    height,
                    x,
                    distance: Math.max(1400 - cy, 500),
                    y,
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom,
                    original: n
                }
            }))
        }
    }
    bg.addEventListener('pointerdown', pointerdown)
}