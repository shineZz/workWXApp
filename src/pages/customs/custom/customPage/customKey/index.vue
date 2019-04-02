<template>
    <div class="customKey">
        <group>
            <cell title="拜访" :link="{path: 'sign', query: {key: 2, customerId: customerId,name:name,company:company, highSeas}}">
                {{list[0]?list[0].params.count:0}}次
                <img slot="icon" src="@/images/custom/customer/customKey/visit.png" class="img-kind">
            </cell>
        </group>
        <group>
            <cell title="合同" :link="{name: 'customContract', query: {id: customerId, contract: true, name, company, highSeas}}">
                {{list[1]?list[1].params.contract_count:0}}份
                <img slot="icon" src="@/images/custom/customer/customKey/contract.png" class="img-kind">
            </cell>
        </group>
        <group>
            <cell title="回款" :link="{name: 'customContract', query: {id: customerId, contract: false, name, company, highSeas}}">
                {{money(list[2]?list[2].params.total_amout:0.00)}}元
                <img slot="icon" src="@/images/custom/customer/customKey/money.png" class="img-kind">
            </cell>
        </group>
    </div>
</template>

<script>
import { Group, Cell, numberComma } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'customKey',
    data() {
        return {
            customerId: 0,
            highSeas: 1,         //是否公海客户
            name: '',
            company: '',
            list: [],
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
        }
    },
    created() {
        this.customerId = this.$route.query.id
        this.highSeas = this.$route.query.highSeas
        this.name = this.$route.query.name
        this.company = this.$route.query.company
        
        let obj = {
            company_id: this.companyId,
            user_id: this.userId,
            customer_id: this.customerId,
        }
        this.customer_getCustomerKeyContent(obj)
    },
    methods: {
        ...mapActions({
            customer_getCustomerKeyContent: 'customer/getCustomerKeyContent',
        }),
        // 千分符
        money(val) {
            return numberComma(val)
        },
    },
    computed: {
        ...mapState({
            getKeyContent: state => state.customer.getKeyContent,
        })
    },
    watch: {
        getKeyContent(data) {
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
                    this.list = data.items
                }
            }
        },
    },
    components: {
        Group,
        Cell,
    },
}
</script>

<style lang="less">
.customKey .weui-cells,.customKey .vux-no-group-title {
    border-radius: 10px;
}
.customKey .weui-cell {
    background: #fff;
}
.customKey .weui-cell__ft {
    color: #333;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
