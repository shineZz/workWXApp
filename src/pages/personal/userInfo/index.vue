<template>
    <div class="user-info">
        <group>
            <cell title="手机号" :value="userInfo.user.mobile"></cell>
            <cell title="我的昵称" is-link :value="userInfo.user.nickName" :link="{ name: 'nickName', query: {nick: true} }"></cell>
        </group>
        <group>
            <cell title="修改登录密码" is-link :link="{ name: 'nickName' }"></cell>
        </group>
        <footer class="user-footer">
            <div class="hd"></div>
            <x-button type="primary" :link="{ name: 'login' }">退出当前用户</x-button>
        </footer>
    </div>    
</template>

<script>
import { XButton, Group , Cell } from 'vux';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'userInfo',
    data() {
        return{
        }
    },
    created() {
    },
    methods: {
        ...mapActions({
        }),
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
        })       
    },
    watch: {
    },
    components: {
        Group, XButton, Cell
    }
}
</script>

<style lang="less">
.user-info .weui-cells .weui-cell .weui-cell__ft {
    color: #333 !important;
}
</style>


<style lang="less" scoped>
   @import '../../user/index.less';
</style>