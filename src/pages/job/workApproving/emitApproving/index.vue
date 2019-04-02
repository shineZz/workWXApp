<template>
    <div>        
        
            <button-tab class="tabnav-all vux-1px-b" v-if="state==1"  v-model="navTab">
                <button-tab-item @on-item-click="changeList()"><span class="badge-box" >待我审批的<badge v-if="num>0" :text="num" class="badge" /></span></button-tab-item>
                <button-tab-item @on-item-click="changeList()">我已审批的</button-tab-item>
            </button-tab>
            <scroller 
            lock-x  scrollbarY @on-scroll-bottom="loadMore" @on-pulldown-loading="refresh" v-model="status" :height="height" use-pulldown  ref="scroller" :scroll-bottom-offst="0"
            >
                <div>
                    <div  v-if="Object.keys(processData).length == 0 ||   processData.num_items==0 " class="wu-all wu-allB">
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>{{ Object.keys(processData).length == 0? alertMsg:'暂无流程数据'}}</p>
                        </section>
                    </div>
                    <ul class="box2" v-else >
                        <li v-for="(item,index) in processData.items" :key="index" @click="toDetailRouter(item,index)">
                            <div class="emitApproving-list vux-1px-b">
                                <div class="img-box">
                                    <img :src="item.headLogo" :alt="item.title" :onerror="logo">
                                </div>
                                <div class="emitApproving-center">
                                    <p class="name">{{item.title}}</p>
                                    <p class="date">{{item.status==1?'未提交':item.status==2?'审批中':item.status==3?'审批通过':item.status==4?'审批不通过':'已撤销'}}</p>
                                </div>
                                <div class="emitApproving-right">{{createTimeHand(item.createTime)}}</div>
                            </div>
                        </li>
                    </ul>
                    <!-- 底部区域 -->
                    <load-more tip="加载中" v-if="loadFlag" ></load-more>
                    <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
                </div>
                <!-- 下拉组件 -->
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
import { CellBox, Cell, Group, Scroller, Divider, LoadMore, ButtonTab, ButtonTabItem, Badge } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'

export default {
    name: 'emitApproving',
    data() {
        return {
            navTab:0,
            state:0,
            type:'1',
            page:1,
            count:15,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:true,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            pulldown:false,
             alertMsg:'加载中...',//第一次
            processData:{},   
            ArrData:[],
            height: '',
            num:0,
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"',
            dataCur:0,
        }
    },
    created() {
        // 判断入口展示相应内容
        this.state=this.$route.query.state;
        this.height = this.state==1?'-61':'';
        this.type=this.state==0?'1':this.navTab==0?'2':'3';
        document.title = this.state==0?'我发起的':'我审批的';        
        this.loadingHand(true);
        this.clearProcessList();
               
    },
    mounted() {
        this.listStateHand(); 
    },
    watch: {
         processListData(data){            
            if( Object.keys(data).length >0 ){                
                if(this.onload){
                    this.onload=false
                    this.loadingHand(false)
                }
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.status.pulldownStatus = 'default' ;
                    this.alertMsg=data.alert_msg;
                }else{ 
                    let ArrObj= data;
                        if(this.pulldown || this.page==1){
                            this.ArrData=[];
                            this.ArrData= ArrObj.items;
                            this.status.pulldownStatus = 'default'
                        }else{                            
                            this.ArrData= this.ArrData.concat(ArrObj.items)    ;              
                        }                               
                        if(ArrObj.has_more){
                            this.onFetching = false ;
                            this.loadFlag=true;
                        }else{
                            this.loadFlag=false
                            this.onFetching = true 
                        }
                        ArrObj.items=this.ArrData;
                        if(this.state!=0 && this.navTab==0){
                            this.num=ArrObj.num_items
                        }
                        this.processData = ArrObj ;

                }
            }else{
                this.processData = {}
            }
        },
    },
    computed: {
        ...mapState({
            processListData: state => state.oaprocess.processListData,
            btnApprovalData: state => state.oaprocess.btnApprovalData,
            
        })       
    },
    methods: {
        ...mapActions({
            processListHand:'oaprocess/processList',
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
            clearProcessList: 'oaprocess/CLEAR_PROCESSLIST',
            
        }),
        changeList(index) {
            this.page = 1;
            this.onload=true;
            this.onFetching = false;
            this.pulldown=true;
            this.loadingHand(true);
            this.listStateHand();
        },
        toDetailRouter(item,index){
            this.dataCur=index;
            this.$router.push({path:"approvingDetail",query:{title:item.title,status:item.status,processId:item.processId,type:this.state==0?'1':this.navTab==0?'2':'3',name:item.applicantName}})

        },
        //时间转化
        createTimeHand(data){
            return   data.substring(0,10).replace(/-/g, ".")
        },
        //加载更多
        loadMore () {            
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                this.listStateHand();         
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true;
                this.page = 1;
                this.listStateHand();
                
            }
        },
        //数据调用
        listStateHand(){
            let obj={
                userId:this.userId,
                companyId:this.companyId,            
                page:this.page,
                count:this.count,
                type:this.state==0?'1':this.navTab==0?'2':'3',
            }
            this.processListHand(obj);
        }
    },
    // beforeRouteLeave(to, from, next) {
    //     console.log(to.name,from.name,66666666666666)
    //      // 离开时缓存
    //     if(to.name=='wodkChild'){
    //         from.meta.keepAlive = false; // 让 A 不缓存，即刷新
    //         to.meta.keepAlive = false;
    //     }else if(from.name=='EmitApproving'){
    //         from.meta.keepAlive = true;
    //     }
    //     next();
    // },
    // beforeRouteEnter (to, from, next) {
    //     // 进入时调用
    //     if(from.name=='ApprovingDetail'){
    //         next((vm)=>{ 
    //             //返回的数据交互
    //             // if(Object.keys(vm.processData).length >0 ){
    //             //     vm.processData.items[vm.dataCur].status=vm.btnApprovalData.items.status; 
    //                     // if(vm.type==2){
    //                     //     vm.processData.num_items= (Number(vm.processData.num_items)-1);

    //                     // }
    //             // }  
    //         })
    //     }else{
    //         next()
    //     }
    // },
    components: {
        CellBox,
        Group,
        Cell,
        Scroller,
        Divider,
        LoadMore,
        ButtonTab,
        ButtonTabItem,
        Badge
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
