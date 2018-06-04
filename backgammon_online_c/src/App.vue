<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

</style>

<script>
    export default {
        name: '',
        data() {
            return {
                form1: {
                    username: '',
                    password: ''
                }
            }
        },

        mounted: function () {

        }
    }
</script>