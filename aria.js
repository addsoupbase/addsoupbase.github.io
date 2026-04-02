!function (h, d) {
    'use strict'
    h.on(d, {
        keydown: function (e) {
            if (e.constructor.name !== 'KeyboardEvent') return console.warn('keydown listener fired was not KeyboardEvent. This is a bug I think! (happens when user clicks the autocomplete thingy, just ignore it)', e)
            var key = e.key.toLowerCase(), target = e.target, parent = target.parentElement
            var pressable = parent.role === 'tablist' || target.role === 'button'
            var repeat = e.repeat
            switch (key) {
                case 'arrowleft':
                case 'arrowright': {
                    var children = [].slice.call(parent.children)
                    var index = children.indexOf(document.activeElement)
                    var sibling
                    if (key === 'arrowright') sibling = children[(index + 1) % children.length]
                    else sibling = children[(index - 1 + children.length) % children.length]
                    if (pressable) sibling.focus()
                    var all = parent.children.length
                    while (sibling !== document.activeElement && all--) {
                        sibling = (key === 'arrowright' ? sibling.nextElementSibling : sibling.previousElementSibling) || (key === 'arrowright' ? parent.firstElementChild : parent.lastElementChild)
                        sibling.focus()
                    }
                    break
                }
                case ' ':
                case 'enter':
                    if (pressable && !repeat) {
                        e.returnValue = !!(e.preventDefault && e.preventDefault())
                        target.click()
                    }
                    break
                case 'home':
                case 'end': {
                    var all = parent.children.length
                    do {
                        var toggle = key === 'home' ? (toggle ? toggle.nextElementSibling : parent.firstElementChild) : (toggle ? toggle.previousElementSibling : parent.lastElementChild)
                        if (pressable && !repeat) {
                            toggle.focus()
                        }
                    }
                    while (document.activeElement !== toggle && all--)
                    toggle && toggle.click()
                    break
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