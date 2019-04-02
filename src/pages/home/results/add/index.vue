<template>
<div  class="results-add">
    <h6>最多添加8个仪表盘，已经添加{{checklist.length}}个</h6>
    <scroller  lock-x scrollbar-y  height="-75" ref="scroller" @on-scroll="onScroll" >
        <div>
            <checklist :max="8"  label-position="left" :options="AllData" v-model="checklist" ></checklist>
        </div>    
    </scroller>
    <footer><x-button type="primary" @click.native="addHand">确定</x-button></footer>
</div>

</template>
<script>
import { Checklist,Scroller,XButton, } from 'vux'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'resultsAdd',
         data () {
        return {
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            AllData:[],
            resultsData:[],
            checklist: [],
        }
    },
    mounted(){        
        let obj={
            userId:this.userId,
            companyId:this.companyId,
        }
        this.resultsAllHand(obj);        
    },
    watch: {
         resultsAllData(data){            
            if( Object.keys(data).length >0 && this.$route.name=='resultsAdd'){
              if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
              }else{ 
                let Arr=[];
                    if(Object.keys(this.resultsListData).length == 0){     
                        let obj={
                            userId:this.userId,
                            companyId:this.companyId,
                        }   
                        this.resultsListHand(obj);
                    }else{
                        let DataS=[];
                        this.resultsListData.items.forEach((item,index) => {
                            DataS.push(item.indexId)                                                
                        });
                        this.checklist=DataS;
                    }
                  data.items.forEach((item,index) => {
                      let obj={
                          key:item.indexId,
                          value:'<img src='+item.icofileUrl+'>'+item.rptName,
                      }
                      Arr.push(obj)                      
                  });
                this.AllData=Arr

              }
            }
         },
         //添加
         resultsAddData(data){        
            if( Object.keys(data).length >0  && this.$route.name=='resultsAdd'){
              let text;
              if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
              }else{     
                text= '添加成功'           
                this.$router.go(-1);
              }
              this.$vux.toast.show({
                    text ,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }
         },
         //选中的数据
         resultsListData(data){           
            if( Object.keys(data).length >0  && this.$route.name=='resultsAdd'){
              if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
              }else{     
                let Data=[];
                data.items.forEach((item,index) => {
                    Data.push(item.indexId)                                                
                });
                this.checklist=Data;
              }
              
            }
         }
    },
    computed: {
        ...mapState({
            resultsAllData: state => state.oadashboard.resultsAllData,
            resultsListData: state => state.oadashboard.resultsListData,
            resultsAddData: state => state.oadashboard.resultsAddData,
            
        })       
    },
    methods: {
        ...mapActions({
            resultsAllHand:'oadashboard/resultsAll',
            resultsAddHand:'oadashboard/resultsAdd',
            resultsListHand:'oadashboard/resultsList',
        }),
        //增加
        addHand () {
            let Arr=[];
                if(this.checklist.length>0){
                    this.checklist.forEach(item => {
                        let ArrObj={
                            dashboardId:item,
                        }
                        Arr.push(ArrObj)
                    });
                }
            let obj={
                userId:this.userId,
                companyId:this.companyId,
                dashboardList:JSON.stringify(Arr),
            }
            this.resultsAddHand(obj)
        },
        //滚动
        onScroll(){
          this.$refs.scroller.reset();
        }
    },
    mounted(){
        this.$refs.scroller.reset()
    },
    components: {
      Checklist,
      Scroller,
      XButton ,
    },
    
}
</script>
<style lang="less" >
 @import './index.less';
</style>