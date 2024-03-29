class Drag {
    constructor(eleCanvas, zoom) {
        this.circles = [];
        this.tiers = [];
        this.k = this.d = 1;
        Drag.serial = 1;
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
        Drag.serial = 1;
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

    mergeTwoCircle(tier, p1, p2, distance) {
        if (p1.tier >= tier || p2.tier >= tier) {
            return -1;
        }
        this.delCircle(p1);
        this.delCircle(p2);
        var t = 0;
        if (p1.tier == p2.tier) {
            t = p1.tier + 1;
        } else if (p1.tier > p2.tier) {
            t = p1.tier + 1;
        } else {
            t = p2.tier + 1;
        }
        p1.mergeRadius = p2.mergeRadius = distance / 2;
        var newCircle = this.addCircle({
            x: (p1.kx + p2.kx) / 2,
            y: (p1.ky + p2.ky) / 2,
            tier: t,
            merge: true,
            mergeRadius: p1.mergeRadius,
            color: this.getMergeColor()
        });
        return newCircle;
    }

    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    clustering(tier) {
        var save = this.clone(this.circles);
        for (var i = 1; i <= tier; i++) {
            this.tiers[i] = [];
            console.log("-----", i, "-----");
            while (this.process(i, this.circles));
        }
        var saveTier = this.clone(this.tiers);
        console.log(saveTier);
        this.restart(save);
        this.ctx.setLineDash([]);
        for (var draw = 0; draw < saveTier[tier].length; draw++) {
            var circle = saveTier[tier][draw];
            this.drawCircle(circle);
        }
    }

    process(tier, points) {
        var minP1 = null;
        var minP2 = null;
        var distance = Infinity;
        var maxDistance = 0;
        for (var i = 0; i < points.length; i++) {
            var p1 = points[i];
            var p1p2 = this.knn.getNearest(p1);
            if (p1p2[2] == 0) return false;
            if (p1p2[2] > maxDistance) {
                maxDistance = p1p2[2];
            }
            if (p1p2[2] < distance) {
                if (p1.tier == tier || p1p2[1].tier == tier) continue;
                minP1 = p1;
                minP2 = p1p2[1];
                if (minP1.merge || minP2.merge) {
                    distance = p1p2[2] * 2;
                } else {
                    distance = p1p2[2];
                }
            }
        }
        if (minP1 == null) return false;
        var p1 = '(' + minP1.tier + ')[' + minP1.kx + ',' + minP1.ky + ']<->';
        var p2 = '(' + minP2.tier + ')[' + minP2.kx + ',' + minP2.ky + '] ,distance:' +
            parseInt(distance * 100) / 100.0;
        //console.log(p1 + p2);
        var mergeCircle = this.mergeTwoCircle(tier, minP1, minP2, distance);
        this.tiers[tier].push(mergeCircle);
        return points.length > 2;
    }

    delCircle(obj) {
        const index = this.circles.indexOf(obj);
        if (index > -1) {
            this.circles.splice(index, 1);
        }
        this.knn.remove(obj);
        this.drawAll();
    }

    addCircle(obj) {
        obj.kx = obj.x;
        obj.ky = obj.y;
        obj.x = obj.x * this.zoom;
        obj.y = obj.y * this.zoom;
        obj.serial = Drag.serial++;
        obj.tier = typeof obj.tier == 'undefined' ? 0 : obj.tier;
        obj.merge = typeof obj.merge == 'undefined' ? false : obj.merge;
        obj.defColor = typeof obj.color != 'undefined' ? obj.color : null;
        obj.color = typeof obj.color == 'undefined' ? this.getColor() : obj.color;
        obj.radius = typeof obj.radius == 'undefined' ? this.stdRadius : obj.radius;
        obj.mergeRadius = typeof obj.mergeRadius == 'undefined' ? 0 : obj.mergeRadius;
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
        //ctx.drawImage(this.background, 0, 0);
        for (var i = 0; i < this.circles.length; i++) {
            var circle = this.circles[i];
            var x = Math.round(this.rate * circle.x) / this.rate;
            var y = Math.round(this.rate * circle.y) / this.rate;
            ctx.beginPath();
            ctx.fillStyle = circle.color;
            ctx.arc(x, y, circle.radius, 0, this.PI2);
            ctx.fill();
            ctx.closePath();
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
            //console.log("new:", newDot.x, newDot.y);
            this.addCircle(newDot);
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
            this.addCircle(this.draggingCircle);
        }
        // stop the drag
        this.isDown = false;
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