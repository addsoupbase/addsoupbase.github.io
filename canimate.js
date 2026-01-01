const name = new URL(import.meta.url).pathname.slice(1, -3)
export const worker = new Worker(
    `data:text/javascript,${encodeURIComponent("import gif from 'https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm'\naddEventListener('message', message)\nlet can = new OffscreenCanvas(0, 0)\nlet ctx = can.getContext('2d')\nconst bitmaps = new Map\nctx.imageSmoothingEnabled = false\nasync function message({ data: { src, buffer, canvas, type } }) {\n    if (type && type === 'delete') {\n        let frames = bitmaps.get(src)\n        for (let b of frames)\n            b.close()\n        frames.clear()\n        bitmaps.delete(src)\n        console.debug(`ImageBitmap for ${src} closed`)\n        return\n    }\n    let data = buffer\n    let frames = gif.decompressFrames(gif.parseGIF(data), true)\n    let out = []\n    let bits = new Set\n    for (let i = 0, l = frames.length; i < l; ++i) {\n        let cur = frames[i]\n            , { width, height, left, top } = cur.dims\n        can.width = width\n        can.height = height\n        let data = new ImageData(cur.patch, width, height)\n        ctx.imageSmoothingEnabled = false\n        ctx.putImageData(data, left, top)\n        let bitmap = await createImageBitmap(can)\n        bits.add(bitmap)\n        out.push({ data: bitmap, delay: cur.delay })\n        switch (cur.disposalType) {\n            default: ctx.clearRect(0, 0, width, height)\n                break\n            case 1: break\n        }\n    }\n    bitmaps.set(src, bits)\n    let c = canvas.getContext('2d')\n    c.imageSmoothingEnabled = false\n    animate(c, out, 0, bits)\n    postMessage({ src })\n}\nfunction animate(ctx, frames, index, b) {\n    let a = frames[index]\n    let {data} = a\n    if (b.has(data))\n    {\n        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)\n         ctx.canvas.width = a.data.width\n        ctx.canvas.height = a.data.height\n        ctx.drawImage(data, 0, 0)\n        setTimeout(animate, a.delay, ctx, frames, (index + 1) % frames.length, b)\n    }\n}")}`, {
    type: 'module',
    name
}) 
let r = reportError.bind(window)
worker.addEventListener('error', r)
worker.addEventListener('messageerror', r)
export default canimate
async function canimate(src) {
    if (src.tagName === 'IMG' || src.tagName === 'VIDEO') src = src.src
    src = src.toString()
    let a = await fetch(src)
    if (!a.ok) throw new Error(`Network response was ${a.status}: ${a.statusText}`)
    let blob = await a.blob()
    let canvas = document.createElement('canvas')
    if (blob.type === 'image/gif') {
        if (!canvas.transferControlToOffscreen) return canvas
        canvas.setAttribute('data-gif', 'true')
        let off = canvas.transferControlToOffscreen()
        let promise = new Promise(waitForMessageFromWorker.bind(this, src))
        worker.postMessage({ src: src.toString(), buffer: await blob.arrayBuffer(), canvas: off }, [off])
        await promise
    }
    else if (blob.type.startsWith('video/')) {
        let video = document.createElement('video')
        video.preload = 'auto'
        video.load()
        video.loop =
            video.muted = true
        video.src = src
        await waitForVideoToLoad(video)
        let width = canvas.width = video.videoWidth
        let height = canvas.height = video.videoHeight
        let ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = false
        if (video.requestVideoFrameCallback) {
            function update(now, data) {
                video.requestVideoFrameCallback(update)
                ctx.clearRect(0, 0, width, height)
                ctx.drawImage(video, 0, 0, data.width, data.height)
            }
            video.requestVideoFrameCallback(update)
        }
        else {
            function update() {
                requestAnimationFrame(update)
                ctx.clearRect(0, 0, width, height)
                ctx.drawImage(video, 0, 0, width, height)
            }
            update()
        }
        video.play()
    }
    else if (blob.type.startsWith('image/')) {
        let img = document.createElement('img')
        function load() {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
        }
        img.addEventListener('load', load, { once: true })
        img.src = src
        let ctx = canvas.getContext('2d')
    }
    else throw TypeError(`Unsupported media type: ${blob.type}`)
    canvas.setAttribute('data-src', src)
    registry.register(canvas, src)
    return canvas
}
let registry = new FinalizationRegistry(src => {
   worker.postMessage({type:'delete', src})
})
function waitForVideoToLoad(video) {
    if (video.readyState === 4) return Promise.resolve()
    return new Promise(f)
    function f(resolve, reject) {
        video.addEventListener('canplaythrough', resolve, { once: true })
        video.addEventListener('error', reject, { once: true })
    }
}
function waitForMessageFromWorker(src, resolve, reject) {
    worker.addEventListener('message', hi)
    function hi(e) {
        if (e.data.src === src) {
            worker.removeEventListener('message', hi)
            resolve(e.data.canvas)
        }
    }
}
// function sleep(ms) {
//     let t = performance.now()
//     while(performance.now() - t < ms);
// }