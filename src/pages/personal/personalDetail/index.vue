<template>
    <div class="personalDetail">
        <div v-if="!isMsgEdit" style="overflow:hidden">
            <group>
                <cell title="我的头像" is-link class="warpCell">
                    <img class="my-portrait" src='@/images/job/2-0-1-10.png'/>
                    
                </cell>
                <cell title="真实姓名" v-model="trueName" is-link :link='{path:"/page/msgEdit",query:{state:1,id:0,val:trueName}}'>
                    
                </cell>
                <cell title="邀请码" >
                    
                </cell>
                <popup-picker title="性别" :columns="1" :data="list1" v-model="value1" show-name @on-change="sexChange" ></popup-picker>
                <cell title="手机号">
                    
                </cell>
                <cell title="行业/方向" is-link>
                    
                </cell>
                <cell title="公司名称">
                    
                </cell>
                <!-- <cell is-link :link='{path:"/page/job/company",query:{state1:1,state2:0,state3:0,state4:0,state5:1}}'>
                
                </cell> -->
                <cell title="职位名称">
                    
                </cell>
            </group>
            <group>
                <cell class="warpCell" title="自我介绍" is-link value="你好你年还是都我暗色调是的及哦啊是的赛欧的表达式打卡机是" :link='{path:"msgEdit",query:{state:3,id:11}}'>
                    
                </cell>
                <cell title="工作经历" is-link :link='{path:"/page/msgEdit",query:{state:2,id:10}}'>
                    
                </cell>
                <cell title="教育经历" is-link :link='{path:"/page/msgEdit",query:{state:2,id:11}}'>
                    
                </cell>
            </group>
            <group>
                <cell class="warpCell" title="工作地点" is-link value="你好你年还是都我暗色调是的及哦啊是的赛欧的表达式打卡机是" :link='{path:"/page/msgEdit",query:{state:1,id:4,val:"你好你年还是都我暗色调是的及哦啊是的赛欧的表达式打卡机是"}}'>
                    
                </cell>
                <cell title="邮箱" is-link v-model="email" :link='{path:"/page/msgEdit",query:{state:1,id:1,val:email}}'>
                    
                </cell>
                <cell title="微信" is-link v-model="wx" :link='{path:"/page/msgEdit",query:{state:1,id:2,val:wx}}'>
                    
                </cell>
                <cell title="QQ" is-link v-model="qq" :link='{path:"/page/msgEdit",query:{state:1,id:3,val:qq}}'>
                    
                </cell>
            </group>
        </div>
    </div>    
</template>

<script>
import { XButton, Group , Cell , PopupPicker ,} from 'vux';
import { mapState, mapActions, mapMutations } from 'vuex';
import MsgEdit from '../msgEdit'
export default {
    name: 'personalDetail',
    data() {
        return{
            value1: ['1'],
            list1: [{
                name:"男",
                value:"1",
                parent:0
            },{
                name:"女",
                value:"0",
                parent:0
            }],
            trueName:'trueName',
            wx:'dasd',
            qq:'asda',
            email:'12asdasd3',
            workplace:'1asdasd23',
            isMsgEdit:false
        }
    },
    created() {
    },
    methods: {
        ...mapActions({
        }),
        ...mapMutations({
            UserChange:'user/USERCHANGE'
        }),
        sexChange(data){
            console.log(data)
        },
        toMsgEdit(state,id,val){
            console.log(id,val,'-------返回之后的----------------')
            let obj = {
                id:id,
                value:val
            }
            this.UserChange(obj)
            this.$router.push({path:"msgEdit",query:{state:state,id:id,val:val}})
        },
        toggleEdit(state,id,val){
             let obj = {
                id:id,
                value:val
            }
            this.UserChange(obj)
            this.isMsgEdit = !this.isMsgEdit
        },
        toggleMsgEdit(id,value){
            console.log(id,value,'===========')
            this.val3 = id
            this.val4 = value
            this.isMsgEdit = !this.isMsgEdit
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            storeWx: state => state.user.storeWx,
            storeQQ: state => state.user.storeQQ,
            storeEmail: state => state.user.storeEmail,
            storeWorkplace: state => state.user.storeWorkplace,
            storeTrueName: state => state.user.storeTrueName,
        })       
    },
    watch: {
        storeTrueName:function(data){
            console.log(data,'--------trueName---------')
            this.trueName = data
        },
        storeWx: function(data){
            console.log(data,'--------wx---------')
            this.wx = data
        },
        storeQQ: function(data){
            console.log(data)
            this.qq = data
        },
        storeEmail: function(data){
            console.log(data)
            this.email = data
        },
        storeWorkplace: function(data){
            console.log(data)
            this.workplace = data
        },
    },
    components: {
        Group, XButton, Cell, PopupPicker,MsgEdit
    }
}
</script>

<style lang="less">
.personalDetail .warpCell .weui-cell__ft{
    width:70%;
    white-space: nowrap;  
    text-overflow:ellipsis; 
    overflow:hidden;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>