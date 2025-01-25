
function images({ avatars, mons }) {
    let bg = parent
    const frameDuration = 135
    const duration = 12_000
    const cycle = math.cycle(...ran.shuffle(...avatars))
    async function click({ x, y }) {
        this.getAnimations().forEach(o => o.pause())
        getProxy(this).fadeout(300)
        this.onclick = null
        await this.animate([{ transform: '' }, { transform: 'scaleX(2) scaleY(2)', }], { duration: 300, easing: 'ease-in-out', composite: 'add' }).finished
        let name =
            new URL(this.firstElementChild.src, location).pathname.split('/').at(-1).split('.')[0]
        let me = $('div.ava .tar', {
            styles: {
                'background-image': `url(${this.firstElementChild.src})`
            },
            attr: {
                alt: name,
            },
            parent: bg,
            os: [$('p.displayName', { txt: '@' + string.upper(name) })]
        })
        this.remove()
        me.fadein()
        me.styleMe({ transform: `translate(${x - 25}px, ${y - 25}px)` })
        await me.animate([{ filter: '' }, { opacity: 0, filter: 'blur(20px) brightness(-100%)' }], { duration: 1000, delay: 2000 }).finished
        me.destroy()
    }
    function bubbleWithAva(image = cycle.next) {
        if (document.hidden) return
        const { src } = image
        let n = $('div.bubble', { width: 50, height: 50, parent })
        let settings = ran.coin
            ? [{ transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }, { transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` },]
            : [{ transform: `translateX(calc(-10vw - ${n.offsetWidth}px))` }, { transform: `translateX(calc(100vw + ${n.offsetWidth}px))` }]
        n.animate(settings, { duration }).finished.then(() => n.destroy())
        const c = ran.range(0, innerHeight)
        n.animate([{ translate: `0 ${c}px` }, { translate: `0 ${c - 200}px` }], { easing: 'ease-in-out', duration: ran.range(2000, 3000), iterations: 1 / 0, direction: 'alternate' })

        n.onclick = click
        const out = $('img.ava', {
            parent: n,
            attr: {
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
        let me = $(`div.${image.__name}.sprite`,parent)
        me.animate([{
            'backgroundPositionX': '0px'
        },
        {
            'backgroundPositionX': `-${image.width}px`
        }
        ], { easing: `steps(${image.__width},end)`, duration: frameDuration * image.__width, iterations: 1 / 0 })
        return me
    }
    async function spawnPkmn() {
        setTimeout(spawnPkmn, ran.range(1000, 1600))
        if (document.hidden) return
        let pick = ran.choose(...mons)
        const element = createAnimationForSpritesheet(pick)
        element.fadein()
        let { coin } = ran
        element.styleMe({ transform: `translateY(${ran.range(0, innerHeight)}px) scaleX(${coin ? '-1' : '1'})`, })

        let settings = coin
            ? [{ translate: `calc(100vw + ${element.offsetWidth}px) 0` }, { translate: `calc(-10vw - ${element.offsetWidth}px) 0` },]
            : [{ translate: `calc(-10vw - ${element.offsetWidth}px) 0` }, { translate: `calc(100vw + ${element.offsetWidth}px) 0` }],
            duration = 15000
        switch (pick.__name) {
            case 'wailord': duration = 30400; break
            case 'sharpedo': case 'carvanha': duration = 8300; break
            //        case 'corsola': element.animate([{transform: 'rotateZ(0deg)'}, {transform: `rotateZ(360deg)`}], {composite:'add',easing:'linear',duration:5000, iterations:1/0,direction:coin?'reverse':'normal'})
        }
        duration *= 0.9
        await element.animate(settings, { easing: 'linear', duration, composite: 'add',fill:'forwards' }).finished
        await element.fadeout()
        element.destroy()
    }
    setInterval(bubbleWithAva, 2000)
    spawnPkmn()
    async function tinyBubbles(again = true) {
        again && setTimeout(tinyBubbles, ran.range(1000, 1200))
        if (document.hidden) return
        let bubbl = $('div.bubble', parent)
        let num = ran.range(13, 23)
        bubbl.styleMe({ width: `${num}px`, height: `${num}px`, left: `${ran.range(0, innerWidth)}px`, top: '100%' })
        bubbl.animate([{ transform: `translateX(-10px)` }, { transform: 'translateX(10px)' }], { iterations: 1 / 0, duration: 200, direction: 'alternate', easing: 'ease-in-out', composite: 'add' })
        await bubbl.animate([{ transform: `translateY(0px)`, }, { transform: `translateY(-110vh)` }], { easing: 'ease-in', duration: 8000, composite: 'add' }).finished
        bubbl.destroy()
    }
    tinyBubbles()
}
import $, { getProxy, } from '../quick.js'
import { math, ran, string } from '../misc.js'
const iframe = $('iframe.center #frame', 
    document.body,
)
window.$=$
window.final = function () {
    window.final = () => {}
        import('./images.js').then(images);
        console.log("Loading the bg now...")
}
console.log('Sprites credit: https://sprites.pmdcollab.org/')
const parent = $('div #background', {   
    parent: document.body
})
