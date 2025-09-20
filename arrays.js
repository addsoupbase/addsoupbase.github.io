let {isArray} = Array,
{iterator,toPrimitive} = Symbol
/*export function assemble(arrayLike, ...sequence) {
    const out = []
        , push = [].push.bind(out),
        at = [].at.bind(out)
    for (let { length } = sequence, i = 0; i < length;) push(at(sequence[i++]))
    return out
}
*/
/*
export function pr(target, ...props) {
    let handler = { __proto__: null }
    props.length || (props = Object.getOwnPropertyNames(Reflect))
    let {log} = console.context()
    for (let { length: i } = props; i--;) {
        let key = props[i],
            fn = log.bind(1, `${key}: `),
            act = Reflect[key]
        handler[key] = log
        function log(...args) {
            fn.apply(1, args.slice(1))
            return Reflect.apply(act, target, args)
        }
    }
    return new Proxy(target, handler)
}
*/
const { parse: prse, stringify } = JSON
    , proto = Object.preventExtensions(Object.create(null, { [toPrimitive]: { value() { return stringify(this) } } }))
export function parse(str) {
    let n = prse(str)
    return Object(n) === n ? deep(uproot(n)) : n
}
function uproot(n){
    return Array.isArray(n) ? n : {__proto__: proto, ...n}
}
function deep(obj) {
    for (let i in obj = uproot(obj)) {
        let val = obj[i]
        val === Object(val) && !isArray(val) && deep(obj[i] = uproot(val))
    }
    return obj
}
const {call,apply} = Function.prototype
export function forKeys(obj, callback) {
    let keys = Reflect.ownKeys(obj),
    cal = call.bind(callback, obj)
    for (let { length: i } = keys; i--;) cal(keys[i])
}
export function fresh(obj) {
    return !Reflect.ownKeys(obj).length
}
let fr = Array.from
export function of(length, filler) {
    length>>>=0
    return typeof filler === 'function' ?
        fr({ length }, filler) :
        Array(length).fill(filler)
}
const map = call.bind([].map),
slice = call.bind([].slice)
export function from(ArrayLike, mapfn, thisArg) {
    // Array.from checks @@iterator first, which would be slower in cases where it is callable
    return ArrayLike.length >= 0 ? mapfn ? 
    map(ArrayLike, mapfn, thisArg) // this bit doesn't map if there are holes
    : slice(ArrayLike) : mapfn ? fr(ArrayLike, mapfn, thisArg) : typeof ArrayLike[iterator] !== 'undefined' ? [...ArrayLike] : []
}

/*export function forEach(ArrayLike, callback, thisArg) {
    if ('length' in ArrayLike) return [].forEach.call(ArrayLike, callback, thisArg)
    if (ArrayLike[Symbol.toStringTag] === 'Set') return
}*/
export { of as with }
/*
export function* backwards(arrayLike) {
    for (let { length: i } = arrayLike; yield arrayLike[i--];);
}*/
export function center(array) {
    return array[(array.length / 2) | 0]
}

export function insert(array, item, index) {
    return array.splice(index, 0, item)
}
/*
export function* edgeCases(...rest) {
    let obj = {}
    obj.property = obj
    let all = [true, false, 0, 1, -0, -1, 1.5, -1.5, 1 / 0, -1 / 0, 0 / 0, 0n, 1n, -1n, null, , '', 'string', '1', ' \n\t\v\f\r', Symbol('symbol'), Symbol.for('symbol'), {}, { __proto__: null }, obj, function () { }, () => { }, async function () { }, async () => { }, ...rest]
    'document' in globalThis && all.push(document.all)
    for (let i = 0, { length: n } = all; i < n; yield all[++i]);
}*/
/*export function mapFn(obj, callback, thisArg) {
    let out = {},
        keys = Reflect.ownKeys(obj)
    for (let {length: i} = keys; i--;) {
        let key = keys[i]
        out[key] = function (fn) {
            return r
            function r(...args) {
                let o = Reflect.apply(fn,thisArg, args)
                return Reflect.apply(callback, thisArg, args) ?? o
            }
        }(obj[key])
    }
    return out
}*/
export function remove(item, index) {
    let slice = [].slice.bind(item)
    return typeof item === 'string' ?
        `${slice(0, index)}${slice(index + 1)}` :
        item.splice(index, 1)
}

export function swap(item, first, second) {
    return { 0: item[first], 1: item[second] } = [item[second], item[first]], item
}

export function swapInside(item, firstIndex, secondIndex) {
    const indexOf = [].indexOf.bind(item),
        slot = indexOf(firstIndex),
        slot2 = indexOf(secondIndex)
    if (~slot && ~slot2) return swap(item, slot, slot2)
    throw RangeError("Index out of range")
}

/*
export function cursedJSONParse(maybeJSON) {
    // idk why i made this
    return Function(`
    const a={__proto__:null},o=new Proxy(a,{get(t,p){return t[p]},has(){return 1},set(t,p,v){t[p]=v;return 3}})
    return function(){
    with(o)return(()=>{'use strict';return(${maybeJSON})})()
    }.call(a)
    `)()
}
*/
let { sign: Sign, abs } = Math
export function rotate(arr, rotation) {
    let { length } = arr
    if (length < 2) return arr
    let sign = Sign(rotation ??= 1),
        r = abs(rotation | 0) % length
    if (sign > 0) {
        let unshift = [].unshift.bind(arr),
            pop = [].pop.bind(arr)
        while (r--) unshift(pop())
        return arr
    }
    let push = [].push.bind(arr),
        shift = [].shift.bind(arr)
    while (r--) push(shift())
    return arr
}

const headers = {
    headers: {
        accept: 'application/json,*/*;q=0.5',
        "sec-fetch-dest": "json"
    }
}

async function fallback(src) {
    let n = await fetch(resolve(src, location), headers),
        type = n.headers.get('Content-Type')
    if (!n.ok) throw TypeError(`Failed to fetch dynamically imported module: ${src}`)
    if (/^(?:application|text)\/json/.test(type) || /^(?:application\/(?:ld|vnd\.api)\+json)/.test(type)) return await n.json()
    throw TypeError(`Failed to load module script: Expected a JSON module script but the server responded with a MIME type of "${type}". Strict MIME type checking is enforced for module scripts per HTML spec.`)
}
export let getJson
function TestImportSupport() {
    // Some browsers (old) throw with the 'options' parameter
    // Firefox works now thankfully, but opera needs to catch up
    let s = { type: 'json' }
    getJson = Function
        // Some other browsers, prefer 'assert' over 'with'
        ('n,o,j,d,s', '"use strict";return(import(j(s,o),n).then(d))')
        .bind(void'', { assert: s, with: s }, location, resolve, def)
        function def(o) {
            return deep(o.default)
        }
}
function resolve(url, base) {
     return new URL(url, globalThis.document?.baseURI ?? base)
}
function FallbackImport() {
    getJson = fallback
}

 try {
    TestImportSupport()
} catch (e) {
    console.error(e)
    let a = e.name
    a === "SyntaxError" || a === 'EvalError'
        ? FallbackImport() : reportError(e)
}
export const jason = getJson
/*
export function syncImport(src) {
    var n = new XMLHttpRequest,
        x = eval
    n.open('GET', src, !1)
    n.send()
    var res = n.getResponseHeader('Content-Type')
    if (/(?:text|application)\/(?:x-)?(?:j(?:ava)?|ecma|live)script(?:1\.[0-5])?/.test(res) && n.status === 'OK') return x(n.responseText)
    throw TypeError('Failed to load script')
}*/
export function bind(target) {
    return new Proxy(target, handler)
}
let handler = {
    get(target, prop) {
        return target[prop].bind(target)
    }
}