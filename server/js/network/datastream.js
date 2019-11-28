class DataStream {

    constructor(buffer, socket) {
        let self = this;

        self.buffer = buffer;
        self.socket = socket;

        self.index = 0;
    }

    read(format) {
        return this.buffer[this.index++] & format;
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
