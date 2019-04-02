<template>
    <div>
        <tabbar class="tabbar-top">            
            <tabbar-item :selected="type===1" @on-item-click="handleChangeType(1)">
                <span class="icon icon-merchants"
                        slot="icon"></span>
                <span slot="label">招商</span>
            </tabbar-item>
            <tabbar-item :selected="type===2" @on-item-click="handleChangeType(2)">
                <span class="icon icon-promote"
                        slot="icon"></span>
                <span slot="label">推广</span>
            </tabbar-item>
        </tabbar>
        <Merchants v-if="type==1"></Merchants>
        <Promote  v-if="type==2"></Promote>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem   } from 'vux';
import { mapState, mapActions } from 'vuex';
import Merchants from '@/pages/business/merchants';
import Promote from '@/pages/business/promote';
export default {
    name: 'business',
    data() {
        return {
            type:0,
        }
    },
    created() {
        let type= JSON.parse(localStorage.getItem('businessNav')) || 1;
        this.type=type;
        if(this.type==2){
            document.title="推广";
        }else{
            document.title="招商";
        }
    },
    methods: {
        handleChangeType(type){
            this.type=type;
            if(this.type==2){
                document.title="推广"
            }else{
                document.title="招商"
            }
            localStorage.setItem('businessNav', JSON.stringify(type))
        }
    },
    computed: {
    },
    watch: {
    },
    components: {
        Tabbar, TabbarItem,Merchants,Promote
    },
}
</script>
