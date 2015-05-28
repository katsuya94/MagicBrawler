var DIM = 9;
var HEIGHT = 3;

//Demo Map
// var tileMap  = [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 44, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]]];

//Plateau Chunk
// var tileMap  = [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 44, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 35, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 47, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 48, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]];

//Two level platform
// var tileMap  = [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 71, 71], [ 1, 71, 76], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, 53], [ 1, 71, 72], [ 1, 71, 78], [ 1, 71, 58], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, 53], [ 1, 71, 74], [ 1, 71, 79], [ 1, 71, 58], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, 57, -1], [ 1, 57, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]];


//Flat Map
// var tileMap  = [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]];

//TileList
//1 : basic grass,
//45 53: ramp up right, 46 52: ramp up left, 36 57: ramp down right,37 58: ramp down left,
//Corners: 45 -> 44 <- 46 (up), 46 -> 35 <- 37(left), 36 -> 38 <- 37(down), 45 -> 47 <- 36 (right)


var shadowMap = [[-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1, -1, -1, -1, -1]];

var heightMap = [];
var rampMap = [];
for (var i = 0; i < DIM; i++) {
  heightMap.push([]);
  rampMap.push([]);
}

for(i = 0; i < DIM; i++) {
  for(var j = 0; j < DIM; j++) {
    heightMap[i][j] = 0;
    rampMap[i][j] = -1;
    for (var k = 0; k < HEIGHT; k++){
      var currTile = tileMap[i][j][k];
      switch(currTile){
        case 1:
        case 54: //Blank stone
        case 71: //Mossy stone bleft bright
        case 72: //Mossy stone bleft
        case 73: //Mossy stone bright
        case 74: //Mossy stone bleft tleft
        case 75: //Mossy stone none
        case 76: //Mossy stone bright tright
        case 77: //Mossy stone tleft
        case 78: //Mossy stone tright
        case 79: //Mossy stone tleft tright
          heightMap[i][j] = k;
          break;
        //One-directional ramps
        case 45: //ramp up right
        case 53:
          rampMap[i][j] = 0;
          break;
        case 46: //ramp up left
        case 52:
          rampMap[i][j] = 1;
          break;
        case 36: //ramp down right
        case 57:
          rampMap[i][j] = 3;
          break;
        case 37: //ramp down left
        case 58:
          rampMap[i][j] = 2;
          break;
        //Bidirectional ramps
        case 35:
          rampMap[i][j] = 4;
          break;
        case 38:
          rampMap[i][j] = 5;
          break;
        case 44:
          rampMap[i][j] = 6;
          break;
        case 47:
          rampMap[i][j] = 7;
          break;
        default:
          if (currTile >= 0)
            heightMap[i][j] = k;
      }
    }
  }
}

function mapLayers() {
    var layers = [];
    function across(i, j) {
        var layer = new PIXI.Container();
        for (var l = 0; l < i - j + 1; l++) {
            var k;
            for (k = 0; k < 3; k++) {
                var id = tileMap[j + l][i - l][k];
                if (id < 0) {
                    break;
                } else {
                    var tile = PIXI.Sprite.fromFrame('terrain' + id + '.png');
                    tile.x = 400 - 32 + (i - l) * 32 + (j + l) * -32;
                    tile.y = 300 - 32 + (i - l) * -16 + (j + l) * -16 + k * -32 + 32;
                    layer.addChild(tile);
                }
            }
            var shadowId = shadowMap[j + l][i - l];
            if (shadowId >= 0) {
                var tile = PIXI.Sprite.fromFrame('terrain' + shadowId + '.png');
                tile.x = 400 - 32 + (i - l) * 32 + (j + l) * -32;
                tile.y = 300 - 32 + (i - l) * -16 + (j + l) * -16 + (k - 1) * -32 + 32;
                tile.alpha = 0.5;
                layer.addChild(tile);
            }
        }
        layer.depth = i + j + 1.6;
        layers.push(layer);
    }
    for (var i = 0; i < DIM; i++) {
        across(i, 0);
    }
    for (var j = 1; j < DIM; j++) {
        across(DIM - 1, j);
    }
    return layers;
}

function heightRef(x, y) {
    if (x < 0 || x >= DIM || y < 0 || y >= DIM)
        return 0;
    else
        return heightMap[y][x];
}

function rampRef(x, y) {
    if (x < 0 || x >= DIM || y < 0 || y >= DIM)
        return undefined;
    else
        return rampMap[y][x];
}

function heightAt(x, y, floorX, floorY) {
    var height = heightRef(floorX, floorY);
    var ramp = rampRef(floorX, floorY);
    if (ramp < 0) {
        return height;
    } else {
        switch (ramp) {
            case 0: return height + (x - floorX);
            case 1: return height + (y - floorY);
            case 2: return height + (1 - x + floorX);
            case 3: return height + (1 - y + floorY);
            case 4: return height + Math.min(1 - x + floorX, y - floorY);
            case 5: return height + Math.min(1 - x + floorX, 1 - y + floorY);
            case 6: return height + Math.min(x - floorX, y - floorY);
            case 7: return height + Math.min(x - floorX, 1 - y + floorY);
        }
    }
}

var passMap = [[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
               [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]];

for (var i = 0; i < DIM; i++) {
    for (var j = 0; j < DIM; j++) {
        var height = heightRef(i, j);
        var ramp = rampRef(i, j);
        var pass = [undefined, undefined, undefined, undefined];
        var r;
        var h;

        r = rampRef(i + 1, j);
        h = heightRef(i + 1, j);
        pass[0] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (((r === 0) || (r === 6) || (r === 7)) && h === height) ||
                   (ramp === 0 && h - 1 === height) ||
                   (ramp >= 0 && r >= 0 && h === height));

        r = rampRef(i, j + 1);
        h = heightRef(i, j + 1);
        pass[1] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (((r === 1) || (r === 4) || (r === 6)) && h === height) ||
                   (ramp === 1 && h - 1 === height) ||
                   (ramp >= 0 && r >= 0 && h === height));

        r = rampRef(i - 1, j);
        h = heightRef(i - 1, j);
        pass[2] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (((r === 2) || (r === 4) || (r === 5)) && h === height) ||
                   (ramp === 2 && h - 1 === height) ||
                   (ramp >= 0 && r >= 0 && h === height));

        r = rampRef(i, j - 1);
        h = heightRef(i, j - 1);
        pass[3] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (((r === 3) || (r === 5) || (r === 7)) && h === height) ||
                   (ramp === 3 && h - 1 === height) ||
                   (ramp >= 0 && r >= 0 && h === height));

        passMap[j][i] = pass;
    }
}

function passRef(x, y) {
    if (x < 0 || x >= DIM || y < 0 || y >= DIM)
        return undefined;
    else
        return passMap[y][x];
}

var pass8Map = [[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]];

function pass8Ref(x, y) {
    if (x < 0 || x >= DIM || y < 0 || y >= DIM)
        return undefined;
    else
        return pass8Map[y][x];
}

for (var i = 0; i < DIM; i++) {
    for (var j = 0; j < DIM; j++) {
        var pass = passRef(i, j);
        var passAdjacent = [passRef(i + 1, j), passRef(i, j + 1), passRef(i - 1, j), passRef(i, j - 1)];
        pass8Map[j][i] = [pass[1] && pass[2] && passAdjacent[1][2] && passAdjacent[2][1],
                          pass[1],
                          pass[0] && pass[1] && passAdjacent[0][1] && passAdjacent[1][0],
                          pass[0],
                          pass[0] && pass[3] && passAdjacent[0][3] && passAdjacent[3][0],
                          pass[3],
                          pass[2] && pass[3] && passAdjacent[2][3] && passAdjacent[3][2],
                          pass[2]];
    }
}

/* Floyd-Warshall */

var pathMap = [];

for (var i = 0; i < DIM; i++) {
    var sRow = [];
    for (var j = 0; j < DIM; j++) {
        var sCell = []
        for (var k = 0; k < DIM; k++) {
            var dRow = []
            for (var l = 0; l < DIM; l++) {
                dRow.push({ distance: Infinity, next: undefined });
            }
            sCell.push(dRow);
        }
        sRow.push(sCell);
    }
    pathMap.push(sRow);
}

for (var i = 0; i < DIM; i++) {
    for (var j = 0; j < DIM; j++) {
        pathMap[j][i][j][i].distance = 0;
        pathMap[j][i][j][i].next = null;
    }
}

for (var i = 0; i < DIM; i++) {
    for (var j = 0; j < DIM; j++) {
        var pass8 = pass8Ref(i, j);
        if (pass8[0]) {
            pathMap[j][i][j + 1][i - 1].distance = invsqrt2;
            pathMap[j][i][j + 1][i - 1].next = 0;
        }
        if (pass8[1]) {
            pathMap[j][i][j + 1][i].distance = 1;
            pathMap[j][i][j + 1][i].next = 1;
        }
        if (pass8[2]) {
            pathMap[j][i][j + 1][i + 1].distance = invsqrt2;
            pathMap[j][i][j + 1][i + 1].next = 2;
        }
        if (pass8[3]) {
            pathMap[j][i][j][i + 1].distance = 1;
            pathMap[j][i][j][i + 1].next = 3;
        }
        if (pass8[4]) {
            pathMap[j][i][j - 1][i + 1].distance = invsqrt2;
            pathMap[j][i][j - 1][i + 1].next = 4;
        }
        if (pass8[5]) {
            pathMap[j][i][j - 1][i].distance = 1;
            pathMap[j][i][j - 1][i].next = 5;
        }
        if (pass8[6]) {
            pathMap[j][i][j - 1][i - 1].distance = invsqrt2;
            pathMap[j][i][j - 1][i - 1].next = 6;
        }
        if (pass8[7]) {
            pathMap[j][i][j][i - 1].distance = 1;
            pathMap[j][i][j][i - 1].next = 7;
        }
    }
}

for (var ki = 0; ki < DIM; ki++) {
    for (var kj = 0; kj < DIM; kj++) {
        for (var ii = 0; ii < DIM; ii++) {
            for (var ij = 0; ij < DIM; ij++) {
                for (var ji = 0; ji < DIM; ji++) {
                    for (var jj = 0; jj < DIM; jj++) {
                        if (pathMap[ij][ii][kj][ki].distance + pathMap[kj][ki][jj][ji].distance < pathMap[ij][ii][jj][ji].distance) {
                            pathMap[ij][ii][jj][ji].distance = pathMap[ij][ii][kj][ki].distance + pathMap[kj][ki][jj][ji].distance;
                            pathMap[ij][ii][jj][ji].next = pathMap[ij][ii][kj][ki].next;
                        }
                    }
                }
            }
        }
    }
}

function pathRef(sx, sy, dx, dy) {
    if (sx < 0 || sx >= DIM || sy < 0 || sy >= DIM || dx < 0 || dx >= DIM || dy < 0 || dy >= DIM)
        return undefined;
    else
        return pathMap[sy][sx][dy][dx];
}
