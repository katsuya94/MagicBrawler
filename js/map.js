var heightMap = [[0, 0, 0],
                 [0, 0, 0],
                 [0, 0, 1]];

function heightRef(x, y) {
    if (x < 0 || x >= 3 || y < 0 || y >= 3)
        return 0;
    else
        return heightMap[y][x];
}

var rampMap = [[-1, -1, -1],
               [-1, -1,  1],
               [-1, -1, -1]];

function rampRef(x, y) {
    if (x < 0 || x >= 3 || y < 0 || y >= 3)
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

var passMap = [[undefined, undefined, undefined],
               [undefined, undefined, undefined],
               [undefined, undefined, undefined]];

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
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
    if (x < 0 || x >= 3 || y < 0 || y >= 3)
        return undefined;
    else
        return passMap[y][x];
}

var pass8Map = [[undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined]];

function pass8Ref(x, y) {
    if (x < 0 || x >= 3 || y < 0 || y >= 3)
        return undefined;
    else
        return pass8Map[y][x];
}

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
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

for (var i = 0; i < 3; i++) {
    var sRow = [];
    for (var j = 0; j < 3; j++) {
        var sCell = []
        for (var k = 0; k < 3; k++) {
            var dRow = []
            for (var l = 0; l < 3; l++) {
                dRow.push({ distance: Infinity, next: undefined });
            }
            sCell.push(dRow);
        }
        sRow.push(sCell);
    }
    pathMap.push(sRow);
}

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
        pathMap[j][i][j][i].distance = 0;
        pathMap[j][i][j][i].next = null;
    }
}

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
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

for (var ki = 0; ki < 3; ki++) {
    for (var kj = 0; kj < 3; kj++) {
        for (var ii = 0; ii < 3; ii++) {
            for (var ij = 0; ij < 3; ij++) {
                for (var ji = 0; ji < 3; ji++) {
                    for (var jj = 0; jj < 3; jj++) {
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
    if (sx < 0 || sx >= 3 || sy < 0 || sy >= 3 || dx < 0 || dx >= 3 || dy < 0 || dy >= 3)
        return undefined;
    else
        return pathMap[sy][sx][dy][dx];
}
