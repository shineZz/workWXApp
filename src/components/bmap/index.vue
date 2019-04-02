<template>
    <div class="bmap">
        
        <div id="container"  ></div>
        
    </div>
</template>

<script>
import { trim, Search, Group, GroupTitle, Scroller, LoadMore, Tab, TabItem, Tabbar, TabbarItem, TransferDom, Popup, Checklist, XButton } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy } from '@/util'
import listA from '@/components/listA'
import labelPage from '@/components/labels'
import checkers from '@/components/checkers'
import customer from '@/components/customer'
import axios from 'axios';
import { API_PARM_OBJ, LG_AES_CRMAPI,CRMAPI_URL,LG_AES_SALT_CRM } from '@/constants/interface';
import * as aes from '@/util/lgaes';
let _timer;
let userMsg_flag;
export default {
    name: 'bmap',
    data() {
        return {
            share: false,       //是否共享客户
            ifFocus: false,     //是否输入框焦点
            mapModel: false,     //是否地图模式
            batch: false,       //是否批量操作
            ifCheck: false,     //是否选中客户
            title: '我的客户',  //标题
            searchValue: '',    //搜索内容
            has_more: false,
            alert_msg: '加载中...',
            num_items: 0,
            listObj: {listData:[]},
            // popup
            group: false,
            groupValue: {label: '', value: ''},
            labels: false,
            labelValue: [],
            stage: false,
            stageValue: {label: '', value: ''},
            moveGroup: false,
            moveGroupValue: {label: '', value: ''},
            customer: false,
            radioChoice: false,
            // scroller相关
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            height: "-369",
            // 地图
            childCode:"",
            parentCode:"",
            firstCode:'100000',
            flag:true,
            num:0,
            btnContent:"",
            currentArea:'全国',
            lastArea:'',
            // 后台参数
            page: 1,
            count: 10,
            type: '',
            keyword: '',
            static_detail:null,
            hintType:'',
            keyword:'',//搜索关键词
            segment_id:'',//分组id
            label_ids:'',//标签
            stage_id:'',//客户阶段
            keywords:'',
            province_name:'',
            city_name:'',
        }
    },
    created(){
        this.loadingHand(false)
    },
    mounted(){
        //移动端调用方法名
        window.initMap = this.initMap;
        window.changeParameter = this.changeParameter;
        window.backMap = this.backMap;
        window.iosBackMap = this.iosBackMap;
        window.iosSetupWebViewJavascriptBridge = this.iosSetupWebViewJavascriptBridge;
        let _href = window.location.href ;
        let userId = _href.match(/userId=\d+/g)[0].replace('userId=','');
        let companyId =  _href.match(/companyId=\d+/g)[0].replace('companyId=','');
        this.userId = userId;
        this.companyId = companyId;
        let _this = this;
        userMsg_flag = false
        if(this.isIOS()){
            this.iosSetupWebViewJavascriptBridge(function(bridge) {
            /*JS给ObjC提供公开的API，在ObjC端可以手动调用JS的这个API。接收ObjC传过来的参数，且可以回调ObjC*/
                bridge.registerHandler('iosChangeParameter', function(data) {
                    _this.iosChangeParameter(data)
                })    
                bridge.registerHandler('iosBackMap', function(data) {
                    _this.iosBackMap()
                }) 
            })
        }
        $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
            let areaCode =_this.childCode?_this.childCode:100000 ;
            _this.initMap(areaCode,companyId,userId)
        })
        
    },
    methods: {
        ...mapActions({
            customer_myCustomerLists: 'customer/myCustomerLists',
            customer_shareMyCustomerLists: 'customer/shareMyCustomerLists',
            customer_updateCustomerSegment: 'customer/updateCustomerSegment',
            customer_addShareCustomers: 'customer/addShareCustomers',
            customer_changeCustomerBelonger: 'customer/changeCustomerBelonger',
            customer_deleteCustomers: 'customer/deleteCustomers',
        }),
        ...mapMutations({
            loadingHand:'UPDATE_LOADING',
            ResultChoice:'user/RESULTCHOICE',
            ShareCustom:'user/SHARECUSTOM'
        }),
        iosSetupWebViewJavascriptBridge(callback) {
            if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
            if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
        },
        backMap(){
            let _this = this
            $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                _this.initMap(_this.parentCode,_this.companyId,_this.userId)
            })
        },
        isIOS(){
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                return false
            }
            if (isIOS) {
                return true
            }
        },
        backMap(){
            let _this = this
            $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                _this.initMap(_this.parentCode,_this.companyId,_this.userId)
            })
        },
        iosBackMap(){
            let _this = this
            $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                _this.initMap(_this.parentCode,_this.companyId,_this.userId)
            })
        },
        iosChangeParameter(dataObj){
            let data = typeof(dataObj)=='String'?JSON.parse(dataObj):dataObj;
            this.isSearch=true;
            this.keywords = data.keywords.length>0?data.keywords:'';
            this.segment_id = data.segment_id.length>0?data.segment_id:'';
            this.label_ids = data.label_ids.length>0?data.label_ids:'';
            this.stage_id = data.stage_id.length>0?data.stage_id:'';
            let _this = this
            $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                let areaCode =_this.childCode?_this.childCode:100000 ;
                _this.initMap(areaCode,_this.companyId,_this.userId)
                
            })
        },
        changeParameter(dataObj){
            let data = typeof(dataObj)=='String'?JSON.parse(dataObj):dataObj;
            
            this.isSearch=true;
            this.keywords = data.keywords.length>0?data.keywords:'';
            this.segment_id = data.segment_id.length>0?data.segment_id:'';
            this.label_ids = data.label_ids.length>0?data.label_ids:'';
            this.stage_id = data.stage_id.length>0?data.stage_id:'';
            let _this = this
            $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                let areaCode =_this.childCode?_this.childCode:100000 ;
                if(!userMsg_flag){
                    userMsg_flag = true
                }else{
                    _this.initMap(areaCode,_this.companyId,_this.userId)
                }
                
            })
        },
        // 地图
        initMap(mycode,companyId,userId){
            let _this = this
            var map = new AMap.Map('container', {
                zoom: 3,
                // dragEnable: false,//禁止拖拽
            });
            // 同时引入工具条插件，比例尺插件和鹰眼插件
            AMap.plugin([
                'AMap.ToolBar',
                'AMap.Scale',
            ], function(){
                // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                map.addControl(new AMap.ToolBar());
                // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
                map.addControl(new AMap.Scale());
            });
            //just some colors
            var colors = ["#d12200", "#ff9900", "#109618"];//红黄绿
            // var colors = ["#959595","#f7f7f7","#4676d9"]
            AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {

                //创建一个实例
                var districtExplorer = window.districtExplorer = new DistrictExplorer({
                    eventSupport: true, //打开事件支持
                    map: map
                });
                var _arrResult=[];
                //当前聚焦的区域
                var currentAreaNode = null;
                //feature被点击
                districtExplorer.on('featureClick', function(e, feature) {

                    var props = feature.properties;

                    //如果存在子节点
                    if (props.childrenNum > 0) {
                        //切换聚焦区域
                        switch2AreaNode(props.adcode);
                    }
                });

                //外部区域被点击
                districtExplorer.on('outsideClick', function(e) {

                    districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {

                        if (routeFeatures && routeFeatures.length > 1) {
                            //切换到省级区域
                            switch2AreaNode(routeFeatures[1].properties.adcode);
                        } else {
                            //切换到全国
                            switch2AreaNode(100000);
                        }

                    }, {
                        levelLimit: 2
                    });
                });

                //绘制区域面板的节点
                function renderAreaPanelNode(ele, props, color) {

                    var $box = $('<li/>').addClass('lv_' + props.level);

                    var $h2 = $('<h2/>').addClass('lv_' + props.level).attr({
                        'data-adcode': props.adcode,
                        'data-level': props.level,
                        'data-children-num': props.childrenNum || void(0),
                        'data-center': props.center.join(',')
                    }).html(props.name).appendTo($box);

                    if (color) {
                        $h2.css('borderColor', color);
                    }

                    //如果存在子节点
                    if (props.childrenNum > 0) {

                        //显示隐藏
                        $('<div class="showHideBtn"></div>').appendTo($box);

                        //子区域列表
                        $('<ul/>').addClass('sublist lv_' + props.level).appendTo($box);

                        $('<div class="clear"></div>').appendTo($box);

                        if (props.level !== 'country') {
                            $box.addClass('hide-sub');
                        }
                    }

                    $box.appendTo(ele);
                }


                //填充某个节点的子区域列表
                function renderAreaPanel(areaNode) {

                    var props = areaNode.getProps();
                    
                    var $subBox = $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').siblings('ul.sublist');

                    if (!$subBox.length) {
                        //父节点不存在，先创建
                        renderAreaPanelNode($('#area-tree'), props);
                        $subBox = $('#area-tree').find('ul.sublist');
                    }

                    if ($subBox.attr('data-loaded') === 'rendered') {
                        return;
                    }

                    $subBox.attr('data-loaded', 'rendered');
                    
                    var subFeatures = areaNode.getSubFeatures();
                    map.clearMap(subFeatures)
                    
                    //填充子区域
                    let len = subFeatures.length
                    for (let i = 0; i < len; i++) {
                        //颜色范围设置
                        renderAreaPanelNode($subBox, areaNode.getPropsOfFeature(subFeatures[i]), "#009900")

                    }
                    //设置每个点标记的点击事件
                }

                //绘制某个区域的边界
                function renderAreaPolygons(areaNode,obj) {
                    // _this.currentArea = props.name
                    var props = areaNode.getProps();
                    if(_this.isSearch){
                        _this.isSearch=false
                    }else{

                        _this.currentArea = props.name
                    }
                    if(obj.length>0){
                        //更新地图视野
                        console.log(areaNode.getBounds(),'------------')
                        map.setBounds(areaNode.getBounds(), null, null, true);
                        districtExplorer.getAllFeaturePolygons()
                        //清除已有的绘制内容
                        districtExplorer.clearFeaturePolygons();
                        
                        //绘制子区域
                        districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
                            for(let i=0;i<obj.length;i++){
                                let reg = eval('/'+feature.properties.name+'/')
                                if(reg.test(obj[i].name)){
                                    feature.customerNum=obj[i].count
                                    break ;
                                }else{
                                    feature.customerNum=0
                                }
                            }
                            if(_arrResult.length==1){
                                if(Number(feature.customerNum)>0){
                                    var fillColor = colors[0];
                                }
                            }else{
                                if(Number(feature.customerNum)>=_arrResult[0]){
                                    var fillColor = colors[0];
                                }else if(Number(feature.customerNum)>=_arrResult[1]&&Number(feature.customerNum)<_arrResult[0]){
                                    var fillColor = colors[1];
                                }else if(Number(feature.customerNum)<_arrResult[1]&&Number(feature.customerNum)>0){
                                    var fillColor = colors[2];
                                }
                            }
                            
                            var marker;
                            var infoWindow;
                            if(feature.customerNum&&feature.customerNum>0){
                                //颜色范围设置
                                var icon = new AMap.Icon({
                                    size: new AMap.Size(15, 37),   // 图标尺寸
                                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAAELCAMAAAALPpOpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODBFQkUzN0RBMkM1MTFFODkxN0Q5QjRFMzM4MzY1NzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODBFQkUzN0VBMkM1MTFFODkxN0Q5QjRFMzM4MzY1NzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MEVCRTM3QkEyQzUxMUU4OTE3RDlCNEUzMzgzNjU3NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MEVCRTM3Q0EyQzUxMUU4OTE3RDlCNEUzMzgzNjU3NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv3wUS4AAAHLUExURUJXauReN+VZP+RdOeReOOVbPOVaPuVYQOdRS+VcO+VYQeVcOuVaPedQTOldU+hUUOZTSOZURupnV+RdOOZSSedQTeZVRelhVeVZQORcOu6JZOVbO+VZPudQTuZUR+pqWO6MZeliVeZXQuZWQ+dQT+2IY+dPTeRfN+ZXQ+6KZORdOu2DYellVuljVedST+hWUehYUet1XO6LZD9UZ+VXQuprWOtxWuVbPe2AYO2EYutzW5JRTTxRZOx7XuhZUu6JY+dTUEBUZ+2FYutyW+ZWRDdLX35PUeleVOhbU+lgVEBVaOhcU+ZVRFRqe+twWutxWz1SZehaUu2CYZBRTd9cO+leU+dRSuhXUdxbPjdMX01jdex5XZ1SS+puWeBcOut2XVVrfUthc09ld0JXaex8XzpPYo5QTulhVERZbERYa9xbP+t2XGlNVEVabUVabOdTTzZKXUZbbuprWVBld+2BYVBLWOhbUupoV+x/YOdRT+dRTDlNYOpmV+2HY1FmeDZKXuhVUOdSSutvWulkVpxSS1ZsfWhMVDhMYOx6Xkdcb+x+X+ptWUxKWepmVuZSSuZTR+plVk1idOpsWe6NZVdtfjRIXORfNudPTgAAACwhBzIAAACZdFJOU///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////APNecBsAAAV1SURBVHja7NvnY9pGFADwk4TATBsbExMIjvdq4iyvrCZpdrOa7r333rvp3hv7pD+3DAOSbkp34kvf+2rEz+/uSTrpHsgNFU4gwh2NIjsRRKQqhfGQBknaQ3okOQ/po8Qc0kmJOKTZ4mpIM8XlkHaKw6E4LGckDOaoRi4jiznq8Y1hymGOjljESRlMi+XMW9gWY46mKGJSQ6Gt4ctXpv44cO8+0eeqGKf5GP/4Q6OHN480OnH38WFB+WMiNyRtFW5uNXyxtIevpZtajo2xDzw4udIgY49o1jCeCI29fWNvgxZ7+SNptbQMA2McM7tGp5pxDxebaWEJOsaaq5UGM+a4NZlvYd6SRAJrdr3Bi/v4V8i2Zspiq5tcS6ZEMCYx+hDONVSw8YU2lpXCpo4ILMEwOhvYN5CIY323X2TNCS5aMx0s4ceoeQktQek7zlAH695u2FhBOIaik7oZCeytEcSyVueElqA8+sXfTY2FzW4KqSWx5RzbxYw+RvnUuogS3mLaUcfe1BhYga2c+3l9clTi5umrkE5B0rFZ1vXwg8lD4ZYiXQyndjHyM+/RqRcKoZciVhezWdgZ6j1l60qEdU+1lxoLu0GzXj8YZZGV7GFmGyPXAEsUazLais7sYVU6tkax7oq4fEz1MIOObWnLy3Ey2DNpyJU5xw5HXhgf62NJGnacsFY+1YGladg5ArsUfcnvGUaDgp0mrMcVni/6BdKcNBL7mMA+UsBqHixFYk8HrV9Vnpw2PFgNEX++HcRGVbCsB9sgsH3EymNYBTM8WJXAVoPWbRUr77FwhcAe1HdC7z4R9iJBYAeC2JoKdt6LGQT2ha5LMHGaYUxgo0FsSlcxymAFBWsc87GXg9jDClhdgJ0JnGdf6psyEnNO+bGbKpiF+aXvXPavsVWuHyV/YhaJOU9qK/yMH8tSMOfbHrVf6SIcGEVs0zDn0icd69RpJesvv4WTyGW8Evvt37+/VnwLmAxgJtL2gpH9BMNZFmiLzACxvBGwrBgxIrEcdfmtZ8aCiTUfY2LDTExMWWxYibCW48OyBJZkPVNr2LCgjGJM2J8LhGVxXrooxXiFTKwWF0ZWYudVWRzYNYplc9/KaVoFexOLAXsoQbGyojepES9TFjMx7Vh+mWalxS+ko+SVxezENGP0MextoyGd24+lBNUyZPdiwkTRoFr9zRiNWIZOebaZPFtan6lNl82wDOr+2fS0glVOMCzvRqR3Z9DMlqKmlWNRvi1W356njSfyUe4o0wbTSrO3jivYWBwPPYIWk2rfMpmb4mPNR7bpMNnNl5fZlG93lbLd35pnIzMkeyVcHONQ3kKkNzJ0qsoui0dzvp7EOIxFadHY/V+N3HlefvmiafCp4BjSm0/6810xr9FOhqFiKo2FMSbXVuP7poVsLjVTLtZHSiMj9fJMJpk2sExUZBuGclg5bPnupJShaJmhmryWVSgrbPtaLbqVi9CYl45GZaN1Aaas8FTCjNxMaSZCUjWlNlEzRHaWqdwAm7HlqGpKT2uvKayVrCnzPbJNyxM282YyZpuSXyLfId2szuRrD/ieX42nHklOxNKO3f70zs7vP1586cT3T5y4/+IbH+7shDw8LOYPwAD7f2Du9fef/QX9NCBsuxU/vDJAbHv76CCx5waJPTNIbBswwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMsC52fZDYP4PEbnWxV+PH3u396tiNE3usSX11tmddiBW7defFC54fil+NFXN9P0p/x40Xu+rF3ooZc4/2refduDEXPdqhPn/TjR9rZXfy5Nkox/0nwABsb1CIQBlVPAAAAABJRU5ErkJggg==',  // Icon的图像
                                    imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
                                    imageSize: new AMap.Size(15, 37)   // 根据所设置的大小拉伸或压缩图片
                                });
                                // 设置每个点标记的点击事件
                                var jfong=[ feature.properties.center[0],feature.properties.center[1]];	
                                marker = new AMap.Marker({
                                    position: jfong,
                                    zIndex: 101,
                                    map:map,
                                    icon:icon,
                                    offset: new AMap.Pixel(-8, -37),
                                });
                                map.add(marker);
                                marker.setMap(map); 
                                let _child = feature
                                marker.on('click', function(e){
                                    marker.province=_child.properties.name;
                                    marker.number=_child.customerNum;
                                    marker.node = _child.properties.adcode
                                    var content = [
                                        "<ul class='main' style='background:#fff;padding:10px;'>"
                                        + "<li>  地区: <span style='color:blue' >" +marker.province+ "</span></li>"
                                        + "<li>  人数: <span style='color:blue'>" +marker.number+ "</span></li>"
                                        +"</ul>"
                                    ]
                                    infoWindow = new AMap.InfoWindow({
                                        content: content.join("<br>"),  //传入 dom 对象，或者 html 字符串
                                        autoMove:true
                                    });
                                    infoWindow.open(map, e.lnglat);
                                });
                            }
                            return {
                                cursor: 'default',
                                bubble: true,
                                // strokeColor: strokeColor, //线颜色
                                strokeOpacity: 1, //线透明度
                                strokeWeight: 0.35, //线宽
                                fillColor: fillColor, //填充色
                                fillOpacity: 0.5, //填充透明度
                            };
                        });
                        
                    }else{
                        //更新地图视野
                        map.setBounds(areaNode.getBounds(), null, null, true);

                        //清除已有的绘制内容
                        districtExplorer.clearFeaturePolygons();

                        //绘制子区域
                        districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
                            // var fillColor = colors[1];
                            var marker;
                            var icon = new AMap.Icon({
                                    size: new AMap.Size(15, 37),   // 图标尺寸
                                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAAELCAMAAAALPpOpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODBFQkUzN0RBMkM1MTFFODkxN0Q5QjRFMzM4MzY1NzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODBFQkUzN0VBMkM1MTFFODkxN0Q5QjRFMzM4MzY1NzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MEVCRTM3QkEyQzUxMUU4OTE3RDlCNEUzMzgzNjU3NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MEVCRTM3Q0EyQzUxMUU4OTE3RDlCNEUzMzgzNjU3NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv3wUS4AAAHLUExURUJXauReN+VZP+RdOeReOOVbPOVaPuVYQOdRS+VcO+VYQeVcOuVaPedQTOldU+hUUOZTSOZURupnV+RdOOZSSedQTeZVRelhVeVZQORcOu6JZOVbO+VZPudQTuZUR+pqWO6MZeliVeZXQuZWQ+dQT+2IY+dPTeRfN+ZXQ+6KZORdOu2DYellVuljVedST+hWUehYUet1XO6LZD9UZ+VXQuprWOtxWuVbPe2AYO2EYutzW5JRTTxRZOx7XuhZUu6JY+dTUEBUZ+2FYutyW+ZWRDdLX35PUeleVOhbU+lgVEBVaOhcU+ZVRFRqe+twWutxWz1SZehaUu2CYZBRTd9cO+leU+dRSuhXUdxbPjdMX01jdex5XZ1SS+puWeBcOut2XVVrfUthc09ld0JXaex8XzpPYo5QTulhVERZbERYa9xbP+t2XGlNVEVabUVabOdTTzZKXUZbbuprWVBld+2BYVBLWOhbUupoV+x/YOdRT+dRTDlNYOpmV+2HY1FmeDZKXuhVUOdSSutvWulkVpxSS1ZsfWhMVDhMYOx6Xkdcb+x+X+ptWUxKWepmVuZSSuZTR+plVk1idOpsWe6NZVdtfjRIXORfNudPTgAAACwhBzIAAACZdFJOU///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////APNecBsAAAV1SURBVHja7NvnY9pGFADwk4TATBsbExMIjvdq4iyvrCZpdrOa7r333rvp3hv7pD+3DAOSbkp34kvf+2rEz+/uSTrpHsgNFU4gwh2NIjsRRKQqhfGQBknaQ3okOQ/po8Qc0kmJOKTZ4mpIM8XlkHaKw6E4LGckDOaoRi4jiznq8Y1hymGOjljESRlMi+XMW9gWY46mKGJSQ6Gt4ctXpv44cO8+0eeqGKf5GP/4Q6OHN480OnH38WFB+WMiNyRtFW5uNXyxtIevpZtajo2xDzw4udIgY49o1jCeCI29fWNvgxZ7+SNptbQMA2McM7tGp5pxDxebaWEJOsaaq5UGM+a4NZlvYd6SRAJrdr3Bi/v4V8i2Zspiq5tcS6ZEMCYx+hDONVSw8YU2lpXCpo4ILMEwOhvYN5CIY323X2TNCS5aMx0s4ceoeQktQek7zlAH695u2FhBOIaik7oZCeytEcSyVueElqA8+sXfTY2FzW4KqSWx5RzbxYw+RvnUuogS3mLaUcfe1BhYga2c+3l9clTi5umrkE5B0rFZ1vXwg8lD4ZYiXQyndjHyM+/RqRcKoZciVhezWdgZ6j1l60qEdU+1lxoLu0GzXj8YZZGV7GFmGyPXAEsUazLais7sYVU6tkax7oq4fEz1MIOObWnLy3Ey2DNpyJU5xw5HXhgf62NJGnacsFY+1YGladg5ArsUfcnvGUaDgp0mrMcVni/6BdKcNBL7mMA+UsBqHixFYk8HrV9Vnpw2PFgNEX++HcRGVbCsB9sgsH3EymNYBTM8WJXAVoPWbRUr77FwhcAe1HdC7z4R9iJBYAeC2JoKdt6LGQT2ha5LMHGaYUxgo0FsSlcxymAFBWsc87GXg9jDClhdgJ0JnGdf6psyEnNO+bGbKpiF+aXvXPavsVWuHyV/YhaJOU9qK/yMH8tSMOfbHrVf6SIcGEVs0zDn0icd69RpJesvv4WTyGW8Evvt37+/VnwLmAxgJtL2gpH9BMNZFmiLzACxvBGwrBgxIrEcdfmtZ8aCiTUfY2LDTExMWWxYibCW48OyBJZkPVNr2LCgjGJM2J8LhGVxXrooxXiFTKwWF0ZWYudVWRzYNYplc9/KaVoFexOLAXsoQbGyojepES9TFjMx7Vh+mWalxS+ko+SVxezENGP0MextoyGd24+lBNUyZPdiwkTRoFr9zRiNWIZOebaZPFtan6lNl82wDOr+2fS0glVOMCzvRqR3Z9DMlqKmlWNRvi1W356njSfyUe4o0wbTSrO3jivYWBwPPYIWk2rfMpmb4mPNR7bpMNnNl5fZlG93lbLd35pnIzMkeyVcHONQ3kKkNzJ0qsoui0dzvp7EOIxFadHY/V+N3HlefvmiafCp4BjSm0/6810xr9FOhqFiKo2FMSbXVuP7poVsLjVTLtZHSiMj9fJMJpk2sExUZBuGclg5bPnupJShaJmhmryWVSgrbPtaLbqVi9CYl45GZaN1Aaas8FTCjNxMaSZCUjWlNlEzRHaWqdwAm7HlqGpKT2uvKayVrCnzPbJNyxM282YyZpuSXyLfId2szuRrD/ieX42nHklOxNKO3f70zs7vP1586cT3T5y4/+IbH+7shDw8LOYPwAD7f2Du9fef/QX9NCBsuxU/vDJAbHv76CCx5waJPTNIbBswwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMsC52fZDYP4PEbnWxV+PH3u396tiNE3usSX11tmddiBW7defFC54fil+NFXN9P0p/x40Xu+rF3ooZc4/2refduDEXPdqhPn/TjR9rZXfy5Nkox/0nwABsb1CIQBlVPAAAAABJRU5ErkJggg==',  // Icon的图像
                                    imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
                                    imageSize: new AMap.Size(15, 37)   // 根据所设置的大小拉伸或压缩图片
                                });
                            // 设置每个点标记的点击事件
                            var jfong=[ feature.properties.center[0],feature.properties.center[1]];	
                            marker = new AMap.Marker({
                                position: jfong,
                                zIndex: 101,
                                map:map,
                                icon:icon,
                                offset: new AMap.Pixel(-8, -37),
                            });
                            map.add(marker);
                            marker.setMap(map);
                            map.remove(marker);
                            return {
                                cursor: 'default',
                                bubble: true,
                                // strokeColor: strokeColor, //线颜色
                                strokeOpacity: 1, //线透明度
                                strokeWeight: 0.35, //线宽
                                fillColor: null, //填充色
                                fillOpacity: 0.5, //填充透明度
                            };
                        });
                    }
                    //绘制父区域
                    districtExplorer.renderParentFeature(areaNode, {
                        // cursor: 'default',
                        // bubble: true,
                        // strokeColor: 'black', //线颜色
                        strokeOpacity: 1, //线透明度
                        strokeWeight: 0, //线宽
                        fillColor: null, //填充色
                        fillOpacity: 0.5, //填充透明度
                    });
                }

                //切换区域后刷新显示内容
                function refreshAreaNode(areaNode) {
                    var props = areaNode.getProps();
                    if(LG_AES_CRMAPI){
                        aes.setCryptKey(LG_AES_SALT_CRM);
                    }
                    let obj = {
                            app_key:LG_AES_CRMAPI?(aes.encrypt(API_PARM_OBJ.app_key)):API_PARM_OBJ.app_key,
                            v:LG_AES_CRMAPI?(aes.encrypt(API_PARM_OBJ.v)):API_PARM_OBJ.v,
                            sig:LG_AES_CRMAPI?(aes.encrypt(API_PARM_OBJ.sig)):API_PARM_OBJ.sig,
                            company_id:LG_AES_CRMAPI?(aes.encrypt(companyId)):companyId,
                            user_id:LG_AES_CRMAPI?(aes.encrypt(userId)):userId,
                            page:LG_AES_CRMAPI?(aes.encrypt('1')):'1',
                            count:LG_AES_CRMAPI?(aes.encrypt('10')):'10',
                            is_map:LG_AES_CRMAPI?(aes.encrypt('1')):'1',
                        }
                    if(_this.segment_id){
                        obj.segment_id = LG_AES_CRMAPI?(aes.encrypt(_this.segment_id)):_this.segment_id
                    }
                    if(_this.label_ids.length>0){
                        obj.label_ids = LG_AES_CRMAPI?(aes.encrypt(_this.label_ids)):_this.label_ids
                    }
                    if(_this.stage_id){
                        obj.stage_id = LG_AES_CRMAPI?(aes.encrypt(_this.stage_id)):_this.stage_id
                    }
                    if(_this.keywords){
                        obj.keywords = LG_AES_CRMAPI?(aes.encrypt(_this.keywords)):_this.keywords
                    }
                    if(areaNode.adcode=='100000'){
                        if(!_this.isSearch){
                            _this.province_name=''
                            //原生端交互
                            if(_this.isIOS()){
                                _this.iosSetupWebViewJavascriptBridge(function(bridge) {
                                                   
                                    /*JS给ObjC提供公开的API，ObjC端通过注册，就可以在JS端调用此API时，得到回调。ObjC端可以在处理完成后，反馈给JS，这样写就是在载入页面完成时就先调用*/
                                    bridge.callHandler('getProvinceData',{province_name:'',city_name:'',fix_name:_this.btnContent})
                                })
                            }else{
                                if(typeof(client)!='undefined'){
                                    client.getDataByJS('','',_this.btnContent)
                                }
                            }
                            
                            
                        }
                    }else if(/0000/.test(areaNode.adcode)){
                        /********************************ajax start************************************/
                        if(!_this.isSearch){
                            _this.province_name = props.name
                            _this.city_name=''
                            //原生端交互
                            if(_this.isIOS()){
                                _this.iosSetupWebViewJavascriptBridge(function(bridge) {      
                                    /*JS给ObjC提供公开的API，ObjC端通过注册，就可以在JS端调用此API时，得到回调。ObjC端可以在处理完成后，反馈给JS，这样写就是在载入页面完成时就先调用*/
                                    bridge.callHandler('getProvinceData', {province_name:_this.province_name,city_name:'',fix_name:_this.btnContent})
                                })
                            }else{
                                // client.getDataByJS(_this.province_name,_this.city_name,_this.btnContent)
                                if(typeof(client)!='undefined'){
                                    client.getDataByJS(_this.province_name,'',_this.btnContent)
                                }
                            }
                            
                            
                        }
                        obj.province_name = LG_AES_CRMAPI?(aes.encrypt(props.name)):props.name
                    
                    }else{
                        /********************************ajax start************************************/
                        if(!_this.isSearch){
                            _this.province_name = _this.currentArea;
                            _this.city_name = props.name;
                            //原生端交互
                            if(_this.isIOS()){
                                _this.iosSetupWebViewJavascriptBridge(function(bridge) {
                                                   
                                    /*JS给ObjC提供公开的API，ObjC端通过注册，就可以在JS端调用此API时，得到回调。ObjC端可以在处理完成后，反馈给JS，这样写就是在载入页面完成时就先调用*/
                                    bridge.callHandler('getProvinceData', {province_name:_this.province_name,city_name:_this.city_name,fix_name:_this.btnContent})
                                })
                            }else{
                                if(typeof(client)!='undefined'){
                                    client.getDataByJS(_this.province_name,_this.city_name,_this.btnContent)
                                }
                            }
                           
                            
                        }
                        obj.province_name = LG_AES_CRMAPI?(aes.encrypt(_this.province_name)):_this.province_name;
                        obj.city_name = LG_AES_CRMAPI?(aes.encrypt(props.name)):props.name;
                    }

                        $.ajax({
                            // url:"http://dev-crmapi.51lick.cn:18880/customer/myCustomerLists",
                            url:CRMAPI_URL+'/customer/myCustomerLists',//ZSAPI_URL+'/uploadattch/uploadFile'
                            type:'get',
                            data:obj,
                            success:function(res){
                                if(JSON.parse(res).data.alert_msg){
                                    _this.$vux.toast.show({
                                        text: JSON.parse(res).data.alert_msg,
                                        type: 'text',
                                        position: 'top',
                                        width:"18em"
                                    })
                                }else{
                                    let _obj = JSON.parse(res).data.items.static_detail.static
                                    _this.listObj.listData=[]
                                    _this.num_items = JSON.parse(res).data.num_items
                                     _this.has_more = JSON.parse(res).data.has_more
                                     let _listData = JSON.parse(res).data.items.lists.map(item => {
                                        return {
                                            name: item.customer_name,
                                            img: item.logo_big,
                                            work: item.customer_company_name,
                                            label: item.label_xref,
                                            id: item.customer_id,
                                            tel: '+' + item.mobile_code + ' ' + item.mobile,
                                            state: item.stage_name,
                                            time: item.action_note,
                                            icon: {
                                                iconType: 2,
                                            },
                                            url: {
                                                link: 'customPage',
                                                query: {id: item.customer_id, logo: item.logo_big, name: item.customer_name, mobile: '+' + item.mobile_code + ' ' + item.mobile, company: item.customer_company_name},
                                            },
                                            logoNameFlag: false,
                                            color: parseInt(Math.random()*3+1)
                                        }
                                    })
                                     _this.has_more = JSON.parse(res).data.has_more
                                    _this.listObj.listData = _listData
                                    //对地区按照人数进行排序
                                    let _arr = objDeepCopy([])
                                    _arrResult = []
                                    _obj.forEach(function(item){
                                        _arr.push(item.count)
                                    })
                                    _arr = _this.uniq(_arr).reverse() 
                                    if(_arr.length>2){
                                        let parse = parseInt(_arr.length/3)
                                        for(let i=1;i<3;i++){
                                            for(let j=0;j<_arr.length;j++){
                                                if(j==(i*parse)){
                                                    _arrResult.push(_arr[j-1])
                                                }
                                            }
                                        }
                                    }else{
                                        _arrResult = _arr
                                    }
                                    //对地区按照人数进行排序
                                    //初始化scroller
                                    _this.page = 1
                                    /********************************ajax结束************************************/
                                    //判断点击区域的上一级，设置下面的按钮
                                    renderAreaPolygons(areaNode,_obj);

                                }
                                    
                             }
                        })
                    
                    
                }
                //切换区域
                function switch2AreaNode(adcode, callback) {
                    
                    if(!_this.isSearch){
                        if(adcode==100000){
                            _this.btnContent = ""
                        }else if(/0000/.test(adcode)){
                            _this.btnContent = "全国图"
                        }else{
                            _this.btnContent = _this.currentArea
                        }
                        _this.parentCode = _this.childCode
                        _this.childCode = adcode
                        if(/0000/.test(_this.childCode)){
                            _this.parentCode = '100000'
                        }
                    }
                    
                    
                    //判断点击区域的上一级，设置下面的按钮
                    if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
                        return;
                    }
                    loadAreaNode(adcode,function(error, areaNode) {

                        if (error) {

                            if (callback) {
                                callback(error);
                            }

                            return;
                        }

                        currentAreaNode = window.currentAreaNode = areaNode;

                        //设置当前使用的定位用节点
                        districtExplorer.setAreaNodesForLocating([currentAreaNode]);

                        refreshAreaNode(areaNode);

                        if (callback) {
                            callback(null ,areaNode);
                        }
                    });
                }
                //加载区域
                function loadAreaNode(adcode ,callback) {

                    districtExplorer.loadAreaNode(adcode, function(error, areaNode) {

                        if (error) {

                            if (callback) {
                                callback(error);
                            }

                            console.error(error);

                            return;
                        }

                        renderAreaPanel(areaNode);

                        if (callback) {
                            callback(null, areaNode);
                        }
                    });
                }
                //全国
                switch2AreaNode(mycode);
            });
        },//排序
        uniq(array){
            function sortNumber(a,b){
                return a - b
            };
            let _this = this
            array.sort(sortNumber);
            var temp=[array[0]];
            for(var i = 1; i < array.length; i++){
                if( array[i] !== temp[temp.length-1]){
                    temp.push(array[i]);
                }
            }

            return temp;
        },
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            myCustomerLists: state => state.customer.myCustomerLists,
            shareCustomerLists: state => state.customer.shareCustomerLists,
            updateSegment: state => state.customer.updateSegment,
            addShare: state => state.customer.addShare,
            changeBelong: state => state.customer.changeBelong,
            deleteCustomers: state => state.customer.deleteCustomers,
            resultChoice:state=>state.user.resultChoice,
        }),
    },
    watch: {
        // 监听客户是否选中
        'listObj.listData': {
            handler: function(newData, oldData) {
                if (!this.batch) {
                    return
                }
                if (newData.find(v => v.icon.iconFlag)) {
                    this.ifCheck = true
                } else {
                    this.ifCheck = false
                }
            },
            deep: true
        },
        myCustomerLists(data) {
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
                    this.has_more = data.has_more
                    let arr = []
                    if (this.mapModel) {
                        this.static_detail = data.items.static_detail
                        arr = data.items.lists.map(item => {
                            return {
                                name: item.customer_name,
                                img: item.logo_big,
                                work: item.customer_company_name,
                                label: item.label_xref,
                                id: item.customer_id,
                                tel: '+' + item.mobile_code + ' ' + item.mobile,
                                state: item.stage_name,
                                time: item.action_note,
                                icon: {
                                    iconType: 2,
                                },
                                url: {
                                    link: 'customPage',
                                    query: {id: item.customer_id, logo: item.logo_big, name: item.customer_name, mobile: '+' + item.mobile_code + ' ' + item.mobile, company: item.customer_company_name},
                                },
                                logoNameFlag: false,
                                color: parseInt(Math.random()*3+1)
                            }
                        })
                    } else {
                        arr = data.items.lists.map(item => {
                            return {
                                name: item.customer_name,
                                img: item.logo_big,
                                work: item.customer_company_name,
                                label: item.label_xref,
                                id: item.customer_id,
                                tel: '+' + item.mobile_code + ' ' + item.mobile,
                                state: item.stage_name,
                                time: item.action_note,
                                icon: {
                                    iconType: 2,
                                },
                                url: {
                                    link: 'customPage',
                                    query: {id: item.customer_id, logo: item.logo_big, name: item.customer_name, mobile: '+' + item.mobile_code + ' ' + item.mobile, company: item.customer_company_name},
                                },
                                logoNameFlag: false,
                                color: parseInt(Math.random()*3+1)
                            }
                        })
                    }
                    if (this.page == 1) {
                        this.num_items = parseInt(data.num_items)
                        this.listObj.listData = arr
                    } else {
                        arr.forEach(item => {
                            item.icon={
                                iconType: this.batch?1:2,
                                iconFlag: false,
                            }
                        })
                        this.listObj.listData = this.listObj.listData.concat(arr)
                        
                    }
                }
            }
        },
        shareCustomerLists(data) {
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
                    this.has_more = data.has_more
                    let arr = data.items.map(item => {
                        return {
                            name: item.customer_name,
                            img: item.logo_big,
                            work: item.customer_company_name,
                            label: item.label_xref,
                            id: item.customer_id,
                            tel: '+' + item.mobile_code + ' ' + item.mobile,
                            state: item.stage_name,
                            time: item.action_note,
                            icon: {
                                iconType: 2,
                            },
                            url: {
                                link: 'customPage',
                                query: {id: item.customer_id, logo: item.logo_big, name: item.customer_name, company: item.customer_company_name, mobile: '+' + item.mobile_code + ' ' + item.mobile, share: true},
                            },
                            logoNameFlag: false,
                            color: parseInt(Math.random()*3+1)
                        }
                    })
                    if (this.page == 1) {
                        this.num_items = parseInt(data.num_items)
                        this.listObj.listData = arr
                        
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                        
                    }
                }
            }
        },
        updateSegment(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'myCustom') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.moveGroup = false
                    this.$vux.toast.show({
                        text: '移动分组成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.batchHand()
                    this.refresh()
                }
            }
        },
        addShare(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'myCustom') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.customer = false
                    this.$vux.toast.show({
                        text: '共享客户成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.batchHand()
                    this.refresh()
                    this.ResultChoice([])//清空选择
                    this.ShareCustom([])
                }
            }
        },
        changeBelong(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'myCustom') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.customer = false
                    this.$vux.toast.show({
                        text: '转移客户成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.batchHand()
                    this.refresh()
                    this.ResultChoice([])//清空选择
                    this.ShareCustom([])
                }
            }
        },
        deleteCustomers(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'myCustom') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.$vux.toast.show({
                        text: '删除客户成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.batchHand()
                    this.refresh()
                }
            }
        },
    },
    directives: {
        TransferDom
    },
    components: {
        Search, Group, GroupTitle, Scroller, LoadMore, Tab, TabItem, Tabbar, TabbarItem, Popup, Checklist, XButton, listA, labelPage, checkers, customer
    },
    beforeRouteEnter (to, from, next) {
        next(true)
    },
    beforeRouteLeave (to, from, next) {
        next(false)
    },
}
</script>

<style lang="less">
.bmap .weui-search-bar__box {
    position: static;
    // padding-right: 0;
}

.bmap .focus .weui-search-bar__box {
    position: relative;
}

.bmap .vux-tab .vux-tab-item.vux-tab-selected {
    color: #666;
}

.bmap .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    color: #999;
}

.bmap .ifCheck.weui-tabbar__item .weui-tabbar__label {
    color: @blue;
}
</style>


<style lang="less" scoped>
 @import './index.less';

</style>
