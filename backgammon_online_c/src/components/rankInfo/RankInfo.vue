<template>
    <div>
        <div id="userHistoryRank" class="views"></div>
        <div id="highRank" class="views"></div>
        <div id="rankDistribution" class="views"></div>
    </div>
</template>

<script>
    import axios from 'axios';

    const echarts = require('echarts/lib/echarts');

    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');

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

                    const myChart1 = echarts.init(document.getElementById('rankDistribution'));

                    myChart1.setOption({
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


            axios.post('/visualization/hightRank')
                .then((response) => {
                    loading.close();

                    let res = response.data;

                    const myChart2 = echarts.init(document.getElementById('highRank'));

                    myChart2.setOption({
                        title: {
                            text: 'Rank 前十 天梯榜',
                            x:'center'
                        },

                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            data: ['Rank值']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        },
                        yAxis: {
                            type: 'category',
                            data: res.data.yAxisData
                        },
                        series: [
                            {
                                name: 'Rank值',
                                type: 'bar',
                                data: res.data.seriesData
                            }
                        ]
                    });
                });


            axios.post('/visualization/userHistoryRank')
                .then((response) => {
                    loading.close();

                    let res = response.data;

                    const myChart3 = echarts.init(document.getElementById('userHistoryRank'));

                    myChart3.setOption({
                        title: {
                            text: 'Rank 值变化情况',
                            x:'center'
                        },
                        xAxis: {
                            type: 'category',
                            data: res.data.xAxisData
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: res.data.seriesData,
                            type: 'line',
                            smooth: true
                        }]
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