<template>
<scroller  lock-x scrollbar-y height="-115" ref="scroller" @on-scroll="onScroll">
<div class="results-all" >    
    <group >      
      <cell title="全部仪表盘" is-link :link="{path:'resultsAll'}" :value=" '已添加'+resultsData.length+'个'" >
        <img slot="icon"  src="~@/images/icon-all.png" />
      </cell>
      <cell v-if="resultsData.length==0" title="点击添加常用的仪表盘项目" is-link :link="{path:'resultsAdd'}" class="it-add">
        <img slot="icon"  src="~@/images/icon-add.png"/>
      </cell>
    </group>
    <group style="padding-bottom:10px;" v-if="resultsData.length>0">      
      <cell v-for="(item,index) in resultsData" :key="index" :title="item.rptName" @click.native="linkHand(item)" >
        <img slot="icon" :src="item.icofileUrl" >
      </cell>
      <cell title="点击添加常用的仪表盘项目" is-link :link="{path:'resultsAdd'}" class="it-add" >
        <img slot="icon" src="~@/images/icon-add.png"/>
      </cell>
    </group>
</div>  
</scroller>  
</template>
<script>
import { Cell, Group,Scroller  } from 'vux'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'results',
    data () {
        return {
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            resultsData:[],
        }
    },
    mounted(){        
        let obj={
            userId:this.userId,
            companyId:this.companyId,
        }
        this.resultsListHand(obj);
    },
    computed: {
        ...mapState({
            resultsListData: state => state.oadashboard.resultsListData,
            
        })       
    },
    watch: {
         resultsListData(data){       
            if( Object.keys(data).length >0  && this.$route.name=='home'){   
              if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
              }else{ 
                this.resultsData=data.items

              }
            }
         }
    },
    methods: {
        ...mapActions({
            resultsListHand:'oadashboard/resultsList',
        }),
        //链接地址跳转
        linkHand(item){
            window.location.href=item.rptUrl+'?userId='+this.userId+'&companyId='+this.companyId;            
        },
        //滚动
        onScroll(){
          this.$refs.scroller.reset();
        }
    },
    components: {
      Group,
      Cell,      
      Scroller ,
    },
    
}
</script>
<style lang="less" >
 @import './index.less';
</style>