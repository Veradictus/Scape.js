let bigInt = require('big-integer'),
    Utils = require('../util/utils');

class DataStream {

    constructor(socket, buffer) {
        let self = this;

        self.socket = socket;
        self.buffer = buffer;

        self.index = 0;

        if (!self.buffer) {
            self.buffer = Buffer.from([]); // Initialize an empty buffer.

            self.writeable = true;
        }
    }

    read(signed) { //reads an unsigned byte.
        return signed ? this.buffer[this.index++] : this.buffer[this.index++] & 0xFF;
    }

    readInt() {
        return (this.read() << 24) + (this.read() << 16) + (this.read() << 8) + (this.read());
    }

    readLong() {
        let long = bigInt(this.readInt()).and(0xffffffff).shiftLeft(32),
            long1 = bigInt(this.readInt()).and(0xffffffff);

        return long.plus(long1);
    }

    readShort(littleEndian) {
        return littleEndian ? (this.read() + (this.read() << 8)) : ((this.read() << 8) + this.read());
    }

    readString() {
        let i, str = [], j = 0;

        while (i !== 0) {
            i = this.read(true);
            str[j] = String.fromCharCode(i);

            j++;
        }

        return str.join('');
    }

    readRemaining() {
        let self = this,
            arr = [];

        for (let i = self.index, j = 0; i < self.buffer.length; i++, j++)
            arr.push(self.buffer[i]);

        return Uint32Array.from(arr);
    }

    concatBuffer(newData, signed) {
        let self = this;

        if (!self.writeable)
            return;

        let newDataBuffer = Buffer.from(signed ? Int32Array.from(newData) : Uint32Array.from(newData));

        self.buffer = Buffer.concat([self.buffer, newDataBuffer], (self.buffer.length + newData.length));
    }

    write(byte, position, negative) {
        let self = this;

        if (position)
            self.buffer[position] = byte;
        else
            self.concatBuffer([negative ? -byte : byte]);
    }

    write128(byte, inv) {
        this.concatBuffer([inv ? 128 - byte : byte + 128]);
    }

    writeByte3(byte) {
        this.concatBuffer([byte >> 16, byte >> 8, byte]);
    }

    writeShort(val, le) {
        this.concatBuffer(le ? [val, val >> 8] : [val >> 8, val]);
    }

    writeShort128(val, isByte) {
        this.concatBuffer(isByte ? [128 - val] : [val >> 8, val + 128]);
    }

    writeInt(val) {
        this.concatBuffer([val >> 24, val >> 16, val >> 8, val]);
    }

    writeLong(bigInteger) {
        this.concatBuffer([
            parseInt(bigInteger.shiftRight(56)),
            parseInt(bigInteger.shiftRight(48)),
            parseInt(bigInteger.shiftRight(40)),
            parseInt(bigInteger.shiftRight(32)),
            parseInt(bigInteger.shiftRight(24)),
            parseInt(bigInteger.shiftRight(16)),
            parseInt(bigInteger.shiftRight(8)),
            parseInt(bigInteger)
        ]);
    }

    writeString(string) {
        this.concatBuffer(Utils.stringToBytes(string));
    }

    writeData(data, signed) {
        this.concatBuffer(data, signed);
    }

    parse(data) {
        let self = this,
            info = data || self.buffer,
            count = 0, prev;

        //Janky-ass Solution
        for (let i = 0; i < info.length; i++)
            count = (count * 256) + info[i];

        return count;
    }

    hasData() {
        return this.index != this.buffer.length;
    }

    getBufferLength() {
        return this.buffer.length - this.index;
    }

    // Pushes data to the socket.
    send() {
        try {
            this.socket.write(this.buffer);
        } catch(e) {
            log.info('Could not write to stream socket.');
            log.info(e);
        }
    }

}

module.exports = DataStream;
