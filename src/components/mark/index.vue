<template>
    <div class="cont-list-all">
        <div class="cont-list-more" v-if='type==1'>
            <p>任务LOGO：<span>建议使用正方形，大小不超过50KB的JPEG/PNG图片</span></p>
            <p>单次雇佣金：<span>佣金：1元=10金币</span></p>
            <p>单次奖励积分：<span>系统自动分配3积分</span></p>
            <p>平台单次服务佣金：<span>单次奖励佣金的20%</span></p>
            <p>总佣金：<span>任务总数X(单次奖励佣金+平台单次服务佣金)</span></p>
            <p>总积分：<span>任务总数x单次奖励积分</span></p>
            <p>优惠码：<span>可与小宝客服联系：索取优惠券码。联系电话：400-8813-609</span></p>
        </div>
        <div class="cont-list-more" v-if='type==2'>
            <p>任务LOGO：<span>建议使用正方形，大小不超过50KB的JPEG/PNG图片</span></p>
            <p>任务总数：<span>不少于100份</span></p>
            <p>单次雇佣金：<span>佣金：1元=10金币</span></p>
            <p>平台单次服务佣金：<span>单次奖励佣金的20%</span></p>
            <p>总佣金：<span>任务总数X(单次奖励佣金+平台单次服务佣金)</span></p>
            <p>优惠码：<span>可与小宝客服联系：索取优惠券码。联系电话：400-8813-609</span></p>
        </div>
        <div class="cont-list-more" v-if='type==3'>
            <p>1、自动签退：打开自动签退即自动完成拜访签退，和手动签退结果相同。</p>
            <p>2、规则：开始拜访时需打开自动签退开关。手机定位地址离开拜访地址2000米外则自动签退。</p>
            <p>3、权限：需允许使用手机永久定位权限。</p>
        </div>
        <div class="cont-list-more"  v-if='type==4'>        
            <p>1、开启定时启动，系统自动根据设定的时间启动/暂停任务；</p>
            <p>2、关闭定时启动，则用户需要手动启动/暂停任务；</p>
            <p>3、系统会在启动日期的该时段拨打电话，超出时段任务自动暂停。为避免打扰用户休息，每日20：00至次日9：00电话会自动延时拨打；</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'markMore',
    data() {
        return {   
        }
    },
    //type:2 猎客 1 推广 3签退 4：ai
    props:['type'],
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>