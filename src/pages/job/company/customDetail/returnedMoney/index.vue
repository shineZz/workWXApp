<template>
    <div class="returnedMoney">
        <div class="returnedMoney-header"></div>
        <div class="returnedMoney-content">
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
                            <i class="status">回款时间：{{item.date}}</i>
                            <i class="date">回款金额：{{item.status}}</i>
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
            <x-button type="primary"  @click.native="addReturnedMoney">新增</x-button>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem, XButton ,Group,Scroller,Spinner    } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'returnedMoney',
    data() {
        return {
            status: {
                pullupStatus: 'default',
                pulldownStatus: 'default'
            },
            n: [
                {
                    id:"1",
                    title:"回款标题",
                    status:'4555',
                    date:"2018-05-04"
                },
                {
                    id:"2",
                    title:"回款标题",
                    status:'234234',
                    date:"2018-05-04"
                },
                {
                    id:"3",
                    title:"回款标题",
                    status:'643423',
                    date:"2018-05-04"
                },
                {
                    id:"4",
                    title:"回款标题",
                    status:'2342',
                    date:"2018-05-04"
                },
                {
                    id:"5",
                    title:"回款标题",
                    status:'43523',
                    date:"2018-05-04"
                },
                {
                    id:"6",
                    title:"回款标题",
                    status:'6788',
                    date:"2018-05-04"
                },
                {
                    id:"7",
                    title:"回款标题",
                    status:'1233',
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
        addReturnedMoney(){
            this.$router.push('/page/job/addReturnedMoney')
        },
        viewDetails(id){
            console.log(id)
            this.$router.push('/page/job/addReturnedMoney?id='+id)
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
