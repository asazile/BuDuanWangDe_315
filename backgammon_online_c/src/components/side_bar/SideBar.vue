<template>
    <el-menu
            default-active="UserInfo"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
        <el-menu-item index="UserInfo" :disabled="getIsInGame">
            <i class="el-icon-menu"></i>
            <span slot="title">个人中心</span>
        </el-menu-item>
        <el-menu-item index="GameCenter" :disabled="getIsInGame">
            <i class="el-icon-news"></i>
            <span slot="title">开始游戏</span>
        </el-menu-item>
        <el-menu-item index="RankInfo" :disabled="getIsInGame">
            <i class="el-icon-sort"></i>
            <span slot="title">排名查看</span>
        </el-menu-item>
        <el-menu-item index="Setting" :disabled="getIsInGame">
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
            handleSelect(key, keyPath) {
                this.$store.commit({
                    type: 'updateCurComponent',
                    currentComponent: key
                });
            }
        },

        computed: {
            getIsInGame () {
                return this.$store.state.isInGame;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>