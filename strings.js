debugger
console.warn(`Using old version of ${import.meta.url}`)
const string = {
    __proto__: null,
    ALPHABET: 'abcdefghijklmnopqrstuvwxyz'.toUpperCase(),
    alphabet: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    months: 'January February March April May June July August September October November December'
        .split(' '),
    days: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'
        .split(' '),
    placeholder: '$',
    formatNumber(num) {
        return (+num).toLocaleString()
    },
    getCodePoints(string) {
       return string.split('').map(o=>`\\u${o.charCodeAt().toString(16).padStart(4,0)}`).join('')
    },
    upper(string) {
        return `${string[0].toUpperCase()}${string.slice(1)}`
    },
    replace(string, ...subs) {
        let allMatches = string.match(RegExp('\\' + this.placeholder, 'g'))
        if (subs.length !== allMatches?.length) throw RangeError("Invalid input")
        let newstring = string
        subs.forEach(char => { newstring = newstring.replace(this.placeholder, char) })
        return newstring
    },
    formatWord(str) {
        return /[aeiou]/i.test(str[0]) ? 'an ' + str : 'a ' + str
    },
    shorten(str, length, tail) {
        if (!length) throw RangeError('Length must be present')
        let out = str.slice(0, length)
        return str.length > length ? out += tail || '' : out
    },
    clip(str, length) {
        return str.slice(length, str.length - length)
    },
    reverse(str) {
        return str.split('').toReversed().join('')
    },
    cap(str) {
        return `${str[0].toUpperCase()}${str.slice(1)}`
    },
    toOrdinal(o) {
        const lastTwoDigits = o % 100, 
            me = `${o}`.at(-1)
        if ((lastTwoDigits >= 11 && lastTwoDigits <= 13) || !map.has(me))
            return `${o}th`
        return `${o}${map.get(me)}`
    },
   },
   map = new Map(Object.entries({ 1: 'st', 2: 'nd', 3: 'rd' }))
   export default string