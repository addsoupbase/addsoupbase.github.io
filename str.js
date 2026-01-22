const map = new Map(Object.entries({ 1: 'st', 2: 'nd', 3: 'rd' }))
if (!''.at) {
    function at(i) {
        i |= 0
        let a = this[i < 0 ? i + this.length : i]
        return typeof this === 'string' ? a ?? '' : a
    }
    Object.defineProperty(String.prototype, 'at', { value: at })
    Object.defineProperty(Array.prototype, 'at', { value: at })
}
export function getLabel(obj) {
    return {}.toString.call(obj).slice(8, -1).trim() || 'Object'
}
export const alphabet = 'abcdefghijklmnopqrstuvwxyz',
    ALPHABET = alphabet.toUpperCase(),
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
    return join(string.split('').map(o => `\\u${o.charCodeAt().toString(16).padStart(4, 0)}`))
}
function j(a, b) { return `${a}${b}` }
export function join(arr) {
    return arr.reduce(j, '')
}
export function upper(string) {
    return `${string[0].toUpperCase()}${string.substring(1)}`
}
export function splice(string, start, deleteCount, items) {
    let val = (string = String(string)).split('')
    val.splice(start = +start, deleteCount = +deleteCount, typeof items === 'function' ? items(string.slice(start, start + deleteCount), start, deleteCount, string) : items)
    return join(val)
}
export let escapeHTML
const a = globalThis.document?.createElement?.('div')
if (a) {
    function esc(str) {
        a.textContent = str
        return a.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    }
    escapeHTML = esc
}
else {
    function esc(str) {
        return specialChars(reduce, str)
    }
    function reduce(a, b, i, arr) {
        let { 0: regex, 1: rep } = arr[i]
        return `${a.replace(regex, rep)}${typeof b === 'string' ? b.replace(regex, rep) : ''}`
    }
    const specialChars = [].reduce.bind([[/>/g, '&gt;'], [/</g, '&lt;'], [/&[^#\w]+;)/g, '&amp;'], [/'/g, '&apos;'], [/"/g, '&quot;']])
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
let vowels = / /.test.bind(/[aeiou]/i)
export function formatWord(str) {
    return vowels(str[0]) ? `an ${str}` : `a ${str}`
}
export function shorten(str, length, tail) {
    if (typeof length !== 'number') throw RangeError('Length must be present')
    let out = str.substring(0, length)
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
    const lastTwoDigits = (o = String(o)) % 100,
        me = o.at(-1)
    return (lastTwoDigits >= 11 && lastTwoDigits <= 13) || !map.has(me) ? `${o}th` : `${o}${map.get(me)}`
}
export function* groups(str, { source: s, flags: f }) {
    let v, r = RegExp(s, f)
    if (!f.includes('g')) yield r.exec(str).groups
    else while (v = r.exec(str)) yield v.groups
}
export async function replaceAsync(string, regexp, replacerFunction) {
    const replacements = await Promise.all(
        Array.from(string.matchAll(regexp),
            match => replacerFunction(...match)))
    let i = 0
    return string.replace(regexp, () => replacements[i++])
}
export
    // let all = new Map(Reflect.ownKeys(globalThis).filter(o => o && typeof (o === 'object' || typeof o === 'function')).map((key) => [globalThis[key], key]))
    function uneval(o) {
    // if (all.has(o)) return '(' + all.get(o) + ')'
    if (Array.isArray(o))
        return '[' + o.map(uneval).join(',') + ']'
    if (o === null) return 'null'
    if (typeof document !== 'undefined' && o === document.all) return 'document.all'
    if (o instanceof WeakMap || o instanceof WeakSet) return `(new ${o.constructor.name})`
    if (o instanceof RegExp)
        return `/${o.source}/${o.flags}`
    if (o instanceof Map) {
        if (!o.size) return `(new Map)`
        return `(new Map([${Array.from(o, uneval)}]))`
    }
    if (o instanceof Set) {
        if (!o.size) return `(new Set)`
        return `(new Set(${Array.from(o, uneval)}))`
    }
    switch (typeof o) {
        case 'number': {
            if (o !== o) return '(0/0)'
            if (o === 1 / 0) return '(1/0)'
            if (o === -1 / 0) return '(-1/0)'
            if (Object.is(o, -0)) return '(-0)'
        }
        default: return String(o)
        case 'bigint': return o + 'n'
        case 'function':
            if (o.toString().startsWith('class')) return '(' + o + ')'
            return '(' + (/^(?:async\s*)?function|=>.*(?:\{.*\})?$/.test(o) ? o : 'function ' + o) + ')'
        case 'object': {
            return '({' + (Object.getPrototypeOf(o) === null ? '__proto__:null,' : '') + Reflect.ownKeys(Object(o)).map(key => {
                let out = ''
                let descriptor = Object.getOwnPropertyDescriptor(o, key)
                if (descriptor.set || descriptor.get) {
                    let s = []
                    let k = uneval(key)
                    descriptor.set && s.push(`${descriptor.set}`.replace(/^function /, `set ${k}`).replace(descriptor.set.name, ''))
                    descriptor.get && s.push(`${descriptor.get}`.replace(/^function /, `get ${k}`).replace(descriptor.get.name, ''))
                    return s.join(',')
                }
                let val = o[key]
                if (val === o) return ''
                if (typeof val === 'function') {
                    let v = val.toString()
                    if ((!/=>.*(?:\{.*\})?$/s.test(v) && !val.hasOwnProperty('prototype') && !v.endsWith('{ [native code] }')) || /^(?:Async)?GeneratorFunction$/.test(val.constructor.name)) {
                        // method syntax
                        return v
                    }
                }
                if (typeof key === 'symbol') out = `[${uneval(key)}]`
                else out = `${uneval(key)}`
                return out + `:${uneval(val)}`
            }).filter(o => o !== '').join(',') + '})'
        }
        case 'string': return /^\w+$/.test(o) ? o : `"${o.replace(/"/g, '\\"')}"`
        case 'undefined': return '(void 0)'
        case 'symbol': {
            const syms = Object.getOwnPropertyNames(Symbol).filter(o => typeof Symbol[o] === 'symbol').map(o => Symbol[o])
            let desc = o.description
            if (syms.includes(o)) return desc
            let key = Symbol.keyFor(o)
            if (typeof key === 'string') return `Symbol.for(${uneval(key)})`
            return `Symbol(${uneval(`${desc}`)})`
        }
    }
}