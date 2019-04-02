<template>
<div>
    <div  v-if="Object.keys(ViewData).length == 0 "></div> 
    <div class="statementDetail" v-else >
        <scroller lock-x :scrollbarY=false ref="scroller">
            <div style="overflow:hidden">               
                <group class="report-box">
                    <header class="vux-1px-b">
                        <aside><img :src="ViewData.items.report.headLogo" alt="" :onerror="logo"></aside>
                        <section>
                            <h5>{{ViewData.items.report.userName}}</h5>
                            <time>{{timeData}}</time>
                        </section>
                        <article>
                            <div><strong>{{ViewData.items.report.state=="3" ? "已审阅" : "未审阅"}}</strong></div>
                        </article>
                    </header>
                    <div class="bd">
                        <div class="it-box">
                            <h6>{{query==1 ? "日报" : query==2 ? "周报" : "月报"}}内容：</h6>
                            <p>{{ViewData.items.report.reportContent}}</p>                            
                        </div>
                        <div class="it-box2" v-if="attachList.imgArr.length>0">
                            <h6>图片附件</h6>
                            <article>
                                <div v-for="(item, index) in attachList.imgArr" :key="index"><img :src="item.src" alt="" class="previewer-demo-img" @click="show(index)" /></div>
                            </article>
                            <div v-transfer-dom>
                                <previewer :list="attachList.imgArr" ref="previewer" :options="options"></previewer>
                            </div>  
                                                   
                        </div>
                        <div class="it-box2" v-if="attachList.filenum>0" @click="viewAttachment(attachList.fileList)">
                            <h6>文件附件：<strong>{{attachList.filenum}}个附件</strong></h6>    
                        </div>              
                    </div>               
                </group>                
                <group>
                    <cell title="已读人员" :value="ViewData.items.viewPeopleList.length+'个'" ></cell>
                    <div class="has-read" v-if="ViewData.items.viewPeopleList.length>0">
                        <div v-for="(item,index) in ViewData.items.viewPeopleList" :key="index">
                            <img :src="item.viewPeoplePhotoId" alt="" :onerror="logo">
                            <p>{{item.viewPeopleName}}</p>
                        </div>
                    </div>
                </group>
                <group>
                    <p class="comment-top-title">
                        <span class="hasStatus">{{CommentData.length>0 ? "共有"+CommentData.length+"条评论" : "暂无评论"}}</span>
                        <span class="comment-icon" @click="showActionsheet"><img src="@/images/job/write.png" alt="">写评论</span>
                    </p>
                    <ul class="comment-box" v-if="CommentData.length>0">
                        <li class="comment-list" v-for="(item,index) in CommentData" :key="index">
                            <aside>
                                <img :src="item.headLogo" alt="" :onerror="logo">
                            </aside>
                            <section :class="(CommentData.length-1)==index?'':'vux-1px-b'">
                                <div><strong>{{item.userName}}</strong><time>{{item.addTime}}</time></div>
                                <p>{{item.content}}</p>
                            </section>
                        </li>
                        
                    </ul>
                </group>
                
            </div>
        </scroller>        
        <div v-transfer-dom>
            <popup v-model="show2" position="bottom" should-rerender-on-show >
                <x-textarea placeholder="写评论..." v-model="comment"  :max="200" class="comments-text"></x-textarea>
                <div class="comments-btn"><x-button :disabled="comment.length==0||commentFlag" :show-loading="commentFlag" @click.native="handleComment" type="primary">提交</x-button></div>
            </popup>
        </div>
        
    </div>
</div>

</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Cell ,Group,XTextarea,TransferDom, Popup,Previewer ,Scroller ,XInput,XButton } from 'vux';
import { mapState, mapActions,mapMutations } from 'vuex';

export default {
    name: 'statementDetail',
    data() {
        return {
           value1:'',
           title:"",
           value:"",
           show2:false,
           comment:"",
           readMember:10,
           statment:{},
           options: {
                getThumbBoundsFn (index) {
                // find thumbnail element
                let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                // get window scroll Y
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                // optionally get horizontal scroll
                // get position of element relative to viewport
                let rect = thumbnail.getBoundingClientRect()
                // w = width
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                // Good guide on how to get element coordinates:
                // http://javascript.info/tutorial/coordinates
                }
            },
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            reportId:'',
            userName:this.$store.state.userInfo.user.trueName,
            query:'',
            ViewData:{},
            timeData:0,
            attachList:[],
            CommentData:[],
            headLogo:this.$store.state.userInfo.user.headLogo?this.$store.state.userInfo.user.headLogo:require('@/images/xsdefult.jpg'),
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"',
            imgBtnFlag:true,
            commentFlag:false,
        }
    },
    directives: {
        TransferDom
    },
    created() {
        this.reportId=this.$route.query.reportId;
        this.query=this.$route.query.state;
        if(this.query==1){
            document.title="日报"
        }else if(this.query==2){
            document.title="周报"
        }else if(this.query==3){
            document.title="月报"
        }
        
        this.clearViewReport();
        
        this.clearReportComment();
        
    },
    mounted() {
        let obj={
                userId:this.userId,
                companyId:this.companyId,
                userName:this.userName,
                from:'2',
                reportId:this.reportId,
                type:this.query
            } 
        this.viewReportHand(obj);
        let obj2={
            reportId:this.reportId,
            companyId:this.companyId,
        }
        this.reportCommentHand(obj2)
    },
    computed: {
        ...mapState({
            viewReportData:state => state.oaworkreport.viewReportData,       
            reportCommentData:state => state.oaworkreport.reportCommentData,    
            reportCommentAddData:state => state.oaworkreport.reportCommentAddData,          
            receivedData:state => state.oaworkreport.receivedData,    
        })       
    },
    watch: {
        //查看详情
        viewReportData(data){
            if(Object.keys(data).length >0){
                if(data.alert_msg){
                   this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{
                    if(this.query==1){
                        this.timeData=data.items.report.endDate;
                    }else if(this.query==2){
                        this.timeData= data.items.report.startDate+' ~ '+data.items.report.endDate;
                    }else{
                        this.timeData=data.items.report.endDate.substring(0,7);
                    }
                    // this.userName=data.items.report.userName;
                    //图片
                    let imgArr=[];
                    let filenum=0;
                    let fileList=[];
                    if(data.items.attachList){
                        data.items.attachList.forEach(item => {
                            if(('jpg,png,gif,peg').indexOf( item.url.substring(item.url.length-3,item.url.length) )!=-1){
                                let obj={
                                    src:item.url,
                                }
                                imgArr.push(obj);                               
                            }else{
                                filenum++;
                                fileList.push(item)
                            }
                            
                        });                        
                    }
                    let imgObj={
                                imgArr,
                                filenum,
                                fileList,
                            }
                    this.attachList=imgObj;
                    this.ViewData=data;
                }
            }
        }, 
         //工作日报评论查看
        reportCommentData(data){
            if(Object.keys(data).length >0){
                if(data.alert_msg){
                   this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{
                    this.CommentData=data.items;
                }
            }
        },
        //工作日报添加评论
        reportCommentAddData(data){   
            
            let text;        
            if(data.alert_msg){
               text=data.alert_msg;
            }else{
                
                this.show2=false;  

                text='评论成功';      
                var myDate = new Date()

                function dateform(data){
                    let My=data;
                    if(My.toString().length==1){
                        My='0'+My;                
                    }
                    return My
                }
                let addTime=myDate.getFullYear()+'-'+ dateform(myDate.getMonth()+1)+'-'+dateform(myDate.getDate())+' '+dateform(myDate.getHours())+':'+dateform(myDate.getMinutes()) +':'+dateform(myDate.getSeconds())
                
                this.CommentData.splice(0,0,{
                    headLogo:this.headLogo,
                    userName:this.userName,
                    addTime,
                    content:this.comment
                })
            }
            
            this.$vux.toast.show({
                text: text,
                type: 'text',
                position: 'top',
                width:'20em'
            })
            setTimeout(() => {
                   this.commentFlag = false 
                },1500);
        }       
    },
    methods: {
        ...mapActions({
            viewReportHand: 'oaworkreport/viewReport',
            reportCommentHand: 'oaworkreport/reportComment',
            reportCommentAddHand:'oaworkreport/reportCommentAdd',
            
        }),
        ...mapMutations({
            clearViewReport: 'oaworkreport/CLEAR_VIEWREPORT',
            clearReportComment: 'oaworkreport/CLEAR_REPORTCOMMENT',
             loadingHand: 'UPDATE_LOADING',
        }),
        //跳转到附件页面
        viewAttachment(data){
            let Arr=[];
            data.forEach(item => {
                let obj={
                    fileUrl:item.url,
                    fileName:item.displayName,
                }
                Arr.push(obj)
            });
            localStorage.setItem('fileDetails',JSON.stringify(Arr))
            this.$router.push({ path: 'attachment' })
        },
        handleComment(){
            let text=$.trim(this.comment);              
            if(text.length==0){
                this.$vux.toast.show({
                    text: '请输入评论内容',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                this.comment=''; 
                return             
            }
            let obj={
                userId:this.userId,
                companyId:this.companyId,
                userName:this.userName,
                reportId:this.reportId,
                content:text
            }
            this.commentFlag = true
            this.reportCommentAddHand(obj)    
        },
        show (index) {
           if(this.imgBtnFlag){
                this.imgBtnFlag=false;
                this.loadingHand(true)
                setTimeout(() => {
                    this.loadingHand(false);
                },1500)
                setTimeout(() => {
                    this.imgBtnFlag=true;
                },2500)
                this.$refs.previewer.show(index)
             }
        },
        showActionsheet(){
            this.comment='';
            this.show2=true;
        },
        
    },
    components: {
        CellBox,
        Group,
        Cell,
        XTextarea,
        Scroller,
        XInput,
        Popup,
        XButton,
        Previewer,
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
 @import '../statement/index.less';
</style>
<style lang="less">
 .comments-text .weui-textarea{
     padding:5px;
     box-sizing: border-box;
 }
 
</style>

