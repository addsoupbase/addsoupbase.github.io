!function (savedChars, input, form) {
    'use strict'
    var h = window[typeof Symbol === 'function' ? Symbol.for('[[HModule]]') : '[[HModule]]']
    h.on(form, {
        $submit: function (e) {
            try {
                navigator.clipboard.writeText(final)
            }
            catch (e) {
                try {
                    var aaa = document.createElement('textarea')
                    aaa.value = final
                    document.body.appendChild(aaa)
                    aaa.select()
                    if (document.execCommand('copy'))
                        document.body.removeChild(aaa)
                    else throw ''
                }
                catch (e) {
                    prompt("Your text", final)
                }
            }
        }
    })
    var final = ''
    var req = new XMLHttpRequest
    req.open('GET', './subs.json')
    h.on(req, {
        load:function () {
        var b = /\\/g
        var subs = (typeof JSON === 'object' ? JSON.parse : eval)(req.responseText)
            .map(
                function (n) {
                    var a = n[0], b = n[1]
                    return [RegExp(a, 'g' + (n[2] || '')), b]
                }
            ).sort(
                function (a, b) {
                    a = a[0]
                    b = b[0]
                    return b.source.replace(b, '').length - a.source.replace(b, '').length
                })
        h.on(input, {
            input: function () {
                var txt = input.value
                var newtxt = shortenText(txt)
                final = newtxt
                savedChars.textContent = 'Saving ' + (txt.length - newtxt.length) + ' characters'
            }
        })
        function shortenText(og) {
            var text = og
            for (var i = 0, len = subs.length; i < len; ++i) {
                var n = subs[i]
                text = text.replace(n[0], n[1])
            }
            return text
        }
    }
    })
    req.send()
}(document.getElementById('saved'), document.getElementById('txt'),
    document.getElementById('c'))