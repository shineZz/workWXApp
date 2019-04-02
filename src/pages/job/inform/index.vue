<template>
    <div>        
        <button-tab v-model="classTrue"  class="tabnav-all vux-1px-b">
            <button-tab-item selected ><span>企业公告</span></button-tab-item>
            <button-tab-item ><span :class="false ? 'vux-reddot-s' : ''" >系统通知</span></button-tab-item>
        </button-tab>
       <div>
            <Notice v-if="!classTrue" />
            <System v-if="classTrue" />
       </div>
    </div>
</template>

<script>
import {  ButtonTab,ButtonTabItem  } from 'vux'
import { mapState, mapActions } from 'vuex'
import Notice from './notice'
import System from './system'
export default {
    name: 'Inform',
    data() {
        return {
            classTrue:0,
            hasNotView:false,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
        }
    },
    created() {
        if(this.$store.state.oanotice.notViewNumber>0){
            this.hasNotView = true
        }
    },
    mounted() {
        let endTime = new Date().toLocaleTimeString()
        endTime = endTime.substring(2,endTime.length);
        let myYear = new Date().toISOString()
        myYear = myYear.substring(0,10);
        myYear = myYear+' '+endTime
        let obj3 = {
            userId:this.user_id,
            companyId:this.company_id,
            beginTime:"2000-01-01 00:00:00",
            endTime:myYear
        }   
        this.NOTVIEWNOTICE(obj3)
    },
    methods: {
        ...mapActions({
            NOTVIEWNOTICE:'oanotice/NotViewNotice'
        }),
    },
    computed: {
        ...mapState({
            notViewNumber:state => state.oanotice.notViewNumber
        })
        
    },
    watch: {
        notViewNumber(data){
            if(data>0){
                this.hasNotView = true
            }else{
                this.hasNotView = false
            }
        }

    },
    components: {
       ButtonTab,ButtonTabItem,Notice,System
    },
}
</script>

