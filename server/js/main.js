let Network = require('./network/network'),
    World = require('./game/world'),
    bigInt = require('big-integer'),
    Utils = require('./util/utils'),
    Log = require('log');

log = new Log('info');

function main() {
    let network  = new Network('0.0.0.0', 43594);

    new World(network);

}

main();
