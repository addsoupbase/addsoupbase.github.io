export default class StorageProxy {
    static #handler = {
        get(target, prop) {
            prop = `${this.ns}${prop}`
            if (!isNaN(prop) && prop > -1 && Number.isInteger(+prop))
                return target.key(prop)
            if (prop === 'clear' || prop === 'length') return target[prop]
            return target.getItem(prop)
        },
        has(target, prop) {
            prop = `${this.ns}${prop}`
            return target.getItem(prop) !== null
        },
        deleteProperty(target, prop) {
            prop = `${this.ns}${prop}`
            return !target.removeItem(prop)
        },
        set(target, prop, value) {
            prop = `${this.ns}${prop}`
            debugger
            // i have NO idea why,
            // but storage events dont fire on
            // the window that made the change
            let e = new StorageEvent('storage', {
                key: prop,
                newValue: value,
                oldValue: this.get(target, prop),
                storageArea: target,
                url: location
            })
            target.setItem(prop, value)
            dispatchEvent(e)
            return 1
        }
    }
    constructor(storage, ns = '') {
        // if (storage instanceof Storage)
        return new Proxy(storage, { __proto__: StorageProxy.#handler, ns })
        // throw TypeError("Illegal constructor")
    }
}
export let lstorage = new StorageProxy(localStorage), sstorage = new StorageProxy(sessionStorage)
/*export function Realm() {
    let frame = document.createElement('iframe');
    (document.head ?? document).append(frame)
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
    */
