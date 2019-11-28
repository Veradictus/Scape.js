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
            opcode = stream.read(Packets.Read.Int),
            response;

        log.debug(`${opcode} - buffer: ${stream.buffer}`);

        switch(opcode) {
            case Packets.ConnectionPackets.CacheData: //Sends Update Keys to the client.
                let packetData = Int32Array.from(Constants.CacheData);

                /**
                 * Essentially what we're doing here is sending hard-coded
                 * values for the update keys to the client. This pretty much
                 * tells the client that it has all the cache data.
                 * Though not the correct approach, it is enough to get us through
                 * since the client can do the downloading of the cache instead.
                 * These update keys are obtained from iterating through
                 * the cache file and writing the cache CRC and Revision respectively.
                 * The data -1, 0, -1, 0, 0, 0, 0, -24 is what I'm guessing to be
                 * packet data for the client (-1 being ukey opcode). The rest of the
                 * CacheData in constants is just CRC and Revision of 'completed' cache files (hard-coded).
                 */

                stream.socket.write(Buffer.from(packetData));

                break;

            case Packets.ConnectionPackets.Login:
                let loginResponseArray = self.getRandom(); //Just the opcode.

                loginResponseArray.unshift(0);

                response = Buffer.from(Int32Array.from(loginResponseArray)); //Empty login packet response.

                stream.socket.write(response);

                break;

            case Packets.ConnectionPackets.JagGrab: // This is the initial cache request.
                let revision = stream.parse(stream.readRemaining());

                if (revision !== Constants.Revision) {
                    response = Buffer.from(Uint32Array.from([Packets.OutgoingPackets.OutOfDate]));

                    stream.socket.write(response);
                    stream.socket.destroy();

                    return;
                }

                log.info(`Correct revision received for ${stream.socket.remoteAddress}.`);

                stream.socket.write(Buffer.from(Uint32Array.from([Packets.OutgoingPackets.StartUpPacket])));

                break;

            case Packets.ConnectionPackets.WorldLogin: //Similar to Welcome packet in Kaetram.

                stream.socket.write(Buffer.from(Uint32Array.from([Packets.OutgoingPackets.WrongPassword])));

                break;

        }
    }

    getRandom() { // Used for sending bogus data to the client upon login
        let longVal = (Math.random() * 0x99999999D) << 32,
            arr = [];

        arr[0] = longVal >> 56;
        arr[1] = longVal >> 48;
        arr[2] = longVal >> 40;
        arr[3] = longVal >> 32;
        arr[4] = longVal >> 24;
        arr[5] = longVal >> 16;
        arr[6] = longVal >> 8;
        arr[7] = longVal >> 0;

        return arr;
    }

}

module.exports = Incoming;
