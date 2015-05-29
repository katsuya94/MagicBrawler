invsqrt2 = 1 / Math.sqrt(2);

var dx = [-invsqrt2, 0, invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1];
var dy = [invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1, -invsqrt2, 0];

var da = [3 * Math.PI / 4, 2 * Math.PI / 4, 1 * Math.PI / 4, 0 * Math.PI / 4, 7 * Math.PI / 4, 6 * Math.PI / 4, 5 * Math.PI / 4, 4 * Math.PI / 4];

function calcAngle(ax, ay, bx, by) {
    var angle = Math.atan2(ax - bx, ay - by) / (Math.PI / 180);
    return (360 - angle) % 360;
}

function normalize(x, y) {
	norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	return [x / norm, y / norm];
}

function distance(ax, ay, bx, by) {
	return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}
