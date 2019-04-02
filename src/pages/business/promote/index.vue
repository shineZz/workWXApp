<template>
    <div>
        <scroller  lock-x scrollbarY @on-scroll-bottom="loadMore" @on-pulldown-loading="refresh" v-model="status" height="-54"   use-pulldown  ref="scroller" :scroll-bottom-offst="0">
            <div>
                <div  v-if="Object.keys(merchantData).length == 0 ||   merchantData.num_items==0 " class="wu-all wu-allB">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>{{ Object.keys(merchantData).length == 0? alertMsg:'企业暂无推广信息'}}</p>
                    </section>
                </div> 
                <div v-else>
                    <div class="merchants-box" v-for="(item, index) in merchantData.items" :key="index">
                        <router-link :to='{name:"iframe", query:{ title:"推广详情", url:item.taskDetail } }'  class="merchants-bd vux-1px-t">
                            <aside>
                                <img :src="item.task_cover_tmb"  :alt="item.task_name" :onerror="logo">
                                <i class="tip2"></i>
                            </aside>
                            <section>
                                <h4>{{item.task_name}}</h4> 
                                <p>{{item.task_desc}}</p>
                            </section>
                        </router-link>
                        <cell
                            :title="('推广详情')"
                            is-link
                            :border-intent="false"
                            class="vux-1px-b bg-fff"
                            :arrow-direction="cur==index ? 'up' : 'down'"
                            @click.native="Menu(index, item)" >
                        </cell>
                        <div class="merchants-fd" v-if="cur==index"  :class="cur==index?'merchants-animate':''">
                            <div class="share-box1">
                                <router-link :to='{name:"analysis", params:{ tid:item.task_id, start:0 } }'>
                                    <article><strong>{{proSales.overview[0]}}</strong><br/><span>总曝光量</span></article>
                                    <article><strong>{{proSales.overview[2]}}</strong><br/><span>总分享次数</span></article>
                                    <article><strong>{{proSales.overview[1]}}</strong><br/><span>总阅读量</span></article>
                                </router-link>
                            </div>
                            <div class="vux-1px-t vux-1px-b share-box2">
                                <router-link :to='{name:"analysis", params:{ tid:item.task_id, start:1 } }'>
                                    <div class="svg-box" :id="`myChart${index}`" :style="{width: 'auto', height: '200px'}"></div>
                                </router-link>
                            </div>
                            <div  class="vux-1px-t vux-1px-b share-box3">
                                <router-link :to='{name:"analysis", params:{ tid:item.task_id, start:2 } }'>
                                    <article >
                                        <h6>性别</h6>
                                        <section>
                                            <dl>
                                                <dt><img src="~@/images/analysis/M.png"/></dt>
                                                <dd>{{proSales.sex[0]}}%</dd>
                                            </dl>
                                            <dl>
                                                <dt><img src="~@/images/analysis/F.png"/></dt>
                                                <dd>{{proSales.sex[1]}}%</dd>
                                            </dl>
                                        </section>                            
                                    </article>
                                    <article>
                                        <h6>手机</h6>
                                        <section>
                                            <dl>
                                                <dt><img src="~@/images/analysis/iphone.png"/></dt>
                                                <dd>{{proSales.phone[0]}}%</dd>
                                            </dl>
                                            <dl>
                                                <dt><img src="~@/images/analysis/android.png"/></dt>
                                                <dd>{{proSales.phone[0]}}%</dd>
                                            </dl>
                                        </section>                            
                                    </article>
                                </router-link>
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
import { Spinner,Scroller,Group, Cell, Panel, LoadMore ,Divider} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import echart from 'echarts'

export default {
    name: 'promote',
    data() {
        return {
            page:1,
            count:5,
            company_id:this.$store.state.userInfo.company.companyId,
            ArrData:[],
            merchantData:{},
            proSales: {},
            cur:-1,//被选中第几个            
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:true,
            status: {
                pulldownStatus: 'default'
            },
            pulldown:false,
            alertMsg:'加载中...',//第一次
            logo: 'this.src="' + require('@/images/logo-bao.jpg') + '"' ,
        }
    },
    created() {
        this.loadHand(true)
    },
    mounted(){
       let obj={
            type:'2',
            page:this.page,
            count:this.count,
            company_id:this.company_id
        }
        this.merchant_MerchantList(obj);
    },
    // updated() {
    //     if(this.ArrData.length>0 && this.cur === -1){
    //         this.ECheart_Hand()
    //     }
    // },
    methods: {
        ...mapActions({
            merchant_MerchantList: 'merchants/MerchantList',
            merchant_proSales: 'merchants/proSales',
        }),
        ...mapMutations({
            CLEAR_MERCHANTLIST: 'merchants/CLEAR_MERCHANTLIST',
            loadHand: 'UPDATE_LOADING',
        }),
        //详情下拉
        Menu: function (index,item) {
            let les = index*153+16
            if(index==this.cur){
                this.cur='-1'
                let he = this.merchantData.items.length*153-$("body").height()
                if(les>he && index>1){
                    this.$refs.scroller.reset({
                        top:he
                    },1000)
                }
            }else{
                this.proSales = {
                    overview: [],
                    phone: [],
                    sex: [],
                    shareto: [],
                }
                let obj = {
                    task_id: item.task_id,
                    report_type: 'shareto|sex|phone|overview',
                }
                this.merchant_proSales(obj)
                this.cur = index
                this.$nextTick(()=>{
                    this.$refs.scroller.reset({
                        top:les
                    },1000)
                })
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
                    type:'2',
                    page:this.page,
                    count:this.count,
                    company_id:this.company_id
                }
                this.merchant_MerchantList(obj);                
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true
                this.page = 1
                let obj={
                    type:'2',
                    page:this.page,
                    count:this.count,
                    company_id:this.company_id
                }
                this.merchant_MerchantList(obj,2);
            }
        },
        //画图
        ECheart_Hand(){
            this.cur = this.cur===-1?0:this.cur;
            this.$nextTick(()=>{
                   let data=this.proSales
                this.drawLine(this.cur, data)
                })
        },
        drawLine(index, item){
            let eid = 'myChart' + index
            let myChart = echart.init(document.getElementById(eid))
            let data = item.shareto
            // 绘制图表
            myChart.setOption({
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '20%',
                    x:0,
                    y:20,
                    containLabel: false
                },
                xAxis : [
                    {
                        show:true,
                        type : 'category',
                        data : ['', '', '', ''],
                        axisLine:{show:false},
                        splitLine:{
                            show:false
                        },
                    axisTick:false
                    }
                ],
                yAxis : [
                    {
                        show:true,
                        axisLine:{
                            show:false
                        },
                        splitLine:{
                            show:false,
                            lineStyle:{type:'dotted'},
                        },
                        axisTick:false
                    } 
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
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
                                    formatter:'{c}%',
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
                        barWidth: '50%',
                        data: data,
                        markPoint: {
                            tooltip: {
                                trigger: 'item',
                                backgroundColor: 'rgba(0,0,0,0)',
                                formatter: function(params){
                                    return '<img src="' 
                                            + params.data.symbol.replace('image://', '')
                                            + '"/>';
                                }
                            },
                            data: [
                                {xAxis:0, y: 180, name:'Line', symbolSize:20, symbol: 'image://'+require('../../../images/analysis/weixin-m.png')},
                                {xAxis:1, y:180, name:'Bar', symbolSize:20, symbol: 'image://'+require('../../../images/analysis/pyq-m.png')},
                                {xAxis:2, y: 180, name:'Scatter', symbolSize:20, symbol: 'image://'+require('../../../images/analysis/QQ-m.png')},
                                {xAxis:3, y:180, name:'K', symbolSize:20, symbol: 'image://'+require('../../../images/analysis/zone-m.png')},
                            ]
                        }
                    }
                ]
            })
        },
    },
    computed: {
       ...mapState({
            isLoading: state => state.isLoading,
            merchantListData: state => state.merchants.merchantListData,
            proSalesData: state => state.merchants.proSalesData,
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
                } else {
                    if (data.items.length && this.page == 1) {
                        let obj = {
                            task_id: data.items[0].task_id,
                            report_type: 'shareto|sex|phone|overview',
                        }
                        this.merchant_proSales(obj)
                    }
                    let ArrObj = data
                    if(this.pulldown || this.page==1){
                        this.ArrData=[]
                        this.ArrData= ArrObj.items
                        this.status.pulldownStatus = 'default';
                    }else{
                        this.ArrData= this.ArrData.concat(ArrObj.items)                  
                    } 
                    ArrObj.items = this.ArrData
                    if(data.has_more){
                        this.onFetching = false ;
                        this.loadFlag=true;
                    }else{
                        this.loadFlag=false
                        this.onFetching = true 
                    }
                    this.merchantData = ArrObj
                }
            } else {
                this.merchantData = {}
            }
        },
        proSalesData: function(data) {
            if(Object.keys(data).length > 0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                } else {
                    this.proSales = data.items
                    this.ECheart_Hand()
                }
            } else {
                this.proSales = {}
            }
        },
    },
    components: {
        Scroller,
        Spinner,
        Group,
        Cell,
        Panel,
        LoadMore,
        Divider
    },
}
</script>
<style lang="less" >
 @import '../../../css/merchant.less';
</style>
