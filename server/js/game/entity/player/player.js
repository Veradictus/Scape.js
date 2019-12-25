let Entity = require('../entity');

class Player extends Entity {

    constructor(stream) {
        let self = this;


        self.stream = stream;
    }

}

module.exports = Player;
