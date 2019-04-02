<template>
    <div class="plan">
        <scroller lock-x ref="planScroller" :height="height" @on-scroll-bottom="loadMore" @on-pulldown-loading="refresh"
        v-model="status" :use-pulldown="showPull" v-if="showScroll">
            <div class="my-plan">
                <div v-if="planList.length>0">
                    <!-- 跳转页面按钮 -->
                    <div class="link" v-if="showDate">
                        <a href="javascript:;" @click="$router.push('newPlan/new')"><img src="@/images/home/add.png"></a>
                        <a href="javascript:;" @click="$emit('changeCalendar')"><img src="@/images/home/list.png"></a>
                    </div>
                    <!-- 任务列表 -->
                    <timeline>
                        <timeline-item v-for="item in planList" :key="item.scheduleId" :class="{'done': item.status==='3', 'list': showDate}">
                            <p class="date" v-if="showDate&&item.startDate">{{item.startDate}}</p>
                            <p class="time">{{item.startTime}}</p>
                            <div class="task">
                                <p @click="viewPlan(item.scheduleId)">
                                    {{`【${item.scheduleType==='1'?'拜访计划':'通用'}】${item.subject}`}}
                                    <i></i>
                                </p>
                                <div :class="{'done': item.status==='3'||notSelf}">
                                    <span v-if="item.status!=='3'">
                                        <a href="javascript:;" @click="deletePlan(item.scheduleId)">删除</a>
                                        <a href="javascript:;" @click="delayPlan(item.scheduleId)">延时</a>
                                        <a href="javascript:;" @click="changePlan(item.scheduleId)">更改</a>
                                        <a href="javascript:;" @click="doPlan(item.scheduleId)">执行</a>
                                        <span v-if="notSelf">未执行</span>
                                    </span>
                                    <icon type="success-no-circle" v-if="item.status==='3'&&!notSelf"></icon>
                                    <span v-if="item.status==='3'&&notSelf">已执行</span>
                                </div>
                            </div>
                        </timeline-item>
                    </timeline>
                    <!-- 底部区域 -->
                    <div v-if="showPull">
                        <load-more tip="加载中" v-if="has_more"></load-more>
                        <div class="no-more" v-if="!has_more&&page!==1">已到底部</div>
                    </div>
                </div>
                <!-- 无日程 -->
                <div v-else>
                    <!-- 跳转页面按钮 -->
                    <div class="link" v-if="showDate">
                        <a href="javascript:;" @click="$router.push('newPlan/new')"><img src="@/images/home/add.png"></a>
                        <a href="javascript:;" @click="$emit('changeCalendar')"><img src="@/images/home/calender.png"></a>
                    </div>
                    <div class="no-data">
                        <img src="@/images/home/calender-big.png" alt="" class="photo">
                        <p class="gray">{{!showDate?'今天您还没有安排日程':notSelf?userName+'暂无日程安排':'您暂无日程安排'}}</p>
                        <p class="gray" v-if="!showDate">请点击"+"安排日程</p>
                        <a href="javascript:;" @click="$router.push('newPlan/new')" v-if="showDate&&!notSelf">马上安排</a>
                    </div>
                </div>
            </div>
            <!-- 下拉组件 -->
            <div v-show="showPull" slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉加载更多</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放后加载</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>
        </scroller>
        <div v-else class="my-plan">
            <!-- 任务列表 -->
            <timeline v-if="planList.length>0">
                <timeline-item v-for="item in planList" :key="item.scheduleId" :class="{'done': item.status==='3'||notSelf}">
                    <p class="time">{{item.startTime}}</p>
                    <div class="task">
                        <p @click="viewPlan(item.scheduleId)">
                            {{`【${item.scheduleType==='1'?'拜访计划':'通用'}】${item.subject}`}}
                            <i></i>
                        </p>
                        <div :class="{'done': item.status==='3'||notSelf}">
                            <span v-if="item.status!=='3'">
                                <a href="javascript:;" @click="deletePlan(item.scheduleId)">删除</a>
                                <a href="javascript:;" @click="delayPlan(item.scheduleId)">延时</a>
                                <a href="javascript:;" @click="changePlan(item.scheduleId)">更改</a>
                                <a href="javascript:;" @click="doPlan(item.scheduleId)">执行</a>
                                <span v-if="notSelf">未执行</span>
                            </span>
                            <icon type="success-no-circle" v-if="item.status==='3'&&!notSelf"></icon>
                            <span v-if="item.status==='3'&&notSelf">已执行</span>
                        </div>
                    </div>
                </timeline-item>
            </timeline>
            <!-- 无日程 -->
            <div v-if="planList.length===0" class="no-data">
                <img src="@/images/home/calender-big.png" alt="" class="photo">
                <p class="gray">今天{{notSelf?userName:'您'}}还没有安排日程</p>
                <a href="javascript:;" @click="$router.push('newPlan/new')" v-if="!notSelf">马上安排</a>
            </div>
        </div>
    </div>
</template>

<script>
import { Scroller, Timeline, TimelineItem, Icon, Divider, LoadMore } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name: 'planList',
    // 父组件传值
    props: ['showScroll', 'showDate', 'showPull', 'showHeight', 'notSelf', 'userName'],
    data() {
        return {
            height: this.showHeight?"-236":'-30',
            planList: [],
            done: false,
            has_more: true,
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            onFetching: false,      //是否请求数据中
            myId: this.$store.state.userInfo.user.userId,
            startDate: '',
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            date: "",
            page: 1,
            count: 999,
            scheduleId: '',
        }
    },
    created() {
        this.date = this.day
        this.userId = this.notSelf?this.notSelf:this.myId
        let obj
        if (this.showDate) {
            this.count = 10
            obj = {
                userId: this.userId,
                companyId: this.companyId,
                page: this.page,
                count: this.count,
            }
        } else {
            obj = {
                userId: this.userId,
                companyId: this.companyId,
                date: this.date,
                page: this.page,
                count: this.count,
            }
        }
        this.schedule_scheduleList(obj)
    },
    methods: {
        ...mapMutations({
            SCHEDULEDAYLIST: 'schedule/SCHEDULEDAYLIST',
        }),
        ...mapActions({
            schedule_scheduleList: 'schedule/scheduleList',
            schedule_delSchedule: 'schedule/delSchedule',
        }),
        //下拉刷新事件
        refresh() {
            this.page = 1
            let obj = {
                userId: this.userId,
                companyId: this.companyId,
                page: this.page,
                count: this.count,
            }
            this.schedule_scheduleList(obj)
            this.$nextTick(() => {
                this.$refs.planScroller.donePulldown()
            })
        },
        //上拉刷新事件
        async loadMore() {
            if (!this.has_more || this.onFetching) {
                return
            } else {
                this.page += 1
                let obj = {
                    userId: this.userId,
                    companyId: this.companyId,
                    page: this.page,
                    count: this.count,
                }
                this.onFetching = true
                await this.schedule_scheduleList(obj)
                // this.handleRequest()
                // this.LIST()
                this.onFetching = false
            }
        },
        // 查看日程
        viewPlan(sid) {
            // if (this.planList[index].status===3 || this.notSelf) {
            //     this.$router.push({path: 'newPlan/'+sid, query: {view: true, ifChanged: true}})
            // } else {
                this.$router.push({path: 'newPlan/'+sid, query: {view: true}})
            // }
        },
        // 删除日程
        deletePlan(sid) {
            this.$vux.confirm.show({
                title: '提示',
                content: '您确定删除该日程吗？',
                onConfirm: ()=>{
                    // let list = this.planList.filter((v,i)=>i!==index)
                    // this.CHANGE_PLANLIST(list)
                    this.scheduleId = sid
                    let obj = {
                        userId: this.userId,
                        companyId: this.companyId,
                        scheduleId: sid
                    }
                    this.schedule_delSchedule(obj)
                }
            })
        },
        // 延迟日程
        delayPlan(sid) {
            this.$router.push({path: 'changePlan/'+sid, query: {delay: true}})
        },
        // 更改日程
        changePlan(sid) {
            this.$router.push({path: 'changePlan/'+sid, query: {change: true}})
        },
        // 执行日程
        doPlan(sid) {
            this.$router.push({path: 'changePlan/'+sid, query: {do: true}})
        },
    },
    computed: {
        ...mapState({
            day: state => state.schedule.day,
            scheduleList: state => state.schedule.scheduleList,
            delSchedule: state => state.schedule.delSchedule,
            scheduleDayList: state => state.schedule.scheduleDayList,
        })
    },
    watch: {
        day: function(data) {
            this.date = data
            this.page = 1
            this.count = 999
            let obj = {
                userId: this.userId,
                companyId: this.companyId,
                date: this.date,
                page: this.page,
                count: this.count,
            }
            this.schedule_scheduleList(obj)
        },
        scheduleList: function(data) {
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
                    if (this.page !== 1) {
                        data.items.map(v => {
                            if (v.startDate !== this.startDate) {
                                this.startDate = v.startDate
                            } else {
                                v.startDate = ''
                            }
                        })
                        this.planList = this.planList.concat(data.items)
                    } else {
                        this.planList = data.items
                        this.planList.forEach(v => {
                            if (v.startDate !== this.startDate) {
                                this.startDate = v.startDate
                            } else {
                                v.startDate = ''
                            }
                        })
                    }
                    this.has_more = data.has_more
                }
            }
        },
        delSchedule: function(data) {
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
                    this.planList = this.planList.filter(v => v.scheduleId !== this.scheduleId)
                    if (this.planList.length === 0) {
                        this.$emit('delPlan', true)
                    } else {
                        this.$emit('delPlan', false)
                    }
                    this.$vux.toast.show({
                        text: '删除成功！',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                }
            }
        },
        // showDate: function(val) {
        //     if (val) {
        //         this.count = 10
        //         let obj = {
        //             userId: this.userId,
        //             companyId: this.companyId,
        //             page: this.page,
        //             count: this.count,
        //         }
        //         this.schedule_scheduleList(obj)
        //     } else {
        //         this.page = 1
        //         this.count = 999
        //         let obj = {
        //             userId: this.userId,
        //             companyId: this.companyId,
        //             date: this.date,
        //             page: this.page,
        //             count: this.count,
        //         }
        //         this.schedule_scheduleList(obj)
        //     }
        // },
        notSelf: function(val) {
            this.userId = val?val:this.myId
            if (this.showDate) {
                this.count = 10
                let obj = {
                    userId: this.userId,
                    companyId: this.companyId,
                    page: this.page,
                    count: this.count,
                }
                this.schedule_scheduleList(obj)
            } else {
                this.page = 1
                this.count = 999
                let obj = {
                    userId: this.userId,
                    companyId: this.companyId,
                    date: this.date,
                    page: this.page,
                    count: this.count,
                }
                this.schedule_scheduleList(obj)
            }
        },
    },
    components: {
      Scroller, Timeline, TimelineItem, Icon, Divider, LoadMore
    },
}
</script>

<style lang="less">
// 时间线
.plan .vux-timeline {
	padding-left: 60px;
}
.plan .vux-timeline .vux-timeline-item .vux-timeline-item-color {
    border: 1px solid @blue;
    background: #fff;
}
.plan .vux-timeline .vux-timeline-item .vux-timeline-item-head {
    left: 0;
    top: 10px;
    width: 8px;
    height: 8px;
}
.plan .vux-timeline .vux-timeline-item .vux-timeline-item-tail {
    display: inline-block !important;
    width: 1px;
    top: 18px;
    left: 4px;
    height: 91px;
    background: #e0e0e0;
}
.plan .vux-timeline .vux-timeline-item .vux-timeline-item-head-first {
    width: 8px;
    height: 8px;
    left: 0px;
    top: 10px;
    border: 1px solid @blue;

    i {
        display: none;
    }
}
.plan .vux-timeline .vux-timeline-item.list {
    margin-top: 15px;

    .vux-timeline-item-tail {
        height: 137%;
        top: -7px;
    }
}
// .plan .vux-timeline .vux-timeline-item:first-child  .vux-timeline-item-tail {
//     height: 90px;
// }
.plan .vux-timeline .vux-timeline-item.list:first-child .vux-timeline-item-tail {
    top: 15px;
}
.plan .vux-timeline .vux-timeline-item:last-child .vux-timeline-item-tail {
    display: none !important;
}
.plan .vux-timeline .vux-timeline-item.done .vux-timeline-item-color {
    border-color: #16a202;
}
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
