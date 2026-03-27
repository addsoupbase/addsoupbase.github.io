!function (h, d) {
    'use strict'
    h.on(d, {
        keydown: function (e) {
            if (e.constructor.name !== 'KeyboardEvent') return console.warn('keydown listener fired was not KeyboardEvent. This is a bug I think! (happens when user clicks the autocomplete thingy, just ignore it)', e)
            var key = e.key.toLowerCase(), target = e.target, parent = target.parentElement
            var pressable = parent.role === 'tablist' || target.role === 'button'
            switch (key) {
                case 'arrowleft':
                    var sibling = target.previousElementSibling || target.parentElement.lastElementChild
                case 'arrowright':
                    sibling = sibling || target.nextElementSibling || target.parentElement.firstElementChild
                    if (pressable) sibling.focus()
                    break
                case ' ':
                case 'enter':
                    if (pressable) {
                        e.returnValue = !!e.preventDefault()
                        target.click()
                    }
                    break
                case 'home':
                    var toggle = parent.firstElementChild
                case 'end':
                    toggle = toggle || parent.lastElementChild
                    if (pressable) {
                        toggle.click()
                        toggle.focus()
                    }
            }
        }
    })
    /*@dev
    var headings = d.getElementsByTagName('h1')
        if (headings.length > 1) {
        console.dirxml.apply(console, headings)
        }
    */
}(window[Symbol.for("[[HModule]]")], document)