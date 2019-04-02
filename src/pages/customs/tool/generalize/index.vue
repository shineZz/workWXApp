<template>
    <div class="generalize" style="height:706px;">       
        <div class="search-box-hd">
            <section>
                <search
                    @on-change="getResult"
                    v-model="searchVal"

                    top="0px"
                    @on-focus="onFocus"
                    @on-cancel="onCancel"
                    @on-submit="onSubmit"
                    placeholder="输入任务标题进行搜索"
                    ref="search">
                </search>
            </section>
            <aside v-if="searchHide">
                <a href="javascript:"  @click="labelShow">筛选</a>
                <a href="javascript:"  @click="releaseTask">发布任务</a>
            </aside>
        </div>
        <scroller   
          
          lock-x  
          scrollbarY 
          @on-scroll-bottom="loadMore" 
          @on-scroll="OnScroll" 
          @on-pulldown-loading="refresh" 
          v-model="status" 
          use-pulldown  
          ref="scroller" 
          height="-44"
          :scroll-bottom-offst="0"
         
          >
            <div  v-if="Object.keys(initData).length == 0 ||   initData.num_items==0 " class="wu-all wu-allB">
                <section>
                    <div><img src="~@/images/wu-icon1.png"></div>
                    <p v-html=" Object.keys(initData).length == 0? alertMsg: msgText "></p>
                </section>
            </div>
            <div class="tool-list" v-else  >
                <ul>
                    <li>
                        <article v-for="(item,index) in ArrData" :key='index' @click.stop="previewGeneralize(item.details_url)">
                            <section class="vux-1px-b">
                                <header>
                                    <h5>{{item.task_name}}</h5>
                                    <p class="ui-text-gary">推广总数：{{item.task_amount}}</p>
                                </header>
                                <p class="it-time">发布日期：{{item.start_time.substring(0,item.start_time.length-3)}}</p>
                                <p class="it-time">截止日期：{{item.end_time.substring(0,item.end_time.length-3)}}</p>
                                <p class="it-commission it-time"><i>奖励佣金：{{myNumberComma(item.gold_coin_amount)}}</i><i >服务佣金：{{ myNumberComma(item.service_commission)}}</i></p>
                                <p>总佣金：{{serviceHand(item)}}</p>
                            </section>
                            <footer class="footer-btn">
                                <p>{{item.task_status_name}}
                                </p>
                                <div class="btn-box">
                                    <x-button 
                                        mini 
                                        type="primary" 
                                        plain 
                                        v-if="(item.desc_type==4||item.content_from==4)&&(item.task_status==6||item.task_status==5)"
                                        @click.native.stop="checkGeneralize(item.task_id,index)">
                                        编辑
                                    </x-button>
                                    <x-button 
                                        mini 
                                        type="primary" 
                                        plain 
                                        v-if="item.task_status==6"
                                        @click.native.stop="submitRecom(item.task_id,index)">
                                        立即提交
                                    </x-button>
                                    <x-button
                                        mini 
                                        type="primary"
                                        plain
                                        v-if="item.task_status==1||item.task_status==3||item.task_status==4||item.task_status==11||item.task_status==12||item.task_status==13"
                                        @click.native.stop="Recommended(item.task_id)" :disabled="type==2&&item.recommend_process&&item.recommend_process.audit_num_2==0">
                                        {{type==1?'推广统计':"推荐采纳"}}
                                    </x-button>
                                    <x-button 
                                        mini 
                                        type="primary" 
                                        plain 
                                        v-if="item.task_status==9" 
                                        @click.native.stop="mastSubmit(item.task_id,index)">
                                        立即上架
                                    </x-button>
                                </div>
                            </footer>
                        </article>
                    </li>
                </ul>
                <load-more tip="加载中" v-if="loadFlag" ></load-more>
                <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
            </div>
            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉加载更多</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放后加载</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>
        </scroller>
        
        <div class="mylabel-box" v-show="isLabel"  @click.stop="backColseLabel">
            <div class="label-md bg-fff" >                        
                <checker class="screening-list"  type="radio"  v-model="screeingVal" radio-required selected-item-class="cur" @on-change="screeningChang">
                    <checker-item  v-for="(item,index) in screeingData" :value="item" :key="index" >{{item.name}}</checker-item>                               
                </checker>                  
            </div>
        </div>
    </div>
</template>

<script>
import { Scroller , XButton ,Search,TransferDom,LoadMore,numberComma ,Checker, CheckerItem,} from 'vux'
import { mapState,mapActions,mapMutations, } from 'vuex'
export default {
  name: 'generalize',
  directives: {
    TransferDom
  },
  data() {
    return {
     
      page:1,
      count:10,
      companyId:this.$store.state.userInfo.company.companyId,
      userId:this.$store.state.userInfo.user.userId,  
      loadFlag:false ,//加载图标 要不 要显示
      onFetching:false,//要不要滚动加载
      onload:false,//要不要滚动加载
      status: {
          pulldownStatus: 'default',
      },
      pulldown:false,
      alertMsg:'加载中...',//第一次


      initData: {},
      ArrData:[],

       isLabel: false,
      operationId: '',

      searchStatus: '',
      searchVal: '',
      searchHide: true,
      type:1,
      title:'推广',
      //筛选
      screeningFlag:false,//按钮弹弹出的窗口
      screeingVal:{
                      value:'16',
                      name:'全部',
                  },  
      screeingData:[],
      msgText:'',//无数据内容
      dataWu:'1',
    }
  },
  created() {
    this.type =this.$route.query.type;
    this.title= (this.type==2?'猎客':'推广');
    document.title=this.title;
    this.ArrHand(1,1);
    //初始化任务状态
    this.recommend_getTaskStatusLists();

  },
  methods: {
    ...mapMutations({
      CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
      SEARCH_VALUE: 'resume/SEARCH_VALUE',
        loadingHand: 'UPDATE_LOADING',
    }),
    ...mapActions({
      recommend_getRecomLists: 'recommend/getRecomLists',
      recommend_submitRecomTask: 'recommend/submitRecomTask',
      recommend_onLineRecomTask: 'recommend/onLineRecomTask',
      promotion_getProLists: 'promotion/getProLists',
      promotion_onLineProTask: 'promotion/onLineProTask',
      promotion_submitProTasks: 'promotion/submitProTasks',
      recommend_getTaskStatusLists: 'recommend/getTaskStatusLists',

    }),
    //金额转化
    myNumberComma(data){
      return numberComma( data)
    },
    serviceHand(item){
        let text =Number(item.task_amount)*(Number(item.gold_coin_amount)+Number(item.service_commission));
            text = Math.floor(text * 100) / 100

        var s = text.toString();  
        var rs = s.indexOf('.');  
        if (rs < 0) {  
            rs = s.length;  
            s += '.';  
        }  
        while (s.length <= rs + 2) {  
            s += '0';  
        } 
        return numberComma(s)
    },

      //推广统计、推荐采纳
      Recommended(task_id) {
        if (this.type==1) {
          //推广数据报表
          this.$router.push({name: "analysis",params:{tid:task_id}})
        } else {
          //采纳数据
          this.$router.push({path: "accept",query:{task_id:task_id}})
        }
      },


      //上架
      mastSubmit(id, index) {
        this.operationId = index;
        let obj = {
          task_id: id,
          company_id: this.companyId
        };

        if (this.type == 2) {
          this.recommend_onLineRecomTask(obj);
        } else {
          this.promotion_onLineProTask(obj);
        }

      },
      //提交
      submitRecom(id,index) {
        this.operationId = index;
        let obj = {
          task_id: id,
          company_id: this.companyId
        }
        if (this.type == 2) {
          this.recommend_submitRecomTask(obj)
        } else {
          this.promotion_submitProTasks(obj)
        }

      },

      //编辑任务
      checkGeneralize(task_id) {
        let type = this.type
        this.$router.push({path: 'releaseTask', query: {id: task_id, type: type}})
      },


      labelShow() {
        this.isLabel = !this.isLabel;        
      },
      backColseLabel() {
        this.isLabel = false
      },
      //发布任务
      releaseTask() {
        let type = this.type
        this.$router.push({path: 'releaseTask', query: {type: type}})
      },

      //任务详情
      previewGeneralize(url) {
        if(this.type==1){
          this.$router.push({name:'iframe',query:{title:'推广详情',url:url}})
        }else{
          this.$router.push({name:'iframe',query:{title:'猎客详情',url:url}})
        }
        
      },
      OnScroll(){           
            this.$refs.scroller.reset()
        },  
      //下拉 上拉
        loadMore () {
             if (!this.onFetching) {
              this.onFetching = true;
              this.pulldown=false;
              this.page = this.page+1;
              this.ArrHand(1);
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.onFetching = false
                this.pulldown=true;
                this.page = 1;
                this.ArrHand(1);
            }
        },
        
         //筛选
        screeningChang(val){
            this.$nextTick(() => {
                this.$refs.scroller.reset({
                    top: 0
                })
            });        
            
            this.ArrHand(2,1);
        },  
          //数据请求参数
        ArrHand(type,num){
            if(num==1){
                this.onload=true;
                this.pulldown=true;    
                this.loadingHand(true);
                this.page = 1;
            }
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                page: this.page,
                count: this.count,
                }
            //为暂无消息用的参数
            this.dataWu=type;
            //筛选
            if(Object.keys(this.screeingVal).length >0 &&　this.screeingVal.value!='16'){
                obj.task_status = this.screeingVal.value;
            }
            //搜索的值
            if (this.searchVal) {
                obj.task_name = this.searchVal
            }
            if (this.type == 2) {
                this.recommend_getRecomLists(obj)
            } else {
                this.promotion_getProLists(obj)
            }
        },
        //获取焦点输入
        onFocus() {
            this.searchHide = false;
            this.isLabel=false;
        },
        
        //搜索取消 (置空搜索数据)并重新搜索
        onCancel() {
            this.$nextTick(() => {
                this.$refs.scroller.reset({
                    top: 0
                })
            });
            this.searchHide = true;
            this.searchVal = '';
        },
        //输入框中输入变更
        getResult(val) {
            let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
            let value = val.replace(reg,'')
            if(value.length>50){
                value = value.substr(0,50)
            }
            setTimeout(() => {
                this.searchVal = value;
            },10)
            if(value.length==''){
                this.ArrHand(3,1);
            }
            
        },

        //搜索提交
        onSubmit() {
            this.$nextTick(() => {
                    this.$refs.scroller.reset({
                        top: 0
                    })
                });
            this.$refs.search.setBlur();
            this.ArrHand(3,1);
        },


    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            recomListData:state=>state.recommend.recomListData,
            subRecomData:state=>state.recommend.subRecomData,
            onLineRecomData:state=>state.recommend.onLineRecomData,
            subProData:state=>state.promotion.subProData,
            onLineProData:state=>state.promotion.onLineProData,
            taskStatusData:state=>state.recommend.taskStatusData,
            proListData:state=>state.promotion.proListData,
        }),
        
    },
    watch:{
        //推广数据提交
        subProData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                this.$vux.toast.show({
                    text: '提交成功',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                //变更状态
                this.initData.items[this.operationId]['task_status']=2;
                this.initData.items[this.operationId]['task_status_name']="待客服审核";
            }
        },

        //推广任务上架
        onLineProData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                this.$vux.toast.show({
                    text: '已上架',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                //变更状态
                this.initData.items[this.operationId]['task_status']=3;
                this.initData.items[this.operationId]['task_status_name']="已发布";
            }
        },

        //推广任务列表
        proListData(data){
            if( Object.keys(data).length >0 ){ 

                if(this.onload){
                this.onload=false
                this.loadingHand(false)
                }
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.alertMsg=data.alert_msg;
                }else{
                        let ArrObj=data;
                        //暂时消息的
                        if(data.items.length==0){
                            if(this.dataWu=='1'){
                                this.msgText='暂无'+this.title+'任务,快来发布吧';
                            }else if(this.dataWu=='2'){
                                this.msgText='根据你的筛选条件未找到匹配的<br>结果，请更换筛选条件';
                            }else{
                                this.msgText='根据你的搜索条件未找到匹配的<br>结果，请更换搜索条件';
                            }
                        }
                        if(this.pulldown){
                            this.ArrData= data.items;
                            this.status.pulldownStatus = 'default'
                            this.loadFlag=true;
                        }else{
                            this.ArrData= this.ArrData.concat(data.items) ;                                            
                        }            
                        ArrObj.items=this.ArrData;           
                        if(data.has_more){
                            this.onFetching = false ;
                            this.loadFlag=true;
                        }else{
                            this.loadFlag=false
                            this.onFetching = true 
                        }
                        this.initData = ArrObj ;
                    
                }
            }
        },

        //推荐任务上架
        onLineRecomData(data){//上架
            // conosole.log(data,'onLineRecomData')
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                this.$vux.toast.show({
                    text: '已上架',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
              //变更状态
              this.ArrData[this.operationId]['task_status']=3;
              this.ArrData[this.operationId]['task_status_name']="已发布";
            }
        },//获取列表
        recomListData(data){
           if( Object.keys(data).length >0 ){  
                if(this.onload){
                    this.onload=false
                    this.loadingHand(false)
                }
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.alertMsg=data.alert_msg;
                }else{
                        let ArrObj=data;
                        //暂时消息的
                        if(data.items.length==0){
                            if(this.dataWu=='1'){
                                this.msgText='暂无'+this.title+'任务,快来发布吧';
                            }else if(this.dataWu=='2'){
                                this.msgText='根据你的筛选条件未找到匹配的<br>结果，请更换筛选条件';
                            }else{
                                this.msgText='根据你的搜索条件未找到匹配的<br>结果，请更换搜索条件';
                            }
                        }
                        if(this.pulldown){
                            this.ArrData= data.items;
                            this.status.pulldownStatus = 'default'
                            this.loadFlag=true;
                        }else{
                            this.ArrData= this.ArrData.concat(data.items) ;                                            
                        }            
                        ArrObj.items=this.ArrData;           
                        if(data.has_more){
                            this.onFetching = false ;
                            this.loadFlag=true;
                        }else{
                            this.loadFlag=false
                            this.onFetching = true 
                        }
                        this.initData = ArrObj ;
                    
                }
            }
        },

        //推荐数据提交
        subRecomData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                this.$vux.toast.show({
                    text: '提交成功',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                //变更状态
                this.ArrData[this.operationId]['task_status']=2;
                this.ArrData[this.operationId]['task_status_name']="待客服审核";
            }

        },

        //任务状态列表筛选
            taskStatusData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                  let screeingArr=[{
                      value:'16',
                      name:'全部',
                  }];
                    data.items.forEach((item,index)=>{
                        let obj={
                            value:item.val,
                            name:item.name,
                        }
                        screeingArr.push(obj)
                    })
                this.screeingData=screeingArr;
            }
        },

    },
    components: {
        Scroller,
        XButton,
        Search,
        LoadMore,Checker, CheckerItem,
    },
}
</script>
<style lang="less">
    .generalize{
        .weui-search-bar__label{
            display: none;
        }
        .weui-search-bar{
            height: 44px !important;
        }
        .weui-search-bar__box .weui-icon-search{
            line-height: 24px
        }
        .weui-search-bar__box .weui-search-bar__input{
            padding:3px 0; 
            line-height: 24px;
        }
        .mylabel-box{
            position: absolute;
            top:44px;
            bottom:0;
            width: 100%;
            background:rgba(0,0,0,0.5) ;
            .mylabel{
                box-sizing: border-box;
                padding: 10px 0 0 15px ;
                width: 100%;
                height: auto;
                overflow: hidden;
                display: flex;
                flex-wrap: wrap;
                span{
                    box-sizing: border-box;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin-right: 15px;
                    i{
                        display: inline-block;
                        line-height: 20px;
                        border: 1px solid #eeeeee;
                        border-radius: 5px;
                        padding: 0 5px;
                        font-style: normal;
                        margin-bottom: 10px;
                    }
                    i.active{
                        background: @blue;
                        color: #fff;
                    }
                }
                background: #fff;
            }
        }
        .weui-btn{
            height: 20px;
            line-height:18px; 
        }
        .footer-btn{
            padding: 0 @px10 !important;
        }
    }
</style>
<style lang="less" scoped>
 @import '../../../../css/toolList.less';
  @import '../../../../css/screeing.less';
</style>
