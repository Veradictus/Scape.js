let net = require('net'),
    DataStream = require('./datastream');

class Network {

    constructor(host, port) {
        let self = this;

        self.host = host;
        self.port = port;
        //app.use(null, null);

        net.createServer((socket) => {

            socket.on('data', (data) => {
                let receivedBuffer = Buffer.from(data, 'hex'),
                    stream = new DataStream(Uint32Array.from(receivedBuffer), socket);

                if (self.streamCallback)
                    self.streamCallback(stream, socket);
            });

            socket.on('close', () => {

                if (self.closeCallback)
                    self.closeCallback(socket);
                    
            });

        }).listen(port, host);

        log.info(`Initialized server on ${port}`);
    }

    onReadySocket(callback) {
        this.readySocketCallback = callback;
    }

    onStream(callback) {
        this.streamCallback = callback;
    }

    onClose(callback) {
        this.closeCallback = callback;
    }
}

module.exports = Network;
