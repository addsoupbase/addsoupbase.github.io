!function () {
    'use strict'
    try {
        JSON.parse() // Produce a syntax error
    }
    catch(e) {
        var syntax = e.toString().split(':')[0].trim()
    }
    var remove = function () {
        removeEventListener('error', err)
        removeEventListener('load', remove)
        remove = err = syntax = null
    }
    var err = function (e) {
        var a = e.message.replace(/uncaught/i,'').split(':')[0].trim()
        if (syntax === a) {
            console.error(e)
            remove()
            alert(e.message)
            var template = document.getElementById('template')
            if (template) document.body.innerHTML = template.content ? template.content.firstElementChild.outerHTML : template.firstElementChild.outerHTML
        }
    }
    addEventListener('load', remove)
    addEventListener('error', err)
}()