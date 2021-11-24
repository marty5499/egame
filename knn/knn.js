/**
 * knn.js
 * @param {number} zoom 每隔間距像素
 * @param {number} rate 預設比率10 (不用改)
 * @constructor
 */
class KNN {
  constructor(zoom, rate) {
    this.canvas = document.getElementById('c');
    this.ctx = this.canvas.getContext("2d");
    this.points = [];
    this.zoom = zoom;
    this.rate = rate;
    this.tree = new kdTree([], this.distance, ['kx', 'ky']);
    var self = this;
    this.background = new Image();
    this.background.onload = function () {
      self.ctx.globalAlpha = self.background_globalAlpha;
      self.ctx.drawImage(self.background, 0, 0);
      self.render();
    }
    this.setBackgroundImage('', 1);
  }

  /**
   * 設定背影圖片
   * @param {string} url - 背景圖片網址 https://......
   * @param {string} alpha - 背景圖片透明度 0(不透明)～1(完全透明)
   */
  setBackgroundImage(url, alpha) {
    this.background.src = url;
    this.background_globalAlpha = alpha;
  }

  /**
   * 輸出所有數據資訊
   */
  toJSON() {
    return this.tree.toJSON();
  }

  list() {
    var info = [];
    for (var i = 0; i < this.points.length; i++) {
      var x = this.points[i].kx;
      var y = this.points[i].ky;
      var nearP = this.nearest(x, y, 2);
      nearP = nearP.length > 0 ? nearP[0] : -1;
      var nKx = nearP[0].kx;
      var nKy = nearP[0].ky;
      info.push('p:(' + x + ',' + y + ')<->(' + nKx + ',' + nKy + '), ' + nearP[1]);
    }
    return info;
  }

  /**
   * 取得某點最近的點和距離
   * @return {array} 輸入點，最近的點，距離
   */
  getNearest(p1) {
    var x = p1.kx;
    var y = p1.ky;
    var nearP = this.nearest(x, y, 2)[0];
    var p2 = nearP[0];
    var distance = nearP[1];
    return [p1, p2, distance];
  }

  /**
   * 取得所有點的資訊
   * @return {array} 每個點的資訊
   */
  pointsBFS() {
    return this.tree.pointsBFS();
  }

  setPoints(points) {
    for (var i = 0; i < points.length; i++) {
      this.tree.insert(this.points[i]);
    }
  }

  setKVal(k) {
    this.k = k;
  }

  /**
   * 找出x,y座標，根據k值和d(距離)的資訊
   * @param {obj} 
   */
  nearest(x, y, k, d) {
    var v = this.tree.nearest({ kx: x, ky: y }, k, d);
    var info = '';
    for (var i = 0; i < v.length; i++) {
      var distance = parseInt(v[i][1] * this.rate) / this.rate;
      var x = Math.round(v[i][0].kx * this.rate) / this.rate;
      var y = Math.round(v[i][0].ky * this.rate) / this.rate;
      var data = '(x=' + x + ',y=' + y + ') distance=' + distance + ' \n';
      info += data;
    }
    text.innerText = info;
    return v;
  }

  distance(a, b) {
    var n = Math.pow(a.kx - b.kx, 2) + Math.pow(a.ky - b.ky, 2);
    return Math.sqrt(n);
  }

  root() {
    return this.tree.root;
  }

  /**
   * 新增指定點在畫面上
   * @param {point} 點的物件資訊
   */
  insert(point) {
    this.points.push(point);
    this.tree.insert(point);
  }

  /**
   * 移除畫面上的指定點
   */
  remove(point) {
    const index = this.points.indexOf(point);
    if (index > -1) {
      this.points.splice(index, 1);
    }
    this.tree.remove(point);
  }

  render() {
    this.draw(this.zoom);
  }

  draw(n) {
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;
    ctx.font = "16px Arial";
    ctx.beginPath();
    //ctx.fillStyle = '#000000';
    ctx.strokeStyle = "#cecece";
    for (var x = 0; x < w; x = x + n) {
      for (var y = 0; y < h; y = y + n) {
        ctx.rect(x, y, x + n, y + n);
      }
    }
    ctx.stroke();
    ctx.closePath();
  }
}