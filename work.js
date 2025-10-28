import gif from 'https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm'
addEventListener('message', message)
let can = new OffscreenCanvas(0,0)
let ctx = can.getContext('2d')
ctx.imageSmoothingEnabled=false
async function message({ data: { src, buffer, canvas } }) {
    let data = buffer
    let frames = gif.decompressFrames(gif.parseGIF(data), true)
    let out = []
    for (let i = 0, l = frames.length; i < l; ++i) {
        let cur = frames[i]
            , { width, height, left, top } = cur.dims
        can.width = width
        can.height = height
        let data = new ImageData(cur.patch, width, height)
        ctx.putImageData(data, left, top)
        out.push({ data: await createImageBitmap(can), delay: cur.delay })
        switch (cur.disposalType) {
            default: ctx.clearRect(0, 0, width, height)
                break
            case 1: break
        }
    }
    animate(canvas.getContext('2d'), out, 0)
    postMessage({ src })
}
function animate(ctx, frames, index) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let a = frames[index]
    ctx.drawImage(a.data, 0, 0)
    setTimeout(animate, a.delay, ctx, frames, (index + 1) % frames.length)
}