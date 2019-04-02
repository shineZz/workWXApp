<template>
    <div class="experience">
        <div class="registered">
            <p><i class="icon1"></i><span>体验过程中请勿输入重要内容，我们会定期进行数据更新。</span></p>
            <p><i class="icon2"></i><span>体验账号仅用于展示基础功能，若想获得全部服务，请申请注册开通小宝销售。</span></p>
            <p><i class="icon3"></i><span>小宝服务热线400-8813-609</span></p>
        </div>
        <div class="scroll">
            <h4>请选择您的行业</h4>
            <scroller lock-y :scrollbar-x=false :bounce=false ref="exScroll">
                <div class="scroll-box" :style="{'width':`${industryList.length*90}px`}">
                    <checker v-model="checkScrollValue" default-item-class="scroll-item" selected-item-class="scroll-item-selected">
                        <checker-item :value="item.industryId" class="box-item" v-for="(item, index) in industryList" :key="index">
                            <img :src="checkScrollValue===item.industryId?item.selectMiddlePicUrl:item.noSelectMiddlePicUrl" :alt="item.industryName">
                            <p>{{item.industryName}}</p>
                            <i></i>
                        </checker-item>
                    </checker>
                </div>
            </scroller>
        </div>
        <div class="check">
            <checker v-model="checkValue" default-item-class="item" selected-item-class="item-selected" :radio-required="true">
                <checker-item value="1"><i></i></checker-item>
                <checker-item value="2"><i></i></checker-item>
            </checker>
        </div>
        <footer class="user-footer">
            <x-button type="primary" @click.native="submitHand" :show-loading="submitFlag">立即体验</x-button>
        </footer>
    </div>
</template>

<script>
import { XButton, XInput, Group, Flexbox, FlexboxItem, Scroller, Checker, CheckerItem, cookie } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'experience',
    data() {
        return{
            industryList: [],
            checkScrollValue: '',
            checkValue: '1',
            submitFlag: false,
        }
    },
    created() {
        this.company_getDemoIndustry();
    },
    methods: {
        ...mapActions({
            company_getDemoIndustry: 'company/getDemoIndustry',
            company_demoLogin: 'company/demoLogin',
        }),
        // 找回密码
        submitHand() {
            if (!this.checkScrollValue) {
                this.$vux.toast.show({
                    text: '请选择一个行业！',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            let obj = {
                userType: this.checkValue,
                industryType: this.checkScrollValue,
            }
            this.company_demoLogin(obj)
            this.submitFlag = true
        }
    },
    computed: {
        ...mapState({
            demoIndustry: state => state.company.demoIndustry,
            demoLogin: state => state.company.demoLogin,
        })
    },
    watch: {
        '$route'(to, from) {
            if (to.name === "experience") {
                this.$nextTick(
                    this.$refs.exScroll.reset({
                        left: 0
                    })
                )
                cookie.remove('userDetail')
                this.checkValue = '1'
                this.checkScrollValue = ''
                this.submitFlag = false
            }
        },
        demoIndustry(data) {
            if (data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                } else {
                    this.industryList = data.items.demoIndustryList
                }
            }
        },
        demoLogin(data) {
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
                    this.$store.state.userInfo = data.items
                    data = data.items
                    let userInfo={
                        company:{
                            companyId:data.company.companyId,
                            companyName:data.company.companyName,
                            contactMobile:data.company.contactMobile,
                            contactPerson:data.company.contactPerson,
                            phone:data.company.phone,
                        },
                        user:{
                            userId:data.user.userId,
                            userLever:data.user.userLever,
                            userName:data.user.userName,
                            nickName:data.user.nickName,
                            mobile:data.user.mobile,
                            isOmsUser:data.user.isOmsUser,
                            companyId:data.user.companyId,
                            trueName:data.user.trueName,
                            userPosition:data.user.userPosition,
                            sex:data.user.sex,
                            departId:data.user.departId,
                            headLogo:data.user.headLogo,
                            userJobDeclaration: data.user.userJobDeclaration,
                            email: data.user.email,
                        },
                        ssoToken:data.ssoToken,
                        facIdList:data.facIdList,
                        // wx_userDetail:data.wx_userDetail,
                    }
                    cookie.set('userDetail',JSON.stringify(userInfo) , {
                        path: '/',
                        expires: 15
                    })
                    sessionStorage.setItem('homeMenuIndex',JSON.stringify(0))
                    this.$router.push({name: 'home'})
                    setTimeout(() => {
                        this.submitFlag = false
                    }, 3000)
                }
            }
        },
        
    },
    components: {
        XInput, Group, XButton, Flexbox, FlexboxItem, Scroller, Checker, CheckerItem
    }
}
</script>
<style lang="less">
.experience .check .vux-checker-box {
    background: #fff;
    padding: 10px 5px;
    display: flex;
    justify-content: space-around;
}

.experience .check .vux-checker-item {
    width: 141px;
    height: 100px;
    border-radius: 5px;
    background: #ffffff url(../../../images/login/login_cs@2x.png) no-repeat right bottom;
    background-size: 100% 100%;

    &:first-child {
        background-image: url(../../../images/login/login_jxs@2x.png);
        background-size: 100% 100%;
    }
}
</style>


<style lang="less" scoped>
 @import '../index.less';
</style>