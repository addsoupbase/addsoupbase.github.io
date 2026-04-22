!function (d) {
    'use strict'
    var n = new Set
    d.addEventListener('submit', function (e) {
        // just to prevent form spam
        var t = e.target
        n.has(t)?(e.returnValue=!!(e.preventDefault && e.preventDefault())):n.add(t)
    }, true)
    var ignore = [
        "text",
        "email",
        "number",
        "search",
        "tel",
        "url",
        "password"
    ].map(function (o) { return 'input[type="' + o + '"]' }).join(',')
    d.addEventListener('keydown', function (e) {
        if (e.constructor.name !== 'KeyboardEvent') return console.warn('keydown listener fired was not KeyboardEvent. This is a bug I think! (happens when user clicks the autocomplete thingy, just ignore it)', e)
        var key = e.key.toLowerCase(), target = e.target, parent = target.parentElement
        if ((target.tagName === 'input' && !target.hasAttribute('type')) || target.matches(ignore)) return
        var pressable = parent.role === 'tablist' || target.role === 'button'
            , repeat = e.repeat
        switch (key) {
            case 'arrowleft':
            case 'arrowright': {
                var children = [].slice.call(parent.children)
                , index = children.indexOf(d.activeElement)
                , sibling
                if (key === 'arrowright') sibling = children[(index + 1) % children.length]
                else sibling = children[(index - 1 + children.length) % children.length]
                if (pressable) sibling.focus()
                var all = parent.children.length
                while (sibling !== d.activeElement && all--) {
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
                    if (pressable && !repeat) 
                        toggle.focus()
                }
                while (d.activeElement !== toggle && all--)
                toggle && toggle.click()
                break
            }
        }
    }, true)
}(document)