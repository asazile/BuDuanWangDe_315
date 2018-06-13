<template>
    <div>
        <el-row>
            <el-col :xs="{span: 18, offset: 3}" :sm="{span: 12, offset: 6}" :lg="{span: 6, offset: 9}">
                <el-tabs type="border-card" style="margin-top: 50px;">

                    <el-tab-pane label="登陆">
                        <el-form ref="form1" :model="form1" :rules="rules1" size="small" @keyup.enter.native="submitForm('form1')">
                            <el-form-item label="账号" prop="username">
                                <el-input name="username" v-model="form1.username"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input name="password" type="password" v-model="form1.password"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('form1')">Go -></el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="注册">
                        <el-form ref="form2" :model="form2" :rules="rules2" size="small" status-icon @keyup.enter.native="rigisterForm('form2')">
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

                    var uPattern = /^[a-zA-Z][a-zA-Z0-9]{6,19}$/;

                    if (uPattern.test(value)) {
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

                    }else {
                        callback(new Error('账号需字母开头长度7-20，仅包含字母数字_'));
                    }
                }
            };

            const validateName2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('昵称不能为空...'));
                } else {
                    let patrn=/[`~!@#$%^&*()+<>-?:"{},.\/;'[\]]}/im; 
                    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                    let regAn = /^\d{1,20}$/;

                    if (patrn.test(value) || regCn.test(value) || !regAn.test(value)) {            
                        callback(new Error('昵称需为长度不超过20位且不包含特殊字符...'));

                    } else {
                        callback();
                    }  
                }
            };

            const validatePassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空...'));
                } else {
                    var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;

                    if(value.match(regx)==null) {
                        callback(new Error('密码必须为6-20位数字和字母组合'));

                    }else {
                        if (this.form2.checkPassword !== '') {
                            this.$refs.form2.validateField('checkPassword');
                        }
                        
                        callback();
                    }
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
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        axios.post('/login', this.form1)
                            .then((response) => {
                                loading.close();

                                let res = response.data;
                                if(res.status) {
                                    this.$store.commit({
                                        type: 'updateUsername',
                                        username: res.data.username
                                    });

                                    this.$store.commit({
                                        type: 'updateName',
                                        name: res.data.name
                                    });

                                    this.$store.commit({
                                        type: 'updateRank',
                                        rank: res.data.rank
                                    });

                                    this.$router.push('/home');
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
            },

            rigisterForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        axios.post('/rigister', this.form2)
                            .then((response) => {
                                loading.close();

                                let res = response.data;
                                if(res.status) {
                                    this.$store.commit({
                                        type: 'updateUsername',
                                        username: res.data.username
                                    });

                                    this.$store.commit({
                                        type: 'updateName',
                                        name: res.data.name
                                    });

                                    this.$store.commit({
                                        type: 'updateRank',
                                        rank: res.data.rank
                                    });

                                    this.$confirm(res.message, '提示', {
                                        type: 'success'
                                    }).then(() => {
                                        this.$router.push('/home');
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