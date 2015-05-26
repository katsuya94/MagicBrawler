invsqrt2 = 1 / Math.sqrt(2);

var dx = [-invsqrt2, 0, invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1];
var dy = [invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1, -invsqrt2, 0];
var calcAngle = function( x,  y,  x1, y1)
{
    var _angle = Math.atan2(x-x1, y-y1) / (Math.PI / 180);
    return (360 - _angle) % 360;
};
var normalize = function(v1, v2){
	norm = Math.sqrt(Math.pow(v1, 2) + Math.pow(v2, 2));
	return [v1 / norm, v2 / norm ];
};
var distance = function(x,  y,  x1, y1)
{
	return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
};