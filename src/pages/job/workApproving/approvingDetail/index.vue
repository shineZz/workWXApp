<template>
    <div>
        <div  v-if="Object.keys(viewData).length == 0 "></div>   
        <div class="approvingDetail" v-else>
            <scroller lock-x scrollerY :height="(type==1 && viewData.items.processStatus==2)|| type==2?'-35':'-0'" v-show="!isAddressBook">
                <div class="box1" style="overflow:hidden">
                    <group>
                        <div class="statement-msg">
                            <div class="user-msg-box">
                                <div class="user-msg">
                                    <div class="user-header">
                                        <img :src="viewData.items.headLogo" alt="" :onerror="logo">
                                    </div>
                                    <div class="user-date">
                                        <p class="userName">{{name}}</p>
                                        <p class="date">{{viewData.items.processStatus==1?'未提交':viewData.items.processStatus==2?'审批中':viewData.items.processStatus==3?'审批通过':viewData.items.processStatus==4?'审批不通过':'已撤销'}}</p>
                                    </div>
                                </div>
                                <div class="examine-number vux-1px-t">
                                    <span>审批编号：</span>{{viewData.items.processNo}}
                                </div>
                            </div>
                            
                            <div class="examine-money vux-1px-t" v-if="viewData.items.busiType==1">
                                <p ><span >费用类型：</span>{{viewData.items.formInfo.costType}}</p>
                                <p ><span >申请金额：</span>{{viewData.items.formInfo.money}}</p>
                            </div>
                            <div class="examine-money vux-1px-t" v-else-if="viewData.items.busiType==2">
                                <p><span >报销类型：</span>{{viewData.items.formInfo.reimbursementType}}</p>
                                <p><span >报销金额：</span>{{viewData.items.formInfo.money}}</p>
                            </div>
                            <div class="examine-money vux-1px-t" v-else-if="viewData.items.busiType==3">
                                <p><span >请假类型：</span>{{leaveHand(viewData.items.formInfo.leaveType)}}</p>
                                <p><span >起始时间：</span>{{viewData.items.formInfo.beginDate}}</p>
                                <p><span >终止时间：</span>{{viewData.items.formInfo.endDate}}</p>
                                <p><span >请假时长：</span>{{viewData.items.formInfo.duration}}{{viewData.items.formInfo.durationType==1?'天':'小时'}}</p>
                            </div>
                            <div class="examine-money vux-1px-t" v-else-if="viewData.items.busiType==4">
                                <p><span >出差地点：</span>{{viewData.items.formInfo.address}}</p>
                                <p><span >出发时间：</span>{{viewData.items.formInfo.beginDate}}</p>
                                <p><span >返回时间：</span>{{viewData.items.formInfo.endDate}}</p>
                                <p><span >出差时长：</span>{{viewData.items.formInfo.duration}}{{viewData.items.formInfo.durationType==1?'天':'小时'}}</p>
                            </div>
                            <div class="examine-money vux-1px-t" v-else>
                                <p><span >起始时间：</span>{{viewData.items.formInfo.beginDate}}</p>
                                <p><span >终止时间：</span>{{viewData.items.formInfo.endDate}}</p>
                                <p><span >加班时长：</span>{{viewData.items.formInfo.duration}}{{viewData.items.formInfo.durationType==1?'天':'小时'}}</p>
                            </div>
                            <div class="examine-particulars vux-1px-t">
                                <p class="title">{{viewData.items.busiType==2 ? "报销明细：" :
                                                    viewData.items.busiType==3 ? "请假事由：" :
                                                    viewData.items.busiType==4 ? "出差事由：" :
                                                    viewData.items.busiType==1 ? "费用明细：" : "加班事由："
                                                    }}</p>
                                <p class="content">{{viewData.items.formInfo.content}}</p>
                            </div>
                            <div class="accessory-box  vux-1px-t" v-if="attachList.imgArr.length>0 && viewData.items.attachList.length>0">
                                <p class="accessory-title">图片附件</p>
                                <div class="img-box">
                                    <div v-for="(item, index) in attachList.imgArr" :key="index">
                                        <img class="previewer-demo-img"  :src="item.src" @click="show(index)" >
                                    </div>
                                </div>    
                                                          
                                <div v-transfer-dom>
                                    <previewer :list="attachList.imgArr" ref="previewer" :options="options"></previewer>
                                </div>
                            </div>
                            <div class="accessory-box vux-1px-t" v-if="attachList.filenum>0  && viewData.items.attachList.length>0" @click="viewAttachment(attachList.fileList)">
                                <h6 class="accessory-title">文件附件：<span>{{attachList.filenum}}个附件</span></h6>  
                            </div>
                        </div>
                    </group>
                    <div  class="timeline-all">
                        <timeline>
                            <timeline-item  v-for="(item, i) in viewData.items.processNodeList" :key="i" 
                                    :class="[i === 0 ? 'agreed' : i==(viewData.items.processNodeList.length-1) && viewData.items.processStatus==5?'refuse':
                                    item.processNodeStatus==1 || item.processNodeStatus==2?'':
                                    item.processNodeStatus==3?'agreed':
                                    item.processNodeStatus==4?'refuse':'return'
                                    ]" 
                            > 
                                <div class="timeline-box">  
                                    <time>{{item.createTime}}</time>                             
                                    <article>
                                        <aside><img :src="item.handlerUserHeadLogo" :onerror="logo"></aside>
                                        <section>
                                            <h4>{{item.handlerUserName}}</h4>
                                            <p>{{i==0?'发起申请':i==(viewData.items.processNodeList.length-1) && viewData.items.processStatus==5?'已撤销':item.processNodeStatus==1?'待审批':item.processNodeStatus==2?'审批中':item.processNodeStatus==3?'审批通过':item.processNodeStatus==4?'审批不通过':'已转批'}}</p>
                                        </section>
                                    </article>
                                    <footer class="vux-1px-t" v-if="item.comment.length>0">{{item.comment}}</footer>
                                </div>
                            </timeline-item>
                         </timeline>   
                    </div>
                </div>
            </scroller>
            <div v-show="!isAddressBook">
                <div class="revocation"  v-if="type==1 && viewData.items.processStatus==2" @click="msgBtn(4)">撤销</div>
                <div class="approve"  v-else-if="type==2">
                    <span class="vux-1px-r"  @click="msgBtn(1)"><img src="@/images/job/agree.png" alt=""><strong>同意</strong></span>
                    <span  class="vux-1px-r"  @click="msgBtn(2)"><img src="@/images/job/cancel.png" alt="" ><strong>拒绝</strong></span>
                    <span class="vux-1px-r"  @click="msgBtn(3)"><img src="@/images/job/turn.png" alt=""><strong>转批</strong></span>
                    <span v-if="viewData.items.createUserId== userId"  @click="msgBtn(4)"><img src="@/images/work/icon-delete2.png" alt=""><strong>撤销</strong></span>                    
                </div>
            </div>
            <div v-transfer-dom>
                <popup v-model="msgShow2" position="bottom" should-rerender-on-show class="msg-comments">
                    <x-textarea v-model="comment" :max="200"></x-textarea>
                    <div class="comments-btn"><x-button :disabled="comment.length==0" @click.native="handleSubmit" type="primary" :show-loading='showLoading'>提交</x-button></div>
                </popup>
            </div>
            <confirm v-model="msgShow1"
                title=""                
                @on-confirm="handleSubmit">
                    <p style="text-align:center;">确定撤销吗？</p>
                </confirm>                                       
            <AddressBook @toggleAddress="toggleAddress" v-if="type==2" v-show="isAddressBook" :state1='1' :state2='3' :state3='0' :state4='0' :state5='1' />
        </div> 
        
    </div>
    
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Cell ,Group,Confirm,XTextarea,TransferDom,Previewer ,Popup ,Scroller ,XInput,XButton  , Timeline, TimelineItem, } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'
import AddressBook from '@/components/addressBook';
import {leaveData} from '@/constants/approval';
export default {
    name: 'approvingDetail',
    data() {
        return {
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
                }
            },
            isAddressBook:false,
            status:1,
            type:this.$route.query.type, 
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            processId:this.$route.query.processId,
            viewData:{},
            userName:this.$store.state.userInfo.user.trueName,
            name:this.$route.query.name,
            attachList:{},
            msgShow1:false,
            msgShow2:false,
            bntType:1,
            forwardHandleUserId:'',
            comment:'',
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"',
            imgBtnFlag:true,
            showLoading:false,
        }
    },
    directives: {
        TransferDom
    },
    created() {
        this.clearBtnApprovalhand();
        this.status=this.$route.query.status;
        document.title=this.$route.query.title;
        
    },
    mounted() {
        let obj={
             userId:this.userId,
             companyId:this.companyId, 
             processId:this.processId,
        }
        this.viewProcessHand(obj);
        if(this.status==2){
            this.scrollHeight="-35";
            this.selectedMemberHand([])
        }else{
            this.scrollHeight="0"
        }
    },
    watch: {
         viewProcessData(data){    
            if( Object.keys(data).length >0 ){ 
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{ 
                    //图片
                    let imgArr=[];
                    let filenum=0;
                    let fileList=[];
                    data.items.attachList.forEach(item => {
                        if(('jpg,png,gif,jpeg').indexOf(item.suffix)!=-1){
                            let picObj=item;
                            picObj.src=item.fileUrl;
                            imgArr.push(item);
                        }else{
                            filenum++;
                            fileList.push(item)
                        }                                                              
                    });
                    let imgObj={
                                imgArr,
                                filenum,
                                fileList,
                            }
                    this.attachList=imgObj;
                    this.viewData=data;
                }
            }
         },
         btnApprovalData(data){            
            if( Object.keys(data).length >0 ){ 
                
                let text;
                if(data.alert_msg){
                    text=data.alert_msg;
                }else{ 
                    if(this.bntType ==4){
                        this.msgShow1=false; 
                        text='撤销成功'
                    }else{
                        this.msgShow2=false; 
                        text='审批成功'
                    }
                    this.$router.go(-1) 
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
         
    },
    computed: {
        ...mapState({
            viewProcessData: state => state.oaprocess.viewProcessData,
            btnApprovalData:state => state.oaprocess.btnApprovalData,
            
            
        })       
    },
    methods: {
        ...mapMutations({
            selectedMemberHand: 'addressBook/SELECTED_MEMBER', 
             loadingHand: 'UPDATE_LOADING', 
             clearBtnApprovalhand:'oaprocess/CLEAR_BTNAPPROVAL',
        }),
        ...mapActions({
            viewProcessHand:'oaprocess/viewProcess',
            btnApprovalHand:'oaprocess/btnApproval',
            
        }),
        //转发
        toggleAddress(){            
            this.isAddressBook=false;
            this.forwardHandleUserId=this.$store.state.addressBook.selectedMember[0].userId;
            this.msgShow2=true;
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
        //弹窗
        msgBtn(type){
            this.bntType=type;
            if(type==4){
                this.msgShow1=true;                
            }else if(type==3){
                this.isAddressBook=true;
            }else{
                this.msgShow2=true;  
                if(type==1){
                    this.comment='同意';
                }else{
                    this.comment='';
                }
            }
        },
        //表单提交
        handleSubmit(){ 
            if(!this.showLoading){
                this.showLoading=true;
                let obj={
                    userId:this.userId,
                    processId:this.processId,
                    companyId:this.companyId,
                    operateType:this.bntType,
                    processNodeId:this.viewData.items.processNodeList[this.viewData.items.curProcessNodeOrder].processNodeId,
                }
                if(this.bntType!=4){
                    obj.comment=this.comment;
                }
                if(this.bntType ==3){
                    obj.forwardHandleUserId=this.forwardHandleUserId;
                }
                this.btnApprovalHand(obj)
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
            this.$router.push({ path: 'attachment' })
        },
        leaveHand(val){
             let text;
            leaveData.forEach(item => {
                if(item.value==val){
                    text=item.name;

                }
                                                                         
            });
            return text;
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
        Confirm,
        Previewer,
        AddressBook,
         Timeline, TimelineItem,
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
<style lang="less">
 @import './timeline.less';
    .msg-comments .weui-textarea{
        padding:5px !important;
    }
</style>

