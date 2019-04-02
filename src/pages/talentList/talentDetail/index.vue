<template>
    <div class="talentDetail">
        <scroller lock-x :bounce="false">
            <div class="talent-detail">
                <!-- 简历头部 -->
                <div class="title">
                    <h2>{{resume.name}}</h2>
                    <p>
                        {{resume.talent_work_list&&resume.talent_work_list[0]&&resume.talent_work_list[0].position?resume.talent_work_list[0].position:'--'}}
                        <i class="divide">|</i>
                        {{resume.talent_work_list&&resume.talent_work_list[0]&&resume.talent_work_list[0].company_name?resume.talent_work_list[0].company_name:'--'}}
                    </p>
                </div>
                <!-- 个人信息 -->
                <div class="vux-1px-t info">
                    <h3>个人信息</h3>
                    <div class="content">
                        <p>{{resume.work_status?resume.work_status:'--'}}</p>
                        <p>
                            性别：<span>{{resume.sex==0?'女':'男'}}</span>
                            年龄：<span>{{resume.age?resume.age:'--'}}岁</span>
                            工作经验：<span>{{resume.worked_years?resume.worked_years:'--'}}年</span>
                        </p>
                        <p v-if="!resume.is_buy">(如需联系方式请订阅简历)</p>
                        <h4 v-else>
                            <p>电话：{{resume.mobile?resume.mobile:'--'}}</p>
                            <p>邮箱：{{resume.email?resume.email:'--'}}</p>
                        </h4>
                    </div>
                </div>
                <!-- 求职意向 -->
                <div class="vux-1px-t intention">
                    <h3>求职意向</h3>
                    <div class="content">
                        <p><em>工作性质：</em><span>{{resume.work_type?resume.work_type:'--'}}</span></p>
                        <p><em>期望岗位：</em><span>{{resume.expect_positions?resume.expect_positions:'--'}}</span></p>
                        <p><em>期望行业：</em><span>{{resume.expect_industries?resume.expect_industries:'--'}}</span></p>
                        <p><em>期望地区：</em><span>{{resume.expect_areas?resume.expect_areas:'--'}}</span></p>
                        <p><em>期望月薪：</em><span>{{resume.expect_salary?resume.expect_salary:'--'}}</span></p>
                    </div>
                </div>
                <!-- 工作经历 -->
                <div class="vux-1px-t job">
                    <h3>工作经历</h3>
                    <timeline v-if="Number(resume.talent_work_list)!==0" >
                        <timeline-item v-for="(item,index) in resume.talent_work_list" :key="index">
                            <h4>{{item.company_name?item.company_name:'--'}}<i class="divide">|</i>{{item.position?item.position:'--'}}<i class="divide">|</i>{{item.industry?item.industry:'--'}}</h4>
                            <h4>{{item.start_date?item.start_date:''}}<i class="divide">—</i>{{item.end_date?item.end_date:''}}（{{item.work_time?item.work_time:'--'}}）</h4>
                            <p>工作描述：</p>
                            <p v-html="item.summary?item.summary:'--'"></p>
                        </timeline-item>
                    </timeline>
                    <p class='no-data' v-else>无</p>
                </div>
                <!-- 项目经历 -->
                <div class="vux-1px-t project">
                    <h3>项目经验</h3>
                    <timeline v-if="Number(resume.talent_project_list)!==0">
                        <timeline-item v-for="(item,index) in resume.talent_project_list" :key="index">
                            <h4>{{item.name?item.name:'--'}}</h4>
                            <h4>{{item.start_date?item.start_date:''}}<i class="divide">—</i>{{item.end_date?item.end_date:''}}（{{item.work_time?item.work_time:'--'}}）</h4>
                            <p>责任描述：</p>
                            <p v-html="item.duty?item.duty:'--'"></p>
                            <p>项目描述：</p>
                            <p v-html="item.description?item.description:'--'"></p>
                        </timeline-item>
                    </timeline>
                    <p class='no-data' v-else>无</p>
                </div>
                <!-- 教育信息 -->
                <div class="vux-1px-t education">
                    <h3>教育信息</h3>
                    <timeline v-if="Number(resume.talent_education_list)!==0">
                        <timeline-item v-for="(item,index) in resume.talent_education_list" :key="index">
                            <h4>{{item.start_date?item.start_date:''}}<i class="divide">—</i>{{item.end_date?item.end_date:''}}</h4>
                            <p>{{item.school_name?item.school_name:'--'}}<i class="divide">|</i>{{item.major_name?item.major_name:'--'}}<i class="divide">|</i>{{item.education?item.education:'--'}}</p>
                        </timeline-item>
                    </timeline>
                    <p class='no-data' v-else>无</p>
                </div>
                <!-- 自我评价 -->
                <div class="vux-1px-t evaluate">
                    <h3>自我评价</h3>
                    <div class="content">
                        <p v-html="resume.personal?resume.personal:'无'"></p>
                    </div>
                </div>
            </div>
        </scroller>
        <!-- 底部按钮 -->
        <tabbar class="bottem-button" v-if="resume.name">
            <tabbar-item class="vux-1px-r" v-if="!resume.is_buy">
                <span slot="label">
                    <check-icon :value="pageType==='wishList'?!resume.is_collect:resume.is_collect" type="plain" @click.native="handleSubscribe(false)">{{pageType==='wishList'?'取消意愿':resume.is_collect?'已加入意愿':'加入意愿'}}</check-icon>
                </span>
            </tabbar-item>
            <tabbar-item  v-if="!resume.is_buy">
                <span slot="label">
                    <check-icon :value="resume.is_buy" type="plain" @click.native="handleSubscribe(true)">订阅</check-icon>
                </span>
            </tabbar-item>
            <tabbar-item  v-if="resume.is_buy">
                <span slot="label">
                    <a :href="`tel:${resume.mobile}`"><x-button type="primary" action-type="button">打电话</x-button></a>
                </span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
import { Timeline, TimelineItem, Flexbox, FlexboxItem, Tabbar, TabbarItem, XButton, CheckIcon, Scroller } from 'vux'
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'

export default {
    name: 'talentDetail',
    data() {
        return {
            lid: '',            //简历id
            user_id: this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            resume: {},         //简历对象
            subscribeType: 0,   //1：加入意愿，2：移除意愿，3：订阅
        }
    },
    created() {
        this.CLEAR_RESUMEDETAIL()
        let lid = this.$route.params.lid
        let obj
        if (this.pageType === 'myTalentList') {
            obj = {
                user_id: this.user_id,
                company_id: this.company_id,
                order_resume_id: lid
            }
        } else {
            obj = {
                user_id: this.user_id,
                company_id: this.company_id,
                lie100_resume_id: lid
            }
            console.log(obj)
        }
        this.resume_resumeDetail(obj)
        this.lid = lid
    },
    methods: {
        ...mapActions({
            resume_resumeDetail: 'resume/resumeDetail',
            resume_addSubscribe: 'resume/addSubscribe',
            resume_removeSubscribe: 'resume/removeSubscribe',
            resume_buySubscribe: 'resume/buySubscribe',
        }),
        ...mapMutations({
            CLEAR_RESUMEDETAIL: 'resume/CLEAR_RESUMEDETAIL',
            CLEAR_SUBSCRIBE: 'resume/CLEAR_SUBSCRIBE',
            CORRECT_TALENTLIST: 'resume/CORRECT_TALENTLIST',
            REDUCE_RESUME_BALANCE: 'resume/REDUCE_RESUME_BALANCE',
        }),
        //意愿订阅
        handleSubscribe(ifBuy) {
            if (this.resume.is_buy) {
                return
            } else {
                let obj = {
                    user_id: this.user_id,
                    company_id: this.company_id,
                    lie100_resume_id: this.lid
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
                    if(!this.resume.is_collect) {
                        this.CLEAR_SUBSCRIBE()
                        this.resume_addSubscribe(obj)
                        this.subscribeType = 1
                    } else {
                        this.$vux.confirm.show({
                            title: '提示',
                            content: `该人才数据将从您的意愿中移除，您可以再次从"人才中心"中通过搜索添加回来`,
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
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            list: state => state.resume.list,
            resume_balance: state => state.resume.talentListData.data.items.resume_balance,
            resumeDetail: state => state.resume.resumeDetailData,
            subscribeInfo: state => state.resume.subscribeInfo,
        }),
    },
    watch: {
        //监听请求的简历数据
        resumeDetail: function(data) {
            if(data) {
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                } else if (data.data.items) {
                    this.resume = data.data.items
                }
            }
        },
        //监听简历状态弹出操作结果，并改变当前页面简历数据和列表页简历状态
        subscribeInfo: function(data) {
            if(data) {
                let listType = this.pageType
                if (data.data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                    return
                } else if (this.subscribeType === 1 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '加入意愿成功',
                        type: 'text',
                        position: 'top',
                        width: '18em'
                    })
                    this.resume.is_collect = true
                    let index = this.list.findIndex((v,i)=>(v.lie100_resume_id==this.lid))
                    this.CORRECT_TALENTLIST({index: index, key: 'is_collect', value: true})
                    return
                } else if (this.subscribeType === 2 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '移除意愿成功',
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                    this.resume.is_collect = false
                    let index = this.list.findIndex((v,i)=>(v.lie100_resume_id==this.lid))
                    this.CORRECT_TALENTLIST({index: index, key: 'is_collect', value: false})
                    if (this.pageType === 'wishList') {
                        this.$router.back(-1)
                        return
                    }
                    return
                } else if (this.subscribeType === 3 && data.data.items.result == 1) {
                    this.$vux.toast.show({
                        text: '订阅成功',
                        type: 'text',
                        position: 'top',
                         width:"18em"  
                    })
                    this.resume.is_buy = true
                    this.resume.name = data.data.items.name
                    this.resume.email = data.data.items.email
                    this.resume.mobile = data.data.items.mobile
                    let index = this.list.findIndex((v,i)=>(v.lie100_resume_id==this.lid))
                    this.CORRECT_TALENTLIST({index: index, key: 'is_buy', value: true})
                    this.CORRECT_TALENTLIST({index: index, key: 'name', value: this.resume.name})
                    this.REDUCE_RESUME_BALANCE()
                    return
                }
            }
        }
    },
    components: {
        Timeline,
        TimelineItem,
        Flexbox,
        FlexboxItem,
        Tabbar,
        TabbarItem,
        XButton,
        CheckIcon,
        Scroller
    },
}
</script>

<style lang="less">
.talentDetail .vux-timeline .vux-timeline-item .vux-timeline-item-color {
    border: 1px solid #AB956D;
    background: @bg-color;
}
.talentDetail .vux-timeline .vux-timeline-item .vux-timeline-item-head {
    left: 0;
    top: 4px;
}
.talentDetail .vux-timeline .vux-timeline-item .vux-timeline-item-tail {
    top: 9px;
}
.talentDetail .vux-timeline .vux-timeline-item .vux-timeline-item-head-first {
    width: 10px;
    height: 10px;
    left: 0px;
    top: 4px;
    border: 1px solid #009DD9;

    i {
        display: none;
    }
}
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
