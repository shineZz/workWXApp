<template>
    <div>
        <group v-if="query==1"  v-show="!isAddressBook">
            <cell title="选择查看对象" is-link @click.native="toggleAddress"></cell>
        </group>
        <div v-transfer-dom>
            <!-- 了解更多 -->
            <popup  position="right" width='100%'  v-show="isAddressBook">
                 <AddressBook @toggleAddress="toggleAddress" v-if="query==1" :state1="0" :state2="1" :state3="1" :state4="0" :state5="0" />
            </popup>
        </div>
            <div  v-show="!isAddressBook">                
                <scroller  
                    lock-x  
                    scrollbarY 
                    @on-scroll-bottom="loadMore" 
                    @on-pulldown-loading="refresh" 
                    v-model="status" 
                    :height="scrollHeight" 
                    use-pulldown  
                    ref="scroller" 
                    :scroll-bottom-offst="0"
                    @on-scroll="OnScroll"
                   
                    >
                    <div style="overflow:hidden">     
                        <div  v-if="Object.keys(reportData).length == 0 ||   reportData.num_items==0 " class="wu-all wu-allB">
                            <section>
                                <div><img src="~@/images/wu-icon1.png"></div>
                                <p>{{ Object.keys(reportData).length == 0? alertMsg:'暂无报告数据'}}</p>
                            </section>
                        </div>         
                        <div  v-else >
                            <group class="report-box" v-for="(item,index) in ArrData" :key="index" @click.native="toDetailRouter(item.reportId,item.type,index)" >
                                <header class="vux-1px-b">
                                    <aside><img :src=" query==1 ? item.createPerpleHeadLogo : item.headLogo" alt="item.content" :onerror="logo"></aside>
                                    <section>
                                        <h5>{{ query==1?item.createPeople: item.userName}}</h5>
                                        <time>{{item.createTime}}</time>
                                    </section>
                                    <article>
                                        <div><strong>{{item.state=="3" ? "已审阅" : "未审阅"}}</strong><span>{{item.type==1 ? "日报" : item.type==2 ? "周报" : "月报"}}</span></div>
                                        <p v-if="item.attachCount>0">{{item.attachCount}}个附件</p>
                                    </article>
                                </header>
                                <div class="bd">
                                    <div class="it-box">
                                        <p>{{item.content}}</p>                            
                                    </div>                            
                                </div>                        
                            </group>
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
    </div>
</template>

<script>
import {Scroller,Spinner,LoadMore,Divider,Group,Cell,TransferDom,Popup } from 'vux'
import { mapState, mapActions ,mapMutations} from 'vuex'
import AddressBook from '@/components/addressBook'
export default {
    name: 'Statement',
    data() {
        return {  
            isAddressBook:false,

            scrollHeight:"",
            query:0,
            page:1,
            count:15,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            userIds:'',
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:true,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            alertMsg:'加载中...',//第一次
            pulldown:false,
            reportData:{},    
            ArrData:[],
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"',
            dataCur:0,//第几个跳转出去
        }
    },
    created() {
        this.query=this.$route.query.state ;  
        this.loadingHand(true);
        let obj={
                userId:this.userId,
                companyId:this.companyId,
                page:this.page,
                count:this.count,
            }
        if(this.query==0){
            this.scrollHeight="-0";
            document.title="我发出的";            
            this.clearInitiateReport();
            this.initiateReportHand(obj);

        }else if(this.query==1){
            this.scrollHeight="-60";
            document.title="我收到的";             
            obj.userIds=this.userIds;
            this.clearReceivedReport();
            this.receivedReportHand(obj);
        }

       
    },
    computed: {
        ...mapState({
            initiateData:state => state.oaworkreport.initiateData,        
            receivedData:state => state.oaworkreport.receivedData,  
            selectedMember: state => state.addressBook.selectedMember,
            viewReportData:state => state.oaworkreport.viewReportData, 
            
        })       
    },
    directives: {
        TransferDom
    },
    watch: {
        //我发起的
        initiateData(data){
            this.DataHand(data);
        },
        //我收到的
        receivedData(data){
            this.DataHand(data);
        },
    },
    methods: { 
        ...mapActions({
            initiateReportHand: 'oaworkreport/initiateReport',
            receivedReportHand:'oaworkreport/receivedReport',
        }),
        ...mapMutations({
            clearInitiateReport: 'oaworkreport/CLEAR_RECEIVEDREPORT',
            clearReceivedReport: 'oaworkreport/CLEAR_INITIATEREPORT',   
            loadingHand: 'UPDATE_LOADING',      
            SELECTED_MEMBER: 'addressBook/SELECTED_MEMBER', 
            INITCOMPANYOBJ:'addressBook/INITCOMPANYOBJ',   
        }),
        //数据重组
        DataHand(data){
            if(Object.keys(data).length >0){
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
                            this.status.pulldownStatus = 'default';
                        }else{
                            if(!this.isAddressBook){
                                this.ArrData= this.ArrData.concat(ArrObj.items)
                            }else{
                                this.ArrData=ArrObj.items
                            }           
                        }                             
                        if(data.has_more){
                            this.onFetching = false ;
                            this.loadFlag=true;
                        }else{
                            this.loadFlag=false
                            this.onFetching = true 
                        }
                        this.reportData = ArrObj ;
                }
                
            }
        },
        toggleAddress(){
            this.isAddressBook=!this.isAddressBook;
            // this.SELECTED_MEMBER([])
            let that = this
            
            if(!this.isAddressBook){  
                let userIdArr=[];
               
                this.selectedMember.forEach(item => {
                    userIdArr.push(item.userId);
                    
                });    
                this.userIds=    userIdArr.join(',')  
                let obj={
                        userId:this.userId,
                        companyId:this.companyId,
                        page:1,
                        count:this.count,
                        userIds:this.userIds
                    }
                    this.reportData={}
                    this.receivedReportHand(obj);

            }else{
                this.ArrData = []
                let arr = this.$store.state.addressBook.storeUserList;
            
                for(let i=0;i<arr.length;i++){
                    for(let j=0;j<arr[i].childrenList.length;j++){
                        arr[i].childrenList[j].flag = false
                    }
                }
                this.INITCOMPANYOBJ(arr)
                this.SELECTED_MEMBER([])
            }
            
        },
        loadMore () {
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                let obj={
                    userId:this.userId,
                    companyId:this.companyId,
                    page:this.page,
                    count:this.count,
                }
                if(this.query==0){
                    this.initiateReportHand(obj);
                }else{
                    obj.userIds=this.userIds;
                    this.receivedReportHand(obj);
                }              
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true;
                this.page = 1;
                let obj={
                    userId:this.userId,
                    companyId:this.companyId,
                    page:this.page,
                    count:this.count,
                }
                if(this.query==0){
                    this.initiateReportHand(obj);
                }else{
                    obj.userIds=this.userIds;
                    this.receivedReportHand(obj);
                }
            }
        },
        toDetailRouter(id,state,index){
            this.dataCur=index;
            this.$router.push({path:"statementDetail",query:{reportId:id,state:state}})
        },
        OnScroll(){
            this.$refs.scroller.reset()
        },
    },
    // beforeRouteLeave(to, from, next) {
    //     console.log(to,from,'-------------')
    //      // 离开时缓存
    //     if(to.name=='wodkChild'){
    //         from.meta.keepAlive = false; // 让 A 不缓存，即刷新
    //         to.meta.keepAlive = false;
    //     }else if(from.name=='Statement'){
    //         from.meta.keepAlive = true;
    //     }
    //     next();
    // },
    // beforeRouteEnter (to, from, next) {
    //     // 进入时调用
    //     if(from.name=='StatementDetail'){
    //         next((vm)=>{ 
    //             //返回的数据交互
    //             if(vm.ArrData.length>0){
    //                 vm.ArrData[vm.dataCur].state=vm.viewReportData.items.report.state; 
    //             }  
    //         })
    //     }else{
    //         next()
    //     }
    // },
    components: {
        Scroller,
        Spinner,
        LoadMore,
        Divider,
        Group,
        Cell,
        AddressBook,
        Popup
    },
}
</script>


<style lang="less" scoped>
 @import './index.less';
</style>
//后期写成组件
// <group class="report-box">
//                         <header class="vux-1px-b">
//                             <aside><img src="@/images/job/timg.jpg" alt=""></aside>
//                             <section>
//                                 <h5>姓名</h5>
//                                 <time>2018-10-10 10:10:10</time>
//                             </section>
//                             <article>
//                                 <div><strong>未审阅</strong><span>日报</span></div>
//                                 <p>2个附件</p>
//                             </article>
//                         </header>
//                         <div class="bd">
//                             <div class="it-box">
//                                 <h6>日报内容：</h6>
//                                 <p>内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容</p>                            
//                             </div>
//                             <div class="it-box2">
//                                 <h6>附件图片</h6>
//                                 <article>
//                                     <div><img src="@/images/job/timg.jpg" alt="" ></div>
//                                     <div><img src="@/images/job/timg.jpg" alt="" ></div>
//                                     <div><img src="@/images/job/timg.jpg" alt="" ></div>
//                                 </article>
//                             </div>
//                         </div>                        
//                     </group>