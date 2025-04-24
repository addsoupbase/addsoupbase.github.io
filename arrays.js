export function assemble(arrayLike, ...sequence) {
    const out = []
    for (let { length } = sequence, i = 0; i < length;) out.push(arrayLike.at(sequence[i++]))
    return out
}
export function forKeys(obj, callback) {
    let keys = Reflect.ownKeys(obj)
    for (let { length } = keys; length--;) callback.call(obj, keys[length])
}
export function of(length, filler) {
    return typeof filler === 'function' ?
        Array.from({ length }, filler) :
        Array(length).fill(filler)
}
export function* backwards(arrayLike) {
    for (let { length } = arrayLike; length--;) yield arrayLike[length]
}
export function center(array) {
    return array[(array.length / 2) | 0]
}
export function insert(array, item, index) {
    return array.splice(index, 0, item)
}
export function remove(item, index) {
    return typeof item === 'string' ?
        `${item.slice(0, index)}${item.slice(index + 1)}` :
        item.splice(index, 1)
}
export function swap(item, first, second) {
    return{0:item[first], 1:item[second]} = [item[second], item[first]], item
}
export function swapInside(item, firstIndex, secondIndex) {
    const slot = item.indexOf(firstIndex),
        slot2 = item.indexOf(secondIndex)
    if (slot !== -1 && slot2 !== -1) return swap(item, slot, slot2)
    throw RangeError("Index out of range")
}
export function rotate(arr, rotation = 1) {
    let { length } = arr
    if (length < 2) return arr
    let sign = Math.sign(rotation),
        r = Math.abs(rotation | 0) % length
    if (sign > 0) while (r--) arr.unshift(arr.pop())
    else while (r--) arr.push(arr.shift())
    return arr
}
async function fallback(src) {
    return (await fetch(new URL(src, location))).json()
}
let s = sessionStorage.getItem('supportsJSONModule')
export let getJson
function do1() {
    // Some browsers (Firefox, old) throw with the 'options' parameter
    getJson = fallback.constructor('src',
        '"use strict";try{let out=(await import(new URL(src,location),{with:{type:\'json\'}})).default;sessionStorage.setItem("supportsJSONModule",true);return out}catch(e){if(e.name==="TypeError"){sessionStorage.setItem("supportsJSONModule",false);return this(src)}throw e}'
    )
        // If the import() thing still fails just use the fallback
        .bind(fallback)
    // using bind since the function can't access the module scope
}
function do2() {
    sessionStorage.setItem("supportsJSONModule", false)
    console.warn(`Your browser does not support 'import()' with json; Switching to fetch.`)
    getJson = fallback
}
if (s !== 'false' && s !== 'true') try {
    do1()
}
    catch (e) {
        if (e.name === "SyntaxError") {
            do2()
        }
        else reportError(e)
    }
else if (s === 'true') do1()
else do2()
export const jason = getJson
