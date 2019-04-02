<template>
    <div class="industry">
        <scroller
            lock-x  
            scrollbarY 
            height="-36" 
            ref='inscroller'
            @on-scroll="onScroll"
        >
            <div style="overflow:hidden">
                <div   v-if="industryData.length == 0 &&industryDataTwo.length==0 " class="wu-all wu-allB">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>{{ industryData.length == 0? '暂无行业数据':alertMsg}}</p>
                    </section>
                </div>
                <group  v-if="!newIndustry">
                    <div v-for="(items,index) in industryData" :key="index" class="mygroup-box vux-1px-b">
                        <div class="parentgroup hello">
                            <div class="mygroup-cell" >
                                <div class="iconHeader" @click.stop="changeTypeOne(items.cid,items.hasChild)">
                                    <img src="~@/images/tool/zzo.png" v-if="!items.childFlag&&items.hasChild" alt="">
                                    <img src="~@/images/tool/zzod.png" v-if="items.childFlag&&items.hasChild" alt="">
                                </div>
                                <cell :title="items.cname" @click.native="changeCircleOne(items.cid,items.cname,items.cid,0,0,items.flag)">
                                    <x-icon type="ios-circle-outline" v-if="!items.flag" class="cell-x-icon"></x-icon>
                                    <x-icon type="ios-checkmark" v-if="items.flag" class="cell-y-icon" ></x-icon>
                                </cell>
                            </div>
                        </div>
                        <ul v-show="items.childFlag">
                            <li v-for="(item,i) in items.children" :key="i" >
                                <div class="two-cell vux-1px-t" >
                                    <div class="iconHeader" @click.stop="changeTypeOne(item.cid,items.hasChild,item.cid,0,0,items.flag)">
                                        <img src="~@/images/tool/zzo.png" v-if="!item.childFlag&&item.hasChild" alt="">
                                        <img src="~@/images/tool/zzod.png" v-if="item.childFlag&&item.hasChild" alt="">
                                    </div>
                                    <cell :title="item.cname" class="myTwo-cell" @click.native="changeCircleOne(item.cid,item.cname,items.cid,item.cid,0,item.flag)">
                                        <x-icon type="ios-circle-outline" v-if="!item.flag" class="cell-x-icon"></x-icon>
                                        <x-icon type="ios-checkmark" v-if="item.flag" class="cell-y-icon" ></x-icon>
                                    </cell>
                                </div>
                                <div v-show="item.childFlag" class="three" >
                                    <div v-for="(it,key) in item.children" :key="key" class="three-cell vux-1px-t" >
                                        <div class="iconHeader">
                                        </div>
                                         <cell :title="it.cname" @click.native="changeCircleOne(it.cid,it.cname,items.cid,item.cid,it.cid,it.flag)">
                                             <x-icon type="ios-circle-outline" v-if="!it.flag"  class="cell-x-icon"></x-icon>
                                            <x-icon type="ios-checkmark" v-if="it.flag" class="cell-y-icon" ></x-icon>
                                        </cell>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </group>
                <group v-if="newIndustry">
                    <div v-for="(items,index) in industryDataTwo" :key="index" class="mygroup-box vux-1px-b">
                        <div class="parentgroup">
                            <div class="mygroup-cell"  @click="changeTypeTwo(items.industryId)">
                                <div class="iconHeader" >
                                    <img src="~@/images/tool/zzo.png" v-if="!items.childFlag&&items.children.length>0" alt="">
                                    <img src="~@/images/tool/zzod.png" v-if="items.childFlag&&items.children.length>0" alt="">
                                </div>
                                <cell :title="items.industryName" >    
                                </cell> 
                            </div>
                        </div>
                        <ul v-show="items.childFlag">
                            <li v-for="(item,i) in items.children" :key="i">
                                <div class="two-cell vux-1px-t" >
                                    <div class="iconHeader">
                                    </div>
                                    <cell :title="item.industryName" class="myTwo-cell" @click.native="changeCircleTwo(items.industryId,item.industryId,item.industryName)">
                                        <x-icon type="ios-circle-outline" v-if="!item.flag" class="cell-x-icon"></x-icon>
                                        <x-icon type="ios-checkmark" v-if="item.flag" class="cell-y-icon" ></x-icon>
                                    </cell>
                                </div>
                            </li>
                        </ul>
                    </div>
                </group>
            </div>
        </scroller>
        
        <x-button v-if="industryData.length != 0 ||   industryDataTwo.length!=0 " type="primary" style="position:absolute;bottom:0;" @click.native="saveIndustry">保存</x-button>
    </div>
</template>

<script>
import { Scroller , XButton ,Group,Cell,CellBox,Icon,CheckIcon} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy } from '@/util'
export default {
    name: 'industry',
    data() {
        return {
            isLabel:false,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            showContent001: false,
            showContent0001: false,
            id:"",
            newIndustry:false,
            parentId:'',
            industryData:[],
            industryDataTwo:[],
            id:'',
            title:'',
            istaskIndustry:false,
            pushObj:{},
            initIndustry:{},
            indexNum:0,
            changeIndustry:{}
        }
    },
    props:['propsState','industryValue'],
    created() {
        
    },
    mounted(){
        if(this.propsState){//有的时候为为两层
            this.newIndustry=true
            this.pushObj = objDeepCopy(this.industryValue)
            this.industry_getAllIndustrys()
        }else{//三层
            this.newIndustry=false
            let obj = {
                company_id:this.company_id
            }
            this.customerindustry_findAllCustomerIndustry(obj)
            this.pushObj = objDeepCopy(this.industryValue) 
        }

    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            UPDATE_LOADING: 'UPDATE_LOADING',
        }),
        ...mapActions({
            industry_getAllIndustrys:'industry/getAllIndustrys',
            customerindustry_findAllCustomerIndustry:'customerindustry/findAllCustomerIndustry'
        }),
        
        
        saveIndustry(){
            let _string 
            if(this.newIndustry){
               _string = JSON.stringify(this.pushObj)
            }else{
                _string = this.pushObj
            }
            this.$emit('toggleIndustry',_string)
        },
        changeCircleOne(id,name,one,two,three,flag){
            if(!flag){
                if(one){
                    this.pushObj.one=one
                }else{
                    this.pushObj.one=''
                }
                if(two){
                    this.pushObj.two=two
                }else{
                    this.pushObj.two=''
                }
                if(three){
                    this.pushObj.three=three
                }else{
                    this.pushObj.three=''
                }
                this.pushObj.name=name
            }else{
                this.pushObj=objDeepCopy({name: '', one: '', two: '', three: ''}) 
            }   
            this.sData(this.industryData,id)
        },
        sData(data,id){
            data.forEach(function(items){
                if(items.cid==id){
                    items.flag=!items.flag
                }else{
                    items.flag=false
                }
                if(items.children){
                    this.sData(items.children,id)
                }

            },this)
        },
        recursionDataOne(data,id){
            data.forEach(function(item){
                if(item.cid==id){
                    item.childFlag=!item.childFlag
                }
                if(item.children){
                    this.recursionDataOne(item.children,id)
                }
            },this)
            // this.industryData = data
        },
        changeTypeOne(id){
            this.recursionDataOne(this.industryData,id)
        },
        recursionData(data,id){
                data.forEach(function(item){
                    if(item.industryId==id){
                        item.childFlag=!item.childFlag
                    }
                    if(item.children){
                        this.recursionData(item.children,id)
                    }
                },this)
           this.industryDataTwo = data
        },
        changeTypeTwo(id){
            let industry = objDeepCopy(this.industryDataTwo)
            this.recursionData(industry,id)
        },
        changeCircleTwo(parentId,id,name){
            let industry = this.industryDataTwo
            industry.forEach(function(items){
                items.children.forEach(function(item){
                    if(item.industryId==id){
                        item.flag=!item.flag;
                        if(item.flag){
                            this.pushObj.name=name
                            this.pushObj.one=parentId
                            this.pushObj.two=id
                        }else{
                            this.pushObj={
                                name:"",
                                one:"",
                                two:''
                            }
                        }
                    }else{
                        item.flag=false;
                    }
                },this)
            },this)
            this.industryDataTwo=industry
        },
        hasChildFn(data){
            data.forEach(function(items){
                items.flag=false
                if(items.children){
                    items.hasChild=true;
                    items.flag=false;
                    this.hasChildFn(items.children)
                }
            },this)
            this.industryData = data
        },
        onScroll(){
            this.$nextTick(() => {
                this.$refs.inscroller.reset();
            })
        },
        handleData(data,arr,grade){
            let cid = arr[grade-1]
            data.forEach(function(item,index){
                item.flag = false
                if(grade==item.clevel&&item.cid==cid){
                    item.flag = true
                }
                if(item.children){
                    item.hasChild=true
                    item.childFlag=false
                    for(let i=0;i<3;i++){
                        if(item.cid==arr[i]){
                            item.childFlag=true
                        }
                    }
                    this.handleData(item.children,arr,grade)
                }
            },this)
            
        }
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            allIndustryData:state =>state.industry.allIndustryData,
            customerIndustryData:state=>state.customerindustry.customerIndustryData
        }),
        
    },
    destoryed(){

    },
    watch:{
        'industryValue' : {
            handler:function(industryValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                if(!this.propsState){
                    if(localStorage.getItem('industryData')){
                        let _data = JSON.parse(localStorage.getItem('industryData'));
                        let one = industryValue.one,
                            two = industryValue.two,
                            three = industryValue.three,
                            arr = [one,two,three],
                            _grade = '';
                        for(let i=0;i<arr.length;i++){
                            if(!arr[i]){
                                _grade = i;
                                break;
                            }
                        };
                        if(!_grade){
                            _grade = 3
                        };
                        this.handleData(_data,arr,_grade)
                        this.industryData = _data;
                    }else{
                        this.newIndustry=false
                        let obj = {
                            company_id:this.company_id
                        }
                        this.customerindustry_findAllCustomerIndustry(obj)
                    }
                    this.pushObj =objDeepCopy(industryValue) 
                }
            },
            deep: true    //深度监听
        },
        customerIndustryData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                let _data = objDeepCopy(data.items)
                localStorage.setItem('industryData',JSON.stringify(_data))
                let one = this.industryValue.one
                let two = this.industryValue.two
                let three = this.industryValue.three
                let arr = [one,two,three]
                let _grade = ''
                for(let i=0;i<arr.length;i++){
                    if(!arr[i]){
                        _grade = i;
                        break;
                    }
                }
                if(!_grade){
                    _grade = 3
                }
                this.handleData(_data,arr,_grade)
                this.industryData = _data
                
            }
        },
        industryData(data){
            
        },
        allIndustryData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                let _data = data.items
                let _new = []
                
                let one = this.industryValue.one
                let two = this.industryValue.two
                _data.forEach(function(items){
                    let obj={
                        industryId:items.oneLevelIndustry.industryId,
                        industryName:items.oneLevelIndustry.industryName,
                        children:items.oneLevelIndustry.sencondLevelIndustryList
                    }
                    if(obj.children.length>0){
                        
                        obj.childFlag=false
                        if(one==obj.industryId){
                            obj.childFlag=true
                        }
                        obj.children.forEach(function(item){
                            item.flag=false
                            if(two==item.industryId){
                                item.flag=true
                            }
                        })
                    }
                    _new.push(obj)
                })
                this.industryDataTwo = objDeepCopy(_new)
            }
        }
    },
    components: {
        Scroller,
        XButton,
        Group,
        Cell,
        CellBox,
        Icon,
        CheckIcon
    },
}
</script>

<style lang="less">
.industry{
    .myicon{
        float: left;
        margin-top:10px;
    }
    .weui-icon{
        font-size: 16px;
    }
    .weui-cell .vux-cell-no-border-intent:before{
        left: -100px;
    }
    .vux-cell-no-border-intent:before{
        left: -100px !important;
    }
    .weui-cell:before{
        left:-100px;
    }
    .cell-x-icon{
        display: block;
        fill:#c8c8cd;
    }
    .cell-y-icon{
       display: block;
       fill: #09bb07;
    }
    .weui-cell:before{
        display: none;
    }
}

</style>


<style lang="less" scoped>
 @import './index.less';
</style>
