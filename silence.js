// Since logging prevents objects from being garbage collected:
typeof console !== 'undefined' && (function () {
    'use strict'
    if (!/localhost|127\.0\.0\.1/.test(location.host)) for (var i in console) {
        if (typeof console[i] !== 'function') continue
        var old = console[i]
        console[i] = function () {
            var data = [].slice.call(arguments)
            try {
                old.apply(console, data.map(function () {
                    return o && (typeof o === 'object' || typeof o === 'function') ? ('outerHTML' in o ? o.outerHTML : JSON.stringify(o) ||
                        (o + '')) : o
                }))
            }
            catch(e) {
                old(`♻️ (Object was not logged to prevent a potential memory leak)`)
            }
        }
    }
    /*console.print ?? Object.defineProperty(console, 'print', {
        value(...data) {
            log.apply(1, data.map(o => typeof o === 'object' ? JSON.stringify(o) : o))
        }
    })*/
}())