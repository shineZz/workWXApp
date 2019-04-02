<template>
     <div class="mymap">
        <form class="searchBox" action="#" v-if="isHasSearch">
            <x-icon type="ios-search-strong" size="20" class=""></x-icon>
            <input type="search" v-model="searchVal" @search="searchPlace" placeholder="搜索附近地址" id="input_id">
            <input type="text" style="display:none">
            <a href="javascript:" class="weui-icon-clear" style="" @click="searchCancel"></a>
        </form>
        <div id="searchResult"></div>
        <div id="container"></div>
        <div v-if="!isNearby" style="position:absolute;top:300px;bottom:37px;width:100%;background:#fff;overflow:hidden;overflow-y:auto;" >
            <ul class="box">
                <li v-for="(item,index) in addressList" class="vux-1px-b" :class="index==0?'active':''" :key="index" @click="resetMap(item)">
                    <span>
                        <img src="@/images/job/locationSuccess.png" v-if="item.flag" alt="">
                        <img src="@/images/job/locationFail.png" v-if="!item.flag" alt="">
                    </span>
                    <div>
                        <p>{{item.name}}</p>
                        <p>{{item.address}}</p>
                    </div>
                    <div class="checkIcon">
                        <x-icon type="ios-checkmark" v-if="item.flag" :class="item.flag?'myVuxS':''" ></x-icon>
                        <x-icon type="ios-circle-outline" v-else :class="!item.flag?'myVux':''" ></x-icon>
                    </div>
                </li>
            </ul>
        </div>
        <div class="custom-list" v-else >
            <div class="custom-header vux-1px-b">
                <span>
                    <img :src="require('@/images/tool/n.png')" alt="">
                    附近客户
                </span>
                <span>
                    <i class="left" :class="personalCustom?'active':''" @click="changeFlag(true)">个人客户</i>
                    <i class="right" :class="personalCustom?'':'active'" @click="changeFlag(false)">团队客户</i>
                </span>
            </div>
            <div class="myScroller" >
                <div class='wu-all' style="height:150px;" v-if="customData.length==0" >
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>暂无客户</p>
                        </section>
                    </div>
                
                <ul class="customList" v-else>
                    <li  v-for="(i,index) in customData" :key="index" class="vux-1px-tb">
                        <div class="customDetail vux-1px-b">
                            <h5>{{i.customer_company_name}}</h5>
                            <h5>{{i.customer_name}}</h5>
                            <p>{{i.address}}</p>
                        </div>
                        <div class="customBtn">
                            <x-button @click.native="toApp(i)" plain mini>到这里</x-button>
                            <x-button @click.native="toSign(i)" plain mini>{{i.signOutFlag?'签退':'签到'}}</x-button>
                        </div>
                    </li>
                    
                </ul>
            </div>
        </div>
        <x-button type="primary" style="position:absolute;bottom:0px;" @click.native="toParentPage">确定</x-button>
     </div>
</template>
<script>
import { Scroller ,XButton } from 'vux'
import { mapState, mapActions , mapMutations} from 'vuex'
let phonePort = localStorage.getItem('phonePort')
export default {    
    name: 'mymap',
    data() {
        return {
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            searchVal:'',
            isResult:false,
            addressList:[],
            stateItem:{},
            isNearby:false,
            endLat:'',
            endLng:'',
            personalCustom:true,
            customData:[],
            O:'',
            P:'',
            isSign:false,
            isHasSearch:false,
            cpoint:[],
            signOutMsg:null,
        }
    },
    props:{
      addressData:Object,
      searchData:String,
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
        if(this.searchData){//创建客户的添加地址
            this.isNearby = false
            this.isHasSearch = true
            this.loadingHand(true)
        }
        if(this.$route.query.titleType==1){
            document.title="附近客户"
        }
        if(this.$router.path='/page/signDetail'){//签到添加地址
            this.isNearby=false
            // this.isSign = true
        }
        
    },
    mounted() {
        
        this.myGeolocation()
        
    },
    methods: {
        ...mapMutations({
            SELECTED_MEMBER: 'addressBook/SELECTED_MEMBER',
            loadingHand:'UPDATE_LOADING'
        }),
        ...mapActions({
            GETXSUSERLIST:'addressBook/GetXsUserList',
            qywxHand : 'qywxHand',
            customer_getNearCustomerLists:'customer/getNearCustomerLists',
            customervisitsign_getUnsignOutRecord:"customervisitsign/getUnsignOutRecord",
        }),
        searchCancel(){
            this.myGeolocation()
            this.searchVal=''
        },
        initNearAMap(){//拜访签到
            let _this = this
            let mySearchCity = ''
            let lng = ''
            let lat = ''
            let cpoint;
            let areaPlace;
            var map ;
            if(this.addressData){
                if(this.addressData.location.P){
                    cpoint = [this.addressData.location.O,this.addressData.location.P];
                    this.cpoint = cpoint
                    areaPlace = this.addressData.cityname
                }else{
                    cpoint =[120.117881,30.336488]
                    this.cpoint = cpoint
                    areaPlace = '杭州市'
                }
                AMap.plugin(['AMap.Geocoder',"AMap.PlaceSearch",'AMap.Autocomplete'], function() {
                    map = new AMap.Map('container', {
                        center:cpoint,
                        zoom:18
                    });
                    map.clearMap();
                    // 中心点图标
                    _this.addCircle(map,200)
                    var marker = new AMap.Marker({
                        position:  cpoint, // 基点位置
                        offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
                    });
                    map.add(marker);
                    // 中心点图标
                    //初始化默认选择地址//构造地点查询类
                    var placeSearch = new AMap.PlaceSearch({ 
                        pageSize: 40,
                        pageIndex: 2,
                        city: areaPlace, //城市
                        map: map,
                    });
                    //中心点坐标
                    placeSearch.searchNearBy('企业', cpoint, 2000, function(status, nearbyResult) {
                        if(status=='no_data'){
                            // alert('没有数据')
                            _this.$vux.toast.show({
                                text: '暂无数据',
                                type: 'text',
                                position: 'top'
                            })
                        }else{
                            // let len = nearbyResult.poiList.pois.length
                            let len = nearbyResult.poiList.pois.length
                            for(let i=0;i<len;i++){
                                if(i==0){
                                    nearbyResult.poiList.pois[i].flag = true
                                }else{
                                    nearbyResult.poiList.pois[i].flag = false
                                }
                            }
                            _this.addressList = nearbyResult.poiList.pois
                            _this.stateItem = _this.addressList[0]
                        }
                    });
                    // 搜索框的事件
                    var autoOptions = {
                        input: 'input_id',
                        output:'searchResult',
                        city:areaPlace,
                        citylimit:true
                    }
                    var autoComplete= new AMap.Autocomplete(autoOptions);
                    var placeSearch = new AMap.PlaceSearch({
                        map: map,
                        pageSize: 25,
                        pageIndex: 1,
                        city: areaPlace, //城市
                        map: map,
                    });  
                    //构造地点查询类
                    AMap.event.addListener(autoComplete, "select", select);//注册监听，当选中某条记录时会触发
                    function select(e) {
                        _this.searchVal = e.poi.name
                        AMap.service(["AMap.PlaceSearch"], function() {
                            placeSearch.searchNearBy(e.poi.name, cpoint, 1000, function(status, result) {
                                if(status!=='no_data'){
                                    let len = result.poiList.pois.length
                                    for(let i=0;i<len;i++){
                                        if(i==0){
                                            result.poiList.pois[i].flag = true
                                        }else{
                                            result.poiList.pois[i].flag = false
                                        }
                                    }
                                    map.clearMap();
                                    _this.addCircle(map,200)
                                    var marker = new AMap.Marker({
                                        position:  [result.poiList.pois[0].location.O, result.poiList.pois[0].location.P], // 基点位置
                                        offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
                                    });
                                    map.add(marker);
                                    _this.addressList = result.poiList.pois
                                    _this.stateItem = result.poiList.pois[0]
                                }else if(status=='no_data'){
                                    _this.addressList = []
                                    _this.$vux.toast.show({
                                        text: '未搜索到数据',
                                        type: 'text',
                                        position: 'top',
                                        width:'20em'
                                    })
                                }
                            });
                        });
                    }
                })
            }
        },
        toApp(data){
            
            if(phonePort=='qywx'){
                this.wx.openLocation({
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                    name: data.customer_company_name,
                    address: data.address,
                    scale: 14,
                    infoUrl: "http://weixin.qq.com"
                });
             }
            // else if(phonePort=='weixin'){
            //     this.$wechat.openLocation({
            //         latitude: parseFloat(data.latitude), // 纬度，浮点数，范围为90 ~ -90
            //         longitude: parseFloat(data.longitude), // 经度，浮点数，范围为180 ~ -180。
            //         name: data.customer_company_name,// 位置名
            //         address: data.address, // 地址详情说明
            //         scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
            //         infoUrl: "http://weixin.qq.com"// 在查看位置界面底部显示的超链接,可点击跳转
            //     });
                
            // }
            else{
                var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
                // if (ua.match(/MicroMessenger/i) != "micromessenger") {
                //     //在微信中打开
                //     // alert('weixin')
                    
                // }
                window.location.href='https://uri.amap.com/marker?position='+data.longitude+','+data.latitude+'&name='+data.address
            }
            
        },
        addCircle(map,radius){
            let _this = this 
             var circleMarker = new AMap.CircleMarker({
                center:_this.cpoint,
                radius:200,
                strokeColor:'#b4dff5',
                strokeWeight:2,
                strokeOpacity:0.5,
                fillColor:'white',
                fillOpacity:0.2,
                zIndex:10,
                bubble:true,
                cursor:'pointer',
                clickable: true
            })
            circleMarker.setMap(map)
        },
        toParentPage(){
            this.$emit('toggleMap',this.stateItem)
        },
        //拜访签到重新选择地址
        resetMap(item){
            let _this = this
            var map = new AMap.Map('container', {
                center:[item.location.O,item.location.P],
                zoom:18
            });
            var marker = new AMap.Marker({
                position:  [item.location.O, item.location.P], // 基点位置
                offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
            });
            this.addressList.forEach(function(i){
                if(i.id==item.id){
                    i.flag = !i.flag;
                    if(i.flag){
                        _this.stateItem = item
                    }else{
                        _this.stateItem = {}
                    }
                }else{
                    i.flag = false;
                }
            })
            map.add(marker);
            _this.addCircle(map,200)
            
        },
        //高德地图定位
        myGeolocation(){
            let _this = this
            var map = new AMap.Map('', {
                resizeEnable: true
            })
            map.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,
                    timeout: 10000,
                    buttonOffset: new AMap.Pixel(10, 20),
                    zoomToAccuracy: true,     
                    buttonPosition: 'RB'
                })

                geolocation.getCurrentPosition()
                AMap.event.addListener(geolocation, 'complete', onComplete)
                AMap.event.addListener(geolocation, 'error', onError)

                function onComplete (data) {
                    // data是具体的定位信息
                //     _this.addressData={
                //     address:data.formattedAddress,
                //     location:{
                //       O:data.position.O,
                //       P:data.position.P,
                //       lat:data.position.P,
                //       lng:data.position.O
                //     },
                //     pname:data.addressComponent.province,
                //     cityname:data.addressComponent.city,
                //     adname:data.addressComponent.district,
                //   };
                //   _this.address=data.formattedAddress
                // alert(data.position.O)
                _this.O = data.position.O
                _this.P = data.position.P
                  _this.$nextTick(function(){
                    if(_this.searchData){//创建客户的添加地址
                        _this.isNearby = false
                        _this.initAMap()
                    }
                    if(_this.$route.query.titleType==1){//搜索附近客户
                        _this.isNearby = true
                        _this.cpoint = [data.position.O,data.position.P]
                        let obj ={
                            company_id:_this.company_id,
                            user_id:_this.user_id,
                            type:1,
                            longitude:data.position.O,
                            latitude:data.position.P 
                        }
                        _this.customer_getNearCustomerLists(obj)
                    }
                    
                  })
                    if(_this.$route.path=="/page/signDetail"){//拜访签到搜索附近地址
                        _this.initNearAMap()
                    }
                }

                function onError (data) {
                    // 定位出错
                    _this.O = 120.118198
                    _this.P = 30.335869
                    _this.$nextTick(function(){
                    if(_this.searchData){//创建客户的添加地址
                        _this.isNearby = false
                        _this.initAMap()
                    }
                    if(_this.$route.query.titleType==1){//搜索附近客户
                        _this.isNearby = true
                        _this.cpoint = [120.118198,30.335869]
                        let obj ={
                            company_id:_this.company_id,
                            user_id:_this.user_id,
                            type:1,
                            longitude:120.118198,
                            latitude:30.335869 
                        }
                        _this.customer_getNearCustomerLists(obj)
                    }
                    
                  })
                    if(_this.$route.path=="/page/signDetail"){//拜访签到搜索附近地址
                        _this.initNearAMap()
                    }
                }
            },this)
        },
        initAMap(){
            let _this = this
            let mySearchCity = ''
            let lng = ''
            let lat = ''
            let cpoint;
            let areaPlace;
            var map ;
            var _arr
            if(this.searchData){
                _arr = this.searchData.split(' ')
                areaPlace=this.searchData+'政府'

                AMap.plugin(['AMap.Geocoder',"AMap.PlaceSearch",'AMap.Autocomplete'], function() {
                    var geocoder = new AMap.Geocoder({
                        radius: 10000000 //范围，默认：500
                    });
                    //地理编码,返回地理编码结果
                    geocoder.getLocation(areaPlace, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            // geocoder_CallBack(result);
                            geocoder_callBack(result)
                        }
                    });

                })
            }
            function geocoder_callBack(result){
                cpoint = [result.geocodes[0].location.lng,result.geocodes[0].location.lat];
                _this.cpoint = cpoint
                map = new AMap.Map('container', {
                    center:cpoint,
                    zoom:18
                });
                map.clearMap();
                // 中心点图标
                _this.addCircle(map,200)
                var marker = new AMap.Marker({
                    position:  cpoint, // 基点位置
                    offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
                });
                map.add(marker);
                // 中心点图标


                //初始化默认选择地址//构造地点查询类
                var placeSearch = new AMap.PlaceSearch({ 
                    pageSize: 40,
                    pageIndex: 2,
                    city: result.geocodes[0].addressComponent.district, //城市
                    map: map,
                });
                 //中心点坐标
                placeSearch.searchNearBy('企业', cpoint, 200000000000000, function(status, nearbyResult) {
                    if(status=='no_data'){
                        _this.loadingHand(false)
                        alert('没有数据')
                    }else{
                        _this.loadingHand(false)
                        // let len = nearbyResult.poiList.pois.length
                        let len = nearbyResult.poiList.pois.length
                        for(let i=0;i<len;i++){
                            if(i==0){
                                nearbyResult.poiList.pois[i].flag = true
                            }else{
                                nearbyResult.poiList.pois[i].flag = false
                            }
                        }
                        _this.addressList = nearbyResult.poiList.pois
                        _this.stateItem = _this.addressList[0]
                    }
                });
                // 搜索框的事件
                var autoOptions = {
                    input: 'input_id',
                    output:'searchResult',
                    city:_arr[1],
                    citylimit:true
                }
                var autoComplete= new AMap.Autocomplete(autoOptions);
                var placeSearch = new AMap.PlaceSearch({
                    map: map,
                    pageSize: 25,
                    pageIndex: 1,
                    city: '杭州市', //城市
                    map: map,
                });  
                //构造地点查询类
                AMap.event.addListener(autoComplete, "select", select);//注册监听，当选中某条记录时会触发
                function select(e) {
                    _this.searchVal = e.poi.name
                    _this.searchPlace(e.poi.name)
                    // if(Object.keys(e.poi.location).length>0){
                    //     _this.searchVal = e.poi.name
                    //     map.clearMap();
                    //     _this.addCircle(map,200)
                    //     var marker = new AMap.Marker({
                    //         position:  [e.poi.location.O, e.poi.location.P], // 基点位置
                    //         offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
                    //     });
                    //     map.add(marker);
                    //     e.poi.flag = true
                    //     _this.addressList = [e.poi]
                    //     _this.stateItem = e.poi
                    // }
                }
            }
        },
        searchPlace(_data){
            var map;
            var _this = this;
            $("#searchResult").hide()
            let areaPlace;
            if(_data){
                areaPlace = this.searchData+this.searchVal
            }else{
                areaPlace = _data
            }
            
            
            AMap.plugin(['AMap.Geocoder',"AMap.PlaceSearch",'AMap.Autocomplete'], function() {
                var geocoder = new AMap.Geocoder({
                    radius: 10000000 //范围，默认：500
                });
                //地理编码,返回地理编码结果
                geocoder.getLocation(areaPlace, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // geocoder_CallBack(result);
                        geocoder_callBack(result)
                    }
                });

            })
            function geocoder_callBack(result){
                map = new AMap.Map('container', {
                    center:[result.geocodes[0].location.O, result.geocodes[0].location.P],
                    zoom:18
                });
                map.clearMap();
                // 中心点图标
                _this.addCircle(map,200)
                var marker = new AMap.Marker({
                    position:  [result.geocodes[0].location.O, result.geocodes[0].location.P], // 基点位置
                    offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
                });
                map.add(marker);
                result.geocodes[0].flag=true
                result.geocodes[0].name=areaPlace
                result.geocodes[0].pname=result.geocodes[0].addressComponent.province
                result.geocodes[0].cityname=result.geocodes[0].addressComponent.city
                result.geocodes[0].aname=result.geocodes[0].addressComponent.district
                result.geocodes[0].address=result.geocodes[0].formattedAddress
                _this.addressList = result.geocodes
                _this.stateItem = result.geocodes[0]
            }
        },
        initAMapNearby(data){
            let _this = this
            // alert(_this.O)
            var map = new AMap.Map('container', {
                center:[_this.O,_this.P],
                zoom:13
            });
            _this.addCircle(map)
            var position=data
            var marker;		
            var infoWindow;

            for(var i=0 ; i< data.length;i++){
                var jfong=[ data[i].longitude,data[i].latitude];
                    marker = new AMap.Marker({
                    position: jfong,
                    zIndex: 101,
                    map:map
                    });	
                map.add(marker);
                marker.setMap(map);	
                let _child = data[i]
                marker.on('click', function(e){
                    marker.company=_child.customer_company_name;
                    marker.address=_child.address;
                    marker.linkMan=_child.customer_name;
                    var content = [
                        "<ul class='main' style='background:#fff;padding:10px;'>"
                        + "<li>  公司: <span style='color:blue'>" +marker.company+ "</span></li>"
                        + "<li>  联系人: <span style='color:blue'>" +marker.linkMan+ "</span></li>"
                        + "<li>  地址: <span style='color:blue'>" +marker.address+ "</span></li>"
                        +"</ul>"
                    ]
                    infoWindow = new AMap.InfoWindow({
                        content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
                    });
                    infoWindow.open(map, e.lnglat);
                });
            }	// for-end
        },
        changeFlag(data){
            this.personalCustom = data
            if(data){
                let obj ={
                    company_id:this.company_id,
                    user_id:this.user_id,
                    type:1,
                    longitude:this.O,
                    latitude:this.P  
                }
                this.customer_getNearCustomerLists(obj)
            }else{
                let obj ={
                    company_id:this.company_id,
                    user_id:this.user_id,
                    type:2,
                    longitude:this.O,
                    latitude:this.P  
                }
                this.customer_getNearCustomerLists(obj)
            }
        },
        toSign(i){
            let hasSign = window.localStorage.getItem('hasSign')
            if(i.signOutFlag){
                let signOutMsg = this.signOutMsg ;
                this.$router.push({path:'signDetail',query:{customerMsg:i,type:5,signOutMsg:signOutMsg}})
            }else{
                if(hasSign&&hasSign==1){
                    this.$vux.toast.show({
                            text: '您有未签退的拜访',
                            type: 'text',
                            position: 'top',
                            width:"20em"      
                        })
                }else{
                    this.$router.push({path:'signDetail',query:{customerMsg:i,type:5}})
                }
            }
            
        }
    },
    computed: {
        ...mapState({
           selectedMember: state => state.addressBook.selectedMember,
           qywxData: state => state.qywxData,
           wx:state => state.wx,
           userInfo:state => state.userInfo,   
           nearbyCustomerListData:state=>state.customer.nearbyCustomerListData,
           hasSignoutData:state =>state.customervisitsign.hasSignoutData,
        }),
    },
    watch: {
        //企业微信
       qywxData(data){
           if(Object.keys(data).length > 0 &&this.$route.name=='mymap') {
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
                        jsApiList:['openLocation']
                    })
                    this.wx.ready(function(){                        
                        // wx.closeWindow();
                    })
                    this.wx.error(function(res){
                        localStorage.setItem('phonePort', 'weixin') 
                        phonePort='weixin';
                    });
                }
            }
           
       },
        searchVal(val){
            let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
            let value = val.replace(reg,'')
            if(value.length>20){
            value = value.substr(0,20)
            }
            setTimeout(() => {
                this.searchVal = value;
            },10)
        },
        searchData:{
            handler:function(data){  
                let _data = data+'政府'
            },
            deep: true    //深度监听
        },
        nearbyCustomerListData(data){
            if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
            }else{ 

                this.customData=data.items  
                this.initAMapNearby(data.items)  
                let obj = {
                    user_id:this.user_id,
                    company_id:this.company_id
                }
                this.customervisitsign_getUnsignOutRecord(obj)              
            }
        },
       hasSignoutData(data){
            if(this.$route.name=='mymap'){
                if(data.alert_msg){
                    
                }else{
                    console.log(data,'----------')
                    let arr = []
                    this.customData.forEach((item)=>{
                        let obj = item
                        obj.signOutFlag = false;
                        if(obj.customer_id == data.items.customer_id){
                            obj.signOutFlag = true
                        }
                        arr.push(obj)
                    })
                    this.customData = arr
                    this.signOutMsg = data.items.id
                }
            }
            
        },
    },
    components: {
        Scroller,
        XButton
    },
}
</script>
<style lang="less">
.mymap{
    .customBtn{
        button{
            line-height: 20px;
        }
    }
    .vux-x-icon {
        fill: #d2d2d2;
        // margin-left: 15px;
        margin-right: 5px;
    }
    .myVux {
        fill: #d2d2d2 !important;
    }
    .myVuxS {
        fill: #09bb07;
    }
    .searchBox .vux-x-icon {
        fill: #d2d2d2;
        margin-left: 10px;
        margin-right: 5px;
    }
    
}    
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
