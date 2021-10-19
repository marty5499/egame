+(async function(window, webduino) {
    'use strict';

    window.createOrGetVideoEle = function(id, url, width, height) {
        var videlem = document.getElementById(id);
        if (videlem == null) {
            var videlem = document.createElement("video");
            videlem.id = id;
            document.body.appendChild(videlem);
        }
        var sourceMP4 = document.createElement("source");
        videlem.appendChild(sourceMP4);
        sourceMP4.type = "video/mp4";
        sourceMP4.src = url;
        videlem.width = width;
        videlem.height = height;
        return videlem;
    }

    window.createCamera = async function(camSource, width, height, rotate, flip, opacity) {
        function pageX(elem) {
            return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
        }

        function pageY(elem) {
            return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop;
        }
        var c1 = document.createElement('canvas');
        var waContainer = document.getElementById("waContainer");
        c1.width = width;
        c1.height = height;
        c1.style.opacity = opacity;
        waContainer.appendChild(c1);
        var cam = new Camera(camSource);
        cam.setFitToContainer(true);
        cam.setFlip(flip);
        cam.setCanvas(c1);
        Actor.left = waContainer.offsetLeft;
        Actor.top = waContainer.offsetTop;
        if (rotate) {
            cam.setRotate(90);
        }
        await cam.start();
        c1.style.position = 'relative';
        c1.style.top = '0';
        return cam;
    }
}(window, window.webduino));