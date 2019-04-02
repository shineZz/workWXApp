<template>
    <div class="job" id="job">
        <group>

            <cell-box is-link :link='{path:"/page/inform"}'>
                <div class="img-kind">
                    <img src="@/images/job/2-0-1-1.png" alt="">
                </div>
                通知
            </cell-box>
            <cell-box is-link :link='{path:"/page/work"}'>
                <div class="img-kind">
                    <img src="@/images/job/2-0-1-2.png" alt="">
                </div>
                工作圈
            </cell-box>
        </group>
        <group>
            <cell-box is-link :link='{path:"/page/job/company",query:{state1:1,state2:0,state3:0,state4:0,state5:1}}'>
               <div class="img-kind" >
                   <img src="@/images/job/2-0-1-8.png" alt="">
               </div>
                    企业通讯录
            </cell-box>
            <!-- <cell-box is-link :link='{path:"/page/job/company",query:{state1:0,state2:2,state3:0,person:0}}'>
                <div class="img-kind" >
                    <img src="@/images/job/2-0-1-9.png" alt="">
                </div>
                    客户通讯录
            </cell-box> -->
            <cell-box is-link :link='{path:"wodkChild",query:{child:1}}'>
                <div class="img-kind" >
                    <img src="@/images/job/work.png" alt="">
                </div>
                    工作报告
            </cell-box>
            <cell-box is-link :link='{path:"wodkChild",query:{child:3}}'>
                <div class="img-kind">
                    <img src="@/images/job/2-0-1-10.png" alt="">
                </div>
                    签到考勤
            </cell-box>
        </group>
        <group>
            <cell-box is-link :link='{path:"wodkChild",query:{child:2}}'>
               <div class="img-kind">
                   <img src="@/images/job/2-0-1-12.png" alt="">
               </div>
                    工作审批
            </cell-box>
            
        </group>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Calendar,Group   } from 'vux'
import { mapState, mapActions } from 'vuex'


export default {
    name: 'job',
    data() {
        return {
        }
    },
    components: {
        CellBox,
        Calendar,
        Group
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
