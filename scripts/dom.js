'use strict';
const outer = new Elem({ tag: 'div', id: 'main', class: ['cute-green'], parent: body })
const aliases = ['misha', 'mimi', 'soup', 'muffy', 'soupy', 'TUlTSEE', 'addsoupbase']
const あ = Elem
let ca = aliases.length - 1
let content;
const hideclick = {
    click(type) {
        outer.anim({ class: 'slide-out-bck-center' }, () => {
            hide?.fadeOut?.(hide.kill)
                ;['greet', 'love', 'soup'].forEach(o => {
                    あ['#' + o]?.kill?.()
                })
            switch (type) {
                case 'abtme':
                    projects.hide()
                    abtme.show()
                    music.hide()

                    break;
                case 'projects':
                    abtme.hide()
                    music.hide()
                    projects.show()
                    break
                case 'music':
                    abtme.hide()
                    projects.hide()
                    music.show()
                    break
            }
            outer.anim({ class: 'slide-in-fwd-center' })
        })
    }
}
let bo = new Elem({
    id: 'hello',
    class: ['hello'],
    tag: 'div', parent: outer, children: [
        new Elem({
            tag: 'h1', message: 'addsoupbase',
            id: 'greet',
            events: {
                click() {
                    ca++
                    if (ca >= aliases.length) {
                        ca = 0
                    }
                    this.innerText = aliases[ca]
                    document.title = `${this.innerText}🍜`
                }
            },
            title: 'Please don\'t make fun of me I just like the font🥲'
        }),
        new Elem({
            alt: 'This is not my art',
            title: 'This is not my art',
            id: 'soup',
            tag: 'img', src: './media/soup.webp', width: 70, styles: {
                margin: '10px',
            }
        }),
        new Elem({ tag: 'p', message: 'WELCOME I LOVE YOu', id: 'love' }),
        content = new Elem({ tag: 'div' })
    ]
})

let hide = new Elem({
    tag: 'button', message: 'Hide', class: ['cute-green-button', 'hidebutton'], events: {
        click() {
            this.fadeOut(this.kill)
            outer.anim({ class: 'slide-out-blurred-top', 'keep class': true })
        }
    }, parent: body
})
new Elem({
    tag: 'div', parent: outer, children: [
        new Elem({
            tag: 'button', message: 'About Me', class: ['cute-green-button'], events: { click() { hideclick.click('abtme') } },
        }),
        new Elem({ tag: 'button', message: 'Projects', class: ['cute-green-button'], events: { click() { hideclick.click('projects') } }, }),
        new Elem({ tag: 'button', message: 'Music', class: ['cute-green-button'], events: { click() { hideclick.click('music') } }, }),

    ]
})
let abtme = new Elem({
    class: ['hello'],
    tag: 'div', parent: content, children: [
        new Elem({
            tag: 'img', src: './media/art.webp', width: '100', height: '100', styles: {
                margin: '20px',
                'border-radius': '100%'
            }
        }),
        new あ({ tag: 'h3', message: 'HELLO HELLO' }),
        new あ({
            tag: 'div', children: [
                new あ({ tag: 'p', text: 'IM GONNA PUT STUFF HERE SOON SO JUST YOU WAIT IM GONNA IMPROVE IT SOON DONT WORRY I LOVE YOU' })
            ]
        }),
        new あ({ tag: 'p', id: 'jeff', text: 'Send me something!! (goes directly to my discord)' }),

        new あ({
            tag: 'div', class: ['form'], id: 'formtab',children: [
                new あ({
                    tag: 'div', id: 'mainform', children: [
                  
                        new あ({ tag: 'input', class: ['cute-green'], id: 'formName', name: 'name', placeholder: 'Name goes here', value: 'anonymous' }),

                        new あ({
                            tag: 'input', class: ['cute-green'], id: 'formMessage', name: 'message', placeholder: 'Your message here...', events: {
                                click() {
                                    this.placeholder = `Your message here...`
                                }
                            }
                        }),

                    ]
                }),
            

                /*     new あ({tag:'div',class:['hidden'],id:'loading',children:[
                         new あ({tag:'img', class:['emoji'],src:'./media/yb.webp'}),
                         new あ({tag:'img', class:['emoji'],src:'./media/tb.webp'})
     
     
                     ]})*/
            ]
        }),
        new あ({
            styles: {padding:'10px',margin:'10px'},
            tag: 'button', id: 'submitBtn', class: ['cute-green'], events: {
                click() {
                    if (!あ['#formMessage'].value) {
                        あ['#formMessage'].placeholder = 'WRITE SOMETHING'
                        あ['#formMessage'].anim({class: 'shake-top' })
                        return
                    }
                    let t = gen()
                    あ['#submitBtn'].noevent('click')
                    あ['#submitBtn'].replaceWith(
                        new Elem({tag:'div',class:['loader'],id:t})
                    )
                    あ['#formMessage'].disabled = あ['#formName'].disabled = true
                    let NAME = あ['#formName'].value
                    let MESSAGE = あ['#formMessage'].value
                        ; (async () => {
                            try {
                                let x = await fetch(`https://formspree.io/f/mqakzlyo`, {
                                    method: 'POST',
                                    body: `name=${encodeURIComponent(NAME) || 'anonymous'}&message=${encodeURIComponent(MESSAGE)}`,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Accept': 'application/json'
                                    }
                                })
                                if (x.ok) {
                                    あ['#formtab'].anim({ class: 'rotate-out-2-ccw' }, function () {
                                        this.kill()
                                    })
                                }
                                else {
                                    confirm(`Something went wrong... reload and try again?`) && location.reload()
                                }
                            } catch (e) {
                                //  confirm(`For whatever reason i couldnt send your message :(! reload and try again`) && location.reload()
                                
                                あ['#mainform'].kill()
                                あ['#jeff'].innerHTML = 'Your message could not be sent because: '
                                new Elem({
                                    tag: 'p',
                                    class: ['shake-horizontal'],
                                    styles: { 'font-size': '25px', color: 'black' },
                                    text: e.message, parent: あ['#formtab']
                                })
                                throw e
                            }
                            finally {
                                Elem['#'+t].kill()
                                あ['#jeff'].kill()

                            }

                        })()
                }
            },
            text: 'Send'
        }),
    ]
})
abtme.hide()
let projects = new Elem({
    class: ['hello'], tag: 'div', parent: content, children: [
        new Elem({ tag: 'h1', message: 'Most of these aren\'t done!' }),
        new Elem({ tag: 'h3', message: 'Newer stuff:' }),

    ]
})
let music = new Elem({
    class: ['hello'], tag: 'div', parent: content, children: [
        new Elem({tag:'i',text:'Please don\'t judge me :('})
,
        new Elem({
            tag: 'div', class: ['hello'], styles: {
                display: 'block'
            }, children: [
                new Elem({ tag: 'button', class: ['cute-green-button', 'small'],events:{
                    click(){
                        currentVideo--
                        if (!videos[currentVideo]) {
                            currentVideo = videos.length-1
                        }
                        youtube.src = videos[currentVideo]
                        console.log(youtube.src)
                    }
                }, message: 'Previous' }),
                new Elem({ tag: 'button', class: ['cute-green-button', 'small'], events:{
                    click(){
                        currentVideo++
                        if (!videos[currentVideo]) {
                            currentVideo = 0
                        }
                        youtube.src = videos[currentVideo]
                        console.log(youtube.src)
                    }
                }, message: 'Next' }),
                new Elem.youtube({ src: 'https://www.youtube.com/embed/BjYWwZYLYEs', id:'yt',loading:'lazy' }),

                /*    new Elem({tag:'img',src:'./media/catdance.webp',width:50,height:50}),
                    new Elem({tag:'img',src:'./media/catdance.webp',width:50,height:50}),
                
                    new Elem({tag:'img',src:'./media/catdance.webp',width:50,height:50}),*/
            ]
        })

    ]
})
music.hide()
for (let url of ['https://addsoupbase.github.io/favourites', 'https://addsoupbase.github.io/marbles?level=testt', 'https://addsoupbase.github.io/whatever/', 'https://addsoupbase.github.io/twehg', 'https://addsoupbase.github.io/dataurl']) {
    new Elem({ tag: 'a', href: url, parent: projects, text: url, target: "_blank", rel: "noopener noreferrer" })
}
new Elem({ tag: 'h3', message: 'Older stuff (bad):', parent: projects })
for (let url of ['https://addsoupbase.github.io/textshortener', 'https://addsoupbase.github.io/intro/sizes', 'https://addsoupbase.github.io/intro/', 'https://magnificent-cream-beginner.glitch.me/', 'https://sepia-intermediate-taste.glitch.me/', 'https://dusty-flax-fukuiraptor.glitch.me/', 'https://eastern-verbena-van.glitch.me/', 'https://deeply-chlorinated-calendula.glitch.me/']) {
    new Elem({ tag: 'a', href: url, parent: projects, text: url, target: "_blank", rel: "noopener noreferrer" })

}
projects.hide()
outer.anim({ class: 'puff-in-center' })
const youtube = Elem['#yt']
let videos = ['BjYWwZYLYEs','Jd45THQSI2A','rfFEhd7mk7c','LaKaCP55EvY','iNzrwh2Z2hQ','tBPsDHJpZAo','YOtUQFXhmwA','8mGBaXPlri8','QR_qa3Ohwls','d_HlPboLRL8','K17df81RL9Y','-wMriLxUe_4']
.map(o=>`https://www.youtube.com/embed/${o}`);

let currentVideo = 0