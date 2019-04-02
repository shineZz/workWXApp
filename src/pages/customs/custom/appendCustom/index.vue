<template>
    <div class="appendCustom">
        <group class="title">
            <cell title="名片扫描" inline-desc="使用手机摄像头扫描客户名片" is-link @click.native="UploadPic">
                <img slot="icon" src="@/images/custom/customer/appendCustom/scan.png" class="img-kind">
                <input style="display:none" id="task_log" name="file" type="file" accept="image/png,image/jpeg,image/gif" />
            </cell>
            <cell v-if="showOut" title="企业微信外部好友" inline-desc="从企业微信外部好友列表中导入客户" is-link @click.native="outHand">
                <img slot="icon" src="@/images/custom/customer/appendCustom/qywx.png" class="img-kind">
            </cell>
            <!-- <cell title="微信公众号" inline-desc="从企业的微信公众号中领取客户" is-link @click.native="out=true">
                <img slot="icon" src="@/images/custom/customer/appendCustom/gzh.png" class="img-kind">
            </cell> -->
            <cell title="创建一位新客户" inline-desc="手动输入客户信息" :link="{name: 'newCustom'}">
                <img slot="icon" src="@/images/custom/customer/appendCustom/hand.png" class="img-kind">
            </cell>
        </group>
    </div>
</template>

<script>
import { Group, Cell, TransferDom, Popup } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import lrz from 'lrz'

export default {
    name: 'appendCustom',
    data() {
        return {
            showOut: true,
            uploadData: {},
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
        }
    },
    created() {
        // 请求企业微信
        if (localStorage.getItem('phonePort') == 'qywx') {
            let obj_qywx = {
                crop_id: this.userInfo.wx_userDetail.corpid,
                url: location.href.split('#')[0]
            }
            this.$store.dispatch('qywxHand', obj_qywx)
        } else {
            this.showOut = false
        }
    },
    methods: {
        ...mapActions({
            card_getCCard: 'card/getCCard',
            customer_importWxExternalContact: 'customer/importWxExternalContact',
        }),
        //上传图片
        UploadPic(id,index,num){
            let _this=this
            $("#task_log").trigger("click").off('change').on('change', function (e) {
                let rFilter=/^(image\/jpg|image\/jpeg)$/i
                for (var files of this.files) {                       
                    if(!rFilter.test(files.type)){
                        _this.$vux.toast.show({
                            text: '对不起，不支持此文件类型。',
                            type: 'text',
                            position: 'top',
                            width:"18em"
                        })
                        return
                    }
                    lrz(files)
                    .then(function (rst) {
                        // _this.uploadData = {
                        //     src:rst.base64,
                        //     name:files.name,
                        // }
                        let obj = {
                            company_id: _this.companyId,
                            user_id: _this.userId,
                            data_stream: rst.base64
                        }
                        _this.card_getCCard(obj)
                    })
                    .catch(function (err) {
                        // 处理失败会执行
                        _this.$vux.toast.show({
                            text: '对不起，上传失败',
                            type: 'text',
                            position: 'top',
                            width:"18em"
                        })
                        return
                    })
                }
            })
        },
        outHand() {
            this.wx.invoke('selectExternalContact', {
                "filterType": 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
            }, res => {
                if(res.err_msg == "selectExternalContact:ok"){
                    let userIds  = res.userIds ; //返回此次选择的外部联系人userId列表，数组类型
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        crop_id: this.userInfo.wx_userDetail.corpid,
                        external_userids: JSON.stringify(userIds),
                    }
                    console.log(obj, 'userIds')
                    this.customer_importWxExternalContact(obj)
                }else {
                    if (res.err_msg.indexOf("permission") != -1) {
                        this.$vux.toast.show({
                            text: '请联系我们绑定企业ID',
                            type: 'text',
                            position: 'top',
                            width:"18em"      
                        })
                    }
                    console.log(res, 'userIdsERR')
                }
            });
        },
    },
    computed: {
        ...mapState({
            getCCard: state => state.card.getCCard,
            userInfo: state => state.userInfo,
            qywxData: state => state.qywxData,
            wx:state => state.wx,
            wxContact:state => state.customer.wxContact,
        })
    },
    watch: {
        //企业微信
        qywxData: function(data) {
            if(Object.keys(data).length > 0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"      
                    })
                }else{
                    this.wx.config({
                        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                        debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:this.userInfo.wx_userDetail.corpid, // 必填，企业微信的corpID
                        timestamp:data.items.timestamp , // 必填，生成签名的时间戳
                        nonceStr: data.items.noncestr, // 必填，生成签名的随机串
                        signature:data.items.signature,// 必填，签名，见附录1
                        jsApiList:['invoke']
                    })
                    // wx.ready(function(){                        
                    //     // wx.closeWindow();
                    // })
                    this.wx.error(res => {
                        this.$vux.toast.show({
                            text: '外部联系人接口请求失败，请退出重试',
                            type: 'text',
                            position: 'top',
                            width:"18em"      
                        })
                       localStorage.setItem('phonePort', 'weixin') 
                       phonePort='weixin';
                    });
                }
            }
        },
        getCCard(data) {
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
                    this.$router.push({name: 'newCustom', params: {cardObj: JSON.stringify(data)}})
                }
            }
        },
        wxContact(data) {
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
                    if (data.items.num) {
                        this.$vux.alert.show({
                            title: '外部联系人导入已完成',
                            content: `<P>${data.items.success_num?'成功导入客户'+data.items.success_num+'条':''}</P><P>${data.items.fail_num?'导入失败'+data.items.fail_num+'条':''}</P><P>${data.items.update_num?'待完善客户'+data.items.update_num+'条':''}</P>`, 
                            // onShow () {
                            //     console.log('Plugin: I\'m showing')
                            // },
                            onHide: () => {
                                this.$router.push({name: 'searchResult', query: {ifWrong: true}})
                            }
                        })
                    } else {
                        this.$router.push({name: 'newCustom', params: {userObj: JSON.stringify(data.items[0])}})
                    }
                }
            }
        },
    },
    beforeRouteLeave (to, from, next) {
        if (this.out) {
            this.out = false
            next(false)
        } else {
            next()
        }
    },
    directives: {
        TransferDom
    },
    components: {
        Group, Cell, Popup
    },
}
</script>

<style lang="less">
// .appendCustom .weui-cells,.appendCustom .vux-no-group-title {
//     margin-top: 0 !important;
// }

.appendCustom .title .weui-cell:before {
    left: 55px;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
