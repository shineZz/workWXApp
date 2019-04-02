<template>
    <div class="addBusinessChance">
        <div class="addBusinessChance-content">
            <scroller 
                lock-x 
                scrollbarY 
                height="-36"
                >
                <div class="box1" style="overflow:hidden">
                    <group>
                        <x-input 
                            title="联系人" 
                            text-align="right" 
                            placeholder-align="right" 
                            v-model="linkMan" 
                            placeholder="(必填)"
                        ></x-input>
                        
                    </group>
                    <group>
                        <cell title="商机来源" value="请选择" is-link link='/page/comment?state=0'>
                        </cell>
                    </group>
                    <group>
                        <x-textarea class="it-direction" :max="50" :height="100" v-model="buinessTitle" title="商机主题"  placeholder="输入文字不得超过50字（必填）"></x-textarea>
                    </group>                                
                    <group>
                        <cell title="商机状态" value="请选择" is-link link='/page/comment?state=1'>
                        </cell>
                    </group>    
                    <group>
                        <x-textarea class="it-direction" :max="500" :height="150" v-model="customNeed" title="客户需求"  placeholder="输入文字不得超过500字"></x-textarea>
                    </group>   
                    <group>
                        <datetime
                            title="预计签约日期"
                            v-model="value1"
                            @on-hide="log('hide', $event)"></datetime>
                        <x-input text-align="right" placeholder-align="right"  title="报价" v-model="value" placeholder="(必填)"></x-input>
                        <x-input text-align="right" placeholder-align="right" title="预计成交价" v-model="value" placeholder="(必填)"></x-input>
                    </group>  
                    <group>
                        <x-textarea class="it-direction" :max="500" :height="150" title="备注" v-model="mark"  placeholder="输入文字不得超过500字"></x-textarea>
                    </group>
                </div>
            </scroller>
        </div>
        
        <div class="add-btn-box" >
            <x-button type="primary" v-if="isAdd" @click.native="addBusinessChance">新增</x-button>
            <x-button type="primary" v-if="!isAdd" @click.native="editBusinessChance">完成</x-button>
        </div>
    </div>
</template>

<script>
import { Cell ,Group,Scroller,XTextarea,XButton,Datetime,XInput  } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'addBusinessChance',
    data() {
        return {
            value1:'2018-10-10',
            userId:'',
            value:"",
            businessSource:"",
            linkMan:"",
            buinessTitle:"",
            customNeed:"",
            mark:"",
            isAdd:true,
        }
    },
    created() {
    },
    mounted() {
        this.userId=this.$route.query.id
        if(this.$route.query.id){
            this.isAdd=false
        }
    },
    methods: {
        log (str1, str2 = '') {
            console.log(str1, str2)
        },
        addBusinessChance(){
            this.$router.go(-1)
        },
        editBusinessChance(){
            this.$router.go(-1)
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
