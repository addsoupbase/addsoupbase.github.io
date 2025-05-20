
import $ from '../yay.js'
import { on, } from "../handle.js"

$.setup()
let { main } = $.id
main.setStyles({ opacity: 0 })
if (top === window)$.id.viewframe.destroy()
on(window, {
    _load() {
        if (top === window) {
            $.id.goBack.setAttribute('href', './')
        }

    }
})
location.hash? main.animate([{ filter: 'blur(2px)', opacity: 0, scale: '0.8 0.8', translate: '0 -40px' }, { filter: '', opacity: .96 }], { duration: 700, easing: 'ease-in', fill: 'forwards',delay:200 })
    :
    main.animate([{ opacity: 0 }, { opacity: .96 }], { duration: 500, easing: 'ease', fill: 'forwards' })
/*.animate([
    { scale: '' }, { scale: '1.1 1.1' },
], { duration: 500, iterations: 4, direction: 'alternate', easing: 'ease-in-out' })*/
$.gid('viewbackground').on({
     _click() {
         main.fadeOut()
        setTimeout(()=>{
        let topWindow = parent.document.getElementById('frame')
        topWindow.remove()
        },800)
    }
})
// buttonholder.$(`<a class="cute-green-button" href="./diary.html">Diary</a>`)
/*$('a,cute-green-button', {
    parent: buttonholder,
    txt: 'Music',
    title: 'music',
    href: './music.html'
})*/
let controller = new AbortController
let { submit: form, send } = $.byId
// send.replace($(`<input type="image" title="Send" src="http://localhost:3000/addsoupbase.github.io/cute-emojis/emojis/1225244786831659111.gif">`)
// .on( {
//     click(a, abort) {
//         form.name.value&&form.message.value&&(form.submit(), abort())
//     }
// }, false,controller)
// )
form.on({
        async $submit() {
            // name ||= 'Anonymous'
            await form.fadeOut()
            let hi = $(`<section><h3>Sent!! (hopefully)</h3>
            <samp>Name: ${this.name.value||="Anonymous"}</samp><br>
            <samp>Message: ${this.message.value}</samp>
            </section>`)
            form.replace(hi)
            hi.fadeIn()
            let a
            try {
            a = await fetch(this.attr.action, {
                method:'POST',
                body: `name=${encodeURIComponent(this.name.value)}&message=${encodeURIComponent(this.message.value)}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                    }
            })
            }
            catch {
                return alert('Failed to send message')
            }
            finally {
                a.ok||alert('Failed to send message')
            }

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
    },false, controller
)