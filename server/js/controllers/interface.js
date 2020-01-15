let DataStream = require('../network/datastream');

class Interface {

    constructor(socket) {
        let self = this;

        self.socket = socket;

        self.interfaceCount = 0; // Not sure why this is necessary.

        /**
        public void sendWindowsPane(int id, int type) {
    		player.getInterfaceManager().setWindowsPane(id);
    		OutputStream stream = new OutputStream(6);
    		stream.writePacket(50);
    		stream.writeShort128(id);
    		stream.writeShort(interPacketsCount++);
    		stream.write128Byte(type);

    		System.out.println(id);
    		System.out.println(interPacketsCount);
    		System.out.println(type);
    		//session.write(stream);
    	}

        */
    }

    sendWindowPane(id, type) {
        let self = this,
            dataStream = new DataStream(self.socket);

        dataStream.write(50);
        dataStream.writeShort128(id);
        dataStream.writeShort(self.interfaceCount++);
        dataStream.write128(type, true);

        dataStream.send();
    }

}

module.exports = Interface;
