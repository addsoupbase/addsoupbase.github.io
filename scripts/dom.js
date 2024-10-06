'use strict';
const outer = new Elem({ tag: 'div', id: 'main', class: ['cute-green'], parent: body })
const aliases = ['misha', 'mimi', 'soup', 'muffy', 'soupy', 'TUlTSEE', 'addsoupbase']
const あ = Elem
あ.log()
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
        })

    ]
})
abtme.hide()
let projects = new Elem({ class: ['hello'], tag: 'div', parent: content,children:[
    new Elem({tag:'h1',message:'Most of these aren\'t done!'}),
    new Elem({tag:'h3',message:'Newer stuff:'}),

] })
let music = new Elem({class:['hello'],tag:'div',parent:content,text:'music will be here soon',children:[
    new Elem({tag:'div',children: [
        new Elem({tag:'img',src:'./media/catdance.gif',width:50,height:50}),
        new Elem({tag:'img',src:'./media/catdance.gif',width:50,height:50}),
    
        new Elem({tag:'img',src:'./media/catdance.gif',width:50,height:50}),
    
    ]})

]})
music.hide()
for (let url of ['https://addsoupbase.github.io/marbles?level=testt', 'https://addsoupbase.github.io/whatever/','https://addsoupbase.github.io/twehg','https://addsoupbase.github.io/dataurl']) {
    new Elem({ tag: 'a', href: url, parent: projects, text: url, target: "_blank", rel: "noopener noreferrer" })
}
new Elem({tag:'h3',message:'Older stuff (bad):',parent:projects})
for (let url of ['https://addsoupbase.github.io/textshortener','https://addsoupbase.github.io/intro/sizes','https://addsoupbase.github.io/intro/','https://magnificent-cream-beginner.glitch.me/','https://sepia-intermediate-taste.glitch.me/','https://dusty-flax-fukuiraptor.glitch.me/','https://eastern-verbena-van.glitch.me/','deeply-chlorinated-calendula  ']) {
    new Elem({ tag: 'a', href: url, parent: projects, text: url, target: "_blank", rel: "noopener noreferrer" })

}
projects.hide()
outer.anim({ class: 'puff-in-center' })
