<template>
    <div class="router-all">     
        <div class="router-box" v-show="!signFlag">   
            <group >
                <cell>
                    <span slot="title" class="wh5">任务名称：</span>
                    <x-textarea slot="value" class="textarea-cor" ref="companyInput" v-model="taskName" :rows="1" autosize :show-counter="false" :max="30"   @on-change="NameHand"  placeholder="请填写任务名称（必填）" />                  
                </cell>
            </group>
            <group >
                <x-switch @click.native='MoreHand' class="timing-more"  title="定时启动 <a href='javascript:void(0)' >（了解更多）</a> " v-model="timingFlag" /> 
                <datetime
                    v-model="timingDate"
                    placeholder="请选择日期（必选）"
                    class="from-left"
                    :start-date="timingStartDate"
                    v-show="timingFlag"
                >
                    <span slot="title" class="wh5">启动日期：</span>
                </datetime>
                <datetime
                    v-model="timingPeriodStart"
                    placeholder="请选择时段（必选）"
                    class="from-left"
                    format='HH:mm'
                     :min-hour="minhour"
                    :max-hour="maxhour"        
                    v-show="timingFlag"       
                    @on-change="timingStartOn" 
                    
                >
                    <span slot="title" class="wh5">开始时段：</span>
                </datetime>
                <datetime
                    v-model="timingPeriodEnd"
                    placeholder="请选择时段（必选）"
                    class="from-left"
                    format='HH:mm'
                    :min-hour="minhour"
                    :max-hour="maxhour"
                    v-show="timingFlag"
                    @on-change="timingEndOn" 
                >
                    <span slot="title" class="wh5">结束时段：</span>
                </datetime>
                <x-switch title="设置不拨打时段" v-model="callFlag"/>
                <datetime
                    v-model="callPeriodStart"
                    placeholder="请选择时段（必选）"
                    class="from-left"
                    format='HH:mm'
                    :min-hour="minhour"
                    :max-hour="maxhour"
                    v-show="callFlag"
                     @on-change="callStartOn" 
                >
                    <span slot="title" class="wh5">开始时段：</span>
                </datetime>
                <datetime
                    v-model="callPeriodEnd"
                    placeholder="请选择时段（必选）"
                    class="from-left"
                    format='HH:mm'
                    :min-hour="minhour"
                    :max-hour="maxhour"
                    v-show="callFlag"
                    @on-change="callEndOn" 

                >
                    <span slot="title" class="wh5">结束时段：</span>
                </datetime>
            </group>
            <group class="form-has">
                <cell  :value="wordsName?wordsName:'请选择AI话术（必选）'"   is-link @click.native="wordsAboveHand" value-align="left" :class="{'has': wordsName}">
                    <span slot="title" class="wh5">AI话术：</span>
                </cell>
            </group>
            <group class="form-has">
                <!-- <x-switch title="发送挂机短信" v-model="smsFlag" /> -->
                <popup-picker  :data="wayDate" value-text-align="left"  :show.sync="showPopupPicker" @on-shadow-change="shadowCHange" v-model="wayVal" :disabled="atHandFlag" show-name :columns="1" @on-hide="onHide">                
                    <span slot="title" class="wh5">外呼方式：</span>                
                </popup-picker>                        
            </group>
            <group class="form-has">
                <cell  :value="checkObj.checkCurData.length>0?checkObj.checkCurName:'请选择外呼号码（必选）'"    is-link @click.native="checkHand" value-align="left" :class="{'has': checkObj.checkCurData.length>0}">
                    <span slot="title" class="wh5">外呼号码：</span>
                </cell>
                <x-input @on-blur="atHandBlur" v-if="checkObj.checkCurData.length>0" @on-change="atHandChange" type="tel"  :disabled="inputFlag"  v-model="atTableVal" label-width="5em" :max="10" title='AI坐席：' placeholder="请输入坐席个数（必填）" />
                <cell v-if="!checkObj.checkCurData.length>0"  :value="customerObj.name?customerObj.name:'请选择客户（必选）'"  is-link @click.native="singHand" value-align="left" :class="{'has': customerObj.name}">
                    <span slot="title" class="wh5">选择客户：</span>
                </cell>
            </group>
            <p class="at-table" v-if="checkObj.checkCurData.length>0">无主叫坐席共{{atTable.total}}个，已用{{atTable.has}}个，空闲{{atTable.free}}个</p>
            <group class="form-has group-mt0" v-if="checkObj.checkCurData.length>0">
                <cell  :value="customerObj.name?customerObj.name:'请选择客户（必选）'" is-link @click.native="singHand" value-align="left" :class="{'has': customerObj.name}">
                    <span slot="title" class="wh5">选择客户：</span>
                </cell>
            </group>
            <FormA :moduleObj="moduleObj"/>
        </div>
        <div v-show="!signFlag"><x-button type="primary" @click.native="primaryHand"  :show-loading='showLoading'>立即保存</x-button></div>
        <div v-transfer-dom>
            <!-- 了解更多 -->
            <popup v-show="timingMoreFlag" position="right" width='100%'>
                <MarkMore type="4"/>
            </popup>
            <!-- 分组 -->
            <popup v-model="checkObj.checkFlag" width='100%' should-rerender-on-show  position="right">
                <checkAll :checkObj="checkObj"  v-if="checkObj.checkFlag" @toggle="togglePop"/>
            </popup>
            <popup v-model="wordsAboveFlag" width='100%' should-rerender-on-show  position="right">
                <wordsAbove v-if="wordsAboveFlag" :wordsObj="wordsObj"  @toggle="toggleWordsHand"/>
            </popup>
        </div>
        <SignCustom 
                @toggleSignCustom="toggleSignCustom" 
                :propsJudge="judgeFlag" 
                @choiseFlag="choiseFlag"
                v-if="signFlag"  
                ref="aiSignCustom"           
            />
    </div>
</template>
<script>
import { Cell,Group,XButton, TransferDom ,XInput,XSwitch,Datetime,Popup,PopupPicker,trim,XTextarea } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex';
import MarkMore from '@/components/mark';
import {wayDate} from '@/constants/way';
import FormA from '@/components/formA';
import checkAll from '@/components/checkAll';
import SignCustom from '@/pages/customs/tool/sign/signCustom';
import wordsAbove from '@/pages/customs/tool/AI/wordsAbove';
import {checkEmojiRn,currentDate} from '@/util/index';

let taskTimer; 

export default {
    name: 'AI',
    data() {
        return {   
             companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            judgeFlag:{
                isGroup:false,//子组件中分组客户开关
                isLabels:false,//子组件中标签客户开关
                isShare:false,//子组件中分享客户开关
                isLabel:false,//子组件中标签开关
                isSearch:false,//子组件中搜索客户开关
            },
            taskName:'',//任务名称
            //定时开启
            timingFlag:false,//
            timingMoreFlag:false,//了解更多 
            timingDate:'',
            timingStartDate:'',
            timingPeriodStart:'',
            timingPeriodEnd:'',  
            //不打电话
            callFlag:false,
            callPeriodStart:'',
            callPeriodEnd:'',
            minhour:9,
            maxhour:19,

            techniqueValue: '',

            smsFlag:false,
           

            callNumberValue:'',
            callNumberFlag:false,
            moduleObj:{
               placeholder:'最多填写500个字,语音录入可自动转换文字和保存录音',
               title:'任务描述：',
               max:500,
               inputVal:'',
               uploadData:[],    
               record:true,  
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 14,         
            },
            //外呼方式
            wayVal:[],
            wayVal2:[],
            wayDate:[],
            shadowVal:[],
            wayColumns:1,
            //外呼号码列表
            checkObj: {
                urlName:'callNumber',
                checkCur:[],                
                checkCurData:[],
                checkCurName:'',
                checkFlag:false,
                allListFlag:false,     
                phoneType:'2',          
            },
            atTable:{
                total:33,
                free:22,
                has:22,
            },
            atTableVal:'',
            //选择客户
            judgeFlag:{
                isGroup:false,//子组件中分组客户开关
                isLabels:false,//子组件中标签客户开关
                isShare:false,//子组件中分享客户开关
                isLabel:false,//子组件中标签开关
                isSearch:false,//子组件中搜索客户开关
            },
            signFlag:false,
            customerObj:{
                data:[],
                name:'',
                id:'',
            },
             // ai话术
            wordsAboveFlag:false,  
            wordsName:'',
            wordsId:'',
            wordsObj:{
                curData:[],
                
            },
            wordsAboveObj:{},

            atHandFlag:false,
            showLoading:false,
            showPopupPicker:false,

            inputFlag:false,
            
        }
    },
    directives: {
        TransferDom
    },
    created() {
       
        this.timingStartDate=currentDate();
        let obj={
            company_id:this.companyId,
        }
        this.outboundWayHand(obj);
        this.ResultChoice([])
    },
     watch: {  
         //发布
         addAiTaskData(data){  
            if( Object.keys(data).length >0 ){  
                 this.showLoading=false;
                let text;
                if(data.alert_msg){
                    text=data.alert_msg;
                }else{      
                    text ='保存成功';
                    this.$router.go(-1) 
                }
                this.$vux.toast.show({
                    text:text,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                }) 
            }
         },   
         //外呼方式
         outboundWayData(data){  
            if( Object.keys(data).length >0 ){ 
                if(data.alert_msg){
                   this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{      
                    let wayDate=[];
                    data.items.forEach((item,index)=>{
                        let obj={
                            name:item.phoneTypeName+'('+item.callPhoneCount+')',
                            value:index.toString(),
                        }                        
                        wayDate.push(obj);
                    })
                    this.wayVal=['0'];    
                    this.wayVal2=['0'];   
                    this.shadowVal=['0'];
                    this.wayDate=wayDate; 
                                        
                    
                }
                
            }
         },   

         
     },
     computed: {
        ...mapState({
            addAiTaskData: state => state.ai.addAiTaskData,     
            outboundWayData: state => state.ai.outboundWayData,       
            resultChoice:state=>state.user.resultChoice
        })       
    },
     methods: {
         ...mapActions({
            addAiTaskHand:'ai/addAiTaskHand',  
            outboundWayHand:'ai/outboundWayHand',  
                      
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
            ResultChoice:'user/RESULTCHOICE'
        }),
        //任务名称
        NameHand(val){       
            if(!this.atHandFlag){
                let text =checkEmojiRn(val)
                this.$nextTick(()=>{
                    this.taskName=text
                })
            }  
           
        },
        //了解更多
        MoreHand(e){
            if(e.target.nodeName=='A'&& !this.atHandFlag){                  
                clearTimeout(taskTimer);
                taskTimer = setTimeout(() => {
                   this.timingMoreFlag=true; 
                },200);            
            }            
        },

        //启动时段
        timingStartOn(value){
          let start= Number(value.replace(/:/g,''));
          let end =this.timingPeriodEnd? Number( this.timingPeriodEnd.replace(/:/g,'')):'';
          if(end && start>=end && end>0 && value){
               setTimeout(() => {
                        this.timingPeriodStart='';
                    },500)
               this.$vux.toast.show({
                    text: '开始时段必须小于结束时段',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return false
          }
        },
        timingEndOn(value){
          let end= Number(value.replace(/:/g,''));
          let start =this.timingPeriodStart? Number( this.timingPeriodStart.replace(/:/g,'')):'';
          if(start && start>=end && end>0 && value){
               setTimeout(() => {
                        this.timingPeriodEnd='';
                    },500)
              
               this.$vux.toast.show({
                    text: '开始时段必须小于结束时段',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return false
          }     
        },
        //不打电话时段
        callStartOn(value){
          let start= Number(value.replace(/:/g,''));
          let end =this.callPeriodEnd? Number( this.callPeriodEnd.replace(/:/g,'')):'';          
          if(end && start>=end && value){
               setTimeout(() => {
                        this.callPeriodStart='';
                    },500)
               this.$vux.toast.show({
                    text: '开始时段必须小于结束时段',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return false
          }

        },
        callEndOn(value){       

          let end= Number(value.replace(/:/g,''));
          let start =this.callPeriodStart? Number( this.callPeriodStart.replace(/:/g,'')):'';
          if(start && start>=end &&　value){
               setTimeout(() => {
                        this.callPeriodEnd='';
                    },10)
              
               this.$vux.toast.show({
                    text: '开始时段必须小于结束时段',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                 return false
          }

        },  
       
        // 回调
        togglePop(obj) {            
            this.atTable=obj;
        },
        //坐席
        atHandBlur(val){
            
            if(val.length==0){
                this.$vux.toast.show({
                    text: '坐席数量未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                clearTimeout(taskTimer);
                taskTimer = setTimeout(() => {
                    this.atHandFlag=false;
                },1000);  
                return
            }else if(val>this.atTable.total){
                this.$vux.toast.show({
                    text: '数字不能大于总坐席数',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                this.inputFlag=true;
                this.$nextTick(function(){
                    this.atTableVal='';
                    
                })
                clearTimeout(taskTimer);
                taskTimer = setTimeout(() => {
                    this.atHandFlag=false;
                    this.inputFlag=false;
                },1000);
                return
            }else{
               this.atHandFlag=false;
            }
           

        },
        //坐席
        atHandChange(value){
            if(!value){
                return
            }
            if(value.length>0){
                let text;
                    if(value.length==1){
                        text = value.replace(/[^1-9]/g,''); 
                    }else{
                        text = value.replace(/[^0-9]/g,''); 
                    }          
                this.$nextTick(()=>{
                    this.atTableVal=text
                })
                this.atHandFlag=true;

            }
        },
        atOnFocus(){
            this.inputFlag=false;
            // this.atHandFlag=true;
        },
        wordsAboveHand(){
            if(!this.atHandFlag){
                clearTimeout(taskTimer);
                taskTimer = setTimeout(() => {
                     this.wordsAboveFlag=true;
                },200);
                
            }
        },
        checkHand(){
            if(!this.atHandFlag){
                let index=this.wayVal.join(',');
                let phoneType=this.outboundWayData.items[index].phoneType
                this.checkObj.phoneType=phoneType;
                this.checkObj.checkFlag=true;
            }
        },
        singHand(){
            if(!this.atHandFlag){              
                clearTimeout(taskTimer);
                taskTimer = setTimeout(() => {
                     this.signFlag=true
                },200);
            }
        },
        //选择客户
        toggleSignCustom(data){
            this.signFlag=!this.signFlag;
            document.title="添加任务"
            if(data.length>0){
                this.ResultChoice(data)
                let name=[];
                let id=[];
                data.forEach((item,index) => {
                    name.push(item.customer_name);
                    id.push(item.customer_id);
                });
                this.customerObj={
                    data,
                    name:name.join(','),
                    id:id.join(','),
                }
            }else{
                this.ResultChoice([])
                this.customerObj={
                    data:[],
                    name:'',
                    id:'',
                }
            }
        },
        choiseFlag(data){
            this.judgeFlag[data.name]=data.value
        },
        
        //话述
        toggleWordsHand(obj){       
            this.wordsAboveFlag=false;
            this.wordsObj.curData=obj.wordsCurData;
            this.wordsName=obj.wordsName.join(',');
            this.wordsId=obj.wordsId.join(',');    
            
        },
        //保存
        primaryHand(){

            let taskName=trim(this.taskName)
            if(taskName.length==0){
                this.$vux.toast.show({
                    text: '任务名称未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            };
            if(this.timingFlag){
                if(this.timingDate.length==0){
                    this.$vux.toast.show({
                        text: '启动日期未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return
                };
                if(this.timingPeriodStart.length==0){
                    this.$vux.toast.show({
                        text: '启动开始时段未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return
                };
                if(this.timingPeriodEnd.length==0){
                    this.$vux.toast.show({
                        text: '启动结束时段未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return
                };
            };
            if(this.callFlag){
                if(this.callPeriodStart.length==0){
                    this.$vux.toast.show({
                        text: '不拨打开始时段未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return
                };
                if(this.callPeriodEnd.length==0){
                    this.$vux.toast.show({
                        text: '不拨打结束时段未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return
                };
            };
             if(this.callFlag && this.timingFlag){
                let timingStart =Number( this.timingPeriodStart.replace(/:/g,''));
                let timingEnd = Number( this.timingPeriodEnd.replace(/:/g,''));
                let callStart =Number( this.callPeriodStart.replace(/:/g,''));
                let callEnd =Number( this.callPeriodEnd.replace(/:/g,''));
                if(timingStart>=callStart){
                    this.$vux.toast.show({
                        text: '不拨打时间必须在启动时段范围内',
                        type: 'text',
                        position: 'top',
                        width:'22em'
                    })
                    this.callPeriodStart='';
                    return
                }
                if(timingEnd<=callEnd){
                    this.$vux.toast.show({
                        text: '不拨打时间必须在启动时段范围内',
                        type: 'text',
                        position: 'top',
                        width:'22em'
                    })
                    this.callPeriodEnd='';
                    return

                }
            };
            if(this.wordsName.length==0){
                this.$vux.toast.show({
                    text: 'AI话术未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            };
            if(this.checkObj.checkCurData.length==0){
                this.$vux.toast.show({
                    text: '外呼号码未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            };
            if(this.atTableVal.length==0){
                this.$vux.toast.show({
                    text: '坐席个数未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            };
            if(this.customerObj.name.length==0){
                this.$vux.toast.show({
                    text: '客户未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            };
            let customers=[];
                this.customerObj.data.forEach((item)=>{
                    let obj2={
                        customerId:item.customer_id,
                        customerName:item.customer_name,
                        customerTelephone:item.mobile,
                    }
                    customers.push(obj2)
                })
               
            //图片数据重组            
                let fileData = [];
                this.moduleObj.uploadData.forEach((item,i) => {  
                    let objArr={origin_name:item.name,data:item.src}
                    fileData.push(objArr);
                });
            let obj={
                company_id:this.companyId,
                user_id:this.userId,
                user_type:'0',
                task_name:taskName,
                task_type:this.timingFlag?'1':'2',
                break_type:this.callFlag?'1':'0',
                robot_def_id:this.wordsId,
                call_type:this.outboundWayData.items[this.wayVal.join(',')].phoneType,
                concurrency_quota:this.atTableVal,
                req_source:'6',
                remark:this.moduleObj.inputVal,
                call_phone_ids: JSON.stringify(this.checkObj.checkCur),
                customers:JSON.stringify(customers),
                upfile_base64:JSON.stringify(fileData) 
            }
                if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                    obj.audio_attach_id = this.moduleObj.recordObj.id
                }
                //定时 任务类型
                if(this.timingFlag){
                    obj.task_start_date=this.timingDate;
                    obj.working_start_time_str=this.timingPeriodStart;
                    obj.working_end_time_str=this.timingPeriodEnd;
                }
                //是否设置不拨打时段 
                if(this.callFlag){
                    obj.break_start_time_str=this.callPeriodStart;
                    obj.break_end_time_str=this.callPeriodEnd;
                }
                if(!this.showLoading){
                    this.showLoading=true;
                    this.addAiTaskHand(obj);
                }
            
        },
        onHide(type){
            let cont=this.outboundWayData.items[this.shadowVal.join(',')].callPhoneCount;
            if(cont=='0' && type){
                this.showPopupPicker=true;
                setTimeout(()=>{
                     this.wayVal=this.wayVal2;  
                },10)
                this.$vux.toast.show({
                        text:'不能选择为空的外呼方式',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                return ;
            }
        },
       
        shadowCHange(val){
            this.shadowVal=val;
        }
    },
     beforeRouteLeave (to, from, next) {
         if(this.wordsAboveFlag){           
            this.wordsAboveFlag=false;
            next(false);
         }else if(this.judgeFlag.isShare||this.judgeFlag.isSearch||this.judgeFlag.isLabel||this.judgeFlag.isLabels||this.judgeFlag.isGroup ){
            this.$refs.aiSignCustom.onFetching = false;
            this.$refs.aiSignCustom.height='-114'
            this.$refs.aiSignCustom.onFetching = false
            this.$refs.aiSignCustom.isShare=false
            this.$refs.aiSignCustom.isgroup=false
            this.$refs.aiSignCustom.isLabels=false
            this.$refs.aiSignCustom.mylabels=false
            this.$refs.aiSignCustom.isSearch=false         
            this.judgeFlag={
                isGroup:false,
                isLabels:false,
                isShareForMe:false,
                isCurrentLabel:false,
                isSearch:false,
            }
            next(false);
        }else if(this.signFlag ||this.timingMoreFlag || this.checkObj.checkFlag ){
             this.timingMoreFlag=false
            this.checkObj.checkFlag=false;
            this.signFlag=false;
            document.title='添加任务';
            next(false);
        }else{
            next()
        }
    },

    components: {
        Cell,Group,XButton ,XInput,XSwitch,Datetime,MarkMore,Popup,PopupPicker,FormA,checkAll,SignCustom,wordsAbove,XTextarea
    },
}
</script>
<style lang="less">
 @import './index.less';
</style>