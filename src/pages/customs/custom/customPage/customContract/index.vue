<template>
    <div class="customContract">
        <div class="card-head-A">
            <card :header="{title: contract?'合同记录：':'回款记录：'}">
                <div slot="content" class="card-demo-flex card-demo-content">
                    <div class="vux-1px-r" v-if="contract">
                        数量（份）
                        <br/>
                        <span>{{count}}份</span>
                    </div>
                    <div>
                        金额（元）
                        <br/>
                        <span>{{money}}元</span>
                    </div>
                </div>
            </card>
        </div>
        <scroller lock-x scrollbarY ref="scroller" @on-scroll-bottom="loadMore" :height="height"
        v-model="status" use-pulldown @on-pulldown-loading="refresh">
            <div>
                <listA :listObj="listObj" v-if="contract"/>
                <div :class="['payment', 'weui-cell_access', {'vux-1px-t': index!==0}]" v-for="(item, index) in listObj.listData" :key="item.id" v-else>
                    <router-link :to="{name: 'customNewPayment', query: {customerId, id: item.id, highSeas}}">
                        <h3><span class="els">{{item.title}}</span><span>{{item.state?item.state===1?'已完成':'已开始(未完成)':'未开始'}}</span></h3>
                        <p><span class="els left">合同号：{{item.number}}</span><span class="els right">所属人：{{item.person}}</span></p>
                        <p><span>预计回款金额：<em>{{item.money}}</em></span></p>
                        <p>预计回款时间：{{item.time}}</p>
                    </router-link>
                </div>
                <!-- 无数据页面 -->
                <div class='wu-all wu-allB' v-if="listObj.listData.length===0">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>暂无数据</p>
                    </section>
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
        <x-button type="primary" v-if="!highSeas" :link="{name: contract?'customNewContract':'customNewPayment', query: {customerId, name, company}}">{{contract?'添加合同':'添加回款计划'}}</x-button>
    </div>
</template>

<script>
import { numberComma, Group, Cell, XButton, Card, Scroller, LoadMore } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy } from '@/util'
import listA from '@/components/listA'

export default {
    name: 'customContract',
    data() {
        return {
            customerId: 0,
            highSeas: 1,         //是否公海客户
            contract: true,
            money: 0.00,
            count: 0,
            has_more: false,
            listObj: {listData:[]},
            // scroller相关
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            height: "-168",
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            page: 1,
            count: 10,
        }
    },
    created() {
        this.name = this.$route.query.name
        this.company = this.$route.query.company
        this.customerId = this.$route.query.id
        this.highSeas = this.$route.query.highSeas
        this.contract = JSON.parse(this.$route.query.contract)
        let obj = {
            company_id: this.companyId,
            user_id: this.userId,
            customer_id: this.customerId,
        }
        if (this.contract) {
            this.customercontract_contractRecord(obj)
            this.customercontract_contractList(obj)
        } else {
            this.customerrecpay_paymentSum(obj)
            this.customerrecpay_paymentList(obj)
        }
        if (this.highSeas) {
            this.height = '-124'
        }
    },
    mounted() {
        document.title = this.contract?'合同':'回款'
    },
    methods: {
        ...mapActions({
            customercontract_contractRecord: 'customercontract/contractRecord',
            customercontract_contractList: 'customercontract/contractList',
            customerrecpay_paymentSum: 'customerrecpay/paymentSum',
            customerrecpay_paymentList: 'customerrecpay/paymentList',
        }),
        handleRequest(obj) {
            if (this.isLoading) {
                return
            }
            if (this.contract) {
                this.customercontract_contractRecord(obj)
                this.customercontract_contractList(obj)
            } else {
                this.customerrecpay_paymentSum(obj)
                this.customerrecpay_paymentList(obj)
            }
        },
        refresh() {
            this.page = 1
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                customer_id: this.customerId,
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
                    customer_id: this.customerId,
                }
                this.handleRequest(obj)
            }
        },
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            contractRecord: state => state.customercontract.contractRecord,
            contractList: state => state.customercontract.contractList,
            paymentSum: state => state.customerrecpay.paymentSum,
            paymentList: state => state.customerrecpay.paymentList,
        })
    },
    watch: {
        contractRecord(data) {
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
                    this.count = data.items.contract_count
                    this.money = numberComma(data.items.contract_money)
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
                            label: [],
                            id: item.id,
                            number: item.contract_num,
                            tel: '',
                            state: '',
                            time: '',
                            url: {
                                link: 'customNewContract',
                                query: {id: item.id, highSeas: this.highSeas},
                            },
                            logoNameFlag: false,
                            color: parseInt(Math.random()*3+1)
                        }
                    })
                    if (this.page == 1) {
                        this.listObj.listData = arr
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                    }
                }
            }
        },
        paymentSum(data) {
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
                    this.money = numberComma(data.items.total_amout)
                }
            }
        },
        paymentList(data) {
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
                            id: item.id,
                            title: item.title,
                            state: item.state, //回款状态:0-未开始;1-已完成;2-已开始(未完成)
                            number: item.contract_num,
                            person: item.username,
                            money: numberComma(item.total_amout),
                            time: item.plan_receive_time,
                        }
                    })
                    if (this.page == 1) {
                        this.listObj.listData = arr
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                    }
                }
            }
        },
    },
    components: {
        Group,
        Cell,
        XButton,
        Card,
        Scroller,
        LoadMore,
        listA
    },
}
</script>

<style lang="less">
 @import './index2.less';
</style>
<style lang="less" scoped>
 @import './index.less';
</style>
