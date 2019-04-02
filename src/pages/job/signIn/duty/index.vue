<template>
    <div class="signIn" id="signIn">
        <div class="clock"> 
             <img class="hour" src="@/images/job/hour.png" alt="">
             <img class="minute" src="@/images/job/minute.png" alt="">
        </div>
        <div class="number-date" v-show="!loadingShow">
            {{hour}}:{{minute}}:{{second}}
        </div>
         <div class="title-box" v-if='hasGPSList'>
             <scroller 
                lock-x 
                :scrollbarY=false 
                height="-270"
            >
            <div class="scroll-box">
                <div class="title" v-for="(item,index) in gpsList" :class="index==signNumber?'first':''" :key="index" @click="changeSignAddress(item,index)">
                    <p class="title-name">{{item.name}}</p>
                    <p class="distance">{{item.distance}}米</p>
                </div>
            </div>
             </scroller>
        </div>
        <div class="title-box no-list" v-if='!hasGPSList'>
            <p>没有上下班签到地址可供选择，无法签到<br/>请联系企业管理员在Web端添加上下班签到地址</p>
        </div>
        <div class="checkSignIn" @click="toSignIn">签到记录</div>
        <div class="signIn-btn" v-if="hasGPSList">
            <div>
                <span @click="signIn(0)">
                    上班
                </span>
                <span @click="signIn(1)">
                    下班
                </span>
            </div>
        </div>
        <div class="signIn-btn-no" v-if="!hasGPSList">
            <div>
                <span>
                    上班
                </span>
                <span>
                    下班
                </span>
            </div>
        </div>
        <!-- <toast 
            v-model="show2" 
            type="text"
            position="middle"
            :text="toast"
            :time="1000"
            ></toast> -->
        <div v-transfer-dom>
            <loading :show="loadingShow"></loading>
        </div>
    </div>
</template>

<script>
import { Toast ,Loading ,TransferDom ,Scroller  } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'


export default {
    name: 'signIn',
    data() {
        return {
            na:0,
            nb:0,
            initHour:0,
            initMinute:0,
            hour:0,
            minute:0,
            second:0,
            setIntervalOne:null,
            setIntervalTwo:null,
            show2:false,
            position:"",
            toast:"",
            loadingShow:true,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            page:0,
            count:10, 
            gpsList:[],
            latitude:this.$store.state.oasign.GPSData.lat,
            longitude:this.$store.state.oasign.GPSData.lng,
            signNum:'0',
            hasGPSList:true,
            checkDistance:'',
            signAddressId:'',
            signNumber:"0",
            canSgin:false
        }
    },
    created() {

        this.initGPSaddressList()
        
    },
    directives: {
        TransferDom
    },
    mounted() {
        let that = this

        //获取初始化时间
       this.initClock()
       this.setIntervalOne = setInterval(function(){
            that.na+=(1/72)
            let rotateNumer = "rotate("+that.na+"deg)"
            $(".hour").css("transform",rotateNumer)
        },1000)
        this.setIntervalTwo = setInterval(function(){
            that.nb+=(1/1440)
            let rotateNumer = "rotate("+that.nb+"deg)"
            $(".minute").css("transform",rotateNumer)
            var mydate = new Date()
            var hour =mydate.getHours()
            var minute = mydate.getMinutes()
            var second= mydate.getSeconds()
            if(second<10){
                 that.second = "0"+second
            }else{
                that.second = second
            }
            if(minute<10){
                 that.minute = "0"+minute
            }else{
                that.minute = minute
            }
            if(hour<10){
                 that.hour = "0"+hour
            }else{
                that.hour = hour
            }
        },1000)
    },
    methods: {
        ...mapMutations({
            loadingHand:'UPDATE_LOADING'
        }),
        ...mapActions({
            QUERTGPSlist:'oasign/QueryGPSList',
            ADDSign:'oasign/AddSign',
        }),
        async initGPSaddressList(){
            let obj = {
                userId:this.user_id,
                companyId:this.company_id,
                page:this.page,
                count:1000
            }
            this.QUERTGPSlist(obj)
        },
        initClock(){
            let that = this
            var mydate = new Date()
            var hour =mydate.getHours()
            var minute = mydate.getMinutes()
            var second= mydate.getSeconds()
            that.na = second/10+minute*6-90
            that.initMinute = "rotate("+that.na+"deg)" 
            $(".hour").css("transform",that.initMinute)
            if(hour>12){
                hour = hour-12
            }
            that.nb = hour*30+(minute*60+second)/240-90
            that.initHour = "rotate("+that.nb+"deg)" 
            $(".minute").css("transform",that.initHour)
            
        },
        toSignIn(){
            this.$router.push('/page/dutyRecord')
        },
        changeSignAddress(data,num){
            this.checkDistance = data.distance.toString()
            this.signAddressId = data.id
            this.signNumber = num
            if(data.allowSign==1){
                this.canSgin = true
            }else if(data.allowSign==0){
                if(data.allowDistance>data.distance){
                    this.canSgin = true
                }else{
                    this.canSgin = false
                }
            }

        },
        showPosition (position) {
            this.position = position
            this.showPositionValue = true
        },
        signIn(index){
            if(this.canSgin){
                this.loadingHand(true)
                if(index=='1'){
                    this.signNum = 1
                    
                    let obj = {
                        userId:this.user_id,
                        companyId:this.company_id,
                        x:this.longitude,
                        y:this.latitude,
                        checkinType:'5',
                        signAddressId:this.signAddressId,
                        checkDistance:this.checkDistance,
                        type:'0',

                    }
                    this.ADDSign(obj)
                    
                }else{
                    this.signNum = 0
                    let obj = {
                        userId:this.user_id,
                        companyId:this.company_id,
                        x:this.longitude,
                        y:this.latitude,
                        checkinType:'4',
                        signAddressId:this.signAddressId,
                        checkDistance:this.checkDistance,
                        type:'0',

                    }
                    
                    this.ADDSign(obj)
                }
            }else{
                this.$vux.toast.show({
                        text: '距离过远，不允许签到',
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
            }
            
        },
        getGreatCircleDistance(lat1,lng1,lat2,lng2){
            var EARTH_RADIUS = 6378137.0;
            var PI = Math.PI;
            var radLat1 = lat1*PI/180;
            var radLat2 = lat2*PI/180;
            
            var a = radLat1 - radLat2;
            var b = lng1*PI/180 - lng2*PI/180;
            
            var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
            s = s*EARTH_RADIUS;
            s = Math.round(s*10000)/10000.0;
                    
            return s;
        },
        compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            }
        }
    },
    computed: {
        ...mapState({
            signAddressData:state => state.oasign.signAddressData,
            signState:state => state.oasign.signState
        })
    },
    watch: {
        hour(newVal,oldVal){
            this.$nextTick(function(){
                this.loadingShow=false
            })
        },
        signAddressData(newVal){
            let that = this 
            if(newVal.data.alert_msg){
                this.$vux.toast.show({
                        text: newVal.data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
            }else{
                this.gpsList = newVal.data.items.signAddressList
                let that = this
                let lng = this.$store.state.oasign.GPSData.lng
                let lat = this.$store.state.oasign.GPSData.lat
                this.gpsList.filter(function(item){
                    item.distance = parseInt(that.getGreatCircleDistance(lat,lng,item.y,item.x))
                })
                this.gpsList.sort(that.compare('distance')).reverse();
                this.checkDistance=this.gpsList[0].distance.toString();
                this.signAddressId=this.gpsList[0].id;
                if(this.gpsList[0].allowSign=='1'){
                    this.canSgin = true
                }else{
                    if(this.gpsList[0].distance<this.gpsList[0].allowDistance){
                        this.canSgin = true
                    }else{
                        this.canSgin = false
                    }
                }
            }
        },
        gpsList(newVal){
            
            if(newVal.length==0){
                this.hasGPSList = false
            }else{
                this.hasGPSList = true
            }
        },
        signState:function(value){
            if(Object.keys(value).length>0){
                if(value.data.alert_msg){
                    this.toast=this.signState.data.alert_msg
                    this.show2=true
                }else{
                    this.loadingHand(false)
                    if(this.signNum==0){
                       this.$vux.toast.show({
                            text: '上班已打卡',
                            type: 'text',
                            position: 'top',
                            width:"20em"                                
                        })
                    }else{
                        this.$vux.toast.show({
                            text: '下班已打卡',
                            type: 'text',
                            position: 'top',
                            width:"20em"                                
                        })
                    }
                }
            }
        }
    },
    destroyed () {
        let that = this
        clearInterval(that.setIntervalOne);
        clearInterval(that.setIntervalTwo);
    },
    components: {
        Scroller,
        Toast,
        Loading
    },
}
</script>
<style lang="less">
body{
    overflow: hidden;
}
    #signIn{
        .vux-badge-dot{
            float: right !important;
            margin-right: 20px;
        }
    }
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
