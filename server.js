import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
import { serveDir } from "https://deno.land/std/http/file_server.ts"
import { join } from "https://deno.land/std@0.150.0/path/mod.ts"
const { parse: prse, stringify } = JSON,
{toPrimitive} = Symbol
    , proto = Object.preventExtensions(Object.create(null, { [toPrimitive]: { value() { return stringify(this) } } }))
 function parse(str) {
    let n = prse(str)
    return Object(n) === n ? deep(isArray(n) ? n : { __proto__: proto, ...n }) : n
}
function escapeHTML(str) {
    return str
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/&/g,'&amp;')
    .replace(/'/g,'&apos;')
    .replace(/"/g,'&quot;')
}
// const cache = await caches.open('server')
let port = 3001
console.clear()
console.log('💿 Booting...')
// let html = /(?:\.html?|\/)$/
// i had to resort to ai because i got so lost
// Get the directory where this server.js file is located
const serverDir = './'
const htmlHeaders = {
    'Content-Type':'text/html',
    'Access-Control-Allow-Origin':'*'
    // 'Document-Policy':'js-profiling'
}
await serve(go, { port })

function regular(text) {
    return new Response(text
    .replace(/LEVEL_TITLE(?: by LEVEL_AUTHOR)?/g, 'Choose a level - Marbles')
        .replace(/\?level=LEVEL_ID/g,''), {
        headers: htmlHeaders
    })
}
async function go(req) {
    try {
        //    const cached = await cache.match(req)
        //     if (cached)
        // return cached
        let url = new URL(req.url, `http://localhost:${port}`)
        // if(url.pathname.startsWith('/cute-emojis'))
        // return Response.redirect(new URL(url.pathname,'https://addsoupbase.github.io/'),301)
         
              let text = await(await fetch('https://addsoupbase.github.io/marbles/play/index.html')).text()
              if (url.searchParams.has('level')) try {
                  let level = url.searchParams.get('level')
                  let {title, author} = await(await fetch(`https://addsoupbase.github.io/marbles/play/levels/${level}/info.json`)).json()
                  return new Response(text
                      .replace(/LEVEL_TITLE/g, escapeHTML(title || 'Untitled'))
                      .replace(/LEVEL_ID/g, escapeHTML(level))
                      .replace(/LEVEL_AUTHOR/g, escapeHTML(author || 'Unknown'))
                      ,{
                      headers: htmlHeaders
                  })
              }
              catch(e) { 
                  console.error(e)
                  return regular(text)
              }
              else return regular(text)
          
        let out = await serveDir(req, {
            fsRoot: serverDir,
            showDirListing: true,
            enableCors: true,
        })
        // out.headers.append("Access-Control-Allow-Origin",'*')
        console.log(out.headers)
        if (out.headers.get('content-type')?.includes('javascript') || /\.js(?:\?.*)?$/.test(url.pathname)) {
            let jsContent = await getStrFromFile(url.pathname, 'js')
            if (jsContent) {
                return new Response(jsContent, {
                    headers: {
                        'content-type':'text/javascript',
                    }
                })
            }
        }

     /*   if (html.test(url.pathname) || url.pathname.at(-1)==='/') {
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
        }*/

        return out
    } catch (error) {
        console.error('Server error:', error)
        return  new Response(`${error}`, { status: 500 })
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
    // .replaceAll('https://addsoupbase.github.io/','http://localhost:3000/')
}

function modifyHTML(html) {
    return`${html.replace('<head>', `<head>
    <script>!function(){"use strict";var e=function(){removeEventListener("error",r),removeEventListener("load",e),e=r=null},r=function(r){if(/syntax/i.test("name"in r.error?r.error.name:r.error.message)){e(),"yeah"!==sessionStorage.getItem("err")&&prompt("You're using a *really* old browser, or I messed something up. Please share the message below with me: ",r.message+" @line "+r.lineno+" col "+r.colno+" file "+r.filename);var t=document.getElementById("template");sessionStorage.setItem("err","yeah"),t&&(document.body.innerHTML=t.content?t.content.firstElementChild.outerHTML:t.firstElementChild.outerHTML)}};addEventListener("load",e),addEventListener("error",r)}();</script>`)}`
}
