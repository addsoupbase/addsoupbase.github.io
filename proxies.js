class StorageProxy {
    static #handler = {
        get(target, prop) {
            if (!isNaN(prop) && +prop > -1 && Number.isInteger(+prop))
                return target.key(prop)
            if (prop === 'clear' || prop === 'length') return target[prop]
            return target.getItem(prop)
        },
        has(target, prop) {
            return target.getItem(prop) !== null
        },
        deleteProperty(target, prop) {
            return!target.removeItem(prop)
        },
        set(target, prop, value) {
            return!target.setItem(prop, value)
        }
    }
    constructor(storage) {
        if (storage instanceof Storage)
            return new Proxy(storage, StorageProxy.#handler)
        throw TypeError("Illegal constructor")
    }
}
export const lstorage = globalThis.localStorage &&
    new StorageProxy(localStorage),
    sstorage = globalThis.sessionStorage &&
        new StorageProxy(sessionStorage)
export function FormDataManager(FormDataInstance) {
    if (!(FormDataInstance instanceof FormData)) FormDataInstance = new FormData(FormDataInstance)
    return new Proxy(FormDataInstance, formProxyHandler)
}
const formProxyHandler = {
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
}