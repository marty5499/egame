const MENU = [
    [
        {
            mid: 0,
            title:"新手任務 階段01",
            items: [
                {txt: "說明", sid:0},
                {txt: "遊戲", sid:6}
            ]
        },
        {
            mid: 0,
            title:"新手任務 階段02",
            items: [
                {txt: "說明", sid:7},
                {txt: "遊戲", sid:0}
            ]
        },
        {
            mid: 0,
            title:"新手任務 階段03",
            items: [
                {txt: "說明", sid:0},
                {txt: "遊戲", sid:0}
            ]
        },
        {
            mid: 0,
            title:"新手任務 階段04",
            items: [
                {txt: "說明", sid:0},
                {txt: "遊戲", sid:0}
            ]
        }
    ],
    [
        {
            mid: 0,
            title:"新手任務 階段05",
            items: [
                {txt: "總複習", sid:0}
            ]
        }
    ]
];

(function (window, undefined) {
    function Menu() {
        this.init();
        this.goPage();
	}
	Menu.prototype.init = function() {
        $("#content").css('background', 'url("images/menu_bg_content.png") no-repeat');
        for (let i = 0; i < 4; i++) {
            var dv = $("<div>", {id: "menu0"+i, class: "menuBlock"});
            dv.append($("<div>", {class: "menuTitle"}));
            dv.append($("<div>", {class: "menuItems"}));
            $("#content").append(dv);
        }
        var menuObj = this;
        $("#content").append($("<button>", {id: "menuPageButtonBack", class: "menuPageButton"}).on("click", function(e){
            menuObj.goPage(menuObj.menuId - 1);
        })).append($("<button>", {id: "menuPageButtonNext", class: "menuPageButton"}).on("click", function(e){
            menuObj.goPage(menuObj.menuId + 1);
        }));
	}
	Menu.prototype.goPage = function(id = 0) {
        this.menuId = id;
        $(".menuTitle").empty();
        $(".menuItems").empty();
        MENU[id].forEach((stage, i) => {
            $(`#menu0${i}>.menuTitle`).text(stage.title);
            stage.items.forEach((btn) => {
                $(`#menu0${i}>.menuItems`).append($('<a>', {class: "menuButton", href: `play.html?mid=${stage.mid}&sid=${btn.sid}`}).html(`<p>${btn.txt}</p>`));
            });
        });
        (id) ? $("#menuPageButtonBack").show() : $("#menuPageButtonBack").hide();
        (id < MENU.length - 1) ? $("#menuPageButtonNext").show() : $("#menuPageButtonNext").hide()
	}
	window.Menu = Menu;
})(window);