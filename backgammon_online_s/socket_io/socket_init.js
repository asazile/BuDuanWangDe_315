const game = require('./nameSpace/game');

module.exports = function (io) {
    /**
     * multiple namespace
     */
    const gameNameSpace = io.of('/game');

    /**
     * mount namespace
     */
    game(gameNameSpace);

    /**
     * io operate
     */

};