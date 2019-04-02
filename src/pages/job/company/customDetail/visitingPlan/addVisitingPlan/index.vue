<template>
    <div class="addVisitingPlan">
        <div class="addVisitingPlan-content">
            <scroller 
                lock-x 
                scrollbar-y 
                :height="scrollerHeight"
                >
                <div class="box1" style="overflow:hidden">
                    <group>
                        <cell title="拜访对象" value="（必选）" is-link>
                            
                        </cell>
                    </group>
                    <group>
                        <cell title="拜访方式" value="请选择" is-link :link='{path:"/page/comment",query:{state:2}}'>
                        </cell>
                        <cell title="关联商机" value="请选择" is-link :link='{path:"/page/businessChance",query:{select:1}}'>
                        </cell>
                    </group>  
                    <group>
                        <x-textarea class="it-direction" :max="50" :height="100" title="拜访主题"  placeholder="不得超过50字（必填）"></x-textarea>
                    </group>     
                    <group>
                        <datetime
                            title="开始时间"
                            v-model="value1"
                            format="YYYY-MM-DD HH:mm"
                            @on-hide="log('hide', $event)"></datetime>
                        <datetime
                            title="结束时间"
                            v-model="value2"
                            format="YYYY-MM-DD HH:mm"
                            @on-hide="log('hide', $event)"></datetime>
                        
                    </group>  
                    <Addstaff :ifView="ifView"/>
                    <group>
                        <x-textarea title="拜访内容" class="it-direction" :max="500" :height="150"  placeholder="输入文字不得超过500字"></x-textarea>
                    </group>
                </div>
            </scroller>
        </div> 
        <div class="add-btn-box">
            <x-button type="primary" v-if="isAdd" @click.native="addVisitingPlan">新增</x-button>
            <x-button type="primary" v-if="!isAdd" @click.native="editVisitingPlan">完成</x-button>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem, Cell ,XButton,Scroller ,Group,XTextarea,Datetime  } from 'vux'
import { mapState, mapActions } from 'vuex'
import Addstaff from '@/components/addStaff'
export default {
    name: 'addVisitingVisitingPlan',
    data() {
        return {
            value1:'2018-10-10',
            value2:'2018-10-13',
            userId:'',
            isAdd:true,
            scrollerHeight:"-36",
            ifView:false
        }
    },
    created() {
    },
    mounted() {
        if(this.$route.query.id){
            this.isAdd=false
            this.scrollerHeight="-36"
        }
    },
    methods: {
        log (str1, str2 = '') {
            console.log(str1, str2)
        },
        addVisitingPlan(){

        },
        editVisitingPlan(){

        }
    },
    computed: {
    },
    watch: {
    },
    components: {
        Group,
        Cell,
        XTextarea,
        Datetime,
        XButton,
        Scroller ,
        Addstaff,
    },
}
</script>
<style lang='less'>
    .addVisitingPlan{
        .weui-cell__bd{
            textarea{
                background: #fff;
            }
        }
    }
</style>

<style lang="less" scoped>
 @import './index.less';

</style>
