<template>
    <div class="messageDetail router-all">
        <div class="router-box">
            <group class="group-mt0">
                <div class="myCellBox">
                    <cell class="addPeople" text-align="left" title="收件人：" v-model="userName"></cell>
                    <x-icon type="ios-plus" class="cell-x-icon" @click.native="linkTo" v-if="!isCustomPage"></x-icon>
                </div>
            </group >
            <div class="flex_1">
                <group class="group-mt0">
                    <FormA :moduleObj="moduleObj" v-if='formAflag' />
                </group> 
                <group class="group-mt0">
                    <div class="flex_1_btn">
                        <div @click="changeNamed"  v-if="!isNamed"  class="active">
                            <img src="@/images/tool/personS.png" alt="" >
                            称呼
                        </div>
                        <div @click="changeNamed" v-if="isNamed"  >
                            <img src="@/images/tool/personF.png" alt="">
                            称呼
                        </div>
                        <div  @click="changeSignature" class="active"  v-if="!isSignature">
                            <img src="@/images/tool/signS.png" alt="">
                            签名
                        </div>
                        <div  @click="changeSignature"  v-if="isSignature" >
                            <img src="@/images/tool/signF.png" alt="">
                            签名
                        </div>
                    </div>
                </group>
               
            </div>
        </div>
        
        <div class="btn-box" v-if="isCustomPage&&!isFocus">
            <x-button type="primary" class="save" @click.native="saveMessage">保存</x-button>
            <x-button class="send" type="primary" @click.native="sendNext" >发送</x-button>
        </div>
        <div class="btnNosend" v-if="!isCustomPage&&!isFocus">
            <x-button  type="primary" class="save vux-1px-r" @click.native="saveMessage">保存</x-button>
        </div>
    </div>
</template>

<script>
import {  Popover , GroupTitle ,Scroller,Cell,XButton,XInput,Group,XTextarea} from 'vux'
import { mapState,mapActions,mapMutations, } from 'vuex'
import selectedMsg from '../selectedMsg'
import FormA from '@/components/formA';
let _timer ;
export default {
    name: 'messageHelp',
    data() {
        return {
            userName:"",
            type:"",
            date:"",
            content:"",
            isNamed:false,
            isSignature:false,
            isMyCustomer:false,
            isCustomPage:false,
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            userTrueName: this.$store.state.userInfo.user.trueName,
            chooseIds:'',
            sms_recipients:[], //提交的数据
            customer_id:'',
            mobile:'',
            sign:'',
            call:'',
            pageTitle:'',
            maxTrue:false,
            moduleObj: {
                title: '内容：',
                placeholder: '最多填写500字，语音录入可自动转换文字和保存录音。运营商规定单条70个字，如超出70个字将按多条计费。' ,
                max: 500,
                inputVal: '',
                uploadData: [],
                record: true,
                showBtn: false,
                disabledFlag:false,
                uploadFlag:true,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 12,
            },
            isOneSend:false,
            sendManNum:'',
            isFocus:false,
            formAflag:false,
        }
    },
    created() {
        //查看详情进入的数据
        this.SHARE_custom([])
        //键盘弹起时间
        let _this = this ;
        var winHeight = $(window).height();
    },
    methods: {
        ...mapActions({
          message_addSmsRecord: 'message/addSmsRecord',
          message_addSmsRecordFromWeb: 'message/addSmsRecordFromWeb',
        }),
        ...mapMutations({
            SHARE_custom: 'user/SHARECUSTOM',
            ResultChoice:'user/RESULTCHOICE',
        }),
        linkTo(){
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                this.$router.push({path:'selectedMsg'});
            },300)
        },
        changeNamed(){
            this.isNamed = !this.isNamed
        },
        changeSignature(){
            this.isSignature = !this.isSignature
        },
        sendNext(){//从客户资料进入时
            this.isOneSend = true
            let content = $.trim(this.moduleObj.inputVal);
            if(content.length==0){
                this.$vux.toast.show({
                    text: "请输入发件信息",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                return false;
            }
            let obj1 = {
                    company_id:this.companyId,
                    user_id:this.userId,
                    content:this.moduleObj.inputVal,
                    has_call:this.isNamed?1:0,
                    has_sign:this.isSignature?1:0,
                    sign:this.userTrueName,
                    state:1
                };
                let _arr=[]
                let obj2 = {
                    'id':this.$route.query.msg.customer_id,
                    'name':this.$route.query.msg.customer_name,
                    'call':this.$route.query.msg.customer_name,
                    'mobile':this.$route.query.msg.mobile,
                    'type':0,
                }
                _arr.push(obj2)
                obj1.sms_recipients = JSON.stringify(_arr)
                //上传录音
                if(this.moduleObj.recordObj&&this.moduleObj.recordObj.id){
                    obj1.attach_ids = this.moduleObj.recordObj.id
                }
                this.message_addSmsRecordFromWeb(obj1)
                //拼接要发的短信内容
                let _sms = ''
                if(this.isNamed){
                    _sms+=this.$route.query.msg.customer_name+'你好，'
                }
                _sms+=this.moduleObj.inputVal
                if(this.isSignature){
                    _sms+='  '+this.userTrueName
                }
                if(this.isAndroid_ios()){
                     window.location.href='sms:'+this.$route.query.msg.mobile+'?body='+_sms
                }else{
                    window.location.href='sms:'+this.$route.query.msg.mobile+'&body='+_sms
                }
               
        },
        saveMessage(){
            let _this = this
            let userName=$.trim(this.userName);
            if(userName.length==0){
                this.sms_recipients=[];
                this.$vux.toast.show({
                    text: "请选择收件人",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                return false;
            }
            let content = $.trim(this.moduleObj.inputVal);
            if(content.length==0){
                this.$vux.toast.show({
                    text: "请输入发件信息",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                return false;
            }
            let obj = {//安卓调用接口处理
              company_id:this.companyId,
              user_id:this.userId,
              content:content,
              has_call:this.isNamed?'1':'0',
              has_sign:this.isSignature?'1':'0',
              sign:this.userTrueName,
            };
            //上传录音
                if(this.moduleObj.recordObj&&this.moduleObj.recordObj.id){
                    obj.attach_ids = this.moduleObj.recordObj.id
                }
            //自己签名
            if(obj.has_sign){
              obj.sign=obj.has_sign=='1'?this.userName:'';
            }
            //发送人的数据处理
            let sms_recipients=this.handSmsRecipients(obj.has_call);
            if(!this.isAndroid_ios()){//为ios调用接口处理
                if(this.sendManNum>1){//收件人为多人
                    this.$vux.confirm.show({
                        content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                                    <p style="margin-top: 10px;">暂不支持群发功能<br>将拆分成多条发送</p>`,
                        onConfirm: ()=>{
                            let obj1 = {
                                company_id:this.companyId,
                                user_id:this.userId,
                                content:this.moduleObj.inputVal,
                                has_call:this.isNamed?1:0,
                                has_sign:this.isSignature?1:0,
                                sign:this.userTrueName,
                                sms_recipients:sms_recipients.length?JSON.stringify(sms_recipients):'',
                                state:0
                            };
                            //上传录音
                            if(this.moduleObj.recordObj&&this.moduleObj.recordObj.id){
                                obj1.attach_ids = this.moduleObj.recordObj.id
                            }
                            _this.message_addSmsRecordFromWeb(obj1)
                        },
                        onCancel:()=>{
                            
                        }
                    })
                }else{//收件人为一个人
                    let obj1 = {
                        company_id:this.companyId,
                        user_id:this.userId,
                        content:this.moduleObj.inputVal,
                        has_call:this.isNamed?1:0,
                        has_sign:this.isSignature?1:0,
                        sign:this.userTrueName,
                        sms_recipients:sms_recipients.length?JSON.stringify(sms_recipients):'',
                        state:0
                    };
                    //上传录音
                    if(this.moduleObj.recordObj&&this.moduleObj.recordObj.id){
                        obj1.attach_ids = this.moduleObj.recordObj.id
                    }
                    _this.message_addSmsRecordFromWeb(obj1)
                }
                
                return ;
            }
            //安卓调用接口
            obj.sms_recipients=sms_recipients.length?JSON.stringify(sms_recipients):'';
            this.message_addSmsRecord(obj)
            
        },
        //处理即将提交给后台的数据 发件人相关数据
        handSmsRecipients(is_call){
          //发送的数据处理
          let sms_recipients_arr=[];
          if(this.sms_recipients.length>0){
            this.sms_recipients.forEach(function (item,) {
              let call='';
              let mobile='';
              if(item.type==1){
                //同事
                if(is_call=='1'){
                    call =item.call?item.call:'';
                } 
                mobile=item.mobile?item.mobile:'';
              }else{
                //客户
                if(is_call=='1'){call =item.honor_name?item.honor_name:''}; 
                if(item.mobile_code){mobile=item.mobile_code+'-'};
                if(item.mobile){mobile=mobile+item.mobile};
              }

              let obj2={
                'id':item.type==0?item.customer_id:item.userId,
                'name':item.type==0?item.customer_name:item.name,
                'call':call,
                'mobile':mobile,
                'type':item.type,
              };

              sms_recipients_arr.push(obj2);
            });
          }

          return sms_recipients_arr;
        },
        isAndroid_ios(){
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            return isAndroid==true?true:false;
        }
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            shareCustom:state => state.user.shareCustom,
            resultChoice:state=>state.user.resultChoice,
            addSmsData:state=>state.message.addSmsData,
            addSmsFromWebData:state => state.message.addSmsFromWebData,
        })
    },
    watch:{
        addSmsFromWebData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                this.alertMsg=data.alert_msg
                return false;
            }else{
                this.$vux.toast.show({
                    text: '保存成功',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                this.$router.go(-1)
            }
        },
        //添加短信记录返回数据处理
        addSmsData(data){
          if(data.alert_msg){
            this.$vux.toast.show({
              text: data.alert_msg,
              type: 'text',
              position: 'top',
              width:'20em'
            });
            return false;
          }else{
            if(data.items.add_count>=0){
              this.sms_recipients = []
              this.$vux.toast.show({
                text:'保存成功',
                type: 'text',
                position: 'top',
                width:'20em'
              });

              //数据保存跳转到列表页面
              this.$router.push({path:'messageHelp'});

            }else{
              this.$vux.toast.show({
                text:'服务器数据异常',
                type: 'text',
                position: 'top',
                width:'20em'
              });
            }
          }
        },
    },
    beforeRouteLeave(to, from, next) {
        let _this = this
        this.formAflag = false
        next();
    },
    beforeRouteEnter (to, from, next) {
        // 进入时调用
        if(from.name=='messageHelp'||!from.name){
            next(vm=>{
                vm.isCustomPage=false
                vm.ResultChoice([])
                vm.formAflag=true
                if(vm.$route.query.id&&vm.$route.query.typeState==1){
                    vm.pageTitle='转发'
                    document.title="转发";
                    vm.userName='';
                    vm.$nextTick(()=>{
                        vm.moduleObj={
                            title: '内容：',
                            placeholder: '最多填写500字，语音录入可自动转换文字和保存录音。运营商规定单条70个字，如超出70个字将按多条计费。' ,
                            max: 500,
                            inputVal: vm.$route.query.checkData.content,
                            uploadData: [],
                            record: true,
                            showBtn: false,
                            disabledFlag:false,
                            uploadFlag:true,
                            textareaHeight:150,
                            recordObj: vm.$route.query.checkData.attach.length>0?vm.$route.query.checkData.attach[0]:{},
                            type: 12,
                        }
                    })
                    
                    vm.isNamed=vm.$route.query.checkData.has_call?true:false
                    vm.isSignature=vm.$route.query.checkData.has_sign?true:false
                }else if(vm.$route.query.id&&vm.$route.query.typeState==2){
                    document.title="再发一条";
                    vm.pageTitle='再发一条'
                    vm.userName=vm.$route.query.checkData.send_names;
                    //数据组装
                    let checkData=vm.$route.query.checkData;
                    vm.sendManNum = checkData.personNum
                    let shareCustomer=[];
                    vm.sendManNum = Number(checkData.customer_list_num)+Number(checkData.company_list_num)
                    // //处理已有的数据结构  客户再前 同事在后
                    if(checkData.customer_list_num>0){
                        
                        checkData.customer_list.forEach(function (item) {
                        let customer_list_obj={
                            'customer_name':item.name,
                            'customer_company_name':'',
                            'customer_id':item.customer_id,
                            'type':0,
                            'logo_orig':item.logo,
                            'flag':item.logo?flag:true,
                            'color':1,
                            'honor_name':item.call,
                            'mobile':item.mobile,
                        };

                        shareCustomer.push(customer_list_obj);
                        });
                    }
                    //同事在前
                    if(checkData.company_list_num>0){
                        checkData.company_list.forEach(function (item,index) {
                        let company_list_obj={
                            'name':item.name,
                            'userId':item.user_id,
                            'type':1,
                            'img':item.logo,
                            'logoNameFlag':false,
                            'work':'',
                            'icon':{
                            'iconFlag':false,
                            'iconType':1
                            },
                            'color':1,
                            'call':item.call,
                            'mobile':item.mobile
                        };

                        shareCustomer.push(company_list_obj);
                        });
                    }
                    //选中的人
                    vm.sms_recipients=shareCustomer;
                    vm.ResultChoice(shareCustomer)
                    //初始化语音状态
                    vm.isNamed=false;
                    vm.isSignature=false;
                    vm.$nextTick(()=>{
                        vm.moduleObj={
                            title: '内容：',
                            placeholder: '最多填写500字，语音录入可自动转换文字和保存录音。运营商规定单条70个字，如超出70个字将按多条计费。' ,
                            max: 500,
                            inputVal: '',
                            uploadData: [],
                            record: true,
                            showBtn: false,
                            disabledFlag:false,
                            uploadFlag:true,
                            textareaHeight:150,
                            recordObj: {
                                id: '',
                                url: '',
                                data: '',
                                duration: '',
                            },
                            type: 12,
                        }
                    })
                    
                }else{//初始化所有状态，新添
                    vm.userName="";
                    vm.pageTitle=''
                    vm.isSignature=false;
                    vm.isNamed=false;
                    vm.$nextTick(()=>{
                        vm.moduleObj={
                            title: '内容：',
                            placeholder: '最多填写500字，语音录入可自动转换文字和保存录音。运营商规定单条70个字，如超出70个字将按多条计费。' ,
                            max: 500,
                            inputVal: '',
                            uploadData: [],
                            record: true,
                            showBtn: false,
                            disabledFlag:false,
                            uploadFlag:true,
                            textareaHeight:150,
                            recordObj: {
                                id: '',
                                url: '',
                                data: '',
                                duration: '',
                            },
                            type: 12,
                        }
                    })
                }
            })
        }else if(from.name=='selectedMsg'){
            next(vm=>{
                if(vm.pageTitle){
                    document.title=vm.pageTitle
                }
                vm.formAflag=true
                vm.isCustomPage=false
                // console.log(vm.resultChoice,'resultC传输过来已选择客户或者同事hoice');//传输过来已选择客户或者同事
                let _arr = [];
                vm.sms_recipients =[]
                if(vm.resultChoice.length>0){
                    vm.resultChoice.forEach(function(items){
                      if(items.type==1){
                         //同事
                        _arr.push(items.name);
                        vm.sms_recipients.push(items);
                      }else if(items.type==0){
                         //客户
                        _arr.push(items.customer_name);
                        vm.sms_recipients.push(items);
                      }
                    },vm);
                    vm.userName=_arr.join('、')
                }else{
                    vm.userName=''
                }
            })
        }else if(from.name=='customPage'){
            next(vm=>{
                vm.formAflag=true
                vm.userName=vm.$route.query.msg.customer_name
                vm.isCustomPage=true
                vm.mobile=vm.$route.query.msg.mobile
                vm.sign=vm.$route.query.msg.customer_name
                vm.call=vm.$route.query.msg.honor_name
                let _arr = [{
                    'customer_name':vm.$route.query.msg.customer_name,
                    'customer_company_name':vm.$route.query.msg.customer_name?vm.$route.query.msg.customer_name:'',
                    'customer_id':vm.$route.query.msg.customer_id,
                    'type':0,
                    'logo_orig':vm.$route.query.msg.logo_orig,
                    'color':1,
                    'honor_name':vm.$route.query.msg.honor_name,
                    'mobile':vm.$route.query.msg.mobile,
                }]
                vm.sms_recipients = _arr
                vm.isNamed=false
                vm.isSignature=false
                vm.$nextTick(()=>{
                    vm.moduleObj={
                        title: '内容：',
                        placeholder: '最多填写500字，语音录入可自动转换文字和保存录音。运营商规定单条70个字，如超出70个字将按多条计费。' ,
                        max: 500,
                        inputVal: '',
                        uploadData: [],
                        record: true,
                        showBtn: false,
                        disabledFlag:false,
                        uploadFlag:true,
                        textareaHeight:150,
                        recordObj: {
                            id: '',
                            url: '',
                            data: '',
                            duration: '',
                        },
                        type: 12,
                    }
                })
            })
        }else{
            next()
        }
        
    },
    components: {
        Popover,
        GroupTitle,
        Scroller,
        XButton,
        XInput,
        Group,
        XTextarea,
        Cell,
        selectedMsg,
        FormA
    },
}
</script>

<style lang="less">
 @import './index.less';
</style>
