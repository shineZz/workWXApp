<template>
<div>    
    <scroller  lock-x  scrollbarY>        
        <div>           
            <div  v-if="childCur==3" class="wodkchild-headB">
                <div><img :src="headLogo" class="box-shadow" :onerror="logo"/></div>
                <h4>{{userName}}</h4>
            </div>
            <div v-else class="wodkchild-headA">
                <header><img :src="pic400"/></header>
                <nav>
                    <router-link v-for="(item,index) in navTab" :key="index" :to="{ path: item.link, query: { state: index }}"><img :src="item.icon"/><span>{{item.title}}</span></router-link>
                    <i></i>
                </nav>
            </div>            
            <grid :cols="childCur==3?2:3"  class="wodkchild-main">
                <grid-item v-for="(item,index) in navChild" :link="{path:item.link, query: { state: index } }"   :key="index">                        
                        <div><img :src='item.img' alt=""></div>
                        <h6>{{item.title}}</h6>
                </grid-item>
            </grid>
        </div>
    </scroller>
</div>
    
</template>

<script>
import { Scroller,Grid, GridItem } from 'vux'
import Works from '@/components/works'
import { mapState, mapActions,mapMutations } from 'vuex';
let navTab1=[
        {
            title:'我发出的',
            link:'statement',
            icon:require("@/images/job/emit.png")
        },
        {
            title:'我收到的',
            link:'statement',
            icon:require("@/images/job/receive.png")
        }
    ]
let navTab2=[
    {
            title:'我发起的',
            link:'emitApproving',
            icon:require("@/images/job/emitApproving.png")
        },
        {
            title:'我审批的',
            link:'emitApproving',
            icon:require("@/images/job/recevieApproving.png")
        }
]
let navChild1=[
        {
            img:require('@/images/job/dayStatement.png'),
            title:"日报",
            link:'dayStatement',
        },
        {
            img:require('@/images/job/weekStatement.png'),
            title:"周报",
            link:'dayStatement',
        },
        {
            img:require('@/images/job/mouthStatement.png'),
            title:"月报",
            link:'dayStatement',
        },              
    ]
let navChild2=[
        {
            img:require('@/images/job/approvingReimbursement.png'),
            title:"报销",
            link:'approval',
        },
        {
            img:require('@/images/job/approvingLeave.png'),
            title:"请假",
            link:'approval',
        },
        {
            img:require('@/images/job/approvingEvection.png'),
            title:"出差",
            link:'approval',
        },
        {
            img:require('@/images/job/approvingCost.png'),
            title:"费用",
            link:'approval',
        },
        {
            img:require('@/images/job/approvingOvertime.png'),
            title:"加班",
            link:'approval',
        },
    ]
let navChild3=[
    {
            img:require('@/images/job/signIn.png'),
            title:"上下班签到",
            link:'duty',
        },
        {
            img:require('@/images/job/visit.png'),
            title:"拜访签到",
            link:'visit',
        },
]
export default {
    name: 'work',
    data() {
        return {
            childCur:0,
            navTab:[],
            pic400:'',
            navChild:[],
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,
            userName:this.$store.state.userInfo.user.trueName,
            headLogo:this.$store.state.userInfo.user.headLogo?this.$store.state.userInfo.user.headLogo:require('@/images/xsdefult.jpg'),
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"'  
        }
    },
    created() {
        this.childCur=this.$route.query.child;
        if(this.childCur==1){
            this.navTab=navTab1;
            this.pic400=require('@/images/job/pic400-1.jpg');
            this.navChild=navChild1;
            document.title="工作报告"
        }else if(this.childCur==2){
            this.navTab=navTab2;
            this.pic400=require('@/images/job/pic400-2.jpg');
            this.navChild=navChild2;
            document.title="工作审批"
        }else{
            this.navChild=navChild3;
            document.title="签到考勤"
            let _this = this
            this.loadingHand(true)
             $.getScript('http://api.map.baidu.com/getscript?v=2.0&ak=CBiu8d6o1peWFBWqvzYGA7fy', function() {
                 _this.initGeolocation()
            }, this);
        }
        
    },
    methods:{
        ...mapMutations({
            initGps: 'oasign/INITGPS',   
            loadingHand: 'UPDATE_LOADING', 
        }),
        initGeolocation(){
            // alert('=')
            let that = this 
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    // that.latitude = r.point.lat
                    // that.longitude = r.point.lng
                    let obj = {
                        lat:r.point.lat,
                        lng:r.point.lng
                    }
                    that.initGps(obj)
                    that.loadingHand(false)
                }
                else {
                    // alert('failed'+this.getStatus());
                }        
            });
            
        }
    },
    components: {
       Scroller,
       Grid, GridItem
    },
    // beforeRouteLeave(to, from, next) {
    //     if(to.name=='job'){
    //         from.meta.keepAlive = false; // 让 A 不缓存，即刷新
    //     }else if(from.name=='wodkChild'){
    //         from.meta.keepAlive = true;
    //     }
    //     next();
    // },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>