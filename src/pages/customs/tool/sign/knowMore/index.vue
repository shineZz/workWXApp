<template>
    <div class="knowMore">
        <div class="knowMore-header" v-show="!isCustomer"> 
          <group-title style="text-align:center;color:#000">
            {{showMonth}}
          </group-title>
          <span @click="toggleCustomer">筛选</span>
        </div>
        <div class="topBox" v-show="!isCustomer" @touchstart="topStart" @touchend="topEnd">
          <div class="week">
            <i>
              周一
            </i>
            <i>
              周二
            </i>
            <i>
              周三
            </i>
            <i>
              周四
            </i>
            <i>
              周五
            </i>
            <i>
              周六
            </i>
            <i>
              周日
            </i>
          </div>
          <div class="top" >
            <div>
              <span v-for="(i,index) in firstBoxData" :key="index" :class="index+1==initSelect?'is-select':''">
                <i @click="selectDate(i.date,i.week)" :class="i.flag?'active':''">{{i.day}}</i>
              </span>
            </div>
          </div>
        </div>
        <scroller    
          v-show="!isCustomer" 
          lock-x  
          scrollbarY 
          @on-scroll-bottom="loadMore" 
          @on-pulldown-loading="refresh" 
          v-model="status"  
          use-pulldown  
          ref="scroller" 
          height="-114"
          :scroll-bottom-offst="0"
          >
          <div  v-if="Object.keys(listData).length == 0 ||   listData.num_items==0 " class="wu-all wu-allB">
              <section>
                  <div><img src="~@/images/wu-icon1.png"></div>
                  <p>{{ listData.length == 0? '暂无下属签到记录':alertMsg}}</p>
              </section>
          </div>
          <div class="tool-list" v-else>
              <ul style="padding:0 10px;">
                  <li v-for="(item,index) in listData" :key="index" @click='toSiginDetail(item.id)'>
                      <h6>{{item.date}}</h6>
                      <article  :class="index!==0?'hasTop':''"  >
                          <section class="vux-1px-b">
                              <header>
                                  <h5>{{item.date_note}}</h5>
                              </header>
                              <dl :class="item.state==1?'icon52-1-1':'icon52-1-2'">
                                  <dt><i></i></dt>
                                  <dd>
                                      <p>{{item.customer_name}}</p>
                                  </dd>
                              </dl>
                              <dl class="icon52-2">
                                  <dt ><i></i></dt>
                                  <dd>
                                      <p>{{item.address_note}}</p>
                                  </dd>
                              </dl>
                              <dl class="icon52-3">
                                  <dt><i></i></dt>
                                  <dd>
                                      <p>{{item.visit_type}}</p>
                                  </dd>
                              </dl>
                              <dl class="icon52-4">
                                  <dt><i></i></dt>
                                  <dd>
                                      <p>{{item.user_name}}</p>
                                  </dd>
                              </dl>
                          </section>
                          <footer  class="footer-link">
                              <a>{{item.visit_note}}</a>
                          </footer>
                      </article>
                  </li>
              </ul>
              <load-more tip="加载中" v-if="loadFlag" ></load-more>
              <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
          </div>
          <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
              <span v-show="status.pulldownStatus === 'default'"></span>
              <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
              <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放刷新</span>
              <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
          </div>
        </scroller>
        <div v-transfer-dom >
          <popup v-model="isCustomer" position="right" v-if="isCustomer" width="100%" should-scroll-top-on-show>
            <Customer @toggleCustomer='toggleCustomer' propsState="1" :isRadioChoice="1" :btn='1' />
          </popup>
        </div>
        
    </div>
</template>

<script>
import {  Scroller,GroupTitle,Cell ,XButton ,TransferDom, Popup,LoadMore} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import Customer from '@/components/customer'
let data = []
export default {
    name: 'sign',
    data() {
        return {
            screenXStart:'',
            screenXEnd:'',
            moveDistance:0,
            firstBoxData:[],
            currentYear:'',
            currentWeek:"",
            initS:0,
            showMonth:'',
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
            listData:[],
            initSelect:'',
            isCustomer:false,
            checkDate:'',
            sub_user_ids:'',
            alertMsg:'加载中...',//第一次
            date1:'',
            isRefresh:false,
            pageTitle:""
        }
    },
     directives: {
      TransferDom
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            SHARE_CUSTOM:'user/SHARECUSTOM',
            ResultChoice:'user/RESULTCHOICE',     
        }),
        topStart(e){
          this.screenXStart = e.changedTouches[0].pageX
        },
        topEnd(e){
          //滑动重置页面
          this.date1 = ''
          this.page==1
          this.$refs.scroller.reset({
            top:0
          })
          //滑动重置页面
          let mm = new Date().getMonth() + 1
          if(mm<10){
            mm='0'+mm
          }
          let today = new Date(new Date().getFullYear()+'/'+mm+'/'+new Date().getDate()+' '+'08:00:00').getTime()
          let _this = this
          this.screenXEnd = e.changedTouches[0].pageX
          if(this.screenXStart-this.screenXEnd>10){
            this.moveDistance++
            let i = this.moveDistance
            $(".top").animate({left:-200+'%'},function(){
              $(".top").css('left','-100%')
              _this.dateProcessing(i,today)
            })
          }else if(this.screenXStart-this.screenXEnd<-10){
            this.moveDistance--
            let i = this.moveDistance
            $(".top").animate({left:'0%'},function(){
              $(".top").css('left','-100%')
              _this.dateProcessing(i,today)
            })
          }
        },
        dateProcessing(i,today){//月份处理
          this.page = 1
          this.listData = []
          let _this = this
          let lastWeekS = _this.getMonday("s",i-1)
          let currenWeekS = _this.getMonday("s",i)  //得到上周一的yyyy-mm-dd格式日期
          let nextWeekS = _this.getMonday("s",i+1)  //得到下周一的yyyy-mm-dd格式日期
          let nextWeekE = _this.getMonday("e",i+1)  //得到下周日的yyyy-mm-dd格式日期
          let lastWeekSD = new Date(lastWeekS).getDate()
          let nextWeekED = new Date(nextWeekE).getDate()
          let newArr = []
          //计算开始的月份的中月份会
          if(lastWeekS.substr(0,7)==nextWeekE.substr(0,7)){//说明相邻的三个星期在同一个月内
            for(let i=lastWeekSD;i<lastWeekSD+21;i++){
              if(i<10){
                i='0'+i
              }
              let weekday = new Date(currenWeekS.substr(0,7)+'/'+i).getDay()
              let todayString = new Date(currenWeekS.substr(0,7)+'/'+i+' '+'08:00:00' ).getTime()
              let obj = {
                date:currenWeekS.substr(0,7)+'/'+i,
                day:i,
                flag:todayString==today?true:false,
                week:weekday
              }
              newArr.push(obj)
            }
          }else{//说明相邻的三个星期在不同一个月内
            let year;
            let month;
            year = lastWeekS.substr(0,4)
            month = lastWeekS.substr(5,2)
            let currentMonthLastDay = _this.getDaysInOneMonth(year,month)
            for(let i=lastWeekSD;i<currentMonthLastDay+1;i++){
              let weekday = new Date(lastWeekS.substr(0,7)+'/'+i).getDay()
              let todayString = new Date(lastWeekS.substr(0,7)+'/'+i+' '+'08:00:00').getTime()
              if(i<10){
                i='0'+i
              }
              let obj = {
                date:lastWeekS.substr(0,7)+'/'+i,
                day:i,
                flag:todayString==today?true:false,
                isSelect:i==today?true:false,
                week:weekday
              }
              newArr.push(obj)
            }
            let residueDay = nextWeekED+1
            for(let j=1;j<residueDay;j++){
              if(j<10){
                j='0'+j
              }
              let weekday = new Date(nextWeekS.substr(0,7)+'/'+j).getDay()
              let todayString = new Date(nextWeekS.substr(0,7)+'/'+j+' '+'08:00:00').getTime()
              let obj = {
                date:nextWeekS.substr(0,7)+'/'+j,
                day:j,
                flag:todayString==today?true:false,
                isSelect:j==today?true:false,
                week:weekday,
              }
              newArr.push(obj)
            }
            
          }
          this.showMonth = newArr[this.initSelect-1].date.substr(0,4)+'年'+newArr[this.initSelect-1].date.substr(5,2)+'月'
          //滑动时获取日期
          let reg = /(\d{4})\/(\d{2})\/(\d{2})/
          this.checkDate =  (newArr[this.initSelect-1].date).replace(reg,"$1-$2-$3");
          this.requestData()//请求数据
          _this.firstBoxData = newArr   
        },
        initData(){
          let mm = new Date().getMonth() + 1
          if(mm>9){
            mm = mm
          }else{
            mm ='0'+mm
          }
          let today = new Date(new Date().getFullYear()+'/'+mm+'/'+new Date().getDate()+' '+'08:00:00').getTime()
          let i =this.initS
          if(new Date().getDay()==0){
            this.initSelect = 14
          }else{
            this.initSelect =new Date().getDay()+7
          }
          this.showMonth = new Date().getFullYear()+'年'+mm+'月'
          this.dateProcessing(i,today)                                                                                                                                                                        
        },
        getMonday(type, dates) {
          var now = new Date();
          var nowTime = now.getTime();
          var day = now.getDay();
          if(!day){
            day = 7
          }
          var longTime = 24 * 60 * 60 * 1000;
          var n = longTime * 7 * (dates || 0);
          if (type == "s") {
              var dd = nowTime - (day - 1) * longTime + n;
          };
          if (type == "e") {
              var dd = nowTime + (7 - day) * longTime + n;
          };
          dd = new Date(dd);
          var y = dd.getFullYear();
          var m = dd.getMonth() + 1;
          var d = dd.getDate();
          m = m < 10 ? "0" + m: m;
          d = d < 10 ? "0" + d: d;
          var day = y + "/" + m + "/" + d;
          return day;
      },
      getDaysInOneMonth(year, month){
        month = parseInt(month, 10);
        var d= new Date(year, month, 0);
        return d.getDate();
      },
      toggleCustomer(data){
        this.isCustomer=!this.isCustomer;
        document.title="选择同事"
        if(data.type!='click'){
          this.ResultChoice(data)
          this.page = 1
          this.$nextTick(function(){
            this.$refs.scroller.reset({
              top:0
            })
          })
          let sub_user_ids='',titleString = '';
          this.listData=[];
          if(data.length>0){
            data.forEach(function(item){
              sub_user_ids+=item.userId+','
              titleString+=item.name+'、'
            })
            sub_user_ids=sub_user_ids.substring(0,sub_user_ids.length-1)
            this.sub_user_ids = sub_user_ids
            //顶部标题
            titleString = titleString.substring(0,titleString.length-1)
            if(titleString.length>7){
              titleString = titleString.substring(0,7)+'...'
            }
            document.title=titleString+"的签到";
            this.pageTitle = titleString+"的签到";
          }else{
            document.title="查看下属签到";
            this.pageTitle = '查看下属签到';
          };
          this.page = 1;
          this.requestData()
        }
      },
      loadMore () {
          if (!this.onFetching) {
            this.onFetching=true
            this.page++
            this.requestData()
          }
        },
        refresh(){
          let that = this
          if(this.status.pulldownStatus != 'default'){
              this.page=1
              this.requestData()//选择之后请求数据
              setTimeout(function(){
                  that.$refs.scroller.donePulldown()
              },500)
          }
        },
        selectDate(date,week){
          this.date1 = ''
          let reg = /(\d{4})\/(\d{2})\/(\d{2})/
          this.checkDate =  date.replace(reg,"$1-$2-$3");
          this.page = 1;
          this.listData=[]
          this.$refs.scroller.reset({
            top:0
          })
          this.requestData()//选择之后请求数据
          let myDate =  date.substr(0,7);
          this.showMonth =myDate.substr(0,4)+'年'+myDate.substr(5,2)+'月'
          if(week==0){
            this.initSelect = 14
          }else{
            this.initSelect = week+7
          }
          this.firstBoxData.filter(function(items,index){
            if(date==items.date){
              items.isSelect=true
            }else{
              items.isSelect=false
            }
          })
        },
        toSiginDetail(id,state){
          this.$router.push({path:"signDetail",query:{id:id,type:6}})
        },
        requestData(){
          let obj = {
            company_id:this.company_id, //	true	int	企业ID
            user_id:this.user_id, //	true	int	用户ID
            
            date:this.checkDate, //	false	string	刷选的日期 格式 2017-07-20
            page:this.page, //	false	int	页码
            count:10, //	false	int	每页数量 默认10
          }
          if(this.sub_user_ids){
            obj.sub_user_ids=this.sub_user_ids
          }
          this.customervisitsign_getSubWorkmateVisitSignLists(obj)
        },
        ...mapActions({
          customervisitsign_getSubWorkmateVisitSignLists:'customervisitsign/getSubWorkmateVisitSignLists'
        })
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            shareCustom:state => state.user.shareCustom,
            reslutChoice:state=>state.user.resultChoice,
            subWorkmateSignListData:state=>state.customervisitsign.subWorkmateSignListData,
            signout:state=>state.signout
        })
    },
    watch:{
      subWorkmateSignListData(data){
        if(data.alert_msg){
            this.$vux.toast.show({
                text: data.alert_msg,
                type: 'text',
                position: 'top',
                width:"20em"                                
            }) 
            this.alertMsg=data.alert_msg
        }else{
          data.items.forEach(function(items){
            if(items.date!=this.date1){
              this.date1=items.date
            }else{
              items.date=''
            }
          },this)
          let _data=data.items
          if(this.status.pulldownStatus=='loading'){
            this.listData=_data
          }else{
            let old_data=this.listData
            this.listData=old_data.concat(_data)
          }
          this.loadFlag=data.has_more
          this.onFetching=!data.has_more
        }
      },
    },
    beforeRouteEnter(to, from, next){
      if(from.name=='sign'||!from.name){
        next(function(vm){
          vm.$nextTick(function(){
            vm.ResultChoice([]);
            let date = new Date();
            let year = date.getFullYear();
            let month = 1+date.getMonth();
            let day = date.getDate();
            if(month<10){
              month='0'+month
            };
            if(day<10){
              data='0'+day
            };
            let firstDate=year+'-'+month+'-'+day;
            vm.checkDate=firstDate;
            vm.listData = [];
            vm.sub_user_ids = '';
            vm.initS = 0;
            vm.alertMsg = '加载中...';//第一次
            vm.date1 = '';
            vm.initData();
            vm.page = 1;
            vm.$refs.scroller.reset({
              top:0
            });
          })
        })
      }else{
        next()
      }
    },
    beforeRouteLeave(to, from, next){
      if(this.isCustomer){
        this.isCustomer=false
        if(this.pageTitle){
          document.title=this.pageTitle
        }
        next(false)
      }else{
        next()
      }
    },
    components: {
      Scroller,
      GroupTitle,
      Cell,
      XButton,
      Customer,
      Popup,
      LoadMore
    },
}
</script>

<style lang="less">

.knowMore{
  .weui-cells__title{
    line-height: 44px;
    margin: 0;
  }
  .weui-btn{
    font-size: 14px;
    width: auto;
    // line-height: 27px;
    margin: 0;
  }
  .box{
    .weui-cell__ft{
      font-size:14px;
    }
    li{
      .weui-cell{
        padding: 0;
        padding-top:10px;
        padding-left:10px;
        padding-right:10px;
      }
    }
  }
}
</style>


<style lang="less" scoped>
 @import '../../../../../css/toolList.less';
 @import './index.less';
</style>
