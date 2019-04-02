<template>
    <div class="outCustomer">
        <!-- <div class="search-box">
            <form action="" class="search-form">
                <div class="search-img">
                    <img src="../../images/job/search.png" alt="">    
                </div> 
                <input type="search" @search="searchCustomStaff" id="mysearch" ref="search"  v-model="searchVal" placeholder="请输入姓名、微信号">
                <div class="search-close">
                    <img src="../../images/job/cancel.png" alt="" @click="clearSearch">
                </div>
                <input id="hiddenText" type="text" style="display:none" />
            </form>
        </div> -->
        <!-- 搜索框 -->
        <search ref="search" :auto-fixed="false" placeholder="请输入姓名、微信号" v-model="searchVal"
        @on-submit="searchCustomStaff" @on-click-clear-icon="clearSearch">
        </search>
        <div  class="wu-all" style="height:100%" v-if="companyObj.length==0">
            <section>
                <div><img src="~@/images/wu-icon1.png"></div>
                <p>暂无查看对象</p>
            </section>
        </div>
        <div>
        <div class="fix-header" v-if="all==0&&!isSearchVal&&ischange?true:false" >{{fixedVal}}</div>
        <scroller 
            lock-x 
            :scrollbarY=false 
            height="-114"
            @on-scroll="initTest"
            ref="scroller"
        >
            <div class="box1" style="overflow:hidden">
                <div id="test1" v-if="all==0&&!isSearchVal?true:false">
                    <group class="mytitle"  v-for="(items,index) in companyObj" :id="items.name=='#' ? 'first' : items.name" :title="items.name" :key="index">
                        <div  
                            v-for="(item,m) in items.childrenList" 
                            :key="m" 
                            class="custom-li"
                            :class="m==0?'':'vux-1px-t'"
                            @click="selectMember(item)"
                            >
                            <aside :class="'c-'+item.color" ><span  v-html="NameHand(item.userName,index,m)" :class="item.logoNameFlag?'wk':''" /></aside>
                            <span class="custom-content">
                                <p>{{item.userName}}</p>
                                <p>13777154684</p>
                            </span>
                            <span class="span-icon">
                                <icon type="success-circle" v-if="item.flag"></icon>
                                <icon type="circle" v-else></icon>
                            </span>
                        </div>
                    </group>
                </div>
                <div id="searchList" v-if='isSearchVal'>
                    <div>
                        <div  
                            v-for="(item,index) in searchList" 
                            :key="index"     
                            @click="selectMember(item)"
                            class="custom-li"
                            >
                            <aside :class="'c-'+item.color" >
                                <span  v-html="searchNameHand(item.userName,index)" 
                               :class="item.logoNameFlag?'wk':''"
                            />
                            </aside>
                            <span class="custom-content">
                                <p>{{item.userName}}</p>
                                <p>13777154684</p>
                            </span>
                            <span class="span-icon">
                                <icon type="success-circle" v-if="item.flag"></icon>
                                <icon type="circle" v-else></icon>
                            </span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </scroller>
        <ul class="nav" id="nav" v-if="all==0&&companyObj.length!==0?true:false">
            <li v-for="(items,index) in companyObj" :key="index">
                <a @click="goAnchor(items.name=='#' ? 'first' : items.name)">{{items.name}}</a>
            </li>
        </ul>
        </div>
        <div class="out-custom-footer vux-1px-t">
            <div class="selected-member" v-if="shareCustom.length>0">
                <ul>
                   <!-- <aside :class="'c-'+item.color" >
                       <span  v-html="NameHand(item.userName,index,m)" :class="item.logoNameFlag?'wk':''" />
                   </aside> -->
                   <li v-for="(item,index) in shareCustom"  :key="index" @click="removeShare(item)">
                        <aside :class="'c-'+item.color" >
                            <span  v-html="shareNameHand(item.userName,index)" 
                            :class="item.logoNameFlag?'wk':''"
                        />
                        </aside>
                        <p>{{item.userName?item.userName:item.name}}</p>
                   </li>
                </ul>
            </div>
            <div style="flex:1;line-height:70px;box-sizing:border-box;padding-left:15px;" v-else>
                请选择联系人导入客户通讯录
            </div>
            <div class="outcustom-btn-box">
                <x-button type="primary" @click.native="isAllSelect" v-if="typeof(isRadioChoice)=='undefined'">
                    {{!isAll&&userInitData.data.items.list.length===shareCustom.length?"取消全选":'全选'}}
                </x-button>
                <x-button type="primary" @click.native="confirmHand" :disabled="!shareCustom.length">
                    确定({{shareCustom.length>999?'999+':shareCustom.length}})
                </x-button>
                
            </div>
        </div>
    </div>
</template>
<script>
import {  Tabbar, TabbarItem,  CellBox, Cell ,Group,Search,Icon ,CheckIcon,Scroller,XButton,ButtonTab,ButtonTabItem  } from 'vux'
import { mapState, mapActions , mapGetters ,mapMutations} from 'vuex'
import { objDeepCopy, len } from '@/util'

export default {    
    name: 'outCustomer',
    data() {
        return {
           user_id:this.$store.state.userInfo.user.userId,
           company_id:this.$store.state.userInfo.company.companyId,
           selectArr:[],//选中的人
           fixedVal:"",
           all:0,
           selectAll:false,//全选check-icon
           selectAllFlag:false,//全选显示
           isSearch:true,//搜索框显示
           scrollHeight:'',//scrollerHeight
           stateThree:'0',//控制企业员工数据：0企业通讯录/1多选/2客户通讯录（保留）/3多选/4(保留)
           range:true,//头部button按钮的显示
           stateTwo:0,//组织架构的类型，1选择/0点击
           searchVal:"",//搜索信息
           companyObj:[],//企业员工数据
           branch:[],//组织架构数据
           searchList:[],//搜索的数据
           isSearchVal:false,//搜索框值
           userFlag:false,
           ischange:true,
           isAll:true
        }
    },
    props:['isRadioChoice'],
    created() {
        let obj = {
            userId:this.user_id,
            companyId:this.company_id
        }
        this.GETXSUSERLIST(obj)
        this.initAddress()
        this.ShareCustom([])
    },
    mounted() {
        // this.shareCustom.forEach(function(items){
        //     items.color='2';
        //     items.logoNameFlag=false;
        // },this)
        // this.ShareCustom(this.shareCustom)
        if(this.isRadioChoice){
            $('.outcustom-btn-box').css('width','100px');
        }else{
            $('.outcustom-btn-box').css('width','165px');
        }
    },
    methods: {
        // 头像
        NameHand(name,index,it){
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
                        this.companyObj[index].childrenList[it].logoNameFlag=true;                        
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    this.companyObj[index].childrenList[it].logoNameFlag=true;  
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.companyObj[index].childrenList[it].logoNameFlag=true;  
                    return html;
                }else{
                    return text;
                }
                
            }
            
        },
        searchNameHand(name,index){
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
                        this.searchList[index].logoNameFlag=true;                        
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    this.searchList[index].logoNameFlag=true;  
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.searchList[index].logoNameFlag=true;  
                    return html;
                }else{
                    return text;
                }
                
            }
        },
        shareNameHand(name,index){
            var zh_reg = /^[\u4e00-\u9fa5]+$/;
            let text=name;
            if (!zh_reg.test(text.substr(0,1))) {
                let nameA=text.length>5?text.substring(0,5):text;
                if(nameA.length<3){
                    
                    return '<span>'+nameA+'</span>';
                }else{
                    if((nameA.length==4 && len(text)==4 )|| (nameA.length==5 && len(text)==5 )  ){
                        return nameA;
                    }else if(len(text)>4){
                        let html=nameA.substring(0,2)+'</br>'+nameA.substring(2);
                        this.shareCustom[index].logoNameFlag=true;                        
                        return '<span class="wk">'+html+'</span>';
                    }else{
                        return '<span>'+nameA+'</span>';
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    this.shareCustom[index].logoNameFlag=true;  
                    return  '<span class="wk">'+html+'</span>';
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.shareCustom[index].logoNameFlag=true;  
                    return  '<span class="wk">'+html+'</span>';
                }else{
                    return  '<span>'+text+'</span>';
                }
                
            }
            
        },
        removeShare(item){
            // if(item.flag){
            //     this.isAll=true
            //     $('.outcustom-btn-box').css('width','165px');
            // }
            let len = this.userInitData.data.items.list.length
            for(let i=0;i<len;i++){
                if(item.userId ==this.userInitData.data.items.list[i].userId){
                    this.userInitData.data.items.list[i].flag=!item.flag;
                }
            }
            let shareLen = this.shareCustom.length;
            let myShare = objDeepCopy(this.shareCustom)
            for(let j=0;j<shareLen;j++){
                if(myShare[j].userId==item.userId){
                    myShare.splice(j,1);
                    break;
                }
            }
            this.ShareCustom(myShare)
            
        },
        toCompanyDetail(id){
            this.$router.push({path:'/page/job/companyDetail',query:{id:id}})
        },
        initAddress(){
            let that = this
            document.body.addEventListener('touchstart',function(){
                that.$nextTick(function(){
                    if($("#mysearch").length>0){
                        $("#mysearch")[0].blur()
                    }
                })
            })
            $("#mysearch").focus(function(){
                document.getElementById('nav').style.height=document.body.offsetHeight-43.5+'px'
            })
        },
        ...mapMutations({
            INITCOMPANYOBJ:'addressBook/INITCOMPANYOBJ',
            FLAGFORINIT:'addressBook/FLAGFORINIT',
            ShareCustom: 'user/SHARECUSTOM',
            hideLoading:'UPDATE_LOADING'
        }),
        ...mapActions({
            GETXSUSERLIST:'addressBook/GetXsUserList',
        }),
        clearSearch(){
            this.searchVal=''
            this.isSearchVal = false
        },
        initTest(pos){
            let that = this
            
            this.$nextTick(function(){
                this.$refs.scroller.reset()
            })
            
            let arr = that.companyObj
            let arrLen = that.companyObj.length
            if($("#test1").length>0){
                for(let i=0;i<arrLen;i++){
                    let name = arr[i].name=='#' ? 'first' : arr[i].name
                    if(pos.top-$("#"+name)[0].offsetTop>-10 && pos.top-$("#"+name)[0].offsetTop<$("#"+name)[0].offsetHeight){
                        that.fixedVal = arr[i].name
                    }
                }
                if(pos.top<0){
                    $(".fix-header").hide()
                }else{
                    $(".fix-header").show()
                }
            }
        },
        textClick(id){
        },
        goAnchor(selector) {
            let navId = selector
            var anchor = this.$el.querySelector("#"+navId)
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top: anchor.offsetTop+10
                })
                this.fixedVal = navId=='first'?"#":navId
            })
            
        },
        searchCustomStaff(){
            
        },
        selectMember(item){ 

            
            // item.flag=!item.flag;
            if(this.isRadioChoice){
                this.companyObj.forEach(function(items){
                    items.childrenList.forEach(function(ite){
                        if(ite.userId==item.userId){
                            ite.flag=true;
                        }else{
                            ite.flag=false;
                        }
                    })
                },this)
                let _arr=[]
                _arr.push(item)
                this.ShareCustom(_arr)
            }else{
                item.flag=!item.flag
                let _arr = objDeepCopy(this.shareCustom);
                let len = this.shareCustom.length;
                if(this.shareCustom.length>0){
                    if(item.flag){
                        for(let i=0;i<len;i++){
                            if(this.shareCustom[i].userId!==item.userId){
                                _arr.push(item);
                                break ;
                            }
                        }
                    }else{
                        for(let i=0;i<len;i++){
                            if(this.shareCustom[i].userId==item.userId){
                                _arr.splice(i,1);
                                break ;
                            }
                        }
                    }
                    
                }else{
                    _arr.push(item)
                }
                if(_arr.length==this.userInitData.data.items.list.length){
                    this.isAll=false;
                    // $('.outcustom-btn-box').css('width','224px');
                }
                this.ShareCustom(_arr)
            }
            

            
        },
        handleSelectMember(userId,obj,flag){
            let that = this
            
        },
        selectOneMember(key,obj){//单选企业员工
            
        },
        arrRemove(arr,val){//数组中包含删除
            var index = arr.indexOf(val);
            if (index > -1) {
                arr.splice(index, 1);
            }
        },
        toAddCustom(){
            this.$router.push('/page/job/addCustom')
        },
        isAllSelect(){
            this.isAll=!this.isAll;
            if(!this.isAll||this.userInitData.data.items.list.length!==this.shareCustom.length){
                $('.outcustom-btn-box').css('width','180px');
                this.ShareCustom(this.userInitData.data.items.list)
                this.userInitData.data.items.list.forEach(function(item){
                    item.flag=true;
                })
                this.isAll=false
            }else{
                $('.outcustom-btn-box').css('width','165px');
                $('.outcustom-btn-box').css('boxShadow','0 5px 5px 0 #fff');
                this.ShareCustom([])
                this.userInitData.data.items.list.forEach(function(item){
                    item.flag=false;
                })
                this.isAll=!this.isAll;
            }
        },
        confirmHand() {
            this.$emit('confirm', this.shareCustom)
        },
    },
    computed: {
        ...mapState({
           storeUserList:state => state.addressBook.storeUserList,
           userInitData:state => state.addressBook.userInitData,
           flagForInit:state => state.addressBook.flagForInit,
           shareCustom:state => state.user.shareCustom
        }),
    },
    watch: {
        shareCustom(data){
            let width = data.length*63+'px'
            this.$nextTick(function(){
                $(".selected-member ul").css('width',width)
                if($(".selected-member").length>0){
                    let _width=$(".selected-member")[0].offsetWidth
                    if(_width<data.length*63){
                        $('.outcustom-btn-box').css('boxShadow','0 5px 5px 0 #888')
                    }else{
                        $('.outcustom-btn-box').css('boxShadow','0 5px 5px 0 #fff')
                    }
                }
            })
        },
        storeUserList:function(arr){
            arr.forEach(item => {
                item.childrenList.forEach(v => {
                    v.logoNameFlag=false
                    v.color= parseInt(Math.random()*3+1)
                })
            })
            this.companyObj = arr
        },
        userInitData:function(data){
            let re = new RegExp("^[A-Z]+$"); 
            if(data.data.msg_alert){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:"20em"                                
                }) 
            }
            
        },
        companyObj:function(vakue){
            if(vakue.length==0){
                this.ischange = false
            }else{
                this.fixedVal = vakue[0].name
            }
        },
        flagForInit:function(data){
            //保证每次进这个页面都会重新进行请求数据，方便数据初始化
            let obj = {}
            obj.userId=this.user_id
            obj.companyId=this.company_id
            this.GETXSUSERLIST(obj)
            this.range = true
            this.scrollHeight='-88'
        },
        searchVal:function(value){
            value = $.trim(value)
            if(value.length>0){
                this.isSearchVal=true
                let that = this
                let arr = this.companyObj
                let new_arr = []
                let reg = '/'+this.searchVal+'/'
                reg = eval(reg)
                arr.forEach(function(items){
                    items.childrenList.forEach(function(item){
                        if(reg.test(item.userName)){
                            new_arr.push(item)
                        }
                    })
                })
                
                this.$nextTick(function(){
                    this.$refs.scroller.reset({
                        top: 0
                    })
                })
                
                this.searchList = new_arr
                
            }else{
                this.isSearchVal=false
            }
        },
        fixedVal:function(data,oldVal){
        }
    },
    components: {
        CellBox,
        Group,
        Cell,
        Search,
        CheckIcon,
        Scroller,
        XButton,
        ButtonTab,
        ButtonTabItem,
        Icon,
    },
}
</script>
<style lang="less">
html,body{
    overflow:hidden;
    
}   
    .out-custom-footer{
        width:100%;
        height: 70px;
        display: flex;
        background: #fff;
    }
    .selected-member{
        flex: 1;
        overflow: hidden;
        overflow-x: auto;
        ul{
            min-width: 120px;
            height: 70px;
            box-sizing: border-box;
            padding-left:15px ;
            overflow: hidden;
            padding-top:7px;
            padding-bottom:7px;
            li{
                width:50px;
                height: 50px;
                margin-right: 5px;
                float: left;
                display: flex;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;
                p{
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    text-align: center;
                }
                aside{
                    width: 35px;
                    height: 35px;
                    border-radius: 10em;
                    color:  @white;
                    text-align: center;
                    
                    margin-left: 7px;
                    font-size:12px;
                    img{
                        width: 100%;
                        height: 100%;
                        display: block;
                        border-radius: 10em;
                    }
                    span{
                        padding:0 2px;
                        overflow: hidden;
                        display:block;
                        word-wrap:break-word;
                        word-break:break-all;
                        white-space: pre-line;
                        line-height: @head-small;
                    }
                    .wk{
                        line-height: 1.3em;
                        // margin-top: 5px;
                        font-size:11px;
                    }
                }
            }
        }
    }
    .outcustom-btn-box{
        display: flex;
        justify-content:space-around;
        align-items: center;
        z-index: 100;
        // box-shadow: 0 5px 5px 0 #888;
        .weui-btn{
            width:auto;
            margin: 0;
            font-size: 14px;
            height: 27px;
            line-height: 27px;
        }
        .weui-btn + .weui-btn{
            margin: 0;
            font-size: 14px;
            height: 27px;
            line-height: 27px;
        }
    }
    .customStaff{
        .vux-check-icon{
            height: 45px;
            display: flex;
            align-items: center;
            span{
                flex: 1;
                height: 100%;
                box-sizing:border-box;
                border-bottom:1px solid #eeeeee;
                display: inline-block;
                line-height: 45px;
            }
        }
        .all-select{
            padding-top:15px;
            box-sizing: border-box;
            // background: #e9e9e9;
            .vux-check-icon{
                background: #fff;
            }
        }
        .seach-list{
            .fix-header{
                background:#f7f7f7 !important; 
                line-height: 30px;
            }
        }
        .post-list{
            box-sizing: border-box;
            padding:0 0 0 15px;
            .last-child{
                box-sizing: border-box;
                padding:0 0 0 15px;
            }
        }
        .weui-cell:before{
            border: none;
        }
        .vux-button-group{
            background: #efeff4;
        }
        .mytitle{
            .weui-cells__title{
                margin-top:0;
                margin-bottom: 0;
                line-height: 23px;
                background: #f7f7f7;
            }
        }
        
        .weui-cell_access{
            border-bottom: 1px solid #f5f5f5;
        }
        .delAffert::after{
            display: none;
        }
        .select-btn{
            font-size:16px; 
        }
        
        .weui-cell_access{
            line-height: 30px;
            font-size:15px; 
        }
        .vux-check-icon span{
            font-size:15px;
        }
    }
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
