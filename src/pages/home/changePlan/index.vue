<template>
    <div class="new-plan router-all">
        <!-- <scroller ref="newScroller" lock-x height="-36" :bounce="false"> -->
        <div v-show="!showAddressBook" class="router-box">
            <!-- 头部主题 -->
            <div class="title" v-if="ifChangeAll">
                <input type="text" placeholder="请输入日程主题" v-model="titleValue">
                <div>
                    <select v-model="selectValue" :disabled="true" @change="selectChange">
                        <option value="2">通用</option>
                        <option value="1">拜访</option>
                    </select>
                    <i></i>
                </div>
            </div>
            <!-- 通用选项 -->
            <group label-align="left" v-if="ifDate" class="select-list">
                <x-switch title="全天" v-model="dayValue" v-if="ifChangeAll" @click.native="dayChange"></x-switch>
                <datetime :title="datetimeTitle[0]" v-model="dateValue"  @click.native="readOnly" @on-change="startChange"
                format="YYYY-MM-DD HH:mm" placeholder="请选择" :readonly="dayValue&&ifChangeAll" />
                <datetime :title="datetimeTitle[1]" v-model="dateValue2" @click.native="readOnly" @on-change="endChange"
                format="YYYY-MM-DD HH:mm" placeholder="请选择" :readonly="dayValue&&ifChangeAll" />
                <popup-picker title="提醒" :data="remindList" v-model="remindValue" v-if="ifChangeAll"></popup-picker>
                <x-switch title="私密" v-model="secretValue" inline-desc="仅参与人及上级可见" v-if="ifChangeAll"></x-switch>
            </group>
            <!-- 拜访选项 -->
            <group label-align="left" v-if="ifVisit">
                <cell title="拜访客户" value="必选" is-link  link="/page/job/company?state1=0&state2=1&state3=0"></cell>
                <cell title="客户联系人" :value="customValue?customValue:'必选'" is-link @click.native="custom(0)" :class="{'active': customValue}"></cell>
                <cell title="关联商机" :value="businessValue?businessValue:'必选'" is-link  @click.native="custom(1)" :class="{'active': businessValue}"></cell>
                <popup-picker title="拜访方式" :data="visitList" v-model="visitValue"></popup-picker>
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
            <group label-align="left">
                <x-textarea ref="textarea1" :title="textareaTitle" :max="textareaMax" :placeholder="placeholder" v-model="contentValue"></x-textarea>
            </group>
            <!-- 参与人 -->
            <addStaff :ifSelf='true' @toggleAddress="toggleAddress" v-if="ifChangeAll"/>
            <!-- 情况说明 -->
            <group label-align="left" class="textarea" v-if="ifChangeAll&&contentValue2">
                <x-textarea ref="textarea2" title="情况说明" :max="200" v-model="contentValue2" disabled></x-textarea>
            </group>
        </div>
        <!-- </scroller> -->
        <!-- 提交按钮 -->
        <div v-show="!showAddressBook">
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
    name: 'changePlan',
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
            ifChangeAll: false,         //是否变更所有
            ifVisit: false,             //是否拜访
            ifDate: true,               //是否显示日期
            showPop: false,             //显示弹出框
            showAddressBook: false,     //显示通讯录
            // 表单值
            titleValue: '',             //日程主题
            selectValue: 'normal',      //通用
            dayValue: false,            //全天
            datetimeTitle: ['开始', '结束'],
            dateValue: '',              //开始时间
            dateValue2: '',             //结束时间
            dict: JSON.parse(localStorage.getItem('dict')),  //后台获取的字典列表
            remindValue: ['不提醒'],     //提醒时间
            remindList: [['不提醒', '准时', '提前10分钟', '提前30分钟', '提前1小时', '提前2小时', '提前6小时', '提前一天']],
            secretValue: false,         //是否私密
            customValue: '',            //客户联系人
            businessValue: '',          //关联商机
            visitValue: ['电话拜访'],    //拜访方式
            visitList: [['电话拜访', '现场拜访', '其他']],
            textareaTitle: '日程内容',
            placeholder: '输入文字不超过500字（必填）',
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
        if (query.delay) {
            document.title = '日程延时'
            this.textareaTitle = '延时说明'
            this.placeholder = '输入文字不超过200字（必填）'
            this.textareaMax = 200
        }
        if (query.change) {
            this.ifChangeAll = true
            // 设置提醒时间选项
            let arr = []
            this.dict.forEach(v => {
                arr.push(v.dictName)
            })
            this.remindList = [arr]
            this.remindValue = [this.remindList[0][0]]
        }
        if (query.do) {
            document.title = '日程执行'
            this.ifDate = false
            this.textareaTitle = ''
            this.placeholder = '请输入您的执行情况（不超过200字）'
            this.textareaMax = 200
        }
        this.setToday()
        let obj = {
            userId: this.userId,
            companyId: this.companyId,
            scheduleId: this.scheduleId,
            from: this.from,
        }
        this.schedule_viewSchedule(obj)
    },
    methods: {
        ...mapMutations({
            SELECTED_MEMBER: 'addressBook/SELECTED_MEMBER',
        }),
        ...mapActions({
            schedule_saveSchedule: 'schedule/saveSchedule',
            schedule_viewSchedule: 'schedule/viewSchedule',
            schedule_delaySchedule: 'schedule/delaySchedule',
            schedule_executeSchedule: 'schedule/executeSchedule',
        }),
        // 获取今日日期
        setToday (value) {
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
            if (this.selectValue === 'visit') {
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
            if (this.dayValue&&this.ifChangeAll) {
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
            //更改
            if (this.ifChangeAll) {
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
                //时间不能大于等于
                let startTime=this.dateValue
                let endTime=this.dateValue2
                let timeFlag1=startTime.substring(0,10).replace(/-/g, "")
                let timeFlag2=endTime.substring(0,10).replace(/-/g, "")
                if(timeFlag1==timeFlag2){
                    let timeFlag3=startTime.substring(11,13)
                    let timeFlag4=endTime.substring(11,13)
                    if(timeFlag3>timeFlag4){
                        this.$vux.toast.show({
                            text: '开始时间不能大于等于结束时间',
                            type: 'text',
                            position: 'top',
                            width:'20em'
                        })
                        this.endTime=''
                        return
                    }else if(timeFlag3==timeFlag4){
                        let timeFlag5=startTime.substring(14,16)
                        let timeFlag6=endTime.substring(14,16)
                        if(timeFlag5>=timeFlag6){
                            this.$vux.toast.show({
                                text: '开始时间不能大于等于结束时间',
                                type: 'text',
                                position: 'top',
                                width:'20em'
                            })
                            this.endTime=''
                            return
                        }
                    }
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
                let arr = [this.userId]
                this.selectedMember.forEach(v => {
                    arr.push(v.userId)
                })
                let obj = {
                    userId: this.userId,
                    companyId: this.companyId,
                    scheduleId: this.scheduleId,
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
                console.log(obj)
                this.schedule_saveSchedule(obj)
                this.loadFlag = true
            //执行
            } else if (!this.ifDate) {
                if (!this.contentValue) {
                    this.$vux.toast.show({
                        text: '请输入执行情况！',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return
                }
                let obj = {
                    userId: this.userId,
                    companyId: this.companyId,
                    scheduleId: this.scheduleId,
                    desc: this.contentValue,
                }
                this.schedule_executeSchedule(obj)
                this.loadFlag = true
            //延时    
            } else {
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
                        text: '请输入延时说明！',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return
                }
                // let arr = this.dateValue.split(' ')
                // let arr2 = this.dateValue2.split(' ')
                // if (arr[0] === arr2[0] && arr[1] === this.ondutyTime && arr2[1] === this.offdutyTime) {
                //     this.dayValue = true
                // } else {
                //     this.dayValue = false
                // }
                if (this.dateValue !== this.viewSchedule.items.startDate || this.dateValue2 !== this.viewSchedule.items.endDate) {
                    this.dayValue = false
                }
                let obj = {
                    userId: this.userId,
                    companyId: this.companyId,
                    scheduleId: this.scheduleId,
                    allDay: this.dayValue?'1':'0',
                    startDate: this.dateValue,
                    endDate: this.dateValue2,
                    desc: this.contentValue,
                }
                console.log(obj)
                this.schedule_delaySchedule(obj)
                this.loadFlag = true
            }
        }
    },
    computed: {
        ...mapState({
            day: state => state.schedule.day,
            selectedMember: state => state.addressBook.selectedMember,
            saveSchedule: state => state.schedule.saveSchedule,
            viewSchedule: state => state.schedule.viewSchedule,
            delaySchedule: state => state.schedule.delaySchedule,
            executeSchedule: state => state.schedule.executeSchedule,
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
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.$vux.toast.show({
                        text: '日程变更成功！',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.go('-1')
                }
            }
        },
        viewSchedule: function(data) {
            if(data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
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
                    // this.$nextTick(() => {
                    //     this.$refs.textarea1.updateAutosize()
                    //     if(this.$refs.textarea2) {
                    //         this.$refs.textarea2.updateAutosize()
                    //     }
                    // })
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
                    if (this.ifChangeAll) {
                        this.contentValue = data.items.content
                        this.contentValue2 = data.items.execution
                    }
                    // this.$nextTick(()=>{
                    //     this.$refs.newScroller.reset()
                    // })
                }
            }
        },
        delaySchedule: function(data) {
            if(data) {
                this.loadFlag = false
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
                        text: '该日程延期成功！',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.go('-1')
                }
            }
        },
        executeSchedule: function(data) {
            if(data) {
                this.loadFlag = false
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
                        text: '该日程执行成功！',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.go('-1')
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
}
</script>

<style lang="less">
// .new-plan .title input:disabled {
//     background: #fff;
// }
// .new-plan textarea:disabled {
//     background: #fff;
// }
// .new-plan .weui-label,.new-plan .vux-datetime p,.new-plan .vux-label {
    // color: #666;
// }
.new-plan .textarea textarea:disabled,.new-plan .textarea input[disabled] {
    background: #fff;
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
}
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
 @import '../newPlan/index.less';
</style>
