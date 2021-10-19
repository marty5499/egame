var axe, shape, cam, cntDown;
var scrW, scrH;
var cntSec = 25;
var start = false;
var lastVal = 0;
var showTime = 5000;

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
        if (this.gameArgs.level == 'easy') {
            showTime = 5000;
        } else
        if (this.gameArgs.level == 'normal') {
            showTime = 3000;
        } else
        if (this.gameArgs.level == 'hard') {
            showTime = 1000;
        }
        waStart();
    }

    start() {
        start = true;
        startShowWood();
        startCountDown();
    }

    callback(e) {
        this.cb = e;
    }
    fireEvent(obj) {
        this.cb(obj);
    }
    over() {

    }
}

window._waGame_ = new waGame();


// Step1. create ploygon
window.onload = function() {
    scrW = window.innerWidth;
    scrH = window.innerHeight;
    createCamera();
    cntDown = new CountDown('sec', cntSec);
    axe = new Axe(document.getElementById("axe"));
    wood = new Wood(document.getElementById("woods"));
    var percent = setInterval(function() {
        var val = wood.calculate();
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
            wood.stop();
            cntDown.stop();
            cam.stop();
            clearInterval(percent);
        }
    }, 1000);
    cntDown.addStopCallback(function() {
        var val = wood.calculate();
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
        wood.stop();
        clearInterval(percent);
    });
};

function createCamera() {
    var c1 = document.createElement('canvas');
    var waContainer = document.getElementById("waContainer");
    c1.id = 'camera';
    c1.style.opacity = 0.3;
    waContainer.appendChild(c1);
    cam = new Camera(0);
    cam.setCanvas(c1);
    cam.setFlip(true);
    cam.setFitToContainer(true);
}


function startShowWood() {
    wood.showUp(showTime, function(x, y) {

    });
}

function waStart() {
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
}

function startCountDown() {
    cntDown.start(function() {
        console.log("over...");
        var val = wood.calculate();
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
        wood.stop();
        cam.stop();
    });
}


// Step3: start handTrack
function startTrack(model) {
    let next = true;
    let predictions = null;
    cam.onCanvas(function(c) {
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

// Step4: cut wood
function render(predictions) {
    for (let i = 0; i < predictions.length; i++) {
        var x = predictions[i].bbox[0];
        var y = predictions[i].bbox[1];
        var w = predictions[i].bbox[2];
        var h = predictions[i].bbox[3];
        var area = w * h;
        if (start) {
            if (area > 120000 || area < 60000) {
                axe.show(x * 3, y * 3);
                wood.touch(x * 3, y * 3);
                return;
            }
        }
        axe.mv(x * 3, y * 3);
    }
}