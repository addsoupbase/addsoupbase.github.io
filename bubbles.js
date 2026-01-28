
import './sound.js'
import preload from '../webcomponents/cel-runner.js'
import * as v from './v4.js'
if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    throw Error('User turned on prefers reduced motion')
}
let mons = ["seadra-44","relicanth-40","mantine-68","wailmer-46","qwilfish_hisui-32","feebas-72","jellicent_m-46","luvdisc-96","qwilfish-32","sharpedo-68","huntail-32","jellicent_f-46","arrokuda-40","clawitzer-40","wishiwashi-32","tentacool-36","basculegion_f-68","mantyke-40","wishiwashischool-90","gorebyss-70","remoraid-32","basculegion_m-68","inkay-36","lumineon-40","basculin_blue-24","finneon-52","lanturn-32","kyogreprimal-80","arctovish-40","alomomola-96","eelektross-68","manaphy-40","kingdra-36","basculin_white-24","tentacruel-36","bruxish-96","seaking-36","corsola-36","overqwil-44","wailord-90","phione-40","nihilego-62","goldeen-80","dhelmise-64","tynamo-24","carvanha-24","corsolagalar-36","basculin-24","kyogre-80","horsea-40"]
let pokemons = []
console.log(mons)
const h = window[Symbol.for('[[HModule]]')]
audio.load('./media/pop.mp3')
const { css } = v
const { Proxify } = v
preload(...mons.map(o => {
    let x = +o.match(/-(\d+)$/)[1]
    pokemonthing(o.match(/\w+/), o)
    return {
        x,
        y: 1,
        src: `./seasprites/${o}.png`
    }
}))
onload = null
// css.registerProperty('--size', '0px', false, '<length>',)
// css.registerProperty('--width', '0px', false, '<length>',)
// css.registerProperty('--frames', 0, false, '<integer>',)
const {
    brushsize, undo, color,
    background: bg, count, holder, senddrawing, sendmessage, papericon, senddrawingform, paper } = v.id
papericon.on({
    _click() {
        sendmessage.hide()
        senddrawing.show()
        this.hide()
        paper.scrollIntoView()
    }
})
color.on({
    change() {
        paper.color = this.value
    }
})
undo.on({
    click() {
        paper.undo()
    }
})
brushsize.on({
    change() {
        paper.brushsize = this.value
    }
})
let isHolding = false
/*  bg.delegate({
      contentvisibilityautostatechange(e) {
          this.style.willChange = e.skipped ? '' : 'transform'
      },
  }, o => o.className.includes('pkm'))*/
let popped = 0
bg.delegate({
    async pointerdown(e) {
        e.stopImmediatePropagation()
        count.style.opacity = 1
        count.style.visibility='visible'
        audio.play('pop.mp3')
        let parent = Proxify(this.closest('span'))
        count.textContent = `${++popped}`
        // count.ariaNotify?.(`Popped ${popped} bubbles`)
        parent.dataset.popped = 'true'
        count.ariaHidden = 'false'
        let me = parent.eltAt()
        let pic = Proxify(me.querySelector('div'))
        // pic.parent = bg
        let { x, y } = parent.getBoundingClientRect()
        parent.getAnimations({ subtree: true }).forEach(o => o.cancel())
        parent.style.left = `${x}px`
        parent.style.top = `${y}px`
        await parent.animFrom('pop', { duration: 300, iterations: 1, easing: 'ease', fill: 'none' }).finished
        pic.classList.add('preview', 'avatarpopped', 'popped')
        // pic.parent = bg
        parent.replaceChildren(pic.valueOf())
        pic.style.willChange = 'transform,filter'
        pic.animFrom('fade_in', { duration: 300, iterations: 1 })
        pic.animFrom('dissolve', { duration: 700, iterations: 1, delay: 2000, composite: 'add' }).onfinish = kill
    }
}, o => o.closest('span')?.dataset.popped === 'false', false, new AbortController)
bg.on({
    pointerdown(e) {
        this.setPointerCapture(e.pointerId)
        isHolding = true
    },
    pointerup() {
        isHolding = false
    }
})
bg.debounce({
    pointermove({ pageX, pageY }) {
        if (isHolding) {
            bubble(range(15, 20), pageX, pageY).setParent(bg)
                .animFrom('fade_in', { duration: 200, fill: 'forwards', iterations: 1 })
        }
    }
}, 60)
bg.delegate({
    animationend() {
        // v.sel(this.parentElement).purge()
    }
})
let fileFormat = await new Promise(resolve => {
    let n = new Image
    n.src = `data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=`
    n.onload = () => resolve('.avif')
    n.onerror = () => {
        let n = document.createElement('canvas')
        n.width = n.height = 0
        resolve(n.toDataURL('image/webp').indexOf('data:image/webp') == 0 ? '.webp' : '.jpg')
    }
})
let avatars  = ["xzzy","auquamantis","kannadra","kae","fourche7","glente","elipoopsrainbows","niya","mr_clownette","lorex","mochi","Dohaaa","armaan.n","zoozi","frannie4u","west","kyn","ilikebugs2","juaj","zee","znsxxe","ghostie","babby","kay_.stars","ka1ya1","river","gilly","lexi","na22","khaoticgood","indie","copy","nova","Leftover_Birthday-Cake","elenfnf1","caelix","mai","stuella","son_yukio","chlorineatt","oli","morrfie","gummicat","anarchy","rue","birdie","汝起亚","saintz","may","valerie","mila","Professional_idiot","Remi","Violet","zrake","novacans_","naz","caevsz","rurikuu","Lotus","Lagia","stav","aya","MRK","lunza","crazy","mothmaddie","rainmint","lazy","rikapika","kurispychips"]
for (let i = 0, { length } = avatars; i < length; ++i) {
    const pick = Math.floor(Math.random() * (i + 1))
    let p = avatars[i]
    css.registerCSSRaw(`.user-${CSS.escape(p)} {background-image: url("./media/avatars/${p}${fileFormat}")}`)
        ; ({ 0: avatars[i], 1: avatars[pick] } = [avatars[pick], avatars[i]])
}
let i = 0
function isHidden() {
    return document.hidden || !holder.classList.contains('clamped') && !holder.classList.contains('hidden')
}
function avabubble() {
    if (isHidden()) return
    avatar(avatars[i++ % avatars.length]).setParent(bg)
}
function tinybubble() {
    setTimeout(tinybubble, range(1000, 1400))
    if (isHidden()) return
    bubble(range(15, 20)).setParent(bg)
}
function range(MIN, MAX) {
    return Math.random() * (MAX - MIN) + MIN
}
const bubble = (size, x = range(0, innerWidth), y = innerHeight) => {
    const scale = size / 200
    let out = v.esc`<div class="holder tinybubble" aria-hidden="true" style="will-change:transform;--size: ${size | 0};z-index: -1;left: ${x}px;top:${y}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <circle pointer-events="painted" r="${95 * scale}" cx="${100 * scale}" cy="${100 * scale}" fill="rgba(15, 20, 210, 0.4)" stroke="#1043E5" stroke-width="${10 * scale}">
        </circle>
        <path d="M ${180 * scale} ${100 * scale} A ${80 * scale} ${80 * scale} 0 0 0 ${100 * scale} ${20 * scale}" fill="none" stroke="white" stroke-width="${9 * scale}" pointer-events="painted">
        </path>
    </svg></div>`
    out.animFrom('wiggle', { easing: 'ease-in-out', duration: 180, direction: 'alternate' })
    out.animFrom('up', { duration: 10000, easing: 'linear', iterations: 1 })
        .onfinish = kill
    return out
}
function kill() {
    Proxify(this.effect.target).purge()
}
const avatar = (name, size = 60) => {
    const scale = size / 200
    let out = v.esc`<span data-popped="false" class="holder" name="ava" aria-hidden="true" style="--size: ${size}px;transform-origin:center center;z-index:0;top: ${range(0, innerHeight)}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <circle cursor="pointer" pointer-events="painted" r="${95 * scale}" cx="${100 * scale}" cy="${100 * scale}" fill="rgba(15, 20, 210, 0.4)" stroke="#1043E5" stroke-width="${10 * scale}">
        </circle>
        <foreignObject x="${30 * scale}" y="${30 * scale}" width="${140 * scale}" pointer-events="painted"  height="${140 * scale}" cursor="pointer">
        <div class="avatar user-${name}" title="${name}"></div>    
        </foreignObject>
        <path cursor="pointer" d="M ${180 * scale} ${100 * scale} A ${80 * scale} ${80 * scale} 0 0 0 ${100 * scale} ${20 * scale}" fill="none" stroke="white" stroke-width="${9 * scale}" pointer-events="painted">
        </path>
    </svg></span>`
    out.animFrom('yAxis', { duration: range(3000, 3500), easing: 'ease-in-out', direction: 'alternate' })
    out.animFrom('xAxis', { duration: 16000 * (Math.random() > .5 ? -1 : 1), easing: 'linear', iterations: 1 })
        .onfinish = kill
    return out
}
avabubble()
setInterval(avabubble, 2000)
tinybubble()
function pokemonthing(i, name) {
    let pkm = i[0]
    let scale = .5
    let duration = 38.0
    switch (pkm) {
        case 'kingdra':
            scale *= 1.3
            break
        case 'corsola':
            scale *= .87
            duration *= 1.5
            break
        case 'wishiwashischool':
            scale *= 2
            duration *= 4
            break
        case 'wishiwashi':
            duration *= 2
            scale *= .8
            break
        case 'jellicent_m':
        case 'jellicent_f':
            scale *= 1.5
            duration *= 1.6
            break
        case 'gorebyss':
        case 'huntail':
        case 'sharpedo':
            scale *= 1.6
            duration *= 1.2
            break
        case 'kyogre':
            scale *= 3
            duration *= 2
            break
        case 'kyogreprimal':
            scale *= 4
            duration *= 2.5
            break
        case 'wailord':
            if (document.querySelector('.wailord')) return
            scale *= 5.3
            duration *= 8
            break
        case 'arctovish':
            scale *= 2
            break
        case 'relicanth':
            scale *= 1.6
            break
        case 'groudon':
            scale *= 3
            duration *= 1.2
            break
        case 'manaphy':
            scale *= 1.3
            break
        case 'eelektross':
            scale *= 1.5
            break
        case 'alomomola':
            scale *= 2
            break
        case 'qwilfish':
        case 'qwilfish_hisui':
            scale *= 1.3
            break
        case 'bruxish':
            scale *= 1.6
            break
        case 'wailmer':
            scale *= 2.3
            duration *= 2
            break
        case 'mantine':
            scale *= 1.7
            duration *= .9
            break
        case 'palafin':
            scale *= 1.4
            break
        case 'seaking':
            scale *= 1.4
            break
        case 'skrelp':
        case 'luvdisc':
            scale *= .8
            break
        case 'basculegion_f':
        case 'basculegion_m':
            scale *= 1.4
            break
        case 'overqwil':
            scale *= 1.5
            break
        case 'lanturn':
        case 'lumineon':
            scale *= 1.5
            break
        case 'basculin':
        case 'basculin_white':
        case 'basculin_blue':
            scale *= 1.2
            break
        case 'tentacruel':
            scale *= 2
            break
        case 'clawitzer':
        case 'nihilego':
            scale *= 1.75
            break
        // scale *= range(.90, 1.1)
        // duration *= range(.90, 1.1)
    }
    pokemons.push({ name, scale: scale * 2.5, duration: duration * 1000 * .7, pkm: i })
}
function spawnPkm(choice = pokemons[Math.floor(Math.random() * pokemons.length)]) {
    setTimeout(spawnPkm, range(500, 2500))
    if (!pokemons.length || isHidden()) return
    let scale = Math.random() > .5 ? -1 : 1
    let dura = 17
    switch (choice.name.match(/\w+/)[0]) {
        case 'phione':
        case 'manaphy':
        case 'wailmer':
        case 'mantyke':
            dura += 6
            break
    }
    let thing = v.esc`<cel-runner aria-hidden="true" dura="${dura}ms" src="./seasprites/${choice.name}.png" class="${choice.pkm} pkm${range(0, 1000) > 999 ? ' shiny' : ''}" style="top: ${Math.random() * innerHeight}px;scale:${scale * choice.scale} ${choice.scale}"></cel-runner>`
        .setParent(bg)
        .animFrom('xAxis', { composite: 'add', iterations: 1, duration: choice.duration * scale, easing: 'linear' })
        .onfinish = kill
}
spawnPkm()