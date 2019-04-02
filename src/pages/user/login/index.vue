<template>
    <div>
        <div v-if="loginFlag">
            <div class="login-head"><img src="~@/images/user/login_head.png"></div>
            <group >
                <x-input title="登录账户" placeholder="请输入手机号" v-model="inputVal1" :max="11" type="tel"></x-input>
                <x-input title="登录密码" placeholder="请输入密码" v-model="inputVal2" :max="30" type="password"></x-input>               
            </group>
            <footer class="user-footer">
                <div class="hd"><router-link :to="{ name: 'forgot' }">忘记密码</router-link></div>
                <div><x-button type="primary"  @click.native="submitHand" :show-loading='showLoading' >登录</x-button></div>
                <dl>
                    <dt><router-link :to="{ path: 'experience' }">立即体验</router-link></dt>
                    <dd><router-link :to="{ name: 'forgot', query: {register: true} }">免费注册</router-link></dd>
                </dl>
            </footer>
            <div v-show="showPopupPicker"><popup-picker :show.sync="showPopupPicker" :show-cell="false" popup-title="选择企业" :data="companyData" v-model="companyType" :columns="1" @on-change="companyTypeHand"></popup-picker></div>            
        </div>
        <div v-else class="wu-all">
            <section>
                <div><img src="~@/images/logo.png"></div>
                <p>{{text}}</p>
            </section>
        </div>
    </div>    
</template>

<script>
import {XButton, base64,  XInput, Group, Cell,PopupPicker,cookie } from 'vux';
import { mapState, mapActions } from 'vuex';
import { PHONE_PORT } from '@/constants/interface'
import { formatList } from '@/constants/format';
import { checkMobile,checkPwd } from '@/util/index';
export default {
    name: 'login',
    data() {
        return{
            text: '正在授权中',
            loginFlag:false,
            inputVal1: this.$route.query.mobile?this.$route.query.mobile:'',
            inputVal2: '',
            showLoading:false,
            showPopupPicker:false,
            companyData:[],
            companyType:[],
        }
    },
    created() {      
           cookie.remove('userDetail');  
           localStorage.removeItem('phonePort')
           localStorage.getItem('businessNav', JSON.stringify(1))
        //获取uri参数并请求数据
        if(!this.$route.query.param) {
             //开发模拟数据
            if (PHONE_PORT) {
                this.cookieData(formatList);
                 this.$store.commit('REFRESH_USERINFO')
            }else{
                this.loginFlag=true;
            }
        }else{
            let baseParm = base64.decode(this.$route.query.param)
            if (JSON.parse(baseParm).error) {
                this.text = '授权失败，请重新授权登录';
                this.$vux.toast.show({
                    text: this.text,
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
            } else {
                localStorage.setItem('phonePort', JSON.parse(baseParm).from) //存端口 
                         
                if (JSON.parse(baseParm).from == 'qywx') { //企业微信
                    localStorage.setItem('phonePort', JSON.parse(baseParm).from) //存端口  企业微信
                    let obj = {
                        company_id: JSON.parse(baseParm).company_id,
                        userDetail: baseParm
                    }
                    this.$store.dispatch('userInfoHand', obj)
                } else { //App

                }
            }

        }
        
        
    },
    methods: {
        ...mapActions({
            userInfoHand: 'userInfoHand',
            qywxHand: 'qywxHand',
            userLoginHand:'company/userLogin',
            getProfileHand: 'getProfile',
        }),
        //登录
        submitHand(){
            if(this.inputVal1.length<11 || !checkMobile(this.inputVal1)){
                this.$vux.toast.show({
                    text: '请输入正确手机号',
                    type: 'text',
                    position: 'top',
                    width:"20em"
                })
                return
            }
            if(this.inputVal2.length==0 ){
                this.$vux.toast.show({
                    text: '请输入密码',
                    type: 'text',
                    position: 'top',
                    width:"20em"
                })
                return
            }

            let obj = {
                mobile:this.inputVal1,
                password:this.inputVal2
            }
            if(!this.showLoading){
                this.showLoading=true;
                this.userLoginHand(obj)
            }
            
            
        },
        //选中企业
        companyTypeHand(val){            
            let obj={
                mobile:this.inputVal1,
                companyId:val[0]
            }
            this.getProfileHand(obj)
        },
        //cookie 
        cookieData(data){
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
                    userJobDeclaration: data.user.email,
                },
                ssoToken:data.ssoToken,
                facIdList:data.facIdList,
                wx_userDetail:data.wx_userDetail,
            };
            cookie.set('userDetail',JSON.stringify(userInfo) , {
                path: '/',
                expires: 15
            })     
            //ai外呼企业存在删除
            localStorage.removeItem('aiIs');      
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            userLoginData:state => state.company.userLoginData,
        })       
    },
    watch: {
        '$route'(to, from) {
            if (to.name === "login") {
                if(to.query.mobile) {
                    this.inputVal1 = to.query.mobile
                }
            }
        },
        userInfo: function(data) {
            if(Object.keys(data).length > 0 && this.$route.name === 'login') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                            text:data.alert_msg,
                            type: 'text',
                            position: 'top',
                            width:'22em'
                        })
                }else{
                    this.cookieData(data);         
                     sessionStorage.setItem('homeMenuIndex',JSON.stringify(0));             
                    // 重定向到首页或者登录前的页面
                    let time=0;
                    if(localStorage.getItem('phonePort') == 'qywx'){                         
                         this.text ="授权成功";
                         time=2000;
                         
                    }else{
                        this.$vux.toast.show({
                            text: '登录成功',
                            type: 'text',
                            position: 'top',
                            width:'20em'
                        })
                         
                        
                    }
                    setTimeout(() => {
                            this.$router.push({
                                path: '/page/home'
                            })
                        }, time); 
                       
                   
                    // let redirect = decodeURIComponent(
                    //     this.$route.query.redirect || '/'
                    // )                   
                    // this.$router.push({
                    //     path: '/'
                    // })
                }
               
            }
        },
        userLoginData: function(data) {
            if(Object.keys(data).length > 0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{
                    if(data.items.length==1){
                        let obj={
                            mobile:this.inputVal1,
                            companyId:data.items[0].companyId,
                        }
                        this.getProfileHand(obj);

                    }else{
                        let companyData=[];
                        data.items.forEach(item => {
                            companyData.push({
                                name:item.companyName,
                                value:item.companyId
                            })
                        });
                        this.companyData=companyData;
                        setTimeout(() => {
                               this.showPopupPicker = true;
                        }, 1500);  
                        
                    }
                }

                setTimeout(() => {
                        this.showLoading=false;
                }, 1500);    
                   
            }
        },
     },
    components: {
        XInput, Group,XButton, Cell ,XButton ,PopupPicker
    }
}
</script>
<style lang="less" scoped>
 @import '../index.less';
</style>