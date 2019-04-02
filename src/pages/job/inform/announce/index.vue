<template>
        <div class="announce router-all" style="overflow:hidden">
            <div v-if='!isCommon&&!isAddressBook? true : false' class="router-box">
                <group>
                    <x-input :show-clear="false" title="公告主题" placeholder="(必填)" v-model="noticeVal" placeholder-align="right" text-align="right"></x-input>
                </group>
                <group>
                    <cell title="所属栏目" is-link @click.native="gainCommon" :value="column" :class="column!=='(必选)' ? 'hasVal' :'noVal'">                            
                    </cell>
                    <popup-picker title="下达范围" :data="list" v-model="scopeVal" :columns="1" show-name @on-change="scaleChange"></popup-picker>
                    <cell title="范围选择" :value="scale.length+'个'" is-link @click.native="gainScale" :class="scale.length!==0 ? 'hasVal' :'noVal'"></cell>                       
                </group> 
                <group>
                    <x-switch title="是否置顶" v-model="placed"></x-switch>
                </group>
                <FormA :moduleObj="moduleObj"  v-on:uploadDataList="uploadDataList" />    
            </div>
            <x-button v-if='!isCommon&&!isAddressBook? true : false' :disabled="isDisabled" :show-loading='isDisabled' type="primary" @click.native="dynamicHand">发布</x-button>
            <Common @toggleCommon="toggleCommon" :status="status" v-if='isCommon'/>
            <AddressBook @toggleAddress="toggleAddress" v-show="isAddressBook" :state1="0" :state2="1" :state3="1" :state4="isCompany" :state5="0"/>
        </div>
</template>

<script>
import {   Cell , Group,XButton,  Scroller , XInput,XSwitch,PopupPicker } from 'vux'
import { mapState, mapActions,mapMutations } from 'vuex'
import FormA from '@/components/formA'
import Common from '../../comment'    
import AddressBook from '@/components/addressBook'            
// let status=false;
export default {
    name: 'Notice',
    data() {
        return {
           
            list:[
                {
                    name: '用户',
                    value: '1',
                    parent: 0
                }, {
                    name: '部门',
                    value: '2',
                    parent: 0
                },
            ],
            isCommon:false,
            isAddressBook:false,
            status:8,
            scopeVal:['1'],
            moduleObj:{
               placeholder:'输入文字不得超过500字(必填)' ,
               title:'公告内容',
               max:500,
               inputVal:'',
               uploadData:[],               
           },
           placed:false,//是否置顶
           noticeVal:'',//公告主题  
           column:"(必选)",//所属栏目
           scale:[],//范围
           isIs:true,
           isCompany:0,
           company_id:this.$store.state.userInfo.company.companyId,
           user_id:this.$store.state.userInfo.user.userId,
           noticeBoard:[],
           anBoardId:'',  
           isDisabled:false,  
        }
    },
    created() {
        // status=false;
        this.SELECTED_MEMBER([]);
    },
    mounted() {
        
        let obj = {}
        obj.userId = this.user_id
        obj.companyId = this.company_id
        obj.page = 1
        obj.count = 100
        obj.type = '1'
        this.SearchNoticeBoard(obj)
        let obj1 = {}
        obj1.companyId = this.company_id
        this.GetDepartMentList(obj1)//获取组织架构列表
        // let that = this 
        // wx.onHistoryBack(function(){
        //     that.isBack = false;
        //     return false;
        // });
    },
    updated(){
    },
    methods: {
        ...mapMutations({
            SELECTED_STATE:'addressBook/SELECTED_STATE',
            SELECTED_MEMBER:'addressBook/SELECTED_MEMBER',
            INITCOMPANYOBJ:'addressBook/INITCOMPANYOBJ',
            CHANGECOMPANY:'addressBook/CHANGECOMPANY',
            loadingHand:"UPDATE_LOADING"
        }),
        ...mapActions({
            SearchNoticeBoard:'oanotice/SearchNoticeBoard',
            GetDepartMentList:'addressBook/GetDepartMentList',
            Save_Notice:'oanotice/SaveNotice'
        }),
        //上传图片
        uploadDataList: function (data){
            if(data>=4){
                this.$nextTick(() => {
                    this.$refs.scroller.reset();
                })
            }
        },
        scaleChange(value){
            if(value[0]==1){
                this.isCompany=0
                this.CHANGECOMPANY(0)
                this.scale=this.$store.state.addressBook.selectedMember
            }else if(value[0]==2){
                this.isCompany=1
                this.CHANGECOMPANY(1)
                this.scale=this.$store.state.addressBook.selectedPost
            }
        },
        gainScale(){
            this.toggleAddress()
            
            let that = this
            let arr = this.$store.state.addressBook.storeUserList;
            let selectMember = this.$store.state.addressBook.selectedMember;
            
        },
        gainCommon(){
            this.toggleCommon()
        },
        toggleCommon(){
            this.isCommon=!this.isCommon
            let that = this
            this.$store.state.addressBook.selectedState.filter(function(item){
                if(item.id==0){
                    if(item.value){
                        that.source=item.value
                    }
                }else if(item.id==1){
                    if(item.value){
                        that.status=item.value
                    }
                }else if(item.id==4){
                    if(item.value){
                        that.address=item.value
                    }
                }else if(item.id==5){
                    if(item.value){
                        that.scale=item.value
                    }
                }else if(item.id==6){
                    if(item.value){
                         that.nature=item.value
                    }
                }else if(item.id==7){
                    if(item.value){
                        that.industry=item.value
                    }
                    
                }else if(item.id==8){
                    if(item.value){
                        that.column=item.value
                    }
                    
                }
            })
        },
        toggleAddress(){
            this.isAddressBook=!this.isAddressBook
            if(this.scopeVal[0]==1){
                this.scale=this.$store.state.addressBook.selectedMember
                document.title='下达用户'
            }else if(this.scopeVal[0]==2){
                this.scale=this.$store.state.addressBook.selectedPost
                document.title='下达部门'
                
            }
            if(!this.isAddressBook){
                document.title="发布公告"
            }
        },
        dynamicHand(){
            let noticeVal=$.trim(this.noticeVal);  
            // 公告主题
            if(noticeVal.length==0){
                this.$vux.toast.show({
                    text: '请输入公告主题',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                this.noticeVal='';
                return
            }
            if(this.column=='(必选)'){
                this.$vux.toast.show({
                    text: '请选择所属栏目',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return
                
            }
            //范围
            if(this.scale.length==0){
                this.$vux.toast.show({
                    text: '请选择公告范围',
                    type: 'text',
                    position: 'top',
                    width:'15em'
                })
                return ;
            }
            //公告内容
            let inputVal=$.trim(this.moduleObj.inputVal); 
            if(inputVal.length==0){
                this.$vux.toast.show({
                    text: '请输入公告内容',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                this.moduleObj.inputVal='';
                return
            }      
            let that = this
            
            let isTop 
            if(this.placed){
                isTop='1'
            }else{
                isTop='0'
            }
            let newUserList = []
            let userList
            let deptIds 
            this.isDisabled = true
            let obj = {
                    userId:this.user_id,
                    companyId:this.company_id,
                    subject:noticeVal,
                    content:inputVal,
                    boardId:this.$store.state.addressBook.selectedState[9].boardId,
                    isTop:isTop,
                }
            if(this.scopeVal[0]==1){
                that.$store.state.addressBook.selectedMember.filter(function(item){
                    
                    newUserList.push(item.userId)
                })
                userList = newUserList.join(",")
                
                obj.userIds = userList
            }else if(this.scopeVal[0]==2){
                deptIds = that.$store.state.addressBook.selectedPost.join(',')
                obj.deptIds = deptIds
            }
            let fileData = [];
            this.moduleObj.uploadData.forEach((item,i) => {  
                let objArr={origin_name:item.name,data:item.src}
                fileData.push(objArr);
            });
            if(fileData.length>0){
                    obj.fileData=JSON.stringify(fileData) 
            }
            this.Save_Notice(obj); 
        },
    },
    computed: {
        ...mapState({
            selectedPost:state => state.addressBook.selectedPost     ,
            isSuccess:state => state.oanotice.isSuccess                   
        })
        
    },
    watch: {
        isCompany:function(value){
        },
        selectedPost:function(data){
            if(this.scopeVal[0]==1){

            }else{
                this.scale = data;
            }
        },
        isSuccess:function(data){
            this.isDisabled=false;
            let text;
            if(data.alert_msg){
                text=data.alert_msg;                
            }else{
                text='发布成功！';
                // status=true;
                this.$router.go(-1)
            }
            this.$vux.toast.show({
                    text: text,
                    type: 'text',
                    position: 'top',
                    width:'20em',
                })
        },
    },
    //dbj 2018/6/22
    // beforeRouteLeave(to, from, next) {
    //     if(status){
    //         to.meta.keepAlive = false;          
    //     }else{
    //        to.meta.keepAlive = true;            
    //     }
    //     next();
    // },
    components: {
        Cell , Group,XButton,  Scroller , XInput, PopupPicker,
        FormA,
        XSwitch,
        Common,
        AddressBook,
    },
}
</script>

<style lang="less">
.announce{
    .hasVal .weui-cell__ft{
        color: #333;
    }
    .noVal .weui-cell__ft{
        color:#a2a2a2;
    }
}
</style>
