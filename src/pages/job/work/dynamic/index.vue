<template>
<div class="router-all">  
    <div class="router-box"><FormA :moduleObj="moduleObj"></FormA></div>   
    <div><x-button type="primary" @click.native="dynamicHand" :show-loading='showLoading'>发布</x-button></div>
</div>
    
</template>

<script>
import {mapMutations,mapState,mapActions} from 'vuex';
import { XButton,Scroller } from 'vux';
import FormA from '@/components/formA';
export default {
    name: 'dynamic',
    data() {
        return { 
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId, 
            moduleObj:{
               placeholder:'请输入您需要发布的动态信息' ,
               title:'',
               max:500,
               inputVal:'',
               uploadData:[],               
           },
           showLoading:false,
        }
    },
    computed: {
        ...mapState({
            addMessageData: state => state.oamessage.addMessageData,            
        })       
    },
    watch: {
         addMessageData(data){  
             if(Object.keys(data).length >0){
                 this.showLoading=false;
                let text;  
                if(data.alert_msg){
                    text=data.alert_msg;
                }else{ 
                    text= '发布成功' ;
                    status=true;
                    this.$router.go(-1)   
                }
                this.$vux.toast.show({
                    text: text,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })

             }
             
         }
    },
    methods: {
        ...mapActions({
            addMessageHand:'oamessage/addMessage',
        }), 
        dynamicHand(){
            let text=$.trim(this.moduleObj.inputVal);  
            if(text.length==0){
                this.moduleObj.inputVal='';
                this.$vux.toast.show({
                    text: '请输入您需要发布的动态信息',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
            }
            if(!this.showLoading){
                this.showLoading=true;
                //图片数据重组            
                let fileData = [];
                this.moduleObj.uploadData.forEach((item,i) => {  
                    let objArr={origin_name:item.name,data:item.src}
                    fileData.push(objArr);
                });
                let obj={
                    userId:this.userId,
                    companyId:this.companyId,
                    content:text,
                    deptIds:this.$store.state.userInfo.user.departId,
                      

                }
                if(fileData.length>0){
                     obj.fileData=JSON.stringify(fileData) 
                }
                this.addMessageHand(obj);
            }
        },
        
    },   
    components: {
       FormA,
       XButton,
       Scroller
    },
}
</script>
