<template>
    <div class="addContract">
        <div class="addContract-content">
            <scroller 
                lock-x 
                scrollbar-y 
                height="-35"
                >
                <div class="box1" style="overflow:hidden">
                    <group>
                        <x-input title="合同标题" v-model="value"  text-align="right" placeholder-align="right"  placeholder="(必填)"></x-input>
                        <x-input title="合同编号" v-model="value"  text-align="right" placeholder-align="right" placeholder="(必填)"></x-input>
                        <cell title="合同签约人" value="（必选）" is-link :link='{path:"/page/job/comment",query:{status:1}}'>
                        </cell>
                        <cell title="关联商机" value="请选择" is-link :link='{path:"/page/businessChance",query:{select:0}}'>
                        </cell>
                    </group>
                    <group>
                        <x-input title="签约金额" v-model="value" text-align="right" placeholder-align="right"  placeholder="(必填)"></x-input>
                        <datetime
                            title="签约日期"
                            v-model="value1"
                            format="YYYY-MM-DD HH:mm"
                            @on-hide="log('hide', $event)"></datetime>
                    </group>
                    <group>
                        <datetime
                            title="起始日期"
                            v-model="value1"
                            format="YYYY-MM-DD HH:mm"
                            @on-hide="log('hide', $event)"></datetime>
                        <datetime
                            title="终止日期"
                            v-model="value1"
                            format="YYYY-MM-DD HH:mm"
                            @on-hide="log('hide', $event)"></datetime>
                    </group>                                  
                    <group>
                        <x-textarea title="关键条款" class="it-direction" :max="500" :height="150"  placeholder="输入文字不得超过500字"></x-textarea>
                    </group>   
                </div>
            </scroller>
        </div>
        <div class="add-btn-box" v-if="isAdd">
            <x-button type="primary" @click.native="addContract">新增</x-button>
        </div>
        <div class="add-btn-box" v-if="!isAdd">
            <x-button type="primary" @click.native="editContract">完成</x-button>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem, Cell,XButton,Scroller ,Group,Search,XTextarea,Datetime,XInput  } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'addContract',
    data() {
        return {
            value1:'',
            userId:'',
            value:"",
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
        addContract(){

        },
        editContract(){

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
        XInput,
        XButton,
        Scroller,
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';

</style>
