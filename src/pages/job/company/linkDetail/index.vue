<template>
    <div id="linkDetail">
       <group>
            <x-input title="姓名" placeholder-align="right" text-align="right" placeholder="(必填)"></x-input>
            <x-input title="性别" placeholder-align="right" text-align="right" placeholder="(必选)"></x-input>
            <x-input title="部门" placeholder-align="right" text-align="right" placeholder="请输入"></x-input>
            <x-input title="职务" placeholder-align="right" text-align="right" placeholder="(必填)"></x-input>
            <x-input title="手机" placeholder-align="right" text-align="right" placeholder="(必填)"></x-input>
            <x-input title="邮箱" placeholder-align="right" text-align="right" placeholder="请输入"></x-input>
       </group>
       <x-button @click.native="addLink" type="primary" v-if="isAdd==0 ? true : false ">新增</x-button>
       <x-button @click.native="updateLink" type="primary" v-if="isAdd==1 ? true : false ">保存</x-button>
       <x-button @click.native="resetLink" type="primary" v-if="isAdd==2 ? true : false ">修改</x-button>
       <x-button type="primary" v-if="isAdd==2 ? true : false ">打电话</x-button>
    </div>
</template>

<script>
import { XButton,  CellBox, Cell ,Scroller ,Group,Card ,XInput  } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'linkDetail',
    data() {
        return {
            customAll:true,
            isAdd:0
        }
    },
    created() {
        
        let query = this.$route.query.query
        // if(id){
        //     this.isAdd=false
        // }else{
        //     this.isAdd=true
        // }
    },
    mounted() {
        
    },
    methods: {
        addLink(){

        },
        updateLink(){

        },
        resetLink(){

        }
    },
    computed: {
    },
    watch: {
    },
    components: {
        CellBox,
        Group,
        Cell,
        Card,
        XButton,
        Scroller,
        XInput
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
