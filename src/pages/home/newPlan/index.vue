<template>
    <div class="new-plan router-all">
        <!-- <scroller lock-x :height="this.ifCompleted?'-1':'-36'" ref="newScroller" :bounce="false"> -->
        <div  v-show="!showAddressBook" class="router-box">
            <!-- 头部主题 -->
            <div class="title">
                <input type="text" placeholder="请输入日程主题" v-model="titleValue" :disabled="ifView">
                <div>
                    <select v-model="selectValue" :disabled="true" @change="selectChange">
                        <option value="2">通用</option>
                        <option value="1">拜访</option>
                    </select>
                    <i></i>
                </div>
            </div>
            <!-- 通用选项 -->
            <group label-align="left" class="select-list">
                <x-switch title="全天" v-model="dayValue" :disabled="ifView" @click.native="dayChange"></x-switch>
                <datetime :title="datetimeTitle[0]" v-model="dateValue" @click.native="readOnly" @on-change="startChange"
                format="YYYY-MM-DD HH:mm" placeholder="请选择" :readonly="ifView||dayValue" />
                <datetime :title="datetimeTitle[1]" v-model="dateValue2" @click.native="readOnly" @on-change="endChange"
                format="YYYY-MM-DD HH:mm" placeholder="请选择" :readonly="ifView||dayValue" />
                <popup-picker title="提醒" :data="remindList" v-model="remindValue" :disabled="ifView"></popup-picker>
                <x-switch title="私密" v-model="secretValue" inline-desc="仅参与人及上级可见" :disabled="ifView"></x-switch>
            </group>
            <!-- 拜访选项 -->
            <group label-align="left" v-if="ifVisit">
                <cell title="拜访客户" value="必选" is-link :disabled="ifView" link="job/company?state1=1&state2=1&state3=0"></cell>
                <cell title="客户联系人" :value="customValue?customValue:'必选'" is-link :disabled="ifView" @click.native="custom(0)" :class="{'active': customValue}"></cell>
                <cell title="关联商机" :value="businessValue?businessValue:'必选'" is-link :disabled="ifView"  @click.native="custom(1)" :class="{'active': businessValue}"></cell>
                <popup-picker title="拜访方式" :data="visitList" v-model="visitValue" :disabled="ifView"></popup-picker>
            </group>
            <div v-transfer-dom>
                <popup v-model="showPop" height="100%" is-transparent should-scroll-top-on-show>
                    <div class="popup">
                        <div>
                            <checklist :max="checkNum" :options="customList" v-model="checkList"></checklist>
                        </div>
                        <div class="pop-btn">
                            <x-button type="primary" @click.native="confirm">确定</x-button>
                        </div>
                    </div>
                </popup>
            </div>
            <!-- 日程内容 -->
            <group label-align="left" class="textarea">
                <x-textarea :title="textareaTitle" :max="500" placeholder="输入文字不超过500字（必填）" :disabled="ifView" v-model="contentValue"></x-textarea>
            </group>
            <!-- 参与人 -->
            <addStaff :ifView='ifView' :ifSelf='true' @toggleAddress="toggleAddress"></addStaff>
            <!-- 情况说明 -->
            <group label-align="left" class="textarea" v-if="ifView&&contentValue2">
                <x-textarea title="情况说明" :max="200" disabled v-model="contentValue2"></x-textarea>
            </group>
        </div>
        <!-- </scroller> -->
        <!-- 查看时按钮 -->
        <flexbox :gutter="0" v-if="!showBtn&&!ifCompleted" class="btn">
            <flexbox-item>
                <div class="flex-demo vux-1px-r" @click="deletePlan()">
                    <img src="@/images/work/icon-delete2.png" alt="">
                    <a href="javascript:;">删除</a>
                </div>
            </flexbox-item>
            <flexbox-item>
                <div class="flex-demo vux-1px-r" @click="delayPlan()">
                    <img src="@/images/home/clock.png" alt="">
                    <a href="javascript:;">延时</a>
                </div>
            </flexbox-item>
            <flexbox-item>
                <div class="flex-demo vux-1px-r" @click="changePlan()">
                    <img src="@/images/home/write.png" alt="">
                    <a href="javascript:;">更改</a>
                </div>
            </flexbox-item>
            <flexbox-item>
                <div class="flex-demo" @click="doPlan()">
                    <img src="@/images/home/complete.png" alt="">
                    <a href="javascript:;">执行</a>
                </div>
            </flexbox-item>
        </flexbox>
        <!-- 提交按钮 -->
        <div v-if="showBtn" v-show="!showAddressBook">
            <x-button type="primary" @click.native="submit" :show-loading="loadFlag">提交</x-button>
        </div>
        <addressBook @toggleAddress="toggleAddress" v-show="showAddressBook" 
        :state1='1' :state2='1' :state3='0' :state4='0' :state5='1'/>
    </div>
</template>

<script>
import { Scroller, Group, XSwitch, Datetime, PopupPicker, XTextarea, Cell, XButton, Flexbox, FlexboxItem, TransferDom, Popup, Checklist } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import addStaff from '@/components/addStaff'
import addressBook from '@/components/addressBook'

export default {
    name: 'newPlan',
    data() {
        return {
            checkNum: 1,
            checkList: [],
            customList: [ 
                {
                    key:'1',
                    value:'sdkjfk',
                },
                {
                    key:'2',
                    value:'aa',
                },
                {
                    key:'3',
                    value:'bbb',
                },
                {
                    key:'4',
                    value:'我',
                },
            ],
            // 控制显示隐藏
            ifCompleted: false,   //是否已完成
            ifView: false,      //是否只读
            ifVisit: false,     //是否拜访
            showBtn: true,      //显示底部按钮
            showPop: false,     //显示弹出框
            showAddressBook: false,     //显示通讯录
            // 表单值
            titleValue: '',             //日程主题
            selectValue: '2',      //通用
            dayValue: false,            //全天
            datetimeTitle: ['开始', '结束'],
            dateValue: '',              //开始时间
            dateValue2: '',             //结束时间
            //时间限制
            dict: JSON.parse(localStorage.getItem('dict')),  //后台获取的字典列表
            remindValue: ['不提醒'],     //提醒时间
            remindList: [['不提醒', '准时', '提前10分钟', '提前30分钟', '提前1小时', '提前2小时', '提前6小时', '提前一天']],
            secretValue: false,         //是否私密
            customValue: '',            //客户联系人
            businessValue: '',          //关联商机
            visitValue: ['电话拜访'],    //拜访方式
            visitList: [['电话拜访', '现场拜访', '其他']],
            textareaTitle: '日程内容',
            textareaMax: 500,           //日程内容字数
            contentValue: '',           //日程内容
            contentValue2: '',          //情况说明

            year: 2018,
            month: 5,
            today: 5,
            ondutyTime: '09:00',
            offdutyTime: '17:30',
            loadFlag: false,
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            scheduleId: '',
            from: '2'
        }
    },
    created() {
        // 判断入口展示相应内容
        this.scheduleId = this.$route.params.sid
        let query = this.$route.query
        if (query.view) {
            document.title = '日程详情'
            this.ifView = true
            this.showBtn = false
            
            // this.ifCompleted = query.ifCompleted
        }
        this.SELECTED_MEMBER([])
        this.setToday()
        if (this.scheduleId!=='new') {
            let obj = {
                userId: this.userId,
                companyId: this.companyId,
                scheduleId: this.scheduleId,
                from: this.from
            }
            this.schedule_viewSchedule(obj)
        }
        // 设置提醒时间选项
        let arr = []
        this.dict.forEach(v => {
            arr.push(v.dictName)
        })
        this.remindList = [arr]
        this.remindValue = [this.remindList[0][0]]
    },
    methods: {
        ...mapMutations({
            SELECTED_MEMBER: 'addressBook/SELECTED_MEMBER',
        }),
        ...mapActions({
            schedule_saveSchedule: 'schedule/saveSchedule',
            schedule_viewSchedule: 'schedule/viewSchedule',
            schedule_delSchedule: 'schedule/delSchedule',
        }),
        // 获取今日日期
        setToday () {
            let now = new Date()
            let year = now.getFullYear()
            let cmonth = now.getMonth() + 1
            let day = now.getDate()
            if (cmonth < 10) cmonth = '0' + cmonth
            if (day < 10) day = '0' + day
            this.dateValue = this.day +' ' + this.ondutyTime
            this.dateValue2 = this.day +' ' + this.offdutyTime
            this.year = year
            this.month = cmonth
            this.today = day
        },
        // 选择 通过-拜访
        selectChange() {
            if (this.selectValue === '1') {
                this.ifVisit = true
            } else {
                this.ifVisit = false
            }
        },
        // 全天
        dayChange(ev) {
            if (ev.target.nodeName === 'INPUT') {
                if (!this.dayValue) {
                    this.dateValue = this.day +' ' + this.ondutyTime
                    this.dateValue2 = this.day +' ' + this.offdutyTime
                } else {
                    this.dateValue = this.dateValue2 = ''
                }
            }
        },
        readOnly() {
            if (this.dayValue&&!this.ifView) {
                this.$vux.toast.show({
                    text: '全天日程,时间不可修改！',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
        },
        // 拜访选项相关
        custom(num) {
            this.showPop = true
            // this.showBtn = false
            if (num) {
                this.checkNum = 1
            } else {
                this.checkNum = this.customList.length
            }
        },
        confirm() {
            this.showPop = false
            // this.showBtn = true
            if (this.checkNum === 1) {
                this.businessValue = this.checkList[0]
            } else {
                this.customValue = this.checkList.join(',')
            }
        },
        // 通讯录显示隐藏
        toggleAddress() {
            this.showAddressBook = !this.showAddressBook
            if (this.showAddressBook) {
                document.title = '企业通讯录'
            } else {
                document.title = this.$route.meta.title
            }
        },
        //时间限制
        startChange(value) {
            let endTime=this.dateValue2
            if(endTime.length>0){                
                endTime=endTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let startTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(startTime>=endTime){
                   this.$vux.toast.show({
                        text:'开始时间不能大于等于结束时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    }) 
                    setTimeout(() => {
                        this.dateValue='';
                    },500)
                    
                }
            }
        },
        endChange(value){
            let startTime=this.dateValue
            if(startTime.length>0){                
                startTime=startTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let endTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(endTime<=startTime){
                   this.$vux.toast.show({
                        text:'开始时间不能大于等于结束时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    }) 
                    setTimeout(() => {
                        this.dateValue2='';
                    },500)
                }
            }
        },
        // 提交表单
        submit() {
            if (this.loadFlag) {
                return
            }
            if (!this.titleValue) {
                this.$vux.toast.show({
                    text: '请填写日程主题！',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            if (!this.dateValue) {
                this.$vux.toast.show({
                    text: '开始时间不能为空！',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            if (!this.dateValue2) {
                this.$vux.toast.show({
                    text: '结束时间不能为空！',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            if (!this.contentValue) {
                this.$vux.toast.show({
                    text: '请填写日程内容！',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            if (this.titleValue.length>50) {
                this.$vux.toast.show({
                    text: '日程主题不能超过50个字！',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            let index = this.remindList[0].findIndex(v=>v===this.remindValue[0])
            let arr = []
            this.selectedMember.forEach(v => {
                arr.push(v.userId)
            })
            let obj = {
                userId: this.userId,
                companyId: this.companyId,
                subject: this.titleValue,
                scheduleType: this.selectValue,
                allDay: this.dayValue?'1':'0',
                startDate: this.dateValue,
                endDate: this.dateValue2,
                remindDateType: this.dict[index].dictId,
                privateIds: this.secretValue?this.userId:'',
                content: this.contentValue,
                articipantIds: arr.join(','),
            }
            this.schedule_saveSchedule(obj)
            this.loadFlag = true
        },
        // 删除延时更改执行
        deletePlan() {
            this.$vux.confirm.show({
                title: '提示',
                content: '您确定删除该日程吗？',
                onConfirm: ()=>{
                    let obj = {
                        userId: this.userId,
                        companyId: this.companyId,
                        scheduleId: this.scheduleId
                    }
                    this.schedule_delSchedule(obj)
                }
            })
        },
        delayPlan() {
            this.$router.push({path: '/page/changePlan/'+this.scheduleId, query: {delay: true}})
        },
        changePlan() {
            this.$router.push({path: '/page/changePlan/'+this.scheduleId, query: {change: true}})
        },
        doPlan() {
            this.$router.push({path: '/page/changePlan/'+this.scheduleId, query: {do: true}})
        },
    },
    computed: {
        ...mapState({
            day: state => state.schedule.day,
            selectedMember: state => state.addressBook.selectedMember,
            saveSchedule: state => state.schedule.saveSchedule,
            viewSchedule: state => state.schedule.viewSchedule,
            delSchedule: state => state.schedule.delSchedule,
        })
    },
    watch: {
        saveSchedule: function(data) {
            if(data) {
                this.loadFlag = false
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                    return
                } else {
                    this.$vux.confirm.show({
                        title: '提示',
                        content: '日程创建成功，是否添加新的日程？',
                        onCancel: ()=>{
                            this.$router.go('-1')
                        },
                        onConfirm: ()=>{
                            this.titleValue = ''
                            this.selectValue = '2'
                            this.dayValue = false
                            this.dateValue = this.day +' ' + this.ondutyTime
                            this.dateValue2 = this.day +' ' + this.offdutyTime
                            this.remindValue = [this.remindList[0][0]]
                            this.secretValue = false
                            this.visitValue = ['电话拜访']
                            this.contentValue = ''
                            this.SELECTED_MEMBER([{
                                userId: this.userId,
                                userName: this.$store.state.userInfo.user.trueName,
                                headPortrait: this.$store.state.userInfo.user.headLogo,
                            }])
                            this.$nextTick(() => {
                                $('.router-box').scrollTop(0)
                            })
                        }
                    })
                }
            }
        },
        viewSchedule: function(data) {
             if(data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                    return
                } else {
                    this.titleValue = data.items.subject
                    this.selectValue = data.items.scheduleType
                    this.dayValue = data.items.allDay === '1'?true:false
                    this.dateValue = data.items.startDate
                    this.dateValue2 = data.items.endDate
                    let index = this.dict.findIndex(v=>v.dictId===data.items.remindDateType)
                    this.remindValue = [this.remindList[0][index]]
                    this.secretValue = data.items.privateIds?true:false
                    // this.visitValue = ['电话拜访']
                    this.contentValue = data.items.content
                    this.contentValue2 = data.items.execution
                    let arr = []
                    data.items.participantList.forEach((v, i) => {
                        if (v.participantId !== this.userId) {
                            arr.push({
                                userId: v.participantId,
                                userName: v.participantName,
                                headPortrait: v.participantPhotoId
                            })
                        }
                    })
                    this.SELECTED_MEMBER(arr)
                    if (data.items.createUserId !== this.userId || data.items.status==='3') {
                        this.ifCompleted = true
                    }
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
                    this.$vux.toast.show({
                        text: '删除成功！',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.back()
                }
            }
        },
    },
    directives: {
        TransferDom
    },
    components: {
      Scroller, Group, XSwitch, Datetime, PopupPicker, XTextarea, Cell, XButton, Flexbox, FlexboxItem, Popup, Checklist,
      addStaff, addressBook
    },
    // beforeRouteEnter (to, from, next) {
    //     // 在渲染该组件的对应路由被 confirm 前调用
    //     // 不！能！获取组件实例 `this`
    //     // 因为当守卫执行前，组件实例还没被创建
    //     if (from.name === 'home' || from.name === 'myPlan') {
    //         next(vm => {
    //             // 通过 `vm` 访问组件实例
    //             vm.$refs.newScroller.reset({
    //                 top: 0
    //             })
    //             vm.titleValue = ''
    //             vm.selectValue = '2'
    //             vm.dayValue = false
    //             vm.dateValue = vm.year + '-' + vm.month + '-' + vm.day +' 09:00'
    //             vm.dateValue2 = vm.year + '-' + vm.month + '-' + vm.day +' 17:30'
    //             vm.remindValue = ['不提醒']
    //             vm.secretValue = false
    //             vm.visitValue = ['电话拜访']
    //             vm.contentValue = ''
    //         })
    //     } else {
    //         next()
    //     }
    // },
}
</script>

<style lang="less">
.new-plan .title input:disabled,.new-plan .title input[disabled] {
    background: #fff !important;  
    opacity: 1;
    -webkit-text-fill-color: #333;
}
.new-plan .textarea textarea:disabled,.new-plan .textarea input[disabled] {
    background: #fff;
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
}
// .new-plan .weui-label,.new-plan .vux-datetime p,.new-plan .vux-label {
    // color: #666;
// }
.new-plan .select-list .weui-cell__bd {
    display: flex;
    justify-content: space-between;
}
.new-plan .select-list .weui-label {
    display: inline-block !important;
}
.new-plan .vux-datetime.weui-cell p {
    color: #333;
}
.new-plan .vux-cell-value {
    color: #333;
}
.new-plan .select-list .vux-label-desc {
    margin-right: 5px;
    font-size: 16px;
    color: @blue;
}
// 输入框内容位置更改
.new-plan .vux-x-textarea {
    flex-direction: column;
}

.new-plan .vux-x-textarea .weui-cell__bd {
    width: 100%;
}

.new-plan .active .weui-cell__ft {
  color: #333;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
