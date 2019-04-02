<template>
    <div class="huntGuest">
        猎客
    </div>
</template>

<script>
import {   } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'huntGuest',
    data() {
        return {
            
        }
    },
    created() {
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
        }),
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
        })
    },
    components: {
    },
}
</script>

<style lang="less">


</style>


<style lang="less" scoped>
 @import './index.less';
</style>
