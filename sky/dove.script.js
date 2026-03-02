import * as v from '../v4.js'
import preload from '../webcomponents/cel-runner.js'
let timeOfDay = Reflect.get.bind(1, document.documentElement.dataset, 'tod')
console.log(timeOfDay())
let mons /*:return`= ${JSON.stringify(await Array.fromAsync((await dir('./media/sprite')).map(async o=>{
    let thing = o.split('_')
    let framesX = +thing[1].split('.')[0]
    let meta = await metadata(`./media/sprite/${o}`)
    return {
    file: o,
    name: thing[0],
    framesX,
    width: meta.width / framesX,
    height:meta.height / 2
    }
})))}`*/
mons.forEach(o => {
    preload({ src: `./media/sprite/${o.file}`, x: o.framesX, y: 2 })
})
const { $ } = v
let { bg } = v.id
let isHidden = Reflect.get.bind(1, document, 'hidden')
bg.delegate({
    animationend() {
        this.destroy()
    }
})
function canSpawn(pkm) {
    switch (pkm) {
        case 'noctowl':
        case 'misdreavus':
        case 'mismagius':
        case 'murkrow':
        case 'honchkrow':
            // case 'hoothoot':
            return /^(?:night|dawn|dusk)$/.test(timeOfDay())
        case 'zubat':
        case 'golbat':
        case 'crobat':
        case 'gastly':
        case 'haunter':
            return timeOfDay() === 'night'
    }
    return true
}
let legendary = new Set(`zapdos moltres articuno latios latias lugia`.split(' '))
function spawnPokemon() {
    setTimeout(spawnPokemon, 753 + (Math.random() * 753)
    )
    if (isHidden()) return
    let limit = 20
    let layer = Math.random() > .4 ? Math.floor(Math.random() * 7) + 1 : 7
    do {
        var choice = mons[Math.floor(Math.random() * mons.length)]
        var nameNoMega = choice.name.replace(/(?:mega|galar|alola|paldea|hisui)$/, '')
    }
    while (limit-- && ((legendary.has(nameNoMega) && document.querySelector(`.is_${nameNoMega}.layer_${layer}`)) || !canSpawn(nameNoMega)))
    let y = (Math.random() * (innerHeight + choice.height))
    let scaleX = Math.random() > .5 ? 1 : -1
    let scaleY = 1
    let path = [`-${choice.width} ${y}`, `${innerWidth + (choice.width * 2)} ${y}`]
    let dura = 22
    if (scaleX === -1) path.reverse()
    let pathString = `M ${path[0]} L ${path[1]}`
    let scaleStr = `${scaleX} ${scaleY}`
    switch (nameNoMega) {
        // idk why but some of them look slower than usual
        case 'aerodactyl':
        case 'articuno':
        case 'murkrow':
        case 'skarmory':
        case 'hooh':
        case 'honchkrow':
        case 'wingull':
        case 'altaria':
        case 'pelliper':
        case 'flygon':
        case 'moltres': dura *= .7
            break
        case 'lugia':
            dura *= 2.5
            break
        case 'latios':
        case 'latias':
        // layer = 6
        case 'mantine': {
            scaleStr = `${1} ${scaleX}`
            let cp1x = innerWidth * (0.1 + Math.random() * 0.3)
            let cp1y = y + (Math.random() * 400 - 200)
            let cp2x = innerWidth * (0.6 + Math.random() * 0.3)
            let cp2y = y + (Math.random() * 400 - 200)
            pathString = `M ${path[0]} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y} ${path[1]}`
            break
        }
    }
    $`<div class="layer_${layer} mon mon_${choice.name} is_${nameNoMega}" style='--noise: ${0.85 + Math.random() * 0.3};z-index: ${layer};offset-anchor: -${(choice.width / 2)}px -${(choice.height / 2)}px;offset-path: path("${pathString}");'>
        <cel-runner index="${+(Math.random() * 4000 > 3999)}" style="scale: ${scaleStr}" dura="${dura}ms" src="./media/sprite/${choice.file}" frames-x="${choice.framesX}" frames-y="2"></cel-runner>
        </div>`
        .setParent(bg)
}
spawnPokemon()