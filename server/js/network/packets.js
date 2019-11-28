let Packets = {
    ConnectionPackets: {
        CacheData: 1,
        Login: 14,
        JagGrab: 15,
        WorldLogin: 16
    },

    OutgoingPackets: {
        StartUpPacket: 0,
        WrongPassword: 3,
        OutOfDate: 6
    },

    Read: {
        Int: 0xFF
    }

};

module.exports = Packets;
