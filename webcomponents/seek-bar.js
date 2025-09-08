import $,{define,} from '../yay.js'
import '../css.js'
const css = window[Symbol.for('CSS')]
import * as h from '../handle.js'
class SeekBar extends HTMLElement {
    connectedCallback() {
        let p = $(this)
        let shadow = p.attachShadow({mode: 'open'})
        let div = $('div #meter')
        let style = $('style', {
            textContent:
                `
                #meter {
                ${css.toCSS({
                    height: '14px',
                    '--dur': '1s',
                    transition: 'width var(--dur) linear',
                    'background-image': `repeating-linear-gradient(-45deg, transparent, transparent 1rem,darkred 1rem,darkred 2rem)`,
                    width: '150px',
                    'background-size': '300px 100%',
                    'border-radius': '10px',
                    animation: 'cycle 5s linear infinite',
                    'background-color': 'red'
                })}
                }
                @keyframes cycle {
                100% {
                ${css.toCSS({
                    'background-position-x': '-135px'
                })}
                }
                }
                :host { 
                ${css.toCSS({
                    width: '150px',
                    overflow: 'hidden',
                    'box-shadow': `0px 4px 7px 0px rgba(0,0,0,0.3)`,
                    height: '14px',
                    display: 'block',
                    'border-radius': '10px',
                    border: 'solid 2px black'
                })}
                }
                `
        })
        shadow.appendChild(style.valueOf())
        shadow.appendChild(div.valueOf())
        p.on({
            _click() {
                this.animate([
                    {transform: 'rotateZ(3deg)', 'background-color': 'red'}, {transform: 'rotateZ(-3deg)'}, {}
                ], {
                    duration: 40,
                    iterations: 4,
                    easing: 'ease-in'
                })
                div.style.width = '0'
            }
        })
    }
}

define('seek-bar', SeekBar)
h.addCustomEvent({
    move: true,
    hold: true,
    release: true
})