let bigInt = require('big-integer');

class DataStream {

    constructor(buffer, socket) {
        let self = this;

        self.buffer = buffer;
        self.socket = socket;

        self.index = 0;
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

}

module.exports = DataStream;
