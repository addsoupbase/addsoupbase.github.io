(function (variable = 'mod') {
    // performance is not of big concern
    const mod = source.bind()
    Object.setPrototypeOf(mod, null)
    Object.defineProperty(mod, Symbol.unscopables, {
        value: Object.freeze({
            __proto__: null,
            arguments: true,
            prototype: true,
            eval: true // very important!
        })
    })
    mod.eval = evaluate
    function evaluate(str) {
        if (typeof str === 'function') str = `(${str}).call(mod)`
        with (mod) // break the rules a bit
        return eval(str)
    }
    class PatternSegment extends null {
        static {
            Object.defineProperty(this.prototype, 'push', {
                value: [].push
            })
        }
        toString() {
            return [].join.call(this, '')
        }
        static #c = {
            value: 0,
            configurable: false,
            writable: true
        }
        constructor(...str) {
            let out = { __proto__: new.target.prototype }
            // Create array-like, because arrays' default toString() is join(',')
            Object.defineProperty(out, 'length', PatternSegment.#c)
            for (let i = 0, len = str.length; i < len; ++i)
                out.push(literally(str[i]))
            return out
        }
    }
    class CharacterEscape extends PatternSegment {
        get not() {
            let char = this[0][ch]
            let upper = char.toUpperCase()
            return new CharacterEscape(upper === char ? char.toLowerCase() : upper)
        }
    }
    class Quantifier extends PatternSegment {
        #called = false
        lazy() {
            if (this.#called) throw TypeError(`Lazy has already been applied to this quantifier: ${this}`)
            this[0][ch] += '?'
            this.#called = true
            return this
        }
    }
    const ch = Symbol()
    class Char extends null {
        toString() {
            return this[ch]
        }
        constructor(char) {
            let out = { __proto__: Char.prototype }
            out[ch] = char
            return Object.seal(out)
        }
    }
    function literally(char) {
        return new Char(char)
    }
    function escape(str) {
        if (typeof str === 'object') return str
        return RegExp.escape(str)
    }
    function addStrings(obj, strings, subs) {
        for (let i = 0, n = strings.length, { length } = subs; i < n; ++i) {
            obj.push(escape(strings[i]))
            i < length && obj.push(obj, subs[i])
        }
    }
    mod.paren = mod.group = paren
    function paren(strings, ...subs) {
        let out = new PatternSegment('(?:')
        addStrings(out, strings, subs)
        out.push(literally(')'))
        return out
    }
    mod.capture = capture
    function capture(strings, ...subs) {
        let out = new PatternSegment('(')
        addStrings(out, strings, subs)
        out.push(literally(')'))
        return out
    }
    const isWord = / /.test.bind(/^\w+$/)
    mod.named_group = named_group
    function named_group(strings, ...subs) {
        let name = subs.shift()
        strings = strings.slice(1)
        if (!isWord(name)) throw SyntaxError(`Invalid capture group name: ${name}`)
        let out = new PatternSegment(`(?<${name}>`)
        addStrings(out, strings, subs)
        out.push(literally(')'))
        return out
    }
    mod.charRange = charRange
    function charRange(start, end) {
        if (start.length !== 1 || end.length !== 1) throw SyntaxError(`Invalid character ranges: ${start} ${end}`)
        let out = new PatternSegment()
        out.push(escape(start))
        out.push(literally('-'))
        out.push(escape(end))
        return out
    }
    mod.chars = chars
    function chars(...strings) {
        let out = new PatternSegment('[')
        for (let o of strings)
            out.push(escape(o))
        out.push(literally(']'))
        return out
    }
    mod.cars_not = chars_not
    function chars_not(...strings) {
        let out = new PatternSegment('[^')
        for (let o of strings)
            out.push(escape(o))
        out.push(literally(']'))
        return out
    }
    mod.groupN = groupN
    function groupN(n) {
        if (isNaN(n)) throw TypeError(`Bad backreference: ${String(n)}`)
        return `\\${n}`
    }
    mod.backref = backref
    function backref(name) {
        if (!isWord(name)) throw SyntaxError(`Invalid capture group name: ${name}`)
        return new PatternSegment(`\\k<${name}>`)
    }
    mod.WORD_EXPR = mod.WORD = new CharacterEscape('\\w')
    mod.DIGIT_EXPR = mod.DIGIT = new CharacterEscape('\\d')
    mod.WHITESPACE_EXPR = mod.WHITESPACE = new CharacterEscape('\\s')
    mod.NEWLINE = '\n'
    mod.DOUBLEQUOTE = mod.QUOTE = `"`
    mod.BACKTICK = mod.TEMPLATE = '`'
    mod.SINGLEQUOTE = `'`
    mod.BACKSLASH = '\\'
    mod.CARRIAGERETURN = '\r'
    mod.VERTICALTAB = '\t'
    mod.BACKSPACE = '\b'
    mod.FORMFEED = '\f'
    mod.BOUNDARY = new CharacterEscape('\\b')
    mod.OR = literally('|')
    mod.WILDCARD = literally('.')
    mod.BEGIN = mod.START = literally('^')
    mod.END = literally('$')
    for(let i in mod) {
        let a = i.toUpperCase()
        if (i === a) mod[i.toLowerCase()] = mod[i]
    }
    mod.behind = behind
    function behind(strings, ...subs) {
        let out = new PatternSegment('(?<=')
        addStrings(out, strings, subs)
        out.push(literally(')'))
        return out
    }
    mod.not_behind = not_behind
    function not_behind(strings, ...subs) {
        let out = new PatternSegment('(?<!')
        addStrings(out, strings, subs)
        out.push(literally(')'))
        return out
    }
    mod.ahead = ahead
    function ahead(strings, ...subs) {
        let out = new PatternSegment('(?=')
        addStrings(out, strings, subs)
        out.push(literally(')'))
        return out
    }
    mod.not_ahead = not_ahead
    function not_ahead(strings, ...subs) {
        let out = new PatternSegment('(?!')
        addStrings(out, strings, subs)
        out.push(literally(')'))
        return out
    }
    mod.min = min
    function min(n) {
        switch (n |= 0) {
            case 0: return new Quantifier('*')
            case 1: return new Quantifier('+')
            default: return new Quantifier(`{${n},}`)
        }
    }
    mod.max = max
    function max(n) {
        switch (n |= 0) {
            case 0: throw TypeError('Max must be greater than 0')
            case 1: return new Quantifier('?')
            default: return new Quantifier(`{0,${n}}`)
        }
    }
    mod.clamp = clamp
    function clamp(min, max) {
        min = Math.abs(min | 0)
        if (typeof max !== 'number') switch (min) {
            case 1: return ''
            default: return new Quantifier(`{${min}}`)
        }
        max = Math.abs(max | 0)
        return new Quantifier(`{${min},${max}}`)
    }
    mod.not = not
    function not(m) {
        switch (m) {
            case '\\w': return '\\W'
            case '\\s': return '\\S'
            case '\\d': return '\\D'
            case '\\b': return '\\B'
            default: throw SyntaxError(`Cannot negate ${m}`)
        }
    }
    // export default source
    mod.build = build
    function build(...patterns) {
        return RegExp(source.apply(1, patterns))
    }
    mod.source = source
    function source(...segments) {
        let out = ''
        for (let o of segments) out += typeof o === 'string' ? escape(o) : o
        return out
    }
    mod.prototype = null
    return constructor.prototype[variable] = mod
    /*
    Example usage:
        Match 'a' 'b' ']' '[' '/' '\w' or new line:
        mod.eval(() => build(chars('a','b', ']', '[', '/', WORD)))

    Result: 
        /[\x61\x62\]\[\/\x77]/

    Notes: 
        - Escaped characters will still properly match (e.g. '\x61' still matches 'a')
        - RegExp.escape() is very new
    */
}())