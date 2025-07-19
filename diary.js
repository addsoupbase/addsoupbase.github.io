'use strict';
// window.addEventListener('load', 
(window.requestIdleCallback || setTimeout)(async function load() {
    function bind(r) {
        return r.test.bind(r)
    }
    let { default: $ } = await import('./yay.js')
    // let observer = new MutationObserver(mutate)
    let grammar = {
        im: /(?=(\b|^))im(?=(\b|$))/g,
        i: /(?=(\b|^))i(?=(\b|$))/g,
        bc: /(?=(\b|^))bc(?=(\b|$))/ig,
        idc: /(?=(\b|^))idc(?=(\b|$))/ig,
        idk: /(?=(\b|^))idk(?=(\b|$))/ig,
        ik: /(?=(\b|^))ik(?=(\b|$))/ig,
        istg: /(?=(\b|^))istg(?=(\b|$))/ig,
        ig: /(?=(\b|^))ig(?=(\b|$))/ig
    }
    let IM = bind(grammar.im),
        I = bind(grammar.i),
        BC = bind(grammar.bc),
        IDC = bind(grammar.idc),
        IDK = bind(grammar.idk),
        IK = bind(grammar.ik),
        ISTG = bind(grammar.istg),
        IG = bind(grammar.ig)
    /*
    let end = /(?!([.!?-])).$/
    function dot(str) {
        return `${str}.`
    }
        */
    let ignore = /^(?:a|code|samp)$/i
    $.body.treeWalker(NodeFilter.SHOW_TEXT, doStuff)
    function doStuff(node) {
        // Correct common acronyms for accessibility
        let { textContent } = node
        if (!textContent.trim() || textContent.length <= 2 || ignore.test(node.parentElement?.tagName)) return
        // if (!node.nextSibling && !node.previousElementSibling)textContent = textContent.trim().replace(end, dot)
        IG(textContent) && (textContent = textContent.replace(grammar.ig, ig))
        ISTG(textContent) && (textContent = textContent.replace(grammar.istg, istg))
        IDK(textContent) && (textContent = textContent.replace(grammar.idk, idk))
        IK(textContent) && (textContent = textContent.replace(grammar.ik, ik))
        IDC(textContent) && (textContent = textContent.replace(grammar.idc, idc))
        BC(textContent) && (textContent = textContent.replace(grammar.bc, because))
        IM(textContent) && (textContent = textContent.replace(grammar.im, "I'm"))
        I(textContent) && (textContent = textContent.replace(grammar.i, 'I'))
        textContent !== node.textContent && (node.textContent = textContent)
    }
    function idc(str) {
        let { 0: i, 1: d, 2: c } = str
        return `${i} ${d === d.toUpperCase() ? "DON'T" : "don't"} ${c === c.toUpperCase() ? 'CARE' : 'care'}`
    }
    function idk(str) {
        let { 0: i, 1: d, 2: k } = str
        return `${i} ${d === d.toUpperCase() ? "DON'T" : "don't"} ${k === k.toUpperCase() ? 'KNOW' : 'know'}`
    }
    function ik(str) {
        let { 0: i, 1: k, } = str
        return `${i} ${k === k.toUpperCase() ? 'KNOW' : 'know'}`
    }
    function istg(str) {
        let { 0: i, 1: s, 2: t, 3: g } = str
        return `${i} ${s === s.toUpperCase() ? 'SWEAR' : 'swear'} ${t === t.toUpperCase() ? 'TO' : 'to'} ${g === g.toUpperCase() ? 'GOD' : 'god'}`
    }
    function because(str) {
        return `${str[0]}ecause`
    }
    function ig(str) {
        let { 0: i, 1: g } = str
        return `${i} ${g === g.toUpperCase() ? 'GUESS' : 'guess'}`
    }
    // function mutate() { }
    let ran = false
    // document.prerendering && console.log(`Prerendering started for ${location}`)
    if (top === window)
        // User is viewing file by itself
        standalone()
    async function standalone() {
        if (ran) return
        ran = true
        let css = await import('./csshelper.js')
        $.body.push($('<div style="place-self:center;margin:10px;text-align:center;"><a href="../../diary.html">View in Diary</a></div>'))
        css.importCSS('../../cute-green.css')
        css.importCSS(`data:text/css,main{overflow-x:hidden;opacity: 1 !important;z-index:-30;height:100%;min-height:90vh;width:100%}`)
        let main = $.qs('main')
        main.classList.add('cute-green')
        let d = new Date()
        let today = new Date(location.pathname.slice(9).split('/')[0].replace(/_/g, '/'))
        let aaaa = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, 0)}-${`${today.getDate()}`.padStart(2, 0)}`
        let input = $(`<input min="2025-04-07" max="${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, 0)}-${`${d.getDate()}`.padStart(2, 0)}" type="date" class="cute-green" value="${aaaa}">`, {
            events: {
                focus() {
                    invalid.hide(3)
                },
                async change() {
                    let { 0: year, 1: month, 2: day } = this.value.split('-')
                    if (day[0] == 0) day = day[1]
                    if (month[0] == 0) month = month[1]
                    let n = await fetch(`../${month}_${day}_${year}/index.html`)
                    if (n.ok) location.assign(`../${month}_${day}_${year}/index.html`)
                    else {
                        invalid.fadeIn()
                    }
                }
            }
        })
        main.afterbegin = $(`<div style="margin:30px;transform:scale(1.7,1.7);display:flex;justify-content: center"></div>`, null, input)
        input.parent.after = ($(`<h2 id="invalid" style="display:none">No entry for today &lpar;yet!&rpar;
                        <img style="image-rendering: pixelated;all:unset;" alt="tangled speech balloon" height="34"
                            src="../../cute-emojis/emojis/1143313874943234058.gif">
                    </h2>`))
        let { invalid } = $.id
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
    // /localhost|127\.0\.0\.1/.test(origin) && console.warn(`%cREMEMBER TO SET WIDTH TO A PERCENTAGE ON ALL <img> ELEMENTS! Count: ${document.images.length}`, 'font-size:1.2rem')
    [].forEach.call(document.links, o => {
        o.setAttribute('rel', `noopener noreferrer nofollow ${o.getAttribute('rel') || ''}`)
    })
        ;[].forEach.call(document.querySelectorAll('img,button[type="image"]'), o => {
            o = $(o)
            let hasAlt = 'alt' in o.attr,
                hasTitle = 'title' in o.attr
            if (hasAlt && !hasTitle)
                o.attr.title = o.attr.alt
            else if (hasTitle && !hasAlt)
                o.attr.alt = o.attr.title
            else if (!(hasTitle || hasAlt)) {
                o.attr._hidden = 'true' // Screen readers might literally read the src attribute as words
                console.warn('Missing alt or title attribute:', o.outerHTML)
            }
        })
}
    /*
    , {
        once:true
    })
    */
    , { timeout: 5000 })