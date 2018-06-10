<template>
    <div>
        <h1><i class="el-icon-setting"></i>Setting</h1>
        <el-card class="box-card">
            <el-form ref="form" :model="form" label-width="80px">
                <h5>音乐设置：</h5>
                <el-form-item label="背景音效">
                    <el-switch v-model="form.backgroundMusic"></el-switch>
                </el-form-item>
                <el-form-item label="游戏音效">
                    <el-switch v-model="form.gameMusic"></el-switch>
                </el-form-item>
                
                <h5>其他设置：</h5>
                <el-form-item>
                    <el-button type="warning" plain @click="onSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: '',

        data() {
            return {
                msg: '',

                form: {
                    backgroundMusic: false,
                    gameMusic: false
                }
            }
        },

        methods: {
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>