!function () {
    'use strict'
    var regex = /syntax|invalid character/i
    var remove = function () {
        removeEventListener('error', err)
        removeEventListener('load', remove)
    }
    var err = function (e) {
        if (regex.test(e.message)) {
            remove()
            var template = document.getElementById('template')
            document.body.outerHTML = template.content ? template.content.firstElementChild.outerHTML : template.firstElementChild.outerHTML
        }
    }
    addEventListener('load', remove)
    addEventListener('error', err)
}()