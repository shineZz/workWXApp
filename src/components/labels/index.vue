<template>
    <div>
       <div class="label-hd vux-1px-b"> 
            <h4>{{title}}</h4>
            <p v-if="fixedData.length>0&&state==2"><a href="javascript:void(0)" @click="delHand">清空选择</a></p>
        </div>
        <div  v-if="Object.keys(labelListData).length == 0&&Object.keys(recommentFiledsData).length == 0 ||   customerLabel.length==0 " class="wu-all wu-allB">
            <section>
                <div><img src="~@/images/wu-icon1.png"></div>
                <p>{{ customerLabel.length == 0? '暂无标签数据':alertMsg}}</p>
            </section>
        </div>
        <scroller  
            ref="scroller"
            lock-x  
            scrollbarY 
            class="bg-fff"  
            :height="scrollerHeight" 
            @on-scroll="onScroller"  
            v-if="Object.keys(labelListData).length != 0||Object.keys(recommentFiledsData).length != 0&&customerLabel.length != 0"    
            :scroll-bottom-offst="0">
            <div >
                <div class="label-md" v-for="item in customerLabel" :key="item.id">
                    <h6>{{item.name}}</h6>
                    <div class="screening-bd" >
                        <checker class="screening-list"  type="checkBox"  v-model="fixedData"  selected-item-class="cur">
                            <checker-item v-for="v in item.list" :value="v" :disabled="v.flag" @on-item-click='recommendClick' :key="v.id">{{v.name}}</checker-item>                               
                        </checker>
                    </div>
                </div>
            </div>
        </scroller>
        <div class="btn-footer" v-if="(Object.keys(labelListData).length != 0)||(Object.keys(recommentFiledsData).length != 0)&&(customerLabel.length != 0)"><x-button type="primary" @click.native="saveHand" >{{state==1 || state==3?'保存':'确定'}}</x-button></div>
    </div>
</template>
<script>
import { Scroller,XButton, Checker, CheckerItem,} from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';
export default {
    name: 'labels',
    props: ['propState', 'propTitle', 'checkValue','propsFields'], 
    data() {
        return {
            state:this.propState || 1,//1为保存按钮，2为确定按钮 3为猎客中的 推荐内容 4选择共享客户
            title:this.propTitle || '标签',
            scrollerHeight:'-72',
            customerLabel:[
                {
                    name:'',
                    list:[]
                }
            ],
            intention:[],
            fixedData:[],
            myArr:[],
            hasClickValue:'',
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            alertMsg:'加载中...',//第一次
        }
    },
    created() {
        this.fixedData = this.checkValue || []
        if(this.state!=5){
            // this.scrollerHeight='-72'
            let obj = {
                company_id:this.company_id,
                user_id:this.user_id
            }
            this.CustomerLabelList(obj)
        } else if(this.state==5) {
            // this.scrollerHeight='-72'
            let obj={
                t_recommend_types_id:1,
                state:1,
            }
            this.recommend_getFields(obj)
        }
    },
    mounted() {
        document.activeElement.blur()
    },
    methods: {
        ...mapActions({
            CustomerLabelList:'customerlabel/LabelListSvr',
            recommend_getFields:'recommend/getFields',
        }),
        //清空
        delHand(){
            this.fixedData=[];
        },
        //保存跟确定
        saveHand(){
            this.$emit('toggleLabel',this.fixedData)
        },
        onItemClick(data){
        },
        recommendClick(value,dis){
            if(this.$route.name=='releaseTask'){
                let has48 = 0
                this.fixedData.sort(sortNum('value'),value)
                for(let i=0,len=this.fixedData.length;i<len;i++){
                    if(this.fixedData[i].value==44||this.fixedData[i].value==48){
                        has48 = this.fixedData[i].value
                        break ;
                    }
                }
                if(has48>0){
                    for(let i=0;i<this.customerLabel[0].list.length;i++){
                        if(this.customerLabel[0].list[i].value==51){
                            this.customerLabel[0].list[i].flag=true
                            for(let j=0;j<this.fixedData.length;j++){
                                if(this.fixedData[j].value==51){
                                    if(has48==44&&value.value==51){
                                        this.$vux.toast.show({
                                            text: '主销渠道被选中，所在行业不能取消',
                                            type: 'text',
                                            position: 'top',
                                            width:"20em"
                                        }) 
                                    }else if(has48==48&&value.value==51){
                                        this.$vux.toast.show({
                                            text: '代理品牌被选中，所在行业不能取消',
                                            type: 'text',
                                            position: 'top',
                                            width:"20em"
                                        }) 
                                    }
                                    
                                    return ;
                                }
                            }
                            this.fixedData.push(this.customerLabel[0].list[i])
                        }
                    }
                }else{
                    this.customerLabel[0].list.forEach(function(item){
                        if(item.value==51){
                            item.flag=false
                        }
                    },this)
                }
                function sortNum(property){
                    return function(a,b){
                    var value1 = a[property];
                        var value2 = b[property];
                        return value1 - value2;
                    }
                    
                }
            }
            
        },
        onScroller(){
            this.$refs.scroller.reset()
        }
    },
    computed: {
        ...mapState({
            labelListData:state => state.customerlabel.labelListData, 
            recommentFiledsData:state=>state.recommend.recommentFiledsData,
        })       
    },
    watch:{
        labelListData(data){
            if(Object.keys(data).length>0){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"
                    }) 
                }else{
                    let arr = data.items
                    arr.forEach(item => {
                        item.list = item.list.map(v => {
                            return {
                                id: v.id,
                                name: v.name
                            }
                        })
                    })
                    this.customerLabel = arr
                }
            }
        },
        recommentFiledsData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                let _data=data.items
                let _arr =[]
                this.fixedData=[]
                _data.forEach(function(item,index){
                    let _obj ={
                        value:item.tr_filed_id,
                        name:item.field_name,
                        flag:item.is_required==1?true:false,
                        tr_filed_id:item.tr_filed_id,
                    }
                    if(this.propsFields.length>0){
                        for(let i=0;i<this.propsFields.length;i++){
                            if(this.propsFields[i].tr_filed_id==_obj.value){
                                this.fixedData.push(_obj)
                            }
                        }
                    }else{
                        if(_obj.flag){
                            this.fixedData.push(_obj)
                        }
                    }
                    _arr.push(_obj)
                },this)
                this.customerLabel[0].name = ''
                this.customerLabel[0].list = _arr
            }
        },
    },

    components: {        
       Scroller,XButton, Checker, CheckerItem,
    }, 
    
}
</script>
<style lang="less">
.screening-list{
    .demo1-item-selected{
        border: 1px solid #000;
    }
}
    
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
