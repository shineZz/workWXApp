<template>
    <div class="customInfo">
        <group>
            <x-input title="姓名：" v-model="nameValue" placeholder="未填写" disabled :class="{'has': nameValue}"></x-input>
            <x-input title="称呼：" v-model="nickValue" placeholder="未填写" disabled :class="{'has': nickValue}"></x-input>
            <x-input title="性别：" v-model="sexValue" placeholder="未填写" disabled :class="{'has': sexValue}"></x-input>
            <x-input title="生日：" v-model="birthValue" placeholder="未填写" disabled :class="{'has': birthValue}"></x-input>
            <x-input title="手机：" :value="'+'+mobileValue+' '+phoneValue" placeholder="未填写" disabled :class="{'has': phoneValue}">
                <div slot="right-full-height" class="right-img" v-if="!highSeas">
                    <router-link :to="{name: 'messageDetail', query: {type: 3,msg:msgData}}"><img src="@/images/custom/customer/customInfo/mail.png"></router-link>
                    <img src="@/images/custom/customer/customInfo/mobile.png" @click="callHand(false)">
                </div>
            </x-input>
            <x-input title="座机：" :value="tel" placeholder="未填写" disabled :class="{'has': tel}">
                <div slot="right-full-height" class="right-img" v-if="!highSeas">
                    <img src="@/images/custom/customer/customInfo/tel.png" @click="callHand(true)">
                </div>
            </x-input>
            <!-- <x-input title="微信：" v-model="wechatValue" placeholder="未填写" disabled :class="{'has': wechatValue}"></x-input> -->
            <x-textarea ref="wechatInput" title="微信：" v-model="wechatValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': wechatValue}"></x-textarea>
            <x-input title="QQ：" v-model="QQValue" placeholder="未填写" disabled :class="{'has': QQValue}">
                <!-- <div slot="right-full-height" class="right-img">
                    <img src="@/images/custom/customer/customInfo/qq.png">
                </div> -->
            </x-input>
            <x-textarea ref="emailInput" title="邮箱：" v-model="emailValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': emailValue}"></x-textarea>
            <!-- <x-input title="邮箱：" v-model="emailValue" placeholder="未填写" disabled :class="{'has': emailValue}"> -->
                <!-- <div slot="right-full-height" class="right-img">
                    <img src="@/images/custom/customer/customInfo/email.png">
                </div> -->
            <!-- </x-input> -->
            <x-input title="传真：" :value="fax" placeholder="未填写" disabled :class="{'has': fax}"></x-input>
            <x-textarea ref="company" title="公司：" v-model="companyValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': companyValue}"></x-textarea>
            <x-textarea ref="industry" title="行业：" v-model="industryValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': industryValue}"></x-textarea>
            <x-textarea ref="position" title="职位：" v-model="positionValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': positionValue}"></x-textarea>
            <x-textarea ref="area" title="地区：" :value="province&&city&&area?province+' '+city+' '+area:'未填写'" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': province&&city&&area}"></x-textarea>
            <x-textarea ref="map" title="地址：" v-model="mapValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': mapValue}"></x-textarea>
            <x-textarea ref="web" title="网址：" v-model="webValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="['break-word', {'has': webValue}]"></x-textarea>
            <x-textarea ref="remark" title="备注：" v-model="remark" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': remark}"></x-textarea>
            <div class="record-content" v-if="recordObj.url&&showVoice">
                <span>{{recordObj.duration}}''</span>
                <i class="duration" @click="playHand"></i>
                <audio ref="record" preload="auto" @ended="endHand" :src="recordObj.url"></audio>
            </div>
            <article>
                <section  v-for="(item,index) in imgArr" :key="index">
                    <div class="gutter-box">
                        <div @click="viewPicHand(index)"><img :src="item.src" class="previewer-demo-img"></div>
                    </div>
                </section>
            </article>
            <x-input title="法人代表：" v-model="legalValue" placeholder="未填写" disabled :class="{'has': legalValue}"></x-input>
            <x-input title="评分：" v-model="starValue" placeholder="未填写" disabled :class="{'has': starValue}"></x-input>
            <x-textarea ref="scope" title="经营范围：" v-model="scopeValue" :show-counter="false" :rows="1" autosize placeholder="未填写" disabled :class="{'has': scopeValue}"></x-textarea>
            <x-input title="规模：" v-model="sizeValue" placeholder="未填写" disabled :class="{'has': sizeValue}" class="vux-1px-b"></x-input>
            <flexbox :gutter='0' class="vux-1px-b">
                <flexbox-item class="vux-1px-r">
                    <x-input title="注册资金：" v-model="currencyValue1" disabled :class="{'has': currencyValue1}"></x-input>
                </flexbox-item>
                <flexbox-item>
                    <x-input v-model="moneyValue1" placeholder="未填写" disabled :class="{'has': moneyValue1}">
                        <span v-if="moneyValue1" slot="right" class="next">万元</span>
                    </x-input>
                </flexbox-item>
            </flexbox>
            <flexbox :gutter='0'>
                <flexbox-item class="vux-1px-r">
                    <x-input title="年营业额：" v-model="currencyValue2" disabled :class="{'has': currencyValue2}"></x-input>
                </flexbox-item>
                <flexbox-item>
                    <x-input v-model="moneyValue2" placeholder="未填写" disabled :class="{'has': moneyValue2}">
                        <span v-if="moneyValue2" slot="right" class="next">万元</span>
                    </x-input>
                </flexbox-item>
            </flexbox>
        </group>
        <div v-transfer-dom>
            <!-- 查看图片 -->
            <previewer :list="imgArr" ref="previewer" :options="options" ></previewer>
            <!-- 拨打电话 -->
            <popup v-model="call" height="270px" is-transparent>
                <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
                    <group style="padding:20px 15px;">
                        <x-button type="primary" @click.native="call = false">小宝AI电话拨号</x-button>
                        <x-button type="primary" @click.native="callHand(false)">直接拨号</x-button>
                    </group>
                    <div style="padding:20px 15px;">
                        <x-button @click.native="call = false" class="hasBorder">取消</x-button>
                    </div>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import { numberComma, Group, Cell, XButton, XInput, XTextarea, Flexbox, FlexboxItem, TransferDom, Popup, Previewer } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'customInfo',
    data() {
        return {
            customerId: 0,
            highSeas: 1,         //是否公海客户
            call: false,
            nameValue: '',
            nickValue: '',
            sexValue: '',
            birthValue: '',
            mobileValue: '',
            phoneValue: '',
            tel: '',
            telValue: '',
            telValue1: '',
            telValue2: '',
            wechatValue: '',
            QQValue: '',
            emailValue: '',
            fax: '',
            faxValue: '',
            faxValue1: '',
            faxValue2: '',
            companyValue: '',
            industryValue: '',
            positionValue: '',
            province: '',
            city: '',
            area: '',
            mapValue: '',
            webValue: '',
            remark: '',
            options: {
                getThumbBoundsFn (index) {
                // find thumbnail element
                let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                // get window scroll Y
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                // optionally get horizontal scroll
                // get position of element relative to viewport
                let rect = thumbnail.getBoundingClientRect()
                // w = width
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                // Good guide on how to get element coordinates:
                // http://javascript.info/tutorial/coordinates
                }
            },
            imgBtnFlag: true,
            showVoice: true,
            recordObj: {},
            imgArr: [],
            legalValue: '',
            starValue: '',
            scopeValue: '',
            sizeValue: '',
            currencyValue1: '',
            moneyValue1: '',
            currencyValue2: '',
            moneyValue2: '',
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            msgData:{}
        }
    },
    created() {
        // 是否企业微信
        if (localStorage.getItem('phonePort') == 'qywx') {
            this.showVoice = true
        } else {
            this.showVoice = false
        }
        this.customerId = this.$route.query.id
        this.highSeas = this.$route.query.highSeas
        let obj = {
            company_id: this.companyId,
            user_id: this.userId,
            customer_id: this.customerId
        }
        this.customer_getCustomerDetail(obj)
    },
    methods: {
        ...mapActions({
            customer_getCustomerDetail: 'customer/getCustomerDetail',
            customeractionrecord_addCallPhoneRecord: 'customeractionrecord/addCallPhoneRecord',
        }),
        ...mapMutations({
            UPDATE_LOADING: 'UPDATE_LOADING',
        }),
        // 千分符
        money(val) {
            val = val.toFixed(2)
            return numberComma(val)
        },
        // 拨打电话
        callHand(val) {
            if (val) {
                if (this.telValue1) {
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_id: this.customerId,
                        mobile: this.telValue+' '+this.telValue1,
                    }
                    this.customeractionrecord_addCallPhoneRecord(obj)
                    window.location.href = `tel:${this.telValue+' '+this.telValue1}`
                    return
                } else {
                    this.$vux.toast.show({
                        text: '客户暂无座机号',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
            // this.call = false
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                customer_id: this.customerId,
                mobile: '+'+this.mobileValue+' '+this.phoneValue,
            }
            this.customeractionrecord_addCallPhoneRecord(obj)
            window.location.href = `tel:${'+'+this.mobileValue+' '+this.phoneValue}`
        },
        // 查看图片
        viewPicHand(index){
            if(this.imgBtnFlag){
                this.imgBtnFlag=false;
                this.UPDATE_LOADING(true)
                setTimeout(() => {
                    this.UPDATE_LOADING(false);
                },1500)
                setTimeout(() => {
                    this.imgBtnFlag=true;
                },2500)
                this.$refs.previewer.show(index)
            }
        },
        playHand() {
            if (this.$refs.record.paused) {
                this.$refs.record.play()
                $('.duration').addClass('record-animate')
            } else {
                this.$refs.record.pause()
                this.$refs.record.load()
                $('.duration').removeClass('record-animate')
            }
        },
        endHand() {
            $('.duration').removeClass('record-animate')
        }
    },
    computed: {
        ...mapState({
            getDetail: state => state.customer.getDetail,
            addCall: state => state.customeractionrecord.addCall,
        })
    },
    watch: {
        getDetail(data) {
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
                    this.msgData={
                        'customer_name':item.customer_name,
                        'customer_company_name':item.customer_name,
                        'customer_id':this.$route.query.id,
                        'type':0,
                        'logo_orig':item.logo_orig,
                        'color':1,
                        'mobile':item.mobile,
                        'honor_name':item.honor_name,
                    }
                    this.nameValue = item.customer_name
                    this.nickValue = item.honor_name
                    this.sexValue = item.sex_name
                    this.birthValue = item.birthday_note
                    this.mobileValue = item.mobile_code.substring(1)
                    this.phoneValue = item.mobile
                    this.telValue = item.tel_code
                    this.telValue1 = item.telphone
                    this.telValue2 = item.telphone_ext
                    this.tel = this.telValue1&&this.telValue2?this.telValue + '-' + this.telValue1 + ' ' + this.telValue2:this.telValue1||this.telValue2?this.telValue + '-' + this.telValue1 + this.telValue2:''
                    this.wechatValue = item.wx
                    this.QQValue = item.qq
                    this.emailValue = item.email
                    this.faxValue = item.fax_code
                    this.faxValue1 = item.fax
                    this.faxValue2 = item.fax_ext
                    this.fax = this.faxValue1&&this.faxValue2?this.faxValue + '-' + this.faxValue1 + ' ' + this.faxValue2:this.faxValue1||this.faxValue2?this.faxValue + '-' + this.faxValue1 + this.faxValue2:''
                    this.companyValue = item.customer_company_name
                    this.industryValue = item.industry_name
                    this.positionValue = item.duty
                    this.province = item.province_name
                    this.city = item.city_name
                    this.area = item.area_name
                    this.mapValue = item.address
                    this.webValue = item.website
                    this.remark = item.note
                    this.imgArr = item.attach_note_img.map(v=>{
                        return {
                            src: v.url
                        }
                    })
                    this.recordObj = item.attach_note_audio.length>0?item.attach_note_audio[0]:{}
                    if (this.recordObj.url) {
                        let width = parseInt(this.recordObj.duration) * 8
                        if (width<50) {
                            width = 50
                        }
                        if (width>250) {
                            width = 250
                        }
                        this.$nextTick(()=>{
                            $('.duration').width(width)
                        })
                    }
                    this.legalValue = item.legal
                    this.starValue = item.score.toString()
                    this.scopeValue = item.scope
                    this.sizeValue = item.scale_name
                    this.currencyValue1 = item.reg_captical_unit_name?item.reg_captical_unit_name:'人民币'
                    this.moneyValue1 = numberComma(item.reg_captical)
                    this.currencyValue2 = item.annual_turnover_unit_name?item.annual_turnover_unit_name:'人民币'
                    this.moneyValue2 = numberComma(item.annual_turnover)
                    this.$nextTick(()=>{
                        this.$refs.company.updateAutosize()
                        this.$refs.industry.updateAutosize()
                        this.$refs.position.updateAutosize()
                        this.$refs.area.updateAutosize()
                        this.$refs.map.updateAutosize()
                        this.$refs.wechatInput.updateAutosize()
                        this.$refs.emailInput.updateAutosize()
                        this.$refs.web.updateAutosize()
                        this.$refs.remark.updateAutosize()
                        this.$refs.scope.updateAutosize()
                    })
                    
                }
            }
        },
        addCall(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
        },
    },
    directives: {
        TransferDom
    },
    components: {
        Group,
        Cell,
        XButton,
        XInput,
        XTextarea,
        Flexbox,
        FlexboxItem,
        Popup,
        Previewer
    },
}
</script>

<style lang="less">
.customInfo .weui-cells,.customInfo .vux-no-group-title {
    margin-top: 0 !important;

    &::before {
        border: none;
    }
}

.customInfo input, .customInfo textarea {
    // text-align: right;
    font-family: PingFangSC-Regular, Microsoft YaHei, Helvetica;
}

// .customInfo .money input {
//     text-align: left;
// }
.customInfo input:disabled,.customInfo input[disabled],.customInfo textarea:disabled {
    background: #fff !important;
    -webkit-text-fill-color: #888;
    opacity: 1;
}

.customInfo .has input:disabled,.customInfo .has input[disabled],.customInfo .has textarea:disabled {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
}
.customInfo .weui-label {
    width: 5em !important;
}

.customInfo .vux-1px-b::after {
    left: 15px;
}

.customInfo .vux-x-input-right-full {
    height: 29px;
}

.customInfo .vux-x-input-has-right-full {
    padding: 10px 15px;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
