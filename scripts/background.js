let regex = /[\w\.]+\.(webp|png|gif|jpe?g)/
import { on } from '../handle.js'
function images({ avatars, mons }) {
    let pop = new Audio('media/pop.mp3')
    on(document, {
        visibilitychange() {
            let func = document.hidden ? o => o.pauseAnims() : o => o.resumeAnims()
            $.qsa('*').forEach(func)
        }
    })
    let bg = parent
    const frameDuration = 135
    const duration = 12_000
    const cycle = math.cycle(...ran.shuffle(...avatars))
    bg.delegate({
        click
    }, o =>
        o.classList.contains('bubble') && o.flags === 0
    )
    async function click({ x, y }) {
        this.pauseAnims()
        pop.currentTime = 0
        pop.play()
        this.fadeOut(300)
        this.flags = 1
        await this.animate([{ transform: '' }, { transform: 'scaleX(2) scaleY(2)', }], { duration: 300, easing: 'ease-in-out', composite: 'add' }).finished
        let [name] = this.firstElementChild.src.match(regex)[0].split(/\.(webp|png|gif|jpe*g)/)
        let me = $('div.ava .tar', {
            styles: {
                'backgroundImage': `url(${this.firstElementChild.src})`
            },
            attributes: {
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
        let n = $('div.bubble', { attributes: { width: 50, height: 50 }, parent })
        let settings = ran.coin
            ? [{ transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }, { transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` },]
            : [{ transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` }, { transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }]
        n.animate(settings, { duration }).finished.then(() => n.destroy())
        const c = ran.range(0, innerHeight)
        n.animate([{ translate: `0 ${c}px` }, { translate: `0 ${c - 200}px` }], { easing: 'ease-in-out', duration: ran.range(2000, 3000), iterations: 1 / 0, direction: 'alternate' })
        const out = $('img.ava', {
            parent: n,
            attributes: {
                src,
                alt: src,
                width: 50,
                height: 50,
                draggable: false
            }
        })
        out.animate([{ rotate: '' }, { rotate: `${ran.choose(360, -360)}deg` }], { duration: 80000, iterations: 1 / 0, easing: 'linear' })
    }
    function createAnimationForSpritesheet(image) {
        let me = $(`div.${image[Symbol.for('name')]}.sprite`, { parent })
        me.animate([{
            'backgroundPositionX': '0px'
        },
        {
            'backgroundPositionX': `-${image.width}px`
        }
        ], { easing: `steps(${image[Symbol.for('width')]},end)`, duration: frameDuration * image[Symbol.for('width')], iterations: 1 / 0 })
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
            ? [{ translate: `calc(100vw + ${offsetWidth}px) 0` }, { translate: `calc(-10vw - ${offsetWidth}px) 0` },]
            : [{ translate: `calc(-10vw - ${offsetWidth}px) 0` }, { translate: `calc(100vw + ${offsetWidth}px) 0` }],
            duration = 15000
        switch (pick[Symbol.for('name')]) {
            case 'wailord': case 'wishiwashischool': duration = 30400; break
            case 'kyogre': case 'kyogreprimal': duration = 20000; break;
            case 'luvdisc': duration = 10000; break;
            case 'sharpedo': case 'carvanha': duration = 8300; break
            case 'corsola': duration = 25000; break
            //        case 'corsola': element.animate([{transform: 'rotateZ(0deg)'}, {transform: `rotateZ(360deg)`}], {composite:'add',easing:'linear',duration:5000, iterations:1/0,direction:coin?'reverse':'normal'})
        }
        duration *= 0.9
        await element.animate(settings, { easing: 'linear', duration, composite: 'add', fill: 'forwards' }).finished
        await element.fadeOut()
        element.destroy()
    }
    setInterval(bubbleWithAva, 2000)
    spawnPkmn()
    async function tinyBubbles(again = true) {
        again && setTimeout(tinyBubbles, ran.range(1000, 1200))
        if (document.hidden) return
        let bubbl = $('div.bubble', { parent })
        let num = ran.range(13, 23)
        bubbl.setStyles({ width: `${num}px`, height: `${num}px`, left: `${ran.range(0, innerWidth)}px`, top: '100%' })
        bubbl.animate([{ transform: `translateX(-10px)` }, { transform: 'translateX(10px)' }], { iterations: 1 / 0, duration: 220, direction: 'alternate', easing: 'ease-in-out', composite: 'add' })
        await bubbl.animate([{ transform: `translateY(0px)`, }, { transform: `translateY(-110vh)` }], { easing: 'linear', duration: 8000, composite: 'add' }).finished
        bubbl.destroy()
    }
    tinyBubbles()
}
import $ from '../yay.js'
import { math, ran, string } from '../misc.js'
const iframe = $.qs('iframe')
//document.body.scrollLeft = innerHeight/2

window.$ = $
iframe.contentWindow.final = function () {
    import('./images.js').then(images)
    console.debug("🐟 Loading the bg now...")
}
const parent = $('div #background', {
    parent: document.body
})