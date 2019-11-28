let Packets = require('../network/packets'),
    Constants = require('../util/constants');

class Incoming {

    constructor(world, network) {
        let self = this;

        self.world = world;
        self.network = network;

        self.network.onStream((stream, socket) => {
            self.world.handleSocket(socket);

            self.handleStream(stream);
        });

        self.network.onClose((socket) => {
            self.world.removeSocket(socket);
        });
    }

    handleStream(stream) {
        let self = this,
            opcode = stream.read(Packets.Read.Int);

        log.debug(`${opcode} - buffer: ${stream.buffer}`);

        switch(opcode) {
            case Packets.ConnectionPackets.Login:

                break;

            case Packets.ConnectionPackets.CacheData:
                let packetData = Int32Array.from(Constants.CacheData.split(' '));

                log.info(Buffer.from(packetData));
                stream.socket.write(Buffer.from(packetData));

                break;

            case Packets.ConnectionPackets.JagGrab:
                let revision = stream.parse(stream.readRemaining()),
                    response = Buffer.from(Uint32Array.from([Packets.ConnectionPackets.OutOfDate]));

                if (revision !== Constants.Revision) {
                    stream.socket.write(response);
                    stream.socket.destroy();

                    return;
                }

                log.info(`Correct revision received for ${stream.socket.remoteAddress}.`);

                stream.socket.write(Buffer.from(Uint32Array.from([Packets.ConnectionPackets.StartUpPacket])));

                break;

        }
    }

}

module.exports = Incoming;
