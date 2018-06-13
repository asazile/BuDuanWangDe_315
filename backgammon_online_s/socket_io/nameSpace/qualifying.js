module.exports = function (qualifyingNameSpace) {
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
                        qualifyingNameSpace.to(roomId).emit('matched', {
                            matchName1: socket.handshake.query.name,
                            matchName2: socket.otherSocket.handshake.query.name
                        });
                    });
                });

            } else {
                gameWaitPool.push(socket);
            }
        }

        console.log('one poolHander.');
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

    qualifyingNameSpace.on('connection', function(socket){
        gameSocketNum++;
        console.log(gameSocketNum, 'game is connection...');

        let matchResult = matchGameUser(socket, gameWaitPool);

        if (matchResult) {
            console.log('match success!');

            let roomId = socket.id.split('#')[1] + socket.otherSocket.id.split('#')[1];

            socket.join(roomId, () => {
                socket.otherSocket.join(roomId, () => {
                    qualifyingNameSpace.to(roomId).emit('matched', {
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

        socket.on('disconnect', function(result){
            gameSocketNum--;
            console.log('game user disconnected');
        });
    });
};
