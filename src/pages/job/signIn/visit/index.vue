<template>
    <div class="visit" id="visit">
        <div  v-if="visitList.length==0" class="wu-all">
            <section>
                <div><img src="~@/images/wu-icon1.png"></div>
                <p>暂无拜访签到数据</p>
            </section>
        </div>
        <div class="visit-content" v-else>
            <scroller 
            lock-x  
                scrollbarY 
                @on-scroll-bottom="loadMore" 
                @on-pulldown-loading="refresh" 
                v-model="status" 
                height="-36" 
                use-pulldown 
                ref="scroller" 
                :scroll-bottom-offst="0"
                :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
                >
                
                <div>
                    <ul class="box2" style="overflow:hidden">
                        <li class="list-box" v-for="(item,index) in visitList" :key="index">
                            <group>
                                <div class="user-msg vux-1px-b">
                                    <img :src="headLogo" alt="">
                                    <p>{{userName}}</p>
                                </div>
                                <div class="visit-msg">
                                    <img :src="'http://api.map.baidu.com/staticimage?center=&width=400&height=300&zoom=15&markers='+item.x+','+item.y" alt="">
                                    <div>
                                        <p>{{item.name}}</p>
                                        <p class="address-detail">{{item.addr}}</p>
                                    </div>
                                </div>
                            </group>
                        </li>
                    </ul>
                <load-more tip="加载中" v-if="loadFlag"></load-more>
                <!-- <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div> -->
                </div>
            </scroller>
        </div>
        <div class="add-btn" @click="toVisitDetail">
            <x-button type="primary">新增</x-button>
        </div>
    </div>
</template>

<script>
import {  Group, Scroller ,XButton,  Divider,LoadMore ,Spinner  } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'

export default {
    name: 'visit',
    data() {
        return {
            loadFlag:false,
            onFetching:false,
            userName:this.$store.state.userInfo.user.trueName,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            headLogo:this.$store.state.userInfo.user.headLogo,
            page:1,
            count:10,
            status: {
                pulldownStatus: 'default'
            },
            pullupEnabled: true,
            pulldown:false,
            visitList: [],
            isSelect:false,
            pulldown:false,
        }
    },
    created() {
        this.loadingHand(true)
    },
    mounted() {
        
        this.initListData()
    },
    methods: {
        ...mapActions({
            QueryVisitList:'oasign/QueryVisitList',
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
            Isrefresh:'oasign/ISREFRESH'
        }),
        initListData(){
            let obj = {
                userId:this.user_id,
                companyId:this.company_id,
                page:this.page,
                count:this.count
            }
            this.QueryVisitList(obj)
        },
        loadMore () {
            // console.log('-----')
            if(this.onFetching){
                
            }else{
                this.onFetching = true
                let that = this
                this.page++
                let obj = {
                    userId:this.user_id,
                    companyId:this.company_id,
                    page:this.page,
                    count:this.count
                }
                this.QueryVisitList(obj)
            }
        },
        refresh () {
            let that = this
            // this.loadMore = false
            this.loadingHand(true)
            if(this.status.pulldownStatus != 'default'){
                let obj = {
                    userId:this.user_id,
                    companyId:this.company_id,
                    page:1,
                    count:this.count
                }
                this.QueryVisitList(obj)
                setTimeout(function(){
                that.$refs.scroller.donePulldown()
                    that.loadingHand(false)
                },500)
                this.onFetching = false
            }
        },
        toVisitDetail(){
            this.$router.push('visitDetail')
        }
    },
    computed: {
        ...mapState({
            GPSListData:state => state.oasign.GPSListData,
            isRefresh:state => state.oasign.isRefresh,
            isLoading:state => state.isLoading
        })
    },
    watch: {
        GPSListData:function(newVal,oldVal){
            if(Object.keys(newVal).length>0){
                this.loadingHand(false)
                if(newVal.data.alert_msg){
                    this.$vux.toast.show({
                        text: newVal.data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
                }else{
                    console.log(this.status.pulldownStatus,this.isRefresh,'=======nihao========')
                    if(this.status.pulldownStatus=='loading'||this.isRefresh){
                        console.log(newVal,'--------------===')
                        this.visitList = newVal.data.items
                        this.Isrefresh(false)
                    }else{
                        this.visitList = this.visitList.concat(newVal.data.items)
                    }
                    this.loadFlag = newVal.data.has_more
                    this.onFetching = !newVal.data.has_more
                }
            }
            
        },
        visitList:function(value,older){
        },
    },
    // beforeRouteLeave(to, from, next) {
    //     console.log(to,from,'-------------')
    //      // 离开时缓存
    //     if(to.name=='wodkChild'){
    //         from.meta.keepAlive = false; // 让 A 不缓存，即刷新
    //         to.meta.keepAlive = false;
    //     }else if(from.name=='visitDetail'){
    //         from.meta.keepAlive = true;
    //     }
    //     next();
    // },
    // beforeRouteEnter (to, from, next) {
    //      console.log(to,from)
    //     // 进入时调用
    //     //加密
    //     if(from.name=='VisitDetail'){
    //         next((vm)=>{ 
    //             //返回的数据交互
    //             if(vm.isRefresh){
    //                 let obj = {
    //                 userId:vm.user_id,
    //                 companyId:vm.company_id,
    //                 page:1,
    //                 count:vm.count
    //                 }

    //                 vm.QueryVisitList(obj)
    //                 vm.$refs.scroller.reset({
    //                     top:0
    //                 })
                    
    //             }  
    //         })
    //     }else{
    //         next()
    //     }
    // },
    components: {
        Group,
        Scroller,
        LoadMore,
        Divider, 
        XButton,
        Spinner,
    },
}
</script>
<style lang="less">
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
