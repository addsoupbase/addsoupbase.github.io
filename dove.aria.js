"use strict"
!function (D, t, n) {
    var _b = { cancelable: true, bubbles: true }
    D.addEventListener("submit", function (e) {
        var t = e.target
            , submitters = [].slice.call(t.querySelectorAll('button[type="submit"],button:not([type]),input[type="submit"],input[type="image"],input[type="button"]'))
                .concat([].slice.call(t.elements))
            , canGo = true
        if (t.id) submitters = submitters.concat([].slice.call(D.querySelectorAll('[form="' + t.id + '"]')))
        for (var i = submitters.length, evt; i--;) {
            evt = new Event('beforesubmit', _b)
            submitters[i].dispatchEvent(evt)
            canGo = !evt.defaultPrevented
        }
        if (n.has(t) || !canGo) e.returnValue = !(!e.preventDefault || !e.preventDefault())
        else {
            n.add(t)
            addEventListener('pagereveal', function(){location.hash='';location.reload()}, { once: true })
        }
    }, !0)
    D.addEventListener("keydown", function (n) {
        if ("KeyboardEvent" !== n.constructor.name) return console.warn(n)
        var r = n.key.toLowerCase(), a = n.target, i = a.parentElement
        if (("input" !== a.tagName || a.hasAttribute("type")) && !a.matches(t)) {
            var l = "tablist" === i.role || "button" === a.role, s = n.repeat
            switch (r) {
                case "arrowleft": case "arrowright": var o, c = [].slice.call(i.children), u = c.indexOf(D.activeElement)
                    o = "arrowright" === r ? c[(u + 1) % c.length] : c[(u - 1 + c.length) % c.length], l && o.focus()
                    for (var h = i.children.length; o !== D.activeElement && h--;)(o = ("arrowright" === r ? o.nextElementSibling : o.previousElementSibling) || ("arrowright" === r ? i.firstElementChild : i.lastElementChild)).focus()
                    break
                case " ": case "enter": l && !s && (n.returnValue = !(!n.preventDefault || !n.preventDefault()), a.click())
                    break
                case "home": case "end": h = i.children.length
                    do {
                        var d = "home" === r ? d ? d.nextElementSibling : i.firstElementChild : d ? d.previousElementSibling : i.lastElementChild
                        l && !s && d.focus()
                    } while (D.activeElement !== d && h--) d && d.click()
            }
        }
    }, !0)
}(document, ["text", "email", "number", "search", "tel", "url", "password"].map(function (e) { return 'input[type="' + e + '"]' }).join(","), new WeakSet)