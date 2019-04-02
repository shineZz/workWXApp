<template>
    <div class="mapPage">
      <MyMap propsNearBy='1' />
    </div>
</template>

<script>

import {  Scroller,Cell,Group,GroupTitle } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import MyMap from '@/components/mymap'
export default {
    name: 'sign',
    data() {
      let self = this;
        return {
            
        }
    },
    created() {
      // this.initData()
    },
    methods: {
    },
    computed: {
        
    },
    components: {
      MyMap
    },
}
</script>

<style lang="less">
.mapPage{
  width:100%;
  height: 100%;
  .amap-demo {
      height: 300px;
    }
}

</style>

