"use strict";
var minSec = 5;
var maxSec = 5;
var readyToGoCnt = 0;



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
        this.readyToGo(this);
    }

    //game start
    start() {
        if (this.gameArgs.level == 'easy') {
            minSec = 3;
            maxSec = 5;
        } else
        if (this.gameArgs.level == 'normal') {
            minSec = 2;
            maxSec = 4;
        } else
        if (this.gameArgs.level == 'hard') {
            minSec = 1;
            maxSec = 3;
        }
        waStart();
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

function waStart() {
    function _asyncToGenerator(fn) {
        return function() {
            var gen = fn.apply(this, arguments);
            return new Promise(function(resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
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

    var scrW = window.innerWidth;
    var scrH = window.innerHeight;

    var rockRightBound = scrW;
    var rockLeftBound = 50;
    var rocketStartX = scrW / 2 - (64 / 2);
    var rocketStartY = scrH - 30;
    var rocketEndY = 0;
    var rockUpperY = scrH - 20;
    var rockLowerY = 20;
    var greenMonsterX = 30;
    var greenMonsterY = 30;
    var redMonsterX = 30;
    var redMonsterY = 150;

    _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var rock, x1, x2, camera, rocket, y1, y2, damage, coll, gameOver, math_random_int, createRock, createRocket;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        createRocket = function createRocket() {
                            rocket = new Actor(cv, {
                                "stage": camera,
                                "img": './img/rocket.png',
                                "pos": [-1000, -1000, 64, 64]
                            });
                            rocket.start();
                            rocket.moveBetween(rocketStartX, rocketStartY, rocketStartX, rocketEndY, 10);
                            rocket.addListener(function() {
                                window._waGame_.fireEvent({
                                    name: 'over',
                                    amt: damage
                                });
                            });
                            rocket.onCollision(function() {
                                damage = damage + 1;
                                window._waGame_.fireEvent({
                                    name: 'collision',
                                    amt: damage
                                });
                                $demoMonster01.talk(String('碰撞次數：') + String(damage));
                                coll = rocket.collisionObj;
                                coll.delete('./img/explosion.gif', 0.5);
                                if (damage > 3) {
                                    $demoMonster01.talk('爆炸了..');
                                    $demoMonster01.emotion('3');
                                    gameOver = true;
                                    window._waGame_.fireEvent({
                                        name: 'over',
                                        amt: damage
                                    });
                                    rocket.delete('./img/explosion.gif', 0.5);
                                }
                            });
                        };

                        createRock = function createRock(rock, x1, x2) {
                            rock = new Actor(cv, {
                                "stage": camera,
                                "img": './img/rock.gif',
                                "pos": [-1000, -1000, 32, 32]
                            });
                            rock.start();
                            y1 = math_random_int(rockLowerY, rockUpperY);
                            y2 = math_random_int(rockLowerY, rockUpperY);
                            rock.moveBetween(x1, y1, x2, y2, math_random_int(minSec, maxSec));
                            rock.onTouch(function(pos) {
                                rock.delete('./img/explosion.gif', 0.5);
                            });
                        };

                        math_random_int = function math_random_int(a, b) {
                            if (a > b) {
                                // Swap a and b to ensure a is smaller.
                                var c = a;
                                a = b;
                                b = c;
                            }
                            return Math.floor(Math.random() * (b - a + 1) + a);
                        };

                        $demoMonster01.display('hide');
                        $demoMonster02.display('hide');
                        $demoMonster03.display('hide');
                        $demoMonster04.display('hide');
                        $demoMonster01.display('show');
                        $demoMonster02.display('show');
                        $demoMonster01.sizeTo(50);
                        $demoMonster02.sizeTo(50);
                        $demoMonster01.toTop();
                        $demoMonster01.moveTo(greenMonsterX, greenMonsterY);
                        $demoMonster02.moveTo(redMonsterX, redMonsterY);
                        _context2.next = 16;
                        return createCamera("0", 640, 480, 0, true, 0.3);

                    case 16:
                        camera = _context2.sent;

                        damage = 0;
                        gameOver = false;
                        $demoMonster01.talk(String('碰撞次數：') + String(damage));
                        _context2.next = 22;
                        return createRocket();

                    case 22:
                        _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            var $ueats285, $qkhsq599, count;
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            $ueats285 = _startLoop_();

                                        case 1:
                                            if (!_loop_[$ueats285]) {
                                                _context.next = 23;
                                                break;
                                            }

                                            if (gameOver) {
                                                _stopAllLoop_();
                                            }
                                            $qkhsq599 = _startLoop_();
                                            count = 0;

                                        case 5:
                                            if (!(count < 5)) {
                                                _context.next = 17;
                                                break;
                                            }

                                            if (_loop_[$qkhsq599]) {
                                                _context.next = 8;
                                                break;
                                            }

                                            return _context.abrupt("break", 17);

                                        case 8:
                                            _context.next = 10;
                                            return createRock(rock, rockLeftBound, rockRightBound);

                                        case 10:
                                            _context.next = 12;
                                            return createRock(rock, rockRightBound, rockLeftBound);

                                        case 12:
                                            _context.next = 14;
                                            return delay(0.001, true);

                                        case 14:
                                            count++;
                                            _context.next = 5;
                                            break;

                                        case 17:
                                            _context.next = 19;
                                            return delay(3, $ueats285);

                                        case 19:
                                            _context.next = 21;
                                            return delay(0.005, true);

                                        case 21:
                                            _context.next = 1;
                                            break;

                                        case 23:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, this);
                        }))();

                        _context2.next = 25;
                        return delay(20, true);

                    case 25:
                        //delay
                        gameOver = true;
                        $demoMonster02.talk('Game Over!');
                        $demoMonster02.emotion('1');

                    case 28:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }))();
}