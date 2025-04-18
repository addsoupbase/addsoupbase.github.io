let regex = /[\w\.\-]+\.(webp|png|gif|jpe?g)/
function images({ avatars, mons }) {

    let pop = new Audio('media/pop.mp3')
    // on(document, {
    // visibilitychange() {
    // let func = document.hidden ? o => o.pauseAnims() : o => o.resumeAnims()
    // $.qsa('*').forEach(func)
    // }
    // })
    let bg = parent
    const frameDuration = 135
    const duration = 12_000
    const cycle = math.cycle(...ran.shuffle(...avatars))
    let holding = false
    bg.delegate({
        pointerdown1: click
    }, o =>
        o.classList.contains('bubble') && o.flags === 0
    ).debounce({
        pointermove({ x, y }) {
            holding && makeBubble(`${x}px`, `${y}px`).fadeIn(300)
        }
    }, 30)
        .on({
            pointerup() {
                holding = false
            },
            pointerdown(e) {
                console.log(e)
                this.setPointerCapture(e.pointerId)
                holding = true
            }
        })
    async function click(e) {
        e.stopImmediatePropagation()
        let { x, y } = e
        this.pauseAnims()
        pop.currentTime = 0
        pop.play()
        this.fadeOut(300)
        this.flags = 1
        await this.animate([{ transform: '' }, { transform: 'scaleX(2) scaleY(2)', }], { duration: 300, easing: 'ease-in-out', composite: 'accumulate', }).finished
        let [name] = this.firstElementChild.src.match(regex)[0].split(/\.(webp|png|gif|jpe*g)/)
        let me = $('div.ava .tar', {
            styles: {
                'backgroundImage': `url(${this.firstElementChild.src})`
            },
            attributes: {
                _hidden:'true',
                alt: name,
            },
            parent: bg,
        }, $('p.displayName', { txt: '@' + string.upper(name) }))
        this.remove()
        me.fadeIn()
        me.setStyles({ transform: `translate(${x - 25}px, ${y - 25}px)` })
        await me.animate([{}, { opacity: 0, filter: 'blur(20px) brightness(-100%)' }], { duration: 1000, delay: 2000 }).finished
        me.destroy()
    }
    function bubbleWithAva(image = cycle.next) {
        if (document.hidden) return
        const { src } = image
        let n = $('div.bubble', {
            attr: {
                _hidden:'true',
                width: 50, height: 50
            }, parent
        })
        let settings = ran.coin
            ? [{ transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }, { transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` },]
            : [{ transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` }, { transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }]
        n.animate(settings, { duration }).finished.then(() => n.destroy())
        const c = ran.range(0, innerHeight)
        n.animate([{ transform: `translate(0, ${c}px)` }, { transform: `translate(0, ${c - 200}px)` }], { composite: 'accumulate', easing: 'ease-in-out', duration: ran.range(2000, 3000), iterations: 1 / 0, direction: 'alternate' })
        const out = $('img.ava', {
            parent: n,
            attributes: {
                src,
                // alt: src,
                _hidden:'true',

                width: 50,
                height: 50,
                draggable: false
            }
        })
        out.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${ran.choose(360, -360)}deg)` }], { composite: 'accumulate', duration: 80000, iterations: 1 / 0, easing: 'linear' })
    }
    function createAnimationForSpritesheet(image) {
        let me = $(`div.${image[Symbol.for('name')]}.sprite`, {
            parent, attr: {
                _hidden:'true',
            }
        })
        me.animate([{
            'backgroundPositionX': '0px'
        },
        {
            'backgroundPositionX': `-${image.width}px`
        }
        ], { easing: `steps(${image[Symbol.for('width')]},end)`, duration: frameDuration * image[Symbol.for('width')], iterations: 1 / 0 })
        ran.jackpot(1000)&& me.classList.add('shiny')
            return me 
    }
    async function spawnPkmn() {
        setTimeout(spawnPkmn, ran.range(500, 2000))
        if (document.hidden) return
        let pick = ran.choose(...mons)
        const element = createAnimationForSpritesheet(pick)
        element.fadeIn()
        let { coin } = ran
        element.setStyles({ transform: `translateY(${ran.range(0, innerHeight)}px) scaleX(${coin ? '-1' : '1'})`, })
        let { offsetWidth } = element
        let settings = coin
            ? [{ transform: `translate(calc(100vw + ${offsetWidth}px), 0)` }, { transform: `translate(calc(-10vw - ${offsetWidth}px), 0)` },]
            : [{ transform: `translate(calc(-10vw - ${offsetWidth}px), 0)` }, { transform: `translate(calc(100vw + ${offsetWidth}px), 0)` }],
            duration = 15000
        switch (pick[Symbol.for('name')]) {
            case 'wailord': duration = 300400; break
            case 'wishiwashischool': duration = 50400; break
            case 'kyogre': case 'kyogreprimal': duration = 20000; break
            case 'luvdisc': duration = 10000; break;
            case 'sharpedo': case 'carvanha': duration = 8300; break
            case 'corsola': duration = 25000; break
            case 'wishiwashi': duration = 20_000; break
            case 'qwilfish': duration = 14_000; break
            //        case 'corsola': element.animate([{transform: 'rotateZ(0deg)'}, {transform: `rotateZ(360deg)`}], {composite:'add',easing:'linear',duration:5000, iterations:1/0,direction:coin?'reverse':'normal'})
        }
        duration *= 1.6
        duration *= ran.range(.9, 1.1)
        await element.animate(settings, { easing: 'linear', duration, composite: 'accumulate', fill: 'forwards' }).finished
        await element.fadeOut()
        element.destroy()
    }
    setInterval(bubbleWithAva, 2000)
    spawnPkmn()
    function makeBubble(x, y) {
        let bubbl = $('<div class="bubble" style="pointer-events:none;"></div>', { parent })
        bubbl.flags = 1
        let num = ran.range(13, 23)
        bubbl.setStyles({ width: `${num}px`, height: `${num}px`, left: x ?? `${ran.range(0, innerWidth)}px`, top: y ?? '100%' })
        bubbl.animate([{ transform: `translateX(-10px)` }, { transform: 'translateX(10px)' }], { iterations: 1 / 0, duration: 220, direction: 'alternate', easing: 'ease-in-out', composite: 'add' })
        bubbl.animate([{ transform: `translateY(0px)`, }, { transform: `translateY(-110vh)` }], { easing: 'linear', duration: 8000, composite: 'add' }).finished
            .then(() => bubbl.destroy()
            )
        return bubbl
    }
    function tinyBubbles(again = true) {
        again && setTimeout(tinyBubbles, ran.range(1000, 1200))
        if (document.hidden) return
        makeBubble()
    }
    tinyBubbles()
}
import $ from '../yay.js'
import * as math from '../num.js'
import * as string from '../str.js'
import * as h from '../handle.js'
import ran from '../random.js'
const iframe = $.qs('object')
//document.body.scrollLeft = innerHeight/2
async function go() {
    try {
        iframe.contentWindow.final = function () {
            import('./images.js').then(images)
            console.debug("🐟 Loading the bg now...")
        }
    }
    catch {
        await h.wait(1000)
        go()
    }
}
go()
const parent = $('div #background', {
    parent: document.body
})