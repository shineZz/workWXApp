<template>
    <div class="register">
        <div>
            <checker v-model="checkValue" :radio-required="true" default-item-class="check-box" selected-item-class="check-box-selected" @on-change="checkHand">
                <checker-item value="1" class="check-item"><i></i>企业入驻</checker-item>
                <checker-item value="2" class="check-item"><i></i>加入企业</checker-item>
            </checker>
        </div>
        <group>
            <x-input :title="nameTitle" :placeholder="namePlace" v-model="nameValue" :max="50" type="text"></x-input>
            <x-input title="登录账户" placeholder="请输入手机号" v-model="phoneValue" :max="11" type="tel" :disabled="!!mobile"></x-input>
            <x-input :title="pwdTitle" :placeholder="pwdPlace" v-model="pwd1" :max="22" type="password"></x-input>
            <x-input title="确认密码" placeholder="请再次输入登录密码" v-model="pwd2" :max="22" type="password" v-if="!mobile"></x-input>
        </group>
        <p class="agree"><router-link :to='{name:"iframe", query:{ title:"用户协议", url:"http://dev-xsapi.51lick.cn:18880/webpage/yyStandard" } }'>注册即视为同意《小宝销售平台用户使用协议》</router-link></p>
        <footer class="user-footer">
            <div class="hd"></div>
            <x-button type="primary" @click.native="submitHand" :show-loading="submitFlag">注册</x-button>
        </footer>
    </div>
</template>

<script>
import { XButton, XInput, Group, Flexbox, FlexboxItem, Checker, CheckerItem } from 'vux'
import { mapState, mapActions } from 'vuex'
import { checkMobile, checkPwd } from '@/util/index'

export default {
    name: 'register',
    data() {
        return{
            checkValue: '1',
            nameTitle: '企业全称',
            namePlace: '请输入企业全称',
            nameValue: '',
            phoneValue: '',
            pwdTitle: '登录密码',
            pwdPlace: '6~22个字符，区分大小写',
            pwd1: '',
            pwd2: '',
            submitFlag: false,
            mobile: '',
        }
    },
    created() {
        this.mobile = this.$route.params.mobile || ''
        if(this.mobile) {
            this.phoneValue = this.mobile
            this.pwdTitle = '验证密码'
            this.pwdPlace = '请输入已有账户密码进行验证'
        }
    },
    methods: {
        ...mapActions({
            company_regCompany: 'company/regCompany',
        }),
        checkHand(value) {
            if (value === '1') {
                this.nameTitle = '企业全称'
                this.namePlace = '请输入企业全称'
            } else {
                this.nameTitle = '邀 请 码'
                this.namePlace = '请输入邀请码'
            }
            if (!this.mobile) {
                this.phoneValue = ''
            }
            this.nameValue = ''
            this.pwd1 = ''
            this.pwd2 = ''
        },
        submitHand() {
            if (this.checkValue === '1') {
                if (!this.nameValue) {
                    this.$vux.toast.show({
                        text: '请输入企业名称!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
            if (this.checkValue === '2') {
                if (!this.nameValue) {
                    this.$vux.toast.show({
                        text: '请输入邀请码',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
            if (!this.mobile) {
                if(!this.phoneValue || this.phoneValue.length !== 11 || !checkMobile(this.phoneValue)){
                    this.$vux.toast.show({
                        text: '请输入正确的手机号码!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
            if (!this.pwd1) {
                this.$vux.toast.show({
                    text: '请输入密码!',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if(this.pwd1.length < 6 || this.pwd1.length > 22 || !checkPwd(this.pwd1)){
                this.$vux.toast.show({
                    text: '密码只能为字母加数字6-22位!',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.mobile) {
                if (!this.pwd2) {
                    this.$vux.toast.show({
                        text: '请输入确认密码!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                if (this.pwd1 !== this.pwd2) {
                    this.$vux.toast.show({
                        text: '登录密码与确认密码不一致!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
            let obj
            if (this.checkValue === '1') {
                obj = {
                    phone: this.phoneValue,
                    password: this.pwd1,
                    companyName: this.nameValue,
                }
            } else {
                obj = {
                    phone: this.phoneValue,
                    password: this.pwd1,
                    invitationCode: this.nameValue,
                }
            }
            this.company_regCompany(obj)
            this.submitFlag = true
        }
    },
    computed: {
        ...mapState({
            regCompany: state => state.company.regCompany,
        })
    },
    watch: {
        '$route'(to, from) {
            if (from.name === 'iframe') {
                return
            }
            if (to.name === "register") {
                this.mobile = to.params.mobile || ''
                if(this.mobile) {
                    this.pwdTitle = '验证密码'
                    this.pwdPlace = '请输入已有账户密码进行验证'
                } else {
                    this.pwdTitle = '登录密码'
                    this.pwdPlace = '6~22个字符，区分大小写'
                }
                this.nameValue = ''
                this.phoneValue = this.mobile
                this.pwd1 = ''
                this.pwd2 = ''
                this.submitFlag = false
            }
        },
        regCompany: function(data) {
            if (data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.submitFlag = false
                    return
                } else {
                    console.log(data)
                    this.$vux.toast.show({
                        text: '企业账号注册成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.push({name: 'login', query: {mobile: this.phoneValue}})
                    setTimeout(() => {
                        this.submitFlag = false
                    }, 3000)
                }
            }
        },
        
    },
    components: {
        XInput, Group, XButton, Flexbox, FlexboxItem, Checker, CheckerItem
    }
}
</script>

<style lang="less">
.register .vux-x-input.weui-cell .weui-cell__hd .weui-label {
    width: 80px !important;
}

.register input:disabled,.register input[disabled]{
    -webkit-text-fill-color: #333 !important;
    opacity: 1 !important;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
</style>

<style lang="less" scoped>
    @import '../index.less';
</style>