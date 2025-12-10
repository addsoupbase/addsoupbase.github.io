import gif from 'https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm'
addEventListener('message', message)
let can = new OffscreenCanvas(0, 0)
let ctx = can.getContext('2d')
const bitmaps = new Map
ctx.imageSmoothingEnabled = false
async function message({ data: { src, buffer, canvas, type } }) {
    if (type && type === 'delete') {
        let frames = bitmaps.get(src)
        for (let b of frames)
            b.close()
        frames.clear()
        bitmaps.delete(src)
        console.debug(`ImageBitmap for ${src} closed`)
        return
    }
    let data = buffer
    let frames = gif.decompressFrames(gif.parseGIF(data), true)
    let out = []
    let bits = new Set
    for (let i = 0, l = frames.length; i < l; ++i) {
        let cur = frames[i]
            , { width, height, left, top } = cur.dims
        can.width = width
        can.height = height
        let data = new ImageData(cur.patch, width, height)
        ctx.imageSmoothingEnabled = false
        ctx.putImageData(data, left, top)
        let bitmap = await createImageBitmap(can)
        bits.add(bitmap)
        out.push({ data: bitmap, delay: cur.delay })
        switch (cur.disposalType) {
            default: ctx.clearRect(0, 0, width, height)
                break
            case 1: break
        }
    }
    bitmaps.set(src, bits)
    let c = canvas.getContext('2d')
    c.imageSmoothingEnabled = false
    animate(c, out, 0, bits)
    postMessage({ src })
}
function animate(ctx, frames, index, b) {
    let a = frames[index]
    let {data} = a
    if (b.has(data))
    {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
         ctx.canvas.width = a.data.width
        ctx.canvas.height = a.data.height
        ctx.drawImage(data, 0, 0)
        setTimeout(animate, a.delay, ctx, frames, (index + 1) % frames.length, b)
    }
}