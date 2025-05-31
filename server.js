import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
import { serveDir } from "https://deno.land/std/http/file_server.ts"
import { join } from "https://deno.land/std@0.150.0/path/mod.ts"
const cache = await caches.open('server')
let port = 3000
console.clear()
console.log('💿 Booting...')
let html = /(?:\.html?|\/)$/
// i had to resort to ai because i got so lost
// Get the directory where this server.js file is located
const serverDir = './'
const htmlHeaders = {
    'Content-Type':'text/html',
    // 'Document-Policy':'js-profiling'
}
await serve(go, { port })
async function response(req,...data) {
    let out = Reflect.construct(Response, data)
    await cache.put(req, out)
    return out
}
async function go(req) {
    try {
        const cached = await cache.match(req)
        if (cached)
            return cached
        let url = new URL(req.url, `http://localhost:${port}`)
        if(url.pathname.startsWith('/cute-emojis'))
        return Response.redirect(new URL(url.pathname,'https://addsoupbase.github.io/'),301)
      /*  if(url.pathname.startsWith('/marbles/play')) {
            if (url.searchParams.has('level')) {
                let level = url.searchParams.get('level')
                let {title, author} = JSON.parse(await Deno.readTextFile(`marbles/play/levels/${level}/info.json`))
                return new response((await Deno.readTextFile('marbles/play/index.html'))
                    .replace(/LEVEL_TITLE/g, title)
                    .replace(/LEVEL_ID/g, level)
                    .replace(/LEVEL_AUTHOR/g, author)
                    ,{
                    headers: {
                        'Content-Type':'text/html'
                    }
                })
            }
        }*/
        let out = await serveDir(req, {
            fsRoot: serverDir,
            showDirListing: true,
            enableCors: true,
        })
        if (out.headers.get('content-type')?.includes('javascript') || /\.js(?:\?.*)?$/.test(url.pathname)) {
            let jsContent = await getStrFromFile(url.pathname, 'js')
            if (jsContent) {
                return  response(req, jsContent, {
                    headers: {
                        'content-type': 'text/javascript',
                    }
                })
            }
        }

        if (html.test(url.pathname) || url.pathname.at(-1)==='/') {
            let htmlPath = url.pathname.at(-1) === '/' ? `${url.pathname}/index.html` : url.pathname
            try {
                let htmlContent = await getStrFromFile(htmlPath, 'html')
                if (htmlContent) {
                    return  response(req,htmlContent, {
                        headers: htmlHeaders
                    })
                }
            }
            catch {
                return  response(req,`Not found`, {
                    headers: htmlHeaders
                })
            }
        }

        return out
    } catch (error) {
        console.error('Server error:', error)
        return  response(`${error}`, { status: 500 })
    }
}

async function getStrFromFile(pathname, type) {
    try {
        // Remove leading slash and create full path relative to server directory
        let fileName = pathname.startsWith('/') ? pathname.slice(1) : pathname
        if (!fileName || fileName === '') fileName = 'index.html'

        let fullPath = join(serverDir, fileName)
        let text = await Deno.readTextFile(fullPath)
        switch (type) {
            case 'js': return modifyJS(text, pathname)
            case 'html': return modifyHTML(text)
            default: return text
        }
    } catch (error) {
        console.error(`Error reading file ${pathname}:`, error)
        return null
    }
}

function modifyJS(script, url) {
    return `console.time('${url}');${script};console.timeEnd('${url}')`
}

function modifyHTML(html) {
    return`${html.replace('<head>', `<head>
    <script>!function(){"use strict";var e=function(){removeEventListener("error",r),removeEventListener("load",e),e=r=null},r=function(r){if(/syntax/i.test("name"in r.error?r.error.name:r.error.message)){e(),"yeah"!==sessionStorage.getItem("err")&&prompt("You're using a *really* old browser, or I messed something up. Please share the message below with me: ",r.message+" @line "+r.lineno+" col "+r.colno+" file "+r.filename);var t=document.getElementById("template");sessionStorage.setItem("err","yeah"),t&&(document.body.innerHTML=t.content?t.content.firstElementChild.outerHTML:t.firstElementChild.outerHTML)}};addEventListener("load",e),addEventListener("error",r)}();</script>`)}`
}
//     <script>"undefined"!=typeof console&&function(){"use strict";if(!RegExp("localhost|127\.0\.0\.1").test(location.host)){setInterval(console.clear,18e4);var t=RegExp("^(?:clear|count(?:Reset)?|createTask|profile(?:End)?|context|time(?:End|Stamp|Log)?)$");for(var e in console)"function"!=typeof console[e]||t.test(e)||(console[e]=function(t){return function(){try{t.apply(console,[].map.call(arguments,function(t){var e=t;return"function"==typeof t?e=t.toString():t&&"object"==typeof t&&(e="outerHTML"in t?t.outerHTML:t.toString!==({}).toString?t.toString():JSON.stringify(t)||t+""),"string"==typeof e&&e.length>500&&(e=e.slice(0,500)+"…"),e}))}catch(e){t("Object was not logged to prevent a potential memory leak")}}}(console[e]))}}()</script>