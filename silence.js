// Since logging prevents objects from being garbage collected:
void function () {
    'use strict'
    if (!/localhost|127\.0\.0\.1/.test(location.host)) for (let i in console) {
        if (typeof console[i] !== 'function') continue
        let old = console[i]
        console[i] = (...data) => {
            try {
                old.apply(console, data.map(o => o&&(typeof o==='object'||typeof o ==='function') ? ('outerHTML'in o ? o.outerHTML : JSON.stringify(o) ?? `${o}`):o))
            }
            catch {
                old(`♻️ (Object was not logged to prevent a potential memory leak)`)
            }
        }
    }
    /*console.print ?? Object.defineProperty(console, 'print', {
        value(...data) {
            log.apply(1, data.map(o => typeof o === 'object' ? JSON.stringify(o) : o))
        }
    })*/
}()