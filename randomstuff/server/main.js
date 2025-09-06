import * as h from 'http://localhost:3000/handle.js'
import $ from 'http://localhost:3000/yay.js'
const { active: sw } = await navigator.serviceWorker.register('proxy.js', {
    type: 'module',
    scope: 'live/'
})
sw.postMessage({
    name: 'base',
    url: new URL('./live', location.href).href
})
let { upload } = $.id
upload.on({
    async click() {
        let n = await showDirectoryPicker()
        observer.observe(n, { recursive: true })
        addDirectory(n)
    }
})
async function addDirectory(dir, path = '') {
    for await (let entry of dir.entries()) {
        let me = entry[1]
        let { kind, name } = me
        if (kind === 'directory') await addDirectory(me, path + name + '/')
        else {
            addFile(await me.getFile(), path)
        }
    }
}
function addFile(file, path = '') {
    sw.postMessage({
        name: 'saveFile',
        path,
        file
    })
}
let observer = new FileSystemObserver(fileUpdate)
async function fileUpdate(records) {
    for (let thing of records) {
        switch (thing.type) {
            case 'modified': {
                let handle = thing.changedHandle
                let { kind, name } = handle
                if (kind === 'file') addFile(await handle.getFile(), thing.relativePathComponents.slice(0,-1).join('/'))
            }
                break
        }
    }
}
