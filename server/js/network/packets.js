let Packets = {
    ConnectionPackets: {
        StartUpPacket: 0,
        CacheData: 1,
        OutOfDate: 6,
        Login: 14,
        JagGrab: 15
    },

    Read: {
        Int: 0xFF
    }

};

module.exports = Packets;
