/**
 * 遊戲世界的物件
 * @class waMatter
 */
class waMatter {
    constructor(ele, w, h) {
        this.ele = ele;
        // module aliases
        this.Body = Matter.Body;
        this.Events = Matter.Events;
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.Runner = Matter.Runner;
        this.Common = Matter.Common;
        this.Constraint = Matter.Constraint;
        this.MouseConstraint = Matter.MouseConstraint;
        this.Mouse = Matter.Mouse;
        this.World = Matter.World;
        this.Vertices = Matter.Vertices;
        this.Svg = Matter.Svg;
        this.Bodies = Matter.Bodies;
        this.ele.width = w;
        this.ele.height = h;
    }

    init() {
        // create an engine
        this.engine = this.Engine.create();
        // create a renderer
        this.render = this.Render.create({
            element: this.ele,
            engine: this.engine,
            options: {
                wireframes: false,
                width: this.ele.width,
                height: this.ele.height
            }
        });
        return this;
    }

    overlay(ele) {
        this.overlay = ele;
        this.overlay.style.position = 'absolute';
        this.overlay.style['z-index'] = '1';
        var top = ele.offsetTop;
        var left = ele.offsetLeft;
        var w = ele.width;
        var h = ele.height;
        this.ele.width = w;
        this.ele.hieght = h;
        this.ele.style.position = 'absolute';
        this.ele.style.top = top;
        this.ele.style.left = left;
    }

    count(x, y, w, h) {
        var amt = 0;
        var objs = this.engine.world.bodies;
        var x1 = x - w / 2;
        var y1 = y - h / 2;
        var x2 = x + w / 2;
        var y2 = y + h / 2;
        for (var i = 0; i < objs.length; i++) {
            var p = objs[i].position;
            var px = parseInt(p.x);
            var py = parseInt(p.y);
            if (px > x1 && px < x2 && py > y1 && py < y2) {
                amt++;
            }
        }
        return amt;
    }

    /**
     * 旋轉指定物件
     * @param {object} obj 指定物件
     * @param {number} degree 旋轉角度 0~360
     */
    rotate(obj, degree) {
        this.Body.rotate(obj, degree * (Math.PI / 180));
    }

    /**
     * 絕對座標移動指定物件
     * @param {object} obj 指定物件
     * @param {number} x x座標
     * @param {number} y y座標
     */
    move(obj, x, y) {
        this.Body.setPosition(obj, { x: x, y: y })
    }

    /**
     * 相對座標移動指定物件
     * @param {object} obj 指定物件
     * @param {number} dx x座標
     * @param {number} dy y座標
     */
    translate(obj, dx, dy) {
        this.Body.translate(obj, { x: dx, y: dy });
    }

    addElastic(obj, x, y, stiffness) {
        var elastic = this.Constraint.create({
            pointA: { x: x, y: y },
            bodyB: obj,
            stiffness: stiffness
        });
        this.add(elastic);
        return elastic;
    }

    addPolygon(x, y, n, r, options) {
        var obj = this.Bodies.polygon(x, y, n, r, options);
        this.add(obj);
        return obj;
    }

    /**
     * 新增一個圓形物件，然後放入遊戲世界中
     * @param {number} x x座標
     * @param {number} y y座標
     * @param {number} radius 半徑
     * @param {*} options 
     */
    addCircle(x, y, radius, options) {
        var obj = this.Bodies.circle(x, y, radius, options);
        this.add(obj);
        return obj;
    }

    /**
     * 新增一個矩形物件，然後放入遊戲世界中
     * @param {number} x  x座標
     * @param {number} y  y座標
     * @param {number} w  寬度
     * @param {number} h  高度
     * @param {*} options 
     */
    addRectangle(x, y, w, h, options) {
        var obj = this.Bodies.rectangle(x, y, w, h, options);
        this.add(obj);
        return obj;
    }

    /**
     * 新增一個svg圖案，然後放入遊戲世界中
     * @param {string} url svg圖案網址
     * @param {number} x x座標
     * @param {number} y y座標
     * @param {*} param 
     * @param {*} options 
     * @param {*} cb 
     */
    addSVG(url, x, y, param, options, cb) {
        var self = this;
        $.get(url).done(function(data) {
            var vertexSets = [];
            $(data).find('path').each(function(i, path) {
                vertexSets.push(self.Svg.pathToVertices(path, param));
            });
            var obj = self.Bodies.fromVertices(x, y, vertexSets, options);
            self.add(obj);
            cb(obj);
        });
    }

    /**
     * 將新增的物件，然後放入遊戲世界中
     * @param {object} obj 
     */
    add(obj) {
        this.World.add(this.engine.world, obj);
    }

    run() {
        this.Engine.run(this.engine);
        this.Render.run(this.render);
        return this;
    }

    addEvent(evt) {
        this.Events.on(this.engine, 'afterUpdate', evt);
    }

}