import * as v from '../v4.js'
import preload from '../webcomponents/cel-runner.js'
let timeOfDay = Reflect.get.bind(1, document.documentElement.dataset, 'tod')
let mons /*:return`= ${uneval(await Array.fromAsync((await dir('./media/sprite')).map(async o=>{
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
    let t = timeOfDay()
    switch (pkm) {
        case 'noctowl':
        case 'misdreavus':
        case 'fluttermane':
        case 'mismagius':
        case 'murkrow':
        case 'honchkrow':
            // case 'hoothoot':
            return /^(?:night|dawn|dusk)$/.test(t)
        case 'zubat':
        case 'swoobat':
        case 'woobat':
        case 'golbat':
        case 'crobat':
        case 'gastly':
        case 'haunter':
        case 'duskull':
        case 'shuppet':
        case 'noibat':
        case 'noivern':
        case 'darkrai': return t === 'night'
        case 'cresselia': return t !== 'night'
    }
    return true
}
let legendary = new Set(`zapdos cresselia darkrai moltres articuno latios latias lugia celebi hooh thundurus tornadus landorous`.split(' '))
function spawnPokemon() {
    setTimeout(spawnPokemon, 753 + (Math.random() * 753)
    )
    if (isHidden()) return
    let limit = 20
    let layer = Math.random() > .4 ? Math.floor(Math.random() * 7) + 1 : 7
    do {
        var choice = mons[Math.floor(Math.random() * mons.length)]
        var nameNoMega = choice.name.replace(/(?:mega|galar|alola|paldea|hisui|therian|shadow)$/, '')
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
        case 'drifloon':
        case 'drifblm': {
            let { 0: startX, 1: startY } = path[0].split(' ').map(Number)
            let { 0: endX, 1: endY } = path[1].split(' ').map(Number)
            let upOffset = 600 + Math.random() * 400
            endY = startY - upOffset
            let ctrlX = startX + (endX - startX) * (0.3 + Math.random() * 0.4)
            let ctrlY = startY - upOffset * (0.3 + Math.random() * 0.5)
            pathString = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`
        }
        case 'aerodactyl':
        case 'articuno':
        case 'murkrow':
        case 'duskull':
        case 'skarmory':
        case 'archeops':
        case 'hooh':
        case 'honchkrow':
        case 'wingull':
        case 'altaria':
        case 'pelliper':
        case 'flygon':
        case 'braviary':
        case 'moltres': dura *= .7
            break
        case 'lugia':
            dura *= 2.5
            break
        case 'chatot':
            dura *= 1.6
            break
        case 'latios':
        case 'latias':
        // layer = 6
        case 'mantyke':
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
    if (choice.name === 'landoroustherian') dura *= .7
    $`<div class="layer_${layer} mon mon_${choice.name} is_${nameNoMega}" style='--noise: ${0.95 + Math.random() * 0.1};z-index: ${layer};offset-anchor: -${(choice.width / 2)}px -${(choice.height / 2)}px;offset-path: path("${pathString}");'>
        <cel-runner index="${+(Math.random() * 4000 > 3999)}" style="scale: ${scaleStr}" dura="${dura}ms" src="./media/sprite/${choice.file}" frames-x="${choice.framesX}" frames-y="2"></cel-runner>
        </div>`
        .setParent(bg)
}
spawnPokemon()