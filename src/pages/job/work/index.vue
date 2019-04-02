<template>
<div>    
    <div class="work-user">
        <article>
            <h5>{{userName}}</h5>
            <div><img :src="headLogo" class="box-shadow" :onerror="logo"/></div>
        </article>
    </div>
    <works :moduleObj="workObj"></works>
    <div class="btn-footer"><x-button type="primary" @click.native="dynamic">发布</x-button></div>
</div>
    
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { XButton } from 'vux'
import Works from '@/components/works'
export default {
    name: 'work',
    data() {
        return {
            workObj:{
                link:'2',
            },
            headLogo:this.$store.state.userInfo.user.headLogo?this.$store.state.userInfo.user.headLogo:require('@/images/xsdefult.jpg'),
            userName:this.$store.state.userInfo.user.trueName,
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' 
            
        }        
    },
    methods: {
        dynamic(){
            this.$router.push({ path: 'dynamic' })
        }
    },
    components: {
       Works,
       XButton
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
