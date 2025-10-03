import'./css.js'

let sym = Symbol.for('[[CSSModule]]')
export let { dashVendor,
    capVendor,
    all,
    has,
    badCSS,
    vendor,
    importFont,
    toCaps,
    toDash,
    toCSS,
    registerCSS,
    registerCSSRaw,
    formatStr,
    importCSS,
    getDefaultStyleSheet,
    reducedMotion,
    registerCSSAll,
    supportsRule,
    pcv,
    supportedPClassVendor,
    pev,
    supportedPElementVendor,
    dropShadow,
    boxShadow } = window[sym]
// delete window[sym]