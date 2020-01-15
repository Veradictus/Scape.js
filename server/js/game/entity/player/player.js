let Entity = require('../entity'),
    Interface = require('../../../controllers/interface');

class Player extends Entity {

    constructor(socket) {
        super();

        let self = this;

        self.socket = socket;
        self.interface = new Interface(socket);
    }

    load(data) {
        let self = this;

        log.info('Loading player...');

        self.username = data.username;
        self.displayMode = data.displayMode;
        self.screenWidth = data.screenWidth;
        self.screenHeight = data.screenHeight;

        self.interface.sendWindowPane(378, 1)
    }

}

module.exports = Player;
