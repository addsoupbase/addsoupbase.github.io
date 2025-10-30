export const worker = new Worker(
    // '../work.js'||
    `data:text/javascript,${encodeURIComponent("import gif from 'https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm'\naddEventListener('message', message)\nlet can = new OffscreenCanvas(0,0)\nlet ctx = can.getContext('2d')\nctx.imageSmoothingEnabled=false\nasync function message({ data: { src, buffer, canvas } }) {\n    let data = buffer\n    let frames = gif.decompressFrames(gif.parseGIF(data), true)\n    let out = []\n    for (let i = 0, l = frames.length; i < l; ++i) {\n        let cur = frames[i]\n            , { width, height, left, top } = cur.dims\n        can.width = width\n        can.height = height\n        let data = new ImageData(cur.patch, width, height)\n        ctx.putImageData(data, left, top)\n        out.push({ data: await createImageBitmap(can), delay: cur.delay })\n        switch (cur.disposalType) {\n            default: ctx.clearRect(0, 0, width, height)\n                break\n            case 1: break\n        }\n    }\n    animate(canvas.getContext('2d'), out, 0)\n    postMessage({ src })\n}\nfunction animate(ctx, frames, index) {\n    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)\n    let a = frames[index]\n    ctx.drawImage(a.data, 0, 0)\n    setTimeout(animate, a.delay, ctx, frames, (index + 1) % frames.length)\n}")}`, {
    type: 'module',
    name: new URL(import.meta.url).pathname.slice(1,-3)
})
// worker.addEventListener('message', message)
worker.addEventListener('error', reportError.bind(window))
worker.addEventListener('messageerror', reportError.bind(window))
export default canimate
async function canimate(src) {
    if (src.tagName === 'IMG' || src.tagName === 'VIDEO') src = src.src
    let a = await fetch(src)
    if (!a.ok) throw new Error(`Network response was ${a.status}: ${a.statusText}`)
    let blob = await a.blob()
    let canvas = document.createElement('canvas')
    if (blob.type === 'image/gif') {
        if (!canvas.transferControlToOffscreen) return canvas
        let off = canvas.transferControlToOffscreen()
        let promise = new Promise(waitForMessageFromWorker.bind(this, src))
        worker.postMessage({ src, buffer: await blob.arrayBuffer(), canvas: off }, [off])
        await promise
    }
    else if (blob.type.startsWith('video/')) {
        let video = document.createElement('video')
        video.preload = 'auto'
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
        img.src = src
        let ctx = canvas.getContext('2d')
        img.onload = () => {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
        }
    }
    else throw TypeError(`Unsupported media type: ${blob.type}`)
    return canvas
}
function waitForVideoToLoad(video) {
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
