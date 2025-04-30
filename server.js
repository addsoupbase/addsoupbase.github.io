import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
import { serveDir } from "https://deno.land/std/http/file_server.ts"
let port = 3000
// if (Deno.args.includes('alt')) port = 3001
console.log('💿 Booting...')
await serve(go, { port })
async function go(req) {
    let out = await serveDir(req, {
        fsRoot: "",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    })
    out.headers.append('Document-Policy', "js-profiling")
    return out
}