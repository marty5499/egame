class CountDown {
    constructor(id, sec) {
        this.ele = document.getElementById(id);
        this.ele.style = 'font-family: monospace;';
        this.sec = sec;
        this.innerHTML = '' + self.sec;
        this.running = false;
    }

    isRunning() {
        return this.running;
    }

    start(timeout) {
        var self = this;
        this.timeout = timeout;
        this.running = true;
        this.clearId = setInterval(function() {
            if (self.sec == -1) {
                clearInterval(self.clearId);
                self.running = false;
                self.timeout();
                return;
            }
            self.ele.innerHTML = (self.sec < 10 ? '0' : '') + self.sec--;
        }, 1000);
    }

    stop() {
        self.running = false;
        clearInterval(this.clearId);
        this.timeout = function() {};
    }
}

class Slingshot {
    constructor(world, x, y, n, r) {
        var self = this;
        this.x = x;
        this.y = y;
        this.world = world;
        this.rock = world.addPolygon(x, y, n, r, {
            density: 0.05
        });
        this.elastic = world.addElastic(self.rock, x, y, 0.1);
        world.addEvent(function() {
            var distance = Math.sqrt(Math.pow(self.rockX - self.x, 2) +
                Math.pow(self.rockY - self.y, 2));

            if (self.rock.position.y < y - 10) {
                self.rock = world.addPolygon(x, y, n, r, {
                    density: 0.05
                });
                self.elastic.bodyB = self.rock;
            }
        });
    }

    move(x, y) {
        this.rockX = x;
        this.rockY = y;
        this.rock.isStatic = true;
        this.world.move(this.rock, x, y);
    }

    fire() {
        this.rock.isStatic = false;
    }
}

class Progress {
    constructor(id, w) {
        this.ele = document.getElementById(id);
        this.ele.style.position = 'absolute';
        this.ele.style.width = w + 'px';
        this.eleProgress = this.ele.children[0];
        this.value = 0;
    }

    position(x, y, width) {
        this.ele.style.width = width + 'px';
        this.ele.style.left = x + 'px';
        this.ele.style.top = y + 'px';
    }

    stop() {
        this.ele.classList.remove('meter');
        this.ele.classList.remove('animate');
        this.ele.classList.add('meterfixed');
    }

    val(val) {
        this.newValue = val;
        this.startAnimate();
    }

    startAnimate() {
        var self = this;
        var diff = this.value < this.newValue ? 1 : -1;
        var c = setInterval(function() {
            if (parseInt(self.value) == parseInt(self.newValue)) {
                clearInterval(c);
            } else {
                self.value = self.value + diff;
                self.eleProgress.style.width = self.value + "%";
            }
        }, 10);
    }
}