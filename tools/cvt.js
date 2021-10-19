var fs = require('fs');
var request = require('sync-request');
var file = 'index.html';
var html = fs.readFileSync(file, 'utf-8');
var reJS = /<script.*?src=(.*?)\.js/ig;
var reLink = /<link.*?href=(.*?)\.css/ig;
var reGif = /<img.*?href=(.*?)\.gif/ig;
var reJpg = /<img.*?href=(.*?)\.jpg/ig;
var rePng = /<img.*?href=(.*?)\.png/ig;


function getScriptTag(html, re) {
    var src = html.match(re);
    if (src != null)
        for (var ii = 0; ii < src.length; ii++) {
            var url = src[ii];
            url = url.substring(url.indexOf("src=") + 5);
            var fn = getFile('./js', url);
            if (fn != null)
                html = html.replace(url, fn);
        }
    return html;
}

function getLinkTag(html, re) {
    var src = html.match(re);
    if (src != null)
        for (var ii = 0; ii < src.length; ii++) {
            var url = src[ii];
            url = url.substring(url.indexOf("href=") + 6);
            var fn = getFile('./css', url);
            if (fn != null)
                html = html.replace(url, fn);
        }
    return html;
}

function getImgTag(html, re) {
    var src = html.match(re);
    if (src != null)
        for (var ii = 0; ii < src.length; ii++) {
            var url = src[ii];
            url = url.substring(url.indexOf("src=") + 5);
            var fn = getFile('./img', url);
            if (fn != null)
                html = html.replace(url, fn);
        }
    return html;
}

function getFile(savePath, url) {
    if (url.indexOf("http") != 0) return null;
    console.log("get:", url);
    var res = request('GET', url);
    var jsText = res.getBody('utf8');
    var str = url.split('/');
    var host = str[0] + str[1] + '//' + str[2];
    var filename = str[str.length - 1];
    var path = savePath + url.substring(host.length, url.length - filename.length);
    fs.mkdirSync(path, { recursive: true });
    fs.writeFileSync(path + filename, jsText, 'utf-8');
    return path + filename;
}

console.log("grap JS...");
html = getScriptTag(html, reJS);
console.log("grap CSS...");
html = getLinkTag(html, reLink);
console.log("grap Image...");
html = getImgTag(html, reGif);
html = getImgTag(html, reJpg);
html = getImgTag(html, rePng);
console.log("done.");
fs.writeFileSync("_" + file, html, 'utf-8');