import { until } from '../../handle.js'
import *as m from '../../num.js'
import $ from '../../yay.js'
window.$ = $
let urls = []
let cycle
let { body } = $
let input = $('<input type="file" accept="image/*">', {
    events: {
        async change(e) {
            let [file] = this.files
            let src = URL.createObjectURL(file)
            console.log(file)
            let img = new Image
            img.src = src
            await until(img, 'load')
            await img.decode()
            let { width, height } = img
            console.log(width, height)
            console.dir(img)
            canvas.setAttributes({ width, height })
            ctx.drawImage(img, 0, 0, width, height)
            this.destroy()
            slice = $('<button>Slice!</button>', {
                parent: div,
                events: {
                    _click() {
                        let rowCount = +rows.value
                        let colCount = +cols.value
                        setTimeout(()=> {

                            cycle = m.cycleFrom(urls)
                            let o = $('img',{parent:body})
                            setInterval(()=>o.src=cycle.next,100)
                        },2000
                    )
                        for (let h = 0; h < rowCount; ++h) {
                            for (let w = 0; w < colCount; ++w) {
                                createImageBitmap(canvas.__direct__,
                                    w / colCount * width,
                                    h / rowCount * height,
                                    width / colCount,
                                    height / rowCount).then(
                                        async (bitmap) => {
                                            let ct = new OffscreenCanvas(width / rowCount, height / rowCount).getContext('bitmaprenderer')
                                            ct.transferFromImageBitmap(bitmap)
                                            let blob = await ct.canvas.convertToBlob()
                                            let s = URL.createObjectURL(blob)
                                            urls.push(s)
                                            $(`<img style="border: 2px solid black" src="${s}">`, { parent: body })
                                        }
                                    )
                            }
                        }
                    }
                }
            })
        }
    }
})
function onchange() {
    let c = +cols.value || 1
    let r = +rows.value || 1
}
let slice
let canvas = $('<canvas width="0" height="0">', {
    parent: body,
    events: {
        click({ offsetX: x, offsetY: y }) {
            ctx.beginPath()
            ctx.arc(x, y, 10, 0, Math.PI * 2)
            ctx.stroke()
        }
    }
})
let ctx = canvas.getContext('2d')
console.log(ctx)
Object.assign(ctx, {
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
})
let section = $('<section></section>', { parent: body }, input,)
let rows = body.$('<input type="number" placeholder="rows">')
let cols = body.$('<input type="number" placeholder="cols">')
let div = $('div #val', { parent: body }, rows, cols)
