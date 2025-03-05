export function dashVendor(prop, val) {
    return vendor(toDash(prop), val)
}
export function capVendor(prop, val) {
    return toCaps(vendor(toDash(prop), val))
}
const alreadyLogged = new Set
export function badCSS(data) {
    if (alreadyLogged.has(data)) return
    console.warn(data)
    alreadyLogged.add(data)
}
const allVendors = /-(webkit|moz|o|ms|xv|atsc|wap|khtml|konq|apple|ah|hp|ro|rim|tc|fso|icabepub)-/,
    allVendors2 = /-(prince|mso)-/
export function vendor(prop, val) {
    val = `${val}`
    if (prop.startsWith('--') && CSS.supports(prop, val)) return prop
    if (val.trim() && !CSS.supports(prop, val)) {
        let prefix = prop = prop
            .replace(allVendors, '')
            .replace(allVendors2, '')
        return (
            CSS.supports(prefix, val) ||
            // Maybe you dont need a prefix?
            CSS.supports(prefix = `-webkit-${prop}`, val) ||
            // Most likely (Chrome, Safari)
            CSS.supports(prefix = `-moz-${prop}`, val) ||
            // Firefox
            CSS.supports(prefix = `-o-${prop}`, val) ||
            // Opera
            CSS.supports(prefix = `-apple-${prop}`, val) ||
            // Other webkit thing idk
            CSS.supports(prefix = `-ms-${prop}`, val) ||
            // Microsoft
            CSS.supports(prefix = `mso-${prop}`, val) ||
            // Microsoft Office
            CSS.supports(prefix = `-xv-${prop}`, val) ||
            // Opera
            CSS.supports(prefix = `-atsc-${prop}`, val) ||
            // Advanced Television Standards Committee
            CSS.supports(prefix = `-wap-${prop}`, val) ||
            // The WAP Forum
            CSS.supports(prefix = `-khtml-${prop}`, val) ||
            // Konqueror
            CSS.supports(prefix = `-konq-${prop}`, val) ||
            // Konqueror
            CSS.supports(prefix = `prince-${prop}`, val) ||
            // YesLogic
            CSS.supports(prefix = `-ah-${prop}`, val) ||
            // Antenna House
            CSS.supports(prefix = `-hp-${prop}`, val) ||
            // Hewlett Packard
            CSS.supports(prefix = `-ro-${prop}`, val) ||
            // Real Objects
            CSS.supports(prefix = `-rim-${prop}`, val) ||
            // Research In Motion
            CSS.supports(prefix = `-tc-${prop}`, val) ||
            // Tall Components
            CSS.supports(prefix = `-fso-${prop}`, val) ||
            // IDK
            CSS.supports(prefix = `-icab-${prop}`, val) ||
            // IDK
            CSS.supports(prefix = `-epub-${prop}`, val) ||
            // IDK
            badCSS(`⛓️‍💥 Unrecognized CSS at '${prefix = prop}: ${val}'`)),
            // Sorry!
            prefix
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
    return prop.startsWith('--') ? prop :
        prop.replace(/[A-Z]/g, tlc)
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
        catch { continue }
    return arr.join(';')
}
/** 
 *  ⚠️ Should only be used for dynamic/default CSS
 * @param {String} selector A valid CSS selector (something like . or#)
 * @param {Object} rule An object which describes the selector 
 */
export async function registerCSS(selector, rule) {
    selector = selector.split(',')
        .map(selectr => {
            if (/::[\w-]/.test(selectr)) selectr = supportedPElementVendor(selectr)
            else if (/:[\w-]/.test(selectr)) selectr = supportedPClassVendor(selectr)
            return selectr
        })
        .join(',')
    const sheet = addedStyleRules ??= getDefaultStyleSheet()
    return new Promise(res)
    function res(resolve) {
        requestAnimationFrame(res)
        function res() {
            let r = `{${toCSS(rule)}}`
            return resolve(sheet.insertRule(`${formatStr(selector)}${formatStr(r)}`))
        }
    }
}
export function formatStr(str) {
    return str.trim().replace(/\s\s|\n\n/g, '')
}
export function getDefaultStyleSheet() {
    return (document.getElementById('addedStyleRules') ?? function () {
        let out = document.createElement('style');
        (document.head ?? document.body ?? document.documentElement ?? document.querySelector('*')).appendChild(out)
        out.sheet.insertRule('@namespace svg url("http://www.w3.org/2000/svg")')
        out.setAttribute('id', 'addedStyleRules')
        out.textContent = 'Check your browser for CSS rules ($0.sheet.cssRules)'
        return out
    }()).sheet
}
export function registerCSSAll(rules) {
    let out = []
    for (let rule in rules) out.push(registerCSS(rule, rules[rule]))
    return out
}
// let dummyStyleSheet,
// working = new Set,
// bad = new Set
export function supportsRule(rule) {

    return CSS.supports(`selector(${rule})`) // Not me finding out you can do this after spending like an hour trying to make a workaround 😭
    dummyStyleSheet ??= new CSSStyleSheet
    if (working.has(rule)) return true
    else if (bad.has(rule)) return false
    try {
        //  if the rule is invalid it will throw
        dummyStyleSheet.insertRule(rule, 0)
        //  If for whatever reason it doesn't,
        //  it won't be added so we can just check for that        
        if (!(0 in dummyStyleSheet.cssRules)) throw ''
        dummyStyleSheet.deleteRule(0)
        working.add(rule)
        return true
    } catch {
        bad.add(rule)
        console.warn(`⛓️‍💥 Unsupported CSS rule: '${rule}'`)
        return false
    }
}
const theNames = allVendors.toString().match(/\w+/g)
export function supportedPClassVendor(className) {
    try {
        let [before, _class] = className.split(':'),
            already = _class
        _class = _class.replace(allVendors, '')
            .replace(allVendors2, '')
        if (supportsRule(already = `${before}:${already}`)) return already
        for (let vendor of theNames) {
            let name = `:-${vendor}-${_class}`
            if (supportsRule(name)) return `${before}${name}`
        }
        if (supportsRule(className = `:prince-${_class}`) ||
            supportsRule(className = `:mso-${_class}`)) return `${before}${className}`
        return `${before}:${_class}`
    }
    catch {
        throw SyntaxError(`Bad parsing for Pseudo-Class: '${_class}'. They should include ':'`)
    }
}
export function supportedPElementVendor(element) {
    try {
        let [before, _element] = element.split('::'),
            already = _element
        _element = _element.replace(allVendors, '')
            .replace(allVendors2, '')
        if (supportsRule(already = `${before}::${already}`)) return already
        for (let vendor of theNames) {
            let name = `::-${vendor}-${_element}`
            if (supportsRule(name)) return `${before}${name}`
        }
        if (supportsRule(element = `::prince-${_element}`) ||
            supportsRule(element = `::mso-${_element}`)) return `${before}${element}`
        return `${before}::${_element}`
    }
    catch {
        throw SyntaxError(`Bad parsing for Pseudo-Element: '${element}'. They should include '::'`)
    }
}

queueMicrotask
    (() => {
        //    Some default CSS..
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
            },
        })
        'registerProperty' in CSS &&
            void async function (all, scheduler = {
                yield() {
                    return new Promise(requestAnimationFrame)
                }
            }) {
                //  This registers all of those var(--abc-xyz)
                //  all the properties are located at the very bottom of this module!


                /*await scheduler.yield()
                CSS.registerProperty({
                    name: '--padding-start',
                    inherits: false,
                    initialValue: 0
                })*/
                // console.groupCollapsed('⛓️‍💥 Unsupported CSS (you can ignore this)')
                for (let prop of all)
                    try {
                        CSS.registerProperty(prop)
                        await scheduler.yield()
                    }
                    catch (e) {
                        reportError(e)
                        continue
                    }
                const universal = {}
                all.forEach(reg)
                function reg({ name: o }) {
                    universal[vendor(o.slice(2), `var(${o})`)] = `var(${o})`
                }
                registerCSS('*', universal)
                // console.groupEnd('⛓️‍💥 Unsupported CSS (you can ignore this)')
            }(new Set(allProps), window.scheduler)
    })//()
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
{
let inherits = true
var allProps = [
    {
        //  Most important one
        name: '--user-select',
        initialValue: 'auto',
        inherits
    },
    {
        name: '--user-modify',
        initialValue: 'auto',
        inherits: false
    },
    {
        name: '--force-broken-image-icon',
        syntax: '<integer>',
        initialValue: 0,
        inherits: false
    },
    {
        name: '--float-edge',
        initialValue: 'content-box',
        inherits: false
    },
    {
        name: '--image-region',
        inherits,
        initialValue: 'auto',
    },
    {
        name: '--box-orient',
        initialValue: 'inline-axis',
        inherits: false
    },
    {
        name: '--box-align',
        initialValue: 'stretch',
        inherits: false
    },
    {
        name: '--box-direction',
        initialValue: 'normal',
        inherits: false
    },
    {
        name: '--box-flex',
        inherits: false,
        initialValue: 0,
    },
    {
        name: '--box-flex-group',
        inherits: false,
        initialValue: 0,
    },
    {
        name: '--box-lines',
        inherits: false,
        initialValue: 'single'
    },
    {
        name: '--box-ordinal-group',
        inherits: false,
        initialValue: 1
    },
    {
        name: '--box-decoration-break',
        inherits: false,
        initialValue: 'slice'
    },
    {
        name: '--box-pack',
        inherits: false,
        initialValue: 'start'
    },
    {
        name: '--user-input',
        inherits,
        initialValue: 'auto'
    },
    {
        name: '--box-reflect',
        inherits: false,
        initialValue: 'none'
    },
    {
        name: '--text-stroke-color',
        inherits,
        syntax: '<color>',
        initialValue: 'currentcolor'
    },
    {
        name: '--text-stroke-width',
        inherits,
        syntax: '<length>',
        initialValue: 0
    },
    {
        name: '--text-security',
        inherits: false,
        initialValue: 'none'
    },
    {
        name: '--text-fill-color',
        inherits,
        initialValue: 'currentcolor'
    },
    {
        name: '--line-clamp',
        inherits: false,
        initialValue: 'none'
    },
    {
        name: '--font-smoothing',
        inherits,
        initialValue: 'auto'
    },
    {
        name: '--mask-position-x',
        inherits: false,
        syntax: '<length-percentage>',
        initialValue: '0%'
    },
    {
        name: '--mask-position-y',
        inherits: false,
        syntax: '<length-percentage>',
        initialValue: '0%'
    },
    {
        name: '--tap-highlight-color',
        inherits,
        syntax: '<color>',
        initialValue: 'transparent'
    },
    {
        name: '--touch-callout',
        inherits,
        // syntax: '<color>',
        initialValue: 'default'
    },
    {
        name: '--window-dragging',
        inherits: false,
        initialValue: 'drag'
    },
    {
        name: '--stack-sizing',
        inherits,
        initialValue: 'stretch-to-fit'
    },
    {
        name: '--appearance',
        inherits: false,
        initialValue: 'auto'
    },
    {
        name: '--mask-composite',
        inherits: false,
        initialValue: 'source-over'
    },
    {
        name: '--image-rect',
        inherits,
        initialValue: 'auto'
    },
    {
        name: '--context-properties',
        inherits,
        initialValue: 'none'
    },
    {
        name: '--outline-radius',
        inherits: false,
        initialValue: '0 0 0 0'
    },
    {
        name: '--window-shadow',
        inherits: false,
        initialValue: 'default'
    },
    {
        name: '--binding',
        inherits: false,
        initialValue: 'none'
    },
    {
        name: '--user-focus',
        inherits: false,
        initialValue: 'none'
    },
    {
        name: '--text-blink',
        inherits: false,
        initialValue: 'none'
    },
    {
        name: '--content-zoom-limit',
        inherits: false,
        initialValue: '400% 100%'
    },
    {
        name: '--accelerator',
        inherits: false,
        initialValue: false
    },
    {
        name: '--initial-letter',
        inherits: false,
        initialValue: 'normal'
    },
    {
        name: '--order',
        inherits: false,
        initialValue: 0
    }
]
}