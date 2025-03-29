
import $ from '../yay.js'
import { FormDataManager } from '../proxies.js'
import { on, wait } from "../handle.js"

let { template, } = $.byId
document.body.appendChild(document.importNode(template.content,true))
let { main } = $.byId
main.setStyles({ opacity: 0 })
on(window, {
    _load() {
        requestIdleCallback(() => {
            typeof final === 'function'  && final()
        }, { timeout: 20000 })
    }
})
window.requestIdleCallback ??= queueMicrotask
if (location.hash) main.animate([{ filter: 'blur(2px)', opacity: 0, scale: '0.8 0.8', translate: '0 -40px' }, { filter: '', opacity: .96 }], { duration: 700, easing: 'ease-in', fill: 'forwards' })
else {
    main.animate([{ opacity: 0 }, { opacity: .96 }], { duration: 500, easing: 'ease', fill: 'forwards' })
}
/*.animate([
    { scale: '' }, { scale: '1.1 1.1' },
], { duration: 500, iterations: 4, direction: 'alternate', easing: 'ease-in-out' })*/
$.gid('viewbackground').on({
    async _click() {
        await main.fadeOut()
        let topWindow = parent.document.querySelector('object')
        topWindow.remove()
    }
})
// buttonholder.$(`<a class="cute-green-button" href="./diary.html">Diary</a>`)
/*$('a,cute-green-button', {
    parent: buttonholder,
    txt: 'Music',
    title: 'music',
    href: './music.html'
})*/
let { submit: form } = $.byId
form.on({
    async $submit({ target }) {
        let { name, message } = FormDataManager(target)
        name ||= 'Anonymous'
        await form.fadeOut()
        let loading = $('<img class="delibird" src="./media/loading.webp">')
        form.before = loading
        let req = !location.href.startsWith('http://localhost') ? await fetch(`https://formspree.io/f/mqakzlyo`, {
            method: 'POST',
            body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        }) : { ok: 1 }
        if (req.ok) {
            loading.src = './media/yay.webp'
            await wait(1000)
            await loading.fadeOut()
            loading.destroy()
            let f = $('<h1>Message sent :)</h1>',)
            form.replaceWith(f)
            f.fadeIn()
        } else {
            Alert("for some reason, your message could not be sent :(")
        }
        form.destroy()
    }
})