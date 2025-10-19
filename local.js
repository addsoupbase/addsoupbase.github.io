console.log('Service worker started')
addEventListener('fetch', function(e) {
    let {request} = e
    if (request.url.startsWith('https://addsoupbase.github.io')) {
        let {pathname} = new URL(request.url)
        e.respondWith(fetch(`http://localhost:3000${pathname}`))
        console.debug(`Intercepted request for ${request.url} and redirected to local server`)
    }
})