<template>
    <div class="search">
        <!-- 搜索框 -->
        <search ref="searchK" :auto-fixed="false" placeholder="请输入姓名、电话、邮箱、公司名称" v-model="searchValue"
         @on-change="changeHand" @on-submit="searchHand" @on-cancel="cancelHand" />
        <!-- 历史记录 -->
        <div v-if="!searchFlag">
            <group>
                <group-title slot="title">历史记录<i class="delete" @click="deleteHistory"></i></group-title>
            </group>
            <div class="history" v-show="history.length>0">
                <span v-for="(item, index) in history" :key="index" @click="searchHistory(item.name, index)">{{item.name}}</span>
            </div>
        </div>
        <!-- 搜索结果 -->
        <div v-else class="result">
            <group title="客户" v-show="listObj1.listData.length>0">
                <listA :listObj="listObj1"/>
                <x-button :link="{name: 'searchResult', query: {ifCustom: true, keyword: searchValue}}" v-show="has_more1"><p class="more">查看更多</p></x-button>
            </group>
            <group title="同事" v-show="listObj2.listData.length>0">
                <listA :listObj="listObj2"/>
                <x-button :link="{name: 'searchResult', query: {keyword: searchValue}}" v-show="has_more2"><p class="more">查看更多</p></x-button>
            </group>
            <!-- 无数据页面 -->
            <div class='wu-all wu-allB' v-show="listObj1.listData.length===0&&listObj2.listData.length===0">
                <section>
                    <div><img src="~@/images/wu-icon1.png"></div>
                    <p>{{isLoading?alert_msg:'根据你的搜索条件未找到匹配的结果，请更换搜索条件'}}</p>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import { trim, Search, Group, GroupTitle, XButton } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy } from '@/util'
import listA from '@/components/listA'

export default {
    name: 'searchPage', 
    data() {
        return {
            searchFlag: false,
            searchValue: '',
            history: [],
            alert_msg: '加载中...',
            has_more1: false,
            listObj1: {listData:[]},
            has_more2: false,
            listObj2: {listData:[]},
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            page: 1,
            count: 3,
            type: '',
        }
    },
    created() {
    },
    methods: {
        ...mapActions({
            customer_getCustomerSearchKeywordList: 'customer/getCustomerSearchKeywordList',
            customer_deleteCustomerSearchKeyword: 'customer/deleteCustomerSearchKeyword',
            customer_customerWorkerList: 'customer/customerWorkerList',
        }),
        ...mapMutations({
            UPDATE_LOADING: 'UPDATE_LOADING',
        }),
        // 删除搜索记录
        deleteHistory() {
            if (this.history.length===0) {
                return
            }
            this.$vux.confirm.show({
                content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                            <p style="margin-top: 10px;">确定删除全部历史记录?</p>`,
                onConfirm: ()=>{
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                    }
                    this.customer_deleteCustomerSearchKeyword(obj)
                }
            })
        },
        // 点击搜索记录搜索
        searchHistory(val, index) {
            this.searchValue = val
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                keywords: this.searchValue,
                page: this.page,
                count: this.count,
            }
            this.searchFlag = true
            this.customer_customerWorkerList(obj)
            this.history.splice(index, 1)
            this.history.unshift({name: this.searchValue})
            localStorage.setItem('history', JSON.stringify(this.history))
        },
        // 输入搜索
        searchHand(val) {
            if (!this.searchValue) {
                return
            }
            this.searchValue = trim(this.searchValue)
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                keywords: this.searchValue,
                // page: this.page,
                // count: this.count,
            }
            this.searchFlag = true
            this.customer_customerWorkerList(obj)
            this.$refs.searchK.setBlur()
            let index = this.history.findIndex(v => v.name===this.searchValue)
            if (index !== -1) {
                this.history.splice(index, 1)
            }
            this.history.unshift({name: this.searchValue})
            this.history = this.history.slice(0, 10)
            localStorage.setItem('history', JSON.stringify(this.history))
        },
        changeHand(val) {
            if (!val) {
                this.searchFlag = false
                this.listObj1.listData = []
                this.listObj2.listData = []
            } else {
                if (val.length>50) {
                    val = val.substring(0, 50)
                }
                this.searchValue = this.$refs.searchK.currentValue = val
            }
        },
        // 取消搜索
        cancelHand() {
            let _this = this
            setTimeout(function(){
                _this.$router.back()
            },300)
            
        },
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            searchKeyword: state => state.customer.searchKeyword,
            delSearchKeyword: state => state.customer.delSearchKeyword,
            workList: state => state.customer.workList,
        })
    },
    watch: {
        searchKeyword(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.history = data.items
                    localStorage.setItem('history', JSON.stringify(this.history))
                }
            }
        },
        delSearchKeyword(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.history = []
                    localStorage.removeItem('history')
                }
            }
        },
        workList(data) {
            if (this.$route.name !== 'searchPage') {
                return
            }
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    // 客户
                    this.has_more1 = data.items.customer.has_more
                    let arr1 = data.items.customer.items.map(item => {
                        let obj = {
                            name: item.customer_name,
                            img: item.logo_big,
                            work: item.customer_company_name,
                            label: [],
                            id: item.id,
                            tel: '',
                            state: '',
                            time: '',
                            userId: item.user_id,
                        }
                        obj.url = {
                            link: 'customPage',
                            query: {id: item.id, logo: item.logo_big, name: item.customer_name, company: item.customer_company_name,
                            mobile: '+' + item.mobile_code + ' ' + item.mobile},
                        }
                        if (item.user_id!=this.userId) {
                            obj.url.query.share = true
                        }
                        obj.logoNameFlag = false
                        obj.color = parseInt(Math.random()*3+1)
                        return obj
                    })
                    this.listObj1.listData = arr1
                    // 同事
                    this.has_more2 = data.items.worker.has_more
                    let arr2 = data.items.worker.items.map(item => {
                        let obj = {
                            name: item.userName,
                            img: item.headPortrait,
                            work: item.entName,
                            label: [],
                            id: item.userId,
                            tel: item.mobile,
                            state: '',
                            time: '',
                            userId: item.userId,
                        }
                        obj.url = {
                            link: 'companyDetail',
                            query: {id: item.userId, noCall: true},
                        }
                        obj.logoNameFlag = false
                        obj.color = parseInt(Math.random()*3+1)
                        return obj
                    })
                    this.listObj2.listData = arr2
                }
            }
        },
    },
    beforeRouteEnter (to, from, next) {
        if (from.name === 'customs'||from.name === null) {
            next(vm => {
                vm.searchFlag = false
                vm.searchValue = ''
                vm.history = localStorage.getItem('history')
                if (!vm.history) {
                    vm.history = []
                    let obj = {
                        company_id: vm.companyId,
                        user_id: vm.userId,
                    }
                    vm.customer_getCustomerSearchKeywordList(obj)
                } else {
                    // vm.UPDATE_LOADING(true)
                    vm.history = JSON.parse(vm.history)
                }
                vm.$nextTick(()=>{
                    setTimeout(()=>{
                        vm.$refs.searchK.setFocus()
                        // vm.UPDATE_LOADING(false)
                    }, 800)
                })
            })
        } else {
            next(vm => {
                vm.searchFlag = true
                vm.searchValue = vm.history[0].name
            })
        }
    },
    components: {
        Search,
        Group,
        GroupTitle,
        XButton,
        listA
    },
}
</script>

<style lang="less">
// .search .weui-search-bar__label {
//     display: none;
// }
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
