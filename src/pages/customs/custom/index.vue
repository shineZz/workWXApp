<template>
    <div class="custom">
        <!-- 搜索框 -->
        <div @click="searchHand">
            <search ref="search" :auto-fixed="false" placeholder="请输入姓名、电话、邮箱、公司名称">
                <div slot="right">
                    <router-link :to="{name: 'myCustom', query: {highSeas: true}}"><img src="@/images/custom/customer/highSeas.png" class="search-right"></router-link>
                    <router-link :to="{name: 'appendCustom'}"><img src="@/images/custom/customer/add.png" class="search-right"></router-link>
                    <!-- <img slot="right" src="@/images/custom/customer/add.png" class="search-right" @click="$router.push({name: 'appendCustom'})"> -->
                </div>
            </search>
        </div>
        <scroller lock-x scrollbarY ref="scroller" @on-scroll-bottom="loadMore" :height="height"
        v-model="status" use-pulldown @on-pulldown-loading="refresh">
            <div>
                <!-- 导航入口 -->
                <group class="title">
                    <!-- <cell title="新客户推荐" link="">
                        <img slot="icon" src="@/images/personal/mine_main_introduce@2x.png" class="img-kind">
                    </cell> -->
                    <cell title="我的客户" :link="{name: 'myCustom'}">
                        <img slot="icon" src="@/images/custom/customer/mycustom.png" class="img-kind">
                        <badge v-if="dot.my_count===1"></badge>
                    </cell>
                    <cell title="共享给我的客户" :link="{name: 'myCustom', query: {share: true}}">
                        <img slot="icon" src="@/images/custom/customer/share.png" class="img-kind">
                        <badge v-if="dot.share_count===1"></badge>
                    </cell>
                    <cell title="待完善信息客户" :link="{name: 'searchResult', query: {ifWrong: true}}">
                        <img slot="icon" src="@/images/custom/customer/wrong.png" class="img-kind">
                        <badge v-if="dot.unfinish_count===1"></badge>
                    </cell>
                </group>
                <!-- 最近联系人 -->
                <group title="最近联系人">
                    <listA :listObj="listObj" v-if="listObj.listData.length>0"/>
                    <!-- 无数据页面 -->
                    <div class='wu-all' v-else>
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>{{isLoading?alert_msg:'暂无最近联系人'}}</p>
                        </section>
                    </div>
                </group>
                <!-- 底部区域 -->
                <load-more tip="加载中" v-if="has_more"></load-more>
                <div class="no-more" v-if="!has_more&&page!==1">已到底部</div>
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
import { Search, Group, Cell, Scroller, LoadMore, Badge } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy } from '@/util'
import listA from '@/components/listA'

export default {
    name: 'custom',
    data() {
        return {
            // 小红点
            dot: {
                my_count: 0,
                share_count: 0,
                unfinish_count: 0,
            },
            listObj:{
                listData:[],   
            },
            alert_msg: '加载中...',
            has_more: false,
            // scroller相关
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            height: "-97",
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            page: 1,
            count: 10,
            parent: false,
        }
    },
    async created() {
        let obj1 = {
            company_id: this.companyId,
            user_id: this.userId,
        }
        let obj2 = {
            company_id: this.companyId,
            user_id: this.userId,
            page: this.page,
            count: this.count,
        }

        // 货币
        if (!localStorage.getItem('currency')) {
            this.user_getDict({typeId: '6'})
        }
        // 规模
        if (!localStorage.getItem('scale')) {
            this.customerscale_getCustomerScale(obj1)
        }
        // 国际区号
        if (!localStorage.getItem('mobileCode')) {
            this.areacode_findAllAreaCodeByParentCode()
        }
        // 分期回款期数列表
        if (!localStorage.getItem('payInstallList')) {
            this.customerrecpay_installmentNumList(obj1)
        }
        
        let s = this.customerstatistic_getStatisticDetails(obj1)
        let c = this.customer_customersLists(obj2)
        this.UPDATE_LOADING(true)
        await s
        await c
        this.UPDATE_LOADING(false)
    },
    mounted() {
        document.activeElement.blur()
    },
    methods: {
        ...mapActions({
            user_getDict: 'user/getDict',
            customerscale_getCustomerScale: 'customerscale/getCustomerScale',
            areacode_findAllAreaCodeByParentCode: 'areacode/findAllAreaCodeByParentCode',
            customerrecpay_installmentNumList: 'customerrecpay/installmentNumList',
            customerstatistic_getStatisticDetails: 'customerstatistic/getStatisticDetails',
            customer_customersLists: 'customer/customersLists',
            ucarea_getAreaList: 'ucarea/getAreaList',
        }),
        ...mapMutations({
            UPDATE_LOADING: 'UPDATE_LOADING',
        }),
        searchHand(e) {
            if (e.target.nodeName !== 'IMG') {
                this.$router.push({name: 'searchPage'})
                return false
            }
        },
        async refresh() {
            this.page = 1
            let obj1 = {
                company_id: this.companyId,
                user_id: this.userId,
            }
            let obj2 = {
                company_id: this.companyId,
                user_id: this.userId,
                page: this.page,
                count: this.count,
            }
            let s = this.customerstatistic_getStatisticDetails(obj1)
            let c = this.customer_customersLists(obj2)
            this.UPDATE_LOADING(true)
            await s
            await c
            this.UPDATE_LOADING(false)
            this.$nextTick(() => {
                this.$refs.scroller.donePulldown()
            })
        },
        async loadMore() {
            if (!this.has_more || this.isLoading) {
                return
            } else {
                this.page += 1
                let obj = {
                    company_id: this.companyId,
                    user_id: this.userId,
                    page: this.page,
                    count: this.count,
                }
                this.UPDATE_LOADING(true)
                await this.customer_customersLists(obj)
                this.UPDATE_LOADING(false)
            }
        },
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            getDict: state => state.user.getDict,
            getScale: state => state.customerscale.getScale,
            areaCodeByparent: state => state.areacode.areaCodeByparent,
            payInstallList: state => state.customerrecpay.payInstallList,
            statisticDetails: state => state.customerstatistic.statisticDetails,
            customersLists: state => state.customer.customersLists,
            addCall: state => state.customeractionrecord.addCall,
        })
    },
    watch: {
        getDict(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let arr = data.items.map(item => {
                        return {
                            key: item.dictCode,
                            value: item.dictName,
                            inlineDesc: item.dictCode,
                        }
                    })
                    localStorage.setItem('currency', JSON.stringify(arr))
                }
            }
        },
        getScale(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let arr = data.items.map(item=>{
                        return {
                            name: item.name,
                            value: item.val.toString()
                        }
                    })
                    localStorage.setItem('scale', JSON.stringify(arr))
                }
            }
        },
        areaCodeByparent(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let arr = data.items.map(v => v.firstLetter)
                    arr = [...new Set(arr)]
                    arr = arr.map(v => [v])
                    let i = -1
                    let first = ''
                    data.items.forEach(v => {
                        if (v.firstLetter !== first) {
                            i++
                            first = v.firstLetter
                            arr[i].push({
                                key: v.code,
                                value: v.code,
                                name: v.name,
                                flag: false,
                            })
                        } else {
                            arr[i].push({
                                key: v.code,
                                value: v.code,
                                name: v.name,
                                flag: false,
                            })
                        }
                    })
                    if (this.parent) {
                        localStorage.setItem('telCode', JSON.stringify(arr))
                        this.parent = false
                    } else {
                        localStorage.setItem('mobileCode', JSON.stringify(arr))
                        // 座机号
                        if (!localStorage.getItem('telCode')) {
                            this.parent = true
                            this.areacode_findAllAreaCodeByParentCode({parent_code: 86})
                        }
                    }
                }
            }
        },
        payInstallList(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let arr = data.items.map(v=>{
                        return {
                            name: v.name,
                            value: v.val.toString(),
                        }
                    }).reverse()
                    localStorage.setItem('payInstallList', JSON.stringify(arr))
                }
            }
        },
        statisticDetails(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.dot = data.items
                }
            }
        },
        customersLists(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.has_more = data.has_more
                    let arr = data.items.map(item => {
                        let obj = {
                            name: item.customer_name,
                            img: item.logo_big,
                            work: item.customer_company_name,
                            label: item.label_xref,
                            id: item.customer_id,
                            tel: '+' + item.mobile_code + ' ' + item.mobile,
                            state: item.stage_name,
                            time: item.action_note,
                        }
                        obj.icon = {
                            iconType: 2,
                        }
                        obj.url = {
                            link: 'customPage',
                            query: {id: item.customer_id, logo: item.logo_big, name: item.customer_name, company: item.customer_company_name,
                            mobile: '+' + item.mobile_code + ' ' + item.mobile},
                        }
                        if (item.user_id!=this.userId) {
                            obj.url.query.share = true
                        }
                        obj.logoNameFlag = false
                        obj.color = parseInt(Math.random()*3+1)
                        return obj
                    })
                    if (this.page == 1) {
                        this.listObj.listData = arr
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                    }
                    this.$nextTick(()=>{
                        this.$refs.scroller.reset()
                    })
                }
            }
        },
        addCall(data) {
            if (data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.refresh()
                    this.$nextTick(() => {
                        this.$refs.scroller.reset({
                            top: 0
                        })
                    })
                }
            }
        },
    },
    components: {
        Search, Group, Cell, Scroller, LoadMore, Badge, listA
    },
}
</script>

<style lang="less">
.custom .weui-search-bar__box {
    padding-right: 0;
}

.custom .weui-search-bar__box {
    padding-bottom: 29px;

    .weui-search-bar__input {
        display: none;
    }
}

.custom .weui-cells,.custom .vux-no-group-title {
    margin-top: 0 !important;
    background: #fff;
}

.custom .title .weui-cell:before {
    left: 44px;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
