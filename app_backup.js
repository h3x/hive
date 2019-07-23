"use strict";
(function () {
    var canvas = document.getElementById('mycanvas');
    var ctx = canvas.getContext('2d');
    // initially size the canvas the same as the viewport size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // tile attributes
    var size = 50;
    var heightSpace = Math.sqrt(3) * size;
    var widthSpace = 2 * size * 3 / 4;
    var tileCenters = [];
    // called when the canvas needs to be resized
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#101115';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    function hex(x, y, size) {
        var sides = [];
        for (var side = 0; side < 7; side++) {
            var lx = x + size * Math.cos(side * 2 * Math.PI / 6);
            var ly = y + size * Math.sin(side * 2 * Math.PI / 6);
            sides.push([lx, ly]);
        }
        return sides;
    }
    function drawHex(x, y, size) {
        // get all the corner points for the hex
        var hexPoints = hex(x, y, size);
        // start the path
        ctx.beginPath();
        var _a = hexPoints.shift(), sx = _a[0], sy = _a[1];
        ctx.moveTo(sx, sy);
        // draw the hex
        hexPoints.forEach(function (point) {
            var lx = point[0], ly = point[1];
            ctx.lineTo(lx, ly);
        });
        ctx.strokeStyle = '#1012f';
        ctx.fill();
        ctx.stroke();
    }
    // calculate the centers of the map tiles to be used for grid snapping later
    function calcCenters() {
        for (var x = 50; x < canvas.width; x += widthSpace * 2) {
            for (var y = 50; y < canvas.height; y += heightSpace) {
                ctx.lineWidth = 2;
                // temp
                //tiles.forEach( tile => {
                //   tile.draw(ctx);
                //})
                // end temp
                tileCenters.push([x, y]);
                tileCenters.push([x + widthSpace, y + heightSpace / 2]);
            }
        }
    }
    // temp
    var h = new Hex(500, 480, 50);
    h.setColor('#66fcf1');
    var h2 = new Hex(575, 524, 50);
    h2.setColor('#c5c6c7');
    // end temp
    // initial game setup
    function setup() {
        // calculate the centers of the board tiles
        calcCenters();
        h2.setLocation(500, 475, tileCenters);
        h.setLocation(400, 475, tileCenters);
        // listen for click events
        canvas.addEventListener("mousedown", function (evt) {
            var rect = canvas.getBoundingClientRect();
            var cx = rect.left;
            var cy = rect.top;
            h.setLocation(evt.clientX - cx, evt.clientY - cy, tileCenters); // TODO change this
        });
        //resize the canvas to 100% viewport width and height whenever window is resized
        window.addEventListener('resize', function () {
            resizeCanvas();
            calcCenters();
        }, false);
        // start the gameloop
        window.setInterval(function () { return draw(); }, 20);
        // temp
        //draw();
        // end temp
    }
    // the draw loop
    function draw() {
        // clear the screen on every frame
        ctx.fillStyle = '#101115';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        tileCenters.forEach(function (tile) {
            drawHex(tile[0], tile[1], size);
        });
        h.draw(ctx);
        h2.draw(ctx);
    }
    // Setup to initial state of the game
    setup();
})();
