'use strict'
!function () {
    var sym = Symbol.for('[[DOM]]')
    if (window[sym]) return window[sym]
    var out = function (query) { return document.querySelector(query) }
    out.$ = out
    out.$$ = function (query) { return[].slice.call(document.querySelectorAll(query)) }
    out.importScripts = function () {
        var len = arguments.length
        var c
        function callback(e) {
            c = e
        }
        function add() {
            if (loaded.push(this.responseText) === len) {
                loaded.forEach(function (txt) {
                    var scr = document.createElement('script')
                    scr.textContent = txt
                    document.head.appendChild(scr)
                })
                return c && c()
            }
        }
        var loaded = [];
        [].forEach.call(arguments, function (src) {
            var xhr = new XMLHttpRequest
            xhr.open('get', src)
            xhr.onload = add
            xhr.send()
        })
        return callback
    }
    return window[sym] = Object.seal(out)
}((window.Symbol = window.Symbol || function () { function s(d) { return (String(d) + Math.random()) + Date.now() } s['for'] = function (desc) { return '@@' + desc }; return s }()))