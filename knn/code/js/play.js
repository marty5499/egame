const PLAYID = (function(){
    var urlSearchParams = new URLSearchParams(window.location.search);
    var params = Object.fromEntries(urlSearchParams.entries());
    params.mid = parseInt(params.mid);
    params.mid = (isNaN(params.mid)) ? -1 : params.mid;
    params.sid = parseInt(params.sid);
    params.sid = (isNaN(params.sid)) ? -1 : params.sid;
    return {mid: params.mid, sid: params.sid};
})();

if (missionJson[PLAYID.mid].step[PLAYID.sid]) document.write(`<script src="js/game.js"></script>`);

(function (window, undefined) {
    function Play() {
        for(var k in PLAYID) this[k] = PLAYID[k];
        this.init();
	}
	Play.prototype.init = function(images) {
        this.mission = new Mission(this.mid);
        this.mission.setStep(this.sid);
	}
	window.Play = Play;
})(window);

(function (window, undefined) {
    function Mission(mid) {
        var msn = missionJson[mid];
        this.mid = mid;
        for(var k in msn) this[k] = msn[k];
        this.init()
    }
    Mission.prototype.init = function() {
        this.path = `missions/${this.key}/`;
    }
    Mission.prototype.setStep = function(sid) {
        this.sid = sid;
        (this.step[this.sid]) ? this.initGame() : this.initDemo();
    }
    Mission.prototype.initDemo = function() {
        $("#content").css('background', 'url("images/demo_bg_content.png") no-repeat');
        ["demoTitle", "demoBoard", "demoBar"].forEach(div => $("#content").append($("<div>", {id: div})));
        $("#demoTitle").text(this.title);
        $("#demoBoard").load(`${this.path}${this.sid}.html`);
        if (this.sid) $("#demoBar").append($("<a>", {href: `play.html?mid=${this.mid}&sid=${this.sid-1}`}).text("上一頁"));
        if (this.sid < this.step.length - 1) $("#demoBar").append($("<a>", {href: `play.html?mid=${this.mid}&sid=${this.sid+1}`}).text("下一頁"));
    }
    Mission.prototype.initGame = function() {
        $("#content").css('background', 'url("images/game_bg_content.png") no-repeat');
        ["gameTitle", "gameBoard", "gameHint", "gameBar", "gameIntro", "gameAlert"].forEach(div => $("#content").append($("<div>", {id: div})));
        $("#gameTitle").text(this.title);
        $("#gameBoard").append($("<div>", {id: "gameGround"}));
        $("#gameHint").append($("<div>", {id: "gameHintTitle"}).text("任務提示")).append($("<div>", {id: "gameHintContent"}));
        $("#gameIntro").append($("<div>", {id: "gameIntroContent"})).append($("<div>", {id: "gameIntroBar"}));
        $("#gameAlert").append($("<div>", {id: "gameAlertContent"})).append($("<div>", {id: "gameAlertButton"}));
        this.game = new GameMission;
    }
    window.Mission = Mission;
})(window);
