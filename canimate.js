const name = new URL(import.meta.url).pathname.slice(1, -3)
export const worker = new Worker(
    `data:text/javascript,${"import%20gif%20from%20'https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fgifuct-js%402.1.2%2F%2Besm'%0AaddEventListener('message'%2C%20message)%0Alet%20can%20%3D%20new%20OffscreenCanvas(0%2C%200)%0Alet%20ctx%20%3D%20can.getContext('2d')%0Aconst%20bitmaps%20%3D%20new%20Map%0Actx.imageSmoothingEnabled%20%3D%20false%0Aasync%20function%20message(%7B%20data%3A%20%7B%20src%2C%20buffer%2C%20canvas%2C%20type%20%7D%20%7D)%20%7B%0A%20%20%20%20if%20(type%20%26%26%20type%20%3D%3D%3D%20'delete')%20%7B%0A%20%20%20%20%20%20%20%20let%20frames%20%3D%20bitmaps.get(src)%0A%20%20%20%20%20%20%20%20for%20(let%20b%20of%20frames)%0A%20%20%20%20%20%20%20%20%20%20%20%20b.close()%0A%20%20%20%20%20%20%20%20frames.clear()%0A%20%20%20%20%20%20%20%20bitmaps.delete(src)%0A%20%20%20%20%20%20%20%20console.debug(%60ImageBitmap%20for%20%24%7Bsrc%7D%20closed%60)%0A%20%20%20%20%20%20%20%20return%0A%20%20%20%20%7D%0A%20%20%20%20let%20data%20%3D%20buffer%0A%20%20%20%20let%20frames%20%3D%20gif.decompressFrames(gif.parseGIF(data)%2C%20true)%0A%20%20%20%20let%20out%20%3D%20%5B%5D%0A%20%20%20%20let%20bits%20%3D%20new%20Set%0A%20%20%20%20for%20(let%20i%20%3D%200%2C%20l%20%3D%20frames.length%3B%20i%20%3C%20l%3B%20%2B%2Bi)%20%7B%0A%20%20%20%20%20%20%20%20let%20cur%20%3D%20frames%5Bi%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%2C%20%7B%20width%2C%20height%2C%20left%2C%20top%20%7D%20%3D%20cur.dims%0A%20%20%20%20%20%20%20%20can.width%20%3D%20width%0A%20%20%20%20%20%20%20%20can.height%20%3D%20height%0A%20%20%20%20%20%20%20%20let%20data%20%3D%20new%20ImageData(cur.patch%2C%20width%2C%20height)%0A%20%20%20%20%20%20%20%20ctx.imageSmoothingEnabled%20%3D%20false%0A%20%20%20%20%20%20%20%20ctx.putImageData(data%2C%20left%2C%20top)%0A%20%20%20%20%20%20%20%20let%20bitmap%20%3D%20await%20createImageBitmap(can)%0A%20%20%20%20%20%20%20%20bits.add(bitmap)%0A%20%20%20%20%20%20%20%20out.push(%7B%20data%3A%20bitmap%2C%20delay%3A%20cur.delay%20%7D)%0A%20%20%20%20%20%20%20%20switch%20(cur.disposalType)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20default%3A%20ctx.clearRect(0%2C%200%2C%20width%2C%20height)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%0A%20%20%20%20%20%20%20%20%20%20%20%20case%201%3A%20break%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20bitmaps.set(src%2C%20bits)%0A%20%20%20%20let%20c%20%3D%20canvas.getContext('2d')%0A%20%20%20%20c.imageSmoothingEnabled%20%3D%20false%0A%20%20%20%20animate(c%2C%20out%2C%200%2C%20bits)%0A%20%20%20%20postMessage(%7B%20src%20%7D)%0A%7D%0Afunction%20animate(ctx%2C%20frames%2C%20index%2C%20b)%20%7B%0A%20%20%20%20let%20a%20%3D%20frames%5Bindex%5D%0A%20%20%20%20let%20%7Bdata%7D%20%3D%20a%0A%20%20%20%20if%20(b.has(data))%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20ctx.clearRect(0%2C%200%2C%20ctx.canvas.width%2C%20ctx.canvas.height)%0A%20%20%20%20%20%20%20%20%20ctx.canvas.width%20%3D%20a.data.width%0A%20%20%20%20%20%20%20%20ctx.canvas.height%20%3D%20a.data.height%0A%20%20%20%20%20%20%20%20ctx.drawImage(data%2C%200%2C%200)%0A%20%20%20%20%20%20%20%20setTimeout(animate%2C%20a.delay%2C%20ctx%2C%20frames%2C%20(index%20%2B%201)%20%25%20frames.length%2C%20b)%0A%20%20%20%20%7D%0A%7D"+''}`, {
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