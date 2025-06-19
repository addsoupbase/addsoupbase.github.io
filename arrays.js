export function assemble(arrayLike, ...sequence) {
    const out = []
        ,push = [].push.bind(out),
        at = [].at.bind(out)
    for (let {length} = sequence, i = 0; i < length;) push(at(sequence[i++]))
    return out
}
export function parse(str) {
    return{__proto__: null, ...JSON.parse(str)}
}
export function forKeys(obj, callback) {
    let keys = Reflect.ownKeys(obj)
    for (let {length: i} = keys; i--;) callback.call(obj, keys[i])
}
export function fresh(obj) {
    return!Reflect.ownKeys(obj).length
}
export function of(length, filler) {
    return typeof filler === 'function' ?
        Array.from({length}, filler) :
        Array(length).fill(filler)
}
export function from(ArrayLike, map, thisArg) {
    // Array.from checks @@iterator first, which would be slower in cases where it is a callable function
    return'length'in ArrayLike?map?[].map.call(ArrayLike,map,thisArg):[].slice.call(ArrayLike):map?Array.from(ArrayLike,map,thisArg):[...ArrayLike]
}
/*export function forEach(ArrayLike, callback, thisArg) {
    if ('length' in ArrayLike) return [].forEach.call(ArrayLike, callback, thisArg)
    if (ArrayLike[Symbol.toStringTag] === 'Set') return
}*/
export function filterForEach(arrayLike, map, thisArg) {

}
export {of as with}
export function* backwards(arrayLike) {
    for (let {length: i} = arrayLike; i--;) yield arrayLike[i]
}

export function center(array) {
    return array[(array.length / 2) | 0]
}

export function insert(array, item, index) {
    return array.splice(index, 0, item)
}
export function*edgeCases(...rest) {
    // First 21 are primitives
    yield true
    yield false
    yield 0
    yield 1
    yield-0
    yield-1
    yield 1.5
    yield-1.5
    yield 1/0
    yield-1/0
    yield 0/0
    yield 0n
    yield 1n
    yield-1n
    yield null
    yield;
    yield''
    yield'string'
    yield'1'
    yield' \n\t\v\f\r'
    yield Symbol('symbol')
    yield Symbol.for('symbol')
    // The rest are object/function/whatever you want
    yield{}
    yield{__proto__:null}
    {
        let obj = {}
        obj.property = obj
        yield obj
    }
    if('document'in globalThis)yield document.all
    yield function(){}
    yield()=>{}
    yield async function(){}
    yield async()=>{}
    yield*rest
}
export function remove(item, index) {
    return typeof item === 'string' ?
        `${item.slice(0, index)}${item.slice(index + 1)}` :
        item.splice(index, 1)
}
export function swap(item, first, second) {
    return {0: item[first], 1: item[second]} = [item[second], item[first]], item
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
let {sign:Sign, abs} = Math
export function rotate(arr, rotation) {
    let {length} = arr
    if (length < 2) return arr
    let sign = Sign(rotation ??= 1),
        r = abs(rotation | 0) % length
    if (sign > 0) {
    let unshift = [].unshift.bind(arr)
    while (r--) unshift(arr.pop())
    }
    else {
        let push = [].push.bind(arr)
        while (r--) push(arr.shift())
    }
    return arr
}

const headers = {headers:{
    accept: 'application/json,*/*;q=0.5'
}}

async function fallback(src) {
    let n = await fetch(new URL(src, location), headers),
        type = n.headers.get('Content-Type')
    if (!/application\/json/.test(type)) throw TypeError(`Failed to load module script: Expected a JSON module script but the server responded with a MIME type of "${type}". Strict MIME type checking is enforced for module scripts per HTML spec.`)
    return await n.json()
}

let s = sessionStorage.getItem('json')
export let getJson

function TestImportSupport() {
    // Some browsers (old) throw with the 'options' parameter
    // Firefox works now thankfully, but opera needs to catch up
    getJson = fallback.constructor
    // Some, even older browsers, prefer 'assert' over 'with'
    // i sometimes wonder why they changed it in the first place if it works pretty much the same...
    ('u', '"use strict";let a=sessionStorage,s={type:"json"},h=(await import(new URL(u,location),{assert:s,with:s})).default;a.setItem("json",!0);return h')
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
    e.name === "SyntaxError" || e.name === 'EvalError'
        ? FallbackImport() : reportError(e)
}
else if (s === 'true') TestImportSupport()
else FallbackImport()
export const jason = getJson
