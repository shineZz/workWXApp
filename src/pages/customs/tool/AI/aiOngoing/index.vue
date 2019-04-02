<template>
    <div class="router-all">
        <tab v-model="tabNum" prevent-default @on-before-index-change="tabHand">
            <tab-item :selected="tabNum === 0">进行中</tab-item>
            <tab-item :selected="tabNum === 1">已完成</tab-item>
            <tab-item :selected="tabNum === 2">统计</tab-item>
        </tab>
        <div  class="router-box">
            <AiList :aiObj="aiObj" ref="aiView" v-if="tabNum<2" />
            <AiStatistical :statisticalObj="statisticalObj" v-else />
            <div v-transfer-dom>
                <confirm
                v-model="btnModel"
                :close-on-confirm="false"
                title="提示"
                @on-confirm="onConfirm4">
                    <p style="text-align:center;">是否确定{{taskBtnFlag?'暂停任务':'开启任务'}}</p>
                </confirm>
                <popup-picker @on-change="addTaskHand"  :show.sync="showPopupPicker" :show-cell="false" :data="wayDate" v-model="wayVal"  show-name :columns="1" /> 
            </div>
        </div>
        <div v-if="linkType==0" :class="{'buttn-more':taskBtnType<2}" ><x-button type="primary" @click.native="showPopupPicker = true">添加新任务（{{wayDate.length}}）</x-button><x-button v-if="taskBtnType<2 " :disabled="taskDed" type="primary" @click.native="taskHand" >{{taskBtnFlag?'暂停任务':'开启任务'}}</x-button></div>
    </div>
</template>
<script>
import { mapState,mapActions,mapMutations } from 'vuex';
import {XButton,TransferDom,Confirm,PopupPicker,Tab, TabItem} from 'vux';
import AiStatistical from '@/pages/customs/tool/AI/aiStatistical';

import AiList from '@/pages/customs/tool/AI/aiList';
export default {
    name: 'aiOngoing',
    data() {
        return {  
            aiObj:{
                type: 2,
                aiVoiceFlag:false
            },
            tabNum: 0,
            statisticalObj:{
                
            },
            showPopupPicker:false,
            wayVal:[],
            wayDate:[],
            taskBtnType: '2' ,
            taskBtnFlag: true,//按钮状态
            linkType:this.$route.query.linkType,
            btnModel:false,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            taskDed:true,
        }
    },
    directives: {
        TransferDom
    },
    created() {
        //超出时间按钮不操作
        var date = new Date();
        if(date.getHours()>8 && date.getHours()<20){
           this.taskDed=false;
        }
       let tabNum=Number(localStorage.getItem("tabNum") ) ;   
       this.tabNum=tabNum; 
       if(tabNum!=2){
            this.aiObj.type=   tabNum ? tabNum==1? '3': '2' : '2' ;            
       }
       //按钮 
       if(this.$route.query.linkType==0){
           let taskBtnType=  localStorage.getItem("taskBtnType") || '2';
            this.taskBtnType=taskBtnType;            
            // if(taskBtnType!=2){
                //添加任务列表
                this.taskBtnFlag= localStorage.getItem("taskBtnType")? localStorage.getItem("taskBtnType")=='0'?true:false: true;
                let obj={
                    company_id:this.companyId,
                    user_id:this.userId,
                }
                this.queryNameListHand(obj);
            // }
       }
        
    },
     computed: {
        ...mapState({
            startTaskData: state => state.ai.startTaskData,      
            pauseTaskData: state => state.ai.pauseTaskData, 
            queryNameListData: state => state.ai.queryNameListData,   
            addCustomerData: state => state.ai.addCustomerData,             
        })       
    },
      watch: {  
          //启动任务
         startTaskData(data){  
            if( Object.keys(data).length >0 ){  
                setTimeout(() => {
                    this.loadingHand(false)
                },1200)
                let text;
                if(data.alert_msg){
                    text=data.alert_msg;
                }else{      
                    text ='开启任务成功';
                    this.taskBtnFlag= true;
                    localStorage.setItem("taskBtnType",'0');
                     setTimeout(() => {
                        this.btnModel = false;
                    },1000)
                    if(this.tabNum!=2){
                        setTimeout(() => {
                            this.$refs.aiView.aiViewHand()
                        },1300)
                    }                    
                }
                this.$vux.toast.show({
                    text:text,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                }) 
                
            }
         },   
          //暂停任务
         pauseTaskData(data){  
            if( Object.keys(data).length >0 ){  
                 setTimeout(() => {
                    this.loadingHand(false)
                },1200)
                let text;
                if(data.alert_msg){
                    text=data.alert_msg;
                }else{      
                    text ='暂停任务成功';
                    this.taskBtnFlag= false;
                    localStorage.setItem("taskBtnType",'1');
                    setTimeout(() => {
                        this.btnModel = false;
                    },1000)
                    if(this.tabNum!=2){
                        setTimeout(() => {
                            this.$refs.aiView.aiViewHand()
                        },1300)
                    }
                }
                this.$vux.toast.show({
                    text:text,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                }) 
            }
         },  
          //查询全量的任务名称
         queryNameListData(data){  
            if( Object.keys(data).length >0  && this.$route.name=='aiOngoing'){ 
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{      
                    let Arr=[];
                    data.items.forEach((item,index)=>{
                        let obj={
                            name: item.taskName,
                            value: item.taskId,                            
                        }
                        Arr.push(obj);
                    });
                    this.wayDate=Arr;
                    
                }
                 
            }
         },  
          //添加通话记录到新的任务
         addCustomerData(data){  
            if( Object.keys(data).length >0  && this.$route.name=='aiOngoing'){  
                let text;
                if(data.alert_msg){
                    text=data.alert_msg;
                }else{      
                    text ='添加新任务成功';
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


         
         
     },
     methods: {
        ...mapActions({
            startTaskHand:'ai/startTaskHand',   
            pauseTaskHand:'ai/pauseTaskHand',     
            queryNameListHand:'ai/queryNameListHand',    
            addCustomerHand:'ai/addCustomerHand',  
        }),
         ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
        }),
        tabHand(type){
            this.tabNum=Number(type);
            if(type<2){
                this.aiObj.type=type==0?'2':'3';               
            }
             localStorage.setItem("tabNum",type)
            
        },  
        taskHand(){
            this.btnModel = true;           
        },
        //任务开启跟停止 type 
        onConfirm4 () {
            let obj={
                req_source:'6',
                user_id:this.userId,
                task_id:this.$route.query.id,
            }
            this.loadingHand(true);
            if(!this.taskBtnFlag){
                this.startTaskHand(obj);                    
            }else{
                this.pauseTaskHand(obj);                    
            }
        },
        //添加新任务
        addTaskHand(value){
            let obj={
                old_task_id:this.$route.query.id,
                new_task_id:value.join(','),
            }
            this.addCustomerHand(obj)
        }  
        
    },
     beforeRouteLeave (to, from, next) {
         if(this.aiObj.aiVoiceFlag){
            this.aiObj.aiVoiceFlag=false;
            next(false)
        }else{
            next()
        }
    },
    components: {

       AiStatistical,
        AiList,
        XButton,
        Confirm,PopupPicker,Tab, TabItem
    },
}
</script>