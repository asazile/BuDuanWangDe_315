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


    export default {
        name: '',
        data() {
            return {
                myChess: '',
                matchName: '',
                matchRank: '',
                matchChess: '',
                backgammon: null
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

                    gameOver: function () {
                        if(this.curColor) {
                            info.innerText = "游戏结束，黑棋取得胜利..."
                        }else {
                            info.innerText = "游戏结束，白棋取得胜利..."
                        }

                        if (Boolean(socket.chess) === this.curColor) {
                            _this.$confirm('Win', '游戏结束', {
                                confirmButtonText: '确定',
                                type: 'success',
                                center: true,
                                showCancelButton: false
                            });
                        } else {
                            _this.$confirm('Defeat', '游戏结束', {
                                confirmButtonText: '确定',
                                type: 'warning',
                                center: true,
                                showCancelButton: false
                            });
                        }
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

                    resetGame: function () {
                        this.removeChessPiece();
                        this.info.innerText = "";
                        this.showGameType();
                        this.over = false;
                        this.curColor = true;
                        this.curChess = (() => {
                            let arr = [];
                            for(let i=0; i<16; i++) {
                                arr[i] = [];
                                for(let j=0; j<16; j++) {
                                    arr[i][j] = false;
                                }
                            }

                            return arr;
                        })();

                        this.myWins = [];
                        this.myScore = (() => {
                            let arr = [];
                            for(let i=0; i<16; i++) {
                                arr[i] = [];
                                for(let j=0; j<16; j++) {
                                    arr[i][j] = 0;
                                }
                            }

                            return arr;
                        })();

                        if(this.curColor) {
                            chessFlag.className = "chess-pieces-black";
                        }else {
                            chessFlag.className = "chess-pieces-white";
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
                                this.gameOver();
                                socket.emit('gameOver');

                                return false;
                            }

                            // change chess pieces color
                            this.changeColor();
                            this.curUser = false;

                            socket.emit('playChess', {
                                chessX: chessX,
                                chessY: chessY
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
                        duration: 0
                    });
                });

                socket.on('playChess', (data) => {
                    // drop this point
                    //console.log(chessX, chessY);
                    backgammon.addPiece(data.chessX, data.chessY);

                    // log this point
                    backgammon.curChess[data.chessX][data.chessY] = true;

                    // change chess pieces color
                    backgammon.changeColor();
                    backgammon.curUser = true;
                });

                socket.on('gameOver', () => {
                    backgammon.gameOver();
                });

                socket.emit('sendUserInfo', {
                    name: this.getName,
                    rank: this.getRank
                });

                socket.emit('startGame');
            })
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