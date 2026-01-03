'use strict'
var r = function () {
    class Abstract {
        type = this.constructor.name
        min(n) {
            switch (n |= 0) {
                case 0: return new Quantifier(this, '*')
                case 1: return new Quantifier(this, '+')
                default: return new Quantifier(this, `{${n},}`)
            }
        }
        get optional() {
            return this.max(1)
        }
        get some() {
            return this.min(1)
        }
        max(n) {
            switch (n |= 0) {
                case 0: throw TypeError('Max must be greater than 0')
                case 1: return new Quantifier(this, '?')
                default: return new Quantifier(this, `{0,${n}}`)
            }
        }
        min_max(min, max) {
            min = Math.abs(min | 0)
            if (typeof max !== 'number') switch (min) {
                case 1: return new Quantifier(this, '')
                default: return new Quantifier(this, `{${min}}`)
            }
            max = Math.abs(max | 0)
            return new Quantifier(this, `{${min},${max}}`)
        }
        constructor() {
            if (new.target === Abstract) throw TypeError('Abtract class not constructable')
            // this.#char = char
        }
    }
    class Char extends Abstract {
        #char
        toString() {
            return this.#char
        }
        get char() {
            return this.#char
        }
        set char(char) {
            this.#char = RegExp.escape(char)
        }
        constructor(char) {
            super()
            this.char = char
        }
    }
    class Raw extends Char {
        constructor(char) {
            super(char)
            this.#char = char
        }
        #char
        toString() {
            return this.#char
        }
    }
    class Quantifier extends Abstract {
        #modifier
        #target
        toString() {
            return this.#target.toString() + this.#modifier
        }
        constructor(og, type) {
            super()
            this.#target = og
            this.#modifier = type
        }
        #lazy = false
        lazy() {
            // if (!this.#quantified) throw SyntaxError(`No quantifier applied: ${this.char}`)
            if (this.#lazy) throw SyntaxError(`Quantifier ${this.char} is already lazy`)
            this.#lazy = true
            this.#modifier += '?'
            return this
        }
        static {
            let value = TypeError.bind(globalThis, 'Cannot quantify a quantifier')
            'min max min_max'.split(' ').forEach(o => {
                Object.defineProperty(Quantifier.prototype, o, {
                    get: value
                })
            })
        }
    }
    Object.setPrototypeOf(Abstract.prototype, null)
    Abstract.prototype[Symbol.iterator] = [][Symbol.iterator]
    class Atom extends Abstract {
        chars
        toString() {
            return this.chars.join('')
        }
        constructor(...items) {
            super()
            this.chars = items
        }
        end(...o) {
            return this.chars.push(o)
        }
        start(...o) {
            return this.chars.unshift(o)
        }
    }
    class CharacterClass extends Atom {
        toString() {
            let str = ''
            for (let o of this.chars) {
                let b = format(o)
                // b = o.toString().replace(/^[\$\^\]]/, '\\'+o)
                str += b
                console.log(b)
            }
            return `[${this.not ? '^' : ''}${str}]`
        }
    }
    class CharacterClassExclude extends CharacterClass {
        not = true
    }
    class Range extends Atom {
        #start
        #end
        constructor(start, end) {
            super()
            if (typeof start === 'number') start = String.fromCodePoint(start)
            else if (typeof start === 'string') start = new Char(start)
            if (typeof end === 'number') end = String.fromCodePoint(end)
            else if (typeof end === 'string') end = new Char(end)
            this.#start = start
            this.#end = end
        }
        toString() {
            RegExp(`[${this.#start}-${this.#end}]`)
            return `${this.#start}-${this.#end}`
        }
    }
    function add(obj, strings, subs) {
        'use strict'
        for (let i = 0, n = strings.length, { length } = subs; i < n; ++i)
            obj.end(RegExp.escape(strings[i])), i < length && obj.end(subs[i])
    }
    function sub(strings, ...subs) {
        let m = new Atom('(?:')
        add(m, strings, subs)
        m.end(')')
        return m
    }
    function keep(strings, ...subs) {
        let m = new Atom('(')
        add(m, strings, subs)
        m.end(')')
        return m
    }
    function any(...chars) {
        return Reflect.construct(CharacterClass, chars)
    }
    function none(...chars) {
        return Reflect.construct(CharacterClassExclude, chars)
    }
    function range(start, end) {
        return new Range(start, end)
    }
    let or = new Raw('|')
    let context = {
        __proto__: null,
        [Symbol.unscopables]: {
            __proto__: null,
            eval: true,
            arguments: true
        },
        newline: '\n',
        doublequote: `"`,
        backtick: '`',
        quote: `'`,
        backslash: '\\',
        formfeed: '\f',
        backspace: '\b',
        word: new Raw('\\w'),
        begin: new Raw('^'),
        or,
        end: new Raw('$'),
        wildcard: new Raw('.'),
        paren: sub,
    }
    for (let i in context) {
        context[i.toUpperCase()] = context[i]
    }
    function min(char, min) {
        return format(char).min(min)
    }
    function max(char, max) {
        return format(char).max(max)
    }
    function format(c) {
        return typeof c === 'string' ? new Char(c) : c
    }
    function either(...variants) {
        return variants.flatMap((v, i) => variants.length - 1 !== i ? [format(v), or] : format(v)).join('')
    }
    Object.assign(context, { keep, sub, any, range, none, min, max, Char, either, format })
    return Function('str', `with(this) return RegExp(eval(typeof str === 'function' ? "(" + str + ")()" : str).map(format).join(''))`).bind(context) 
}()