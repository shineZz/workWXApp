<template>
        <div >
            <a href="javascript:void(0)" class="vux-1px-b listA-box" v-for="(item,index) in listObj.listData" :key="index" @click="checkType(index,item)">                
                <aside  v-if="item.img.length>0"><img :src="item.img" :alt="item.name" :onerror="logo"></aside>
                <aside v-else :class="'c-'+item.color" ><span  v-html="NameHand(item.name,index)" :class="item.logoNameFlag?'wk':''" /> </aside>
                <section>
                    <div class="hd">
                        <h6>{{item.name}}</h6>
                        <p v-if="item.state || item.time"><span v-if="item.state" class="first">{{item.state}}</span><span v-if="item.state && item.time">/</span><span v-if="item.time">{{item.time}}</span></p>
                    </div>
                    <div class="hd listA-number" v-if="item.number">
                        <h6>{{item.number}}</h6>
                    </div>
                    <div class="md">
                        <p :class="item.icon && item.icon.iconType!=1?'mr22':''">{{item.work}}</p>  
                        <div class="vux-check-icon" v-if="item.icon && item.icon.iconType==1"><i :class="item.icon.iconFlag?'weui-icon-success':' weui-icon-circle'" class="weui-icon"></i></div>
                        <a @click.stop="callHand(item)"  class="icon-pr" v-else-if="item.icon && item.icon.iconType==2"><div class="vux-check-icon icon-tel"><i class="weui-icon"></i></div></a>

                    </div>
                    <div class="highSeas">
                        <a @click.stop="tasking(item)" class="icon-btn" v-if="item.icon && item.icon.iconType==3">
                            <x-button  mini type="primary" >分派给我</x-button>
                        </a>
                        <a @click.stop="refuse(item)" class="icon-btn" v-else-if="item.icon && item.icon.iconType==4">
                            <x-button  mini type="primary" >未同意原因</x-button>
                        </a>
                        <span class="icon-text" v-else-if="item.icon && item.icon.iconType==5">审核中</span>
                    </div>
                    <div class="fd" v-if="item.label && item.label.length>0">
                        <span v-for="(it,i) in item.label" :key="i" >{{it}}</span>
                    </div>
                </section>
            </a>
        </div>
</template>
<script>
import { CheckIcon, XButton } from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';
import {len} from '@/util';
export default {
    name: 'listA',
     data() {
        return {
           logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
        }
    },
    props:['listObj'],
    components: {        
       CheckIcon,
       XButton
    },
    methods: {
        ...mapActions({
            customeractionrecord_addCallPhoneRecord: 'customeractionrecord/addCallPhoneRecord',
        }),
        //选择
        checkType(index,item){
            if(this.listObj.listData[index].icon && this.listObj.listData[index].icon.iconType==1){
                if(this.listObj.radioFlag){
                    if(this.listObj.radioData){
                        let Arr=[];
                        this.listObj.listData.forEach(function(items,){
                            if(items.id==item.id){        
                                items.icon.iconFlag = !items.icon.iconFlag;
                                let Arr=[];
                                if(items.icon.iconFlag){
                                     Arr.push(items)
                                }                                  
                                this.listObj.radioData=Arr                                                           
                            }else{
                                 if(items.icon){
                                    items.icon.iconFlag=false;
                                }
                            }                          
                        },this);
                        if(this.listObj.radioHandFlag){
                            this.$emit('radioHand');//单选事件调用 
                        }                        
                    } 
                }else{           
                    this.listObj.listData.forEach(function(items,){
                        if(items.id==item.id){        
                            items.icon.iconFlag = !items.icon.iconFlag;
                            //多选 radioData没有传入的时候，不操作
                            if(this.listObj.radioData){
                                if(items.icon.iconFlag){
                                    this.listObj.radioData.push(item)
                                }else{
                                    this.listObj.radioData=this.listObj.radioData.filter((elem, i) => item.id !== elem.id);
                                }
                            }                             
                        }
                    },this)
                }
            }else{
                this.$router.push({ name:this.listObj.listData[index].url.link,query:this.listObj.listData[index].url.query,params:this.listObj.listData[index].url.params })
            }
        },
        NameHand(name,index){
            var zh_reg = /^[\u4e00-\u9fa5]+$/;
            let text=name;
            if (!zh_reg.test(text.substr(0,1))) {
                let nameA=text.length>5?text.substring(0,5):text;
                if(nameA.length<3){
                    return nameA;
                }else{
                    if((nameA.length==4 && len(text)==4 )|| (nameA.length==5 && len(text)==5 )  ){
                        return nameA;
                    }else if(len(text)>4){
                        let html=nameA.substring(0,2)+'</br>'+nameA.substring(2);
                        this.listObj.listData[index].logoNameFlag=true;                        
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                  
                    this.listObj.listData[index].logoNameFlag=true;  
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.listObj.listData[index].logoNameFlag=true;  
                    return html;
                }else{
                    return text;
                }
                
            }
            
        },
        callHand(item) {
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                customer_id: item.id,
                mobile: item.tel,
            }
            this.customeractionrecord_addCallPhoneRecord(obj)
            window.location.href = `tel:${item.tel}`
        },
        // 分派公海客户
        tasking(item) {
            this.$emit('showTaskingModel', item)
        },
        // 拒绝公海客户申领原因
        refuse(item) {
            this.$emit('refuseTaskingModel', item)
        },
    },
    computed: {
        ...mapState({
            addCall: state => state.customeractionrecord.addCall,
        })
    },
    watch: {
        addCall(data) {
            if (data) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
            }
        },
    },
}
</script>
<style lang="less" scoped>
 @import '../../css/listA.less';
</style>
