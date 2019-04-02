<template>
 <div>
            
        
                <scroller  lock-x  scrollbarY @on-scroll-bottom="loadMore" @on-pulldown-loading="refresh" v-model="status" height="-62" use-pulldown  ref="scroller" :scroll-bottom-offst="0" @on-scroll="OnScroll">
                    <div>
                        <div  v-if="Object.keys(systemArr).length == 0 ||   systemArr.num_items==0 " class="wu-all wu-allB">
                            <section>
                                <div><img src="~@/images/wu-icon1.png"></div>
                                <p>{{ Object.keys(systemArr).length == 0? alertMsg:'暂无系统通知数据'}}</p>
                            </section>
                        </div>
                        <ul class="system" v-else> 
                            <li v-for="(item,index) in systemArr.items.sysMessageList" :key="index" @click="LinkHand">
                                <div class="bd">
                                    <aside><img src="@/images/job/schedule2.png" alt=""></aside>
                                    <section>
                                        <h5>工作日程</h5>
                                        <p>参加IBM杭州食品会议系统的演示会议参加IBM杭州食品会议系统的演示会议参加IBM杭州食品会议系统的演示会议</p>
                                    </section>                                                                        
                                </div>
                                <div class="fd vux-1px-t">
                                    <div><time>2015年6月29日  15:22:23</time></div>
                                    <div>已读</div>
                                </div>  
                            </li>
                           
                        </ul>
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
import {  Scroller ,LoadMore,Divider } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'


export default {
    name: 'Inform',
    data() {
        return {
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
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
            systemArr:{},
            ArrData:[],
        }
    },
    created() {
        this.loadingHand(true);        
    },
    mounted() {
        this.initList()
    },
    methods: {
        ...mapActions({
            GETSysList:'oanotice/GetSysList',
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING'
        }),
        initList(){
            let obj = {
                companyId:this.company_id,
                userId:this.user_id,
                page:this.page,
                count:this.count
            }
            this.GETSysList(obj)
        },
        //加载更多
        loadMore () {            
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                
                this.initList();
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true;
                this.page = 1;
                this.initList();
            }
        },
        LinkHand(){
            this.$router.push({path:"statementDetail",query:{id:0}})
        },
        OnScroll(){
            this.$refs.scroller.reset()
        },
    },
    computed: {
        ...mapState({
            sysMessageData:state => state.oanotice.sysMessageData
        })
    },
    watch: {
        sysMessageData:function(data){
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
                        this.systemArr = ArrObj ;
                }
            }
        }
    },
    components: {
       Scroller ,LoadMore,Divider
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
