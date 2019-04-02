<template>
<div  class="checkAll">     
        <scroller  
            lock-x  
            scrollbarY 
            @on-scroll-bottom="loadMore" 
            @on-scroll="OnScroll" 
            @on-pulldown-loading="refresh" 
            v-model="status" 
            :use-pulldown="!scrollerFlag"  
            ref="scroller" 
            :height="Object.keys(AllArr).length == 0 ||   AllArr.num_items==0 ?'-0': '-36'"   
            :scroll-bottom-offst="0"
        >
            <div>
                <div  v-if="Object.keys(AllArr).length == 0 ||   AllArr.num_items==0 " class="wu-all wu-allB">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>{{ Object.keys(AllArr).length == 0? alertMsg:'暂无数据'}}</p>
                    </section>
                </div>
                <checklist  v-else ref="AllObj" :options="ArrData" v-model="checkVal" :max="this.max" @on-change="change"></checklist>
                <load-more tip="加载中" v-if="loadFlag && !scrollerFlag" ></load-more>
                <div class="no-more"  v-if="!loadFlag && onFetching && page >1 && !scrollerFlag" >已到底部</div>
            </div>
            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" :style="{position: 'absolute', width: '100%', height:'60px', lineHeight: '60px',  top:'-60px' , textAlign: 'center'}">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放刷新</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>  
        </scroller>
        <footer   v-if="!( Object.keys(AllArr).length == 0 ||   AllArr.num_items==0 ) " :class="{'buttn-more': btnMore}"><x-button type="primary" @click.native="allHand" v-if="btnMore">{{checkObj.allListFlag?'取消全选':'全选'}}</x-button><x-button type="primary" @click.native="saveHand">{{saveText?'保存':'确定'}}</x-button></footer>
</div>


</template>
<script>
import { Checklist,Scroller,XButton, LoadMore} from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'
export default {
    name: 'checkAll',
         data () {
        return {
            page:1,
            count:20,
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
            AllArr:{},  
            ArrData:[],
            checkVal: [],
            scrollerFlag:false,//有没有滚动 加载效果
            max:1,
            btnMore:false,//当有两个 按钮的时候为真
            saveText:false,
        }
    },
    props:['checkObj'],
    created(){  
       this.checkVal=this.checkObj.checkCur;
       //  this.loadingHand(true)
       this.checkAllHand();       
    },
    watch: {
        //  checkAllData(data){            
        //     if( Object.keys(data).length >0){
        //        if(this.onload){
        //             this.onload=false
        //             this.loadingHand(false)
        //         } 
        //         if(data.alert_msg){
        //             this.$vux.toast.show({
        //                 text: data.alert_msg,
        //                 type: 'text',
        //                 position: 'top',
        //                 width:'20em'
        //             })
        //         }else{ 
                    // let ArrObj= data;
                    // let checkList=[];                        
                    // if(this.pulldown || this.page==1){
                    //     this.ArrData=[];
                    //     this.ArrData= ArrObj.items;
                    //     this.status.pulldownStatus = 'default';                        
                    // }else{
                    //     this.ArrData= this.ArrData.concat(ArrObj.items) ;                                            
                    // }                   
                    // if(ArrObj.has_more){
                    //     this.onFetching = false ;
                    //     this.loadFlag=true;
                    // }else{
                    //     this.loadFlag=false
                    //     this.onFetching = true 
                    // }
                    
        //             this.AllArr = ArrObj ;  

        //         }
        //     }
        //  },
        //外呼号码
          phoneListData(data){            
            if( Object.keys(data).length >0){                
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
                    let ArrData=[];
                    data.items.forEach((item,index)=>{
                        let obj={
                            key:item.callPhoneId,
                            value:item.phone,
                        }
                        ArrData.push(obj)
                    })
                    this.ArrData=ArrData;
                    ArrObj.items=ArrData;
                    this.AllArr = ArrObj ;  

                }
            }
         },
         //席位
          seatsData(data){  
            if( Object.keys(data).length >0 ){  
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{   
                    this.checkObj.checkCur=this.checkVal;
                    this.checkObj.checkCurData=this.$refs.AllObj.getFullValue();
                    this.checkObj.checkFlag=false;
                    let obj={
                        total:data.items.totalConcurrencyQuota,
                        free:Number(data.items.totalConcurrencyQuota)-Number(data.items.usedConcurrencyQuota),
                        has:data.items.usedConcurrencyQuota,
                    }
                    let name=[];
                    if(this.checkObj.checkCurData.length>0){
                        this.checkObj.checkCurData.forEach((item,index)=>{
                            name.push(item.label);
                        })
                       this.checkObj.checkCurName=name.join(',')
                    }else{
                       this.checkObj.checkCurName='';
                    }
                  
                    this.$emit('toggle',obj);
                    
                }
                
            }
         },  
         
    },
    computed: {
        ...mapState({
            phoneListData: state => state.ai.phoneListData,
            seatsData: state => state.ai.seatsData,      
            
        })       
    },
    methods: {
        ...mapActions({
            phoneListHand:'ai/phoneListHand',
             seatsHand:'ai/seatsHand',
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
           
        }),
        checkAllHand(){
            if(this.checkObj.urlName=='callNumber'){//外呼号码
                this.scrollerFlag=true;
                this.max=1000000;
                this.btnMore=true;
                this.saveText=true;
                let obj={
                    phone_type:this.checkObj.phoneType,
                    company_id:this.companyId,
                }
                this.phoneListHand(obj);
            }else{
                let Arr= [
                    {key: '1', value: '杭州线路-杭州线路101'}, 
                    {key: '2', value: '杭州线路-杭州线路102'}, 
                    {key: '3', value: '杭州线路-杭州线路103'}
                    ]
                this.ArrData=Arr;
                this.AllArr.num_items='22'
            }
        },
        //保存或确定
        saveHand(){
            if(this.checkObj.urlName=='callNumber'){               
                if(this.checkVal.length){
                    let obj={
                        call_phone_ids:JSON.stringify(this.checkVal),
                    }
                    this.seatsHand(obj);
                }else{
                    this.checkObj.checkCur=this.checkVal;
                    this.checkObj.checkCurData=this.$refs.AllObj.getFullValue();
                    this.checkObj.checkFlag=false;
                    let obj={
                        total:0,
                        free:0,
                        has:0,
                    }
                    let name=[];
                    if(this.checkObj.checkCurData.length>0){
                        this.checkObj.checkCurData.forEach((item,index)=>{
                            name.push(item.label);
                        })
                       this.checkObj.checkCurName=name.join(',')
                    }else{
                       this.checkObj.checkCurName='';
                    }
                    this.$emit('toggle',obj);   
                }
                
                
            }else{
                this.checkObj.checkCur=this.checkVal;
                this.checkObj.checkCurData=this.$refs.AllObj.getFullValue();
                this.checkObj.checkFlag=false;
                let name=[];
                if(this.checkObj.checkCurData.length>0){
                    this.checkObj.checkCurData.forEach((item,index)=>{
                        name.push(item.label);
                    })
                   this.checkObj.checkCurName=name.join(',')
                }else{
                   this.checkObj.checkCurName='';
                }
                this.$emit('toggle');
            }
            
        },
        allHand(){            
            if(this.checkObj.allListFlag){
                this.checkVal=[];                
            }else{
                let key=[];
                this.ArrData.forEach((item,index)=>{
                    key.push(item.key);
                });
                this.checkVal=key;
            }
            this.checkObj.allListFlag=!this.checkObj.allListFlag;
               
        },
        //滚动
        OnScroll(){           
            this.$refs.scroller.reset()
        },       
        loadMore () {
            if(this.scrollerFlag){

            }else if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                this.checkAllHand();     
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true
                this.page = 1;               
                this.checkAllHand();  
            }
        },  
        change(value){
            if(this.btnMore){
                if(this.ArrData.length==value.length){
                    this.checkObj.allListFlag=true;
                }else{
                    this.checkObj.allListFlag=false;
                }

            }
            
        }
    },
    components: {
      Checklist,
      Scroller,
      XButton ,
      LoadMore
    },
    
}
</script>
<style lang="less" >
 @import './index.less';
</style>