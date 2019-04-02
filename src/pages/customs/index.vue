<template>
    <div class="customs">
        <custom v-if="customType === 'custom'"/>
        <tool  v-if="customType === 'tool'"/>
        <tabbar class="tabbar-top">
            <tabbar-item :selected="customType === 'custom'" @on-item-click="handleChangeType('custom')">
                <span slot="icon" class="icon icon-custom"></span>
                <span slot="label">客户</span>
            </tabbar-item>
            <tabbar-item  :selected="customType === 'tool'" @on-item-click="handleChangeType('tool')">
                <span slot="icon" class="icon icon-itool"></span>
                <span slot="label">工具</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import custom from '@/pages/customs/custom'
import tool from '@/pages/customs/tool'

export default {
    name: 'customs',
    data() {
        return {
            customType: 'custom'
        }
    },    
    created() {
        this.customType = sessionStorage.getItem('customType') || 'custom'
        if(this.customType === 'custom') {
            document.title="客户"
        }else{
            document.title="工具"
        }
    },
    methods: {
        handleChangeType(type){
            this.customType = type
            if(type === 'custom') {
                document.title="客户"
            }else{
                document.title="工具"
            }
            sessionStorage.setItem('customType', type)
        }
    },
    components: {
        Tabbar,
        TabbarItem,
        custom,
        tool,
    },
}
</script>