<template>
    <div>
        <iframe :src="url" :style="{ width: Wh+ 'px', height: He + 'px',    border: 0 , background: '#fff'}"></iframe>
    </div>
</template>
<script>
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'iframe',
     data() {
        return { 
            url:this.$route.query.url,
            He:$(window).height(),
            Wh:$(window).width(),
        }
    },
    mounted(){
        document.title=this.$route.query.title
    },
    watch: {
        $route: function(val) {
            if (val.name === "iframe") {
                document.title = this.$route.query.title
                this.url = this.$route.query.url
            }
        },
    }
}
</script>