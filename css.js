//# allFunctionsCalledOnLoad
//console.time('css.js');
//@dev self.css = 
(function CSSSetup(inModule, w, sym, defer, D, O, id, y, rAF) {
    //@dev'use strict'
    if (y.propertyIsEnumerable(sym) && D.getElementById(id) instanceof HTMLStyleElement) {
        var out = y[sym]
        inModule && (inModule = out.onerror) && (removeEventListener('error', inModule), out.onerror = null)
        return out
    }
    try { var S = sessionStorage } // it just throws on read if storage is denied
    catch (e) { console.warn(e) }
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
            if (typeof scrollMaxX !== 'number' || !S) {
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
            console.warn(e)
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
        sheet = Sheet(),
        alr = new Set,
        vendr = /^(?:-(?:webkit|moz(?:-osx)?|apple|khtml|konq|r?o|ms|xv|atsc|wap|ah|hp|rim|tc|fso|icab|epub)|prince|mso)-(?!$)/,
        dr = new Map,
        pseudoClass = /(?:[^:]|^):([\w-]+)/g,  // (?<=(?:^|[^:]):)[\w-]+/g
        pseudoElement = /::([\w-]+)/g,  // (?<=::)[\w-]+
        dash = /-./g,
        azregex = /[A-Z]/g,
        Rm,
        br = ['epub', 'icab', 'fso', 'tc', 'rim', 'hp', 'ah', 'wap', 'atsc', 'xv', 'ms', 'o', 'ro', 'konq', 'khtml', 'apple', 'moz', 'moz-osx', 'webkit']
        , fClass = fgeneric.bind(1, ':', pseudoClass),
        fElement = fgeneric.bind(1, '::', pseudoElement),
        batch = ''
    function dv(prop, val) {
        return vendor(toDash(prop), val)
    }
    function cv(prop, val) { return toCaps(dv(prop, val)) }
    function badCSS(data, _) {
        if (alr.has(data) || _) return
        console.warn(data)
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
        queueWrite(str + "{" + toCSS(rule, _) + "}")
        return sheet
    }
    function l() {
        write(batch)
        //@dev console.debug("textContent queue emptied! Text length accumulated:", batch.length)
        batch = ''
    }
    function queueWrite(text) {
        text && (batch || rAF(l), batch += text)
    }
    var violated = false
    function violation() {
        violated = true
        write(this.textContent)
    }
    var added = false
    function write(text) {
        if (violated) createSheet(text)
        else {
            added || (added = !!(sheet.onsecuritypolicyviolation = violation))
            sheet.insertAdjacentText('beforeend', text)
        }
        // <style> blocked
    }
    function createSheet(text) {
        var m = new CSSStyleSheet
        text && m.replaceSync(text)
        D.adoptedStyleSheets = [].concat.call(D.adoptedStyleSheets, m)
        return m
    }
    function registerCSSRaw(rules, newStyleSheet) {
        if (newStyleSheet) {
            if (violated) return createSheet(rules)
            var n = D.createElement('style')
            n.blocking = 'render'
            n.textContent = rules
            return put(n).sheet
        }
        queueWrite(rules)
        return sheet
    }
    function Sheet() {
        var o = D.getElementById(id)
        if (o) return o
        // if (canWrite) return D.write('<style id="'+id+'" blocking="render">'+str+'</style>'), Sheet()
        // ^ this branch is slower
        o = D.createElement('style')
        o.id = id
        o.blocking = 'render'
        o.insertAdjacentText || (o.insertAdjacentText = function (_, txt) { o.appendChild(D.createTextNode(txt)) })
        return put(o)
    }
    function put(e) {
        var p = D.head || D.body || D.documentElement || ((p = D.currentScript) && (p.parentNode || p)) || D.querySelector('*') || D.firstElementChild || D
        return p.appendChild(e)
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
    var uv = { //'box-sizing': 'border-box', it causes too many problems
        'font-family': 'inherit',
        'overflow-wrap': 'var(--word-wrap)',
        'scrollbar-color': 'var(--scrollbar-thumb-color) var(--scrollbar-color)',
        'scrollbar-width': 'var(--scrollbar-width)'
    }
    function lowPriority() {
        //@dev console.time('low priority')
        g("locale", "auto", true, "*")("line-grid", "auto", true, "*")("line-snap", "auto", true, "*")("nbsp-mode", "auto", true, "*")("text-zoom", "auto", false, "*")("line-align", "auto", true, "*")("text-decorations-in-effect", "auto", false, "*")("force-broken-image-icon", "0", false, "<integer>")("float-edge", "content-box", false, "*")("image-region", "auto", true, "*")("box-orient", "inline-axis", false, "*")("box-align", "stretch", false, "*")("box-direction", "normal", false, "*")("box-flex", "0", false, "*")("box-flex-group", "0", false, "*")("box-lines", "single", false, "*")("box-ordinal-group", "1", false, "*")("box-decoration-break", "slice", false, "*")("box-pack", "start", false, "*")("line-clamp", "none", false, "*")("font-smoothing", "auto", true, "*")("mask-position-x", "0%", false, "<length-percentage>")("mask-position-y", "0%", false, "<length-percentage>")("window-dragging", "auto", false, "*")("stack-sizing", "stretch-to-fit", true, "*")("mask-composite", "source-over", false, "*")("window-shadow", "auto", false, "*")("outline-radius", "0 0 0 0", false, "*")("binding", "none", false, "*")("text-blink", "none", false, "*")("image-rect", "auto", true, "*")("content-zoom-limit", "400% 100%", false, "*")("accelerator", "0", false, "*")("context-properties", "none", true, "*")("text-kashida-space", "0%", true, "<percentage>")("interpolation-mode", "none", false, "*")("progress-appearance", "bar", false, "*")("content-zooming", "auto", false, "*")("flow-from", "none", false, "*")("flow-into", "none", false, "*")("content-zoom-chaining", "none", false, "*")("high-contrast-adjust", "auto", true, "*")("touch-select", "grippers", true, "*")("ime-mode", "auto", false, "*")("wrap-through", "wrap", false, "*")("print-color-adjust", "economy", true, "*")("pay-button-style", "white", false, "*")("color-filter", "none", true, "*")("pay-button-type", "plain", false, "*")("visual-effect", "none", true, "*")("text-spacing-trim", "normal", true, "*")("text-group-align", "none", false, "*")("text-autospace", "normal", true, "*")("orient", "inline", false, "*")("ruby-overhang", "auto", true, "*")("max-lines", "none", false, "*")("line-fit-edge", "leading", true, "*")("overflow-scrolling", "auto", false, "*")("column-progression", "auto", false, "*")("dashboard-region", "none", false, "*")("column-axis", "auto", false, "*")("text-size-adjust", "auto", true, "*")("border-vertical-spacing", "auto", false, "*")("buffered-rendering", "auto", false, "*")("behaviour", "url()", false, "<url>")
        //@dev console.timeEnd('low priority')
    }
    function properties() {
        //@dev console.time('properties')
        g("user-select", "auto", false, '*') // Most important one
            ("user-modify", "auto", false, '*')
            ("zoom", "auto", false, '*')
            ('user-drag', "auto", true, '*')
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
        crisp = '-webkit-optimize-contrast -moz-crisp-edges'.split(' ').find(sup.bind(1, 'image-rendering')) || 'initial'
        stretch = '-webkit-fill-available stretch -moz-available'.split(' ').find(sup.bind(1, 'max-width')) || 'initial'
        center = '-moz-center -webkit-center -khtml-center'.split(' ').find(align) || 'initial'
        matchParent = 'match-parent -moz-match-parent -webkit-match-parent'.split(' ').find(align) || 'initial'
        var o = {
            ':root': {
                // 'transition-behavior': 'allow-discrete',
                // 'interpolate-size': 'allow-keywords',
                '--crisp-edges': crisp,
                '--system-font': "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
                '--stretch': stretch,
                '--center': center,
                // this is different from just 'center' and idk why!!!
                '--match-parent': matchParent,
            }
        }
        o[W("input[type=date]")] = { cursor: 'text' }
        o[W("button,a,input[type=button],input[type=checkbox],input[type=radio],input[type=submit],input[type=image],input[type=reset],input[type=file]")] = { cursor: 'pointer' }
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
        o[W('.center_text')] = { 'text-align': 'center' }
        o[W('.center_block')] = { display: 'block', 'margin-left': 'auto', 'margin-right': 'auto' }
        o[W('.center_inline')] = { display: 'inline-block', 'text-align': 'center' }
        o[W('.center_absolute,.center_screen')] = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        o[W('.center_screen')] = { position: 'fixed', 'z-index': '9999' }
        o[W('.center_absolute,.center_absolute_x,.center_absolute_y')] = { position: 'absolute' }
        o[W('.center_flex_x,.center_flex')] = { display: 'flex', 'justify-content': 'center' }
        o[W('.center_flex_y,.center_flex')] = { display: 'flex', 'align-items': 'center' }
        o[W('.center_grid_x')] = { display: 'grid', 'place-items': 'center start' }
        o[W('.center_grid_y')] = { display: 'grid', 'place-items': 'start center' }
        o[W('.center_absolute_x')] = { left: '50%', transform: 'translateX(-50%)' }
        o[W('.center_absolute_y')] = { top: '50%', transform: 'translateY(-50%)' }
        o[W('img')] = {
            '--force-broken-image-icon': 1,
            'max-inline-size': '100%', 'block-size': 'auto',
            //'object-fit': 'contain'
        } // https://web.dev/learn/design/responsive-images
        /*o[W('img,video,canvas,svg,picture')] = { //display: 'block', 
             'max-width': '100%'
         }*/
        o[W('h1')] = { 'margin-block': '.67em', 'font-size': '2em' }
        var root = o[':root']
        if (atProperty) {
            properties()
            lowPriority()
            newName = bulkText
        }
        else if (!CSS.registerProperty)
            doRegister()
        for (var x in o) newName += x + "{" + toCSS(o[x]) + "}"
        newName = "@namespace svg url('http://www.w3.org/2000/svg');\nhtml{margin:auto}p{text-wrap:pretty}h1,h2,h3,h4,h5,h6,:where(p){text-wrap:balance;overflow-wrap:break-word}body{line-height:1.5;--font-smoothing:antialiased}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto !important}}@media(prefers-reduced-motion:no-preference){:root{interpolate-size: allow-keywords}}@media(prefers-reduced-transparency:reduce){*{opacity:1 !important;}}:-moz-loading{cursor:wait}:-moz-broken{border-radius:0}@supports not(content-visibility:auto){*{visibility:var(--content-visibility)}}@supports not(scrollbar-width: thin){::-webkit-scrollbar{width:var(--scrollbar-width);background-color:var(--scrollbar-color)}::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb-color)}}" + newName
        //@dev console.debug(newName.replace(/:where\(([\S\s]*?)\)/g,'$1'))
    }
    var str = name
    if (!str) // Selecting all pseudo elements has a massive performance hit
        sn(str = id + '*' + "{" + toCSS(uv, true) + "}" + newName)
    write(str)
    var css =  //@devObject.seal
        ({
            getDefaultStyleSheet: Sheet,
            registerCSSRaw: registerCSSRaw,
            write: registerCSSRaw,
            get reducedMotion() {
                return Rm || (Rm = matchMedia('(prefers-reduced-motion:reduce)'))
            },
            registerCSSAll: registerCSSAll,
            supportedPClassVendor: fClass,
            supportsRule: sel,
            registerCSS: registerCSS,
            dashVendor: dv,
            // importFont: importFont,
            capVendor: cv,
            // importCSS: importCSS,
            badCSS: badCSS,
            toCaps: toCaps,
            toDash: toDash,
            vendor: vendor,
            toCSS: toCSS,
            formatSelector: fSelector,
            onerror: onerror
        })
    y[sym] || O.defineProperty(y, sym, { value: css, enumerable: 1 })
    return css
}(!this, self, Symbol.for('[[CSSModule]]'), (self.requestIdleCallback && function (c) { return requestIdleCallback(c, { timeout: 2000 }) }) || (self.scheduler && scheduler.postTask && function (c) { return scheduler.postTask(c, { priority: 'background' }) }) || self.queueMicrotask || self.setImmediate || setTimeout, document, Object, '/*stylesheet auto-generated by css.js*/', constructor.prototype, self.requestAnimationFrame || self.webkitRequestAnimationFrame || self.mozRequestAnimationFrame || self.msRequestAnimationFrame || self.oRequestAnimationFrame))
// ; console.timeEnd('css.js')