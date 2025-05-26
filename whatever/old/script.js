'use strict';
let indicators = ['Axis', 'Cosine', 'Swirl', 'Static', 'Reach', 'Twist', 'Flip', 'Disperse', 'Whip', 'Bounce', 'Chaos', 'Vacuum', 'Magnet', 'Unwind', 'Orbit', 'Wiggle', 'Swing', 'Zigzag', 'Flicker', 'Wave', 'Cubic', 'Stretch', 'Glitch', 'Clover', 'Star', 'test']
for (let i = 0; i < indicators.length; i++) {
    $('#modif').append(`<button name='x'class='tile${i ? ' deselected' : ' selected'}'>${indicators[i]}</button>`)
    $('#modif2').append(`<button name='y'class='tile${i ? ' deselected' : ' selected'}'>${indicators[i] === 'Cosine' ? 'Sine' : indicators[i]}</button>`)

}

$('.container2').append(`<div class='grid3'>
&nbsp;<button class='grid3' onclick='Import()'>Import 📥</button><button class='grid3' onclick='Export()'>Export 📤</button><button onclick='Copy()'>Copy</button>

<input type='text' placeholder='This is broken rn :(' id='saveField'>
</div>`)
$('.container2').append(`<div class='grid2'>
<div class='grid2'><span>X Intensity</span><input id='intensitX' type='text' value='1' class='grid2'><button>×2</button><button>÷2</button><br>
 <span>Y Intensity</span><input type='text' id='intensitY' value='1'class='grid2'><button>×2</button><button>÷2</button><br>
 <span>Spin Speed</span><input type='text' id='spin' value='0.05'  class='grid2'><button>×2</button><button>÷2</button><br>
 <span>Anim Dura.</span><input type='text' placeholder='Blank = Infinity' id='dura' value='100' class='grid2'><button>×2</button><button>÷2</button><br>
 <span>Size  !!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type='text' id='size' value='0.95' class='grid2 f'><button>+.01</button><button>-.01</button><br>
 <span>Layered !!</span><input class='check' id='layer' type='checkbox'><br>
 <span>Glow !!</span><input class='check' id='glow' type='checkbox'><br>

 <span>Loop</span><input type='checkbox' id='loop' class='check'><br>
 <span>Shape <select id='sel'>  
 
 <option value='quarter'>Quarter Circle</option>
 <option value='circle'>Circle !!</option>
 <option value='rectangle'>Rectangle</option>           
 <option value='special'>Petal</option>           
 <option value='text'>Text</option>           

 <option value='half'>Half Circle</option>           
 <option value='ellipse'>Ellipse</option>           
 <option value='2'>2</option>           
 <option value='3'>3</option>           
 <option value='4'>4</option>           
 <option value='5'>5</option>           
 <option value='6'>6</option>           
 <option value='7'>7</option>           
 <option value='8'>8</option>           
 <option value='9'>9</option>           
 <option value='10'>10</option>           

 </select></span><br>
 <span>Mirror <select id='mirror'>  
 <option value='none'>None</option>
 <option value='top'>Vertical</option>           
 <option value='left'>Horizontal</option>           
 <option value='both'>Both !!</option>           
           
 </select></span>
 </span><br>
 <span>Filter <select id='filter'>  
 <option value='source-over'>Default</option>
 <option value='destination-over'>Overlap !!</option>           
 <option value='lighter'>Lighter !!</option>           
 <option value='xor'>Glass !!</option>           
 <option value='luminosity'>Luminosity</option>           

 </select></span>
 <br>
 <span>Rainbow Style
 <br><input type='radio' value='Cycle' name='color1' checked><label>Cycle</label>
 <br><input type='radio' value='Gradual' name='color1'><label>Gradual</label></span>
  <br><input type='radio' value='CycleGradual' name='color1'><label>Spectrum</label></span>

 
 </div>
</div>`)
$('.container2').children().each(function () {
    let me = $(this)[0]
    if (me.className !== 'bottom' &&
        me.className !== 'bottomDiv' &&
        me.className !== 'scroll' &&
        me.className !== 'grid2' &&
        me.className !== 'zoomIn' &&
        me.className !== 'zoomOut') {
        $(this).hide()
    }
})
$('.grid2').children().children().each(function () {
    if (this.innerHTML === '×2') {
        $(this).on({
            click: function () {
                $(this).prev()[0].value *= 2
                updateSettings()
            }
        })
    }
    else if (this.innerHTML === '÷2') {
        $(this).on({
            click: function () {
                $(this).prev().prev()[0].value
                $(this).prev().prev()[0].value /= 2
                updateSettings()
            }
        })
    }
    else if (this.innerHTML === '+.01') {
        $(this).on({
            click: function () {
                $(this).prev()[0].value = +$(this).prev()[0].value + .01
                updateSettings()
            }
        })
    }
    else if (this.innerHTML === '-.01') {
        $(this).on({
            click: function () {
                $(this).prev().prev()[0].value -= .01
                updateSettings()
            }
        })
    }
    else {
        $(this).on({
            click: function () {
                updateSettings()
            }
        })
    }
})
function Show(w) {
    $('.container2').children().each(function () {
        let me = $(this)[0]
        if (me.className !== 'bottom' && me.className !== 'bottomDiv' && me.className !== 'scroll'
            &&
            me.className !== 'zoomIn' &&
            me.className !== 'zoomOut'
        ) {
            $(this).hide()
        }
    })
    let temp = {
        menu1: function () {
            $('#tweak')[0].className = 'bottom deselected'
            $('#save')[0].className = 'bottom deselected'
            $('#formula')[0].className = 'bottom'

            $('.container2').children().each(function () {
                let me = $(this)[0]
                if (me.className === 'grid') {
                    $(this).show()
                }
            })
        },
        menu2: function () {
            $('#tweak')[0].className = 'bottom'
            $('#save')[0].className = 'bottom deselected'
            $('#formula')[0].className = 'bottom deselected'
            $('.container2').children().each(function () {
                let me = $(this)[0]
                if (me.className === 'grid2') {
                    $(this).show()
                }
            })
        },
        menu3: function () {
            $('#tweak')[0].className = 'bottom deselected'
            $('#save')[0].className = 'bottom'
            $('#formula')[0].className = 'bottom deselected'
            $('.container2').children().each(function () {
                let me = $(this)[0]
                if (me.className === 'grid3') {
                    $(this).show()
                }
            })
        }
    }
    temp[w]()


}
Show('menu1')
let hidden = false
let selectedX = 'Axis',
    selectedY = 'Axis'
$('#modif').children().each(function () {
    $(this).on({
        click: function () {
            $('[name=x]').each(function () {
                this.className = 'tile deselected'
            })
            let old = selectedX
            selectedX = this.innerHTML
            console.log(old + ' => ' + selectedX)
            this.className = 'tile selected'
            updateSettings()
        }
    })
})
$('#modif2').children().each(function () {
    $(this).on({
        click: function () {
            $('[name=y]').each(function () {
                this.className = 'tile deselected'
            })
            let old = selectedY
            selectedY = this.innerHTML
            console.log(old + ' => ' + selectedY)
            this.className = 'tile selected'
            updateSettings()
        }
    })
})
function hideSettings() {
    if (!hidden) {
        $('.container2').animate({ left: -350, opacity: 0.2 })
        $('.scroll').html('Show')
        hidden = true
    }
    else {
        $('.container2').animate({ left: 20, opacity: 1 })
        $('.scroll').html('Hide')
        hidden = false
    }
}




let mirrorstyle = 'none'
const choose = (...a) => a[Math.floor(Math.random() * a.length)]



const body = $('body')[0]
let canvas = $('canvas')[0],
    col = 'red',
    ctx = canvas.getContext('2d')
let rot = 0
const rgb = {
    r: 255,
    b: 0,
    g: 0,
}
let currentSize;
canvas.width = 2000;
canvas.height = 1200
//Defs
let zoom = 1,
    Zoom = 1,
    text = "!! = may cause lag",
    text2 = '',
    animlength = 100,
    animspeed = 0.3,
    intensityX = 1,
    intensityY = 1,
    animstyle = false,
    glow = false,
    offset = {
        x: rot,
        y: rot
    },
    fill = false,
    shape = 'quarter',
    spinstyle = 'size',
    selectedText = null,
    filter = 'source-over',
    sizeMultiplier = 0.95,
    spinSpeed = 0.05,
    formula = (key, axis, size, rot) => {
        let sin = Math.sin,
            cos = Math.cos,
            asin = Math.asin,
            acos = Math.acos,
            cosh = Math.cosh,
            sinh = Math.sinh,
            k = key;
        if (key == null) {
            throw Error('Key is broken.')
        }
        if (axis === 'y') {
            sin = Math.cos
            cos = Math.sin
            acos = Math.asin
            asin = Math.acos
            sinh = Math.cosh
            cosh = Math.sinh
        }
        if (k === 'Sine') {
            k = 'Cosine'
        }
        let l = rot / size,
            ll = size / rot
        const container = {
            axis: rot,
            cosine: cos(rot) * 3,
            swirl: sin(rot / size) * 5,
            wiggle: (sin(rot * (rot / size)) + rot / size) * 5,
            unwind: sin(size / (rot + 0.0001)) * 4,
            static: sin(size) * 30,
            flip: sin(size + rot) * 20,
            twist: sin(size) * cos(rot) * 50,
            disperse: Math.atan2(cos(size), sin(size)) * rot,
            whip: ((rot / size) * sin(rot)) - cos(rot),
            bounce: Math.abs(sin(rot)) * 5,
            chaos: Math.random() * 10,
            vacuum: ((Math.pow(size, 2) - Math.pow(rot, 2)) / (size + 0.0001) * sin(rot / size) / 5) / size * rot,
            magnet: (size / rot),
            orbit: ((cos(rot / size) * rot) / (size * 10)) * 60,
            reach: size / 4,
            swing: sin(rot / size) * cos(rot / size) * rot,
            zigzag: (cos(rot / size) * sin(rot / size) * cos(rot / size) * Math.tan(rot / size)) * 20,
            flicker: frame % 2 ? sin(rot / size) * 5 : ((cos(rot / size) * rot) / (size * 10)) * 50,
            wave: cos(frame / size / rot) * (rot),
            cubic: cos(frame / size / rot) * (rot) * sin(rot / size) * sin(rot / size),
            stretch: cos(frame / size / rot) * (rot) * sin(rot / size) * sin(rot / size) * cos(rot / size),
            glitch: (cos(frame / size) * cos(size) * sin(rot / size) * size) ** Math.floor(Math.cos(rot)) * rot,
            clover: sin(rot / size * (cos(rot / size))) * (rot / size) * 10,
            star: ((cos(frame / size / rot) * (rot)) * ((cos(rot / size) * rot) / (size * 10)) * 60 * sin(rot / size)) / 10,
            test: Math.sqrt(l * l + ll * ll) * rot,
            //test: Math.asinh((cos(rot/size)*size))*acos(cos(rot)),
            //test: acos(sin(rot/size))* cosh(cos(rot))
        }

        return container[k.toLowerCase()]
    };


function cycleColour() {
    if (rgb.r === 255 && rgb.g !== 255 && rgb.b === 0) {
        rgb.g += increase
    }
    if (rgb.r !== 0 && rgb.g === 255 && rgb.b === 0) {
        rgb.r -= increase
    }
    if (rgb.r === 0 && rgb.g === 255 & rgb.b !== 255) {
        rgb.b += increase
    }
    if (rgb.r === 0 && rgb.g !== 0 && rgb.b === 255) {
        rgb.g -= increase
    }
    if (rgb.r !== 255 && rgb.g === 0 && rgb.b === 255) {
        rgb.r += increase
    }
    if (rgb.r === 255 && rgb.g === 0 && rgb.b !== 0) {
        rgb.b -= increase
    }
    if (rgb.r > 255) {
        rgb.r = 255
    }
    if (rgb.r < 0) {
        rgb.r = 0
    }
    if (rgb.g > 255) {
        rgb.g = 255
    }
    if (rgb.g < 0) {
        rgb.g = 0
    }
    if (rgb.b > 255) {
        rgb.b = 255
    }
    if (rgb.b < 0) {
        rgb.b = 0
    }
}
const increase = 1;
let rainbowType = 'Cycle'
ctx.lineJoin = "bevel";
function Draw(x, y, size, inverse) {
    if (size <= 2 || size >= 10500) {
        return
    }

    let rotation, drawRotStyle = 1;
    rotation = rot
    let SPIN = new Map(
        [['size', size / 20], ['x', Math.atan2(x, y) * 6], ['cursor', Math.atan2(offset.x, offset.y)], ['curve', 4]]
    )
    drawRotStyle = SPIN.get('curve')
    offset.x = formula(selectedX, 'x', size, rot)
    offset.y = formula(selectedY, 'y', size, rot)

    currentSize = size
    const coords = {
        x: x * zoom,
        y: y * zoom
    }, angle = rotation * (drawRotStyle * spinSpeed)
    ctx.translate(coords.x, coords.y)
    ctx.beginPath()
    ctx.rotate(angle)
    ctx.globalCompositeOperation = filter;
    ctx.lineWidth = 2.5
    if (glow) {
        ctx.shadowBlur = 15
    }
    else {
        ctx.shadowBlur = 0
    }
    if (rainbowType === 'Cycle') {

        ctx.shadowColor = ctx.strokeStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`
    }
    else if (rainbowType === 'CycleGradual') {
        ctx.shadowColor = ctx.strokeStyle = `hsl(${(100 - size * 2) - (frame % 360)},100%,50%)`
    }
    else {
        ctx.shadowColor = ctx.strokeStyle = `hsl(${(100 - size * 2)},100%,50%)`

    }
    //Using map instead of switch statements
    let cases = new Map([
        ['rectangle', () => {
            ctx.moveTo(size * 0.5 * zoom, size * 1.5 * zoom)
            ctx.lineTo(size * 0.5 * zoom, -size * 1.5 * zoom)
            ctx.lineTo(-size * 0.5 * zoom, -size * 1.5 * zoom)
            ctx.lineTo(-size * 0.5 * zoom, size * 1.5 * zoom)
            ctx.lineTo(size * 0.5 * zoom, size * 1.5 * zoom)
        }],
        ['special', () => {
            ctx.roundRect(-size / 2, -size / 2, size, size, [40, 10])
        }],
        ['text', () => {
            ctx.textRendering = 'geometricPrecision'
            ctx.font = `${size * zoom * 2}px lexend`
            ctx.textAlign = 'center'
            if (fill) {
                ctx.fillText(selectedText, 0, 10)
            }
            ctx.strokeText(selectedText, 0, 10)
        }],
        ['circle', () => {
            ctx.arc(0, 0, size * zoom, 0, 2 * Math.PI)

        }],
        ['quarter', () => {
            ctx.arc(0, 0, size * zoom, 0, 1.5 * Math.PI)
            ctx.lineTo(0, 0)
            ctx.closePath()
        }],
        ['half', () => {
            ctx.arc(0, 0, size * zoom, 0, Math.PI)
            ctx.closePath()
        }],
        ['ellipse', () => {
            ctx.ellipse(0, 0, (size * zoom), (size * zoom) / 1.5, Math.PI / 4, 0, 2 * Math.PI);
        }],
        ['default', () => {
            ctx.moveTo(0 + ((size * 1.4) * zoom) * Math.cos(0), 0 + ((size * 1.4) * zoom) * Math.sin(0));
            for (var i = 1; i <= +shape; i++) {
                ctx.lineTo(0 + ((size * 1.4) * zoom) * Math.cos(i * 2 * Math.PI / +shape), 0 + ((size * 1.4) * zoom) * Math.sin(i * 2 * Math.PI / +shape));
            }
            ctx.closePath();
        }]
    ])
    if (cases.has(shape)) {
        cases.get(shape)()
    }
    else {
        cases.get('default')()
        //cases.forEach(o=>o())
    }
    ctx.stroke()
    ctx.rotate(-angle)
    ctx.translate(-coords.x, -coords.y)
    if (fill) {
        ctx.fill()
    }
    try {
        if (inverse === 0) { Draw(x - (offset.x * distortion.x * intensityX), y - (offset.y * distortion.y * intensityY), size * sizeMultiplier, 0) }
        else if (inverse === 1) { Draw(x + (offset.x * distortion.x * intensityX), y + (offset.y * distortion.y * intensityY), size * sizeMultiplier, 1) }
        else if (inverse === 2) { Draw(x - (offset.x * distortion.x * intensityX), y + (offset.y * distortion.y * intensityY), size * sizeMultiplier, 2) }
        else if (inverse === 3) { Draw(x + (offset.x * distortion.x * intensityX), y - (offset.y * distortion.y * intensityY), size * sizeMultiplier, 3) }
    }
    catch (e) {
        text = 'An error has occurred:'
        ctx.fillStyle = 'red'
        text2 = e.message + '[error]'
        sizeMultiplier = 0.95
        throw e
        return;
    }

}

/*function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}*/
let distortion = {
    x: 1,
    y: 1
}
function updateSettings() {
    try {
        spinSpeed = $('#spin')[0].value
        shape = $('#sel')[0].value
        if (shape !== 'text') {
            selectedText = null
        }
        fill = $('#layer')[0].checked
        glow = $('#glow')[0].checked
        glow && console.warn('Shadow blur is enabled')
        mirrorstyle = $('#mirror')[0].value
        sizeMultiplier = $('#size')[0].value
        animlength = $('#dura')[0].value
        rainbowType = $('input:radio:checked')[0].value
        intensityY = $('#intensitY')[0].value
        intensityX = $('#intensitX')[0].value
        animstyle = $('#loop')[0].checked
        rot = 0
        filter = $('#filter')[0].value
        text = text2 = ''
        if (shape === 'text' && selectedText == null) {
            selectedText = prompt('Enter text') ?? null;
        }
    } catch (e) {
        text = 'An error has occurred:';
        text2 = e.message + '[error]'
        throw e
    }
}
const moving = [false, false, false, false, 0, 0]
let frame = 0
function Update() {
    frame = requestAnimationFrame(Update)
    cycleColour()
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    rot += animspeed
    //ctx.save()
    ctx.scale(Zoom, Zoom)
    if (Math.abs(rot) > Math.PI * animlength) {
        /*switch (animstyle) {
            default:
                rot = 0;
                break;
            case 'reverse':
                animspeed *= -1;
                break;
            case 'inverse':
                rot *= -1;
                break;
        }*/
        animstyle ? rot = 0.000001 : rot *= -1
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    //Use arrow keys
    if (moving[0]) {
        moving[4] -= 3 / Zoom
    }
    if (moving[1]) {
        moving[4] += 3 / Zoom
    }
    if (moving[2]) {
        moving[5] -= 3 / Zoom
    }
    if (moving[3]) {
        moving[5] += 3 / Zoom
    }

    try {
        switch (mirrorstyle) {
            case 'both':
                Draw((canvas.width / 2 / zoom) / Zoom + moving[5], (canvas.height / 2 / zoom) / Zoom + moving[4], 100, 3)
                Draw((canvas.width / 2 / zoom) / Zoom + moving[5], (canvas.height / 2 / zoom) / Zoom + moving[4], 100, 1)
            case 'top':
                Draw((canvas.width / 2 / zoom) / Zoom + moving[5], (canvas.height / 2 / zoom) / Zoom + moving[4], 100, 2)
                break;
            case 'left':
                Draw((canvas.width / 2 / zoom) / Zoom + moving[5], (canvas.height / 2 / zoom) / Zoom + moving[4], 100, 3)
                break;
        }
        //Recursive Draw
        Draw((canvas.width / 2 / zoom) / Zoom + moving[5], (canvas.height / 2 / zoom) / Zoom + moving[4], 100, 0)
        //ctx.restore()


    } catch (e) {
        text = 'An error has occurred:'
        ctx.fillStyle = 'red'
        text2 = e.message + '[error]'
        sizeMultiplier = 0.95
        throw e
    }
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.font = "30px lexend";
    ctx.fillText(text, window.innerWidth / 2, window.innerHeight / 2);
    if (text2.includes('[error]')) {
        ctx.fillStyle = '#FF3333'
    }
    ctx.fillText(text2.replace('[error]', ''), window.innerWidth / 2, (window.innerHeight / 2) + 40);


}
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        moving[0] = true;
        moving[1] = false;
    }
    if (e.key === 'ArrowDown') {
        moving[1] = true;
        moving[0] = false;
    }
    if (e.key === 'ArrowLeft') {
        moving[2] = true;
        moving[3] = false;
    }
    if (e.key === 'ArrowRight') {
        moving[2] = false;
        moving[3] = true;
    }

})
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        moving[0] = false;
    }
    if (e.key === 'ArrowDown') {
        moving[1] = false;
    }
    if (e.key === 'ArrowLeft') {
        moving[2] = false;
    }
    if (e.key === 'ArrowRight') {
        moving[3] = false;
    }
})

requestAnimationFrame(Update)

/*canvas.addEventListener('mousemove', (e) => {
    mousepos.x = e.x
    mousepos.y = e.y
})*/
$('canvas').on({
    mousedown: updateSettings
})
$(document).on({
    wheel: function (event) {
        zoom += Math.sign(event.originalEvent.wheelDeltaY) * 0.01
        zoom = Math.max(0.004, zoom)

        // Zoom += Math.sign(event.originalEvent.wheelDeltaY) * 0.05
        // ctx.scale(Zoom,Zoom)
    }
})
function zOOm() {

}
function Export() {
    let settings = {
        x: selectedX,
        y: selectedY,
        ix: intensityX,
        iy: intensityY,
        rotSpeed: spinSpeed,
        dura: animlength,
        mult: sizeMultiplier,
        layered: fill,
        glow: glow,
        loop: animstyle,
        shape: shape,
        filter: filter,
        mirror: mirrorstyle,
        rainbow: rainbowType,
        text: selectedText,

    }
    let txt = JSON.stringify(settings)
    $('#saveField')[0].value = txt
}
async function Copy() {
    await navigator.clipboard.writeText($('#saveField')[0].value)
    text = 'Copied ✅'
}
function Import() {
    try {
        let data = JSON.parse($('#saveField')[0].value);
        console.log(data)
        $('#spin')[0].value = data.rotSpeed
        $('#sel')[0].value = data.shape
        $('#layer')[0].checked = data.fill
        $('#glow')[0].checked = data.glow
        $('#mirror')[0].value = data.mirror
        $('#size')[0].value = data.mult
        $('#dura')[0].value = data.animlength
        selectedText = data.text
        $('input:radio').each(function () {
            this.checked = false
        }).each(function () {
            if ($(this).val() === data.rainbow) {
                this.checked = true
            }
        })
        $('#intensitY')[0].value = data.iy
        $('#intensitX')[0].value = data.ix
        $('#loop')[0].checked = data.loop
        $('#filter')[0].value = data.filter
        updateSettings()
    }
    catch (e) {
        text = 'An error has occured:'
        text2 = e.message + '[error]'
        throw e
    }
}
