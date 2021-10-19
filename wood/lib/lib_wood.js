class CountDown {
    constructor(id, sec) {
        this.ele = document.getElementById(id);
        this.ele.style = 'font-family: monospace;';
        this.sec = sec;
        this.cb = function() {};
        this.innerHTML = '' + self.sec;
    }

    addStopCallback(cb) {
        this.cb = cb;
    }

    start(timeout) {
        var self = this;
        this.timeout = timeout;
        this.clearId = setInterval(function() {
            if (self.sec == -1) {
                self.cb();
                self.stop();
                self.timeout();
                return;
            }
            self.ele.innerHTML = (self.sec < 10 ? '0' : '') + self.sec--;
        }, 1000);
    }

    stop() {
        clearInterval(this.clearId);
        this.timeout = function() {};
        this.cb = function() {};
    }
}

class Axe {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.axe = this.createImage("p1", "images/wood/axe.png");
        this.hand = this.createImage("p0", "images/wood/hand.png");
        this.moveX = 0;
        this.moveY = 0;
    }

    createImage(id, src) {
        var img = document.createElement('img');
        img.src = src;
        img.id = id;
        img.style.display = 'none';
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(img);
        return img;
    }

    show(x, y) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.axe, x - 28, y - 28, 64, 64);
    }

    mv(x, y) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.hand, x - 28, y - 28, 64, 64);
    }
}

class Wood {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.wood = this.createImage("p1", "images/wood/wood.png");
        this.woodCut = this.createImage("p0", "images/wood/wood2.png");
        this.woodWidth = 42;
        this.woodHeight = 128;
        this.moveX = 0;
        this.moveY = 0;
        this.amt = 0;
    }

    touch(x, y) {
        var self = this;
        x = parseInt(x);
        y = parseInt(y);
        if (x >= this.moveX && x <= this.moveX + this.woodWidth &&
            y >= this.moveY && y <= this.moveY + this.woodHeight) {
            if (this.cutCnt++ >= 5) {
                this.showWoodCut(this.moveX, this.moveY);
                if (this.cutCnt == 6) {
                    this.amt += 10;
                    clearInterval(this.nextTimeout);
                    this.nextTimeout = setTimeout(function() {
                        self.showUp(self.ms, self.callback);
                    }, 350);
                }
                if (this.amt == 100) {
                    this.callback(x, y);
                    clearInterval(this.nextTimeout);
                }
            }
        }
    }

    createImage(id, src) {
        var img = document.createElement('img');
        img.src = src;
        img.id = id;
        img.style.display = 'none';
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(img);
        return img;
    }

    showUp(ms, callback) {
        var self = this;
        this.ms = ms;
        this.cutCnt = 0;
        this.callback = callback;
        var x = Math.random() * (this.canvas.width - this.woodWidth);
        var y = Math.random() * (this.canvas.height - this.woodHeight);
        this.showWood(x, y);
        this.nextTimeout = setTimeout(function() {
            self.showUp(ms, callback);
        }, this.ms);
    }

    showWood(x, y) {
        this.moveX = x;
        this.moveY = y;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.wood, x, y, this.woodWidth, this.woodHeight);
    }

    showWoodCut(x, y) {
        this.moveX = x;
        this.moveY = y;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.woodCut, x, y, this.woodWidth, this.woodHeight);
    }

    stop() {
        clearInterval(this.nextTimeout);
    }

    calculate() {
        return this.amt;
    }
}