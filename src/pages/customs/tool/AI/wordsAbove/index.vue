<template>
    <div>        
        <div class="nav-head">
            <ul>
                <li @click="orderHand(false)"  :class="{'cur': !order}" >时间降序<i></i></li>
                <li @click="orderHand(true)" :class="{'cur': order}">时间升序<i></i></li>
                <li  :class="{'cur': Object.keys(screeingVal).length >0}"   @click="screeningHand">筛选<i></i></li>
            </ul>
        </div>
        <div v-transfer-dom>
            <!-- 了解更多 -->
            <popup v-model="screeningFlag"  class="screening-all"  position="bottom" width='100%' :show-mask="false" :popup-style="{zIndex: 600}"> 
                <scroller v-if="screeingData.length==0" 
                    lock-x  
                    scrollbarY
                    height="-39" >             
                    <div class="wu-screenimg" >
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>暂无筛选数据</p>
                        </section>
                    </div>
                </scroller>
                <div v-else>
                    <scroller  
                        lock-x  
                        scrollbarY
                        height="-75" >             
                        <div class="label-md" >                        
                            <checker class="screening-list"  type="radio"  v-model="screeingVal" radio-required selected-item-class="cur" @on-change="screeningChang">
                                <checker-item  v-for="(item,index) in screeingData" :value="item" :key="index" >{{item.name}}</checker-item>                               
                            </checker>                  
                        </div>
                    </scroller>
                    <div><x-button type="primary" @click.native="resetHand" >重置</x-button></div>
                </div>
            </popup>
        </div>
        <div>
            <scroller  
                lock-x  
                scrollbarY 
                @on-scroll-bottom="loadMore" 
                @on-scroll="OnScroll" 
                @on-pulldown-loading="refresh" 
                v-model="status" 
                use-pulldown  
                class="loadmore-m0"
                ref="scroller" 
                height='-75'
                :scroll-bottom-offst="0">
                <div>
                    <div  v-if="Object.keys(wordsData).length == 0 ||   wordsData.num_items==0 " class="wu-all wu-allB">
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>{{ Object.keys(wordsData).length == 0? alertMsg:'暂无外呼话术数据'}}</p>
                        </section>
                    </div>
                    <div class="words-list" v-else>
                        <ul>
                            <li v-for="(item,index) in ArrData" :key="index" @click="checkHand(index)">
                                <section>
                                    <h5>{{item.robotName}}</h5>
                                    <dl>
                                        <dt>行业：</dt>
                                        <dd>{{item.industryName}}</dd>
                                    </dl>
                                    <!-- <dl>
                                        <dt>结果分析器：</dt>
                                        <dd>{{item.robotName}}</dd>
                                    </dl> -->
                                    <p>更新时间：{{item.updateTime.length==0?'--':item.updateTime}}</p>
                                </section>
                                <aside><icon :type="item.flag?'success':'circle' "></icon></aside>                            
                            </li>
                        </ul>
                    </div>
                    <load-more tip="加载中" v-if="loadFlag" ></load-more>
                    <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
                </div>
                <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" :style="{position: 'absolute', width: '100%',  top:'-30px' , textAlign: 'center'}">
                    <span v-show="status.pulldownStatus === 'default'"></span>
                    <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
                    <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放刷新</span>
                    <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
                </div>
            </scroller>
            <div  v-if="  !(Object.keys(wordsData).length == 0 || wordsData.num_items==0) "><x-button type="primary" @click.native="primaryHand" >确定</x-button></div>
        </div>
    </div>
</template>
<script>
import { Scroller,Cell,Group,XButton,LoadMore ,Confirm,  TransferDom    ,Icon , Checker, CheckerItem,Popup} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex';
export default {
    name: 'wordsAbove',
    data() {
        return {   
            page:1,
            count:10,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:true,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            pulldown:false,
            alertMsg:'加载中...',//第一次

            wordsData:{},    
            ArrData:[],

            order:false,//时间顺序
                      
            //筛选
            screeningFlag:false,//按钮弹弹出的窗口
            screeingVal:{},  
            screeingData:[],
            resetFlag:false,

        }
    },
    props:['wordsObj'],
    directives: {
        TransferDom
    },
    created() {
        //请求数据
        this.listHand(1);
        let obj={
            company_id:this.companyId,
        }
        this.industryScreeningHand(obj);         
    },
     watch: {
        //列表数据
         talkAboutData(data){  
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
                    });
                    this.status.pulldownStatus = 'default' ;
                    this.alertMsg=data.alert_msg;
                }else{      
                   
                    let ArrObj= JSON.parse(JSON.stringify(data)) ;
                    this.wordsObj.curData.forEach((item,index)=>{
                        let id=item.id;
                        ArrObj.items.forEach((it,i)=>{
                            if(id==it.id){
                                it.flag=true;
                            }
                        })
                    },this)
                    if(this.pulldown || this.page==1){
                        this.ArrData=[];
                        this.ArrData= ArrObj.items;
                        this.status.pulldownStatus = 'default';                        
                    }else{
                        this.ArrData= this.ArrData.concat(ArrObj.items) ;                                            
                    }                   
                    if(ArrObj.has_more){
                        this.onFetching = false ;
                        this.loadFlag=true;
                    }else{
                        this.loadFlag=false
                        this.onFetching = true 
                    }
                    this.wordsData = ArrObj ;
                    if(this.resetFlag){
                         this.screeingVal={};
                         this.resetFlag=false;
                    }

                }
                 this.screeningFlag=false;
                
            }
        },
        //行业筛选数据
         industryScreeningData(data){  
            if( Object.keys(data).length >0 ){ 
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{  
                    let screeingArr=[];
                        data.items.forEach((item,index)=>{
                            let obj={
                                value:index,
                                name:item.industryName,
                            }
                            screeingArr.push(obj)
                        })
                   
                    this.screeingData=screeingArr;
                }
                
            }
         },
     },
     computed: {
        ...mapState({
            talkAboutData: state => state.ai.talkAboutData,
            industryScreeningData: state => state.ai.industryScreeningData,

            
        })
    },
     methods: {
         ...mapActions({
             talkAboutHand: 'ai/talkAboutHand',
             industryScreeningHand: 'ai/industryScreeningHand',
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
        }),
        OnScroll(){           
            this.$refs.scroller.reset()
        },  
        // 第一次请求导航请求 
        listHand(type){          
                if(type==1){
                    this.page=1;
                    this.onload=true;
                    this.loadingHand(true);
                }
                let obj={
                    company_id:this.companyId,
                    sort:this.order?'1':'0',
                    page:this.page,
                    count:this.count,
                    
                }
                if(Object.keys(this.screeingVal).length >0){
                    obj.industry_name=this.screeingVal.name;
                }
                this.talkAboutHand(obj); 
        },     
        loadMore () {
            
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                this.listHand(2);              
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true
                this.page = 1;
                this.listHand(2); 
            }
        },  
        //选中
        checkHand(index){
            let flag=!this.ArrData[index].flag;
            this.ArrData.forEach((item,i)=>{
                if(index==i){
                    item.flag=flag;
                }else{
                    item.flag=false;
                }
            })
        },
        //顺序
        orderHand(type){
            if(type!=this.order){
                this.order=!this.order;
                this.screeningFlag=false;
                 this.$refs.scroller.reset({
                top: 0
                })
                this.listHand(1);
            }
        },
        //筛选
        screeningHand(){
            this.screeningFlag= !this.screeningFlag;
        },
        screeningChang(val){
            
            this.$refs.scroller.reset({
                top: 0
            })
            this.listHand(1);
        },        
        //重置
        resetHand(){
           this.$refs.scroller.reset({
                top: 0
            })
            this.listHand(1);
            this.resetFlag=true;
            
        },
        //确定
        primaryHand(){
            let wordsCurData=[];
            let wordsName=[];
            let wordsId=[];
            this.wordsData.items.forEach((item,index)=>{
                if(item.flag){
                    wordsCurData.push(item);
                    wordsName.push(item.robotName);
                    wordsId.push(item.id);
                }
            })
            let obj={
                wordsCurData,wordsName,wordsId
            }
             this.$emit('toggle',obj)
        }
        
    },
    components: {
        Cell,Group,Confirm,

        Icon,XButton,Scroller,LoadMore, Checker, CheckerItem,Popup
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
 @import '../../../../../css/screeing.less';
</style>
