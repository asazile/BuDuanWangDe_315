<template>
    <div>
        <el-row>
            <el-col :xs="{span: 18, offset: 3}" :sm="{span: 12, offset: 6}" :lg="{span: 6, offset: 9}">
                <el-tabs type="border-card" style="margin-top: 50px;">

                    <el-tab-pane label="登陆">
                        <el-form ref="form1" :model="form1" :rules="rules1" size="small">
                            <el-form-item label="账号" prop="username">
                                <el-input v-model="form1.username"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model="form1.password"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('form1')">Go -></el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="注册">
                        <el-form ref="form2" :model="form2" :rules="rules2" size="small" status-icon>
                            <el-form-item label="账号" prop="username">
                                <el-input v-model="form2.username"></el-input>
                            </el-form-item>
                            <el-form-item label="昵称" prop="name">
                                <el-input v-model="form2.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model="form2.password"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="checkPassword">
                                <el-input type="password" v-model="form2.checkPassword"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="rigisterForm('form2')">Get -></el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: '',
        data() {
            const validateUsername = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号...'));
                } else {

                    callback();
                }
            };

            const validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码...'));
                } else {

                    callback();
                }
            };

            const validateUsername2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('账号不能为空...'));
                } else {
                    axios.post('/checkUsername', {
                        username: value
                    })
                        .then(function (response) {
                            let res = response.data;
                            if(res.status) {
                                callback();
                            }else {
                                callback(new Error(res.message));
                            }
                        })
                        .catch(function (error) {
                            callback(new Error(error.message));
                        });
                }
            };

            const validateName2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('昵称不能为空...'));
                } else {

                    callback();
                }
            };

            const validatePassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空...'));
                } else {
                    if (this.form2.checkPassword !== '') {
                        this.$refs.form2.validateField('checkPassword');
                    }
                    callback();
                }
            };

            const validateCheckPassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form2.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                form1: {
                    username: '',
                    password: ''
                },

                rules1: {
                    username: [
                        { validator: validateUsername, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePassword, trigger: 'blur' }
                    ]
                },

                form2: {
                    username: '',
                    name: '',
                    password: '',
                    checkPassword: ''
                },

                rules2: {
                    username: [
                        { validator: validateUsername2, trigger: 'blur' }
                    ],
                    name: [
                        { validator: validateName2, trigger: 'blur'}
                    ],
                    password: [
                        { validator: validatePassword2, trigger: 'blur' }
                    ],
                    checkPassword: [
                        { validator: validateCheckPassword2, trigger: 'blur' }
                    ]
                },
            }
        },

        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.post('/login', this.form1)
                            .then((response) => {
                                let res = response.data;
                                if(res.status) {
                                    this.$store.commit({
                                        type: 'updateUsername',
                                        username: res.data.username
                                    });

                                    this.$store.commit({
                                        type: 'updateName',
                                        username: res.data.name
                                    });

                                    this.$store.commit({
                                        type: 'updateRank',
                                        username: res.data.rank
                                    });

                                    alert(res.message);
                                }else {
                                    alert(res.message);
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
            },

            rigisterForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.post('/rigister', this.form2)
                            .then(function (response) {
                                let res = response.data;
                                if(res.status) {
                                    alert(res.message);
                                }else {
                                    alert(res.message);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    } else {
                        console.log('error register!!');
                    }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>