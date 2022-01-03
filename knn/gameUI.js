/**
 * drag.js
 * @param {eleCanvas} canvas ID
 * @param {zoom} 座標之間的間距
 * @constructor
 */
class GameUI {
  constructor(eleCanvas, zoom) {
    this.circles = [];
    this.tiers = [];
    this.k = this.d = 1;
    GameUI.serial = 1;
    this.initUI(eleCanvas, zoom);
    this.setKnn();
  }

  setKVal(k) {
    this.knn.setKVal(this.k = k);
  }

  setDVal(d) {
    this.d = d;
  }

  setKnn() {
    this.knn = new KNN(this.zoom, this.rate);
  }

  /**
   * 設定背影圖片
   * @param {string} url - 背景圖片網址 https://......
   * @param {string} alpha - 背景圖片透明度 0(不透明)～1(完全透明)
   */
  setBackgroundImage(url, alpha) {
    this.knn.setBackgroundImage(url, alpha);
  }

  initUI(eleCanvas, zoom) {
    this.canvas = eleCanvas;
    this.stdRadius = 6; //point radius
    this.lastX;
    this.lastY;
    this.isDown = false;
    this.draggingCircle = -1;
    this.zoom = zoom;
    this.rate = 10.0;
    this.PI2 = Math.PI * 2;
    var self = this;
    // canvas related variables
    // references to canvas and its context and its position on the page
    this.ctx = eleCanvas.getContext("2d");
    this.cw = eleCanvas.width;
    this.ch = eleCanvas.height;
    this.offsetX = eleCanvas.offsetLeft;
    this.offsetY = eleCanvas.offsetTop;
    // listen for mouse events
    /*
    this.canvas.addEventListener('mousedown', e => {
      self.handleMouseDown.call(self, e);
    });
    this.canvas.addEventListener('mousemove', e => {
      self.handleMouseMove.call(self, e);
      var x = self.draggingCircle.x / self.zoom;
      var y = self.draggingCircle.y / self.zoom;
      if (self.isDown) {
        self.showNearest(self.draggingCircle, x, y);
        self.drawAll();
      }
    });
    this.canvas.addEventListener('mouseup', e => {
      this.isDown = false;
      this.drawAll();
      self.resetCircleColor();
      self.handleMouseUp.call(self, e);
    });
    this.canvas.addEventListener('mouseout', e => {
      this.isDown = false;
      this.drawAll();
      //self.handleMouseUp.call(self, e);
      self.resetCircleColor();
    });
    //*/;
  }

  showNearest(circle, x, y) {
    this.resetCircleColor();
    var data = this.knn.nearest.call(this.knn, x, y, this.k, this.d);
    for (var i = 0; i < data.length; i++) {
      data[i][0].color = this.getNestColor();
    }
    circle.color = this.getMoveColor();
  }

  resetCircleColor() {
    for (var i = 0; i < this.circles.length; i++) {
      var color = this.circles[i].defColor == null ? this.getColor() : this.circles[i].defColor;
      this.circles[i].color = color;

    }
  }

  restart(saveCircles) {
    GameUI.serial = 1;
    this.tiers = [];
    this.circles = [];
    this.setKnn();
    for (var i = 0; i < saveCircles.length; i++) {
      this.addCircle({
        x: saveCircles[i].kx,
        y: saveCircles[i].ky
      });
    }
  }


  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  delObj(obj) {
    const index = this.circles.indexOf(obj);
    if (index > -1) {
      this.circles.splice(index, 1);
    }
    this.knn.remove(obj);
    this.drawAll();
  }

  addObj(obj) {
    obj.kx = obj.x;
    obj.ky = obj.y;
    obj.x = obj.x * this.zoom;
    obj.y = obj.y * this.zoom;
    obj.serial = GameUI.serial++;
    obj.tier = typeof obj.tier == 'undefined' ? 0 : obj.tier;
    obj.merge = typeof obj.merge == 'undefined' ? false : obj.merge;
    obj.defColor = typeof obj.color != 'undefined' ? obj.color : null;
    obj.color = typeof obj.color == 'undefined' ? this.getColor() : obj.color;
    obj.radius = typeof obj.radius == 'undefined' ? this.stdRadius : obj.radius;
    obj.mergeRadius = typeof obj.mergeRadius == 'undefined' ? 0 : obj.mergeRadius;
    obj.img.style.top = (this.canvas.offsetTop + obj.y - obj.img.height / 2) + "px";
    obj.img.style.left = (this.canvas.offsetLeft + obj.x - obj.img.width / 2) + "px";
    obj.img.addEventListener("click", obj.click);
    this.knn.remove(obj);
    this.knn.insert(obj);
    var empty = true;
    for (var i = 0; i < this.circles.length; i++) {
      if (obj == this.circles[i]) empty = false;
    }
    if (empty) {
      this.circles.push(obj);
    }
    this.drawAll();
    return obj;
  }

  drawCircle(circle) {
    var ctx = this.ctx;
    ctx.font = "16px Arial";
    var x = Math.round(this.rate * circle.x) / this.rate;
    var y = Math.round(this.rate * circle.y) / this.rate;
    ctx.beginPath();
    ctx.fillStyle = circle.defColor == null ? circle.color : circle.defColor;
    ctx.strokeStyle = circle.defColor == null ? circle.color : circle.defColor;
    ctx.arc(x, y, circle.radius, 0, this.PI2);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x, y, circle.mergeRadius * this.zoom, 0, this.PI2);
    ctx.stroke();
    var kx = Math.round(this.rate * x / this.zoom) / this.rate;
    var ky = Math.round(this.rate * y / this.zoom) / this.rate;
    ctx.fillText('(' + circle.serial + ")[" + kx + "," + ky + "]", x + 5, y - 10);
    ctx.closePath();
  }

  // clear the canvas and redraw all existing circles
  drawAll() {
    var ctx = this.ctx;
    ctx.font = "16px Arial";
    ctx.clearRect(0, 0, this.cw, this.ch);
    for (var i = 0; i < this.circles.length; i++) {
      var circle = this.circles[i];
      var x = Math.round(this.rate * circle.x) / this.rate;
      var y = Math.round(this.rate * circle.y) / this.rate;
      ctx.beginPath();
      ctx.fillStyle = circle.color;
      ctx.arc(x, y, circle.radius, 0, this.PI2);
      ctx.fill();
      ctx.closePath();
      //var w = circle.img.width;
      //var h = circle.img.height;
      //ctx.drawImage(circle.img, x-w/2,y-h/2,w,h);
      if (this.isDown && this.draggingCircle == circle) {
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.setLineDash([5, 15]);
        ctx.arc(x, y, this.d * this.zoom, 0, this.PI2);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
      }
      var kx = Math.round(this.rate * x / this.zoom) / this.rate;
      var ky = Math.round(this.rate * y / this.zoom) / this.rate;
      ctx.fillText('(' + circle.serial + ")[" + kx + "," + ky + "]", x + 5, y - 10);
    }
  }

  handleMouseDown(e) {
    // tell the browser we'll handle this event
    e.preventDefault();
    e.stopPropagation();
    // save the mouse position
    // in case this becomes a drag operation
    this.lastX = parseInt(e.clientX - this.offsetX);
    this.lastY = parseInt(e.clientY - this.offsetY);
    // hit test all existing circles
    var hit = -1;
    for (var i = 0; i < this.circles.length; i++) {
      var circle = this.circles[i];
      var dx = this.lastX - circle.x;
      var dy = this.lastY - circle.y;
      if (dx * dx + dy * dy < circle.radius * circle.radius) {
        hit = i;
        circle.color = this.getMoveColor();
        this.knn.remove(circle);
        this.showNearest(circle, circle.kx, circle.ky);
        this.drawAll();
      }
    }
    // if no hits then add a circle
    // if hit then set the isDown flag to start a drag
    if (hit < 0) {
      var newDot = {
        x: this.lastX / this.zoom,
        y: this.lastY / this.zoom,
        radius: this.stdRadius,
        color: this.getColor()
      };
      console.log("new:", newDot.x, newDot.y);
      //this.addCircle(newDot);
    } else {
      this.draggingCircle = this.circles[hit];
      this.isDown = true;
    }
  }

  handleMouseUp(e) {
    // tell the browser we'll handle this event
    e.preventDefault();
    e.stopPropagation();
    //
    if (this.draggingCircle != -1) {
      this.draggingCircle.x = Math.round(this.rate * this.draggingCircle.x / this.zoom) / this.rate;
      this.draggingCircle.y = Math.round(this.rate * this.draggingCircle.y / this.zoom) / this.rate;
      this.addObj(this.draggingCircle);
    }
    // stop the drag
    this.isDown = false;
    this.draggingCircle = -1;
  }

  handleMouseMove(e) {
    // if we're not dragging, just exit
    if (!this.isDown) {
      return;
    }
    // tell the browser we'll handle this event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    this.mouseX = parseInt(e.clientX - this.offsetX);
    this.mouseY = parseInt(e.clientY - this.offsetY);
    // calculate how far the mouse has moved
    // since the last mousemove event was processed
    var dx = this.mouseX - this.lastX;
    var dy = this.mouseY - this.lastY;
    // reset the lastX/Y to the current mouse position
    this.lastX = this.mouseX;
    this.lastY = this.mouseY;
    // change the target circles position by the 
    // distance the mouse has moved since the last
    // mousemove event
    this.draggingCircle.x += dx;
    this.draggingCircle.y += dy;
  }

  getColor() {
    return ('#000');
  }

  getMoveColor() {
    return ('#f03366');
  }

  getNestColor() {
    return ('#4ad84a');
  }

  getMergeColor() {
    return ('#1133fa');
  }
}