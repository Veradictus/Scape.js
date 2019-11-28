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
        AccountDisabled: 4,
        LoggedIn: 5,
        OutOfDate: 6,
        WorldFull: 7,
        LoginServerOffline: 8,
        TooManyConnections: 9,
        BadSession: 10,
        WeakPassword: 11,
        MembersRequired: 12,
        CouldNotCompleteLogin: 13,
        ServerUpdate: 14,
        UnexpectedResponse: 15,
        TooManyAttempts: 16,
        StandingInMembersArea: 17,
        AccountLocked: 18,
        FullscreenMembersOnly: 19,
        InvalidLoginServer: 20
    }

};

module.exports = Packets;
