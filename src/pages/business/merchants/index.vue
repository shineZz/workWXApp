<template>
    <div  >
        <scroller  lock-x  scrollbarY @on-scroll-bottom="loadMore" @on-pulldown-loading="refresh" v-model="status" height="-54" use-pulldown  ref="scroller" :scroll-bottom-offst="0">
            <div>
                <div  v-if="Object.keys(merchantData).length == 0 ||   merchantData.num_items==0 " class="wu-all wu-allB">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>{{ Object.keys(merchantData).length == 0? alertMsg:'企业暂无招商信息'}}</p>
                    </section>
                </div>  
                <div v-else>
                    <div class="merchants-box" v-for="(item,index) in merchantData.items" :key="index">
                        <router-link :to='{name:"iframe", query:{ title:"招商详情", url:item.taskDetail } }'  class="merchants-bd vux-1px-t">
                            <aside>
                                <img :src="item.task_cover_tmb" :alt="item.task_name" :onerror="logo">
                                <i class="tip1"></i>
                            </aside> 
                            <section>
                                <h4 >{{item.task_name}}</h4> 
                                <p>{{item.task_desc}}</p>
                            </section>
                        </router-link>
                        <cell
                            :title="('招商详情')"
                            is-link
                            class="vux-1px-b bg-fff"
                            :border-intent="false"
                            :arrow-direction="cur==index ? 'up' : 'down'"
                            @click.native="Menu(index,item)" >
                        </cell>
                        <div class="merchants-fd" v-if="cur==index"  :class="cur==index?'merchants-animate':''">
                            <div class="popupsteps vux-1px-t vux-1px-b">
                                <article  v-for="(item_s,i) in audit_list(item.audit_list)" :key="i">                                
                                    <a href="javascript:void(0)" @click="item_s.total_num==0?'': linkHand(item_s.dealer_audit_status,item.task_id)">
                                        <div>{{item_s.total_num}}</div>
                                        <h6>{{item_s.name}}</h6>
                                    </a>
                                </article>         
                            </div>
                            <div class=" vux-1px-t vux-1px-b">
                                <h5>招商达成</h5>
                                <div class="svg-box" id="myChart1" :style="{width: 'auto', height: '200px'}"></div>
                                <footer>
                                    <div>招商目标<br><strong>{{item.task_amount}}</strong></div>
                                    <div>实际招商<br><strong>{{item.complete_amount}}</strong></div>
                                    <div>完成比例<br><strong>{{item.task_amount==0?'100': item.complete_amount==0?'0': Math.round(item.complete_amount/item.task_amount*10000)/100}}%</strong></div>
                                </footer>
                            </div>
                            <div class=" vux-1px-t vux-1px-b">
                                <h5>招商回款</h5>
                                <div class="svg-box" id="myChart2" :style="{width: 'auto', height: '200px'}"></div>
                                <footer>
                                    <div>回款目标:<strong>{{item.aim_fee}}</strong></div>
                                    <div>实际回款:<strong>{{item.get_fee}}</strong></div>
                                </footer>
                            </div>
                            <div class=" vux-1px-t vux-1px-b">
                                <h5>招商漏斗</h5>
                                <div class="svg-box" id="myChart3" :style="{width: 'auto', height: '200px'}"></div>
                                <footer>
                                    <div>平台推荐<br><strong>{{item.recom_num}}</strong></div>
                                    <div>厂家中标<br><strong>{{item.bid_num}}</strong></div>
                                    <div>合同签订<br><strong>{{item.sig_contract_num}}</strong></div>
                                </footer>
                            </div>
                        </div>           
                    </div>
                </div>
                
                <load-more tip="加载中" v-if="loadFlag" ></load-more>
                <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
            </div>
            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放刷新</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>
        </scroller>
    </div>
    
</template>

<script>
import { Scroller,Group, Cell, LoadMore,Divider,} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import echart from 'echarts'
export default {
    name: 'merchants',
    data() {
        return {
            page:1,
            count:5,
            company_id:this.$store.state.userInfo.company.companyId,
            merchantData:{},
            cur:-1,//被选中第几个            
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:true,//要不要滚动加载
            ArrData:[],
            status: {
                pulldownStatus: 'default'
            },
            pulldown:false,
            alertMsg:'加载中...',//第一次
            logo: 'this.src="' + require('@/images/logo-bao.jpg') + '"' ,

        }
    },
    created() {        
        this.loadHand(true);
    },
    mounted(){
        let obj={
            type:'0',
            page:this.page,
            count:this.count,
            company_id:this.company_id,           
        }
         this.merchant_MerchantList(obj,2);   
    },
    computed: {
        ...mapState({
            merchantListData:state => state.merchants.merchantListData2,            
        })       
    },
    
     watch: {
        merchantListData: function(data) {
            if(Object.keys(data).length > 0) {
                if(this.onload){
                    this.onload=false
                    this.loadHand(false)
                }
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"      
                    })
                    this.status.pulldownStatus = 'default' ;
                    this.alertMsg=data.alert_msg;
                }else{    
                    let ArrObj= data; 
                    if (data.items.length && this.page == 1 && this.cur===-1) {
                        this.ECheart_Hand()  
                    }
                    if(this.pulldown ||this.page==1){
                        this.ArrData=[]
                        this.ArrData= ArrObj.items;
                        this.status.pulldownStatus = 'default'
                    }else{
                        this.ArrData= this.ArrData.concat(ArrObj.items)                  
                    }            
                    ArrObj.items=this.ArrData                    
                    if(data.has_more){
                        this.onFetching = false ;
                        this.loadFlag=true;
                    }else{
                        this.loadFlag=false
                        this.onFetching = true 
                    }
                    this.merchantData = ArrObj                   
                }
            }else{
                this.merchantData = {}
            }
        },
     },
    methods: {
        ...mapActions({
            merchant_MerchantList: 'merchants/MerchantList2',
        }),
        ...mapMutations({
            CLEAR_MERCHANTLIST: 'merchants/CLEAR_MERCHANTLIST',
            loadHand: 'UPDATE_LOADING',
            
        }),
        
        linkHand(dealer,task_id){
            let obj={
                dealer,
                task_id,
            }
            localStorage.setItem('progressOdbj',JSON.stringify(obj))
            this.$router.push({path: 'progress'})

        },
        //过滤招商进度数据
        audit_list: function (data) {            
            return data.filter(function (data) {
                return data.name!='发货'
            })
        },
        //画图
        ECheart_Hand(){
            this.cur = this.cur===-1?0:this.cur;
            this.$nextTick(()=>{
                let data=this.merchantData.items[this.cur]
                let data1=data.task_amount==0?'100': data.complete_amount==0 ?'0': Math.round(data.complete_amount/data.task_amount*10000)/100
                let data2={
                    Arr1:data.aim_fee,
                    Arr2:data.get_fee,
                }
                let data3={
                    Arr1:data.recom_num,
                    Arr2:data.bid_num,
                    Arr3:data.sig_contract_num,
                }
                this.drawLine1(data1)
                this.drawLine2(data2)
                this.drawLine3(data3)
            })
        },
        //详情下拉
        Menu: function (index,item) {   
            let les=index*153+16        
            if(index==this.cur){
                this.cur='-1'
                let he=  this.merchantData.items.length*153-$("body").height()
                if(les>he && index>1){
                    this.$refs.scroller.reset({
                        top:he
                    },1000)
                }
            }else{
                this.cur=index
                this.$refs.scroller.reset({
                    top:les
                },1000)
                this.ECheart_Hand() 
            }
        },
        
        //滚动加载
        loadMore () {
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true
                this.pulldown=false
                this.page = this.page+1
                let obj={
                    type:'0',
                    page:this.page,
                    count:this.count,
                    company_id:this.company_id
                }
                this.merchant_MerchantList(obj,2);                
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true
                this.page = 1
                let obj={
                    type:'0',
                    page:this.page,
                    count:this.count,
                    company_id:this.company_id
                }
                this.merchant_MerchantList(obj,2);
            }
        },
        drawLine3(data){
            let myChart = echart.init(document.getElementById('myChart3'))
            // 绘制图表
            myChart.setOption({
                legend: {
                    data: ['平台推荐','厂家中标','合同签订'],
                     top:'5%',
                },
                calculable : true,
        series : [
            {
                name:'漏斗图',
                type:'funnel',
                width: '70%',
                height:'70%',
                x: '10%',
                y:'24%',
                data:[
                    {value:data.Arr1, name:'平台推荐',itemStyle:{
                                    normal:{color:'#3366cc'}
                                }},
                    {value:data.Arr2, name:'厂家中标',itemStyle:{
                                    normal:{color:'#33cc99'}
                                }},
                    {value:data.Arr3, name:'合同签订',itemStyle:{
                                    normal:{color:'#fbe08d'}
                                }},
                ]
            },

        ]

            })
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
                        data : ['回款目标', '实际回款'],
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
                                            var colorList = ['#3eb135','#3eb135','#4dafea','#eecf3d'];
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
                                                            var colorList = ['#3eb135','#3eb135','#4dafea','#eecf3d'];
                                                            return colorList[params.dataIndex];},
                                            }
                                        }
                                    }
                                },
                        data:[
                                        {
                                            value:data.Arr1,
                                            itemStyle:{
                                                normal:{color:'#3366cc'}
                                            }
                                        },
                                        {
                                            value:data.Arr2,
                                            itemStyle:{
                                                normal:{color:'#33cc99'}
                                            }
                                        },
                                    ]
                    }
                ]
            })
        },
        drawLine1(data){
            // 基于准备好的dom，初始化echart实例
            let myChart = echart.init(document.getElementById('myChart1'))
            // 绘制图表
            myChart.setOption({
            color : [
                'rgba(255, 69, 0, 0.5)',
                'rgba(255, 150, 0, 0.5)',
                'rgba(255, 200, 0, 0.5)',
                'rgba(155, 200, 50, 0.5)',
                'rgba(55, 200, 100, 0.5)'
            ],
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            series : [
                {
                    name:'业务指标',
                    type:'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    radius :120,
                    center: ['50%', '75%'],
                    splitNumber: 10,       // 分割段数，默认为5
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.2, '#228b22'],[0.8, '#48b'],[1, '#ff4500']],
                            width: 8
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 10,   // 每份split细分多少段
                        length :12,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        length :30,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer : {
                        width : 5
                    },
                    title : {
                        show : true,
                        offsetCenter: ['-32%', '20%'],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize :18
                        }
                    },
                    detail : {
                        formatter:'{value}%',
                        offsetCenter: ['21%', '20%'],
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontWeight: 'bolder',
                            fontSize :18
                        }
                    },
                    data:[{value: data, name: '完成率:'}]
                },

            ]
        });
    }
           
    },
    components: {
        Scroller,
        Group,
        Cell,
        LoadMore,
        Divider
    },
}
</script>
<style lang="less" >
 @import '../../../css/merchant.less';
</style>
