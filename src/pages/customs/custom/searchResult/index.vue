<template>
    <div class="searchResult">
        <!-- 待完善客户 -->
        <group :title="`共${num_items}位客户`" v-show="ifWrong&&num_items"></group>
        <group title="客户" v-if="!ifContract&&!ifWrong&&ifCustom"></group>
        <group title="同事" v-if="!ifContract&&!ifWrong&&!ifCustom"></group>
        <scroller lock-x scrollbarY ref="scroller" @on-scroll-bottom="loadMore" :height="height"
        v-model="status" use-pulldown @on-pulldown-loading="refresh">
            <div>
                <div>
                    <listA :listObj="listObj" v-if="listObj.listData.length>0" />
                    <!-- 无数据页面 -->
                    <div class='wu-all wu-allB' v-else>
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>{{isLoading?alert_msg:'暂无数据'}}</p>
                        </section>
                    </div>
                </div>
                <!-- 底部区域 -->
                <load-more tip="加载中" v-show="has_more"></load-more>
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
        <!-- 合同按钮 -->
        <flexbox v-if="ifContract">
            <flexbox-item class="flex-item">
                <x-button type="primary" :link="{name: 'customNewContract', query: {contract: true, customerId, name: nameValue, company: companyValue}}">添加合同</x-button>
            </flexbox-item>
            <flexbox-item class="flex-item">
                <x-button type="primary" @click.native="backHand" :disabled="!ifCheck">确定</x-button>
            </flexbox-item>
        </flexbox>
    </div>
</template>

<script>
import { Group, Scroller, LoadMore, Flexbox, FlexboxItem, XButton } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy } from '@/util'
import listA from '@/components/listA'

export default {
    name: 'searchResult',
    data() {
        return {
            customerId: 0,
            ifWrong: false,     //是否待完善客户
            ifCustom: true,     //客户还是同事
            ifContract: false,  //是否合同
            ifCheck: false,     //是否选中简历
            has_more: false,
            alert_msg: '加载中...',
            num_items: 0,
            nameValue: '',
            companyValue: '',
            listObj:{
                listData:[],
                // radioData:[],
                // radioFlag:true,
            }, 
            // scroller相关
            height: '-39',
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            // onFetching: false,      //是否请求数据中
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            page: 1,
            count: 15,
            type: '',
            keyword: '',
        }
    },
    created() {
        sessionStorage.removeItem('contractId')
        this.ifContract = this.$route.query.ifContract || false
        this.ifWrong = this.$route.query.ifWrong || false
        this.ifCustom = this.$route.query.ifCustom || false
        this.customerId = this.$route.query.customerId || ''
        this.id = this.$route.query.id || ''
        this.nameValue = this.$route.query.name || ''
        this.companyValue = this.$route.query.company || ''
        this.keyword = this.$route.query.keyword || ''

        let obj = {
            company_id: this.companyId,
            user_id: this.userId,
            keywords: this.keyword,
            page: this.page,
            count: this.count,
        }
        this.handleRequest(obj)
    },
    mounted() {
        if (this.ifCustom) {
            document.title = "更多客户"
        } else {
            if (this.ifContract) {
                document.activeElement.blur()
                document.title = "选择合同"
                this.height = '-36'
            } else if (this.ifWrong) {
                document.title = "待完善客户"
            } else {
                document.title = "更多同事"
            }
        }
    },
    methods: {
        ...mapActions({
            customer_customerWorkerList: 'customer/customerWorkerList',
            customer_unPerfectCustomerLists: 'customer/unPerfectCustomerLists',
            customercontract_contractList: 'customercontract/contractList',
        }),
        handleRequest(obj) {
            if (this.isLoading) {
                return
            }
            if (this.ifCustom) {
                obj.type = this.type = '1'
                this.customer_customerWorkerList(obj)
            } else {
                if (this.ifContract) {
                    obj.customer_id = this.customerId
                    this.customercontract_contractList(obj)
                } else if (this.ifWrong) {
                    this.customer_unPerfectCustomerLists(obj)
                } else {
                    obj.type = this.type = '2'
                    this.customer_customerWorkerList(obj)
                }
            }
        },
        refresh() {
            this.page = 1
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                keywords: this.keyword,
                page: this.page,
                count: this.count,
            }
            this.handleRequest(obj)
            this.$nextTick(() => {
                this.$refs.scroller.donePulldown()
            })
        },
        loadMore() {
            if (!this.has_more || this.isLoading) {
                return
            } else {
                this.page += 1
                let obj = {
                    company_id: this.companyId,
                    user_id: this.userId,
                    keywords: this.keyword,
                    page: this.page,
                    count: this.count,
                }
                this.handleRequest(obj)
            }
        },
        // 选择合同返回
        backHand() {
            let index = this.listObj.listData.findIndex(v=>v.icon.iconFlag)
            sessionStorage.setItem('contractId', JSON.stringify(this.listObj.listData[index]))
            this.$router.back()
        },
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            workList: state => state.customer.workList,
            unPerfectCustomerList: state => state.customer.unPerfectCustomerList,
            contractList: state => state.customercontract.contractList,
        })
    },
    watch: {
        // 监听简历是否选中
        'listObj.listData': {
            handler: function(newData, oldData) {
                if (!this.ifContract) {
                    return
                }
                console.log(newData)
                if (newData.find(v => v.icon.iconFlag)) {
                    this.ifCheck = true
                } else {
                    this.ifCheck = false
                }
            },
            deep: true
        },
        workList(data) {
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
                    let arr = []
                    if (this.ifCustom) {
                        // 客户
                        arr = data.items.map(item => {
                            let obj = {
                                name: item.customer_name,
                                img: item.logo_big,
                                work: item.customer_company_name,
                                label: [],
                                id: item.id,
                                tel: '',
                                state: '',
                                time: '',
                                userId: item.user_id,
                                url: {
                                    link: 'customPage',
                                    query: {id: item.id, logo: item.logo_big, name: item.customer_name, company: item.customer_company_name,
                                    mobile: '+' + item.mobile_code + ' ' + item.mobile},
                                },
                                logoNameFlag: false,
                                color: parseInt(Math.random()*3+1)
                            }
                            if (item.user_id!=this.userId) {
                                obj.url.query.share = true
                            }
                            return obj
                        })
                    } else {
                        // 同事
                        arr = data.items.map(item => {
                            return {
                                name: item.userName,
                                img: item.headPortrait,
                                work: item.deptName,
                                label: [],
                                id: item.userId,
                                tel: item.mobile,
                                state: '',
                                time: '',
                                userId: item.userId,
                                url: {
                                    link: 'companyDetail',
                                    query: {id: item.userId, noCall: true},
                                },
                                logoNameFlag: false,
                                color: parseInt(Math.random()*3+1)
                            }
                        })
                    }
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
        unPerfectCustomerList(data) {
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
                        return {
                            name: item.customer_name||item.mobile,
                            img: item.logo_big||require('@/images/xsdefult.jpg'),
                            work: '',
                            label: [],
                            id: item.customer_id,
                            tel: '',
                            state: '',
                            time: '',
                            url: {
                                link: 'newCustom',
                                query: {id: item.customer_id},
                            },
                            logoNameFlag: false,
                            color: parseInt(Math.random()*3+1)
                        }
                    })
                    if (this.page == 1) {
                        this.num_items = parseInt(data.num_items)
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
        contractList(data) {
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
                        return {
                            name: item.contract_title,
                            img: item.company_logo,
                            work: item.company_name,
                            number: item.contract_num,
                            label: [],
                            id: item.id,
                            start: item.contract_start_time,
                            end: item.contract_end_time,
                            money: item.total_amout,
                            type: item.received_payment_type,
                            payCount: item.installment_num,
                            title: item.contract_title,
                            tel: '',
                            state: '',
                            time: '',
                            icon: {
                                iconType: 1,
                                iconFlag: false
                            },
                            logoNameFlag: false,
                            color: parseInt(Math.random()*3+1),
                        }
                    })
                    if (this.page == 1) {
                        this.listObj.radioData = []
                        this.listObj.radioFlag = true
                        this.listObj.listData = arr
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                    }
                    // 选择
                    if (this.id) {
                        let index = this.listObj.listData.findIndex(v=>v.id===this.id)
                        if (index === -1) {
                            return
                        }
                        this.listObj.listData[index].icon.iconFlag = true
                    }
                    this.$nextTick(()=>{
                        this.$refs.scroller.reset()
                    })
                }
            }
        },
    },
    components: {
        Group,
        Scroller, 
        LoadMore,
        Flexbox,
        FlexboxItem,
        XButton,
        listA
    },
}
</script>

<style lang="less">
.searchResult .vux-flexbox .vux-flexbox-item:last-child {
    margin-left: 1px !important;
}

.searchResult .vux-flexbox button.weui-btn {
    border-radius: 0 5px 5px 0;
}

.searchResult .vux-flexbox .vux-flexbox-item:first-child button.weui-btn {
    border-radius: 5px 0 0 5px;
}
</style>