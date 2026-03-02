import * as v from '../v4.js'
import preload from '../webcomponents/cel-runner.js'
let timeOfDay = Reflect.get.bind(1, document.documentElement.dataset, 'tod')
console.log(timeOfDay())
let mons = [{"file":"aerodactyl_32.png","name":"aerodactyl","framesX":32,"width":40,"height":64},{"file":"altaria_36.png","name":"altaria","framesX":36,"width":48,"height":56},{"file":"altariamega_68.png","name":"altariamega","framesX":68,"width":64,"height":104},{"file":"articuno_36.png","name":"articuno","framesX":36,"width":88,"height":88},{"file":"celebi_32.png","name":"celebi","framesX":32,"width":24,"height":48},{"file":"fearow_30.png","name":"fearow","framesX":30,"width":40,"height":64},{"file":"flygon_32.png","name":"flygon","framesX":32,"width":32,"height":64},{"file":"gastly_72.png","name":"gastly","framesX":72,"width":48,"height":64},{"file":"golbat_48.png","name":"golbat","framesX":48,"width":40,"height":64},{"file":"haunter_68.png","name":"haunter","framesX":68,"width":32,"height":56},{"file":"honchkrow_38.png","name":"honchkrow","framesX":38,"width":32,"height":56},{"file":"hooh_36.png","name":"hooh","framesX":36,"width":72,"height":112},{"file":"latias_56.png","name":"latias","framesX":56,"width":48,"height":64},{"file":"latiasmega_48.png","name":"latiasmega","framesX":48,"width":72,"height":72},{"file":"latios_48.png","name":"latios","framesX":48,"width":64,"height":80},{"file":"latiosmega_48.png","name":"latiosmega","framesX":48,"width":80,"height":80},{"file":"lugia_30.png","name":"lugia","framesX":30,"width":80,"height":96},{"file":"mantine_68.png","name":"mantine","framesX":68,"width":64,"height":72},{"file":"misdreavus_48.png","name":"misdreavus","framesX":48,"width":24,"height":48},{"file":"mismagius_54.png","name":"mismagius","framesX":54,"width":32,"height":64},{"file":"moltres_36.png","name":"moltres","framesX":36,"width":80,"height":96},{"file":"moltresgalar_36.png","name":"moltresgalar","framesX":36,"width":88,"height":96},{"file":"murkrow_32.png","name":"murkrow","framesX":32,"width":32,"height":48},{"file":"noctowl_32.png","name":"noctowl","framesX":32,"width":40,"height":48},{"file":"pelliper_44.png","name":"pelliper","framesX":44,"width":32,"height":40},{"file":"skarmory_56.png","name":"skarmory","framesX":56,"width":40,"height":72},{"file":"swablu_40.png","name":"swablu","framesX":40,"width":32,"height":40},{"file":"wingull_36.png","name":"wingull","framesX":36,"width":32,"height":40},{"file":"zapdos_24.png","name":"zapdos","framesX":24,"width":56,"height":96},{"file":"zubat_48.png","name":"zubat","framesX":48,"width":32,"height":56}]
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