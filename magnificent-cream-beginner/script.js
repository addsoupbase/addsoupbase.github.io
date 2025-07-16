 const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext("2d");
  canvas.width = this.innerWidth * 0.95
  const ID = id()
  const updateInterval = 20;
  let all = []
  let runSpeed = 3;

  function* id() {
    let i = 0;
    for (;;) {
      yield i++
    }
  }
  class entity {  
    constructor(x, y, size, color,name) {
      this.id = ID.next().value;
      this.x = x || 0;
      this.y = y || 0;
      this.name = name || 'Object';
      this.size = size || 1;
      this.weight = 0;
      this.density = 5;
      this.color = color || 'red'
      this.velocity = {
        x: 0,
        y: 0
      }
      all.push(this)
    }
    newPos() {
      this.velocity.y += this.weight;
      this.x += this.velocity.x / runSpeed;
      this.y += this.velocity.y / runSpeed;
      if (this.y > canvas.height - this.size) {
        this.y = canvas.height - this.size;
        this.velocity.y = -this.velocity.y + this.weight * this.density;
      }
      if (this.x > canvas.width - this.size) {
        this.x = canvas.width - this.size;
        this.velocity.x = -this.velocity.x + this.weight * this.density;
      }
      if (this.x < this.size) {
        this.x = this.size;
        this.velocity.x = -this.velocity.x - this.weight * this.density;
      }
    }
    draw() {
      let text = this.name;
      const darker = this.color = (this.color & 0xfefefe) >> 1;
      this.newPos();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1, 0, 2 * Math.PI);
      ctx.stroke()
      ctx.font = `${this.size}px Arial`;
      switch(this.name) {
        case 'run':
        text='🏃'
        break;
        case 'walk':
        text='🚶'
        break;
        case'snail':
        text='🐌'
        break;
        case'tortoise':
        text='🐢'
        break;
        case'car':
        text='🚗'
        break;
           case'car2':
        text='🏎'
        break;
        case'bullet':
        text='🔫'
        break;
        case 'sound':
        text='🔊'
        break;
        case'plane':
        text='🛩'
        break;
        case'jet':
        text='✈️'
        break;
        case'light':
          case'1light':
         text='🔆'
        break;
        case'train':
        text='🚂'
        break;
        case'train2':
        text='🚄'
        break;
        case'shuttle':
        text='🛰'
        break;
        case'rocket':
        text='🚀'
        break;
        case'cheetah':
        text='🐆'
        break;
        case'falcon':
        text='🦅'
        break;
         case'bird':
        text='🐦‍⬛'
        break;
        case'baseball':
        text='⚾️'
        break;
        case'nail':
        text='💅'
        break;
        case'terminal':
        text='🌎'
        break;
          case'comet':
        text='☄️'
        break;
        default:
        text = '🚶'
      }
      ctx.fillText(text, this.x - this.size/1.7, this.y + this.size / 4);
    }
  }

  let b = new entity(0, 30, 30)
  let e = new entity(0, 200, 30)

  function update() {
     requestAnimationFrame(update)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let obj of all) {
      obj.draw()
    }
  }

  function speed(o, value) {
    o.x = 0
    switch (value) {
      case 'run':
        o.velocity.x = 8;
        break;
      case 'walk':
        o.velocity.x = 2.6;
        break;
        case 'snail':
        o.velocity.x = 0.03;
        break;
         case 'tortoise':
        o.velocity.x = 0.62;
        break;
      case 'car2':
        o.velocity.x = 231;
        break;
      case 'car':
        o.velocity.x = 18;
        break;
      case 'bullet':
        o.velocity.x = 1360;
        break;
      case 'sound':
        o.velocity.x = 761;
        break;
      case 'light':
        o.velocity.x = 670e+6;
        break;
      case 'plane':
        o.velocity.x = 500;
        break;
      case 'jet':
        o.velocity.x = 4500;
        break;
         case 'train':
        o.velocity.x = 79;
        break;
        case 'train2':
        o.velocity.x = 200;
        break;
         case 'shuttle':
        o.velocity.x = 3000;
        break;
         case 'rocket':
        o.velocity.x = 10e+3;
        break;
          case 'cheetah':
        o.velocity.x = 68;
        break;
        case 'falcon':
        o.velocity.x = 237;
        break;
        case 'bird':
        o.velocity.x = 33;
        break;
        case'baseball':
        o.velocity.x = 75;
        break;
        case'nail':
        o.velocity.x = 0.0000223694 / 365;
        break;
        case'terminal':
        o.velocity.x=120;
        break;
        case'comet':
        o.velocity.x=27e+3;
        break;
          case'1light':
        o.velocity.x=670e+6 * 0.0001;
        break;
          case'10light':
        o.velocity.x=670e+6 * 0.01;
        break;
         case'50light':
        o.velocity.x=670e+6 * 0.05;
        break;
    }
  }
  const f = document.getElementById('speed1')
 let menu = f.cloneNode(true);
  menu.id='speed2'
  document.body.appendChild(menu);

 
  function go() {
    const data = {speed1:document.getElementById('speed1').value, speed2:document.getElementById('speed2').value}
    runSpeed = document.getElementById('distance').value
    b.name = data.speed1;
    e.name = data.speed2;
    speed(b, data.speed1)
    speed(e, data.speed2)
  }

 requestAnimationFrame(update)