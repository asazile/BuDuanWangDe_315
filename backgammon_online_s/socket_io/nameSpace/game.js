module.exports = function (gameNameSpace) {
    gameSocketNum = 0;

    gameNameSpace.use((socket, next) => {
        let token = socket.handshake.query.token;
        console.log(token);
        if (token === 'abc') {
            console.log(token, 'is ok!');
            return next();
        }
        return next(new Error('authentication error'));
    });

    gameNameSpace.on('connection', function(socket){
        gameSocketNum++;
        console.log(gameSocketNum, 'game is connection...');

        socket.join('room 237', () => {
            let rooms = Object.keys(socket.rooms);
            console.log(rooms); // [ <socket.id>, 'room 237' ]
        });

        socket.on('disconnect', function(result){
            gameSocketNum--;
            console.log('game user disconnected');
        });

        //setTimeout(() => socket.disconnect(false), 5000);
    });
};