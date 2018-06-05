<template>
  <div class="home">
    <el-container>
      <el-header>
        <main-header></main-header>
      </el-header>
      <el-container>
        <el-aside>

        </el-aside>
        <el-main>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MainHeader from '@/components/header/header.vue'

export default {
  name: 'home',
  components: {
      MainHeader
  }
}
</script>
