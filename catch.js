// import *as v from './v4.js'
let d = document
import './h.js'
import preload, { SlideShow, isLoaded, finishLazyLoad } from './webcomponents/slide-show.js'
export { preload as loadSprite, SlideShow, isLoaded, finishLazyLoad }
const h = window[Symbol.for('[[HModule]]')]
let loaded = null
const isSafari = 'onwebkitmouseforceup' in window
let lastIndex = sessionStorage.lastIndex = sessionStorage.lastIndex || 0
const national = {
    tentacool: 72,
    tentacruel: 73,
    horsea: 116,
    seadra: 117,
    goldeen: 118,
    seaking: 119,
    gyarados: 130,
    porygon: 137,
    mewtwo: 150,
    mew: 151,
    lanturn: 171,
    unown: 201,
    qwilfish: 211,
    corsola: 222,
    remoraid: 223,
    mantyke: 226,
    kingdra: 230,
    porygon2: 233,
    carvanha: 318,
    sharpedo: 319,
    wailmer: 320,
    wailord: 321,
    lunatone: 337,
    solrock: 338,
    baltoy: 343,
    claydol: 344,
    feebas: 349,
    duskull: 355,
    huntail: 367,
    gorebyss: 368,
    relicanth: 369,
    luvdisc: 370,
    beldum: 374,
    metang: 375,
    kyogre: 382,
    rayquaza: 384,
    jirachi: 385,
    deoxys: 386,
    bronzor: 436,
    bronzong: 437,
    finneon: 456,
    lumineon: 457,
    mantine: 458,
    porygonz: 474,
    dusknoir: 477,
    uxie: 480,
    mesprit: 481,
    azelf: 482,
    dialga: 483,
    palkia: 484,
    giratina: 487,
    phione: 489,
    manaphy: 490,
    arceus: 493,
    basculin: 550,
    solosis: 577,
    duosion: 578,
    reuniclus: 579,
    jellicent: 593,
    alomomola: 594,
    tynamo: 602,
    eelektross: 604,
    elgyem: 605,
    beheeyem: 606,
    reshiram: 643,
    zekrom: 644,
    // clauncher: 683,
    inkay: 686,
    clawitzer: 693,
    hoopa: 720,
    wishiwashi: 746,
    minior: 774,
    bruxish: 779,
    cosmog: 789,
    cosmoem: 780,
    dhelmise: 781,
    lunala: 792,
    nihilego: 793,
    buzzwole: 794,
    celesteela: 797,
    kartana: 798,
    necrozma: 800,
    poipole: 803,
    naganadel: 804,
    orbeetle: 826,
    arrokuda: 846,
    arctovish: 883,
    eternatus: 890,
    basculegion: 902,
    overqwil: 904,
    finizen: 963,
    palafin: 964,
}
function esc(strings, ...subs) {
    let out = ''
    for (let i = 0, n = strings.length, { length } = subs; i < n; ++i)
        out += `${strings[i]}${i < length ? escapeHTML(subs[i]) : ''}`
    return out
}
const apos = /'/g
const q = /"/g
let observer = new IntersectionObserver(e => {
    for (let entry of e) if (entry.isIntersecting) {
        let sprite = entry.target
        // if (!sprite.src && !isAutoScrolling) {
        //     let dex = entries.get(sprite.dataset.is)
        //     let data = dex[3]
        //     let caught = dex[2]
        //     data.framesX = (data.duras = data.values.split(';').map(Number)).length
        //     if (caught[0] || caught[1]) {
        //         sprite.classList.add('discovered')
        //         sprite.play()
        //     }
        //     finishLazyLoad(data.src)
        //     sprite.setAttribute('src', data.src)
        // }
        if (entry.intersectionRatio > .3) {
            setActive(sprite)
            sessionStorage.lastIndex = sprite.closest('.entry').dataset.dexno
            finishLazyLoad(sprite.src)
        }
    }
}, {
    delay: 400,
    threshold: [0, Number.MIN_VALUE, .3]
})
function escapeHTML(s) { (a ??= d.createElement('p')).textContent = s; return a.innerHTML.replace(q, '&quot;').replace(apos, '&#39;') } let a
let dexes = d.getElementsByTagName('poke-dex')
let dems = new Map
async function addDexEntry(data, name, lazy) {
    let dex = dexElement
    let normal = name.split(/[-_]/)[0],
        exists = dex.shadowRoot.querySelector(`#pokedex-${normal}`)
    let registry = entries.get(name)
    while (!registry) {
        await new Promise(setTimeout)
        registry = entries.get(name)
    }
    let { src } = registry[3]
    let caught = registry[2]
    let dexNo = national[normal]
    if (!dexNo) console.error(name)
    let n = d.createRange().createContextualFragment(esc`<div class="entry" data-dexno="${dexNo}" id="pokedex-${normal}"><div class="var"><slide-show paused index="${caught[1] ? getShinyIndex(name) : 0}" data-is="${name}" dur=".02"></slide-show></div></div>`)
    let sprite = n.querySelector('slide-show')
    if (caught.some(Boolean)) {
        sprite.classList.add('discovered')
        sprite.toggleAttribute('autoplay', true)
    }
    if (!lazy) {
        sprite.setAttribute('src', src)
    }
    observer.observe(sprite)
    if (exists) {
        name === normal ? exists.prepend(n.firstChild.firstChild) :
            exists.appendChild(n.firstChild.firstChild)
    }
    else {
        if (!dex.screen.childElementCount) {
            dex.screen.appendChild(n);
        } else {
            const thisEntry = n.querySelector('.entry')
            const targetDexNo = Number(thisEntry.dataset.dexno)
            let insertBefore = null;
            for (const child of dex.screen.children) {
                if (Number(child.dataset.dexno) > targetDexNo) {
                    insertBefore = child
                    break
                }
            }
            if (insertBefore) {
                dex.screen.insertBefore(n, insertBefore)
            } else {
                dex.screen.appendChild(n)
            }
        }
    }
}
let globalPokedex = {}
let dexElement = d.querySelector('poke-dex')
export function loadPokemon(...data) {
    data.forEach(o=>addDexEntry(o, o.name))
    return preload(...data)
}
let entries = new Map
let l = localStorage
export async function loadDexes(dex, ...sources) {
    let href = `${location.origin}${location.pathname}`
    while (href.endsWith('/')) href = href.slice(0, -1)
    let key = `${href}~0`
    l[key] ||= `0 0`
    let [nor, shi] = l[key].split(' ').map(o => BigInt(o))
    let i = 0n
    for (let name in dex) {
        let thing = dex[name]
        let d = thing.Idle2 || thing.Idle
        entries.set(name, [href, i, globalPokedex[d] = [nor & (1n << i), shi & (1n << i++)].map(Boolean), d])
    }
    return
    let frame = d.createElement('iframe')
    let src
    d.src = new URL(d.src, href)

    frame.ariaHidden =
        frame.inert = true
    for (let i = sources.length; i--;) {
        let s = sources[i]
        src = new URL(s)
        frame.src = new URL('./sync.html', src) + `#${JSON.stringify([`${src.origin}${src.pathname}`, l[key], `${location.origin}${location.pathname}`])}`
        if (!frame.dataset.ran) {
            frame.dataset.ran = 'true'
            d.body.appendChild(frame)
            let z = d.createAttribute('style')
            z.value = 'width:0px !important;height:0px !important;position:fixed !important;transform:scale(0) !important;zIndex:-9999 !important;pointerEvents:none !important;left:-9999px !important;top:-9999px !important;interactivity:inert !important;userSelect:none !important;visibility:hidden !important;'
            frame.setAttributeNode(z)
        }
        let response
        function responseFunc(e) {
            response = e.data
        }
        addEventListener('message', responseFunc)
        try {
            await new Promise((resolve, reject) => {
                frame.addEventListener('load', async () => {
                    try {
                        // try {frame.contentWindow.document&&resolve()}catch{} // same origin don't need to sync localStorage
                        await h.wait(100)
                        if (!Array.isArray(response)) throw TypeError(`Data invalid or missing`)
                        let [storage, otherDex] = response
                        let [normal, shiny] = storage.split(' ').map(BigInt)
                        l[`${src.origin}~0`] = `${normal} ${shiny}`
                        let i = 0n
                        for (let name in otherDex) {
                            let mon = otherDex[name]
                            let old = globalPokedex[name]
                            let idle = mon.Idle2 || mon.Idle
                            idle.src = new URL(idle.src, src).toString()
                            entries.set(name, [src.toString(), i, globalPokedex[name] = [old?.[0] ?? (normal & (1n << i)), old?.[1] ?? (shiny & (1n << i))].map(Boolean), idle])
                            ++i
                            addDexEntry(idle, name, true)
                        }
                        resolve()
                    }
                    catch (e) {
                        reject(TypeError(`Failed to sync from ${new URL(frame.src).origin}`, { cause: e }))
                    }
                }, { once: true })
            })
        }
        catch (e) {
            console.error(e)
        }
        finally {
            removeEventListener('message', responseFunc)
        }
    }
    frame.remove()
    let current = dexElement.screen.querySelector(`[data-dexno="${lastIndex}"]`) || dexElement.screen.firstChild
    current.scrollIntoView()
    setActive(current.firstChild.firstChild)
}
export const POKE_BALL = 0,
    GREAT_BALL = 1,
    SAFARI_BALL = 2,
    ULTRA_BALL = 3,
    MASTER_BALL = 4,
    NET_BALL = 5,
    DIVE_BALL = 6,
    DREAM_BALL = 7
function source(ext) {
    let source = d.createElement('source')
    source.srcset = new URL(`./ball.${ext}`, import.meta.url)
    source.type = `image/${ext}`
    this.appendChild(source)
}
export async function pokeball() {
    if (loaded) return loaded
    let n = d.createElement('picture').appendChild(new Image)
    n.decoding = 'sync'
    n.setAttribute('fetchpriority', 'high')
    if ((n.src = new URL('./ball.webp', import.meta.url || 'https://addsoupbase.github.io')).origin !== origin)
        n.crossOrigin = 'anonymous'
    await h.until(n, { resolve: 'load', reject: 'error' })
    let { 0: catc, 1: thro } = await Promise.all([createImageBitmap(n, 0, 0, 320, 320), createImageBitmap(n, 320, 0, 320, 320)])
    let opts = { framesX: 8, framesY: 8 }
    loaded = Promise.all(preload({ src: '$catch', duras: '0 6;1 18;0 13;2 1;3 1;4 1;3 1;2 1;0 11;5 1;6 1;7 1;6 1;5 1;0 11;2 1;3 1;4 1;3 1;2 1;0 10;', image: catc, ...opts }, { reversed: true, src: '$throw', image: thro, ...opts }))
    await loaded
    return loaded
}
try {
    let _ = pokeball()
    await (_)
}
catch (e) {
    if (!(e.name === 'ReferenceError' && /\bawait\b/.test(e.message))) throw e
}
// d-pad totally NOT stolen from https://codepen.io/tswone/pen/GLzZLd !
let dex = new CSSStyleSheet
dex.replaceSync(/*css*/`
        * {
        line-height:24px;
        font-family: pokemon, monospace;
        font-size: 15px
    }
[part="container"] {
    width: 100%;
    height: 190px;
    margin-top:40px;
    background:linear-gradient(145deg, hsl(0deg 0% 85.25%), hsl(0deg 0% 80.2%));
    outline: 2px solid #b0b0b0;
    border-radius: 12px;
    box-shadow: inset 0 1px 4px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.1);
    place-items:center;
}
@supports (corner-shape: bevel) {
[part="container"] {
    corner-bottom-left-shape: bevel;
    border-bottom-left-radius: 23px
}
}
slide-show:state(--broken) {
    visibility: hidden;
}
slide-show:--broken {
    visibility: hidden;
}
${isSafari ? '.var:has(' : ''}slide-show:not(.discovered)${isSafari ? ')' : ''} {
    ${isSafari ?
        `background-repeat:no-repeat;
        background-position:50%;
        background-image: url(data:image/webp;base64,UklGRiQBAABXRUJQVlA4TBcBAAAvP8APECcgECD8z0mQYkMgQPifkyCFQIDwPydBivkPAPCnqgBSbdt1m6QtgBxbBHxlAD8Ckfijqt6L3htmFtF/BW6jNgd07x484vFdyFGg/SbwxshfxpzGLakFaPdtVgrhBeyS1IFnBNa8xvJNTpZQVkDSdd9VUqT7bfJr/Es12d+0bnKMSApUy8gL1AvafzavjlU6VOlyR5j3SMuY7Faadrxo0sjXc2RSmXWsbPY8YHdZOOcj+wewj4HzkesHcM4HQh2onaZr4ApiK2ONDDB75SCVKHYPcENCC8HewS0U+Rcn7l9C/2p54/41xAtOacXxIsIrC8erPC/zvM77Rdqv8n6Z9ut8XEjHlXxcSse1dFzMx9WvQh4A)` :
        'filter: drop-shadow(0 0 0 transparent) brightness(0%)'}
}
${isSafari ? "slide-show:not(.discovered){visibility:hidden}" : `slide-show.discovered {
    filter:drop-shadow(2px 2px 0px #0000004d) brightness(100%)
}` }

.decor {
width:12px;
height:12px;
border-radius: 100%;
background: radial-gradient(circle at 35% 35%, #ff6a6a, #a00000);
box-shadow: 0 1px 2px rgba(0,0,0,0.2);
outline: none;
}
.decor:nth-of-type(2) {
background: radial-gradient(circle at 35% 35%, #ffdd77, #c47a00);
}
.decor:nth-of-type(3) {
background: radial-gradient(circle at 35% 35%, #77ff77, #2a7a00);
}

:host {
    contain:strict;
    padding: 10px;
    overflow-y:auto;
    box-sizing: content-box !important;
    padding-top: 6px;
    position: fixed;
    max-width: 200px;
    width: 200px;
    height: 420px;
    outline: none;
    position:fixed;
    right: -160px;
    bottom: -390px;
    border-radius: 16px;
    transition: transform .5s ease;
    background: linear-gradient(137deg, #e33535 1%, #9b1f1f 99%);
    box-shadow: 0 10px 16px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3);
    border: 1px solid #ff7a7a;
}
:host(:not(.active)) {
    right: -175px
}
#toggle {
    cursor: pointer
}

:host(.active) {
    right:5px;
    bottom:5px;
    transition: none
}
.d-pad {
  width: 200px;
  height: 200px;
  border-radius: 48%;
  overflow: hidden;
  transform: scale(.5) translate(0, 76px);
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));
}
.d-pad:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: #c0c0c0;
  box-shadow: inset 0 1px 2px white, 0 2px 4px rgba(0,0,0,0.3);
}
.d-pad:after {
  content: '';
  position: absolute;
  display: none;
  z-index: 2;
  width: 20%;
  height: 20%;
  top: 50%;
  left: 50%;
  background: #ddd;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.25s;
  cursor: pointer;
}
.d-pad:hover:after {
  width: 30%;
  height: 30%;
}

.d-pad > button {
    touch-action: none;
  display: block;
  border: none;
  outline: none;
  cursor: pointer;
  position: absolute;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  width: 66px;
  height: 86px;
  line-height: 40%;
  color: #fff;
  background: #c0c0c0;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.d-pad > button:is(:hover, :focus) {
  background: #d0d0d0;
}

.d-pad > button:before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-radius: 5px;
  border-style: solid;
  transition: all 0.25s;
}

.d-pad > button.left,
.d-pad > button.right {
  width: 86px;
  height: 66px;
}
.d-pad > button.left:after,
.d-pad > button.right:after {
  width: 78%;
  height: 102%;
}
.d-pad > button.up {
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 17% 17% 50% 50%;
}
.d-pad > button.up:hover {
  background: linear-gradient(0deg, #c0c0c0 0%, #dcdcdc 50%);
}
.d-pad > button.up:after {
  left: 0;
  top: 0;
  transform: translate(-100%, 0);
  border-top-left-radius: 50%;
  pointer-events: none;
}
.d-pad > button.up:before {
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-width: 0 13px 19px 13px;
  border-color: transparent transparent #999 transparent;
}
.d-pad > button.up:active:before {
  border-bottom-color: #444;
}
.d-pad > button.up:hover:before {
  top: 35%;
}
.d-pad > button.down {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 50% 50% 17% 17%;
}
.d-pad > button.down:hover {
  background: linear-gradient(180deg, #c0c0c0 0%, #dcdcdc 50%);
}
.d-pad > button.down:after {
  right: 0;
  bottom: 0;
  transform: translate(100%, 0);
  border-bottom-right-radius: 50%;
  pointer-events: none;
}
.d-pad > button.down:before {
  bottom: 40%;
  left: 50%;
  transform: translate(-50%, 50%);
  border-width: 19px 13px 0px 13px;
  border-color: #999 transparent transparent transparent;
}
.d-pad > button.down:active:before {
  border-top-color: #444;
}
.d-pad > button.down:hover:before {
  bottom: 35%;
}
.d-pad > button.left {
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  border-radius: 17% 50% 50% 17%;
}
.d-pad > button.left:hover {
  background: linear-gradient(-90deg, #c0c0c0 0%, #dcdcdc 50%);
}
.d-pad > button.left:after {
  left: 0;
  bottom: 0;
  transform: translate(0, 100%);
  border-bottom-left-radius: 50%;
  pointer-events: none;
}
.d-pad > button.left:before {
  left: 40%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-width: 13px 19px 13px 0;
  border-color: transparent #999 transparent transparent;
}
.d-pad > button.left:active:before {
  border-right-color: #444;
}
.d-pad > button.left:hover:before {
  left: 35%;
}
.d-pad > button.right {
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  border-radius: 50% 17% 17% 50%;
}
.d-pad > button.right:hover {
  background: linear-gradient(90deg, #c0c0c0 0%, #dcdcdc 50%);
}
.d-pad > button.right:after {
  right: 0;
  top: 0;
  transform: translate(0, -100%);
  border-top-right-radius: 50%;
  pointer-events: none;
}
.d-pad > button.right:before {
  right: 40%;
  top: 50%;
  transform: translate(50%, -50%);
  border-width: 13px 0 13px 19px;
  border-color: transparent transparent transparent #999;
}
.d-pad > button.right:active:before {
  border-left-color: #444;
}
.d-pad > button.right:hover:before {
  right: 35%;
}
.d-pad.up button.up:before {
  border-bottom-color: #444;
}
.d-pad.down button.down:before {
  border-top-color: #444;
}
.d-pad.left button.left:before {
  border-right-color: #444;
}
.d-pad.right button.right:before {
  border-left-color: #444;
}
[role="status"] {
    background: linear-gradient(145deg, #5cd42a, #4bb318);
    border-radius: 20px;
    outline: none;
    text-transform: capitalize;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.2);
    height: 30px;
    width: fit-content;
    min-width: 100px;
    padding-inline: 11px
}
div[role="status"] {
    margin:auto;
    place-self: center;
}
[part="status"] {
    display: block;
    height:100%;
    transform:translateY(4px);
    letter-spacing: 1px;
    text-align: center;
    color: #1a2a0a;
    text-shadow: 0 1px 0 #b3ff8f;
    font-weight: bold;
}
#d {
    position: absolute;
    top:196px;
    display:flex;
    gap:20px;
}
#d > div {
    width: 40px;
    height: 8px;
    background: linear-gradient(145deg, #ff8080, #cc4444);
    border-radius: 8px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px black;
    outline: none;
}
#d > div:nth-of-type(2) {
    background: linear-gradient(145deg, #ffff88, #ccaa33);
}



[part="screen"] {
  width: 160px;
  height: 120px;
  margin: auto;
  position: relative;
  top: 20px;
  border: 2px solid #2a3a2a;
  border-radius: 15px;
      background-attachment: fixed;
    animation: checkers 10s linear infinite;
    --pixel-size: 10px;
    background: repeating-conic-gradient(#8AC2E4 0 25%, #C5DAF6 0 50%) 50% / var(--pixel-size) var(--pixel-size);
  box-shadow: inset 0 0 0 2px #0f140f, 0 2px 6px rgba(0,0,0,0.3);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  /*scroll-snap-type: x mandatory;*/
  scrollbar-width: none;
}
@keyframes checkers {
    0% {
        background-position: 0 0
    }

    100% {
        background-position: 30px 30px;
    }
}

.d-pad {
    user-select: none;
    -moz-user-select:none;
    -webkit-user-select:none;
  margin-top: 8px;
}
[role="status"] {
  margin: 8px auto 0 auto;
}
:is([part="screen"], .entry)::-webkit-scrollbar {
    display: none
}

.entry .var {
    width: 100%;
    height: 100%;
    contain: strict;
    image-rendering:pixelated;
    border: 3px solid transparent;
    place-content:center;
    /*scroll-snap-align:start;
    scroll-snap-stop:always;*/
    text-align:center;
    position:relative;
}
:where(.entry .var slide-show) {
    margin:auto;
    position:absolute;
    left:50%;
    top:50%;
    transform:scale(1.4)
}
[data-is="celesteela"], [data-is="eternatus"], [data-is="rayquaza"],[data-is="palkia"], [data-is="wailord"] {
    top: 50%;
}
[data-is="unown"],[data-is="jirachi"] {
    top:60%
}
[data-is="unown"].shiny {
    filter: hue-rotate(20deg) saturate(5)
}
[data-is="wishiwashi-school"] {
    top: 49%
}
slide-show {
    transition: filter 1.1s linear 1s;
}
.entry {
    display: grid;
    content-visibility: auto;
    contain-intrinsic-size: 160px 120px ;
    grid-auto-rows: 100%;      
    width: 100%;
    flex: 0 0 100%;        
    overflow-y: auto;
    /*scroll-snap-type: y mandatory;*/
    scrollbar-width: none;
    /*scroll-snap-align: start;  */
    height: 100%;
    color: #b3ffa7;
    font-weight: bold;
    text-shadow: 0 0 2px #2eff00;
}
.entry, .var {
        box-sizing: border-box;
        overflow: hidden;
    }

    @font-face pokemon {
        font-family: pokemon;
        src: url("${new URL('./pokemonfont/font.woff2', import.meta.url)}");
        font-display: swap
    }
#number {
    top: 145px;
    text-shadow: 0 0 1px BLACK;
    position: absolute;
    left: 135px;
}
#toggle {
    border:none;outline: 3px outset white;position:absolute;width:30px;height:30px;background: #4a84f0;background: radial-gradient(circle, rgb(114 153 224) 1%, rgb(0 110 255) 100%);border-radius:100%;top:-40px;left:-2px
}
#toggle:focus {
    outline-style: inset;
}
`)
new FontFace('pokemon', `url(${new URL('./pokemonfont/font.woff2', import.meta.url)})`, { display: 'swap' })
    .load().then(document.fonts.add.bind(document.fonts))
let DOM = d.createRange().createContextualFragment(/*html*/`
<div style="position:relative;height:90%;width:100%;">
  <button id="toggle" aria-label="Toggle" tabindex="0"></button>
  <div part="container">
    <div style="position:absolute;display:flex;gap:14px;top:4px;width:100%;place-content:center" aria-hidden="true">
      <div class="decor"></div>
      <div class="decor"></div>
      <div class="decor"></div>
    </div>
    <div part="screen" aria-hidden="true"></div>   <!-- only entries go here -->
    <div class="d-pad" role="toolbar" aria-label="Directional Pad">
      <button class="up" aria-label="Up"></button>
      <button class="down" aria-label="Down"></button>
      <button class="left" aria-label="Left"></button>
      <button class="right" aria-label="Right"></button>
    </div>
    <div role="status">
      <span part="status">???</span>
    </div>
  </div>
      <div id="number" ><span style="font-size: 80%;font-weight:bold" aria-label="Number">No.</span> <span part="dexno">000</span></div>
</div>`)
class PokeDex extends HTMLElement {
    static observedAttributes = []
    up = null
    down = null
    left = null
    right = null
    #status
    get active() {
        return this.#screen.querySelector('[data-active="true"]')
    }
    get status() {
        return this.#status
    }
    get no() { return this.#dexNo }
    #screen
    #dexNo
    get screen() { return this.#screen }
    constructor() {
        super()
        let shadow = this.attachShadow({
            mode: 'open', //delegatesFocus: true 

        })
        shadow.adoptedStyleSheets = [dex]
        shadow.appendChild(DOM.cloneNode(true))
        let dpad = shadow.querySelector('[role="toolbar"]')
        dpad.addEventListener('click', click)
        dpad.addEventListener('keydown', keydown)
            ;[this.up, this.down, this.left, this.right] = dpad.children
        this.#status = shadow.querySelector('[part="status"]')
        this.#screen = shadow.querySelector('[part="screen"]')
        this.#dexNo = shadow.querySelector('[part="dexno"]')
        this.addEventListener('nav', nav)
        shadow.querySelector('#toggle').addEventListener('click', toggle)
    }
    set textStatus(txt) {
    }
    connectedCallback() {
        this.role = this.role || 'group'
        this.ariaLabel = this.ariaLabel || 'Pokedex'
        // called when connected to DOM for the first time
    }
    disconnectedCallback() {
        // called when removed from DOM (e.g. remove(), replaceWith())
    }
    adoptedCallback() {
        // called when `ownerDocument` changes
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        // called when setAttribute is called
    }
}
function toggle() {
    this.getRootNode().host.classList.toggle('active')
}
function setActive(n) {
    if (n.tagName !== 'SLIDE-SHOW') debugger
    let old = dexElement.screen.querySelector('[data-active="true"]')
    if (old) {
        old.firstChild.pause()
        old.dataset.active = 'false'
    }
    let me = n.parentNode
    me.dataset.active = 'true'
    let discovered = n.classList.contains('discovered')
    discovered && me.firstChild.play()
    dexElement.status.textContent = discovered ? n.dataset.is.split(/[-_]/g).join(' ') : '???'
    let numberDisplay = dexElement.no
    numberDisplay.textContent = n.closest('.entry').dataset.dexno
    numberDisplay.parentNode.style.color = +n.index === getShinyIndex(n.dataset.is) ? 'yellow' : 'black'
}
let isScrolling = false
function nav({ detail }) {
    if (isScrolling || isAutoScrolling) return
    let i = 1
    let { screen } = this
    switch (detail) {
        case 'left':
            i *= -1
        case 'right':
            var target = dexElement.active.closest('.entry')[i > 0 ? 'nextElementSibling' : 'previousElementSibling']
            if (!target)
                return
            isScrolling = true
            // if (!('onscrollend' in window)) 
            setTimeout(unlockScrolling, scrollTimeout)
            // else screen.addEventListener('scrollend', unlockScrolling, { once: true })
            let t = target.querySelector('slide-show')
            t.parentNode.scrollIntoView({ behavior: 'smooth', inline: 'center', })
            setActive(t)
            scrollIndexY = 0
            break
        case 'up':
            i *= -1
        case 'down':
            var target = dexElement.active[i > 0 ? 'nextElementSibling' : 'previousElementSibling']
            if (!target) return
            isScrolling = true
            // if (!('onscrollend' in window))
            setTimeout(unlockScrolling, scrollTimeout)
            // else target.parentNode.addEventListener('scrollend', unlockScrolling, { once: true })
            target.scrollIntoView({ behavior: 'smooth' })
            setActive(target.firstChild)
            break
        // this.screen.children[]
    }
}
let scrollTimeout = 100
function unlockScrolling() {
    isScrolling = false
}
function click(e) {
    let n = e.target
    if (n.tagName === 'BUTTON') {
        n.getRootNode().host.dispatchEvent(new CustomEvent('nav', {
            detail: n.ariaLabel.toLowerCase()
        }))
    }
}
function keydown(e) {
    if (e.repeat) return
    let { host } = e.target.getRootNode()
    let pick
    switch (e.key) {
        default: return
        case 'ArrowUp':
            pick = host.up
            break
        case 'ArrowDown':
            pick = host.down
            break
        case 'ArrowLeft':
            pick = host.left
            break
        case 'ArrowRight':
            pick = host.right
            break
    }
    pick.focus()
    pick.click()
    e.preventDefault()
}
customElements.define('poke-dex', PokeDex)
export function catchAnimation(n, delay = 380, duration = 400) {
    let anim = new Animation(new KeyframeEffect(n.valueOf(), [{
        transform: 'scale(1,1)', filter: 'brightness(0%) invert(1) opacity(90%)'
    }, { filter: 'opacity(60%) brightness(0%) invert(1)' }, {
        transform: 'translateY(calc(min(50%, 25px))) scale(0.25,0.25)', filter: 'opacity(0%) brightness(0%) invert(1)'
    }], {
        duration,
        iterations: 1,
        // delay,
        composite: 'add',
        easing: 'ease-in'
    }))
    h.wait(delay).then(anim.play.bind(anim))
    return anim
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
            pokeball.style.setProperty('pointer-events', 'none', 'important')
            t.style.setProperty('pointer-events', 'none', 'important')
            pokeball.src = '$throw'
            pokeball.style.position = 'absolute'
            pokeball.toggleAttribute('autoplay', true)
            pokeball.dur = .05
            pokeball.toggleAttribute('precise', true)
            t.after(pokeball)
            pokeball.addEventListener('disconnected', update, { once: true })
            // let {currentCSSZoom: zoom} = t
            let cy = Math.round(rect.bottom) - (t.padTop * (rect.height / (t.offsetHeight)))
            pokeball.caught = t
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
let updateQueue = []

addEventListener('updatepokedex', ({ detail }) => {
    updateQueue.push(detail) === 1 && processQueue()
})

let queueing = false
async function processQueue() {
    if (queueing) return
    queueing = true
    while (updateQueue.length) {
        const detail = updateQueue.shift()
        handlePokedexUpdate(detail)
        await h.wait(2300)
    }
    queueing = false
}

function getShinyIndex(name) {
    let shiny = 1
    switch (name) {
        case 'minior': shiny = 7; break
        case 'mewtwo': shiny = 2; break
        case 'unown': shiny = -1
    }
    return shiny
}
let isAutoScrolling = false
function handlePokedexUpdate({ name, index, src, no, capture, dex }) {
    let nth = 0
    let shiny = getShinyIndex(name)
    const isShiny = index === shiny
    if (isShiny) nth = 1
    capture[nth] = true
    let caught = l[`${dex}~0`].split(' ').map(BigInt)
    let oldCaught = caught.slice()
    caught[nth] |= 1n << no
    l.setItem(`${dex}~0`, caught.join(' '))
    const pokemon = dexElement.screen.querySelector(`[data-is="${name}"]`)
    if (!pokemon) return
    if (!pokemon.classList.contains('discovered') || (caught[0] !== oldCaught[0]) || (caught[1] !== oldCaught[1])) {
        pokemon.classList.add('discovered')
        pokemon.play()
        let entry = pokemon.closest('.entry')
        let isActive = dexElement.classList.contains('active')
        if (isActive) {
            isAutoScrolling = true
            pokemon.parentNode.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' })
            pokemon.index = index
            if (isShiny) pokemon.classList.add('shiny')
        }
        setTimeout(() => { isActive && (setActive(pokemon), pokemon.parentNode.scrollIntoView({ behavior: 'smooth', block: 'center' })); isAutoScrolling = false }, 800)
    }
}
let scrollIndexX = 0
let scrollIndexY = 0
function update(p) {
    let mon = this.caught
    let name = mon.dataset.name
    let entry = entries.get(name)
    dispatchEvent(new CustomEvent('updatepokedex', {
        detail: {
            name,
            index: mon.index,
            src: mon.src,
            dex: entry[0],
            no: entry[1],
            capture: entry[2]
        }
    }))
}
