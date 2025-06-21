import $ from '../yay.js'
import {on,} from "../handle.js"

$.setup()
let {main} = $.id
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
    $.id.goBack.setAttr({href:'../'})
}
else $.gid('viewbackground').on({
    _click() {
        $.body.parent.fadeOut()
        setTimeout(() => {
            let topWindow = parent.document.getElementById('frame')
            topWindow.remove()
        }, 800)
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
let {submit: form} = $.byId
// send.replace($(`<input type="image" title="Send" src="http://localhost:3000/addsoupbase.github.io/cute-emojis/emojis/1225244786831659111.gif">`)
// .on( {
//     click(a, abort) {
//         form.name.value&&form.message.value&&(form.submit(), abort())
//     }
// }, false,controller)
// )
let out = $('<iframe name="hi"></iframe>')
form.on({
         submit() {
            // name ||= 'Anonymous'
             !async function(){
             await form.fadeOut()
            let hi = $(`<section><h3>Sent!! (hopefully)</h3></section>`)
                 hi.push($('samp',{textContent:`Name: ${this.name.value || "Anonymous"}`}),$('br'),
                     $('samp', {textContent:`Message: ${this.message.value}`}))
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
    }, false, controller
)