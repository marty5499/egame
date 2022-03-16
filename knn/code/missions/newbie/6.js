/*
var mangoData = [
    { x:2, y:2 ,answer: "irwin"},
    { x:6, y:6 ,answer: "jinhuang" },
];
*/
var gameHint = "讓艾格爾先帶你探索KNN的世界吧！";
var gameBarButton = [
    {
        id: "gameBarButtonIntro",
        text: "操作說明",
        func: function(e) {
            if ($("#gameIntro").is(":hidden") || play.mission.game.gameIntro != gameIntro) {
                play.mission.game.setIntro(gameIntro);
                play.mission.game.goIntro(0);
                $("#gameIntro").show();
            } else {
                $("#gameIntro").hide();
            }
        }
    },
    {
        id: "gameBarButtonDatatable",
        text: "查看資料",
        func: function(e) {
            if ($("#gameIntro").is(":hidden") || play.mission.game.gameIntro != gameIntroDatatable) {
                play.mission.game.setIntro(gameIntroDatatable);
                play.mission.game.goIntro(0);
                $("#gameIntro").show();
            } else {
                $("#gameIntro").hide();
            }
        }
    },
    {
        id: "gameBarButtonMango",
        text: "芒果特色",
        func: function(e) {
            if ($("#gameIntro").is(":hidden") || play.mission.game.gameIntro != gameIntroMango) {
                play.mission.game.setIntro(gameIntroMango);
                play.mission.game.goIntro(0);
                $("#gameIntro").show();
            } else {
                $("#gameIntro").hide();
            }
        }
    },
    {
        id: "gameBarButtonCheck",
        text: "檢查答案",
        func: function(e) {
            pass = true;
            for (let i in mangoData) {
                if (! mangoData[i].pass) {
                    pass = false;
                    break;
                }
            }
            if (pass) {
                alert("恭喜過關！");
                window.location.href = "menu.html";
            } else {
                alert("尚未過關！")
            }
        }
    }
];
var gameIntro = [
    "我們可以看到圖表上有六個資料點，代表這邊有六顆芒果的資料，你可以猜猜看哪幾顆芒果可能是愛文芒果，那幾顆芒果可能是金煌芒果嗎？",
    "可點選查看資料按鈕觀看芒果的數據資料。",
    "可點選芒果特色按鈕觀看芒果的特色。",
    "請點選資料點來決定資料點是愛文芒果或是金煌芒果。點選完成後再點選檢查答案確認你的答案是否正確。"
];


var Datatable  = {
    title: ["資料編號", "芒果甜度", "表皮顏色","果肉細緻"],
    data: [
        [1, 2, 4, 2],
        [2, 8, 7, 6]
    ]
};
var gameIntroDatatable = [];
(function(){
    var tbl = $("<table>").append($("<thead>")).append($("<tbody>"));
    tbl.children("thead").append($("<tr>"));
    for (let i in Datatable.title) tbl.children("thead").children("tr").append($("<th>").text(Datatable.title[i]));
    for (let i in Datatable.data) {
        var tr = $("<tr>");
        for (var j in Datatable.data[i]) tr.append($("<td>").text(Datatable.data[i][j]));
        tbl.children("tbody").append(tr);
    }
    gameIntroDatatable[0] = tbl.prop('outerHTML');
})();

var gameIntroMango = ['<img src="missions/newbie/images/6.png" width="100%" />'];

(function (window, undefined) {
    function GameMission() {
        Game.call(this);
		this.init();
        this.initMsn();
	}
    GameMission.prototype = Object.create(Game.prototype);
	GameMission.prototype.initMsn = function() {
        this.initChartData();
        this.initChartPanel();
	}
    GameMission.prototype.initChartData = function() {
        for (let i in mangoData) {
            var dt = {
                x: mangoData[i].x,
                y: mangoData[i].y,
                img: {
                    url: 'images/game_data_dot.png',
                    width: 32,
                    height: 48
                }
            };
            this.chartGraph.addObj(dt);
        }
    }
    GameMission.prototype.initChartPanel = function() {
        var self = this;
        this.chartPanel = [];
        for (let i in this.chartGraph.objs) {
            var dt = this.chartGraph.objs[i];
            var pn = new Panel(i);
            pn.setLocation(dt.x, dt.y);
            pn.append($("<div>", {class: "chartPanelTag"}).text(`芒果甜度${dt.kx}`));
            pn.append($("<div>", {class: "chartPanelTag"}).text(`果肉細緻${dt.ky}`));
            pn.append($("<div>", {class: "chartPanelCheck"}).data("id", i).data("tag", "irwin").text("愛文芒果").on('click', function(e) {
                self.checkAnswer($(this).data("id"), $(this).data("tag"), $(this));                
            }));
            pn.append($("<div>", {class: "chartPanelCheck"}).data("id", i).data("tag", "jinhuang").text("金煌芒果").on('click', function(e) {
                self.checkAnswer($(this).data("id"), $(this).data("tag"), $(this));
            }));
            this.chartPanel.push(pn);
        }
        var self = this;
        this.chartGraph.clickEvent = function(evt, obj) {
            self.chartPanel[obj.serial - 1].toggle();
        }
    }
    GameMission.prototype.checkAnswer = function(id, tag, target) {
        if (mangoData[id].answer == tag) {
            this.chartGraph.objs[id].imgEle.src = `images/game_data_${tag}.png`;
            target.css("background-image", 'url("images/game_bg_check.png")');
            mangoData[id].pass = true;
        } else {
            alert("不對喔！");
        }
    }
	window.GameMission = GameMission;
})(window);

class Panel {
    constructor(id) {
        this.id = id;
        this.init();
    }
    init() {
        this.ele = $("<div>", {id: `chartPanel${this.id}`, class: "chartPanel"});
        $("#chart").append(this.ele);
    }
    setLocation(x, y) {
        this.ele.css({"top": `${y+20}px`, "left": `${x+70}px`});
    }
    append(obj) {
        this.ele.append(obj);
    }
    toggle() {
        (this.ele.is(":hidden")) ? this.ele.show() : this.ele.hide();
    }
    hide() {
        this.ele.hide();
    }
}

/*
class Panel {
    constructor(id, container) {
        this.container = container;
        this.ele = document.getElementById(id);
        this.p1 = this.ele.children[1];
        this.p2 = this.ele.children[2];
        var self = this;
        this.p1.addEventListener('click', function (e) {
            self.obj.imgEle.src =
                'https://md.kingkit.codes/uploads/upload_cd6ade2823442fc61bd23435b1cc070f.png';
        });
        this.p2.addEventListener('click', function (e) {
            self.obj.imgEle.src =
                'https://cdn.pixabay.com/photo/2016/04/01/11/31/banana-1300390_960_720.png';
        });
    }
    move(x, y) {
        var pos = this.container.getBoundingClientRect();
        var fixH = pos.height / this.container.height;
        var fixW = pos.width / this.container.width;
        this.ele.style.top = (pos.top + y * fixH) + "px";
        this.ele.style.left = (pos.left + x * fixW) + "px";
    }
    show() {
        this.ele.style.display = ''
    }
    hide() {
        this.ele.style.display = 'none'
    }
}
*/
