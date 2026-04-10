!function (D) {
    'use strict'
    let s = new CSSStyleSheet
    s.replaceSync(
        `[aria-hidden="true"],
       [alt=""] {
           display: none !important
       }
       :not(button, select, label:is(:has(*), [for]), [tabindex], a, [role="button"], [role="tab"], [role="link"], input:is([type="button"],[type="image"],[type="color"],[type="radio"], [type="checkbox"],[type="range"])) {
           cursor: default !important;
       }
        :is(input:is([type="text"], :not([type]), [type="password"], [type=""])) {
        cursor: text !important
        }
       :is([aria-label], [alt]:not([alt=""]))::before {
           position: absolute;
           font-size: 0.75em;
           top: 0;
           left: 0;
           background: rgba(0, 0, 0, 0.7);
           color: #fff;
           padding: 1px 3px;
           pointer-events: none;
           z-index: 9999;
           white-space: nowrap;
       }

       [aria-label] {
           position: relative !important;
       }

       [aria-label]::before {
           content: attr(aria-label);
           outline: 1px solid blue;
       }

       /*[alt]:not([alt=""])::before {
           content: attr(alt);
           outline: 1px solid green;
       }*/
      `)
    D.adoptedStyleSheets = [].concat.call(D.adoptedStyleSheets, s)

    function invalidateImage(img) {
        o.disconnect()
        img.setAttribute('src', '')
        if (img.parentNode?.tagName === 'PICTURE') {
            img.parentNode.querySelectorAll('source').forEach(s => s.setAttribute('media', 'not all'))
        }
        o.observe(D, observeOpts)
    }

    const observeOpts = { subtree: true, childList: true, attributes: true, attributeFilter: ['src'], attributeOldValue: true }

    let o = new MutationObserver(n => {
        for (let record of n) {
            if (record.type === 'childList') {
                for (let added of record.addedNodes) {
                    if (added.tagName === 'IMG') {
                        invalidateImage(added)
                    }
                    else doPseudo(added)
                }
            } else if (record.type === 'attributes') {
                if (record.target.tagName === 'IMG' && record.target.getAttribute('src') !== '') {
                    invalidateImage(record.target)
                }
            }
        }
    })
    function doPseudo(node) {
        // Chrome removed Element.prototype.pseudo()
        // but it works on Canary
        if (node.pseudo('::after').getBoxQuads().length || node.pseudo('::before').getBoxQuads().length) {
            // ^ kind of a hack to see if the pseudo element actually exists
            let after = getComputedStyle(node, '::after'),
                before = getComputedStyle(node, '::before')
            let r = /\/\s*(.+)$/s
            let afterAlt = after.content.match(r)?.[1]
            let beforeAlt = before.content.match(r)?.[1]
            let id = node.id = node.id || Math.random()
            s.insertRule(`#${CSS.escape(id)}::before {content: ${beforeAlt || ""} !important; background-image: none !important;font-size:small !important;width:fit-content !important}`)
            s.insertRule(`#${CSS.escape(id)}::after {content: ${afterAlt || ""} !important; background-image: none !important;font-size:small !important;width:fit-content !important}`)
        }
    }
    o.observe(D, observeOpts)
        ;[].forEach.call(D.images, invalidateImage)
        ;[].forEach.call(D.querySelectorAll(':not(area,base,br,col,embed,hr,img,input,link,meta,param,source,track,video,audio,iframe,canvas,object)'), doPseudo)
}(document)