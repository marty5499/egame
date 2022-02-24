/**
 * @param {eleCanvas} canvas ID
 * @param {zoom} 座標之間的間距
 * @constructor
 */
class GameUI {

  setConfig(cfg) {
    this.config = {};
    this.config.zoom = cfg.zoom != undefined ? cfg.zoom : 50;
    this.config.canvasId = cfg.canvasId;
    this.config.strokeStyle = cfg.strokeStyle != undefined ? cfg.strokeStyle : "#cecece";
    this.config.grid = cfg.grid != undefined ? cfg.grid : true;
    this.config.backgroundImageURL = cfg.backgroundImageURL != undefined ? cfg.backgroundImageURL : '';
    this.config.backgroundImageAlpha = cfg.backgroundImageAlpha != undefined ? cfg.backgroundImageAlpha : 0.9;
    this.config.lineWidth = cfg.lineWidth != undefined ? cfg.lineWidth : 2;
    this.config.kVal = cfg.kVal != undefined ? cfg.kVal : 3;
    this.config.dVal = cfg.dVal != undefined ? cfg.dVal : 3;
    this.clickEvent = cfg.clickEvent != undefined ? cfg.clickEvent : function (evt, obj) {};
    this.initEvent = cfg.initEvent != undefined ? cfg.initEvent : function (obj) {};
  }

  constructor(config) {
    this.setConfig(config);
    GameUI.serial = 1;
    this.objs = [];
    this.rate = 10.0;
    this.zoom = this.config.zoom;
    this.canvas = document.getElementById(this.config.canvasId);
    this.setKnn();
    this.ctx = this.canvas.getContext("2d");
    this.cw = this.canvas.offsetWidth;
    this.ch = this.canvas.offsetHeight;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  async init() {
    await this.setBackgroundImage(
      this.config.backgroundImageURL, this.config.backgroundImageAlpha);
  }

  initObj(cb) {
    this.initEvent = cb;
  }

  click(fn) {
    this.clickEvent = fn;
  }

  setKVal(k) {
    this.knn.setKVal(this.config.kVal = (k + 1));
    return this;
  }

  setDVal(d) {
    this.config.dVal = d;
    return this;
  }

  setKnn() {
    this.knn = new KNN(this.zoom, this.rate);
  }

  /**
   * 設定背影圖片
   * @param {string} url - 背景圖片網址 https://......
   * @param {string} alpha - 背景圖片透明度 0(不透明)～1(完全透明)
   */
  async setBackgroundImage(url, alpha) {
    if (url != '') {
      this.background = await this.loadImage(url);
      this.ctx.globalAlpha = alpha;
      this.ctx.clearRect(0, 0, this.cw, this.ch);
      this.ctx.drawImage(this.background, 0, 0);
    }
    if (this.config.grid) {
      this.drawCrossLine();
    }
  }

  drawCrossLine() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.config.strokeStyle;
    this.ctx.lineWidth = this.config.lineWidth;
    for (var x = 0; x <= this.cw; x = x + this.zoom) {
      for (var y = 0; y <= this.ch; y = y + this.zoom) {
        this.ctx.rect(x, y, x + this.zoom, y + this.zoom);
      }
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  cloneObj(obj, x, y) {
    var newObj = JSON.parse(JSON.stringify(obj));
    if (x != undefined) newObj.x = x;
    if (y != undefined) newObj.y = y;
    return newObj;
  }

  delObj(obj) {
    const index = this.objs.indexOf(obj);
    if (index > -1) {
      this.objs.splice(index, 1);
      this.knn.remove(obj);
      obj.imgEle.remove();
      this.refresh();
      return true;
    }
    return false;
  }

  async addObj(obj) {
    var self = this;

    function Field(img) {
      var _url = img.url;
      img.__defineGetter__("url", function () {
        return _url;
      });
      img.__defineSetter__("url", async function (url) {
        _url = url;
        obj.imgEle = await self.loadImage(url, obj.img.width, obj.img.height);
        obj.imgEle.style.cursor = 'pointer';
        var pos = self.canvas.getBoundingClientRect();
        var fixH = pos.height / self.canvas.height;
        var fixW = pos.width / self.canvas.width;
        obj.imgEle.style.top = (pos.top + obj.y * fixH - obj.img.height / 2) + "px";
        obj.imgEle.style.left = (pos.left + obj.x * fixW - obj.img.width / 2) + "px";
        obj.imgEle.addEventListener("click", function (evt) {
          self.clickEvent(evt, obj);
        });
      });
    }
    Field(obj.img);
    obj.kx = obj.x;
    obj.ky = obj.y;
    obj.x = obj.x * this.zoom;
    obj.y = obj.y * this.zoom;
    obj.img.url = obj.img.url;
    obj.serial = GameUI.serial++;
    this.knn.remove(obj);
    this.knn.insert(obj);
    var empty = true;
    for (var i = 0; i < this.objs.length; i++) {
      if (obj == this.objs[i]) empty = false;
    }
    if (empty) {
      this.objs.push(obj);
    }
    this.initEvent(this.ctx, obj);
    return obj;
  }

  async init() {
    await this.refresh();
  }

  async refresh() {
    await this.setBackgroundImage(
      this.config.backgroundImageURL, this.config.backgroundImageAlpha);
  }

  drawRange(obj, color, lineWidth) {
    var bakStrole = this.ctx.strokeStyle;
    var bakLineWidth = this.ctx.lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(obj.x, obj.y, this.config.zoom * this.config.dVal, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.strokeStyle = bakStrole;
    this.ctx.lineWidth = bakLineWidth;
  }

  showNearest(obj) {
    var data = this.knn.nearest.call(this.knn, obj.kx, obj.ky, this.config.kVal, this.config.dVal + 0.001 /*fix js float*/ );
    var objs = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] != obj)
        objs.push(data[i]);
    }
    return objs;
  }

  drawArrow(srcObj, color, lineWidth) {
    var objs = this.showNearest(srcObj);
    for (var i = 0; i < objs.length; i++) {
      this.drawArrowTo(srcObj, objs[i][0], lineWidth, 10, true, true, color);
    }
  }

  drawArrowTo(objA, objB, aWidth, aLength, arrowStart, arrowEnd, color) {
    var x0 = objA.x;
    var y0 = objA.y;
    var x1 = objB.x;
    var y1 = objB.y;
    this.drawLineWithArrows(x0, y0, x1, y1, aWidth, aLength, false, arrowEnd, color);
  }

  drawLineWithArrows(x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd, color) {
    var ctx = this.ctx;
    var bakStrokeStyle = ctx.strokeStyle;
    var bakLineWidth = ctx.lineWidth;
    ctx.strokeStyle = color;
    ctx.lineWidth = aWidth;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var angle = Math.atan2(dy, dx);
    var length = Math.sqrt(dx * dx + dy * dy) - 20;
    //
    ctx.translate(x0, y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    if (arrowStart) {
      ctx.moveTo(aLength, -aWidth);
      ctx.lineTo(0, 0);
      ctx.lineTo(aLength, aWidth);
    }
    if (arrowEnd) {
      ctx.moveTo(length - aLength, -aWidth);
      ctx.lineTo(length, 0);
      ctx.lineTo(length - aLength, aWidth);
    }
    //
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineWidth = bakLineWidth;
    ctx.strokeStyle = bakStrokeStyle;
  }


  async loadImage(url, width, height) {
    return new Promise((resolve, reject) => {
      var img = new Image(width, height);
      document.body.appendChild(img);
      img.src = url;
      img.width = width;
      img.height = height;
      img.style.position = 'absolute';
      img.style.display = 'none';
      img.onload = async () => {
        //console.log("Image Loaded:", url);
        img.style.display = '';
        resolve(img);
      };
    });
  };
}