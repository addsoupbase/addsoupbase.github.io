import * as h from '../handle.js'
let folderName
console.debug('Service worker started.')
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
            await clearCache()
            folderName = data.folder
            return
        }
        if (data.type === 'cache') {
            try {
            await add(`live${data.url}`,data.file)
            }
            catch(e) {
                console.error(`${data.url} could not be added`)
                throw e
            }
        }
    },
    fetch(e) {
        if (new URL(e.request.url).origin !== location.origin) return e.respondWith(fetch(e.request))
        e.respondWith(caches.open(folderName).then(cache=>{
            let url = new URL(e.request.url)
            let a = url.pathname
            if (!/\..+$/.test(a)) {
                while (a.at(-1)==='/')a=a.slice(0,a.length-1)
                let index = `${a}/index.html${url.search}`
                return Response.redirect(index,301)
            }
            return cache.match(url.href.replace(url.search,'')).then(res=>res)
        }))
    }
})

async function clearCache() {
    console.debug('Clearing cache...')
    let keys = await caches.keys()
    await Promise.all(keys.map(caches.delete, caches))
    console.debug('Cached cleared!')
}
