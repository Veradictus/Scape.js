let bigInt = require('big-integer'),
    Utils = {};

Utils.validCharacters = ['_', 'a', 'b', 'c', 'd', 'e',
        'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9'];

Utils.longToString = function(long) {
    if (long.lesser(1) || long.greaterOrEquals(0x5b5b57f8a98a5dd1))
        return null;;

    if (long.over(37) == 0)
        return null;

    let i = 0, str = [];

    while (long.notEquals(0)) {
        let long1 = long;

        long = long.over(37);

        str[11 - i++] = Utils.validCharacters[long1.minus(long.times(37))];
    }
    
    return str.join('');
};

module.exports = Utils;
