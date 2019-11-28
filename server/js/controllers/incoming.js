let Packets = require('../network/packets');

class Incoming {

    constructor(world, network) {
        let self = this;

        self.world = world;
        self.network = network;

        self.network.onStream((stream) => {

            self.handleStream(stream);
        });
    }

    handleStream(stream) {
        let self = this,
            opcode = stream.read(Packets.Read.Int);

        switch(opcode) {
            case Packets.ConnectionPackets.Login:

                break;

            case Packets.ConnectionPackets.JagGrab:
                let revision = stream.parse(stream.readRemaining());

                log.info(revision);

                //log.info(stream.readRemaining());
                //log.info('Done');

                break;

        }
    }

}

module.exports = Incoming;
