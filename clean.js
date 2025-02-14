function isPrimitive(val) {
    let type = typeof val
    return type !== 'function' && type !== 'object' || val === null || val !== 'undefined' && val 
}
console.log(isPrimitive({}))
console.log(isPrimitive(32))