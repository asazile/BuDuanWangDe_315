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
        <div class="header-btn">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link" style="color: #fff;">
                {{ getName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-menu>
</template>

<script>
    import axios from 'axios'

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
            },

            handleCommand(command) {
                switch (command) {
                    case 'loginOut':
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        this.$store.commit({
                            type: 'closeSocket'
                        });

                        this.$store.commit({
                            type: 'updateCurComponent',
                            currentComponent: 'UserInfo'
                        });

                        this.$store.commit({
                            type: 'updateIsInGame',
                            isInGame: false
                        });

                        axios.post('/loginOut')
                            .then((response) => {
                                loading.close();

                                let res = response.data;
                                if(res.status) {
                                    this.$router.push('/');
                                }else {
                                    alert(res.message);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        break;
                    default:
                        break;
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header-btn {
    display: inline-block;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    float:right;

    cursor: pointer;
}
</style>
