module.exports = function (qualifyingNameSpace) {
    let gameSocketNum = 0,
        gameWaitPool = [];

    const poolHander = function (gameWaitPool) {
        for (let i=0, len=gameWaitPool.length; i<len; i++) {
            let weightValue = thatSocket.weightValue || 20;

            if (weightValue < 100) {
                weightValue += 5;
            }
        }

        let curSocket = gameWaitPool.shift();

        let matchResult = matchGameUser(socket, gameWaitPool);

        if (matchResult) {
            console.log('match success!');

            matchResult.curSocket.emit('matched', {
                matchName: matchResult.thatSocket.handshake.query.name
            });

            matchResult.thatSocket.emit('matched', {
                matchName: matchResult.curSocket.handshake.query.name
            });

        } else {
            gameWaitPool.push(curSocket);
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
                gameWatePool.splice(i, 1);

                result = {};
                result.curSocket = curSocket;
                result.thatSocket = thatSocket;
                result.roomId = curSocket.id + thatSocket.id;
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

            matchResult.curSocket.emit('matched', {
                matchName: matchResult.thatSocket.handshake.query.name
            });

            matchResult.thatSocket.emit('matched', {
                matchName: matchResult.curSocket.handshake.query.name
            });

        } else {
            gameWaitPool.push(socket);
        }


        socket.on('disconnect', function(result){
            gameSocketNum--;
            console.log('game user disconnected');
        });
    });
};
