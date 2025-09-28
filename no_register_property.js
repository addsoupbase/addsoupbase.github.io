!function (Observer) {
    'use strict'
    function getLabel(obj) {
        return {}.toString.call(obj).slice(8, -1).trim() || 'Object'
    }
    var m = new Observer(callback)
    m.observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true
    })
    function replaceImport(rule, node, href, sheet, res) {
        
        node.textContent = sheet.cssText.replace(rule.cssText,res.responseText)
    }
    function resolve(href, base) {
        var b = document.createElement('base')
        b.href = base
        var a = document.createElement('a')
        a.href = href
        document.head.appendChild(b)
        document.head.appendChild(a)
        var out = a.href
        document.head.removeChild(a)
        document.head.removeChild(b)
        return out
    }
    var already = new Set
    var regex = /--\w?[\w-]*\w(?=:\s*)(?!\s*var\s*\()/g
    var regex2 = /var\s*\(\s*--system-font\s*\)/g
    // for (var a = document.styleSheets, i = a.length; i--;)
    // fixSheetRules(a[i])
    function fixString(node) {
        var txt = node.textContent,
            newText = txt.replace(regex, getReplacements)
            .replace(regex2, "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif")
        var rules = node.sheet.cssRules || node.sheet.rules
        if (txt !== newText) {
            node.textContent = newText
        }
        for (var i = 0, l = rules.length; i < l; ++i) {
            var rule = rules[i]
            if (getLabel(rule) === 'CSSImportRule') { 
                var xhr = new XMLHttpRequest
                xhr.open('GET', resolve(rule.href, node.dataset.src || document.baseURI))
                xhr.onload = replaceImport.bind(1,rule, node, rule.href, node.sheet, xhr)
                xhr.send()
            }
        }
    }
    function getReplacements(prop) {
        prop = prop.slice(2)
        return fallback.get(vendor(prop, 'inherit')) || prop
    }
    /*function fixSheetRules(sheet) {
        var rules = sheet.cssRules || sheet.rules
        for (var i = rules.length; i--;) {
            var me = rules[i]
                , txt = me.cssText,
                newText = txt.replace(regex, getReplacements)
            if (newText !== txt) {
                me.cssText = newText
                console.log(newText)
            }
        }
    }*/
    function onload(prev, e) {
        this.textContent = e.target.responseText.replace(regex, getReplacements)
        prev.insertAdjacentElement('afterend', this)
        /*try {
            prev.parentElement.removeChild(prev)
        }
        catch (e) {
            prev.setAttribute('disabled', 'disabled')
        }*/
        fixString(this)
    }
    function handleLinkElem(node) {
        if (already.has(node)) return
        already.add(node)
        var src = node.getAttribute('href')
        var xhr = new XMLHttpRequest
        xhr.open('GET', src)
        var st = document.createElement('style')
        st.dataset.src = src
        xhr.onload = onload.bind(st, node)
        xhr.send()
    }
    function callback(records) {
        for (var i = records.length; i--;) {
            var added = records[i].addedNodes
            for (var j = added.length; j--;) {
                var node = added[j]
                if (node.getAttribute && node.getAttribute('rel') === 'stylesheet') {
                    // node.addEventListener('load', load, { once: true })
                    handleLinkElem(node)
                    continue
                }
                var el = (node.parentElement || node)
                el.tagName === 'STYLE' && fixString(el)
            }
        }
    }
    document.addEventListener('DOMContentLoaded', function () {
        ;[].forEach.call(document.getElementsByTagName('style'), function (e) {
            fixString(e)
        })
            ;[].forEach.call(document.getElementsByTagName('link'), function (e) {
                e.getAttribute('rel') === 'stylesheet' && handleLinkElem(e)
            })
    })
}(window.MutationObserver || webkitMutationObserver)