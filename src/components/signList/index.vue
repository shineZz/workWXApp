<template>
    <div class="signList">
        <ul v-for="(i,index) in listData" :key="index">
            <group-title>{{i.titleYear}}年{{i.titleMonth}}月</group-title>
            <li v-for="(item,key) in i.child"  @click="toSiginDetail(item.id)" :key="key">   
                <h5>
                <span>周{{item.week}}</span>
                <span>{{item.month}}月{{item.day}}日</span>
                <span>{{item.hour}}:{{item.minute}}</span>
                </h5>     
                <div class="list-detail">
                <div class="no-btn">
                    <span>
                    <img :src="require('@/images/tool/nearby.png')" alt="">
                    {{item.name}}
                    </span>
                    <span>
                    <img :src="require('@/images/tool/nearby.png')" alt="">
                    {{item.address}}
                    </span>
                    <span>
                    <img :src="require('@/images/tool/nearby.png')" alt="">
                    {{item.visitType==1?'回访':item.visitType==2?"上门服务":"特殊服务"}}
                    </span>
                </div>  
                <div class="btn-sign" v-if="item.signState==0">
                    <button>签退</button>
                </div>
                </div>    
                <cell is-link value-align='left'>
                {{item.visitResult}}
                </cell>   
            </li>
        </ul>
    </div>
</template>

<script>
import {  Scroller,Cell,Group,GroupTitle } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
let data = [{
                name:"张柏芝",
                date:'2018-10-10 10:10',
                address:'浙江省杭州市拱墅区智慧信息产业园I座6楼',
                company:"杭州小宝销售",
                signState:"0",//0签到拜访中，1已签退
                visitType:'2',
                visitResult:'已签到，拜访中。。。。',
                id:0,
              },{
                name:"王菲",
                date:'2018-6-10 10:10',
                address:'浙江省杭州市拱墅区智慧信息产业园I座6楼',
                company:"杭州小宝招商",
                signState:"1",
                visitType:'3',
                visitResult:'已签退，拜访了两天',
                id:1,
              },{
                name:"李亚鹏",
                date:'2018-5-10 10:10',
                address:'浙江省杭州市拱墅区智慧信息产业园I座6楼',
                company:"杭州日思夜享",
                signState:"1",//0签到拜访中，1已签退
                visitType:'2',
                visitResult:'已签退',
                id:2,
              },{
                name:"谢霆锋",
                date:'2018-4-10 10:10',
                address:'浙江省杭州市拱墅区智慧信息产业园I座6楼',
                signState:"1",
                visitType:'3',
                visitResult:'拜访了两天',
                id:3,
              },{
                name:"谢霆锋",
                date:'2018-4-9 10:10',
                address:'浙江省杭州市拱墅区智慧信息产业园I座6楼',
                signState:"1",
                visitType:'3',
                visitResult:'已签退',
                id:3,
              },{
                name:"谢霆锋",
                date:'2018-4-6 10:10',
                address:'浙江省杭州市拱墅区智慧信息产业园I座6楼',
                signState:"1",
                visitType:'3',
                visitResult:'已签退，拜访了三十分钟',
                id:3,
              }]
export default {
    name: 'signList',
    data() {
      let self = this;
        return {
            listData:[
              
            ],
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            page:1,
            count:10,   
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            pulldown:false,
        }
    },
    created() {
      // this.initData()
      this.dataProcessing()
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
        }),
        dataProcessing(){
          let new_arr = []
          let chinese = ["日","一","二","三","四","五","六"];
          for(let i=0;i<data.length;i++){
            data[i].date = new Date(data[i].date)
            data[i].year = data[i].date.getFullYear()
            data[i].month = data[i].date.getMonth()
            data[i].day = data[i].date.getDate()
            data[i].hour = data[i].date.getHours()
            data[i].minute = data[i].date.getMinutes()
            data[i].week = chinese[data[i].date.getDay()]
            if(new_arr.length==0){
              let obj = {
                titleYear:data[i].year,
                titleMonth:data[i].month,
                child:[data[0]]
              }
              new_arr.push(obj)
            }else{
              if(data[i].year==new_arr[new_arr.length-1].titleYear&&data[i].month==new_arr[new_arr.length-1].titleMonth){
                new_arr[new_arr.length-1].child.push(data[i])
              }else{
                let obj = {
                  titleYear:data[i].year,
                  titleMonth:data[i].month,
                  child:[data[i]]
                }
                new_arr.push(obj)
              }
            }
            
          }
          this.listData = new_arr
        },
        loadMore () {
            
            if (this.onFetching) {
                // this.handleRequest()
            }else{
                return ;
            }
        },
        refresh(){
           let that = this
          //  this.loadingHand(true)
          //   if(this.status.pulldownStatus != 'default'){
          //       this.onFetching = false
          //       let page = 1
          //       let count = 10
          //       let obj = {}
          //       obj.userId = this.user_id
          //       obj.companyId = this.company_id
          //       obj.page = page
          //       obj.count = count
          //       obj.reqFrom = '2'
          //       this.GETNOTICELIST(obj)
          //       setTimeout(function(){
          //           that.$refs.scroller.donePulldown()
          //           that.loadingHand(false)
          //       },500)
          //   }
        },
        toSiginDetail(id){
          this.$router.push({path:"signDetail",query:{id:id}})
        }
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
        })
    },
    components: {
      Scroller,
      Cell,
      Group,
      GroupTitle,
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
