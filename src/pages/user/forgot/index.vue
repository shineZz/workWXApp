<template>
    <div class="forgot">
        <div class="login-reg" v-if="register"><img src="~@/images/user/login_register.png"></div>
        <group>
            <x-input title="手机号码" placeholder="请输入手机号" v-model="phoneValue" :max="11" type="tel"></x-input>
            <x-input title="验证码" placeholder="请输入验证码" v-model="vcodeValue" class="weui-vcode" :max="4" label-width="5em" type="tel">
                <x-button :disabled="vcodeFlag" slot="right" type="primary" mini @click.native="getSms">{{vcodeFlag?`${time}秒后重新获取`:'获取验证码'}}</x-button>
            </x-input>
        </group>
        <footer class="user-footer">
            <div class="hd"></div>
            <x-button type="primary" @click.native="submitHand" :show-loading="submitFlag">{{register?'确定':'下一步'}}</x-button>
        </footer>
    </div>
</template>

<script>
import { XButton, XInput, Group } from 'vux'
import { mapState, mapActions } from 'vuex'
import { checkMobile } from '@/util/index'
let timer

export default {
    name: 'forgot',
    data() {
        return{
            register: false,
            time: 60,
            phoneValue: '',
            vcodeValue: '',
            vcodeFlag: false,
            submitFlag: false,
            use_type: 'reset_password',
        }
    },
    mounted() {
        this.register = this.$route.query.register || false
        if (this.register) {
            document.title = '注册'
            this.use_type = 'register'
        } else {
            document.title = '忘记密码'
            this.use_type = 'reset_password'
        }
    },
    methods: {
        ...mapActions({
            sms_getSmsTxtCode: 'sms/getSmsTxtCode',
            sms_smsCheckCode: 'sms/smsCheckCode',
            company_checkUserRegist: 'company/checkUserRegist',
        }),
        // 获取验证码
        getSms() {
            if (!this.phoneValue) {
                this.$vux.toast.show({
                    text: '手机号码不能为空!',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if(this.phoneValue.length !== 11 || !checkMobile(this.phoneValue)){
                this.$vux.toast.show({
                    text: '请输入正确的手机号!',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.vcodeFlag) {
                return
            }
            let obj = {
                mobile: this.phoneValue,
                use_type: this.use_type,
            }
            this.sms_getSmsTxtCode(obj)
        },
        // 登录
        submitHand() {
            // if (!this.phoneValue) {
            //     this.$vux.toast.show({
            //         text: '手机号码不能为空!',
            //         type: 'text',
            //         position: 'top',
            //         width:"18em"
            //     })
            //     return
            // }
            if(!this.phoneValue || this.phoneValue.length !== 11 || !checkMobile(this.phoneValue)){
                this.$vux.toast.show({
                    text: '请输入正确的手机号码!',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.vcodeValue) {
                this.$vux.toast.show({
                    text: '验证码不能为空!',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.register) {
                let obj = {
                    mobile: this.phoneValue,
                    code: this.vcodeValue,
                }
                this.company_checkUserRegist(obj)
            } else {
                let obj = {
                    mobile: this.phoneValue,
                    use_type: this.use_type,
                    code: this.vcodeValue,
                }
                this.sms_smsCheckCode(obj)
            }
            this.submitFlag = true
        }
    },
    computed: {
        ...mapState({
            smsTxtCode: state => state.sms.smsTxtCode,
            smsCheckCode: state => state.sms.smsCheckCode,
            checkUserRegist: state => state.company.checkUserRegist,
        })       
    },
    watch: {
        '$route'(to, from) {
            if (to.name === "forgot") {
                this.register = to.query.register || false
                if (this.register) {
                    document.title = '注册'
                    this.use_type = 'register'
                } else {
                    document.title = '忘记密码'
                    this.use_type = 'reset_password'
                }
                clearInterval(timer)
                this.phoneValue = ''
                this.vcodeValue = ''
                this.time = 60
                this.vcodeFlag =  false
                this.submitFlag =  false
            }
        },
        smsTxtCode: function(data) {
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
                    // data.items.alert_msg: "短信验证码发送成功"
                    if (data.items.send_status === '1') {
                        this.vcodeFlag = true
                        timer = setInterval(() => {
                            if (this.time === 0) {
                                clearInterval(timer)
                                this.vcodeFlag = false
                                this.time = 60
                            }
                            this.time = this.time-1
                        }, 1000)
                    }
                }
            }
        },
        smsCheckCode: function(data) {
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
                    // data.items.alert_msg: "短信验证成功"
                    if (data.items.check_status === '1') {
                        this.$router.push({name: 'resetPwd', params: {mobile: this.phoneValue}})
                        setTimeout(() => {
                            this.submitFlag = false
                        }, 3000)
                    }
                }
            }
        },
        checkUserRegist: function(data) {
            if (data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    clearInterval(timer)
                    this.time = 60
                    this.vcodeFlag = false
                    this.submitFlag = false
                    return
                } else {
                    if (data.items.type == 1) {
                        console.log('已注册')
                        this.$router.push({name: 'resetPwd', query: {register: true}, params: {mobile: this.phoneValue}})
                    } else {
                        console.log('未注册')
                        this.$router.push({name: 'register'})
                    }
                    setTimeout(() => {
                        clearInterval(timer)
                        this.time = 60
                        this.vcodeFlag = false
                        this.submitFlag = false
                    }, 3000)
                }
            }
        },
    },
    components: {
        XInput, Group, XButton
    }
}
</script>

<style lang="less">
.forgot .weui-btn.weui-btn_mini.weui-btn_primary::after {
    border: none;
}
</style>


<style lang="less" scoped>
 @import '../index.less';
</style>