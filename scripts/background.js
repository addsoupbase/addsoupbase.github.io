import {registerCSS, registerCSSAll} from "../csshelper.js"

let regex = /[\w.\-%汝起亚]+\.(?:webp|a?png|gif|jpe?g)/
let all = document.getElementsByTagName('*')
function isHidden() {
    return all.length > 135 || hidden||!!document.fullscreenElement || document.hidden || document.visibilityState === 'hidden'
}

async function images({time, colorful, birthday}) {
    let pop = new Audio('media/pop.mp3')
    let {avatars, mons} = await time
    if (birthday) {
        $.body.animate([{'backdrop-filter':'hue-rotate(0deg)',},{'backdrop-filter':'hue-rotate(360deg)'}], {
            duration:50_000,
            iterations:1/0,
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
    const cycle = math.cycle(...ran.shuffle(...avatars))
    let holding = false
    bg.delegate({
            pointerdown: click
        }, o =>
            o.classList.contains('bubble') && o.flags === 0,
        false,
        new AbortController
    ).debounce({
        pointermove({x, y}) {
            holding && makeBubble(`${x}px`, `${y}px`).fadeIn(300)
        }
    }, 80)
    .on({
        pointerup() {
            holding = false
        },
        pointerdown(e) {
            this.setPointerCapture(e.pointerId)
            holding = true
        }
    })

    async function click(e) {
        e.stopImmediatePropagation()
        let {transform} = this.computed
        this.pauseAnims()
        pop.currentTime = 0
        await Promise.race([pop.play(), h.wait(350)])
        POP()




        this.fadeOut(300)
        this.flags = 1
        await this.animate([{transform: ''}, {transform: 'scaleX(2) scaleY(2)',}], {
            duration: 300,
            easing: 'ease-in-out',
            composite: 'accumulate',
        }).finished
        let {0: name} = this.firstElementChild.src.match(regex)[0].split(/\.(?:webp|a?png|gif|jpe?g)/)
        if (name.includes('%')) name = decodeURIComponent(name)
        let src = this.firstElementChild.src
        let me = $(`div.ava .tar .${name}`, {
            styles: {
                'backgroundImage': `url(${src})`
            },
            attributes: {
                _hidden: 'true',
                alt: name,
            },
            parent: bg,
        }, $('p.displayName', {txt: '@' + string.upper(name)}))
        this.remove()
        me.fadeIn()
        me.setStyles({transform})
        await me.animate([{opacity:1}, {opacity: 0, filter: 'opacity(0%) grayscale(100%) blur(20px) brightness(-100%)'}], {
            duration: 1000,
            delay: 2000,
            composite:'add'
        }).finished
        me.destroy()
    }

    function bubbleWithAva(image = cycle.next) {
        if (isHidden()) return
        const {src} = image
        let n = $('div.bubble', {
            attr: {
                _hidden: 'true',
                width: 50, height: 50
            }, parent
        })
        if (birthday) {
            let image = ran.choose(...colorful)

            n.animate('255 0 0,255 127 0,255 255 0,127 255 0,0 255 0,0 255 127,0 255 255,0 127 255,255 0 255,255 0 127'.split(',').map(o=>({
                filter:`drop-shadow(0px 0px 10px rgb(${o}))`
            })), {
                duration: 2000 * ran.range(.8, 1.2),
                iterations: 1/0,
                easing: 'linear',
            })
            n.setStyles({'background-image': `url("${image}")`})
        }
        let settings = ran.coin
            ? [{transform: `translateX(calc(100vw + ${n.offsetWidth}px))`}, {transform: `translateX(calc(-10vw - ${n.offsetWidth}px))`},]
            : [{transform: `translateX(calc(-10vw - ${n.offsetWidth}px))`}, {transform: `translateX(calc(100vw + ${n.offsetWidth}px))`}]
        n.animate(settings, {duration}).finished.then(() => n.destroy())
        const c = ran.range(0, innerHeight)
        n.animate([{transform: `translate(0, ${c}px)`}, {transform: `translate(0, ${c - 200}px)`}], {
            composite: 'accumulate',
            easing: 'ease-in-out',
            duration: ran.range(3000, 3500),
            iterations: 1 / 0,
            direction: 'alternate'
        })
        $('img.ava', {
            parent: n,
            styles:{
                '--user-drag':'none'
            },
            attributes: {
                src,
                // alt: src,
                _hidden: 'true',
                width: 50,
                height: 50,
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
       if (image[Symbol.for('name')] ==='groudon') {
       dura *= 2
       }
        let me = $(`div.${image[Symbol.for('name')]}.sprite`, {
            parent, attr: {
                _hidden: 'true',
            }
        })
        me.animate([{
            'backgroundPositionX': '0px'
        },
            {
                'backgroundPositionX': `-${image.width}px`
            }
        ], {
            easing: `steps(${image[Symbol.for('width')]},end)`,
            duration: dura * image[Symbol.for('width')],
            iterations: 1 / 0
        })
        ran.jackpot(1000) && me.classList.add('shiny')
        return me
    }
    let groudon = [...mons].find(o=>o.src.includes('groudon'))
    mons.delete(groudon)
    async function spawnPkmn() {
        setTimeout(spawnPkmn, ran.range(500, 2000))
        if (isHidden() || !mons) return
        let pick = ran.choose(...mons)
        if (ran.jackpot(10_000))
        pick = groudon
        const element = createAnimationForSpritesheet(pick)
        element.fadeIn()
        let {coin} = ran
        element.setStyles({transform: `translateY(${ran.range(0, innerHeight)}px) scaleX(${coin ? '-1' : '1'})`,})
        let {offsetWidth} = element
        let settings = coin
                ? [{transform: `translate(calc(100vw + ${offsetWidth}px), 0)`}, {transform: `translate(calc(-10vw - ${offsetWidth}px), 0)`},]
                : [{transform: `translate(calc(-10vw - ${offsetWidth}px), 0)`}, {transform: `translate(calc(100vw + ${offsetWidth}px), 0)`}],
            duration = 15000
        switch (pick[Symbol.for('name')]) {
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
            case'lanturn':
            case'bruxish':
            case 'gorebyss':
            case 'huntail':
            case 'jellicent_m':
            case "jellicent_f":
            case 'seaking':
            case 'arctovish':
            case 'nihilego':
            case 'lumineon':
            case'sharpedo':
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

    setInterval(bubbleWithAva, 2000)
    spawnPkmn()

    function makeBubble(x, y) {
        let bubbl = $('<div class="bubble" style="pointer-events:none;"></div>', {
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
        bubbl.animate([{transform: `translateX(-10px)`}, {transform: 'translateX(10px)'}], {
            iterations: 1 / 0,
            duration: 220,
            direction: 'alternate',
            easing: 'ease-in-out',
            composite: 'add'
        })
        bubbl.animate([{transform: `translateY(0px)`,}, {transform: `translateY(-110vh)`}], {
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
        if (isHidden()) return
        makeBubble()
    }

    tinyBubbles()
}

import $ from '../yay.js'
import * as math from '../num.js'
import * as string from '../str.js'
import * as h from '../handle.js'
import ran from '../random.js'

let hidden = false
h.on(window, {
    /*blur(){
        hidden = true
    },
    focus(){
        hidden = false
    },*/
    pagehide() {
        hidden = true
    },
    pageshow() {
        hidden = false
    }
})
const {frame, count} = $.id
let popped = 0
let POP = window.POP = function() {
    popped++ || count.fadeIn()
    count.show()
    count.textContent =popped.toLocaleString()
    switch(popped) {
        case 100: registerCSSAll({'.bubble':{filter:'drop-shadow(0px 0px 6px red)'}})
            break
        case 200: registerCSS('.sprite', {
            '--box-reflect': 'left'
        })
            break
        case 300:
            document.body.style.background = `linear-gradient(52deg, rgb(178 2 226) 0%, rgb(0 38 255) 100%) no-repeat`
            break
    }
}
//document.body.scrollLeft = innerHeight/2
frame.on({
    _load() {
        (window.requestIdleCallback || window.queueMicrotask || setTimeout)(deadline => {
            import('./images.js').then(images)
            console.debug("🐟 Loading the bg now...")
            deadline ? console.debug(`Did timeout: `, deadline?.didTimeout) : console.debug('requestIdleCallback unsupported :(')
        }, {timeout: 3000})
    }
},false,new AbortController())
const parent = $('div #background .BG', {
    parent: document.body,
    attr: {
        _label: 'Pokemon swimming deep underwater with bubbles',
        role: 'img'
    }
})