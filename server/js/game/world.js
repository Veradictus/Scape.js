let Incoming = require('../controllers/incoming');

class World {

    constructor(network) {
        let self = this;

        self.network = network;

        self.sockets = [];

        self.allowConnections = true;

        self.incoming = new Incoming(self, network);
    }

    handleSocket(socket) {
        let self = this;

        if (self.sockets.indexOf(socket) > -1)
            return;

        self.sockets.push(socket);

        log.debug(`Received socket - ${socket.remoteAddress}.`);
    }

    removeSocket(socket) {
        let self = this,
            index = self.sockets.indexOf(socket);

        if (index < 0)
            return;

        self.sockets.splice(index, 1);

        log.debug(`Socket ${socket.remoteAddress} has been disconnected.`);
    }

}

module.exports = World;
