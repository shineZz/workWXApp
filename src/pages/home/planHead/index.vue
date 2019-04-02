<template>
    <div class="plan-head">
        <!-- 滚动日历 -->
        <scroller lock-y @on-scroll="scrollHand" ref="scrollBox">
            <div @touchend="touchEnd" class="scroll-box" :style="{'width':`${boxWidth}px`,'padding':`0 ${uuu}px`}" >
                <div @click="scrollClick(index)" :class="['scroll-box-item', {'scroll-box-item-hasplan': date.exist}, {'scroll-box-item-current': index==scrollCur}]" v-for="(date, index) in dateList" :key="index">
                    <p class="today" v-show="date.date===today&&index==scrollCur">今天</p>
                    <p class="middle">
                        <span>{{date.day}}</span>
                        {{index==scrollCur?' '+date.week:''}}
                    </p>
                    <p class="current">{{date.month+'月'}}</p>
                </div>
            </div>
        </scroller>
        <h3>日程安排</h3>
        <tabbar>
            <tabbar-item class="vux-1px-r" @click.native="$router.push('myPlan')"><img slot="icon" src="@/images/home/calender.png"></tabbar-item>
            <tabbar-item @click.native="$router.push('newPlan/new')"><img slot="icon" src="@/images/home/add.png"></tabbar-item>
        </tabbar>
    </div>
</template>

<script>
import { Scroller, Tabbar, TabbarItem } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getDateJson } from '@/util/date'
export default {
    name: 'planHead',
    props: ['noPlan'],
    data() {
        return {
            year: 2018,
            month: 5,
            today: '2018-05-28',
            dateList: [],

            scrollLeft: 0,
            scrollCur: 1,
            scrollFlag:true,
            boxWidth: 0,
            uuu:$("#app").width()/2-36,
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            startDate: "2018-05-01",
            endDate: "2018-05-31",
        }
    },
    created() {
        this.handleMonth()
        this.handleDay()
        let obj = {
            userId: this.userId,
            companyId: this.companyId,
            startDate: this.startDate,
            endDate: this.endDate,
        }
        this.schedule_scheduleDayList(obj)
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.scrollBox.reset({
                left: this.dateList[this.scrollCur].left
            })
        })
    },
    methods: {
        ...mapActions({
            schedule_scheduleDayList: 'schedule/scheduleDayList',
        }),
        ...mapMutations({
            CHANGE_DAY: 'schedule/CHANGE_DAY',
        }),
        handleMonth() {
            let date = new Date()
            this.year = date.getFullYear()
            this.month = date.getMonth()+1
            let month = this.month < 10 ? '0'+this.month : this.month
            let day = date.getDate() < 10? '0'+date.getDate() : date.getDate()
            this.today = this.year + '-' + month + '-' + day
            day = sessionStorage.getItem('day')?JSON.parse(sessionStorage.getItem('day')):this.today
            this.CHANGE_DAY(day)
        },
        handleDay() {
            let d = getDateJson(new Date(this.year, this.month, 0))
            let dayNum = d.length
            this.boxWidth = dayNum*62
            d.forEach((v, i) => {
                let left = i*62
                let date = v.year + '-' + v.month + '-' + v.day
                let week = this.handleWeek(date)
                this.dateList.push({
                    left,
                    date,
                    month: v.month,
                    day: v.day,
                    week,
                    exist: false,
                })  
            })
            this.startDate = this.dateList[0].date
            this.endDate = this.dateList[this.dateList.length-1].date
            let day = sessionStorage.getItem('day')?JSON.parse(sessionStorage.getItem('day')):this.today
            this.scrollCur = this.dateList.findIndex(v => v.date === day)
        },
        handleWeek(day) {
            let week = ['周日','周一','周二','周三','周四','周五','周六']
            let index = new Date(day).getDay()
            return week[index]
        },
        //日期滚动读取
        scrollHand(pop){
            this.scrollLeft = pop.left
            if(this.scrollLeft>0&&this.scrollFlag){
                let flag=true
                let un=72/2-10
                let num
                let length = this.dateList.length
                for (var i=0; i<length; i++){
                    num=un+i*62
                    if(this.scrollLeft<=num && flag){
                        this.scrollCur=i
                        flag=false
                    }
                }
            }
        },
        //日期滚动离开
        touchEnd() {
            this.scrollFlag = true
            setTimeout(() => {
                this.scrollFlag = false
                this.$nextTick(() => {
                    this.$refs.scrollBox.reset({
                        left: this.dateList[this.scrollCur].left
                    })
                })
                let day = this.dateList[this.scrollCur].date
                this.CHANGE_DAY(day)
                sessionStorage.setItem('day', JSON.stringify(day))
            }, 300)
        },
        //日期点击
        scrollClick(index){
            if (this.scrollFlag) {
                this.scrollCur = index
                this.scrollFlag = false
                // setTimeout(() => {
                //     this.scrollFlag = true
                // }, 500)
                this.$nextTick(() => {
                    this.$refs.scrollBox.reset({
                        left: this.dateList[this.scrollCur].left
                    })
                })
            }
        },
    
    },
    computed: {
        ...mapState({
            day: state => state.schedule.day,
            scheduleDayList: state => state.schedule.scheduleDayList,
        })
    },
    watch: {
        scheduleDayList: function(data) {
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
                    this.dateList.map((v,i)=>{
                        v.exist = data.items[i].exist==='1'?true:false
                    })
                }
            }
        },
        noPlan: function(val) {
            if (val) {
                let index = this.dateList.findIndex(v => v.date === this.day)
                this.dateList[index].exist = false
            }
        }
    },
    components: {
      Scroller, Tabbar, TabbarItem
    },
}
</script>

<style lang="less">
// 日程菜单按钮
.plan-head .weui-tabbar {
  position: static; 
  padding: 0.5px 0;
  background: #ffffff;

  &::before {
      display: none;
  }

  .weui-tabbar__item {
    padding: 8px;
  }

  .weui-tabbar__icon {
    width: 16px;
    height: 16px;
  }
}
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
