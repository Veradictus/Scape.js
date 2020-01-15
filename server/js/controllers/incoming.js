let Packets = require('../network/packets'),
    Constants = require('../util/constants'),
    Utils = require('../util/utils'),
    DataStream = require('../network/datastream'),
    Player = require('../game/entity/player/player'),
    bigInt = require('big-integer');

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
            opcode = stream.read(),
            response, revision,
            dataStream = new DataStream(stream.socket);

        log.info(`${opcode} - buffer: ${stream.buffer}`);

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

                dataStream.writeData(packetData);
                dataStream.send();

                break;

            case Packets.ConnectionPackets.Login:

                stream.socket.sessionId = stream.read();

                dataStream.writeData([0, 0, 0, 0, 0, 0, 0, 0, 0]);

                dataStream.send();

                break;

            case Packets.ConnectionPackets.JagGrab: // This is the initial cache request.
                revision = stream.parse(stream.readRemaining());

                if (revision !== Constants.Revision) {
                    dataStream.write(Packets.OutgoingPackets.OutOfDate);
                    dataStream.send();

                    stream.socket.destroy();

                    return;
                }

                log.info(`Correct revision received for ${stream.socket.remoteAddress}.`);

                dataStream.write(Packets.OutgoingPackets.StartUpPacket);
                dataStream.send();

                break;

            case Packets.ConnectionPackets.WorldLogin: //Similar to Welcome packet in Kaetram.
                if (!self.world.allowConnections) {
                    dataStream.write(Packets.OutgoingPackets.ServerUpdate);
                    dataStream.send();
                    return;
                }

                let packetSize = stream.readShort();

                if (packetSize != stream.getBufferLength()) {
                    stream.socket.destroy();

                    return;
                }

                revision = stream.readInt();

                if (revision !== Constants.Revision) {

                    dataStream.write(Packets.OutgoingPackets.OutOfDate);
                    dataStream.send();

                    stream.socket.destroy();

                    return;
                }

                /* The following data is not used for anything yet. */

                stream.read(true); // Skipping a byte.

                let displayMode = stream.read(),
                    screenWidth = stream.readShort(),
                    screenHeight = stream.readShort();

                for (let i = 0; i < 24; i++)
                    stream.read(true);

                log.info(stream.readString()); // Settings

                stream.readInt();
                stream.readInt();

                stream.readShort();

                for (let i = 0; i < 29; i++)
                    stream.readInt();

                if (stream.read() != 10) //Perhaps to skip something?
                    stream.read();


                for (let i = 0; i < 4; i++)
                    stream.readInt(); //RSA

                /* ------------------------------------------- */

                //4189090193853298718
                let usernameLong = stream.readLong(),
                    sessionId = usernameLong.shiftRight(16).and(31);

                log.debug(`Username long: ${usernameLong} - ${sessionId}`);
                log.debug(`SessionId: ${stream.socket.sessionId}`);

                if (sessionId.toJSNumber() !== stream.socket.sessionId) {

                    dataStream.write(Packets.OutgoingPackets.BadSession);
                    dataStream.send();

                    stream.socket.destroy();

                    return;
                }

                let usernameString = Utils.longToString(usernameLong);
                let passwordString = stream.readString();

                //TODO - Password Checking here...

                log.info(`Username String: ${usernameString}`);
                log.info(`Password String: ${passwordString}`);

                //stream.socket.write(self.world.createBuffer([Packets.OutgoingPackets.WrongPassword], true));

                let loginDetails = [2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1];

                dataStream.writeData(loginDetails);
                dataStream.send();

                let player = new Player(stream.socket);

                player.load({
                    username: usernameString,
                    displayMode: displayMode,
                    screenWidth: screenWidth,
                    screenHeight: screenHeight
                });

                break;

        }
    }

    send(stream, buffer) {
        stream.socket.write(buffer);
    }

}

module.exports = Incoming;
