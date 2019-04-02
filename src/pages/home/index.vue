<template>
	<div class="home">
		<!-- 导航 -->
		<div class="menu">
			<nav :class="'menu'+menuCur">
				<a href="javascript:;" v-for="(item, index) in menu" @click="handleMenu(index)" :key="index">{{item.name}}</a>
			</nav>
		</div>
        <div v-if="menuCur===0" class="fn-mt5">
            <planHead :noPlan="noPlan"/>
            <planList @delPlan="delPlan" :showScroll="true" :showDate="false" :showPull="false" :showHeight="true" :notSelf="false"/>
        </div>
        <div  v-if="menuCur===1" class="fn-mt15"><Works  :moduleObj="workObj" /></div>
        <div v-if="menuCur===2" class="fn-mt15"><results   /></div>
	</div>
</template>

<script>
import { Scroller, Tabbar, TabbarItem } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getDateJson } from '@/util/date'
import planHead from './planHead'
import planList from './planList'
import Works from '@/components/works'
import results from './results'
let phonePort = localStorage.getItem('phonePort')

export default {
    name: 'home',
    data() {
        return {
            menuCur:0,
            menu: [{
                    name: '工作日程',
                },{
                    name: '工作圈子',
                },{
                    name: '业绩看板',
            }],
            noPlan: false,
            workObj:{
                link:'1',
            },
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
        }
    },
    created() {
        // 请求企业微信
        if (phonePort == 'qywx') {
            let obj_qywx = {
                crop_id: this.userInfo.wx_userDetail.corpid,
                url: location.href.split('#')[0]
            }
            this.$store.dispatch('qywxHand', obj_qywx)
        } else {
        }
        // 获取字典-提醒时间选项
        if (!JSON.parse(localStorage.getItem('dict'))) {
            this.oadict_getDict({
                companyId: this.companyId,
                type: 49,
            })
        }
        // 重载后重置数据
        localStorage.setItem("pageType",JSON.stringify('resumeList'))
        localStorage.setItem('showCalendar', JSON.stringify(true))
        localStorage.setItem('userName', JSON.stringify('我'))
        localStorage.setItem('notSelf', JSON.stringify(''));
        
    },
    mounted() {
        // 重载后设置导航位置
        let index = JSON.parse(sessionStorage.getItem('homeMenuIndex')) || 0
        this.menuCur=index
    },
    methods: {
        ...mapActions({
            oadict_getDict: 'oadict/getDict',
        }),
        ...mapMutations({
            SIGN_OUT:'SIGNOUT',
            CHECKSIGNOUT:'CHECKSIGNOUT',
        }),
        // 导航
        handleMenu(index) {
            this.menuCur=index
            sessionStorage.setItem('homeMenuIndex', JSON.stringify(index))
        },
        delPlan(val) {
            this.noPlan = val
        },
        
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            qywxData: state => state.qywxData,
            dict: state => state.oadict.dict,
            wx:state => state.wx,
            
        })
    },
    watch: {
        //企业微信
        qywxData: function(data) {
            if(Object.keys(data).length > 0 && this.$route.name=='home') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"      
                    })
                }else{
                    this.wx.config({
                        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                        debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:this.userInfo.wx_userDetail.corpid, // 必填，企业微信的corpID
                        timestamp:data.items.timestamp , // 必填，生成签名的时间戳
                        nonceStr: data.items.noncestr, // 必填，生成签名的随机串
                        signature:data.items.signature,// 必填，签名，见附录1
                        jsApiList:['closeWindow']
                    })
                    // wx.ready(function(){                        
                    //     // wx.closeWindow();
                    // })
                    this.wx.error(function(res){
                        var ua = window.navigator.userAgent.toLowerCase();
                        if(ua.match(/wxwork/i) == 'wxwork'){
                            
                        }else{
                            localStorage.setItem('phonePort', 'weixin') 
                            phonePort='weixin';
                        }
                       
                    });
                }
            }
        },
        dict: function(data) {
            if(data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                    return
                } else {
                    localStorage.setItem('dict', JSON.stringify(data.items))
                }
            }
        },
        
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        if (to.path === '/login' && phonePort == 'qywx') {
            this.wx.closeWindow();
        }else {
            next();
        }
    },
    beforeRouteEnter (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        if (from.path === '/login') {
            next((vm)=>{ //参数vm就是当前组件的实例。
                vm.menuCur = 0
            })
        }else {
            next()
        }
    },
    components: {
      planHead, planList, Works, results
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
