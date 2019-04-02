<template>
    <div class="customPage router-all">
        <div class="router-box">
            <!-- 头部信息 -->
            <header>
                <i class="edit" @click="editHand" v-if="!ifShare&&!highSeas"></i>
                <aside v-if="item.img.length>0"><img :src="item.img" :alt="item.name" :onerror="logo"></aside>
                <aside v-else :class="'c-'+item.color"><span v-html="NameHand(item.name, item)" :class="item.logoNameFlag?'wk':''" /></aside>
                <p>{{item.name}}</p>
                <p class="company">{{item.companyName?item.companyName:''}}</p>
            </header>
            <!-- 导航 -->
            <!-- <div style="height:44px;">
                <sticky
                scroll-box="vux_view_box_body"
                ref="sticky"
                :check-sticky-support="false"
                :disabled="disabled"> -->
                    <tab>
                        <tab-item :selected="index===0" @on-item-click="onItemClick">客户属性</tab-item>
                        <tab-item :selected="index===1" @on-item-click="onItemClick">客户资料</tab-item>
                        <tab-item :selected="index===2" @on-item-click="onItemClick">动态记录</tab-item>
                        <tab-item :selected="index===3" @on-item-click="onItemClick">关键内容</tab-item>
                    </tab>
                <!-- </sticky>
            </div> -->
            <!-- 主体内容 -->
            <customProperty v-if="index===0" ref="property"/>
            <customInfo v-if="index===1"/>
            <customRecord v-if="index===2" ref="record"/>
            <customKey v-if="index===3"/>
        </div>
        <!-- 底部快捷操作 -->
        <tabbar class="tabbar-top" v-if="!highSeas">
            <tabbar-item @click.native="remark=true">
                <img slot="icon" src="@/images/custom/customer/customPage/remark.png">
            </tabbar-item>
            <tabbar-item  @click.native="callHand">
                <img slot="icon" src="@/images/custom/customer/customPage/call.png">
            </tabbar-item>
            <tabbar-item @click.native="toSignDetail" >
                <img slot="icon" src="@/images/custom/customer/customPage/visit.png">
            </tabbar-item>
            <tabbar-item :link="{name: 'customNewPayment', query: {customerId, name: item.name, company: item.companyName}}">
                <img slot="icon" src="@/images/custom/customer/customPage/plan.png">
            </tabbar-item>
            <tabbar-item @click.native="more = true" v-if="!ifShare">
                <img slot="icon" src="@/images/custom/customer/customPage/more.png">
            </tabbar-item>
        </tabbar>
        <x-button v-if="highSeas&&!reviewProgress" type="primary" style="position:absolute;bottom:0;" @click.native="tasking=true" >分派给我</x-button>
        <!-- <tabbar v-if="highSeas&&!reviewProgress" class="highSeas">
            <tabbar-item @click.native="tasking=true">
               <span slot="label">分派给我</span>
            </tabbar-item>
        </tabbar> -->
        <!-- popup -->
        <div v-transfer-dom>
            <!-- 添加记录 -->
            <popup v-model="remark" height="100%" position="top" class="record" v-if="!highSeas">
                <div class="popup">
                    <group>
                        <cell title="客户：" :value="item.name" value-align="left" class="has"></cell>
                    </group>
                    <FormA :moduleObj="moduleObj1" @toggle="togglePop" ref="remark"/>
                </div>
            </popup>
            <!-- 分派公海客户 -->
            <popup v-model="tasking" height="100%" v-if="highSeas&&!reviewProgress" class="highSeas">
                <div class="popup">
                    <group>
                        <cell title="客户：" :value="item.name" value-align="left" class="has"></cell>
                    </group>
                    <FormA :moduleObj="moduleObj2" @toggle="togglePop" ref="tasking"/>
                </div>
            </popup>
            <!-- 拨打电话 -->
            <popup v-model="call" height="270px" is-transparent v-if="!highSeas">
                <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
                    <group style="padding:20px 15px;">
                        <x-button type="primary" @click.native="call = false">小宝AI电话拨号</x-button>
                        <x-button type="primary" @click.native="callHand">直接拨号</x-button>
                    </group>
                    <div style="padding:20px 15px;">
                        <x-button @click.native="call = false" class="hasBorder">取消</x-button>
                    </div>
                </div>
            </popup>
            <!-- 转移客户 -->
            <popup v-model="more" height="280px" v-if="!ifShare&&!highSeas" is-transparent>
                <div style="width: 95%;background-color:#fff;height:260px;margin:0 auto;border-radius:5px;padding-top:10px;">
                    <group style="padding:20px 15px;">
                        <x-button type="primary" @click.native="moveHand">转移客户</x-button>
                        <x-button type="primary" @click.native="giveUpHand">放弃客户</x-button>
                        <x-button type="primary" @click.native="deleteHand">删除客户</x-button>
                    </group>
                    <div style="padding:20px 15px;">
                        <x-button @click.native="more = false" class="hasBorder">取消</x-button>
                    </div>
                </div>
            </popup>
            <popup v-model="customer" height="100%" position="top" v-if="!ifShare&&customer&&!highSeas">
                <div class="popup">
                    <customer @toggleCustomer="togglePop" :radioChoice="true" propsState="2" :btn="true" :hintType="hintType"/>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import { Tab, TabItem, Tabbar, TabbarItem, Sticky, TransferDom, Popup, Group, Cell, XButton } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { len } from '@/util'
import customProperty from './customProperty'
import customInfo from './customInfo'
import customRecord from './customRecord'
import customKey from './customKey'
import FormA from '@/components/formA'
import customer from '@/components/customer'

export default {
    name: 'customPage',
    data() {
        return {
            customerId: 0,
            ifEdit: false,      //是否是点击编辑客户离开页面
            ifShare: 1,         //是否共享客户
            highSeas: 1,         //是否公海客户
            tasking: false,     //是否分派给我
            remark: false,      //是否添加备注
            call: false,        //是否显示拨打电话pop
            more: false,        //是否显示更多pop
            customer: false,    //是否转移客户
            index: 0,           //导航
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,   //加载失败图片
            item: {
               name: '',
               companyName: '',
               img: '',
               tel: '',
               color: parseInt(Math.random()*3+1),
               logoNameFlag: false,
            },
            moduleObj1: {
                title: '',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '',
                uploadData: [],
                record: true,
                showBtn: true,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 11,
            },
            moduleObj2: {
                title: '申领原因：',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '',
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
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
        }
    },
    created() {
        this.ifShare = this.$route.query.share?1:0
        this.highSeas = this.$route.query.highSeas
        this.reviewProgress = this.$route.query.reviewProgress
        this.customerId = this.$route.query.id
        this.item.img = this.$route.query.logo
        this.item.name = this.$route.query.name
        this.item.tel = this.$route.query.mobile
        this.item.companyName = this.$route.query.company

        this.index = JSON.parse(sessionStorage.getItem('customPageIndex')?sessionStorage.getItem('customPageIndex'):0)
    },
    methods: {
        ...mapActions({
            customeractionrecord_addCustomerRecord: 'customeractionrecord/addCustomerRecord',
            customerattach_uploadFile: 'customerattach/uploadFile',
            customeractionrecord_addCallPhoneRecord: 'customeractionrecord/addCallPhoneRecord',
            customer_changeCustomerBelonger: 'customer/changeCustomerBelonger',
            customer_deleteCustomers: 'customer/deleteCustomers',
            customer_giveUpCustomer: 'customer/giveUpCustomer',
            customer_saveSeaCustomerAudit: 'customer/saveSeaCustomerAudit',
        }),
        ...mapMutations({
            UPDATE_LOADING: 'UPDATE_LOADING',
            ResultChoice:'user/RESULTCHOICE',
            SIGN_OUT:'SIGNOUT',
        }),
        // 头像方法
        NameHand(name, obj){
            var zh_reg = /^[\u4e00-\u9fa5]+$/;
            let text=name;
            if (!zh_reg.test(text.substr(0,1))) {
                let nameA=text.length>5?text.substring(0,5):text;
                if(nameA.length<3){
                    return nameA;
                }else{
                    if((nameA.length==4 && len(text)==4 )|| (nameA.length==5 && len(text)==5 )  ){
                        return nameA;
                    }else if(len(text)>4){
                        let html=nameA.substring(0,2)+'</br>'+nameA.substring(2);
                        obj.logoNameFlag=true;                        
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    obj.logoNameFlag=true;  
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    obj.logoNameFlag=true;  
                    return html;
                }else{
                    return text;
                }
            }
        },
        //去签到详情页面
        toSignDetail(){
            let hasSign = window.localStorage.getItem('hasSign')
            if(hasSign&&hasSign==1){
                this.$vux.toast.show({
                    text: '您有未签退的拜访',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
            }else{
                this.UPDATE_LOADING(true)
                this.openTheGps()
            }
            
        },
        // 导航跳转
        onItemClick(index) {
            this.index = index
            sessionStorage.setItem('customPageIndex', JSON.stringify(index))
        },
        // 跳转编辑客户资料
        editHand() {
            this.ifEdit = true
            this.$router.push({name: 'newCustom', query: {id: this.customerId}})
        },
        // 拨打电话
        callHand() {
            // this.call = false
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                customer_id: this.customerId,
                mobile: this.item.tel,
            }
            this.customeractionrecord_addCallPhoneRecord(obj)
            window.location.href = `tel:${this.item.tel}`
        },
        // 转移客户
        moveHand() {
            this.ResultChoice([])
            this.more = false
            this.hintType='1'
            this.customer = true

        },
        // 关闭popup
        togglePop(obj) {
            if (this.remark) {
                if (this.moduleObj1.uploadData.length>0) {
                    let obj1 = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        source: 10,
                        // source_id: this.customerId,
                        upfile_base64: JSON.stringify(this.moduleObj1.uploadData.map(v=>{
                            return {
                                origin_name: v.name,
                                data: v.src
                            }
                        })),
                    }
                    this.UPDATE_LOADING(true)
                    this.customerattach_uploadFile(obj1)
                    return
                } else if (this.moduleObj1.inputVal) {
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_id: this.customerId,
                        note: this.moduleObj1.inputVal,
                        // attach_ids: data.items.map(v=>v.id).join()
                    }
                    if (this.moduleObj1.recordObj&&this.moduleObj1.recordObj.id) {
                        obj.attach_ids = this.moduleObj1.recordObj.id
                    }
                    this.UPDATE_LOADING(true)
                    this.customeractionrecord_addCustomerRecord(obj)
                } else {
                    this.remark = false
                }
            }
            if (this.tasking) {
                if (!this.moduleObj2.inputVal) {
                    this.$vux.toast.show({
                        text: '申领原因不能为空！',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                if (this.moduleObj2.uploadData.length>0) {
                    let obj1 = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        source: 16,
                        // source_id: this.customerId,
                        upfile_base64: JSON.stringify(this.moduleObj2.uploadData.map(v=>{
                            return {
                                origin_name: v.name,
                                data: v.src
                            }
                        })),
                    }
                    this.UPDATE_LOADING(true)
                    this.customerattach_uploadFile(obj1)
                    return
                } else if (this.moduleObj2.inputVal) {
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_ids: this.customerId,
                        to_user_id: this.userId,
                        type: 1,
                        note: this.moduleObj2.inputVal,
                        // attach_ids: data.items.map(v=>v.id).join()
                    }
                    if (this.moduleObj2.recordObj&&this.moduleObj2.recordObj.id) {
                        obj.attach_ids = this.moduleObj2.recordObj.id
                    }
                    this.UPDATE_LOADING(true)
                    this.customer_saveSeaCustomerAudit(obj)
                }
            }
            if (this.customer) {
                if (obj.length>0) {
                    let obj1 = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_ids: this.customerId,
                        belong_userId: obj[0].userId,
                    }
                    this.customer_changeCustomerBelonger(obj1)
                } else {
                    this.customer = false
                    return
                }
            }
        },
        // 放弃客户
        giveUpHand() {
            this.more = false
            this.$vux.confirm.show({
                content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                            <p style="margin-top: 10px;">是否确定放弃该客户?</p>`,
                onConfirm: ()=>{
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_id: this.customerId,
                    }
                    this.customer_giveUpCustomer(obj)
                }
            })

        },
        // 删除客户
        deleteHand() {
            this.more = false
            this.$vux.confirm.show({
                content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                            <p style="margin-top: 10px;">是否确定删除该客户?</p>`,
                onConfirm: ()=>{
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        customer_ids: this.customerId,
                    }
                    this.customer_deleteCustomers(obj)
                }
            })
        },
        openTheGps(){
            let _this = this;
            let objOne = {
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
                _this.SIGN_OUT(objOne)
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
                      _this.UPDATE_LOADING(false)
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
                    }

                    function onError (data) {
                      _this.UPDATE_LOADING(false)
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
                        _this.$vux.toast.show({
                            text: '定位失败，请开启手机定位',
                            type: 'text',
                            position: 'top',
                            width:"20em"      
                        })
                    }
                },this)
        },
    },
    computed: {
        ...mapState({
            uploadFileData: state => state.customerattach.uploadFileData,
            addRecord: state => state.customeractionrecord.addRecord,
            addCall: state => state.customeractionrecord.addCall,
            deleteCustomers: state => state.customer.deleteCustomers,
            changeBelong: state => state.customer.changeBelong,
            signout:state => state.signout,
            giveupCustomer: state => state.customer.giveupCustomer,
            saveSeaCustomerAudit: state => state.customer.saveSeaCustomerAudit,
        })
    },
    watch: {
        uploadFileData(data) {
            if (Object.keys(data).length>0) {
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
                    if (this.tasking) {
                        let obj = {
                            company_id: this.companyId,
                            user_id: this.userId,
                            customer_ids: this.customerId,
                            to_user_id: this.userId,
                            type: 1,
                            note: this.moduleObj2.inputVal,
                            attach_ids: data.items.map(v=>v.id).join(',')
                        }
                        if (this.moduleObj2.recordObj&&this.moduleObj2.recordObj.id) {
                            obj.attach_ids = obj.attach_ids + ',' + this.moduleObj2.recordObj.id
                        }
                        this.customer_saveSeaCustomerAudit(obj)
                    } else if (this.remark) {
                        let obj = {
                            company_id: this.companyId,
                            user_id: this.userId,
                            customer_id: this.customerId,
                            note: this.moduleObj1.inputVal,
                            attach_ids:data.items.map(v=>v.id).join(',')
                        }
                        if (this.moduleObj1.recordObj&&this.moduleObj1.recordObj.id) {
                            obj.attach_ids =obj.attach_ids + ',' + this.moduleObj1.recordObj.id
                        }
                        this.customeractionrecord_addCustomerRecord(obj)
                    }
                }
            }
        },
        addRecord(data) {
            if (Object.keys(data).length>0) {
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
                    this.$vux.toast.show({
                        text: '添加记录成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.remark = false
                    this.moduleObj1.uploadData = []
                    this.moduleObj1.inputVal = ''
                    this.moduleObj1.recordObj = {
                        id: '',
                        url: '',
                        data: '',
                        duration: '',
                    }
                    if (this.index===2) {
                        this.$refs.record.refresh()
                    }
                }
            }
        },
        addCall(data) {
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
                    if (this.index===2) {
                        this.$refs.record.refresh()
                    }
                }
            }
        },
        deleteCustomers(data) {
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
                    this.$vux.toast.show({
                        text: '删除客户成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.push({name: 'customs'})
                }
            }
        },
        changeBelong(data) {
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
                    this.customer = false
                    this.$vux.toast.show({
                        text: '转移客户成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.push({name: 'customs'})
                }
            }
        },
        signout(data){
            if(data.isOpenGps){
                this.$router.push({name: 'signDetail', query: {id: this.$route.query.id, type: 3, name: this.item.name, company: this.item.companyName}})
            }
        },
        giveupCustomer(data) {
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
                    this.$vux.toast.show({
                        text: '放弃客户成功!',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.$router.push({name: 'customs'})
                }
            }
        },
        saveSeaCustomerAudit(data) {
            if (Object.keys(data).length>0) {
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
                        this.moduleObj2.uploadData = []
                        this.moduleObj2.inputVal = ''
                        this.moduleObj2.recordObj = {
                            id: '',
                            url: '',
                            data: '',
                            duration: '',
                        }
                        this.$router.push({name: 'customs'})
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
        if (from.name === 'customs'||from.name === 'searchPage'||from.name === 'searchResult'||from.name === 'myCustom'||from.name === 'newCustom'||from.name == null) {
            sessionStorage.setItem('customPageIndex', JSON.stringify(0))
            next()
        } else {
            next()
        }
    },
    beforeRouteLeave (to, from, next) {
        // popup未关闭，不跳转离开
        if (this.customer || this.remark || this.tasking || this.index===0 && (this.$refs.property.group||this.$refs.property.stage||this.$refs.property.labels||this.$refs.property.source||this.$refs.property.customer)||this.index===2 && (this.$refs.record.remark)) {
            this.customer = false
            if (this.tasking) {
                this.$refs.tasking.voiceFlag = false
                if (this.moduleObj2.recordObj.url) {
                    this.$refs.tasking.$refs.record.pause()
                    this.$refs.tasking.$refs.record.load()
                }
                this.tasking = false
            }
            if (this.remark) {
                this.$refs.remark.voiceFlag = false
                if (this.moduleObj1.recordObj.url) {
                    this.$refs.remark.$refs.record.pause()
                    this.$refs.remark.$refs.record.load()
                }
                this.remark = false
            }
            if (this.index===0) {
                this.$refs.property.group = false
                this.$refs.property.stage = false
                this.$refs.property.labels = false
                this.$refs.property.source = false
                this.$refs.property.customer = false
            }
            if (this.index===2) {
                this.$refs.record.remark = false
            }
            this.moduleObj1.inputVal = ''
            this.moduleObj1.uploadData = []
            this.moduleObj1.recordObj = {
                id: '',
                url: '',
                data: '',
                duration: '',
            }
            this.moduleObj2.inputVal = ''
            this.moduleObj2.uploadData = []
            this.moduleObj2.recordObj = {
                id: '',
                url: '',
                data: '',
                duration: '',
            }
            next(false)
        // 非点击编辑客户返回离开返回新增客户页，则返回客户首页
        } else if (!this.ifEdit&&to.name==='newCustom') {
            this.$router.push({name: 'customs'})
        } else {
            next()
        }
    },
    directives: {
        TransferDom
    },
    components: {
        Tab,
        TabItem,
        Tabbar,
        TabbarItem,
        Sticky,
        Popup,
        Group,
        Cell,
        XButton,
        customProperty,
        customInfo,
        customRecord,
        customKey,
        FormA,
        customer
    },
}
</script>

<style lang="less">
.customPage .vux-tab {
    background: @bg-color;
}

.customPage .tabbar-top .weui-tabbar__item {
    // height: 53px;
    padding: 13px 0;
}

.customPage .weui-tabbar.highSeas .weui-tabbar__item {
    height: 53px;
}

.record .has.weui-cell .weui-cell__ft {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
}
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
