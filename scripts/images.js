import {registerCSS} from "../csshelper.js"
import {until} from "../handle.js"
import {jason} from '../arrays.js'
let bubble = Object.assign(new Image, {
    src: './media/bubble.webp'
})

export let colorful = new Set
let today = new Date()
export const birthday =
     today.getMonth() === 6 - 1 && today.getDate() === 17


const width = Symbol.for('width'),
    name = Symbol.for('name')
let avatars, mons
export let time = new Promise( async(resolve) => {


        avatars = (await Promise.allSettled((await jason('./allava.json')).map(
            async function (o) {
                let n = new Image
                n.src = `./media/avatars/${o}`
                await Promise.all([until(n, 'load', 'error'), n.decode()])
                return n
            }
        ))).filter(o => o.status === 'fulfilled').map(o => o.value)
        console.debug("🪪 Avatars loaded")
        if (birthday) {
            console.log('%cOMG ITS MY BIRTHDAY YAYYY 🎂🎂','font-size:2em;')
            if (!bubble.complete)await Promise.all([until(bubble, 'load'), bubble.decode()])
            let {width: w, height: h} = bubble
            let ctx = Object.assign(new OffscreenCanvas(w,h).getContext('2d'), {
                imageSmoothingEnabled: 'true',
                imageSmoothingQuality: 'high'
            })
            for (let i = 360; i -= 10;) {
                ctx.filter = `hue-rotate(${i}deg)`
                ctx.drawImage(bubble, 0, 0, w, h)
                let image = URL.createObjectURL(await ctx.canvas.convertToBlob())
                  colorful.add(image)
                ctx.clearRect(0, 0, w, h)
            }
        }
        mons =
           (await Promise.allSettled([
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
                'goldeen:8',
                'arctovish:4',
                'groudon:4',
                // 'barboach:6', it looks weird
                // 'eelektrik:10', it also looks weird
                'inkay:4',
                'jellicent_f:7',
                'jellicent_m:7',
                'kingdra:4',
                'seaking:4',
                'tynamo:4',
                'skrelp:4',
                'mantine:10',
                'tentacool:4',
                'wailmer:7',
                'basculin:4',
                'basculin-white:4',
                'basculin-blue:4'
                // 'dragalge:5' also looks weird,
            ].map(async function (o) {
                let {0: src, 1: Width} = o.split(":")
                let img = Object.assign(new Image, {
                    src: `./media/sprites/${src}.png`,
                    [width]: +Width,
                    [name]: src
                })
                await Promise.all([until(img, 'load', 'error'), img.decode()])
                return img
            })))
            .filter(o =>  o.status === 'fulfilled')
            .map(({value}) => value)
        mons.forEach(image => {
            registerCSS(`.${image[name]}`, {
                'background-image': `url(${image.src})`,
                width: `${(image.width / image[width])}px`,
                height: `${(image.height)}px`
            })
        })
    mons = new Set(mons)
        resolve({avatars,mons})
        console.debug("🐠 Sprites loaded")

})
// registerCSS('.bubble',{
// filter: 'hue-rotate(90deg)'
// })
