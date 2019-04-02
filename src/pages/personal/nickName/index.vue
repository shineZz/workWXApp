<template>
    <div class="nick-name">
        <group v-if="nick">
            <x-input title="当前昵称" v-model="nickName" disabled></x-input>
            <x-input title="新昵称" placeholder="请输入新昵称" v-model="newNickName" :max="22" type="text"></x-input>
        </group>
        <group v-if="!nick">
            <x-input title="原密码" placeholder="请输入原密码" v-model="pwd1" :max="22" type="password"></x-input>
            <x-input title="新密码" placeholder="请输入新密码" v-model="pwd2" :max="22" type="password"></x-input>
            <x-input title="确认密码" placeholder="请再次输入密码" v-model="pwd3" :max="22" type="password"></x-input>
        </group>
        <footer class="user-footer">
            <div class="hd"></div>
            <x-button type="primary" @click.native="submitHand" :show-loading="submitFlag">确认</x-button>
        </footer>
    </div>    
</template>

<script>
import { XButton, XInput, Group } from 'vux';
import { mapState, mapActions } from 'vuex';
import { checkPwd } from '@/util/index'

export default {
    name: 'nickName',
    data() {
        return{
            nick: true,
            nickName: this.$store.state.userInfo.user.nickName,
            newNickName: '',
            pwd1: '',
            pwd2: '',
            pwd3: '',
            submitFlag: false,
        }
    },
    created() {
        this.nick = this.$route.query.nick || false
        if (!this.nick) {
            document.title = '修改登录密码'
        }
    },
    methods: {
        ...mapActions({
            company_updateUserInfo: 'user/updateUserInfo',
            company_XSChangePassword: 'user/XSChangePassword',
        }),
        submitHand() {
            if (this.nick) {
                if (!this.newNickName) {
                    this.$vux.toast.show({
                        text: '昵称不能为空!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                let obj = {
                    userId: this.userInfo.user.userId,
                    companyId: this.userInfo.company.companyId,
                    nickName: this.newNickName
                }
                this.company_updateUserInfo(obj)
            } else {
                if (!this.pwd1) {
                    this.$vux.toast.show({
                        text: '原密码不能为空!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                // if (!this.pwd1) {
                //     this.$vux.toast.show({
                //         text: '原密码输入错误!',
                //         type: 'text',
                //         position: 'top',
                //         width:"18em"
                //     })
                //     return
                // }
                if (!this.pwd2) {
                    this.$vux.toast.show({
                        text: '新密码不能为空!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                if(this.pwd2.length < 6 || this.pwd2.length > 22 || !checkPwd(this.pwd2)){
                    this.$vux.toast.show({
                        text: '密码只能为字母加数字6-22位!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                if (!this.pwd3) {
                    this.$vux.toast.show({
                        text: '请输入确认密码!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                if (this.pwd2 !== this.pwd3) {
                    this.$vux.toast.show({
                        text: '新密码与确认密码不一致!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                
                let obj = {
                    type: 1,
                    userId: this.userInfo.user.userId,
                    oldPwd: this.pwd1,
                    password: this.pwd2,
                }
                this.company_XSChangePassword(obj)
            }
        },
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            updateUserInfo: state => state.user.updateUserInfo,
            XsChangePassword: state => state.user.XsChangePassword,
        })       
    },
    watch: {
        updateUserInfo: function(data) {
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
                        text: '昵称修改成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.push({name: 'personal'})
                    setTimeout(() => {
                        this.submitFlag = false
                    }, 3000)
                }
            }
        },
        XsChangePassword: function(data) {
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
                        text: '密码修改成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.push({name: 'personal'})
                    setTimeout(() => {
                        this.submitFlag = false
                    }, 3000)
                }
            }
        },
    },
    components: {
        XButton, XInput, Group
    }
}
</script>

<style lang="less">
.nick-name input:disabled,.nick-name input[disabled]{
    -webkit-text-fill-color: #333 !important;
    opacity: 1 !important;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
</style>

<style lang="less" scoped>
   @import '../../user/index.less';
</style>