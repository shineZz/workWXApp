<template>
    <div class="router-all" >
        <div class="router-box " v-show="!isAddressBook">        
            <FormA :moduleObj="moduleObj" v-on:uploadDataList="uploadDataList"/>
            <Addstaff  @toggleAddress="toggleAddress" :ifView="ifView">审阅人</Addstaff> 
        </div>
        <div v-show="!isAddressBook">
            <x-button type="primary"  @click.native="addStatement" :show-loading='showLoading'>提交</x-button>
        </div>
        <AddressBook :message="addressBookObj" @toggleAddress="toggleAddress" v-show="isAddressBook" :state1='1' :state2='1' :state3='0' :state4='0' :state5='1' />
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,XButton,  CellBox, Cell,Group,Search,Card,XTextarea,Datetime ,Scroller ,XInput } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'
import FormA from '@/components/formA'
import Addstaff from '@/components/addStaff'
import AddressBook from '@/components/addressBook';
import {XSAPI_URL,API_PARM_OBJ,LG_AES_XSAPI,LG_AES_SALT ,} from '@/constants/interface';
import * as aes from '@/util/lgaes';
import lrz from 'lrz';
import axios from 'axios';
export default {
    name: 'dayStatement',
    data() {
        return {
           
           addressBookObj:{},
           ifView:false ,
           isAddressBook:false,  
           showToast:false,
           addressData:[],

           companyId:this.$store.state.userInfo.company.companyId,   
           userId:this.$store.state.userInfo.user.userId, 
           query:0,
           objData:{},//提交数据
           moduleObj:{
               placeholder:'输入文字不得超过500字(必填)' ,
               title:'',
               max:500,
               inputVal:'',
               uploadData:[],  
           },
           showLoading:false,
        }
    },
    created() {
      
        this.query=this.$route.query.state;
        if(this.query==0){
            this.moduleObj.title="今日完成的工作"
            document.title="发起日报"
        }else if(this.query==1){
            this.moduleObj.title="本周完成的工作"
            document.title="发起周报"
        }else if(this.query==2){
            this.moduleObj.title="本月完成的工作"
            document.title="发起月报"
        }
        
    },
    mounted() {
        //查询人
        let obj={
                companyId:this.companyId,
                userId:this.userId,
            }
            this.queryReviewHand(obj)
    },
    methods: {
        ...mapMutations({
            selectedMemberHand: 'addressBook/SELECTED_MEMBER',           
            loadingHand: 'UPDATE_LOADING',
        }),
         ...mapActions({
             saveReviewHand:'oaworkreport/saveReview',
             queryReviewHand: 'oaworkreport/queryReview',
             addReportHand: 'oaworkreport/addReport',
             GETXSUSERLIST:'addressBook/GetXsUserList',
             GETDEPARTMENTLIST:'addressBook/GetDepartMentList',
        }),
        toggleAddress(){
            this.isAddressBook=!this.isAddressBook
            console.log('0000')
        },
        uploadDataList: function (data){
            if(data>=4){
                this.$nextTick(() => {
                    this.$refs.scroller.reset();
                })
            }
        },
        addStatement(){
            
            let text=$.trim(this.moduleObj.inputVal);              
            if(text.length==0){ 
                this.$vux.toast.show({
                    text: '请输入工作内容',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })  
                this.moduleObj.inputVal='';   
                return          
            }
            //审阅人
            if(this.selectedMember.length==0){
                this.$vux.toast.show({
                    text: '请选择审阅人',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            var myDate = new Date();
            let subject,startDate,endDate;            
            if(this.query==0){
                let time=myDate.toLocaleDateString().replace(/\//g,  "-")
                subject='日报:'+time+' 工作日报';
                startDate=time;
                endDate=time;
            }else if(this.query==1){
                var weekDay = myDate.getDay();
                var fromDate = new Date(myDate.getTime() - weekDay*24*60*60*1000);
                var toDate = new Date(myDate.getTime() + (6-weekDay)*24*60*60*1000);
                startDate=fromDate.toLocaleDateString().replace(/\//g,  "-");
                endDate=toDate.toLocaleDateString().replace(/\//g,  "-");
                subject='周报:'+startDate+'—'+endDate+' 工作周报';                
            }else{
                let daYear =myDate.getFullYear();
                let daMonth =myDate.getMonth()+1;
                let day = new Date(daYear,daMonth,0);
                let lastdate = day.getDate()
                let  subjectData=daYear+'-'+daMonth;
                subject='月报:'+subjectData+' 工作月报';
                startDate=subjectData+'-01';
                endDate=subjectData+'-'+lastdate;
            }
            let recorder=[]
            this.selectedMember.forEach(item => {
                recorder.push(item.userId) 
            });
            let objData={
                userId:this.userId,
                companyId:this.companyId,
                reportContent:this.moduleObj.inputVal,
                reportType:Number(this.query)+1,
                oType:'1',
                reportState:'2',                
                recorder:recorder.join(','),
                subject,
                startDate,
                endDate
            }
            // 保存工作报告审阅人
            let obj={
                userId:this.userId,
                companyId:this.companyId,
                recorder:recorder.join(','),
            }
            if(!this.showLoading){
                this.showLoading=true;
                this.objData=objData
                this.saveReviewHand(obj); 

            }
                       
        },
    },    
    computed: {
        ...mapState({
           selectedMember: state => state.addressBook.selectedMember,
           queryReviewData: state => state.oaworkreport.queryReviewData,
           saveReviewData: state => state.oaworkreport.saveReviewData,
           addReportData: state => state.oaworkreport.addReportData,
        })
    },
    watch: {
        queryReviewData:function(data){
            console.log(data,3333)
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
                            userName:item.userName,
                        }
                        Arr.push(obj)                       
                   });                  
                   this.selectedMemberHand(Arr)
                }
            }
        },  
        addReportData(data){  
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

         } ,     
        saveReviewData:function(data){
            if( Object.keys(data).length >0){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{
                    let obj=this.objData;
                    //图片数据重组            
                    let fileData = [];
                    this.moduleObj.uploadData.forEach((item,i) => {  
                        let objArr={origin_name:item.name,data:item.src}
                        fileData.push(objArr);
                    });
                    if(fileData.length>0){
                        obj.fileData=JSON.stringify(fileData) 
                    }
                    this.addReportHand(obj) 
                }
            }

        }
    },
    components: {
        CellBox,
        Group,
        Cell,
        Search,
        Card,
        XTextarea,
        Datetime,
        Scroller,
        XInput,
        XButton,
        FormA,
        Addstaff,
        AddressBook,
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
