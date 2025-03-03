// Since logging prevents objects from being garbage collected:
void function () {
    if (!/localhost|127\.0\.0\.1/.test(location.host)) for (let i in console) {
        if (typeof console[i] !== 'function') continue
        let old = console[i]
        console[i] = (...data) => old.apply(console, data.map(o => typeof o === 'object' ? JSON.stringify(o) : o))
    }
    /*console.print ?? Object.defineProperty(console, 'print', {
        value(...data) {
            log.apply(1, data.map(o => typeof o === 'object' ? JSON.stringify(o) : o))
        }
    })*/
}()