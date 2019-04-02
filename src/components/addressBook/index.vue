<template>
    <div class="customStaff">
        
        <div style="overflow:hidden" v-if="range">
            <button-tab  v-model="all"  class="tabnav-all vux-1px-b" >
                <button-tab-item  selected @on-item-click="changeSelected">全部</button-tab-item>
                <button-tab-item @on-item-click="changeSelected">组织架构</button-tab-item>
            </button-tab>
        </div>
        <div class="search-box" v-if="isSearch">
            <form action="" class="search-form">
                <div class="search-img">
                    <img src="../../images/job/search.png" alt="">    
                </div> 
                <input type="search" @search="searchCustomStaff" id="mysearch" ref="search"  v-model="searchVal" placeholder="请输入搜索内容">
                <div class="search-close">
                    <img src="../../images/job/cancel.png" alt="" @click="clearSearch">
                </div>
                <input id="hiddenText" type="text" style="display:none" />
            </form>
        </div>
        <div class="all-select" @click="isSelectAll" v-if="selectAllFlag">
            <check-icon class="select-btn"   :value.sync="selectAll" type="plain">全选</check-icon>
        </div>
        <div  class="wu-all" style="height:100%" v-if="companyObj.length==0">
            <section>
                <div><img src="~@/images/wu-icon1.png"></div>
                <p>暂无查看对象 </p>
            </section>
        </div>
        <div v-else>
            <div class="fix-header" v-if="all==0&&!isSearchVal&&ischange?true:false" >{{fixedVal}}</div>
            <scroller 
            lock-x 
            :scrollbarY=false 
            :height="scrollHeight"
            @on-scroll="initTest"
            ref="scroller"
        >
            <div class="box1" style="overflow:hidden">
                <div id="test1" v-if="all==0&&!isSearchVal?true:false">
                    
                    <group class="group-cell-padding" v-for="(items,index) in companyObj" :id="items.name=='#' ? 'first' : items.name" :title="items.name" :key="index">
                        <cell-box
                            class="delAffert vux-1px-b" 
                            :is-link="false" 
                            v-if="stateThree==0 ? true : false" 
                            v-for="item in items.childrenList"   
                            :key="item.userId" 
                            @click.native="toCompanyDetail(item.userId)"
                            >
                            <div  style="width:100%;">{{item.userName}}</div>
                        </cell-box>
                        <div 
                            v-if="stateThree==1 ? true : false"  
                            v-for="item in items.childrenList" 
                            :key="item.userId" 
                            >
                            <check-icon   
                                :value.sync="item.flag" 
                                type="plain" 
                                @click.native="handleSelectMember(item.userId,item,item.flag)"
                                >
                                {{item.userName}}
                            </check-icon>
                        </div>
                        <cell-box 
                            v-if="stateThree==2 ? true : false" 
                            v-for="item in items.childrenList"   
                            :key="item.userId" 
                            link='/page/job/customDetail/0'
                            >
                            <div style="width:100%;">{{item.userName}}</div>
                        </cell-box>
                        <div 
                            v-if="stateThree==3 ? true : false"  
                            v-for="item in items.childrenList" 
                            :key="item.userId"     
                            @click="selectOneMember(item.userId,item)"
                            >
                            <check-icon    :value.sync="item.flag" type="plain">
                                {{item.userName}}
                            </check-icon>
                        </div>
                        <cell-box 
                            v-if="stateThree==4 ? true : false" 
                            v-for="item in items.childrenList"   
                            :key="item.userId" 
                            link='/page/linkDetail'
                            >
                            <div style="width:100%;">{{item.userName}}</div>
                        </cell-box>
                    </group>
                </div>
                <div id="test3"  v-if="all==1?true:false">
                    <div class="post-list" v-for="items in branch" :key="items.departId">
                        <div 
                            class="vux-1px-b" 
                            v-if="stateTwo==0 ? true :false" 
                            @click="toRouterComponent(items.departId,items.deptName,items)"
                            >
                            <cell   :title="items.deptName" :value="items.userCount+'人'" is-link ></cell>
                        </div>
                        <div v-if="stateTwo==0 ? true :false">
                            <div v-for="item in items.children" :key="item.departId" >
                                <div class="vux-1px-b" @click="toRouterComponent(item.departId,item.deptName,item)">
                                    <em></em>    <cell :title="item.deptName" :value="item.userCount+'人'" is-link></cell>
                                </div>
                                <div  v-for="(i,index) in item.children" :key="index" >
                                    <div class="vux-1px-b" @click="toRouterComponent(i.departId,i.deptName,i)"> 
                                        <em></em>
                                        <em></em>
                                        <cell :title="i.deptName" :value="i.userCount+'人'" is-link></cell>
                                    </div>
                                    <div v-for="(is,index) in i.children" :key="index" >
                                        <div class="vux-1px-b" @click="toRouterComponent(is.departId,is.deptName,is)">
                                            <em></em>
                                            <em></em>
                                            <em></em>
                                            <cell :title="is.deptName" :value="is.userCount+'人'" is-link></cell>
                                        </div>
                                        <div v-for="(iss,index) in is.children" :key="index" >
                                            <div class="vux-1px-b" @click="toRouterComponent(iss.departId,iss.deptName,iss)">
                                                <em></em>
                                                <em></em>
                                                <em></em>
                                                <em></em>
                                                <cell :title="iss.deptName" :value="iss.userCount+'人'" is-link></cell>
                                            </div>
                                            <div v-for="(isss,index) in iss.children" :key="index" >
                                                <div class="vux-1px-b" @click="toRouterComponent(isss.departId,isss.deptName.isss)">
                                                    <em></em>
                                                    <em></em>
                                                    <em></em>
                                                    <em></em>
                                                    <em></em>
                                                    <cell :title="isss.deptName" :value="isss.userCount+'人'" is-link></cell>
                                                </div>
                                                <div v-for="(issss,index) in isss.children" :key="index" >
                                                    <div class="vux-1px-b" @click="toRouterComponent(issss.departId,issss.deptName,issss)">
                                                        <em></em>
                                                        <em></em>
                                                        <em></em>
                                                        <em></em>
                                                        <em></em>
                                                        <em></em>
                                                        <cell :title="issss.deptName" :value="issss.userCount+'人'" is-link></cell>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="stateTwo==1 ? true :false"  v-for="items in branch" :key="items.departId" >
                            
                            <div >
                                <check-icon @click.native="selectBranch(items.departId)"   :value.sync="items.flag" type="plain">
                                    {{items.deptName}}
                                </check-icon>
                            </div>
                            <div v-for="(item,index) in items.children" :key='index'>
                                <div>
                                    <em></em>
                                    <check-icon @click.native="selectBranch(item.departId)"   :value.sync="item.flag" type="plain">
                                        {{item.deptName}}
                                    </check-icon>
                                </div>
                                <div v-for="(i,index) in item.children" :key='index'>
                                    <div>
                                        <em></em>
                                        <em></em>
                                        <check-icon @click.native="selectBranch(i.departId)"   :value.sync="i.flag" type="plain">
                                            {{i.deptName}}
                                        </check-icon>
                                    </div>
                                    <div v-for="(is,index) in i.children" :key='index'>
                                        <div>
                                            <em></em>
                                            <em></em>
                                            <em></em>
                                            <check-icon  @click.native="selectBranch(is.departId)"  :value.sync="is.flag" type="plain">
                                                {{is.deptName}}
                                            </check-icon>
                                        </div>
                                        <div v-for="(iss,index) in is.children" :key='index'>
                                            <div>
                                                <em></em>
                                                <em></em>
                                                <em></em>
                                                <em></em>
                                                <check-icon @click.native="selectBranch(iss.departId)"   :value.sync="iss.flag" type="plain">
                                                    {{iss.deptName}}
                                                </check-icon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="searchList" v-if='isSearchVal'>
                    <div class="group-cell-padding-div">
                        <cell-box class="delAffert" v-if="stateThree==0 ? true : false" v-for="(items,index) in searchList"    :key="index" :link="{path:'/page/job/companyDetail',query:{id:items.userId}}" >
                            <div class="delAffter" style="width:100%;">{{items.userName}}</div>
                        </cell-box>
                        <div v-if="stateThree==1 ? true : false"  v-for="(items,index) in searchList" :key="index" >
                            <check-icon   
                                :value.sync="items.flag" 
                                type="plain" 
                                @click.native="handleSelectMember(items.userId,items,items.flag)"
                                >
                                {{items.userName}}
                                
                            </check-icon>
                        </div>
                        <cell-box 
                            v-if="stateThree==2 ? true : false"  
                            v-for="(items,index) in searchList" 
                            :key="index" 
                            link='/page/job/customDetail/0'
                            >
                            <div style="width:100%;">{{items.userName}}</div>
                        </cell-box>
                        <div 
                            v-if="stateThree==3 ? true : false"  
                            v-for="(items,index) in searchList" 
                            :key="index"     
                            @click="selectOneMember(items.userId,items)"
                            >
                            <check-icon    :value.sync="items.flag" type="plain">
                                {{items.userName}}
                            </check-icon>
                        </div>
                        <cell-box 
                            v-if="stateThree==4 ? true : false"  
                            v-for="(items,index) in searchList" 
                            :key="index" 
                            link='/page/linkDetail'
                            >
                            <div style="width:100%;">{{items.userName}}</div>
                        </cell-box>
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
        <div class="add-custom-btn-box" v-if="stateThree==1||stateThree==3||stateTwo==1?true:false" >
            <x-button class="add-btn"  @click.native="selectedCustom" type="primary">
                确定
            </x-button>
        </div>
        <!-- <div class="add-custom-btn-box" v-if="stateTwo==1?true:false" >
            <x-button class="add-btn"  @click.native="selectedCustom" type="primary">
                确定
            </x-button>
        </div> -->
    </div>
</template>
<script>
import {  Tabbar, TabbarItem,  CellBox, Cell ,Group,Search ,CheckIcon,Scroller,XButton,ButtonTab,ButtonTabItem  } from 'vux'
import { mapState, mapActions , mapGetters ,mapMutations} from 'vuex'

export default {    
    name: 'addressBook',
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
           s1:"",
           s2:'',
           s3:"",
           s4:"",
           s5:"",
           
        }
    },
    props:{
        state1:Number,
        state2:Number,
        state3:Number,
        state4:Number,
        state5:Number,
        returnData:Array,
    },
    created() {
        let obj = {
            userId:this.user_id,
            companyId:this.company_id
        }
        let obj1 = {
            companyId : this.company_id
        }
        let obj2 = {
            userId:this.user_id,
            userName:this.$store.state.userInfo.user.trueName,
            companyId:this.company_id
        }
        this.GETDEPARTMENTLIST(obj1)//获取组织架构列表
        if(/statement/.test(this.$route.path)){
            this.GETMyReceiveReportUserList(obj2)
        }else{
            this.GETXSUSERLIST(obj)
        }
        this.initAddress()
        
    },
    mounted() {
        
    },
    methods: {
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
            
            /**
             * state1=1   有上面的范围选择：全部和部门    1有0无
             * state2=0   0为企业 1为多选时state3=1 2为客户 3为单选时state3=0 4 为联系人列表
             * person=1   1时组织架构
             */
            let state1 = typeof(this.$route.query.state1)!=='undefined'?this.$route.query.state1:this.state1
            let state2 = typeof(this.$route.query.state2)!=='undefined'?this.$route.query.state2:this.state2
            let state3 = typeof(this.$route.query.state3)!=='undefined'?this.$route.query.state3:this.state3
            let state4 = typeof(this.$route.query.state4)!=='undefined'?this.$route.query.state4:this.state4
            let state5 = typeof(this.$route.query.state5)!=='undefined'?this.$route.query.state5:this.state5
            this.s1 = state1
            this.s2 = state2
            this.s3 = state3
            this.s4 = state4
            this.s5 = state5
            this.stateThree = state2
            this.stateTwo = state4
            if(state1==1&&state5==1&&state2==0&&state3==0){//企业通讯录
                this.range=true
                this.isSearch=true
                this.selectAllFlag=false
                this.scrollHeight='-103.5'
                $("#nav").css('bottom','0px')
                this.$nextTick(function(){
                    $("#test1 .vux-cell-box:after").css('display','none')
                })
            }
            if(state1==1&&state5==1&&(state2==1||state2==3)&&state3==0){//3单选    1多选
                this.range=true
                this.isSearch=true
                this.selectAllFlag=false
                this.scrollHeight='-138.5'
            }
            if(state1==0&&state5==1&&state2==2&&state3==0){//客户通讯录
                this.range=false
                this.isSearch=true
                this.selectAllFlag=false
                this.scrollHeight='-43.5'
                $("#nav").css('bottom','0px')
            }
            if(state1==0&&state5==0&&state3==1){//全选
                this.range=false
                this.isSearch=false
                this.selectAllFlag=true
                this.scrollHeight='-95'
                this.$nextTick(function(){
                    $("#nav").css('top','60px')
                })
                
            }
            
            if(state4==1){
                this.range=false
                this.isSearch=false
                this.all=1
                this.scrollHeight='-35'
                this.selectAllFlag=false
                
                this.branch = this.storeDepartMentList
            }
            $("#mysearch").focus(function(){
                if(that.s1==1&&that.s5==1&&that.s2==0&&that.s3==0){
                    document.getElementById('nav').style.height=document.body.offsetHeight-103.5+'px'
                }
                if(that.s1==1&&that.s5==1&&(that.s2==1||that.s2==3)&&that.s3==0){
                    document.getElementById('nav').style.height=document.body.offsetHeight-138.5+'px'
                }
            })
        },
        ...mapMutations({
            SELECTED_MEMBER: 'addressBook/SELECTED_MEMBER',
            SELECTED_POST: 'addressBook/SELECTED_POST',
            INITCOMPANYOBJ:'addressBook/INITCOMPANYOBJ',
            FLAGFORINIT:'addressBook/FLAGFORINIT',
            UPDATELOADING:'UPDATE_LOADING'
        }),
        ...mapActions({
            GETXSUSERLIST:'addressBook/GetXsUserList',
            GETDEPARTMENTLIST:'addressBook/GetDepartMentList',
            GETUserListByDepartId:'addressBook/GetUserListByDepartId',
            GETMyReceiveReportUserList:'addressBook/GetMyReceiveReportUserList',
            
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
        changeSelected(){//企业员工、组织架构的变换
           this.$nextTick(function(){
                    this.$refs.scroller.reset({
                    top: 0
                })
            })
            if(this.all==1){
                this.isSearch=false
                $("#myCustom").css('bottom','0px')
                $("#vux-scroller-cztae").css('height','100%')
                this.branch = this.$store.state.addressBook.storeDepartMentList
                 
                 if(this.s1==1&&this.s5==1&&this.s2==0&&this.s3==0){
                     this.scrollHeight='-60'
                 }
                 if(this.s1==1&&this.s5==1&&(this.s2==1||this.s2==3)&&this.s3==0){
                     this.scrollHeight='-95'
                 }
            }else{
                 this.isSearch=true
                 if(this.s1==1&&this.s5==1&&this.s2==0&&this.s3==0){
                     this.scrollHeight='-103.5'
                 }
                 if(this.s1==1&&this.s5==1&&(this.s2==1||this.s2==3)&&this.s3==0){
                     this.scrollHeight='-138.5'
                 }
            }
        },
        selectBranch(departId){//选中的组织架构部门
            let that = this
            let newArr = this.selectArr
            if(newArr.length>0){
                if(newArr.indexOf(departId)>-1){
                    newArr.splice(newArr.indexOf(departId),1)
                }else{
                    newArr.push(departId)
                }
            }else{
                newArr.push(departId)   
            }
            this.selectArr = newArr
            this.SELECTED_POST(that.selectArr)
        },
        handleSelectMember(userId,obj,flag){
            let that = this
            this.selectArr = this.selectedMember
            let len = this.selectArr.length
            if(/newPlan|changePlan/.test(this.$route.path)){
                if(this.user_id==userId){
                    
                }else{
                    if(flag){
                        this.selectArr.push(obj)
                    }else{
                        for(let i=len-1;i>=0;i--){
                            if(userId==this.selectArr[i].userId){
                            this.selectArr.splice(i,1)
                            }
                        }
                    }
                }
            }else{
                if(flag){
                    this.selectArr.push(obj)
                }else{
                    for(let i=len-1;i>=0;i--){
                        if(userId==this.selectArr[i].userId){
                        this.selectArr.splice(i,1)
                        }
                    }
                }
            }
            //在一些页面自己一直在选中状态 
            if(/newPlan|changePlan/.test(this.$route.path)){
                this.companyObj.forEach(items => {
                    items.childrenList.forEach(item => {
                        if(item.userId==that.user_id){
                            item.flag=true
                        }
                    })
                    
                });
            }
            // 全选功能
            if(typeof(this.$route.query.state2)!=='undefined'){
                let state1 = this.$route.query.state1
                let state2 = this.$route.query.state2
                let state3 = this.$route.query.state3
                if(state3==1){
                    for(let i=0;i<this.companyObj.length;i++){
                        for(let j=0;j<this.companyObj[i].childrenList.length;i++){
                            if(this.companyObj[i].childrenList[j].flag==true){
                                that.selectAll=true
                                
                            }else{
                                that.selectAll=false
                                return false ;
                            }
                        }
                    }
                }
            }else{
                let state2 = this.state2
                let state3 = this.state3
                if(state3==1){
                    for(let i=0;i<this.companyObj.length;i++){
                        for(let j=0;j<this.companyObj[i].childrenList.length;j++){
                            if(this.companyObj[i].childrenList[j].flag==true){
                                that.selectAll=true
                            }else{
                                that.selectAll=false
                                return ;
                            }
                        }
                    }
                }
            }
            this.SELECTED_MEMBER(this.selectArr)
            
        },
        selectOneMember(key,obj){//单选企业员工
            this.selectArr = []
            let newArr = this.selectArr
            let that = this
            let len = that.companyObj.length
            for(let i=0;i<len;i++){
                for(let j = 0;j<that.companyObj[i].childrenList.length;j++){
                    
                    that.companyObj[i].childrenList[j].flag=false
                    if(that.companyObj[i].childrenList[j].userId==key){
                        that.companyObj[i].childrenList[j].flag=true
                        newArr.push(obj)
                    }
                }
            }
            
            this.selectArr = newArr
            this.SELECTED_MEMBER(this.selectArr)
        },
        arrRemove(arr,val){//数组中包含删除
            var index = arr.indexOf(val);
            if (index > -1) {
                arr.splice(index, 1);
            }
        },
        isSelectAll(){//全选和取消全选
            let that = this
            let len = this.companyObj.length
            that.selectArr=[]
            if(this.selectAll){
                for(let i=0;i<this.companyObj.length;i++){
                    for(let j = 0;j<that.companyObj[i].childrenList.length;j++){
                        that.companyObj[i].childrenList[j].flag=true
                        that.selectArr.push(that.companyObj[i].childrenList[j]) 
                    }
                }
                this.SELECTED_MEMBER(that.selectArr)
            }else{
                for(let i=0;i<len;i++){
                    for(let j = 0;j<that.companyObj[i].childrenList.length;j++){
                        that.companyObj[i].childrenList[j].flag=false
                        that.selectArr=[]
                    }
                }
                this.SELECTED_MEMBER(that.selectArr)
            }
            
        },
        toAddCustom(){
            this.$router.push('/page/job/addCustom')
        },
        selectedCustom(){ 
            let Arr=[];
            this.selectArr =Arr ;
            this.searchVal = ''

            this.$emit("toggleAddress")
            this.branch.forEach(element => {
                if(element.flag){
                    Arr.push(element.departId)
                }
                if(element.children){
                    element.children.forEach(elemen=>{
                        if(elemen.flag){
                            Arr.push(element.departId)
                        }
                        if(elemen.children){
                            elemen.children.forEach(eleme=>{
                                if(eleme.flag){
                                    Arr.push(eleme.departId)
                                }
                                if(eleme.children){
                                    eleme.children.forEach(elem=>{
                                        if(elem.flag){
                                            Arr.push(elem.departId)
                                        }
                                        if(elem.children){
                                            elem.children.forEach(ele=>{
                                                if(ele.flag){
                                                    Arr.push(ele.departId)
                                                }
                                                if(ele.children){
                                                    ele.children.forEach(el=>{
                                                        if(el.flag){
                                                            Arr.push(el.departId)
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

            });
            this.SELECTED_POST(Arr)
            if(typeof(this.returnData)=='undefined'){
                
            }else{
                this.$router.go('-1')
            }
        },
        toRouterComponent(departId,title){//获取部门底下的员工列表
            this.range=false
            this.isSearch=true
            this.selectAllFlag=false
            this.all = 0
            let that = this 
            if(typeof(title)=="undefined"){
                document.title = '企业通讯录'
            }else{
                document.title = title
            }
            this.ischange = false
            let obj = {
                companyId:this.company_id,
                departMentId:departId,
                queryStartIndex:1,
                queryEndIndex:1000
            }
            this.$nextTick(function(){
                this.all = 0
            })
            if(this.stateThree==1||this.stateThree==3){
                this.$nextTick(function(){
                    $(".nav").css("top","43px")
                })
                this.scrollHeight="-78"
            }else{
                this.$nextTick(function(){
                    $(".nav").css("top","43px")
                })
                this.scrollHeight="-43"
                if(this.companyObj.length==0){
                    this.fixedVal=' '
                }
            }
            if(that.s1==1&&that.s5==1&&that.s2==0&&that.s3==0){
                this.$nextTick(function(){
                   document.getElementById('nav').style.height=document.body.offsetHeight-43.5+'px'
                })
                
            }
            if(that.s1==1&&that.s5==1&&(that.s2==1||that.s2==3)&&that.s3==0){
                this.$nextTick(function(){
                   document.getElementById('nav').style.height=document.body.offsetHeight-78.5+'px'
                })
                
            }
            this.GETUserListByDepartId(obj)
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top:0
                })
            })
        },
        greet(){
        }
    },
    computed: {
        ...mapState({
           selectedMember: state => state.addressBook.selectedMember,
           storeUserList:state => state.addressBook.storeUserList,
           storeDepartMentList:state => state.addressBook.storeDepartMentList,
           departUserListData:state => state.addressBook.departUserListData,
           departUserList:state => state.addressBook.departUserList,
           userInitData:state => state.addressBook.userInitData,
           flagForInit:state => state.addressBook.flagForInit
        }),
    },
    watch: {
        selectedMember: function(arr) {
            let that = this
            let data = this.companyObj
            for(let i=0;i<data.length;i++){
                for(let j=0;j<data[i].childrenList.length;j++){
                    if(data[i].childrenList[j].flag==true){
                        that.selectAll=true
                    }else{
                        that.selectAll=false
                        return ;
                    }
                }
            }
            this.companyObj = data
        },
        storeUserList:function(arr){
            this.companyObj = arr
        },
        userInitData:function(data){
            this.UPDATELOADING(false)
            if(data.data.msg_alert){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:"20em"                                
                }) 
            }
            
        },
        departUserList:function(data){
            this.fixedVal = data[0].name
            this.companyObj = data
            this.ischange = true
        },
        departUserListData:function(data){
            this.UPDATELOADING(false)
            if(data.data.alert_msg){
                this.$vux.toast.show({
                    text: data.data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:"20em"                                
                }) 
                this.companyObj =[]
            }
        },
        branch:function(newVal,oldVal){
            this.branch = this.storeDepartMentList
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
            this.scrollHeight='-138.5'
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
        state4:function(value){
            if(value==1){
                this.state4 = 1
                this.stateTwo = 1
                this.range=false
                this.isSearch=false
                this.all=1
                this.scrollHeight='-35'
                this.selectAllFlag=false
                this.branch = this.storeDepartMentList
            }else{
                this.state4 = 0
                this.stateTwo = 0 //组织架构，是否选择
                this.all = 0 //单选多选
                this.selectAllFlag=true
                if(this.state1==1&&this.state5==1&&this.state2==0&&this.state3==0){//企业通讯录
                    this.range=true
                    this.isSearch=true
                    this.selectAllFlag=false
                    this.scrollHeight='-103.5'
                }
                if(this.state1==1&&state5==1&&(this.state2==1||this.state2==3)&&this.state3==0){//state2 =  3单选    1多选
                    this.range=true
                    this.isSearch=true
                    this.scrollHeight='-138.5'
                }
                if(this.state1==0&&this.state5==0&&this.state3==1){//全选
                    this.range=false
                    this.isSearch=false
                    this.scrollHeight='-95'
                    $("#nav").css('top','60px')
                }
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
        ButtonTabItem
    },
}
</script>
<style lang="less">
html,body{
    overflow:hidden;
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
        .weui-cells__title{
            margin-top:0;
            margin-bottom: 0;
            line-height: 23px;
            background: #f7f7f7;
        }
        .weui-cell_access{
            border-bottom: 1px solid #f5f5f5;
        }
        // .delAffert::after{
        //     // display: none;
        // }
        .group-cell-padding{
            .weui-cells__title + .weui-cells{
                box-sizing: border-box;
                padding-left: 10px;
                .vux-cell-box{
                    padding-left: 0 !important;
                }
            }
            
        }
        .group-cell-padding-div{
            box-sizing: border-box;
            padding-left: 10px;
            .weui-cell_access.vux-cell-box{
                padding-left: 0 !important;
            }
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
