export function vendor(prop, val) {
    if (val && !CSS.supports(prop, val)) {
        let prefix = `-webkit-${prop}`
        if (CSS.supports(prefix, val))
            return prefix
        if (CSS.supports(prefix = prop.replace(/-(moz|o|ms|webkit)-/, ''), val))
            return prefix
        if (CSS.supports((prefix = `-moz-${prop}`), val))
            return prefix
        if (CSS.supports((prefix = `-o-${prop}`), val))
            return prefix
        if (CSS.supports((prefix = `-ms-${prop}`), val))
            return prefix
        console.warn(`⛓️‍💥 Unrecognized CSS at '${prop}: ${val}'`)
        return prefix
        // throw SyntaxError('Invalid CSS')
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
    if (prop.includes('-')) {
        if (prop[0] === '-') prop = prop.slice(1)
        return prop.replace(/-./g, tuc)
        function tuc(o) {
            return o[1].toUpperCase()
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
        let out = document.createElement('style')
        document.head.appendChild(out)
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
    try {
        let val = parseFloat(value),
            unit = value.split(val).at(-1)
        if (unit === '%') unit = 'percent'
        if (isNaN(val)) throw TypeError('Invalid number')
        if (!isNaN(+value)) return CSS.number(value)
        if (!(unit in CSS)) throw SyntaxError(`Unrecognised unit '${unit}'`)
        return CSS[unit](val)
    } catch {
        return value
    }
}