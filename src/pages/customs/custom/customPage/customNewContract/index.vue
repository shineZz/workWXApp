<template>
    <div class="customNewContract router-all">
        <div class="router-box">
            <!-- 姓名 -->
            <group>
                <x-input title="客户：" v-model="nameValue" placeholder="请填写姓名（必填）" disabled :class="{'has': nameValue}"></x-input>
            </group>
            <!-- 公司提醒时间状态 -->
            <group>
                <x-textarea ref="companyInput" title="公司：" v-model="companyValue" :show-counter="false" :rows="1" :max="30" autosize placeholder="请填写公司名（必填）"
                 @on-change="valueChange(companyValue, 'companyInput', 'companyValue')" :disabled="related" :class="{'has': companyValue}" />
            </group>
            <!-- 合同回款内容 -->
            <group>
                <x-textarea ref="titleInput" title="标题：" v-model="titleValue" :rows="1" autosize :show-counter="false" :max="30" placeholder="请填写标题（必填）"
                 :disabled="related" @on-change="valueChange(titleValue, 'titleInput', 'titleValue')" :class="{'has': titleValue}"/>
                <x-textarea ref="contractIdInput" title="合同编号：" v-model="contractId" :rows="1" autosize placeholder="请填写合同编号（必填）"
                 :show-counter="false" :max="30" :disabled="related" @on-change="valueChange(contractId, 'contractIdInput', 'contractId')" :class="{'has': contractId}"/>
                <datetime title="起始时间：" v-model="startTime" :readonly="related" @on-change="startChange" placeholder="请选择（必选）"/>
                <datetime title="终止时间：" v-model="endTime" :readonly="related" @on-change="endChange" placeholder="请选择（必选）" />
                <x-input title="总金额：" ref="allMoneyInput" :show-clear="false" v-model="allMoneyValue" :disabled="moneyFlag||related"
                 @on-focus="moneyFocus" @on-change="moneyChange" @on-blur="moneyBlur" :max="16" placeholder="请填写总金额（必填）" :class="{'has': allMoneyValue}"></x-input>
                <popup-picker title="回款方式：" :data="payTypeList" :disabled="related" v-model="payTypeValue"></popup-picker>
                <popup-picker title="回款期数：" v-show="payTypeValue[0]==='分期'" show-name :disabled="related" :data="payCountList" v-model="payCountValue"></popup-picker>
            </group>
            <!-- 备注 -->
            <FormA :moduleObj="moduleObj" ></FormA>
        </div>
        <div class="btn" v-if="!related">
            <x-button type="primary" @click.native="submit" :show-loading="btnFlag" :disabled="btnFlag">立即保存</x-button>
        </div>
    </div>
</template>

<script>
import { trim, Group, GroupTitle, Cell, XButton, XTextarea, XInput, PopupPicker, Datetime, Flexbox, FlexboxItem, } from 'vux'
import { objDeepCopy, checkPrice, checkEmoji, checkMoney } from '@/util/index'
import { mapState,mapActions,mapMutations } from 'vuex'
import FormA from '@/components/formA'

export default {
    name: 'customNewContract',
    data() {
        return {
            related: true,
            customerId: 0,
            highSeas: 1,         //是否公海客户
            id: '',
            btnFlag: false,
            nameValue: '',
            companyValue: '',
            titleValue: '',
            contractId: '',
            startTime: '',
            endTime: '',
            moneyFlag: true,
            allMoneyValue: '',
            payTypeList: [['全款', '分期']],
            payTypeValue: ['全款'],
            payCountList: [[]],
            payCountValue: ['6'],
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
                type: 7,
            },
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
        }
    },
    created() {
        this.payCountList = [JSON.parse(localStorage.getItem('payInstallList'))]
        this.nameValue = this.$route.query.name
        this.companyValue = this.$route.query.company
        this.id = this.$route.query.id
        this.highSeas = this.$route.query.highSeas
        if (this.id) {
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                id: this.id,
            }
            this.customercontract_contractDetail(obj)
        } else {
            this.related = false
            this.moneyFlag = false
            this.customerId = this.$route.query.customerId
        }
    },
    mounted() {
        if (this.id) {
            document.title = '合同详情'
        } else {
            document.title = '添加合同'
        }
    },
    methods: {
        ...mapActions({
            customerattach_uploadFile: 'customerattach/uploadFile',
            customercontract_contractDetail: 'customercontract/contractDetail',
            customercontract_addContract: 'customercontract/addContract',
            customercontract_updateContract: 'customercontract/updateContract',
        }),
        ...mapMutations({
            UPDATE_LOADING: 'UPDATE_LOADING',
        }),
        //时间限制
        startChange(value) {
            let endTime = this.endTime
            if(endTime.length>0) {                
                endTime = endTime.replace(/-/g, "")
                let startTime=value.replace(/-/g, "")
                if(startTime>endTime) {
                   this.$vux.toast.show({
                        text:'起始时间不能大于终止时间',
                        type: 'text',
                        position: 'top',
                        width:"18em"                                
                    }) 
                    this.$nextTick(() => {
                        this.startTime=''
                    })
                    
                }
            }
        },
        endChange(value){
            let startTime = this.startTime
            if(startTime.length>0) {                
                startTime=startTime.replace(/-/g, "")
                let endTime=value.replace(/-/g, "")
                if(endTime<startTime) {
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
        // input改变
        valueChange(val, refStr, valuestr, max) {
            if (!val||this.related) {
                return
            }
            val = trim(val)
            val = val.replace("\r|\n", "")
            val = checkEmoji(val)
            if (refStr === 'contractIdInput') {
                val = val.replace(/[\W]/g,'')
            }
            this.$nextTick(()=>{
                this[valuestr] = val
            })
        },
        // 千分符,两位小数
        money(val) {
            val = val.toString()
            val = val.replace(/\,/g, '')
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
        moneyFocus(val) {
            if (!val||this.related) {
                return
            }
            this.moneyFlag = false
            val = val.replace(/\,/g, '')
            this.$nextTick(()=>{
                this.allMoneyValue = val
            })
        },
        // 金额改变
        moneyChange(val) {
            if (!val||this.moneyFlag||this.related) {
                return
            }
            if (!checkPrice(val)) {
                val = val.substring(0, val.length-1)
            } else {
                return
            }
            this.$nextTick(()=>{
                this.allMoneyValue = val
            })
        },
        // 金额失去焦点
        moneyBlur(val) {
            if (!val||this.related) {
                return
            }
            this.moneyFlag = true
            val = val.toString()
            val = this.money(val)
            this.$nextTick(()=>{
                this.allMoneyValue = val
                setTimeout(()=>{
                    this.moneyFlag = false
                }, 20)
            })
        },
        requsetHand() {
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                customer_id: this.customerId,
                customer_name: this.nameValue,
                company_name: this.companyValue,
                contract_title: this.titleValue,
                contract_num: this.contractId,
                contract_start_time: this.startTime,
                contract_end_time: this.endTime,
                total_amout: this.allMoneyValue?parseFloat(this.allMoneyValue.replace(/\,/g, '')):'',
                received_payment_type: this.payTypeValue[0]==='全款'?1:2,
                installment_num: this.payTypeValue[0]==='全款'?'':parseInt(this.payCountValue[0]),
                note: this.moduleObj.inputVal,
                attach_ids: this.moduleObj.uploadData.map(v=>v.id).join()
            }
            if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                obj.attach_ids = obj.attach_ids + ',' + this.moduleObj.recordObj.id;
            }
            
            if (this.id) {
                obj.id = this.id
                this.customercontract_updateContract(obj)
            } else {
                this.customercontract_addContract(obj)
            }
        },
        requsetImg() {
            let index = this.moduleObj.uploadData.findIndex(v=>!v.id)
            console.log(this.moduleObj.uploadData)
            if (index !== -1) {
                let length = this.moduleObj.uploadData.length
                let arr = objDeepCopy(this.moduleObj.uploadData).splice(index, length)
                let obj = {
                    company_id: this.companyId,
                    user_id: this.userId,
                    source: 6,
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
            if (!this.titleValue) {
                this.$vux.toast.show({
                    text: '合同标题未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.contractId) {
                this.$vux.toast.show({
                    text: '合同编号未填写，请填写',
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
            this.requsetImg()
            this.btnFlag = true
            this.UPDATE_LOADING(true)
        }
    },
    computed: {
        ...mapState({
            uploadFileData: state => state.customerattach.uploadFileData,
            contractDetail: state => state.customercontract.contractDetail,
            addContract: state => state.customercontract.addContract,
            updateContract: state => state.customercontract.updateContract,
        })
    },
    watch: {
        uploadFileData(data) {
            if (Object.keys(data).length>0) {
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
        contractDetail(data) {
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
                    let item = data.items
                    this.nameValue = item.customer_name
                    this.companyValue = item.company_name
                    this.titleValue = item.contract_title
                    this.contractId = item.contract_num
                    this.startTime = item.contract_start_time
                    this.endTime = item.contract_end_time
                    this.allMoneyValue = item.total_amout?this.money(item.total_amout):''
                    this.payTypeValue = item.received_payment_type==1?['全款']:['分期']
                    this.payCountValue = [`${item.installment_num?item.installment_num:6}`]
                    this.moduleObj.inputVal = item.note
                    this.moduleObj.uploadData = item.imageList.length>0?item.imageList.map(v=>{
                        return {
                            name: v.name,
                            src: v.url,
                            id: v.id
                        }
                    }):[]
                    this.moduleObj.recordObj = item.audioList.length>0?item.audioList[0]:{}
                    this.moduleObj.disabledFlag = item.update_flag?true:false
                    this.$nextTick(()=>{
                        this.$refs.companyInput.updateAutosize()
                        this.$refs.titleInput.updateAutosize()
                        this.$refs.contractIdInput.updateAutosize()
                        this.moneyFlag = false
                    })
                    this.related = item.update_flag?true:false
                    if (this.userId != item.user_id || this.highSeas) {
                        this.related = true
                        this.moduleObj.disabledFlag = true
                    }
                }
            }
        },
        addContract(data) {
            if (Object.keys(data).length>0) {
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
                    this.$router.go(-1)
                }
            }
        },
        updateContract(data) {
            if (Object.keys(data).length>0) {
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
        FormA
    },
}
</script>

<style lang="less">
.customNewContract input,.customNewContract .weui-cell__ft,.customNewContract .vux-popup-picker-select {
    text-align: left !important;
    font-family: PingFangSC-Regular, Microsoft YaHei, Helvetica;
}

.customNewContract input:disabled,.customNewContract input[disabled],.customNewContract textarea:disabled {
    background: #fff !important;
    -webkit-text-fill-color: #888;
    opacity: 1;
}

.customNewContract .has input:disabled,.customNewContract .has input[disabled],.customNewContract .has textarea:disabled,.customNewContract .has.weui-cell .weui-cell__ft {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;

    .weui-icon-clear {
        color: #B2B2B2;
        -webkit-text-fill-color: #B2B2B2;
    }
}

.customNewContract .weui-label,.customNewContract .vux-label {
    width: 5em !important;
}

.customNewContract .width8 .weui-label {
    width: 8em !important;
}

.customNewContract .remark.vux-x-textarea {
    flex-direction: column;
}

.customNewContract .remark.vux-x-textarea .weui-cell__bd {
    width: 100%;
}

.customNewContract .vux-cell-disabled .vux-label {
    color: #333;
}

.customNewContract .vux-cell-disabled.weui-cell_access .weui-cell__ft:after {
    border-color: #fff;
    opacity: 0;
}

.customNewContract .vux-flexbox .vux-flexbox-item:last-child {
    margin-left: 1px !important;
}

.customNewContract .vux-flexbox button.weui-btn {
    border-radius: 0 5px 5px 0;
}

.customNewContract .vux-flexbox .vux-flexbox-item:first-child button.weui-btn {
    border-radius: 5px 0 0 5px;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
