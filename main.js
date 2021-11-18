let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

// to ensure everything is loaded before the script runs:
window.onload = function() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
}

// to make canvas responsve on window resize: - something i did broke this
// window.addEventListener('resize', function() {
//   cancelAnimationFrame(flowFieldAnimation);
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   flowField = new FlowFieldEffect(canvas.width, canvas.height);
//   flowField.animate(0);
// });

// mouse functionality
const mouse = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', function(e) {
  mouse.x = e.x;
  mouse.y = e.y;  
})

// user controls
let userVelocityCtrl = document.querySelector('#userVelocity');
let userLineWidthCtrl = document.querySelector('#userLineWidth');
let userDensityCtrl = document.querySelector('#userDensity');
let userVelocity;
let userLineWidth;
let userDensity;

userVelocityCtrl.addEventListener('click', changeVelocity);
userLineWidthCtrl.addEventListener('click', changeLineWidth);
userDensityCtrl.addEventListener('click', changeDensity);

function changeVelocity() {
  userVelocity = (userVelocityCtrl.value) * 0.01;
  flowField.vr = userVelocity;
}

function changeLineWidth() {
  userLineWidth = userLineWidthCtrl.value;
  flowField.ctx.lineWidth = userLineWidth;
}

function changeDensity() {
  userDensity = userDensityCtrl.value;
}

/* change colours - not working 
    I'm having trouble accessing the colors in the 
    create gradient method of flowFieldEffect
for (let i = 0; i < colorPicker.length; i++) {
  colorPicker[i].addEventListener('click', changeColors);
}
let colorPicker = document.querySelectorAll('.colorPick')
let colorCtrl1 = document.getElementById('color1');
let colorCtrl2 = document.getElementById('color2');
let colorCtrl3 = document.getElementById('color3');
let colorCtrl4 = document.getElementById('color4');
let colorCtrl5 = document.getElementById('color5');
let colorCtrl6 = document.getElementById('color6');
function changeColors() {
  // struggling with this one.
}
*/
// END USER CONROLS


// classes encapsulate data, then work on the data with their methods
// encapsulation is the bundling of data and methods that act on that data
// in a way, that access to that data is restricted from outside the bundle

  // sidenote: function declarations are hoisted, class declarations are not
class FlowFieldEffect {
  // private class fields (begin with #)
  // #ctx;
  #width;
  #height;
  // constructor is a mandatory method all classes must have
  constructor(ctx, width, height) {
    // this.ctx = ctx;
    this.ctx = ctx;
    this.ctx.lineWidth = 3;
    this.#width = width;
    this.#height = height;
    this.angle = 0; 
    this.lastTime = 0;
    this.interval = 1000/10;  // 60 FPS
    this.timer = 0; 
    this.cellSize = 10;
    this.gradient;
    this.createGradient();
    this.ctx.strokeStyle = this.gradient;
    this.radius = 0;
    this.vr = 0.03;    
  }
  createGradient() {
    this.color1 = '#8484ff';
    this.color2 = '#89beff';
    this.color3 = '#a0ffd1';
    this.color4 = '#fff09b';
    this.color5 = '#beff93';
    this.color6 = '#7c9dff';
    this.gradient = this.ctx.createLinearGradient(0, 0, this.#width, this.#height);
    this.gradient.addColorStop('0.1', this.color1);
    this.gradient.addColorStop('0.2', this.color2);
    this.gradient.addColorStop('0.4', this.color3);
    this.gradient.addColorStop('0.6', this.color4);
    this.gradient.addColorStop('0.8', this.color5);
    this.gradient.addColorStop('0.9', this.color6);
  }
  #drawLine(angle, x, y) {
    let positionX = x;
    let positionY = y;
    let dx = (mouse.x - positionX) * 5;
    let dy = (mouse.y - positionY) * 5;
    let distance = dx * dx + dy * dy;
    if (distance > 600000) {
      distance = 600000;
    } else if (distance < 50000) {
      distance = 50000;
    }
    let length = distance * 0.00008;
    this.ctx.beginPath();  // start drawing a new shape
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.ctx.stroke();
  }
  animate(timeStamp) {
    const deltaTime = timeStamp + this.lastTime;
    this.lastTime = timeStamp;
    if (this.timer > this.interval) {
      this.ctx.clearRect(0, 0, this.#width, this.#height);
      this.angle += 0.3;
      this.radius += this.vr;
      if (this.radius > 9 || this.radius < -9) {
        this.radius *= -1;
      }
      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          const angle = (Math.cos(x * 0.009) + Math.sin(y * 0.009)) * this.radius;
          this.#drawLine(angle, x, y); 
        }
      }
      this.timer = 0; 
    } else {
      this.timer += deltaTime;
    }
    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}
