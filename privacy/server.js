import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
let headers = {
    'access-control-allow-origin': '*',
    'content-type': 'application/json'
}
await serve(go, { port: 3002 })
async function go(e) {
    let obj = {}
    e.headers.forEach(thing, obj)
    return new Response(JSON.stringify(obj), {
        headers
    })
}
function thing(val, key) {
    this[key] = val
}