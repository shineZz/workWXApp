<template>
    <div class="slidCalendar">
        <div class="slidCalendar-header"> 
          <group-title style="text-align:center;color:#000">
            {{showMonth}}
          </group-title>
          <span @click="openCustomer" >筛选</span>
        </div>
        <div class="topBox" @touchstart="topStart" @touchend="topEnd">
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
                <i @click="selectDate(i.date,i.week,i)" :class="i.flag?'active':''">{{i.day}}</i>
              </span>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import {  Scroller,GroupTitle,XButton } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
export default {
    name: 'slidCanlendar',
    data() {
      let self = this;
        return {
            screenXStart:'',
            screenXEnd:'',
            moveDistance:0,
            firstBoxData:[],
            currentYear:'',
            currentMonth:'',
            currentWeek:"",
            initS:0,
            showMonth:'',
            initSelect:'',
            isFirstNeedDay:false,
        }
    },
    created() {
      this.initData(this.dataTime)
      // this.ResultChoice([
      //   {
      //     color:'2',
      //     companyId:'4742',
      //     departId:'230204',
      //     flag:'',
      //     headPortrait:'http://dev-xsimages.51lick.cn:18880/static/images/icon/xsdefult.jpg',
      //     mobile:'17150023066',
      //     name:'阿的的',
      //     num:'1',
      //     userId:'513607',
      //   }
      // ])
    },
    props:['dataTime'],
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            ResultChoice:'user/RESULTCHOICE',     
        }),
        openCustomer(){
          this.$emit('controlCustomer')
        },
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
        topStart(e){
          this.screenXStart = e.changedTouches[0].pageX

        },
        topEnd(e){
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
          let _this = this
          let lastWeekS = _this.getMonday("s",i-1)
          let currenWeekS = _this.getMonday("s",i)  //得到下周一的yyyy-mm-dd格式日期
          let nextWeekS = _this.getMonday("s",i+1)  //得到下周一的yyyy-mm-dd格式日期
          let nextWeekE = _this.getMonday("e",i+1)  //得到下周日的yyyy-mm-dd格式日期
          let lastWeekSD = new Date(lastWeekS).getDate()
          let nextWeekED = new Date(nextWeekE).getDate()
          let newArr = []
          //计算开始的月份的中月份会
          if(lastWeekS.substr(0,7)==nextWeekE.substr(0,7)){
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
          }else{
            let year;
            let month;
            year = lastWeekS.substr(0,4)
            month = lastWeekS.substr(5,2)
            let currentMonthLastDay = _this.getDaysInOneMonth(year,month)
            for(let i=lastWeekSD;i<currentMonthLastDay+1;i++){
              if(i<10){
                i='0'+i
              }
              let weekday = new Date(lastWeekS.substr(0,7)+'/'+i).getDay()
              let todayString = new Date(lastWeekS.substr(0,7)+'/'+i+' '+'08:00:00').getTime()
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
          let chooseDay =  newArr[this.initSelect-1].date
          let reg = /(\d{4})\/(\d{2})\/(\d{2})/
          chooseDay =  chooseDay.replace(reg,"$1-$2-$3");
          if(this.isFirstNeedDay){
              this.$emit('canlenDarData',chooseDay)
          }else{
            this.isFirstNeedDay = true
          }
          _this.firstBoxData = newArr   
        },
        initData(i_d){
          let mm = new Date().getMonth() + 1
          if(mm>9){
            mm = mm
          }else{
            mm ='0'+mm
          }
          let today = new Date(new Date().getFullYear()+'/'+mm+'/'+new Date().getDate()+' '+'08:00:00').getTime()
          let i =this.initS
          if(i_d){
            if(new Date(i_d).getDay()==0){
              this.initSelect = 14
            }else{
              this.initSelect =new Date(i_d).getDay()+7
            }
            this.showMonth = new Date(i_d).getFullYear()+'年'+mm+'月'
            this.dateProcessing(i,today)   
          }else{
            if(new Date().getDay()==0){
              this.initSelect = 14
            }else{
              this.initSelect =new Date().getDay()+7
            }
            this.showMonth = new Date().getFullYear()+'年'+mm+'月'
            this.dateProcessing(i,today)   
          }
          
                                                                                                                                                                               
        },
        getMonday(type, dates) {//获取某个月份的天数
          var now;
          if(this.dataTime){
            now = new Date(this.dataTime);
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
          }else{
            now = new Date();
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
          }
          
      },
      getDaysInOneMonth(year, month){
        month = parseInt(month, 10);
        var d= new Date(year, month, 0);
        return d.getDate();
      },
      selectDate(date,week,d){
        let reg = /(\d{4})\/(\d{2})\/(\d{2})/
        date =  date.replace(reg,"$1-$2-$3");
        this.$emit('canlenDarData',date)
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
    },
    computed: {
        ...mapState({
            reslutChoice:state=>state.user.resultChoice
        })
    },
    watch:{
    },
    components: {
      Scroller,
      GroupTitle,
      XButton,
      
    },
}
</script>

<style lang="less">

.slidCalendar{
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
}
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
