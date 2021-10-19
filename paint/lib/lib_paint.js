class CountDown {
    constructor(id, sec) {
        this.ele = document.getElementById(id);
        this.ele.style = 'font-family: monospace;';
        this.sec = sec;
        this.cb = function() {};
        this.innerHTML = '' + self.sec;
    }

    start(timeout) {
        var self = this;
        this.timeout = timeout;
        this.clearId = setInterval(function() {
            if (self.sec == -1) {
                self.timeout();
                self.stop();
                return;
            }
            self.ele.innerHTML = (self.sec < 10 ? '0' : '') + self.sec--;
        }, 1000);
    }

    stop() {
        clearInterval(this.clearId);
        this.timeout = function() {};
    }
}

class Paint {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.paint = this.createImage("p1", "images/paint/paint.png");
        this.paintEmpty = this.createImage("p0", "images/paint/paintEmpty.png");
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

    draw(x, y) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.paint, x - 28, y - 28, 64, 64);
    }

    move(x, y) {
        if (arguments.length != 0) {
            this.moveX = x;
            this.moveY = y;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.paintEmpty, this.moveX - 32, this.moveY - 32, 64, 64);
    }
}

class Shape {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    shift(shiftX, shiftY) {
        this.shiftX = shiftX;
        this.shiftY = shiftY;
    }

    drawPolygon(side, r) {
        var ctx = this.ctx;
        ctx.fillStyle = "#FEFE22";
        ctx.fillStyle = "#000000";
        var poly = this.createPolygon(side, r);
        ctx.beginPath();
        var x = poly[0].x;
        var y = poly[0].y;
        ctx.moveTo(x, y);
        for (var item = 1; item < poly.length - 1; item++) {
            x = poly[item].x;
            y = poly[item].y;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    createPolygon(side, r) {
        const sides = this.random(side[0], side[1]);
        const step = Math.PI * 2 / sides;
        const points = [];
        let minX = Infinity;
        let minY = Infinity;
        for (let i = 0; i < sides - 1; i++) {
            const theta = (step * i) + this.random(step);
            const radius = this.random(r[0], r[1]);
            const x = parseInt(radius * Math.cos(theta)) + this.shiftX;
            const y = parseInt(radius * Math.sin(theta)) + this.shiftY;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            points.push({ x, y });
        }
        var self = this;
        points.forEach(point => {
            point.x = point.x - minX + self.shiftX;
            point.y = point.y - minY + self.shiftY;
        });
        this.poly = points;
        return points;
    }

    random(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }
        return min + (max - min) * Math.random();
    }

    contains(x, y) {
        return this.isInPolygon([x, y], this.poly);
    }

    isInPolygon(checkPoint, polygonPoints) {
        var counter = 0;
        var i;
        var xinters;
        var p1, p2;
        var pointCount = polygonPoints.length;
        p1 = polygonPoints[0];
        for (i = 1; i <= pointCount; i++) {
            p2 = polygonPoints[i % pointCount];
            if (
                checkPoint[0] > Math.min(p1.x, p2.x) &&
                checkPoint[0] <= Math.max(p1.x, p2.x)
            ) {
                if (checkPoint[1] <= Math.max(p1.y, p2.y)) {
                    if (p1.x != p2.x) {
                        xinters =
                            (checkPoint[0] - p1.x) *
                            (p2.y - p1.y) /
                            (p2.x - p1.x) +
                            p1.y;
                        if (p1.y == p2.y || checkPoint[1] <= xinters) {
                            counter++;
                        }
                    }
                }
            }
            p1 = p2;
        }
        if (counter % 2 == 0) {
            return false;
        } else {
            return true;
        }
    }

    calculate() {
        var w = this.canvas.width;
        var h = this.canvas.height;
        var pixels = this.ctx.getImageData(0, 0, w, h).data;
        var area = 0;
        var inside = 0;
        var out = 0;
        var bad = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var pixel = (x + y * w) * 4;
                var hit = this.contains(x, y);
                var blue = pixels[pixel + 2];
                if (hit) {
                    area++;
                    if (blue == 254) {
                        inside++;
                    } else {
                        bad++;
                    }
                } else if (blue == 254) {
                    out++;
                }
            }
        }
        //console.log("area:", area, 'in:', inside, 'bad:', bad, 'out:', out);
        var percent = parseInt(103.0 * inside / area);
        return percent >= 100 ? 100 : percent;
    }
}