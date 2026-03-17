import * as v from '../v4.js'
import preload from '../webcomponents/slide-show.js'
let timeOfDay = Reflect.get.bind(1, document.documentElement.dataset, 'tod')
let mons = [({file:"aerodactyl_32.png",name:"aerodactyl",framesX:32,width:40,height:64}),({file:"altaria_36.png",name:"altaria",framesX:36,width:48,height:56}),({file:"altariamega_68.png",name:"altariamega",framesX:68,width:64,height:104}),({file:"archeops_32.png",name:"archeops",framesX:32,width:32,height:56}),({file:"articuno_36.png",name:"articuno",framesX:36,width:88,height:88}),({file:"braviaryhisui_32.png",name:"braviaryhisui",framesX:32,width:48,height:72}),({file:"castform_48.png",name:"castform",framesX:48,width:24,height:40}),({file:"celebi_32.png",name:"celebi",framesX:32,width:24,height:48}),({file:"chimeco_56.png",name:"chimeco",framesX:56,width:32,height:56}),({file:"cresselia_36.png",name:"cresselia",framesX:36,width:48,height:72}),({file:"darkrai_62.png",name:"darkrai",framesX:62,width:40,height:80}),({file:"drifblm_46.png",name:"drifblm",framesX:46,width:32,height:64}),({file:"drifloon_64.png",name:"drifloon",framesX:64,width:24,height:64}),({file:"duskull_48.png",name:"duskull",framesX:48,width:24,height:48}),({file:"enamorus_54.png",name:"enamorus",framesX:54,width:32,height:72}),({file:"enamorustherian_48.png",name:"enamorustherian",framesX:48,width:64,height:72}),({file:"fearow_30.png",name:"fearow",framesX:30,width:40,height:64}),({file:"flechinder_40.png",name:"flechinder",framesX:40,width:32,height:48}),({file:"fluttermane_48.png",name:"fluttermane",framesX:48,width:40,height:64}),({file:"flygon_32.png",name:"flygon",framesX:32,width:32,height:64}),({file:"gastly_72.png",name:"gastly",framesX:72,width:48,height:64}),({file:"golbat_48.png",name:"golbat",framesX:48,width:40,height:64}),({file:"haunter_68.png",name:"haunter",framesX:68,width:32,height:56}),({file:"honchkrow_38.png",name:"honchkrow",framesX:38,width:32,height:56}),({file:"hooh_36.png",name:"hooh",framesX:36,width:72,height:112}),({file:"landorous_54.png",name:"landorous",framesX:54,width:48,height:64}),({file:"landoroustherian_44.png",name:"landoroustherian",framesX:44,width:40,height:72}),({file:"latias_56.png",name:"latias",framesX:56,width:48,height:64}),({file:"latiasmega_48.png",name:"latiasmega",framesX:48,width:72,height:72}),({file:"latios_48.png",name:"latios",framesX:48,width:64,height:80}),({file:"latiosmega_48.png",name:"latiosmega",framesX:48,width:80,height:80}),({file:"lugia_30.png",name:"lugia",framesX:30,width:80,height:96}),({file:"mandibuzz_32.png",name:"mandibuzz",framesX:32,width:40,height:48}),({file:"mantine_68.png",name:"mantine",framesX:68,width:64,height:72}),({file:"mantyke_40.png",name:"mantyke",framesX:40,width:32,height:56}),({file:"misdreavus_48.png",name:"misdreavus",framesX:48,width:24,height:48}),({file:"mismagius_54.png",name:"mismagius",framesX:54,width:32,height:64}),({file:"moltres_36.png",name:"moltres",framesX:36,width:80,height:96}),({file:"moltresgalar_36.png",name:"moltresgalar",framesX:36,width:88,height:96}),({file:"murkrow_32.png",name:"murkrow",framesX:32,width:32,height:48}),({file:"noctowl_32.png",name:"noctowl",framesX:32,width:40,height:48}),({file:"noibat_48.png",name:"noibat",framesX:48,width:32,height:72}),({file:"noivern_32.png",name:"noivern",framesX:32,width:40,height:64}),({file:"pelliper_44.png",name:"pelliper",framesX:44,width:32,height:40}),({file:"shuppet_36.png",name:"shuppet",framesX:36,width:24,height:48}),({file:"skarmory_56.png",name:"skarmory",framesX:56,width:40,height:72}),({file:"swablu_40.png",name:"swablu",framesX:40,width:32,height:40}),({file:"swoobat_48.png",name:"swoobat",framesX:48,width:40,height:64}),({file:"talonflame_24.png",name:"talonflame",framesX:24,width:40,height:64}),({file:"thundurus_54.png",name:"thundurus",framesX:54,width:48,height:72}),({file:"togekiss_40.png",name:"togekiss",framesX:40,width:32,height:48}),({file:"tornadus_54.png",name:"tornadus",framesX:54,width:48,height:72}),({file:"vikavolt_64.png",name:"vikavolt",framesX:64,width:48,height:64}),({file:"wingull_36.png",name:"wingull",framesX:36,width:32,height:40}),({file:"woobat_48.png",name:"woobat",framesX:48,width:32,height:56}),({file:"yveltal_36.png",name:"yveltal",framesX:36,width:80,height:96}),({file:"zapdos_24.png",name:"zapdos",framesX:24,width:56,height:96}),({file:"zubat_48.png",name:"zubat",framesX:48,width:32,height:56})]
mons.forEach(o => {
    preload({ src: `./media/sprite/${o.file}`, framesX: o.framesX, framesY: 2 })
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
        <slide-show index="${+(Math.random() * 4000 > 3999)}" style="scale: ${scaleStr}" dur="${dura * choice.framesX}ms" src="./media/sprite/${choice.file}"></slide-show>
        </div>`
        .setParent(bg)
}
spawnPokemon()