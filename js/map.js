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

var passMap = [[null, null, null],
               [null, null, null],
               [null, null, null]];

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
        var height = heightRef(i, j);
        var ramp = rampRef(i, j);
        var pass = [null, null, null, null];
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
