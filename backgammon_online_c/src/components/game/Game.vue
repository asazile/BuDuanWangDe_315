<template>
    <div>
        <div id="userInfo">
            <div class="info-main"><p style="height: 100px; line-height: 100px; margin: 0"><b>VS</b></p></div>

            <div class="info-me">
                <h4>{{ getName }}</h4>
                <h4>{{ getRank }}</h4>
                <el-tag :type="(this.backgammon && this.backgammon.curUser) ? 'warning' : 'info'">{{ myChess }}</el-tag>
            </div>

            <div class="info-you">
                <h4>{{ matchName }}</h4>
                <h4>{{ matchRank }}</h4>
                <el-tag :type="(this.backgammon && this.backgammon.curUser) ? 'info' : 'warning'">{{ matchChess }}</el-tag>
            </div>
        </div>
        <div id="operate">
            <el-button type="warning" plain class="button" @click="surrenderHander" :disabled="surrender">认输</el-button>
            <el-button type="warning" plain class="button" @click="exitGame" :disabled="!gameOver">退出游戏</el-button>
            <span id="chessFlag" class="chess-pieces-black"></span>
        </div>
        <div id="container">
            <div id="chessboard"></div>
        </div>

        <div>
            <p><strong id="info"></strong></p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    const Chain = function (fn) {
        this.fn = fn;
        this.successor = null
    };

    Chain.prototype.setNextSuccessor = function (successor) {
        return this.successor = successor;
    };

    Chain.prototype.passRequest = function () {
        let ret = this.fn.apply(this, arguments);

        if (ret === 'nextSuccessor') {
            return this.successor && this.successor.passRequest.apply(this.successor, arguments);
        }

        return ret;
    };

    export default {
        name: '',
        data() {
            return {
                myChess: '',
                matchName: '',
                matchRank: '',
                matchChess: '',
                backgammon: null,
                gameOver: false,
                surrender: false
            }
        },

        computed: {
            getName () {
                return this.$store.state.name;
            },

            getRank () {
                return this.$store.state.rank;
            },

            getSocket () {
                return this.$store.state.socket;
            },

            getGameType () {
                return this.$store.state.curGameType;
            }
        },

        mounted: function () {
            this.$nextTick(() => {
                let _this = this,
                    socket = this.getSocket;

                const backgammon = {
                    cell: `<div class="box"></div>`,

                    /**
                     * true --> black
                     * false --> white
                     */
                    curColor: true,

                    curUser: false,

                    blackPiece: `<span class="chess-pieces-black"></span>`,

                    whitePiece: `<span class="chess-pieces-white"></span>`,

                    chess: document.getElementById("chessboard"),

                    info: document.getElementById("info"),

                    chessFlag: document.getElementById("chessFlag"),

                    /**
                     * judge game is computer vs user or user vs user
                     * false --> user vs user
                     * true --> user vs computer
                     */
                    isComputer: false,

                    over: false,

                    addPiece: function (x, y) {
                        let item = document.createElement("span");
                        if(this.curColor)
                            item.classList.add("chess-pieces-black");
                        else
                            item.classList.add("chess-pieces-white");

                        item.style.left = (-15 + (y*35)) + "px";
                        item.style.top = (-15 + (x*35)) + "px";
                        this.chess.appendChild(item);
                    },

                    winKindsCount: 672,

                    wins: (function () {
                        let count = 0,
                            wins = [];

                        for(let i=0; i<16; i++) {
                            wins[i] = [];
                            for(let j=0; j<16; j++) {
                                wins[i][j] = [];
                            }
                        }

                        for(let i=0; i<16; i++) {
                            for(let j=0; j<12; j++) {
                                for(let k=0; k<5; k++) {
                                    wins[i][j+k][count] = true;
                                }
                                count++;
                            }
                        }

                        for(let i=0; i<16; i++) {
                            for(let j=0; j<12; j++) {
                                for(let k=0; k<5; k++) {
                                    wins[j+k][i][count] = true;
                                }
                                count++;
                            }
                        }

                        for(let i=0; i<12; i++) {
                            for(let j=0; j<12; j++) {
                                for(let k=0; k<5; k++) {
                                    wins[i+k][j+k][count] = true;
                                }
                                count++;
                            }
                        }

                        for(let i=4; i<16; i++) {
                            for(let j=0; j<12; j++) {
                                for(let k=0; k<5; k++) {
                                    wins[i-k][j+k][count] = true;
                                }
                                count++;
                            }
                        }

                        // 672 kinds
                        //console.log(count);

                        return wins;
                    })(),

                    curChess: (() => {
                        let arr = [];
                        for(let i=0; i<16; i++) {
                            arr[i] = [];
                            for(let j=0; j<16; j++) {
                                arr[i][j] = false;
                            }
                        }

                        return arr;
                    })(),

                    myWins: [],

                    myScore: (() => {
                        let arr = [];
                        for(let i=0; i<16; i++) {
                            arr[i] = [];
                            for(let j=0; j<16; j++) {
                                arr[i][j] = 0;
                            }
                        }

                        return arr;
                    })(),

                    changeColor: function () {
                        this.curColor = !this.curColor;
                        if(this.curColor) {
                            chessFlag.className = "chess-pieces-black";
                        }else {
                            chessFlag.className = "chess-pieces-white";
                        }
                    },

                    checkIsWin: function (x, y) {
                        let flag = false;
                        for(let k=0; k<this.winKindsCount; k++) {
                            if(this.wins[x][y][k]) {

                                this.myWins[k] = (this.myWins[k] === undefined) ? 1 : this.myWins[k]+1;

                                if(this.myWins[k] >= 5) {
                                    this.over = true;
                                    flag = true;
                                    break;
                                }

                            }
                        }
                        return flag;
                    },

                    checkIsDraw: function (curChess) {
                        // is Draw function
                        for (let i=0;i<16;i++) {
                            for (let j=0;j<16;j++) {
                                if (curChess[i][j] === false) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    },

                    gameOver: function (addRank, isWin, normal = true) {
                        this.over = true;
                        _this.surrender = true;
                        _this.gameOver = true;

                        console.log('gameOver');

                        addRank = Number(addRank);

                        let oldRank = Number(_this.getRank),
                            newRank = (oldRank + addRank >= 0) ? (oldRank + addRank) : 0;

                        _this.$store.commit({
                            type: 'updateRank',
                            rank: newRank
                        });

                        console.log('updateRank');

                        const gameOverHandle = function (addRank, oldRank, newRank, isWin, normal) {
                            if (!normal) {
                                _this.$notify({
                                    title: '对方逃跑或掉线',
                                    message: '您取得了胜利！'
                                });
                            }

                            _this.$store.commit({
                                type: 'closeSocket',
                                socket: null
                            });

                            return 'nextSuccessor';
                        };

                        const gameOverWin = function (addRank, oldRank, newRank, isWin) {
                            if (isWin === 1) {
                                backgammon.info.innerText = '大吉大利，今晚赢棋';

                                _this.$confirm(`<p><strong>Win</strong></p><p>${oldRank} ——> ${addRank>=0 ? '+' : '-'}${Math.abs(addRank)}</p><p>${newRank}</p>`, '游戏结束', {
                                    confirmButtonText: '确定',
                                    type: 'success',
                                    center: true,
                                    dangerouslyUseHTMLString: true,
                                    showCancelButton: false
                                });

                            } else {
                                return 'nextSuccessor';
                            }
                        };

                        const gameOverDefeat = function (addRank, oldRank, newRank, isWin) {
                            if (isWin === -1) {
                                backgammon.info.innerText = '再接再厉，愈战愈勇';

                                _this.$confirm(`<p><b>Defeat</b></p><P>${oldRank} ——> ${addRank>=0 ? '+' : '-'}${Math.abs(addRank)}</p><P>${newRank}</P>`, '游戏结束', {
                                    confirmButtonText: '确定',
                                    type: 'warning',
                                    center: true,
                                    dangerouslyUseHTMLString: true,
                                    showCancelButton: false
                                });

                            } else {
                                return 'nextSuccessor';
                            }
                        };

                        const gameOverDraw = function (addRank, oldRank, newRank, isWin) {
                            if (isWin === 0) {
                                backgammon.info.innerText = '平分秋色';

                                _this.$confirm(`<p><b>Draw</b></p><P>${oldRank} ——> ${addRank>=0 ? '+' : '-'}${Math.abs(addRank)}</p><P>${newRank}</P>`, '游戏结束', {
                                    confirmButtonText: '确定',
                                    type: 'info',
                                    center: true,
                                    dangerouslyUseHTMLString: true,
                                    showCancelButton: false
                                });

                            } else {
                                return 'nextSuccessor';
                            }
                        };

                        const gameOverError = function (addRank, oldRank, newRank, isWin) {
                            console.log(new Error('isWin variable type is error.'));
                        };

                        let chainGameOverHandle = new Chain(gameOverHandle),
                            chainGameOverWin = new Chain(gameOverWin),
                            chainGameOverDefeat = new Chain(gameOverDefeat),
                            chainGameOverError = new Chain(gameOverError);

                        chainGameOverHandle.setNextSuccessor(chainGameOverWin);
                        chainGameOverWin.setNextSuccessor(chainGameOverDefeat);
                        chainGameOverDefeat.setNextSuccessor(chainGameOverError);

                        chainGameOverHandle.passRequest(addRank, oldRank, newRank, isWin, normal);
                    },

                    removeChessPiece: function () {
                        let elems = this.chess.children;

                        for(let i=0, len=elems.length; i<len; i++) {
                            if(elems[i] && elems[i].nodeName === "SPAN") {
                                elems[i].parentNode.removeChild(elems[i]);
                                i--;
                                len--;
                            }
                        }
                    },

                    init: function () {
                        // draw chess
                        let allCell = "";
                        for(let i=0; i<15*15; i++) {
                            allCell += this.cell;
                        }
                        this.chess.innerHTML = allCell;

                        this.chess.addEventListener("click", (event) => {
                            if(this.over || !this.curUser) return false;

                            let target = event.target,
                                x = event.offsetX,
                                y = event.offsetY,
                                children = target.parentNode.children,
                                curIndex = undefined,
                                chessX = undefined,
                                chessY = undefined;

                            if(target.className !== "box") return false;

                            //console.log(x, y);

                            for(let i=0, len=children.length; i<len; i++) {
                                if(children[i] === target)
                                    curIndex = i;
                            }

                            //console.log(curIndex);

                            // top left
                            if(x<=10 && y<=10) {
                                chessX = Math.floor(curIndex/15);
                                chessY = curIndex%15;

                                // top right
                            }else if(x>=25 && y<=10) {
                                chessX = Math.floor(curIndex/15);
                                chessY = curIndex%15+1;

                                // bottom left
                            }else if(x<=10 && y>=25) {
                                chessX = Math.floor(curIndex/15)+1;
                                chessY = curIndex%15;

                                // bottom right
                            }else if(x>=25 && y>=25) {
                                chessX = Math.floor(curIndex/15)+1;
                                chessY = curIndex%15+1;
                            }

                            // not in click range
                            if(typeof chessX === "undefined" && typeof chessY === "undefined") return false;

                            // drop this point
                            //console.log(chessX, chessY);
                            this.addPiece(chessX, chessY);

                            // log this point
                            this.curChess[chessX][chessY] = true;

                            // check is win
                            let isWin = this.checkIsWin(chessX, chessY);

                            // if win, then game over.
                            if(isWin) {
                                socket.emit('playChess', {
                                    chessX: chessX,
                                    chessY: chessY,
                                    end: true
                                });

                                let gameType = _this.getGameType;

                                const matching = function (gameType) {
                                    if (gameType === 'matching') {
                                        axios.post('/users/addMGameRecord', {matchName: _this.matchName, isWin: 1});
                                        socket.emit('gameOver', -1);
                                        backgammon.gameOver(0, 1);
                                    } else {
                                        return 'nextSuccessor';
                                    }
                                };

                                const qualifying = function (gameType) {
                                    if (gameType === 'qualifying') {
                                        axios.post('/users/changeRank', {
                                            rA: _this.getRank,
                                            rB: _this.matchRank,
                                            isWin: 1
                                        })
                                            .then((response) => {
                                                let res = response.data;

                                                if(res.status) {
                                                    axios.post('/users/addQGameRecord', {matchName: _this.matchName, isWin: 1, thisRank: (Number(_this.getRank) + res.data.addRank >= 0) ? (Number(_this.getRank) + res.data.addRank) : 0});

                                                    socket.emit('gameOver', -1);
                                                    backgammon.gameOver(res.data.addRank, 1);
                                                }else {
                                                    alert(res.message);
                                                }
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    } else {
                                        return 'nextSuccessor';
                                    }
                                };

                                const error = function (gameType) {
                                    console.log(new Error('gameType variable type is error.'))
                                };

                                let chainMatching = new Chain(matching),
                                    chainQualifying = new Chain(qualifying),
                                    chainError = new Chain(error);

                                chainMatching.setNextSuccessor(chainQualifying);
                                chainQualifying.setNextSuccessor(chainError);

                                chainMatching.passRequest(gameType);

                                return false;
                            }

                            let isDraw = this.checkIsDraw(this.curChess);

                            if (isDraw) {
                                socket.emit('playChess', {
                                    chessX: chessX,
                                    chessY: chessY,
                                    end: true
                                });

                                let gameType = _this.getGameType;

                                const matching = function (gameType) {
                                    if (gameType === 'matching') {
                                        axios.post('/users/addMGameRecord', {matchName: _this.matchName, isWin: 0});
                                        socket.emit('gameOver', 0);
                                        backgammon.gameOver(0, 0);
                                    } else {
                                        return 'nextSuccessor';
                                    }
                                };

                                const qualifying = function (gameType) {
                                    if (gameType === 'qualifying') {
                                        axios.post('/users/changeRank', {
                                            rA: _this.getRank,
                                            rB: _this.matchRank,
                                            isWin: 0
                                        })
                                            .then((response) => {
                                                let res = response.data;

                                                if(res.status) {
                                                    axios.post('/users/addQGameRecord', {matchName: _this.matchName, isWin: 0, thisRank: (Number(_this.getRank) + res.data.addRank >= 0) ? (Number(_this.getRank) + res.data.addRank) : 0});

                                                    socket.emit('gameOver', 0);
                                                    backgammon.gameOver(res.data.addRank, 0);
                                                }else {
                                                    alert(res.message);
                                                }
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    } else {
                                        return 'nextSuccessor';
                                    }
                                };

                                const error = function (gameType) {
                                    console.log(new Error('gameType variable type is error.'))
                                };

                                let chainMatching = new Chain(matching),
                                    chainQualifying = new Chain(qualifying),
                                    chainError = new Chain(error);

                                chainMatching.setNextSuccessor(chainQualifying);
                                chainQualifying.setNextSuccessor(chainError);

                                chainMatching.passRequest(gameType);

                                return false;
                            }

                            // change chess pieces color
                            this.changeColor();
                            this.curUser = false;

                            socket.emit('playChess', {
                                chessX: chessX,
                                chessY: chessY,
                                end: false
                            });

                        }, false);

                        return this;
                    },
                };

                backgammon.init();

                this.backgammon = backgammon;

                socket.on('getUserInfo', (data) => {
                    this.matchName = data.name;
                    this.matchRank = data.rank;
                });

                socket.on('startGame', (data) => {
                    // 1 -> black  0 -> white
                    socket.chess = data[socket.id] === '黑子' ? 1 : 0;
                    this.backgammon.curUser = socket.chess === 1;
                    this.myChess = socket.chess === 1 ? '黑子' : '白子';
                    this.matchChess = socket.chess === 1 ? '白子' : '黑子';

                    this.$notify({
                        title: '游戏开始',
                        message: `您将执 ${data[socket.id]} , 请${data[socket.id] === '黑子' ? '落子开始游戏' : '等待对方落子游戏'}`,
                    });
                });

                socket.on('playChess', (data) => {
                    // drop this point
                    //console.log(chessX, chessY);
                    backgammon.addPiece(data.chessX, data.chessY);

                    // log this point
                    backgammon.curChess[data.chessX][data.chessY] = true;

                    if (data.end) return false;

                    // change chess pieces color
                    backgammon.changeColor();
                    backgammon.curUser = true;
                });

                socket.on('gameOver', (isWin) => {
                    let gameType = _this.getGameType;

                    const matching = function (gameType) {
                        if (gameType === 'matching') {
                            axios.post('/users/addMGameRecord', {matchName: _this.matchName, isWin: -1});
                            backgammon.gameOver(0, isWin);
                        } else {
                            return 'nextSuccessor';
                        }
                    };

                    const qualifying = function (gameType) {
                        if (gameType === 'qualifying') {
                            axios.post('/users/changeRank', {
                                rA: _this.getRank,
                                rB: _this.matchRank,
                                isWin: -1
                            })
                                .then((response) => {
                                    let res = response.data;

                                    if(res.status) {
                                        axios.post('/users/addQGameRecord', {matchName: _this.matchName, isWin: -1, thisRank: (Number(_this.getRank) + res.data.addRank >= 0) ? (Number(_this.getRank) + res.data.addRank) : 0});

                                        backgammon.gameOver(res.data.addRank, isWin);
                                    }else {
                                        alert(res.message);
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        } else {
                            return 'nextSuccessor';
                        }
                    };

                    const error = function (gameType) {
                        console.log(new Error('gameType variable type is error.'))
                    };

                    let chainMatching = new Chain(matching),
                        chainQualifying = new Chain(qualifying),
                        chainError = new Chain(error);

                    chainMatching.setNextSuccessor(chainQualifying);
                    chainQualifying.setNextSuccessor(chainError);

                    chainMatching.passRequest(gameType);
                });

                socket.on('surrender', () => {
                    this.$notify({
                        title: '对方认输',
                        message: '您取得了胜利！'
                    });

                    let gameType = _this.getGameType;

                    const matching = function (gameType) {
                        if (gameType === 'matching') {
                            axios.post('/users/addMGameRecord', {matchName: _this.matchName, isWin: 1});
                            socket.emit('gameOver', -1);
                            backgammon.gameOver(0, 1);
                        } else {
                            return 'nextSuccessor';
                        }
                    };

                    const qualifying = function (gameType) {
                        if (gameType === 'qualifying') {
                            axios.post('/users/changeRank', {
                                rA: _this.getRank,
                                rB: _this.matchRank,
                                isWin: 1
                            })
                                .then((response) => {
                                    let res = response.data;

                                    if(res.status) {
                                        axios.post('/users/addQGameRecord', {matchName: _this.matchName, isWin: 1, thisRank: (Number(_this.getRank) + res.data.addRank >= 0) ? (Number(_this.getRank) + res.data.addRank) : 0});

                                        socket.emit('gameOver', -1);
                                        backgammon.gameOver(res.data.addRank, 1);
                                    }else {
                                        alert(res.message);
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        } else {
                            return 'nextSuccessor';
                        }
                    };

                    const error = function (gameType) {
                        console.log(new Error('gameType variable type is error.'))
                    };

                    let chainMatching = new Chain(matching),
                        chainQualifying = new Chain(qualifying),
                        chainError = new Chain(error);

                    chainMatching.setNextSuccessor(chainQualifying);
                    chainQualifying.setNextSuccessor(chainError);

                    chainMatching.passRequest(gameType);
                });

                socket.on('exitGame', () => {
                    this.$notify({
                        title: '对方逃跑或离线',
                        message: '您取得了胜利！'
                    });

                    let gameType = _this.getGameType;

                    const matching = function (gameType) {
                        if (gameType === 'matching') {
                            axios.post('/users/addMGameRecord', {matchName: _this.matchName, isWin: 1});
                            backgammon.gameOver(0, 1);
                        } else {
                            return 'nextSuccessor';
                        }
                    };

                    const qualifying = function (gameType) {
                        if (gameType === 'qualifying') {
                            axios.post('/users/changeRank', {
                                rA: _this.getRank,
                                rB: _this.matchRank,
                                isWin: 1
                            })
                                .then((response) => {
                                    let res = response.data;

                                    if(res.status) {
                                        axios.post('/users/addQGameRecord', {matchName: _this.matchName, isWin: 1, thisRank: (Number(_this.getRank) + res.data.addRank >= 0) ? (Number(_this.getRank) + res.data.addRank) : 0});

                                        backgammon.gameOver(res.data.addRank, 1);
                                    }else {
                                        alert(res.message);
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        } else {
                            return 'nextSuccessor';
                        }
                    };

                    const error = function (gameType) {
                        console.log(new Error('gameType variable type is error.'))
                    };

                    let chainMatching = new Chain(matching),
                        chainQualifying = new Chain(qualifying),
                        chainError = new Chain(error);

                    chainMatching.setNextSuccessor(chainQualifying);
                    chainQualifying.setNextSuccessor(chainError);

                    chainMatching.passRequest(gameType);
                });

                socket.emit('sendUserInfo', {
                    name: this.getName,
                    rank: this.getRank
                });

                socket.emit('startGame');
            })
        },

        methods: {
            surrenderHander () {
                this.$confirm('确定认输吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getSocket.emit('surrender');
                })
            },

            exitGame () {
                this.$store.commit({
                    type: 'updateCurComponent',
                    currentComponent: 'GameCenter'
                });

                this.$store.commit({
                    type: 'updateIsInGame',
                    isInGame: false
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*-------------------Base----------------------*/
    h4 {
        margin: 10px 0;
    }

    >>> .chess-pieces-black {
        z-index: 100;
        position: absolute;
        width: 30px;
        height: 30px;

        border-radius: 50%;

        background: radial-gradient(10px circle at 60% 35%, #999 10%, #333 160%);
    }
    >>> .chess-pieces-white {
        z-index: 100;
        position: absolute;
        width: 30px;
        height: 30px;

        border-radius: 50%;

        background: radial-gradient(10px circle at 60% 35%, #fff 10%, #999 160%);
    }


    /*------------------Layout---------------------*/
    #container {
        width: 525px;

        margin: 30px auto;
        padding: 15px;

        box-shadow: 0 0 10px 1px #ddd;
        outline: 1px solid #efefef;
    }
    #chessboard {
        position: relative;
        width: 525px;
        height: 525px;

        outline: 1px solid #aaaaaa;
    }
    #chessboard >>> .box {
        display: inline-block;
        vertical-align: top;

        width: 35px;
        height: 35px;

        outline: 1px solid #aaaaaa;
    }
    p {
        font-family: "Microsoft YaHei UI";
        margin: 30px auto;
        text-align: center;
    }
    #operate {
        width: 525px;
        height: 30px;
        margin: 20px auto;

        position: relative;
    }
    #chessFlag {
        top: 0px;
        right: 0px;
    }

    #userInfo {
        width: 525px;
        height: 110px;

        margin: 10px auto;
    }
    .info-main {
        width: 100%;
        height: 100px;

        padding: 0 200px;
        box-sizing: border-box;
        float: left;
    }
    .info-me {
        width: 200px;

        margin-left: -100%;
        float: left;
    }
    .info-you {
        text-align: right;
        width: 200px;

        margin-left: -200px;
        float: left;
    }

    /*------------------Module---------------------*/
    .oper-btn {
        font-family: "Microsoft YaHei UI";
        font-size: 1.125em;
        color: #333333;

        padding:5px 20px;
        background-color: transparent;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        border: 1px solid #333333;
    }
    .oper-btn:hover {
        cursor: pointer;
        color: #ffffff;
        background-color: #333333;
    }
    .oper-btn:focus {
        outline: none;
    }


    /*-------------------State---------------------*/


    /*-------------------Theme---------------------*/
</style>