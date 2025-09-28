!function (input, frame, prev, next, toToday) {
    'use strict'
    function toNormal(date) { return date.getMonth() + 1 + "_" + date.getDate() + "_" + date.getFullYear() }
    let n = new XMLHttpRequest
    let h = window[window.Symbol ? Symbol.for('[[HModule]]') : '[[HModule]]']
    n.open('get', 'dates.json')
    n.onload = function () {
        let a = (window.JSON ? JSON.parse : eval)(n.responseText)
        let i = a.length - 1
        set(a[i])
        h.on(input, {
            change: function () {
                set(new Date(input.value.replace(/-/g, '/')))
            }
        })
        h.on(prev, {
            click: function () {
                let day = a[--i]
                if (day) {
                    set(new Date(day))
                }
            }
        })
        h.on(next, {
            click: function () {
                let day = a[++i]
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
    frame.onload = function () { frame.style.display = '' }
    n.send()
    function set(date) {
        frame.style.display = 'none'
        let d = new Date(date)
        input.value = d.toISOString().slice(0, 10)
        frame.setAttribute('src', './entries/' + toNormal(d) + '/index.html')
    }
}(document.getElementById('diary-heading'), document.getElementById('display'), document.getElementById('prev'), document.getElementById('next'),
    document.getElementById('toToday'))