<template>
    <div  class="router-all">   
        <tab v-model="tabNum" prevent-default @on-before-index-change="tabHand">
            <tab-item selected>全部</tab-item>
            <tab-item>已读</tab-item>
            <tab-item>未读</tab-item>
            <tab-item>统计</tab-item>
        </tab>
        <div  class="router-box">
            <AiList :aiObj="aiObj" v-if="tabNum<3" />
            <AiStatistical :statisticalObj="statisticalObj" v-else />
            <div v-transfer-dom>
                <confirm
                v-model="btnModel"
                :close-on-confirm="false"
                title="提示"
                @on-confirm="onConfirm4">
                    <p style="text-align:center;">是否确定删除任务</p>
                </confirm>
                <popup-picker @on-change="addTaskHand"  :show.sync="showPopupPicker" :show-cell="false" :data="wayDate" v-model="wayVal"  show-name :columns="1" /> 
            </div>
        </div>
         <div class="buttn-more"  v-if="linkType==0 "><x-button type="primary" @click.native="showPopupPicker = true">添加新任务（{{wayDate.length}}）</x-button><x-button type="primary" @click.native="taskHand" >删除任务</x-button></div>
    </div>
</template>
<script>
import { mapState,mapActions,mapMutations } from 'vuex';
import {XButton,TransferDom,Confirm,PopupPicker,Tab, TabItem } from 'vux';
import AiStatistical from '@/pages/customs/tool/AI/aiStatistical';
import AiList from '@/pages/customs/tool/AI/aiList';
export default {
    name: 'aiComplete',
    data() {
        return {   
            aiObj:{
                type: 4,
                aiVoiceFlag:false,
            },
            tabNum: 0,
            statisticalObj:{
                
            },

            linkType:this.$route.query.linkType || '0',
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,
            showPopupPicker:false,
            wayVal:[],
            wayDate:[],
            btnModel:false,
        }
    },
   created() {
       let tabNum=Number(localStorage.getItem("tabNum") ) ;     
       this.tabNum=tabNum; 
       if(tabNum!=3){
            this.aiObj.type= tabNum ? tabNum==1? '5': tabNum==2? '6':'4' : '4' ;
       }      
    },
    mounted(){
         //按钮
       if(this.$route.query.linkType==0){
            //添加任务列表
            let obj={
                company_id:this.companyId,
                user_id:this.userId,
            }
            this.queryNameListHand(obj);
       }
    },
    directives: {
        TransferDom
    },
     computed: {
        ...mapState({
            delTaskData: state => state.ai.delTaskData,  
            queryNameListData: state => state.ai.queryNameListData,   
            addCustomerData: state => state.ai.addCustomerData,             
        })       
    },
      watch: {  
          //删除任务
         delTaskData(data){  
            if( Object.keys(data).length >0 ){                 
                let text;
                if(data.alert_msg){
                    text=data.alert_msg;
                    setTimeout(() => {
                        this.loadingHand(false)
                    },1200)
                }else{  
                    this.loadingHand(false)    
                    text ='删除任务成功';
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
          //查询全量的任务名称
         queryNameListData(data){  
            if( Object.keys(data).length >0  && this.$route.name=='aiComplete'){ 
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
            if( Object.keys(data).length >0  && this.$route.name=='aiComplete'){  
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
            delTaskHand:'ai/delTaskHand',      
            queryNameListHand:'ai/queryNameListHand',    
            addCustomerHand:'ai/addCustomerHand',  
        }),
         ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
        }),
        tabHand (type) {
            this.tabNum=type;
             if(type<3){
                this.aiObj.type=type==0?'4':type==1?'5':'6';               
            }
            localStorage.setItem("tabNum",type)
        },
        taskHand(){
            this.btnModel = true;           
        },
        //任务删除 type  
        onConfirm4 () {
            let obj={
                req_source:'6',
                user_id:this.userId,
                task_id:this.$route.query.id,
            }
            this.loadingHand(true);
            this.delTaskHand(obj); 
        },
        //任务
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
        XButton,Confirm,PopupPicker,Tab, TabItem 
    },
}
</script>