//# allFunctionsCalledOnLoad
// console.time('css.js');
//// self.css = 
(function CSSSetup(inModule, w, sym, defer, D, O, id, y) {
    ////'use strict'
    if (y.propertyIsEnumerable(sym) && w[id]instanceof HTMLStyleElement) return y[sym]
    try { var S = sessionStorage } // it just throws on read if storage is denied
    catch (e) { reportError(e) }
    addEventListener('error', function n(e) { if (e.filename.endsWith('.js')) { [].forEach.call(D.querySelectorAll('script[nomodule]'), function (s) { D.head.appendChild(D.createElement('script')).src = s.src }); removeEventListener('error', n) } })
    var sup = CSS.supports,
        hasOwn = O.hasOwn,
        imp = /\s*!\s*important\s*$/,
        selCache = new Map,
        isSimple = /^[^)(:]+$/,
        where = sel(':where(p)', true),
        sn
        , canWrite = !inModule && D.readyState !== 'complete'
        , func = CSS.registerProperty || void (fallback = new Map), selector = '*' + (where ? ',:where(::-moz-color-swatch,::-moz-focus-inner,::-moz-list-bullet,::-moz-list-number,::-moz-meter-bar,::-moz-progress-bar,::-moz-range-progress,::-moz-range-thumb,::-moz-range-track,::-webkit-inner-spin-button,::-webkit-meter-bar,::-webkit-meter-even-less-good-value,::-webkit-meter-inner-element,::-webkit-meter-optimum-value,::-webkit-meter-suboptimum-value,::-webkit-progress-bar,::-webkit-progress-inner-element,::-webkit-progress-value,::-webkit-scrollbar,::-webkit-search-cancel-button,::-webkit-search-results-button,::-webkit-slider-runnable-track,::-webkit-slider-thumb,::after,::backdrop,::before,::checkmark,::column,::cue,::details-content,::file-selector-button,::first-letter,::first-line,::grammar-error,::marker,::picker-icon,::placeholder,::scroll-marker,::scroll-marker-group,::selection,::spelling-error,::target-text,::view-transition)' : '')
    dance: {
        try {
            if (typeof scrollMaxX !== 'number' || !S) {
                // sessionStorage seems to be faster on FireFox 
                var o = top.name
                if (!o || o.startsWith(id)) {
                    sn = Reflect.set.bind(1, top, 'name')
                    var name = o // name is free to use
                    break dance
                }
            }
        }
        catch (e) {
            // cross origin frame so we can't use window.top
            reportError(e)
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
        entries = O.entries,
        is = Array.isArray,
        // scr,
        sheet = Sheet(),
        props = new Set,
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
        reuse = {
            name: '',
            initialValue: '',
            inherits: false,
            syntax: ''
        },
        url = /;(?!url\(.*\))/
        , toValue = function (parse) {
            var proto = {
                //valueOf: { value: function () { return parseFloat(this.toString()) } } 
            }
            // valueOf messes with the + operator >:(
            var props = O.getOwnPropertyNames(String.prototype)
            Symbol.iterator && props.push(Symbol.iterator)
            for (var i = props.length; i--;) {
                var prop = props[i]
                typeof ''[prop] === 'function' && prop !== 'toString' && prop !== 'valueOf' && hi(prop)
            }
            return parse ? a : b
            function a(p, v) {
                return O.defineProperty(O.defineProperties(parse(p, v.replace(imp, '')), proto), 'length', { value: v.length })
            }
            function hi(prop) {
                proto[prop] = {
                    value: function (a, b, c) {
                        var l = ''[prop]
                            , s = this.toString()
                        switch (l.length) {
                            case 0: return l.call(s)
                            case 1: return l.call(s, a)
                            case 2: return l.call(s, a, b)
                            case 3: return l.call(s, a, b, c)
                        }
                        return Reflect.apply(l, s, arguments)
                    }
                }
            }
            function b(_, v) { return Object(v.replace(imp, '')) }
        }(w.CSSStyleValue && CSSStyleValue.parse)
        // CSSProto = O.create(null, { supported: { get: function () { for (var i in this) if (!sup(i + ':' + this[i])) return false; return true } }, toString: { value: function () { return toCSS(this) } } })
        , comments = /\/\*[\s\S]*?\*\//g
        , parse = /([^{}]+?)(?:;|(\{[\s\S]*?\}))/g
        , semicolon = /(?:--)?[-\w]+\s*:(?:(?![^(]*\);|[^"]*";|[^']*';).)*?(?:!\s*important\s*)?(?=;(?![^(]*\)|[^"]*"|[^']*')|\s*$)/g,
        batch = ''
    CSS.registerProperty || (canWrite && (w.fallback = fallback, w.vendor = vendor, D.write('<script src="https://addsoupbase.github.io/no_register_property.js"><\x2fscript>')))
    /*  if (canWrite && top === self) {
          // Idk why, but it seems to make the page render faster
          document.write('<p style="position:absolute !important;transform:scale(0) !important;z-index:-9999 !important;" data-cssid="$$$" aria-hidden="true">.</p>')
          var p = document.querySelector('p[data-cssid="$$$"]')
          p = addEventListener('load', p.removeChild.bind(p.parentElement, p), { once: true })
      }*/
    function dv(prop, val) {
        return vendor(toDash(prop), val)
    }
    function cv(prop, val) { return toCaps(vendor(toDash(prop), val)) }
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
    function fromCSS(str) {
        if (!(this instanceof fromCSS)) return new fromCSS(str)
        str = str.trim()
        var a = str.match(semicolon) || str.slice(0, -1).match(semicolon)
            , o = this
        var n = { writable: true, configurable: true }
        if (a) for (var h = a.length; h--;) {
            var hi = a[h]
                , strings = hi.split(url).filter(Boolean)
            for (var i = strings.length; i--;) {
                var str = strings[i]
                    , splits = str.split(':')
                    , b = splits,
                    l = b[0],
                    j = b[1],
                    p = l && l.trim(),
                    v = j && j.trim()
                if (p) try {
                    v = toValue(p, v)
                    n.value = o[p] = v
                    if (p.startsWith('--')) O.defineProperty(o, '__' + toCaps(p.substring(2)), n)
                    else {
                        var x = toCaps(p)
                        hasOwn(o, x) || O.defineProperty(o, x, n)
                    }
                }
                    catch (e) { if (e.name !== 'TypeError') throw e; o[p] = v }  // Prop unsupported 
            }
        }
    }
    function get() { for (var i in this) if (!sup(i + ':' + this[i])) return false; return true }
    function ts() { return toCSS(this) }
    fromCSS.prototype = O.create(null, { supported: { get: get }, toString: { value: ts } })
    function fixSheet(me) {
        if (me === sheet.sheet) return
        var href = me.href
        if (href) {
            var xhr = new XMLHttpRequest
            xhr.open('GET', href)
            xhr.onload = function () {
                load(xhr.responseText)
            }
            xhr.send()
        }
        else load(me.ownerNode.textContent)
        function load(text) {
            var og = text
            text = text.replace(comments, '')
            var match
            // , sheetRules = sheet.cssRules || sheet.Rules
            // console.clear()
            while (match = parse.exec(text)) {
                var rule = match[2]
                if (rule) {
                    var r = rule.trim().slice(1, -1).replace(/\n/g, '')
                        , c = new fromCSS(r)
                        , s = match[1]
                    if (/^\s*@(?:supports|media)/.test(s)) continue
                    var selector = fSelector(s)
                        , lines = og.split('\n')
                        , line = href + ':' + (lines.findIndex(function (o) { return o.includes(selector) }) + 1)
                    if (!O.keys(c).length) console.warn('Empty ruleset:', line)
                    // i will make this better later
                    if (href && !sel(selector))
                        console.warn('Invalid selector:', line)
                    // auto jump to line
                    for (var x in c) {
                        var v = c[x]
                            , propNotSupported = !sup(x + ':' + 'inherit')
                            , valNotSupported = !sup(x + ':' + v)
                        if (propNotSupported || valNotSupported)
                            console.warn('Invalid ' + (propNotSupported ? 'property ' + x : 'value ' + v) + ':', href + ':' + (lines.findIndex(function (o) { return o.includes(propNotSupported ? x : v) }) + 1))
                    }
                    // c.supported || console.warn('One or more rules/properties unsupported', c, sheet.href || sheet.outerHTML)
                }
            }
        }
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
    function find(p, v, important) {
        for (var i = br.length, o; i--;) {
            var prefix = br[i]
                , prop = p
            prefix !== 'mso' && prefix !== 'prince' && (prefix = '-' + prefix)
            prefix += '-'
            if (sup(b(o = prefix + prop, v))) return o + important
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
            return dr.has(p) ? dr.get(p) : find(p, v, important) || (
                // sup(prefix = `-internal-${prop}`, val) ||
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
            // try {
            str += vendor(toDash(p), v, _) + ':' + v + ';'
            // } catch (e) {
            // reportError(e)
            // }
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
        sheet.textContent += batch
        //// console.debug("textContent queue emptied! Text length accumulated:", batch.length)
        batch = ''
        //// console.countReset("textContent queue")
    }
    function queueWrite(text) {
        text && (batch || requestAnimationFrame(l), batch += text)
        //// console.count('textContent queue')
        //// console.debug(batch.length)
    }
    function registerCSSRaw(rules, newStyleSheet) {
        if (newStyleSheet) {
            var n = D.createElement('style')
            n.blocking = 'render'
            n.textContent = rules
            return put(n).sheet
        }
        queueWrite(rules)
        return sheet
    }
    /*function importCSSSync(src) {
        // make sure to use blocking=render probably
        if (src.startsWith('data:text')) {
            var split = src.split(',')[1]
            text = split[1]
            if (split[0].includes('base64,')) text = atob(text)
            debugger
        }
        else {
            var xhr = new XMLHttpRequest
            xhr.open('GET', src, false)
            // xhr.responseType = 'text'
            xhr.send()
            var text = xhr.responseText
        }
        registerCSSRaw(text, true)
    }*/
    function importCSS(url) {
        var n = D.createElement('link')
        n.rel = 'stylesheet'
        n.fetchpriority = 'high'
        n.blocking = 'render'
        n.href = url
        return put(n)
    }
    function Sheet() {
        var o = D.getElementById(id)
        if (o) return o
        // if (canWrite) return document.write('<style id="'+id+'" blocking="render">'+str+'</style>'), getDefaultStyleSheet()
        // this branch is slower
        o = D.createElement('style')
        o.id = id
        o.blocking = 'render'
        return put(o)
    }
    function put(e) {
        var p = D.head || D.body || D.documentElement || ((p = D.currentScript) && (p.parentNode || p)) || D.querySelector('*') || D.firstElementChild || D
        return p.appendChild(e)
    }
    function registerCSSAll(rules) {
        O.keys(rules).forEach(reg, rules)
    }
    function reg(r) {
        // try {
        registerCSS(r, this[r])
        // } catch (e) {
        // reportError(e)
        // }
    }
    function sel(rule, doCache) {
        if (isSimple.test(rule)) return true
        if (doCache) var c, cache = selCache.get(rule) || (selCache.set(rule, c = sel(rule, false)), c)
        // if (!cache) {
        //     var vh = /:(?:where|is|any)\((.*)\)/g
        //         , hasWhere = rule.match(vh)
        //         ; (!hasWhere || (hasWhere && !sel(rule.replace(vh, '$1')))) && badCSS("Invalid selector '" + rule + "'")
        // }
        return !!cache || sup("selector(" + rule + ")")
    }
    function re(name, iv, inh, sx) {
        reuse.name = name
        reuse.initialValue = iv
        reuse.inherits = inh
        reuse.syntax = sx
        func ? func(reuse) : fallback.set(key = vendor(name, name = 'var(' + name + ')', true), vendor(key, 'inherit'))
        var key
    }
    function g(name, iv, inh, sx) {
        props.add(name)
        var o = '--' + name,
            n = o,
            key = vendor(name, o = 'var(' + o + ')', true)
        uv[key] = o
        // try { 
        re(n, iv, inh, sx)
        return g
        // }
        // catch (e) {e.name === 'InvalidModificationError' || (console.log(o), reportError(e),func || fallback.set(key, vendor(key, 'inherit')))}
    }
    function W(s) {
        return ':where(' + s + ')'
    }
    where || (W = String)
    var fallback,
        uv = { 'box-sizing': 'border-box', 'overflow-wrap': 'var(--word-wrap)', 'scrollbar-color': 'var(--scrollbar-thumb-color) var(--scrollbar-color)' }
    // , all = [
    // performance.mark('css-property-start')
    function lowPriority() {
        // lower priority props
        g("locale", "auto", true, "*")("line-grid", "auto", true, "*")("line-snap", "auto", true, "*")("nbsp-mode", "auto", true, "*")("text-zoom", "auto", true, "*")("line-align", "auto", true, "*")("text-decorations-in-effect", "auto", false, "*")("force-broken-image-icon", "0", false, "<integer>")("float-edge", "content-box", false, "*")("image-region", "auto", true, "*")("box-orient", "inline-axis", false, "*")("box-align", "stretch", false, "*")("box-direction", "normal", false, "*")("box-flex", "0", false, "*")("box-flex-group", "0", false, "*")("box-lines", "single", false, "*")("box-ordinal-group", "1", false, "*")("box-decoration-break", "slice", false, "*")("box-pack", "start", false, "*")("line-clamp", "none", false, "*")("font-smoothing", "auto", true, "*")("mask-position-x", "0%", false, "<length-percentage>")("mask-position-y", "0%", false, "<length-percentage>")("self-dragging", "auto", false, "*")("stack-sizing", "stretch-to-fit", true, "*")("mask-composite", "source-over", false, "*")("self-shadow", "auto", false, "*")("outline-radius", "0 0 0 0", false, "*")("binding", "none", false, "*")("text-blink", "none", false, "*")("image-rect", "auto", true, "*")("content-zoom-limit", "400% 100%", false, "*")("accelerator", "0", false, "*")("context-properties", "none", true, "*")("text-kashida-space", "0%", true, "<percentage>")("interpolation-mode", "none", false, "*")("progress-appearance", "bar", false, "*")("content-zooming", "auto", false, "*")("flow-from", "none", false, "*")("flow-into", "none", false, "*")("content-zoom-chaining", "none", false, "*")("high-contrast-adjust", "auto", true, "*")("touch-select", "grippers", true, "*")("ime-mode", "auto", false, "*")("wrap-through", "wrap", false, "*")("print-color-adjust", "economy", true, "*")("pay-button-style", "white", false, "*")("color-filter", "none", true, "*")("pay-button-type", "plain", false, "*")("visual-effect", "none", true, "*")("text-spacing-trim", "normal", true, "*")("text-group-align", "none", false, "*")("text-autospace", "normal", true, "*")("orient", "inline", false, "*")("ruby-overhang", "auto", true, "*")("max-lines", "none", false, "*")("line-fit-edge", "leading", true, "*")("overflow-scrolling", "auto", false, "*")("column-progression", "auto", false, "*")("dashboard-region", "none", false, "*")("column-axis", "auto", false, "*")("text-size-adjust", "auto", true, "*")("border-vertical-spacing", "auto", false, "*")("buffered-rendering", "auto", false, "*")("behaviour", "url()", false, "<url>")
            // try {
            // performance.mark('css-other-start')
            ('scrollbar-thumb-color', 'auto', true, '*')
            ('scrollbar-color', 'auto', true, '*')
        reuse = null
        // }
        // catch (e) { reportError(e) }
    }
    function properties() {
        g("user-select", "auto", true, '*') // Most important one
            ("user-modify", "auto", false, '*')
            ("zoom", "auto", false, '*')
            ('user-drag', "auto", true, '*')
            ("user-input", "auto", true, '*')
            ("box-reflect", "none", false, '*') // Kewl
            ("text-stroke-color", "currentcolor", true, "<color>")
            ("text-stroke-width", '0', false, "<length>")
            ("text-security", "none", false, '*')
            ("text-fill-color", "currentcolor", true, '*')
            ("tap-highlight-color", "rgb(0, 0, 0, 0.18)", true, "<color>")
            ("touch-callout", "auto", true, '*')
            ("user-focus", "none", false, '*')
            ("initial-letter", "normal", false, '*')
            ("overflow-style", "auto", true, '*')
            ("interactivity", "auto", true, '*')
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
    }
    // performance.mark('css-property-end')
    // ],
    var dflt = name
    if (!dflt) {
        var align = sup.bind(1, 'text-align')
            , o = {
                ':root': {
                    'transition-behavior': 'allow-discrete',
                    'interpolate-size': 'allow-keywords',
                    '--crisp-edges': '-webkit-optimize-contrast -moz-crisp-edges'.split(' ').find(sup.bind(1, 'image-rendering')) || 'initial',
                    '--stretch': '-moz-available -webkit-fill-available stretch'.split(' ').find(sup.bind(1, 'max-width')) || 'initial',
                    '--center': '-moz-center -webkit-center -khtml-center'.split(' ').find(align) || 'initial',
                    // this is different from just 'center' and idk why!!!
                    '--match-parent': 'match-parent -moz-match-parent -webkit-match-parent'.split(' ').find(align) || 'initial'
                }
            }
        o[W("button,a,input[type=button],input[type=checkbox],input[type=radio],input[type=submit],input[type=image],input[type=reset],input[type=file]")] = { cursor: 'pointer' }
        o[W('[aria-busy=true]')] = { cursor: 'progress' }
        o[W('[draggable=false]')] = { '--user-drag': 'none' }
        o[W('[draggable=true]')] = { '--user-drag': 'element' }
        o[W('[contenteditable],[contenteditable=true]')] = { '--user-modify': 'read-write' }
        o[W('[contenteditable=false]')] = { '--user-modify': 'read-only', '--user-input': 'none' }
        o[W('[contenteditable="plaintext-only"]')] = { '--user-modify': 'read-write-plaintext-only' }
        o[W('[inert]')] = { '--interactivity': 'inert' }
        o[W('img')] = { '--force-broken-image-icon': 1 }
        o[W('input[type=range],::-webkit-scrollbar-thumb')] = { cursor: 'grab' }
        o[W('input[type=range]:active,::-webkit-scrollbar-thumb:active')] = { cursor: 'grabbing' }
        o[W(':disabled,[aria-disabled=true]')] = { cursor: 'not-allowed' }
        o[W('.centerx,.center')] = { 'justify-self': 'center', margin: 'auto', 'text-align': 'center' }
        o[W('.centery,.center')] = { 'align-self': 'center', inset: 0, position: 'fixed' }
        dflt = entries(o).reduce(function (a, b) {
            return a + b[0] + "{" + toCSS(b[1]) + "}"
        }, "@namespace svg url('http://www.w3.org/2000/svg');@media(prefers-reduced-transparency:reduce){*{opacity:1 !important;}}:root{--system-font:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}:-moz-loading{cursor:wait}:-moz-broken{border-radius:0}@supports not(content-visibility:auto){*{visibility:var(--content-visibility)}}@supports not(scrollbar-color:auto){::-webkit-scrollbar{width:var(--scrollbar-width);background-color:var(--scrollbar-color)}::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb-color)}}")
        if (typeof CSSPropertyRule === 'function') {
            var bulkText = ''
            re = function (name, iv, inh, sx) {
                bulkText += '@property ' + name + '{syntax:"' + sx + '";inherits:' + inh + ';initial-value:' + iv + '}'
            }
            properties()
            lowPriority()
            dflt += bulkText
        }
        else {
            defer(lowPriority)
            properties()
        }
    }
    var str
    // finally { performance.mark('css-other-end') }
    sheet.textContent = name || (sn(str = selector + "{" + toCSS(uv, true) + "}" + dflt), id + str)
    var css =  ////Object.freeze
        ({
            getDefaultStyleSheet: Sheet,
            registerCSSRaw: registerCSSRaw,
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
            importCSS: importCSS,
            badCSS: badCSS,
            toCaps: toCaps,
            toDash: toDash,
            vendor: vendor,
            toCSS: toCSS,
            //// has: props.has.bind(props),
            formatSelector: fSelector,
            fixSheet: fixSheet,
            get queue() { return batch },
            checkSheets: defer.bind(this, [].forEach.bind(document.styleSheets, fixSheet)),
            fromCSS: fromCSS
        })
    y[sym] || O.defineProperty(y, sym, { value: css, enumerable: 1 })
    // console.debug(performance.measure('css-cache','css-cache-start', 'css-cache-end').toJSON(), performance.measure('css-property', 'css-property-start', 'css-property-end').toJSON())
    return css
}(!this, self, Symbol.for('[[CSSModule]]'), (self.requestIdleCallback && function (c) { return requestIdleCallback(c, { timeout: 2000 }) }) || (self.scheduler && scheduler.postTask && function (c) { return scheduler.postTask(c, { priority: 'background' }) }) || self.queueMicrotask || self.setImmediate || setTimeout, document, Object, '/*stylesheet auto-generated by css.js*/', constructor.prototype))
//self[Symbol.for('[[CSSModule]]')]
// ; console.timeEnd('css.js')