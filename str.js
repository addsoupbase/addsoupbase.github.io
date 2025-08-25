const map = new Map(Object.entries({ 1: 'st', 2: 'nd', 3: 'rd' }))
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase(),
    alphabet = ALPHABET.toLowerCase(),
    numbers = '0123456789',
    months = 'January February March April May June July August September October November December'
        .split(' '),
    days = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'
        .split(' '),
    placeholder = '$'
export function formatNumber(num) {
    return (+num).toLocaleString()
}
export function getCodePoints(string) {
    return string.split('').map(o => `\\u${o.charCodeAt().toString(16).padStart(4, 0)}`).join('')
}
export function upper(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`
}
export function splice(string, start, deleteCount, items) {
    let val = (string = `${string}`).split('')
    val.splice(start = +start, deleteCount = +deleteCount, typeof items === 'function' ? items(string.slice(start, start + deleteCount), start, deleteCount, string) : items)
    return val.join('')
}
export let escapeHTML
const a = globalThis.document?.createElement?.('div')
if (a) {
    const textContent = Object.getOwnPropertyDescriptor(Node.prototype,'textContent').set.bind(a),
    innerHTML = Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML').get.bind(a)
    function Esc(str) {
        textContent(str)
        return innerHTML()
    }
    escapeHTML = Esc
}
else {
    function esc(str) {
        return specialChars.reduce(reduce, str)
    }
    function reduce(a, b, i) {
        let { 0: regex, 1: rep } = specialChars[i]
        return `${a.replace(regex, rep)}${typeof b === 'string' ? b.replace(regex, rep) : ''}`
    }
    const specialChars = [[/>/g, '&gt;'], [/</g, '&lt;'], [/&(?![#\w]+;)/g, '&amp;'], [/'/g, '&apos;'], [/"/g, '&quot;']]
    escapeHTML = esc
}
export function replace(string, ...subs) {
    let allMatches = string.match(RegExp(`\\${placeholder}`, 'g'))
    if (subs.length !== allMatches?.length) throw RangeError("Invalid input")
    let newstring = string
    subs.forEach(replace)
    return newstring
    function replace(char) { newstring = newstring.replace(placeholder, char) }
}
export function formatWord(str) {
    return /[aeiou]/i.test(str[0]) ? `an ${str}` : `a ${str}`
}
export function shorten(str, length, tail) {
    if (typeof length !== 'number') throw RangeError('Length must be present')
    let out = str.slice(0, length)
    return str.length > length ? `${out}${tail ?? '…'}` : out
}
export function plural(singular, plural, count) {
    return Math.sign(count = +count) === count && count ? `${count} ${singular}` : `${count.toLocaleString()} ${plural}`
}
export function clip(str, length) {
    return str.slice(length, str.length - length)
}
function rev(a, b) { return `${a}${b}` }
export function reverse(str) {
    return str.split('').reduceRight(rev, "")
}
export const cap = upper
export function toOrdinal(o) {
    const lastTwoDigits = o % 100,
        me = `${o}`.at(-1)
    return (lastTwoDigits >= 11 && lastTwoDigits <= 13) || !map.has(me) ? `${o}th` : `${o}${map.get(me)}`
}
export function* groups(str, { source: s, flags: f }) {
    let v, r = RegExp(s, f)
    if (!f.includes('g')) return yield r.exec(str).groups
    while (v = r.exec(str)) yield v.groups
}