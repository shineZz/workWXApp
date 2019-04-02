<template>
    <div class="talent">
        <!-- 顶部导航 -->
        <div class='top-tab'>
            <!-- 次级导航 -->
            <tab class="fixed-tab" :line-width="0" v-show="!searchShow">
                <tab-item class="vux-1px-r" selected @click.native="lastHand">
                    最新
                    <icon type="waiting-circle" class="icon-wait"></icon>
                </tab-item>
                <tab-item @click.native="handleSearchShow">
                    搜索
                    <icon type="search"></icon>
                </tab-item>
            </tab>
            <!-- 搜索框 -->
            <search ref="search" v-model="searchValue" :auto-fixed="false" @on-focus="focusHand" @on-blur="blurHand"
            v-show="searchShow" @on-submit="onSubmit" @on-cancel="handleSearchShow" 
            placeholder="请输入搜索内容" />
            <!-- <popup v-model="searchShow" height='100%'>
                <div class="popup">
                    <group>
                        <search :auto-fixed="false" placeholder="请输入搜索内容"></search>
                        筛选条件
                    </group>
                </div>
            </popup> -->
        </div>
        <!-- 简历列表 -->
        <resumeList ref="child" :showHeight="showTab"/>
        <tabbar class="tabbar-top" v-show="showTab">
            <tabbar-item :selected="pageType==='resumeList'" @on-item-click="handleChangeType('resumeList')">
                <span slot="icon" class="icon icon-resumeList"></span>
                <span slot="label">人才中心</span>
            </tabbar-item>
            <tabbar-item :selected="pageType==='myTalentList'" @on-item-click="handleChangeType('myTalentList')">
                <span slot="icon" class="icon icon-myTalentList"></span>
                <span slot="label">我的人才</span>
            </tabbar-item>
            <tabbar-item :selected="pageType==='wishList'" @on-item-click="handleChangeType('wishList')">
                <span slot="icon" class="icon icon-wishList"></span>
                <span slot="label">意愿清单</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem, Tab, TabItem, Icon, Search, Popup, Group } from 'vux'
import resumeList from './resumeList'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'talentList',
    data() {
        return {
            showTab: true,
            searchShow: false,  //搜索框显示
            searchValue:''      //搜索内容参数
        }
    },
    created() {
        this.SEARCH_VALUE(this.searchValue)
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
        }),
        // 最新
        lastHand() {
            this.$refs.child.refresh()
        },
        //监听搜索内容
        handleChangeType(type) {
            this.searchShow = false
            this.searchValue = ''
            this.SEARCH_VALUE(this.searchValue)
            this.CHANGE_PAGETYPE(type)
            localStorage.setItem("pageType",JSON.stringify(this.pageType))
        },
        //上传搜索内容
        onSubmit() {
            this.SEARCH_VALUE(this.searchValue)
            // this.searchShow = false
            // this.searchValue = ''
            this.$refs.search.setBlur()
        },
        //切换搜索框显示隐藏
        handleSearchShow() {
            this.searchShow = !this.searchShow
            if (this.searchShow) {
                this.$nextTick(()=>{
                    this.$refs.search.setFocus()
                })
            } else {
                this.searchValue = ''
                this.SEARCH_VALUE(this.searchValue)
            }
        },
        focusHand() {
            this.showTab = false
        },
        blurHand() {
            this.showTab = true
        },
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
        })
    },
    components: {
        Tabbar,
        TabbarItem,
        Tab,
        TabItem,
        Icon,
        Search,
        Popup,
        Group,
        resumeList,
        // wishList,
        // myTalentList
    },
}
</script>

<style lang="less">
.talent .weui-search-bar.weui-search-bar_focusing .weui-search-bar__cancel-btn {
    font-size: 14px;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
