<template>
    <div>        
        <group class="group-head group-mt0">
            <cell title="添加新的AI外呼任务"  inline-desc='记录你的AI外呼工作情况' :link="{path:'AiTask'}">
                <img slot="icon" src="~@/images/tool/sign2.png">
            </cell>
            <cell title="查看下属AI外呼"  inline-desc='掌握下属AI外呼工作'  @click.native="linkHand"  :link="{path:'AiView'}">
                <img slot="icon" src="~@/images/tool/orderPower.png">
            </cell>
        </group>
        <AiList :aiObj="aiObj"  />
    </div>
</template>
<script>
import {Cell,Group,} from 'vux'; 
import { mapState,mapActions,mapMutations, } from 'vuex';
import AiList from '@/pages/customs/tool/AI/aiList';
export default {
    name: 'AI',
    data() {
        return {   
            aiObj:{
                type:0,
                             
            }
        }
    },    
    created() {
    },
     methods: {
         linkHand(){
             localStorage.removeItem('aiViewObj')
             this.$router.push({ path: 'AiView'})
         },
     },
    components: {
        Cell,Group,AiList
    },
}
</script>