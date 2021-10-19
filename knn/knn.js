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
        this.background.onload = function() {
            self.ctx.globalAlpha = self.background_globalAlpha;
            self.ctx.drawImage(self.background, 0, 0);
            self.render();
        }
        this.setBackgroundImage('', 1);
    }

    setBackgroundImage(url, alpha) {
        this.background.src = url;
        this.background_globalAlpha = alpha;
    }

    toJSON() {
        return this.tree.toJSON();
    }

    list() {
        for (var i = 0; i < this.points.length; i++) {
            var x = this.points[i].kx;
            var y = this.points[i].ky;
            var nearP = this.nearest(x, y, 2);
            nearP = nearP.length > 0 ? nearP[0] : -1;
            var nKx = nearP[0].kx;
            var nKy = nearP[0].ky;
            console.log('p:(', x, ',', y, ')<->(', nKx, ',', nKy, '), ', nearP[1]);
        }
    }

    getNearest(p1) {
        var x = p1.kx;
        var y = p1.ky;
        var nearP = this.nearest(x, y, 2)[0];
        var p2 = nearP[0];
        var distance = nearP[1];
        return [p1, p2, distance];
    }

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

    insert(point) {
        this.points.push(point);
        this.tree.insert(point);
    }

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