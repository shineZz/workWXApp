<template>
    <div class="customProperty">
        <!-- 阶段分组来源 -->
        <group class="title">
            <cell title="客户阶段：" :value="!ifShare&&!highSeas?stageValue.label?stageValue.label:'请选择客户阶段':stageValue.label" :is-link="!ifShare&&!highSeas" @click.native="checkHand('stage')" value-align="left" :class="{'has': stageValue.label}">
            </cell>
            <cell v-if="ifShare" title="跟进人：" :value="followName" value-align="left" :link="{name: 'companyDetail', query: {id: followId, noCall: true}}" :class="{'has': followName}">
            </cell>
            <cell title="分组：" :value="!ifShare&&!highSeas?groupValue.label?groupValue.label:'请选择分组':groupValue.label" :is-link="!ifShare&&!highSeas" @click.native="checkHand('group')" value-align="left" :class="{'has': groupValue.label}">
            </cell>
            <cell title="客户来源：" :value="!ifShare&&!highSeas?sourceValue.label?sourceValue.label:'请选择客户来源':sourceValue.label" :is-link="!ifShare&&!highSeas&&!sourceValue.label" @click.native="checkHand('source')" value-align="left" :class="{'has': sourceValue.label}">
            </cell>
        </group>
        <!-- 标签 -->
        <div class="label">
            <h4>标签</h4>
            <i class="edit" v-if="!ifShare&&!highSeas" @click="labels=true"></i>
            <div @click="labelMore=!labelMore" :class="labelMore?'fd-more':'fd'">
                <div v-if="labelValue.length>0" class="label-height">
                    <span v-for="(it, i) in labelValue" :key="i">{{it.name}}</span>
                </div>
                <i :class="['arrow',{'arrow-up': labelMore}]" v-show="labelArrow"></i>
            </div>
        </div>
        <!-- 共享关系 -->
        <div class="label" v-if="!highSeas">
            <h4>共享关系</h4>
            <i class="edit" v-if="!ifShare" @click="toggleTrue"></i>
            <div :class="shareMore?'container-more':'container'" @click="shareMore=!shareMore">
                <div class="share-height" v-if="relative.length>0">
                    <div v-for="(item, i) in relative" :key="i" class="box">
                        <aside v-if="item.img||item.headPortrait"><img :src="item.img||item.headPortrait" :alt="item.name" :onerror="logo"></aside>
                        <aside v-else :class="'c-'+item.color"><span v-html="NameHand(item.name, item)" :class="item.logoNameFlag?'wk':''" /></aside>
                        <p :class="item.logoNameFlag?'mp':''">{{item.name}}</p>
                    </div>
                    <i :class="['arrow',{'arrow-up': shareMore}]" v-show="shareArrow"></i>
                </div>
            </div>
        </div>
        <!-- popup -->
        <div v-transfer-dom v-if="!highSeas">
            <!-- 阶段 -->
            <popup v-model="stage" width="100%" position="right" v-if="stage">
                <div class="popup">
                    <checkers :checkValue="[stageValue.value]" show="stage" :save="true" @toggle="togglePop"/>
                </div>
            </popup>
            <!-- 分组 -->
            <popup v-model="group" width="100%" position="right" v-if="group">
                <div class="popup">
                    <checkers :checkValue="[groupValue.value]" show="group" :save="true" @toggle="togglePop"/>
                </div>
            </popup>
            <!-- 来源 -->
            <popup v-model="source" width="100%" position="right" v-if="source">
                <div class="popup">
                    <checkers :checkValue="[sourceValue.value]" show="source" :save="true" @toggle="togglePop"/>
                </div>
            </popup>
            <!-- 标签 -->
            <popup v-model="labels" width="100%" position="right" v-if="labels">
                <div class="popup">
                    <labelPage :checkValue="labelValue" propState="1" @toggleLabel="togglePop" />
                </div>
            </popup>
            <!-- 客户 -->
            <popup v-model="customer" width="100%" position="right" v-if="customer">
                <div class="popup">
                    <customer @toggleCustomer="togglePop" propsState="2" :btn='true' />
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import { Group, Cell, XButton, TransferDom, Popup, Checklist } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { len, objDeepCopy } from '@/util'
import labelPage from '@/components/labels'
import checkers from '@/components/checkers'
import customer from '@/components/customer'

export default {
    name: 'customProperty',
    data() {
        return {
            ifShare: 1,
            highSeas: 1,         //是否公海客户
            customerId: 0,
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,       //加载失败图片
            // 阶段分组来源
            followId: '',
            followName: '',
            stage: false,
            stageValue: {label: '', value: ''},
            group: false,
            groupValue: {label: '', value: ''},
            source: false,
            sourceValue: {label: '', value: ''},
            // 标签
            labelArrow: false,
            labels: false,
            labelMore: false,
            labelValue: [],
            // 共享关系
            shareArrow: false,
            customer: false,
            shareMore: false,
            relative: [],
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            hintType:'',
            shareArr:[]
        }
    },
    created() {
        this.customerId = this.$route.query.id
        this.highSeas = this.$route.query.highSeas
        let obj = {
            company_id: this.companyId,
            user_id: this.userId,
            customer_id: this.customerId
        }
        this.customer_getCustomerProperty(obj)
    },
    // mounted() {
    //     this.$nextTick(()=>{
    //         if ($('.label-height').height() > 74) {
    //             this.labelArrow = true
    //         }
    //         if ($('.share-height').height() > 210) {
    //             this.shareArrow = true
    //         }
    //     })
    // },
    updated() {
        this.$nextTick(()=>{
            if ($('.label-height').height() > 74) {
                this.labelArrow = true
            } else {
                this.labelArrow = false
            }
            if (this.relative.length>12) {
                this.shareArrow = true
            } else {
                this.shareArrow = false
            }
            // if ($('.share-height').height() > 210) {
            //     this.shareArrow = true
            // }
        })
    },
    methods: {
        ...mapActions({
            customer_getCustomerProperty: 'customer/getCustomerProperty',
            customer_updateCustomerStage: 'customer/updateCustomerStage',
            customer_updateCustomerSegment: 'customer/updateCustomerSegment',
            customer_updateCustomerSource: 'customer/updateCustomerSource',
            customer_updateCustomerLabel: 'customer/updateCustomerLabel',
            customer_updateCustomerShare: 'customer/updateCustomerShare',
        }),
        ...mapMutations({
            ShareCustom:'user/SHARECUSTOM',
            ResultChoice:'user/RESULTCHOICE'
        }),
        // 来源不能更改
        checkHand(val) {
            if (this.ifShare||this.highSeas) {
                return
            }
            if (val==='source'&&this.sourceValue.label) {
                return
            }
            this[val] = true
        },
        toggleTrue(){
            this.customer=true;
            console.log(this.shareArr,'||||||')
            this.ResultChoice(this.shareArr)
        },
        // popup
        togglePop(obj) {
            if (this.stage) {
                if (this.stageValue.value !== obj.value) {
                    this.stageValue = obj
                    let obj1 = {
                        customer_id: this.customerId,
                        company_id: this.companyId,
                        user_id: this.userId,
                        stage_id: this.stageValue.value,
                    }
                    this.customer_updateCustomerStage(obj1)
                }
                return
            }
            if (this.group) {
                if (this.groupValue.value !== obj.value) {
                    this.groupValue = obj
                    let obj1 = {
                        customer_ids: this.customerId,
                        company_id: this.companyId,
                        user_id: this.userId,
                        segment_id: this.groupValue.value,
                    }
                    this.customer_updateCustomerSegment(obj1)
                }
                return
            }
            if (this.source) {
                if (this.sourceValue.value !== obj.value) {
                    this.sourceValue = obj
                    let obj1 = {
                        customer_id: this.customerId,
                        company_id: this.companyId,
                        user_id: this.userId,
                        source_id: this.sourceValue.value,
                    }
                    this.customer_updateCustomerSource(obj1)
                }
                return
            }
            if (this.labels) {
                this.labelValue = obj
                let obj1 = {
                    customer_id: this.customerId,
                    company_id: this.companyId,
                    user_id: this.userId,
                    label_ids: this.labelValue.map(v=>v.id).join(),
                }
                this.customer_updateCustomerLabel(obj1)
                return
            }
            if (this.customer) {
                this.relative = obj.length>0?objDeepCopy(obj):[]
                let index = this.relative.findIndex(v=>v.userId === this.userId)
                if (index !== -1) {
                    this.relative.splice(index, 1)
                }
                let obj1 = {
                    customer_id: this.customerId,
                    company_id: this.companyId,
                    user_id: this.userId,
                    share_users: JSON.stringify(this.relative.map(v=>{
                        return {
                            user_id: v.userId,
                            user_name: v.name
                        }
                    })),
                }
                this.customer_updateCustomerShare(obj1)
                this.shareArr = obj.length>0?objDeepCopy(obj):[]
                return
            }
        },
        // 头像方法
        NameHand(name, obj){
            var zh_reg = /^[\u4e00-\u9fa5]+$/;
            let text=name;
            if (!zh_reg.test(text.substr(0,1))) {
                let nameA=text.length>5?text.substring(0,5):text;
                if(nameA.length<3){
                    return nameA;
                }else{
                    if((nameA.length==4 && len(text)==4 )|| (nameA.length==5 && len(text)==5 )  ){
                        return nameA;
                    }else if(len(text)>4){
                        let html=nameA.substring(0,2)+'</br>'+nameA.substring(2);
                        obj.logoNameFlag=true;                        
                        return html;
                    }else{
                        return nameA;
                    }
                }
            }else{
                if(text.length>3 && text.length<6){
                    let html=text.substring(0,2)+'</br>'+text.substring(2);
                    obj.logoNameFlag=true;  
                    return html;
                }else if(text.length>5){
                    let html=text.substring(0,2)+'</br>'+text.substring(2,5);
                    obj.logoNameFlag=true;  
                    return html;
                }else{
                    return text;
                }
                
            }
            
        },
    },
    computed: {
        ...mapState({
            getProperty: state => state.customer.getProperty,
            updateStage: state => state.customer.updateStage,
            updateSegment: state => state.customer.updateSegment,
            updateSource: state => state.customer.updateSource,
            updatelabel: state => state.customer.updatelabel,
            updateShare: state => state.customer.updateShare,
        })
    },
    watch: {
        getProperty(data) {
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
                    this.customerId = this.$route.query.id
                    let item = data.items
                    this.ifShare = item.is_share
                    this.followId = item.user_id
                    this.followName = item.user_name
                    this.stageValue = {label: item.stage_name, value: item.stage_id}
                    this.groupValue = {label: item.segment_name, value: item.segment_id}
                    this.sourceValue = {label: item.source_name, value: item.source_id}
                    this.labelValue = item.label_rlt.map(item => {
                        return {
                            id: item.label_id,
                            name: item.name,
                        }
                    })
                    this.relative = item.share_user_rlt.map(item => {
                        return {
                            name: item.true_name,
                            img: item.head_logo,
                            color: parseInt(Math.random()*3+1),
                            logoNameFlag: false,
                            id: item.user_id,
                        }
                    })
                    let _share = data.items.share_user_rlt
                    _share.forEach(function(item){
                        item.headPortrait =item. head_logo
                        item.userId=item.user_id
                        item.name=item.true_name
                        item.color=parseInt(Math.random()*3+1)
                    })
                    this.shareArr = JSON.parse(JSON.stringify(_share))
                    this.ResultChoice(JSON.parse(JSON.stringify(_share)))
                }
            }
        },
        updateStage(data) {
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
                    this.stage = false
                }
            }
        },
        updateSegment(data) {
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
                    this.group = false
                }
            }
        },
        updateSource(data) {
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
                    this.source = false
                }
            }
        },
        updatelabel(data) {
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
                    this.labels = false
                }
            }
        },
        updateShare(data) {
            console.log(data,'?????')
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
                    // this.$nextTick(() => {
                    //     if ($('.share-height').height() > 210) {
                    //         console.log($('.share-height').height(), '87878')
                    //         this.shareArrow = true
                    //     } else {
                    //         this.shareArrow = false
                    //     }
                    // })
                    this.customer = false
                }
            }
        },
    },
    directives: {
        TransferDom
    },
    components: {
        Group,
        Cell,
        XButton,
        Popup,
        Checklist,
        labelPage,
        checkers,
        customer
    },
}
</script>

<style lang="less">
.customProperty .weui-cells,.customProperty .vux-no-group-title {
    margin-top: 0 !important;

    &::before {
        border: none;
    }
}

.customProperty .weui-label,.customProperty .vux-label,.customProperty .vux-datetime p {
    width: 5em !important;
}

.customProperty .has input:disabled,.customProperty .has input[disabled],.customProperty .has textarea:disabled,.customProperty .has.weui-cell .weui-cell__ft {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;

    .weui-icon-clear {
        color: #B2B2B2;
        -webkit-text-fill-color: #B2B2B2;
    }
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
