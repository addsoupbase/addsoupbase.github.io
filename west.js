// import * as h from 'http://localhost:3000/handle.js'
let server = Deno.serve({
    port: 3002,
    corsEnabled: true
}, main)
let url = 'https://discord.com/api/webhooks/1429327065341231196/qd1ZsGKy2jEaq9BJ99MtTZuxAIaZG8-mCBkcZU5eg_9e2TtFQq8PUuat5ESzbdiYF54m'
let allow = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}
function messageFormat(message) {
    message = message.replace(/https?:\/\//g, '')
    let a = {content:`> ${message}`}
    return JSON.stringify(a)
} 
let cache = null
async function main(req) {
    // return new Response(null,{status:200})
    if (req.method === 'HEAD') return new Response(null, { status: 200, headers: allow })
    if (req.method === 'GET') {
        return new Response(null, { status: 405, headers: allow })
    }
    if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: allow })
    // if (req.method === 'GET') return new Response(null, { status: 200, headers: allow })
    if (req.method === 'POST')
        try {
            if (req.headers.get('content-type') === 'application/x-www-form-urlencoded') {
                // await fetch()
                console.log(req.message)
                let data = await req.formData()
                let msg = data.get('message')
                if (!msg.trim()) return new Response(null, { status: 400 })
                await fetch(`https://discord.com/api/webhooks/1429327065341231196/qd1ZsGKy2jEaq9BJ99MtTZuxAIaZG8-mCBkcZU5eg_9e2TtFQq8PUuat5ESzbdiYF54m`, {
                    method: "POST",
                    body: messageFormat(msg),
                    headers: {
                        'content-type':'application/json'
                    }
                })
                return Response.redirect('http://localhost:3000/bihifive.github.io/sent.html')
            }
            else return new Response(null, { status: 415 })
        }
        catch (e) {
            console.error(e)
            return new Response(null, { status: 500 })
        }
    return new Response(null, { status: 405, headers: allow })
}

