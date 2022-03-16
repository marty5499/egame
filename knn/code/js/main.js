// default css and js
[
    `css/style.css`
].forEach(url => document.write(`<link href="${url}" rel="stylesheet">`));

[
    "https://www.egame.kh.edu.tw/ajax/libs/jquery/3.0.0/jquery.min.js",
    "https://www.egame.kh.edu.tw/ajax/libs/egame/island/0.1.0/island.min.js"
].forEach(url => document.write(`<script src="${url}"></script>`));

if (window.location.pathname.indexOf('play.html') > -1) document.write(`<script src="js/mission.js"></script>`);

(function (window, undefined) {
    function AiKnn() {
        this.init();
    }
    AiKnn.prototype.init = function(images) {
        Island.scaleContent();
        // bind resize 事件
        $(window).resize(function () {
            Island.scaleContent();
        });
    }
    window.AiKnn = AiKnn;
})(window);
