<template>
    <div class="signDetail router-all">
        <div class="router-box" v-show="!isMap&&!isSignCustom">
            <group>
              <cell 
                v-model="address" 
                value-align='left' 
                :title="addressPlaceholder"  
                @click.native="toggleMap" 
                :is-link="!fixSignAddress"
                class="addressBox"
                :class="!address?'hasVal':''"
                >
                <img slot="icon" class="img-kind" :src="require('@/images/tool/icon52-2.png')">
              </cell>
              <cell 
                :title="namePlaceholder"
                value-align='left' 
                :is-link="!fixSign"
                v-model="name" 
                @click.native="toggleSignCustom"
                class="addressBox"
                :class="!name?'hasVal':''"
                >
                <img slot="icon" class="img-kind" :src="require('@/images/tool/zzu.png')">
              </cell>
              <x-input placeholder="请填写公司名称(必选)" v-model="company" v-if="!companyDisable" >
                <img slot="label"  class="img-kind"  :src="require('@/images/tool/company.png')">
              </x-input>
              <cell 
                :title="company" 
                value-align='left'  
                class="addressBox"
                v-if="companyDisable"
                >
                <img slot="icon" class="img-kind" :src="require('@/images/tool/company.png')">
              </cell>
            </group>
            <group>
              <cell title="自动签退" value-align='left' class="myCell">
                <img slot="icon" class="img-kind" src="~@/images/tool/settings.png">
                <em @click="isThinkMore=true">(了解更多)</em>
                <x-switch title="" v-model="placed" :class="placed&&isDisabled?'mySwich':''" :disabled="isDisabled"></x-switch>
              </cell>
            </group>
            <group>
              <cell 
                v-model="signE" 
                value-align='left' 
                @click.native="toggleSignevent" 
                :class="signE!='请选择签到事件(必选)'?'':'hasVal'"
                :is-link="state!=2&&type!=6?true:false"
                class="sign-event"
                >
                <img slot="icon"  style="vertical-align: middle;margin-right:10px;"  :src="require('@/images/tool/signEvent.png')">
              </cell>
            </group>
            <FormA :moduleObj="moduleObj" />
          </div>
        <div><x-button type="primary"  v-show="!isMap&&!isSignCustom" v-if="isWrite&&!highSeas" :disabled="isLoading" :show-loading="isLoading" @click.native="submitSign" >立即签到</x-button></div>
        <div><x-button type="primary" v-show="!isMap&&!isSignCustom" v-if="isWriteReturn&&!highSeas" :disabled="isLoading" :show-loading="isLoading" @click.native="submitSignout">立即签退</x-button></div>
        <MyMap v-show="isMap&&!highSeas" :addressData="addressData" @toggleMap="toggleMap"/>
        <div v-transfer-dom >
              <popup id='myPopupThinkMore' v-show="isThinkMore" position="right" width='100%' >
                  <MarkMore type="3" />
              </popup>
              <popup v-model="isSignEvent" position="right" width='100%'  should-rerender-on-show>
                  <checkers :checkValue="[moveEventValue.value]" show="event" @toggle="toggleSignevent"/>
              </popup>
          </div>
          <SignCustom 
                  v-if="isSignCustom&&!highSeas"
                  @toggleSignCustom="toggleSignCustom"  
                  :propsJudge="judgeFlag" 
                  @choiseFlag="choiseFlag"
                  chooseType="2"
                  ref='signCustom'
                />
    </div>
</template>

<script>
import {  Scroller,Cell,Group,GroupTitle ,XSwitch,PopupPicker,XTextarea,XButton,XInput,Popup,TransferDom } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex';
import VueEmit from '@/util/vueEimt';
import MyMap from '@/components/mymap';
import SignCustom from '../signCustom';
import FormA from '@/components/formA';
import SignEvent from '@/components/signEvent';
import checkers from '@/components/checkers';
import MarkMore from '@/components/mark';
let _timer ;
export default {
    name: 'signDetail',
    data() {
        return {
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            isSignEvent:false,
            name:"",
            addressPlaceholder:"",
            companyPlaceholder:"",
            namePlaceholder:"请选择客户(必选)",
            company:"",
            address:'',
            placed:false,
            signE:'请选择签到事件(必选)',
            timeLong:"",
            isWrite:true,
            isMap:false,
            addressData:{
              name:"",
              address:'',
              location:{
                O:'',
                P:'',
                lat:'',
                lng:''
              },
              pname:'',
              cityname:'',
              aname:''
            },
            moveEventValue: {label: '', value: ''},
            isWriteReturn:false,
            scrollerHeight:"-36",
            fixSign:false,
            fixSignAddress:false,
            isSignCustom:false,
            signEId:'',
            moduleObj: {
                title: '备注',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '',
                uploadData: [],
                record: true,
                showBtn: false,
                disabledFlag:false,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 5,
            },
            isDisabled:false,
            isThinkMore:false,
            isSignCustom:false,
            judgeFlag:{
                isGroup:false,//子组件中分组客户开关
                isLabels:false,//子组件中标签客户开关
                isShare:false,//子组件中分享客户开关
                isLabel:false,//子组件中标签开关
                isSearch:false,//子组件中搜索客户开关
            },
            initData:[],
            companyDisable:false,
            customer_id:"",
            province_name:'',
            city_name:'',
            area_name:'',
            lng:'',
            lat:'',
            isLoading:false,
            auto_sign_out:'',
            state:'',
            type:'',
            isOpengps:false,
            signOutIs:false,


        }
    },
    created() {
      this.ShareCustom([])
    },
    directives: {
      TransferDom
    },
    mounted(){
      
      this.type=this.$route.query.type//type0,1已签到，2已签退
      if (this.$route.query.highSeas) {
        this.type = 2
      }
      let type=this.type//type==2签退,type=1签到,type=undefined为添加签到,type=3为查看
      if(type==1||type==2){
        if(type==1){
          this.initMap()
          document.title="签退"
        }else{
          document.title="拜访详情"
        }
        this.addressPlaceholder=""
        if(this.$route.query.id){
          let obj={
            company_id:this.company_id,
            id:this.$route.query.id
          }
          this.customervisitsign_getCustomerVisitById(obj)
        }
      }else if(type==3){
        this.initMap()
        document.title="添加拜访签到"
        this.name =  this.$route.query.name
        this.namePlaceholder = ''
        if(this.$route.query.company){
          this.company=this.$route.query.company
          this.companyDisable=this.companyDisable=true;
        }else{
          this.companyDisable=false
        }
        this.fixSign=true
      }else if(type==4){//某个用户的拜访签到
        this.initMap()
        document.title="添加拜访签到"
        let obj = {
          customer_id:this.$route.query.id,
          company_id:this.company_id
        }
        this.customer_getCustomerDetail(obj)
      }else if(type==5){
      
        if(this.$route.query.signOutMsg){
          document.title='签退';
          this.signOutIs=true;
          console.log(this.$route.query.signOutMsg)
          let obj={
            company_id:this.company_id,
            id:this.$route.query.signOutMsg
          }
          this.customervisitsign_getCustomerVisitById(obj)
        }else{
          document.title="添加拜访签到"
          let customMsg = this.$route.query.customerMsg
          this.fixSign=true
          this.fixSignAddress=false
          if(customMsg.customer_company_name){
            this.company = customMsg.customer_company_name
            this.companyDisable=true
          }else{
            this.company = ''
            this.companyDisable=false
          }
          this.name=customMsg.customer_name
          this.customer_id = customMsg.customer_id
          this.address = customMsg.address
          this.namePlaceholder=''
          this.addressData={
            name:customMsg.address_note,
            address:customMsg.address,
            location:{
              O:customMsg.longitude,
              P:customMsg.latitude,
              lat:customMsg.latitude,
              lng:customMsg.longitude
            },
            pname:customMsg.province_name,
            cityname:customMsg.city_name,
            aname:customMsg.area_name,
          }
          this.lat = customMsg.latitude
          this.lng = customMsg.longitude
          this.isWrite=true
          this.isWriteReturn=false
        }
        
      }else if(type==6){
        // document.title="添加拜访签到"
        let id = this.$route.query.id
         let obj={
            company_id:this.company_id,
            id:this.$route.query.id
          }
          this.customervisitsign_getCustomerVisitById(obj)
        this.isWrite=true
        this.isWriteReturn=false
      }else{
        this.initMap()
        document.title="添加拜访签到"
      }

    },
    methods: {
      initMap(){
        this.LOADING_HAND(true)
        let _this = this 
        var map = new AMap.Map('');
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
                _this.LOADING_HAND(false)
                  // data是具体的定位信息
                  _this.addressData={
                    address:data.formattedAddress,
                    location:{
                      O:data.position.O,
                      P:data.position.P,
                      lat:data.position.P,
                      lng:data.position.O
                    },
                    pname:data.addressComponent.province,
                    cityname:data.addressComponent.city,
                    aname:data.addressComponent.district,
                  };
                  _this.lat = data.position.P
                  _this.lng = data.position.O
                  if(!_this.$route.query.type){//添加签到
                    _this.address=data.formattedAddress
                  }
                  if(_this.$route.query.type==3){//从客户详情过来之后，地址为定位地址
                    _this.address=data.formattedAddress
                  }
                  _this.isOpengps = true
              }

              function onError (data) {
                _this.LOADING_HAND(false)
                  // 定位出错
                _this.addressData={
                    name:"asdasdasdasd",
                    address:'浙江省杭州市',
                    location:{
                      O:120.117881,
                      P:30.336488,
                      lat:120.117881,
                      lng:30.336488
                    },
                    pname:'浙江省',
                    cityname:'杭州市',
                    aname:'拱墅区',
                  }
                _this.lat = 120.117881
                _this.lng = 30.336488
                _this.address='浙江省杭州市'
                _this.isOpengps = false
              }
          })
      },
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            LOADING_HAND:'UPDATE_LOADING',
            ShareCustom:'user/SHARECUSTOM',
            SIGN_OUT:'SIGNOUT',
        }),
        choiseFlag(data){
            this.judgeFlag[data.name]=data.value
        },
        OnScroll(){
            this.$nextTick(() => {
                this.$refs.scroller.reset();
            })
        },
        toggleSignevent(data){
          if(this.type!=2&&this.type!=6){
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
              this.isSignEvent=!this.isSignEvent
            },300)
            if(this.isSignEvent){
              document.title="添加拜访签到"
            }else{
              document.title="选择签到事件"
            }
            if(data&&data.type!='click'){
              if(Object.keys(data).length>0&&data.value){
                this.signE=data.label
                this.signEId=data.value
                this.moveEventValue=data
              }else{
                this.signE='请选择签到事件(必选)'
                this.signEId=''
                this.moveEventValue={
                  value:'',
                  label:''
                }
              }
            }
          }
        },
        toggleMap(data){
          if(!this.fixSignAddress){
            //安卓系统避免键盘弹出，改变浏览器高度
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
              this.isMap = !this.isMap
            },300)
            //安卓系统避免键盘弹出，改变浏览器高度
            if(data.type=='click'){

            }else{
              this.addressData = data
              this.address = data.address
              this.addressPlaceholder=""
            }
          }
          
        },
        openTheGps(){
            let _this = this;
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
                    // _this.LOADING_HAND(false)
                    //   // 定位出错
                    // _this.isLoading=false
                    let address = $.trim(_this.address)
                    if(address.length==0){
                          _this.$vux.toast.show({
                              text: '客户地址未选择，请选择',
                              type: 'text',
                              position: 'top',
                              width:'20em'
                          })
                          _this.LOADING_HAND(false)
                            // 定位出错
                          _this.isLoading=false
                          return
                      }
                    let name = $.trim(_this.name)
                    if(name.length==0){
                          _this.$vux.toast.show({
                              text: '客户未选择，请选择',
                              type: 'text',
                              position: 'top',
                              width:'20em'
                          })
                          _this.LOADING_HAND(false)
                            // 定位出错
                          _this.isLoading=false
                          return
                      }
                      let company = $.trim(_this.company)
                    if(company.length==0){
                          _this.$vux.toast.show({
                              text: '客户公司未填写，请填写',
                              type: 'text',
                              position: 'top',
                              width:'20em'
                          })
                          _this.LOADING_HAND(false)
                            // 定位出错
                          _this.isLoading=false
                          return
                      }
                    let signE = $.trim(_this.signE)
                    if(signE=='请选择签到事件(必选)'){
                          _this.$vux.toast.show({
                              text: '签到事件未选择，请选择',
                              type: 'text',
                              position: 'top',
                              width:'20em'
                          })
                          _this.LOADING_HAND(false)
                            // 定位出错
                          _this.isLoading=false
                          return
                      }
                    //   _this.LOADING_HAND(true)
                    //   // 定位出错
                    // _this.isLoading=false
                      _this.auto_sign_out = _this.placed?'1':'0'
                      if(_this.$route.query.type==3){
                        _this.customer_id=_this.$route.query.id
                      }
                      //签到
                      if(_this.moduleObj.uploadData.length>0){
                        let _data=[]
                        _this.moduleObj.uploadData.forEach(function(item){
                          if(!item.id){
                            let obj={}
                            obj.origin_name=item.name;
                            obj.data = item.src
                            _data.push(obj)
                          }
                        })
                        let jpgString = JSON.stringify(_data)
                        let objFile = {
                          company_id:_this.company_id,                //	true	int	V11	企业ID
                          user_id:_this.user_id,                //	true	int	V11	用户ID
                          source:4,                //	true	int	V11	类型:0-未知;2-客户备注录音;3-客户备注图片;4-拜访签到图片;5-拜访签到录音;6-合同图片;7-合同录音;8-回款计划图片;9-回款计划录音;10-客户动态记录图片;11-客户动态记录语音;12-发送短信语音
                          upfile_base64:jpgString,                //	false	string		base64上传的图片 支持多张 格式 [{“origin_name”:””,”data”:””},]
                        }
                        
                        _this.customerattach_uploadFile(objFile)
                      }else{
                        
                        _this.signhand()
                      }
                  }

                  function onError (data) {
                    _this.LOADING_HAND(false)
                    //   // 定位出错
                    _this.isLoading=false
                    _this.$vux.toast.show({
                        text: '定位失败，请开启手机定位',
                        type: 'text',
                        position: 'top',
                        width:"20em"      
                    })
                  }
              },this)
        },
        submitSign(){
          this.LOADING_HAND(true)
          this.openTheGps()
          this.isLoading=true;
        },
        signhand(ids){
          let obj={
              company_id:this.company_id,
              customer_id:this.customer_id,
              customer_company_name:this.company,
              customer_name:this.name,
              user_id:this.user_id,
              note:this.moduleObj.inputVal,
              longitude:this.lng,
              latitude:this.lat,
              province_name:this.addressData.pname,
              city_name:this.addressData.cityname,
              area_name:this.addressData.aname,
              sign_company_name:this.company,
              address:this.address,
              visit_type_id:this.signEId,
              auto_sign_out:this.auto_sign_out,
            }
            if(ids){
              obj.attach_ids=ids
              if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                    obj.attach_ids = ids+','+this.moduleObj.recordObj.id
                }
            }else{
              if(this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                  obj.attach_ids = this.moduleObj.recordObj.id
              }
            }
            this.Add_Customer_VisitSvr(obj)
        },
        handOut(ids){
          
          console.log(this.addressData,'===')
          let obj={
              id:this.signOutIs?this.$route.query.signOutMsg:this.$route.query.id,
              company_id:this.company_id,
              customer_id:this.customer_id,
              customer_name:this.name,
              user_id:this.user_id,
              note:this.moduleObj.inputVal,
              state:'2',
              longitude:this.lng,
              latitude:this.lat,
              province_name:this.addressData.pname,
              city_name:this.addressData.cityname,
              area_name:this.addressData.aname,
              sign_company_name:this.company,
              address:this.address,
              visit_type_id:this.signEId,
              auto_sign_out:this.placed?'1':'0',
            }
            if(ids){
              obj.attach_ids=ids
              if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                    obj.attach_ids = ids+','+this.moduleObj.recordObj.id
                }
            }else{
              if(this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                  obj.attach_ids = this.moduleObj.recordObj.id
              }
            }
            this.LOADING_HAND(true)
            this.isLoading=true;
          this.customervisitsign_editCustomerVisitSign(obj)
        },
        submitSignout(){
          let signE = $.trim(this.signE)
          if(signE=='请选择签到事件(必选)'){
                this.$vux.toast.show({
                    text: '签到事件未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
          let auto_sign_out = this.placed?'1':'0'
          let _img_arr = []//编辑的时候新添加的图片，有的话调用上传功能，没有不调用，根据数组中的图片有没有id值判断
          let _ids = '';
          this.moduleObj.uploadData.forEach(function(item){//图片ids处理
            if(!item.id){
              let obj={}
              obj.origin_name=item.name;
              obj.data = item.src
              _img_arr.push(obj)
            }else{
              _ids+=item.id+','
            }
          })
          _ids = _ids.substring(0,_ids.length-1)
          if(_img_arr.length>0){
            let jpgString = JSON.stringify(_img_arr)
            let objFile = {
              company_id:this.company_id,                //	true	int	V11	企业ID
              user_id:this.user_id,                //	true	int	V11	用户ID
              source:4,                //	true	int	V11	类型:0-未知;2-客户备注录音;3-客户备注图片;4-拜访签到图片;5-拜访签到录音;6-合同图片;7-合同录音;8-回款计划图片;9-回款计划录音;10-客户动态记录图片;11-客户动态记录语音;12-发送短信语音
              upfile_base64:jpgString,                //	false	string		base64上传的图片 支持多张 格式 [{“origin_name”:””,”data”:””},]
            }
            this.customerattach_uploadFile(objFile)
          }else{
            if(_ids){
              this.handOut(_ids)
            }else{
              this.handOut()
            }
            
          }
        },
        toggleSignCustom(obj){
          // document.title="添加拜访"
          if(!this.fixSign){
            if(typeof(obj)!='undefined'&&obj.type!='click'){
              document.title='添加拜访签到'
              if(obj.length>0){
                this.name=obj[0].customer_name;
                this.namePlaceholder='';
                this.customer_id=obj[0].customer_id;
                if(obj[0].customer_company_name){
                  this.company=obj[0].customer_company_name;
                  this.companyDisable=true;
                }else{
                  this.companyDisable=false
                  this.company=""
                  this.companyPlaceholder='请填写客户公司(必填)'
                }
                // if(this.address){
                //   this.address = obj[0].address
                // }
                
              }else{
                this.name='';
                this.namePlaceholder='请选择客户(必填)';
                this.companyDisable=false
                this.company=""
                this.companyPlaceholder='请填写客户公司(必填)'
              }
            }else{
              document.title="选择客户"
            }
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
              this.isSignCustom=!this.isSignCustom
            },300)
          }
        },
        ...mapActions({
          Add_Customer_VisitSvr:'customervisitsign/AddCustomerVisitSvr',
          customervisitsign_getCustomerVisitById:'customervisitsign/getCustomerVisitById',
          customervisitsign_editCustomerVisitSign:'customervisitsign/editCustomerVisitSign' ,
          customer_getCustomerDetail:'customer/getCustomerDetail' ,
          customerattach_uploadFile:'customerattach/uploadFile',
        })
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            shareCustom:state => state.user.shareCustom,
            resultChoice:state=>state.user.resultChoice,
            addSignData:state=>state.customervisitsign.addSignData,
            signByIdData:state=>state.customervisitsign.signByIdData,
            editSignOutData:state=>state.customervisitsign.editSignOutData,
            getDetail:state=> state.customer.getDetail,
            uploadFileData:state => state.customerattach.uploadFileData,
        })
    },
    watch:{
      uploadFileData(data){
        let _this = this
        if(this.$route.name=='signDetail'){
          if(data.alert_msg){
            this.$vux.toast.show({
                text: data.alert_msg,
                type: 'text',
                position: 'top',
                width:'18em'
            })
            return ;
          }else{
            
            let _data = data.items
            let attach_ids=''
            _data.forEach(function(item){
              attach_ids+=item.id+','
            })
            this.moduleObj.uploadData.forEach(function(item){
              if(item.id){
                attach_ids+=item.id+','
              }
            })
            attach_ids=attach_ids.substr(0,attach_ids.length-1)
            if(this.$route.query.type==1){
              _this.handOut(attach_ids)
            }else{
              _this.signhand(attach_ids)
            }
            
          }
        }
        
        
      },
      editSignOutData(data){
        this.isLoading=false
        this.LOADING_HAND(false)
        if(data.alert_msg){
          this.$vux.toast.show({
              text: data.alert_msg,
              type: 'text',
              position: 'top',
              width:'18em'
          })
          return ;
        }else{
          window.localStorage.setItem('hasSign','0')
          this.$vux.toast.show({
              text: '签退成功',
              type: 'text',
              position: 'top',
              width:'18em'
          })
          this.$router.go(-1)
        }
      },
      getDetail(data){
        if(data.alert_msg){
          this.$vux.toast.show({
              text: data.alert_msg,
              type: 'text',
              position: 'top',
              width:'18em'
          })
          return ;
        }else{
          this.companyDisable=false
          this.fixSign=true;
          this.fixSignAddress=false;
          this.name=data.items.customer_name
          this.addressPlaceholder=""
          this.companyPlaceholder=""
          this.namePlaceholder=""
          this.signE="请选择签到事件(必选)"
          this.addressData={
            name:"asdasdasdasd",
            address:'浙江省杭州市',
            location:{
              O:120.117881,
              P:30.336488,
              lat:30.336488,
              lng:120.117881
            }
          }
          this.company=data.items.customer_company_name
          this.address=this.addressData.address
          this.scrollerHeight='-36'
          this.isWriteReturn=false
          this.isWrite=true
          this.isDisabled=false
          if(this.$route.query.type==4){
            this.moduleObj.disabledFlag=false
            this.companyDisable=false;
            this.fixSign=true
            this.fixSignAddress=true
            if(data.items.customer_company_name){
              this.companyDisable=true
            }
          }
        }
      },
      signByIdData(data){
        if(data.alert_msg){
          this.$vux.toast.show({
              text: data.alert_msg,
              type: 'text',
              position: 'top',
              width:'18em'
          })
          return ;
        }else{
          console.log(data,'--------')
          this.state = data.items.state
          this.name=data.items.customer_name;
          this.namePlaceholder='';
          this.company=data.items.sign_company_name;
          this.signE=data.items.visit_type;
          this.name=data.items.customer_name;
          this.customer_id=data.items.customer_id;
          this.placed = data.items.auto_sign_out==1?true:false;
          this.address=data.items.address;
          this.signEId=data.items.visit_type_id;
          this.moveEventValue = {
            label:data.items.visit_type,
            value:data.items.visit_type_id
          };
          this.addressData={
            name:data.items.customer_name,
            address:data.items.address,
            location:{
              O:data.items.longitude,
              P:data.items.latitude,
              lat:data.items.latitude,
              lng:data.items.longitude
            },
            pname:data.items.province_name,
            cityname:data.items.city_name,
            aname:data.items.area_name,
          };
          this.moduleObj.inputVal=data.items.note;

          let _imgs = data.items.attach_imgs
          _imgs.forEach(function(items){
            items.src = items.url
          })
          this.moduleObj.uploadData=_imgs;
          this.moduleObj.recordObj = data.items.note_video?data.items.note_video:{}
          if (this.$route.query.highSeas) {
            this.type = 2
            this.state = 2
          }
          if(this.$route.query.type==2||this.type == 2){
            this.scrollerHeight='-0'
            this.isWriteReturn=false
            this.isWrite=false
            this.moduleObj.disabledFlag=true
            this.fixSign=true
            this.companyDisable=true
            this.fixSignAddress=true
            this.isDisabled=true
          }else if(this.$route.query.type==1){
            this.scrollerHeight='-36'
            
            this.isWrite=false
            this.moduleObj.disabledFlag=false
            this.companyDisable=true;
            this.fixSign=true
            this.companyDisable=true
            this.fixSignAddress=true
            this.isDisabled=true
            if(this.user_id!=data.items.user_id){//不是自己的签到的时候就不能有签退
              this.isWriteReturn=false
              this.moduleObj.disabledFlag=true
            }else{
              this.isWriteReturn=true
            }
          }else if(this.$route.query.type==5){
            
            this.scrollerHeight='-36'
            this.isWriteReturn=true
            this.isWrite=false
            this.moduleObj.disabledFlag=false
            this.companyDisable=true;
            this.fixSign=true
            this.fixSignAddress=true
            this.isDisabled=true
          }else if(this.$route.query.type==6){
            this.scrollerHeight='-36'
            this.isWriteReturn=false
            this.isWrite=false
            this.moduleObj.disabledFlag=true
            this.companyDisable=true;
            this.fixSign=true
            this.companyDisable=true
            this.fixSignAddress=true
            this.isDisabled=true
          }
        }
      },
      initData(data){
      },
      shareCustom(){

      },
      addSignData(data){
        this.isLoading=false
        this.LOADING_HAND(false)
        if(data.alert_msg){
          this.$vux.toast.show({
              text: data.alert_msg,
              type: 'text',
              position: 'top',
              width:'18em'
          })
          return ;
        }else{
          window.localStorage.setItem('hasSign','1')
          this.$vux.toast.show({
              text: '签到成功',
              type: 'text',
              position: 'top',
              width:'20em'
          })
          this.$router.go(-1)
        }
        
      }
    },
    beforeRouteLeave(to, from, next) {
        if(this.isThinkMore||this.isSignEvent||this.isMap){
          if(this.isSignEvent){
            if(this.$route.query.type!==3){
              document.title="添加拜访签到"
            }else{
              document.title="拜访签到"
            }
            if(!this.signE){
              this.$nextTick(function(){
                this.signE="请选择签到事件(必选)"
              })
            }
            
          }
          
          this.isThinkMore=false
          this.isSignEvent=false
          this.isMap=false
          next(false);
        }else if(this.judgeFlag.isShare||this.judgeFlag.isSearch||this.judgeFlag.isLabel||this.judgeFlag.isLabels||this.judgeFlag.isGroup){
            this.$refs.signCustom.height='-114'
            this.$refs.signCustom.onFetching = false
            this.$refs.signCustom.isShare=false
            this.$refs.signCustom.isgroup=false
            this.$refs.signCustom.isLabels=false
            this.$refs.signCustom.mylabels=false
            this.$refs.signCustom.isSearch=false 

            this.judgeFlag={
                isGroup:false,
                isLabels:false,
                isShareForMe:false,
                isCurrentLabel:false,
                isSearch:false,
            }
            next(false)
        }else if(this.isSignCustom){
            document.title="添加拜访签到"
            this.isSignCustom=false
            next(false)
        }else{
            next()
        }
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    components: {
      Scroller,
      Cell,
      Group,
      GroupTitle,
      XSwitch,
      PopupPicker ,
      XTextarea,
      XButton,
      MyMap,
      XInput,
      SignCustom,
      FormA,
      Popup,
      SignEvent,
      checkers,
      MarkMore
    },
}
</script>

<style lang="less">
.signDetail{
  width:100%;
  height: 100%;
  .weui-cell:before{
      left: 44px;
  }
  .vux-cell-box:not(:first-child):before{
    left: 44px;
  }
  .myCell{
    padding: 0 @px15;
    .vux-cell-bd{
      color: #333;
    }
    .vux-x-switch{
      float: right;
    }
    .weui-cell:before{
      display: none;
    }
    // .weui-switch:checked{
    //   border-color: #DFDFDF;
    // }
  }
  .weui-cell__ft{
    color: #333;
  }
  .addressBox{
    .weui-cell__ft{
      overflow:hidden; 
      text-overflow:ellipsis;
      display:-webkit-box; 
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2; 
      min-height: 24px;
    }
    .vux-cell-bd{
      p{
        line-height: 21px;
      }
    }
  }
  .hasVal{
    color: #888;
  }
  .hasVal .weui-cell__ft{
    color:  #888;
  }
  // .myCell .mySwich  .weui-switch:checked{
  //   background: #66AEF4 !important;
  // }
  // .myCell .weui-switch:checked, .weui-switch-cp__input:checked ~ .weui-switch-cp__box{
  //   background: #66AEF4 !important;
  // }
  .thinkMore{
    p{
      margin-bottom: 10px;
      font-size: 14px;
    }
  }
  #myPopupThinkMore{
    background:#fff;
    div{
      box-sizing:border-box;
      padding:10px 15px;
      p{
        margin-bottom: 10px;
        font-size: 14px;
      }
    }
  }
}

</style>


<style lang="less" scoped>
 @import './index.less';
</style>
