class StorageProxy {
    static #handler = {
        get(target, prop) {
            if (!isNaN(prop) && +prop > -1)
                return target.key(prop)
            if (prop === 'clear' || prop === 'length') return target[prop]
            return target.getItem(prop)
        },
        has(target, prop) {
            return target.getItem(prop) !== null
        },
        deleteProperty(target, prop) {
            return !target.removeItem(prop)
        },
        set(target, prop, value) {
            return !target.setItem(prop, value)
        }
    }
    constructor(storage) {
        if (storage instanceof Storage)
            return new Proxy(storage, StorageProxy.#handler)
        throw TypeError("Illegal constructor")
    }
}
export default globalThis.localStorage &&
    new StorageProxy(localStorage)
   export const sstorage = globalThis.sessionStorage &&
        new StorageProxy(sessionStorage)