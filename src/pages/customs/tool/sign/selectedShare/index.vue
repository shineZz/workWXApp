<template>
    <div class="selected-share router-all">
        <!-- <x-button @click.native="isSignCustom=true" v-if="!isSignCustom">点击</x-button> -->
        <!--
            /**
            *@toggleSignCustom@ 开启选择客户组件
            *@propsState@       传入的最近联系人数据
            *@propsJudge@       传入的控制组件中的开启关闭的状态
            *@choiseFlag@      是否开启选择标签
            *
            */
        -->
        <!-- <SignCustom 
            @toggleSignCustom="toggleSignCustom" 
            :propsState="initData" 
            :propsJudge="judgeFlag" 
            @choiseFlag="choiseFlag"
            v-else
            />
        <SlidCalendar @canlenDarData="canlenDarData" @controlCustomer="controlCustomer" />
        <div v-transfer-dom >
          <popup v-model="isCustomer" position="right" width="100%" should-scroll-top-on-show>
            <Customer @toggleCustomer='toggleCustomer' propsState="1" :isRadioChoice="1" :btn='1' />
          </popup>
        </div> -->
        <div class="router-box">
            <!-- <group>
                <cell :value="addressTitle" :title="address" value-align='left' :is-link='addressFix' @click.native="tomap" >
                    <img slot="icon" width="20" style="display:block;margin-right:5px;" :src="require('@/images/tool/icon52-2.png')">
                </cell>
                <cell v-model="name" title="请选择客户(必选)" :is-link='addressFix' @click.native="tomap" >
                    <img slot="icon" width="20" style="display:block;margin-right:5px;" :src="require('@/images/tool/icon52-2.png')">
                </cell>
                <x-input v-model="company" :disabled="company?true:false" placeholder="公司名称(必填)">
                    <img slot="label" width="20" style="display:block;margin-right:5px;" :src="require('@/images/tool/icon52-2.png')">
                </x-input>
            </group>
            <ul class="mytool">
                <li>
                    <div>
                        <article class="record-l">
                            <aside><img src="~@/images/ai-logo.jpg" /></aside>
                            <section>
                                <i class="arrow"></i>
                                <div>asdasd</div>
                            </section>
                        </article>
                        <article  class="record-r">                            
                            <section>
                                <i class="arrow"></i>
                                <div>dasdasd</div>
                            </section>
                            <aside><img src="~@/images/ai-logo.jpg" /></aside>
                        </article>
                    </div>
                </li>
                <li>
                    <div>
                        <article class="record-l">
                            <aside><img src="~@/images/ai-logo.jpg" /></aside>
                            <section>
                                <i class="arrow"></i>
                                <div>asdasd</div>
                            </section>
                        </article>
                        <article  class="record-r">                            
                            <section>
                                <i class="arrow"></i>
                                <div>dasdasd</div>
                            </section>
                            <aside><img src="~@/images/ai-logo.jpg" /></aside>
                        </article>
                    </div>
                </li>
            </ul> -->
            <group class="task-header">
                <div class="header-logo">
                    <span>
                        LOGO
                    </span>
                </div>
                <x-textarea :rows="1">

                </x-textarea>
                <cell v-model="taskDescrib" text-align="left" :title="taskDescribTitle">

                </cell>
            </group>
        </div>
        <x-button type="primary" v-if='isSign'>立即签到</x-button>
        <x-button type="primary" v-else>立即签退</x-button>
    </div>
</template>

<script>
import { Search, Group, Cell, Scroller, LoadMore,XTextarea, Badge,XButton,TransferDom, Popup,Checklist,XInput } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import {len} from '@/util';
import { objDeepCopy } from '@/util'
import SignCustom from '../signCustom'
import SlidCalendar from '@/components/slidCalendar'
import Customer from '@/components/customer'
import VueEmit from '@/util/vueEimt';
export default {
    name: 'selectedShare',
    data() {
        return {
            listData: {dataObj:[]},
            // scroller相关
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            height: "-53",
            onFetching: false,      //是否请求数据中
            isLoading: false,
            myshareCustom:[],
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
            isSignCustom:false,
            initData:[
            ],
            isGroup:false,
            isLabels:false,
            isShareForMe:false,
            isCurrentLabel:false,
            isSearch:false,
            judgeFlag:{
                isGroup:false,//子组件中分组客户开关
                isLabels:false,//子组件中标签客户开关
                isShare:false,//子组件中分享客户开关
                isLabel:false,//子组件中标签开关
                isSearch:false,//子组件中搜索客户开关
            },
            isCustomer:false,
            
            
            address:'',
            name:'',
            company:"",
            isSign:true,
            addressFix:false,
            type:'',
            fixMsg:false,
            addressTitle:'请选择地址(必选)',

            taskDescrib:'任务描述',
            taskDescribTitle:'',//请点击查看或编辑详情
        }
    },
    directives: {
        TransferDom
    },
    created() {
        
    },
    mounted(){
        this.type= this.$route.query.type
        this.signId = this.$route.query.id
        //type=1:签到，2为携带名字的签到，3签退
        if(this.type==1||this.type==2){
            this.addressFix=true
        }else if(this.type==3){
            this.fixMsg=true
        }
        // let msgObj = this.$route.query.msgObj
        // msgObj = eval(msgObj)
        this.address = '浙江省杭州市拱墅区祥园路88号'
        this.company = '杭州小宝招商'
        this.name = 'hezd'
        this.addressTitle=''
    },
    methods: {
        toggleSignCustom(){
            this.isSignCustom=!this.isSignCustom
        },
        choiseFlag(data){
            this.judgeFlag[data.name]=data.value
        },
        canlenDarData(data){
        },
        controlCustomer(data){
            this.toggleCustomer()
        },
        toggleCustomer(data){
            this.isCustomer=!this.isCustomer
        },
        tomap(){
        }
    },
    computed: {
        ...mapState({
            data:state => state.data,
        })
    },
    watch:{
    },
    beforeRouteLeave (to, from, next) {
        if(this.judgeFlag.isShare||this.judgeFlag.isSearch||this.judgeFlag.isLabel||this.judgeFlag.isLabels||this.judgeFlag.isGroup){
            this.$refs.signCustom.height='-114'
            this.$refs.signCustom.onFetching = false
            this.$refs.signCustom.isShare=false
            this.$refs.signCustom.isgroup=false
            this.$refs.signCustom.isLabels=false
            this.$refs.signCustom.mylabels=false
            this.$refs.signCustom.isSearch=false 
            this.judgeFlag={
                isGroup:false,
                isLabels:false,
                isShareForMe:false,
                isCurrentLabel:false,
                isSearch:false,
            }
            next(false)
        }else if(this.isSignCustom){
            this.isSignCustom=false
            next(false)
        }else{
            next()
        }
    },
    beforeRouteEnter (to, from, next) {
        next()
        
    },
    components: {
        Customer,Search, Group, Cell, Scroller, LoadMore, Badge, XButton,Popup,Checklist,SignCustom,SlidCalendar,XInput,
        XTextarea
    },
    
}
</script>

<style lang="less">
 @import './index.less';
</style>
