<template>
    <div class="addReturnedMoney">
        <div class="addReturnedMoney-content">
            <scroller 
                lock-x 
                scrollbar-y 
                :height="scrollerHeight"
                >
                <div class="box1" style="overflow:hidden">
                    <group>
                        
                        <cell title="关联合同" value="（必选）" is-link :link='{path:"/page/contract",query:{select:1}}'>
                        </cell>
                        <cell title="合同金额" value="askdlaskdlsa" >
                            
                        </cell>
                    </group>
                    <group>
                        <datetime
                            title="回款日期"
                            v-model="value1"
                            format="YYYY-MM-DD HH:mm"
                            @on-hide="log('hide', $event)"></datetime>
                        <x-input title="汇款金额" text-align="right" placeholder-align="right" v-model="value" placeholder="(必填)"></x-input>
                        <cell title="汇款方式" value="（必选）" is-link :link='{path:"/page/comment",query:{state:3}}'>
                        </cell>
                    </group>
                    <group>
                        <cell title="开票" value="（必选）" is-link >
                        </cell>
                    </group>    
                    <group>
                        <x-textarea class="it-direction" :max="500" :height="150" title="备注"  placeholder="输入文字不得超过500字"></x-textarea>
                    </group>  
          
                </div>
            </scroller>
        </div> 
        <div class="add-btn-box" >
            <x-button type="primary" v-if="isAdd" @click.native="addReturnedMoney">新增</x-button>
            <x-button type="primary" v-if="!isAdd" @click.native="editReturnedMoney">保存</x-button>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem, Cell,XButton,Scroller ,Group,XTextarea,Datetime,XInput  } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'addReturnedMoney',
    data() {
        return {
            value1:'2018-10-10',
            userId:'',
            value:"",
            isAdd:true,
            scrollerHeight:"-36",
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
        addReturnedMoney(){

        },
        editReturnedMoney(){

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
        Scroller
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';

</style>
