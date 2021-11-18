let canvas;
let ctx;
let flowField;
let flowFieldAnimation;
let userVelocity;
let userLineWidth;
let userVelocityCtrl;
let userLineWidthCtrl;

// to ensure everything is loaded before the script runs:
window.onload = function() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  userVelocityCtrl = document.querySelector('#userVelocity');
  userLineWidthCtrl = document.querySelector('#userLineWidth');
  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
}

// mouse functionality
const mouse = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', function(e) {
  mouse.x = e.x;
  mouse.y = e.y;  
})

window.addEventListener('mouseover', userControls);

function userControls() {
  userVelocityCtrl.addEventListener('click', changeVelocity);
  userLineWidthCtrl.addEventListener('click', changeLineWidth);
  
  function changeVelocity() {
    flowField.vr = userVelocityCtrl.value * 0.01;
  }
  
  function changeLineWidth() {
    flowField.ctx.lineWidth = userLineWidthCtrl.value;
  }
}

class FlowFieldEffect {
  #width;
  #height;
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.ctx.lineWidth = 2;
    this.#width = width;
    this.#height = height;
    this.angle = 0; 
    this.lastTime = 0;
    this.interval = 1000/60;  // 60 FPS
    this.timer = 0; 
    this.cellSize = 12;
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
    this.ctx.beginPath();
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