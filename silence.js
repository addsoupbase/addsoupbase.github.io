// Since logging prevents objects from being garbage collected:
typeof console !== 'undefined' && function () {
    'use strict'
    if (!RegExp('localhost|127\\.0\\.0\\.1').test(location.host)) for (var i in console) {
        if (typeof console[i] !== 'function') continue
        console[i] = function (old) {
            return function () {
                try {
                    old.apply(console, [].map.call(arguments, function (o) {
                        if (o && typeof o === 'object' || typeof o === 'function') {
                            if ('outerHTML' in o) return o.outerHTML
                            if (o.toString !== Object.prototype.toString) return o.toString()
                            return JSON.stringify(o) || (o + '')
                        }
                        return o
                    }))
                }
                catch (e) {
                    old('Object was not logged to prevent a potential memory leak')
                }
            }
        }(console[i])
    }
    /*console.print ?? Object.defineProperty(console, 'print', {
        value(...data) {
            log.apply(1, data.map(o => typeof o === 'object' ? JSON.stringify(o) : o))
        }
    })*/
}()