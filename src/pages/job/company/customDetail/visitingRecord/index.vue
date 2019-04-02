<template>
    <div class="visitingRecord">
        <div class="visitingRecord-header"></div>
        <div class="visitingRecord-content">
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
                    <li class="list-box" v-for="(item,index) in n" :key="index" @click="viewDetails(item.id)">
                        <p>{{item.title}}</p>
                        <span>
                            <i class="status">拜访日期：{{item.date}}</i>
                        </span>
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
            <x-button type="primary"  @click.native="addVisitingRecord">新增</x-button>
           
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem, XButton ,Group,Scroller,Spinner   } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'visitingRecord',
    data() {
        return {
            status: {
                pullupStatus: 'default',
                pulldownStatus: 'default'
            },
            n: [
                {
                    id:'1',
                    title:"拜访记录标题",
                    status:'需求分析',
                    date:"2018-05-04"
                },
                {
                    id:'2',
                    title:"拜访记录标题",
                    status:'需求分析',
                    date:"2018-05-04"
                },
                {
                    id:'3',
                    title:"拜访记录标题",
                    status:'需求分析',
                    date:"2018-05-04"
                },
                {
                    id:'4',
                    title:"拜访记录标题",
                    status:'需求分析',
                    date:"2018-05-04"
                },
                {
                    id:'5',
                    title:"拜访记录标题",
                    status:'需求分析',
                    date:"2018-05-04"
                },
                {
                    id:'6',
                    title:"拜访记录标题",
                    status:'需求分析',
                    date:"2018-05-04"
                },
                {
                    id:'7',
                    title:"拜访记录标题",
                    status:'需求分析',
                    date:"2018-05-04"
                }
            ],
        }
    },
    created() {
    },
    mounted() {
        
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
        addVisitingRecord(){
            this.$router.push('/page/job/addVisitingRecord')
        },
        viewDetails(id){
            console.log(id)
            this.$router.push('/page/job/addVisitingRecord?id='+id)
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
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
