<template>
<div  class="results-all">
    <group style=" overflow: hidden;">
        <popup-radio title="请选择仪表盘" :options="TypeData" v-model="option" @on-hide="TypeHand"></popup-radio>
    </group>
    <div v-if="Object.keys(resultsAllData).length ==0"></div>
    <div v-else-if="AllData.length==0" class="wu-all">
        <section>
            <div><img src="~@/images/wu-icon1.png"></div>
            <p>暂无仪表盘</p>
        </section>
    </div>
    <scroller v-else lock-x scrollbar-y  height="-64" ref="scroller" >
        <div style=" overflow: hidden;"  >
            <group >     
                <cell v-for="(item,index) in AllData" :key="index" :title="item.rptName" is-link  @click.native="linkHand(item)">
                    <img slot="icon" :src="item.icofileUrl" >
                </cell>                 
           </group>
        </div>    
    </scroller>
</div>

</template>
<script>
import { Scroller,Cell, Group, PopupRadio} from 'vux'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'resultsAdd',
     data () {
        return {
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            AllData:[],
            option: '0',
            TypeData:[{
                      key:'0',
                      value:'全部仪表盘',
                  }] ,
        }
        
    },
     created(){            
        document.body.addEventListener('touchmove',this.bodyScroll,false); 
    },
    mounted() {
        let obj={
            userId:this.userId,
            companyId:this.companyId,
        }
        this.resultsAllHand(obj);     
        this.resultsTypeHand(obj); 
    },
    watch: {
         resultsAllData(data){            
            if( Object.keys(data).length >0 && this.$route.name=='resultsAll'){
              if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
              }else{ 
                this.AllData=data.items;
              }
            }
         },
         //获取仪表盘类型
         resultsTypeData(data){           
            if( Object.keys(data).length >0 && this.$route.name=='resultsAll'){
              if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
              }else{ 
                  let Arr=[{
                      key:'0',
                      value:'全部仪表盘',
                  }];
                  data.items.forEach(item => {
                      let obj={
                            key:item.dashboardtypeId,
                            value:item.dashboardtypeName,
                      }
                      Arr.push(obj)
                  });
                  this.TypeData=Arr;

              }
            }
         },        

    },
    methods: {
        ...mapActions({
            resultsAllHand:'oadashboard/resultsAll',
            resultsTypeHand:'oadashboard/resultsType',
        }),
        TypeHand(){
            let obj={
                userId:this.userId,
                companyId:this.companyId,
            }
            if(this.option){
                obj.dashboardtypeId=this.option;
            }
             this.resultsAllHand(obj);   
            
         },
         //链接地址跳转
        linkHand(item){
            window.location.href=item.rptUrl+'?userId='+this.userId+'&companyId='+this.companyId;            
        },
        bodyScroll(event){  
            event.preventDefault();  
        } 
    },
    computed: {
        ...mapState({
            resultsAllData: state => state.oadashboard.resultsAllData,
            resultsTypeData: state => state.oadashboard.resultsTypeData,
            // resultsListData: state => state.oadashboard.resultsListData,
            // resultsAddData: state => state.oadashboard.resultsAddData,
            
        })       
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
         document.body.removeEventListener('touchmove',this.bodyScroll,false);
         next()
    },
    components: {
      Scroller,
      Cell, Group,
      PopupRadio,
    },
    
}
</script>
<style lang="less" >
 @import '../index.less';
</style>