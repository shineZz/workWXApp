<template>
    <div class="educationWork">
        <div class="education-content" v-if='!isMsgEdit'>
            <group title="工作信息">
                <div v-if='!isWork'>
                    <cell title="学校名称" v-model="schoolName" is-link @click.native='toggleMsgEdit(5,schoolName)'>
                    
                    </cell>
                    <cell title="院系/专业" v-model="major" is-link @click.native='toggleMsgEdit(6,major)'>
                        
                    </cell>
                    <cell title="学历" v-model="educationHistory" is-link @click.native='toggleMsgEdit(7,educationHistory)'>
                        
                    </cell>
                </div>
                <div v-else>
                    <cell title="公司名称" v-model="companyName" is-link @click.native='toggleMsgEdit(8,companyName)'>
                    
                    </cell>
                    <cell title="职位名称" v-model="post" is-link @click.native='toggleMsgEdit(9,post)'>
                        
                    </cell>
                </div>
                <datetime
                        v-model="startTime"
                        title="开始时间"
                        format="YYYY-MM-DD"
                        @on-change="startChange"

                    />
                    <datetime
                        v-model="endTime"
                        title="结束时间"
                        format="YYYY-MM-DD"
                        @on-change="endChange"
                        />
            </group>
            <group :title="textTitle">
                <div class="textareaDiv" @click="textareaShow" v-if="textAreaFlag" v-html="myplaceholder">
                </div>
                <x-textarea v-model="textVal" v-else @on-blur="textareaBlur" :height='200'>
                    
                </x-textarea>
            </group>
        </div>
        <x-button type="primary" v-if='!isMsgEdit' @click.native="toMsgEdit">确定</x-button>
        <div class="detailBtn">
            <span>删除</span>
            <span>保存</span>
        </div>
        <MsgEdit v-if='isMsgEdit' @toggleMsgEdit='toggleMsgEdit' :val1=val1 :val2=val2></MsgEdit>
    </div>    
</template>

<script>
import { XButton, Group , XInput ,Scroller,Cell,Datetime,XTextarea  } from 'vux';
import { mapState, mapActions, mapMutations } from 'vuex';
import MsgEdit from '../msgEdit'
export default {
    name: 'EducationWork',
    data() {
        return{
           startTime:'',
           endTime:'',
           textVal:"",
           textAreaFlag:true,
           isWork:true,
           schoolName:"",
           major:'',
           educationHistory:"",
           isMsgEdit:false,
           companyName:"",
           post:"",
           val1:"",
           val2:"",
           textTitle:"",
           myplaceholder:""
        }
    },
    created() {
        let id = this.$route.query.id
        if(id==10){
            document.title='我的工作经历'
            this.isWork=true
            this.textTitle = '工作经历描述'
            this.myplaceholder = '输入文字不超过500字(非必填)<br/>可参考如下格式：<br/>【工作职能】<br/>简要描述您在岗位中的工作内容或职责范围等<br/><br/>【项目经历及业绩】<br/>简要描述您在岗职位的项目经理以及获得的成绩等'
        }else if(id==11){
            document.title="我的教育经历"
            this.isWork=false
            this.textTitle = '更多描述'
            this.myplaceholder = '输入文字不超过500字(非必填)'
        }
    },
    mounted(){
        
    },
    methods: {
        ...mapMutations({
            UserChange:'user/USERCHANGE',
            UserHasChange:'user/USERHASCHANGE'
        }),
        //时间限制
        startChange(value) {
            let endTime=this.endTime
            if(endTime.length>0){                
                endTime=endTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let startTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(startTime>=endTime){
                   this.$vux.toast.show({
                        text:'开始时间'+'不能大于等于'+'结束时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    }) 
                    setTimeout(() => {
                        this.startTime='';
                    },500)
                    
                }
            }
        },
        endChange(value){
            let startTime=this.startTime
            if(startTime.length>0){                
                startTime=startTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let endTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(endTime<=startTime){
                this.$vux.toast.show({
                        text:'开始时间'+'不能大于等于'+'结束时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    }) 
                    setTimeout(() => {
                        this.endTime='';
                    },500)
                }
            }
        },  
        textareaShow(){
            this.textAreaFlag = !this.textAreaFlag
            this.$nextTick(function(){
                $("textarea").focus()
            })
        },
        textareaBlur(){
            if(this.textVal==''){
                this.textAreaFlag = !this.textAreaFlag
            }
        },
        toggleMsgEdit(id,val){
            console.log('-----执行了没有------')
            let that = this
            this.val1 = id 
            this.val2 = val
            let obj = {
                id:id,
                value:val
            }
            this.UserChange(obj)
            if(!that.isMsgEdit){
                let title;
                //state 为1的时候是编辑，为2的时候为列表（教育经历，工作经历）
                title = id==0?'真实姓名':id==1?'邮箱':id==2?'微信':id==3?'QQ':id==4?'工作地点':id==5?'学校名称':id=="6"?'院系/专业':id==7?'学历':id==8?'公司名称':id==9?'职位名称':id==10?'我的工作经历':id==11?'我的教育经历':''
                document.title=title
            }
            that.isMsgEdit = !that.isMsgEdit
            this.UserHasChange()
        },
        toMsgEdit(){
            this.$router.go(-1)
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            userChange:state =>state.user.userChange,
            storeSchool:state =>state.user.storeSchool,
            storeMajor:state =>state.user.storeMajor,
            storeEducationHistory:state =>state.user.storeEducationHistory,
            storeCompany:state =>state.user.storeCompany,
            storePost:state =>state.user.storePost,
        }),
        
    },
    watch: {
        storeSchool:function(data){
            this.schoolName = data
        },
        storeMajor:function(data){
            this.major = data
        },
        storeEducationHistory:function(data){
            this.educationHistory = data
        },
        storeCompany:function(data){
            console.log('sssss')
            this.companyName = data
        },
        storePost:function(data){
            this.post = data
        }
    },
    components: {
        Group, XButton, XInput, Scroller,Cell,Datetime,XTextarea,MsgEdit
    }
}
</script>

<style lang="less">

</style>


<style lang="less" scoped>
 @import './index.less';
</style>