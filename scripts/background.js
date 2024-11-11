import { avatars, mons } from './images.js'
import './dom.js'
const あ = Elem
let spawnAvatarBubbles = () => { }
let avatarsources = []
let paused = false;
window.pause = () => paused = true
function update() {
    if (paused) return
    requestAnimationFrame(update)
    SceneryElem.update()
    let f = SceneryElem.frame

    if (!(f % 80)) {
        spawnAvatarBubbles()

    }
    if (f < 30 || !(f % 60)) {
        let x = 15 + ran.range(0, 10)
        let bubble = new SceneryElem({
            parent: background,
            x: Math.random() * innerWidth,
            y: innerHeight,
            class: ['bubble'],
          /*  events: {
                click() {
                    this.noevent('click')
                    this.styleMe({
                        top: this.position.y + 'px',
                        left: this.position.x + 'px',

                    })
                    this.anim({ class: 'puff-out-center' }, function () { this.kill(); })

                }
            },*/
            styles: {
                width: `${x}px`,
                height: `${x}px`
            }
        })
        bubble.velocity.set(0, -2)
        bubble.offset = Math.random() * 4000
        let random = ran.choose(1, -1)
        bubble.update = function () {
            if (random > 0) {

                this.velocity.set(Math.cos(((SceneryElem.frame - this.offset) / 10) * 60) * 2, this.velocity.y)
            }
            else {
                this.velocity.set(Math.sin(((SceneryElem.frame - this.offset) / 10) * 60) * 2, this.velocity.y)

            }
        }
    }
    if (!(f % 100)) {
        let src = ran.choose(...pokémons)
        let pok = src.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'))
        let speed = 1.2

        let loc = ran.choose(innerWidth + 300, -300)
        let id = ran.gen()
        let m;
        let poke = new SceneryElem({
            parent: background,
            children: [
                m = new Elem({
                    id,
                    class: [pok,'pok'],
                    tag: 'img', src
                })
            ],
            x: loc,
            y: Math.random() * innerHeight,

        })
        switch (pok) {
            case 'sharpedo':
                speed = 2.7
                break;
            case 'lanturn':
            case 'lanturnshiny':


                break;
            case 'kyogre':
                speed = 1.3
                break;
            case 'wailord':
                speed = 0.5
                break;
            case 'carvanha':
                speed = 1.78
                break;
            case 'gorebyss':
            case 'huntail':
                speed = 1.5
                break;

        }
        if (loc === innerWidth + 300) {
            Elem.$(id).styleMe({ transform: 'scale(-1,1)' })
            poke.velocity.set(-speed, 0)
        }
        else {
            poke.velocity.set(speed, 0)

        }

    }


}
const pokémons = []
let background = new あ({
    tag: 'div',
    parent: body,
    id: 'background'
})
Elem.logLevels.success = true
Elem.bulk((...src) => {
    src.forEach(o => {
        if (!o.includes('bubble')) {
            pokémons.push(o)
        }
        //   new SceneryElem({ tag: 'img', src: o, parent: background })
    })
    //MAKE SURE WE ONLY UPDATE WHEN ALL THE SPRITES ARE LOADED
    update()
}, ...mons, './media/bubble.png')
Elem.bulk((...src) => {
    for (let l of avatars) {
        avatarsources.push({ nickname: l.nickname, url: l.url })
    }
    spawnAvatarBubbles = n
    pfps = new utilMath.Cycle(...avatarsources)
}, ...avatars.map(o => o.url))
/*mons.forEach(o => {
    new あ({ tag: 'img', src: o, parent: body })
})*/
addEventListener('click', o => {
    for (let bubble of SceneryElem.all) {
        if (bubble.content.classList.contains('bubble')) {
            let { x, y } = o
            let s = getNodeSize(bubble.content)
            if (Vector2.distance([x, y], bubble.position) < Math.min(s.width, s.height) / 1.15) {
                bubble.eventNames.trigger('click')
            }
        }
    }
})
let pfps
function n() {
    let choice = pfps.next().value
    let nickname = choice.nickname.split('.').shift() || choice.url
    choice = choice.url
    let x = 50 + ran.range(0, 10)
    let loc = ran.choose(innerWidth + 100, -100)
    let bubble = new SceneryElem({
        parent: background,
        x: loc,
        y: Math.random() * innerHeight,
        class: ['bubble'],
        id: ran.gen(),
        events: {
            click() {
                this.noevent('click')

                let f = new SceneryElem({
                    parent: background,
                    children: [
                        new Elem({
                            tag: 'img', width: 30, height: 30, src: this.firstChild.src, styles: {
                                'border-radius': '100%',
                                'user-select': 'none',
                                width: '50px',
                                height: '50px',
                                display: 'grid',
                                '-webkit-user-drag': 'none',      /* Prevent dragging (Chrome, Safari) */
                                '-webkit-touch-callout': 'none',  /* Disable long tap (iOS) */

                            }
                        }),
                        new Elem({ tag: 'span', message: utilString.upper(nickname), class: ['name', 'kanit-regular'] })
                    ],
                    styles: {

                        'align-items': 'center',
                        'justify-content': 'center',
                        'text-align': 'center',
                        'justify-items': 'center',
                        display: 'grid',
                    }
                })
                f.position.set(...this.position)
                this.styleMe({
                    top: this.position.y + 'px',
                    left: this.position.x + 'px',

                })
                f.style.opacity = '0'
                f.fadeIn()
                f.velocity.set(0, -1)
                this.anim({ class: 'puff-out-center' }, () => { this.kill(); })

            }
        },
        children: [
            new Elem({
                draggable: false,
                tag: 'img', src: choice, width: x / 1.6, height: x / 1.6, styles: {
                    'border-radius': '100%',
                    'user-select': 'none',
                    '-webkit-user-drag': 'none',      /* Prevent dragging (Chrome, Safari) */
                    '-webkit-touch-callout': 'none',  /* Disable long tap (iOS) */
                }
            })
        ],
        styles: {
            width: `${x}px`,
            height: `${x}px`
        }
    })
    if (nickname.match(/gib|indie|random\_userlol|lemmy|zoozi|neboola|vio|cunder|lorex|rogue|lexi/)) {
        new Elem({
            tag: 'img', src: './media/ghost.png', parent: bubble, styles: {
                position: 'absolute',
                width: '30px',
                bottom: '50px',
                left: '50px',
            }
        })
    }
    bubble.offset = Math.random() * 4000
    if (loc !== innerWidth + 100) {
        bubble.velocity.set(2, 0)

    }
    else {
        bubble.velocity.set(-2, 0)

    }
    bubble.offset = Math.random() * 4000
    let random = ran.choose(1, -1)
    bubble.update = function () {
        if (random > 0) {
            this.velocity.set(this.velocity.x,
                Math.sin((SceneryElem.frame - this.offset) / 60) * 2
            )
        }
        else {
            this.velocity.set(this.velocity.x,
                Math.cos((SceneryElem.frame - this.offset) / 60) * 2
            )
        }

    }
}
name 