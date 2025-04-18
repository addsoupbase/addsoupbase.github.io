import { registerCSS } from "../csshelper.js"
import { until } from "../handle.js"
import { jason } from '../arrays.js'
let bubble = Object.assign(new Image, {
    src: `./media/bubble.webp`
})
await until(bubble, 'load')
await bubble.decode()
const width = Symbol.for('width'),
    name = Symbol.for('name')
const avatars = await Promise.all((await jason('./scripts/allava.json')).map(
    async function (o) {
        let n = new Image
        n.src = `./media/avatars/${o}`
        await Promise.all([until(n, 'load'), n.decode()])
        return n
    }
))
console.debug("🪪 All avatars loaded")
const mons = 
await Promise.all([
    'horsea:4',
    'qwilfish:4',
    'remoraid:4',
    'carvanha:4',
    'corsola:4',
    'gorebyss:9',
    'huntail:4',
    'kyogre:10',
    'lanturn:4',
    'manaphy:8',
    'luvdisc:12',
    'phione:10',
    'seadra:5',
    'mantyke:10',
    'sharpedo:8',
    'wailord:12',
    'nihilego:7',
    'feebas:8',
    'eelektross:8',
    'clawitzer:4',
    'wishiwashi:4',
    'wishiwashischool:12',
    'relicanth:4',
    'lumineon:4',
    'bruxish:12',
    'kyogreprimal:10',
].map(async function (o) {
    let [src, Width] = o.split(":")
    let img = Object.assign(new Image, {
        src: `./media/sprites/${src}.png`,
        [width]: +Width,
        [name]: src
    })
    await Promise.all([until(img, 'load'), img.decode()])
    return img
}))
mons.forEach(image => {
    registerCSS(`.${image[name]}`, {
        'background-image': `url(${image.src})`,
        width: `${(image.width / image[width])}px`,
        height: `${(image.height)}px`
    })
})
// registerCSS('.bubble',{
// filter: 'hue-rotate(90deg)'
// })
console.debug("🐠 All sprites loaded")
export { avatars, mons }