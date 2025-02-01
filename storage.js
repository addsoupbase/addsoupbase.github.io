class StorageProxy {
    static #handler = {
        get(target, prop) {
            'use strict'
            if (!isNaN(prop) && +prop > -1 && Number.isInteger(+prop))
                return target.key(prop)
            if (prop === 'clear' || prop === 'length') return target[prop]
            return target.getItem(prop)
        },
        has(target, prop) {
            'use strict'
            return target.getItem(prop) !== null
        },
        deleteProperty(target, prop) {
            'use strict'
            return !target.removeItem(prop)
        },
        set(target, prop, value) {
            'use strict'
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