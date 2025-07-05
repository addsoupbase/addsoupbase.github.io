export function assemble(arrayLike, ...sequence) {
    const out = []
        , push = [].push.bind(out),
        at = [].at.bind(out)
    for (let { length } = sequence, i = 0; i < length;) push(at(sequence[i++]))
    return out
}
    export function pr(target, ...props) {
        let handler = {__proto__:null}
        props.length || (props = Object.getOwnPropertyNames(Reflect))
        for(let {length: i}= props; i--;) {
            let key = props[i],
                fn = console.log.bind(1,`${key}: `),
                act = Reflect[key]
            handler[key] = log
            function log(...args) {
                fn.apply(1,args.slice(1))
                return Reflect.apply(act, target, args)
            }
        }
        return new Proxy(target, handler)
    }
export function parse(str) {
    return { __proto__: null, ...JSON.parse(str) }
}

export function forKeys(obj, callback) {
    let keys = Reflect.ownKeys(obj)
    for (let { length: i } = keys; i--;) callback.call(obj, keys[i])
}

export function fresh(obj) {
    return !Reflect.ownKeys(obj).length
}

export function of(length, filler) {
    return typeof filler === 'function' ?
        from({ length }, filler) :
        Array(length).fill(filler)
}

export function from(ArrayLike, map, thisArg) {
    // Array.from checks @@iterator first, which would be slower in cases where it is callable
    return ArrayLike.length>=0?map?[].map.call(ArrayLike,map,thisArg):[].slice.call(ArrayLike):map?Array.from(ArrayLike,map,thisArg): typeof ArrayLike[Symbol.iterator]!=='undefined'?[...ArrayLike]:[]
}

/*export function forEach(ArrayLike, callback, thisArg) {
    if ('length' in ArrayLike) return [].forEach.call(ArrayLike, callback, thisArg)
    if (ArrayLike[Symbol.toStringTag] === 'Set') return
}*/
export { of as with }
export function* backwards(arrayLike) {
    for (let { length: i } = arrayLike; yield arrayLike[i--];);
}

export function center(array) {
    return array[(array.length / 2) | 0]
}

export function insert(array, item, index) {
    return array.splice(index, 0, item)
}

export function* edgeCases(...rest) {
    let obj = {}
    obj.property = obj
    let all = [true, false, 0, 1, -0, -1, 1.5, -1.5, 1 / 0, -1 / 0, 0 / 0, 0n, 1n, -1n, null, , '', 'string', '1', ' \n\t\v\f\r', Symbol('symbol'), Symbol.for('symbol'), {}, { __proto__: null }, obj, function () { }, () => { }, async function () { }, async () => { }, ...rest]
    if ('document' in globalThis) all.push(document.all)
    for (let i=0,{length:n}=all;i<n;yield all[++i]);
}
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
    return typeof item === 'string' ?
        `${item.slice(0, index)}${item.slice(index + 1)}` :
        item.splice(index, 1)
}

export function swap(item, first, second) {
    return { 0: item[first], 1: item[second] } = [item[second], item[first]], item
}

export function swapInside(item, firstIndex, secondIndex) {
    const slot = item.indexOf(firstIndex),
        slot2 = item.indexOf(secondIndex)
    if (slot !== -1 && slot2 !== -1) return swap(item, slot, slot2)
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
        accept: 'application/json,*/*;q=0.5'
    }
}

async function fallback(src) {
    let n = await fetch(new URL(src, location), headers),
        type = n.headers.get('Content-Type')
    if (/(?:application|text)\/json/.test(type)) return await n.json()
    throw TypeError(`Failed to load module script: Expected a JSON module script but the server responded with a MIME type of "${type}". Strict MIME type checking is enforced for module scripts per HTML spec.`)
}

let s = sessionStorage.getItem('json')
export let getJson

function TestImportSupport() {
    // Some browsers (old) throw with the 'options' parameter
    // Firefox works now thankfully, but opera needs to catch up
    getJson = fallback.constructor
        // Some, even older browsers, prefer 'assert' over 'with'
        // i sometimes wonder why they changed it in the first place if it works pretty much the same...
        ('u','"use strict";let a=sessionStorage,s={type:"json"},h=(await import(new URL(u,location),{assert:s,with:s})).default;a.setItem("json",!0);return h')
    /*
    .bind(fallback)
     using bind since the function can't access the module scope
     */
}

function FallbackImport() {
    sessionStorage.setItem("json", false)
    getJson = fallback
}

if (s !== 'false' && s !== 'true') try {
    TestImportSupport()
} catch (e) {
    console.error(e)
    e.name === "SyntaxError" || e.name === 'EvalError'
        ? FallbackImport() : reportError(e)
}
else if (s === 'true') TestImportSupport()
else FallbackImport()
export const jason = getJson
