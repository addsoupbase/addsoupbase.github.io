import * as h from 'http://localhost:3000/handle.js'
console.debug('Service worker ready!!! ')
let base = ''
let cache = new Map
h.on(self, {
    fetch(e) {
        if (!e.request.url.startsWith(base)) return
        // if (e.request.url.startsWith(base) &&  )
        let path = new URL(e.request.url).pathname.slice(25)
        if (cache.has(path)) e.respondWith(new Response(cache.get(path)))
        else e.respondWith(new Response(null, { status: 404 }))
    },
    message(e) {
        let { data } = e
        if (data.name === 'saveFile') {
            saveFile(data.file, data.path)
        }
        else if (data.name === 'reset') {
            cache.clear()
        }
        else if (data.name === 'base') {
            base = data.url
        }
    }
})
function saveFile(e, path) {
    debugger
    cache.set(path + e.name, e)
}