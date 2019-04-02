<template>
    <div class="myCustom">
        <!-- 搜索框 -->
        <search ref="search" :class="{'focus': ifFocus}" :auto-fixed="false" placeholder="请输入姓名、电话、邮箱、公司名称"
        v-model="searchValue" @on-focus="ifFocus=true" @on-cancel="cancelHand" @on-submit="searchHand" @on-change="changeHand">
            <div slot="right" v-show="!ifFocus&&highSeas">
                <a href="javascript:;" @click="toggleHighSeas" v-show="reviewProgress" class="search-right-text">公海客户</a>
                <a href="javascript:;" @click="toggleHighSeas" v-show="!reviewProgress" class="search-right-text">审核进度</a>
            </div>
            <div slot="right" v-show="!ifFocus&&!share&&!highSeas">
                <a href="javascript:;" @click="toggleHand" v-show="mapModel"><img src="@/images/toolbar/category@selected.png" class="search-right"></a>
                <a href="javascript:;" @click="toggleHand" v-show="!mapModel"><img src="@/images/custom/customer/newCustom/map.png" class="search-right"></a>
                <router-link :to="{name: 'appendCustom'}"><img src="@/images/custom/customer/add.png" class="search-right"></router-link>
            </div>
        </search>
        <!-- 筛选 --> 
        <tab class="fixed-tab" :line-width="0">
            <tab-item :class="{'selected': groupValue.label}" @click.native="toggleTrue('group')">
                分组
                <img src="@/images/custom/customer/myCustom/group.png" class="tab-right" v-show="!groupValue.label">
                <img src="@/images/custom/customer/myCustom/group2.png" class="tab-right" v-show="groupValue.label">
            </tab-item>
            <tab-item :class="{'selected': labelValue.length>0}" @click.native="toggleTrue('labels')">
                标签
                <img src="@/images/custom/customer/myCustom/label.png" class="tab-right" v-show="labelValue.length===0">
                <img src="@/images/custom/customer/myCustom/label2.png" class="tab-right" v-show="labelValue.length>0">
            </tab-item>
            <tab-item :class="{'selected': stageValue.label}" @click.native="toggleTrue('stage')">
                客户阶段
                <img src="@/images/custom/customer/myCustom/stage.png" class="tab-right" v-show="!stageValue.label">
                <img src="@/images/custom/customer/myCustom/stage2.png" class="tab-right" v-show="stageValue.label">
            </tab-item>
        </tab>
        <!-- 地图 -->
        <div id="container" v-show="mapModel" v-if="!share&&!highSeas"></div>
        <!-- 列表头部 -->
        <group>
            <group-title slot="title" v-show="mapModel&&!share&&!highSeas||num_items!==0">{{mapModel?currentArea:''}}共{{num_items}}位客户
                <span class="delete" id="toParent" style="color:#66aef4" v-show="mapModel" v-if="!share&&!highSeas" @click="backMap">{{btnContent}}</span>
                <span class="delete" v-show="!mapModel" @click="batchHand" v-if="!share&&!highSeas&&num_items">{{batch?'取消':''}}批量操作</span>
            </group-title>
        </group>
        <!-- 列表内容 -->
        <scroller lock-x scrollbarY ref="scroller" @on-scroll-bottom="loadMore" :height="height"
        v-model="status" use-pulldown @on-pulldown-loading="refresh">
            <div>
                <div>
                    <listA :listObj="listObj" v-if="listObj.listData.length>0" @showTaskingModel="showTaskingModel" @refuseTaskingModel="refuseTaskingModel"/>
                    <!-- 无数据页面 -->
                    <div class='wu-all wu-allB' v-else :style="mapModel&&!share&&!highSeas?'padding-top:60px':'padding-top:120px'">
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>{{isLoading?alert_msg:'暂无客户数据'}}</p>
                        </section>
                    </div>
                </div>
                <!-- 底部区域 -->
                <load-more tip="加载中" v-show="has_more"></load-more>
                <div class="no-more" v-if="!has_more&&page!==1">已到底部</div>
            </div>
            <!-- 下拉组件 -->
            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉加载更多</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放后加载</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>
        </scroller>
        <!-- 底部批量操作 -->
        <tabbar v-show="!mapModel&&batch" v-if="!share&&!highSeas">
            <tabbar-item @click.native="moveGroupHand" :class="{ifCheck}">
                <span slot="label">移动分组</span>
            </tabbar-item>
            <tabbar-item @click.native="moveCustomHand(false)" :class="{ifCheck}">
                <span slot="label">共享客户</span>
            </tabbar-item>
            <tabbar-item @click.native="moveCustomHand(true)" :class="{ifCheck}">
                <span slot="label">转移客户</span>
            </tabbar-item>
            <tabbar-item @click.native="deleteHand" :class="{ifCheck}">
                <span slot="label">删除客户</span>
            </tabbar-item>
        </tabbar>
        <!-- popup -->
         <div v-transfer-dom>
            <!-- 分组 -->
            <popup v-model="group" height="100%" v-if="group">
                <div class="popup">
                    <checkers :checkValue="[groupValue.value]" show="group" @toggle="togglePop"/>
                </div>
            </popup>
            <!-- 标签 -->
            <popup v-model="labels" height="100%" v-if="labels">
                <div class="popup">
                    <labelPage :checkValue="labelValue" propState="2" @toggleLabel="togglePop" />
                </div>
            </popup>
            <!-- 阶段 -->
            <popup v-model="stage" height="100%" v-if="stage">
                <div class="popup">
                    <checkers :checkValue="[stageValue.value]" show="stage" @toggle="togglePop"/>
                </div>
            </popup>
            <!-- 移动分组 -->
            <popup v-model="moveGroup" height="100%" v-if="!share&&moveGroup">
                    <!-- <div>
                        <checklist :max="1" :options="groupList" v-model="moveGroupCheck"></checklist>
                    </div> -->
                <div class="popup">
                    <checkers :checkValue="[moveGroupValue.value]" show="group" @toggle="togglePop"/>
                </div>
            </popup>
            <!-- 共享转移 -->
            <popup v-model="customer" height="100%" v-if="!share&&customer">
                <div class="popup">
                    <customer @toggleCustomer="togglePop" propsState="2" :radioChoice="radioChoice" :btn='true' :hintType="hintType"/>
                </div>
            </popup>
            <!-- 分派公海客户 -->
            <popup v-model="tasking" height="100%" v-if="!share&&tasking" class="highSeas">
                <div class="popup">
                    <group>
                        <cell title="客户：" :value="highSeasCustomer.name" value-align="left" class="has"></cell>
                    </group>
                    <FormA :moduleObj="moduleObj" @toggle="togglePop" ref="tasking"/>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import { trim, Search, Group, GroupTitle, Scroller, LoadMore, Tab, TabItem, Tabbar, TabbarItem, TransferDom, Popup, Checklist, XButton, Cell } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy } from '@/util'
import listA from '@/components/listA'
import labelPage from '@/components/labels'
import checkers from '@/components/checkers'
import customer from '@/components/customer'
import FormA from '@/components/formA'
import axios from 'axios';
import { API_PARM_OBJ, LG_AES_CRMAPI,CRMAPI_URL,LG_AES_SALT_CRM } from '@/constants/interface';
import * as aes from '@/util/lgaes';
let _timer;
export default {
    name: 'myCustom',
    data() {
        return {
            share: false,       //是否共享客户
            highSeas: false,    //是否公海客户
            reviewProgress: false,  //是否审核进度
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
            highSeasCustomer: {},
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
            tasking: false,
            moduleObj: {
                title: '申领原因：',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '',
                disabledFlag: false,
                showBtn: true,
                uploadData: [],
                record: true,
                showBtn: true,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 15,
            },
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
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            page: 1,
            count: 10,
            type: '',
            keyword: '',
            static_detail:null,
            province_name:'',
            area_name:'',
            hintType:'',
        }
    },
    // created() {
    //     this.share = this.$route.query.share || false
    //     if(this.share) {
    //         this.title = document.title = "共享客户"
    //         this.mapModel = false
    //         this.height = "-129"
    //         this.searchHand()
    //     } else {
    //         this.mapModel = JSON.parse(sessionStorage.getItem('mapModel'))
    //         this.height = this.mapModel?"-369":"-129"
    //         if (!this.mapModel) {
    //             this.searchHand()
    //         }else if(this.mapModel){
    //             let _this = this
    //             $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
    //                 _this.initMap(100000)
    //             })
    //         }
    //     }
    //     // this.searchHand()
    //     this.ResultChoice([])//清空选择
    // },
    mounted() {
        // if(!this.share) {
        //     let _this = this
        //     $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
        //         _this.initMap(100000)
        //     })
        // }
    },
    // updated() {
    //     document.title = this.title = this.reviewProgress?'审核列表':this.highSeas?'公海客户':this.share?'共享客户':'我的客户'
    // },
    methods: {
        ...mapActions({
            customer_myCustomerLists: 'customer/myCustomerLists',
            customer_shareMyCustomerLists: 'customer/shareMyCustomerLists',
            customer_updateCustomerSegment: 'customer/updateCustomerSegment',
            customer_addShareCustomers: 'customer/addShareCustomers',
            customer_changeCustomerBelonger: 'customer/changeCustomerBelonger',
            customer_deleteCustomers: 'customer/deleteCustomers',
            customer_seaCustomerLists: 'customer/seaCustomerLists',
            customer_seaCusAuditRecordLists: 'customer/seaCusAuditRecordLists',
            customerattach_uploadFile: 'customerattach/uploadFile',
            customer_saveSeaCustomerAudit: 'customer/saveSeaCustomerAudit',
        }),
        ...mapMutations({
            UPDATE_LOADING:'UPDATE_LOADING',
            ResultChoice:'user/RESULTCHOICE',
            ShareCustom:'user/SHARECUSTOM'
        }),
        toggleTrue(type){
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                if(type=='group'){
                    this.group=true
                }else if(type=='labels'){
                    this.labels=true
                }else if(type=='stage'){
                    this.stage=true
                }
            },300)
        },
        // 搜索
        searchHand() {
            this.searchValue = trim(this.searchValue)
            this.page = 1
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                segment_id: this.groupValue.value,
                label_ids: this.labelValue.map(v=>v.id).join(),
                stage_id: this.stageValue.value,
                keywords: this.searchValue,
                page: this.page,
                count: this.count,
            }
            if(this.mapModel){//地图模式搜索
                this.isSearch=true
                let _this = this
                $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                    let areaCode =_this.childCode?_this.childCode:100000 ;
                    _this.initMap(areaCode)
                })
            }else{
                this.handleRequest(obj)
            }
            
            this.$nextTick(()=>{
                this.$refs.search.setBlur()
            })
        },
        backMap(){
            let _this = this
            $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                _this.initMap(_this.parentCode)
            })
        },
        changeHand(val) {
            if (val.length>50) {
                val = val.substring(0, 50)
            }
            this.$nextTick(()=>{
                this.searchValue = val
            })
            return
        },
        cancelHand() {
            this.ifFocus = false
            this.searchValue = ''
            if(this.mapModel){
                let _this = this
                $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                    _this.initMap(100000)
                })
            }else{
                this.searchHand()
            }
        },
        // 切换审核进度-公海客户
        toggleHighSeas () {
            this.reviewProgress = !this.reviewProgress
            this.title = document.title = this.reviewProgress?"审核进度":"公海客户"
            this.searchValue = ''
            this.groupValue = {label: '', value: ''}
            this.labelValue = []
            this.stageValue = {label: '', value: ''}
            this.searchHand()
        },
        // 切换地图列表模式
        toggleHand() {
            this.mapModel = !this.mapModel
            if(this.mapModel){
                let _this = this;
                $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                    _this.initMap(100000)
                })
            }else{
                this.searchHand()
            }
            sessionStorage.setItem('mapModel', this.mapModel)
            this.batch = false
            this.height = this.mapModel?"-365":"-125"
            this.$nextTick(() => {
                this.$refs.scroller.reset({
                    top: 0
                })
            })
        },
        // 关闭popup
        togglePop(obj) {
            if (this.group) {
                this.groupValue = Object.keys(obj).length>0?obj:{label: '', value: ''}
                this.page = 1
                if(this.mapModel){//地图模式数据调用
                    let _this = this
                    this.isSearch=true
                    $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                        _this.initMap(_this.childCode)
                    })
                }else{
                    this.searchHand()
                }
                this.group = false
                return
            }
            if (this.stage) {
                this.stageValue = Object.keys(obj).length>0?obj:{label: '', value: ''}
                this.page = 1
                if(this.mapModel){//地图模式数据调用
                    this.isSearch=true
                    let _this = this
                    $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                        _this.initMap(_this.childCode)
                    })
                }else{
                    this.searchHand()
                }
                this.stage = false
                return
            }
            if (this.labels) {
                this.labelValue = obj
                this.page = 1
                if(this.mapModel){//地图模式数据调用
                    let _this = this
                    this.isSearch=true
                    $.getScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11',function(){
                        _this.initMap(_this.childCode)
                    })
                }else{
                    this.searchHand()
                }
                this.labels = false
                return
            }
            if (this.moveGroup) {
                // this.moveGroupValue = obj
                if (obj.value) {
                    let array = []
                    this.listObj.listData.forEach(v=>{
                        if (v.icon.iconFlag) {
                            array.push(v.id)
                        }
                    })
                    let obj1 = {
                        customer_ids: array.join(),
                        company_id: this.companyId,
                        user_id: this.userId,
                        segment_id: obj.value,
                    }
                    this.customer_updateCustomerSegment(obj1)
                    return
                }
                this.moveGroup = false
                return
            }
            if (this.customer) {
                if (obj.length>0) {
                    let array = []
                    this.listObj.listData.forEach(v=>{
                        if (v.icon.iconFlag) {
                            array.push(v.id)
                        }
                    })
                    if (!this.radioChoice) {
                        // 共享
                        let arr = objDeepCopy(obj)
                        let index = arr.findIndex(v=>v.userId == this.userId)
                        if (index !== -1) {
                            arr.splice(index, 1)
                        }
                        let obj1 = {
                            customer_ids: array.join(),
                            company_id: this.companyId,
                            user_id: this.userId,
                            share_userIds: arr.map(v=>v.userId).join(),
                        }
                        this.customer_addShareCustomers(obj1)
                        return
                    } else {
                        // 转移
                        let obj1 = {
                            company_id: this.companyId,
                            user_id: this.userId,
                            customer_ids: array.join(),
                            belong_userId: obj[0].userId,
                        }
                        this.customer_changeCustomerBelonger(obj1)
                        this.ResultChoice([])//清空选择
                        return
                    }
                }
                
                this.customer = false
                return
            }
            if (this.tasking) {
                if (!this.moduleObj.inputVal) {
                    this.$vux.toast.show({
                        text: '申领原因不能为空！',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                if (this.moduleObj.uploadData.length>0) {
                    let obj1 = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        source: 16,
                        // source_id: this.customerId,
                        upfile_base64: JSON.stringify(this.moduleObj.uploadData.map(v=>{
                            return {
                                origin_name: v.name,
                                data: v.src
                            }
                        })),
                    }
                    this.UPDATE_LOADING(true)
                    this.customerattach_uploadFile(obj1)
                    return
                } else if (this.moduleObj.inputVal) {
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_ids: this.highSeasCustomer.id,
                        to_user_id: this.userId,
                        type: 1,
                        note: this.moduleObj.inputVal,
                        // attach_ids: data.items.map(v=>v.id).join()
                    }
                    if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                        obj.attach_ids = this.moduleObj.recordObj.id
                    }
                    this.UPDATE_LOADING(true)
                    this.customer_saveSeaCustomerAudit(obj)
                }
            }
        },
        // 批量操作
        batchHand() {
            this.batch = !this.batch
            this.listObj.listData.forEach(item => {
                item.icon={
                    iconType: this.batch?1:2,
                    iconFlag: false,
                }
            })
            this.listObj.radioData = []
            this.listObj.radioFlag = false

            this.height = this.batch?"-175":"-125"
            this.$nextTick(() => {
                this.$refs.scroller.reset()
            })
        },
        // 请求
        handleRequest(obj) {
            if (this.isLoading) {
                return
            }
            if (this.share) {
                this.customer_shareMyCustomerLists(obj)
            } else {
                if (this.highSeas) {
                    if (this.reviewProgress) {
                        this.customer_seaCusAuditRecordLists(obj)
                    } else {
                        this.customer_seaCustomerLists(obj)
                    }
                    return
                }
                if (this.mapModel) {
                    // is_map =0 不开启地图模式 is_map =1 开启地图模式查询 地图开启可以传province_name 或者 city_name 两个不传默认全国
                    obj.is_map = '1'
                    if(this.province_name){
                        obj.province_name=this.province_name
                    }
                    if(this.area_name){
                        obj.area_name=this.area_name
                    }
                } else {
                    obj.is_map = '0'
                    if (this.batch&&this.page==1) {
                        this.batch = false
                        this.listObj.listData.forEach(item => {
                            item.icon={
                                iconType: 2,
                                iconFlag: false,
                            }
                        })
                        this.listObj.radioData = []
                        this.listObj.radioFlag = false

                        this.height = "-125"
                        this.$nextTick(() => {
                            this.$refs.scroller.reset()
                        })
                    }
                }
                this.customer_myCustomerLists(obj)
            }
        },
        // 下拉刷新
        refresh() {
            this.searchHand()
            this.$nextTick(() => {
                this.$refs.scroller.donePulldown()
            })
        },
        // 上拉加载更多
        loadMore() {
            if (!this.has_more || this.isLoading) {
                return
            } else {
                this.page += 1
                let obj = {
                    company_id: this.companyId,
                    user_id: this.userId,
                    segment_id: this.groupValue.value,
                    label_ids: this.labelValue.map(v=>v.id).join(),
                    stage_id: this.stageValue.value,
                    keywords: this.searchValue,
                    page: this.page,
                    count: this.count,
                }
                this.handleRequest(obj)
            }
        },
        // 移动分组
        moveGroupHand() {
            if (!this.ifCheck) {
                return
            }
            // this.moveGroupValue = {label: '', value: ''}

            this.moveGroup = true
        },
        // 共享转移
        moveCustomHand(val) {
            //val===false共享 true转移
            if (!this.ifCheck) {
                return
            }
            this.radioChoice = val
            this.hintType = val?'1':'2'
            this.customer = true
        },
        // 删除客户
        deleteHand() {
            if (!this.ifCheck) {
                return
            }
            this.$vux.confirm.show({
                content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                            <p style="margin-top: 10px;">是否确定删除客户?</p>`,
                onConfirm: ()=>{
                    let array = this.listObj.listData.map(v=>{
                        if (v.icon.iconFlag) {
                            return v.id
                        }
                    })
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_ids: array.join(),
                    }
                    this.customer_deleteCustomers(obj)
                }
            })
        },
        // 地图
        initMap(mycode){
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
                    _this.$nextTick(function(){
                        if(this.st){

                        }
                    })
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
                    _this.UPDATE_LOADING(true)
                    var props = areaNode.getProps();
                    if(LG_AES_CRMAPI){
                        aes.setCryptKey(LG_AES_SALT_CRM);
                    }
                    let obj = {
                            app_key:LG_AES_CRMAPI?(aes.encrypt(API_PARM_OBJ.app_key)):API_PARM_OBJ.app_key,
                            v:LG_AES_CRMAPI?(aes.encrypt(API_PARM_OBJ.v)):API_PARM_OBJ.v,
                            sig:LG_AES_CRMAPI?(aes.encrypt(API_PARM_OBJ.sig)):API_PARM_OBJ.sig,
                            company_id:LG_AES_CRMAPI?(aes.encrypt(_this.companyId)):_this.companyId,
                            user_id:LG_AES_CRMAPI?(aes.encrypt(_this.userId)):_this.userId,
                            page:LG_AES_CRMAPI?(aes.encrypt('1')):'1',
                            count:LG_AES_CRMAPI?(aes.encrypt('10')):'10',
                            is_map:LG_AES_CRMAPI?(aes.encrypt('1')):'1',
                        }
                    if(_this.groupValue.value){
                        obj.segment_id = LG_AES_CRMAPI?(aes.encrypt(_this.groupValue.value)):_this.groupValue.value
                    }
                    if(_this.labelValue.length>0){
                        obj.label_ids = LG_AES_CRMAPI?(aes.encrypt(_this.labelValue.map(v=>v.id).join())):_this.labelValue.map(v=>v.id).join()
                    }
                    if(_this.stageValue.value){
                        obj.stage_id = LG_AES_CRMAPI?(aes.encrypt(_this.stageValue.value)):_this.stageValue.value
                    }
                    if(_this.searchValue){
                        obj.keywords = LG_AES_CRMAPI?(aes.encrypt(_this.searchValue)):_this.searchValue
                    }
                    if(areaNode.adcode=='100000'){
                        if(!_this.isSearch){
                            _this.province_name=''
                        }
                    }else if(/0000/.test(areaNode.adcode)){
                        /********************************ajax start************************************/
                        if(!_this.isSearch){
                            _this.province_name = props.name
                            _this.city_name=''
                        }
                        obj.province_name = LG_AES_CRMAPI?(aes.encrypt(props.name)):props.name
                    
                    }else{
                        /********************************ajax start************************************/
                        if(!_this.isSearch){
                            _this.province_name = _this.currentArea;
                            _this.city_name = props.name;
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
                                _this.UPDATE_LOADING(false)
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
                                    _this.$nextTick(()=>{
                                        _this.$refs.scroller.reset({
                                            top: 0
                                        })
                                    })
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
        // 分派公海客户
        showTaskingModel(customer) {
            this.highSeasCustomer = customer
            this.moduleObj.disabledFlag = false
            this.moduleObj.showBtn = true
            this.moduleObj.title = '申领原因：'
            this.moduleObj.inputVal = ''
            this.moduleObj.uploadData = []
            this.moduleObj.recordObj = {
                id: '',
                url: '',
                data: '',
                duration: '',
            },
            this.tasking = true
        },
        // 查看申领公海未通过原因
        refuseTaskingModel(customer) {
            this.highSeasCustomer = customer
            this.moduleObj.disabledFlag = true
            this.moduleObj.showBtn = false
            this.moduleObj.title = '未同意原因：'
            this.moduleObj.inputVal = customer.refuse.note?customer.refuse.note:''
            this.moduleObj.uploadData = customer.refuse.attach_note_img?customer.refuse.attach_note_img.map(v=>{
                return {
                    name: v.name,
                    src: v.url,
                    id: v.id
                }
            }):[]
            this.moduleObj.recordObj = customer.refuse.attach_note_audio?customer.refuse.attach_note_audio[0]:{
                id: '',
                url: '',
                data: '',
                duration: '',
            }
            this.tasking = true
        }
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
            seaCustomerLists: state => state.customer.seaCustomerLists,
            seaCusAuditRecordLists: state => state.customer.seaCusAuditRecordLists,
            uploadFileData: state => state.customerattach.uploadFileData,
            saveSeaCustomerAudit: state => state.customer.saveSeaCustomerAudit,
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
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset({
                                top: 0
                            })
                        })
                    } else {
                        arr.forEach(item => {
                            item.icon={
                                iconType: this.batch?1:2,
                                iconFlag: false,
                            }
                        })
                        this.listObj.listData = this.listObj.listData.concat(arr)
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset()
                        })
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
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset({
                                top: 0
                            })
                        })
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset()
                        })
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
        seaCustomerLists(data) {
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
                            label: [],
                            id: item.id,
                            // tel: '+' + item.mobile_code + ' ' + item.mobile,
                            state: '',
                            time: '',
                            icon: {
                                iconType: 3,
                            },
                            url: {
                                link: 'customPage',
                                query: {id: item.id, logo: item.logo_big, name: item.customer_name, company: item.customer_company_name, highSeas: true},
                            },
                            logoNameFlag: false,
                            color: parseInt(Math.random()*3+1)
                        }
                    })
                    if (this.page == 1) {
                        this.num_items = parseInt(data.num_items)
                        this.listObj.listData = arr
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset({
                                top: 0
                            })
                        })
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset()
                        })
                    }
                }
            }
        },
        seaCusAuditRecordLists(data) {
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
                            name: item.customer.customer_name,
                            img: item.customer.logo_big,
                            work: item.customer.customer_company_name,
                            label: [],
                            id: item.customer_id,
                            // tel: '+' + item.mobile_code + ' ' + item.mobile,
                            state: '',
                            time: '',
                            icon: {
                                iconType: item.process_status?4:5,
                            },
                            url: {
                                link: 'customPage',
                                query: {id: item.customer_id, logo: item.customer.logo_big, name: item.customer.customer_name, company: item.customer.customer_company_name, share: true, highSeas: true, reviewProgress: true},
                            },
                            logoNameFlag: false,
                            color: parseInt(Math.random()*3+1),
                            refuse: item.process_status?item.log:'',
                        }
                    })
                    if (this.page == 1) {
                        this.num_items = parseInt(data.num_items)
                        this.listObj.listData = arr
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset({
                                top: 0
                            })
                        })
                    } else {
                        this.listObj.listData = this.listObj.listData.concat(arr)
                        this.$nextTick(()=>{
                            this.$refs.scroller.reset()
                        })
                    }
                }
            }
        },
        uploadFileData(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'myCustom') {
                if (data.alert_msg) {
                    this.UPDATE_LOADING(false)
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_ids: this.highSeasCustomer.id,
                        to_user_id: this.userId,
                        type: 1,
                        note: this.moduleObj.inputVal,
                        attach_ids: data.items.map(v=>v.id).join(',')
                    }
                    if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                        obj.attach_ids = obj.attach_ids + ',' + this.moduleObj.recordObj.id
                    }
                    this.customer_saveSeaCustomerAudit(obj)
                }
            }
        },
        saveSeaCustomerAudit(data) {
            if (Object.keys(data).length>0 && this.$route.name === 'myCustom') {
                this.UPDATE_LOADING(false)
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.tasking = false
                    if (data.items.success_count == 1) {
                        this.$vux.toast.show({
                            text: '您的分派申请已提交成功，请耐心等待是否同意分派',
                            type: 'text',
                            position: 'top',
                            width:"18em"
                        })
                        this.moduleObj.uploadData = []
                        this.moduleObj.inputVal = ''
                        this.moduleObj.recordObj = {
                            id: '',
                            url: '',
                            data: '',
                            duration: '',
                        }
                        this.toggleHighSeas()
                    } else if (data.items.fail_count == 1) {
                        this.$vux.toast.show({
                            text: data.items.error_note[0][0],
                            type: 'text',
                            position: 'top',
                            width:"18em"
                        })
                    }
                }
            }
        },
    },
    beforeRouteEnter (to, from, next) {
        if (from.name === 'customs'||from.name === null) {
            next(vm => {
                vm.mapModel = false
                vm.share = false
                vm.highSeas = false
                vm.reviewProgress = false
                vm.listObj.listData=[]
                vm.searchValue = ''
                vm.groupValue = {label: '', value: ''}
                vm.labelValue = []
                vm.stageValue = {label: '', value: ''}
                vm.page = 1
                vm.count = 10
                vm.height = "-129"
                vm.share = to.query.share || false
                vm.highSeas = to.query.highSeas || false
                // vm.reviewProgress = to.query.reviewProgress || false
                if (vm.share) {
                    vm.title = document.title = "共享客户"
                }
                if (vm.highSeas) {
                    vm.title = document.title = "公海客户"
                }
                vm.searchHand()
                vm.ResultChoice([])//清空选择
            })
        } else {
            next(vm => {
                vm.share = to.query.share || false
                vm.highSeas = to.query.highSeas || false
                // vm.reviewProgress = to.query.reviewProgress || false
                if (vm.share) {
                    vm.title = document.title = "共享客户"
                } else if (vm.highSeas) {
                    vm.title = document.title = "公海客户"
                }
                if (vm.reviewProgress) {
                    vm.title = document.title = "审核进度"
                }
            })
        }
    },
    beforeRouteLeave (to, from, next) {
        if (this.group||this.stage||this.labels||this.moveGroup||this.customer||this.tasking) {
            this.group = false
            this.stage = false
            this.labels = false
            this.moveGroup = false
            this.customer = false
            if (this.tasking) {
                this.$refs.tasking.voiceFlag = false
                if (this.moduleObj.recordObj.url) {
                    this.$refs.tasking.$refs.record.pause()
                    this.$refs.tasking.$refs.record.load()
                }
                this.tasking = false
                this.moduleObj.inputVal = ''
                this.moduleObj.uploadData = []
                this.moduleObj.recordObj = {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                }
            }
            if (this.share) {
                this.$nextTick(() => {
                    this.title = document.title = "共享客户"
                })
            } else if (this.highSeas) {
                this.$nextTick(() => {
                    this.title = document.title = "公海客户"
                })
            }
            if (this.reviewProgress) {
                this.$nextTick(() => {
                    this.title = document.title = "审核进度"
                })
            }
            next(false)
        } else {
            next()
        }
    },
    directives: {
        TransferDom
    },
    components: {
        Search, Group, GroupTitle, Scroller, LoadMore, Tab, TabItem, Tabbar, TabbarItem, Popup, Checklist, XButton, listA, labelPage, checkers, customer, FormA, Cell
    },
}
</script>

<style lang="less">
.myCustom .weui-search-bar__box {
    position: static;
    // padding-right: 0;
}

.myCustom .focus .weui-search-bar__box {
    position: relative;
}

.myCustom .vux-tab .vux-tab-item.vux-tab-selected {
    color: #666;
}

.myCustom .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    color: #999;
}

.myCustom .ifCheck.weui-tabbar__item .weui-tabbar__label {
    color: @blue;
}

.highSeas .has.weui-cell .weui-cell__ft {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
