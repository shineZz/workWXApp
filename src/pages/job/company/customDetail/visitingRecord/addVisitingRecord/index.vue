<template>
    <div class="addVisitingRecord">
        <div class="addVisitingRecord-content">
            <scroller 
                lock-x 
                scrollbarY 
                height="-36"
                >
                <div class="box1" style="overflow:hidden">
                    <group>
                        <cell title="拜访计划" value="（必选）" :link='{path:"/page/visitingPlan",query:{select:1}}'>
                        </cell>
                    </group>  
                    <group>
                        <cell title="关联商机" value="（必选）" is-link :link='{path:"/page/businessChance",query:{select:1}}'>
                        </cell>
                        <cell title="拜访对象" value="（必选）" is-link :link='{path:"/page/comment",query:{status:1}}'>
                        </cell>
                        <cell title="拜访方式" value="（必选）" :link='{path:"/page/comment",query:{status:1}}'>
                        </cell>
                        <datetime
                            title="预计签约日期"
                            v-model="value1"
                            format="YYYY-MM-DD HH:mm"
                            @on-hide="log('hide', $event)"></datetime>
                    </group> 
                    
                    
                    <group>
                        <x-textarea class="it-direction" :max="500" :height="150" title="交流内容"  placeholder="输入文字不得超过500字"></x-textarea>
                    </group>   
                    <group>
                        <x-textarea class="it-direction" :max="500" :height="150" title="跟进策略"  placeholder="输入文字不得超过500字"></x-textarea>
                    </group>
                </div>
            </scroller>
        </div> 
        <div class="add-btn-box" >
            <x-button type="primary" v-if="isAdd" @click.native="addVisitingRecord">新增</x-button>
            <x-button type="primary" v-if="!isAdd" @click.native="editVisitingRecord">完成</x-button>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,XButton,Scroller,  CellBox, Cell ,Group,Search,Card,XTextarea,Datetime  } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'addVisitingRecord',
    data() {
        return {
            value1:'2018-10-10',
            userId:'',
            isAdd:true,
            
        }
    },
    created() {
    },
    mounted() {
        if(this.$route.query.id){
            this.isAdd=false
            this.scrollerHeight="-0"
        }
    },
    methods: {
        log (str1, str2 = '') {
            console.log(str1, str2)
        },
        addVisitingRecord(){

        },
        editVisitingRecord(){

        },
    },
    computed: {
    },
    watch: {
    },
    components: {
        CellBox,
        Group,
        Cell,
        Search,
        Card,
        XTextarea,
        Datetime,
        XButton,
        Scroller
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';

</style>
