<template>
    <div>
        <div id="main" class="views"></div>
    </div>
</template>

<script>
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
            function genData(count) {
                var nameList = [
                    '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
                ];
                var legendData = [];
                var seriesData = [];
                var selected = {};
                for (var i = 0; i < 10; i++) {
                    name = Math.random() > 0.65
                        ? makeWord(4, 1) + '·' + makeWord(3, 0)
                        : makeWord(2, 1);
                    legendData.push(name);
                    seriesData.push({
                        name: name,
                        value: Math.round(Math.random() * 100000)
                    });
                    selected[name] = i < 6;
                }

                let data = {
                    legendData: legendData,
                    seriesData: seriesData
                };
                console.log(data);
                return data;

                function makeWord(max, min) {
                    var nameLen = Math.ceil(Math.random() * max + min);
                    var name = [];
                    for (var i = 0; i < nameLen; i++) {
                        name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
                    }
                    return name.join('');
                }
            }
            var data = genData(50);
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('main'));
            // 绘制图表
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
                    data: ["0-899", "900-1099", "1100-1599", "1600-1999", "2000-"],
                },
                series : [
                    {
                        name: 'Rank',
                        type: 'pie',

                        roseType : 'radius',

                        data: [{
                            name: '0-899',
                            value: 700
                        }, {
                            name: '900-1099',
                            value: 900
                        }, {
                            name: '1100-1599',
                            value: 800
                        }, {
                            name: '1600-1999',
                            value: 700
                        }, {
                            name: '2000-',
                            value: 300
                        }],
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