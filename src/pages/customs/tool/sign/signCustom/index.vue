<template>
    <div class="signCustom">
        <!-- 搜索框 -->
        <search 
            v-show="!isgroup&&!isShare&&!isLabels" 
            ref="search" 
            :auto-fixed="false" 
            placeholder="请输入姓名、电话、邮箱、公司名称" 
            @on-submit="searchCustom"
            @on-cancel="cancel"
            v-model="searchVal"
            @on-change="searchChange"
            >
        </search>
        <p style="line-height:35px;box-sizing:border-box;padding:0 10px;font-size:16px;background:#fff" v-if="isgroup">
            选择分组
        </p>
        <scroller 
            lock-x 
            ref="scroller"
            scrollbarY 
            :height="height"
            @on-scroll-bottom="loadMore" 
            @on-pulldown-loading="refresh" 
            v-model="status"  
            use-pulldown  
            :scroll-bottom-offst="0"
            :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
            >
            <div style="overflow:hidden">
                <div v-show="!isgroup&&!isSearch&&!isLabels&&!isShare" style="overflow:hidden">
                    <!-- 导航入口 -->
                    <group class="title">
                        <!-- <cell title="新客户推荐" link="">
                            <img slot="icon" src="@/images/personal/mine_main_introduce@2x.png" class="img-kind">
                        </cell> -->
                        <cell title="标签"  @click.native="togglePop" is-link>
                            <img slot="icon" src="@/images/personal/mine_main_expertise@2x.png" class="img-kind">
                        </cell>
                        <cell title="分组"   is-link @click.native="toggleGroup">
                            <img slot="icon" src="@/images/personal/mine_main_email@2x.png" class="img-kind">
                        </cell>
                        <cell title="共享给我的客户" is-link @click.native="toggleShare">
                            <img slot="icon" src="@/images/personal/mine_main_phone@2x.png" class="img-kind">
                        </cell>
                    </group>
                    <div class='wu-all wu-allB' v-if="initData.length==0" >
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>暂无数据</p>
                        </section>
                    </div>
                    <!-- 最近联系人 -->
                    
                    <div v-else>
                        <group class="" title="最近联系人">
                        <!-- 无数据页面 -->
                        </group>
                        <a href="javascript:void(0)" class="vux-1px-b listA-box" v-for="(item,index) in initData" :key="index" @click="checkType(item.customer_id,item,1,item.flag)">                
                            <aside  v-if="item.logo_orig.length>0"><img :src="item.logo_orig?item.logo_orig:'@/images/xsdefult.jpg'" :alt="item.customer_name" :onerror="logo"></aside>
                            <aside v-else :class="'c-'+item.color" v-html="SameNameHand(item.customer_name,index,'initData')"> </aside>
                            <section>
                                <div class="hd">
                                    <h6>{{item.customer_name}}</h6>
                                </div>
                                <div class="md">
                                    <p >{{item.customer_company_name}}</p>  
                                    <div class="vux-check-icon"><i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i></div>
                                </div>
                            </section>
                        </a>
                    </div>
                </div>
                <div style="overflow:hidden" class="myGroup" v-show="isgroup">
                    <group class="group-mt0">
                        <div v-for="(items,index) in industryData" :key="index" class="mygroup-box vux-1px-b">
                            <div class="parentgroup">
                                <div class="mygroup-cell" @click="changeType(items.id)">
                                    <div class="iconHeader" >
                                        <img src="~@/images/tool/zzo.png" alt="" v-if="!items.childFlag">
                                        <img src="~@/images/tool/zzod.png" alt="" v-if="items.childFlag">
                                    </div>
                                    <cell :title="items.name" v-model="items.userCount" >
                                    </cell>
                                </div>
                            </div>
                            <ul v-if="items.childFlag">
                                <li v-for="(item,i) in items.children" class="listA-box vux-1px-t" :key="i" @click="selectOneCustom(items.id,item.customer_id,item.flag)">
                                    <aside  v-if="item.logo_orig.length>0"><img :src="item.logo_orig?item.logo_orig:'@/images/xsdefult.jpg'" :alt="item.customer_name" :onerror="logo"></aside>
                                    <aside v-else :class="'c-'+item.color" v-html="shareNameHand(item.customer_name,i,index)"></aside>
                                    <section>
                                        <div class="hd">
                                            <h6>{{item.customer_name}}</h6>
                                        </div>
                                        <div class="md">
                                            <p :class="item.icon?'mr22':''">{{item.customer_company_name}}</p> 
                                            <div class="vux-check-icon"><i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i></div>
                                        </div>
                                    </section>
                                </li>
                            </ul>
                        </div>
                    </group>
                </div>
                <div class="searchList" v-if="isSearch">
                     <div class='wu-all wu-allB' v-if="searchData.length==0" >
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>根据你的搜索条件未找到匹配的<br>结果，请更换搜索条件</p>
                        </section>
                    </div>
                    <group-title v-if="searchData.length>0">共{{searchData.length}}位客户</group-title>
                    <a href="javascript:void(0)" v-if="searchData.length>0" class="vux-1px-b listA-box" v-for="(item,index) in searchData" :key="index" @click="checkType(item.customer_id,item,4,item.flag)">                
                        <aside  v-if="item.logo_orig"><img :src="item.logo_orig?item.logo_orig:'@/images/xsdefult.jpg'" :alt="item.customer_name" :onerror="logo"></aside>
                        <aside v-else :class="'c-'+item.color" v-html="SameNameHand(item.customer_name,index,'searchData')"> </aside>
                        <section>
                            <div class="hd">
                                <h6>{{item.customer_name}}</h6>
                            </div>
                            <div class="md">
                                <p >{{item.customer_company_name}}</p>  
                                <div class="vux-check-icon" >
                                    <i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i>
                                </div>
                            </div>
                        </section>
                    </a>
                </div>
                <div class="searchList" v-if="isShare">
                    <div class='wu-all wu-allB' v-if="myShareData.length==0" >
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>暂无数据</p>
                        </section>
                    </div>
                    <div v-else>
                        <group-title>共{{shareNumber}}位客户</group-title>
                        <a href="javascript:void(0)" class="vux-1px-b listA-box" v-for="(item,index) in myShareData" :key="index" @click="checkType(item.customer_id,item,2,item.flag)">                
                            <aside  v-if="item.logo_orig.length>0"><img :src="item.logo_orig?item.logo_orig:'@/images/xsdefult.jpg'" :alt="item.customer_name" :onerror="logo"></aside>
                            <aside v-else :class="'c-'+item.color" v-html="SameNameHand(item.customer_name,index,'myShareData')"> </aside>
                            <section>
                                <div class="hd">
                                    <h6>{{item.customer_name}}</h6>
                                </div>
                                <div class="md">
                                    <p >{{item.customer_company_name}}</p>  
                                    <div class="vux-check-icon" >
                                        <i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i>
                                    </div>
                                </div>
                            </section>
                        </a>
                    </div>
                    
                </div>
                <div class="searchList" v-if="isLabels">
                    <div class='wu-all wu-allB' v-if="labelsData.length==0" >
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>暂无数据</p>
                        </section>
                    </div>
                    <div v-else>   
                        <group-title>该标签下共{{labelsData.length}}位客户</group-title >
                        <a href="javascript:void(0)" class="vux-1px-b listA-box" v-for="(item,index) in labelsData" :key="index" @click="checkType(item.customer_id,item,3,item.flag)">                
                            <aside  v-if="item.logo_orig"><img :src="item.logo_orig?item.logo_orig:'@/images/xsdefult.jpg'" :alt="item.name" :onerror="logo"></aside>
                            <aside v-else :class="'c-'+item.color" v-html="SameNameHand(item.customer_name,index,'labelsData')"></aside>
                            <section>
                                <div class="hd">
                                    <h6>{{item.customer_name}}</h6>
                                </div>
                                <div class="md">
                                    <p >{{item.customer_company_name}}</p>  
                                    <div class="vux-check-icon">
                                        <i :class="item.flag?'weui-icon-success-circle':' weui-icon-circle'" class="weui-icon"></i>
                                    </div>
                                </div>
                            </section>
                        </a>
                    </div>
                    
                </div>
                <load-more tip="加载中" v-if="loadFlag" ></load-more>
                <div class="no-more"  v-if="!isShare && !isLabels&&!loadFlag && onFetching && page>1" >已到底部</div>
                <div class="no-more"  v-if="isLabels && !loadFlag && onFetching && labelPage>1" >已到底部</div>
                <div class="no-more"  v-if="isShare && !loadFlag && onFetching && sharePage>1" >已到底部</div>
            </div>
        </scroller>
        <div class="signCustom-footer vux-1px-t" v-if="isSelectedMsg">
            <div class="selected-member" v-if="shareCustom.length>0">
                <ul class="signCustomUl">
                   <li v-for="(item,index) in shareCustom" :key="index" @click="removeShare(item)">
                       <aside  v-if="item.logo_orig"><img :src="item.logo_orig?item.logo_orig:'@/images/xsdefult.jpg'" :alt="item.customer_name" :onerror="logo"></aside>
                       <aside v-else :class="'c-'+item.color" v-html="SameNameHand(item.name||item.customer_name,index,'searchData')"> </aside>
                        <p style="text-align:center">{{item.customer_name}}</p>
                   </li>
                </ul>
            </div>
            <div style="flex:1;box-sizing:border-box;padding-left:15px;" v-else>
                请选择客户
            </div>
            <!-- :disabled="shareCustom.length==0" -->
            <div class="outcustom-btn-box">
                <x-button type="primary"  @click.native="customBack">
                    确定
                    ({{shareCustom.length>999?'999+':shareCustom.length}})
                </x-button>
            </div>
        </div>
         <!-- popup -->
         <div v-transfer-dom >
            <!-- 标签 -->
            <popup v-model="mylabels" v-if="mylabels" position="right" height="100%" width="100%">
                <labelPage :propState="4"  propTitle="选择标签" @toggleLabel="togglePop" />
            </popup>
        </div>
    </div>
</template>

<script>
import { Search, Group, Cell, Scroller, LoadMore, Badge,XButton,TransferDom, Popup,Checklist,Icon,GroupTitle } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import {len} from '@/util';
import { objDeepCopy } from '@/util'
import labelPage from '@/components/labels'
import VueEmit from '@/util/vueEimt';
let _timer ;
export default {
    name: 'signCustom',
    data() {
        return {
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            listData: {dataObj:[]},
            // scroller相关
            page:1,
            count:10,   
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:false,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            pulldown:false,
            // end Scroller相关
            height: "-114",
            isLoading: false,
            mylabels: false,
            group:false,
            isOne:false,
            groupList: [ 
                {
                    key:'1',
                    value:'一般客户',
                },
                {
                    key:'2',
                    value:'意向客户',
                },
                {
                    key:'3',
                    value:'已成交客户',
                },
                {
                    key:'4',
                    value:'其他',
                },
                {
                    key:'5',
                    value:'全部分组',
                },
            ],
            groupCheck:[],
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
            isSelected:false,
            isNext:false,
            initData:[],//最近联系人的数据
            myCustomer:[],
            isgroup:false,
            isShare:false,
            industryData:[],
            myShareData:[],
            shareNumber:'',
            searchData:[],
            labelsData:[],
            searchNum:'0',
            isSearch:false,
            isLabels:false,
            isOnlyCustom:false,
            searchVal:'',
            labelSting:'',
            labelPage:1,
            sharePage:1,
            isRefresh:false,
        }
    },
    props:['propsState','propsFlag','propsShare','chooseType'],
    directives: {
        TransferDom
    },
    created() {
        if(this.$route.path!='/page/selectedMsg'){
            this.isSelectedMsg=true
        }else{
            this.isSelectedMsg=false
        }
        let obj = {
            company_id:this.company_id,
            user_id:this.user_id,
            page:1,
            count:10,
        }
        this.ChooseCustomer(obj)//请求最近联系人
        if(this.$route.query.type){
            if(this.$route.query.type==2){
                this.isOne=true;//单选
            }
        }
        //组件形式引进
        if(this.propsFlag){
            this.isOnlyCustom=true
        }  
        if(this.$route.path=='/page/AiTask'){//单独引用signCustom组件
            let _arr = objDeepCopy(this.resultChoice)
            this.SHARECustom(_arr)
            if(this.shareCustom.length>0){
                let scrollWidth = this.shareCustom.length*60
                let width = this.shareCustom.length*60+5+'px'
                this.$nextTick(function(){
                    $(".signCustomUl").css('width',width)
                })
            }
        }
    },
    mounted(){
        let _this = this
        VueEmit.$on('custome',function(data){
            let _arr = objDeepCopy(_this.initData)
            _arr.forEach(items=>{
                if(items.customer_id==data.customer_id){
                    items.flag=false
                }
            })
            _this.initData = _arr
            for(let i=0;i<_this.industryData.length;i++){
                if(_this.industryData[i].children){
                    for(let j=0;j<_this.industryData[i].children.length;j++){
                        if(_this.industryData[i].children[j].customer_id==data.customer_id){
                            _this.industryData[i].children[j].flag=false;
                            break;
                        }
                    }
                }
            }
            if(_this.labelsData){
                _this.labelsData.forEach(function(item){
                    if(item.customer_id==data.customer_id){
                        item.flag=false
                    }
                })
            }
            if(_this.isShare){
                _this.myShareData.forEach(function(item){
                    if(item.customer_id==data.customer_id){
                        item.flag=false
                    }
                })
            }
            if(_this.isSearch){
                _this.searchData.forEach(function(item){
                    if(item.customer_id==data.customer_id){
                        item.flag=false
                    }
                })
            }
            
        })
        let shareLen = this.shareCustom.length;
        let initLen = this.initData.length;
        let industryLen = this.industryData.length;
        if(this.shareCustom.length>0){
            for(let i=0;i<initLen;i++){
                for(let j=0;j<shareLen;j++){
                    if(this.initData[i].customer_id==this.shareCustom[j].customer_id){
                        this.initData[i].flag=true;
                        break ;
                    }
                }
            }
            for(let i=0;i<industryLen;i++){
                if(this.industryData[i].children){
                    let childLen = this.industryData[i].children.length;
                    for(let j=0;j<childLen;j++){
                        for(let k=0;k<shareLen;k++){
                            if(this.industryData[i].children[j].customer_id==this.shareCustom[k].customer_id){
                                this.industryData[i].children[j].flag=true;
                                break ;
                            }
                        }
                    }
                }
            }

        }
        for(let i=0;i<industryLen;i++){
            if(this.industryData[i].children){
                let childLen = this.industryData[i].children.length;
                for(let j=0;j<childLen;j++){
                    if(!this.industryData[i].children[j].flag){
                        this.industryData[i].flag=false;
                        break;
                    }else{
                        this.industryData[i].flag=true;
                    }
                }
            }
        }
        
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            SHARECustom:'user/SHARECUSTOM',
            ResultChoice:'user/RESULTCHOICE'
        }),
        ...mapActions({
            ChooseCustomer:'customer/ChooseCustomerListsSvr',
            customersegment_segmentList:'customersegment/segmentList',
            customer_getAllCustomerListsBySegment:'customer/getAllCustomerListsBySegment',
            customer_customerWorkerList:'customer/customerWorkerList',
        }),
        loadMore () {
            if (this.onFetching) {
                
            }else{
                if(this.isLables){
                    this.loadFlag=true
                    this.onFetching=true
                    this.labelPage++
                    let page = this.labelPage
                    let obj = {
                        company_id:this.company_id,
                        user_id:this.user_id,
                        page:page,
                        count:this.count,
                        label_ids:this.labelSting
                    }
                    this.ChooseCustomer(obj)
                }else if(this.isShare){
                    this.loadFlag=true
                    this.onFetching=true
                    this.sharePage++
                    let page = this.sharePage
                    let obj ={
                        user_id:this.user_id,
                        company_id:this.company_id,
                        is_share:'1',
                        page:page,
                        count:10,
                    }
                    this.ChooseCustomer(obj)
                }else if(!this.isShare&&!this.isgroup&&!this.isSearch&&!this.isLabels){
                    this.loadFlag=true
                    this.onFetching=true
                    this.page++
                    let page = this.page
                    let obj = {
                        company_id:this.company_id,
                        user_id:this.user_id,
                        page:page,
                        count:10,
                    }
                    this.ChooseCustomer(obj)
                }


              return ;
            }
        },
        refresh(){
           this.isRefresh=true
           let that = this
            if(this.status.pulldownStatus != 'default'){
                if(that.isLabels){
                    this.labelPage=1
                    let page = this.labelPage
                    let obj = {
                        company_id:this.company_id,
                        user_id:this.user_id,
                        page:1,
                        count:10,
                        label_ids:this.label_ids
                    }
                    this.ChooseCustomer(obj)
                }else if(that.isShare){
                    this.sharePage=1
                    let page = this.sharePage
                    let obj ={
                        user_id:this.user_id,
                        company_id:this.company_id,
                        is_share:'1',
                        page:1,
                        count:10,
                    }
                    this.ChooseCustomer(obj)
                }else if(!this.isgroup&&!this.isSearch&&!this.isShare&&!this.isLabels){
                    this.page=1
                    // this.initData=[]
                    let obj = {
                        company_id:this.company_id,
                        user_id:this.user_id,
                        page:this.page,
                        count:10,
                    }
                    this.ChooseCustomer(obj)
                }
                
                
              setTimeout(function(){
                  that.$refs.scroller.donePulldown()
              },500)
            }
        },
        cancel(){
            this.isSearch=false;
            this.$refs.scroller.reset({
                top:0
            })
        },
        searchCustom(){
            this.searchData=[]
            this.isSearch=true 
            this.$emit('choiseFlag',{name:'isSearch',value:this.isSearch})
            this.$nextTick(function(){
                if(this.$refs.scroller.scrollTop){
                    this.$refs.scroller.reset({
                        top:0
                    })
                }
            })
            this.$refs.scroller.reset({
                top:0
            })
            let obj={
                company_id:this.company_id,
                user_id:this.user_id,
                keywords:this.searchVal,
                type:1,
                page:1,
                count:10000
            }
            this.customer_customerWorkerList(obj)
        },
        searchChange(val){
            let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
            let value = val.replace(reg,'')
            // value.length=20
            if(value.length>50){
            value = value.substr(0,50)
            }
            setTimeout(() => {
                this.searchVal = value;
            },10)
        },
        toggleGroup(){
            this.page = 1
            //获取分组数据
            let obj1 = {
                company_id:this.company_id,
                user_id:this.user_id
            }
            this.customer_getAllCustomerListsBySegment(obj1)
            //获取分组数据
            this.$refs.search.setBlur()
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                this.isgroup=!this.isgroup;
                this.height="-110"
                this.$emit('changeGroup',true)
                this.$emit('choiseGroup',true)
                this.$emit('choiseFlag',{name:'isGroup',value:true})
            },300)
            
            document.title="分组"
        },
        togglePop(data){
            this.labelPage=1
            this.loadFlag = false
            this.onFetching = false
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                this.mylabels=!this.mylabels;
                this.$emit('choiseFlag',{name:'isLabels',value:this.mylabels})
                this.labelsData=[]
                if(data&&data.type!='click'){
                    if(data.length>0){
                        let _ids = ''
                        data.forEach(function(item){
                            _ids+=item.id+','
                        })
                        _ids=_ids.substring(0,_ids.length-1)
                        this.label_ids = _ids
                        document.title="标签"
                        this.isLabels=true
                        this.height="-70"
                        this.$emit('choiseFlag',{name:'isLabels',value:true})
                        this.labelsData=[]
                        this.labelString = data
                        let obj = {
                            company_id:this.company_id,
                            user_id:this.user_id,
                            label_ids:_ids,
                            page:1,
                            count:10,
                        }
                        this.ChooseCustomer(obj)
                    }else{
                        this.isLables = false
                        this.$emit('choiseFlag',{name:'isLabels',value:false})
                    }
                    
                }else{
                    document.title="标签"
                }
            },300)
            
            
        },
        selectGroup(){
            this.group=false;
        },
        toggleShare(){
            this.$refs.search.setBlur()
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                this.isShare=!this.isShare;
                this.height="-70";
                this.$emit('choiseFlag',{name:'isShare',value:true})
                this.judgeSame()
                this.myShareData=[]
                let obj ={
                    user_id:this.user_id,
                    company_id:this.company_id,
                    is_share:'1',
                    page:1,
                    count:10,
                }
                this.ChooseCustomer(obj)
            },300)
            
        },
        customBack(){
            let _arr = objDeepCopy(this.shareCustom)
            this.$emit('toggleSignCustom',_arr)
            this.ResultChoice(_arr)
            this.isgroup=false;
            this.isShare=false;
            this.isSearch=false;
            this.isLabels=false;
            this.isLabel=false;
            this.$emit('choiseFlag',{name:'isShare',value:false})
            this.$emit('choiseFlag',{name:'isGroup',value:false})
            this.$emit('choiseFlag',{name:'isLabel',value:false})
            this.$emit('choiseFlag',{name:'isLabels',value:false})
            this.$emit('choiseFlag',{name:'isSearch',value:false})
            
        },
        judgeSame(){
            let len = this.initData.length;
            let shareLen = this.shareCustom.length;
            for(let i=0;i<len;i++){
                for(let j=0;j<shareLen;j++){
                    if(this.initData[i].customer_id==this.shareCustom[j].customer_id){
                        this.initData[i].flag=true;
                        break ;
                    }
                }
            }
        },
        //选择index
        checkType(id,item,status,flag){
            let _this = this;
            let _arr ;
            let _custom = objDeepCopy(_this.shareCustom)
            let type = this.$route.query.type
            if(this.$route.query.type==2||this.chooseType==2){
                type=2
            }
            if(status==2){
                _arr =objDeepCopy(_this.myShareData)
            }else if(status==1){
                _arr =objDeepCopy(_this.initData)
            }else if(status==3){
                _arr =objDeepCopy(_this.labelsData)
            }else if(status==4){
                _arr =objDeepCopy(_this.searchData)
                
            }
            if(type==2){
                let initShare=[]
                _arr.forEach(function(items){
                    if(items.customer_id==id){
                        items.flag=!items.flag;
                        if(items.flag){
                            initShare.push(items)
                        }else{
                            initShare=[]
                        }
                    }else{
                        items.flag=false;
                    }
                })
                if(status==1){
                    this.initData=_arr
                }else if(status==2){
                    this.myShareData=_arr
                }else if(status==3){
                    this.labelsData=_arr
                }else if(status==4){
                    this.searchData = _arr
                }
                if(status!=1){
                    this.initData.forEach(function(items){
                        if(!flag){
                            if(items.customer_id==id){
                                items.flag=true
                            }else{
                                items.flag=false
                            }
                        }else{
                            if(items.customer_id==id){
                                items.flag=false
                            }
                        }
                    })
                }
                this.industryData.forEach(function(items){
                    items.children.forEach(function(item){
                        if(!flag){
                            if(item.customer_id==id){
                                item.flag=true
                            }else{
                                item.flag=false
                            }
                        }else{
                            if(item.customer_id==id){
                                item.flag=false
                            }
                        }
                        
                    },this)
                },this)
                _this.SHARECustom(initShare)

            }else{
                this.industryData.forEach(function(items){
                    items.children.forEach(function(item){
                        if(!flag){
                            if(item.customer_id==id){
                                item.flag=true
                            }
                        }else{
                            if(item.customer_id==id){
                                item.flag=false
                            }
                        }
                        
                    },this)
                },this)
                _arr.forEach(function(items){
                if(items.customer_id==item.customer_id){
                        items.flag=!items.flag;
                    }
                },this)
                this.initData.forEach(function(items){
                    if(items.customer_id==id){
                        items.flag=!items.flag
                    }
                },this)
                this.labelsData.forEach(function(items){
                    if(items.customer_id==id){
                        items.flag=!items.flag
                    }
                },this)
                let _search = objDeepCopy(this.searchData)
                _search.forEach(function(items){
                    if(items.customer_id==id){
                        items.flag=!items.flag
                    }
                },this)
                this.searchData = _search
                this.myShareData.forEach(function(items){
                    if(items.customer_id==id){
                        items.flag=!items.flag
                    }
                },this)
                if(status!=1){
                    this.initData.forEach(function(items){
                        if(!flag){
                            if(items.customer_id==id){
                                items.flag=true
                            }
                        }else{
                            if(items.customer_id==id){
                                items.flag=false
                            }
                        }
                    })
                }
                if(status==1){
                    this.initData=_arr
                }else if(status==2){
                    this.myShareData=_arr
                }else if(status==3){
                    this.labelsData=_arr
                }else if(status==4){
                    this.searchData = _arr
                }
                if(flag){
                    for(let i=0;i<_custom.length;i++){
                        if(_custom[i].customer_id==item.customer_id){
                            _custom.splice(i,1)
                            break ;
                        }
                    }
                }else{
                    _custom.push(item)
                }
                _this.SHARECustom(_custom)
            }
        },
        SameNameHand(name,index,dataName){
            var zh_reg = /^[\u4e00-\u9fa5]+$/;
            let text=name;
            if (!zh_reg.test(text.substr(0,1))) {
                let nameA=text.length>5?text.substring(0,5):text;
                if(nameA.length<3){
                    return '<span style="line-height:40px;">'+nameA+'</span>';
                }else{
                    if((nameA.length==4 && len(text)==4 )|| (nameA.length==5 && len(text)==5 )  ){
                         return '<span style="line-height:40px;">'+nameA+'</span>';
                    }else if(len(text)>4){
                        let html=nameA.substring(0,2)+'</br>'+nameA.substring(2);
                        return '<span class="wk">'+html+'</span>';  
                    }else{
                        return '<span style="line-height:40px;">'+nameA+'</span>';  
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    return '<span class="wk">'+html+'</span>';
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    return '<span class="wk">'+html+'</span>';
                }else{
                    return '<span style="line-height:40px;">'+text+'</span>';
                }
                
            }
        },
        removeShare(item){
            VueEmit.$emit('custome',item)
            let _this = this;
            let customArr = objDeepCopy(_this.shareCustom)
            let len = this.shareCustom.length
            for(let i=0;i<len;i++){
                if(customArr[i].customer_id==item.customer_id){
                    customArr.splice(i,1);
                    break ;
                }
            }
            this.initData.forEach(items=>{
                if(items.customer_id==item.customer_id){
                    items.flag=false
                }
            })
            this.SHARECustom(customArr);
        },
        shareNameHand(name,index,parent){
            var zh_reg = /^[\u4e00-\u9fa5]+$/;
            let text=name;
            if (!zh_reg.test(text.substr(0,1))) {
                let nameA=text.length>5?text.substring(0,5):text;
                if(nameA.length<3){
                    return '<span style="line-height:40px;">'+nameA+'</span>';
                }else{
                    if((nameA.length==4 && len(text)==4 )|| (nameA.length==5 && len(text)==5 )  ){
                        return '<span style="line-height:40px;">'+nameA+'</span>';
                    }else if(len(text)>4){
                        let html= nameA.substring(0,2)+'</br>'+nameA.substring(2);
                        this.industryData[parent].children[index].logoNameFlag=true;             
                        return '<span class="wk">'+html+'</span>';
                    }else{
                        return '<span style="line-height:40px;">'+nameA+'</span>';
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    this.industryData[parent].children[index].logoNameFlag=true;
                    return '<span class="wk">'+html+'</span>';
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    this.industryData[parent].children[index].logoNameFlag=true;
                    return '<span class="wk">'+html+'</span>';
                }else{
                    return '<span style="line-height:40px;">'+text+'</span>';;
                }
                
            }
            
        },
        changeType(id){
            this.industryData.forEach(function(items){
                if(items.id==id){
                    items.childFlag=!items.childFlag;
                }
            },this)
        },
        selectOneCustom(id,customer_id,flag){
            let type=this.$route.query.type
            if(this.$route.query.type||this.chooseType==2){//为单选分组
                let len = this.industryData.length;
                this.industryData.forEach(function(items){
                    items.children.forEach(function(item){
                        if(item.customer_id==customer_id){
                            item.flag=!item.flag
                            if(item.flag){
                                let myArr=[];
                                myArr.push(item)
                                this.SHARECustom(myArr)
                            }else{
                                this.SHARECustom([])
                            }
                        }else{
                            item.flag=false
                        }
                    },this)
                },this)
                this.initData.forEach(function(item){
                    if(!flag){
                        if(item.customer_id==customer_id){
                            item.flag=true
                        }else{
                            item.flag=false
                        }
                    }else{
                        if(item.customer_id==customer_id){
                            item.flag=false
                        }
                    }
                    
                })
            }else{
                let k=0
                let len = this.industryData.length;
                for(let i=0;i<len;i++){
                    if(this.industryData[i].children){
                        let childLen = this.industryData[i].children.length;
                        for(let j=0;j<childLen;j++){
                            if(customer_id==this.industryData[i].children[j].customer_id){
                                this.industryData[i].children[j].flag=!this.industryData[i].children[j].flag;
                                let myArr=this.shareCustom;
                                if(this.industryData[i].children[j].flag){
                                    if(this.shareCustom.length>0){
                                       for(let n=0;n<myArr.length;n++){
                                           if(myArr[n].customer_id==customer_id){
                                               k++
                                           }
                                       }
                                       if(k==0){
                                           myArr.push(this.industryData[i].children[j])
                                       }
                                       this.SHARECustom(myArr)
                                    }else{
                                        myArr.push(this.industryData[i].children[j])
                                        this.SHARECustom(myArr)
                                    }
                                    
                                }else{
                                    for(let n=0;n<this.shareCustom.length;n++){
                                        if(myArr[n].customer_id==customer_id){
                                            myArr.splice(n,1);
                                            break ;
                                        }
                                    }
                                    this.SHARECustom(myArr)
                                }
                            }
                        }
                    }
                };
                this.initData.forEach(function(item){
                    if(!flag){
                        if(item.customer_id==customer_id){
                            item.flag=true
                        }
                    }else{
                        if(item.customer_id==customer_id){
                            item.flag=false
                        }
                    }
                    
                })
            }
        },
    },
    
    computed: {
        ...mapState({
            data:state => state.data,
            shareCustom:state => state.user.shareCustom,
            chooseCustomerListData:state => state.customer.chooseCustomerListData,
            segmentListData:state => state.customersegment.segmentListData,
            customerGroupData:state=>state.customer.customerGroupData,
            workList:state=>state.customer.workList,
            resultChoice:state=>state.user.resultChoice
        })
    },
    watch: {
        workList(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:"20em"                                
                }) 
            }else{
                let _data = data.items
                if(_data.length>0){
                    if(this.shareCustom.length>0){
                        let share_len = objDeepCopy(this.shareCustom).length
                        for(let j=0,len=_data.length;j<len;j++){
                            for(let i=0;i<share_len;i++){
                                _data[j].customer_id = _data[j].id;
                                _data[j].type=0
                                _data[j].flag=false
                                _data[j].color=parseInt(Math.random()*3+1)
                                
                                if(_data[j].id==this.shareCustom[i].customer_id){
                                    _data[j].flag = true;
                                    break ;
                                }
                            }
                        }
                    }else{
                        _data.forEach(function(item){
                            item.customer_id=item.id
                            item.flag=false
                            item.type=0
                            item.color=parseInt(Math.random()*3+1)
                        },this)
                    }
                    let old_data=this.searchData
                    this.searchData=old_data.concat(_data)
                    this.loadFlag=false
                }
            }
        },
        customerGroupData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:"20em"                                
                }) 
            }else{
                let _data =  objDeepCopy(data.items)
                
                _data.forEach(function(item){
                    item.childFlag=false
                    if(item.list){
                        item.children=item.list
                        item.customer_id=item.id
                        item.userCount = '('+item.used_count+')'
                        item.children.forEach(function(ite){
                            ite.customer_id=ite.id
                            ite.type=0  
                            if(this.shareCustom.length>0){
                                let share_len = this.shareCustom.length
                                for(let i=0;i<share_len;i++){
                                    ite.flag=false
                                    ite.color=parseInt(Math.random()*3+1)
                                   if(this.shareCustom[i].customer_id==ite.customer_id){
                                        ite.flag=true
                                        break;
                                    }
                                }
                            }else{
                                ite.flag=false
                                ite.color=parseInt(Math.random()*3+1)
                            }
                            
                        },this)
                    }
                },this)
                this.industryData=_data
                this.loadFlag=false
            }

        },
        chooseCustomerListData(data){
            if(Object.keys(data).length>0){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"                                
                    }) 
                }else{
                    if(this.isgroup||this.isSearch||this.isShare||this.isLabels){
                        let _data = data.data.items
                        this.$nextTick(function(){
                            this.shareNumber = data.data.num_items;//共享客户总数
                        })
                        let _shareCustom = objDeepCopy(this.shareCustom)
                        if(_shareCustom.length>0){
                            let share_len = _shareCustom.length
                            for(let i=0;i<_data.length;i++){
                                _data[i].flag = false
                                _data[i].type=0
                                _data[i].color=parseInt(Math.random()*3+1)
                                for(let j=0;j<share_len;j++){
                                    if(_shareCustom[j].customer_id){
                                        if(_shareCustom[j].customer_id==_data[i].customer_id){
                                            _data[i].flag=true
                                        }
                                    }
                                }
                            }
                        }else{
                            _data.forEach(function(item){
                                item.flag=false
                                item.type=0
                                item.color=parseInt(Math.random()*3+1)
                            },this)
                        }
                        if(this.isLabels){
                            if(this.isRefresh){
                                this.isRefresh=false
                                this.labelsData =_data
                            }else{
                                let old_data=this.labelsData
                                this.labelsData=old_data.concat(_data)
                            }
                            this.loadFlag=false
                            this.onFetching=!data.data.has_more
                        }else if(this.isShare){
                            if(this.isRefresh){
                                this.isRefresh=false
                                this.myShareData =_data
                            }else{
                                let old_data = this.myShareData
                                this.myShareData =old_data.concat(_data) 
                            }
                            
                            this.loadFlag=false
                            this.onFetching=!data.data.has_more
                            
                        }
                    }else{
                        let _data = data.data.items
                        if(this.shareCustom.length>0){
                            let share_len = this.shareCustom.length
                            for(let i=0;i<share_len;i++){
                                _data.forEach(function(item){
                                    item.type=0
                                    if(this.shareCustom[i].customer_id==item.customer_id){
                                        item.flag=true
                                    }
                                    item.color=parseInt(Math.random()*3+1)
                                },this)
                            }
                        }else{
                            _data.forEach(function(item){
                                item.type=0
                                item.flag=false
                                item.color=parseInt(Math.random()*3+1)
                            },this)
                        }
                        if(this.isRefresh){
                            this.initData = _data
                            this.isRefresh=false
                        }else{
                            let old_data=this.initData
                            this.initData=old_data.concat(_data)
                        }
                        this.loadFlag=false
                        this.onFetching=!data.data.has_more
                        
                    }
                }
            }
        },
        shareCustom(data){
            this.$emit('changeShare',data)
            let width = data.length*60+5+'px'
            this.$nextTick(function(){
                $('.signCustomUl').css('width',width)
            })
        },
        isShare(data){
            if(!data){
                document.title='选择客户'
            }
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top:0
                })
            })
        },
        isgroup(data){
            if(!data){
                document.title='选择客户'
            }
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top:0
                })
            })
        },
        isLabels(data){
            if(!data){
                document.title='选择客户'
            }
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top:0
                })
            })
        },
        mylabels(data){
            if(!data){
                document.title='选择客户'
            }
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top:0
                })
            })
        },
        isSearch(data){
            if(!data){
                document.title='选择客户'
            }
            this.$nextTick(function(){
                this.$refs.scroller.reset({
                    top:0
                })
            })
        },
    },
    components: {
        Search, Group, Cell, Scroller, LoadMore, Badge,XButton,labelPage,Popup,Checklist,Icon,GroupTitle
    },
    
}
</script>

<style lang="less">
 @import './index.less';
</style>
<style lang="less" scoped>
   @import '../../../../../css/listA.less';
</style>
