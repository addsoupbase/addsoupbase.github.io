import * as h from '../handle.js'

let folderName
console.debug('Service worker started.')
let assets = new Map

async function add(url, file) {
    let c = await caches.open(folderName)
    let req = await fetch(file)
    // console.log(url)
    await c.put(url, req)
    // console.log(`${url} added to cache`)
}

h.on(self, {
    install(event) {
    },
    async message({data}) {
        if (data.type === 'reset') {
            assets.clear()
            await clearCache()
            folderName = data.folder
            return
        }
        if (data.type === 'cache') {
            try {
                assets.set(new URL(data.url, location).pathname, data.file)
                // await add(`live${data.url}`,data.file)
            } catch (e) {
                console.error(`${data.url} could not be added`)
                throw e
            }
        }
    },
    fetch(e) {
        let url = new URL(e.request.url)
        if (url.origin !== location.origin) return e.respondWith(fetch(e.request))
        let path = url.pathname
        if (!/\..+$/.test(path)) {
            while (path.at(-1) === '/') path = path.slice(0, path.length - 1)
            let index = `${path}/index.html${url.search}`
            return e.respondWith(Response.redirect(index, 301))
        }
        return e.respondWith(
            caches.open(folderName).then(cache => {
                return cache.match(e.request).then(cachedResponse => {
                    if (cachedResponse)
                        return cachedResponse
                    let assetUrl = assets.get(path.slice(20))
                    return fetch(assetUrl).then(response => {
                        if (response.ok)
                            cache.put(e.request, response.clone())

                        return response
                    }).catch(error => {
                        throw error
                    })
                })
            }))
    }
})

async function clearCache() {
    console.debug('Clearing cache...')
    let keys = await caches.keys()
    await Promise.all(keys.map(caches.delete, caches))
    console.debug('Cached cleared!')
}
