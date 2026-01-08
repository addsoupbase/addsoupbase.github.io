import $, { css } from '../yay.js'
const { registerCSS, registerCSSAll } = css
import '../sound.js'
let regex = /[\w.\-%汝起亚]+\.(?:webp|a?png|gif|jpe?g|avif)/
let all = document.getElementsByTagName('*')
function isHidden() {//violations >= 10 || 
    return all.length > 135 || hidden || !!document.fullscreenElement || document.hidden || document.visibilityState === 'hidden'
} 
async function images({ time, pkm, colorful, birthday }) {
    await audio.load('./media/pop.mp3')
    if (birthday) {
        $.body.animate([{ 'backdrop-filter': 'hue-rotate(0deg)', }, { 'backdrop-filter': 'hue-rotate(360deg)' }], {
            duration: 50_000,
            iterations: 1 / 0,
            easing: 'linear',
        })
    }
    // on(document, {
    // visibilitychange() {
    // let func = document.hidden ? o => o.pauseAnims() : o => o.resumeAnims()
    // $.qsa('*').forEach(func)
    // }
    // })
    let bg = parent
    const frameDuration = 135
    const duration = 15_000
    let holding = false
    bg.delegate({
        contentvisibilityautostatechange({ skipped }) {
            // this.matches('.bubble')&&console.log(this)
            this.setStyle({
                'will-change': skipped ? 'auto' : ''
            })
        },
        '^pointerdown': click
    }, o =>
        o.classList.contains('bubble') && o.flags === 0,
        false,
        new AbortController
    ).debounce({
        '^pointermove'({ x, y }) {
            holding && makeBubble(`${x}px`, `${y}px`).fadeIn(300)
        }
    }, 60)
        .on({
            '^pointerup'() {
                holding = false
            },
            '^pointerdown'(e) {
                this.setPointerCapture(e.pointerId)
                holding = true
            }
        })

    async function click(e) {
        e.stopImmediatePropagation()
        let { transform } = this.computed
        this.pauseAnims()
        POP()
        this.fadeOut(300)
        this.flags = 1
        await this.animate([{ transform: '' }, { transform: 'scaleX(2) scaleY(2)', }], {
            duration: 300,
            easing: 'ease-in-out',
            composite: 'accumulate',
        }).finished
        let { 0: name } = this.firstElementChild.title.match(regex)[0].split(/\.(?:webp|a?png|gif|jpe?g|avif)/)
        if (name.includes('%')) name = decodeURIComponent(name)
        let src = this.firstElementChild.src
        let me = $(`div.ava .tar .${name}`, {
            styles: {
                'backgroundImage': `url(${src})`,
                'z-index': 3
            },
            attributes: {
                _hidden: 'true',
                alt: name,
            },
            parent: bg,
        }, $('p.displayName', { txt: '@' + string.upper(name) }))
        this.remove()
        me.fadeIn()
        me.setStyles({ transform })
        await me.animate([{ opacity: 1 }, { transform: 'scale(0, 0)', opacity: 0, filter: 'opacity(0%) grayscale(100%) blur(20px) brightness(0%)' }], {
            duration: 1000,
            delay: 2000,
            composite: 'add',
            easing: 'ease'
        }).finished
        me.destroy()
    }
    function bubbleWithAva(image = cycle.next) {
        if (isHidden()) return
        const  src = `./media/avatars/${image}`
        let n = $('div.bubble.pop', {
            attr: {
                style: 'z-index:3;',
                _hidden: 'true',
                width: 50, height: 50
            }, parent
        })
        if (birthday) {
            let image = ran.choose(...colorful)

            n.animate('255 0 0,255 127 0,255 255 0,127 255 0,0 255 0,0 255 127,0 255 255,0 127 255,255 0 255,255 0 127'.split(',').map(o => ({
                filter: `drop-shadow(0px 0px 10px rgb(${o}))`
            })), {
                duration: 2000 * ran.range(.8, 1.2),
                iterations: 1 / 0,
                easing: 'linear',
            })
            n.setStyles({ 'background-image': `url("${image}")` })
        }
        let settings = ran.coin
            ? [{ transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }, { transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` },]
            : [{ transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` }, { transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }]
        n.animate(settings, { duration }).finished.then(() => n.destroy())
        const c = ran.range(0, innerHeight)
        n.animate([{ transform: `translate(0, ${c}px)` }, { transform: `translate(0, ${c - 200}px)` }], {
            composite: 'accumulate',
            easing: 'ease-in-out',
            duration: ran.range(3000, 3500),
            iterations: 1 / 0,
            direction: 'alternate'
        })
        $('img.ava', {
            parent: n,
            styles: {
                '--user-drag': 'none'
            },
            attributes: {
                src,
                decoding: 'async',
                // alt: src,
                _hidden: 'true',
                width: 50,
                height: 50,
                title: image,
                draggable: false
            }
        })
        if (birthday) {
            n.push($(`div .centerx .party .party${ran.choose(1, 2, 3)}`))
        }
        // out.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${ran.choose(360, -360)}deg)` }], { composite: 'accumulate', duration: 80000, iterations: 1 / 0, easing: 'linear' })
    }
    function createAnimationForSpritesheet(image) {
        let dura = frameDuration
        if (image.dataset.name === 'groudon') {
            dura *= 2
        }
        let me = $(`div.${image.dataset.name}.sprite`, {
            parent, attr: {
                _hidden: 'true',
            }
        })
        me.animate([{ 'backgroundPositionX': '0px' },
        { 'backgroundPositionX': `-${image.width}px` }
        ], {
            easing: `steps(${image.dataset.width},end)`,
            duration: dura * image.dataset.width,
            iterations: 1 / 0
        })
        // if (ran.jackpot(10)) {
            // me.classList.add('farther')
        // }
        ran.jackpot(1000) && me.classList.add('shiny')
        return me
    }

    async function spawnPkmn() {
        setTimeout(spawnPkmn, ran.range(500, 2000))
        if (isHidden() || !mons) return
        let pick = ran.choose(...mons)
        if (ran.jackpot(10_000))
            pick = groudon
        const element = createAnimationForSpritesheet(pick)
        element.fadeIn()
        let { coin } = ran
        element.setStyles({ transform: `translateY(${ran.range(0, innerHeight)}px) scaleX(${coin ? '-1' : '1'})`, })
        let { offsetWidth } = element
        let settings = coin
            ? [{ transform: `translate(calc(100vw + ${offsetWidth}px), 0)` }, { transform: `translate(calc(-10vw - ${offsetWidth}px), 0)` },]
            : [{ transform: `translate(calc(-10vw - ${offsetWidth}px), 0)` }, { transform: `translate(calc(100vw + ${offsetWidth}px), 0)` }],
            duration = 15000
        switch (pick.dataset.name) {
            case 'wailord':
                duration *= 20
                break
            case 'groudon':
                duration *= 8
                break
            case 'wishiwashischool':
                duration *= 12
                break
            case 'kyogreprimal':
                duration *= 3
            case 'kyogre':
            case 'alomomola':
                duration *= 2
                break
            case 'luvdisc':
                duration *= 0.75
                break
            // case 'sharpedo': case 'carvanha': duration = 8300; break
            case 'corsola':
                duration = duration *= 2.5
                break
            case 'wishiwashi':
                duration *= 4
                break
            case 'qwilfish':
                duration *= 1.5
                break
            case 'lanturn':
            case 'bruxish':
            case 'gorebyss':
            case 'huntail':
            case 'jellicent_m':
            case "jellicent_f":
            case 'seaking':
            case 'arctovish':
            case 'nihilego':
            case 'lumineon':
            case 'sharpedo':
                duration *= 2
                break
            //        case 'corsola': element.animate([{transform: 'rotateZ(0deg)'}, {transform: `rotateZ(360deg)`}], {composite:'add',easing:'linear',duration:5000, iterations:1/0,direction:coin?'reverse':'normal'})
        }
        duration *= 1.6
        duration *= ran.range(.9, 1.1)
        await element.animate(settings, {
            easing: 'linear',
            duration,
            composite: 'accumulate',
            fill: 'forwards'
        }).finished
        await element.fadeOut()
        element.destroy()
    }
    function makeSnowflake() {
        let flake = $`<div aria-hidden="true" class="snowflake" style="left:${ran.range(0,100)}vw"></div>`
        parent.push(flake)
        flake.animate([{transform: 'translateY(0)'}, {transform: 'translateY(calc(100vh + 30px))'}], {
            duration: 17000,
            easing: 'linear',
            composite: 'add'
        }).finished.then(()=>flake.destroy())
        flake.animate([{transform:'translateX(0)'}, {transform:`translateX(${ran.choose(-80,80)}px)`}],{
            duration: 4000,
            iterations: 1/0,
            direction: 'alternate',
            easing: 'ease-in-out',
            composite: 'add'
        })
    }
    function makeBubble(x, y) {
        let bubbl = $(`<div class="bubble" style="pointer-events:none;z-index:${ran.frange(1, 3)}"></div>`, {
            parent,
            attr: {
                _hidden: 'true'
            }
        })
        bubbl.flags = 1
        if (birthday) {
            let image = ran.choose(...colorful)
            bubbl.setStyles({
                'background-image': `url("${image}")`
            })
        }
        let num = ran.range(13, 23)
        bubbl.setStyles({
            width: `${num}px`,
            height: `${num}px`,
            left: x ?? `${ran.range(0, innerWidth)}px`,
            top: y ?? '100%'
        })
        bubbl.animate([{ transform: `translateX(-10px)` }, { transform: 'translateX(10px)' }], {
            iterations: 1 / 0,
            duration: 220,
            direction: 'alternate',
            easing: 'ease-in-out',
            composite: 'add'
        })
        bubbl.animate([{ transform: `translateY(0px)`, }, { transform: `translateY(-110vh)` }], {
            easing: 'linear',
            duration: 8000,
            composite: 'add'
        }).finished
            .then(() => bubbl.destroy()
            )
        return bubbl
    }
    function tinyBubbles(again = true) {
        again && setTimeout(tinyBubbles, ran.range(1000, 1200))
        isHidden() || makeBubble()
    }
    function snowflakes() {
        setTimeout(snowflakes, ran.range(1500, 1920))
        isHidden() || makeSnowflake()
    }
    tinyBubbles()
    // snowflakes()
    let cycle
    let mons
    time.then(async() => {
        let isAvifSupported = await new Promise(resolve => {
            let n = new Image
            n.onerror = () =>resolve(false)
            n.onload = () => resolve(true)
            n.src = `data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=`
        })
        let avatars = ["river.webp","rikapika.webp","chlorineatt.webp","rainmint.webp","son_yukio.webp","aya.webp","may.webp","mila.webp","xzzy.webp","Dohaaa.webp","saintz.webp","elenfnf1.webp","niya.webp","mothmaddie.webp","kae.webp","lorex.webp","caelix.webp","lunza.webp","zee.webp","MRK.webp","kannadra.webp","rue.webp","znsxxe.webp","juaj.webp","ilikebugs2.webp","Professional_idiot.webp","gummicat.webp","kurispychips.webp","fourche7.webp","stav.webp","mochi.webp","khaoticgood.webp","stuella.webp","Lotus.webp","ka1ya1.webp","babby.webp","mai.webp","frannie4u.webp","ghostie.webp","glente.webp","Remi.webp","na22.webp","汝起亚.webp","valerie.webp","oli.webp","crazy.webp","zrake.webp","armaan.n.webp","auquamantis.webp","elipoopsrainbows.webp","lazy.webp","rurikuu.webp","novacans_.webp","naz.webp","west.webp","indie.webp","Lagia.webp","zoozi.webp","caevsz.webp","Violet.webp","kay_.stars.webp","morrfie.webp","kyn.webp","nova.webp","copy.webp","mr_clownette.webp","birdie.webp","lexi.webp","anarchy.webp","Leftover_Birthday-Cake.webp","gilly.webp"]
        if (isAvifSupported) avatars = avatars.map(o=>o.replace('.webp','.avif'))
        cycle = math.cycle(...ran.shuffle(...avatars))
        setInterval(bubbleWithAva, 2000)
    })
    let groudon
    pkm.then(m => {
        mons = m
        groudon = [...mons].find(o => o.dataset.name==='groudon')
        mons.delete(groudon)
        spawnPkmn()
    })
}

import *as math from '../num.js'
import *as string from '../str.js'
import *as h from '../handle.js'
import ran from '../random.js'

let hidden = false
function hide() {
    hidden = true
}
function show() {
    hidden = false
}
h.on(window, {
    /*blur(){
        hidden = true
    },
    focus(){
        hidden = false
    },*/
    pagehide: hide,
    pageshow: show
})
h.on(document, {
    freeze: hide,
    resume: show
})
const { frame, count } = $.id
let popped = 0
let POP = window.POP = function () {
    popped++ || count.fadeIn()
    count.show()
    count.textContent = popped.toLocaleString()
    switch (popped) {
        case 100: registerCSSAll({ '.bubble': { filter: 'drop-shadow(0px 0px 6px red)' } })
            break
        case 200: registerCSS('.sprite', {
            '--box-reflect': 'left'
        })
            break
        case 300:
            document.body.style.background = `linear-gradient(52deg, rgb(178 2 226) 0%, rgb(0 38 255) 100%) no-repeat`
            break
    }
    audio.play('pop.mp3')
}
//document.body.scrollLeft = innerHeight/2
frame.on({
    _load() {
        let t = new Number(3500)
        t.priority = 'background'
        ;(window.requestIdleCallback || scheduler.postTask?.bind(scheduler) ||  setTimeout)(() => {
            import('./images.js').then(images)
            console.debug("🐟 Loading the bg now...")
            // deadline ? console.debug(`Did timeout: `, deadline?.didTimeout) : console.debug('requestIdleCallback unsupported :(')
        }, t)
    }
}, new AbortController)
const parent = $('div #background .BG', {
    parent: document.body,
    attr: {
        _label: 'Pokémon swimming underwater with bubbles!',
        role: 'img'
    }
})
// let violations = 0
/*h.on(window, {
    'long-task': downgrade,
    // 'long-animation-frame':downgrade
}, new AbortController)
function downgrade(_, abort) {
    console.debug(`%cPerformance Violations: ${++violations}`, 'color:red;')
    if (violations === 23) {
        console.warn('Background disabled to improve user experience')
        abort()
        parent.hide(3).destroy()
        clearInterval(lower)
    }
}
function lowerViolations() {
    violations && --violations
}
let lower = setInterval(lowerViolations, 1000)
*/