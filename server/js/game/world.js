let Incoming = require('../controllers/incoming');

class World {

    constructor(network) {
        let self = this;

        self.network = network;
        self.incoming = new Incoming(self, network);
    }

}

module.exports = World;
