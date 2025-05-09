// Since logging prevents objects from being garbage collected:
typeof console !== 'undefined' && function () {
    'use strict'
    if (!RegExp('localhost|127\\.0\\.0\\.1').test(location.host)) for (var i in console) {
        if (typeof console[i] !== 'function') continue
        console[i] = function (old) {
            return function () {
                try {
                    old.apply(console, [].map.call(arguments, function (o) {
                        var out = o
                        if (typeof o === 'function') out = o.toString()
                        else if (o && typeof o === 'object') {
                            if ('outerHTML' in o) out = o.outerHTML
                            else if (o.toString !== {}.toString) out = o.toString()
                            else out = JSON.stringify(o) || (o + '')
                        }
                        if (typeof out === 'string' && out.length > 500) out = out.slice(0, 500) + '...'
                        return out
                    }))
                } catch (e) {
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