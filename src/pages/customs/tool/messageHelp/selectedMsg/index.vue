<template>
    <div class="selectedMsg">
        <scroller  
            lock-x  
            scrollbarY 
            height="-70"  
            v-if="!isCutomer&&!isSelectedMsg"
        >
            <div style="overflow:hidden">
                <group class="group-mt0">
                    <cell title="客户" 
                        is-link 
                        @click.native="toggleSignCustom"
                    ></cell>
                    <cell title="同事" is-link @click.native="toggleCustomer"></cell>
                </group>
            </div>
            
        </scroller>
        <SignCustom 
            @toggleSignCustom="toggleSignCustom" 
            :propsJudge="judgeFlag" 
            @choiseFlag="choiseFlag"
            v-show="isSelectedMsg" 
            ref='signCustom'
            />
        <Customer 
            @toggleCustomer="toggleCustomer" 
            @changeShare='changeShare' 
            :userList='userList'
            propsState='2'
            v-show="isCutomer"
            />
        <div class="signCustom-footer vux-1px-t" >
            <div class="selected-member" v-if="myCustomer.length>0">
                <ul class="selectedUl">
                   <li v-for="(item,index) in myCustomer" :key="index" @click="removeShare(item)">
                       <aside  v-if="item.img||item.headPortrait||item.logo_orig"><img :src="item.img||item.headPortrait||item.logo_orig?item.img||item.headPortrait||item.logo_orig:'@/images/xsdefult.jpg'" :alt="item.name||item.customer_name" :onerror="logo"></aside>
                       <aside v-else :class="'c-'+item.color" v-html="NameHand(item.name||item.customer_name,item.userId||item.customer_id)"></aside>
                        <p>{{item.name||item.customer_name}}</p>
                   </li>
                </ul>
            </div>
            <div style="flex:1;box-sizing:border-box;padding-left:15px;" v-else>
                请选择收件人
            </div>
            <div class="outcustom-btn-box">
                <x-button type="primary"  @click.native="BackByCondition">
                    确定
                    ({{myCustomer.length>999?'999+':myCustomer.length}})
                </x-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import {  Popover , Group ,Scroller,Cell,XButton,Search} from 'vux'
import { mapState,mapActions,mapMutations, } from 'vuex'
import Customer from '@/components/customer'
import SignCustom from '../../sign/signCustom'
import {len,objDeepCopy} from '@/util'
import VueEmit from '@/util/vueEimt';
export default {
    name: 'selectedMsg',
    data() {
        return {
            isMessage1:false,
            isMessage2:false,
            initData:[],
            value:'',
            results:'',
            isCutomer:false,
            isSelectedMsg:false,
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
            myCustomer:[],
            isGroup:false,
            isShareCom:false,
            isSearch:false,
            pushDepartmentData:{},
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,      
            userList:[],
            judgeFlag:{
                isGroup:false,//子组件中分组客户开关
                isLabels:false,//子组件中标签客户开关
                isShare:false,//子组件中分享客户开关
                isLabel:false,//子组件中标签开关
                isSearch:false,//子组件中搜索客户开关
            }
        }
    },
    
    created() {
        let _arr = objDeepCopy(this.resultChoice)
        this.ShareCustom(_arr)
        if(this.shareCustom.length>0){
            let width = this.shareCustom.length*60+5+'px'
            this.$nextTick(function(){
                $(".selectedUl").css('width',width)
            })
        }
    },
    mounted(){
        this.myCustomer = this.shareCustom;
        
    },
    methods: {
        ...mapActions({
            DepartMentListHand: 'company/departMentList',
        }),
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            ShareCustom:'user/SHARECUSTOM',
            ResultChoice:'user/RESULTCHOICE'
        }),
        getResult(){
            
        },
        choiseFlag(data){
            this.judgeFlag[data.name]=data.value
        },
        onSubmit () {
            this.$refs.search.setBlur()
            this.isSearch=true;
        },
        onFocus () {
        },
        onCancel () {
            this.isSearch=false;
        },
        confirmHand() {
            this.$emit('toggleCustomer')
        },
        resultClick() {
            this.$emit('toggleCustomer')
        },
        toggleCustomer(){
            this.isCutomer=!this.isCutomer;
            if(this.isCutomer){
                document.title="选择同事"
            }else{
                document.title='选择收件人'
            }
        },
        toggleSignCustom(){
            this.isSelectedMsg=!this.isSelectedMsg;
            if(this.isSelectedMsg){
                document.title="选择客户"
            }else{
                document.title='选择收件人'
            }
        },
        changeGroup(data){
            this.isGroup=data;
        },
        changeShare(data){
            this.myCustomer=data;
        },
        NameHand(name,userId){
            
            var zh_reg = /^[\u4e00-\u9fa5]+$/;
            let text=name;
            if (!zh_reg.test(text.substr(0,1))) {
                let nameA=text.length>5?text.substring(0,5):text;
                if(nameA.length<3){
                    return '<span  style="line-height:40px">'+nameA+'</span>';
                }else{
                    if((nameA.length==4 && len(text)==4 )|| (nameA.length==5 && len(text)==5 )  ){
                         
                        return '<span  style="line-height:40px">'+nameA+'</span>';
                    }else if(len(text)>4){
                        let html= '<span  class="wk" >'+nameA.substring(0,2)+'</br>'+nameA.substring(2)+'</span>';  
                        this.initData.forEach(function(items){
                            if(items.userId==userId){
                                items.logoNameFlag=true;
                            }
                        },this)                   
                        return html;
                    }else{
                        return '<span  style="line-height:40px">'+nameA+'</span>';
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html='<span  class="wk">'+text.substring(0,2)+'</br>'+text.substring(2)+'</span>' ; 
    
                    return html;
                }else if(text.length>5){
                    let html='<span  class="wk" >'+text.substring(0,2)+'</br>'+text.substring(2)+'</span>';
                    
                    return html;
                }else{
                    return  '<span  style="line-height:40px">'+text+'</span>';
                }
                
            }
            
        },
        removeShare(item){
            VueEmit.$emit('custome',item)
            let _this = this;
            let customArr = objDeepCopy(_this.shareCustom)
            let len = this.shareCustom.length
            for(let i=0;i<len;i++){
                if(item.userId){
                    if(customArr[i].userId==item.userId){
                        customArr.splice(i,1);
                        break ;
                    }
                }else if(item.customer_id){
                    if(customArr[i].customer_id==item.customer_id){
                        customArr.splice(i,1);
                        break ;
                    }
                }
            }
            this.ShareCustom(customArr)
            
        },
        choiseFlag(data){
            this.judgeFlag[data.name]=data.value
        },
        BackByCondition(){
            let _arr = objDeepCopy(this.shareCustom)
            this.ResultChoice(_arr)
            let type =this.$route.query.type
            if(type&&type==2){
                this.isSelectedMsg=true;
                this.isGroup=false;
                this.isShareCom=false;
                //控制选择同事组件组建中的
                this.$refs.signCustom.heightChange = '-70'
                this.$refs.signCustom.mychangeGroup = false
                this.$refs.signCustom.mychangeshare = false
                this.$router.go(-1)
            }else if(type&&type==1){
                this.$router.go(-1)
            }else{
                this.isSelectedMsg=false;
                this.isGroup=false;
                this.isShareCom=false;
                this.isCutomer=false;
                this.$refs.signCustom.heightChange = '-114'
                this.$refs.signCustom.mychangeGroup = false
                this.$refs.signCustom.mychangeshare = false
                this.$router.go(-1)
            }
            
            
        },
        changeShareCom(data){
            this.isShareCom=data
        }
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            shareCustom:state => state.user.shareCustom,
            data:state =>state.data,
            departMentData:state=>state.user.departMentData,
            resultChoice:state=>state.user.resultChoice
        })
    },
    watch:{

        shareCustom(data){
            let width = data.length*60+5+'px'
            this.$nextTick(function(){
                $(".selectedUl").css('width',width)
            })
            this.myCustomer= objDeepCopy(data) 
        },
        departMentData(data){         
            if(Object.keys(data).length >0){
                 if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.ShareCustom([])
                }else{  
                    
                }
            }
        },
    },
    beforeRouteLeave(to, from, next) {
        let type=this.$route.query.type;
        
        if(this.isSelectedMsg){
            this.$refs.signCustom.onFetching = false
            if(this.judgeFlag.isShare||this.judgeFlag.isSearch||this.judgeFlag.isLabel||this.judgeFlag.isLabels||this.judgeFlag.isGroup){
                this.$refs.signCustom.height='-114'
                this.$refs.signCustom.onFetching = false
                this.$refs.signCustom.isShare=false
                this.$refs.signCustom.isgroup=false
                this.$refs.signCustom.isLabels=false
                this.$refs.signCustom.mylabels=false
                this.$refs.signCustom.isSearch=false  
                this.judgeFlag={
                    isGroup:false,
                    isLabels:false,
                    isShareForMe:false,
                    isCurrentLabel:false,
                    isSearch:false,
                }
                next(false);
            }else{
                this.isSelectedMsg=false
                next(false);
            }
        }else if(this.isCutomer){
            this.isCutomer=false
            next(false);
        }else{
            next();
        }
    },
    beforeRouteEnter (to, from, next) {
        next()
        
    },
    components: {
        Popover,
        Group,
        Scroller,
        XButton,
        Search,
        Cell,
        Customer,
        SignCustom,
    },
}
</script>
<style lang="less" scoped>
.selectedMsg{
    .weui-btn{
        font-size: 14px;
        line-height: 27px;
        width:auto;
    }
    .weui-cell__hd{
        width: 30px;
        height: 30px;
    }
    .signCustom-footer .vux-1px-t:before{
        color: #666 !important;
    }
}
</style>
<style lang="less" scoped>
  @import '../../../../../css/toolList.less';
  @import './index.less';
</style>
