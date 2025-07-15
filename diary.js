'use strict'
console.log('Welcome to my diary lol')
// basically, if i want to run JS for every entry, it would go in this file
    let ran = false
document.prerendering&&console.log(`Prerendering started for ${location}`)
if (top === window)
    // User is viewing file by itself
    standalone()
async function standalone() {
    if (ran) return
    ran = true
    let {default: $} = await import('./yay.js'),
        css = await import('./csshelper.js')
    css.importCSS('../../cute-green.css')
    css.importCSS(`data:text/css,main{opacity: 1 !important;}`)
    let main = $.qs('main')
    main.classList.add('cute-green')
    main.styles.height='100%'
    let d = new Date()
    let today = new Date(location.pathname.slice(9).split('/')[0].replace(/_/g,'/'))
    let aaaa =`${today.getFullYear()}-${`${today.getMonth()+1}`.padStart(2,0)}-${`${today.getDate()}`.padStart(2,0)}`
    let input = $(`<input min="2025-04-07" max="${d.getFullYear()}-${`${d.getMonth()+1}`.padStart(2,0)}-${`${d.getDate()}`.padStart(2,0)}" type="date" class="cute-green" value="${aaaa}">`, {
        events: {
            async input(){
                let {0:year,1:month,2:day} = this.value.split('-')
                if (day[0]==0) day = day[1]
                if (month[0]==0) month = month[1]
                let n = await fetch(`../${month}_${day}_${year}/index.html`)
                if (n.ok) location.assign(`../${month}_${day}_${year}/index.html`)
                else {
                }
            }
        }
    })
main.afterbegin=$(`<div style="margin:30px;transform:scale(1.7,1.7);display:flex;justify-content: center"></div>`, null, input)
    /*
    let regex = /\//g
    let style = 'position:fixed;display:none;'
    let str = location.pathname.slice(9).split('/')[0].replace(/_/g,'/')
    let day = new Date(str)

    day.setDate(day.getDate() -1)
    let yesterdayPath = day.toLocaleDateString('en-US').replace(regex, '_')
    day = new Date(str)
    day.setDate(day.getDate() + 1)
    let tomorrowPath =  day.toLocaleDateString('en-US').replace(regex, ' _')
    let y, t
    $.body.push(y = $(`<a class="cute-green-button" style="${style};top:-10px" role="button" rel="prev" href="../${yesterdayPath}/index.html">Yesterday</a>`),
        t = $(`<a class="cute-green-button" style="${style};top:-10px;right:0px" role="button" rel="next" href="../${tomorrowPath}/index.html">Tomorrow</a>`))
    fetch(`../${yesterdayPath}/index.html`).then(y.show.bind(y,3))
    fetch(`../${tomorrowPath}/index.html`).then(t.show.bind(t,3))*/
}
/localhost|127\.0\.0\.1/.test(origin) && console.warn(`%cREMEMBER TO SET WIDTH TO A PERCENTAGE ON ALL <img> ELEMENTS! Count: ${document.images.length}`, 'font-size:1.2rem')