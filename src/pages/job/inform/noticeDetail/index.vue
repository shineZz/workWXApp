<template>
    <div class="noticeDetail router-all" >
        <div class="noticeDetail-header vux-1px-b">
            <p class="title">{{messageDetail.title}}</p>
            <p class="person">{{messageDetail.trueName}}：{{messageDetail.createDate}}</p>
            <p class="browseNumber">浏览次数：{{messageDetail.reads}}次</p>
        </div>
        <div class="notice-detail" id="notice-detail">
            <div class="content-notice" > 
                <div v-html="messageDetail.content"></div>  
            </div>
        </div>
        <div class="notice-bottom" v-if="messageDetail.attach_rlt.length>0">
            附件：<a  href="javascript:" @click="viewAttachment(messageDetail.attach_rlt)">{{messageDetail.attach_rlt.length}}个附件</a>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Cell , Calendar,Group, ButtonTab,XTextarea, Scroller , ButtonTabItem , Divider, XSwitch, Spinner,LoadMore,Badge   } from 'vux'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'noticeDetail',
    data() {
        return {
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            messageDetail:{
                attach_rlt:[]
            },
            scrollHeight:'-150'
        }
    },
    created() {
        
        // console.log(height_head,'---------height---------')
        // message.destroy()
        this.initMessageDetail()
        this.$nextTick(function(){
            let height_head = $('.noticeDetail-header')[0].offsetHeight
            let bodyHeight = $('body')[0].offsetHeight
            this.scrollHeight = '-'+height_head+50
            let detailHeight = bodyHeight-height_head-50+'px';
            $('.notice-detail').css('height',detailHeight)
            
        })
    },
    mounted() {
        
        
    },
    methods: {
        ...mapActions({
            VIEWNotice:'oanotice/ViewNotice'
        }),
        initMessageDetail(){
            let obj = {
                userId:this.user_id,
                companyId:this.company_id,
                messageId:this.$route.query.messageId,
            }
            this.VIEWNotice(obj)
        },
        //跳转到附件页面
        viewAttachment(data){
            let Arr=[];
            data.forEach(item => {
                let obj={
                    fileUrl:item.fileUrl,
                    fileName:item.displayName,
                }
                Arr.push(obj)
            });
            localStorage.setItem('fileDetails',JSON.stringify(Arr))
            this.$router.push({ path: 'attachment' });        
        },
    },
    computed: {
        ...mapState({
            noticeView:state => state.oanotice.noticeView,
            
        })
    },
    watch: {
        noticeView:function(newVal){
            // if(newVal.data.alert_msg){
            //      this.$vux.toast.show({
            //             text: data.alert_msg,
            //             type: 'text',
            //             position: 'top',
            //             width:"20em"                                
            //         }) 
            // }else{
                
            // }
            this.messageDetail = newVal
        },
        
    },
    components: {
        CellBox,
        Calendar,
        Group,
        ButtonTab, 
        ButtonTabItem,
        Scroller,
        LoadMore,
        Cell,
        XTextarea,
        Badge,
    },
}
</script>
<style lang="less">
.noticeDetail{
    .notice-detail{
        box-sizing: border-box;
        width: 100%;
        padding:25px;
        overflow: hidden;
        overflow-y: auto;
        .content-notice{
            width:100%;
            p{
                width:100%;
                word-wrap:break-word;
                img{
                    max-width: 100%;
                    height: auto;
                }
            }
        }
    }
}
   
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
