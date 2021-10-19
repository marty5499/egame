'use strict';

var scrW = window.innerWidth;
var scrH = window.innerHeight;

var damage = 0;
var readyCnt = 0; // if(readyCnt==8) fireEvent('ready to go');
var start;

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
    }

    //game start
    start() {
        start.show();
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

_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var hands, camera, x, y, stage, lastX, pipe, lastY, box, gogogo, pass, finish, _E5_BB_BA_E7_AB_8B_E9_81_8A_E6_88_B2_E8_88_9E_E5_8F_B0_E8_88_87_E8_A7_92_E8_89_B2;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _E5_BB_BA_E7_AB_8B_E9_81_8A_E6_88_B2_E8_88_9E_E5_8F_B0_E8_88_87_E8_A7_92_E8_89_B2 = (function() {
                        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            _context.next = 2;
                                            return createCamera("0", 640, 480, 0, true, 0.1);

                                        case 2:
                                            camera = _context.sent;

                                            hands = new HandDetect();
                                            hands.setCamera(camera);
                                            stage = new PIXI_Game(camera.getCanvas());
                                            pipe = new PIXI_Pipe(stage);
                                            pipe.setColor(0xc0c0c0);
                                            pipe.draw(JSON.parse('[7,209,60,67,208,60,127,204,60,182,215,55,200,262,50,217,311,50,250,349,50,300,345,50,339,312,50,361,267,45,379,224,45,400,175,50,435,130,55,483,100,55,545,87,60,612,79,65,47,538,65,40,603,65]'));
                                            _context.next = 11;
                                            return new PIXI_Actor(stage, './img/start.png');

                                        case 11:
                                            start = _context.sent;

                                            start.size(100, 100);
                                            start.pos(0, 130);
                                            start.hide();
                                            _context.next = 16;
                                            return new PIXI_Actor(stage, './img/finish.png');

                                        case 16:
                                            finish = _context.sent;

                                            finish.size(100, 100);
                                            finish.pos(999, 350);
                                            _context.next = 21;
                                            return new PIXI_Actor(stage, './img/mouse.png');

                                        case 21:
                                            box = _context.sent;

                                            box.size(60, 40);
                                            box.pos(999, 999);

                                        case 24:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, this);
                        }));

                        return function _E5_BB_BA_E7_AB_8B_E9_81_8A_E6_88_B2_E8_88_9E_E5_8F_B0_E8_88_87_E8_A7_92_E8_89_B2() {
                            return ref.apply(this, arguments);
                        };
                    })();
                    //$bg.fullScreen();
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
                    $demoMonster02.emotion('2');
                    lastX = 0;
                    lastY = 0;
                    gogogo = false;
                    pass = true;
                    _context2.next = 15;
                    return _E5_BB_BA_E7_AB_8B_E9_81_8A_E6_88_B2_E8_88_9E_E5_8F_B0_E8_88_87_E8_A7_92_E8_89_B2();

                case 15:
                    start.collision(function(self, other) {
                        console.log("start...");
                        $demoMonster01.talk('開始~~');
                        $demoMonster02.talk('加油加油...');
                        window._waGame_.fireEvent({
                            name: 'start',
                            result: "true"
                        });
                        gogogo = true;
                        start.destroy();
                        finish.pos(520, 50);
                    });
                    finish.collision(function(self, other) {
                        finish.destroy();
                        $demoMonster01.display('hide');
                        if (pass) {
                            window._waGame_.fireEvent({
                                name: 'over',
                                result: "pass"
                            });
                            $demoMonster02.talk('過關啦～');
                            $demoMonster02.emotion('1');
                        } else {
                            window._waGame_.fireEvent({
                                name: 'over',
                                result: "fail"
                            });
                            $demoMonster02.emotion('3');
                            $demoMonster02.talk('請繼續加油...');
                        }
                    });

                    hands.on(function(handInfo) {
                        x = (640 - hands.handInfo[0] - 300) * (1 / (500 - 300)) * (640 - 0) + 0;
                        y = (hands.handInfo[1] - 50) * (1 / (250 - 50)) * (480 - 0) + 0;
                        x = (lastX + x) / 1.0;
                        y = (lastY + y) / 1.0;
                        box.pos(x, y);
                        if (gogogo && pipe.outOfBound(x, y, 0.8)) {
                            $demoMonster01.emotion('4');
                            $demoMonster01.talk('碰到了');
                            pass = false;
                            window._waGame_.fireEvent({
                                name: 'collision',
                                amt: ++damage
                            });
                        }
                    });
                    _context2.next = 20;
                    return hands.start("#ff0000", 5);

                case 20:
                    hands.startCam("#ff0000", 5);

                case 21:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, this);
}))();