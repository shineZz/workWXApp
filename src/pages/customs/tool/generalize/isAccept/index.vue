<template>
    <div class="isAccept">
        <FormA :moduleObj="moduleObj"/>
        <p class="hint">最多填写500字，语音录入可自动转化为文字和保存录音</p>
        <x-button type="primary" :show-loading="isLoading" :disabled='isLoading' @click.native="isPass">{{status?"立即通过":"立即驳回"}}</x-button>
    </div>
</template>

<script>
import { Scroller , XButton,XTextarea ,Group} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import FormA from '@/components/formA'
export default {
    name: 'generalize',
    data() {
        return {
            isLabel:false,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            status:true,
            opinion:"",
            moduleObj: {
                title: '备注',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '',
                uploadData:[],
                record: true,
                uploadFlag:true,
                showBtn:true,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 9,
                zs:true,
            },
            isLoading:false,
        }
    },
    created() {
        if(this.$route.query.status==1){
            document.title="采纳";
            this.status = true;
            this.moduleObj.title='通过意见：'
            this.moduleObj.placeholder='在此输入通过意见，未输入则默认填写“同意”'

        }else if(this.$route.query.status==2){
            document.title="不采纳";
            this.status = false;
            this.moduleObj.title='不采纳意见：'
            this.moduleObj.placeholder='请输入较为详细的驳回意见，以便我们能够及时发现问题，为您提供更好的服务'
        }
    },
    methods: {
        ...mapActions({
          recommend_addTaskRecommendAuditFlow:'recommend/addTaskRecommendAuditFlow',
        }),

        isPass(){
            
            let opinion='';
            if(this.status){
                if(this.moduleObj.inputVal){
                    opinion=this.moduleObj.inputVal
                }else {
                    opinion = "同意"
                }
            }else{
                //不采纳
               opinion =$.trim(this.moduleObj.inputVal);
                if(opinion.length==0){
                    this.$vux.toast.show({
                        text: '请填写驳回意见',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    });
                    this.opinion='';
                    return false;
                }
            }
            if(!this.isLoading){
                this.isLoading=true
                let obj={
                'recommand_type_id':1,
                'tub_id':this.$route.query.tub_id,
                'type':this.status?3:6,
                'task_id':this.$route.query.task_id,
                'action_desc':opinion,
                'user_id':this.user_id,
                };
                if(Object.keys(this.moduleObj.recordObj).length>0&&this.moduleObj.recordObj.url){
                    obj.note_audio_url=this.moduleObj.recordObj.url
                }
                this.recommend_addTaskRecommendAuditFlow(obj);
            }
            


        },
    },
    computed: {
        ...mapState({
          recommendAuditFlowData: state => state.recommend.recommendAuditFlowData,
        }),
    },

    watch:{
      //提交的数据返回操作
      recommendAuditFlowData(data){
        
        if(data.alert_msg){
            this.isLoading=false
            this.$vux.toast.show({
                text: data.alert_msg,
                type: 'text',
                position: 'top',
                width:'20em'
            })
        }else{
           //返回列表页面
           let alertMsg =this.$route.query.status==1?'已采纳':'未采纳'
           this.$vux.toast.show({
            text: alertMsg,
            type: 'text',
            position: 'top',
            width:'20em'
          })
        //   this.$router.push({path:"accept",query:{task_id:this.$route.query.task_id,index:this.$route.query.index,status:this.status}})
        this.$router.go(-1)
        }
      }
    },
    components: {
        Scroller,
        XButton,
        Group,
        XTextarea,
        FormA,
    },
}
</script>

<style lang="less">
.isAccept{
    p.hint{
        box-sizing: border-box;
        color: red;
        padding: 10px 10px;
    }
    .weui-btn{
        position: absolute;
        bottom: 0;
    }
    textarea::-webkit-input-placeholder{
        font-size: 13px;
    }
    textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
        font-size: 13px;
    }
    textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        font-size: 13px;
    }
    textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
        font-size: 13px;
    }
    .record-parent{
        position: relative;
        .record{
            position: absolute;
            width: 30px;
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            right: 15px;
            bottom: 20px;
            img{
                width:30px;
                height: 30px;
            }
            p{
                text-align: center;
            }
        }
    }
}

</style>

