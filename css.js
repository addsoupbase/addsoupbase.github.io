; (function (w, sym) {
    'use strict'
    if (sym in window || document.getElementById('addedStyleRules')) return w[sym]
    var createElement = document.createElement.bind(document)
        , WebComponents = 'img-sprite touch-joystick seek-bar paper-canvas'.split(' ')
    // var supportsAtRule
    /*!function () {
        var dummy = createElement('div'),
            id = `a${Date.now()}`
        dummy.setAttribute('id', id)
        addElement(dummy)
        w.CSS = {
            supports: function (propertyOrSelector, valueIfProperty) {
                if (valueIfProperty == null) {
                    var txt = `:not(${propertyOrSelector.slice(9,-1)}){content: ''}`
                    var old = sheet.textContent
                    registerCSSRaw(txt)
                    var out = getComputedStyle(dummy).content === '""'
                    // dummy.remove()
                    sheet.textContent = old
                    return out
                }
                var txt = `${propertyOrSelector}: ${valueIfProperty}`
                dummy.setAttribute('style',`${propertyOrSelector}: inherit; ${txt};`)
                var out = dummy.style.getPropertyValue(propertyOrSelector) !== 'inherit'
                debugger
                dummy.removeAttribute('style')
                return out
            }
        }
    }()*/
    var scr = document.currentScript,
        console = {}
    !function (c) {
        for (var i in c) {
            var val = c[i]
            typeof val === 'function' && (console[i] = val.bind(1, '%c@css.js', 'color:lightblue;'))
        }
    }(w.console)
    w.reportError = w.reportError || function reportError(throwable) {
        var evt = new ErrorEvent('error', {
            message: throwable.message,
            error: throwable,
            filename: scr && scr.src
        })
        w.dispatchEvent(evt)
        evt.defaultPrevented || console.error(`${throwable}`)
    }
    var sheet = getDefaultStyleSheet()
    function dashVendor(prop, val) {
        return vendor(toDash(prop), val)
    }
    function capVendor(prop, val) {
        return toCaps(vendor(toDash(prop), val))
    }
    var dflt = new Set
        , has = dflt.has.bind(dflt),
        add = dflt.add.bind(dflt)
    /*
    export function vendorValue(prop, val) {
        
        let without = val.replace(allVendors, '')
            .replace(allVendors2, '')
        switch (without) {
            case 'crisp-edges':
                sup(prop, val = '-webkit-optimize-contrast') ||
                    sup(prop, val = '-moz-crisp-edges') ||
                    sup(prop, val = without)
                break
            case 'stretch':
            case 'fill-available':
            case 'available':
                sup(prop, val = '-webkit-fill-available') ||
                    sup(prop, val = '-moz-available') ||
                    sup(prop, val = without)
                break
        }
        return val
    }
    */
    var alreadyLogged = new Set,
        alreadyHas = alreadyLogged.has.bind(alreadyLogged),
        // beenHereBefore = sessionStorage.getItem('css'),
        addAlr = alreadyLogged.add.bind(alreadyLogged),
        allVendors = /^(?:-(?:webkit|moz(?:-osx)?|apple|khtml|konq|r?o|ms|xv|atsc|wap|ah|hp|rim|tc|fso|icab|epub)|prince|mso)-/,
        dontRedo = new Map,
        sup = CSS.supports
    //  (that i have used before) ,
    // newerProps = /^(?:translate|scale|rotate|zoom)$/
    function badCSS(data, silent) {
        if (silent || alreadyHas(data)) return
        console.warn(data)
        addAlr(data)
    }

    function vendor(prop, val, silent) {
        if (prop.startsWith('--'))
            return prop
        if (val.trim() && !sup(prop, val)) {
            var prefix = prop = prop
                .replace(allVendors, '')
            return dontRedo.has(prop) ? dontRedo.get(prop) : ((
                sup(prefix, val) ||
                // Maybe you dont need a prefix?
                sup(prefix = `-webkit-${prop}`, val) ||
                // Most likely (Chrome, Safari)
                sup(prefix = `-moz-${prop}`, val) ||
                // Firefox
                sup(prefix = `-moz-osx-${prop}`, val) ||
                // Firefox
                sup(prefix = `-apple-${prop}`, val) ||
                // Apple
                sup(prefix = `-o-${prop}`, val) ||
                // Opera
                sup(prefix = `-ms-${prop}`, val) ||
                // Microsoft
                sup(prefix = `-khtml-${prop}`, val) ||
                // Konqueror
                sup(prefix = `-konq-${prop}`, val) ||
                // Konqueror
                sup(prefix = `mso-${prop}`, val) ||
                // Microsoft Office
                sup(prefix = `-xv-${prop}`, val) ||
                // Opera
                sup(prefix = `-atsc-${prop}`, val) ||
                // Advanced Television Standards Committee
                sup(prefix = `-wap-${prop}`, val) ||
                // The WAP Forum
                sup(prefix = `prince-${prop}`, val) ||
                // YesLogic
                sup(prefix = `-ah-${prop}`, val) ||
                // Antenna House
                sup(prefix = `-hp-${prop}`, val) ||
                // Hewlett Packard
                sup(prefix = `-ro-${prop}`, val) ||
                // Real Objects
                sup(prefix = `-rim-${prop}`, val) ||
                // Research In Motion
                sup(prefix = `-tc-${prop}`, val) ||
                // Tall Components
                sup(prefix = `-fso-${prop}`, val) ||
                // IDK
                sup(prefix = `-icab-${prop}`, val) ||
                // IDK
                sup(prefix = `-epub-${prop}`, val) ||
                // IDK
                // sup(prefix = `-internal-${prop}`, val) ||
                badCSS(`Unrecognized CSS at '${prefix = prop}: ${val}'`, silent)),
                // mayNotBeSupported(prop),
                dontRedo.set(prop, prefix),
                // Sorry!
                prefix)
        }
        return prop
    }

    // function mayNotBeSupported(prop) {
    // newerProps.test(prop) && badCSS(`💿 '${prop}' may not be supported on older devices`)
    // }

    function importFont(name, src) {
        if (name && src) {
            var font = new FontFace(name, `url(${src})`)
            font.load().then(document.fonts.add, console.warn)
            return font
        }
        throw Error('Source and name required')
    }

    var hi = /-./g,
        azregex = /[A-Z]/g

    function toCaps(prop) {
        return prop.includes('-') && !prop.startsWith('--') ? (prop[0] === '-' ? prop.slice(1) : prop).replace(hi, tuc) : prop
    }
    function toDash(prop) {
        return prop.startsWith('--') ? prop :
            prop.replace(azregex, tlc)
    }

    function tlc(o) {
        return `-${o.toLowerCase()}`
    }

    function tuc(c) {
        return c[1].toUpperCase()
    }


    /**
     * @param {Object} obj key/value pairs that match CSS
     * @returns {String}
     */
    function toCSS(obj, silent) {
        var arr = [],
            push = [].push.bind(arr)
        Array.isArray(obj) && (obj = Object.fromEntries(obj))
        for (var prop in obj) {
            var p = `${obj[prop]}`
            try {
                push(`${vendor(toDash(prop), p, silent)}:${p}`)
            } catch (_) {
                reportError(_)
            }
        }
        return arr.join(';')
    }

    var pseudoElementRegex = / /.test.bind(/::[\w-]/)
        , pseudoClassRegex = / /.test.bind(/:[\w-]/)

    function mapThing(selectr) {
        return pseudoElementRegex(selectr) ? pev(selectr) : pseudoClassRegex(selectr) ? pcv(selectr) : selectr
    }

    /**
     *  ⚠️ Should only be used for dynamic/default CSS
     * @param {String} selector A valid CSS selector (something like . or#)
     * @param {Object} rule An object which describes the selector
     */
    function registerCSS(selector, rule, silent) {
        selector = selector.split(',')
            .map(mapThing)
            .join(',')
        var r = `{${toCSS(rule, silent)}}`
        sheet.textContent = `${sheet.textContent}${formatStr(selector)}${formatStr(r)}`
        return sheet
    }
    /**
     * @param {String} rule The rule(s)
     */
    function registerCSSRaw(rules) {
        sheet.textContent = `${sheet.textContent}${rules}`
        return sheet
    }
    var cleanRegex = /(\s|\n)\1/g

    function formatStr(str) {
        return str.trim().replace(cleanRegex, '')
    }
    function importCSS(url) {
        // idk why i didn't just think of this
        var n = createElement('link'),
            s = n.setAttribute.bind(n)
        s('rel', 'stylesheet')
        s('fetchpriority', 'high')
        s('blocking', 'render')
        s('href', url)
        addElement(n)
        return n
    }
    /*= function(){
    return withImport
    async function withFetch(source) {
        let res = await(await fetch(new URL(source,location))).text(),
            sheet = getDefaultStyleSheet()
        sheet.textContent = `${sheet.textContent}${res}`
    }
    
    function withImport(source) {
        try {
        return(importCSS = async function(){}.constructor(`"use strict";function map(o){return o.cssText}let a = (await import(new URL(src,location), {with:{type:"css"},assert:{type:"css"}})).default
        this.textContent+=[].map.call(a.cssRules||a.rules, map)
        `,'src').bind(getDefaultStyleSheet()))(source)
        }
        catch(e) {
            if (e.name === 'SyntaxError' || e.name === 'EvalError')
                return(importCSS = withFetch)(source)
            else throw e
        }
    }
    }()*/
    function getDefaultStyleSheet() {
        return (sheet || document.getElementById('addedStyleRules') || function () {
            var out = createElement('style')
            requestAnimationFrame(addElement.bind(0, out))
            // addElement(out)
            out.setAttribute('id', 'addedStyleRules')
            /* if (supportsAtRule == null) {
                 out.textContent = `@property --test {syntax: "<color>"; initial-value: red; inherits: false;}`
                 supportsAtRule = !!(out.sheet.cssRules || out.sheet.rules).length
                 out.textContent = ''
             }*/
            out.textContent = top.name || `@namespace svg url("http://www.w3.org/2000/svg");${WebComponents.map(function (o) { return `${o}:not(:defined)::after {content: "Web Component not loaded: ${o}"; font-family: monospace; background-color:white;}` }).join('')}@media (prefers-reduced-transparency: reduce){*{opacity:1 !important;}}:root{--system-font: system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif}@supports not (content-visibility: auto){*{visibility: var(--content-visibility)}}@supports not (scrollbar-color: auto){::-webkit-scrollbar{width:var(--scrollbar-width);background-color: var(--scrollbar-color)}::-webkit-scrollbar-thumb{background-color: var(--scrollbar-thumb-color)}}`
            return out
        }())
    }
    function getWhateverNode() {
        return document.head || document.body || document.documentElement || document.getElementsByTagName('*')[0] || document
    }
    function addElement(el) {
        getWhateverNode().appendChild(el)
    }
    var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    function registerCSSAll(rules) {
        Object.keys(rules).forEach(reg, rules)
    }
    function reg(r) {
        try {
            registerCSS(r, this[r])
        } catch (_) {
            reportError(_)
        }
    }
    function supportsRule(rule) {
        return sup(`selector(${rule})`)
    }

    var theNames = `${allVendors}`.match(/\w+/g).reverse().slice(2)
        , pcv = supportedPClassVendor
    function supportedPClassVendor(className) {
        // try {
        var a = className.split(':')
            , before = a[0],
            _class = a[1],
            already = _class
        _class = _class.replace(allVendors, '')
        if (supportsRule(already = `${before}:${already}`)) return already
        for (var i = theNames.length; i--;) {
            var vendor = theNames[i]
                , name = `:-${vendor}-${_class}`
            if (supportsRule(name)) return `${before}${name}`
        }
        if (supportsRule(className = `:prince-${_class}`) ||
            supportsRule(className = `:mso-${_class}`)) return `${before}${className}`
        return `${before}:${_class}`
        // } catch (_) {
        // throw SyntaxError(`Failed to parse '${className}'`)
        // }
    }

    var pev = supportedPElementVendor

    function supportedPElementVendor(element) {
        // try {
        var a = element.split('::'),
            before = a[0],
            _element = a[1],
            already = _element
        _element = _element.replace(allVendors, '')
        if (supportsRule(already = `${before}::${already}`)) return already
        for (var i = theNames.length; i--;) {
            var vendor = theNames[i]
                , name = `::-${vendor}-${_element}`
            if (supportsRule(name)) return `${before}${name}`
        }
        if (supportsRule(element = `::prince-${_element}`) ||
            supportsRule(element = `::mso-${_element}`)) return `${before}${element}`
        return `${before}::${_element}`
        // } catch (_) {
        // throw SyntaxError(`Failed to parse '${element}'`)
        // }
    }

    /*
    function dropShadow(args) {
        var color = args.color,
        offsetX = args.offsetX,
        offsetY = args.offsetY,
        standardDeviation = args.standardDeviation
        return `${color || '#000000'} ${offsetX || '0px'} ${offsetY || '0px'} ${standardDeviation || ''}`
    }
*/
    /*function boxShadow({
        offsetX = '0px',
        offsetY = '0px',
        blurRadius = '',
        spreadRadius = '',
        color = '#000000'
    }) {
        return `${color} ${offsetX} ${offsetY} ${blurRadius} ${spreadRadius}`.replaceAll('  ', '')
    }*/
    !function () {
        function g(name, initialValue, inherits, syntax) {
            initialValue = initialValue == null ? 'auto' : initialValue
            inherits = inherits == null ? false : !!initialValue
            syntax = syntax == null ? '*' : syntax
            add(name)
            return { name: `--${name}`, initialValue: initialValue, inherits: inherits, syntax: syntax }
        }
        var all = [
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
            g("orient", 'inline', 0),
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
            g('content-visibility', 'visible', 0),
            // ^ This is a special case just to support older browsers without 'ContentVisibilityAutoStateChangeEvent'
            g('text-size-adjust', 'auto', true),
            g('border-vertical-spacing', 'auto', false),
            g('max-logical-height', 'none', false),
            g('min-logical-height', 'none', false),
            g('max-logical-width', 'none', false),
            g('min-logical-width', 'none', false),
            // g('logical-height','revert',false,'*'),
            // g('logical-width','revert',false,'*'),
            g('buffered-rendering', 'auto', false),
            g('color-rendering', 'auto', false),
            g('word-wrap', 'normal', false),
            // g('scrollbar-color', 'auto', true),
            // g('scrollbar-width', 'auto', true),
        ]
        // g('crisp-edges', '-webkit-optimize-contrast -moz-crisp-edges'.split(' ').find(o => sup('image-rendering', o)), true, "*")
        // g('stretch', '-moz-available -webkit-fill-available stretch'.split(' ').find(o => sup('width', o)), false, '*')
        // g('marquee-style','scroll',0)
        //    Some default CSS...
        // try {
        function where(selector) {
            return `:where(${selector})`
        }
        var t = top.name
        sup('selector(:where(p))') || (where = function (o) { return o })
        var dflt = t.trim() ? t : Object.entries({
            [`${where(`button,a,${'button checkbox radio submit image reset file'.split(' ').map(function (o) { return `input[type=${o}]` }).join(',')}`)}`]: {
                cursor: 'pointer'
            },
            [`${where('[aria-busy="true"]')}`]: {
                cursor: 'progress'
            },
            [`${where('[draggable="false"]')}`]: {
                '--user-drag': 'none'
            },
            [`${where('[draggable="true"]')}`]: {
                '--user-drag': 'element'
            },
            [`${where('[contenteditable],[contenteditable="true"]')}`]: {
                '--user-modify': 'read-write'
            },
            [`${where('[contenteditable="false"]')}`]: {
                '--user-modify': 'read-only',
                '--user-input': 'none'
            },
            [`${where('[contenteditable="plaintext-only"]')}`]: {
                '--user-modify': 'read-write-plaintext-only'
            },
            [`${where('[inert]')}`]: {
                '--interactivity': 'inert',
            },
            ':root': {
                'interpolate-size': 'allow-keywords',
                '--crisp-edges': '-webkit-optimize-contrast -moz-crisp-edges'.split(' ').find(function (o) { return sup('image-rendering', o) }),
                '--stretch': '-moz-available -webkit-fill-available stretch'.split(' ').find(function (o) { return sup('max-width', o) }),
                '--center': '-moz-center -webkit-center -khtml-center'.split(' ').find(function (o) { return sup('text-align', o) }),
                // this is different from just 'center' and idk why!!!
                '--match-parent': '-moz-match-parent -webkit-match-parent'.split(' ').find(function (o) { return sup('text-align', o) })
            },
            [`${where('img')}`]: {
                '--force-broken-image-icon': 1,
            },
            [`${where('input[type=range]')}`]: {
                cursor: 'grab'
            },
            [`${where('input[type=range]:active')}`]: {
                cursor: 'grabbing'
            },
            [`${where(':disabled,[aria-disabled="true"]')}`]: {
                cursor: 'not-allowed'
            },
            [`${where('.centerx,.center')}`]: {
                'justify-self': 'center',
                margin: 'auto',
                'text-align': 'center'
            },
            /* 'img[src]': {
                 '--content-visibility': 'auto'
             },*/
            /*   [`img${pcv(':broken')},img${pcv(':suppressed')}`]: {
                   '--content-visibility': 'visible',
                   '--force-broken-image-icon': '1',
                   content: 'attr(title)'
               },
               'img:loading': {
                   '--content-visibility': 'visible',
                   cursor: 'wait',
                   content: 'attr(alt)'
               },*/
            [`${where('.centery,.center')}`]: {
                'align-self': 'center',
                inset: 0,
                position: 'fixed'
            }
        }).map(function (a) { return `${a[0]}{${toCSS(a[1])}}` })
        // typeof dflt === 'string' && (dflt = dflt.split('\n'))
        var join = [].join.bind(dflt)
            , first = sheet.textContent
            , global = join('')
            // } catch (e) {
            // console.error(e)
            // }
            /* function registerWithText(e) {
                 var name = e.name,
                     initialValue = e.initialValue,
                     inherit = e.inherits,
                     syntax = e.syntax,
                     text = `@property ${name}{${initialValue != null ? `initial-value:${initialValue};` : ''}${inherit != null ? `inherits:${!!inherit};` : ''}${syntax != null ? `syntax:"${syntax}"` : ''}}`
                 sheet.textContent = `${sheet.textContent}${text}`
             }*/
            , universal = {}
            , func, selector = '*,:where(::-moz-color-swatch,::-moz-focus-inner,::-moz-list-bullet,::-moz-list-number,::-moz-meter-bar,::-moz-progress-bar,::-moz-range-progress,::-moz-range-thumb,::-moz-range-track,::-webkit-inner-spin-button,::-webkit-meter-bar,::-webkit-meter-even-less-good-value,::-webkit-meter-inner-element,::-webkit-meter-optimum-value,::-webkit-meter-suboptimum-value,::-webkit-progress-bar,::-webkit-progress-inner-element,::-webkit-progress-value,::-webkit-scrollbar,::-webkit-search-cancel-button,::-webkit-search-results-button,::-webkit-slider-runnable-track,::-webkit-slider-thumb,::after,::backdrop,::before,::checkmark,::column,::cue,::details-content,::file-selector-button,::first-letter,::first-line,::grammar-error,::marker,::picker-icon,::placeholder,::scroll-marker,::scroll-marker-group,::selection,::spelling-error,::target-text,::view-transition)'
        func = CSS.registerProperty || console.debug
        for (var i = all.length; i--;) {
            var prop = all[i]
                , o = prop.name
            universal[vendor(o.slice(2), o = `var(${o})`, true)] = o
            try { func(prop) }
            catch (e) {
                e.name === 'InvalidModificationError' || (console.log(o), reportError(e))
            }
        }
        try {
            func({ name: '--scrollbar-thumb-color', initialValue: 'auto', inherits: true, })
            func({ name: '--scrollbar-color', initialValue: 'auto', inherits: true, })
        }
        catch (e) {
            reportError(e)
        }
        universal['box-sizing'] = 'border-box'
        universal['overflow-wrap'] = 'var(--word-wrap)'
        universal['scrollbar-color'] = 'var(--scrollbar-thumb-color) var(--scrollbar-color)'
        // universal['font-family'] = 'inherit'
        all = null
        t ?
            sheet.textContent = t :

            sheet.textContent = top.name = `${first}${selector}{${toCSS(universal, true)}}${global}`

        // console.debug(x)
    }()
    w[sym] = Object.seal({
        // [Symbol.toStringTag]: 'Module',
        __proto__: null,
        dashVendor: dashVendor,
        capVendor: capVendor,
        all: dflt,
        has,
        badCSS: badCSS,
        vendor: vendor,
        importFont: importFont,
        toCaps: toCaps,
        toDash: toDash,
        toCSS: toCSS,
        registerCSS: registerCSS,
        registerCSSRaw: registerCSSRaw,
        formatStr: formatStr,
        importCSS: importCSS,
        getDefaultStyleSheet: getDefaultStyleSheet,
        reducedMotion: reducedMotion,
        registerCSSAll: registerCSSAll,
        supportsRule: supportsRule,
        pcv: pcv,
        supportedPClassVendor: supportedPClassVendor,
        pev: pev,
        supportedPElementVendor: supportedPElementVendor,
        // dropShadow:dropShadow,
        // boxShadow,
        // [sym]: true
    })
}(window, Symbol.for('CSS')));