
import $, { Alert, FormDataManager, required } from '../quick.js'
import { on, wait } from "../handle.js"

const main = $('main.center.cute-green #main', {
    parent: document.body,
    attr: {
        style: 'opacity:0'
    }
})
on(window, {
    load() {
        requestIdleCallback(() => {
            main.styleMe({ opacity: .95 })
            top.final()
        }, { timeout: 20000 })
    }
})
window.requestIdleCallback ??= queueMicrotask
main.animate([{ filter: 'blur(2px)', opacity: 0, scale: '0.8 0.8', translate: '0 -40px' }, { filter: '', }], { duration: 700, easing: 'ease-in' })

let avatarPreview = $('div.holdavatar', main)
$('img #avatar', {
    parent: avatarPreview,
    attr: { src: './media/art.webp', title: 'misdreavus', alt: 'avatar' }
})
$('h1.centerx', {
    txt: 'addsoupbase', parent: main,
    attr: { style: 'margin:auto;z-index:3;position:relative;' }
}).animate([
    { scale: '' }, { scale: '1.1 1.1' },
], { duration: 500, iterations: 4, direction: 'alternate', easing: 'ease-in-out' })
let content = $('section.centerx #content', {
    parent: main,
})
$('h2', { parent: content, txt: 'thank you so much for looking at this i love you' })
$('button.cute-green-button', {
    parent: content, txt: 'View Background', events: {
        async _click() {
            await main.fadeout()
            let topWindow = parent.document.querySelector('iframe')
            topWindow.remove()
        }
    }
})
let section = $('div.lol', content)
let buttonholder = $("div", section)
$('a.cute-green-button', {
    parent: buttonholder,
    txt: 'About',
    attr: {
        href: './about.html',
        title: 'about me'
    }
})

$('a.cute-green-button', {
    parent: buttonholder,
    txt: 'Stuff',
    attr: {
        title: 'stuff i made',
        href: './stuff.html'
    }
})
/*$('a,cute-green-button', {
    parent: buttonholder,
    txt: 'Music',
    title: 'music',
    href: './music.html'
})*/
$('p', { parent: section, txt: 'Send a message to me if you want' })
let form = $('form #submit', {
    os: [$('img', {
        attr: {
            width: 40,
            height: 40,
            alt: 'mail icon',
            title: 'Send some mail!',
            src: './media/mail.webp'
        }
    })],
    parent: section, events: {
        async $submit({ target }) {
            let { name, message } = FormDataManager(target)
            name ||= 'Anonymous'
            await form.fadeout()
            form.hide()
            let loading = $('img.delibird', { src: './media/loading.webp' })
            form.before(loading)
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
                let f = $('h1 <Message sent :)>',)
                form.replaceWith(f.cont)
                f.fadein()
            } else {
                Alert("for some reason, your message could not be sent :(")
            }
            form.destroy()
        }
    }
})
let outer = $('div #formholder', { parent: form })
let NAME = $('input.cute-green', { attr: { name: 'name', placeholder: 'Name', }, parent: outer })
let MSG = $('input.cute-green', { attr: { name: 'message', required, placeholder: 'Message', }, parent: outer })
let submitbutton = $('button.cute-green-button', { parent: form, txt: 'Send' })
