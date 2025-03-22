
import $ from '../yay.js'
import { FormDataManager } from '../proxies.js'
import { on, wait } from "../handle.js"

const main = $('main.center.cute-green #main', {
    parent: document.body,
})
main.setStyles({ opacity: 0 })
on(window, {
    load() {
        requestIdleCallback(() => {
            typeof final === 'function' && final()
        }, { timeout: 20000 })
    }
})
window.requestIdleCallback ??= queueMicrotask
if (location.hash) main.animate([{ filter: 'blur(2px)', opacity: 0, scale: '0.8 0.8', translate: '0 -40px' }, { filter: '', opacity: .96 }], { duration: 700, easing: 'ease-in', fill: 'forwards' })
else {
    main.animate([{ opacity: 0 }, { opacity: .96 }], { duration: 500, easing: 'ease', fill: 'forwards' })
}

let avatarPreview = $('div.holdavatar')
avatarPreview.parent = main
$('img #avatar', {
    parent: avatarPreview,
    attributes: { src: './media/art.webp', title: 'misdreavus', alt: 'avatar' }
})
$('h1.centerx', {
    txt: 'addsoupbase', parent: main,
    attributes: { style: 'margin:auto;z-index:3;position:relative;' }
})
/*.animate([
    { scale: '' }, { scale: '1.1 1.1' },
], { duration: 500, iterations: 4, direction: 'alternate', easing: 'ease-in-out' })*/
let content = $('section.centerx #content', {
    parent: main,
})
$('h3', { parent: content, txt: 'thank you so much for looking at this i love you' })
$('button.cute-green-button', {
    parent: content, txt: 'View Background', events: {
        async _click() {
            await main.fadeOut()
            let topWindow = parent.document.querySelector('object')
            topWindow.remove()
        }
    }
})
let section = content.$('div.lol')
let buttonholder = section.$("div")
$('<a class="cute-green-button" href="./about.html" title="about me" id="abtbutton">About</a>', {
    parent: buttonholder,
})
// buttonholder.$(`<a class="cute-green-button" href="./diary.html">Diary</a>`)
$('<a class="cute-green-button"></a>', {
    parent: buttonholder,
    txt: 'Stuff',
    id: 'stuffbutton',
    attributes: {
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
section.$('<p>Send a message to me if you wanna</p>')
let form = $('<form id="submit"><img width=40 height=40 alt="Mail Icon" title="Send me some mail" src="./media/mail.webp"></form>', {
    parent: section, events: {
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
    }
})
let outer = form.$('<div id="formholder"></div>', null,
    $('<input class="cute-green" name="name" placeholder="Name">'),
    $('<input class="cute-green" name="message" placeholder="Message" required>'))
let submitbutton = form.$('<button class="cute-green-button">Send</button>')
