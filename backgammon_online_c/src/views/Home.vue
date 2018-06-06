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
            <user-info></user-info>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MainHeader from '@/components/header/Header.vue'
import SideBar from '@/components/side_bar/SideBar.vue'
import UserInfo from '@/components/content/UserInfo.vue'

export default {
  name: 'home',
  components: {
      MainHeader,
      SideBar,
      UserInfo
  }
}
</script>
