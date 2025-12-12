class ObjectURL {
    #url
    [Symbol.toPrimitive]() {
        return this.#url
    }
    static cache = new WeakMap
    constructor(blob) {
        if (ObjectURL.cache.has(blob)) return ObjectURL.cache.get(blob)
        revoke.register(this, [this.#url = URL.createObjectURL(blob), blob])
        this.ref = blob
        ObjectURL.cache.set(blob, Object.preventExtensions(this))
    }
}
let revoke = new FinalizationRegistry(garbage)
function garbage({ 0: url, 1: blob }) {
    URL.revokeObjectURL(url)
    ObjectURL.cache.delete(blob)
}
if (Symbol.dispose) 
    Object.defineProperty(ObjectURL.prototype, Symbol.dispose,{value() {
                URL.revokeObjectURL(this)
                ObjectURL.cache.delete(this.ref)}})
export default ObjectURL