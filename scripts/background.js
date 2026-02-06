import * as v from '../v4.js'
import('./images.js').then(images)
const { css } = v
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
        o.classList.contains('bubble') && o.childElementCount && o.dataset.popped === 'false',
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
        let { transform } = this.getComputedStyle()
        this.getAnimations({ subtree: true }).forEach(o => o.pause())
        POP()
        this.dataset.popped = ''
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
        let me = v.esc`<div aria-hidden="true"  style="place-items:center;text-align:center;position:absolute;z-index: 3;display:inline-grid;">
        <img src="${src}"style="width:60px;height:60px;border-radius:100%;" draggable="false" alt="${name}">
        <span style="text-transform:capitalize">@${name}</span>
        </div>`
            .setParent(bg)
        this.remove()
        me.fadeIn()
        me.style.display='inline-grid'
        me.style.transform = transform
        await me.animate([{ opacity: 1 }, { transform: 'scale(0, 0)', opacity: 0, filter: 'opacity(0%) grayscale(100%) blur(20px) brightness(0%)' }], {
            duration: 1000,
            delay: 2000,
            composite: 'add',
            easing: 'ease'
        }).finished
        me.purge()
    }
    function bubbleWithAva(image = cycle.next) {
        if (isHidden()) return
        const src = `./media/avatars/${image}`
        let n = v.esc`<div class="bubble pop" data-popped="false" aria-hidden="true" style="z-index:3"></div>`
            .setParent(parent)
        if (birthday) {
            let image = ran.choose(...colorful)

            n.animate('255 0 0,255 127 0,255 255 0,127 255 0,0 255 0,0 255 127,0 255 255,0 127 255,255 0 255,255 0 127'.split(',').map(o => ({
                filter: `drop-shadow(0px 0px 10px rgb(${o}))`
            })), {
                duration: 2000 * ran.range(.8, 1.2),
                iterations: 1 / 0,
                easing: 'linear',
            })
            n.setStyle({ 'background-image': `url("${image}")` })
        }
        let settings = ran.coin
            ? [{ transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }, { transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` },]
            : [{ transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` }, { transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }]
        n.animate(settings, { duration }).finished.then(() => n.purge())
        const c = ran.range(0, innerHeight)
        n.animate([{ transform: `translate(0, ${c}px)` }, { transform: `translate(0, ${c - 200}px)` }], {
            composite: 'accumulate',
            easing: 'ease-in-out',
            duration: ran.range(3000, 3500),
            iterations: 1 / 0,
            direction: 'alternate'
        })
        v.esc`<img class="ava" style="--user-drag:none" src="${src}" decoding="async" aria-hidden="true" width="50" height="50" title="${image}" draggable="false">`
            .setParent(n)
        if (birthday) {
            n.pushNode($(`div .centerx .party .party${ran.choose(1, 2, 3)}`))
        }
        // out.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${ran.choose(360, -360)}deg)` }], { composite: 'accumulate', duration: 80000, iterations: 1 / 0, easing: 'linear' })
    }
    function createAnimationForSpritesheet(image) {
        let dura = frameDuration
        if (image.dataset.name === 'groudon') {
            dura *= 2
        }
        let me = v.esc`<div aria-hidden="true" class="${image.dataset.name} sprite"></div>`
            .setParent(parent)
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
        setTimeout(spawnPkmn, ran.range(1000, 2500))
        if (isHidden() || !mons) return
        let pick = ran.choose(...mons)
        if (ran.jackpot(10_000))
            pick = groudon
        const element = createAnimationForSpritesheet(pick)
        element.fadeIn()
        let { coin } = ran
        element.setStyle({ transform: `translateY(${ran.range(0, innerHeight)}px) scaleX(${coin ? '-1' : '1'})`, })
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
                case 'qwilfish_hisui':
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
                case 'bruxish':
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
        element.purge()
    }
    function makeSnowflake() {
        let flake = $`<div aria-hidden="true" class="snowflake" style="left:${ran.range(0, 100)}vw"></div>`
        parent.push(flake)
        flake.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(calc(100vh + 30px))' }], {
            duration: 17000,
            easing: 'linear',
            composite: 'add'
        }).finished.then(() => flake.purge())
        flake.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${ran.choose(-80, 80)}px)` }], {
            duration: 4000,
            iterations: 1 / 0,
            direction: 'alternate',
            easing: 'ease-in-out',
            composite: 'add'
        })
    }
    function makeBubble(x, y) {
        let bubbl = v.esc`<div aria-hidden="true" class="bubble" style="pointer-events:none;z-index:${ran.frange(1, 3)}"></div>`
            .setParent(parent)
        bubbl.flags = 1
        if (birthday) {
            let image = ran.choose(...colorful)
            bubbl.setStyle({
                'background-image': `url("${image}")`
            })
        }
        let num = ran.range(13, 23)
        bubbl.setStyle({
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
        bubbl.animate([{ transform: `translateY(0px)`, }, { transform: `translateY(-100vh)` }], {
            easing: 'linear',
            duration: 8000,
            composite: 'add'
        }).finished
            .then(() => bubbl.purge()
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
    time.then(async () => {
        let isAvifSupported = await new Promise(resolve => {
            let n = new Image
            n.onerror = () => resolve(false)
            n.onload = () => resolve(true)
            n.src = `data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=`
        })
        let avatars = ["rikapika.webp","river.webp","chlorineatt.webp","rainmint.webp","son_yukio.webp","aya.webp","mila.webp","may.webp","xzzy.webp","Dohaaa.webp","saintz.webp","elenfnf1.webp","niya.webp","kae.webp","mothmaddie.webp","lorex.webp","caelix.webp","lunza.webp","zee.webp","MRK.webp","kannadra.webp","rue.webp","juaj.webp","znsxxe.webp","ilikebugs2.webp","Professional_idiot.webp","gummicat.webp","kurispychips.webp","fourche7.webp","stav.webp","mochi.webp","khaoticgood.webp","stuella.webp","Lotus.webp","ka1ya1.webp","babby.webp","mai.webp","frannie4u.webp","ghostie.webp","Remi.webp","glente.webp","na22.webp","汝起亚.webp","valerie.webp","oli.webp","crazy.webp","zrake.webp","armaan.n.webp","auquamantis.webp","elipoopsrainbows.webp","lazy.webp","rurikuu.webp","novacans_.webp","naz.webp","west.webp","indie.webp","zoozi.webp","Lagia.webp","caevsz.webp","Violet.webp","kay_.stars.webp","morrfie.webp","kyn.webp","nova.webp","copy.webp","mr_clownette.webp","birdie.webp","lexi.webp","anarchy.webp","Leftover_Birthday-Cake.webp","gilly.webp"]
        if (isAvifSupported) avatars = avatars.map(o => o.replace('.webp', '.avif'))
        cycle = math.cycle(...ran.shuffle(...avatars))
        setInterval(bubbleWithAva, 2000)
    })
    let groudon
    pkm.then(m => {
        mons = m
        groudon = [...mons].find(o => o.dataset.name === 'groudon')
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
const { count } = v.id
let popped = 0
let POP = window.POP = function () {
    popped++ || count.fadeIn()
    count.style.visibility = ''
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

const parent = v.esc`<div id="background" class="BG" aria-label="Pokémon swimming underwater with bubbles!" role="img">
</div>`.setParent(document.body)
/*
`<div class="holder" name="ava" aria-hidden="true" style="z-index:0;top: ${range(0, innerHeight)}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <circle cursor="pointer" pointer-events="painted" r="${95 * scale}" cx="${100 * scale}" cy="${100 * scale}" fill="rgba(15, 20, 210, 0.4)" stroke="#1043E5" stroke-width="${10 * scale}">
        </circle>
        <foreignObject x="${30 * scale}" y="${30 * scale}" width="${140 * scale}" pointer-events="painted"  height="${140 * scale}" cursor="pointer">
            <picture>
                <source srcset="./media/avatars/${name}.avif" type="image/avif">
                <source srcset="./media/avatars/${name}.webp" type="image/webp">
                <img draggable="false" src="./media/avatars/${name}.jpg" class="avatar" title="${name}">
            </picture>
        </foreignObject>
        <path cursor="pointer" d="M ${180 * scale} ${100 * scale} A ${80 * scale} ${80 * scale} 0 0 0 ${100 * scale} ${20 * scale}" fill="none" stroke="white" stroke-width="${9 * scale}" pointer-events="painted">
        </path>
    </svg></div>`*/