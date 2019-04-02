<template>
    <div>
        <scroller lock-x ref="scroller" v-if="listFilter.length > 0">
            <div class="list">
                <!-- 简历列表 -->
                <div class="talent-list">
                    <swipeout>
                        <group>
                            <swipeout-item class="vux-1px-b" ref="swipeoutItems" :sensitivity=20 @on-open='handleSwipeoutOpen(index)' @on-close='handleSwipeoutClose' v-for="(item,index) in listFilter" :key="item.lie100_resume_id" transition-mode="follow">
                                <cell slot="content" :is-link=true :disabled=swipeoutIsOpen class="resume-list-item" align-items="flex-start" primary="content" @click.native="handleToDetail(index,item.lie100_resume_id)">
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
                                    <swipeout-button @click.native="handleSubscribe(false, index)" type="primary">移除意愿</swipeout-button>
                                    <swipeout-button @click.native="handleSubscribe(true, index)" type="warn">订阅</swipeout-button>
                                </div>
                            </swipeout-item>
                        </group>
                    </swipeout>
                </div>
                <!-- 分页 -->
                <tabbar class="bottom-tab" v-if="maxPage>1">
                    <tabbar-item class="vux-1px-r">
                        <span slot="label" @click="handlePage(-1)">
                            上一页
                        </span>
                    </tabbar-item>
                    <tabbar-item class="vux-1px-r">
                        <span slot="label" class="page">
                            <popup-picker value-text-align="center" :data="pageList" :value="pageValue" @on-change="handlePage"></popup-picker>
                        </span>
                    </tabbar-item>
                    <tabbar-item>
                        <span slot="label" @click="handlePage(1)">
                            下一页
                        </span>
                    </tabbar-item>
                </tabbar>
                <divider class="divider" v-else>已到底部</divider>
            </div>
        </scroller>
        <p class='no-data' v-else>{{isLoading?'加载中...':'暂无数据'}}</p>
    </div>
</template>

<script>
import { Sticky, Tab, TabItem, Group, Cell, Icon, Tabbar, TabbarItem, Flexbox, FlexboxItem, XButton, PopupPicker, Scroller, Swipeout, SwipeoutItem, SwipeoutButton, Divider } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
let t

export default {
    name: 'wishList',
    data() {
        return {
            list: [],         //列表
            index: 0,         //列表选中项
            subscribeType: 1, //1：加入意愿，2：移除意愿，3：订阅
            swipeoutIsOpen: false,  //列表是否有被滑动

            user_id: this.$store.state.userInfo.user.userId,
            company_id: this.$store.state.userInfo.company.companyId,
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
            count: this.count,
            page: this.currentPage,
            search_key: this.search_key
        }
        this.CLEAR_WISHLIST()
        this.resume_wishList(obj)
    },
    activated () {
        if (this.$refs.scroller) {
            this.$refs.scroller.reset()
        }
    },
    methods: {
        ...mapActions({
            resume_wishList: 'resume/wishList',
            resume_removeSubscribe: 'resume/removeSubscribe',
            resume_buySubscribe: 'resume/buySubscribe',
        }),
        ...mapMutations({
            CLEAR_WISHLIST: 'resume/CLEAR_WISHLIST',
            CLEAR_SUBSCRIBE: 'resume/CLEAR_SUBSCRIBE',
        }),
        //列表点击事件
        handleToDetail(index,path) {
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
                t = setTimeout(()=>{
                    this.$router.push({path: '/page/talentDetail/' + path})
                },500)
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
        handleSubscribe(ifBuy, index) {
            this.index = index
            if (this.list[index].is_buy) {
                return
            } else {
                let lid = this.list[index].lie100_resume_id
                let obj = {
                    user_id: this.user_id,
                    company_id: this.company_id,
                    lie100_resume_id: lid
                }
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
                count: this.count,
                page: this.currentPage,
                search_key: this.search_key
            }
            this.resume_wishList(obj)
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
            wishList: state => state.resume.wishListData,
            num_items: state => state.resume.wishListData.data.num_items,
            resume_balance: state => state.resume.wishListData.data.items.resume_balance,
            subscribeInfo: state => state.resume.subscribeInfo,
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
            return this.list.filter((v) => (v.is_collect&&!v.is_buy))
        },
    },
    watch: {
        //简历列表
        wishList: function(data) {
            if(data) {
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                } else if (data.data.items) {
                    this.list = data.data.items.list
                    localStorage.setItem("wishListData",JSON.stringify(data))
                }
            }
        },
        subscribeInfo: function(data) {
            if(data) {
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                } else if (this.subscribeType === 2 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '移除意愿成功',
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                    this.list[this.index].is_collect = false
                } else if (this.subscribeType === 3 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '订阅成功',
                        type: 'text',
                        position: 'top',
                         width:"18em"  
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
                count: this.count,
                page: this.currentPage,
                search_key: this.search_key
            }
            this.resume_wishList(obj)
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
        Divider
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
