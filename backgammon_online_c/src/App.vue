<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

</style>

<script>
    import axios from 'axios';

    export default {
        name: '',
        data() {
            return {

            }
        },

        mounted: function () {
            axios.get('/loginUserInfo')
                .then((response) => {
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

                        console.log(res.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
</script>