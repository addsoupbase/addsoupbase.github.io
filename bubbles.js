
import './sound.js'
import * as v from './v4.js'
const h = window[Symbol.for('[[HModule]]')]
import dataURLS from './scripts/dataURLS.js'
audio.load('./media/pop.mp3')
const { css } = v
const { Proxify } = v
css.registerProperty('--size', '0px', false, '<length>',)
css.registerProperty('--width', '0px', false, '<length>',)
css.registerProperty('--frames', 0, false, '<integer>',)
const { background: bg, count, holder } = v.id
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
        audio.play('pop.mp3')
        let div = Proxify(this.closest('div'))
        count.textContent = `${++popped}`
        // count.ariaNotify?.(`Popped ${popped} bubbles`)
        div.dataset.popped = ''
        count.ariaHidden = 'false'
        let me = div.eltAt()
        div.getAnimations({ subtree: true }).forEach(o => o.pause())
        await div.animFrom('pop', { duration: 300, iterations: 1, easing: 'ease', fill: 'none' }).finished
        let picture = Proxify(div.querySelector('foreignObject').firstElementChild)
        picture.className = 'preview'
        let img = Proxify(div.firstElementChild.querySelector('img'))
        img.className = 'avatarpopped'
        img.nextNode = v.esc`<span class="caption">${img.title}</span>`
        div.style.willChange = 'transform,filter'
        div.animFrom('fade_in', { duration: 300, iterations: 1 })
        div.replaceChildren(picture.valueOf())
        div.animFrom('dissolve', { duration: 700, iterations: 1, delay: 2000, composite: 'add' })
            .onfinish = kill
    }
}, o => o.closest('div').dataset.popped === 'false', false, new AbortController)
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
                .animate([{ opacity: 0 }, { opacity: 1 }], {
                    easing: 'ease',
                    iterations: 1,
                    duration: 200,
                    fill: 'forwards'
                })
        }
    }
}, 50)
bg.delegate({
    animationend() {
        v.sel(this.parentElement).purge()
    }
})
let avatars  = ["xzzy","auquamantis","kannadra","kae","fourche7","glente","elipoopsrainbows","niya","mr_clownette","lorex","mochi","Dohaaa","armaan.n","zoozi","frannie4u","west","kyn","ilikebugs2","juaj","zee","znsxxe","ghostie","babby","kay_.stars","ka1ya1","river","gilly","lexi","na22","khaoticgood","indie","copy","nova","Leftover_Birthday-Cake","elenfnf1","caelix","mai","stuella","son_yukio","chlorineatt","oli","morrfie","gummicat","anarchy","rue","birdie","汝起亚","saintz","may","valerie","mila","Professional_idiot","Remi","Violet","zrake","novacans_","naz","caevsz","rurikuu","Lotus","Lagia","stav","aya","MRK","lunza","crazy","mothmaddie","rainmint","lazy","rikapika","kurispychips"]
for (let i = 0, { length } = avatars; i < length; ++i) {
    const pick = Math.floor(Math.random() * (i + 1));
    ({ 0: avatars[i], 1: avatars[pick] } = [avatars[pick], avatars[i]])
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
    let out = v.esc`<div class="holder" aria-hidden="true" style="will-change:transform;--size: ${size | 0};z-index: -1;left: ${x}px;top:${y}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <circle pointer-events="painted" r="${95 * scale}" cx="${100 * scale}" cy="${100 * scale}" fill="rgba(15, 20, 210, 0.4)" stroke="#1043E5" stroke-width="${10 * scale}">
        </circle>
        <path d="M ${180 * scale} ${100 * scale} A ${80 * scale} ${80 * scale} 0 0 0 ${100 * scale} ${20 * scale}" fill="none" stroke="white" stroke-width="${9 * scale}" pointer-events="painted">
        </path>
    </svg></div>`
    out.animFrom('wiggle', { easing: 'ease-in-out', duration: 200, direction: 'alternate' })
    out.animFrom('up', { duration: 10000, easing: 'linear', iterations: 1 })
        .onfinish = kill
    return out
}
function kill(e) {
    Proxify(this.effect.target).purge()
}
const avatar = (name, size = 60) => {
    const scale = size / 200
    let out = v.esc`<div data-popped="false" class="holder" name="ava" aria-hidden="true" style="--size: ${size}px;transform-origin:center center;z-index:0;top: ${range(0, innerHeight)}px;">
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
    </svg></div>`
    out.animFrom('yAxis', { duration: range(3000, 3500), easing: 'ease-in-out', direction: 'alternate' })
    out.animFrom('xAxis', { duration: 16000 * (Math.random() > .5 ? -1 : 1), easing: 'linear', iterations: 1 })
        .onfinish = kill
    return out
}
avabubble()
setInterval(avabubble, 2000)
tinybubble()
let pokemon = []
function pokemonthing(i) {
    let { 0: pkm, 1: frames } = i.split(':')
    let url = `data:image/png;base64,${dataURLS[i]}`
    let n = new Image
    n.src = url
    n.onload = () => {
        let scale = .5
        let duration = 38.0
        switch (pkm) {
            case 'kingdra':
                scale *= 1.3
                break
            case 'corsola':
                scale *= .7
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
                scale *= 7
                duration *= 8
                break
            case 'groudon':
                scale *= 3
                duration *= 1.2
                break
            case 'manaphy':
                scale *= 1.3
                break
            case 'alomomola':
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
            case 'basculegion-f':
            case 'basculegion-m':
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
            case 'basculin-white':
            case 'basculin-blue':
                scale *= 1.2
                break
            case 'clawitzer':
            case 'nihilego':
                scale *= 1.55
                break
        }
        scale *= range(.95, 1.05)
        duration *= range(.95, 1.05)
        pokemon.push({ name: pkm, scale: scale * 1.75, duration: duration * 1000 * .7 })
        css.registerCSSRaw(`.${pkm} {
                animation: slideshow ${frames * 150}ms steps(${frames}, end) infinite;
                --frames: ${frames}; 
                --width: ${n.naturalWidth}px;
                --size: ${n.naturalWidth}px;
                background-image: url(${url}); 
                height: ${n.naturalHeight}px;
                width: ${n.naturalWidth / frames}px;
                }`)
    }
}
for (let i in dataURLS) pokemonthing(i)
function spawnPkm(choice = pokemon[Math.floor(Math.random() * pokemon.length)]) {
    setTimeout(spawnPkm, range(500, 2000))
    if (!pokemon.length || isHidden()) return
    let scale = Math.random() > .5 ? -1 : 1
    let thing = v.esc`<div class="${choice.name} pkm${range(0, 1000) > 999 ? ' shiny' : ''}" style="top: ${Math.random() * innerHeight}px;transform:scale(${1.5 * choice.scale * scale}, ${1.5 * choice.scale})"></div>`
        .setParent(bg)
    thing.animFrom('xAxis', { duration: choice.duration * scale, iterations: 1, easing: 'linear', })
        .onfinish = kill
}
spawnPkm()