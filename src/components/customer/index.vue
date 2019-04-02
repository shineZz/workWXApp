<template>
    <div  class="customer">
        <div class="search-box-hd">
            <section>
                <search
                    v-model="searchVal"
                    position="absolute"
                    auto-scroll-to-top
                    placeholder="请输入姓名、手机号" 
                    top="0"
                    @on-focus="onFocus"
                    @on-cancel="onCancel"
                    @on-submit="onSubmit"
                    @on-change="searchChange"
                    ref="search">
                </search>
            </section>
            <aside v-if="parentId&&has_p"><a href="javascript:" @click="goHand" >上一级</a></aside>
        </div>
        
        <div  class="customer-md" >
            <scroller  
                
                lock-x  
                scrollbarY 
                @on-scroll="OnScroll" 
                ref="scroller" 
                height="-114"
                :scroll-bottom-offst="0">
                <div  v-if="ArrData.length==0&&user_list.length==0&& initData.length ==0 " class="wu-all wu-allB">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>暂无部门、人员数据</p>
                    </section>
                </div>
                <div v-show="isRender" style="overflow:hidden" v-else>
                    <div v-if="!searchColleague&&propsState==2">
                        <div  v-if="ArrData.length==0&&initData.length==0" class="wu-all wu-allB">
                            <section>
                                <div><img src="~@/images/wu-icon1.png"></div>
                                <p>暂无部门、人员数据</p>
                            </section>
                        </div>
                        <div class="company-all" v-if="ArrData.length>0">
                            <article class="vux-1px-b" v-for="(item,index) in ArrData" :key="index">
                            <section @click="Number(item.userCount) >0?LinkHand(index,item.departId,item.parentId,item.remark):''" :class="Number(item.userCount) >0?'arrow':''">{{item.deptName}}</section>
                            </article>
                        </div>
                        <a href="javascript:void(0)" class="vux-1px-b listA-box" v-for="(item,index) in initData" :key="index" @click="checkType(index,item)">                
                            <aside  v-if="item.headPortrait||item.img"><img :src="item.headPortrait||item.headPortrait||item.img?item.headPortrait||item.headPortrait||item.img:'@/images/xsdefult.jpg'" :alt="item.name" :onerror="logo"></aside>
                            <aside v-else :class="'c-'+item.color" ><span  v-html="NameHand(item.name,index)" :class="item.logoNameFlag?'wk':''" /> </aside>
                            <section>
                                <div class="hd">
                                    <h6>{{item.name}}</h6>
                                    <p v-if="item.state && item.time">{{item.state}}/{{item.time}}</p>
                                </div>
                                <div class="md">
                                    <p >{{item.work}}</p>  
                                    <div class="vux-check-icon" ><i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i></div>
                                    
                                </div>
                                <div class="fd" v-if="item.label && item.label.length>0">
                                    <span v-for="(it,i) in item.label" :key="i" >{{it}}</span>
                                </div>
                            </section>
                        </a>
                    </div>
                    <div v-if="searchColleague&&propsState==2">
                        <div  v-if="searchList.length==0" class="wu-all wu-allB">
                            <section>
                                <div><img src="~@/images/wu-icon1.png"></div>
                                <p>根据你的搜索条件未找到匹配的<br>结果，请更换搜索条件</p>
                            </section>
                        </div>
                        <a href="javascript:void(0)" v-else class="vux-1px-b listA-box" v-for="(item,index) in searchList" :key="index" @click="checkType(index,item)">                
                            <aside  v-if="item.headPortrait||item.img"><img :src="item.headPortrait||item.headPortrait||item.img?item.headPortrait||item.headPortrait||item.img:'@/images/xsdefult.jpg'" :alt="item.name" :onerror="logo"></aside>
                            <aside v-else :class="'c-'+item.color" ><span  v-html="NameHand(item.name,index)" :class="item.logoNameFlag?'wk':''" /> </aside>
                            <section>
                                <div class="hd">
                                    <h6>{{item.name}}</h6>
                                    <p v-if="item.state && item.time">{{item.state}}/{{item.time}}</p>
                                </div>
                                <div class="md">
                                    <p >{{item.work}}</p>  
                                    <div class="vux-check-icon" ><i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i></div>
                                    
                                </div>
                                <div class="fd" v-if="item.label && item.label.length>0">
                                    <span v-for="(it,i) in item.label" :key="i" >{{it}}</span>
                                </div>
                            </section>
                        </a>
                    </div>
                    <div v-if="!searchColleague&&propsState==1">
                        <div  v-if="ArrData.length==0&&initData.length==0" class="wu-all wu-allB">
                            <section>
                                <div><img src="~@/images/wu-icon1.png"></div>
                                <p>暂无部门、人员数据</p>
                            </section>
                        </div>
                        <div class="company-all" v-if="ArrData.length>0">
                            <article class="vux-1px-b" v-for="(item,index) in ArrData" :key="index">
                            <section @click="LinkHand(index,item.departId,item.parentDepartId)" class="arrow">{{item.departName}} </section>
                            </article>
                        </div>
                        <a href="javascript:void(0)" class="vux-1px-b listA-box" v-for="(item,index) in initData" :key="index" @click="checkType(index,item)">                
                            <aside  v-if="item.headPortrait||item.img"><img :src="item.headPortrait||item.headPortrait||item.img?item.headPortrait||item.headPortrait||item.img:'@/images/xsdefult.jpg'" :alt="item.name" :onerror="logo"></aside>
                            <aside v-else :class="'c-'+item.color" ><span  v-html="NameHand(item.name,index)" :class="item.logoNameFlag?'wk':''" /> </aside>
                            <section>
                                <div class="hd">
                                    <h6>{{item.name}}</h6>
                                    <p v-if="item.state && item.time">{{item.state}}/{{item.time}}</p>
                                </div>
                                <div class="md">
                                    <p class='mr22'>{{item.work}}</p>  
                                    <div class="vux-check-icon" ><i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i></div>
                                    
                                </div>
                                <div class="fd" v-if="item.label && item.label.length>0">
                                    <span v-for="(it,i) in item.label" :key="i" >{{it}}</span>
                                </div>
                            </section>
                        </a>
                    </div>
                    <div v-if="searchColleague&&propsState==1">
                        <div  v-if="searchList.length==0" class="wu-all wu-allB">
                            <section>
                                <div><img src="~@/images/wu-icon1.png"></div>
                                <p>根据你的搜索条件未找到匹配的<br>结果，请更换搜索条件</p>
                            </section>
                        </div>
                        <div v-else>
                            <a  href="javascript:void(0)" class="vux-1px-b listA-box" v-for="(item,index) in searchList" :key="index" @click="checkType(index,item)">                
                                <aside  v-if="item.headPortrait"><img :src="item.headPortrait||item.headPortrait||item.img?item.headPortrait||item.headPortrait||item.img:'@/images/xsdefult.jpg'" :alt="item.name" :onerror="logo"></aside>
                                <aside v-else :class="'c-'+item.color" ><span  v-html="NameHand(item.name,index)" :class="item.logoNameFlag?'wk':''" /> </aside>
                                <section>
                                    <div class="hd">
                                        <h6>{{item.name}}</h6>
                                        <p v-if="item.state && item.time">{{item.state}}/{{item.time}}</p>
                                    </div>
                                    <div class="md">
                                        <p >{{item.work}}</p>  
                                        <div class="vux-check-icon" ><i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i></div>
                                    </div>
                                    <div class="fd" v-if="item.label && item.label.length>0">
                                        <span v-for="(it,i) in item.label" :key="i" >{{it}}</span>
                                    </div>
                                </section>
                            </a>
                        </div>
                        
                    </div>
                </div>
                
            </scroller>
        </div>
        <footer class="customer-fd vux-1px-t" v-if="isOnlyCustomer">
            <div class="touxiang" >
               <ul v-if="shareCustom.length>0">
                   <li v-for="(i,index) in shareCustom" :key="index" @click="removeShare(i)">
                       <aside  v-if="i.headPortrait||i.img"><img :src="i.headPortrait||i.img?i.headPortrait||i.img:'@/images/xsdefult.jpg'" :alt="i.name" :onerror="logo"></aside>
                       <aside v-else :class="'c-'+i.color" ><span  v-html="NameHand(i.name,i.userId)" :class="i.logoNameFlag?'wk':''" /> </aside>
                        <p style="text-align:center;">{{i.name}}</p>
                    </li>
               </ul>
               <div v-else style="line-height:70px;margin-left:10px;">
                   {{shareMsg}}
                </div>
            </div>
            <!-- :disabled="shareCustom.length==0" -->
            <div class="btn-sub"><x-button mini type="primary"   @click.native="hideCuster">确定({{shareCustom.length}})</x-button></div>
        </footer>
    </div>
</template>
<script>
import { Scroller, Search,XButton } from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';
import listA from '@/components/listA';
import { objDeepCopy } from '@/util';
import VueEmit from '@/util/vueEimt';
export default {
    name: 'customer',
    props: ['toggleCustomer','propsState', 'btn','radioChoice','hintType'],
    data() {
        return {
           results: [],
            value: '',
            shareMsg:'选择同事',
            listData:[],
            isSelect:false,        
            dataFlag:false,
            searchFlag:true,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            deptId: this.$store.state.userInfo.user.departId,
            ArrData:[],            
            departListData:[],
            userArr:[],
            radioFlag:false,
            parentId:'',
            departId:'',
            isAll:false,
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
            isOnlyCustomer:false,
            searchColleague:false,
            searchList:[],
            searchVal:'',
            flagArr:[],
            depart_arr:[],
            firstSub:[],
            has_p:false,
            user_list:[],
            initData:[],
            btnFlag: false,
            upUserArr:[],
            alertMsg:'加载中...',//第一次
            isRender:false,//数据渲染完成之后在显示
        }
    },
    created() {
        
        if(this.propsState==1){//propsState1为选择下属。2为选择同事
            this.shareMsg="选择同事"
        }
        if(this.hintType==1){
            this.shareMsg="选择同事转移此客户"
        }else if(this.hintType==2){
            this.shareMsg="选择同事共享此客户"
        }
        this.UPDATE_LOADING(true)
        let obj = {
            userId:this.userId,
            companyId:this.companyId,
        }
        this.DepartMentListHand(obj)
        //获取初始化的已经别选中的人
        // this.resultChoice   会被赋值，表示为选中的结果
        this.ShareCustom(objDeepCopy(this.resultChoice))
        if(this.btn){
            this.isOnlyCustomer=true;
            if(this.shareCustom.length>0){
                let width = this.shareCustom.length*60+5+'px'
                this.$nextTick(function(){
                    $(".touxiang ul").css('width',width)
                })
            }else{
                this.ShareCustom([])
            }
        }
        
    },
    
    components: {        
       Scroller,Search,listA,XButton 
    },  
    mounted(){
        let _this = this
        VueEmit.$on('custome',function(data){//接收selectedMsg参数
            _this.hasParent(data.departId)
            let my_Arr=[]
            _this.userArr.filter(function(items){
                if(items.userId==data.userId){
                    items.flag=false;
                };
                my_Arr.push(items)
            })
            _this.userArr = my_Arr;
        })
    },
    computed: {
        ...mapState({
            departMentData:state => state.company.departMentData,        
            userListData:    state => state.user.userListData, 
            data:state => state.data,  
            departUserListData: state => state.user.departUserListData,
            shareCustom: state => state.user.shareCustom,
            departAndUserData:state => state.permissiondata.departAndUserData,
            resultChoice:state => state.user.resultChoice,

        })       
    },
    watch: {
        departAndUserData(data){
            this.UPDATE_LOADING(false)
            let _share = objDeepCopy(this.shareCustom)
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                this.alertMsg=data.alert_msg
            }else{
                let _arr = data.items.departs;
                let init_arr = data.items.departs;
                let _user = data.items.users;
                let _depart_arr = []
                let arr = []
                //部门重组
                _arr.forEach(function(item){
                    item.departArr=item.departDisplayId.split('^')
                    item.departArr.shift();
                    _depart_arr = _depart_arr.concat(item.departArr)
                })
                _depart_arr.sort()
                for (var i = 0; i < _depart_arr.length;) {
                    var count = 0;
                    for (var j = i; j < _depart_arr.length; j++) {
                        if (_depart_arr[i] === _depart_arr[j]) {
                        count++;
                        }
                    }
                    arr.push({
                        departId: _depart_arr[i],
                        count: count
                    })
                    i+=count;
                }
                let dataDepartment = this.companyTree2(this.ArrData,arr)
                this.firstSub = dataDepartment
                this.ArrData=[]; 
                for(let i=0;i<dataDepartment.length;i++){
                    this.departList(dataDepartment[i].children);
                }
                this.departListData=JSON.parse(JSON.stringify(this.ArrData));
                this.ArrData = this.firstSub
                //人员重组
                
                if(this.shareCustom.length>0){
                    for(let i=0,len = _user.length;i<len;i++){
                        _user[i].flag=false
                        _user[i].color=parseInt(Math.random()*3+1)
                        for(let j=0;j<this.shareCustom.length;j++){
                            if(_user[i].userId==this.shareCustom[j].userId){
                                _user[i].flag=true;
                                break;
                            }
                        }
                    }
                }else{
                     _user.forEach(function(items){
                        items.flag=false
                        items.color=parseInt(Math.random()*3+1)
                    })
                }
                this.user_list = _user
                let upUserArr = []
                for(let i=0;i<_user.length;i++){
                    _user[i].num=0
                    for(let j=0;j<init_arr.length;j++){
                        if(_user[i].departId==init_arr[j].departId&&init_arr[j].parentDepartId!=0){
                            _user[i].num++
                            break;
                        }else{
                            
                        }
                    }
                }
                this.upUserArr=[]
                _user.forEach(function(item){
                    if(item.num!=1){
                        this.upUserArr.push(item)
                    }
                },this)
                this.initData=this.upUserArr
                this.isRender = true
            }
        },
        departMentData(data){   //组织架构    
            if(Object.keys(data).length >0){
                 if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.alertMsg=data.alert_msg
                }else{  
                    this.isRender = true
                    this.departId = data.items[0].departId ;
                    
                    this.ArrData=[]; 
                    this.departList(data.items[0].children);
                    this.departListData=JSON.parse(JSON.stringify(this.ArrData));
                    let Arr=[];
                    this.ArrData.forEach(function(item,index){
                        if(item.parentId==data.items[0].departId){
                            Arr.push(item)
                        }
                    },this); 

                    this.ArrData=Arr;
                    if(this.propsState==2){
                        let obj = {
                            userId:this.userId,
                            companyId:this.companyId,
                        }
                        this.UserListHand(obj);
                    }else if(this.propsState==1){
                        let obj1 = {
                            company_id:this.companyId,
                            user_id:this.userId
                        }
                        this.permissiondata_getPermissionDeptAndUserList(obj1)
                    }
                }
            }
        },
        userListData(data){//企业员工
            this.UPDATE_LOADING(false)
            if(Object.keys(data).length >0){
                 if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.alertMsg=data.alert_msg
                }else{ 
                    let Arr=[];
                    let Data=[];
                    data.items.list.forEach(function(item,index){
                        let obj= {
                            name:item.userName,
                            img:item.headPortrait,
                            work:item.position,
                            userId:item.userId,
                            flag:false,
                            logoNameFlag:item.logoNameFlag,
                            color: parseInt(Math.random()*3+1),
                            deptId:item.deptId,
                            type:1,
                            mobile:item.mobile,
                            
                        }
                        Data.push(obj);                        
                        
                    },this);
                    let customLen = Data.length;
                    let shareLen = this.shareCustom.length;
                    if(this.shareCustom.length>0){
                        for(let i=0;i<shareLen;i++){
                            for(let j=0;j<customLen;j++){
                                if(this.shareCustom[i].userId==Data[j].userId){
                                    Data[j].flag=true;
                                }
                            }
                        }
                    }
                    this.userArr=JSON.parse(JSON.stringify(Data));
                }
            }

        },
        userArr(data){
            let Arr =[];
            data.forEach(function(item){
                if(item.deptId==this.departId){
                        Arr.push(item)
                    }
            },this)
            this.initData= Arr;
        },
        shareCustom(data){
            let width = data.length*60+5+'px'
            this.$nextTick(function(){
                $(".touxiang ul").css('width',width)
            })
        }
    },
    methods: {
        ...mapActions({
            DepartMentListHand: 'company/departMentList',
            UserListHand:'user/userList',
            permissiondata_getPermissionDeptAndUserList:'permissiondata/getPermissionDeptAndUserList',
            customer_customerWorkerList:'customer/customerWorkerList'
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
            ShareCustom: 'user/SHARECUSTOM',
            ResultChoice:'user/RESULTCHOICE',
            UPDATE_LOADING:'UPDATE_LOADING'
        }),
        companyTree2(data,countArr){
            let Arr=[];
            data.forEach(function(item,i){   
                countArr.forEach(function(at,ai){ 
                    if(at.departId==item.departId){
                    let obj={
                        departId:item.departId,
                        departName:item.deptName,
                        userCount:at.count,
                        deptLevel:item.deptLevel,
                        key:item.departId,
                        idKey:item.idKey,
                        treeFlag:false,
                        parentDepartId:item.parentId
                    }
                    if(item.children){      
                        obj.children=this.companyTree2(item.children,countArr);              
                    }
                    Arr.push(obj)
                    }
                },this) 
            },this)
            return Arr
        },
        compare(property){
            return function(a,b){
                var value1 = a[property].length;
                var value2 = b[property].length;
                return value1 - value2;
            }
        },
        hideCuster(){
            this.btnFlag = true
            let result = objDeepCopy(this.shareCustom)
            this.$emit('toggleCustomer', result)
            this.ResultChoice(result)
            setTimeout(()=>this.btnFlag=true, 3000)
        },
        hasParent(departId){
            let my_arr = this.departListData
            for(let i=0;i<my_arr.length;i++){
                if(departId==my_arr[i].departId){
                    my_arr[i].remark=false;
                    if(this.departListData[i].parentId){
                    }
                }
            }
            this.departListData = my_arr
        },
        removeShare(item){
            this.hasParent(item.departId)
            let _this = this
            let my_Arr=[]
            if(this.user_list.length>0){//下属
                this.user_list.filter(function(items){
                    if(items.userId==item.userId){
                        items.flag=false;
                    };
                    my_Arr.push(items)
                })
                this.user_list = my_Arr;
            }
            if(this.userArr.length>0){//同事
                for(let i=0,len=this.userArr.length;i<len;i++){
                    if(this.userArr[i].userId==item.userId){
                        this.userArr[i].flag=false
                        break;
                    }
                }
            }

            let customArr = objDeepCopy(_this.shareCustom)
            let len = this.shareCustom.length
            for(let i=0;i<len;i++){
                if(customArr[i].userId==item.userId){
                    customArr.splice(i,1);
                    break ;
                }
            }
            this.ShareCustom(customArr)
        },
        acceptChild(data,departId){
            if(data==0){
                this.isAll=false;
            }else{
                this.isAll=true;
            }
        },
        //部门重组
        departList(data){
            if(data){
                data.forEach(function(item,index){
                    let obj=item;
                    obj.remark=false; 
                    this.ArrData.push(obj); 
                    if(typeof(item.children)!='undefined'){
                        this.departList(item.children)
                    }
                    
                },this)
            }
        },
        //选择部门
        LinkHand(index,departId,parentId,remark){
            if(this.propsState==1){//下属
                this.has_p=true
                this.$refs.scroller.reset({
                    top:0
                })
                this.parentId=parentId;
                let Arr=[]
                this.departListData.forEach(function(item,index){
                    if(item.parentDepartId==departId){
                        Arr.push(item)
                    }
                },this);
                this.ArrData=Arr;
                let Data=[];
                this.user_list.forEach(function(item,index){                     
                    if(item.departId==departId){
                        Data.push(item)
                    }
                },this);
                this.initData=Data;  
            }else if(this.propsState==2){//同事
                this.$refs.scroller.reset({
                    top:0
                })
                this.has_p=true
                this.parentId=parentId;
                let Arr=[]
                this.departListData.forEach(function(item,index){
                    if(item.parentId==departId){
                        Arr.push(item)
                    }
                },this);
                this.ArrData=objDeepCopy(Arr);
                if(Arr.length==0){
                    this.initData.isSelect = remark
                }
                let Data=[];
                this.departId = departId;
                this.userArr.forEach(function(item,index){                     
                    if(item.deptId==departId){
                        Data.push(item)
                    }
                },this);
                this.initData=Data;  
            }        
        },
        //上一级
        goHand(){
            let Arr=[];
                let parentId='';
                let flag = true;
                this.$refs.scroller.reset({
                    top:0
                })
            if(this.propsState==1){
                
                this.has_p=true
                if(this.ArrData.length>0){
                    let myParentId = this.ArrData[0].parentDepartId
                    
                    for(let i=0;i<this.departListData.length;i++){
                         if(this.departListData[i].departId==myParentId ){
                            parentId=this.departListData[i].parentDepartId
                            break ;
                        }
                    }
                    if(parentId){
                        this.departListData.forEach(function(item,index){
                            if(item.parentDepartId==parentId ){
                                Arr.push(item)
                            }
                        },this);
                    }else{
                        this.has_p=false
                        this.ArrData = this.firstSub
                        this.initData=this.upUserArr
                        return ;
                    }
                    
                }else{
                    let _i = 0
                    if(this.parentId){

                        for(let i=0;i<this.firstSub.length;i++){
                            if(this.firstSub[i].parentDepartId==this.parentId){
                                //最上层的时候，this.parentId如果等于最上层的里面的其中一个的话，就展示最上层
                                this.has_p=false
                                this.ArrData = this.firstSub
                                this.initData=this.upUserArr
                                return ;
                            }
                        }
                        this.departListData.forEach(function(item,index){
                            if(item.parentDepartId==this.parentId){
                                Arr.push(item)
                            }
                        },this);
                    }else{
                        this.has_p=false
                        this.ArrData = this.firstSub
                        this.initData=this.upUserArr
                        return ;
                    }
                    
                }
                this.ArrData = Arr
                let Data=[];
            
                this.user_list.forEach(function(item,index){                     
                    if(item.departId==this.parentId){
                        Data.push(item)
                    }
                },this);
                this.initData = Data
            }else{
                this.has_p=true
                if(this.ArrData.length>0){
                    let myParentId = this.ArrData[0].parentId
                    this.departListData.forEach(function(item,index){
                        if(item.parentId==this.parentId){
                            let key=item.key.split("-");
                            parentId=key[item.deptLevel-2]   
                            for(let j=0;j<this.ArrData.length;j++){
                                if(!this.ArrData[j].remark&&item.departId==myParentId){
                                    item.remark=false;
                                    flag = false;
                                    break;
                                }else if(this.ArrData[j].remark&&item.departId==myParentId){
                                    item.remark=true
                                }
                            }
                            Arr.push(item)
                        }
                    },this);
                }else{
                    this.departListData.forEach(function(item,index){
                        if(item.parentId==this.parentId){
                            let key=item.key.split("-");
                            parentId=key[item.deptLevel-2]  
                            Arr.push(item)
                        }
                    },this);
                }
                if(this.initData.length>0){
                    for(let i=0;i<Arr.length;i++){
                        for(let j=0;j<this.initData.length;j++){
                            if(Arr[i].departId==this.initData[j].deptId){
                                if(flag){
                                    if(!this.initData[j].flag){
                                        Arr[i].remark = false;
                                        break ;
                                    }else{
                                        Arr[i].remark = true;
                                    }
                                }else{
                                    Arr[i].remark = false;
                                }
                                
                            }
                            
                        }
                    }
                }
                this.ArrData=Arr;
                
                let Data=[];
                this.userArr.forEach(function(item,index){                     
                    if(item.deptId==this.parentId){
                        Data.push(item)
                    }
                },this);
                this.parentId= parentId==0?'':parentId;
                this.departId = Arr[0].parentId;
                this.initData=Data; 
            }
        },
        OnScroll(){
            this.$nextTick(() => {
                this.$refs.scroller.reset()
            })
        },
        setFocus () {
            this.$refs.search.setFocus()
        },
        resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
        getResult (val) {
            this.results = val ? getResult(this.value) : []
        },
        onSubmit () {
            let value = $.trim(this.searchVal)
            if(value.length>0){
                this.searchColleague=true
                let that = this
                let arr 
                if(this.propsState==1){
                    
                    arr = this.user_list
                }else if(this.propsState==2){
                    arr = this.userArr
                }
                let new_arr = []
                let reg = '/'+this.searchVal+'/'
                reg = eval(reg)
                arr.forEach(function(items){
                    if(reg.test(items.name)||reg.test(items.mobile)){
                        new_arr.push(items)
                    }
                })
                this.$nextTick(function(){
                    this.$refs.scroller.reset({
                        top: 0
                    })
                })
                this.searchList = new_arr
            }else{
                this.searchColleague=false
            }
        },
        onFocus () {
        },
        onCancel () {
            this.searchColleague=false
        },
        confirmHand() {
            this.$emit('toggleCustomer')
        },
        //选择
        checkType(index,item){
            var myCustome = this.shareCustom;
            let shareLen = this.shareCustom.length;
            let msg_alert = ''
            if(this.$route.path=='/page/selectedMsg'){
                if(item.userId==this.userId){
                    msg_alert = '不能添加自己为收件人'
                    this.$vux.toast.show({
                        text: msg_alert,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
                    return ;
                }
                
            }else if(this.$route.path=='/page/customPage'){
                if(item.userId==this.userId){
                    msg_alert = '不能选择自己'
                    this.$vux.toast.show({
                        text: msg_alert,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
                    return ;
                }
            }else if(this.$route.path=='/page/myCustom'){
                if(item.userId==this.userId){
                    msg_alert = '不能选择自己'
                    this.$vux.toast.show({
                        text: msg_alert,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
                    return ;
                }
            }
            if(this.propsState==1){
                let len = this.user_list.length;
                if(this.radioChoice==1){//单选
                    for(let i=0;i<len;i++){
                        if(this.user_list[i].userId==item.userId){
                            this.user_list[i].flag=!this.user_list[i].flag;
                        }else{
                            this.user_list[i].flag=false;
                        }
                    }
                    
                    let _arr = []
                    if(item.flag){
                        _arr.push(item)
                    }
                    this.ShareCustom(_arr)
                    this.$emit('changeShare',_arr)
                }else{//多选
                    if(item.flag){
                        for(let i=0;i<shareLen;i++){
                            if(myCustome[i].userId==item.userId){
                                shareLen--
                                myCustome.splice(i,1)
                            }
                        }
                        this.$emit('changeShare',myCustome)
                        this.ShareCustom(myCustome)
                    }else{
                        myCustome.push(item)
                        this.ShareCustom(myCustome)
                        this.$emit('changeShare',myCustome)
                    }
                    for(let i=0;i<len;i++){

                        if(this.user_list[i].userId==item.userId){
                            this.user_list[i].flag=!this.user_list[i].flag;
                        }
                    }
                    
                }
            }else{
                let len = this.userArr.length;
                if(this.radioChoice==1){//单选
                    for(let i=0;i<len;i++){
                        if(this.userArr[i].userId==item.userId){
                            this.userArr[i].flag=!this.userArr[i].flag;
                        }else{
                            this.userArr[i].flag=false;
                        }
                    }
                    let _arr = []
                    if(item.flag){
                        _arr.push(item)
                    }
                    this.ShareCustom(_arr)
                    this.$emit('changeShare',_arr)
                }else{//多选
                    if(item.flag){
                        for(let i=0;i<shareLen;i++){
                            if(myCustome[i].userId==item.userId){
                                shareLen--
                                myCustome.splice(i,1)
                            }
                        }
                        this.$emit('changeShare',myCustome)
                        this.ShareCustom(myCustome)
                    }else{
                        myCustome.push(item)
                        this.ShareCustom(myCustome)
                        this.$emit('changeShare',myCustome)
                    }
                    for(let i=0;i<len;i++){
                        if(this.userArr[i].userId==item.userId){
                            this.userArr[i].flag=!this.userArr[i].flag;
                        }
                    }
                    // this.userArr = _data
                }
            }
            
        },
        searchChange(val){
            if(val.length>0){
                let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
                let value = val.replace(reg,'')
                if(value.length>20){
                    value = value.substring(0,20)
                }
                setTimeout(() => {
                    this.searchVal = value;
                    this.searchColleague=true
                    let that = this
                    let arr 
                    if(this.propsState==1){
                        arr = this.user_list
                    }else if(this.propsState==2){
                        arr = this.userArr
                    }
                    let new_arr = []
                    let myreg = '/'+this.searchVal+'/'
                    myreg = eval(myreg)
                    arr.forEach(function(items){
                        if(myreg.test(items.name)||myreg.test(items.mobile)){
                            new_arr.push(items)
                        }
                    })
                    this.$nextTick(function(){
                        this.$refs.scroller.reset({
                            top: 0
                        })
                    })
                    this.searchList = new_arr
                },10)
                
            }else{
                this.searchColleague=false
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
                        this.initData[index].logoNameFlag=true;                        
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    this.initData[index].logoNameFlag=true;  
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.initData[index].logoNameFlag=true;  
                    return html;
                }else{
                    return text;
                }
                
            }
            
        },
    }
}
</script>
<style lang="less">
    .customer{
        .weui-search-bar{
            height: 44px !important;
        }
        .weui-search-bar__label{
            display: none;
        }
        .vux-search-box .weui-search-bar__form .weui-search-bar__box .weui-icon-search{
            top:-1px;
        }
        .vux-search-box .weui-search-bar__form .weui-search-bar__box .weui-search-bar__input{
            padding: 3px 0 0 0 ;
        }
    }
</style>
<style lang="less" scoped>
 @import './index.less';
 @import '../../css/listA.less';
</style>
