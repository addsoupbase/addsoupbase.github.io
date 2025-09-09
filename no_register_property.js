!function(Observer) {
    'use strict'
    var m = new Observer(callback)
    m.observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true
    })
    var regex = /--\w?[\w-]*\w(?=:\s*)(?!\s*var\s*\()/g
    for (var a = document.styleSheets, i = a.length; i--;)
        fixSheetRules(a[i])
    function fixString(node) {
        var txt = node.textContent,
            newText = txt.replace(regex, getReplacements)
        if (txt !== newText) node.textContent = newText
    }
    function getReplacements(prop) {
        prop = prop.slice(2)
        if (prop !== 'system-font') return fallback.get(vendor(prop, 'inherit')) || prop
    }
    function fixSheetRules(sheet) {
        var rules = sheet.cssRules || sheet.rules
        for (var i = rules.length; i--;) {
            var me = rules[i]
            , txt = me.cssText,
                newText = txt.replace(regex, getReplacements)
            if (newText !== txt)
                me.cssText = newText
        }
    }
    function load() {
        fixSheetRules(this.sheet)
    }
    function callback(records) {
        for (var i = records.length; i--;) {
            var added = records[i].addedNodes
            for (var j = added.length; j--;) {
                var node = added[j]
                if (node.getAttribute && node.getAttribute('rel') === 'stylesheet') {
                    node.addEventListener('load', load, { once: true })
                    continue
                }
                var el = (node.parentElement || node)
                el.tagName === 'STYLE' && fixString(el)
            }
        }
    }
}(window.MutationObserver || webkitMutationObserver)