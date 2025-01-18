
import HTMLElementWrapper, { FormDataManager, required } from '../quick.js'
import {wait} from "../handle.js"
const main = HTMLElementWrapper('main,center cute-green', { parent: document.body, id: 'main', style: 'opacity:0' })
await wait(300)
main.styleMe({ opacity: 0.95 })
main.animate([{ filter: 'blur(2px)', opacity: 0, scale: '0.8 0.8', translate: '0 -40px' }, { filter: '', easing: 'ease-in' }], { duration: 700 })

let avatarPreview = HTMLElementWrapper('div,holdavatar', main)
HTMLElementWrapper('img', { parent: avatarPreview, src: './media/art.webp', id: 'avatar', title: 'misdreavus', alt: 'avatar' })
HTMLElementWrapper('h1,centerx', { txt: 'addsoupbase', parent: main, style: 'margin:auto;z-index:3;position:relative;' }).animate([
    { scale: '' }, { scale: '1.1 1.1' },
], { duration: 500, iterations: 4, direction: 'alternate', easing: 'ease-in-out' })
let content = HTMLElementWrapper('section,centerx', {
    parent: main,
    id: 'content',
})
HTMLElementWrapper('h4', { parent: content, txt: 'thank you so much for looking at this i love you' })
HTMLElementWrapper('button,cute-green-button', {
    parent: content, txt: 'View Background', events: {
        async _click() {
            await main.fadeout()
            let topWindow = parent.document.querySelector('iframe')
            topWindow.remove()
        }
    }
})
let section = HTMLElementWrapper('div,lol', content)
let buttonholder = HTMLElementWrapper("div", section)
HTMLElementWrapper('a,cute-green-button', {
    parent: buttonholder,
    txt: 'About',
    href: './about.html',
    title: 'about me'
})
/*
$('button,cute-green-button', {
    parent: buttonholder,
    txt: 'Stuff',
    title: 'stuff i made'
})
$('button,cute-green-button', {
    parent: buttonholder,
    txt: 'Music',
    title: 'music'
})*/
HTMLElementWrapper('p', { parent: section, txt: 'Send a message to my discord if you want' })
let form = HTMLElementWrapper('form', {
    id: 'submit', parent: section, events: {
        async $submit({ target }) {
            let { name, message } = FormDataManager(target)
            name ||= 'Anonymous'
            await form.fadeout()
            form.hide()
            let loading = HTMLElementWrapper('img,delibird', { parent: section, src: './media/loading.webp' })
            let req = await fetch(`https://formspree.io/f/mqakzlyo`, {
                method: 'POST',
                body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            })
            if (req.ok) {
                loading.src = './media/yay.webp'
                await wait(1000)
                await loading.fadeAndDestroy()
                let f = HTMLElementWrapper('h1', { txt: 'Message sent!!' })
                form.replaceWith(f.cont)
                f.fadein()
            } else {
                Alert("for some reason, your message could not be sent :(")
            }
            form.destroy()
        }
    }
})
let outer = HTMLElementWrapper('div', { id: 'formholder', parent: form })
let NAME = HTMLElementWrapper('input,cute-green', { name: 'name', placeholder: 'Name', parent: outer })
let MSG = HTMLElementWrapper('input,cute-green', { name: 'message', placeholder: 'Message', required, parent: outer })
let submitbutton = HTMLElementWrapper('button,cute-green-button', { parent: form, txt: 'Send' })