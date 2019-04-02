<template>
    <div style="width:100%;height:100%;overflow:hidden">
        <group-title v-if="initData.length>0" >以下推荐信息均已通过小宝客服审核</group-title>
        <!-- <scroller
          lock-x  
          scrollbarY 
          @on-scroll-bottom="loadMore" 
          @on-pulldown-loading="refresh" 
          v-model="status"  
          use-pulldown  
          ref="myscroller" 
          height="-44"
          :scroll-bottom-offst="0"
          @on-scroll="onScroller"
          :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
          > -->
          <scroller
            lock-x  
            scrollbarY 
            @on-scroll-bottom="loadMore" 
            @on-scroll="OnScroll" 
            @on-pulldown-loading="refresh" 
            v-model="status" 
            use-pulldown  
            ref="scroller" 
            height="-44"
            :scroll-bottom-offst="0">
            <div class='wu-all wu-allB' v-if="initData.length==0" >
                <section>
                    <div><img src="~@/images/wu-icon1.png"></div>
                    <p>暂无推荐采纳内容</p>
                </section>
            </div>
            <div class="tool-list" v-else>
                <ul>
                    <li >
                        <article v-for="(item,index) in initData" :key='index'>
                            <section class="vux-1px-b">
                                <header>
                                    <h5>{{item.dealer_name}}</h5>
                                </header>
                                <p class="it-time">联系人：{{item.dealer_linkman}}<br/>推荐人：{{item.userInfo.trueName}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.userInfo.mobile}}</p>
                            </section>
                            <footer class="footer-btn ">
                                <p>{{item.state_name}}</p>
                                <div v-if="item.state==1" class="btn-box">
                                    <x-button mini type="primary" plain  @click.native.stop="Recommended(item.tub_dealer_id,2)">不采纳</x-button>
                                    <x-button mini type="primary" plain  @click.native.stop="Recommended(item.tub_dealer_id,1,index)">采纳</x-button>
                                </div>
                            </footer>
                        </article>
                    </li>
                </ul>
                <load-more tip="加载中" v-if="loadFlag" ></load-more>
                <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
            </div>
            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉加载更多</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放后加载</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>
        </scroller>
    </div>
</template>

<script>
import { Scroller , XButton ,GroupTitle,Confirm,LoadMore} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'accept',
    data() {
        return {
            isLabel:false,
            // user_id:this.$store.state.userInfo.user.userId,
            // company_id:this.$store.state.userInfo.company.companyId,
            // page:1,
            // count:10,
            // loadFlag:false ,//加载图标 要不 要显示
            // onFetching:true,//要不要滚动加载
            // status: {
            //     pulldownStatus: 'default',
            // },
            pulldown:false,
            page:1,
            count:10,
            companyId:this.$store.state.userInfo.company.companyId,
            userId:this.$store.state.userInfo.user.userId,  
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:false,//要不要滚动加载
            onload:false,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            pulldown:false,
            alertMsg:'加载中...',//第一次

            initData:[],
            labelData:[],
            task_id:0,
            isRefresh:false,
        }
    },
    created() {
        this.initData = [];
        let task_id = this.$route.query.task_id;
        this.task_id=task_id;
        let obj={
          'task_id':task_id,
          page:1,
          count:10
        };

        this.recommend_getRecommendServiceAuditPassLists(obj);

    },

    methods: {
        ...mapActions({
            recommend_getRecommendServiceAuditPassLists:'recommend/getRecommendServiceAuditPassLists',
        }),
        //下拉 上拉
        loadMore () {
            if (!this.onFetching) {
                this.onFetching = true;
                this.pulldown=false;
                this.page++;
                let page = this.page+1;
                let obj = {
                task_id:this.task_id,
                page: page,
                count: this.count,
                };

                this.recommend_getRecommendServiceAuditPassLists(obj);
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.onFetching = false
                this.pulldown=true;
                this.page = 1;
                let obj = {
                    task_id:this.task_id,
                    page: 1,
                    count: this.count,
                };

                this.recommend_getRecommendServiceAuditPassLists(obj);
            }
        },
        //采纳与不采纳
        Recommended(tub_id,status,index){
           let obj={
               'tub_id':tub_id,
               'status':status,
               'task_id':this.task_id,
               'index':this.index,
            };
            this.$router.push({path:"isAccept",query:obj})
        },
        OnScroll(){
            this.$refs.scroller.reset()
        }
    },
    computed: {
        ...mapState({
            recommendDealerData:state => state.recommend.recommendDealerData,
        }),

    },

    watch:{
      //推荐采纳任务列表
      recommendDealerData(data) {
        if(data.alert_msg){
          this.$vux.toast.show({
            text: data.alert_msg,
            type: 'text',
            position: 'top',
            width:'20em'
          })
        }else{
        //    let _data=data.items;
        //    if(this.isRefresh){
        //         this.initData = _data
        //         this.isRefresh=false
        //     }else{
        //         let old_data=this.initData;
        //         this.initData=old_data.concat(_data);
        //     }
        //     this.loadFlag=data.has_more;
        //     this.onFetching=!data.has_more;
            if(this.pulldown){
                // this.ArrData= data.items;
                this.initData = data.items
                this.status.pulldownStatus = 'default'
                this.loadFlag=true;
            }else{
                this.initData= this.initData.concat(data.items) ;                                            
            }  
            if(data.has_more){
                this.onFetching = false ;
                this.loadFlag=true;
            }else{
                this.loadFlag=false
                this.onFetching = true 
            }
        }
      }
    },

    components: {
        Scroller,
        XButton,
        GroupTitle,
        Confirm ,
        LoadMore,

    },
}
</script>
<style lang="less" scoped>
 @import '../../../../../css/toolList.less';
 .accept-list ul{
    padding-top:@px5;
}
.accept-list{
   article{
        section{
            .it-time{
                margin-bottom: 0;
            }
        }   
    }
    
}

</style>
