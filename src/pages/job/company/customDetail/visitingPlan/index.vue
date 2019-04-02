<template>
    <div class="visitingPlan">
        <div class="visitingPlan-header"></div>
        <div class="visitingPlan-content">
            <scroller 
                lock-x 
                :scrollbarY="false"
                use-pullup 
                use-pulldown 
                height="100%" 
                :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
                @on-pullup-loading="loadMore" 
                @on-pulldown-loading="refresh"  
                v-model="status" 
                ref="scroller"
                >
                
                <ul class="box2" style="overflow:hidden">
                    
                    <li class="list-box" v-for="(item,index) in n" :key="index">
                        <div v-if="isSelect" @click="handleClick(item.id,item.flag)">
                            <check-icon :value.sync="item.flag" class="wowoowow" > 
                                <p>{{item.title}}</p>
                                <span>
                                    <i class="status">拜访日期：{{item.date}}</i>
                                </span>
                            </check-icon>
                        </div>
                        <div v-if="!isSelect" @click="viewDetails(item.id)">
                            <p>{{item.title}}</p>
                            <span>
                                <i class="status">拜访日期：{{item.date}}</i>
                            </span>
                        </div>
                    </li>
                </ul>
                <!--pullup slot-->
                <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
                    <span v-show="status.pullupStatus === 'default'"></span>
                    <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
                    <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
                </div>
            </scroller>
        </div>
        <div class="add-btn-box">
            <x-button type="primary"  @click.native="addVisitingPlan">新增</x-button>
            
        </div>
    </div>
</template>

<script>
import {XButton ,Group,Scroller,Spinner ,CheckIcon} from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'visitingPlan',
    data() {
        return {
            isSelect:true,
            status: {
                pullupStatus: 'default',
                pulldownStatus: 'default'
            },
            n: [
                {
                    id:'0',
                    title:"拜访计划主题",
                    status:'需求分析',
                    date:"2018-05-04 14:12:00",
                    flag:false
                },
                {
                    id:'1',
                    title:"拜访计划主题",
                    status:'需求分析',
                    date:"2018-05-04 14:12:00",
                    flag:false
                },
                {
                    id:'2',
                    title:"拜访计划主题",
                    status:'需求分析',
                    date:"2018-05-04 14:12:00",
                    flag:false
                },
                {
                    id:'3',
                    title:"拜访计划主题",
                    status:'需求分析',
                    date:"2018-05-04 14:12:00",
                    flag:false
                },
                {
                    id:'4',
                    title:"拜访计划主题",
                    status:'需求分析',
                    date:"2018-05-04 14:12:00",
                    flag:false
                },
                {
                    id:'5',
                    title:"拜访计划主题",
                    status:'需求分析',
                    date:"2018-05-04 14:12:00",
                    flag:false
                },
                {
                    id:'6',
                    title:"拜访计划主题",
                    status:'需求分析',
                    date:"2018-05-04 14:12:00",
                    flag:false
                }
            ],
        }
    },
    created() {
    },
    mounted() {
        
    },
    beforeMount(){
        console.log(this.$route.query.select,'-=-=-=-')
        if(this.$route.query.select==1){
            this.isSelect = true
        }else{
            this.isSelect = false
        }
    },
    methods: {
        load2 () {
            setTimeout(() => {
                this.status1.pulldownStatus = 'default'
            }, 2000)
        },
        loadMore () {
            let that = this
            setTimeout(() => {
                for(let i=0;i<10;i++){
                    let obj ={
                        title:"商机标题",
                        status:'需求分析',
                        date:"2018-05-04"
                    }
                    that.n.push(obj)
                }
                setTimeout(() => {
                this.$refs.scroller.donePullup()
                }, 10)
            }, 2000)
        },
        refresh () {
            let that = this
            setTimeout(() => {
                for(let i=0;i<10;i++){
                    let obj ={
                        title:"商机标题",
                        status:'需求分析',
                        date:"2018-05-04"
                    }
                    that.n.push(obj)
                    
                }
                this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.scroller.donePulldown()
                    this.pullupEnabled && this.$refs.scroller.enablePullup()
                }, 10)
                })
            }, 2000)
        },
        addVisitingPlan(){
            this.$router.push('/page/job/addVisitingPlan')
        },
        viewDetails(id){
            console.log(id)
            this.$router.push('/page/job/addVisitingPlan?id='+id)
        },
        handleClick(id,flag){
            console.log(id,flag)
            this.selectId=id
            for(let i=0;i<this.n.length;i++){
                this.n[i].flag=false
                if(this.n[i].id==id){
                    this.n[i].flag=true
                }
            }
        },
    },
    computed: {
    },
    watch: {
    },
    components: {
        Group,
        Scroller, 
        Spinner,
        XButton,
        CheckIcon,
    },
}
</script>
<style lang="less">
.visitingPlan{
     .vux-check-icon{
        span{
            display: inline-block !important;
        }
    }
}
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
