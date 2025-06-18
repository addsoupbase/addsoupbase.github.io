class StorageProxy {
    static #handler = {
        get(target, prop) {
            if (!isNaN(prop) && prop > -1 && Number.isInteger(+prop))
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
            // i have NO idea why,
            // but storage events dont fire on
            // the window that made the change
            let e = new StorageEvent('storage',{
                key: prop,
                newValue: value,
                oldValue: this.get(target,prop),
                storageArea: target,
                url: location
            })
            target.setItem(prop, value)
            dispatchEvent(e)
            return 1
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
/**
 * @deprecated
 * */
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
export function Realm() {
    let frame = document.createElement('iframe');
    (document.head ??document).append(frame)
    let out = frame.contentWindow
    frame.remove()
    out.call = Function('return eval(`(${arguments[0].toString})(...arguments)`)')
    // out.eval = Function('with(this) return eval(typeof arguments[0]==="function"?`(${arguments[0].toString})()`:arguments[0])').bind(out)
    return out
}
const RealmHandler = {
    get(target, prop) {
        if (prop === 'eval') return target.eval
    }
}