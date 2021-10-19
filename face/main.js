var cam, c1;
var scrW = window.innerWidth;
var scrH = window.innerHeight;
var cntSec = 30;
var score = 0;
var lastScore = 0;
var world, slingshot, p;
var start = false;
var passAmt = 1;
var initOK = false;

function createCamera() {
    var waContainer = document.getElementById("waContainer");
    c1 = document.createElement('canvas');
    c1.id = 'camera';
    c1.style.opacity = 0.3;
    waContainer.appendChild(c1);
    cam = new Camera(0);
    cam.setCanvas(c1);
    cam.setFlip(true);
    cam.setFitToContainer(true);
}

/**
 * 建構遊戲世界的物件
 * @function createWorld
 */
function createWorld(faceCanvas) {
    world = new waMatter(m, faceCanvas.width, faceCanvas.height);
    world.overlay(faceCanvas);
    world.init();

    /**
     * 新增一個矩形物件
     */
    var obj1 = world.addRectangle(300, 290, 50, 20, {
        isStatic: true,
        render: {
            fillStyle: '#fa9acc',
            strokeStyle: '#ffffff',
            lineWidth: 1
        }
    });
    world.rotate(obj1, 25);

    var obj2 = world.addRectangle(405, 250, 80, 20, {
        isStatic: true,
        render: {
            fillStyle: '#fa9acc',
            strokeStyle: '#ffffff',
            lineWidth: 1
        }
    });
    setInterval(function() {
        if (cntDown.isRunning())
            world.rotate(obj2, -10);
    }, 100);

    /**
     * 新增一個矩形物件（地面)
     */
    world.addRectangle(scrW / 2, scrH, scrW, 20, {
        isStatic: true,
        render: {
            fillStyle: '#cacaca',
            strokeStyle: '#cacaca',
            lineWidth: 1
        }
    });

    /**
     * 新增一個計分籃子，裝彈射的物件
     */
    world.addSVG('./svg/box.svg', 530, 280, 10, {
        isStatic: true,
        render: {
            fillStyle: '#56fa78',
            strokeStyle: '#56fa78',
            lineWidth: 1
        }
    }, function(obj) {
        var c = setInterval(function() {
            score = world.count(530, 200, 120, 250);
            if (cntDown.isRunning()) {
                score = score > 0 ? --score : score;
                p.val((score) * 100 / passAmt);
                if (score == passAmt) {
                    clearInterval(c);
                    cntDown.stop();
                    cam.stop();
                    p.stop();
                    window._waGame_.fireEvent({
                        name: 'over',
                        result: 'pass'
                    });
                } else {
                    if (lastScore != score) {
                        window._waGame_.fireEvent({
                            name: 'score',
                            result: score
                        });
                    }
                }
                lastScore = score;
            }
        }, 1000);
    });
    return world;
}

function waStart() {
    world = createWorld(c1);
    slingshot = new Slingshot(world, 200, 300, 6, 24);
}

/**
 * @function 程式進入點
 */
((async function() {
    createCamera();
    cntDown = new CountDown('sec', cntSec);

    function overlay(baseEle, overEle, opacity, zIndex) {
        baseEle.style.position = 'relative';
        overEle.style.top = baseEle.offsetTop + 'px';
        overEle.style.left = baseEle.offsetLeft + 'px';
        overEle.width = baseEle.width;
        overEle.height = baseEle.height;
        overEle.style.opacity = opacity;
        overEle.style['z-index'] = zIndex;
    }
    overlay(c1, m, 0.5 /*opacity*/ , 1 /*z-index*/ );
    var init = false;
    var lastFaceX, lastFaceY;
    var updateTime, keepTime, detectTime;
    p = new Progress('p');
    p.position(c1.offsetLeft + 25, c1.offsetTop + 20, scrW - 150);
    cam.onCanvas(function(canvas) {
        if (!start) {
            if (!initOK) {
                window._waGame_.readyToGo(window._waGame_);
                initOK = true;
            }
            return;
        }
        if (!init) {
            init = true;
            world.run();
        }
        updateTime = new Date().getTime();
        keepTime = updateTime - detectTime;

        var distance = Math.sqrt(Math.pow(lastFaceX - slingshot.x, 2) +
            Math.pow(lastFaceY - slingshot.y, 2));

        if (lastFaceY > slingshot.y) {
            if (keepTime > 200) {
                slingshot.fire();
            } else if (distance < 100) {
                slingshot.move(lastFaceX, lastFaceY);
            }
        }

        processfn(canvas, function(dets) {
            var ctx = canvas.getContext('2d');
            lastFaceX = dets[i][1];
            lastFaceY = dets[i][0];
            var radius = dets[i][2] / 2;
            ctx.beginPath();
            ctx.arc(lastFaceX, lastFaceY, 10, 0, 2 * Math.PI, false);
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
            //
            lastFaceX = canvas.width - lastFaceX; //flip
            detectTime = new Date().getTime();
        });
    });


})());


class waGame {
    constructor() {
        this.cb = function() {};
        this.readyToGo = function() {
            console.log("ready to go is empty");
        }
    }

    init(gameArgs, cbReadyToGo) {
        this.readyToGo = cbReadyToGo;
        this.gameArgs = gameArgs;
        if (gameArgs.level == 'easy') {
            passAmt = 1;
        } else
        if (gameArgs.level == 'normal') {
            passAmt = 3;
        } else
        if (gameArgs.level == 'hard') {
            passAmt = 5;
        }
        waStart();
    }

    //game start
    start() {
        start = true;
        cntDown.start(function() {
            if (score < 3) {
                window._waGame_.fireEvent({
                    name: 'over',
                    result: 'fail'
                });
            } else {
                window._waGame_.fireEvent({
                    name: 'over',
                    result: 'pass'
                });
            }
            p.stop();
            cam.stop();
        });
    }

    callback(e) {
        this.cb = e;
    }

    fireEvent(obj) {
        this.cb(obj);
    }

    //game over
    over() {

    }
}

window._waGame_ = new waGame();