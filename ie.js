!function (input, frame, prev, next, toToday) {
    'use strict'
    function toNormal(date) { return date.getMonth() + 1 + "_" + date.getDate() + "_" + date.getFullYear() }
    var n = new XMLHttpRequest
    var h = window[Symbol.for('[[HModule]]')]
    n.open('get', 'dates.json')
    // frame.style.transition = 'opacity 0.3s ease'
    function hide(node) {
        node.style.visibility = 'hidden'
        node.setAttribute('aria-hidden', 'true')
        node.setAttribute('disabled', '')
    }
    function show(node) {
        node.style.visibility = 'visible'
        node.setAttribute('aria-hidden', 'false')
        node.removeAttribute('disabled')
    }
    h.on(n, {
        load: function () {
            var a = (window.JSON ? JSON.parse : eval)(n.responseText)
            var i = a.length - 1
            function set(date) {
                show(prev)
                show(next)
                if (!i) hide(prev)
                if (i >= a.length - 1) hide(next)
                frame.style.display = 'none'
                // frame.style.opacity=0
                var d = new Date(date)
                input.value = d.toISOString().slice(0, 10)
                console.log(i)
                frame.setAttribute('src', './entries/' + toNormal(d) + '/index.html')
            }
            set(a[i])
            h.on(input, {
                change: function () {
                    set(new Date(input.value.replace(/-/g, '/')))
                }
            })
            h.on(prev, {
                click: function () {
                    var day = a[--i]
                    if (day) {
                        set(new Date(day))
                    }
                }
            })
            h.on(next, {
                click: function () {
                    var day = a[++i]
                    if (day) {
                        set(new Date(day))
                    }
                }
            })
            h.on(toToday, {
                click: function () {
                    set(new Date(a[i = a.length - 1]))
                }
            })
        }
    })
    h.on(frame, {
        load: function () {
            frame.style.display = ''
            // frame.style.opacity=1
        }
    })
    n.send()

}(document.getElementById('diary-heading'), document.getElementById('display'), document.getElementById('prev'), document.getElementById('next'),
    document.getElementById('toToday'))