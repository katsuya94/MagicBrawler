var sqrt2 = Math.sqrt(2);
var invsqrt2 = 1 / sqrt2;

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

function distance3d(ax, ay, az, bx, by, bz) {
    return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2) + Math.pow(az - bz, 2));
}

function position(px, py, pz) {
    return {x: px * 32 + py * -32 + 400,
            y: px * -16 + py * -16 + pz * -32 + 300};
}

var elementFilters = {
    water: {hue: 320, sat: 1.0},
    air: {hue: 0, sat: -1.0},
    fire: {hue: 110, sat: 1.5},
    earth: {hue: 120, sat: -0.5},
    life: {hue: 45, sat: 1.0}
};

var elementColors = {
    water: {diffuse: 0x0000FF, highlight: 0xFFFFFF},
    air: {diffuse: 0xFFFFFF, highlight: 0xCCCCCC},
    fire: {diffuse: 0xFF0000, highlight: 0xFFCC00},
    earth: {diffuse: 0x996600, highlight: 0xCC9966},
    life: {diffuse: 0xFF00FF, highlight: 0xCC00CC}
};
