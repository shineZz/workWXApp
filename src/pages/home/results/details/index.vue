<template>
 <scroller  lock-x scrollbar-y   ref="scroller" >
        <div class="results-details">
            <group>      
                <cell>     
                    <span slot="title" >我排在第：<em class="c-orange">0</em>位</span>
                <span slot="inline-desc">我的回款总额：<em  class="c-red">0</em>元</span>              
                </cell>
                <datetime v-model="minuteListValue" format="YYYY"  @on-change="change" title="日期选择"></datetime>
            </group>
            <div class="svg-box" id="myChart2"></div>
            <div class="it-table">
                <x-table full-bordered>
                    <thead>
                        <tr>
                        <th>排名</th>
                        <th>姓名</th>
                        <th>新增用户</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>$1.20</td>
                            <td>x 08</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>$1.20</td>
                            <td>x 08</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>$1.20</td>
                            <td>x 08</td>
                        </tr>
                    </tbody>
                </x-table>
            </div>
        </div>    
    </scroller>
</template>
<script>
import { Scroller,  Datetime ,Group,Cell,XTable } from 'vux'
import { mapState, mapActions } from 'vuex'
import echart from 'echarts'

export default {
    name: 'resultsDetails',
         data () {
        return {
            minuteListValue: '2017',
        
        }
    },
    methods: {       
        change() {
           console.log(2222)
        },
        drawLine2(data){
            let myChart = echart.init(document.getElementById('myChart2'))
            // 绘制图表
            myChart.setOption({
                color: ['#3398DB'],
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '14%',
                    top:'12%',
                    containLabel: false
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['回款目标', '实际回款','回款目标2', '实际回款3','回款目标6', '实际回款8'],
                        axisLine:{show:false},
                                splitLine:{
                                    show:false
                                },
                            axisTick:false
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        show:true,
                        axisLine:{
                            show:false
                        },
                        splitLine:{
                            show:false,
                            lineStyle:{
                                type:'dotted',                               
                            },
                        },
                        axisTick:false,
                      

                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        itemStyle : {
                                    normal: {
                                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                        color: function (params){
                                            var colorList = ['#4dafea',];
                                            return colorList[params.dataIndex];
                                        },
                                        label : {
                                            show: true,
                                            position: 'top',
                                            formatter:'{c}',
                                            textStyle: {
                                                fontSize:14,
                                                color:
                                                        function (params){
                                                            var colorList = ['#4dafea',];
                                                            return colorList[params.dataIndex];},
                                            }
                                        }
                                    }
                                },
                        data:[
                                {
                                    value:555,
                                },
                                {
                                    value:222,
                                },
                                    {
                                    value:344,
                                },
                                {
                                    value:555,
                                },
                                {
                                    value:555,
                                },
                                {
                                    value:222,
                                },
                                    {
                                    value:344,
                                },
                                {
                                    value:555,
                                },
                            ]
                    }
                ]
            })
        },
    },
    created() {
        $(window).resize(function(){
            echart.init(document.getElementById('myChart2')).resize()
        });
    },
    mounted(){
        this.$refs.scroller.reset()
        this.drawLine2()
        
    },
    components: {
      Scroller,
      
      Datetime,
      Group,
      Cell,
      XTable 
    },
    
}
</script>
<style lang="less" >
 @import './index.less';
</style>