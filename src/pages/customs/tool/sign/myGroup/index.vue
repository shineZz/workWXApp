<template>
    <div class="myGroup">
        <div class="signCustom-footer" >
            <div class="selected-member" v-if="myCustomer.length>0">
                <ul >
                   <li v-for="(i,index) in myCustomer" :key="index" @click="removeShare(i.userId)">
                       <aside  v-if="i.img"><img src="@/images/xsdefult.jpg" :alt="i.name" :onerror="logo"></aside>
                       <aside v-else :class="'c-'+i.color" ><span  v-html="shareNameHand(i.name,index)" :class="i.logoNameFlag?'wk':''" /> </aside>
                   </li>
                </ul>
            </div>
            <div style="flex:1;line-height:44px;box-sizing:border-box;padding-left:15px;" v-else>
                请选择客户
            </div>
            <div class="outcustom-btn-box">
                <x-button type="primary" @click.native="BackByCondition">
                    确定
                    ({{myCustomer.length>999?'999+':myCustomer.length}})
                </x-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Scroller , XButton ,Group,Cell,CellBox,Icon,CheckIcon } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import {len} from '@/util';
import { objDeepCopy } from '@/util'
import labelPage from '@/components/labels'
import VueEmit from '@/util/vueEimt';
export default {
    name: 'myGroup',
    data() {
        return {
            showContent001: false,
            showContent0001: false,
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
            oneIndustry:[
                {
                    title:"互联网",
                    flag:false,
                    childFlag:false,
                    id:"0123",
                    children:[
                        {
                           name:'丁2a阿萨德建3',
                           img:'http://dev-xsimages.51lick.cn:18880/static/images/icon/xsdefult.jpg',
                           work:'南京超好吃餐饮有限公司55',
                            label:[],
                            userId:'1',
                            tel:'18806505616',
                            state:'新入库',
                            icon:{
                                iconFlag:false,
                            },
                            logoNameFlag:true,
                            color:3
                        },
                        {
                            name:'丁2发送到',
                            img:'http://dev-xsimages.51lick.cn:18880/static/images/icon/xsdefult.jpg',
                            work:'南京超好吃餐饮有限公司55',
                            label:[],
                            userId:'2',
                            tel:'18806505616',
                            state:'新入库',
                            icon:{
                                iconFlag:false,
                            },
                            logoNameFlag:true,
                            color:2
                        },
                    ]
                },
                {
                    title:'建筑业',
                    flag:false,
                    childFlag:false,
                    id:"8783",
                    children:[
                        {
                            name:'发送到',
                            img:'http://dev-xsimages.51lick.cn:18880/static/images/icon/xsdefult.jpg',
                            work:'南京超好吃餐饮有限公司55',
                            label:[],
                            userId:'3',
                            tel:'18806505616',
                            state:'新入库',
                            icon:{
                                iconFlag:false,
                            },
                            logoNameFlag:true,
                            color:1
                        },
                        {
                            name:'大十多个',
                            img:'http://dev-xsimages.51lick.cn:18880/static/images/icon/xsdefult.jpg',
                            work:'南京超好吃餐饮有限公司55',
                            label:[],
                            userId:'4',
                            tel:'18806505616',
                            state:'新入库',
                            icon:{
                                iconFlag:false,
                            },
                            logoNameFlag:true,
                            color:3
                        }
                    ]
                },
                {
                    title:'服务业',
                    flag:false,
                    childFlag:false,
                    id:"3241",
                    children:[
                        {
                            name:'qweqw1阿达',
                            img:'',
                            work:'阿萨达是大群二群翁',
                            label:[],
                            userId:'5',
                            tel:'18806505616',
                            state:'新入库',
                            icon:{
                                iconFlag:false,
                            },
                            logoNameFlag:false,
                            color:2
                        },
                        {
                            name:'asdasd阿大叔大婶大所多',
                            img:'',
                            work:'南京超好吃餐饮有限公司55',
                            label:[],
                            userId:'6',
                            tel:'18806505616',
                            state:'新入库',
                            icon:{
                                iconFlag:false,
                            },
                            logoNameFlag:false,
                            color:1
                        }
                    ]
                }
            ],
            myCustomer:[]
        }
    },
    created() {
        
    },
    mounted(){
        
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            SHARECustom:'user/SHARECUSTOM',
        }),
        shareNameHand(name,index){
            console.log(name,index,'0000000000000000000')
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
                        this.myCustomer[index].logoNameFlag=true;             
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    this.myCustomer[index].logoNameFlag=true;
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.myCustomer[index].logoNameFlag=true;
                    return html;
                }else{
                    return text;
                }
                
            }
            
        },
        NameHand(name,index,parent){
            console.log(name,index,parent)
            console.log(this.oneIndustry[parent].children[index])
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
                        this.oneIndustry[parent].children[index].logoNameFlag=true;             
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    this.oneIndustry[parent].children[index].logoNameFlag=true;
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.oneIndustry[parent].children[index].logoNameFlag=true;
                    return html;
                }else{
                    return text;
                }
                
            }
            
        },
        removeShare(userId){
            let my_arr = this.shareCustom;
            let len = my_arr.length;
            for(let i=0;i<len;i++){
                if(my_arr[i].userId==userId){
                    my_arr.splice(i,1);
                    break ;
                }
            }
            this.SHARECustom(my_arr);
            let arr = this.oneIndustry;
            let arrLen = arr.length;
            console.log(arr)
            for(let i=0;i<arrLen;i++){
                if(typeof(arr[i].children)!='undefined'){
                    let childLen = arr[i].children.length;
                    for(let j=0;j<childLen;j++){
                        if(arr[i].children[j].userId==userId){
                            arr[i].children[j].icon.iconFlag=false;
                            break ;
                        }
                    }
                }
            };
        },
        changeType(id){
            console.log(id)
            this.oneIndustry.forEach(function(items){
                if(items.id==id){
                    items.childFlag=!items.childFlag;
                }
            },this)
        },
        selectOneCustom(id,userId){
            console.log(id,userId)
            let len = this.oneIndustry.length;
            for(let i=0;i<len;i++){
                if(this.oneIndustry[i].id==id){
                    if(this.oneIndustry[i].children){
                        let childLen = this.oneIndustry[i].children.length;
                        for(let j=0;j<childLen;j++){
                            if(userId==this.oneIndustry[i].children[j].userId){
                                this.oneIndustry[i].children[j].icon.iconFlag=!this.oneIndustry[i].children[j].icon.iconFlag;
                                
                                let myArr=this.shareCustom;

                                if(this.oneIndustry[i].children[j].icon.iconFlag){
                                    let new_arr;
                                    
                                    if(this.shareCustom.length>0){
                                        new_arr = this.changeArr(this.shareCustom)
                                        if(new_arr&&new_arr.indexOf(userId)>=0){

                                        }else{
                                            myArr.push(this.oneIndustry[i].children[j])
                                            this.SHARECustom(myArr)
                                        }
                                    }else{
                                        myArr.push(this.oneIndustry[i].children[j])
                                        this.SHARECustom(myArr)
                                    }
                                    console.log(new_arr)
                                    
                                }else{
                                    for(let n=0;n<this.shareCustom.length;n++){
                                        if(myArr[n].userId==userId){
                                            myArr.splice(n,1);
                                            break ;
                                        }
                                    }
                                    this.SHARECustom(myArr)
                                }
                            }
                        }
                    }
                }
            };
            
        },
        changeCircle(id){
            console.log(id)
            let my_arr = objDeepCopy(this.shareCustom);
            let customLen = this.shareCustom.length;
            let len = this.oneIndustry.length;
            for(let i=0;i<len;i++){
                if(this.oneIndustry[i].id==id){
                    this.oneIndustry[i].flag=!this.oneIndustry[i].flag;
                    if(this.oneIndustry[i].children){
                        let childLen = this.oneIndustry[i].children.length;
                        for(let j=0;j<childLen;j++){
                            this.oneIndustry[i].children[j].icon.iconFlag=this.oneIndustry[i].flag;
                            let new_arr = this.changeArr(this.shareCustom)
                            if(this.oneIndustry[i].flag){
                                if(customLen.length>0){
                                    if(new_arr.indexOf(this.oneIndustry[i].children[j].userId)>=0){

                                    }else{
                                        my_arr.push(this.oneIndustry[i].children[j])
                                    }
                                }else{
                                    my_arr.push(this.oneIndustry[i].children[j])
                                }
                            }else{
                                for(let k=0;k<customLen;k++){
                                    if(this.oneIndustry[i].children[j].userId==my_arr[k].userId){
                                        my_arr.splice(k,1)
                                        customLen--
                                    }
                                }
                            }
                            
                        }
                        
                    }
                }
            };
            console.log(my_arr,'0000000000000')
            this.SHARECustom(my_arr)
        },
        changeArr(data){
            let _arr=[]
            if(data.length>0){
                data.forEach(function(items){
                    _arr.push(items.userId)
                },this)
            }
            return _arr;
        },
        BackByCondition(){
            this.$router.go(-1)
        }
    },
    computed: {
        ...mapState({
            data:state => state.data,
            shareCustom:state => state.user.shareCustom,
        })
    },
    watch: {
        shareCustom(data){
            console.log(data,'----group')
            let width = data.length*53+'px'
            this.$nextTick(function(){
                this.myCustomer = data;
                $(".selected-member ul").css('width',width)
            })
            
        },
        oneIndustry(data){
            console.log(data,'niahoniahoniahoniahoa')
        }
    },
    beforeRouteLeave(to, from, next) {
        //  // 离开时缓存
        next();
    },
    beforeRouteEnter (to, from, next) {
         console.log(to,from,'99999')
        // // 进入时调用
        if(from.name=='selectedMsg'){
            to.meta.keepAlive = true;
            from.meta.keepAlive = true; 
            next(vm=>{
            })
        }
    },
    components: {
        Scroller,
        XButton,
        Group,
        Cell,
        CellBox,
        Icon,
        CheckIcon,
    },
}
</script>
<style lang="less">
 @import './index.less';
</style>
<style lang="less" scoped>
   @import '../../../../../css/toolList.less';
</style>
