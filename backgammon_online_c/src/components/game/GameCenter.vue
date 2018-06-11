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
                <h3>匹配中，请稍后...</h3>
                <h4 v-show="timing !== ''"><i class="el-icon-time" style="margin-right: 10px;"></i> <b>{{ timing }}</b></h4>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelGame">取 消</el-button>
                <el-button type="warning" plain>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: '',

        data() {
            return {
                timing: '',
                timer: null,
                dialogVisible: false,
                gameMode: ''
            }
        },

        computed: {
            getIsInGame () {
                return this.$store.state.isInGame;
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

            },

            cancelGame () {
                this.$store.commit({
                    type: 'updateIsInGame',
                    isInGame: false
                });

                this.dialogVisible = false;
            },

            startTiming () {
                this.timing = '00:01';
            },

            endTiming () {
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