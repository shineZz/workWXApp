<template>
    <div>
            <div> 
                    <scroller  
                    lock-x  
                    scrollbarY 
                    @on-scroll-bottom="loadMore" 
                    @on-pulldown-loading="refresh" 
                    v-model="status" 
                    :height="scrollerHeight" 
                    use-pulldown  
                    ref="scroller" 
                    :scroll-bottom-offst="0"
                    @on-scroll="OnScroll"
                   
                    >
                    <div>
                        <div  v-if="Object.keys(noticeArr).length == 0 ||   noticeArr.num_items==0 " class="wu-all wu-allB">
                            <section>
                                <div><img src="~@/images/wu-icon1.png"></div>
                                <p>{{ Object.keys(noticeArr).length == 0? alertMsg:'暂无企业公告数据'}}</p>
                            </section>
                        </div>
                        <ul class="notice"  v-else >
                            <li v-for="(item,index) in noticeArr.items" :key="index" @click="toNoticeDetail(item.messageId)" >
                                <div class="hd">
                                    <div><img :src="item.headLogo" alt=""><span>{{item.trueName}}</span></div>
                                    <div class="it-arrow"><x-icon type="ios-arrow-right" size="20"></x-icon></div>
                                </div>
                                <div class="bd">
                                    <aside><img src="@/images/job/schedule1.png" alt=""></aside>
                                    <p>{{item.title}}</p>                                    
                                </div>
                                <div class="fd vux-1px-t">
                                    <div><time>{{item.createDate}}</time></div>
                                    <div>已读：{{item.alreadyReadPersonAmount}}人</div>
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
            <div><x-button v-if="jurisdictionFlag" type="primary" style="position:absolute;bottom:0" @click.native="toAnnounce">发布公告</x-button></div>
    </div>
    
</template>

<script>
import { XButton, Scroller ,LoadMore,Divider} from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'

export default {
    name: 'Notice',
    data() {
        return {
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            userLevel:this.$store.state.userInfo.user.userLever,

            pulldown:false,
            page:1,
            count:10,
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:true,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            alertMsg:'加载中...',//第一次
            noticeArr:{},
            ArrData:[],




            classTrue:true,
            // workData:{},
            
            jurisdictionFlag:false,
            scrollerHeight:'-60'
        }
    },
    created() {
        this.loadingHand(true);
        
    },
    mounted(){
        //有没有权限
        let obj2 = {
            userId:this.user_id,
            companyId:this.company_id,
            type:1
        }
        this.SEARCHNOTICEBOARD(obj2)
    },
    methods: {
        ...mapActions({
            GETNOTICELIST:'oanotice/GetNoticeList',
            SEARCHNOTICEBOARD:'oanotice/SearchNoticeBoard',
            ISJurisdiction:'oanotice/IsJurisdiction'
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING'
        }),
        //加载更多
        loadMore () {            
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                
                let obj={
                    userId: this.user_id,
                    companyId: this.company_id,
                    page: this.page,
                    count: this.count,
                    reqFrom: '2',
                }
                this.GETNOTICELIST(obj)
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true;
                this.page = 1;
                let obj={
                    userId: this.user_id,
                    companyId: this.company_id,
                    page: this.page,
                    count: this.count,
                    reqFrom: '2',
                }
                this.GETNOTICELIST(obj);
            }
        },
        toAnnounce(){
            this.$router.push('announce')
        },
        toNoticeDetail(id){
            this.$router.push({path:'noticeDetail',query:{messageId:id}})
        },
        OnScroll(){
            this.$refs.scroller.reset()
        },
    },
    computed: {
        ...mapState({
            noticeData:state => state.oanotice.noticeData,
            noticeBoardData:state => state.oanotice.noticeBoardData,
            notViewNumber:state => state.oanotice.notViewNumber,
        })
    },
    watch: {
        noticeData:function(data,oldVal){
            if(Object.keys(data).length>0){
                 if(this.onload){
                    this.onload=false
                    this.loadingHand(false)
                }
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
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
                        this.noticeArr = ArrObj ;
                }
            }
        },
        noticeBoardData:function(data){
            if(data.alert_msg){

            }else{
                if(data.items.length>0){
                    this.jurisdictionFlag = true
                    this.scrollerHeight = '-97'
                }else{
                    this.jurisdictionFlag = false
                    this.scrollerHeight = '-60';
                }
                //数据列表
                let obj={
                    userId: this.user_id,
                    companyId: this.company_id,
                    page: this.page,
                    count: this.count,
                    reqFrom: '2',
                }
                this.GETNOTICELIST(obj)
            }
        },
        
    },
    components: {
        XButton, Scroller ,LoadMore,Divider
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
