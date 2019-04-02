<template>
    <div id="app" style="height: 100%;">
        <div v-transfer-dom>
            <loading v-model="isLoading"></loading>
        </div>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </div>
</template>

<script>
import { Loading, TransferDom,Popup } from 'vux'
import { mapState,mapMutations,mapActions } from 'vuex'
// 防止textarea被键盘遮挡
window.addEventListener("resize", function () {
  if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
    window.setTimeout(function () { 
      document.activeElement.scrollIntoViewIfNeeded();
    },0);
  }
})
export default {
    name: 'app',
    directives: {
        TransferDom
    },
    data() {
      
        return {
            
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
        })
    },
    watch:{
        
    },
    components: {
        Loading,
        TransferDom
    }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
@import '~vux/src/styles/close.less';
@import './css/index.less';
</style>
