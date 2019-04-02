<template>
<scroller  lock-x scrollbar-y>
    <div>
        <header class="progress-hd">
            <div>进度：{{data.dealer_audit_status==0?'全部':data.dealer_audit_status==1?'应标':data.dealer_audit_status==2?'合同 ':data.dealer_audit_status==3?'打款':data.dealer_audit_status==5?'收货':'结算'}}</div>
             <div>区域：所有省市</div>
        </header>
        <div class="progress-box">
            <div class=" vux-1px-b">
                <h5>经销商</h5>
                <dl>
                    <dt>名&nbsp&nbsp&nbsp&nbsp称：</dt>
                    <dd>{{data.dealerlist.dealer_name}}</dd>
                </dl>
                <dl>
                    <dt>地&nbsp&nbsp&nbsp&nbsp址：</dt>
                    <dd>{{data.dealerlist.dealer_address}}</dd>
                </dl>
                <dl>
                    <dt>经营区域：</dt>
                    <dd>{{data.dealerlist.dealer_scope_txt}}</dd>
                </dl>
                <dl>
                    <dt>主营行业：</dt>
                    <dd>{{data.dealerlist.dealer_main_industry}}</dd>
                </dl>
                <dl>
                    <dt>代理品牌：</dt>
                    <dd>{{data.dealerlist.dealer_brands}}</dd>
                </dl>
            </div>
            <div class=" vux-1px-b">
                <h5>业务员</h5>
                <dl>
                    <dt>姓&nbsp&nbsp&nbsp&nbsp名：</dt>
                    <dd>{{data.userInfo.user_name}}</dd>
                </dl>
                <dl>
                    <dt>电&nbsp&nbsp&nbsp&nbsp话：</dt>
                    <dd>{{data.userInfo.user_phone}}</dd>
                </dl>
                <dl>
                    <dt>职&nbsp&nbsp&nbsp&nbsp位：</dt>
                    <dd>{{data.userInfo.user_duty}}</dd>
                </dl>
                <dl>
                    <dt>公&nbsp&nbsp&nbsp&nbsp司：</dt>
                    <dd>{{data.userInfo.user_companyName}}</dd>
                </dl>
            </div>
            <div>
                <dl>
                    <dt>{{data.audit_status==4 || data.flow_audit_status==3?'驳&nbsp回&nbsp人':'操&nbsp作&nbsp人'}}：</dt>
                    <dd>{{data.reject.user_name}}</dd>
                </dl>
                <dl>
                    <dt>{{data.audit_status==4 || data.flow_audit_status==3?'驳回时间':'操作日期'}}：</dt>
                    <dd>{{data.reject.time}}</dd>
                </dl>
                <dl>
                    <dt>{{data.audit_status==4 || data.flow_audit_status==3?'驳回理由':'备&nbsp&nbsp&nbsp&nbsp注'}}：</dt>
                    <dd>{{data.reject.note}}</dd>
                </dl>
            </div>
            <footer v-if="data.audit_status==0 && data.flow_audit_status==2"><a  href="javascript:void(0)" @click="DetailsBtn(3)">中标</a><a href="javascript:void(0)" @click="DetailsBtn(11)">驳回</a></footer>
            
            
        </div>
    </div>
</scroller>
</template>

<script>
import { mapState,mapActions } from 'vuex'
import { Confirm,Scroller} from 'vux'
export default {
    name: 'PogressDetails',    
    data() {
        return {
            data:JSON.parse(localStorage.getItem('details')),
            status:'',
            user_id: this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
        }
    },
    computed: {
        ...mapState({
            winningRejectedData:state => state.merchants.winningRejectedData,  
        })       
    },
     watch: {
        winningRejectedData(data) {

                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                }else{
                    let status =  (this.status==3?2:1)
                    let obj ={
                        dealer:this.data.audit[status].dealer_audit_status,
                        task_id:this.data.task_id,
                    }
                    localStorage.setItem('progressOdbj',JSON.stringify(obj))
                    this.$router.go(-1)
                }
        },
     },
    methods: {
        ...mapActions({
            winningRejected: 'merchants/winningRejected',  
        }),
        DetailsBtn (status) {
            const _this = this
            this.status=status
            if(status==3){
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确定要中标吗？',                    
                    onConfirm () {
                        let obj={
                                tub_dealer_id:_this.data.tub_dealer_id,
                                company_id:_this.company_id,
                                status,
                                user_id:_this.user_id,
                        }
                        _this.winningRejected(obj)
                    }
                })

            }else{
                this.$vux.confirm.prompt('输入驳回理由', {
                    title: '请输入驳回理由',
                    onConfirm (msg) {
                        let obj={
                                tub_dealer_id:_this.data.tub_dealer_id,
                                company_id:_this.company_id,
                                status,
                                action_desc:msg,
                                user_id:_this.user_id,
                        }
                        _this.winningRejected(obj)
                    }
                })

            }
            
        }
    },
    components: {
        Confirm,Scroller
    },
}
</script>
<style lang="less" scoped >
 @import './index.less';
</style>
