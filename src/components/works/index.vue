<template>
    <div>
        
            <div v-transfer-dom>
                <popup v-model="commentsShow">
                    <x-textarea :max="200"  :placeholder="commentsPle" :height="80" class="comments-text" v-model="commentsText"></x-textarea>
                    <div  class="comments-btn"><x-button type="primary" :disabled="commentsText.length==0?true:false" @click.native="commentsOnOk" :show-loading='showLoading'>提交</x-button></div>
                </popup>
                <previewer :list="picData" ref="previewer"  ></previewer>
            </div>
            <scroller  
                lock-x  
                scrollbarY 
                @on-scroll-bottom="loadMore" 
                @on-scroll="OnScroll" 
                @on-pulldown-loading="refresh" 
                v-model="status" 
                :height=" moduleObj.link==1?'-110':'-187'" 
                use-pulldown  
                ref="scroller" 
                :scroll-bottom-offst="0">
                <div>
                    <div  v-if="Object.keys(workData).length == 0 ||   workData.num_items==0 " class="wu-all wu-allB">
                        <section>
                            <div><img src="~@/images/wu-icon1.png"></div>
                            <p>{{ Object.keys(workData).length == 0? alertMsg:'暂无圈子数据'}}</p>
                        </section>
                    </div>
                    <div class="works-box vux-1px-b"  v-for="(item,index) in workData.items.messageList" :key="index"  v-else >
                        <aside><img :src="item.headLogo" alt=" " :onerror="logo"></aside>
                        <section>
                            <h6>{{item.userName}}</h6>
                            <div class="it-cont">
                                <p :class="item.packShow && item.praiseShow?'cont-show':''">{{item.mesContent}}</p>
                                <a v-if="item.packShow" @click="contshowHand(index)" href="javascript:void(0)">{{item.praiseShow?'全部':'收起'}}</a>
                            </div>                        
                            <div :class="['it-img', item.attachList.imgData.length==1?'it-img-box1':item.attachList.imgData.length==2?'it-img-box2':'it-img-box3']" v-if="item.attachList.imgData.length>0" >
                                <div v-if="item.attachList.imgData.length==1" @click="viewPic(index,0)"><img :src="item.attachList.imgData[0].fileUrl" alt=" " ></div>
                                <div v-else v-for="(it,i) in item.attachList.imgData" :key="i" @click="viewPic(index,i)"><div :style="{ height: item.attachList.imgData.length==2? imgHe1+'px' :imgHe2+'px',background: 'url('+ it.fileUrl +') center no-repeat /cover'}"></div></div>
                            </div>
                            <div v-if="item.attachList.filenum>0" class="attachment" @click="viewAttachment(item.attachList.fileList)"><a href="javascript:">附件：<strong>{{item.attachList.filenum}}个附件</strong></a></div>
                            <dl>
                                <dt><time>{{createTime(item.createTime)}}</time><a href="javascript:void(0)" @click="delHand(index,item.mesId)" v-if="userId==item.mesUserId&& type==2"><i class="icon-delete"></i></a></dt>
                                <dd><a href="javascript:void(0)" @click="commentsHand(index,item.mesId)"><i class="icon-comments"></i><span>评论</span></a><a href="javascript:void(0)"  :class="item.thumbFlag ?'cur':''" @click="praiseHand(index,item)"><i class="icon-praise" ></i><span>点赞</span></a></dd>
                            </dl>
                            <div class="comments-all" v-if="item.commentList.length>0 || item.thumbUserList.length>0">
                                <i class="part-icon-arrow"></i>
                                <div class="hd" v-if="item.thumbUserList.length>0" >
                                    <div><i  class="icon-heart"></i></div>
                                    <p><span>{{item.thumbName}}</span></p>
                                </div>
                                <div :class="['bd',item.thumbUserList.length>0?'vux-1px-t':'']" v-if="item.commentList.length>0">
                                    <ul>
                                        <li v-for="(it,i) in item.commentList" :key="i" >
                                            <div @click="commentsHand(index,item.mesId,i,it.commentId,it.commentUserId,it.userName)"><strong>{{it.userName}}</strong>：{{it.commentContent}}</div>
                                            <div v-if="it.replyList.length>0"  v-for="(it_s,num) in it.replyList" :key="num" @click="commentsHand(index,item.mesId,i,it.commentId,it_s.replyToUserId,it_s.userName)" ><strong>{{it_s.userName}}</strong> 回复 <strong>{{it_s.replyToUserName}}</strong>：{{it_s.replyContent}}</div>                                            
                                        </li>
                                    </ul>
                                </div>
                                
                            </div>
                        </section>
                    </div>
                    <load-more tip="加载中" v-if="loadFlag" ></load-more>
                    <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>
                </div>
                <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" :style="{position: 'absolute', width: '100%', height: '60px', lineHeight: '60px', top: moduleObj.link==1?'-75px':'-60px' , textAlign: 'center'}">
                    <span v-show="status.pulldownStatus === 'default'"></span>
                    <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
                    <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放刷新</span>
                    <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
                </div>
            </scroller>
        
        
    </div>
</template>

<script>
import { Scroller,LoadMore,Divider ,Group,Cell,Popup,TransferDom,XTextarea,XButton,Previewer} from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';

export default {
    name: 'works',
     data() {
        return { 
            page:1,
            count:5,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            deptId: this.$store.state.userInfo.user.departId,
            type:'1',   //查询类型 : 1全部;2我发起的;3@我的
            loadFlag:false ,//加载图标 要不 要显示
            onFetching:true,//要不要滚动加载
            onload:true,//要不要滚动加载
            status: {
                pulldownStatus: 'default',
            },
            pulldown:false,
            alertMsg:'加载中...',//第一次
            workData:{},            
            workFlag:false,
            ArrData:[],
            userName:this.$store.state.userInfo.user.trueName,
            //在第几个位置
            messageIndex:0,
            //点赞
            thumbFlag:false,

            imgHe1:Math.round( ($("#app").width()-106)/2/1.5),
            imgHe2:($("#app").width()-116)/3,
            //评论
            commentsShow:false,
            commentsText:'',
            mesId:'',
            replyListNun:'',
            commentId:'',
            replyToUserId:'',
            commentsPle:'',
            commentsName:'',
            
            //查看图片数据
            picData:[],
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
            imgBtnFlag:true,
            showLoading:false,

            

        }
    },
    directives: {
        TransferDom,
    },
    props:{
        moduleObj:{
            required: true 
        }
    },
    components: {
        Scroller,
        LoadMore,
        Divider,
        Group,
        Cell,
        Popup,
        TransferDom,
        XTextarea,
        XButton,
        Previewer
    },
    created(){
        this.type=this.moduleObj.link;        
        this.loadingHand(true)
        this.clearCircelist();         
    },
    mounted(){
        let obj={
            userId:this.userId,
            companyId:this.companyId,
            type:'1',
            page:this.page,
            count:this.count,
            deptId:this.deptId,
        }        
        this.CircleList(obj);
    },
    updated(){      
        if(this.workFlag && Object.keys(this.workData).length >0){
            this.workFlag=false;
            if(this.workData.items.messageList.length>0){
                this.workData.items.messageList.forEach(function(item,i) {
                //加载数据的当前页数
                    if((this.page-1)*5 <=i< (this.page*5-1)){
                        let he=$(".works-box").eq(i).find(".it-cont p").height();
                        if(he>48){
                            item.packShow=true;
                            item.praiseShow=true;
                        }
                    }                
                },this);
            }
        }
    },
    watch: {
        // '$route' (to, from) {
        //     if(to.name=='work'&& from.name=='dynamic' && Object.keys(this.addMessageData).length >0 ){
        //         this.loadFlag=true ;//加载图标 要不 要显示
        //         this.onFetching=false;//要不要滚动加载
        //         this.onload=true;//要不要滚动加载
        //         this.status= {
        //             pulldownStatus: 'default',
        //         };
        //         this.pulldown=false;
        //         this.workData={};            
        //         this.workFlag=false;
        //         this.ArrData=[];
        //         this.page=1;
        //         let obj={
        //             userId:this.userId,
        //             companyId:this.companyId,
        //             type:'1',
        //             page:this.page,
        //             count:this.count,
        //             deptId:this.deptId,
        //         }        
        //         this.loadingHand(true)
        //         this.clearCircelist();
        //         this.clearMessageHand();
        //         this.CircleList(obj);
               
        //     }
        // },
        //消息列表
         circleListData(data){  
            if( Object.keys(data).length >0 ){                
                if(this.onload){
                    this.onload=false
                    this.loadingHand(false)
                }
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.status.pulldownStatus = 'default' ;
                    this.alertMsg=data.alert_msg;
                }else{      
                    let ArrObj= data;
                    let messageList=[];
                    this.workFlag=true;
                        ArrObj.items.messageList.forEach((item,index) => {
                            let obj=item;
                                //图片跟文件数据重组
                            let imgData=[];
                            let filenum=0;
                            let fileList=[];
                            if(item.attachList.length>0){
                                item.attachList.forEach(item => {
                                    if(('jpg,png,gif,jpeg').indexOf(item.suffix)!=-1){
                                        let picObj=item;
                                        picObj.src=item.fileUrl;
                                        imgData.push(item);
                                    }else{
                                        filenum++;
                                        fileList.push(item)
                                    }                                                              
                                });

                            }
                            
                            let thumbFlag=false;
                            let thumbName=[];
                            if(item.thumbUserList.length>0){
                                item.thumbUserList.forEach(it => {
                                    if(it.thumbUserId==this.userId){
                                        thumbFlag=true;
                                    }
                                    thumbName.push(it.thumbUserName)
                                });
                            }  
                            obj.thumbFlag=thumbFlag;
                            obj.thumbName=thumbName.join(',');

                            let imgObj={
                                imgData,
                                filenum,
                                fileList,
                            }
                            obj.attachList=imgObj;
                            messageList.push(obj)
                        }); 
                        
                        if(this.pulldown || this.page==1){
                            this.ArrData=[];
                            this.ArrData= messageList;
                            this.status.pulldownStatus = 'default';                        
                        }else{
                            this.ArrData= this.ArrData.concat(messageList) ;                                            
                        }           
                        ArrObj.items.messageList=this.ArrData;            
                        if(ArrObj.has_more){
                            this.onFetching = false ;
                            this.loadFlag=true;
                        }else{
                            this.loadFlag=false
                            this.onFetching = true 
                        }
                        this.workData = ArrObj ;

                }
            }else{
                this.workData = {};
                this.ArrData=[];
            }
        },
        //点赞
        praiseData(data){
            if(Object.keys(data).length >0){
                this.clearPraise();
                let text;
                if(data.alert_msg){
                    text=data.alert_msg
                }else{
                    text= this.thumbFlag?'取消点赞成功':'点赞成功';
                    this.workData.items.messageList[this.messageIndex].thumbFlag=!this.thumbFlag;
                    let thumbName=[];
                    if(data.items.thumbUserList.length>0){
                        data.items.thumbUserList.forEach(it => {
                            thumbName.push(it.thumbUserName)
                        });
                    }  
                    this.workData.items.messageList[this.messageIndex].thumbUserList=data.items.thumbUserList ;
                    this.workData.items.messageList[this.messageIndex].thumbName=thumbName.join(',');
                }
                this.$vux.toast.show({
                        text: text,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
            }
        },
        //新增评论
        addCommentData(data){
            if(Object.keys(data).length >0){                
                let text;
                if(data.alert_msg){
                    text=data.alert_msg
                }else{
                    text='评论成功';
                    this.commentsShow=false; 
                    let obj=data.items;
                    obj.replyList=[];   
                    obj.userName=   this.userName;         
                    this.workData.items.messageList[this.messageIndex].commentList.push(obj) ;
                   
                }
                this.$vux.toast.show({
                        text: text,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                setTimeout(() => {
                    this.showLoading=false;
                },1500);
            }
        },
        //新增回复评论
        addReplyData(data){
            if(Object.keys(data).length >0){
                
                let text;
                if(data.alert_msg){
                    text=data.alert_msg
                }else{
                    text='回复成功';   
                    this.commentsShow=false;    
                    let obj=data.items;
                        obj.userName=this.userName;
                        obj.replyToUserName=this.commentsName;  
                    this.workData.items.messageList[this.messageIndex].commentList[this.replyListNun].replyList.push(obj) ;
                }
                this.$vux.toast.show({
                        text: text,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                setTimeout(() => {
                    this.showLoading=false;
                },1500)
                
            }
        },
        //删除
        delMessageData(data){
            if(Object.keys(data).length >0){
                this.clearDelMessage();
                let text;
                if(data.alert_msg){
                    text=data.alert_msg
                }else{
                    text='删除成功';   
                    this.workData.items.messageList=this.workData.items.messageList.filter((elem, i) => this.messageIndex !== i);
                }
                this.$vux.toast.show({
                        text: text,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
            }
        },
        
    },    
    computed: {
        ...mapState({
            circleListData:state => state.oamessage.circleListData,        
            praiseData:    state => state.oamessage.praiseData,  
            addReplyData:    state => state.oamessage.addReplyData, 
            addCommentData: state => state.oamessage.addCommentData,
            delMessageData: state => state.oamessage.delMessageData,
            addMessageData: state => state.oamessage.addMessageData,
            
        })       
    },
    methods: {
        ...mapActions({
            CircleList: 'oamessage/circleList',
            MessageThumbHand:'oamessage/messageThumb',
            AddCommentHand:'oamessage/AddComment',
            AddReplyHand:'oamessage/AddReply',
            DelMessageHand:'oamessage/delMessage',
        }),
        ...mapMutations({
            clearCircelist: 'oamessage/CLEAR_CIRCELIST',
            clearPraise: 'oamessage/CLEAR_PRAISE',
            loadingHand: 'UPDATE_LOADING',
            clearAddComment: 'oamessage/CLEAR_ADDCOMMENT',
            clearAddReply: 'oamessage/CLEAR_ADDREPLY',
            clearDelMessage: 'oamessage/CLEAR_DELMESSAGE',
            clearMessageHand: 'oamessage/CLEARMESSAGE',
            
            
        }),
       
        //文字 全部 收起
        contshowHand(index){
            if(this.workData.items.messageList[index].praiseShow){
                this.workData.items.messageList[index].praiseShow=false;               
            }else{
                this.workData.items.messageList[index].praiseShow=true;
            }
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
        //评论
         commentsHand(index,mesId,i,commentId,replyToUserId,name){
            this.commentsText='';
             
            this.mesId=mesId;
            this.messageIndex=index;
            this.replyListNun=i; 
            this.commentsName=name;
            this.commentId  =commentId;
            this.replyToUserId  =replyToUserId;
            this.commentsShow=true; 

            if(this.replyListNun==undefined){
                this.commentsPle='我来说几句';
            }else{
                this.commentsPle= '回复:'+name ;               
            }     
        },
        //评论提交后回调
        commentsOnOk(){
            
            let text=$.trim(this.commentsText); 
            if(text.length==0){
                this.commentsText='';
                this.$vux.toast.show({
                    text:this.replyListNun==undefined? '请输入评论内容':'请输入回复内容',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                if(!this.showLoading){
                    this.showLoading=true;
                    let obj={
                        userId:this.userId,
                        companyId:this.companyId,                    
                        mesId:this.mesId,
                    }
                    if(this.replyListNun==undefined){
                        obj.commentContent=text;
                        this.AddCommentHand(obj);
                    }else{
                    obj.replyContent=text;
                    obj.commentId=this.commentId;
                    obj.replyToUserId=this.replyToUserId;
                    this.AddReplyHand(obj);
                    }    
                }
                              
            }
            
        },
        OnScroll(){
            this.$nextTick(() => {
            this.$refs.scroller.reset()
            })
        },
        loadMore () {
            
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                this.pulldown=false;
                this.page = this.page+1;
                let obj={
                    userId:this.userId,
                    companyId:this.companyId,
                    type:'1',
                    page:this.page,
                    count:this.count,
                     deptId:this.deptId,
                }
                //部门ID ， type=1时必须
                
                this.CircleList(obj);                
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.pulldown=true
                this.page = 1
                let obj={
                    userId:this.userId,
                    companyId:this.companyId,
                    type:'1',
                    page:this.page,
                    count:this.count,
                     deptId:this.deptId,
                }
                //部门ID ， type=1时必须
                // if(this.type==1){
                //     obj.deptId=this.deptId;
                // }
                this.CircleList(obj);
            }
        },
        //查看图片
        viewPic(index,i){
             if(this.imgBtnFlag){
                this.imgBtnFlag=false;
                this.loadingHand(true)
                setTimeout(() => {
                    this.loadingHand(false);
                },1500)
                setTimeout(() => {
                    this.imgBtnFlag=true;
                },2500)
                this.picData= this.workData.items.messageList[index].attachList.imgData;
                setTimeout(() => {
                    this.$refs.previewer.show(i);
                },500)
                
             }
        },
        // 删除
        delHand(index,mesId){
            let _this=this;
            this.messageIndex=index;
            this.$vux.confirm.show({
                    title: '提示',
                    content: '确定删除吗？',                    
                    onConfirm () {
                        _this.delConfirm(mesId)
                        
                    }
            })
            // 
        },
        // 删除成功后回调
        delConfirm(mesId){
            let obj={
                    mesId:mesId,
                    userId:this.userId,
                    companyId:this.companyId,
            }
            this.DelMessageHand(obj) ;           
        },
        //点赞
        praiseHand(index,data){
            this.messageIndex=index;
            this.thumbFlag=data.thumbFlag;
            let obj={
                userId:this.userId,
                mesId:data.mesId,
                operateType:this.thumbFlag?'0':'1',
                companyId:this.companyId,
            }
            this.MessageThumbHand(obj);            
        },
        createTime(time){
            return time.substring(0,time.length-3)
        }
    }
    
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
<style lang="less">
 .comments-text .weui-textarea{
     padding:5px;
     box-sizing: border-box;
 }
</style>
