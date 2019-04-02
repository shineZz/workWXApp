<template>
    <div class="checker">
        <div class="fix-header" v-if="show==='mobile'||show==='tel'||show==='fax'">{{fixedVal}}</div>
        <scroller ref="scroller" lock-x :scrollbarY=false :height="height" @on-scroll="initTest">
            <div style="overflow:hidden">
                <group v-if="show!=='mobile'&&show!=='tel'&&show!=='fax'" :title="show==='source'?'客户入库来源具有唯一性，一旦入库则不允许修改':''">
                    <checklist ref="group" :max="1" :options="groupList" v-model="check" v-if="show==='group'"></checklist>
                    <checklist ref="source" :max="1" :options="sourceList" v-model="check" v-if="show==='source'"></checklist>
                    <checklist ref="stage" :max="1" :options="stageList" v-model="check" v-if="show==='stage'"></checklist>
                    <checklist class="flex" ref="currency" :max="1" :options="currencyList" v-model="check" v-if="show==='currency'"></checklist>
                    <checklist ref="event" :max="1" :options="EventList" v-model="check" v-if="show==='event'"></checklist>
                    <checklist ref="pay" :max="1" :options="payList" v-model="check" v-if="show==='pay'"></checklist>
                </group>
                <group v-for="(item, index) in mobileList" :class="'checker'+item[0]" :title="item[0]" :key="index" v-if="show==='mobile'">
                    <cell v-for="(v, i) in item.slice(1)" :key="i" @click.native="selectHand(v, i, index)" :title="v.name" :value="v.value">
                        <span slot="icon">
                            <icon type="success" v-show="v.flag"></icon>
                            <icon type="circle" v-show="!v.flag"></icon>
                        </span>
                    </cell>
                </group>
                <group v-for="(item, index) in telList" :class="'checker'+item[0]" :title="item[0]" :key="index" v-if="show==='tel'||show==='fax'">
                    <cell v-for="(v, i) in item.slice(1)" :key="i" @click.native="selectHand(v, i, index)" :title="v.name" :value="v.value">
                        <span slot="icon">
                            <icon type="success" v-show="v.flag"></icon>
                            <icon type="circle" v-show="!v.flag"></icon>
                        </span>
                    </cell>
                </group>
                <!-- 底部区域 -->
                <!-- <load-more tip="加载中" v-if="has_more"></load-more> -->
            </div>
            <!-- 下拉组件 -->
            <!-- <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉加载更多</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放后加载</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div> -->
        </scroller>
        <ul class="nav" v-if="show==='mobile'">
            <li v-for="(item, index) in mobileList" :key="index">
                <a @click="goAnchor(item[0])">{{item[0]}}</a>
            </li>
        </ul>
        <ul class="nav" v-if="show==='tel'||show==='fax'">
            <li v-for="(item, index) in telList" :key="index">
                <a @click="goAnchor(item[0])">{{item[0]}}</a>
            </li>
        </ul>

        <x-button type="primary" style="position:absolute;bottom:0;" :show-loading="btnFlag" :disabled="save&&!ifCheck||btnFlag" @click.native="confirm">{{save?'保存':'确定'}}</x-button>
    </div>
</template>

<script>
import { Scroller, LoadMore, XButton, Group, Cell, Checklist, Icon } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'checkers',
    props: ['show', 'checkValue', 'save'],
    data() {
        return {
            ifCheck: false,
            btnFlag: false,
            check: [],
            groupList: [],
            sourceList: [],
            stageList: [],
            EventList: [],
            payList: [],
            currencyList: [],
            fixedVal: '',
            mobileList: [],
            telList: [],
            // has_more: false,
            // scroller相关
            // status: {               //下拉状态
            //     pulldownStatus: 'default'
            // },
            height: '-36',
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            page: 1,
            count: 999,
        }
    },
    created() {
        this.check = this.checkValue
        let obj = {
            company_id: this.companyId,
            user_id: this.userId,
            page: this.page,
            count: this.count,
        }
        this.requestHand(obj)
    },
    mounted() {
        document.activeElement.blur()
    },
    methods: {
        ...mapActions({
            customersegment_segmentList: 'customersegment/segmentList',
            customersource_sourceList: 'customersource/sourceList',
            customerstage_stageList: 'customerstage/stageList',
            Visit_Type_List: 'customervisittype/VisitTypeListSvr',
            customerrecpaystatus_pstatusList: 'customerrecpaystatus/pstatusList',
        }),
        requestHand(obj) {
            if (this.isLoading) {
                return
            }
            switch (this.show) {
                case 'group':
                    this.customersegment_segmentList(obj)
                    break;
                case 'source':
                    this.customersource_sourceList(obj)
                    break;
                case 'stage':
                    this.customerstage_stageList(obj)
                    break;
                case 'event':
                    this.Visit_Type_List(obj)
                    break;
                case 'pay':
                    this.customerrecpaystatus_pstatusList(obj)
                    break;
                case 'currency':
                    this.currencyList = JSON.parse(localStorage.getItem('currency'))
                    break;
                case 'mobile':
                    this.mobileList = JSON.parse(localStorage.getItem('mobileCode'))
                    this.fixedVal = this.mobileList[0][0]
                    this.mobileList.forEach(v => {
                        v.forEach(item => {
                            if (item.key===this.check) {
                                item.flag = true
                            }
                        })
                    })
                    break;
                case 'tel':
                case 'fax':
                    this.telList = JSON.parse(localStorage.getItem('telCode'))
                    this.fixedVal = this.telList[0][0]
                    this.telList.forEach(v => {
                        v.forEach(item => {
                            if (item.key===this.check) {
                                item.flag = true
                            }
                        })
                    })
                    break;
            
                default:
                    break;
            }
        },
        // refresh() {
        //     if (this.show==='mobile'||this.show==='tel'||this.show==='fax'||this.show==='currency') {
        //         return
        //     }
        //     this.page = 1
        //     let obj = {
        //         company_id: this.companyId,
        //         user_id: this.userId,
        //         count: this.count,
        //         page: this.page,
        //     }
        //     this.requestHand(obj)
        //     this.$nextTick(() => {
        //         this.$refs.scroller.donePulldown()
        //     })
        // },
        // loadMore() {
        //     if (this.show==='mobile'||this.show==='tel'||this.show==='fax'||this.show==='currency') {
        //         return
        //     }
        //     if (!this.has_more || this.isLoading) {
        //         return
        //     } else {
        //         this.page += 1
        //         let obj = {
        //             company_id: this.companyId,
        //             user_id: this.userId,
        //             page: this.page,
        //             count: this.count,
        //         }
        //         this.requestHand(obj)
        //     }
        // },
        initTest(pos) {
            if (this.show === 'mobile') {
                this.mobileList.forEach((v,i) => {
                    let anchor = this.$el.querySelector(".checker"+v[0])
                    if (pos.top-anchor.offsetTop > -11 && pos.top-anchor.offsetTop < anchor.offsetHeight) {
                        this.fixedVal = v[0]
                    }
                })
            } else if (this.show === 'tel'||this.show === 'fax') {
                this.telList.forEach((v,i) => {
                    let anchor = this.$el.querySelector(".checker"+v[0])
                    if (pos.top-anchor.offsetTop > -11 && pos.top-anchor.offsetTop < anchor.offsetHeight) {
                        this.fixedVal = v[0]
                    }
                })
            }
            
            if (pos.top<0) {
                $(".fix-header").hide()
            } else {
                $(".fix-header").show()
            }
        },
        selectHand(v, i, index) {
            if (v.flag) {
                v.flag = false
                this.ifCheck = false
            } else {
                if (this.show === 'mobile') {
                    this.mobileList.forEach(v => {
                        v.forEach(item => {
                            if (item.flag) {
                                item.flag = false
                            }
                        })
                    })
                } else if (this.show === 'tel'||this.show === 'fax') {
                    this.telList.forEach(v => {
                        v.forEach(item => {
                            if (item.flag) {
                                item.flag = false
                            }
                        })
                    })
                }
                v.flag = true
                this.ifCheck = true
            }
        },
        goAnchor(name) {
            let navId = name
            let anchor = this.$el.querySelector(".checker"+navId)
            this.$nextTick(() => {
                this.$refs.scroller.reset({
                    top: anchor.offsetTop-11
                })
                this.fixedVal = navId
            })
            
        },
        confirm() {
            this.btnFlag = true
            let obj = {}
            if (this.show==='mobile') {
                this.mobileList.forEach(v => {
                    v.forEach(item => {
                        if (item.flag) {
                            obj.value = item.key
                            obj.label = item.value
                        }
                    })
                })
            } else if (this.show==='tel'||this.show === 'fax') {
                this.telList.forEach(v => {
                    v.forEach(item => {
                        if (item.flag) {
                            obj.value = item.key
                            obj.label = item.value
                            obj.name = item.name
                        }
                    })
                })
            } else {
                obj = this.$refs[this.show].getFullValue().length>0?this.$refs[this.show].getFullValue()[0]:{}
            }
            this.$emit('toggle', obj)
            setTimeout(()=>this.btnFlag=false, 3000)
        }
    },
    computed: {
        ...mapState({
            visitTypeData: state => state.customervisittype.visitTypeData,
            segmentData: state => state.customersegment.segmentData,
            sourceData: state => state.customersource.sourceData,
            stageData: state => state.customerstage.stageData,
            pStatusList: state => state.customerrecpaystatus.pStatusList,
        }),
    },
    watch: {
        check(data) {
            if (data.length>0) {
                this.ifCheck = true
            } else {
                this.ifCheck = false
            }
        },
        visitTypeData(data){
            if(Object.keys(data).length>0){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                }else{
                    let _data = data.data.items
                    _data.forEach(function(item){
                        item.key=item.id.toString();
                        item.value=item.name
                    })
                    this.EventList=_data
                    // let arr = data.items.map(item=>{
                    //     return {
                    //         key: item.id,
                    //         value: item.name,
                    //         count: item.used_count,
                    //         state: item.state,
                    //     }
                    // })
                    // if (this.page == 1) {
                    //     this.EventList = arr
                    // } else {
                    //     this.EventList = this.EventList.concat(arr)
                    // }
                }
            }
        },
        segmentData(data) {
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
                    let arr = data.items.map(item=>{
                        return {
                            key: item.id.toString(),
                            value: item.name,
                            count: item.used_count,
                            state: item.state,
                        }
                    })
                    if (this.page == 1) {
                        this.groupList = arr
                    } else {
                        this.groupList = this.groupList.concat(arr)
                    }
                }
            }
        },
        sourceData(data) {
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
                    let arr = data.items.map(item=>{
                        return {
                            key: item.id.toString(),
                            value: item.name,
                            count: item.used_count,
                            state: item.state,
                        }
                    })
                    if (this.page == 1) {
                        this.sourceList = arr
                    } else {
                        this.sourceList = this.sourceList.concat(arr)
                    }
                }
            }
        },
        stageData(data) {
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
                    let arr = data.items.map(item=>{
                        return {
                            key: item.id.toString(),
                            value: item.name,
                            count: item.used_count,
                            state: item.state,
                        }
                    })
                    if (this.page == 1) {
                        this.stageList = arr
                    } else {
                        this.stageList = this.stageList.concat(arr)
                    }
                }
            }
        },
        pStatusList(data) {
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
                    let arr = data.items.map(item=>{
                        return {
                            key: item.id.toString(),
                            value: item.name,
                            count: item.used_count,
                            state: item.state,
                        }
                    })
                    if (this.page == 1) {
                        this.payList = arr
                    } else {
                        this.payList = this.payList.concat(arr)
                    }
                }
            }
        },
    },
    components: {
        Scroller,
        LoadMore,
        XButton,
        Group,
        Cell,
        Checklist,
        Icon
    },
}
</script>

<style lang="less">
.checker .flex .weui-cell__bd {
    display: flex;
    justify-content: space-between;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>