+(async function(window, webduino) {
    'use strict';
    window.createCamera = async function(camSource, width, height, rotate, flip, opacity) {
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
        if (rotate) {
            cam.setRotate(90);
        }
        await cam.start();
        c1.style.position = 'relative';
        c1.style.top = '0';
        return cam;
    }
}(window, window.webduino));