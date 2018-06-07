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
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>

                <el-collapse-item name="qualifyingGame">
                    <template slot="title">
                        <b style="margin-right: 10px;">排位模式</b> <i class="header-icon el-icon-info"></i>
                    </template>
                    <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
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
                }
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
</style>