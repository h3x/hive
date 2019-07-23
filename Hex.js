"use strict";
var Hex = /** @class */ (function () {
    function Hex(x, y, size) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.size = size;
        this.color = '#101115';
        this.defaultColor = '#101115';
        this.stroke = '#1012f';
        this.corners = [];
    }
    // set the fill color
    Hex.prototype.setColor = function (color) {
        this.color = color;
        this.defaultColor = color;
    };
    Hex.prototype.setZ = function (z) {
        this.z += z;
    };
    // set the stroke colour
    Hex.prototype.setStroke = function (stroke) {
        this.stroke = stroke;
    };
    Hex.prototype.isMoveable = function () {
        return this.z >= 0;
    };
    Hex.prototype.select = function () {
        this.defaultColor = this.color;
        this.color = 'red';
    };
    Hex.prototype.unselect = function () {
        this.setColor(this.defaultColor);
    };
    Hex.prototype.setLocation = function (x, y, tiles) {
        var _a;
        // simple distance calculation
        function dist(p1, p2) {
            return Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[1] - p2[1]), 2));
        }
        var findTile = function (point, current) {
            // if first run through just return the current tile
            if (!point) {
                return current;
            }
            // return the center of the closest tile to the mouse
            if (dist(point, [x, y]) < dist(current, [x, y])) {
                return point;
            }
            else {
                return current;
            }
        };
        // find the center of the closest tile to the mouse click and set the center of the hex to this location (i.e grid snapping!)
        _a = tiles.reduce(findTile), this.x = _a[0], this.y = _a[1];
    };
    Hex.prototype.getLocation = function () {
        return [this.x, this.y];
    };
    Hex.prototype.hex = function () {
        this.corners = [];
        var lx, ly = 0;
        for (var side = 0; side < 7; side++) {
            lx = this.x + this.size * Math.cos(side * 2 * Math.PI / 6);
            ly = this.y + this.size * Math.sin(side * 2 * Math.PI / 6);
            this.corners.push([lx, ly]);
        }
    };
    Hex.prototype.update = function () {
        //
    };
    Hex.prototype.clickEvent = function (cx, cy, tiles) {
        this.setLocation(cx, cy, tiles);
    };
    Hex.prototype.draw = function (ctx) {
        // update the locations of the corners
        this.hex();
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.color;
        var _a = this.corners[1], lx = _a[0], ly = _a[1];
        // start the path
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        // between each corner, draw a line
        this.corners.forEach(function (point) {
            lx = point[0], ly = point[1];
            ctx.lineTo(lx, ly);
        });
        // am i pretty?
        var my_gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.size, this.y + this.size);
        my_gradient.addColorStop(0, this.color);
        my_gradient.addColorStop(1, 'grey');
        ctx.fillStyle = my_gradient;
        ctx.fill();
        ctx.stroke();
    };
    return Hex;
}());
