<template>
    <div class="personal">
        <div class="personal-header">
            <div class="head-portrait">
                <div @click="toPersonDetail">
                    <img src="@/images/job/2-0-1-2.png" alt="">
                </div>
                <p>贺镇东</p>
            </div>
            <div class="personal-msg">
                <div class="person-class vux-1px-r">
                    <span>
                        等级
                    </span>
                    <span>
                        lv1
                    </span>
                </div>
                <div class="person-integral">
                    <span>
                        积分
                    </span>
                    <span class="integral">
                        125
                    </span>
                </div>
            </div>
        </div>
        <group>
            <cell-box is-link :link='{name:"work"}'>
                <div class="img-kind">
                    <img src="@/images/personal/mine_main_dynamic@2x.png" alt="">
                </div>
                我的动态
            </cell-box>
            <cell-box is-link :link='{name:"inform"}'>
                <div class="img-kind">
                    <img src="@/images/personal/mine_main_message@2x.png" alt="">
                </div>
                消息中心
            </cell-box>
            <cell-box is-link :link='{name:"userInfo"}'>
               <div class="img-kind" >
                   <img src="@/images/personal/mine_main_userinfo@2x.png" alt="">
               </div>
                账户信息
            </cell-box>
        </group>
        <group>
            <cell title="自我介绍" :value="userInfo.user.userJobDeclaration">
                <img slot="icon" src="@/images/personal/mine_main_introduce@2x.png" class="img-kind">
            </cell>
            <cell title="业务专长">
                <img slot="icon" src="@/images/personal/mine_main_expertise@2x.png" class="img-kind">
            </cell>
            <cell title="电子邮箱" :value="userInfo.user.email">
                <img slot="icon" src="@/images/personal/mine_main_email@2x.png" class="img-kind">
            </cell>
            <cell title="手机" :value="userInfo.user.mobile">
                <img slot="icon" src="@/images/personal/mine_main_phone@2x.png" class="img-kind">
            </cell>
            <cell-box is-link :link='{path:"/page/job/company",query:{state1:1,state2:0,state3:0,state4:0,state5:1}}'>
               <div class="img-kind" >
                   <img src="@/images/personal/mine_main_about@2x.png" alt="">
               </div>
                关于我们
            </cell-box>
        </group>
    </div>    
</template>

<script>
import { XButton, Group, CellBox, Cell } from 'vux';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'personal',
    data() {
        return{
        }
    },
    created() {
    },
    methods: {
        ...mapActions({
            userInfoHand: 'userInfoHand',
            qywxHand: 'qywxHand',
        }),
        toPersonDetail(){
            this.$router.push({path:"personalDetail"})
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
        })       
    },
    watch: {
    },
    components: {
        Group, XButton, CellBox, Cell
    }
}
</script>

<style lang="less">
.personal .weui-cell:before {
    left: 44px;
}

.personal .weui-cells .weui-cell .weui-cell__ft {
    color: #333 !important;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>