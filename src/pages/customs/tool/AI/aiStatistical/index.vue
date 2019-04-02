<template>
    <div class="statistical-all">        
        <div>
            <h5>任务状态</h5>
            <flexbox :gutter="0">
                <flexbox-item >
                    <div class="circle-box">
                        <x-circle
                            :percent="schedule"
                            :stroke-width="6"
                            :trail-width="6"
                            stroke-color="#66AEF4">
                            <span>{{schedule}}%</span>
                        </x-circle>
                        <h6>外呼进度</h6>
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <div class="circle-box">
                        <x-circle
                            :percent=" telephone"
                            :stroke-width="6"
                            :trail-width="6"
                            stroke-color="#00cc00">
                            <span>{{ telephone}}%</span>
                        </x-circle>
                        <h6>电话接通率</h6>
                    </div>
                </flexbox-item>
                <flexbox-item>
                     <div class="circle-box">
                        <x-circle
                            :percent="intention"
                            :stroke-width="6"
                            :trail-width="6"
                            stroke-color="#ff9966">
                            <span>{{ intention}}%</span>
                        </x-circle>
                        <h6>意向客户比率</h6>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
        <div class="answer vux-1px-tb">
            <h5>接听状态 <strong>已拨打电话 <em>{{haveCall}}</em> 通</strong></h5>
            <flexbox :gutter="0">
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r "><strong>{{taskConnectedCount}}</strong><br/>已接通</div></flexbox-item>
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r " ><strong>{{taskRefuseCount}}</strong><br/>拒接</div></flexbox-item>
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r"><strong>{{taskUnconnectCount}}</strong><br/>无法接通</div></flexbox-item>
                <flexbox-item :span="1/4"><div class="flex-demo"><strong>{{taskExceptionCount}}</strong><br/>呼叫异常</div></flexbox-item>
            </flexbox>
            <flexbox :gutter="0"  class="vux-1px-tb">
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r"><strong>{{taskVacantnumCount}}</strong><br/>空号</div></flexbox-item>
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r"><strong>{{taskShutdownCount}}</strong><br/>关机</div></flexbox-item>
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r"><strong>{{taskBusyCount}}</strong><br/>占线</div></flexbox-item>
                <flexbox-item :span="1/4"><div class="flex-demo"><strong>{{taskPoweroffCount}}</strong><br/>停机</div></flexbox-item>
            </flexbox>
            <flexbox :gutter="0">
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r"><strong>{{taskUnansweredCount}}</strong><br/>未接</div></flexbox-item>
                <flexbox-item :span="1/4"><div class="flex-demo vux-1px-r"><strong>{{taskArrearageCount}}</strong><br/>主叫欠费</div></flexbox-item>
            </flexbox>
        </div>
    </div>
</template>
<script>
import {  Flexbox, FlexboxItem,XCircle } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
export default {
    name: 'AI',
    data() {
        return {   
            haveCall:0,//已拨打
            schedule:0,//外呼进度
            telephone:0,//电话接通率
            intention:0,//意向客户比率
            taskArrearageCount:0,//主叫欠费的电话数
            taskIntentionCount:0,//客户意向数
            taskUnansweredCount:0,//未接的电话数
            taskPoweroffCount:0,//停机的电话数
            taskBusyCount:0,//占线的电话数
            taskShutdownCount:0,//关机的电话数
            taskVacantnumCount:0,//空号的电话数
            taskExceptionCount:0,//呼叫异常的电话数
            taskUnconnectCount:0,//无法接通的电话数
            taskRefuseCount:0,//拒接的电话数
            taskConnectedCount:0,//已接通的电话数
            taskTotalCount:0,//任务需要拨打电话总数

        }
    },
    props:['statisticalObj'],
    created() {
        let obj={
            task_id:this.$route.query.id,
        }
        this.statisticalHand(obj);       
    },
     watch: {
        //统计数据
        statisticalData(data){  
            if( Object.keys(data).length >0 ){ 
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{    
                    if(Object.keys(data.items).length >0){
                        this.taskArrearageCount=data.items.taskArrearageCount;//主叫欠费的电话数
                        this.taskIntentionCount=data.items.taskIntentionCount;//客户意向数
                        this.taskUnansweredCount=data.items.taskUnansweredCount;//未接的电话数
                        this.taskPoweroffCount=data.items.taskPoweroffCount;//停机的电话数
                        this.taskBusyCount=data.items.taskBusyCount;//占线的电话数
                        this.taskShutdownCount=data.items.taskShutdownCount;//关机的电话数
                        this.taskVacantnumCount=data.items.taskVacantnumCount;//空号的电话数
                        this.taskExceptionCount=data.items.taskExceptionCount;//呼叫异常的电话数
                        this.taskUnconnectCount=data.items.taskUnconnectCount;//无法接通的电话数
                        this.taskRefuseCount=data.items.taskRefuseCount;//拒接的电话数
                        this.taskConnectedCount=data.items.taskConnectedCount;//已接通的电话数
                        this.taskTotalCount=data.items.taskTotalCount;//任务需要拨打电话总数
                        this.haveCall=  (Number(data.items.taskConnectedCount)+Number(data.items.taskRefuseCount)+Number(data.items.taskUnconnectCount)+Number(data.items.taskExceptionCount)+Number(data.items.taskVacantnumCount)+Number(data.items.taskShutdownCount)+Number(data.items.taskBusyCount)+Number(data.items.taskPoweroffCount)+Number(data.items.taskUnansweredCount)+Number(data.items.taskArrearageCount));     
                        let schedule=Math.round((this.haveCall/Number(this.taskTotalCount) )*100);//外呼进度
                        let telephone= Math.round((Number(this.taskConnectedCount)/Number(this.taskTotalCount))*100);//电话接通率
                        let intention=Math.round((Number(this.taskIntentionCount)/Number(this.taskTotalCount))*100);//意向客户比率
                        this.schedule=schedule>100?100:schedule;//外呼进度
                        this.telephone= telephone>100?100:telephone;//电话接通率
                        this.intention=intention>100?100:intention;//意向客户比率

                    }        
                    
                }
                
            }
         },
     },
     methods: {
         ...mapActions({
            statisticalHand: 'ai/statisticalHand',
        }),
       
        
    },
    computed: {
        ...mapState({
            statisticalData: state => state.ai.statisticalData,    
        })       
    },
    components: {
         Flexbox, FlexboxItem,XCircle 
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>