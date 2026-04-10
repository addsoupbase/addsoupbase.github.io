import './sound.js'
import preload from '../webcomponents/slide-show.js'
import * as v from './v4.js'
if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    throw Error('User turned on prefers reduced motion')
}
let mons ={alomomola:{Walk:{framesY:2,values:"8;8;8;8;8;8;8;8;8;8;8;8",frameWidth:24,frameHeight:48}},arctovish:{Walk:{framesY:2,values:"10;10;10;10",frameWidth:40,frameHeight:48}},arrokuda:{Walk:{framesY:2,values:"8;6;6;8;6;6",frameWidth:32,frameHeight:32}},basculegion:{Walk:{framesY:4,values:"10;8;8;8;10;8;8;8",frameWidth:56,frameHeight:72}},basculin:{Walk:{framesY:3,values:"6;6;6;6",frameWidth:32,frameHeight:40}},bruxish:{Walk:{framesY:2,values:"8;8;8;8;8;8;8;8;8;8;8;8",frameWidth:40,frameHeight:56}},carvanha:{Walk:{framesY:2,values:"6;6;6;6",frameWidth:32,frameHeight:48}},clawitzer:{Walk:{framesY:2,values:"8;12;8;12",frameWidth:40,frameHeight:56}},corsola:{Walk:{framesY:2,values:"8;10;8;10",frameWidth:24,frameHeight:32}},"corsola-galar":{Walk:{framesY:1,values:"8;10;8;10",frameWidth:24,frameHeight:32}},dhelmise:{Walk:{framesY:2,values:"10;10;6;6;10;10;6;6",frameWidth:48,frameHeight:96}},eelektross:{Walk:{framesY:2,values:"10;8;8;8;10;8;8;8",frameWidth:48,frameHeight:56}},feebas:{Walk:{framesY:2,values:"8;10;8;10;8;10;8;10",frameWidth:32,frameHeight:48}},finneon:{Walk:{framesY:2,values:"6;6;8;6;6;6;8;6",frameWidth:32,frameHeight:40}},goldeen:{Walk:{framesY:2,values:"10;10;10;10;10;10;10;10",frameWidth:32,frameHeight:40}},gorebyss:{Walk:{framesY:2,values:"14;6;8;8;8;8;6;6;6",frameWidth:48,frameHeight:64}},horsea:{Walk:{framesY:2,values:"8;12;8;12",frameWidth:24,frameHeight:48}},huntail:{Walk:{framesY:2,values:"8;8;8;8",frameWidth:40,frameHeight:56}},inkay:{Walk:{framesY:2,values:"8;10;8;10",frameWidth:24,frameHeight:40}},jellicent_f:{Walk:{framesY:2,values:"8;6;6;8;6;6;6",frameWidth:32,frameHeight:56}},jellicent_m:{Walk:{framesY:2,values:"8;6;6;8;6;6;6",frameWidth:24,frameHeight:56}},kingdra:{Walk:{framesY:2,values:"8;10;8;10",frameWidth:40,frameHeight:64}},kyogre:{Walk:{framesY:2,values:"8;8;8;8;8;8;8;8;8;8",frameWidth:64,frameHeight:72}},kyogre_primal:{Walk:{framesY:2,values:"8;8;8;8;8;8;8;8;8;8",frameWidth:64,frameHeight:72}},lanturn:{Walk:{framesY:2,values:"8;8;8;8",frameWidth:32,frameHeight:48}},lumineon:{Walk:{framesY:2,values:"10;10;10;10",frameWidth:32,frameHeight:40}},luvdisc:{Walk:{framesY:2,values:"8;8;8;8;8;8;8;8;8;8;8;8",frameWidth:24,frameHeight:40}},manaphy:{Walk:{framesY:1,values:"6;6;6;2;6;6;6;2",frameWidth:40,frameHeight:48}},mantine:{Walk:{framesY:2,values:"6;6;8;8;6;6;6;8;8;6",frameWidth:64,frameHeight:72}},mantyke:{Walk:{framesY:2,values:"4;4;4;4;4;4;4;4;4;4",frameWidth:32,frameHeight:56}},overqwil:{Walk:{framesY:2,values:"10;12;10;12",frameWidth:40,frameHeight:64}},phione:{Walk:{framesY:1,values:"6;2;2;2;4;6;6;4;4;4",frameWidth:32,frameHeight:48}},qwilfish:{Walk:{framesY:4,values:"8;8;8;8",frameWidth:32,frameHeight:32}},relicanth:{Walk:{framesY:2,values:"10;10;10;10",frameWidth:32,frameHeight:48}},remoraid:{Walk:{framesY:2,values:"8;8;8;8",frameWidth:24,frameHeight:40}},seadra:{Walk:{framesY:2,values:"8;8;10;8;10",frameWidth:40,frameHeight:56}},seaking:{Walk:{framesY:2,values:"10;8;10;8",frameWidth:32,frameHeight:48}},sharpedo:{Walk:{framesY:2,values:"10;8;8;8;10;8;8;8",frameWidth:32,frameHeight:56}},tentacool:{Walk:{framesY:2,values:"8;10;8;10",frameWidth:24,frameHeight:40}},tentacruel:{Walk:{framesY:2,values:"8;10;8;10",frameWidth:32,frameHeight:40}},tynamo:{Walk:{framesY:1,values:"6;6;6;6",frameWidth:32,frameHeight:40}},wailmer:{Walk:{framesY:2,values:"8;6;6;8;6;6;6",frameWidth:32,frameHeight:40}},wailord:{Walk:{framesY:2,values:"10;8;6;6;8;8;10;8;6;6;6;8",frameWidth:72,frameHeight:104}},wishiwashi:{Walk:{framesY:2,values:"8;8;8;8",frameWidth:24,frameHeight:40}},"wishiwashi-school":{Walk:{framesY:2,values:"10;8;6;6;8;8;10;8;6;6;6;8",frameWidth:112,frameHeight:128}}}
let pokemons = []
const h = window[Symbol.for('[[HModule]]')]
audio.load('./media/pop.mp3')
const { css } = v
const { Proxify } = v
preload(...Object.entries(mons).map(({ 0: mon, 1: data }) => {
    data = data.Walk
    let duras = data.values.split(';').map(Number)
    return {
        src: `./new/${mon}/${mon}-Walk.png`,
        framesX: duras.length,
        framesY: data.framesY,
        frameWidth: data.frameWidth,
        frameHeight: data.frameHeight,
        duras
    }
}))
    .forEach(o => o.then((b) => {
        let a = {
            name: b.src.pathname.split('/').at(-1).split('-Walk')[0],
            src: b.src.toString()
        }
        // spawnPkm(a)
        pokemons.push(a)
    }))

onload = null
// css.registerProperty('--size', '0px', false, '<length>',)
// css.registerProperty('--width', '0px', false, '<length>',)
// css.registerProperty('--frames', 0, false, '<integer>',)
const {
    brushsize, undo, color,
    background: bg, count, holder, senddrawing, sendmessage, papericon, senddrawingform, paper } = v.id
let setOffset = function (s) {
    document.adoptedStyleSheets = [].concat.call(document.adoptedStyleSheets, s)
    return s.replaceSync.bind(s)
}(new CSSStyleSheet)
bg.observe('resize', {
    callback(e) {
        let w = innerWidth / 2
        let { width, height } = e.contentRect
        setOffset(`.pkm {--ltr: path("M -${w / 2.1} 0 L ${width + (w / 2.1)} 0"); --ltr-big:  path("M -${innerWidth} 0 L ${width + innerWidth} 0")}`)
    }
})
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
        count.style.visibility = 'visible'
        audio.play('pop.mp3')
        let parent = Proxify(this.closest('span'))
        count.textContent = `${++popped}`
        // count.ariaNotify?.(`Popped ${popped} bubbles`)
        parent.dataset.popped = 'true'
        count.ariaHidden = 'false'
        let me = parent.eltAt()
        let pic = Proxify(me.querySelector('picture'))
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
        debugger
        await pic.animFrom('dissolve', { duration: 700, iterations: 1, delay: 2000, composite: 'add' }).finished
        pic.parent.purge(true)
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
    animationend(e) {
        this.destroy()
    }
})

let avatars  = ["Dohaaa","Lagia","Lotus","MRK","Professional_idiot","Remi","Violet","anarchy","anya","armaan.n","auquamantis","aya","babby","birdie","caelix","caevsz","chlorineatt","copy","crazy","eggwafl","elenfnf1","elipoopsrainbows","fourche7","frannie4u","ghostie","gilly","glente","gummicat","ilikebugs2","indie","juaj","ka1ya1","kae","kannadra","kay_.stars","khaoticgood","kurispychips","kyn","lazy","lexi","lorex","lunza","mai","may","mila","mochi","morrfie","mothmaddie","mr_clownette","na22","naz","niya","nova","novacans_","oli","rainmint","rikapika","river","rue","rurikuu","saintz","son_yukio","stav","stuella","valerie","west","xzzy","zee","znsxxe","zoozi","zrake","汝起亚"]
// for (let i = 0, { length } = avatars; i < length; ++i) {
//     const pick = Math.floor(Math.random() * (i + 1))
//     let p = avatars[i]
//     let src = `./media/avatars/${p}`
//     let rule = `background-image:-webkit-image-set(url("${src}.avif") type("image/avif"), url("${src}.webp") type("image/webp"), url("${src}.jpg") type("image/jpg"))`
//     css.insertRule(`.user-${CSS.escape(p)}{background-image: url("${src}.webp");${rule};${rule.replace('-webkit-', '')}}`)
//         ; ({ 0: avatars[i], 1: avatars[pick] } = [avatars[pick], avatars[i]])
// }
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
    let src=  `./media/avatars/${name}`
    let out = v.esc`<span style="position:absolute;cursor: url('media/Link%20Select.cur'), pointer;top: ${range(0, innerHeight)}px;" data-popped="false" class="holder"aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <circle cursor="url('media/Link%20Select.cur'), pointer" pointer-events="painted" r="${95 * scale}" cx="${100 * scale}" cy="${100 * scale}" fill="rgba(15, 20, 210, 0.4)" stroke="#1043E5" stroke-width="${10 * scale}">
        </circle>
        <foreignObject cursor="url('media/Link%20Select.cur'), pointer" x="${30 * scale}" y="${30 * scale}" width="${140 * scale}" pointer-events="painted"  height="${140 * scale}">
        <picture title="${name}" style="display:inline;text-align:center">
        <source srcset="${src}.avif" type="image/avif">
        <source srcset="${src}.webp" type="image=webp">
        <img src="${src}.jpg" class="avatar user-${name}"  draggable="false">
        <div style="display:flex;place-content:center">
        <span style="--user-select:none;color:white;display:block;text-transform: capitalize;">@${name}</span>
        </div>
        </picture>
        </foreignObject>
        <path cursor="url('media/Link%20Select.cur'), pointer" d="M ${180 * scale} ${100 * scale} A ${80 * scale} ${80 * scale} 0 0 0 ${100 * scale} ${20 * scale}" fill="none" stroke="white" stroke-width="${9 * scale}" pointer-events="painted">
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

function spawnPkm(choice = pokemons[Math.floor(Math.random() * pokemons.length)]) {
    setTimeout(spawnPkm, range(500, 2500))
    if (!pokemons.length || isHidden()) return
    let scale = Math.random() > .5 ? -1 : 1

    let isShiny = range(0, 4000) > 3999 ? ' shiny' : ''
    let index = isShiny ? 1 :0
    let n = choice.name
    switch (n) {
        case 'basculegion':
        case 'qwilfish':
            index += Math.random() > .5 ? 0 : 1
            break
        case 'basculin':
            index = Math.floor(Math.random() * 3)
            break
        case 'kyogre':
        case 'kyogreprimal':
        case 'wailord':
            if (document.querySelector(`.${n}`)) return
    }
    let thing = v.esc`<slide-show aria-hidden="true" dur="0.018" src="${choice.src}" class="${choice.name} pkm${isShiny}" index="${index}" style="${scale > 0 ? '--xdir: -1;animation-direction:reverse;' : ''}top: ${Math.random() * 100}%;"></slide-show>`
        .setParent(bg)
    thing.play()
}
spawnPkm()