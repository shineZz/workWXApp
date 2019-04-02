<template>
    <div >
        <div v-if="!proSales"></div>
        <div class="fullpage-wp fullpage-wrapper anslysis-all" v-fullpage="opts" v-if="proSales">
            <div class="page-1 page">
                <h3>分享概览</h3>
                <section class="overview">
                    <div class="flex-1">
                        <h4>{{proSales.overview[0]}}</h4>
                        <span>总阅读次数</span>
                        <img src="~@/images/analysis/read.png" alt="">
                    </div>
                    <div class="middle-num">
                        <h4>{{proSales.overview[2]}}</h4>
                        <span>总分享次数</span>
                        <img src="~@/images/analysis/share.png" alt="">
                    </div>
                    <div class="flex-1">
                        <h4>{{proSales.overview[3]}}</h4>
                        <span>总评论次数</span>
                        <img src="~@/images/analysis/comment.png" alt="">
                    </div>
                </section>
                <div class="exposure">
                    <h3>曝光量分析</h3>
                    <flexbox :gutter="0">
                        <flexbox-item>
                            <x-circle :percent="parseFloat(proSales.exposure[0])" :stroke-width="15" :trail-width="15" :stroke-color="strokeColor1" trail-color="#ccc">
                                <span :style="{color: strokeColor1}">{{proSales.exposure[0]}}%</span>
                            </x-circle>
                            <article><i :style="{background: strokeColor1}"></i>QQ</article>
                        </flexbox-item>
                        <flexbox-item>
                            <x-circle :percent="parseFloat(proSales.exposure[1])" :stroke-width="15" :trail-width="15" :stroke-color="strokeColor2" trail-color="#ccc">
                                <span :style="{color: strokeColor2}">{{proSales.exposure[1]}}%</span>
                            </x-circle>
                            <article><i :style="{background: strokeColor2}"></i>微信</article>
                        </flexbox-item>
                        <flexbox-item>
                            <x-circle :percent="parseFloat(proSales.exposure[2])" :stroke-width="15" :trail-width="15" :stroke-color="strokeColor3" trail-color="#ccc">
                                <span :style="{color: strokeColor3}">{{proSales.exposure[2]}}%</span>
                            </x-circle>
                            <article><i :style="{background: strokeColor3}"></i>APP</article>
                        </flexbox-item>
                    </flexbox>
                </div>
                <footer>
                    <div class="down-btn"><img src="~@/images/analysis/down-btn-icon.png" alt=""></div>
                    <img src="~@/images/analysis/down-icon.png" alt="">
                </footer>
            </div>
            <div class="page-2 page">
                <div class="share">
                    <h3>分享分析</h3>
                    <flexbox :gutter="0">
                        <flexbox-item :span="3.2">
                            <img src="~@/images/analysis/weixin.png" alt="">
                        </flexbox-item>
                        <flexbox-item>
                            <h4>{{proSales.shareto[0]}}</h4>
                            <span>分享到微信好友占比</span>
                        </flexbox-item>
                        <flexbox-item :span="3.2" >
                            <div>
                                <x-circle :percent="parseFloat(proSales.shareto[0])" :stroke-width="25" :trail-width="25" stroke-color="#3eb135" trail-color="#ccc"></x-circle>
                            </div>                    
                        </flexbox-item>
                    </flexbox>
                    <flexbox :gutter="0">
                        <flexbox-item :span="3.2">
                            <img src="~@/images/analysis/pyq.png" alt="">
                        </flexbox-item>
                        <flexbox-item>
                            <h4>{{proSales.shareto[1]}}</h4>
                            <span>分享到微信朋友圈占比</span>
                        </flexbox-item>
                        <flexbox-item :span="3.2" >
                            <div >
                                <x-circle :percent="parseFloat(proSales.shareto[1])" :stroke-width="25" :trail-width="25" stroke-color="#3eb135" trail-color="#ccc"></x-circle>
                            </div>                    
                        </flexbox-item>
                    </flexbox>
                    <flexbox :gutter="0">
                        <flexbox-item :span="3.2">
                            <img src="~@/images/analysis/QQ.png" alt="">
                        </flexbox-item>
                        <flexbox-item>
                            <h4>{{proSales.shareto[2]}}</h4>
                            <span>分享到QQ好友占比</span>
                        </flexbox-item>
                        <flexbox-item :span="3.2" >
                            <div >
                                <x-circle :percent="parseFloat(proSales.shareto[2])" :stroke-width="25" :trail-width="25" stroke-color="#4dafea" trail-color="#ccc"></x-circle>
                            </div>                    
                        </flexbox-item>
                    </flexbox>
                    <flexbox :gutter="0">
                        <flexbox-item :span="3.2">
                            <img src="~@/images/analysis/zone.png" alt="">
                        </flexbox-item>
                        <flexbox-item>
                            <h4>{{proSales.shareto[3]}}</h4>
                            <span>分享到QQ空间占比</span>
                        </flexbox-item>
                        <flexbox-item :span="3.2" >
                            <div>
                                <x-circle :percent="parseFloat(proSales.shareto[3])" :stroke-width="25" :trail-width="25" stroke-color="#ffcc33" trail-color="#ccc"></x-circle>
                            </div>                    
                        </flexbox-item>
                    </flexbox>
                </div>
                <footer>
                    <div class="down-btn"><img src="~@/images/analysis/down-btn-icon.png" alt=""></div>
                    <img src="~@/images/analysis/down-icon.png" alt="">
                </footer>
            </div>
            <div class="page-3 page">        
                <h3>分享人群分析</h3>
                <div class="share-people">
                    <article style="border-bottom: 1px solid #f0f3f6;">
                        <h5>性别</h5>
                        <div>
                            <dl>
                                <dt><img src="~@/images/analysis/M.png" alt=""></dt>
                                <dd><em>{{proSales.sex[0]}}%</em></dd>
                            </dl>
                            <dl>
                                <dt><img src="~@/images/analysis/F.png" alt=""></dt>
                                <dd><em>{{proSales.sex[1]}}%</em></dd>
                            </dl>
                        </div>
                    </article>
                    <article style="border-bottom: 1px solid #f0f3f6;">
                        <h5>手机</h5>
                        <div>
                            <dl>
                                <dt><img src="~@/images/analysis/iphone.png" alt=""></dt>
                                <dd><em>{{proSales.phone[0]}}%</em></dd>
                            </dl>
                            <dl>
                                <dt><img src="~@/images/analysis/android.png" alt=""></dt>
                                <dd><em>{{proSales.phone[1]}}%</em></dd>
                            </dl>
                        </div>
                    </article>
                    <article>
                        <h5>网络状态</h5>
                        <div>
                            <dl>
                                <dt><img src="~@/images/analysis/wifi.png" alt=""></dt>
                                <dd><em>{{proSales.net[0]}}%</em></dd>
                            </dl>
                            <dl>
                                <dt><img src="~@/images/analysis/liul.png" alt=""></dt>
                                <dd><em>{{proSales.net[1]}}%</em></dd>
                            </dl>
                        </div>
                    </article>
                </div>
                <footer>
                    <div class="down-btn"><img src="~@/images/analysis/down-btn-icon.png" alt=""></div>
                    <img src="~@/images/analysis/down-icon.png" alt="">
                </footer>
            </div>
            <div class="page-4 page">
                <h3>机型排行</h3>
                <div class="model-ranking" style="margin-top: 20px;">
                    <img src="~@/images/analysis/iphone.png" alt=""><span>VS</span><img src="~@/images/analysis/android.png" alt="">
                </div>
                <div id="Chart1" style=" box-flex:1;-webkit-box-flex:1">
                    <div style="font-size: 20px;    margin-top: 10%;  color: #ccc;">暂无数据</div>
                </div>
                <footer>
                    <div class="down-btn"><img src="~@/images/analysis/down-btn-icon.png" alt=""></div>
                    <img src="~@/images/analysis/down-icon.png" alt="">
                </footer>
            </div>
            <div class="page-5 page">
                <h3>推广城市TOP10</h3>
                <div class="promote-city">
                    <span>城市</span>
                    <span>推广比例</span>
                </div>
                <div id="Chart2"  style=" box-flex:1;-webkit-box-flex:1">
                    <div style="font-size: 20px;    margin-top: 10%;  color: #ccc;">暂无数据</div>
                </div>
                <footer>
                    <div class="down-btn"><img src="~@/images/analysis/down-btn-icon.png" alt=""></div>
                    <img src="~@/images/analysis/down-icon.png" alt="">
                </footer>
            </div>
            <div class="page-6 page"> 
                <h3>地域分析</h3>            
                <div  style="box-flex:1;-webkit-box-flex:1;height:100%" >
                        <div id="Chart3"  style="width:120%;height:100%;margin-left:-10%" ></div>
                </div>
            
            </div> 
        </div>
    </div>
</template>

<script> 

import { Flexbox, FlexboxItem, XCircle} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

import echarts from 'echarts'
import 'echarts/map/js/china.js';
export default {
    name: 'analysis',
    data() {
      return {
        opts: {
            start:0,
            dir: 'v',
            duration: 500
        },
        strokeColor1: '#ffcc00',
        strokeColor2: '#69a5e1',
        strokeColor3: '#5dd054',
        proSales: null,
        tid: 0,
      }
    },
    created() {
        document.body.addEventListener('touchmove',this.bodyScroll,false);     
        let tid = this.$route.params.tid || JSON.parse(localStorage.getItem("tid"))
        this.opts.start = this.$route.params.start || JSON.parse(localStorage.getItem("start")) || 0
        let obj={
            task_id: tid
        }
        this.CLEAR_PROSALES()
        this.merchant_proSales(obj)
        this.tid = tid
    },
    mounted() {
        window.addEventListener("beforeunload",()=>{
            localStorage.setItem("tid",JSON.stringify(this.tid))
            localStorage.setItem("start",JSON.stringify(this.opts.start))
        })
    },
    updated(){
        if (this.proSalesData) {
            this.drawLine1()
            this.drawLine2()
            this.drawLine3()
        }
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
         document.body.removeEventListener('touchmove',this.bodyScroll,false);
         next()
    },
    methods: {
        ...mapActions({
            merchant_proSales: 'merchants/proSales',
        }),
        ...mapMutations({
            CLEAR_PROSALES: 'merchants/CLEAR_PROSALES',
        }),
        bodyScroll(event){  
            event.preventDefault();  
        },
        drawLine1(){
            
            let data = this.proSales.os_name
            if(data.value.length==0){           
               return
            }
            let myChart = echarts.init(document.getElementById('Chart1'))
            // 绘制图表
            myChart.setOption({
                grid: {
                    x: '10%',
                    top:'5%',
                    borderWidth :0,
                    containLabel: true
                },
                xAxis: {
                    show:false,
                    type: 'value',
                    boundaryGap: [0, 1],
                },
                yAxis: {
                    axisLine:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisTick:false,
                    type: 'category',
                    data: data.title
                },
                label:{
                    show:true,
                    position:'right'
                },
                noDataLoadingOption :{
                    text: '暂无数据',
                    effect: 'bubble',
                    effectOption: {
                        effect: {
                            n: 0
                        }
                    }
                },
                series: [
                    {
                        barWidth : 10,//柱图宽度
                        name: '2012年',
                        type: 'bar',
                        itemStyle : {
                            normal: {
                                color:'#66aef4',
                                label : {
                                    show: true,
                                    position: 'right',
                                    formatter:'{c}%',
                                    textStyle: {
                                        color: '#000'
                                    }
                                }
                            }

                        },
                        data:  data.value
                    }
                ]
            })
        },
        drawLine2(){
            
            let data = this.proSales.city
            if(data.title.length==0){           
               return
            }
            let myChart = echarts.init(document.getElementById('Chart2'))
            // 绘制图表
            myChart.setOption({
                grid: {
                    x: '30%',
                    top:'5%',
                    borderWidth :0,
                    containLabel: true
                },
                xAxis: {
                    show:false,
                    type: 'value',
                    boundaryGap: [0, 1],

                },
                yAxis: {
                    axisLine:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisTick:false,
                    type: 'category',
                    data: data.title
                },
                label:{
                    show:true,
                    position:'right'
                },
                noDataLoadingOption :{
                    text: '暂无数据',
                    effect: 'bubble',
                    effectOption: {
                        effect: {
                            n: 0
                        }
                    }
                },
                series: [
                    {
                        barWidth : 10,//柱图宽度
                        name: '2012年',
                        type: 'bar',
                        itemStyle : {
                            normal: {
                                color:'#66aef4',
                                label : {
                                    show: true,
                                    position: 'right',
                                    formatter:'{c}%',
                                    textStyle: {
                                        color: '#000'
                                    }
                                }
                            }
                        },
                        data:  data.value,

                    }
                ]
            })
        },
        drawLine3(){
            let myChart = echarts.init(document.getElementById('Chart3'))
            
            let data = this.proSales.province
            // 绘制图表
            myChart.setOption({
                
                tooltip: {
                    trigger: 'item',
                    formatter:function(a){
                        var relVal = "";
                        relVal = a['name'] + ":" + a['value']+"%";
                        return relVal;
                    },
                },
                // legend: {
                //     show:true,
                //     orient: 'vertical',
                //     left: 'center',
                //     top:'10%',
                //     data:['推广地域分布百分比']
                // },
                dataRange: {
                    min: 0,
                    max: 100,
                    x: 'center',
                    y: '76%',
                    orient: 'horizontal',
                    padding: 2,
                    width:'100%',
                    itemWidth:12,//设置宽度
                    text:['高','低'],           // 文本，默认为数值文本
              
                     inRange: {
                        color: ['lightskyblue','yellow', 'orangered']
                    }
                },
                series: [
                    {
                        name: '推广地域分布百分比',
                        type: 'map',
                        mapType: 'china',
                        top:'20%',
                        roam: false,
                        itemStyle:{
                            normal:{label:{show:true}},
                            emphasis:{label:{show:true}}
                        },
                        data: data.data
                    }
                ]
            })
        },
    },
    computed: {
        ...mapState({
            proSalesData: state => state.merchants.proSalesData,            
        })
    },
    watch: {
        proSalesData: function(data) {
            if(data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                } else {
                    this.proSales = data.items
                }
            }
        },
    },
    components: {
        Flexbox, FlexboxItem, XCircle
    }
}

  
  
// function touch(event){
//     event.preventDefault(); 
// }
// document.addEventListener('touchmove', touch);
  
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
