<template>
    <div class="customComponents">
         <BusinessChance />
        <BusinessChance v-if="status==0 ? true : false "  />
        <VisitingPlan v-if="status==1 ? true : false "  />
        <VisitingRecord v-if="status==2 ? true : false "  />
        <Contract v-if="status==4 ? true : false "  />
        <ReturnedMoney v-if="status==3 ? true : false "  />
    </div>
</template>

<script>
import {  Tabbar, TabbarItem  } from 'vux'
import { mapState, mapActions } from 'vuex'
import BusinessChance from '../customDetail/businessChance'
import Contract from '../customDetail/contract'
import ReturnedMoney from '../customDetail/returnedMoney'
import VisitingPlan from '../customDetail/visitingPlan'
import VisitingRecord from '../customDetail/visitingRecord'

export default {    
    name: 'customComponents',
    data() {
        return {
            status:"",
        }
    },
    created() {
    },
    mounted() {
        
        if(this.$route.query.status==0){
            this.status=0
        }else if(this.$route.query.status==1){
            this.status=1
        }else if(this.$route.query.status==2){
            this.status=2
        }else if(this.$route.query.status==3){
            this.status=4
        }else if(this.$route.query.status==5){
            this.status=5
        }
    },
    methods: {
       
    },
    computed: {
    },
    watch: {
    },
    components: {
        BusinessChance,
        Contract,
        ReturnedMoney,
        VisitingPlan,
        VisitingRecord,
    },
}
</script>
