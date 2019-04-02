<template>
    <div class="router-all"> 
            <div v-show="!isAddressBook" class="router-box">
                <group v-if="query==0 || query==3">
                        <x-input 
                            v-model="approvalVal1" 
                            :title="approvalTitle1" 
                            placeholder-align="right" 
                            text-align="right" 
                            placeholder="(必填)" 
                            :max="20"
                            :show-clear="false"
                        ></x-input>
                        <x-input :show-clear="false" :title="approvalTitle2" @on-blur="approvalBlur(2)" v-model="approvalVal2" placeholder-align="right" type="number" text-align="right"  placeholder="(必填)"></x-input>                        
                </group>
                <div v-else>
                    <group v-if="query==1">
                        <popup-picker :title="approvalTitle7" :data="leaveTypeData" v-model="leaveType" text-align="right" show-name :columns="1"  placeholder="(必选)"></popup-picker>                    
                    </group>
                    <group >
                        <x-input  v-if="query==2"
                            v-model="approvalVal1" 
                            :title="approvalTitle1" 
                            placeholder-align="right" 
                            text-align="right" 
                            placeholder="(必填)" 
                            :max="30"
                            :show-clear="false"
                        ></x-input>
                        <datetime
                            v-model="startTime"
                            :title="approvalTitle3"
                            format="YYYY-MM-DD HH:mm"
                            @on-change="startChange"
                            placeholder="(必选)" 

                        />
                        <datetime
                            v-model="endTime"
                            :title="approvalTitle4"
                            format="YYYY-MM-DD HH:mm"
                            @on-change="endChange"
                             placeholder="(必选)"
                            />
                    </group>
                    <group>
                        <popup-picker :title="approvalTitle5" :data="timeDate" v-model="timeVal" text-align="right" show-name :columns="1" ></popup-picker>
                        <x-input :show-clear="false" :title="approvalTitle6" @on-blur="approvalBlur(6)" v-model="timeNum" placeholder-align="right" type="number" text-align="right" placeholder="（必填）"></x-input>                        
                    </group>
                </div>
                <FormA :moduleObj="moduleObj" ></FormA>
                <Addstaff @toggleAddress="toggleAddress" :ifView="ifView">审批人</Addstaff>
               
            </div>
            <div v-show="!isAddressBook"><x-button  type="primary" @click.native="submitHand" :show-loading='showLoading'>提交</x-button></div>
        <AddressBook @toggleAddress="toggleAddress" v-show="isAddressBook" :state1='1' :state2='1' :state3='0' :state4='0' :state5='1'/>
    </div>
</template>

<script>
import {  XButton,  Group,PopupPicker,XInput ,Datetime  } from 'vux';
import { mapState, mapActions,mapMutations } from 'vuex';
import FormA from '@/components/formA';
import Addstaff from '@/components/addStaff';
import AddressBook from '@/components/addressBook';
import {leaveData,timeDate} from '@/constants/approval';
import {XSAPI_URL,API_PARM_OBJ,LG_AES_XSAPI,LG_AES_SALT ,} from '@/constants/interface';
import * as aes from '@/util/lgaes';
import lrz from 'lrz';
import axios from 'axios';
export default {
    name: 'evection',
    data() {
        return {
           query:0,
           ifView:false  ,
           companyId:this.$store.state.userInfo.company.companyId,   
           userId:this.$store.state.userInfo.user.userId,
           busiType:'2',
           //插件倒入
           moduleObj:{
               placeholder:'输入文字不得超过500字(必填)' ,
               title:'',
               max:500,
               inputVal:'',
               uploadData:[],               
           },
           //时间限制
           timeDate:timeDate,
           timeVal:['1'],
           startTime:"",
           endTime:"",
           timeNum:'',
           //输入
           approvalVal1:'',
           approvalTitle1:'',
           approvalVal2:'',
           approvalTitle2:'',
           approvalVal3:'',
           approvalTitle3:'',
           approvalVal4:'',
           approvalTitle4:'',
           approvalTitle5:'时长类型',
           approvalTitle6:'',
           approvalTitle7:'请假类型',
           leaveTypeData:leaveData,
           leaveType:[],
           isAddressBook:false,
           showLoading:false,
           
        }
    },
    created() {
         this.query=this.$route.query.state;
        
        if(this.query==0){
            document.title="我的报销";
            this.moduleObj.title='报销明细';
            this.approvalTitle1='报销类型';
            this.approvalTitle2='报销金额';
            this.busiType='2';
            
        }else if(this.query==1){
            document.title="我的请假";
            this.moduleObj.title='请假事由';
            this.approvalTitle3='起始时间';
            this.approvalTitle4='终止时间';
            this.approvalTitle6='请假时长';  
            this.busiType='3';         
            
        }else if(this.query==2){
            document.title="我的出差";
            this.moduleObj.title='出差事由';
            this.approvalTitle1='出差地点';
            this.approvalTitle3='出发时间';
            this.approvalTitle4='返回时间'; 
            this.approvalTitle6='出差时长';
            this.busiType='4';
            
        }else if(this.query==3){
            document.title="我的费用";
            this.moduleObj.title='费用明细';
            this.approvalTitle1='费用类型';
            this.approvalTitle2='申请金额';
            this.busiType='1';
            
        }else if(this.query==4){
            document.title="我的加班";
            this.moduleObj.title='加班事由';
            this.approvalTitle3='起始时间';
            this.approvalTitle4='终止时间';
            this.approvalTitle6='加班时长';  
            this.busiType='5';      
            
        }
        
    },
    mounted() {
        let obj={
          busiType:this.busiType,
          userId:this.userId,
          companyId:this.companyId,
        }
        this.queryApprovalhand(obj)
    },
    computed: {
        ...mapState({
           selectedMember: state => state.addressBook.selectedMember,
           queryApprovalData: state => state.oaprocess.queryApprovalData,

           addApprovalData: state => state.oaprocess.addApprovalData,
        })
    },
    methods: {
        ...mapMutations({
            selectedMemberHand: 'addressBook/SELECTED_MEMBER',           
            loadingHand: 'UPDATE_LOADING',
        }),
         ...mapActions({
            queryApprovalhand:'oaprocess/queryApproval',
            addApprovalhand:'oaprocess/addApproval',
        }),
        toggleAddress(){
            this.isAddressBook=!this.isAddressBook
        },
        //提交
        submitHand(){
            let obj={
                userId:this.userId,
                companyId:this.companyId,
                busiType: this.busiType,
                status:'2',
            }
            let content= $.trim(this.moduleObj.inputVal)
            let formInfo={
                content,
            };
            if(this.query==0 || this.query==3){
                let approvalVal1 = $.trim(this.approvalVal1);
                if(approvalVal1.length==0){
                    this.$vux.toast.show({
                        text: '请输入'+this.approvalTitle1,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.approvalVal1=''
                    return ;
                }
                if(this.approvalVal2.length==0){
                    this.$vux.toast.show({
                        text: '请输入'+this.approvalTitle2,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.approvalVal2=0
                    return ;
                }else if(this.approvalVal2==0){
                    this.$vux.toast.show({
                        text: this.approvalTitle2+'不能为0',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return ;
                }else if(Number(this.approvalVal2) >1000000000){
                    this.$vux.toast.show({
                        text: '不能超过10位数',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.approvalVal2=0
                    return ;
                }
                if(this.query==3){
                    formInfo.costType=approvalVal1;                   
                }else{
                    formInfo.reimbursementType=approvalVal1;      
                }
                 formInfo.money=this.approvalVal2.toString();
            }else{
                if(this.query==1 ){
                    if(this.leaveType.length==0){
                        this.$vux.toast.show({
                            text: '请选择'+this.approvalTitle7,
                            type: 'text',
                            position: 'top',
                            width:'20em'
                        })
                        return ;
                    }else{
                        formInfo.leaveType=this.leaveType[0];
                    }                                        
                }
                if(this.query==2){
                    let approvalVal1 = $.trim(this.approvalVal1);
                    if(approvalVal1.length==0){
                        this.$vux.toast.show({
                            text: '请输入'+this.approvalTitle1,
                            type: 'text',
                            position: 'top',
                            width:'20em'
                        })
                        this.approvalVal1=''
                        return ;
                    }else{                        
                        formInfo.address=this.approvalVal1;
                    }

                }
                if(this.startTime.length==0){
                    this.$vux.toast.show({
                        text: '请选择'+this.approvalTitle3,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return;
                }
                
                if(this.endTime.length==0){
                    this.$vux.toast.show({
                        text: '请选择'+this.approvalTitle4,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return;
                }
                
                formInfo.beginDate=this.startTime;
                formInfo.endDate=this.endTime;
                if(this.timeNum.length==0){
                    this.$vux.toast.show({
                        text: '请输入'+this.approvalTitle6,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return;
                }else if(this.timeNum > 999 && this.timeVal[0]!=1){
                    //最大加班时长
                    this.$vux.toast.show({
                        text: '不能超过999小时',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.timeNum=999;
                    return;

                }else if(this.timeNum > 366 && this.timeVal[0]==1){
                    //最大加班时长
                    this.$vux.toast.show({
                        text: '不能超过365天',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.timeNum=365;
                    return;

                }
                formInfo.duration=this.timeNum.toString();
                formInfo.durationType=this.timeVal[0];
            }
            if(content.length==0){
                    this.$vux.toast.show({
                        text: '请输入'+this.moduleObj.title,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return ;
                }
            //审批人
            if(this.selectedMember.length==0){
                this.$vux.toast.show({
                    text: '请选择审批人',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            let processNodes={};
            this.selectedMember.forEach(function(al,index){
                var keys = index+1
                processNodes['node'+keys]={nodeHandlerPerson:al.userId}

            })
             //图片数据重组            
            let fileData = [];
            this.moduleObj.uploadData.forEach((item,i) => {  
                   let objArr={origin_name:item.name,data:item.src}
                   fileData.push(objArr);
            });
            if(!this.showLoading){
                this.showLoading=true;
                 obj.formInfo=JSON.stringify(formInfo);
                obj.processNodes=JSON.stringify(processNodes);
                if(fileData.length>0){
                     obj.fileData=JSON.stringify(fileData) ;
                }
                this.addApprovalhand(obj);
                

            }
           
            

            
        },
        //时间限制
        startChange(value) {
            let endTime=this.endTime
            if(endTime.length>0){                
                endTime=endTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let startTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(startTime>=endTime){
                   this.$vux.toast.show({
                        text:this.approvalTitle3+'不能大于等于'+this.approvalTitle4,
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    }) 
                    setTimeout(() => {
                        this.startTime='';
                    },500)
                    
                }
            }
        },
        endChange(value){
            let startTime=this.startTime
            if(startTime.length>0){                
                startTime=startTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let endTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(endTime<=startTime){
                   this.$vux.toast.show({
                        text:this.approvalTitle3+'不能大于等于'+this.approvalTitle4,
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    }) 
                    setTimeout(() => {
                        this.endTime='';
                    },500)
                }
            }
        },
        approvalBlur(num){
            
            let text=  num==2?this['approvalVal'+num]:this.timeNum;
            if(/^[0-9]\d*\,\d*|[0-9]\d*$/.test(text)){
                if(num==2 && !(/^\d+(\.\d{1,2})?$/.test(text))){
                    this['approvalVal'+num]= Math.floor(Number(text) * 100) / 100
                }else if(num==6){
                    this.timeNum= Math.floor(Number(text) * 10) / 10
                }
            }else{
                let text;                 
                if(num==2){
                    this['approvalVal'+num]=0;
                    text=this.approvalTitle2;
                }else{
                    this.timeNum=0;
                    text=this.approvalTitle6;
                }
                this.$vux.toast.show({
                    text: text+'输入错误',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                
            }
            
        }
    },
    watch: {
        //查看人
        queryApprovalData:function(data){
            if( Object.keys(data).length >0){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{
                   let Arr=[];
                   data.items.forEach(item => {
                       let obj={
                            headPortrait:item.headLogo,
                            userId:item.userId,
                            userName:item.truename,
                        }
                        Arr.push(obj)                       
                   });                 
                   this.selectedMemberHand(Arr)
                }
            }
        }, 
        addApprovalData(data){ 
            this.showLoading=false; 
             let text;  
             if(data.alert_msg){
                text=data.alert_msg;
            }else{ 
                text= '提交成功' ;
                 this.$router.go(-1)   
            }
            this.$vux.toast.show({
                text: text,
                type: 'text',
                position: 'top',
                width:'20em'
            })
         }    
    },   
    components: {
        XButton,  Group,PopupPicker,XInput ,Datetime,
        FormA,
        Addstaff,
        AddressBook,
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
