<template>
    <div class="voice-all">        
        <flexbox :gutter="0" class="voice-head vux-1px-b">
            <flexbox-item>
                <dl class="flex-demo ">
                    <dt>AI意向等级</dt>
                    <dd>{{aiResultValue}}</dd>
                </dl>
            </flexbox-item>
            <flexbox-item>
                <dl class="flex-demo vux-1px-l">
                    <dt>人工意向等级</dt>
                    <dd>
                        <popup-picker :class="{'ded': linkType!=1}"  value-text-align="center" :data="list" v-model="value" show-name  @on-change="levelHand" placeholder="请选择意向等级"  :columns="1"  :popup-style="{zIndex: 9000}"  :disabled="linkType==1"   ></popup-picker>
                    </dd>
                </dl>
            </flexbox-item>
        </flexbox>
        <div  v-if="Object.keys(aiData).length == 0 ||   aiData.num_items==0 " class="wu-all wu-allA">
            <section>
                <div><img src="~@/images/wu-icon1.png"></div>
                <p>{{ Object.keys(aiData).length == 0? alertMsg:finishStatus==0? '因智能分析需要时间，略有延迟，请耐心等待' :finishVal}}</p>
            </section>
        </div>
        <div v-else>
            <scroller  
                lock-x  
                scrollbarY 
                @on-scroll="OnScroll"
                ref="scroller" 
                height='-103'
               >
                <div>
                    <div class="chat-record">
                        <div v-for="(item,index) in aiData.items" :key="index" >
                            <article class="record-l" v-if="item.speaker==0">
                                <aside><img :src="pic2"  :onerror="logo2"/></aside>
                                <section>
                                    <i class="arrow"></i>
                                    <div>{{item.content}}</div>
                                </section>
                            </article>
                            <article  class="record-r" v-else>                            
                                <section>
                                    <i class="arrow"></i>
                                    <div>{{item.content}}</div>
                                </section>
                                <aside><img :src="pic"  :onerror="logo" /></aside>
                            </article>
                        </div>
                    </div>
                </div>
            </scroller>
            <div style="width: 100%;"><audio id="audio" style="width: 100%;" :src="luyinOssUrl" controls="controls"></audio></div>
        </div>
    </div>
</template>
<script>
import { Scroller,LoadMore , Flexbox, FlexboxItem,PopupPicker  } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex';

export default {
    name: 'AI',
    data() {
        return {   
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
           
            aiData:{}, 
            value:[],
            value1:[],
            list: [
                {
                    name: 'A级(较强)',
                    value:'A级(较强)',
                }, 
                {
                    name: 'B级(一般)',
                    value: 'B级(一般)',
                    
                },
                {
                    name: 'C级(很少)',
                    value:'C级(很少)',
                    
                },
                {
                    name: 'D级(需筛选)',
                    value: 'D级(需筛选)',
                    
                }, 
                {
                    name: 'E级(需要再次跟进)',
                    value:  'E级(需要再次跟进)',
                    
                },
                {
                    name: 'F级(无需跟进)',
                    value: 'F级(无需跟进)',
                    
                },
            ],
            aiResultValue:this.$route.query.aiResultValue,
            luyinOssUrl:this.$route.query.luyinOssUrl,
            pic:this.$route.query.pic,
            pic2:this.$route.query.pic2,
             logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
             logo2: 'this.src="' + require('@/images/girl_logo.jpg') + '"' ,
              alertMsg:'加载中...',//第一次
              linkType:this.$route.query.linkType,

              finishStatus:0,
              finishVal:'',

        }
    },
    created() {
        let finishStatus= this.$route.query.finishStatus;
            this.finishStatus=finishStatus;
            this.finishVal=finishStatus==0?'':finishStatus==1?'拒接':finishStatus==2?'无法接通':finishStatus==3?'主叫号码不可用':finishStatus==4?'空号':finishStatus==5?'关机': finishStatus==6?'占线':finishStatus==7?'停机':finishStatus==8?'未接':'主叫欠费';
        let resultValue=[];
        let text= localStorage.getItem("resultValue") || '';
            if(text.length>0){                
                resultValue.push(text)
            }
        this.value=resultValue;

        let obj={
            phone_record_id:this.$route.query.id,
        }
        this.taskPhoneDetailHand(obj);
        // 意向选择数据
        this.customerResultHand()
       
    },
    computed: {
        ...mapState({
            taskPhoneDetaiData: state => state.ai.taskPhoneDetaiData,  
            intentionGradeData: state => state.ai.intentionGradeData,
            customerResultData:state => state.ai.customerResultData,
        })       
    },
     watch: {
         
        //列表数据
         taskPhoneDetaiData(data){  
            if( Object.keys(data).length >0 ){ 
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.alertMsg=data.alert_msg;
                }else{      
                    this.aiData=data;
                }
            }
        },
        //任务按钮
         intentionGradeData(data){  
            if( Object.keys(data).length >0 ){  
                let text;
                if(data.alert_msg){
                    text=data.alert_msg;
                    this.value=this.value1;
                }else{  
                    text='选择意向等级成功';
                     localStorage.setItem("resultValue",this.value.join(','));
                    this.value1=this.value;
                }
                this.$vux.toast.show({
                    text:text,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                }) 
            }
         },
        //  意向选择数据
         customerResultData(data){
             if( Object.keys(data).length >0 ){ 
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{  
                    let _arr = []
                    data.items.resultValues.forEach((items)=>{
                        let obj = {
                            name:items,
                            value:items
                        }
                        _arr.push(obj)
                    })
                    this.list = _arr;
                }
            }
         },
     },
     methods: {
         ...mapActions({
            taskPhoneDetailHand: 'ai/taskPhoneDetailHand',
            intentionGradelHand: 'ai/intentionGradelHand',
            customerResultHand:'ai/customerResult',
        }),
        ...mapMutations({
            loadingHand: 'UPDATE_LOADING',
        }),
        OnScroll(){           
            this.$refs.scroller.reset()
        },    
        
        levelHand(value){
            let obj={
                phone_record_id:this.$route.query.id,
                result_value:value.join(','),
            }        
            this.intentionGradelHand(obj)
        }  
        
    },
    components: {
        Scroller,LoadMore,
        Flexbox, FlexboxItem,PopupPicker 
    },
}
</script>
<style lang="less">
.voice-head{      
    .ded span{
        color: @blue
    }
    .weui-cell{
            padding: 0;
            display: block;
            
    }
    .weui-cell_access .weui-cell__ft:after{
        border: 0;
    }
}
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
