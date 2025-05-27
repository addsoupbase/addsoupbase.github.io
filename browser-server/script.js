import $ from '../yay.js'

let handle
acorn.defaultOptions.ecmaVersion = 'latest'
const {button, goto, progress} = $.id
goto.on({
    submit(e) {
        e.preventDefault()
        let src = new URL(this.src.value.trim()||'index.html',location.href+'live/')
        open(src)
    }
})
button.on({
    async '#click'(...{1: abort}) {
        handle = await showDirectoryPicker({
            mode: 'readwrite',
            startIn: 'downloads'
        })
        post({
            type: 'reset',
            folder: handle.name
        })
        progress.show()

        await handleDirectory(handle)
        goto.show().fadeIn()
        progress.hide()

    }
}, false, new AbortController)
let result = await navigator.serviceWorker.register('./sw.js', {
    scope: './live/',
    type: 'module'
})
await result.update()
const post = result.active.postMessage.bind(result.active)

async function handleDirectory(dir, base = '') {
    let all = await Array.fromAsync(dir.values())
    for (let entry of all) {
        if (entry instanceof FileSystemDirectoryHandle) handleDirectory(entry, `${base}/${entry.name}`)
        else {
            let url = `${base}/${entry.name}`
            console.warn(url)
            let raw = await entry.getFile()
            if (entry.name.endsWith('.js')) {
                let text = await raw.text()
                let src
                try {
                    src = acorn.parse(text)
                } catch {
                    src = acorn.parse(text, {
                        sourceType: 'module'
                    })
                }
                acorn.walk.simple(src, {
                    Literal() {
                    },
                    ImportNamespaceSpecifier(e) {
                    },
                    ImportExpression(v) {
                        if (v.source.type === 'TemplateLiteral') {
                            let {raw} = v.source.quasis[0].value
                            let u = new URL(raw, `${location.href}live${url}`)
                            text = text.replace(raw, `${u}`)
                            console.warn(u)
                        } else {
                            let u = new URL(v.source.value, `${location.href}live${url}`)
                            text = text.replace(v.source.raw, `"${u}"`)
                        }
                    },
                    ImportDeclaration(v) {
                        let u = new URL(v.source.value, `${location.href}live${url}`)
                        text = text.replace(v.source.raw, `"${u}"`)
                    }
                })
                post({
                    type: 'cache',
                    url,
                    file: URL.createObjectURL(new Blob([text], {
                        type: 'text/javascript'
                    }))
                })
                continue
            }
            post({
                type: 'cache',
                url,
                file: URL.createObjectURL(raw)
            })
        }
    }
}