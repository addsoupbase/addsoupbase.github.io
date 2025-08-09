import $ from '../../yay.js'
import *as str from '../../str.js'
import color from '../../color.js'
import { on, until, download, reqFile,  } from '../../handle.js'
import * as math from '../../num.js'
import { registerCSS } from '../../csshelper.js'
import { getJson } from '../../arrays.js'
registerCSS('input[type="color"]::color-swatch', {
    'border-radius': '100%'
})
function setSelected(prop, val) {
    selected.spawn[prop] = val
    selected.reset()
}
let {'left-controls':leftControls} = $.id
// Body name
const {bodyname} = $.id

// Color picker thingy
const {'color-input':colorpicker} = $.id
colorpicker.on({
        input() {
            setSelected('color', this.value)
        }
    })
// Bounciness
const {bouncy: bounciness} = $.id
bounciness.on({
        input() {
            setSelected('restitution', this.value)
        }
    })
// Density
const {density} = $.id
   density.on({
        input() {
            setSelected('density', this.value)
        }
    })
// Scales
const scaleX = $.gid('scalex').on({
    input() {
        setSelected('scaleX', this.value)
    }
}),
    scaleY = $.gid('scaley').on({
        input() {
            setSelected('scaleY', this.value)
        }
    })

// Spawn interval
const spawnInterval = $.gid('spawninterval')
    .on({
        input() {
            setSelected('spawnInterval', this.value)
        }
    })
// Opacity
const {opacity} = $.id
opacity.on({
        input() {
            setSelected('opacity', this.value)
        }
    })
// Angle
let setAngleThingy = function () {
    setSelected('angle', math.toRad(angleSlider.value = angle.value = this.value))
}
const {angle,'angle-alt':angleSlider} = $.id
     angleSlider.on({ input: setAngleThingy })
    angle.on({ input: setAngleThingy })

// Image Picker
const imagePicker = $.gid('select-image')
    .on({
        input() {
            debugger
            selected.setImage(this.value)
        }
    })
// Static Checkbox
const {isStatic} = $.id
    isStatic.on({
        input() {
            setSelected('isStatic', this.checked)
        }
    })
isStatic.indeterminate = true

// Clone Button
const cloneButton = $.gid('clone')
    .on({
        click() {
            selected.clone()
        }
    })
// Delete Button
const deleteButton = $.gid("delete")
.on({
    click() {
        selected.remove()
        hide()
    }
})


$.gid('reset-cam').on({
    click() {
        game.postMessage('resetcam')
    }
})
function clearMarbles() {
    marbles.clear()
    count = 0
    // imageCache.clear()
    racers.destroyChildren()
    racers.push($(`<h3>No marbles added :(</h3>`))
}
let levelTitle =$.gid('leveltitle'),
levelAuthor = $.gid('levelauthor')
let mport = $.gid('import-button')
    .on({
        async click() {
            let f = await reqFile('.json')
            let url = URL.createObjectURL(f)
            let data = await getJson(url)
            clearMarbles()
            levelAuthor.value = data.author || 'Unknown'
            levelTitle.value = data.title || 'Level'
            game.getLevelFromJSON(data)
            for (let [, marble] of marbles) {
                addMarble({
                    color: marble.color,
                    image: marble.image,
                    name: marble.name
                }, true)
            }
        }
    })

// let exportDownloadButton = $.gid('export') 
$.gid('cancel-export').on({
    click() {
        exportmenuholder.fadeOut()
    }
})
let exportmenuholder = $.gid('exportmenuholder')
let exportMenu = $.gid('exportmenu')
    .on({
        async $submit() {
            let { title, author } = this
            author = `${author || 'Unknown'}`
            title = `${title || 'Level'}`
            let ctx = document.createElement('canvas').getContext('2d')
            Object.assign(ctx.canvas, {
                width: 256,
                height: 256
            })
            let obj = {
                title: str.shorten(title, 32),
                author: str.shorten(author, 16),
                __proto__: null, settings: Object.fromEntries(Object.entries(settings).map(([p, v]) => [p, +v])),
                racers: [...marbles.values()], map: Array.from(entities.values(), o => {
                    let spawn = { ...o.spawn }
                    spawn.scaleX &&= +spawn.scaleX
                    spawn.scaleY &&= +spawn.scaleY
                    delete spawn.isSensor
                    if (spawn.shape === 0 || spawn.scaleX === spawn.scaleY) {
                        let old = Math.max(spawn.scaleX, spawn.scaleY)
                        delete spawn.scaleX
                        delete spawn.scaleY
                        spawn.radius = old
                    }
                    if (o.constructor.name !== 'obj')
                        spawn.type = o.constructor.name
                    return spawn
                }
                )
            }
            let allImages = []
            let seenImages = new Map
            let allShapes = []
            let seenShapes = new Map
            for (let n of obj.racers.concat(obj.map)) {
                let { image } = n
                if (image != null && image !== 'none') {
                    debugger
                    if (seenImages.has(image)) {
                        n.image = seenImages.get(image)
                    } else {
                        let img = new Image()
                        img.src = imageCache.get(image)?.src ?? image
                        await until(img, 'load')
                        await img.decode()
                        ctx.drawImage(img, 0, 0, 256, 256)
                        let data = ctx.canvas.toDataURL('image/png', 0.9)
                        allImages.push(data)
                        ctx.clearRect(0,0,256,256)
                        seenImages.set(image, allImages.length - 1)
                        n.image = allImages.length - 1
                    }
                } else {
                    delete n.image
                }

                let { shape } = n
                if (Array.isArray(shape)) {
                    if (typeof shape[0]?.[0] === 'number') {
                        shape = JSON.stringify(shape)
                        if (seenShapes.has(shape)) {
                            n.shape = seenShapes.get(shape)
                        } else {
                            allShapes.push(shape)
                            seenShapes.set(shape, -(allShapes.length))
                            n.shape = -(allShapes.length)
                        }
                    } else {
                        let data = n.shape.map(o => o.getAttribute('d').toString()).join('|')
                        if (seenShapes.has(data)) {
                            n.shape = seenShapes.get(data)
                        } else {
                            seenShapes.set(data, -(allShapes.length + 1))
                            allShapes.push(data)
                            n.shape = -(allShapes.length)
                        }
                    }
                }

                for (let i in n) {
                    let val = n[i]
                    if (val === base[i]) {
                        delete n[i]
                    } else {
                        switch (i) {
                            case 'opacity':
                                if (val === 1) delete n[i]
                                break
                            case 'angle':
                                if (val === 0) delete n[i]
                                break
                            case 'isStatic':
                                if (val === false) delete n[i]
                                break
                            case 'type':
                                if (val === 'body') delete n[i]
                                break
                        }
                    }
                }
            }
            obj.shapes = allShapes
            obj.images = allImages
            download(new Blob([JSON.stringify(obj)]), 'data.json')
        }
    })
let exportToggleMenuButton = $.gid('export-button')
    .on({
        click() {
            exportmenuholder.fadeIn()
        }
    })

let cached = new WeakSet
let cachedVertices = new WeakSet
on(window, {
    _load() {
        $.body.show(3)
    }
})
$.gid('right-button')?.on({
    async click() {
        if (this.parent.anims.length) return
        if (this.textContent === 'Hide') {
            this.textContent = 'Show'
            await this.parent.animate([{ right: '0px', opacity: '1' }, { right: '-150px', opacity: '0.5' }], { duration: 400, easing: 'ease', }).finished
            this.parent.setStyles({ right: '-150px', opacity: '0.5' })
        }
        else {
            this.textContent = 'Hide'
            await this.parent.animate([{ right: '-150px', opacity: '0.5' }, { right: '0px', opacity: '1' }], { duration: 400, easing: 'ease', }).finished
            this.parent.setStyles({ right: '0px', opacity: '1' })
        }
    }
})
let uploadButton = $.gid('upload-images').on({
    click() {
        files.click()
    }
})
function updateImages(file) {
    let url
    if (file instanceof Image) {
        url = file.src
    }
    else {
        url = URL.createObjectURL(file)
    }
    cached.add(file)
    game.postMessage({
        title: file.name,
        url
    })

    // el.destroyChildren()
    // el.$(`<option value="none">None</option>`)
    imagePicker.push($(`<option value="${file.name || file.title}">${file.name || file.title}</option>`))
    // el.push(...Array.from(imageCache.entries(),
    // function ([title, src]) {
    // console.log(src, title)
    // return $(`<option value="${src}">${title}</option>`)
}
let files = uploadButton.after.on({
    change() {
        for (let file of this.files) {
            if (cached.has(file)) {
                //  Do something...
            }
            else updateImages(file)
        }
        hide()
    }
})
function hide() {
    leftControls.first.hide()
}
function show() {
    leftControls.first.show()
}
function message(e) {
    let { data } = e
    switch (data) {
        // case null: hide(),alert(12)
        // break
        case 'hideData': {
            window.selected = null, game.postMessage("resetMouse")
        }
            break
        case 'showData': {
            showStatPicker(selected)
        }
            break
    }
}
function showStatPicker(my) {
    show()
    bodyname.textContent = my.label
    bounciness.value = my.spawn.restitution
    density.value = my.spawn.density
    opacity.value = my.spawn.opacity
    scaleX.value = my.spawn.scaleX
    scaleY.value = my.spawn.scaleY
    colorpicker.value = my.spawn.color
    angle.value = angleSlider.value = math.toDeg(my.spawn.angle)
    isStatic.indeterminate = false
    isStatic.checked = my.spawn.isStatic
    if (my.dontShow.has('name')) {

    }
    my.dontShow.has('angle') ? angle.parent.hide(3) : angle.parent.show(3)
    my.dontShow.has('opacity') ? opacity.parent.hide(3) : opacity.parent.show(3)
    my.dontShow.has('scale') ? (scaleY.parent.hide(3), scaleX.parent.hide(3)) : (scaleY.parent.show(3), scaleX.parent.show(3))
    my.dontShow.has('static') ? isStatic.parent.hide(3) : isStatic.parent.show(3)
    my.dontShow.has('density') ? density.parent.hide(3) : density.parent.show(3)
    my.dontShow.has('restitution') ? bounciness.parent.hide(3) : bounciness.parent.show(3)
    my.dontShow.has('image') ? imagePicker.parent.hide(3) : imagePicker.parent.show(3)
    my.constructor.name === 'spawn' ? (spawnInterval.value = my.spawn.spawnRate
        , spawnInterval.parent.show(3)) : spawnInterval.parent.hide(3)
}
on(window, {
    message
})
let { contentWindow: game } = $.qs('iframe')
let isPaused = true
let isPlacing = true
let toggle = $.gid('play-button').on({
    click() {
        isPaused = !isPaused
        this.textContent = isPaused ? ((selected && show()), 'Play') : (hide(), 'Pause')
        game.postMessage('Toggle')
    }
})
let placingOrMoving = $.gid('place-toggle').on({
    click() {
        isPlacing = !isPlacing
        window.selected = null
        hide()
        this.styles.filter = `hue-rotate(${isPlacing ? '300' : '70'}deg) brightness(80%)`
        game.postMessage(this.textContent = isPlacing ? ('Placing') : ('Moving'))
    }
})
let chosen = $.gid('place-entity')
    .on({
        change() {
            if (this.value === 'svg') return uploadSvgs.showPicker()
            game.postMessage({ select: this.value })
        }
    })
window.addSVG = addSVG
function addSVG(data, name) {
    chosen.last.before = ($(`<option value="${name}">${name}</option>`))
    chosen.value = name
    game.postMessage({ select: name })
    game.postMessage({
        title: name,
        svg: data
    })
}
let uploadSvgs = $(`<input type="file" accept=".svg,.json" multiple>`, {
    events: {
        async change() {
            for (let file of this.files) {
                if (cachedVertices.has(file)) {
                    //  Do something...
                }
                else {
                    if (file.type === 'application/json') {
                        file.text().then(data => {
                            data = JSON.parse(data)
                            if (!Array.isArray(data) || !data.length) {
                                throw TypeError('Bad data :(')
                            }
                            game.postMessage({ select: file.name })
                            game.postMessage({
                                title: file.name,
                                vertices: data
                            })
                            chosen.last.before = ($(`<option value="${file.name}">${file.name}</option>`))
                            chosen.value = file.name
                            cachedVertices.add(file)
                        })
                    }
                    else {
                        cachedVertices.add(file)
                        file.text().then(data => {
                            chosen.last.before = ($(`<option value="${file.name}">${file.name}</option>`))
                            chosen.value = file.name
                            game.postMessage({ select: file.name })
                            game.postMessage({
                                title: file.name,
                                svg: data
                            })
                        })
                    }
                }
            }
        }
    }
})
window.addMarble = addMarble
function addMarble({ name, image, color: col }, noadd) {
    if (!this) return addMarble.call(addMarbleButton, { name, image, color: col }, noadd)
    name ??= `Marble ${count}`
    col ??= color.choose()
    noadd ?? marbles.set(count, {
        __proto__: null,
        name: name,
        image: null,
        color: col
    })
    let me = marbles.get(count)
    racers.first.hide()
    let n = racers.$(`div.racer #marble-${count}`, null,
        $('div', null,
            $(`<input type="color" value="${col}">`, {
                events: {
                    input() {
                        me.color = this.value
                    }
                }
            }),
            $(`<input class="cute-green" placeholder="Marble name" value="${name}">`, {
                events: {
                    change() {
                        me.name = this.value
                    }
                }
            })
        ),
        $(`<label>Image: </label>`, null,
            $(`<select name="marbleimageselect"><option value="none">None</option></select>`, {
                events: {
                    change() {
                        me.image = this.value
                    }
                }
            },
                ...Array.from(imageCache.entries(),
                    function ([title, src]) {
                        let checked = ''
                        if (src.src) src = src.src
                        if (title === image) {
                            checked = 'selected'
                        }
                        return $(`<option value="${title}" ${checked}>${title}</option>`)
                    })
            )
        ),
        $('<button class="cute-green-button red">Delete</button>', {
            events: {
                click() {
                    marbles.delete(this.parent.flags)
                    this.parent.destroy()
                }
            }
        })
    )
    n.flags = count
    ++count
}
let racers = $.gid('racer-holder')
let count = 0
let addMarbleButton = $.gid('add-marble-button')
    .on({
        click: addMarble
    })
/*
    <div class="racer">
                            <div>
                                <input type="color" value="#FF0000">
                                <input class="cute-green" placeholder="Name">
                            </div>
                            <label>
                                Image:
                                <select>
                                    <option>None</option>
                                </select>
                            </label>
                            <button class="cute-green-button red">Delete</button>
                        </div>
*/
hide()
