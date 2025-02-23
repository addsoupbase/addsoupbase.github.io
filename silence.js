// Since logging prevents objects from being garbage collected:
const { log } = console
function nothing() { }
if (!/localhost|127\.0\.0\.1/.test(location.host)) for (let i in console) console[i] = nothing
console.print ?? Object.defineProperty(console, 'print', {
    value(...data) {
        log(data.map(o => typeof o === 'object' ? JSON.stringify(o) : o))
    }
})