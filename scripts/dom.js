import '../webcomponents/paper-canvas.js'
import $,{h} from '../yay.js'
let { drawInstead, send1, send2, draw, drawcontrols, undoDraw } = $.id

// $.id.pickAColor
drawInstead.on({
    _click() {
        this.before.destroy()
            ;[].forEach.call(document.querySelectorAll('[data-hi]'), o => o.remove())
        this.destroy()
        send2.fadeIn()
        send1.hide(3)
    }
})
send2.on({
    async $_submit() {
        try {
            let pencil = $('<img src="./cute-emojis/emojis/1216660171951046746.gif" alt="pencil loading icon">')
            !(async () => {
                await this.fadeOut()
                this.replace(pencil)
                pencil.attr._busy = "true"
                pencil.fadeIn()
            })()
            let data = draw.dataURL(1).slice(22)
            let res = await fetch(this.attr.$action, {
                mode: 'cors',
                method: 'post',
                headers: { 'Content-Type': 'text/plain' },
                body: data
            })
            if (res.ok) {
                // await wait(1000)
                let yay = $('<samp>Sent... YAYYYYY!!</samp>')
                await pencil.fadeOut()
                pencil.replace(yay)
                yay.fadeIn()
                yay.styles.display = "block"
                yay.animate([{ transform: 'scale(2,2)' }, { transform: '' }], { duration: 500, iterations: 1, easing: 'ease' })
            }
            else alert('Failed to send :(')
        }
        catch (e) {
            prompt('failed to send:(', e)
        }
    }
})
undoDraw.on({
    click() {
        draw.undo()
    }
})
drawcontrols.delegate({
    change() {
        switch (this.type) {
            case 'range': {
                ctx.lineWidth = this.value
            }
                break
            case 'color': {
                ctx.strokeStyle = ctx.fillStyle = this.value
            }
                break
        }
    }
})
let ctx
h.on(window, {
    _load() {
        ctx = draw.ctx
    }
})
// let zoom = 1

if (top === window) $.id.viewframe.destroy()
/*location.hash ? main.animate([{filter: 'blur(2px)', opacity: 0, scale: '0.8 0.8', translate: '0 -40px'}, {
        filter: '',
        opacity: .96
    }], {duration: 700, easing: 'ease-in', fill: 'forwards', delay: 200})
    :
    main.animate([{opacity: 0}, {opacity: .96}], {duration: 500, easing: 'ease', fill: 'forwards'})*/
/*.animate([
    { scale: '' }, { scale: '1.1 1.1' },
], { duration: 500, iterations: 4, direction: 'alternate', easing: 'ease-in-out' })*/
if (top === window) {
    $.id.goBack.setAttr({ href: '../' })
} else $.gid('viewbackground').debounce({
    click() {
        let frame = $(parent.document.getElementById('frame'))
        frame.fadeOut()
        let show = $(top.document.getElementById('show'))
        show.fadeIn()
        show.focus()
    }
}, 1500)
// buttonholder.$(`<a class="cute-green-button" href="./diary.html">Diary</a>`)
/*$('a,cute-green-button', {
    parent: buttonholder,
    txt: 'Music',
    title: 'music',
    href: './music.html'
})*/
let controller = new AbortController
let { submit: form } = $.byId
// send.replace($(`<input type="image" title="Send" src="http://localhost:3000/addsoupbase.github.io/cute-emojis/emojis/1225244786831659111.gif">`)
// .on( {
//     click(a, abort) {
//         form.name.value&&form.message.value&&(form.submit(), abort())
//     }
// }, false,controller)
// )

function disableForm(res) {
    if (!res?.ok) form.parent.parent.replace($(`<samp style="position: fixed;top: 50%;font-size: 1.3em;">Can't send stuff right now...<br> try again later love :(</samp>`)).destroy()
}

form.on({
    _submit() {
        // name ||= 'Anonymous'
        !async function () {
            await form.fadeOut()
            let hi = $(`<section><h3>Sent!</h3></section>`)
            hi.push($('samp', { textContent: `Name: ${this.name.value || "Anonymous"}` }), $('br'),
                $('samp', { textContent: `Message: ${this.message.value}` }))
            form.replace(hi)
            hi.fadeIn()
            $.id.prevent.destroy()
        }.call(this)
        // let loading = $('<img class="delibird" src="./media/loading.webp">')
        // form.before = loading
        // let req = !location.href.startsWith('http://localhost') ? await fetch(`https://formspree.io/f/mqakzlyo`, {
        // method: 'POST',
        // body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
        // headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Accept': 'application/json'
        // }
        // }) : { ok: 1 }
        // if (req.ok) {
        // loading.src = './media/yay.webp'
        // await wait(1000)
        // await loading.fadeOut()
        // loading.destroy()
        // let f = $('<h1>Message sent :)</h1>',)
        // form.replaceWith(f)
        // f.fadeIn()
        // } else {
        // Alert("for some reason, your message could not be sent :(")
        // }
        // form.destroy()
    }
}, controller)
fetch('https://drawing-submissions.deno.dev', {
    method: 'head',
    mode: 'cors'
}).then(disableForm, disableForm)