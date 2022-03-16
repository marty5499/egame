document.write(`<link href="css/game.css" rel="stylesheet">`);
document.write(`<link href="missions/${missionJson[PLAYID.mid].key}/${PLAYID.sid}.css" rel="stylesheet">`);
document.write(`<script src="lib/knn/kdTree.js"></script>`);
document.write(`<script src="lib/knn/knn.js"></script>`);
document.write(`<script src="lib/knn/gameUI.js"></script>`);
document.write(`<script src="missions/${missionJson[PLAYID.mid].key}/main.js"></script>`);
document.write(`<script src="missions/${missionJson[PLAYID.mid].key}/${PLAYID.sid}.js"></script>`);


(function (window, undefined) {
    function Game() {
	}
	Game.prototype.init = function(images) {
        this.initHint();
        this.initChart();
        this.initChartGraph();
        this.initBar();
        this.initIntro();
	}
    Game.prototype.initHint = function() {
        $("#gameHint div:last-child").text(gameHint);
    }
    Game.prototype.initChart = function() {
        var chart = $("<div>", {id: "chart"});
        [
            $("<canvas>", {id: "chartGraph"}),
            $("<div>", {id: "chartYT", class: "chartTitle", text: chartLable.yt}),
            $("<div>", {id: "chartYH", class: "chartTag", text: chartLable.yh}),
            $("<div>", {id: "chartYL", class: "chartTag", text: chartLable.yl}),
            $("<div>", {id: "chartXT", class: "chartTitle", text: chartLable.xt}),
            $("<div>", {id: "chartXL", class: "chartTag", text: chartLable.xl}),
            $("<div>", {id: "chartXH", class: "chartTag", text: chartLable.xh}),
        ].forEach(elm => chart.append(elm));
        $("#gameGround").append(chart);
    }
    Game.prototype.initChartGraph = function() {
        this.chartGraph = new GameUI({
            'canvasId': 'chartGraph',
            'grid': false
        });
        this.chartGraph.init();
    }
    Game.prototype.initBar = function() {
        gameBarButton.forEach((button) => {
            $("#gameBar").append($("<button>", {id: button.id}).text(button.text).on('click', button.func));
        });
        
    }
    Game.prototype.initIntro = function() {
        var gameObj = this;
        $("#gameIntroBar").append($("<button>", {id: "gameIntroBarBack"}).on("click", function(e){
            gameObj.goIntro(gameObj.gameIntroId - 1);
        })).append($("<button>", {id: "gameIntroBarNext"}).on("click", function(e){
            gameObj.goIntro(gameObj.gameIntroId + 1);
        }));
        this.setIntro(gameIntro);
        this.goIntro(0);
    }
    Game.prototype.setIntro = function(intro) {
        this.gameIntro = intro;
    }
    Game.prototype.goIntro = function(id) {
        this.gameIntroId = id;
        $("#gameIntroContent").html(this.gameIntro[id]);
        (id) ? $("#gameIntroBarBack").show() : $("#gameIntroBarBack").hide();
        (id < this.gameIntro.length - 1) ? $("#gameIntroBarNext").show() : $("#gameIntroBarNext").hide();
    }
    Game.prototype.showIntro = function(intro) {
        $("#gameIntro").show();
    }
    Game.prototype.hideIntro = function(intro) {
        $("#gameIntro").hide();
    }
    Game.prototype.alert = function(message, button = "確定", func = false) {
        var gameObj = this;
        $("#gameAlertContent").html(message);
        $("#gameAlertButton").text(button);
    }
	window.Game = Game;
})(window);
