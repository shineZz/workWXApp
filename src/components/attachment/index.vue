<template>
    <div class="attachment-box">
        <group>
            <cell  v-for="(item,index) in attachData" :key="index" :link="item.fileUrl" >
                <span slot="title">附件：<strong>{{item.fileName}}</strong></span>
            </cell>
        </group>
    </div>
</template>

<script>
import {Group,Cell,} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'attachment',
     data() {
        return { 
            attachData:[]
            
        }
    },
    components: {
        Group,
        Cell,
    },
    created(){
        this.attachData=JSON.parse(localStorage.getItem('fileDetails'));
    },
    
}
</script>
<style lang="less">
 @import './index.less';
</style>

