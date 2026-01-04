!function (cached) {
    'use strict'
    if (cached) return cached
    class VDialog extends HTMLElement {
        #form
        static reject(t, v) {
            let q = t.#queue
            q.forEach(o => {
                o[1](v)
            })
            q.clear()
        }
        static resolve(t, v) {
            let q = t.#queue
            q.forEach(o => {
                o[0](v)
            })
            q.clear()
        }
        static observedAttributes = 'accept-charset autocapitalize autocomplete name rel action enctype method novalidate target'.split(' ')
        attributeChangedCallback(attr, _, val) {
            this.#form ? this.#form.setAttribute(attr, val) : setTimeout(() => {
                this.#form.setAttribute(attr, val)
            })
        }
        #queue = new Set
        get value() {
            return new Promise((resolve, reject) => {
                this.#queue.add([resolve, reject])
            })
        }
        reset() {
            this.#form.reset()
            this.dispatchEvent(new Event('reset'))
        }
        disconnectedCallback() {
            this.removeEventListener('click', onclick, true)
            this.removeEventListener('toggle', ontoggle, true)
        }
        #shadow = this.attachShadow({ mode: 'open', })
        constructor() {
            super()
            this.addEventListener('click', onclick, true)
            this.addEventListener('toggle', ontoggle, true)
            this.#shadow.innerHTML = `<style>:host{max-width: 100%;overflow-x: clip;word-break: break-word;}</style><slot></slot>`
            // this.addEventListener('beforetoggle', ontoggle, true)
        }
        connectedCallback() {
            this.setAttribute('popover', this.getAttribute('popover') || '')
            if (!this.#form) {
                let form = this.#form = ce('form')
                form.onsubmit = onsubmit
                form.style.cssText = 'display:contents !important;'
                let old = this.parentElement
                form.appendChild(this)
                old.appendChild(form)
            }
        }
    }
    function ontoggle(e) {
        e.newState === 'closed' && VDialog.reject(this, e)
    }
    // function oncommand(e) {
    //     console.log(e)
    //     switch (e.command) {
    //         case 'hide-popover':
    //             VDialog.reject(this)
    //             break
    //     }
    // }
    function onclick(e) {
        let ta = e.target
        ta.tagName === 'BUTTON' && ta.getAttribute('type') === 'reset' && e.currentTarget.reset()
    }
    function onsubmit(e) {
        let dialog = this.firstElementChild
        dialog.hasAttribute('default') || e.preventDefault()
        let s = new Event('submit')
        let elts = this.elements
        let out = [].slice.call(elts)
        let descr = { value: null, configurable: true, enumerable: false }
        for (let i in elts) {
            if (isNaN(i) && elts.hasOwnProperty(i) && i !== 'length') {
                descr.value = elts[i]
                Object.defineProperty(out, i, descr)
            }
        }
        VDialog.resolve(dialog, out)
        console.log(elts)
        dialog.dispatchEvent(s)
        s.defaultPrevented || dialog.hidePopover()
    }
    function ce(e) { return document.createElement(e) }
    customElements.define('v-dialog', VDialog)
}(customElements.get('v-dialog'))