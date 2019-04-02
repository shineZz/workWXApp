<template>
    <div class="messageHelp">
        <scroller
            lock-x
            scrollbarY
            height="-40"
            v-if='!isCheckMessage'
            @on-scroll-bottom="loadMore"
            @on-pulldown-loading="refresh"
            v-model="status"
            use-pulldown
            ref="scroller"
            :scroll-bottom-offst="0"
            @on-scroll="OnScrolle"
        >
            <div  v-if="initData.length==0 " class="wu-all wu-allB">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>{{ initData.length == 0? '暂无短信数据':alertMsg}}</p>
                    </section>
                </div>
            <div class="tool-list" style="overflow:hidden;" v-else>
                
                <ul style="padding-top:0;">
                    <li v-for="(item,index) in initData" :key="index" :class="!item.update_time?'msg-has-top':''">
                        <h6 class="time-title" v-if='item.update_time'><time>{{item.update_time}}</time></h6>
                        <article style="margin-bottom:0;">
                            <section class="vux-1px-b">
                                <header>
                                    <h5 class="send_names">{{item.send_names}}</h5>
                                    <span v-if="item.all_num>1">({{item.all_num}})</span>
                                    <p>{{item.add_time_note}}</p>
                                </header>
                                <p class="it-cont" style="word-wrap:break-word;word-break:break-all;white-space: pre-line;">{{item.content}}</p>
                            </section>
                            <footer class="footer-btn" v-if="item.state!=1">
                                <p >未发送</p>
                                <div>
                                    <!--目前手机端只支持单条发送-->
                                    <x-button mini type="primary" @click.native="toMessageDetail(item,index)" plain>本机短信发送</x-button>
                                    <!-- <x-button mini type="primary" plain >小宝营销短信发送</x-button> -->
                                </div>
                            </footer>
                            <footer  class="footer-link" v-else>
                                <router-link to='' @click.native="toCheckMsg(item,index)">已发送</router-link>
                            </footer>
                        </article>
                    </li>
                </ul>
                <load-more tip="加载中" v-if="loadFlag" ></load-more>
                <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
            </div>
            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放加载</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>
        </scroller>
        
        <div class="messageHelpFooter" v-if='!isCheckMessage'>
            <div class="parent vux-1px-r">
                <div class="message1" v-if="isMessage1">
                    <div class="box">
                        <div class="vux-1px-b" @click="selectMessage(0)">只显示未发送</div>
                        <div class="vux-1px-b" @click="selectMessage(1)">只显示已发送</div>
                        <div @click="selectMessage(-1)">显示全部</div>
                    </div>
                    <div class="triangle">
                        
                    </div>
                </div>
                <div @click="message1Show" class="btn-message" :class="isMessage1?'activeBtn':''">
                    <img src="@/images/tool/zk.png" alt="" v-if="isMessage1">
                    <img src="@/images/tool/zj.png" alt="" v-else>
                    筛选
                </div>
            </div>
            <div class="parent parent1 vux-1px-r" >
                <div class="message2" v-if="isMessage2" >
                    <div class="box">
                        <div class="vux-1px-b" @click="deleteMessage(0)">清空未发送</div>
                        <div class="vux-1px-b" @click="deleteMessage(1)">清空已发送</div>
                        <div @click="deleteMessage(-1)">清空全部</div>
                    </div>
                    <div class="triangle">
                        
                    </div>
                </div>
                <div @click="message2Show" class="btn-message" :class="isMessage2?'activeBtn':''">
                    <img src="@/images/tool/zl.png" alt="" v-if="isMessage2">
                    <img src="@/images/tool/zi.png" alt="" v-else>
                    操作
                </div>
            </div>
            <div class="parent parent2" @click="writeMessage">
                <div class="message3"></div>
                <div class="btn-message">
                    <img src="@/images/tool/zh.png" alt="">
                    写短信
                </div>
            </div>
        </div>
        <CheckMessage  v-if='isCheckMessage' :toggleCheckMessage="toggleCheckMessage" :checkData="checkData" />
        <div v-transfer-dom>
            <popup v-model="show13" @on-hide="closePopup" position="bottom" height="150">

            </popup>
        </div>
        
    </div>
</template>

<script>
import {  Popover , GroupTitle ,Scroller,Cell,XButton,TransferDom, Popup,LoadMore,} from 'vux'
import { mapState,mapActions,mapMutations, } from 'vuex'
import CheckMessage from './checkMessage'
import VueEmit from '@/util/vueEimt';
let data = [];
export default {
    name: 'messageHelp',
    data() {
        return {
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            userName: this.$store.state.userInfo.user.trueName,
            isMessage1:false,
            isMessage2:false,
            initData:[],
            isCheckMessage:false,
            checkData:{},
            show13:false,
            page:1,
            count:10,
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:false,//要不要滚动加载
            status: {
              pulldownStatus: 'default',
            },
            pulldown:false,
            selectMessageState:-1, //筛选列表的短信状态操作 默认全部
            sendSmsIndex:-1,
            alertMsg:'加载中...',//第一次
            fix_date:'',
            isRefresh:false,
        }
    },
    created() {
      let obj = {
        company_id:this.companyId,
        user_id:this.userId,
        page:1,
        count:this.count,
      };
      this.message_getSmsLists(obj);
    },
    directives: {
        TransferDom
    },
    mounted(){

        let _this = this;
        VueEmit.$on('changeToggle',function(data){
            _this.isCheckMessage=data.flag;
            _this.$router.push({path:"messageDetail",query:data.res})
        })
    },
    methods: {
        ...mapActions({
          message_getSmsLists: 'message/getSmsLists',
          message_deleteSmsRecord: 'message/deleteSmsRecord',
          message_sendSms: 'message/sendSms',
          message_addSmsRecordFromWeb: 'message/addSmsRecordFromWeb',
        }),
        loadMore () {
          if (this.onFetching) {
            
          }else{
                this.onFetching=true;
                this.page++;
                let page = this.page;
                let obj = {
                user_id:this.userId,
                company_id:this.companyId,
                page:page,
                count:this.count,
                };
                if(this.selectMessageState>=0){
                obj.state=this.selectMessageState;
                }
                this.message_getSmsLists(obj);
                return  false;
          }
        },

        //数据刷新
        refresh(){
            this.isRefresh = true;
            let that = this;
            let state= this.selectMessageState;
            this.page=1;
            // this.initData=[];
            let obj = {
                user_id:this.userId,
                company_id:this.companyId,
                page:1,
                count:this.count,
            };
            if(state>=0){
                obj.state=state;
            }

            this.message_getSmsLists(obj);
        },
        onCancel(){
            this.confirmShow=false
        },
        onConfirm(){

        },
        //数据列表重新加载，页面数据置顶
        reLoadData(){
          //数据重新刷新数据加载
          this.refresh();
          //数据置顶
          this.$nextTick(() => {
            this.$refs.scroller.reset({
              top: 0
            })
          });
        },
        OnScrolle(){
            this.$refs.scroller.reset()
        },
        toggleCheckMessage(){
            this.isCheckMessage=!this.isCheckMessage
        },

        //查看详情
        toCheckMsg(item){
            //查看数据详情
            document.title='短信详情'
            this.checkData=item;
            this.isCheckMessage=!this.isCheckMessage;
            this.checkData.type=1;
            
        },
        message1Show(){
            if(this.isMessage1||this.isMessage2){
                if(this.isMessage2){
                    this.isMessage2=false;
                }
                if(this.isMessage1){
                    this.isMessage1=false;
                    this.show13=false;
                }else{
                    this.isMessage1=true;
                    this.show13=true;
                }
            }else{
                this.isMessage1 = true;
                this.show13=true;
            }
        },
        message2Show(){
            if(this.isMessage1||this.isMessage2){
                if(this.isMessage2){
                    this.isMessage2=false;
                    this.show13=false;
                }else{
                    this.isMessage2=true;
                    this.show13=true;
                }
                if(this.isMessage1){
                    this.isMessage1=false;
                }
            }else{
                this.isMessage2 = true;
                this.show13=true;
            }
        },

        //清空数据（已发送、未发送、全部）
        deleteMessage(state){
            let _this = this
          //按钮标签的选中显示
          let content = state==0?'确定清空未发送信息吗？':state==1?'确定清空已发送信息吗？':"确定清空全部信息吗？";
          this.$vux.confirm.show({
                content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                            <p style="margin-top: 10px;">`+content+`</p>`,
                onConfirm: ()=>{
                   _this.isMessage1 = false;
                    _this.isMessage2 = false;
                    _this.show13=false;
                    _this.selectMessageState=-1;

                    //请求数据
                    let obj={
                        company_id:_this.companyId,
                        user_id:_this.userId,
                        page:1,
                        count:_this.count,
                    };
                    if (state>-1){
                        obj.state=state;
                    }
                    _this.message_deleteSmsRecord(obj);
                },
                onCancel:()=>{
                    _this.isMessage1 = false;
                    _this.isMessage2 = false;
                    _this.show13=false;
                }
            })
          
        },

        //选择发送、未发送、全部的列表
        selectMessage(state){
          //按钮标签的选中显示
          this.isMessage1 = false;
          this.isMessage2 = false;
          this.show13=false;
          this.selectMessageState=state;
          //请求数据
          this.reLoadData();
        },

        closePopup(){
            this.isMessage1 = false;
            this.isMessage2 = false;
            this.show13=false
        },

        //本机发送短信，并添加记录
        toMessageDetail(obj_s,index){
            let _this = this
            let mobile=''; //发送的手机号
            let body ='';  //发送的短息内容
            let sign='';
            let call='';
            // 发送模板格式： XXX你好，（你好后加逗号）。签名为：  XX（名字前加空格）
            let allArry = obj_s.customer_list.concat(obj_s.company_list)
            allArry.forEach(function(item){
                mobile+=item.mobile+','
            })
            mobile = mobile.substring(0,mobile.length-1)
            if(obj_s.has_call){
                body+=obj_s.send_names+'你好,  '+obj_s.content
            }else{
                body+=obj_s.content
            }
            if(obj_s.has_sign){
                body+='  '+this.userName
            }
            let obj={
                'company_id':this.companyId,
                'user_id':this.userId,
                'sms_id':obj_s.id,
            };
            if(this.isAndroid_ios()){
                this.sendSmsIndex=index; //标记当前发送的本机短信的索引
                this.message_sendSms(obj);
                window.location.href="sms:"+mobile+"?body="+body;
            }else{
                if(allArry.length>1){
                    let arr = []
                    obj_s.company_list.forEach(function(item){
                        let obj = {}
                        obj.name = item.name
                        obj.id = item.user_id
                        obj.call =item.call
                        obj.mobile =item.mobile
                        obj.type=0
                        arr.push(obj)
                    })
                    obj_s.customer_list.forEach(function(item){
                        let obj = {}
                        obj.name = item.name
                        obj.id = item.customer_id
                        obj.call =item.call
                        obj.mobile =item.mobile
                        obj.type=1
                        arr.push(obj)
                    })
                    let arr_string =JSON.stringify(arr) 
                    this.$vux.confirm.show({
                        content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                                    <p style="margin-top: 10px;">暂不支持群发功能<br>将拆分成多条发送</p>`,
                        onConfirm: ()=>{
                            let obj = {
                                sms_id:obj_s.id,
                                company_id:obj_s.company_id,
                                user_id:obj_s.user_id,
                                content:obj_s.content,
                                has_call:obj_s.has_call,
                                has_sign:obj_s.has_sign,
                                sign:obj_s.sign,
                                sms_recipients:arr_string,
                            };
                            if(obj_s.attach_id){
                                obj.attach_id=obj_s.attach_id;
                            }
                            _this.message_addSmsRecordFromWeb(obj)
                        },
                        onCancel:()=>{
                            
                        }
                    })
                }else{
                    this.sendSmsIndex=index; //标记当前发送的本机短信的索引
                    this.message_sendSms(obj);
                    let mobile_a = ''
                    let body_s = ''
                    if(obj_s.company_list.length>0){
                        mobile_a=obj_s.company_list[0].mobile
                        if(obj_s.has_call){
                            body_s+=obj_s.company_list[0].name+'你好， '
                        }
                        body_s+=obj_s.content
                        if(obj_s.has_sign){
                            body_s+='  '+this.userName
                        }
                    }else if(obj_s.customer_list.length>0){
                        mobile_a=obj_s.customer_list[0].mobile
                        if(obj_s.has_call){
                            body_s+=obj_s.customer_list[0].name+'你好， '
                        }
                        body_s+=obj_s.content
                        if(obj_s.has_sign){
                            body_s+='  '+this.userName
                        }
                    }
                    // window.location.href="sms:"+''+"&body="+'';
                    window.location.href="sms:"+mobile_a+"&body="+body_s;
                }
            }

        },
        writeMessage(){
            this.$router.push({path:"messageDetail"})
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
            smsListsData: state => state.message.smsListsData,
            deleteSmsData: state => state.message.deleteSmsData,
            sendSmsData: state => state.message.sendSmsData,
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
                this.refresh()
            }
        },
      //短信列表
      smsListsData(data){
        if(data.alert_msg){
          this.$vux.toast.show({
            text: data.alert_msg,
            type: 'text',
            position: 'top',
            width:'20em'
          });
          this.alertMsg=data.alert_msg
          return false;
        }else {
            let _data = data.items;
                // let is_show_update_time = true;
            if (_data) {
                _data.forEach(function (item, index) {
                    let name = [];
                    //对数据进行数据处理主要是发送人的显示
                    if(item.update_time!=this.fix_date){
                        this.fix_date=item.update_time
                    }else{
                        item.update_time=false
                    }
                    //客户
                    if (item.customer_list_num) {
                        if (item.customer_list) {
                        item.customer_list.forEach(function (m, n) {
                            if (m.name) name.push(m.name);
                        });
                        }
                    }
                    //同事
                    if (item.company_list_num) {
                        if (item.company_list) {
                        item.company_list.forEach(function (m, n) {
                            if (m.name) name.push(m.name);
                        });
                        }
                    }
                    item.personNum =  item.company_list_num+item.customer_list_num
                    item.equipmentType = this.isAndroid_ios()
                    _data[index]['send_names'] = name.length > 0 ? name.join('、') : '';
                },this);
            }
            if(this.isRefresh){
                this.isRefresh=false
                this.initData = _data
                this.status.pulldownStatus = 'default';
            }else{
                let old_data = this.initData;
                this.initData = old_data.concat(_data);
            }
            this.loadFlag=data.has_more;//true
            this.onFetching=!data.has_more;//false
        }
      },

      //清空短信
      deleteSmsData(data){
        if(data.alert_msg){
          this.$vux.toast.show({
            text: data.alert_msg,
            type: 'text',
            position: 'top',
            width:'20em'
          });
          return false;
        }else{
          if(data.items.delete_num>=0){
            this.$vux.toast.show({
              text:'清空成功',
              type: 'text',
              position: 'top',
              width:'20em'
            });
            //数据列表重新加载
            this.reLoadData();

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
        
      //发送本机短信记录返回数据处理
      sendSmsData(data){
        //为了用户体验数据请求完成后更新前端的数据状态
        if(data.items.hasOwnProperty("update_num")&&data.items.update_num>=0){
            this.initData[this.sendSmsIndex].state=1;
            //并重置sendSmsIndex的值至初始值
            this.sendSmsIndex=-1;
            this.refresh()
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top:0
                })
            })
         }
        }
     },

    directives: {
        TransferDom
    },
    beforeRouteEnter(to, from, next){
        next()
    },
    beforeRouteLeave(to, from, next) {
        let _this = this
        // this.$vux.confirm.hide()
        if(this.isCheckMessage){
            this.isCheckMessage=false;
            document.title='短信助手'
             next(false);
        }else{
            next();
        }
    },
    components: {
        Popover,
        GroupTitle,
        Scroller,
        XButton,
        CheckMessage,
        Popup,
        LoadMore
    },
}
</script>

<style lang="less">
@import './index.less';
.messageHelp{
    .msg-has-top{
        margin-top:10px !important;
    }
}
</style>
<style lang="less" scoped>
 @import '../../../../css/toolList.less';
 
</style>
