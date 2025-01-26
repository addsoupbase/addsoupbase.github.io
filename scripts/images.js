import { registerCSS, } from "../quick.js"
import {until} from "../handle.js"
const avatars = await Promise.all((await (await fetch('./scripts/allava.json')).json()).map(
    async function (o) {
        let n = new Image
        n.src = `./media/avatars/${o}`
        await until(n, 'load')
        return n
    }
))
console.debug("All avatars loaded")
const mons = await Promise.all([
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
].map(async function (o) {
    let img = new Image
    let [src, width] = o.split(":")
    img.src = `./media/${src}.png`
    img.__width = +width
    img.__name = src
    await until(img, 'load')
    return img
}))
mons.forEach(image => {
    registerCSS(`.${image.__name}`, {
        'background-image': `url(${image.src})`,
        width: `${image.width / image.__width}px`,
        height: `${image.height}px`
    })
})
console.debug("All sprites loaded")
export { avatars, mons }
