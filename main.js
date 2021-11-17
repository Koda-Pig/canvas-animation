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

// to make canvas responsve on window resize:
window.addEventListener('resize', function() {
  cancelAnimationFrame(flowFieldAnimation);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
});

// mouse functionality
const mouse = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', function(e) {
  mouse.x = e.x;
  mouse.y = e.y;  
})

// classes encapsulate data, then work on the data with their methods
// encapsulation is the bundling of data and methods that act on that data
// in a way, that access to that data is restricted from outside the bundle

  // sidenote: function declarations are hoisted, class declarations are not
class FlowFieldEffect {
  // private class fields (begin with #)
  #ctx;
  #width;
  #height;
  // constructor is a mandatory method all classes must have
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#ctx.lineWidth = 0.6;
    this.#width = width;
    this.#height = height;
    this.angle = 0; 
    this.lastTime = 0;
    this.interval = 1000/60;  // 60 FPS
    this.timer = 0; 
    this.cellSize = 18;
    this.gradient;
    this.#createGradient();
    this.#ctx.strokeStyle = this.gradient;
    this.radius = 0;
    this.vr = 0.03;
  }
  #createGradient() {
    this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
    this.gradient.addColorStop('0.1', '#8484ff');
    this.gradient.addColorStop('0.2', '#89beff');
    this.gradient.addColorStop('0.4', '#a0ffd1');
    this.gradient.addColorStop('0.6', '#fff09b');
    this.gradient.addColorStop('0.8', '#beff93');
    this.gradient.addColorStop('0.9', '#7c9dff');
  }
  #drawLine(angle, x, y) {
    let positionX = x;
    let positionY = y;
    let dx = (mouse.x - positionX) * 2;
    let dy = (mouse.y - positionY) * 2;
    let distance = dx * dx + dy * dy;
    if (distance > 600000) {
      distance = 600000;
    } else if (distance < 50000) {
      distance = 50000;
    }
    let length = distance / 10000;
    this.#ctx.beginPath();  // start drawing a new shape
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + Math.cos(angle*2) * length, y + Math.sin(angle*2) * length);
    this.#ctx.stroke();
  }
  animate(timeStamp) {
    const deltaTime = timeStamp + this.lastTime;
    this.lastTime = timeStamp;
    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.angle += 0.1;
      this.radius += this.vr;
      if (this.radius > 5 || this.radius < -5) {
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
