'use strict';

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
            minSec = 1;
            maxSec = 3;
        } else
        if (this.gameArgs.level == 'normal') {
            minSec = 2;
            maxSec = 4;
        } else
        if (this.gameArgs.level == 'hard') {
            minSec = 3;
            maxSec = 5;
        }
        start = true;
        gameMain();
        console.log('init...');
    }

    //game start
    start() {


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


function _asyncToGenerator(fn) {
    return function() {
        var gen = fn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    //console.log("info:", info);
                    if (++readyCnt == 8) {
                        console.log("ready to go...");
                        window._waGame_.readyToGo(window._waGame_);
                    }
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(function(value) {
                        step("next", value);
                    }, function(err) {
                        step("throw", err);
                    });
                }
            }
            step("next");
        });
    };
}

var readyCnt = 0; // if(readyCnt==8) fireEvent('ready to go');

var scrW = window.innerWidth;
var scrH = window.innerHeight;
var score = 0;
var boxHeight = scrH - 150;
var coinEndY = scrH;
var start = false;
var count = 0;
var totalCoin = 30;
var isReady = false;
var minSec = 1,
    maxSec = 1;

var gameMain = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var actor, x, stage, camera, hands, box, fixX, math_random_int, moveCoin;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    math_random_int = function math_random_int(a, b) {
                        if (a > b) {
                            // Swap a and b to ensure a is smaller.
                            var c = a;
                            a = b;
                            b = c;
                        }
                        return Math.floor(Math.random() * (b - a + 1) + a);
                    };

                    moveCoin = (function() {
                        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(actor) {
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            x = math_random_int(0, scrW);
                                            _context.next = 3;
                                            return new PIXI_Actor(stage, './img/coin.png');
                                        case 3:
                                            actor = _context.sent;
                                            if (!start) {
                                                count = 0;
                                                actor.hide();
                                            } else {
                                                var speed = math_random_int(minSec, maxSec);
                                                var remainCoin = (30 - count - 1);
                                                if (remainCoin == 0) {
                                                    setTimeout(function() {
                                                        $demoMonster02.talk("<h3>遊戲結束");
                                                        window._waGame_.fireEvent({
                                                            name: 'over',
                                                            score: score
                                                        });
                                                    }, speed * 1000);
                                                } else {
                                                    $demoMonster02.talk("<h3>" + remainCoin + "個金幣");
                                                }
                                                actor.size(32, 32);
                                                actor.pos(x, 0);
                                                actor.moveTo(x, coinEndY, speed, function() {}, true);
                                            }
                                        case 7:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, this);
                        }));

                        return function moveCoin(_x) {
                            return ref.apply(this, arguments);
                        };
                    })();

                    $demoMonster01.reset();
                    $demoMonster02.reset();
                    $demoMonster03.reset();
                    $demoMonster04.reset();
                    $demoMonster01.sizeTo(50);
                    $demoMonster02.sizeTo(50);

                    $demoMonster01.display('hide');
                    $demoMonster02.display('hide');
                    $demoMonster03.display('hide');
                    $demoMonster04.display('hide');
                    $demoMonster01.display('show');
                    $demoMonster02.display('show');
                    $demoMonster01.moveTo(100, 25);
                    $demoMonster02.moveTo(scrW - 100, 25);
                    $demoMonster02.talk("<h3>30個金幣");
                    score = 0;
                    _context3.next = 16;
                    return createCamera("0", 160, 120, 0, true, 0.3);

                case 16:
                    camera = _context3.sent;
                    stage = new PIXI_Game(camera.getCanvas());
                    hands = new HandDetect();
                    hands.setCamera(camera);
                    _context3.next = 22;
                    return new PIXI_Actor(stage, './img/box.png');

                case 22:
                    box = _context3.sent;
                    box.size(96, 96);
                    box.pos(0, boxHeight);
                    box.collision(function(self, other) {
                        box.collision_obj.destroy();
                        score = score + 1;
                        $demoMonster01.talk(String('<h3>得到') + String(score) + "個金幣");
                        window._waGame_.fireEvent({
                            name: 'coin',
                            score: score
                        });
                    });
                    hands.on(function(handInfo) {

                        var handX = hands.handInfo[0];
                        var handW = hands.handInfo[2];
                        fixX = (scrW - hands.handInfo[0] - handW - 100) * (1 / (scrW - handW)) * scrW * 2;
                        box.pos(fixX, boxHeight);
                    });
                    _context3.next = 29;
                    return hands.start("#ff0000", 5, function() {
                        //window._waGame_.cbReady();
                    });

                case 29:
                    hands.startCam("#ff0000", 5);
                    _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                        var $utylc637;
                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        $utylc637 = _startLoop_();
                                        count = 0;

                                    case 2:
                                        if (!(count < totalCoin)) {
                                            _context2.next = 14;
                                            break;
                                        }

                                        if (_loop_[$utylc637]) {
                                            _context2.next = 5;
                                            break;
                                        }

                                        return _context2.abrupt('break', 14);

                                    case 5:
                                        _context2.next = 7;
                                        return moveCoin(actor);
                                    case 7:
                                        _context2.next = 9;
                                        return delay(1, $utylc637);

                                    case 9:
                                        _context2.next = 11;
                                        return delay(0.001, true);

                                    case 11:
                                        count++;
                                        _context2.next = 2;
                                        break;

                                    case 14:
                                    case 'end':
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, this);
                    }))();

                case 31:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _callee3, this);
}));