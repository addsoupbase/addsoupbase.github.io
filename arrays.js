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
    [item[first], item[second]] = [item[second], item[first]]
    return item
}
export function swapInside(item, firstIndex, secondIndex) {
    const slot = item.indexOf(firstIndex),
        slot2 = item.indexOf(secondIndex)
    if (slot !== -1 && slot2 !== -1) return swap(item, slot, slot2)
    throw RangeError("Index out of range")
}
export function rotate(arr, rotation = 1) {
    if (arr.length < 2) return arr
    let sign = Math.sign(rotation),
        r = Math.abs(rotation | 0)
    if (sign > 0) while (r--) arr.unshift(arr.pop())
    else while (r--) arr.push(arr.shift())
    return arr
}
async function fallback(src) {
    return (await fetch(new URL(src, location.href))).json()
}
try {
    //  Some browsers (Firefox, old) throw with the 'options' parameter
    var getJson = fallback.
        constructor('src',
`
try {return(await import(new URL(src,location.href),{with:{type:'json'}})).default}
catch(e) {
    if (e.name === "TypeError")
    return this(src)
    throw e
}
`)
        //  If the import() thing still fails just use the fallback
        .bind(fallback)
    //  using bind since the function can't access the module scope
}
catch (e) {
    if (e.name === "SyntaxError") var getJson = fallback
    else reportError(e)
}
export const jason = getJson
export { getJson }