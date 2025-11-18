import $,{define,base,prox} from '../yay.js'
import '../css.js'
const css = window[Symbol.for('[[CSSModule]]')]
console.warn('img-sprite is deprecated, use sprite-runner instead.')
class AnimatedSprite extends HTMLElement {
    static observedAttributes = 'cols rows src width height duration direction index alt'.split(' ')

    #animate() {
        let p = prox(this)
        if (this.#axis === 'horizontal') {
            p.setStyles({
                'background-position-y': `calc((mod(var(--axis), var(--grid-height))*var(--height)) * -1)`,
                animation: `horizontal ${this.#duration * this.getAttribute('cols') | 0}ms steps(var(--grid-width), end) ${this.#direction} infinite`
            })
        } else if (this.#axis === 'vertical') {
            p.setStyles({
                'background-position-x': `calc((mod(var(--axis), var(--grid-width))*var(--width)) * -1)`,
                animation: `vertical ${this.#duration * this.getAttribute('rows') | 0}ms steps(var(--grid-height), end) ${this.#direction} infinite`
            })
        }
    }

    #duration = 1000
    #axis = 'horizontal'
    #direction = 'normal'

    async attributeChangedCallback(name, oValue, nValue) {
        let p = prox(this)
        if (/^(?:cols|rows)$/.test(name)) {
            p.setStyles({
                [`--grid-${name === 'cols' ? 'width' : 'height'}`]: `${nValue}`
            })
            this.#animate()
        } else if (/^(?:width|height)$/.test(name)) {
            if (!CSS.supports('width', nValue)) nValue += 'px'
            p.setStyles({
                [`--${name}`]: nValue
            })
            this.#animate()
        } else if (name === 'alt') {
            p.setStyles({
                '--alt': `"${this.getAttribute('alt')}"`
            })
        } else if (name === 'src') {
                p.setStyles({
                '--sprite': `url(${nValue})`,
            })
            
            this.#animate()
        } else if (name === 'axis') {
            if (nValue !== 'horizontal' && nValue !== 'vertical') nValue = 'horizontal'
            this.#axis = nValue
        } else if (name === 'duration') {
            this.#duration = nValue
            this.#animate()
        } else if (name === 'direction') {
            if (!/^(?:normal|reverse|alternate(?:-reverse)?)$/.test(nValue)) nValue = 'normal'
            this.#direction = nValue
            this.#animate()
        } else if (name === 'index') {
            p.setStyles({
                '--axis': (nValue | 0) % (this.#axis === 'horizontal' ? p.attr.rows : p.attr.cols)
            })
        }
    }
    disconnectedCallback(){
       $(this).cancelAnims()
    }
    connectedCallback() {
        this.attachShadow({mode: 'open'}).appendChild(base($(`style`, {
            textContent:
                `
@property --sprite {
  syntax: "<image>";
  inherits: false;
  initial-value: url("");
}
@property --width {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 30px;
}
@property --height {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 30px;
}
@property --grid-width {
  syntax: "<integer>";
  initial-value: 8;
  inherits: false;
}
@property --grid-height {
  syntax: "<integer>";
  initial-value: 8;
  inherits: false;
}
@property --alt {
  syntax: "*";
  initial-value: "";
  inherits: false;
}
:host {
        ${css.toCSS({
                    width: 'var(--width)',
                    '--axis': 0,
                    // 'animation-composite':'add'
                    display: 'block',
                    height: 'var(--height)',
                    'background-image': 'var(--sprite)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'calc(var(--width) * var(--grid-width)) calc(var(--height) * var(--grid-height))'
                })}
}
:host::before {
                        content:var(--alt);
}
@keyframes horizontal {
  0% {
  ${css.toCSS({
                    'background-position-x': '0px'
                })}
  }
  100% {
  ${css.toCSS({
                    'background-position-x': 'calc(var(--width) * -1 * var(--grid-width))'
                })}
  }
}
@keyframes vertical {
  0% {
  ${css.toCSS({
                    'background-position-y': '0px'
                })}
  }
  100% {
   ${css.toCSS({
                    'background-position-y': 'calc(var(--height) * -1 * var(--grid-height))'
                })}
  }
}
`
        })))
    }
}

define('img-sprite', AnimatedSprite)
