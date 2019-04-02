<template>
    <div>
        <!-- scroll区域 -->
        <scroller lock-x scrollbarY ref="talentScroller" @on-scroll-bottom="loadMore" :height="height"
        v-model="status" use-pulldown @on-pulldown-loading="refresh">
            <div class="list">
                <!-- 简历列表 -->
                <div class="talent-list" v-if="listFilter.length > 0">
                    <!-- swiperout区域 -->
                    <swipeout @touchstart.native="handleStart" @touchmove.native="handleMove">
                        <group>
                            <swipeout-item class="vux-1px-b" ref="swipeoutItems" :sensitivity=20 @on-open='handleSwipeoutOpen(index)' @on-close='handleSwipeoutClose' v-for="(item,index) in listFilter" :key="+item.lie100_resume_id||+item.order_resume_id" transition-mode="follow">
                                <cell slot="content" :is-link=true :disabled=swipeoutIsOpen class="resume-list-item" align-items="flex-start" primary="content" @click.native="handleToDetail(item.lie100_resume_id||item.order_resume_id)">
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
                                    <swipeout-button @click.native="handleSubscribe(false, item.lie100_resume_id||item.order_resume_id)" :disabled="item.is_buy" type="primary" v-if="!item.is_buy">{{pageType==='wishList'?'移除意愿':item.is_collect?'已加入意愿':'加入意愿'}}</swipeout-button>
                                    <swipeout-button @click.native="handleSubscribe(true, item.lie100_resume_id||item.order_resume_id)" :disabled="item.is_buy" type="warn" :width="item.is_buy?160:80">{{item.is_buy?'已':''}}订阅</swipeout-button>
                                </div>
                            </swipeout-item>
                        </group>
                    </swipeout>
                </div>
                <!-- 无数据页面 -->
                <div class='wu-all wu-allB' v-else>
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>{{isLoading||onFetching?'加载中...':'暂无数据'}}</p>
                    </section>
                </div>
                <!-- 底部区域 -->
                <load-more tip="加载中" v-if="has_more"></load-more>
                <div class="no-more" v-if="!has_more&&currentPage!==1">已到底部</div>
            </div>
            <!-- 下拉组件 -->
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
import { Sticky, Tab, TabItem, Group, Cell, Icon, Tabbar, TabbarItem, Flexbox, FlexboxItem, XButton, PopupPicker, Scroller, Swipeout, SwipeoutItem, SwipeoutButton, Divider, LoadMore } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
let t   //控制点击频率


export default {
    name: 'resumeList',
    props: ['showHeight'],
    data() {
        return {
            has_more: false,        //是否还有更多可请求的简历数
            index: 0,               //列表选中项
            subscribeType: 0,       //1：加入意愿，2：移除意愿，3：订阅
            swipeoutIsOpen: false,  //列表是否有被滑动
            onFetching: false,      //是否请求数据中
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            height: this.showHeight?"-50":'',
            pageX: undefined,
            pageY: undefined,
            //获取后台数据所需参数
            user_id: this.$store.state.userInfo.user.userId,
            company_id: this.$store.state.userInfo.company.companyId,
            count: 10,              //每页列表数
            currentPage: 1,         //当前页
            search_key: '',         //搜索参数
            contact_status: 0,      //沟通状态
        }
    },
    async created() {
        console.log('###初始化###')
        this.$store.commit('UPDATE_LOADING', true)
        await this.CLEAR_TALENTLIST()
        await this.handleRequest()
        this.LIST()
        this.$store.commit('UPDATE_LOADING', false)
    },
    updated() {
        console.log('###更新###')
    },
    // activated() {
    //     //详情页操作后返回定位失效bug
    //     this.$nextTick(() => {
    //         this.$refs.talentScroller.reset()
    //     })
    // },
    methods: {
        ...mapActions({
            resume_resumeList: 'resume/resumeList',
            resume_wishList: 'resume/wishList',
            resume_myTalentList: 'resume/myTalentList',
            resume_addSubscribe: 'resume/addSubscribe',
            resume_removeSubscribe: 'resume/removeSubscribe',
            resume_buySubscribe: 'resume/buySubscribe',
        }),
        ...mapMutations({
            LIST: 'resume/LIST',
            CLEAR_TALENTLIST: 'resume/CLEAR_TALENTLIST',
            CORRECT_TALENTLIST: 'resume/CORRECT_TALENTLIST',
            CLEAR_SUBSCRIBE: 'resume/CLEAR_SUBSCRIBE',
            REDUCE_RESUME_BALANCE: 'resume/REDUCE_RESUME_BALANCE',
        }),
        //请求列表方法
        async handleRequest() {
            if (this.onFetching) {
                return
            }
            this.onFetching = true
            let obj = {
                user_id: this.user_id,
                company_id: this.company_id,
                count: this.count,
                page: this.currentPage,
                search_key: this.search_key
            }
            if (this.pageType === 'resumeList') {
                await this.resume_resumeList(obj)
            } else if (this.pageType === 'wishList') {
                await this.resume_wishList(obj)
            } else if (this.pageType === 'myTalentList') {
                // obj.contact_status = this.contact_status
                await this.resume_myTalentList(obj)
            }
            this.onFetching = false
        },
        //下拉刷新事件
        async refresh() {
            this.$store.commit('UPDATE_LOADING', true)
            this.handleSwipeoutOpen(-1)
            this.handleSwipeoutClose()
            this.currentPage = 1
            // this.CLEAR_TALENTLIST()
            await this.handleRequest()
            this.LIST(true)
            this.$nextTick(() => {
                if (this.$refs.talentScroller) {
                    this.$refs.talentScroller.donePulldown()
                    this.$refs.talentScroller.reset({
                        top: 0
                    })
                }
            })
            this.$store.commit('UPDATE_LOADING', false)
        },
        //上拉刷新事件
        async loadMore() {
            if (!this.has_more || this.onFetching) {
                return
            } else {
                this.$store.commit('UPDATE_LOADING', true)
                this.handleSwipeoutOpen(-1)
                this.handleSwipeoutClose()
                this.currentPage += 1
                await this.handleRequest()
                this.LIST()
                this.$store.commit('UPDATE_LOADING', false)
            }
        },
        //列表点击事件
        handleToDetail(key) {
            let len = this.listFilter.length
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
                //防止多次点击
                t = setTimeout(()=>{
                    this.$router.push({path: '/page/talentDetail/' + key})
                }, 500)
            }
        },
        //判断滑动方向
        handleStart(ev) {
            let touch = ev.touches ? ev.touches[0] : ev
            this.pageX = touch.pageX
            this.pageY = touch.pageY
        },
        handleMove(ev) {
            let touch = ev.touches ? ev.touches[0] : ev
            let X = Math.abs(touch.pageX-this.pageX)
            let Y = Math.abs(touch.pageY-this.pageY)
            if(X > Y) {
                this.$refs.talentScroller._xscroll.userConfig.lockY = true
            } else {
                this.$refs.talentScroller._xscroll.userConfig.lockY = false
            }
        },
        //列表滑动事件
        handleSwipeoutOpen(index) {
            this.swipeoutIsOpen = true
            let len = this.listFilter.length
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
        handleSubscribe(ifBuy, key) {
            let index = this.list.findIndex((v,i)=>(v.lie100_resume_id===key||v.order_resume_id===key))
            this.index = index
            if (this.list[index].is_buy) {
                return
            } else {
                let obj = {
                    user_id: this.user_id,
                    company_id: this.company_id,
                    lie100_resume_id: key
                }
                if (ifBuy) {
                    if (this.resume_balance > 0) {
                        this.$vux.confirm.show({
                            title: '人才订阅',
                            content: `本次人才订阅将消耗<br/>1条订阅条数，<br/>当前剩余人才订阅条数${this.resume_balance}条`,
                            onConfirm: ()=>{
                                this.CLEAR_SUBSCRIBE()
                                this.resume_buySubscribe(obj)
                                this.subscribeType = 3
                                return
                            }
                        })
                    } else {
                        this.$vux.alert.show({
                            title: '人才订阅',
                            content: '当前余额不足，请到小宝企业应用平台充值。网址：cloud.51lick.com',
                        })
                    }
                } else {
                    if (!this.list[index].is_collect) {
                        this.CLEAR_SUBSCRIBE()
                        this.resume_addSubscribe(obj)
                        this.subscribeType = 1
                        return
                    } else if (this.pageType==='wishList') {
                        this.$vux.confirm.show({
                            title: '提示',
                            content: `该人才数据将从您的意愿中移除，您可以再次从"人才中心"中通过搜索添加回来`,
                            onConfirm: ()=>{
                                this.CLEAR_SUBSCRIBE()
                                this.resume_removeSubscribe(obj)
                                this.subscribeType = 2
                                return
                            }
                        })
                    }
                }
            }
        },
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            pageType: state => state.resume.pageType,
            talentList: state => state.resume.talentListData,
            list: state => state.resume.list,
            resume_balance: state => state.resume.talentListData.data.items.resume_balance,
            subscribeInfo: state => state.resume.subscribeInfo,
            searchValue: state => state.resume.searchValue,
        }),
        //筛选已移除已订阅的意愿
        listFilter: function() {
            if (this.pageType === 'resumeList') {
                return this.list
            } else if (this.pageType === 'wishList') {
                return this.list.filter((v) => (v.is_collect&&!v.is_buy))
            } else if (this.pageType === 'myTalentList') {
                return this.list
            }
        },
    },
    watch: {
        '$route'(to, from) {
            if (to.name === "talentList") {
                if (this.pageType === 'resumeList') {
                    document.title = "人才中心"
                } else if (this.pageType === 'wishList') {
                    document.title = "意愿清单"
                } else if (this.pageType === 'myTalentList') {
                    document.title = "我的人才"
                }
            }
        },
        // showHeight(val) {
        //     this.height = val?"-50":''
        // },
        //监听页面类型请求列表数据
        pageType: async function(data) {
            this.search_key = ''
            this.swipeoutIsOpen = false
            this.currentPage = 1
            this.has_more = false
            this.$nextTick(()=>{
                this.$refs.talentScroller.reset({
                    top: 0
                })
            })
            this.$store.commit('UPDATE_LOADING', true)
            await this.CLEAR_TALENTLIST()
            await this.handleRequest()
            this.$store.commit('UPDATE_LOADING', false)
            this.LIST()
            if (data === 'resumeList') {
                document.title = "人才中心"
            } else if (data === 'wishList') {
                document.title = "意愿清单"
            } else if (data === 'myTalentList') {
                document.title = "我的人才"
            }
        },
        //监听请求的列表数据
        talentList: function(data) {
            if(data) {
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                } else {
                    this.has_more = data.data.has_more
                }
            }
        },
        //监听简历状态弹出操作结果，并改变当前页面具体list的简历状态
        subscribeInfo: function(data) {
            if(data && this.$route.name === 'talentList') {
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                    return
                } else if (this.subscribeType === 1 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '加入意愿成功',
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                    this.CORRECT_TALENTLIST({index: this.index, key: 'is_collect', value: true})
                    return
                } else if (this.subscribeType === 2 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '移除意愿成功',
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                    this.CORRECT_TALENTLIST({index: this.index, key: 'is_collect', value: false})
                    return
                } else if (this.subscribeType === 3 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '订阅成功',
                        type: 'text',
                         width:"18em"  
                    })
                    this.REDUCE_RESUME_BALANCE()
                    this.CORRECT_TALENTLIST({index: this.index, key: 'is_buy', value: true})
                    this.CORRECT_TALENTLIST({index: this.index, key: 'name', value: data.data.items.name})
                    return
                }
            }
        },
        //监听搜索value请求列表数据
        searchValue: async function(data) {
            if (this.search_key == data) {
                return
            }
            this.search_key = data
            this.swipeoutIsOpen = false
            this.currentPage = 1
            this.has_more = false
            this.$nextTick(()=>{
                this.$refs.talentScroller.reset({
                    top: 0
                })
            })
            this.$store.commit('UPDATE_LOADING', true)
            await this.CLEAR_TALENTLIST()
            await this.handleRequest()
            this.$store.commit('UPDATE_LOADING', false)
            this.LIST()
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
.talent-list .weui-cells,.talent-list .vux-no-group-title {
    margin-top: 0 !important;
    background: #fbf9fe !important;
}
</style>

<style lang="less" scoped>
@import './index.less';
</style>
