module.exports = function (matchingNameSpace) {
    let gameSocketNum = 0,
        gameWaitPool = [];

    const poolHander = function (gameWaitPool) {
        for (let i=0, len=gameWaitPool.length; i<len; i++) {
            let thatSocket = gameWaitPool[i].connected && gameWaitPool[i],
                weightValue = thatSocket.weightValue || 20;

            if (!thatSocket) {
                gameWaitPool.splice(i, 1);
                i--;
                len--;
                continue;
            }

            if (weightValue < 100) {
                weightValue += 5;
            }
        }

        let socket = gameWaitPool.shift();

        if (socket) {
            let matchResult = matchGameUser(socket, gameWaitPool);

            if (matchResult) {
                console.log('match success!');

                let roomId = socket.id.split('#')[1] + socket.otherSocket.id.split('#')[1];

                socket.join(roomId, () => {
                    socket.otherSocket.join(roomId, () => {
                        matchingNameSpace.to(roomId).emit('matched', {
                            matchName1: socket.handshake.query.name,
                            matchName2: socket.otherSocket.handshake.query.name
                        });
                    });
                });

            } else {
                gameWaitPool.push(socket);
            }
        }

        console.log('matching one poolHander.');
        setTimeout(poolHander, 1000, gameWaitPool);
    };

    const matchGameUser = function (curSocket, gameWaitPool) {
        let result = false,
            curRank = curSocket.handshake.query.rank;

        for (let i=0, len=gameWaitPool.length; i<len; i++) {
            let thatSocket = gameWaitPool[i].connected && gameWaitPool[i];

            if (!thatSocket) {
                gameWaitPool.splice(i, 1);
                i--;
                len--;
                continue;
            }

            let thatRank = thatSocket.handshake.query.rank;

            if (Math.abs(Number(curRank)-Number(thatRank)) <= (curSocket.weightValue || 20)) {
                gameWaitPool.splice(i, 1);

                curSocket.otherSocket = thatSocket;
                thatSocket.otherSocket = curSocket;

                result = true;
                break;
            }
        }

        return result;
    };

    poolHander(gameWaitPool);

    matchingNameSpace.on('connection', function(socket){
        gameSocketNum++;
        console.log(gameSocketNum, 'matching game is connection...');

        let matchResult = matchGameUser(socket, gameWaitPool);

        if (matchResult) {
            console.log('match success!');

            let roomId = socket.id.split('#')[1] + socket.otherSocket.id.split('#')[1];

            socket.roomId = roomId;
            socket.otherSocket.roomId = roomId;

            socket.join(roomId, () => {
                socket.otherSocket.join(roomId, () => {
                    matchingNameSpace.to(roomId).emit('matched', {
                        matchName1: socket.handshake.query.name,
                        matchName2: socket.otherSocket.handshake.query.name
                    });
                });
            });

        } else {
            gameWaitPool.push(socket);
        }


        socket.on('ready', () => {
            socket.otherSocket.emit('ready');
        });

        socket.on('sendUserInfo', (data) => {
            socket.otherSocket.emit('getUserInfo', data);
        });

        socket.on('startGame', () => {
            socket.startGameNum = (socket.startGameNum || 0) + 1;
            socket.otherSocket.startGameNum = (socket.otherSocket.startGameNum || 0) + 1;

            if (socket.startGameNum < 2) return false;

            // 1->black  0->white
            socket.chess = 1;
            socket.otherSocket.chess = 0;

            let data = {};
            data[socket.id] = '黑子';
            data[socket.otherSocket.id] = '白子';

            matchingNameSpace.to(socket.roomId).emit('startGame', data);

        });

        socket.on('playChess', (data) => {
            socket.otherSocket.emit('playChess', data);
        });

        socket.on('gameOver', (isWin) => {
            socket.otherSocket.emit('gameOver', isWin);
        });

        socket.on('surrender', () => {
            socket.otherSocket.emit('surrender');
        });


        socket.on('disconnect', function(result){
            gameSocketNum--;
            console.log('matching game user disconnected');
        });
    });
};
