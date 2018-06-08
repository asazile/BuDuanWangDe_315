<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><span style="cursor: pointer; font-weight: bold;" @click="backGameCenter">Game Center</span></el-breadcrumb-item>
            <el-breadcrumb-item>人机对战</el-breadcrumb-item>
        </el-breadcrumb>

        <h1 style="text-align: center; margin: 40px 0">人机对战</h1>

        <div id="operate">
            <button class="oper-btn" id="r">reset</button>

            <span id="chessFlag" class="chess-pieces-black"></span>
        </div>
        <div id="container">
            <div id="chessboard"></div>
        </div>

        <div>
            <p><strong id="type"></strong></p>
            <p><strong id="info"></strong></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',

        data() {
            return {
                msg: ''
            }
        },

        methods: {
            backGameCenter () {
                console.log(111);
                this.$store.commit({
                    type: 'updateCurComponent',
                    currentComponent: 'GameCenter'
                });
            }
        },

        mounted: function () {
            let _this = this;

            this.$nextTick(function () {
                (function () {
                    const backgammon = {
                        cell: `<div class="box"></div>`,

                        /**
                         * true --> black
                         * false --> white
                         */
                        curColor: true,

                        blackPiece: `<span class="chess-pieces-black"></span>`,

                        whitePiece: `<span class="chess-pieces-white"></span>`,

                        chess: document.getElementById("chessboard"),

                        type: document.getElementById("type"),

                        info: document.getElementById("info"),

                        ucBtn: document.getElementById("c"),

                        uuBtn: document.getElementById("u"),

                        reBtn: document.getElementById("r"),

                        chessFlag: document.getElementById("chessFlag"),

                        /**
                         * judge game is computer vs user or user vs user
                         * false --> user vs user
                         * true --> user vs computer
                         */
                        isComputer: true,

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

                        computerWins: [],

                        computerScore: (() => {
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
                                    // black chess piece
                                    if(this.curColor) {
                                        this.myWins[k] = (this.myWins[k] === undefined) ? 1 : this.myWins[k]+1;

                                        if(this.myWins[k] >= 5) {
                                            this.over = true;
                                            flag = true;
                                            break;
                                        }

                                        // white chess piece
                                    }else {
                                        this.computerWins[k] = (this.computerWins[k] === undefined) ? 1 : this.computerWins[k]+1;

                                        if(this.computerWins[k] >= 5) {
                                            this.over = true;
                                            flag = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            return flag;
                        },

                        showGameType: function () {
                            if(this.isComputer) {
                                this.type.innerText = "User VS Computer";
                            }else {
                                this.type.innerText = "User VS User";
                            }
                        },

                        gameOver: function () {
                            if(this.curColor) {
                                _this.$confirm('您取得了胜利！', '游戏结束', {
                                    type: 'info'
                                }).then(() => {
                                    info.innerText = "游戏结束，你赢了...";
                                });
                            }else {
                                _this.$confirm('您输了...', '游戏结束', {
                                    type: 'info'
                                }).then(() => {
                                    info.innerText = "游戏结束，你输了...";
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
                            this.computerWins = [];
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

                            this.computerScore = (() => {
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

                        /**
                         * return computer next should drop point.
                         * @returns {{x: number, y: number}}
                         */
                        computerAI: function () {
                            // computer AI
                            for(let i=0; i<16; i++) {
                                for(let j=0; j<16; j++) {
                                    // this point not drop
                                    if(!this.curChess[i][j]) {
                                        for(let k=0; k<this.winKindsCount; k++) {
                                            if(this.wins[i][j][k]) {
                                                // check users
                                                if(this.myWins[k] === 1) {
                                                    this.myScore[i][j] += 2;
                                                }else if(this.myWins[k] === 2) {
                                                    this.myScore[i][j] += 4;
                                                }else if(this.myWins[k] === 3) {
                                                    this.myScore[i][j] += 50;
                                                }else if(this.myWins[k] === 4) {
                                                    this.myScore[i][j] += 200;
                                                }else if(this.myWins[k] >= 5) {
                                                    this.myScore[i][j] += 500;
                                                }

                                                // check computer
                                                if(this.computerWins[k] === 1) {
                                                    this.computerScore[i][j] += 3;
                                                }else if(this.computerWins[k] === 2) {
                                                    this.computerScore[i][j] += 5;
                                                }else if(this.computerWins[k] === 3) {
                                                    this.computerScore[i][j] += 10;
                                                }else if(this.computerWins[k] === 4) {
                                                    this.computerScore[i][j] += 300;
                                                }else if(this.computerWins[k] >= 5) {
                                                    this.computerScore[i][j] += 1000;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // get next computer x, y
                            let max = this.myScore[0][0],
                                u = 0,
                                v = 0;
                            for(let i=0; i<16; i++) {
                                for(let j=0; j<16; j++) {
                                    // if this point not drop, try count this weight.
                                    if(!this.curChess[i][j]) {
                                        if(max < this.myScore[i][j]) {
                                            max = this.myScore[i][j];
                                            u = i;
                                            v = j;
                                        }

                                        if(max < this.computerScore[i][j]) {
                                            max = this.computerScore[i][j];
                                            u = i;
                                            v = j;
                                        }
                                    }
                                }
                            }

                            return {
                                x: u,
                                y: v
                            }
                        },

                        init: function () {
                            // draw chess
                            let allCell = "";
                            for(let i=0; i<15*15; i++) {
                                allCell += this.cell;
                            }
                            this.chess.innerHTML = allCell;

                            // show game type
                            this.showGameType();

                            this.reBtn.addEventListener("click", (event) => {
                                this.resetGame();
                            }, false);

                            this.chess.addEventListener("click", (event) => {
                                if(this.over) return false;

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
                                    return false;
                                }

                                // change chess pieces color
                                this.changeColor();

                                // judge this is user vs computer?
                                if(this.isComputer) {
                                    let nextPoint = this.computerAI();

                                    // console.log(nextPoint);
                                    this.addPiece(nextPoint.x, nextPoint.y);

                                    // log this point
                                    this.curChess[nextPoint.x][nextPoint.y] = true;

                                    // check is win
                                    let isWin = this.checkIsWin(chessX, chessY);

                                    // if win, then game over.
                                    if(isWin) {
                                        this.gameOver();
                                        return false;
                                    }

                                    // change chess pieces color
                                    this.changeColor();
                                }

                            }, false);

                            return this;
                        },
                    };

                    backgammon.init();

                })();
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*-------------------Base----------------------*/
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
        margin: 20px auto;

        position: relative;
    }
    #chessFlag {
        top: 0px;
        right: 0px;
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