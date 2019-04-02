<template>
    <div class="companyDetail">
        <div class="custom-header">
            <div class="custom-header-img">
                <img :src="userdata.headPortrait" alt="">
            </div>
            <div class="cutom-msg">
                <p class="custom-name">{{userdata.userName}}</p>
                <p class="custom-phone">{{userdata.mobile}}</p>
            </div>
        </div>
        <card>
            <div slot="content" class="card-demo-flex card-demo-content01">
                <div class="vux-1px-r">
                <span>LV{{userdata.userLevel}}</span>
                <br/>
                等级
                </div>
                <div class="vux-1px-r">
                <span>{{userdata.integral}}</span>
                <br/>
                积分
                </div>
                <div class="vux-1px-r">
                <span>0</span>
                <br/>
                经验值
                </div>
            </div>
        </card>
        <group>
            <cell title="地区"></cell>
            <cell title="个性签名"></cell>
            <cell title="来源" value-align="left"><span>{{userdata.deptName}}</span></cell>
        </group>
        <div class="chat-btn-box" v-if="callFlag">
            <button class="chat-btn">电&nbsp;&nbsp;聊</button>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Cell ,Group,Search,Card   } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'customDetaul',
    data() {
        return {
           user_id:this.$store.state.userInfo.user.userId,
           company_id:this.$store.state.userInfo.company.companyId,
           userdata:{
               headPortrait:'http://dev-xsimages.51lick.cn:18880/static/images/icon/xsdefult.jpg',
               userLevel:'0',
               integral:"0",

           },
           callFlag:true,
        }
    },
    created() {
        this.initUserDetail()
        let _this = this
        if(typeof(_this.$route.query.noCall)=='undefined'){
            this.callFlag = true
        }else{
            this.callFlag = false
        }
    },
    mounted() {
        
    },
    methods: {
        ...mapActions({
            GETUserDetail:"addressBook/GetUserDetail"
        }),
        initUserDetail(){
            console.log(this.$route.query.id)
            let obj = {
                userId:this.$route.query.id,
                companyId:this.company_id,
            }
            this.GETUserDetail(obj)
        }
    },
    computed: {
        ...mapState({
            userDetail:state => state.addressBook.userDetail
        })
    },
    watch: {
        userDetail:function(newVal){
            console.log(newVal,'===================')
            if(newVal.alert_msg){
                this.$vux.toast.show({
                        text: newVal.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
            }else{
                this.userdata = newVal.items
            }
            
        }
    },
    components: {
        CellBox,
        Group,
        Cell,
        Search,
        Card,
    },
}
</script>
<style lang="less">
    .companyDetail{
        .weui-panel:before{
            border:none;
        }
        .weui-panel:after{
            border:none;
        }
        .card-demo-content01{
            padding:0 !important;
        }
        .weui-cells{
            margin-top:0; 
        }
         .weui-cell__ft{
             span{
                 display: inline-block;
                 margin-left: 15px;
             }
         }
    }
</style>

<style lang="less" scoped>
 @import './index.less';
 .card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  padding: 10px 0;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.card-demo-flex span {
  color: #199ed8;
}
</style>
