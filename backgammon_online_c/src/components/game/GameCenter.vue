<template>
    <div>
        <h1 style="text-align: center"><i class="el-icon-news"></i> Game Center</h1>

        <div class="game-container">
            <div class="game-item">
                <el-card :body-style="{ padding: '0px', width: '300px' }">
                    <img src="@/assets/images/matching.jpg" class="image">
                    <div style="padding: 14px;">
                        <h3>匹配模式</h3>
                        <div class="bottom clearfix">
                            <el-button type="warning" plain class="button" @click="startGame('matching')" :disabled="getIsInGame">开始游戏</el-button>
                        </div>
                    </div>
                </el-card>
            </div>

            <div class="game-item">
                <el-card :body-style="{ padding: '0px', width: '300px' }">
                    <img src="@/assets/images/qualifying.jpg" class="image">
                    <div style="padding: 14px;">
                        <h3>排位模式</h3>

                        <div class="bottom clearfix">
                            <el-button type="warning" plain class="button" @click="startGame('qualifying')" :disabled="getIsInGame">开始游戏</el-button>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>

        <div class="game-test">
            <el-button type="warning" plain round style="padding-left: 35px;" @click="gameTest" :disabled="getIsInGame">试玩一下 <i class="el-icon-arrow-right"></i></el-button>
        </div>

        <el-dialog
                :title="gameMode"
                :visible.sync="dialogVisible"
                width="60%"
                :show-close="false"
                :close-on-click-modal="false">

            <div style="text-align: center">
                <h3>{{ matchingInfo }}</h3>
                <h4 v-show="timing !== ''"><i class="el-icon-time" style="margin-right: 10px;"></i> <b>{{ timing }}</b></h4>
                <h4 v-if="matchName"><i class="el-icon-success" style="color: cornflowerblue;" v-show="meReady"></i> {{ getName }} VS {{ matchName }} <i class="el-icon-success" style="color: cornflowerblue;" v-show="youReady"></i></h4>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelGame">取 消</el-button>
                <el-button type="warning" plain v-if="matchName" @click="interGame">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import io from 'socket.io-client';

    export default {
        name: '',

        data() {
            return {
                timing: '',
                timer: null,
                dialogVisible: false,
                gameMode: '',
                matchingInfo: '匹配中，请稍后...',
                matchName: '',
                meReady: false,
                youReady: false
            }
        },

        computed: {
            getIsInGame () {
                return this.$store.state.isInGame;
            },

            getUsername () {
                return this.$store.state.username;
            },

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
            axios.post('/users/checkFirstGame')
                .then((response) => {
                    let res = response.data;

                    if(res.status) {
                        this.$confirm('您是第一次进入游戏，请问需要试玩体验下么？', '新手 & 高手', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            this.gameTest();
                        });

                        axios.post('/users/updateFirstGame')
                            .then((response) => {
                                let res = response.data;

                                if (res.status) {
                                    console.log(res.message);

                                } else {
                                    console.log(res.message);
                                }
                            });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        methods: {
            gameTest () {
                this.$store.commit({
                    type: 'updateCurComponent',
                    currentComponent: 'GameTest'
                });
            },

            startGame (gameType) {
                this.$store.commit({
                    type: 'updateIsInGame',
                    isInGame: true
                });

                this.gameMode = gameType === 'matching' ? '匹配模式' : '排位模式';

                this.dialogVisible = true;
                this.startTiming();

                this.$store.commit({
                    type: 'updateCurGameType',
                    curGameType: gameType
                });

                this.$store.commit({
                    type: 'createSocket',
                    socket: io(`/${gameType}?username=${this.getUsername}&rank=${this.getRank}&name=${this.getName}`)
                });


                let socket = this.getSocket;

                socket.on('matched', (data) => {
                    let matchName = data.matchName1 === this.getName ? data.matchName2 : data.matchName1;

                    this.matchingInfo = '匹配成功';
                    this.matchName = matchName;
                    this.endTiming();
                });

                socket.on('ready', () => {
                    this.youReady = true;

                    if (this.meReady) {
                        this.$store.commit({
                            type: 'updateCurComponent',
                            currentComponent: 'Game'
                        });
                    }
                });

                socket.on('cancelGame', () => {
                    this.$message('对方取消了游戏匹配！');
                    this.cancelGame();
                });
            },

            cancelGame () {
                this.$store.commit({
                    type: 'updateIsInGame',
                    isInGame: false
                });

                this.$store.commit({
                    type: 'closeSocket',
                    socket: null
                });

                this.matchingInfo = '匹配中，请稍后...';
                this.matchName = '';
                this.dialogVisible = false;
                this.endTiming();
            },

            interGame () {
                this.endTiming();
                this.meReady = true;
                this.getSocket.emit('ready');

                if (this.youReady) {
                    this.$store.commit({
                        type: 'updateCurComponent',
                        currentComponent: 'Game'
                    });
                }
            },

            startTiming () {
                if (this.timer) return false;

                // do someThing...          
                let second = 0,minute = 0;

                let _this = this;
                function t() {
                    let currentTime = '';
                    if(++second === 60){
                        minute ++;
                        second = 0;
                    }
                    currentTime += minute<10?"0"+minute:minute;
                    currentTime += ":";
                    currentTime += second<10?"0"+second:second;

                    _this.timing = currentTime;

                    _this.timer = setTimeout(t, 1000);
                }

                t();
            },

            endTiming () {
                clearTimeout(this.timer);
                this.timer = null;
                this.timing = '';
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .game-container {
        text-align: center;
    }
    .game-item {
        width: 300px;
        display: inline-block;

        margin: 30px 5%;
    }

    .game-test {
        margin: 50px 0;
        padding: 0 20%;
        text-align: right;
    }
</style>