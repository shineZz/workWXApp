<template>
    <div class="sign">
        <group class="group-mt0 group-head"  v-if="!isKey" >
          <cell title="添加新的签到"  inline-desc='记录您的外勤工作情况' is-link @click.native="toSignDetail">
            <img slot="icon" :src="require('@/images/tool/sign2.png')">
          </cell>
          <cell title="查看下属签到"  inline-desc='掌握下属外勤工作情况' is-link :link="{path:'knowMore'}">
            <img slot="icon" :src="require('@/images/tool/orderPower.png')">
          </cell>
          <cell title="附近客户"  inline-desc='查看您附近的客户' is-link  @click.native="tomyMap">
            <img slot="icon" :src="require('@/images/tool/nearby.png')">
          </cell>
        </group>
        <div class="card-head-A"  style="overflow:hidden" v-if="isKey">
          <card :header="{title: '拜访记录：'}" >
              <div slot="content" class="card-demo-flex card-demo-content">
                  <div >
                      拜访记录次数
                      <br/>
                      <span>{{signStatic}}次</span>
                  </div>
              </div>
          </card>
        </div>
      <scroller     
          lock-x  
          scrollbarY 
          @on-scroll-bottom="loadMore" 
          @on-pulldown-loading="refresh" 
          v-model="status"  
          use-pulldown  
          ref="scroller" 
          :height="scrollerHeight"
          :scroll-bottom-offst="0"
          >
            <div  v-if="Object.keys(listData).length == 0 ||   listData.num_items==0 " class="wu-all wu-allB">
                <section>
                    <div><img src="~@/images/wu-icon1.png"></div>
                    <p>{{ listData.length == 0? '暂无拜访记录':alertMsg}}</p>
                </section>
            </div>
            <div class="tool-list" style="overflow:hidden"  v-else>
              <ul style="padding:0px 10px 0">
                  <li v-for="(item,index) in listData" :key="index" @click="toSiginDetail(item.id,item.state)" :class="!item.date?'signHasTop':''">
                      <h6>{{item.date}}</h6>
                      <article   style="margin-bottom:0">
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
                                      <p>{{item.address}}</p>
                                      <div v-if='item.user_id==user_id&&!highSeas'>
                                          <x-button 
                                            class="miniBtn" 
                                            type="primary" 
                                            v-if="item.state==1">
                                            签退
                                          </x-button>
                                      </div>
                                  </dd>
                              </dl>
                              <dl class="icon52-3">
                                  <dt><i></i></dt>
                                  <dd>
                                      <p>{{item.visit_type}}</p>
                                  </dd>
                              </dl>
                              <!-- <dl class="icon52-4" v-if='isKey'>
                                  <dt><i></i></dt>
                                  <dd>
                                      <p>{{item.user_name}}</p>
                                  </dd>
                              </dl> -->
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
        <x-button type="primary" v-if="isKey&&!highSeas" style="width:100%" @click.native="signPerson">添加拜访</x-button>
    </div>
</template>

<script>
import {  Scroller,Cell,Group,Card,XButton,LoadMore } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
export default {
    name: 'sign',
    data() {
      let self = this;
        return {
            highSeas: 1,         //是否公海客户
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
            isKey:true,
            scrollerHeight:'-219',
            date1:'',
            customerId:'',
            signStatic:0,//拜访签到次数
            alertMsg:'加载中...',//第一次
            signStatus:0,//判断为哪种需要定位权限的状态：1为添加、2为签到详情，3为关键内容添加、4为进入附近客户、5为签退详情,6未签到
            signId:'',
        }
    },
    created() {
      this.highSeas = this.$route.query.highSeas?1:0
      if(this.$route.query.key==1){//key为1的时候为添加新的签到，2为从客户详情过来，针对某个用户的签到
        this.isKey = false;
        this.scrollerHeight="-219";
        this.requestMyListData()
      }else if(this.$route.query.key==2){
        this.isKey = true;
        this.scrollerHeight="-168";
        if(this.$route.query.customerId){
          this.customerId=this.$route.query.customerId;
          let  objA = {
            company_id:this.company_id,
            customer_id:this.customerId,
            page:1,
            count:this.count,
          }
          this.customervisitsign_customerVisitStatic(objA)//请求拜访客户次数
          this.requestCustomerListData()
        }
      }
      if (this.highSeas) {
        this.scrollerHeight = '-124'
      }
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            SIGN_OUT:'SIGNOUT',
            CHECKSIGNOUT:'CHECKSIGNOUT',
            loadingHand:'UPDATE_LOADING'
        }),
        ...mapActions({
          customervisitsign_getMyCustomerVisitSignLists:"customervisitsign/getMyCustomerVisitSignLists",
          customervisitsign_getCustomerVisitSignLists:"customervisitsign/getCustomerVisitSignLists",
          customervisitsign_customerVisitStatic:'customervisitsign/customerVisitStatic'
        }),
        openTheGps(){
            let _this = this;
            let objOne = {//初始化，无定位的时候的默认定位
                  isOpenGps:false,
                  location:{
                      lat:"120.118198",
                      lng:"30.335869",
                      O:"120.118198",
                      P:'30.335869',
                  },
                  province:"浙江省",
                  city:"杭州市",
                  area:"拱墅区",
              }
            _this.SIGN_OUT(objOne)
            var map = new AMap.Map('', {
                resizeEnable: true
            })
            map.plugin('AMap.Geolocation', function() {
              var geolocation = new AMap.Geolocation({
                  // 是否使用高精度定位，默认：true
                  enableHighAccuracy: true,
                  // 设置定位超时时间，默认：无穷大
                  timeout: 10000,
                  // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                  buttonOffset: new AMap.Pixel(10, 20),
                  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  zoomToAccuracy: true,     
                  //  定位按钮的排放位置,  RB表示右下
                  buttonPosition: 'RB'
              })

              geolocation.getCurrentPosition()
              AMap.event.addListener(geolocation, 'complete', onComplete)
              AMap.event.addListener(geolocation, 'error', onError)
              function onComplete (data) {
                _this.loadingHand(false)
                _this.SIGN_OUT({
                    isOpenGps:true,
                    location:{
                        lat:data.position.O,
                        lng:data.position.P,
                        O:data.position.O,
                        P:data.position.P,
                    },
                    province:data.addressComponent.province,
                    city:data.addressComponent.city,
                    area:data.addressComponent.city,
                })
              }
              function onError (data) {
                _this.loadingHand(false)
                  // 定位出错
                  _this.$vux.toast.show({
                      text: '定位失败，请开启手机定位',
                      type: 'text',
                      position: 'top',
                      width:"20em"      
                  })
              }
            },this)
        },
        toSignDetail(){
          let hasSign = window.localStorage.getItem('hasSign')
          if(hasSign&&hasSign==1){//有未签退的
            this.$vux.toast.show({
                text: '您有未签退的拜访',
                type: 'text',
                position: 'top',
                width:"20em"                                
            }) 
          }else{
            this.signStatus=1
            this.loadingHand(true)
            this.openTheGps()
          }
        },
        tomyMap(){
          //判断为哪种需要定位权限的状态：1为添加、2已签退，3为关键内容添加、4为进入附近客户、5为签退，已签到,6未签到
          this.signStatus =4
          this.loadingHand(true)
          this.openTheGps()
        },
        signPerson(){//客户页面进入的时候点击签到
          let hasSign = window.localStorage.getItem('hasSign')
          if(hasSign&&hasSign==1){
            this.$vux.toast.show({
                text: '您有未签退的拜访',
                type: 'text',
                position: 'top',
                width:"20em"                                
            }) 
          }else{
            this.signStatus=3
            this.loadingHand(true)
            this.openTheGps()
          }
        },
        loadMore () {
            if (!this.onFetching) {
                this.onFetching=true
                this.page++
                if(this.$route.query.key==1){
                  this.requestMyListData()
                }else{
                  this.requestCustomerListData()
                }
                return ;
            }
        },
        refresh(){
            let that = this;
            this.date1='';
            this.page=1
            if(this.status.pulldownStatus != 'default'){
                if(this.$route.query.key==1){//请求自己的拜访签到记录
                  this.requestMyListData()
                }else{//请求对客户的拜访签到记录
                  this.requestCustomerListData()
                }
            }
        },
        toSiginDetail(id,state){
          //判断为哪种需要定位权限的状态：1为添加、2已签退，3为关键内容添加、4为进入附近客户、5为签退，已签到,6未签到
          this.$router.push({path:"signDetail",query:{id:id,type:state, highSeas: this.highSeas}})
        },
        requestMyListData(){//请求个人的签到拜访记录
          let obj = {
              user_id:this.user_id,
              company_id:this.company_id,
              page:this.page,
              count:this.count,
            }
            this.customervisitsign_getMyCustomerVisitSignLists(obj)
        },
        requestCustomerListData(){//请求对客户的签到拜访记录
          let  objA = {
                    company_id:this.company_id,
                    customer_id:this.customerId,
                    page:this.page,
                    count:this.count,
                  }
            this.customervisitsign_getCustomerVisitSignLists(objA)
        }
    },
    computed: {
        ...mapState({
            mySignListData:state=>state.customervisitsign.mySignListData,
            customerSignListData:state=>state.customervisitsign.customerSignListData,
            visitStaticData:state=>state.customervisitsign.visitStaticData,
            signout:state => state.signout
        })
    },
    watch:{
      mySignListData(data){//个人拜访签到记录
        if(data.alert_msg){
            this.$vux.toast.show({
                text: data.alert_msg,
                type: 'text',
                position: 'top',
                width:"20em"                                
            }) 
            this.alertMsg=data.alert_msg;
        }else{
          data.items.forEach(function(items){
            if(items.date!=this.date1){
              this.date1=items.date
            }else{
              items.date=''
            }
          },this)
          if(this.status.pulldownStatus=='loading'){
            this.listData=data.items
            this.status.pulldownStatus = 'default';
          }else{
            let _data=data.items
            let old_data=this.listData
            this.listData=old_data.concat(_data)
          }
          this.loadFlag=data.has_more
          this.onFetching=!data.has_more
        }
      },
      customerSignListData(data){//针对某个客户的拜访签到记录
        if(data.alert_msg){
            this.$vux.toast.show({
                text: data.alert_msg,
                type: 'text',
                position: 'top',
                width:"20em"                                
            }) 
        }else{
          data.items.forEach(function(items){
            if(items.date!=this.date1){
              this.date1=items.date
            }else{
              items.date=''
            }
          },this)
          if(this.status.pulldownStatus=='loading'){
            this.listData=data.items
            this.status.pulldownStatus = 'default' ;
          }else{
            let _data=data.items
            let old_data=this.listData
            this.listData=old_data.concat(_data)
          }
          this.loadFlag=data.has_more
          this.onFetching=!data.has_more
          if(this.listData.length>0&&this.listData[0].state==1){
            localStorage.setItem('hasSign','1')
          }
        }
      },
      visitStaticData(data){//客户拜访次数
        if(data.alert_msg){
            this.$vux.toast.show({
                text: data.alert_msg,
                type: 'text',
                position: 'top',
                width:"20em"                                
            }) 
        }else{
          this.signStatic = data.items.count
        }
      },
      signout(data){
        if(data.isOpenGps){
          if(this.signStatus==1){//添加新的签到
            this.$router.push('signDetail');
          }else if(this.signStatus==2){

          }else if(this.signStatus==3){//对某个客户进行签到，从客户详情页进入
            if(this.customerId){
              this.$router.push({path:'signDetail',query:{id:this.customerId,type:3,name:this.$route.query.name,company:this.$route.query.company}});
            }
          }else if(this.signStatus==4){
            this.$router.push({path:'myMap',query:{titleType:1}});
          }else if(this.signStatus==5){
            this.$router.push({path:"signDetail",query:{id:this.signId,type:1}})
          }
        }
      }
    },
    components: {
      Scroller,
      Cell,
      Group,
      Card,
      XButton,
      LoadMore
    },
}
</script>

<style lang="less">
 @import '../../custom/customPage/customContract/index2.less';
 .sign{
   .signHasTop{
     margin-top:10px !important;
   }
 }
</style>
<style lang="less" scoped>
 @import '../../../../css/toolList.less';
 @import '../../custom/customPage/customContract/index.less';
</style>
