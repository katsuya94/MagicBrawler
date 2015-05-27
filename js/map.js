var DIM = 9;
var HEIGHT = 3;

// var tileMap  = [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 44, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
//                 [[ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]]];

var tileMap  = [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1, 44, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1,  45, -1], [ 1, 1, -1], [ 1, 1, -1], [ 1,  1, -1], [ 1, 1, -1], [ 1, 1, -1], [ 1,  1, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1, 45, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1, 45, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1,  45, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1, 45, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1, 45, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1]],
                [[ 1, -1, -1], [ 1,  -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [ 1, -1, -1]]];

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
          heightMap[i][j] = k;
          break;
        case 45:
        case 46:
        case 38:
        case 37:
          rampMap[i][j] = 1;
      }
    }
  }
}

function mapLayers() {
    var layers = [];
    function across(i, j) {
        var layer = new PIXI.Container();
        for (var l = 0; l < i - j + 1; l++) {
            for (var k = 0; k < 3; k++) {
                var id = tileMap[j + l][i - l][k];
                if (id >= 0) {
                    var tile = PIXI.Sprite.fromFrame('terrain' + id + '.png');
                    tile.x = 400 - 32 + (i - l) * 32 + (j + l) * -32;
                    tile.y = 300 - 32 + (i - l) * -16 + (j + l) * -16 + k * -32 + 32;
                    layer.addChild(tile);
                }
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

// var heightMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
//                  [0, 0, 0, 0, 0, 0, 0, 0, 0],
//                  [0, 1, 0, 0, 1, 0, 0, 1, 0],
//                  [0, 0, 0, 0, 0, 0, 0, 0, 0],
//                  [0, 0, 0, 0, 0, 0, 0, 0, 0],
//                  [0, 1, 0, 0, 1, 0, 0, 1, 0],
//                  [0, 0, 0, 0, 0, 0, 0, 0, 0],
//                  [0, 0, 0, 0, 0, 0, 0, 0, 0],
//                  [0, 1, 0, 0, 1, 0, 0, 1, 0]];

function heightRef(x, y) {
    if (x < 0 || x >= DIM || y < 0 || y >= DIM)
        return 0;
    else
        return heightMap[y][x];
}

// var rampMap = [[-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                [-1,  1, -1, -1,  1, -1, -1,  1, -1],
//                [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                [-1,  1, -1, -1,  1, -1, -1,  1, -1],
//                [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                [-1,  1, -1, -1,  1, -1, -1,  1, -1],
//                [-1, -1, -1, -1, -1, -1, -1, -1, -1]];

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
            default: return height;
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
                   (r === 0 && h === height) ||
                   (ramp === 0 && h - 1 === height));

        r = rampRef(i, j + 1);
        h = heightRef(i, j + 1);
        pass[1] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (r === 1 && h === height) ||
                   (ramp === 1 && h - 1 === height));

        r = rampRef(i - 1, j);
        h = heightRef(i - 1, j);
        pass[2] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (r === 2 && h === height) ||
                   (ramp === 2 && h - 1 === height));

        r = rampRef(i, j - 1);
        h = heightRef(i, j - 1);
        pass[3] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (r === 3 && h === height) ||
                   (ramp === 3 && h - 1 === height));

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
