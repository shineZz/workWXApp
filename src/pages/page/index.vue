<template>
    <div class="page-view"  >
        <view-box ref="viewBox" 
                  :body-padding-bottom="isPaddingBottom"  
                  :body-padding-top="isPaddingTop">       
                  <!-- <keep-alive :include="/talentList|promote/">
                    <router-view class="router-view"></router-view>
                </keep-alive> -->
           
             <transition @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
                :name="viewTransition" :css="!!direction">
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive" class="router-view">
                        </router-view>
                    </keep-alive>
            </transition>
                    
            <transition @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
                :name="viewTransition" :css="!!direction">
                    <router-view v-if="!$route.meta.keepAlive" class="router-view"></router-view>
            </transition>
            <tabbar slot="bottom"
                    v-if="!isShowTabbar">
                <tabbar-item link="/page/home"
                            :selected="$route.path === '/page/home'">
                    <span class="icon icon-home"
                          slot="icon"></span>
                    <span slot="label">首页</span>
                </tabbar-item>
                <tabbar-item link="/page/customs"
                             :selected="$route.path === '/page/customs'">
                    <span class="icon icon-custom"
                          slot="icon"></span>
                    <span slot="label">客户</span>
                </tabbar-item>
                <tabbar-item link="/page/job"
                             :selected="$route.path === '/page/job'">
                    <span class="icon icon-category"
                          slot="icon"></span>
                    <span slot="label">工作</span>
                </tabbar-item>
                <tabbar-item link="/page/business"
                             :selected="$route.path === '/page/business'">
                    <span class="icon icon-merchants"
                          slot="icon"></span>
                    <span slot="label">招商</span>
                </tabbar-item>
                <tabbar-item link="/page/talentList"
                             :selected="$route.path === '/page/talentList'">
                    <span class="icon icon-resumeList"
                          slot="icon"></span>
                    <span slot="label">找人才</span>
                </tabbar-item>
               
            </tabbar>
        </view-box>
    </div>
</template>

<script>
import {
    Tabbar,
    TabbarItem,
    ViewBox,
    XHeader,
    Actionsheet,
    TransferDom,
    cookie
} from 'vux'
import { mapState, mapMutations ,mapActions} from 'vuex'

export default {
    name: 'page',
    directives: {
        TransferDom
    },
    data() {
        return {
            showMenu: false,
            menus: {
                menu1: '关于 Pretty Vendor ',
                menu2: '喜欢就给我个star吧 ^_^ ',
                menu3: '退出登录'
            },
            userId:this.$store.state.userInfo.user.userId,
            companyId:this.$store.state.userInfo.user.companyId,
            lat:'',
            lng:''
        }
    },
    mounted() {
        // this.CHANGE_PAGETYPE("resumeList")
        this.openTheGps()
        //省市区存储
        if(typeof(cookie.get('pcaCookie')) =='undefined'){//设置省市区的失效时间
            cookie.set('pcaCookie',1,{
                expires: 30
            })
            this.ucarea_getAreaList()
        }
    },
    computed: {
        ...mapState(
            // ['title','direction']
            {
                title:state =>state.title,
                direction:state => state.direction,
                isLoading: state => state.isLoading,
                signout: state => state.signout,
                hasSignoutData:state =>state.customervisitsign.hasSignoutData,
                ucareaData:state =>state.ucarea.ucareaData,
                signOutData:state =>state.customervisitsign.signOutData
            }
        ),
        leftOptions() {
            return {
                showBack: this.$route.path !== '/page/home'
            }
        },
        rightOptions() {
            return {
                showMore: true
            }
        },
        isShowTabbar() {
            if(/inform|announce|company|customStaff|companyDetail|customDetail|workStatement|dayStatement|statement|workApproving/.test(this.$route.path)){
                return true
            }
            if (/home|job/.test(this.$route.path)) {
                return false
            }
            return true
        },
        isPaddingBottom() {
            if (/home|talentList|talentDetail|business|customs|customPage/.test(this.$route.path)) {
                if (this.$route.query.reviewProgress) {
                    return '0'
                }
                if (this.$route.name === 'customPage' && this.$route.query.highSeas) {
                    return '36px'
                }
                return '53px'
            }else{
                return '0'
            }
           
        },
        isPaddingTop(){
            return '0';
            // if (/business/.test(this.$route.path)) {
            //     return '58px'
           
            // }else{
                
            // }
            
        },
        headerTransition () {
            if (!this.direction) return ''
            return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
        },
        viewTransition () {
            if (!this.direction) return ''
            return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
        },
       
         
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SIGN_OUT:'SIGNOUT',
            CHECKSIGNOUT:'CHECKSIGNOUT'
        }),
//  cachedViews () {
        //     if(this.direction === 'forward' ){
        //         return ['talentList','promote']
        //         // return /talentList|promote/
        //     }else{
        //         return ['talentList','promote','Progress']
        //         // return /talentList|Progress|promote/
        //     }
            
        // },
        ...mapActions({
            customervisitsign_updateCustomerVisitSignOut:"customervisitsign/updateCustomerVisitSignOut",
            customervisitsign_getUnsignOutRecord:"customervisitsign/getUnsignOutRecord",
            ucarea_getAreaList: 'ucarea/getAreaList',
        }),
        //判断自动签退距离
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
        openTheGps(){
             let _this = this;
            if(!this.signout.isOpenGps){
                var map = new AMap.Map('', {
                    resizeEnable: true
                })
                map.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                        // 是否使用高精度定位，默认：true
                        enableHighAccuracy: true,
                        // 设置定位超时时间，默认：无穷大
                        timeout: 10000,
                        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                        buttonOffset: new AMap.Pixel(10, 20),
                        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        zoomToAccuracy: true,     
                        //  定位按钮的排放位置,  RB表示右下
                        buttonPosition: 'RB'
                    })

                    geolocation.getCurrentPosition()
                    AMap.event.addListener(geolocation, 'complete', onComplete)
                    AMap.event.addListener(geolocation, 'error', onError)

                    function onComplete (data) {
                        // data是具体的定位信息
                        _this.SIGN_OUT({
                            isOpenGps:true,
                            location:{
                                lat:data.position.O,
                                lng:data.position.P,
                                O:data.position.O,
                                P:data.position.P,
                            },
                            province:data.addressComponent.province,
                            city:data.addressComponent.city,
                            area:data.addressComponent.city,
                        })
                        _this.lat = data.position.O;
                        _this.lng = data.position.P;
                        let obj = {
                            user_id:_this.userId,
                            company_id:_this.companyId,
                        }
                        _this.customervisitsign_getUnsignOutRecord(obj)
                    }

                    function onError (data) {
                        // 定位出错
                        let obj = {
                            isOpenGps:false,
                            location:{
                                lat:"120.118198",
                                lng:"30.335869",
                                O:"120.118198",
                                P:'30.335869',
                            },
                            province:"浙江省",
                            city:"杭州市",
                            area:"拱墅区",
                        }
                        _this.SIGN_OUT(obj)
                    }
                },this)

            }
        },

    },
    watch:{
        hasSignoutData(data){
            if(data.alert_msg){
                window.localStorage.setItem('hasSign','0')
            }else{
                console.log(data,'=========')
                this.CHECKSIGNOUT(true)
                window.localStorage.setItem('hasSign','1')
                let lat = this.lng
                let lng = this.lat
                let distance = parseInt(this.getGreatCircleDistance(this.lng,this.lat,data.items.latitude,data.items.longitude))
                if(Number(distance)>Number(2000)&&data.items.user_id==this.userId&&data.items.auto_sign_out==1){//超出两千米并且只有自己的签到auto_sign_out=1为自动签退
                    let obj = {
                        company_id:this.companyId,
                        user_id:this.userId,
                        id:data.items.id
                    }
                    this.customervisitsign_updateCustomerVisitSignOut(obj)

                }
                
            }
            
        },
        signOutData(data){
            if(this.$route.name!='mymap'){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
                }else{
                    // alert('000')
                    window.localStorage.removeItem('hasSign')
                    
                    // this.$vux.toast.show({
                    //     text: '自动签退成功',
                    //     type: 'text',
                    //     position: 'top',
                    //     width:"20em"                                
                    // }) 
                }
            }
            
        },  
        ucareaData(data) {
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
                    let arr = data.items.slice(1, data.items.length).map(v=>{
                        return {
                            name: v.name,
                            value: v.id,
                            parent: v.parentid==1?'0':v.parentid,
                            level:v.level-1
                        }
                    })
                    localStorage.setItem('pca', JSON.stringify(arr))
                    
                }
            }
        },
    },
    components: {
        Tabbar,
        TabbarItem,
        ViewBox,
        XHeader,
        Actionsheet,
        TransferDom
    }
}
</script>

<style lang="less">
 @import './index.less';
</style>
