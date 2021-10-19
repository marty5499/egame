// ASCII Font http://patorjk.com/software/taag/#p=display&f=Soft&t=PIXI_Game

/*
,------. ,--.,--.   ,--.,--.       ,----.                             
|  .--. '|  | \  `.'  / |  |      '  .-./    ,--,--.,--,--,--. ,---.  
|  '--' ||  |  .'    \  |  |      |  | .---.' ,-.  ||        || .-. : 
|  | --' |  | /  .'.  \ |  |,----.'  '--'  |\ '-'  ||  |  |  |\   --. 
`--'     `--''--'   '--'`--''----' `------'  `--`--'`--`--`--' `----'                       
*/

class PIXI_Game {
    constructor(camCanvas) {
        this.startOverlay(camCanvas);
    }

    init(canvas) {
        this.bound = 4;
        this.actors = {};
        this.app = new PIXI.Application({
            width: canvas.width,
            height: canvas.height,
            antialiasing: true,
            transparent: true,
            resolution: 1,
            view: canvas
        });
        this.loader = PIXI.loader;
        this.app.ticker.add(delta => this.gameLoop(delta));
    }

    startOverlay(camCanvas) {
        var canvas = document.createElement('canvas');
        canvas.id = "PIXI_Layer";
        canvas.width = camCanvas.width;
        canvas.height = camCanvas.height;
        canvas.style.position = "absolute";
        canvas.style.display = 'block';
        canvas.style.top = camCanvas.parentNode.offsetTop + 'px';
        canvas.style.left = camCanvas.parentNode.offsetLeft + 'px';
        canvas.style['z-index'] = 2;
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        this.init(canvas);
    }

    join(actor) {
        this.actors[actor.name] = actor;
    }

    remove(actor) {
        delete this.actors[actor.name];
    }

    gameLoop(delta) {
        for (var key in this.actors) {
            var actor = this.actors[key];
            actor.exec();
            actor.isCollision = false;
            for (var key2 in this.actors) {
                var actor2 = this.actors[key2];
                if (actor.name != actor2.name) {
                    if (actor.destroyed || actor2.destroyed) {
                        return;
                    }
                    if (this.hitTestRectangle(actor.sprite, actor2.sprite)) {
                        actor.isCollision = true;
                        actor.collision_obj = actor2;
                        actor.cbCollision(actor, actor2);
                        actor2.isCollision = true;
                        actor2.collision_obj = actor;
                        actor2.cbCollision(actor2, actor);
                    }
                }
            }
        }
    }

    hitTestRectangle(r1, r2) {
        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        //hit will determine whether there's a collision
        hit = false;
        var bound = this.bound;
        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / bound;
        r1.centerY = r1.y + r1.height / bound;
        r2.centerX = r2.x + r2.width / bound;
        r2.centerY = r2.y + r2.height / bound;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / bound;
        r1.halfHeight = r1.height / bound;
        r2.halfWidth = r2.width / bound;
        r2.halfHeight = r2.height / bound;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {
            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {
                //There's definitely a collision happening
                hit = true;
            } else {
                //There's no collision on the y axis
                hit = false;
            }
        } else {
            //There's no collision on the x axis
            hit = false;
        }
        //`hit` will be either `true` or `false`
        return hit;
    };
}

/*
  _____ _______   _______   __  __                 _            
 |  __ \_   _\ \ / /_   _| |  \/  |               | |           
 | |__) || |  \ V /  | |   | \  / | ___  _ __  ___| |_ ___ _ __ 
 |  ___/ | |   > <   | |   | |\/| |/ _ \| '_ \/ __| __/ _ \ '__|
 | |    _| |_ / . \ _| |_  | |  | | (_) | | | \__ \ ||  __/ |   
 |_|   |_____/_/ \_\_____| |_|  |_|\___/|_| |_|___/\__\___|_|   
                       ______                                   
                      |______|                                  
*/
class PIXI_Monster {
    constructor(game, name, url, imgX, imgY, width, height) {
        var self = this;
        return new Promise(async(resolve, reject) => {
            try {
                self.game = game;
                self.name = name;
                self.imgURL = url;
                self.imgX = imgX;
                self.imgY = imgY;
                self.width = width;
                self.height = height;
                self.actMoveTo = [];
                self.destroyed = false;
                self.cbCollision = function(actor) {};
                self.callback = function(sprite) {};
                await self.join();
                //self.sprite.visible = false;
            } catch (ex) {
                return reject(ex);
            }
            resolve(this);
        });
    }

    show() {
        this.sprite.visible = true;
        return this;
    }

    hide() {
        this.sprite.visible = false;
        return this;
    }

    collision(cb) {
        this.cbCollision = cb;
    }

    type(n) {
        var mType = 0;
        switch (n) {
            case 0:
                mType = 200;
                break;
            case 1:
                mType = 400;
                break;
            case 2:
                mType = 600;
                break;
            case 3:
                mType = 800;
                break;
        }
        this.sprite.texture.frame = new PIXI.Rectangle(0, mType, this.width, this.height);
        return this;
    }

    size(width, height) {
        this.sprite.width = width;
        this.sprite.height = height;
        return this;
    }

    async join() {
        var self = this;

        function createSprite() {
            var texture = PIXI.utils.TextureCache[self.imgURL];
            texture.frame = new PIXI.Rectangle(0, 0, self.width, self.height);
            self.sprite = new PIXI.Sprite(texture);
            var sprite = self.sprite;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.rotation = 0;
            sprite.interactive = true;
            sprite.cursor = 'normal';
            sprite.on('click', (event) => {
                console.log("tap");
            });
            self.game.join(self);
            self.game.app.stage.addChild(self.sprite);
        }

        return new Promise((resolve, reject) => {
            var texture = PIXI.TextureCache[self.imgURL];
            if (typeof texture == 'undefined') {
                PIXI.loader.add(self.imgURL).load(function() {
                    createSprite();
                    resolve(self);
                });
            } else {
                createSprite();
                resolve(self);
            }
        });
    }

    pos(x, y) {
        this.x = this.sprite.x = x;
        this.y = this.sprite.y = y;
        return this;
    }

    start(cb) {
        this.callback = cb;
        return this;
    }

    moveTo(desX, desY, speed) {
        this.actMoveTo.push([desX, desY, speed]);
    }

    rotate(rotate, anchorX, anchorY) {
        if (arguments.length == 1) {
            this.sprite.rotation = rotate;
            return;
        }
        this.sprite.anchor.x = anchorX;
        this.sprite.anchor.y = anchorY;
        return this;
    }

    processMoveTo() {
        var actInfo = this.actMoveTo[0];
        var desX = actInfo[0];
        var desY = actInfo[1];
        var speed = actInfo[2];
        var stepX = 0;
        var stepY = 0;
        if (Math.abs(desX - this.x) < 1) {
            this.x = desX;
        }
        if (Math.abs(desY - this.y) < 1) {
            this.y = desY;
        }
        var xDistance = desX - this.x;
        var yDistance = desY - this.y;
        var stepX = xDistance == 0 ? 0 : Math.abs(xDistance / yDistance);
        var stepY = yDistance == 0 ? 0 : Math.abs(yDistance / xDistance);
        var xSign = xDistance > 0 ? 1 : -1;
        var ySign = yDistance > 0 ? 1 : -1;
        if (stepX > stepY) {
            var newX = this.x + xSign * speed;
            var newY = this.y + ySign * stepY * speed;
        } else {
            var newX = this.x + xSign * stepX * speed;
            var newY = this.y + ySign * speed;
        }
        if (xSign > 0) {
            this.x = newX > desX ? desX : newX;
        } else {
            this.x = newX < desX ? desX : newX;
        }
        if (ySign > 0) {
            this.y = newY > desY ? desY : newY;
        } else {
            this.y = newY < desY ? desY : newY;
        }
        if (Math.abs(this.x - this.sprite.x) > 1 || Math.abs(this.y - this.sprite.y) > 1) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }
        if (desX == parseInt(this.x) && desY == parseInt(this.y)) {
            this.actMoveTo.shift();
        }
    }

    exec() {
        if (this.actMoveTo.length > 0) {
            this.processMoveTo();
        }
        this.callback(this.sprite);
        return this;
    }

    run(cb) {
        this.callback = cb;
        return this;
    }

}

/*
  _____ _______   _______                _             
 |  __ \_   _\ \ / /_   _|     /\       | |            
 | |__) || |  \ V /  | |      /  \   ___| |_ ___  _ __ 
 |  ___/ | |   > <   | |     / /\ \ / __| __/ _ \| '__|
 | |    _| |_ / . \ _| |_   / ____ \ (__| || (_) | |   
 |_|   |_____/_/ \_\_____| /_/    \_\___|\__\___/|_|   
                       ______                          
                      |______|                         
*/

class PIXI_Actor {
    constructor(game, url) {
        var self = this;
        if (typeof PIXI_Actor.idx == 'undefined') {
            PIXI_Actor.idx = 0;
        }
        return new Promise(async(resolve, reject) => {
            try {
                PIXI_Actor.texture = null;
                self.collision_obj = null;
                self.game = game;
                self.name = "name_" + PIXI_Actor.idx++;
                self.imgURL = url;
                self.actMoveTo = [];
                self.destroyed = false;
                self.destroyWhenMoveDone = false;
                self.cbCollision = function(actor) {};
                self.callback = function(sprite) {};
                self.cbMoveTo = function(move) {};
                await self.join();
            } catch (ex) {
                return reject(ex);
            }
            resolve(this);
        });
    }

    destroy() {
        this.destroyed = true;
        this.game.remove(this);
        this.sprite.destroy();
    }

    async join() {
        var self = this;

        function createSprite() {
            var texture = PIXI_Actor.texture;
            self.sprite = new PIXI.Sprite(texture);
            var sprite = self.sprite;
            sprite.anchor.x = 0; //0.5;
            sprite.anchor.y = 0; //0.5;
            sprite.rotation = 0;
            sprite.interactive = true;
            sprite.cursor = 'normal';
            sprite.on('click', (event) => {
                console.log("tap");
            });
            self.game.join(self);
            self.game.app.stage.addChild(self.sprite);
        }

        return new Promise((resolve, reject) => {
            if (PIXI_Actor.texture == null) {
                PIXI_Actor.texture = PIXI.Texture.from(self.imgURL);
            }
            createSprite();
            resolve(self);
        });
    }

    show() {
        if (this.destroyed) return this;
        this.sprite.visible = true;
        return this;
    }

    hide() {
        if (this.destroyed) return this;
        this.sprite.visible = false;
        return this;
    }

    collision(cb) {
        if (this.destroyed) return this;
        this.cbCollision = cb;
    }

    size(width, height) {
        if (this.destroyed) return this;
        this.sprite.width = width;
        this.sprite.height = height;
        return this;
    }

    pos(x, y) {
        if (this.destroyed) return this;
        this.x = this.sprite.x = x;
        this.y = this.sprite.y = y;
        return this;
    }

    start(cb) {
        if (this.destroyed) return this;
        this.callback = cb;
        return this;
    }

    moveTo(desX, desY, speed, cb, destroyWhenMoveDone) {
        this.destroyWhenMoveDone = destroyWhenMoveDone;
        if (this.destroyed) return this;
        this.actMoveTo.push([desX, desY, speed]);
        if (typeof cb == 'function') {
            this.cbMoveTo = cb;
        }
    }

    moveToDestroy(desX, desY, speed, cb) {
        if (this.destroyed) return this;
        this.actMoveTo.push([desX, desY, speed]);
        if (typeof cb == 'function') {
            this.cbMoveTo = cb;
        }
        this.destroyWhenMoveDone = true;
    }

    rotate(rotate, anchorX, anchorY) {
        if (this.destroyed) return this;
        if (arguments.length == 1) {
            this.sprite.rotation = rotate;
            return;
        }
        this.sprite.anchor.x = anchorX;
        this.sprite.anchor.y = anchorY;
        return this;
    }

    processMoveTo() {
        var actInfo = this.actMoveTo[0];
        var desX = actInfo[0];
        var desY = actInfo[1];
        var speed = typeof actInfo[2] == 'undefined' ? 1 : actInfo[2];
        var stepX = 0;
        var stepY = 0;
        if (Math.abs(desX - this.x) < 1) {
            this.x = desX;
        }
        if (Math.abs(desY - this.y) < 1) {
            this.y = desY;
        }
        var xDistance = desX - this.x;
        var yDistance = desY - this.y;
        var stepX = xDistance == 0 ? 0 : Math.abs(xDistance / yDistance);
        var stepY = yDistance == 0 ? 0 : Math.abs(yDistance / xDistance);
        var xSign = xDistance > 0 ? 1 : -1;
        var ySign = yDistance > 0 ? 1 : -1;
        if (stepX > stepY) {
            var newX = this.x + xSign * speed;
            var newY = this.y + ySign * stepY * speed;
        } else {
            var newX = this.x + xSign * stepX * speed;
            var newY = this.y + ySign * speed;
        }
        if (xSign > 0) {
            this.x = newX > desX ? desX : newX;
        } else {
            this.x = newX < desX ? desX : newX;
        }
        if (ySign > 0) {
            this.y = newY > desY ? desY : newY;
        } else {
            this.y = newY < desY ? desY : newY;
        }
        if (Math.abs(this.x - this.sprite.x) > 1 || Math.abs(this.y - this.sprite.y) > 1) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }
        //console.log(parseInt(this.x), parseInt(this.y), '-->', parseInt(desX), parseInt(desY));
        if (parseInt(desX) == parseInt(this.x) && parseInt(desY) == parseInt(this.y)) {
            var m = this.actMoveTo.shift();
            this.cbMoveTo(m);
            if (this.actMoveTo.length == 0 && this.destroyWhenMoveDone) {
                this.destroy();
            }
        }
    }

    exec() {
        if (this.destroyed) return this;
        if (this.actMoveTo.length > 0) {
            this.processMoveTo();
        }
        this.callback(this.sprite);
        return this;
    }

    run(cb) {
        this.callback = cb;
        return this;
    }

}

/*
                                                              
,------. ,--.,--.   ,--.,--.      ,------. ,--.               
|  .--. '|  | \  `.'  / |  |      |  .--. '`--' ,---.  ,---.  
|  '--' ||  |  .'    \  |  |      |  '--' |,--.| .-. || .-. : 
|  | --' |  | /  .'.  \ |  |,----.|  | --' |  || '-' '\   --. 
`--'     `--''--'   '--'`--''----'`--'     `--'|  |-'  `----' 
                                               `--'           
*/
class PIXI_Pipe {
    constructor(gameObj) {
        this.g = new PIXI.Graphics();
        this.stage = gameObj.app.stage;
        this.stage.addChild(this.g);
    }
    setColor(color) {
        this.color = color;
        this.g.beginFill(this.color);
    }
    setStroke(radius) {
        this.stroke = radius;
    }

    draw(dotData) {
        this.dotData = dotData;
        for (var i = 0; i < dotData.length; i = i + 3) {
            var x = dotData[i];
            var y = dotData[i + 1];
            var r = dotData[i + 2];
            this.g.drawCircle(x, y, r);
        }
    }
    outOfBound(x, y, r) {
        for (var i = 0; i < this.dotData.length; i = i + 3) {
            var dx = this.dotData[i] - x;
            var dy = this.dotData[i + 1] - y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.dotData[i + 2] / r) {
                return false;
            }
        }
        return true;
    }
}