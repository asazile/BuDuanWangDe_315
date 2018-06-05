<template>
    <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
        <el-menu-item index="1">Backgammon Online Game</el-menu-item>
        <el-menu-item index="2" style="float: right;">{{ getName }}</el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: 'HelloWorld',

        data() {
            return {
                activeIndex: '1',
            };
        },

        computed: {
            getName () {
                return this.$store.state.name
            }
        },

        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
