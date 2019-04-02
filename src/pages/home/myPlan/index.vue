<template>
    <div class="my-plan" >
        <div v-show="!showAddressBook">
            <scroller ref="myPlanScroller" lock-x v-show="showCalendar" :bounce="false" height="-36">
                <div @touchstart="touchStart">
                    <header>
                        <!-- 日历头部 -->
                        <group>
                            <datetime v-model="dateValue" @on-change="changeDate" format="YYYY-MM">
                                <a href="javascript:;" class="abtn">{{year+'年 '+month+'月'}}</a>
                            </datetime>
                        </group>
                        <!-- 跳转页面按钮 -->
                        <nav>
                            <a href="javascript:;" @click="$router.push('newPlan/new')"><img src="@/images/home/add.png"></a>
                            <a href="javascript:;" @click="toggleCalendar"><img src="@/images/home/calender.png"></a>
                        </nav>
                    </header>
                    <!-- 日历主体 -->
                    <div class="box">
                        <inline-calendar ref="planCalendar" hide-header @on-view-change="changeView" v-model="calendarValue" :show-last-month='false' :show-next-month='false' :render-function="addSlot"
                        :return-six-rows="false" class="calendar" @on-select-single-date="requestPlan" :replace-text-list="{'TODAY':'今'}"
                        @touchstart.native="moveStart"  @touchmove.native="moveCalendar" @touchend.native="moveEnd" v-if="showCalendar" />
                            <!-- <div slot='each-day' slot-scope="props" :class="['each-day', {'vux-calendar-each-date': false}]" @click="addClass(props)">
                                {{props.child.day}}
                                <span class="vux-calendar-dot"></span>
                                <span class="calendar-line"></span>
                            </div> -->
                    </div>
                    <!-- 具体日程 -->
                    <planList v-if="showCalendar" @delPlan="delPlan" :showScroll='false' :showDate="false" :showPull="false" :showHeight="false" :notSelf="notSelf" :userName="userName"/>
                </div>
            </scroller>
            <x-button type="primary" action-type="button" @click.native="toggleAddress">查看他人日程</x-button>
        </div>
        <!-- 具体日程 -->
        <planList v-if="!showCalendar&&!showAddressBook" :showScroll='true' :showDate="!showCalendar" :showPull="true" :showHeight="false" :notSelf="notSelf" :userName="userName" @changeCalendar="toggleCalendar"/>
        <!-- 通讯录 -->
        <addressBook @toggleAddress="toggleAddress" v-show="showAddressBook" 
        :state1='1' :state2='3' :state3='0' :state4='0' :state5='1'/>
    </div>
</template>

<script>
import { Scroller, Tab, TabItem, InlineCalendar, XButton, Datetime, Group, } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import planList from '../planList'
import addressBook from '@/components/addressBook'

export default {
    name: 'myPlan',
    data() {
        return {
            notSelf: JSON.parse(localStorage.getItem('notSelf')),                 //是否显示本人日程
            userName: JSON.parse(localStorage.getItem('userName')),
            myId: this.$store.state.userInfo.user.userId,
            showCalendar: true,             //显示日历
            showAddressBook: false,         //显示通讯录
            // 日历参数
            calendarData: [],               //日历具体项数据
            dateValue: '2018-05',           //日历头部年月
            calendarValue: '2018-05-24',    //日历主体日期
            year: 2018,
            month: 5,
            // 日历滑动
            pageX: 0,
            pageY: 0,
            X: 0,
            Y: 0,
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            date: "",
        }
    },
    created() {
        this.showCalendar = JSON.parse(localStorage.getItem('showCalendar'))
        // this.notSelf = JSON.parse(localStorage.getItem('notSelf'))
        // this.userName = JSON.parse(localStorage.getItem('userName'))
        this.userId = this.notSelf?this.notSelf:this.myId
        document.title = this.userName + '的日程'
        let day = this.day.split('-')
        this.dateValue = day[0] + '-' + day[1]
        this.calendarValue = this.day
        // let obj = {
        //     userId: this.userId,
        //     companyId: this.companyId,
        //     date: this.dateValue
        // }
        // this.schedule_statisticsSchedule(obj)
        this.SELECTED_MEMBER([])
    },
    mounted() {
    },
    methods: {
        ...mapMutations({
            CHANGE_DAY: 'schedule/CHANGE_DAY',
            SELECTED_MEMBER: 'addressBook/SELECTED_MEMBER',
        }),
        ...mapActions({
            schedule_statisticsSchedule: 'schedule/statisticsSchedule',
        }),
        // 切换通讯录显示隐藏
        toggleAddress() {
            this.showAddressBook = !this.showAddressBook
            if (!this.showAddressBook) {
                if (this.selectedMember.length) {
                    if (this.myId === this.selectedMember[0].userId) {
                        this.userName = '我'
                        this.notSelf = ''
                    } else {
                        this.userName = this.selectedMember[0].userName
                        this.notSelf = this.selectedMember[0].userId
                    }
                    this.userId = this.selectedMember[0].userId
                    let obj = {
                        userId: this.userId,
                        companyId: this.companyId,
                        date: this.dateValue
                    }
                    this.schedule_statisticsSchedule(obj)
                    document.title = this.userName + '的日程'
                    localStorage.setItem('userName', JSON.stringify(this.userName))
                    localStorage.setItem('notSelf', JSON.stringify(this.notSelf))
                }
            }
        },
        // 切换日历显示隐藏
        toggleCalendar() {
            this.showCalendar = !this.showCalendar
            localStorage.setItem('showCalendar', JSON.stringify(this.showCalendar))
        },
        // 切换日期
        changeDate(newVaule) {
            // this.dateValue = newVaule
            let arr = newVaule.split('-')
            this.year = arr[0]
            this.month = arr[1]
            this.calendarValue = newVaule + '-' + this.day.split('-')[2]
        },
        // 修改日历具体项
        addSlot(line, index, data) {
            // console.log(line, index, data)
            let scheduleSituation='', workSignSituation=''
            this.calendarData.forEach((v, i) => {
                if (data.formatedDate === v.day) {
                    switch (v.scheduleSituation) {
                        case '1':       //日程全部完成
                            scheduleSituation = `<span style="position: absolute;margin-left: -10px;margin-top: -3px;display:inline-block;width:20px;border-bottom:1px solid #09BB07;"></span>`
                            break;
                        case '2':       //有未完成的日程
                            scheduleSituation = `<span style="position: absolute;margin-left: -10px;margin-top: -3px;display:inline-block;width:20px;border-bottom:1px solid #66AEF4;"></span>`
                            break;
                        case '3':       //没有日程
                            scheduleSituation = ''
                            break;
                        default:
                            break;
                    }
                    switch (v.workSignSituation) {
                        case '1':       //正常签到
                            workSignSituation = `<span style="position: absolute;margin-left: -1px;margin-top: 1px;display:inline-block;width:3px;height:3px;border-radius:50%;background-color: #09BB07;"></span>`
                            break;
                        case '2':       //未签到
                            workSignSituation = `<span style="position: absolute;margin-left: -1px;margin-top: 1px;display:inline-block;width:3px;height:3px;border-radius:50%;background-color: #999;"></span>`
                            break;
                        case '3':       //迟到
                            workSignSituation = '<span style="position: absolute;margin-left: -1px;margin-top: 1px;display:inline-block;width:3px;height:3px;border-radius:50%;background-color: red;"></span>'
                            break;
                        default:
                            break;
                    }
                }
            })
            return `<div>
                        ${scheduleSituation}
                        ${workSignSituation}
                    </div>`
            // if (this.notSelf) {
            //     return /8/.test(data.date) ? 
            //     `<div style="">
            //         <span style="position: absolute;margin-left: -10px;margin-top: -3px;display:inline-block;width:20px;border-bottom:1px solid #16a202;"></span>
            //         <span style="position: absolute;margin-left: -1px;margin-top: 1px;display:inline-block;width:3px;height:3px;border-radius:50%;background-color: #16a202;"></span>
            //     </div>`
            //     : 
            //     `<div>
            //         <span style="position: absolute;margin-left: -1px;margin-top: 1px;display:inline-block;width:3px;height:3px;border-radius:50%;background-color: #999;"></span>
            //     </div>`
            // }
            // return /8/.test(data.date) ? 
            // `<div style="">
            //     <span style="position: absolute;margin-left: -10px;margin-top: -3px;display:inline-block;width:20px;border-bottom:1px solid #66AEF4;"></span>
            //     <span style="position: absolute;margin-left: -1px;margin-top: 1px;display:inline-block;width:3px;height:3px;border-radius:50%;background-color: #16a202;"></span>
            // </div>`
            //  : 
            //  `<div>
            //     <span style="position: absolute;margin-left: -1px;margin-top: 1px;display:inline-block;width:3px;height:3px;border-radius:50%;background-color: #999;"></span>
            //  </div>`
        },
        delPlan(val) {
            if (val) {
                let index = this.calendarData.findIndex(v => v.day === this.day)
                this.calendarData[index].scheduleSituation = '3'
            }
        },
        // 日历滑动功能
        touchStart(ev) {
            this.$refs.myPlanScroller._xscroll.userConfig.lockY = false
            this.$nextTick(() => {
                this.$refs.myPlanScroller.reset()
            })
        },
        moveStart(ev) {
            let touch = ev.touches ? ev.touches[0] : ev
            this.pageX = touch.pageX
            this.pageY = touch.pageY
        },
        moveCalendar(ev) {
            let touch = ev.touches ? ev.touches[0] : ev
            this.X = touch.pageX-this.pageX
            this.Y = touch.pageY-this.pageY
            let x = Math.abs(this.X)
            let y = Math.abs(this.Y)
            if(x > y) {
                this.$refs.myPlanScroller._xscroll.userConfig.lockY = true
            } else {
                this.$refs.myPlanScroller._xscroll.userConfig.lockY = false
            }
        },
        moveEnd(ev) {
            let x = Math.abs(this.X)
            let y = Math.abs(this.Y)
            if(x > y) {
                if (this.X < -50) {
                    this.$refs.planCalendar.next()
                    this.X = 0
                    this.Y = 0
                    // this.$refs.myPlanScroller._xscroll.userConfig.lockY = false
                    return
                } else if (this.X > 50) {
                    this.$refs.planCalendar.prev()
                    this.X = 0
                    this.Y = 0
                    // this.$refs.myPlanScroller._xscroll.userConfig.lockY = false
                    return
                }
            }
        },
        // 联动头部年月与日历主体日期同步显示
        changeView(data, index) {
            this.year = data.year
            this.month = data.month<10?'0'+data.month:data.month
            this.dateValue = this.year+'-'+this.month
            let obj = {
                userId: this.userId,
                companyId: this.companyId,
                date: this.dateValue
            }
            this.schedule_statisticsSchedule(obj)
            let day = this.dateValue + '-' + this.day.split('-')[2]
            this.CHANGE_DAY(day)
        },
        // 点击日期请求日程
        requestPlan(currentValue) {
            this.CHANGE_DAY(currentValue)
        },
        // addClass(props) {
        //     let e = event
        //     $('.each-day').removeClass('vux-calendar-each-date')
        //     if (e.target.nodeName === 'DIV') {
        //         $(e.target).addClass('vux-calendar-each-date')
        //     }
        //     console.log(props)
        //     if (props.child.isLastMonth || props.child.isNextMonth) {
        //         return
        //     }
        // },
    },
    computed: {
        ...mapState({
            day: state => state.schedule.day,
            statisticsschedule: state => state.schedule.statisticsschedule,
            selectedMember: state => state.addressBook.selectedMember,
        })
    },
    watch: {
        statisticsschedule: function(data) {
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
                    this.calendarData = data.items
                }
            }
        },
        dateValue: function(val) {
        },
    },
    components: {
      Scroller, Tab, TabItem, InlineCalendar, XButton, Datetime, Group,
      planList, addressBook
    },
}
</script>

<style lang="less">
.my-plan header .weui-cells,.my-plan header .vux-no-group-title {
    margin-top: 0 !important;

    &::before,&::after {
        border: none;
    }
}
.my-plan header .weui-cell{
    padding: 0;
}
// 修改日历样式
.my-plan .calendar-header {
    margin-left: 10px;
    font-size: 16px;
    
    span {
        display: none;
    }
    .calendar-year {
        width: 68px;

        >a::after {
            content: ' 年';
        }
    }

    .calendar-month {
        width: 40px;

        >a::after {
            content: '月';
        }
    }
}

.my-plan .calendar {
    thead {
        border-top: 0.5px solid @gray4;
        border-bottom: 0.5px solid @gray4;
    }

    tbody tr:last-child {
        height: 45px;
    }
    
    td {
        font-size: 14px;
    }

//     td.is-disabled {
//         visibility: hidden;
//     }
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
