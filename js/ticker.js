var ticker = PIXI.ticker.shared;

function tickFor(callback, n) {
    if (n === 0) {
        ticker.addOnce(callback);
    } else {
        ticker.addOnce(function() {
            tickFor(callback, n - 1);
        });
    }
}

function scheduler(callback) {
    return function() {
        ticker.addOnce(callback);
    }
}
