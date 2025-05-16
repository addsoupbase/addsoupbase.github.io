!function () {
    'use strict'
    var remove = function () {
        removeEventListener('error', err)
        removeEventListener('load', remove)
        remove = err = null
    }
    var err = function (e) {
        if (RegExp('syntax', 'i').test('name' in e.error ? e.error.name : e.error.message)) {
            remove()
            if (sessionStorage.getItem('err') !== 'yeah')
                prompt("You're using a *really* old browser, or I messed something up. Please share the message below with me: ", e.message + ' @line ' + e.lineno + ' col ' + e.colno + ' file ' + e.filename)
            var template = document.getElementById('template')
            sessionStorage.setItem('err', 'yeah')
            if (template) document.body.innerHTML = template.content ? template.content.firstElementChild.outerHTML : template.firstElementChild.outerHTML
        }
    }
    addEventListener('load', remove)
    addEventListener('error', err)
}()