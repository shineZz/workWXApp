<template>
    <div id="customDetail">
        <div class="swiper-header">
            <p>hello world</p>
        </div>
        <card>
            <div slot="content" class="card-demo-flex card-demo-content01">
                <div class="vux-1px-r" @click="routerTo(1)">
                    <span>1130</span>
                    <br/>
                    商机
                </div>
                <div class="vux-1px-r" @click="routerTo(2)">
                    <span>15</span>
                    <br/>
                    拜访计划
                </div>
                <div class="vux-1px-r" @click="routerTo(3)">
                    <span>0</span>
                    <br/>
                    拜访记录
                </div>
                <div class="vux-1px-r" @click="routerTo(4)">
                    <span>88</span>
                    <br/>
                    合同
                </div>
                <div @click="routerTo(5)">
                    <span>88</span>
                    <br/>
                    回款
                </div>
            </div>
        </card>
        <div class="search-range">
            <span class="search-range-left" :class="customAll ? 'search-range-active' : ''" @click="customChangeRange(1)">
                跟进记录
            </span>
            <span class="search-range-right" :class="!customAll ? 'search-range-active' : ''" @click="customChangeRange(0)">
                详情资料
            </span>
        </div>
        <div class="follow-record" v-if="customAll">
            
            <dl class="follow-detail-list">
                <scroller 
                    lock-x 
                    :scrollbarY=false
                    height="-300"
                    >
                    <div>
                        <dl class="follow-detail-list">
                            <dt class="date-day">05月09日</dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                        </dl>
                        <dl>
                            <dt class="date-day">05月09日</dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                        </dl>
                        <dl class="follow-detail-list">
                            <dt class="date-day">05月09日</dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                        </dl>
                        <dl>
                            <dt class="date-day">05月09日</dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                            <dt>
                                <ul>
                                    <li class="logo-img">
                                        <span>|</span>
                                        <span class="center-img"><img src="@/images/job/money.png" alt=""></span>
                                        <span>|</span>
                                    </li>
                                    <li class="follow-name">贺镇东</li>
                                    <li class="follow-form">新增拜访记录</li>
                                    <li class="follow-content">新增的内容阿萨达是大所大所阿萨德</li>
                                    <li class="follow-date">10:10</li>
                                </ul>
                            </dt>
                        </dl>
                    </div>
                </scroller>
                
            </dl>
            
        </div>
        <x-button type="primary" v-if="customAll" @click.native="toLinkMan">联系人</x-button>
        <div class="msg-detail" v-if="!customAll">
            <div class="general-msg">
                <div class="custom-img">
                    <img src='./timg.jpg' alt="">
                </div>
                <div>
                    <p class="custom-name">你好</p>
                    <p class="custom-phone">
                        电话：17191073719
                    </p>
                    <p class="custom-address">
                        地址：山东
                    </p>
                    <p class="custom-industry">
                        行业：软件
                    </p>
                </div>
            </div>
            <div class="update-custom-msg-btn-box">
                <x-button type="primary"  @click="addVisitingRecord">修改客户详情</x-button>
           
            </div>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,XButton,  CellBox, Cell ,Scroller ,Group,Card   } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'customDetail',
    data() {
        return {
            customAll:true
        }
    },
    created() {
    },
    mounted() {
        console.log(this.$route.params.id,'-=-=-=')
    },
    methods: {
        customChangeRange(flag){
            if(flag){
                this.customAll=true
            }else{
                this.customAll=false
            }
        },
        toLinkMan(){
            // state1=0&state2=4&state3=0&person=0
            // /page/job/company?state1=0&state2=2&state3=0&person=0
            this.$router.push({path:"/page/linkDetail",query:{state1:0,state2:4,state3:0,person:0}})
        },
        routerTo(state){
            console.log(state)
            if(state==1){
                this.$router.push('/page/businessChance')
            }else if(state==2){
                this.$router.push('/page/visitingPlan')
            }else if(state==3){
                this.$router.push('/page/visitingRecord')
            }else if(state==4){
                this.$router.push('/page/contract')
            }else if(state==5){
                this.$router.push('/page/returnedMoney')
            }
        },
        addVisitingRecord(){

        }
    },
    computed: {
    },
    watch: {
    },
    components: {
        CellBox,
        Group,
        Cell,
        Card,
        XButton,
        Scroller,
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
