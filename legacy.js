'use strict'
/*@cc_on
    function _(){var e=new ActiveXObject("Scripting.Dictionary");return{set:function(n,t){e.Add(n,t)},get:function(n){return e.Item(n)},add:function(n){e.Add(n,"")},has:function(n){return e.Exists(n)},delete:function(n){e.Remove(n)}}}
    w.Map=w.Map || _
    w.WeakMap= w.WeakMap || _
    w.Set = w.Set || _
@*/
var globalThis = globalThis || window
var require = function () {
    var _import = null
    function require(src, options) {
        options = options || {}
        var type = options.type || 'text'
        var sync = options.sync || false
        switch (type) {
            case 'script':
                if (sync) {
                    var xhr = new XMLHttpRequest
                    xhr.open('GET', src, false)
                    xhr.send()
                    return (eval)(xhr.responseText)
                }
                if (document.readyState !== 'complete') document.write('<script src="' + src + '" type="text/javascript"></script>')
                else {
                    var s = document.createElement('script')
                    s.src = src
                    s.type = 'text/javascript'
                    document.head.appendChild(s)
                }
                return {
                    then: function (resolve) {
                        document.querySelector('script[src="' + src + '"]').onload = resolve
                    },
                    catch: function (reject) {
                        document.querySelector('script[src="' + src + '"]').onerror = reject
                    }
                }
            case 'module':
                if (!_import) _import = Function('s', '"use strict";return import(s).then(d)')
                return _import(src)
            case 'json':
                if (typeof fetch === 'function') return fetch(src).then(function (o) { return o.json() })
                var xhr = new XMLHttpRequest
                xhr.open('GET', src, !sync)
                xhr.send()
                if (sync) return (window.JSON ? JSON.parse : eval)(xhr.responseText)
                return typeof Promise === 'function' ? new Promise(function (resolve) { xhr.onload = function () { resolve(JSON.parse(xhr.responseText)) } }) : {
                    then: function (resolve) {
                        xhr.onload = function () {
                            resolve((window.JSON ? JSON.parse : eval)(xhr.responseText))
                        }
                    },
                    catch: function (reject) {
                        xhr.onerror = reject
                    }
                }
        }
    }
    return require
}()
var reportError = reportError || function reportError(t) {
    try {
        try {
            var e = new ErrorEvent('error', {
                message: t.message,
                error: t,
                // filename: (scr = src || inModule ? document.querySelector('script[src$="css.js"]') : script) && scr.src
            })
        }
        catch (_) {
            e = document.createEvent('ErrorEvent')
            e.initEvent('error', true, true)
            // e.message = t.message
            // e.error = t
        }
        window.dispatchEvent(e)
        e.defaultPrevented || console.error('[reportError]', String(t))
    }
    catch (o) { console.warn(String(o)) }
}
Object.hasOwn = Object.hasOwn || hasOwnProperty.call.bind(hasOwnProperty)
var CSS = CSS || function () { 
    var D = document
    , p = D.head || D.body || D.documentElement || ((p = D.currentScript) && (p.parentNode || p)) || D.querySelector('*') || D
    , s = p.appendChild(D.createElement('style')), computed = getComputedStyle(s); return { supports: supports }; function supports(propOrSelector, value) { var isSelector = propOrSelector.substring(0, 8) === 'selector'; if (isSelector && value == null) { s.textContent = propOrSelector.slice(9, -1) + '{width:auto;}'; return (s.sheet.cssRules || s.sheet.rules).length === 1 } return propOrSelector in computed } }()
''.startsWith || Object.defineProperty(String.prototype, 'startsWith', { value: function (s, p) { return this.slice(p = p | 0, (s += '').length + p) === s } });[].find || Object.defineProperty(Array.prototype, 'find', { value: function (c, t, m, z) { for (var i = 0, l = (m = this).length; i < l; ++i) { z = m[i]; if (c.call(t, z)) return z } } }); ''.includes || (String.prototype.includes = function (a, b) { return !!~this.indexOf(a, b) })
    ;[].findIndex || (Object.defineProperty(Array.prototype, 'findIndex', { value: function findIndex(fn, thisArg) { for (var i = 0, m = this, l = m.length; i < l; ++i)if (fn.call(thisArg, m[i], i, m)) return i; return -1 } }))
typeof Symbol === 'function' || function () { function a(b) { return String(Math.random() + String(b) + performance.now() + String(Date.now())) } a.for = ''.concat.bind('@@'); window.Symbol = a }()
var Reflect = Reflect || {
    apply: function (target, thisArg, args) { return target.apply(thisArg, args) }, getPrototypeOf: Object.getPrototypeOf || function (t) { return t.__proto__ }, setPrototypeOf: Object.setPrototypeOf || Function.call.bind(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set), /*getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,*/ defineProperty: Object.defineProperty, ownKeys: Object.getOwnPropertyNames, has: function (t, p) { return t in p },
    set: function (t, p, v) { t[p] = v }, get: function (t, p) { return t[p] },
    deleteProperty: function (t, p) { return delete t[p] },
    construct: function (target, args, newTarget) {
        if (typeof target !== 'function' || typeof newTarget !== 'function') throw TypeError('Constructor required')
        var out = new ((newTarget || target).bind.apply((newTarget || target), [this].concat(args)))
        if (newTarget) Object.setPrototypeOf(out, target.prototype)
        return out
    },
    preventExtensions: Object.preventExtensions,
    isExtensible: Object.isExtensible,
    getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
}
Object.fromEntries = Object.fromEntries || function (l, o) { o = {}; l.forEach(function (e, p) { p = e[0]; o[p] = e[1] });return o }
Object.entries = Object.entries || function (o, i) { var x = []; for (i in o) x.push([i, o[i]]); return x }
''.at || Object.defineProperty(Array.prototype, 'at', {
    value: String.prototype.at = function (i) {
        i |= 0
        if (i < 0) i += this.length
        var a = this[i]
        return typeof this === 'string' ? (a===void 0?'':a) : a
    }
})