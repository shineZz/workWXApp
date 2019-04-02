<template>
    <div class="myCustom">
        <AddressBook :returnData="addressData" :state1="1" :state2="1" :state3="1" :person="0" />
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Cell ,Group,Search   } from 'vux'
import { mapState, mapActions } from 'vuex'
import CustomComponents from './customComponents'
import AddressBook from '@/components/addressBook'
export default {
    name: 'custom',
    data() {
        return {
            
            addressData:[]
        }
    },
    created() {
    },
    mounted() {
        
    },
    methods: {
        
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
        CustomComponents,
        AddressBook,
    },
}
</script>

