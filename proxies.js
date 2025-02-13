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
export let lstorage = globalThis.localStorage &&
    new StorageProxy(localStorage),
    sstorage = globalThis.sessionStorage &&
        new StorageProxy(sessionStorage)
export function FormDataManager(FormDataInstance) {
    if (!(FormDataInstance instanceof FormData)) FormDataInstance = new FormData(FormDataInstance)
    return new Proxy(FormDataInstance, {
        get(target, prop) {
            return target.get(prop)
        },
        set(target, prop, val) {
            return !target.set(prop, val)
        },
        has(target, prop) {
            return target.has(prop)
        },
        deleteProperty(target, prop) {
            return !target.delete(prop)
        }
    })
}