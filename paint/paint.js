var paint, shape, cam, cntDown;
var scrW, scrH;
var cntSec = 30;
var lastVal = 0;
var start = false;
var initGame = false;



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
        waStart();
    }

    //game start
    start() {
        if (this.gameArgs.level == 'easy') {
            //passAmt = 1;
        } else
        if (this.gameArgs.level == 'normal') {} else
        if (this.gameArgs.level == 'hard') {}
        startCountDown();
    }

    callback(e) {
        this.cb = e;
    }

    fireEvent(obj) {
        console.log("fireEvent...", obj);
        this.cb(obj);
    }

    //game over
    over() {

    }
}

window._waGame_ = new waGame();

// Step1. create ploygon
function init() {
    scrW = window.innerWidth;
    scrH = window.innerHeight;
    createCamera();
    cntDown = new CountDown('sec', cntSec);
    paint = new Paint(document.getElementById("ui"));
    shape = new Shape(document.getElementById("shape"));

    shape.shift(scrW / 6, scrH / 15);
    shape.drawPolygon([15, 20], [scrH / 3, scrH / 2.2]);

    // Step2. load handTrack model
    handTrack.load({
        flipHorizontal: true, // flip e.g for video  
        maxNumBoxes: 1, // maximum number of boxes to detect
        //iouThreshold: 0.6,      // ioU threshold for non-max suppression
        scoreThreshold: 0.6, // confidence threshold for predictions.
    }).then(model => {
        startTrack(model);
        window._waGame_.readyToGo(window._waGame_);
    });
};



function waStart() {
    start = true;
    init();
}

function createCamera() {
    var c1 = document.createElement('canvas');
    var waContainer = document.getElementById("waContainer");
    c1.id = 'camera';
    c1.style.opacity = 0.3;
    waContainer.appendChild(c1);
    cam = new Camera(0);
    cam.setFlip(true);
    cam.setFitToContainer(true);
    cam.setCanvas(c1);
}

function startCountDown() {
    cntDown.start(function() {
        var val = shape.calculate();
        if (val < 90) {
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
        cam.stop();
    });
}

// Step3: start handTrack
function startTrack(model) {
    let next = true;
    let predictions = null;

    cam.onCanvas(function(c) {
        if (!initGame) {
            initGame = true;
            var percent = setInterval(function() {
                var val = shape.calculate();
                console.log("val:", val);
                msg.innerHTML = val + "%";
                if (val > lastVal) {
                    lastVal = val;
                    window._waGame_.fireEvent({
                        name: 'percent',
                        amt: val
                    });
                }
                if (val == 100) {
                    window._waGame_.fireEvent({
                        name: 'over',
                        result: 'pass'
                    });
                    cntDown.stop();
                    cam.stop();
                    clearInterval(percent);
                }
            }, 1000);
        }
        if (predictions != null && predictions.length > 0) {
            render(predictions);
        }
        if (model != null && next) {
            model.detect(c).then(p => {
                if (p.length > 0) {
                    predictions = p;
                }
                next = true;
            });
            next = false;
        }
    });
}

// Step4: draw circle
function render(predictions) {
    var context = shape.ctx;
    context.beginPath();
    for (let i = 0; i < predictions.length; i++) {
        var x = predictions[i].bbox[0];
        var y = predictions[i].bbox[1];
        var w = predictions[i].bbox[2];
        var h = predictions[i].bbox[3];
        var area = w * h;
        if (area > 200000 || area < 100000) {
            paint.move(x * 3, y * 3);
            return;
        }
        if (start) {
            paint.draw(x * 2, y * 2);
            context.fillStyle = "#0063FE";
            context.arc(x * 2, y * 2, parseInt(area / 3000), 0, 2 * Math.PI, false);
        }
    }
    context.fill();
}