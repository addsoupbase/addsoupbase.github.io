const env = globalThis.toString().slice(8, -1)
let n = 0
let pingpong
switch (env) {
    default: {
        pingpong = WindowPing
        function WindowPing(worker, data, { targetOrigin, transfer } = {}) {
            const id = n++
            const d = {
                __proto__: null,
                id,
                chunk: data
            }
            function exec(resolve, reject) {
                function msg(e) {
                    let chunk = e.data
                    if (chunk.id === id) {
                        worker.removeEventListener('message', msg)
                        'error' in chunk ? reject(chunk.error) : resolve(chunk.chunk)
                    }
                }
                worker.addEventListener('message', msg)
            }
            const p = new Promise(exec)
            worker.postMessage(d, { targetOrigin, transfer })
            return p
        }
    }
        break
    case 'DedicatedWorkerGlobalScope': { //regular worker
        pingpong = when
        let handler = null
        addEventListener('message', msg)
        function when(func) {
            handler = func
        }
        async function msg(e) {
            const message = { __proto__: null, id: e.data.id }
            try {
                const chunk = await handler(e.data.chunk, e.data.id, e.data)
                message.chunk = chunk
            }
            catch (e) {
                message.error = e
            }
            finally {
                postMessage(message)
            }
        }
    }
        break
}
export default pingpong