export function vendor(prop, val) {
    if (val?.trim() && !CSS.supports(prop, val)) {
        let prefix = `-webkit-${prop}` // The most popular fallback (Safari, Chrome)
        if (CSS.supports(prefix, val))
            return prefix
        if (CSS.supports(prefix = prop.replace(/(-(moz|o|ms|webkit|xv|atsc|wap|khtml|konq|apple|ah|hp|ro|rim|tc|fso|icab)-)|(mso|prince)-/, ''), val))
            // Maybe you don't need a prefix?
            return prefix
        if (CSS.supports((prefix = `-moz-${prop}`), val))
            // Firefox
            return prefix
        if (CSS.supports((prefix = `-o-${prop}`), val))
            // Opera
            return prefix
        if (CSS.supports((prefix = `-ms-${prop}`), val))
            // Microsoft
            return prefix

        // The rest of these are in no particular order.
        if (CSS.supports((prefix = `mso-${prop}`), val))
            // Microsoft Office
            return prefix
        if (CSS.supports((prefix = `-xv-${prop}`), val))
            // Opera
            return prefix
        if (CSS.supports((prefix = `-atsc-${prop}`), val))
            // Advanced Television Standards Committee
            return prefix
        if (CSS.supports((prefix = `-wap-${prop}`), val))
            // The WAP Forum
            return prefix
        if (CSS.supports((prefix = `-khtml-${prop}`), val))
            // Konqueror
            return prefix
        if (CSS.supports((prefix = `-konq-${prop}`), val))
            // Konqueror
            return prefix
        if (CSS.supports((prefix = `-apple-${prop}`), val))
            // Other webkit thing idk
            return prefix
        if (CSS.supports((prefix = `prince-${prop}`), val))
            // YesLogic
            return prefix
        if (CSS.supports((prefix = `-ah-${prop}`), val))
            // Antenna House
            return prefix
        if (CSS.supports((prefix = `-hp-${prop}`), val))
            // Hewlett Packard
            return prefix
        if (CSS.supports((prefix = `-ro-${prop}`), val))
            // Real Objects
            return prefix
        if (CSS.supports((prefix = `-rim-${prop}`), val))
            // Research In Motion
            return prefix
        if (CSS.supports((prefix = `-tc-${prop}`), val))
            // Tall Components
            return prefix
        if (CSS.supports((prefix = `-fso-${prop}`), val))
            // IDK
            return prefix
        if (CSS.supports((prefix = `-icab-${prop}`), val))
            // IDK
            return prefix
        console.warn(`⛓️‍💥 Unrecognized CSS at '${prop}: ${val}'`)
        // Sorry!
        return prefix
    }
    return prop
}
export async function importFont(name, src) {
    if (!name || !src) throw TypeError('More arguments needed')
    const font = new FontFace(name, `url(${src})`)
    await font.load()
    document.fonts.add(font)
    return font
}
export function toCaps(prop) {
    if (prop.includes('-') && !prop.startsWith('--')) { // Ignore custom properties
        if (prop[0] === '-') prop = prop.slice(1)
        return prop.replace(/-./g, tuc)
        function tuc({ 1: char }) {
            return char.toUpperCase()
        }
    }
    return prop
}
export function toDash(prop) {
    return prop.replace(/[A-Z]/g, tlc)
    function tlc(o) {
        return `-${o.toLowerCase()}`
    }
}
let addedStyleRules = null
/**
 * @param {Object} obj key/value pairs that match CSS
 * @returns {String}
 */
export function toCSS(obj) {
    const arr = []
    if (!Array.isArray(obj)) obj = Object.entries(obj)
    for (let [prop, val] of obj)
        try { arr.push(`${vendor(toDash(prop), val)}:${val}`) }
        finally { continue }
    return arr.join(';')
}
/** 
 *  ⚠️ Should only be used for dynamic/default CSS
 * @param {String} selector A valid CSS selector (something like . or#)
 * @param {Object} rule An object which describes the selector 
 */
export async function registerCSS(selector, rule) {
    const { sheet } = addedStyleRules ??= function () {
        let out = document.createElement('style');
        (document.head ?? document.body ?? document.documentElement).appendChild(out)
        out.textContent = 'Check your browser for CSS rules'
        return out
    }()
    return new Promise(res)
    function res(resolve) {
        requestAnimationFrame(res)
        function res() {
            return resolve(sheet.insertRule(`${selector}{${toCSS(rule)}}`))
        }
    }
}
export function registerCSSAll(rules) {
    let out = []
    for (let rule in rules) out.push(registerCSS(rule, rules[rule]))
    return out
}
queueMicrotask(() => {
    //    Some default CSS...
    registerCSSAll({
        dialog: {
            transition: 'opacity 1s linear',
            "font-family": "Arial",
            "text-align": "center",
            width: "300px",
            height: "150px",
            "word-break": "break-word"
        },
        '.centerx,.center': {
            'justify-self': 'center',
            margin: 'auto'
        },
        '.centery,.center': {
            'align-self': 'center',
            inset: 0,
            position: 'fixed'
        }
    })
})
export function dropShadow({
    color = '#000000',
    offsetX = '0px',
    offsetY = '0px',
    standardDeviation = ''
}) {
    return `${color} ${offsetX} ${offsetY} ${standardDeviation}`
}
export function boxShadow({
    offsetX = '0px',
    offsetY = '0px',
    blurRadius = '',
    spreadRadius = '',
    color = '#000000'
}) {
    return `${color} ${offsetX} ${offsetY} ${blurRadius} ${spreadRadius}`.replaceAll('  ', '')
}
export function convertToCSSMethod(value) {
    // Does not work in firefox
    /* try {
         let val = parseFloat(value),
             unit = value.split(val).at(-1)
         if (unit === '%') unit = 'percent'
         if (isNaN(val)) throw TypeError('Invalid number')
         if (!isNaN(+value)) return CSS.number(value)
         if (!(unit in CSS)) throw SyntaxError(`Unrecognised unit '${unit}'`)
         return CSS[unit](val)
     } catch {*/
    return value
    // }
}