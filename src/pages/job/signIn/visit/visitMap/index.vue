<template>
    <div class="visitMap" id="visitMap">
        <div class="visitMap-content" >
            <div class="search-box" id="lll">
            <search cancel-text=' ' ref="search" v-model="value" @on-submit="getMsg" @on-focus="searchAddress" />
            </div>
            <div id="canvasContainer" style="overflow:hidden">
                <div id="container"></div>
            </div>
            <div class="result-box">
                <scroller
                    lock-x 
                    scrollbar-y
                    height="100%"
                    ref='scroller'
                    >
                    <div>
                        <ul id="Rresult">
                            <li v-for="(i,index) in addressList" :key="index" @click="resetMap(i.location,i.uid,i)">
                                <span>
                                    <img src="@/images/job/locationSuccess.png" v-if="i.flag" alt="">
                                    <img src="@/images/job/locationFail.png" v-if="!i.flag" alt="">
                                </span>
                                <div class="vux-1px-b">
                                    <p>{{i.name}}</p>
                                    <p>{{i.address}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </scroller>
            </div>
            <x-button style="position:absolute;bottom:0px;" type="primary" @click.native="confirm">确认</x-button>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Cell , Calendar,Group, ButtonTab,XTextarea,XButton, Scroller , Grid, GridItem,Search  } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'
import axios from 'axios'
export default {
    name: 'visitMap',
    data() {
        return {
            value:"",
            result:false,
            addressList:[],
            initLng:"",
            initLat:"",
            selectedData:{},
            loadingTrue:true,
        }
    },
    created() {
        document.title="地点微调"
        let _this = this
        this.loadingHand(true)
        $.getScript('http://api.map.baidu.com/getscript?v=2.0&ak=CBiu8d6o1peWFBWqvzYGA7fy', function() {
            _this.getMsg()    
        }, this);
    },
    mounted() {
        
        // this.mapInit()
        
        $("#container canvas").css('width','0')
        $("#container canvas").css('height','0')
        
    },
    methods: {
        ...mapMutations({
            loadingHand:'UPDATE_LOADING'
        }),
        tovisitMap(index){
            if(index==0){
                this.$router.push('/page/duty')
            }else{
                this.$router.push('/page/visit')
            }
        },
        searchAddress(){
            this.addressList=[]
        },
        addMarker(point,map){  // 创建图标对象   
            var marker = new BMap.Marker(point);
            // 创建标注对象并添加到地图   
            var circle = new BMap.Circle(point,200);   
            circle.setFillColor("blue"); //填充颜色
            circle.setStrokeWeight(1);// 设置圆形边线的宽度，取值为大于等于1的整数。
            circle.setFillOpacity(0.3);// 返回圆形的填充透明度。
            circle.setStrokeOpacity(0.3);// 设置圆形的边线透明度，取值范围0 - 1。
            map.addOverlay(marker);    
            map.addOverlay(circle);
        }  ,
        resetMap(pos,id,data){
            var map = new BMap.Map("container");
            // this.companyName = data. 
            let that = this 
            // 创建地图实例  
            let lat=pos.lat
            let lng = pos.lng
            var point = new BMap.Point(lng,lat);
            this.selectedData = data
            // 创建点坐标  
            map.centerAndZoom(point, 17);
            // 初始化地图，设置中心点坐标和地图级别  
            this.addMarker(point,map)
            this.addressList.filter(function(item){
                if(item.uid==id){
                    item.flag=true
                }else{
                    item.flag=false
                }
                
            })
            
        },
        getMsg(){
            let that = this 
            let searchVal
            if(this.value){
                searchVal = that.value
            }else{
                searchVal = "公司"
            }
            var map = new BMap.Map("container");
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    that.initLng = r.point.lng
                    that.initLat = r.point.lat
                    var mPoint = new BMap.Point(r.point.lng,r.point.lat);  
                    map.enableScrollWheelZoom();
                    map.centerAndZoom(mPoint,17);
                    var marker = new BMap.Marker(mPoint);
                    var circle = new BMap.Circle(mPoint,300,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
                    map.addOverlay(circle);
                    map.addOverlay(marker);
                    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});  
                    local.searchNearby(that.value,mPoint,300);
                    let myLocation = r.point.lat+","+r.point.lng
                    let obj = {
                        query:searchVal,
                        location:myLocation,
                        output:'json',
                        radius:"1000",
                        ak:'2fYAMeg69itIRubF4Pop4n99bhqC1Kkn' 
                    }
                    $.ajax({
                        type : 'GET',
                        dataType : 'jsonp',
                        data : obj,
                        url : "http://api.map.baidu.com/place/v2/search",
                        success : function (data){
                            that.loadingHand(false)
                            
                            if(data.results.length==0){
                                that.$vux.toast.show({
                                    text: '未搜索到结果',
                                    type: 'text',
                                    position: 'middle',
                                    width:'15em'
                                })
                            }else{
                                that.selectedData = data.results[0]
                                data.results.filter(function(item,index){
                                    if(index==0){
                                        item.flag=true
                                    }else{
                                        item.flag=false
                                    }
                                    
                                })
                                that.addressList = data.results
                                that.$nextTick(function(){
                                    that.$refs.scroller.reset({
                                        top:0
                                    })
                                })
                            }
                        }
                    });

                }
                else {
                    // alert('failed'+this.getStatus());
                }        
            });
            
           this.$refs.search.setBlur()
           
        },
        confirm(){
            let that = this
            that.$emit("toggleMap",{lat:that.initLat,lng:that.initLng,selectedData:that.selectedData})
            document.title="拜访签到"
        }
    },
    computed: {
    },
    watch: {
    },
    destroyed () {
        
    },
    components: {
        CellBox,
        Calendar,
        Group,
        ButtonTab, 
        Scroller,
        Grid, 
        GridItem, 
        Search,
        XButton,
    },
}
</script>
<style lang="less">
.visitMap{
    .weui-search-bar__label{
        line-height: 26px;
    }
}

</style>

<style lang="less" scoped>
 @import './index.less';
</style>
