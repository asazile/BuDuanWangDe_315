<template>
    <div>
        <div id="rankDistribution" class="views"></div>
    </div>
</template>

<script>
    import axios from 'axios';

    const echarts = require('echarts/lib/echarts');

    require('echarts/lib/chart/pie');

    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require("echarts/lib/component/visualMap");

    export default {
        name: '',
        data() {
            return {
                msg: ''
            }
        },

        mounted () {
            const loading = this.$loading({
                lock: true,
                text: 'Loading...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            axios.post('/visualization/rankDistribution')
                .then((response) => {
                    loading.close();

                    let res = response.data;

                    const myChart = echarts.init(document.getElementById('rankDistribution'));

                    myChart.setOption({
                        title : {
                            text: 'Rank 分值分布图',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            type: 'scroll',
                            orient: 'vertical',
                            right: 10,
                            top: 20,
                            bottom: 20,
                            data: res.data.legendData,
                        },
                        series : [
                            {
                                name: 'Rank',
                                type: 'pie',

                                roseType : 'radius',

                                data: res.data.seriesData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    });
                });
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .views {
        width: 700px;
        height: 500px;
        margin: 30px auto;
    }

</style>