<template>
    <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
        <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">个人中心</span>
        </el-menu-item>
        <el-menu-item index="2">
            <i class="el-icon-news"></i>
            <span slot="title">开始游戏</span>
        </el-menu-item>
        <el-menu-item index="3">
            <i class="el-icon-sort"></i>
            <span slot="title">排名查看</span>
        </el-menu-item>
        <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">通用设置</span>
        </el-menu-item>
    </el-menu>
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
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>