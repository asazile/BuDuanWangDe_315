<template>
  <div class="home">
    <el-container>
      <el-header style="padding: 0">
        <main-header></main-header>
      </el-header>
      <el-container>
        <el-aside style="width: 150px;">
            <side-bar></side-bar>
        </el-aside>
        <el-main>
            <component v-bind:is="currentComponent"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MainHeader from '@/components/header/Header.vue'
import SideBar from '@/components/side_bar/SideBar.vue'
import UserInfo from '@/components/user/UserInfo.vue'

const GameCenter = () => import('@/components/game/GameCenter.vue');
const GameTest = () => import('@/components/game/GameTest.vue');
const Setting = () => import('@/components/setting/Setting.vue');
const RankInfo = () => import('@/components/rankInfo/RankInfo.vue');

export default {
    name: 'home',
    components: {
        MainHeader,
        SideBar,
        UserInfo,
        GameCenter,
        GameTest,
        Setting,
        RankInfo
    },

    data() {
        return {
            currentComponent: 'UserInfo'
        }
    },

    computed: {
        getCurComponent() {
            return this.$store.state.currentComponent;
        }
    },

    watch: {
        getCurComponent: function(to, from) {
            this.currentComponent = to;
        }
    }
}
</script>
