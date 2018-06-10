<template>
    <el-tabs v-model="activeName">
        <el-tab-pane label="个人信息" name="userInfo">
            <div>
                <h3><i class="el-icon-caret-right"></i> Username:</h3>
                <p>{{ this.getUsername}}</p>
            </div>
            <div>
                <h3><i class="el-icon-caret-right"></i> Name:</h3>
                <p>{{ this.getName}}</p>
            </div>
            <div>
                <h3><i class="el-icon-caret-right"></i> Password:</h3>
                <div style="margin-bottom: 20px;">
                    <el-input v-model="password" type="password" v-if="this.btnText === '修改密码'" disabled placeholder="请输入密码" size="medium" style="width: 200px"></el-input>
                </div>
                <el-form ref="form" :model="form" :rules="rules" size="small" status-icon v-if="this.btnText === '提交'" style="width: 40%">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPassword">
                        <el-input type="password" v-model="form.checkPassword"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="info" size="medium" plain v-if="btnText === '提交'" @click="unSubmitPwd">取消</el-button>
                <el-button type="warning" size="medium" plain @click="changePassword('form')">{{ this.btnText }}</el-button>
            </div>

            <div class="bar"></div>

            <div>
                <h3><i class="el-icon-caret-right"></i> Rank:</h3>
                <p><strong>{{ this.getRank }}</strong></p>
            </div>
        </el-tab-pane>

        <el-tab-pane label="对战记录" name="gameInfo">
            <el-collapse value="matchingGame" accordion>

                <el-collapse-item name="matchingGame">
                    <template slot="title">
                        <b style="margin-right: 10px;">匹配模式</b> <i class="header-icon el-icon-info"></i>
                    </template>

                    <el-table
                            :data="MGameInfoItems"
                            style="width: 100%"
                            :row-class-name="tableRowClassName">

                        <el-table-column
                                prop="user"
                                label="我方">
                        </el-table-column>
                        <el-table-column
                                prop="adversary"
                                label="敌方">
                        </el-table-column>
                        <el-table-column
                                prop="result"
                                label="游戏结果">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="游戏时间">
                        </el-table-column>

                    </el-table>
                </el-collapse-item>

                <el-collapse-item name="qualifyingGame">
                    <template slot="title">
                        <b style="margin-right: 10px;">排位模式</b> <i class="header-icon el-icon-info"></i>
                    </template>

                    <el-table
                            :data="QGameInfoItems"
                            style="width: 100%"
                            :row-class-name="tableRowClassName">

                        <el-table-column
                                prop="user"
                                label="我方"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="adversary"
                                label="敌方"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="游戏时间">
                        </el-table-column>
                        <el-table-column
                                prop="result"
                                label="游戏结果">
                        </el-table-column>

                    </el-table>

                </el-collapse-item>

            </el-collapse>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import axios from "axios";

    export default {
        name: '',
        data() {
            const validatePassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空...'));
                } else {
                    if (this.form.checkPassword !== '') {
                        this.$refs.form.validateField('checkPassword');
                    }
                    callback();
                }
            };

            const validateCheckPassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                activeName: 'userInfo',
                password: '123456',
                btnText: '修改密码',

                form: {
                    password: '',
                    checkPassword: ''
                },

                rules: {
                    password: [
                        { validator: validatePassword2, trigger: 'blur' }
                    ],
                    checkPassword: [
                        { validator: validateCheckPassword2, trigger: 'blur' }
                    ]
                },

                MGameInfoItems: [
                    {
                        id: 22,
                        user: 'Daoerche',
                        adversary: 'WangQingJun',
                        result: 'Win',
                        time: '2018-06-10'
                    },
                    {
                        id: 22,
                        user: 'Daoerche',
                        adversary: 'WangQingJun',
                        result: 'Defeat',
                        time: '2018-06-10'
                    },
                    {
                        id: 22,
                        user: 'Daoerche',
                        adversary: 'WangQingJun',
                        result: 'Defeat',
                        time: '2018-06-10'
                    },
                    {
                        id: 22,
                        user: 'Daoerche',
                        adversary: 'WangQingJun',
                        result: 'Win',
                        time: '2018-06-10'
                    }
                ],

                QGameInfoItems: [
                    {
                        id: 22,
                        user: 'TXC',
                        adversary: 'WangQingJun',
                        result: 'Win',
                        time: '2018-06-10'
                    },
                    {
                        id: 22,
                        user: 'TXC',
                        adversary: 'WangQingJun',
                        result: 'Win',
                        time: '2018-06-10'
                    },
                    {
                        id: 22,
                        user: 'TXC',
                        adversary: 'WangQingJun',
                        result: 'Defeat',
                        time: '2018-06-10'
                    },
                    {
                        id: 22,
                        user: 'TXC',
                        adversary: 'WangQingJun',
                        result: 'Win',
                        time: '2018-06-10'
                    }
                ]
            }
        },

        computed: {
            getUsername () {
                return this.$store.state.username;
            },
            getName () {
                return this.$store.state.name;
            },
            getRank () {
                return this.$store.state.rank;
            }
        },

        methods: {
            unSubmitPwd () {
                this.btnText = '修改密码';
            },

            changePassword (formName) {
                if(this.btnText === '修改密码') {
                    this.btnText = '提交';

                } else if(this.btnText === '提交') {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            const loading = this.$loading({
                                lock: true,
                                text: 'Loading...',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });

                            axios.post('/users/changePassword', this.form)
                                .then((response) => {
                                    loading.close();

                                    let res = response.data;
                                    if(res.status) {
                                        this.btnText = '修改密码';
                                        this.$confirm(res.message, '提示', {
                                            type: 'success'
                                        });
                                    }else {
                                        this.$confirm(res.message, '提示', {
                                            type: 'error'
                                        });
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }
            },

            tableRowClassName({row, rowIndex}) {
                if (row.result === 'Win') {
                    return 'success-row';
                } else if (row.result === 'Defeat') {
                    return 'warning-row';
                }
                return '';
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .bar {
        height: 2px;
        width: 65%;
        margin: 40px 0;

        background-color: #e6e6e6;
        border-radius: 10px;
    }
</style>

<style>
    .el-tabs__active-bar {
        background-color: rgb(84, 92, 100);
    }
    .el-tabs__item.is-active {
        color: rgb(84, 92, 100);
    }
    .el-tabs__item:hover {
        color: rgb(84, 92, 100);
    }
    .el-table .warning-row {
        background: rgb(255, 194, 142);
    }

    .el-table .success-row {
        background: rgb(161, 207, 255);
    }
</style>