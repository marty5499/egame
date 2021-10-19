class HandDetect {
  constructor() {
    this.strokeStyle = '#ff0000';
    this.lineWidth = 5;
    this.callbackList = [];
    this.historyPos = [];
    this.modelParams = {
      flipHorizontal: true, // flip e.g for video 
      imageScaleFactor: 0.8, // reduce input image size .
      maxNumBoxes: 20, // maximum number of boxes to detect
      iouThreshold: 0.5, // ioU threshold for non-max suppression
      scoreThreshold: 0.9, // confidence threshold for predictions.
    }
  }

  setCamera(cam) {
    this.cam = cam;
  }

  setRectStyle(color, lineWidth) {
    this.strokeStyle = color;
    this.lineWidth = lineWidth;
  }

  on(callback) {
    this.callbackList.push(callback);
  }

  fixPos(pos) {
    //debugger;
    this.historyPos.push(pos);
    if (this.historyPos.length > 10) {
      this.historyPos.shift();
    }
    var avgX = 0;
    var avgY = 0;
    var avgW = 0;
    var avgH = 0;
    var len = this.historyPos.length;
    for (var i = 0; i < len; i++) {
      avgX += this.historyPos[i][0];
      avgY += this.historyPos[i][1];
      avgW += this.historyPos[i][2];
      avgH += this.historyPos[i][3];
    }
    var nx = parseInt(avgX / len);
    var ny = parseInt(avgY / len);
    var nw = parseInt(avgW / len);
    var nh = parseInt(avgH / len);
    var dist = this.getDistance(nx, pos[0], ny, pos[1]);
    return dist < 10 ? [] : [nx, ny, nw, nh];
  }

  getDistance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  async start(color, lineWidth) {
    return new Promise((resolve, reject) => {
      var self = this;
      handTrack.load(this.modelParams).then(model => {
        self.model = model;
        resolve();
      });
    });
  }

  startCam(color, lineWidth) {
    var self = this;
    var cnt = 0;
    this.cam.onCanvas(function (canvas) {
      if (cnt++ % 3 != 0) return;
      var ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      self.model.detect(canvas).then(predictions => {
        var hands = [];
        var amt = predictions.length;
        for (var i = 0; i < amt; i++) {
          var hand = self.fixPos(predictions[i]['bbox']);
          if (hand.length == 0) {
            continue; //filter noise data (dist<3)
          }
          hand.push(predictions[i]['score']);
          hands.push(hand);
          //flip
          hand[0] = canvas.width - (hand[0] + hand[2]);
          ctx.rect(hand[0], hand[1], hand[2], hand[3]);
          // process callback
          for (var i = 0; i < self.callbackList.length; i++) {
            self.handInfo = hand;
            self.callbackList[i](hand);
          }
        }
        ctx.stroke();
      });
    });
  }

}