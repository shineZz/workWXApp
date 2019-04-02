<template>
    <div class="resetPwd">
        <div v-if="register">
            <div class="registered">
                <p><i class="icon1"></i><span>您输入的手机号码已经注册过小宝销售。</span></p>
                <p><i class="icon2"></i><span>您可以返回登录或建立（加入）新的企业。</span></p>
                <p><i class="icon3"></i><span>小宝服务热线400-8813-609</span></p>
            </div>
            <flexbox>
                <flexbox-item class="flex-item">
                    <x-button type="primary" :link="{ name: 'login', query: {mobile} }">返回登录</x-button>
                </flexbox-item>
                <flexbox-item class="flex-item">
                    <x-button type="primary" :link="{ name: 'register', params: {mobile} }">建立或加入新企业</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div v-else>
            <group>
                <x-input title="新密码" placeholder="请输入新密码" v-model="pwd1" :max="22" type="password"></x-input>
                <x-input title="确认密码" placeholder="请再次输入密码" v-model="pwd2" :max="22" type="password"></x-input>
            </group>
            <footer class="user-footer">
                <div class="hd"></div>
                <x-button type="primary" @click.native="submitHand" :show-loading="submitFlag">确认</x-button>
            </footer>
        </div>
    </div>
</template>

<script>
import { XButton, XInput, Group, Flexbox, FlexboxItem } from 'vux'
import { mapState, mapActions } from 'vuex'
import { checkPwd } from '@/util/index'

export default {
    name: 'resetPwd',
    data() {
        return{
            pwd1: '',
            pwd2: '',
            submitFlag: false,
            mobile: '',
            register: false,
        }
    },
    created() {
        this.mobile = this.$route.params.mobile || ''
        this.register = this.$route.query.register || false
        if(!this.mobile) {
            this.$router.push({path: 'login'})
        }
        if (this.register) {
            document.title = '注册'
        } else {
            document.title = '重置密码'
        }
    },
    methods: {
        ...mapActions({
            company_updateWebUserPwd: 'company/updateWebUserPwd',
        }),
        // 找回密码
        submitHand() {
            if (!this.pwd1) {
                this.$vux.toast.show({
                    text: '请输入新密码!',
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
                    text: '新密码与确认密码不一致!',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            let obj = {
                mobile: this.mobile,
                passWord: this.pwd1,
            }
            this.company_updateWebUserPwd(obj)
            this.submitFlag = true
        }
    },
    computed: {
        ...mapState({
            updateWebUserPwd: state => state.company.updateWebUserPwd,
        })
    },
    watch: {
        '$route'(to, from) {
            if (to.name === "resetPwd") {
                this.mobile = to.params.mobile || ''
                this.register = to.query.register || false
                if(!this.mobile) {
                    this.$router.push({path: 'login'})
                }
                if (this.register) {
                    document.title = '注册'
                } else {
                    document.title = '重置密码'
                    this.pwd1 = ''
                    this.pwd2 = ''
                    this.submitFlag = false
                }
            }
        },
        updateWebUserPwd: function(data) {
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
                    this.$vux.toast.show({
                        text: '密码找回成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.push({name: 'login', query: {mobile: this.mobile}})
                    setTimeout(() => {
                        this.submitFlag = false
                    }, 3000)
                }
            }
        },
        
    },
    components: {
        XInput, Group, XButton, Flexbox, FlexboxItem
    }
}
</script>
<style lang="less">
.resetPwd .vux-flexbox .vux-flexbox-item:first-child {
    margin: 0 10px !important;
}

.resetPwd .weui-btn {
    padding: 0;
}
</style>


<style lang="less" scoped>
 @import '../index.less';
</style>