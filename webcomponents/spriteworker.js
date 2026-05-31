'use strict'
addEventListener('message', msg)
function msg(e) {
    let port = e.ports[0]
    let { width, height, bitmap } = e.data
    try {
        let c = new OffscreenCanvas(width, height).getContext('2d')
        for (let x = 0; x < width; ++x) for (let y = 0; y < height; ++y)
            c.drawImage(bitmap, width * x, height * y, width, height, 0, 0, width, height)
        let data = c.getImageData(0, 0, width, height).data
        let top = Infinity,
            bottom = -1,
            left = Infinity,
            right = -1
        for (let y = 0; y < height; ++y) {
            const rowStart = y * width * 4
            for (let x = 0; x < width; ++x) {
                const alpha = data[rowStart + x * 4 + 3]
                if (alpha > 0) {
                    if (y < top) top = y
                    if (y > bottom) bottom = y
                    if (x < left) left = x
                    if (x > right) right = x
                }
            }
        }
        if (top === Infinity) {
            top = bottom = left = right = null
        }
        port.postMessage({ left, right, bottom, top })
    }
    catch (e) {
        port.postMessage(e)
    }
    finally {
        bitmap.close()
    }
}

