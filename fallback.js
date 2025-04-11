!function () {
    'use strict'
    var regex = /syntax|invalid character/i
    var remove = function () {
        removeEventListener('error', err)
        removeEventListener('load', remove)
        remove = err = regex = null
    }
    var err = function (e) {
        if (regex.test(e.message)) {
            remove()
            alert(e.message)
            var template = document.getElementById('template')
            if (template) document.body.outerHTML = template.content ? template.content.firstElementChild.outerHTML : template.firstElementChild.outerHTML
        }
    }
    addEventListener('load', remove)
    addEventListener('error', err)
}()