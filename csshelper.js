function reportError(throwable) {
    window.dispatchEvent(new ErrorEvent('error', {
        message: throwable.message,
        error: throwable,
        filename: import.meta.url
    }))
    console.error(`${throwable}`)
}
reportError = window.reportError ?? reportError
export function dashVendor(prop, val) {
    return vendor(toDash(prop), val)
}
export function capVendor(prop, val) {
    return toCaps(vendor(toDash(prop), val))
}
export function vendorValue(prop, val) {
    // i will fix this soon
    let without = val.replace(allVendors, '')
        .replace(allVendors2, '')
    switch (without) {
        case 'crisp-edges':
            CSS.supports(prop, val = '-webkit-optimize-contrast') ||
                CSS.supports(prop, val = `-moz-crisp-edges`) ||
                CSS.supports(prop, val = without)
            break
        case 'stretch':
        case 'fill-available':
        case 'available':
            CSS.supports(prop, val = '-webkit-fill-available') ||
                CSS.supports(prop, val = '-moz-available') ||
                CSS.supports(prop, val = without)
            break
    }
    return val
}
const alreadyLogged = new Set
const beenHereBefore = sessionStorage.getItem('css')
export function badCSS(data, silent) {
    if (silent || alreadyLogged.has(data)) return
    console.warn(data)
    alreadyLogged.add(data)
}
const allVendors = RegExp(
    `-(?:${'webkit moz apple khtml konq o ms xv atsc wap ah hp ro rim tc fso icab epub'.replace(/\s/g, '|')})-`
    // internal
),
    allVendors2 = /(?:prince|mso)-/
const dontRedo = new Map
export function vendor(prop, val, silent) {
    if (prop.startsWith('--') && CSS.supports(prop, val)) return prop
    if (val.trim() && !CSS.supports(prop, val)) {
        let prefix = prop = prop
            .replace(allVendors, '')
            .replace(allVendors2, '')
        if (dontRedo.has(prop)) return dontRedo.get(prop)
        return (
            CSS.supports(prefix, val) ||
            // Maybe you dont need a prefix?
            CSS.supports(prefix = `-webkit-${prop}`, val) ||
            // Most likely (Chrome, Safari)
            CSS.supports(prefix = `-moz-${prop}`, val) ||
            // Firefox
            CSS.supports(prefix = `-moz-osx-${prop}`, val) ||
            // Firefox
            CSS.supports(prefix = `-o-${prop}`, val) ||
            // Opera
            CSS.supports(prefix = `-apple-${prop}`, val) ||
            // Apple!
            CSS.supports(prefix = `-ms-${prop}`, val) ||
            // Microsoft
            CSS.supports(prefix = `-khtml-${prop}`, val) ||
            // Konqueror
            CSS.supports(prefix = `-konq-${prop}`, val) ||
            // Konqueror
            CSS.supports(prefix = `mso-${prop}`, val) ||
            // Microsoft Office
            CSS.supports(prefix = `-xv-${prop}`, val) ||
            // Opera
            CSS.supports(prefix = `-atsc-${prop}`, val) ||
            // Advanced Television Standards Committee
            CSS.supports(prefix = `-wap-${prop}`, val) ||
            // The WAP Forum
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
            // CSS.supports(prefix = `-internal-${prop}`, val) ||
            badCSS(`⛓️‍💥 Unrecognized CSS at '${prefix = prop}: ${val}'`, silent)),
            mayNotBeSupported(prop),
            dontRedo.set(prop, prefix),
            // Sorry!
            prefix
    }
    return prop
}
const newerProps = /^(?:translate|scale|rotate|zoom)$/
//  (that i have used before)
function mayNotBeSupported(prop) {
    newerProps.test(prop) && badCSS(`💿 '${prop}' may not be supported on older devices`)
}
export function importFont(name, src) {
    if (name && src) {
        const font = new FontFace(name, `url(${src})`)
        font.load().then(document.fonts.add, console.warn)
        return font
    }
    throw Error(`Src and name required`)
}
let defrt = /-./g
export function toCaps(prop) {
    if (prop.includes('-') && !prop.startsWith('--')) { // Ignore custom properties
        if (prop[0] === '-') prop = prop.slice(1)
        return prop.replace(defrt, tuc)
    }
    return prop
}
let azregex = /[A-Z]/g
export function toDash(prop) {
    return prop.startsWith('--') ? prop :
        prop.replace(azregex, tlc)
}
function tlc(o) {
    return `-${o.toLowerCase()}`
}
function tuc({ 1: char }) {
    return char.toUpperCase()
}
let addedStyleRules = null
/**
 * @param {Object} obj key/value pairs that match CSS
 * @returns {String}
 */
export function toCSS(obj, silent) {
    const arr = []
    if (Array.isArray(obj)) obj = Object.fromEntries(obj)
    for (let prop in obj) {
        let p = vendorValue(prop, `${obj[prop]}`)
        try { arr.push(`${vendor(toDash(prop), p, silent)}:${p}`) }
        catch { continue }
    }
    return arr.join(';')
}
let pseudoElementRegex = /::[\w-]/
let pseudoClassRegex = /:[\w-]/
function mapThing(selectr) {
    if (pseudoElementRegex.test(selectr)) selectr = supportedPElementVendor(selectr)
    else if (pseudoClassRegex.test(selectr)) selectr = supportedPClassVendor(selectr)
    return selectr
}
/** 
 *  ⚠️ Should only be used for dynamic/default CSS
 * @param {String} selector A valid CSS selector (something like . or#)
 * @param {Object} rule An object which describes the selector 
 */
export async function registerCSS(selector, rule, silent) {
    selector = selector.split(',')
        .map(mapThing)
        .join(',')
    const sheet = addedStyleRules ??= getDefaultStyleSheet()
    return new Promise(res)
    function res(resolve) {
        requestAnimationFrame(res)
        function res() {
            let r = `{${toCSS(rule, silent)}}`
            return resolve(sheet.insertRule(`${formatStr(selector)}${formatStr(r)}`))
        }
    }
}
let cleanRegex = /\s\s|\n\n/g
export function formatStr(str) {
    return str.trim().replace(cleanRegex, '')
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
    return Object.keys(rules).map(bleh)
    function bleh(r) {
        return registerCSS(r, rules[r])
    }
    // let out = []
    // for (let rule in rules) out.push(registerCSS(rule, rules[rule]))
    // return out
}
export function supportsRule(rule) {
    return CSS.supports(`selector(${rule})`)
}
const theNames = `${allVendors}`.match(/\w+/g)
export function supportedPClassVendor(className) {
    try {
        let { 0: before, 1: _class } = className.split(':'),
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
        let { 0: before, 1: _element } = element.split('::'),
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
    debugger
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
    function g(name, initialValue, inherits, syntax) {
        initialValue ??= 'auto'
        inherits ??= false
        syntax ??= '*'
        return { name: `--${name}`, initialValue, inherits, syntax }
    }
    !function (allProps) {
        //    Some default CSS..
        registerCSSAll({
            /*  dialog: {
                  transition: 'opacity 1s linear',
                  "font-family": "Arial",
                  "text-align": "center",
                  width: "300px",
                  height: "150px",
                  "word-break": "break-word"
              },*/
            [`button,a,
                ${'button checkbox radio submit image reset file'.split(' ').map(o => `input[type=${o}]`).join(',')
                }`]: {
                cursor: 'pointer'
            },
            '*:disabled': {
                cursor: 'not-allowed'
            },
            '.centerx,.center': {
                'justify-self': 'center',
                margin: 'auto',
                'text-align': 'center'
            },
            '.centery,.center': {
                'align-self': 'center',
                inset: 0,
                position: 'fixed'
            },
        })
        void function () {
            function Yield() {
                return new Promise(queueMicrotask)
            }
            Yield = window.scheduler?.yield?.bind(scheduler) ?? Yield
            //  This registers all of those var(--abc-xyz)
            //  all the properties are located at the very bottom of this module!
            /*CSS.registerProperty({
                name: '--padding-start',
                inherits:0,
                initialValue: 0
            })*/
            const universal = {}
            let func = CSS.registerProperty ?? function () { }
            for (let { length: i } = allProps; i--;) {
                let prop = allProps[i]
                try {
                    var o = prop.name
                    universal[vendor(o.slice(2), o = `var(${o})`, true)] = o
                    func(prop)
                    // await Yield()
                }
                catch (e) {
                    if (e.name === 'InvalidModificationError') continue
                    console.log(o)
                    reportError(e)
                }
            }
            allProps = null
            if (beenHereBefore)
                addedStyleRules.insertRule(`* {${beenHereBefore}}`)
            else
                registerCSS('*', universal, true),
                    sessionStorage.setItem('css', toCSS(universal, true))
        }()
    }([
        //  Fallback stuff
        g("user-select", "auto", true), // Most important one
        g("user-modify", "auto", 0),
        g("zoom", "auto", 0),
        g('locale', 'auto', true),
        g('line-grid', 'auto', true),
        g('line-snap', 'auto', true),
        g('nbsp-mode', 'auto', true),
        g("text-zoom", 'auto', true),
        g('line-align', 'auto', true),
        g('user-drag', "auto", true),
        g('text-decorations-in-effect', 'auto', 0),
        g("force-broken-image-icon", 0, 0, "<integer>"),  // Might be useful (moz)
        g("float-edge", "content-box", 0),
        g("image-region", "auto", true),
        g("box-orient", "inline-axis", 0),
        g("box-align", "stretch", 0),
        g("box-direction", "normal", 0),
        g("box-flex", 0, 0),
        g("box-flex-group", 0, 0),
        g("box-lines", "single", 0),
        g("box-ordinal-group", "1", 0),
        g("box-decoration-break", "slice", 0),
        g("box-pack", "start", 0),
        g("user-input", "auto", true),
        // g("text-orientation", 'vertical-right', true),
        g("box-reflect", "none", 0), // Kewl
        g("text-stroke-color", "currentcolor", true, "<color>"),
        g("text-stroke-width", 0, true, "<length>"),
        g("text-security", "none", 0),
        g("text-fill-color", "currentcolor", true),
        g("line-clamp", "none", 0),
        g("font-smoothing", "auto", true),
        g("mask-position-x", "0%", 0, "<length-percentage>"),
        g("mask-position-y", "0%", 0, "<length-percentage>"),
        g("tap-highlight-color", "rgb(0, 0, 0, 0.18)", true, "<color>"), // Also good
        g("touch-callout", "auto", true),
        g("window-dragging", "auto", 0),
        g("stack-sizing", "stretch-to-fit", true),
        // g("appearance", "auto", 0),
        g("mask-composite", "source-over", 0),
        g("image-rect", "auto", true),
        g("context-properties", "none", true),
        g("outline-radius", "0 0 0 0", 0),
        g("window-shadow", "auto", 0),
        g("binding", "none", 0),
        g("user-focus", "none", 0),
        g("text-blink", "none", 0),
        g("content-zoom-limit", "400% 100%", 0),
        g("accelerator", 0, 0),
        g("initial-letter", "normal", 0),
        // g("order", 0, 0),
        g("text-kashida-space", "0%", true, "<percentage>"),
        g("interpolation-mode", "none", 0),
        g("progress-appearance", "bar", 0),
        g("content-zooming", "auto", 0),
        g("flow-from", "none", 0),
        g("flow-into", "none", 0),
        g("content-zoom-chaining", "none", 0),
        g("high-contrast-adjust", "auto", true),
        g("ime-mode", "auto", 0),
        g("overflow-style", "auto", true),
        g("touch-select", "grippers", true),
        g("behaviour", "url()", 0, "<url>"),
        g("interactivity", "auto", true),
        g("input-security", "auto", 0),
        g("caret-animation", "auto", true),
        g("wrap-through", "wrap", 0),
        g("print-color-adjust", "economy", true),
        g("cursor-visibility", "auto", true),
        g("pay-button-style", "white", 0),
        g("color-filter", "none", true),
        g("pay-button-type", "plain", 0),
        g("visual-effect", "none", true),
        // g("text-wrap-style", "auto", true),
        g("text-spacing-trim", "normal", true),
        g("text-group-align", "none", 0),
        g("text-autospace", "normal", true),
        g("orient", 'inline', 0,),
        // g("scrollbar-color", "auto", true),
        // g("scrollbar-gutter", "auto", 0),
        // g("scrollbar-width", "auto", 0),
        g("ruby-overhang", "auto", true),
        g("max-lines", "none", 0),
        g("line-fit-edge", "leading", true),
        g("continue", "auto", 0),
        g("dashboard-region", "none", 0),
        g("overflow-scrolling", "auto", 0),
        g("column-axis", "auto", 0),
        g('column-progression', 'auto', 0),
        g('content-visibility', 'visible', 0),  // This is a special case in order to support browsers without 'ContentVisibilityAutoStateChangeEvent'
        g('text-size-adjust', 'auto', true)
        // g('marquee-style','scroll',0)
    ])
}
