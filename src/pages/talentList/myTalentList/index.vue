<template>
    <div>
        <scroller lock-x scrollbarY ref="talentScroller" @on-scroll-bottom="loadMore" 
        use-pulldown :pulldown-config="downObj" @on-pulldown-loading="refresh" v-if="list.length > 0">
            <div class="list">
                <!-- 简历列表 -->
                <div class="talent-list">
                    <swipeout>
                        <group label-width="5em">
                            <swipeout-item class="vux-1px-b" ref="swipeoutItems" :sensitivity=20 @on-open='handleSwipeoutOpen(index)' @on-close='handleSwipeoutClose' v-for="(item,index) in list" :key="item.order_resume_id" transition-mode="follow">
                                <cell slot="content" :is-link=true :disabled=swipeoutIsOpen class="resume-list-item" align-items="flex-start" primary="content" @click.native="handleToDetail(index,item.order_resume_id)">
                                    <div slot="icon">
                                        <p :class="['left-name ', item.sex==0?'woman-color':'man-color']">{{item.name}}</p>
                                        <p class='left-age'>{{item.age?item.age:'--'}}岁</p>
                                    </div>
                                    <div class="right">
                                        <p><span>最近职位:</span>{{item.last_position?item.last_position:'--'}}</p>
                                        <p><span>毕业院校:</span>{{item.last_school?item.last_school:'--'}}</p>
                                        <p class="recent">
                                            <span>最近工作:</span>
                                            {{item.last_company_name?item.last_company_name:'--'}}
                                            <i>|</i>
                                            {{item.last_position?item.last_position:'--'}}
                                            <i>|</i>
                                            {{item.last_salary?item.last_salary:'--'}}
                                        </p>
                                    </div>
                                </cell>
                                <div slot="right-menu">
                                    <swipeout-button @click.native="handleSubscribe(false, index)" :disabled="item.is_collect" type="primary" v-if="!item.is_buy">{{item.is_collect?'已':''}}加入意愿</swipeout-button>
                                    <swipeout-button @click.native="handleSubscribe(true, index)" :disabled="item.is_buy" type="warn">{{item.is_buy?'已':''}}订阅</swipeout-button>
                                </div>
                            </swipeout-item>
                        </group>
                    </swipeout>
                </div>
                <load-more tip="loading" v-if="has_more"></load-more>
                <divider class="divider" v-if="!has_more">已到底部</divider>
            </div>
        </scroller>
        <p class='no-data' v-else>{{isLoading?'加载中...':'暂无数据'}}</p>
    </div>
</template>

<script>
import { Sticky, Tab, TabItem, Group, Cell, Icon, Tabbar, TabbarItem, Flexbox, FlexboxItem, XButton, PopupPicker, Scroller, Swipeout, SwipeoutItem, SwipeoutButton, Divider, LoadMore } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
let t

export default {
    name: 'myTalentList',
    data() {
        return {
            list: [],         //列表
            index: 0,         //列表选中项
            subscribeType: 1, //1：加入意愿，2：移除意愿，3：订阅
            swipeoutIsOpen: false,  //列表是否有被滑动
            onFetching: false,      //是否请求数据中
            downObj: {              //下拉配置
                downContent: '下拉加载更多',
                upContent: '释放后加载',
            },

            contact_status:0,
            user_id: this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            currentPage: 1,   //当前页
            count: 10,        //每页列表数
            maxPage: 500,     //最后一页
            search_key: '',
        }
    },
    created() {
        let obj = {
            user_id: this.user_id,
            company_id: this.company_id,
            contact_status:this.contact_status,
            count: this.count,
            page: this.currentPage,
            search_key: this.search_key
        }
        this.CLEAR_MYTALENTLIST()
        this.resume_myTalentList(obj)
    },
    activated () {
        this.$refs.scroller.reset()
    },
    methods: {
        ...mapActions({
            resume_myTalentList: 'resume/myTalentList',
        }),
        ...mapMutations({
            CLEAR_MYTALENTLIST: 'resume/CLEAR_MYTALENTLIST',
        }),
        async handleRequest() {
            this.onFetching = true
            let obj = {
                user_id: this.user_id,
                company_id: this.company_id,
                contact_status:this.contact_status,
                count: this.count,
                page: this.currentPage,
                search_key: this.search_key
            }
            this.resume_myTalentList(obj)
        },
        refresh() {
            this.list = []
            this.swipeoutIsOpen = false
            this.currentPage = 1
            this.handleRequest()
            // this.$nextTick(() => {
            //     this.$refs.talentScroller.donePulldown()
            //     this.$refs.talentScroller.reset({top: 0})
            // })
        },
        loadMore() {
            if (!this.has_more || this.onFetching) {
                return
            } else {
                this.currentPage += 1
                this.handleRequest()
            }
        },
        //列表点击事件
        handleToDetail(index,path) {
            let len = this.list.length
            for (let i = 0; i < len; i++) {
               if (this.$refs.swipeoutItems[i].isOpen) {
                   this.$refs.swipeoutItems[i].close()
                   this.handleSwipeoutClose()
                   return
               }
            }
            clearTimeout(t)
            if (this.swipeoutIsOpen) {
                return
            } else {
                t = setTimeout(()=>{
                    this.$router.push({path: '/page/talentDetail/' + path})
                },500)
            }
        },
        //列表滑动事件
        handleSwipeoutOpen(index) {
            this.swipeoutIsOpen = true
            let len = this.list.length
            for (let i = 0; i < len; i++) {
                if (i===index) {
                    continue
                } else {
                    this.$refs.swipeoutItems[i].close()
                }
            }
        },
        handleSwipeoutClose() {
            this.swipeoutIsOpen = false
        },
        //意愿订阅
        handleSubscribe(ifBuy, index) {
            this.index = index
            let obj = {
                user_id: this.user_id,
                company_id: this.company_id,
                contact_status:this.contact_status,
                count: this.count,
                page: this.currentPage
            }
            if (this.list[index].is_buy) {
                return
            } else {
                let lid = this.list[index].order_resume_id
                if (ifBuy) {
                    this.$vux.confirm.show({
                        title: '人才订阅',
                        content: `本次人才订阅将消耗1条订阅条数，<br/>当前剩余人才订阅条数${this.resume_balance}条`,
                        onConfirm: ()=>{
                            if (this.resume_balance > 0) {
                                this.CLEAR_SUBSCRIBE()
                                this.resume_buySubscribe(obj)
                                this.subscribeType = 3
                            } else {
                                this.$vux.toast.show({
                                    text: '请充值',
                                    type: 'text',
                                    position: 'top',
                                     width:"18em"  
                                })
                            }
                        }
                    })
                } else {
                    if(this.list[index].is_collect) {
                        this.$vux.confirm.show({
                            title: '提示',
                            content: `该人才数据将从您的意愿中移除，<br/>您可以再次从"人才中心"中通过搜索添加回来`,
                            onConfirm: ()=>{
                                this.CLEAR_SUBSCRIBE()
                                this.resume_removeSubscribe(obj)
                                this.subscribeType = 2
                            }
                        })
                    }
                }
            }
        },
        //翻页
        handlePage(pageNum) {
            let page
            if (pageNum instanceof Array) {
                page = parseInt(pageNum[0])
            } else {
                page = +this.currentPage + pageNum
            }
            if (page < 1 || page > this.maxPage || page === this.currentPage) {
                return
            }
            this.currentPage = page
            let obj = {
                user_id: this.user_id,
                company_id: this.company_id,
                contact_status:this.contact_status,
                count: this.count,
                page: this.currentPage
            }
            this.resume_myTalentList(obj)
            this.$nextTick(() => {
                this.$refs.scroller.reset({
                    top: 0
                }, 1000)
            })
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            myTalentList: state => state.resume.myTalentListData,
            searchValue: state => state.resume.searchValue,
        }),
        //分页内容
        pageValue: function() {
            return [this.currentPage+' / '+this.maxPage]
        },
        //获取分页列表
        pageList: function() {
            let arr=[]
            let len = Math.ceil(this.num_items/this.count)
            if (len>500) {
                len = 500
            }
            this.maxPage = len
            for (let i=0; i<len; i++) {
                arr[i]=i+1
            }
            return [arr]
        },
        //筛选已移除订阅的意愿
        listFilter: function() {
            return this.list.filter((v) => (v.is_buy))
        },
    },
    watch: {
        myTalentList: function(data) {
            if(data) {
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                } else if (data.data.items) {
                    this.list = data.data.items.list
                    localStorage.setItem("myTalentListData",JSON.stringify(data))
                }
            }
        },
        subscribeInfo: function(data) {
            if(data) {
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                } else if (this.subscribeType === 1 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '加入意愿成功',
                        type: 'text',
                        position: 'top'
                    })
                    this.list[this.index].is_collect = true
                } else if (this.subscribeType === 3 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '订阅成功',
                        type: 'text',
                        position: 'top'
                    })
                    this.list[this.index].is_buy = true
                }
            }
        },
        searchValue: function(data) {
            if (this.search_key == data) {
                return
            }
            this.search_key = data
            this.currentPage = 1
            let obj = {
                user_id: this.user_id,
                company_id: this.company_id,
                contact_status:this.contact_status,
                count: this.count,
                page: this.currentPage,
                search_key: this.search_key
            }
            this.resume_myTalentList(obj)
            this.$nextTick(() => {
                this.$refs.scroller.reset({
                    top: 0
                }, 1000)
            })
        },
    },
    components: {
        Sticky,
        Tab,
        TabItem,
        Group,
        Cell,
        Icon,
        Tabbar,
        TabbarItem,
        Flexbox,
        FlexboxItem,
        XButton,
        PopupPicker,
        Scroller,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        Divider,
        LoadMore
    },
}
</script>

<style lang="less">
// 分页箭头图标方向
.page>.weui-cells.vux-no-group-title .vux-cell-box .weui-cell .weui-cell__ft {
    transform: rotate(90deg) !important;
    padding-right: 8px;
}
</style>

<style lang="less" scoped>
@import '../resumeList/talentList.less';
</style>
