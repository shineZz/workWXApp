<template>
    <div>        
        <SlidCalendar @canlenDarData="canlenDarData"  @controlCustomer="controlCustomer" ref="SlidCalendar" :dataTime="dataTime"/>
        <AiList :aiObj="aiObj" ref="aiView" />
        <div v-transfer-dom >
          <popup v-model="isCustomer" position="right" width="100%" should-scroll-top-on-show>
            <Customer @toggleCustomer='toggleCustomer' propsState="1" :isRadioChoice="1" :btn='1' />
          </popup>
        </div>
    </div>
</template>
<script>
import {  TransferDom,Popup } from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';
import AiList from '@/pages/customs/tool/AI/aiList';
import SlidCalendar from '@/components/slidCalendar';
import Customer from '@/components/customer';
import {currentDate} from '@/util/index';


export default {
    name: 'aiView',
    data() {
        return { 
            aiObj:{
                type:1,
                add_time:'2018-08-17',
                user_ids:[],   
            },
            isCustomer:false,
            user_ids:[],
            dataTime:'',


        }
    },
    directives: {
        TransferDom
    },
    created() {
        let aiViewObj= localStorage.getItem("aiViewObj");
        if(aiViewObj){
            let obj = JSON.parse(aiViewObj);
            this.aiObj.add_time= obj.time;
            let titleString =[];
            let Arr=[];
             obj.user_ids.forEach((item,index)=>{
                    Arr.push(item.userId);
                    let name= item.name;
                    titleString.push(name);

                });
            this.aiObj.user_ids= Arr;
            this.user_ids= obj.user_ids;
            this.dataTime=obj.time;
            titleString=titleString.join('、');
            if(titleString.length>7){
              titleString = titleString.substring(0,7)+'...'
            }
            if(titleString.length>0){
                titleString=titleString.join('、');
                if(titleString.length>7){
                    titleString = titleString.substring(0,7)+'...'
                }
                document.title=titleString+"的签到";
            }else{
                document.title="查看下属的AI外呼";
            }
            
            this.ResultChoice(this.user_ids);
        }else{
            this.aiObj.add_time=currentDate();
            this.ResultChoice([])
        }
        
    },    
     methods: {
         ...mapMutations({
             ResultChoice:'user/RESULTCHOICE',       
         }),
        canlenDarData(data){
            this.aiObj.add_time=data;
            
            let obj={
                time:data,
                user_ids:this.user_ids,
            }
            localStorage.setItem("aiViewObj",JSON.stringify(obj));
            this.$refs.aiView.aiViewHand();
        },
        controlCustomer(data){
            this.toggleCustomer()
        },
        toggleCustomer(data){
            this.isCustomer=!this.isCustomer;
            let Arr=[]; 
            let titleString =[];
            if(data){
                data.forEach((item,index)=>{
                    Arr.push(item.userId);
                    let name= item.name;
                    titleString.push(name);

                });
                this.aiObj.user_ids=Arr;
                this.user_ids=data;
                 let obj={
                    time:this.aiObj.add_time,
                    user_ids:data,
                }
                if(titleString.length>0){
                    titleString=titleString.join('、');
                    if(titleString.length>7){
                        titleString = titleString.substring(0,7)+'...'
                    }
                    document.title=titleString+"的签到";
                }else{
                    document.title="查看下属的AI外呼";
                }
                
                localStorage.setItem("aiViewObj",JSON.stringify(obj));
                this.$refs.aiView.aiViewHand()
            }
            
        }
    },
    beforeRouteLeave(to, from, next) {
        if(this.isCustomer){
            this.isCustomer=false
            next(false)
        }else{
            next()
        }
    },
    components: {
       AiList,SlidCalendar ,Customer,Popup
    },
}
</script>
