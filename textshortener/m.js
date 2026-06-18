import * as v from '../v4.js'
const { $ } = v
import { plural } from '../str.js'
import { jason } from '../arrays.js'
v.id.paste.on({
    async click() {
        let t
        try {
            t = await navigator.clipboard.readText()
        } catch {
            t = prompt('Paste text:')
        } finally {
            txt.value = t
            txt.dispatchEvent(new Event('input'))
        }
    }
})
const savedEl = v.id.saved
const input = v.id.txt
const output = document.getElementById('output') // new output textarea
let shortenedText = ''
let abc = 'abcdefghijklmnopqrstuvwxyz'
let aa = await fetch('./subs.json').then(o => o.json())
const substitutes = (aa)
    .map(([a, b, i]) => [RegExp(a, 'g' + (i || '')), b])
    .sort(([a], [b]) =>
        b.source.replaceAll('\\', '').normalize().length -
        a.source.replaceAll('\\', '').normalize().length
    )
console.log(substitutes)

function shortenText(og) {
    let text = og
    substitutes.forEach(({ 0: regex, 1: replacement }) => {
        text = text.replace(regex, replacement)
    })
    return text
}
v.id.txt.on({
    input() {
        const original = this.value
        shortenedText = shortenText(original)
        const saved = original.length - shortenedText.length
        savedEl.textContent = `Saving ${plural('character', 'characters', saved)}`
        output.value = shortenedText
    }
})
v.id.copyShort.on({
    async click() {
        if (shortenedText)
            try {
                await navigator.clipboard.writeText(shortenedText)
                let btn = v.id.copyShort
                , orig = btn.textContent
                btn.textContent = 'Copied!'
                setTimeout(() => { btn.textContent = orig }, 1500)
            } catch {
                prompt('Shortened text:', shortenedText)
            } finally {
                console.log(shortenedText)
            }
    }
})
input.value &&
    input.dispatchEvent(new Event('input'))
