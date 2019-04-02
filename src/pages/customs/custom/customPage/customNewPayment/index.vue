<template>
    <div class="customNewPayment router-all">
        <div class="router-box">
            <!-- 姓名 -->
            <group>
                <x-input title="客户：" v-model="nameValue" placeholder="请填写姓名（必填）" disabled :class="{'has': nameValue}" />
            </group>
            <!-- 公司提醒时间状态 -->
            <group>
                <x-textarea ref="companyInput" title="公司：" v-model="companyValue" :show-counter="false" :rows="1" :max="30" autosize placeholder="请填写公司名（必填）"
                 @on-change="valueChange(companyValue, 'companyInput', 'companyValue')" :disabled="!!state||!edit" :class="{'has': companyValue}" />
                <datetime title="提醒时间：" v-model="remindTime" :readonly="state==1||!edit" @on-change="remindChange" format="YYYY-MM-DD HH:mm" placeholder="请选择（必选）" />
                <cell title="状态：" :value="payValue.label?payValue.label:'请选择回款状态（必选）'" :disabled="!!state||!edit" is-link
                 @click.native="checkHand" value-align="left" :class="{'has': payValue.label}" />
            </group>
            <!-- 合同回款内容 -->
            <group>
                <x-textarea ref="titleInput" title="标题：" v-model="titleValue" :rows="1" autosize :show-counter="false" :max="30" placeholder="请填写标题（必填）"
                 :disabled="!!state||!edit" @on-change="valueChange(titleValue, 'titleInput', 'titleValue')" :class="{'has': titleValue}"/>
                <cell title="合同编号：" :value="contractNum?contractNum:'请选择（必选）'" is-link :disabled="!!state||!edit" value-align="left"
                 @click.native="toContract" :class="{'has': contractNum}" />
                <datetime title="起始时间：" v-model="startTime" :readonly="!!state||!edit" @on-change="startChange" placeholder="请选择（必选）" />
                <datetime title="终止时间：" v-model="endTime" :readonly="!!state||!edit" @on-change="endChange" placeholder="请选择（必选）" />
                <x-input ref="allMoneyInput" title="总金额：" :show-clear="false" v-model="allMoneyValue" :disabled="!!state||!edit||moneyFlag"
                  @on-focus="moneyFocus(allMoneyValue, -1)" @on-change="moneyChange(allMoneyValue, -1)" @on-blur="moneyBlur(allMoneyValue, -1)" :max="16" placeholder="请填写总金额（必填）" :class="{'has': allMoneyValue}" />
                <popup-picker title="回款方式：" :data="payTypeList" :disabled="!!state||!edit" v-model="payTypeValue" />
                <popup-picker title="回款期数：" v-show="payTypeValue[0]==='分期'" show-name :disabled="!!state||!edit" :data="payCountList" v-model="payCountValue" />
                <datetime title="回款时间：" v-model="allPayTime" :readonly="!!state||!edit" @on-change="allPayChange" v-if="payTypeValue[0]==='全款'" placeholder="请选择（必选）" />
            </group>
            <!-- 分期 -->
            <div v-if="payTypeValue[0]==='分期'">
                <group v-for="i in parseInt(payCountValue[0])" class="content" :key="i">
                    <group-title slot="title">
                        {{titleList[i-1]}}期
                        <x-button v-if="stageList[i-1].state||!notSelf" mini plain :disabled="btnFlag" v-show="!edit" @click.native="completeHand(i-1)" :class="stageList[i-1].state?'completed':'complete'">
                            {{stageList[i-1].state?'已完成':'回款完成'}}
                        </x-button>
                    </group-title>
                    <x-input title="金额：" :show-clear="false" :disabled="!!stageList[i-1].state||!edit||stageList[i-1].moneyFlag" v-model="stageList[i-1].money"
                      @on-focus="moneyFocus(stageList[i-1].money, i-1)" @on-change="moneyChange(stageList[i-1].money, i-1)" @on-blur="moneyBlur(stageList[i-1].money, i-1)" :max="16" placeholder="请填写金额（必填）" :class="{'has': stageList[i-1].money}" />
                    <datetime title="回款时间：" v-model="stageList[i-1].time" :readonly="!!stageList[i-1].state||!edit" @on-change="payChange(i)" placeholder="请选择（必选）" />
                </group>
            </div>
            <!-- 备注 -->
            <FormA :moduleObj="moduleObj" v-if="showFormA"></FormA>
        </div>
        <div class="btn" v-if="state!==1">
            <div class="btn-box" v-if="!edit">
                <x-button :class="payTypeValue[0]==='全款'?'left':''" type="primary" @click.native="moduleObj.disabledFlag=false, edit=true">编辑</x-button>
                <x-button v-if="payTypeValue[0]==='全款'" class="right" type="primary" @click.native="completeHand">回款完成</x-button>
            </div>
            <x-button type="primary" @click.native="submit" v-else :show-loading="btnFlag" :disabled="btnFlag">立即保存</x-button>
        </div>
        <!-- popup -->
        <div v-transfer-dom>
            <!-- 回款状态列表 -->
            <popup v-model="pay" width="100%" position="right" v-if="pay">
                <div class="popup">
                    <checkers :checkValue="[payValue.value]" show="pay" :save="true" @toggle="togglePop"/>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import { trim, Group, GroupTitle, Cell, XButton, XTextarea, XInput, PopupPicker, Datetime, Flexbox, FlexboxItem, TransferDom, Popup } from 'vux'
import { objDeepCopy, checkPrice, checkEmoji, checkMoney } from '@/util/index'
import { mapState,mapActions,mapMutations } from 'vuex'
import FormA from '@/components/formA'
import checkers from '@/components/checkers'
let _timer;
export default {
    name: 'customNewPayment',
    data() {
        return {
            showFormA: false,
            customerId: 0,
            highSeas: 1,         //是否公海客户
            id: '',
            notSelf: false,
            contractId: '',
            edit: false,
            btnFlag: false,
            state: 1,
            nameValue: '',
            companyValue: '',
            remindTime: '',
            pay: false,
            payValue: {label: '', value: ''},
            titleValue: '',
            contractNum: '',
            startTime: '',
            endTime: '',
            moneyFlag: true,
            allMoneyValue: '',
            payTypeList: [['全款', '分期']],
            payTypeValue: ['全款'],
            payCountList: [[]],
            payCountValue: ['6'],
            titleList: ['一', '二', '三', '四', '五', '六'],
            allPayTime: '',
            stageList: [{
                money: '',
                time: '',
                state: 0,
                moneyFlag: true
             },{
                money: '',
                time: '',
                state: 0,
                moneyFlag: true
             },{
                money: '',
                time: '',
                state: 0,
                moneyFlag: true
             },{
                money: '',
                time: '',
                state: 0,
                moneyFlag: true
             },{
                money: '',
                time: '',
                state: 0,
                moneyFlag: true
             },{
                money: '',
                time: '',
                state: 0,
                moneyFlag: true
            }],
            // 附件图片
            moduleObj: {
                title: '备注：',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '',
                uploadData: [],
                record: true,
                disabledFlag: false,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 9,
            },
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
        }
    },
    created() {
        this.payCountList = [JSON.parse(localStorage.getItem('payInstallList'))]
    },
    methods: {
        ...mapActions({
            customerattach_uploadFile: 'customerattach/uploadFile',
            customerrecpay_paymentDetail: 'customerrecpay/paymentDetail',
            customerrecpay_addPayment: 'customerrecpay/addPayment',
            customerrecpay_updatePayment: 'customerrecpay/updatePayment',
            customerrecpay_receivePayment: 'customerrecpay/receivePayment',
        }),
        ...mapMutations({
            UPDATE_LOADING: 'UPDATE_LOADING',
        }),
        //跳转hezd    ===========change
        toContract(){
            if (!!this.state||!this.edit) {
                return
            }
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                this.$router.push({name: 'searchResult', query: {ifContract: true, id: this.contractId, customerId:this.customerId, name: this.nameValue, company: this.companyValue}})
            },300)
        },
        now() {
            let date = new Date()
            let month = date.getMonth() + 1
            let strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = "0" + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate
            }
            var currentdate = date.getFullYear() + '-' + month + '-' + strDate
                    + " " + date.getHours() + ':' + date.getMinutes()
            return currentdate
        },
        dateToStr(date) {
            let time = date.split(' ')
            let time1 = time[0].replace(/-/g, "")
            let time2 = time[1].replace(/:/g, "")
            return time1 + time2
        },
        checkHand() {
            if (!!this.state||!this.edit) {
                return
            }
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                this.pay = true
            },300)
        },
        //时间限制
        remindChange(value) {
            if (!!this.state||!this.edit) {
                return
            }
            if (this.remindTime.length>0) {
                let seleteTime = this.dateToStr(this.remindTime)
                let currentTime = this.dateToStr(this.now())
                if (seleteTime-currentTime<0) {
                    this.$vux.toast.show({
                        text: '提醒时间需大于当前时间',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$nextTick(() => {
                        this.remindTime=''
                    })
                    return
                }
            }
        },
        startChange(value) {
            if (!!this.state||!this.edit) {
                return
            }
            let startTime = value.replace(/-/g, "")
            if(this.endTime.length>0) {
                let endTime = this.endTime.replace(/-/g, "")
                if (startTime>endTime) {
                   this.$vux.toast.show({
                        text:'起始时间不能大于终止时间',
                        type: 'text',
                        position: 'top',
                        width:"18em"                                
                    }) 
                    this.$nextTick(() => {
                        this.startTime=''
                    })
                    return
                }
            }
            if (this.payTypeValue[0]==='全款') {
                let allPayTime = this.allPayTime.replace(/-/g, "")
                if (this.allPayTime.length>0&&startTime>allPayTime) {
                this.$vux.toast.show({
                        text:'起始时间不能大于回款时间',
                        type: 'text',
                        position: 'top',
                        width:"18em"                                
                    }) 
                    this.$nextTick(() => {
                        this.startTime=''
                    })
                    return
                }
            }
            if (this.payTypeValue[0]==='分期') {
                let payTime0 = this.stageList[0].time.replace(/-/g, "")
                if (this.stageList[0].time.length>0&&startTime>payTime0) {
                this.$vux.toast.show({
                        text:'起始时间不能大于分期回款时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    }) 
                    this.$nextTick(() => {
                        this.startTime=''
                    })
                    return
                }
            }
        },
        endChange(value) {
            if (!!this.state||!this.edit) {
                return
            }
            if(this.startTime.length>0) {
                let startTime = this.startTime.replace(/-/g, "")
                let endTime = value.replace(/-/g, "")
                if (endTime<startTime) {
                   this.$vux.toast.show({
                        text:'终止时间不能小于起始时间',
                        type: 'text',
                        position: 'top',
                        width:"18em"                                
                    })
                    this.$nextTick(() => {
                        this.endTime=''
                    })
                }
            }
        },
        allPayChange(value) {
            if (!!this.state||!this.edit) {
                return
            }
            if(this.allPayTime.length>0) {
                let startTime = this.startTime.replace(/-/g, "")
                let endTime = value.replace(/-/g, "")
                if (endTime<startTime) {
                   this.$vux.toast.show({
                        text:'回款时间不能小于起始时间',
                        type: 'text',
                        position: 'top',
                        width:"18em"                                
                    })
                    this.$nextTick(() => {
                        this.allPayTime=''
                    })
                }
            }
        },
        payChange(i, value) {
            if (!!this.stageList[i-1].state||!this.edit) {
                return
            }
            if(this.stageList[i-1].time.length>0) {
                let count = parseInt(this.payCountValue[0])
                let startTime = this.startTime.replace(/-/g, "")
                let endTime = this.stageList[i-1].time.replace(/-/g, "")
                if (endTime<startTime) {
                   this.$vux.toast.show({
                        text:'分期回款时间不能小于起始时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    })
                    this.$nextTick(() => {
                        this.stageList[i-1].time=''
                    })
                    return
                }
                if (count>i&&this.stageList[i].time.length>0) {
                    let nextTime = this.stageList[i].time.replace(/-/g, "")
                    if (nextTime<endTime) {
                        this.$vux.toast.show({
                            text:'本期回款时间不能大于下期回款时间',
                            type: 'text',
                            position: 'top',
                            width:"22em"                                
                        })
                        this.$nextTick(() => {
                            this.stageList[i-1].time=''
                        })
                        return
                    }
                }
                if (i>1) {
                    let startTime = this.stageList[i-2].time.replace(/-/g, "")
                    let endTime = this.stageList[i-1].time.replace(/-/g, "")
                    if (endTime<startTime) {
                        this.$vux.toast.show({
                            text:'本期回款时间不能小于上期回款时间',
                            type: 'text',
                            position: 'top',
                            width:"22em"                                
                        })
                        this.$nextTick(() => {
                            this.stageList[i-1].time=''
                        })
                        return
                    }
                }
            }
        },
        // input改变
        valueChange(val, refStr, valuestr, max) {
            if (!val||!!this.state||!this.edit) {
                return
            }
            val = trim(val)
            val = val.replace("\r|\n", "")
            val = checkEmoji(val)
            this.$nextTick(()=>{
                this[valuestr] = val
            })
        },
        // 千分符,两位小数
        money(val) {
            val = val.toString()
            val = val.replace(/[^\d|\.]/g,"")
            val = isNaN(parseFloat(val))?0:parseFloat(val)
            val = Math.round(val*100)/100
            if (val < 0.01) {
                val = 0.00
            } else if (val > 9999999999) {
                val = 9999999999.99
            }
            let arr = val.toString().split('.')
            if (arr.length==1) {
                arr[1] = "00"
            } else if (arr.length>1) {
                if (arr[1].length<2) {
                    arr[1] = arr[1].toString()+"0"
                }
            }
            arr[0] = checkMoney(arr[0])
            val = arr.join('.')
            return val
        },
        // 金额获取焦点
        moneyFocus(val, i) {
            if (!val||this.state===1||!this.edit) {
                return
            }
            if (i === -1) {
                this.moneyFlag = false
            } else {
                this.stageList[i].moneyFlag = false
            }
            val = val.replace(/\,/g, '')
            if (i === -1) {
                this.$nextTick(()=>{
                    this.allMoneyValue = val
                })
            } else {
                this.$nextTick(()=>{
                    this.stageList[i].money = val
                })
            }
        },
        // 金额改变 66
        moneyChange(val, i) {
            if (!val||this.state===1||!this.edit||i!==-1&&!!this.stageList[i].state) {
                return
            }
            if (i === -1 && this.moneyFlag) {
                return
            } else if (i!== -1 && this.stageList[i].moneyFlag){
                return
            }
            if (!checkPrice(val)) {
                val = val.substring(0, val.length-1)
            }
            if (i === -1) {
                this.$nextTick(()=>{
                    this.allMoneyValue = val
                })
            } else {
                this.$nextTick(()=>{
                    this.stageList[i].money = val
                })
            }
        },
        // 金额失去焦点
        moneyBlur(val, i) {
            if (!val||this.state===1||!this.edit||i!==-1&&!!this.stageList[i].state) {
                return
            }
            if (i === -1) {
                this.moneyFlag = true
            } else {
                this.stageList[i].moneyFlag = true
            }
            val = val.toString()
            val = this.money(val)
            if (i === -1) {
                this.$nextTick(()=>{
                    this.allMoneyValue = val
                    setTimeout(()=>{
                        this.moneyFlag = false
                    }, 20)
                })
            } else {
                this.$nextTick(()=>{
                    this.stageList[i].money = val
                    setTimeout(()=>{
                        this.stageList[i].moneyFlag = false
                    }, 20)
                })
            }
        },
        // popup
        togglePop(obj) {
            this.payValue = obj
            this.pay = false
        },
        // 回款完成
        completeHand(index) {
            if (this.notSelf) {
                return
            }
            if (typeof(index)!=='number') {
                let obj = {
                    company_id: this.companyId,
                    user_id: this.userId,
                    id: this.id,
                }
                this.btnFlag = true
                this.customerrecpay_receivePayment(obj)
                return
            } else if (!this.stageList[index].money||!this.stageList[index].time||this.stageList[index].state) {
                return
            } else if (index!==0&&!this.stageList[index-1].state) {
                this.$vux.toast.show({
                    text: '请先完成上期回款',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                id: this.id,
                stage_id: this.stageList[index].id,
            }
            this.btnFlag = true
            this.customerrecpay_receivePayment(obj)
        },
        requsetHand() {
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                customer_id: this.customerId,
                receive_company_name: this.companyValue,
                remind_time: this.remindTime,
                status_id: parseInt(this.payValue.value),
                title: this.titleValue,
                contract_id: this.contractId,
                contract_start_time: this.startTime,
                contract_end_time: this.endTime,
                plan_receive_time: this.allPayTime,
                total_amout: this.allMoneyValue?parseFloat(this.allMoneyValue.replace(/\,/g, '')):'',
                received_payment_type: this.payTypeValue[0]==='全款'?1:2,
                note: this.moduleObj.inputVal,
                attach_ids: this.moduleObj.uploadData.map(v=>v.id).join(',')
            }
            if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                obj.attach_ids = obj.attach_ids + ',' + this.moduleObj.recordObj.id
            }
            if (obj.received_payment_type === 2) {
                let length = parseInt(this.payCountValue[0])
                obj.installment_num = length
                obj.stages = JSON.stringify(this.stageList.slice(0, length).map(v=>{
                    return {
                        amout: v.money?parseFloat(v.money.replace(/\,/g, '')):'',
                        plan_receive_time: v.time,
                    }
                }))
            }
            console.log(obj, 'submit')
            if (this.id) {
                obj.id = this.id
                this.customerrecpay_updatePayment(obj)
            } else {
                this.customerrecpay_addPayment(obj)
            }
        },
        requsetImg() {
            let index = this.moduleObj.uploadData.findIndex(v=>!v.id)
            if (index !== -1) {
                let length = this.moduleObj.uploadData.length
                let arr = objDeepCopy(this.moduleObj.uploadData).splice(index, length)
                let obj = {
                    company_id: this.companyId,
                    user_id: this.userId,
                    source: 8,
                    // source_id: this.customerId,
                    upfile_base64: JSON.stringify(arr.map(v=>{
                        return {
                            origin_name: v.name,
                            data: v.src
                        }
                    })),
                }
                this.customerattach_uploadFile(obj)
            } else {
                this.requsetHand()
            }
        },
        // 提交
        submit() {
            if (!this.companyValue) {
                this.$vux.toast.show({
                    text: '公司未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.remindTime) {
                this.$vux.toast.show({
                    text: '提醒时间未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            let seleteTime = this.dateToStr(this.remindTime)
            let currentTime = this.dateToStr(this.now())
            if (seleteTime-currentTime<0) {
                this.$vux.toast.show({
                    text: '提醒时间需大于当前时间',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.payValue.value) {
                this.$vux.toast.show({
                    text: '回款状态未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.titleValue) {
                this.$vux.toast.show({
                    text: '回款计划标题未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.contractNum) {
                this.$vux.toast.show({
                    text: '合同未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.startTime) {
                this.$vux.toast.show({
                    text: '合同起始时间未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.endTime) {
                this.$vux.toast.show({
                    text: '合同终止时间未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.allMoneyValue) {
                this.$vux.toast.show({
                    text: '总金额未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.payTypeValue[0]==='分期') {
                let length = parseInt(this.payCountValue[0])
                let arr = this.stageList.slice(0, length)
                if (arr.some(v=>!v.money)) {
                    this.$vux.toast.show({
                        text: '分期金额未填写，请填写',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                if (arr.some(v=>!v.time)) {
                    this.$vux.toast.show({
                        text: '分期回款时间未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            } else {
                if (!this.allPayTime) {
                    this.$vux.toast.show({
                        text: '回款时间未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
            this.requsetImg()
            this.btnFlag = true
            this.UPDATE_LOADING(true)
        }
    },
    computed: {
        ...mapState({
            uploadFileData: state => state.customerattach.uploadFileData,
            paymentDetail: state => state.customerrecpay.paymentDetail,
            addPayment: state => state.customerrecpay.addPayment,
            updatePayment: state => state.customerrecpay.updatePayment,
            receivePayment: state => state.customerrecpay.receivePayment,
        })
    },
    watch: {
        payTypeValue(data) {
            if (data[0] === '全款') {
                this.stageList = [{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                }]
            } else {
                this.stageList.forEach(v=>v.moneyFlag = false)
            }
        },
        uploadFileData(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'customNewPayment') {
                if (data.alert_msg) {
                    this.UPDATE_LOADING(false)
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.btnFlag = false
                    return
                } else {
                    let arr = data.items.map(v=>{
                        return {
                            name: v.name,
                            src: v.url,
                            id: v.id,
                        }
                    })
                    let index = this.moduleObj.uploadData.findIndex(v=>!v.id)
                    if (index !==-1) {
                        this.moduleObj.uploadData = this.moduleObj.uploadData.slice(0, index).concat(arr)
                    }
                    this.requsetHand()
                }
            }
        },
        paymentDetail(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'customNewPayment') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.edit = false
                    let item = data.items
                    this.state = item.state     //回款状态:0-未开始;1-已完成;2-已开始(未完成);
                    this.customerId = item.customer_id
                    this.nameValue = item.customer_name
                    this.companyValue = item.receive_company_name
                    this.remindTime = item.remind_time
                    this.payValue = {label: item.status_name, value: item.status_id}
                    this.titleValue = item.title
                    this.contractId = item.contract_id
                    this.contractNum = item.contract_num
                    this.startTime = item.contract_start_time
                    this.endTime = item.contract_end_time
                    this.allMoneyValue = item.total_amout?this.money(item.total_amout):''
                    this.payTypeValue = item.received_payment_type==1?['全款']:['分期']
                    this.payCountValue = item.installment_num?[`${item.installment_num}`]:['6']
                    this.allPayTime = item.plan_receive_time
                    let arr = item.stageList?item.stageList.map(v=>{
                        return {
                            id: v.id,
                            money: v.amout?this.money(v.amout):'',
                            time: v.plan_receive_time,
                            state: v.state,
                            moneyFlag: true
                        }
                    }):[]
                    let array = [{
                            money: '',
                            time: '',
                            state: 0,
                            moneyFlag: true
                        },{
                            money: '',
                            time: '',
                            state: 0,
                            moneyFlag: true
                        },{
                            money: '',
                            time: '',
                            state: 0,
                            moneyFlag: true
                        },{
                            money: '',
                            time: '',
                            state: 0,
                            moneyFlag: true
                        },{
                            money: '',
                            time: '',
                            state: 0,
                            moneyFlag: true
                        },{
                            money: '',
                            time: '',
                            state: 0,
                            moneyFlag: true
                    }]
                    this.stageList = arr.concat(array).slice(0, 6)
                    this.moduleObj.inputVal = item.note
                    this.moduleObj.uploadData = item.imageList.map(v=>{
                        return {
                            name: v.name,
                            src: v.url,
                            id: v.id
                        }
                    })
                    this.moduleObj.recordObj = item.audioList.length>0?item.audioList[0]:{}
                    this.moduleObj.disabledFlag = true
                    this.$nextTick(()=>{
                        this.$refs.companyInput.updateAutosize()
                        this.$refs.titleInput.updateAutosize()
                        this.moneyFlag = false
                        this.stageList.forEach(v=>v.moneyFlag = false)
                    })
                    if (this.userId != item.user_id || this.highSeas) {
                        this.state = 1
                        this.edit = false
                        this.notSelf = true
                    }
                }
            }
        },
        addPayment(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'customNewPayment') {
                this.UPDATE_LOADING(false)
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.btnFlag = false
                    return
                } else {
                    this.btnFlag = false
                    this.$router.back()
                }
            }
        },
        updatePayment(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'customNewPayment') {
                this.UPDATE_LOADING(false)
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.btnFlag = false
                    return
                } else {
                    this.btnFlag = false
                    this.$router.back()
                }
            }
        },
        receivePayment(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'customNewPayment') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.btnFlag = false
                    return
                } else {
                    if (this.payTypeValue[0]==='全款') {
                        this.state = 1
                    } else {
                        this.state = 2
                        let index = this.stageList.findIndex(v=>!v.state)
                        this.stageList[index].state = 1
                        let arr = this.stageList.slice(0, parseInt(this.payCountValue[0]))
                        if (arr.every(v=>v.state===1)) {
                            this.state = 1
                        }
                    }
                    this.btnFlag = false
                }
            }
        },
    },
    beforeRouteEnter (to, from, next) {
        if (from.name === 'searchResult') {
            next((vm) => {
                if (!vm.id) {
                    document.title = '添加回款计划'
                } else {
                    document.title = '回款计划详情'
                }
                vm.showFormA = true
                let obj = JSON.parse(sessionStorage.getItem('contractId')) || null
                if (obj) {
                    vm.edit = false
                    vm.moneyFlag = true
                    vm.stageList.forEach(v=>v.moneyFlag=true)
                    vm.contractId = obj.id
                    vm.contractNum = obj.number
                    vm.companyValue = obj.work
                    vm.startTime = obj.start
                    vm.endTime = obj.end
                    vm.payTypeValue = obj.type===1?['全款']:['分期']
                    vm.payCountValue = obj.payCount?[`${obj.payCount}`]:['6']
                    vm.allMoneyValue = obj.money?vm.money(obj.money):'';
                    //dbj 208.8.30 回款的时候语音清除
                    // vm.moduleObj.inputVal = ''
                    // vm.moduleObj.uploadData = []
                    // vm.moduleObj.recordObj = {
                    //     id: '',
                    //     url: '',
                    //     data: '',
                    //     duration: '',
                    // }
                }
                vm.$nextTick(()=>{
                    vm.$refs.companyInput.updateAutosize()
                    vm.edit = true
                    vm.moneyFlag = false
                    vm.stageList.forEach(v=>v.moneyFlag = false)
                    
                    if (vm.payTypeValue[0]==='全款'&&vm.allPayTime.length>0) {
                        let allPayTime = vm.allPayTime.replace(/-/g, "")
                        let startTime = vm.startTime.replace(/-/g, "")
                        if (startTime>allPayTime) {
                        vm.$vux.toast.show({
                                text:'起始时间不能大于回款时间',
                                type: 'text',
                                position: 'top',
                                width:"18em"
                            }) 
                            vm.$nextTick(() => {
                                vm.startTime=''
                            })
                            return
                        }
                    }
                })
            })
        } else {
            next((vm) => {
                vm.showFormA = true
                vm.btnFlag = false
                vm.id = to.query.id
                vm.highSeas = to.query.highSeas
                vm.notSelf = false
                vm.contractId = ''
                vm.edit = false
                vm.state = 1
                vm.remindTime = ''
                vm.payValue = {label: '', value: ''}
                vm.titleValue = ''
                vm.contractNum = ''
                vm.startTime = ''
                vm.endTime = ''
                vm.moneyFlag = true
                vm.allMoneyValue = ''
                vm.payTypeValue = ['全款']
                vm.payCountValue = ['6']
                vm.allPayTime = ''
                vm.stageList = [{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                 },{
                    money: '',
                    time: '',
                    state: 0,
                    moneyFlag: true
                }],
                vm.moduleObj.inputVal = ''
                vm.moduleObj.uploadData = []
                vm.moduleObj.recordObj = {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                vm.moduleObj.disabledFlag = false
                if (!vm.id) {
                    document.title = '添加回款计划'
                    vm.edit = true
                    vm.state = 0
                    vm.customerId = to.query.customerId
                    vm.nameValue = to.query.name
                    vm.companyValue = to.query.company
                    vm.moneyFlag = false
                    vm.stageList.forEach(v=>v.moneyFlag=false)
                } else {
                    document.title = '回款计划详情'
                    let obj = {
                        company_id: vm.companyId,
                        user_id: vm.userId,
                        id: vm.id,
                    }
                    vm.customerrecpay_paymentDetail(obj)
                }
                vm.$nextTick(()=>{
                    vm.$refs.companyInput.updateAutosize()
                    vm.$refs.titleInput.updateAutosize()
                    
                    let boxH = $(".customNewPayment .router-box").height()
                    $(".customNewPayment .router-box").bind("click",function(e){
                        let cY= e.clientY
                        if(cY > boxH*0.8 && (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')){
                            $(e.target).blur()
                            this.scrollTop = this.scrollTop+95
                            window.setTimeout(function(){
                                $(e.target).focus()
                            },500)
                        }
                    })
                })
            })
        }
    },
    beforeRouteLeave (to, from, next) {
        if (this.pay) {
            this.pay = false
            next(false)
        } else {
            this.showFormA = false
            next()
        }
    },
    directives: {
        TransferDom
    },
    components: {
        Group,
        GroupTitle,
        Cell,
        XButton,
        XInput,
        XTextarea,
        PopupPicker,
        Datetime,
        Flexbox,
        FlexboxItem,
        Popup,
        FormA,
        checkers
    },
}
</script>

<style lang="less">
.customNewPayment input,.customNewPayment .weui-cell__ft,.customNewPayment .vux-popup-picker-select {
    text-align: left !important;
    font-family: PingFangSC-Regular, Microsoft YaHei, Helvetica;
}

.customNewPayment input:disabled,.customNewPayment input[disabled],.customNewPayment textarea:disabled {
    background: #fff !important;
    -webkit-text-fill-color: #888;
    opacity: 1;
}

.customNewPayment .has input:disabled,.customNewPayment .has input[disabled],.customNewPayment .has textarea:disabled,.customNewPayment .has.weui-cell .weui-cell__ft {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
    white-space:normal;
    word-break:break-all;

    .weui-icon-clear {
        color: #B2B2B2;
        -webkit-text-fill-color: #B2B2B2;
    }
}

.customNewPayment .weui-label,.customNewPayment .vux-label {
    width: 5em !important;
}

.customNewPayment .width8 .weui-label {
    width: 8em !important;
}

.customNewPayment .remark.vux-x-textarea {
    flex-direction: column;
}

.customNewPayment .remark.vux-x-textarea .weui-cell__bd {
    width: 100%;
}

.customNewPayment .vux-cell-disabled .vux-label {
    color: #333;
}

.customNewPayment .vux-cell-disabled.weui-cell_access .weui-cell__ft:after {
    border-color: #fff;
    opacity: 0;
    // border-color: #C8C8CD;
}

.customNewPayment .vux-flexbox .vux-flexbox-item:last-child {
    margin-left: 0px !important;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
