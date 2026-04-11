//# allFunctionsCalledOnLoad
//console.time('css.js');
//@dev self.css = 
(function CSSSetup(inModule, sym, defer, D, O, id, y, /*rAF,*/ ads) {
    //@dev'use strict'
    var newish = !!ads
    if (y.propertyIsEnumerable(sym) && newish ? ads.find(function (o) { return o[id] }) : D.getElementById(id) instanceof HTMLStyleElement) {
        var out = y[sym]
        inModule && (inModule = out.onerror) && (removeEventListener('error', inModule), out.onerror = null)
        return out
    }
    try { var S = sessionStorage } // it just throws on read if storage is denied
    catch (e) { //@devconsole.warn(e) 
    }
    if (!inModule) {
        var onerror = function (e) { if (e.filename.endsWith('.js')) { [].forEach.call(D.querySelectorAll('script[nomodule]'), function (s) { D.head.appendChild(D.createElement('script')).src = s.src }); removeEventListener('error', onerror) } }
        addEventListener('error', onerror)
    }
    var sup = CSS.supports,
        imp = /\s*!\s*important\s*$/,
        selCache = new Map,
        isSimple = /^[^)(:]+$/,
        where = sel(':where(p)', true),
        sn,
        atProperty = typeof CSSPropertyRule === 'function'
        // , canWrite = !inModule && D.readyState !== 'complete'
        , func = CSS.registerProperty || function (a) {
            (a.inherits ? uv : root)[a.name] = a.initialValue
            // i didn't know CSS --properties were so old,
            // i just assumed they were as old as registerProperty and @property...
        }
    dance: {
        try {
            if (!typeof scrollMaxX !== 'number' || !S) {
                // sessionStorage seems to be faster on FireFox 
                var o = top.name
                    , starts = o.startsWith(id)
                if (starts || !o) {
                    if (!starts) sn = Reflect.set.bind(1, top, 'name')
                    var name = o // name is free to use
                    break dance
                }
            }
        }
        catch (e) {
            // cross origin frame so we can't use window.top
            //@devconsole.warn(e)
            if (!S) {
                sn = String // we can't cache
                break dance
            }
        }
        if (S) {
            sn = S.setItem.bind(S, '_')
            name = S._
        }
        else sn = String
    }
    var fro = O.fromEntries,
        is = Array.isArray,
        // lastText = '',
        as = null,
        alr = new Set,
        vendr = /^(?:-(?:webkit|moz(?:-osx)?|apple|khtml|konq|r?o|ms|xv|atsc|wap|ah|hp|rim|tc|fso|icab|epub)|prince|mso)-(?!$)/i,
        dr = new Map,
        pseudoClass = /(?:[^:]|^):([\w-]+)/g,  // (?<=(?:^|[^:]):)[\w-]+/g
        pseudoElement = /::([\w-]+)/g,  // (?<=::)[\w-]+
        dash = /-./g,
        azregex = /[A-Z]/g,
        Rm,
        br = ['epub', 'icab', 'fso', 'tc', 'rim', 'hp', 'ah', 'wap', 'atsc', 'xv', 'ms', 'o', 'ro', 'konq', 'khtml', 'apple', 'moz', 'moz-osx', 'webkit']
        , fClass = fgeneric.bind(1, ':', pseudoClass),
        fElement = fgeneric.bind(1, '::', pseudoElement)
        //, batch = ''
        , t = Sheet()
    function dv(prop, val) {
        return vendor(toDash(prop), val)
    }
    function cv(prop, val) { return toCaps(dv(prop, val)) }
    function badCSS(data, _) {
        if (alr.has(data) || _) return
        //@devconsole.warn(data)
        alr.add(data)
    }
    function vs(selector, type) {
        type = String(type || ':')
        var a = selector
            , og = selector = selector.replace(vendr, '')
            , i = br.length,
            s
        if (type === ':') switch (selector) {
            case 'any':
            case 'matches':
                if (sel(':is(p)', true)) return 'is'
                break
            case 'is':
                for (var i = 2, hi, x = 'any'; i--; x = 'matches')
                    if (sel(hi = vs(':' + x + '(p)', ':'), true)) return hi.replace(pseudoClass, '$1')
        }
        while ((s = !sel(type + selector, true)) && i--)
            selector = '-' + br[i] + '-' + og
        return s ? a : selector
    }
    function fgeneric(d, pseudo, selector) {
        if (sel(selector, true)) return selector
        var matches = selector.match(pseudo)
        if (matches) for (var i = 0, l = matches.length; i < l; ++i) {
            var match = matches[i].replace(pseudo, '$1')
            selector = selector.replace(match, vs(match, d))
        }
        return selector
    }
    function fSelector(s) {
        return fClass(fElement(s))
    }
    function b(p, v) {
        return '(' + p + ':' + v + ')'
    }
    function find(p, v) {
        for (var i = br.length, o; i--;) {
            var prefix = br[i]
            prefix !== 'mso' && prefix !== 'prince' && (prefix = '-' + prefix)
            if (sup(b(o = prefix + '-' + p, v))) return o
        }
        return ''
    }
    function vendor(p, v, _) {
        if (p.startsWith('--'))
            return p
        if (v.trim() && !sup(p + ':' + v)) {
            var important = imp.test(v) ? ' !important' : ''
            v = v.replace(imp, '')
            var a = p = p
                .replace(vendr, '')
            return dr.has(p) ? dr.get(p) : find(p, v) || (
                badCSS("Unrecognized CSS at '" + b(a = p, v + important).slice(1, -1) + "'", _),
                dr.set(p, a),
                // Sorry!
                a)
        }
        return p
    }
    function toCaps(prop) {
        return prop.includes('-') && prop.startsWith('--') ? prop : (prop[0] === '-' ? prop.substring(1) : prop).replace(dash, tuc)
    }
    function toDash(prop) {
        return prop.startsWith('--') ? prop :
            prop.replace(azregex, tlc)
    }
    function tlc(o) {
        return '-' + o.toLowerCase()
    }
    function tuc(c) {
        return c[1].toUpperCase()
    }
    /**
     * @param {Object} o key/value pairs that match CSS
     * @returns {String}
     */
    function toCSS(o, _) {
        var str = '', v, p
        is(o) && (o = fro(o))
        for (p in o) {
            v = String(o[p])
            p === 'content' && !sup('content', v) && (v = '"' + v + '"')
            str += vendor(toDash(p), v, _) + ':' + v + ';'
        }
        return str
    }
    /**
     *  #### Should only be used for dynamic/default CSS
     * @param {String} selector A valid CSS selector (something like . or#)
     * @param {Object} rule An object which describes the selector
     */
    function registerCSS(selector, rule, _) {
        var str = '', i = (selector = selector.split(',')).length
        while (i--) str = fSelector(selector[i]) + str
        insertRule(str + "{" + toCSS(rule, _) + "}")
        return insertRule
    }
    function createSheet(text) {
        var m = new CSSStyleSheet
        Object.defineProperty(m, id, { value: true })
        text && m.replaceSync(text)
        D.adoptedStyleSheets = [].concat.call(ads, m)
        return m
    }
    function Sheet() {
        if (newish) 
            return as = o = as || createSheet()
        else {
            var o = D.getElementById(id)
            if (o) return o
            // if (canWrite) return D.write('<style id="'+id+'" blocking="render">'+str+'</style>'), Sheet()
            // ^ this branch is slower
            o = D.createElement('style')
            o.id = id
            o.blocking = 'render'
            var p = D.head || D.body || D.documentElement || ((p = D.currentScript) && (p.parentNode || p)) || D.querySelector('*') || D.firstElementChild || D
            p.appendChild(o)
            return o
        }
    }
    function registerCSSAll(rules) {
        for (var i in rules)
            registerCSS(i, rules[i])
    }
    function sel(rule, doCache) {
        if (isSimple.test(rule)) return true
        if (doCache) var c, cache = selCache.get(rule) || (selCache.set(rule, c = sel(rule, false)), c)
        return !!cache || sup("selector(" + rule + ")")
    }
    var bulkText = ''
    function re(name, iv, inh, sx) {
        return '@property ' + name + '{syntax:"' + sx + '";inherits:' + inh + ';initial-value:' + iv + '}'
    }
    function g(name, iv, inh, sx) {
        var o = '--' + name,
            key = vendor(name, o = 'var(' + o + ')', true)
        uv[key] = o
        bulkText += re('--' + name, iv, inh, sx)
        return g
    }
    function W(s) {
        return ':where(' + s + ')'
    }
    where || (W = String)
    var uv = {
        'font-family': 'inherit',
        'overflow-wrap': 'var(--word-wrap)',
        'scrollbar-color': 'var(--scrollbar-thumb-color) var(--scrollbar-color)',
        'scrollbar-width': 'var(--scrollbar-width)',
        'motion-distance': 'var(--offset-distance)',
        'motion-rotate': 'var(--offset-rotate)',
        'motion-path': 'var(--offset-path)'
    }
    function lowPriority() {
        //@dev console.time('low priority')
        g("locale", "auto", false, "*")("user-modify", "auto", true, "*")("line-grid", "auto", false, "*")("line-snap", "auto", false, "*")("nbsp-mode", "auto", false, "*")("text-zoom", "auto", true, "*")("line-align", "auto", false, "*")("text-decorations-in-effect", "auto", true, "*")("force-broken-image-icon", "0", true, "<integer>")("float-edge", "content-box", true, "*")("image-region", "auto", false, "*")("box-orient", "inline-axis", true, "*")("box-align", "stretch", true, "*")("box-direction", "normal", true, "*")("box-flex", "0", true, "*")("box-flex-group", "0", true, "*")("box-lines", "single", true, "*")("box-ordinal-group", "1", true, "*")("box-decoration-break", "slice", true, "*")("box-pack", "start", true, "*")("line-clamp", "none", true, "*")("font-smoothing", "auto", false, "*")("mask-position-x", "0%", true, "<length-percentage>")("mask-position-y", "0%", true, "<length-percentage>")("window-dragging", "auto", true, "*")("stack-sizing", "stretch-to-fit", false, "*")("mask-composite", "source-over", true, "*")("window-shadow", "auto", true, "*")("outline-radius", "0 0 0 0", true, "*")("binding", "none", true, "*")("text-blink", "none", true, "*")("image-rect", "auto", false, "*")("context-properties", "none", false, "*")("text-kashida-space", "0%", false, "<percentage>")("interpolation-mode", "none", true, "*")("progress-appearance", "bar", true, "*")("flow-from", "none", true, "*")("flow-into", "none", true, "*")("high-contrast-adjust", "auto", false, "*")("ime-mode", "auto", true, "*")("wrap-through", "wrap", true, "*")("print-color-adjust", "economy", false, "*")("pay-button-style", "white", true, "*")("color-filter", "none", false, "*")("pay-button-type", "plain", true, "*")("visual-effect", "none", false, "*")("text-spacing-trim", "normal", false, "*")("text-group-align", "none", true, "*")("text-autospace", "normal", false, "*")("orient", "inline", true, "*")("ruby-overhang", "auto", false, "*")("max-lines", "none", true, "*")("line-fit-edge", "leading", false, "*")("overflow-scrolling", "auto", true, "*")("column-progression", "auto", true, "*")("dashboard-region", "none", true, "*")("column-axis", "auto", true, "*")("text-size-adjust", "auto", false, "*")("border-vertical-spacing", "auto", true, "*")("buffered-rendering", "auto", true, "*")
        //@dev console.timeEnd('low priority')
    }
    function properties() {
        //@dev console.time('properties')
        g("user-select", "auto", false, '*') // Most important one
            ("zoom", "auto", false, '*')
            ('user-drag', "auto", true, '*')
            ('offset-path', "none", false, '*')
            ('offset-distance', '0', false, '<length-percentage>')
            ('offset-rotate', 'auto', false, "auto | <angle> | reverse")
            // ("user-input", "auto", true, '*')
            ("box-reflect", "none", false, '*') // Kewl
            ("text-stroke-color", "currentcolor", true, "<color>")
            ("text-stroke-width", '0', false, "<length>")
            ("text-security", "none", false, '*')
            ("text-fill-color", "currentcolor", true, '*')
            ("tap-highlight-color", "rgb(0, 0, 0, 0.18)", true, "<color>")
            ("touch-callout", "auto", true, '*')
            // ("user-focus", "none", false, '*')
            ("initial-letter", "normal", false, '*')
            ("overflow-style", "auto", true, '*')
            // ("interactivity", "auto", true, '*')
            ("input-security", "auto", false, '*')
            ("caret-animation", "auto", true, '*')
            ("cursor-visibility", "auto", true, '*')
            ("continue", "auto", false, '*')
            ('content-visibility', 'visible', false, '*')
            // ^ This is a special case just to support older browsers without 'ContentVisibilityAutoStateChangeEvent'
            ('max-logical-height', 'none', false, '*')
            ('min-logical-height', 'none', false, '*')
            ('max-logical-width', 'none', false, '*')
            ('min-logical-width', 'none', false, '*')
            ('color-rendering', 'auto', false, '*')
            ('word-wrap', 'normal', false, '*')
        //@dev console.timeEnd('properties')
    }
    var diffName =
        [
            [/^offset(-(?:distance|rotate|path))?$/i, 'motion$1'],
            [/^-webkit-((?:max|min)-)?logical-width$/i, '$1inline-size'],
            [/^-webkit-((?:max|min)-)?logical-height$/i, '$1block-size'],
            [/^-webkit-mask-box-image(-\w+)?$/i, 'mask-border$1'],
            [/^grid-((?:row|column)-)?gap$/i, '$1gap'],
            // [/^float$/, 'cssFloat'],
            [/^overflow-wrap$/i, 'word-wrap'],
            [/^word-wrap$/i, 'overflow-wrap'],
            [/^(text-combine)-upright$/i, '-webkit-$1'],
            [/^print-(color-adjust)$/i, '$1']
        ]
    function correctProp(prop, value) {
        if (prop.startsWith('--')) return [prop]
        var out = []
        prop = prop.toLowerCase()
        if (sup((prop = dv(prop, value)) + ':' + value)) out.push(prop)
        for (var i = diffName.length; i--;) {
            var set = diffName[i]
                , r = set[0]
                , str = set[1]
            r.test(prop) && out.push(prop.replace(r, str))
        }
        return out.length ? out : [prop]
    }
    function doRegister() {
        re = function (name, iv, inh, sx) {
            reuse.name = name
            reuse.initialValue = iv
            reuse.inherits = inh
            reuse.syntax = sx
            func(reuse)
        }
        var reuse = {
            name: '',
            initialValue: '',
            inherits: false,
            syntax: ''
        }
        defer(lowPriority)
        properties()
    }
    var crisp, stretch, center, matchParent
        , newName = name
    if (!atProperty && CSS.registerProperty) doRegister()
    if (!newName) {
        var align = sup.bind(1, 'text-align')
        crisp = 'pixelated -moz-crisp-edges -webkit-optimize-contrast'.split(' ').find(sup.bind(1, 'image-rendering')) || 'initial'
        stretch = '-webkit-fill-available stretch -moz-available'.split(' ').find(sup.bind(1, 'max-width')) || 'initial'
        center = '-moz-center -webkit-center -khtml-center'.split(' ').find(align) || 'initial'
        matchParent = 'match-parent -moz-match-parent -webkit-match-parent'.split(' ').find(align) || 'initial'
        var o = {
            'summary::marker': { cursor: 'pointer' },
            ':root': {
                // 'transition-behavior': 'allow-discrete',
                // 'interpolate-size': 'allow-keywords',
                '--crisp-edges': crisp,
                '--system-font': "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
                '--stretch': stretch
            }
        }
        o[W("input[type=date]")] = { cursor: 'text' }
        o[W("button,a,[role=radio],[role=button],[role=tab],[role=combobox],[role=switch],input[type=button],input[type=checkbox],input[type=radio],input[type=submit],input[type=image],input[type=reset],input[type=file],[tabindex=1]")] = { cursor: 'pointer' }
        o[W('[aria-busy=true]')] = { cursor: 'progress' }
        o[W('[draggable=false]')] = { '--user-drag': 'none' }
        o[W('[draggable=true]')] = { '--user-drag': 'element' }
        o[W('[contenteditable],[contenteditable=true]')] = { '--user-modify': 'read-write' }
        o[W('[contenteditable=false]')] = { '--user-modify': 'read-only', '--user-input': 'none' }
        o[W('[contenteditable="plaintext-only"]')] = { '--user-modify': 'read-write-plaintext-only' }
        o[W('[inert]')] = { 'interactivity': 'inert' }
        o[W('input[type=range]') + ',::-webkit-scrollbar-thumb'] = { cursor: 'grab' }
        o[W('input[type=range]:active') + ',::-webkit-scrollbar-thumb:active'] = { cursor: 'grabbing' }
        o[W(':disabled,[aria-disabled=true]')] = { cursor: 'not-allowed' }
        /**@deprecated*/o[W('.centerx,.center')] = { 'justify-self': 'center', margin: 'auto', 'text-align': 'center' }
        /**@deprecated*/o[W('.centery,.center')] = { 'align-self': 'center', inset: 0, position: 'fixed' }
        o[W('.center_block')] = { display: 'block', 'margin-left': 'auto', 'margin-right': 'auto' }
        o[W('.center_inline')] = { display: 'inline-block', 'text-align': 'center' }
        o[W('.center_absolute,.center_screen')] = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        o[W('.center_screen')] = { position: 'fixed', 'z-index': 9999 }
        o[W('.center_absolute,.center_absolute_x,.center_absolute_y')] = { position: 'absolute' }
        o[W('.center_flex_x,.center_flex')] = { display: 'flex', 'justify-content': 'center' }
        o[W('.center_flex_y,.center_flex')] = { display: 'flex', 'align-items': 'center' }
        o[W('.center_grid_x')] = { display: 'grid', 'place-items': 'center start' }
        o[W('.center_grid_y')] = { display: 'grid', 'place-items': 'start center' }
        o[W('.center_absolute_x')] = { left: '50%', transform: 'translateX(-50%)' }
        o[W('.center_absolute_y')] = { top: '50%', transform: 'translateY(-50%)' }
        o[W('img')] = {
            'align-content': 'center',
            'text-align': 'center',
            '--force-broken-image-icon': 1,
            'max-inline-size': '100%', 'block-size': 'auto'
            //'object-fit': 'contain'
        } // https://web.dev/learn/design/responsive-images
        o[W('img,video,canvas,svg,picture')] = {
            'box-sizing': 'content-box'
        }
        o[W('h1')] = { 'margin-block': '.67em', 'font-size': '2em' }
        var root = o[':root']
        if (atProperty) {
            properties()
            lowPriority()
            newName = bulkText
        }
        else if (!CSS.registerProperty) doRegister()
        for (var x in o) newName += x + "{" + toCSS(o[x]) + "}"
        newName = "._needsjs{display:none !important}._webcomponent{display:none}@supports selector (:defined){._webcomponent{display:revert}}html{margin:auto}p{text-wrap:pretty}h1,h2,h3,h4,h5,h6,:where(p){text-wrap:balance;overflow-wrap:break-word}body{line-height:1.5;--font-smoothing:antialiased}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto !important}}@media(prefers-reduced-motion:no-preference){:root{interpolate-size: allow-keywords}}@media(prefers-reduced-transparency:reduce){*{opacity:1 !important;}}:-moz-loading{cursor:wait}:-moz-broken{border-radius:0}@supports not (content-visibility:auto){*{visibility:var(--content-visibility)}}@supports not (scrollbar-width:thin){::-webkit-scrollbar{width:var(--scrollbar-width);height:var(--scrollbar-width);background-color:var(--scrollbar-color)}::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb-color)}}" + newName
        //@dev console.debug(newName.replace(/:where\(([\S\s]*?)\)/g,'$1'))
    }
    var str = name
    // Selecting all pseudo elements has a massive performance hit, as expected
    str || sn(str = id + '*' + "{" + toCSS(uv, true) + "}" + newName)
    newish ? as.replaceSync(str) : (t.textContent = str, insertRule = function(n,i) {t.sheet.insertRule(n,i)})
    var css =  //@devObject.seal
        ({
            getDefaultStyleSheet: Sheet,
            // registerCSSRaw: registerCSSRaw,
            // write: registerCSSRaw,
            get reducedMotion() {
                return Rm || (Rm = matchMedia('(prefers-reduced-motion:reduce)'))
            },
            registerCSSAll: registerCSSAll,
            supportedPClassVendor: fClass,
            supportsRule: sel,
            registerCSS: registerCSS,
            dashVendor: dv,
            capVendor: cv,
            badCSS: badCSS,
            toCaps: toCaps,
            toDash: toDash,
            vendor: vendor,
            toCSS: toCSS,
            formatSelector: fSelector,
            onerror: onerror,
            correctProp: correctProp,
            insertRule: insertRule,
            createSheet: createSheet
        })
    y[sym] || O.defineProperty(y, sym, { value: css, enumerable: 1 })
    return css
    function insertRule(txt, i) {
            o.insertRule(txt, i)
    }
}(!this, Symbol.for('[[CSSModule]]'), (self.requestIdleCallback && function (c) { return requestIdleCallback(c, { timeout: 2000 }) }) || (self.scheduler && scheduler.postTask && function (c) { return scheduler.postTask(c, { priority: 'background' }) }) || self.queueMicrotask || self.setImmediate || setTimeout, document, Object, '/*stylesheet auto-generated by css.js*/', constructor.prototype,/*rAF omitted,*/document.adoptedStyleSheets))
// ; console.timeEnd('css.js')