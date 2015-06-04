var DIM = 27;
var HEIGHT = 4;
var numChunks = 8;

function valid(x, y) {
    return x >= 0 && x < DIM && y >= 0 && y < DIM;
}

var chunks = [
//TileList
//1 : basic grass,
//Ramps: 45 53: up right, 46 52: up left, 36 57: down right, 37 58: down left,
//Corners: 45 -> 44 <- 46 (up), 46 -> 35 <- 37(left), 36 -> 48 <- 37(down), 45 -> 47 <- 36 (right)
//Water: 80: dl dr, 81: dl, 82: dr, 83: dl ul, 84: blank, 86: dr ur, 87: ul, 88: ur, 89: ul ur, 91: dl ur

//Demo Map
                [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, -1, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1,  1, -1], [ 1,  4, -1], [ 1,  5, -1], [ 1,  3, -1], [ 1,  4, -1], [ 1,  3, -1], [ 1,  1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 36, -1], [ 1,  1, 46], [ 1,  1, 46], [ 1, 36, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 36, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1,  4,  4], [ 1,  5,  5], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, 45, -1], [ 1,  1, 45], [ 1,  5,  4], [ 1,  1,  1], [ 1,  1,  6], [ 1,  1,  6], [ 1,  1,  4], [ 1,  1, 37], [ 1, 37, -1]],
                 [[ 1, 45, -1], [ 1,  1, 45], [ 1,  1,  4], [ 1,  1,  1], [ 1,  4,  4], [ 1,  5,  1], [ 1,  1,  5], [ 1,  5, 37], [ 1, 37, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1,  1, 36], [ 1,  1, 36], [ 1,  1, 36], [ 1,  1, 36], [ 1,  1, 36], [ 1,  1, 38], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, -1, -1]]],

// Plateau Chunk
                [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 44, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 46, -1], [ 1, 35, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, 44], [ 1,  1, 46], [ 1,  1, 35], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, 45], [ 1,  1,  1], [ 1,  1, 37], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, 47], [ 1,  1, 36], [ 1,  1, 38], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 47, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 36, -1], [ 1, 38, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]],

//Two level platform
                [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 71, 71], [ 1, 71, 76], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, 53], [ 1, 71, 72], [ 1, 71, 78], [ 1, 71, 58], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, 53], [ 1, 71, 74], [ 1, 71, 79], [ 1, 71, 58], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, 57, -1], [ 1, 57, -1], [ 1, 57, -1], [ 1, 57, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]],

//Ponds Chunk
                [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [80, -1, -1], [86, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [81, -1, -1], [89, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [80, -1, -1], [86, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [91, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [81, -1, -1], [88, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [83, -1, -1], [89, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [80, -1, -1], [86, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [83, -1, -1], [89, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]],

// //Big lake and ramp
                [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [80, -1, -1], [86, -1, -1], [ 5, -1, -1], [ 1, 45, -1], [ 1,  1, -1], [ 1, 37, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [81, -1, -1], [88, -1, -1], [ 4, -1, -1], [ 3, -1, -1], [ 3, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [81, -1, -1], [84, -1, -1], [82, -1, -1], [82, -1, -1], [86, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [81, -1, -1], [84, -1, -1], [100,-1, -1], [84, -1, -1], [88, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [83, -1, -1], [87, -1, -1], [87, -1, -1], [87, -1, -1], [89, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]],


// var shadowMap = [[-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                  [-1, -1, -1, -1, -1, 22, 26, -1, -1],
//                  [-1, -1, -1, -1, -1, -1, 25, 25, -1],
//                  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//                  [-1, -1, -1, -1, -1, -1, -1, -1, -1]];

// 4 Level map with stairs
                [[[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, 50, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, 52, -1, -1], [ 1, 52, -1, -1], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, 53, -1, -1], [ 1, 54, -1, -1], [ 1, 54, 53, -1], [ 1, 54, 54, -1], [ 1, 54, 52, -1], [ 1, 54, 52, -1], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, 53, -1, -1], [ 1, 54, -1, -1], [ 1, 54, 54, -1], [ 1, 54, 54, 52], [ 1, 54, 54, 52], [ 1, 54, 54, 52], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, 54, -1, -1], [ 1, 54, 54, -1], [ 1, 54, 54, 54], [ 1, 54, 54, 54], [ 1, 54, 54, 54], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, 54, -1, -1], [ 1, 54, 54, -1], [ 1, 54, 54, 54], [ 1, 54, 54, 54], [ 1, 54, 54, 54], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, 54, 54, 54], [ 1, 54, 54, 54], [ 1, 54, 54, 54], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1]],
                 [[ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1], [ 1, -1, -1, -1]]],

//The Arena
                [[[ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 54, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 52, -1], [ 1, 54, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, 54, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, 53, -1], [ 1, 54, -1], [ 1, 58, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]],

///Pillars map
                [[[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1,111], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1,  1,127], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, 12], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1,  1,126], [ 1,  1, 13], [ 1, -1, -1], [ 1,  1,126], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1,  1, 15], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1, 11], [ 1, -1, -1], [ 1, -1, -1], [ 1,  1,119], [ 1, -1, -1]],
                 [[ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1], [ 1, -1, -1]]]
];


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







var sceneryChunk = [[-1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1,100, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1]];

var CHUNKS = DIM / 9;
var chunkList = [];
var tiles = [];
var heightMap = [];
var rampMap = [];
var passMap = [];
var pass8Map = [];
var tileMap = [];
var sceneryMap = [];
var pathMap = [];
var generateMap = function() {
    chunkList = [];
    tiles = [];
    heightMap = [];
    rampMap = [];
    passMap = [];
    pass8Map = [];
    tileMap = [];
    sceneryMap = [];
    pathMap = [];
    for (var i = 0; i < CHUNKS; i++) {
        chunkList.push([]);
        for (var j = 0; j < CHUNKS; j++){
            chunkList[i][j] = chunks[Math.floor(Math.random() * numChunks)];
        }
    }

    for (var i = 0; i < DIM; i++) {
        tileMap.push([]);
        sceneryMap.push([]);
        tiles.push([]);
        for (var j = 0; j < DIM; j++){
            tileMap[i][j] = chunkList[Math.floor(i / 9)][Math.floor(j / 9)][i % 9][j % 9];
            sceneryMap[i][j] = sceneryChunk[i % 9][j % 9];
            tiles[tiles.length - 1].push([]);
        }

        heightMap.push([]);
        rampMap.push([]);
        passMap.push([]);
        pass8Map.push([]);
    }

    for(i = 0; i < DIM; i++) {
      for(var j = 0; j < DIM; j++) {
        heightMap[i][j] = 0;
        rampMap[i][j] = -1;
        for (var k = 0; k < HEIGHT; k++){
            if (tileMap[i][j][k] === 1)
                tileMap[i][j][k] = 1 + Math.floor(19 * Math.random());

            var tile = tileMap[i][j][k] || -1;

            switch(tile){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
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
            case 56:
                rampMap[i][j] = 4;
                break;
            case 38:
                rampMap[i][j] = 5;
                break;
            case 44:
            case 50:
                rampMap[i][j] = 6;
                break;
            case 47:
            case 51:
                rampMap[i][j] = 7;
                break;
            //Water
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 86:
            case 87:
            case 88:
            case 89:
            case 91:
            case 100:
                heightMap[i][j] = -1;
                break;
            //Scenery
            case 111:
            case 119:
            case 126:
            case 127:
            case -1:
                break;
            default:
                throw new Error('Unrecognized Tile');
            }
        }
      }
    }
};

generateMap();

function add(a, b) {
    b.numBehind++;
    a.ahead.push(b);
}

function addPerm(a, b) {
    b.permNumBehind++;
    a.permAhead.push(b);
}

function mapLayers() {
    for (var i = 0; i < DIM; i++) {
        for (var j = 0; j < DIM; j++) {
            var k;
            for (k = 0; k < HEIGHT; k++) {
                var id = tileMap[j][i][k] || -1;
                if (id < 0) {
                    break;
                } else {
                    var tile = PIXI.Sprite.fromFrame('terrain' + id + '.png');
                    tile.x = 400 - 32 + i * 32 + j * -32;
                    tile.y = 300 - 32 + i * -16 + j * -16 + k * -32 + 32;
                    tile.permNumBehind = 0;
                    tile.permAhead = [];
                    tiles[j][i][k] = tile;
                }
            }
            var cap = new PIXI.Container();
            cap.permNumBehind = 0;
            cap.permAhead = [];
            tiles[j][i][k] = cap;
            var sceneryId = sceneryMap[j][i];
            if (sceneryId >= 20 && sceneryId < 34) {
                var shadow = PIXI.Sprite.fromFrame('terrain' + sceneryId + '.png');
                shadow.alpha = 0.5;
                tiles[j][i][k - 1].addChild(shadow);
            } else if (sceneryId >= 0) {
                var scenery = PIXI.Sprite.fromFrame('terrain' + sceneryId + '.png');
                tiles[j][i][k - 1].addChild(scenery);
            }
        }
    }
    for (var i = 0; i < DIM; i++) {
        for (var j = 0; j < DIM; j++) {
            for (var k = 0; k < tiles[j][i].length; k++) {
                if (k > 0)
                    addPerm(tiles[j][i][k - 1], tiles[j][i][k]);
                if (i + 1 < DIM && tiles[j][i + 1][k])
                    addPerm(tiles[j][i + 1][k], tiles[j][i][k]);
                if (j + 1 < DIM && tiles[j + 1][i][k])
                    addPerm(tiles[j + 1][i][k], tiles[j][i][k]);
            }
        }
    }
}

function passRef(x, y) {
    if (!valid(x, y))
        return undefined;
    else
        return passMap[y][x];
}

function pass8Ref(x, y) {
    if (!valid(x, y))
        return undefined;
    else
        return pass8Map[y][x];
}

function heightRef(x, y) {
    if (!valid(x, y))
        return undefined;
    else
        return heightMap[y][x];
}

function rampRef(x, y) {
    if (!valid(x, y))
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

function pathRef(sx, sy, dx, dy) {
    if (!valid(sx, sy) || !valid(dx, dy))
        return undefined;
    else
        return pathMap[sy][sx][dy][dx];
}
function setupMap(){
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
                      (h !== -1) &&
                      ((h < height) ||
                       (r < 0 && h === height) ||
                       (((r === 0) || (r === 6) || (r === 7)) && h === height) ||
                       (ramp === 0 && h - 1 === height) ||
                       (ramp >= 0 && r >= 0 && h === height));

            r = rampRef(i, j + 1);
            h = heightRef(i, j + 1);
            pass[1] = (r !== undefined) &&
                      (h !== -1) &&
                      ((h < height) ||
                       (r < 0 && h === height) ||
                       (((r === 1) || (r === 4) || (r === 6)) && h === height) ||
                       (ramp === 1 && h - 1 === height) ||
                       (ramp >= 0 && r >= 0 && h === height));

            r = rampRef(i - 1, j);
            h = heightRef(i - 1, j);
            pass[2] = (r !== undefined) &&
                      (h !== -1) &&
                      ((h < height) ||
                       (r < 0 && h === height) ||
                       (((r === 2) || (r === 4) || (r === 5)) && h === height) ||
                       (ramp === 2 && h - 1 === height) ||
                       (ramp >= 0 && r >= 0 && h === height));

            r = rampRef(i, j - 1);
            h = heightRef(i, j - 1);
            pass[3] = (r !== undefined) &&
                      (h !== -1) &&
                      ((h < height) ||
                       (r < 0 && h === height) ||
                       (((r === 3) || (r === 5) || (r === 7)) && h === height) ||
                       (ramp === 3 && h - 1 === height) ||
                       (ramp >= 0 && r >= 0 && h === height));

            passMap[j][i] = pass;
        }
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

    /* Dijkstra */


    for (var i = 0; i < DIM; i++) {
        var sRow = [];
        for (var j = 0; j < DIM; j++) {
            var sCell = []
            for (var k = 0; k < DIM; k++) {
                var dRow = []
                for (var l = 0; l < DIM; l++) {
                    dRow.push({x: l, y: k, distance: Infinity, direction: undefined, index: -1});
                }
                sCell.push(dRow);
            }
            sRow.push(sCell);
        }
        pathMap.push(sRow);
    }

    for (var si = 0; si < DIM; si++) {
        for (var sj = 0; sj < DIM; sj++) {
            var heap = [];

            function parent(index) {
                return Math.floor((index - 1) / 2);
            }

            function left(index) {
                return index * 2 + 1;
            }

            function right(index) {
                return index * 2 + 2;
            }

            function set(index, value) {
                value.index = index;
                heap[index] = value;
            }

            function swap(indexA, indexB) {
                var temp = heap[indexA];
                set(indexA, heap[indexB]);
                set(indexB, temp);
                return temp
            }

            function up(index) {
                if (index > 0 && heap[index].distance < heap[parent(index)].distance) {
                    swap(index, parent(index));
                    up(parent(index));
                }
            }

            function down(index) {
                if (left(index) < heap.length) {
                    if (heap[left(index)].distance < heap[index].distance) {
                        if (right(index) >= heap.length || heap[left(index)].distance < heap[right(index)].distance) {
                            swap(index, left(index));
                            down(left(index));
                        } else {
                            swap(index, right(index));
                            down(right(index));
                        }
                    } else if (right(index) < heap.length && heap[right(index)].distance < heap[index].distance) {
                        swap(index, right(index));
                        down(right(index));
                    }
                }
            }

            function dequeue() {
                var min = swap(0, heap.length - 1);
                min.index = -1;
                heap.pop();
                down(0);
                return min;
            }

            for (var di = 0; di < DIM; di++) {
                for (var dj = 0; dj < DIM; dj++) {
                    pathMap[sj][si][dj][di].index = heap.length;
                    heap.push(pathMap[sj][si][dj][di]);
                }
            }

            pathMap[sj][si][sj][si].distance = 0;
            up(pathMap[sj][si][sj][si].index);
            dequeue();

            var pass8 = pass8Ref(si, sj);

            if (pass8[0]) {
                pathMap[sj][si][sj + 1][si - 1].distance = sqrt2;
                pathMap[sj][si][sj + 1][si - 1].direction = 0;
                up(pathMap[sj][si][sj + 1][si - 1].index);
            }

            if (pass8[1]) {
                pathMap[sj][si][sj + 1][si].distance = 1;
                pathMap[sj][si][sj + 1][si].direction = 1;
                up(pathMap[sj][si][sj + 1][si].index);
            }

            if (pass8[2]) {
                pathMap[sj][si][sj + 1][si + 1].distance = sqrt2;
                pathMap[sj][si][sj + 1][si + 1].direction = 2;
                up(pathMap[sj][si][sj + 1][si + 1].index);
            }

            if (pass8[3]) {
                pathMap[sj][si][sj][si + 1].distance = 1;
                pathMap[sj][si][sj][si + 1].direction = 3;
                up(pathMap[sj][si][sj][si + 1].index);
            }

            if (pass8[4]) {
                pathMap[sj][si][sj - 1][si + 1].distance = sqrt2;
                pathMap[sj][si][sj - 1][si + 1].direction = 4;
                up(pathMap[sj][si][sj - 1][si + 1].index);
            }

            if (pass8[5]) {
                pathMap[sj][si][sj - 1][si].distance = 1;
                pathMap[sj][si][sj - 1][si].direction = 5;
                up(pathMap[sj][si][sj - 1][si].index);
            }

            if (pass8[6]) {
                pathMap[sj][si][sj - 1][si - 1].distance = sqrt2;
                pathMap[sj][si][sj - 1][si - 1].direction = 6;
                up(pathMap[sj][si][sj - 1][si - 1].index);
            }

            if (pass8[7]) {
                pathMap[sj][si][sj][si - 1].distance = 1;
                pathMap[sj][si][sj][si - 1].direction = 7;
                up(pathMap[sj][si][sj][si - 1].index);
            }

            while (heap.length) {
                // if (si === 0 && sj === 0)
                //     console.log(heap.map(function(node) {return node.x.toString() + ', ' + node.y.toString() + ', ' + node.distance.toString() + ', ' + node.index.toString();}));
                var node = dequeue();
                var pass8 = pass8Ref(node.x, node.y);

                function edge(successor, d) {
                    if (successor.index >= 0 && pathMap[sj][si][node.y][node.x].distance + d < successor.distance) {
                        successor.distance = pathMap[sj][si][node.y][node.x].distance + d;
                        successor.direction = node.direction;
                        up(successor.index);
                    }
                }

                if (pass8[0])
                    edge(pathMap[sj][si][node.y + 1][node.x - 1], sqrt2);
                if (pass8[1])
                    edge(pathMap[sj][si][node.y + 1][node.x], 1);
                if (pass8[2])
                    edge(pathMap[sj][si][node.y + 1][node.x + 1], sqrt2);
                if (pass8[3])
                    edge(pathMap[sj][si][node.y][node.x + 1], 1);
                if (pass8[4])
                    edge(pathMap[sj][si][node.y - 1][node.x + 1], sqrt2);
                if (pass8[5])
                    edge(pathMap[sj][si][node.y - 1][node.x], 1);
                if (pass8[6])
                    edge(pathMap[sj][si][node.y - 1][node.x - 1], sqrt2);
                if (pass8[7])
                    edge(pathMap[sj][si][node.y][node.x - 1], 1);
            }
        }
    }
}
setupMap();

