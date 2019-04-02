<template>
    <div> 
            <scroller  
                lock-x  
                scrollbarY 
                @on-scroll-bottom="loadMore" 
                @on-scroll="OnScroll" 
                @on-pulldown-loading="refresh" 
                v-model="status" 
                use-pulldown  
                class="loadmore-m0"
                ref="scroller" 
                :height=" aiObj.type==0?'-171':aiObj.type==1?'-114':linkType=='1'? '-39': taskBtnType=='2' &&  linkType=='0'?progressDel==1?'-73': '-39': '-73'" 
                :scroll-bottom-offst="0">
                <div>
                    <div  v-if="Object.keys(aiData).length == 0 ||   aiData.num_items==0 " class="wu-all wu-allB">
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>{{ Object.keys(aiData).length == 0? alertMsg:'暂无数据'}}</p>
                        </section>
                    </div>
                    <div class="ai-list" v-else>
                        <ul>
                            <li v-for="(item,index) in aiData.items" :key="index" >
                                <h6 v-if="item.date && aiObj.type<2" >{{item.date}}</h6>
                                <a href="javascript:void(0)" :class="{'ai-link': aiObj.type!=2}"  @click="linkHand(item,index)" v-if="aiObj.type<2">
                                    <section class="vux-1px-b" >
                                        <h5>{{item.title}}</h5>
                                        <dl>
                                            <dt>任务类型：</dt>
                                            <dd>{{item.taskType}}</dd>
                                        </dl>
                                        <dl>
                                            <dt>启动方式：</dt>
                                            <dd>{{item.Startup==1?'定时启动':'手动启动'}}</dd>
                                        </dl>
                                        <dl>
                                            <dt>主叫号码：</dt>
                                            <dd>{{item.Calling}}</dd>
                                        </dl>
                                        <dl>
                                            <dt>使用坐席：</dt>
                                            <dd>{{item.mat}}个</dd>
                                        </dl>
                                        <p>{{item.userName}}创建于{{item.create}}</p>
                                    </section>
                                    <footer>{{item.taskStatus==0?'未开始':item.taskStatus==1?'进行中':item.taskStatus==2?'已完成':item.taskStatus==3?'调度中':item.taskStatus==4?'手动暂停':item.taskStatus==5?'自动暂停': item.taskStatus==6?'已终止':item.taskStatus==7?'排队中':item.taskStatus==8?'AI到期':'账户欠费'  }}
                                        <span>（{{item.nunber}}/{{item.total}}）</span></footer>
                                </a>
                                <a href="javascript:void(0)" :class="{'ai-link': aiObj.type!=2}"   @click="linkHand(item,index)" v-else>                                  
                                    <section class="vux-1px-b">
                                        <h5 >{{item.title}}</h5>
                                        <dl>
                                            <dt>联系电话：</dt>
                                            <dd>{{item.customerTelephone}}</dd>
                                        </dl>
                                        <dl v-if="aiObj.type!='2'">
                                            <dt>AI意向等级：</dt>
                                            <dd>{{item.aiResultValue}}</dd>
                                        </dl>
                                        <dl v-if="aiObj.type!='2'">
                                            <dt>人工意向等级：</dt>
                                            <dd>{{item.resultValue.length==0?'未选择':item.resultValue}}</dd>
                                        </dl>
                                        <dl>
                                            <dt>主叫号码：</dt>
                                            <dd>{{item.callerPhone.length==0?'--':item.callerPhone}}</dd>
                                        </dl>
                                        <dl v-if="aiObj.type!='2'">
                                            <dt>通话状态：</dt>
                                            <dd>{{item.finishStatus==0?'已接听':item.finishStatus==1?'拒接':item.finishStatus==2?'无法接通':item.finishStatus==3?'主叫号码不可用':item.finishStatus==4?'空号':item.finishStatus==5?'关机': item.finishStatus==6?'占线':item.finishStatus==7?'停机':item.finishStatus==8?'未接':'主叫欠费'  }}</dd>
                                        </dl>
                                        <dl v-if="aiObj.type!='2'">
                                            <dt>通话时长：</dt>
                                            <dd>{{item.duration}}秒</dd>
                                        </dl>
                                        <dl>
                                            <dt>通话时间：</dt>
                                            <dd>{{item.startTime.length==0?'--':item.startTime}}</dd>
                                        </dl>
                                    </section>
                                    <footer>{{item.progress==0?'进行中':item.progress==1?'已完成':item.progress==2?'已读':'未读'}} <span v-if="aiObj.type<2">（{{item.nunber}}/{{item.total}}）</span></footer>
                                </a>                               
                            </li>
                        </ul>
                    </div>
                    <load-more tip="加载中" v-if="loadFlag" ></load-more>
                    <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
                </div>
                <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" :style="{position: 'absolute', width: '100%',  top: aiObj.type>1?'-38px': '-30px' , textAlign: 'center'}">
                    <span v-show="status.pulldownStatus === 'default'"></span>
                    <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
                    <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放刷新</span>
                    <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
                </div>
            </scroller>
            <div v-transfer-dom>
                <confirm
                v-model="btnModel"
                :close-on-confirm="false"
                title="提示"
                @on-confirm="onConfirm4">
                    <p style="text-align:center;">是否确定{{taskBtnFlag?'暂停所有任务':'开启所有任务'}}</p>
                </confirm>
                <popup v-model="aiObj.aiVoiceFlag" width='100%' should-rerender-on-show  position="right">
                    <AiVoice v-if="aiObj.aiVoiceFlag"  />
                </popup>
            </div>
            <div v-if="!(Object.keys(aiData).length == 0 || aiData.num_items==0) &&  aiObj.type==0"><x-button type="primary" @click.native="taskHand"  :disabled="taskDed" >{{taskBtnFlag?'暂停所有任务':'开启所有任务'}}</x-button></div>           
    </div>
</template>
<script>
import { Scroller,XButton,LoadMore ,Confirm,  TransferDom ,numberRandom ,Popup,PopupPicker} from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';
import AiVoice from '@/pages/customs/tool/AI/aiVoice';
import { setTimeout } from 'timers';
export default {
    name: 'AiList',
    data() {
        return {   
            page:1,
            count:10,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:false,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            pulldown:false,
            alertMsg:'加载中...',//第一次

            aiData:{},    
            ArrData:[],

            date:'',//日期显示
            allStatusFlag:true,//所有的状态开启第一次开启

            taskBtnFlag:true,//按钮状态
            btnModel:false,//按钮弹弹出的窗口
            linkType:this.$route.query.linkType,
            taskBtnType: localStorage.getItem("taskBtnType") || '2',

            data_index:0,//数据第几个
            dataFlag:false,//数据点击不让点
            taskDed:true,//20：00 -9：00
            progressDel:this.$route.query.progress||0,

        }
    },
    props:['aiObj'],
     //aiObj.type  0: ai外呼列表 1:查看下属列表 2:进行中   /aiObj.type>2:完成
    directives: {
        TransferDom
    },
    created() {
        //超出时间按钮不操作
        var date = new Date();
        if(date.getHours()>8 && date.getHours()<20){
           this.taskDed=false;
        }
        this.onload=true;
        this.loadingHand(true);
        this.aiArrHand();  
    },
    computed: {
        ...mapState({
            queryListData: state => state.ai.queryListData,  
            allTaskStartData: state => state.ai.allTaskStartData,  
            allTaskStatusData: state => state.ai.allTaskStatusData,  
            allTaskEndData: state => state.ai.allTaskEndData,   
            taskPhoneListData: state => state.ai.taskPhoneListData,   
            readTaskData: state => state.ai.readTaskData, 
        })       
    },
     watch: {
        'aiObj.type': function(type) {
            this.aiViewHand();
        },
        //列表数据
         queryListData(data){  
            if( Object.keys(data).length >0 && this.aiObj.type<2){                
                if(this.onload){
                    this.onload=false
                    this.loadingHand(false)
                }
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.status.pulldownStatus = 'default' ;
                    this.alertMsg=data.alert_msg;
                }else{  
                                      
                    let ArrObj= data;
                    let aiList=[];
                    if(ArrObj.items.length>0){
                        ArrObj.items.forEach((item,index)=>{
                            let obj={
                                title:item.taskName,
                                mat:item.concurrencyQuota,
                                taskType:'AI外呼',
                                Startup:item.taskType,
                                Calling:item.phones,
                                create:item.addTime,
                                progress:item.taskStatus==2?'1':'0',
                                total:item.taskTotalCount,
                                nunber:item.taskDoneCount,
                                date:item.addTimeM,
                                id:item.id,
                                userName:item.userName,
                                taskStatus:item.taskStatus,
                                //跳转到进行中页面  0可以暂停    1:可以启动   2: 跳转到进行中页面 不能操作 3:已完成
                                taskBtnType:item.taskStatus==2?'3':item.taskStatus==1 || item.taskStatus==3 || item.taskStatus==7 || item.taskStatus==5 ?'0':item.taskStatus==0 || item.taskStatus==4 ?"1":'2',
                            };
                            if(this.date==obj.date){
                                obj.date='';                
                            }else{
                                this.date=obj.date
                            }
                            aiList.push(obj)
                        },this)
                    } 
                    if(this.pulldown || this.page==1){
                        this.ArrData=[];
                        this.ArrData= aiList;
                        this.status.pulldownStatus = 'default' ;                       
                    }else{
                        this.ArrData= this.ArrData.concat(aiList) ;                                            
                    }            
                    ArrObj.items=this.ArrData;           
                    if(data.has_more){
                        this.onFetching = false ;
                        this.loadFlag=true;
                    }else{
                        this.loadFlag=false
                        this.onFetching = true 
                    }
                    this.aiData = ArrObj ;
                    //获取全部启动/全部暂停 按钮状态  
                    if(this.allStatusFlag && this.aiObj.type==0){
                        this.allStatusFlag=false;
                         let obj2={
                            company_id:this.companyId,
                            user_id:this.userId,
                        }
                        this.allTaskStatusHand(obj2) 
                    }
                }
            }
        },
        // 获取全部启动/全部暂停 按钮状态 
         allTaskStatusData(data){  
            if( Object.keys(data).length >0 ){  
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{  
                    this.taskBtnFlag= (data.items.taskStatus=='1');
                   
                }
                
            }
         },
         // 全部启动
         allTaskStartData(data){  
            if( Object.keys(data).length >0 ){
                setTimeout(() => {
                    this.loadingHand(false)
                },1200)
                let text;  
                if(data.alert_msg){
                    text=data.alert_msg;                    
                }else{  
                    text='开启所有任务成功';
                    this.taskBtnFlag= true;
                    setTimeout(() => {
                        this.btnModel = false;
                    },1000)
                    setTimeout(() => {
                        this.aiViewHand()
                    },1300)
                    
                }
                    this.$vux.toast.show({
                        text:text,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                
            }
         },
         // 全部暂停
         allTaskEndData(data){  
            if( Object.keys(data).length >0 ){  
                 setTimeout(() => {
                    this.loadingHand(false)
                },1200)
                let text;
                if(data.alert_msg){
                     text=data.alert_msg; 
                }else{  
                    this.taskBtnFlag=false;
                    text='暂停所有任务成功';
                     setTimeout(() => {
                        this.btnModel = false;
                    },1000)
                    setTimeout(() => {
                        this.aiViewHand()
                    },1300)
                }
                    this.$vux.toast.show({
                        text:text,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                
            }
         },
        //电话列表数据
         taskPhoneListData(data){  
            if( Object.keys(data).length >0 && this.aiObj.type>=2){                
                if(this.onload){
                    this.onload=false
                    this.loadingHand(false)
                }
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.status.pulldownStatus = 'default' ;
                     this.alertMsg=data.alert_msg;
                }else{  
                    let ArrObj= data;
                    let aiList=[];
                    if(data.items.length>0){
                        ArrObj.items.forEach((item,index)=>{
                            let obj;
                            if(this.$route.query.progress==1){
                                 obj={
                                    title:item.customerName,
                                    customerTelephone:item.customerTelephone,                            
                                    callerPhone:item.callerPhone,
                                    startTime:item.startTime,
                                    progress:(item.readStatus==0?'3':'2'),
                                    phoneResultAnalyzes:item.phoneResultAnalyzes,
                                    aiResultValue:  item.phoneResultAnalyzes? item.phoneResultAnalyzes[0].resultValue:'',
                                    resultValue:item.resultValue,
                                    finishStatus:item.finishStatus,
                                    duration:item.duration,
                                    id:item.phoneRecordId,
                                    luyinOssUrl:item.luyinOssUrl,
                                    pic:item.customerLogoDefault,
                                    pic2:item.aiRobotLogoDefault,
                                };                                
                            }else{
                                 obj={
                                    title:item.customerName,
                                    customerTelephone:item.customerTelephone,                            
                                    callerPhone:item.callerPhone,
                                    startTime:item.startTime,   
                                    progress:'0', 
                                    id:item.phoneRecordId,      
                                    phoneResultAnalyzes:'',
                                    aiResultValue:'',
                                    resultValue:'',
                                    finishStatus:'',
                                    duration:'',
                                    luyinOssUrl:'',
                                    pic:'',  
                                    pic2:'',             
                                };   
                                if(this.aiObj.type==3){
                                    obj.progress=(item.readStatus==0?'3':'2');
                                    obj.phoneResultAnalyzes=item.phoneResultAnalyzes;
                                    obj.aiResultValue=item.phoneResultAnalyzes? item.phoneResultAnalyzes[0].resultValue:'';
                                    obj.resultValue=item.resultValue;
                                    obj.finishStatus=item.finishStatus;
                                    obj.duration=item.duration;
                                    obj.luyinOssUrl=item.luyinOssUrl;
                                    obj.pic=item.customerLogoDefault;
                                    obj.pic2=item.aiRobotLogoDefault;
                                }

                            }
                            
                            aiList.push(obj)
                        },this)

                    }
                    
                    if(this.pulldown || this.page==1){
                        this.ArrData=[];
                        this.ArrData= aiList;
                        this.status.pulldownStatus = 'default';
                    }else{
                        this.ArrData= this.ArrData.concat(aiList) ;                                            
                    }            
                    ArrObj.items=this.ArrData;           
                    if(data.has_more){
                        this.onFetching = false ;
                        this.loadFlag=true;
                    }else{
                        this.loadFlag=false
                        this.onFetching = true 
                    }
                    this.aiData = ArrObj ;
                }
            }
        },
        // 已读任务
         readTaskData(data){  
            if( Object.keys(data).length >0 ){ 
                setTimeout(() => {
                    this.this.dataFlag=false;
                },1200)
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{  
                    localStorage.setItem("resultValue",this.ArrData[this.data_index].resultValue);
                     let linkType=this.$route.query.linkType;      
                    this.$router.push({ path: 'aiVoice',query:{id:this.ArrData[this.data_index].id,resultValue:this.ArrData[this.data_index].resultValue,luyinOssUrl:this.ArrData[this.data_index].luyinOssUrl,aiResultValue:this.ArrData[this.data_index].aiResultValue,linkType:linkType,pic:this.ArrData[this.data_index].pic } })  
                }
            }
         },
        
     },
     methods: {
         ...mapActions({
            queryListHand: 'ai/queryListHand',
            allTaskStartHand: 'ai/allTaskStartHand',
            allTaskStatusHand: 'ai/allTaskStatusHand',
            allTaskEndHand: 'ai/allTaskEndHand',
            taskPhoneListHand: 'ai/taskPhoneListHand',   
            readTaskHand: 'ai/readTaskHand', 
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
        }),
        //数据请求方式
        aiArrHand(){
            //type 0:ai外呼列表
            if(this.aiObj.type==0){
                let user_ids=[];
                    user_ids.push(this.userId)
                let obj={
                    user_ids:JSON.stringify(user_ids),
                    company_id:this.companyId,
                    page:this.page,
                    count:this.count,
                }                
                this.queryListHand(obj); 
            }else if(this.aiObj.type==1){
                //查看 下属 
                let user_ids=[];
                    if(this.aiObj.user_ids.length>0){
                      user_ids=this.aiObj.user_ids;
                    }
                let obj={
                    user_ids:JSON.stringify(user_ids),
                    company_id:this.companyId,
                    page:this.page,
                    count:this.count,
                    add_time:this.aiObj.add_time,
                }             
                if(this.aiObj.user_ids.length==0){
                    obj.p_user_id=this.userId;
                }
                this.queryListHand(obj); 
           
            }else{
                // this.aiObj.type==2进行中   
                // this.aiObj.type>2  //已完成 
                let obj={
                    company_id:this.companyId,
                    page:this.page,
                    count:this.count,
                    task_id:this.$route.query.id,
                    call_type:'1',
                    dial_type:this.$route.query.progress,
                }
                if(this.aiObj.type==5){
                    obj.read_status="1";
                }else if(this.aiObj.type==6){
                    obj.read_status="0";
                }else if(this.aiObj.type==3){
                    obj.dial_type='1';
                }                
                this.taskPhoneListHand(obj); 
            }
        },


        OnScroll(){           
            this.$refs.scroller.reset()
        },       
        loadMore () {
            if (!this.onFetching) {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                this.aiArrHand();            
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                
                this.pulldown=true
                this.page = 1;
                if(this.aiObj.type==0){
                    this.date='';
                }
                this.aiArrHand();   
            }
        },  
        //任务开启跟停止 type 
        onConfirm4 () {
            let obj={
                    req_source:'6',
                    user_id:this.userId,
                    company_id:this.companyId,
                }
                this.loadingHand(true);
                if(!this.taskBtnFlag){
                    this.allTaskStartHand(obj);                    
                }else{
                    this.allTaskEndHand(obj);                    
                } 
        },
        
        //打开新的链接地址
        linkHand(data,index){
            if(this.aiObj.type<2){
                //0 进行中 1 完成
                localStorage.setItem("tabNum",0)
                 let type= this.aiObj.type;
                if(data.progress==0){  
                   
                    if(type==0){
                        localStorage.setItem("taskBtnType",data.taskBtnType);
                    }else{
                        localStorage.setItem("taskBtnType",'2');
                    }
                    this.$router.push({ path: 'aiOngoing' ,query:{progress:data.progress,id:data.id,linkType:type,}})
                }else{                
                    this.$router.push({ path: 'aiComplete',query:{progress:data.progress,id:data.id,linkType:type, } })
                }
            }else if(this.aiObj.type>2){
                if(data.progress=='3'){
                    if(!this.dataFlag){
                        this.dataFlag=true;
                            let obj={
                            phone_record_id:data.id,
                        }
                        this.data_index=index;
                        this.readTaskHand(obj);
                    }
                }else{
                    localStorage.setItem("resultValue",data.resultValue);
                    let linkType=this.$route.query.linkType;
                    this.$router.push({ path: 'aiVoice',query:{id:data.id,luyinOssUrl:data.luyinOssUrl,aiResultValue:data.aiResultValue,pic:data.pic,pic2:data.pic2,linkType:linkType ,resultValue:data.resultValue,finishStatus:data.finishStatus} })              
                }
            }
            
        },
        taskHand(){
            this.btnModel = true;           
        },  
        aiViewHand(){          
            this.onload=true;
            this.page=1;
            this.loadingHand(true);
             this.$refs.scroller.reset({
                top: 0
                })
            this.aiArrHand()   
        }
        
    },
    
    components: {
        Scroller,XButton ,LoadMore,Confirm,Popup,AiVoice,PopupPicker
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>