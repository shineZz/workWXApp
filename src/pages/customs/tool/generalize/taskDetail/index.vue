<template>

    <div class="taskDetail">
        <!-- <scroller     
          lock-x  
          scrollbarY 
          height="-36"
           @on-scroll="OnScroll" 
           ref="scroller" 
          > -->
          <div class="taskDetail-content">
             <group class="video-all  group-mt0">
                <h5>上传视频文件</h5>
                <article>
                    <aside v-if="videoObj.pic.length==0" @click="videoHand"><x-icon type="ios-plus-empty" size="90"  class="upload-add"></x-icon></aside>
                    <section v-else class="video-he">
                        <span  @click="videoHand">重新上传</span>
                        <video :src="videoObj.videoFile" controls="" :poster="videoObj.pic" height="167" ></video>
                    </section>
                </article>
             </group>
             <FormA :moduleObj="moduleObj"/>
          </div>
        <!-- </scroller> -->
        <x-button type="primary" class="myPositionBtn" :disabel="isUploadLoading" :show-loading="isUploadLoading" @click.native="hideCom">立即保存</x-button>
        <div v-transfer-dom>
            <popup v-model="moduleObj2.videoPopupFlag" class="myPopup" position="right" width='100%' should-scroll-top-on-show :popup-style="{zIndex: 555}">
                <VideoPopup v-show="moduleObj2.videoPopupFlag" :moduleObj2="moduleObj2" :videoObj="videoObj" :hasCover='hasCover'/>
            </popup>
        </div>
    </div>
</template>

<script>
import { Scroller , XButton,Group ,Confirm,Popup,TransferDom} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex';
import FormA from '@/components/formA';
import VideoPopup from '../videoPopup';
let taskTimer; 
export default {
    name: 'taskDetail',
    data() {
        return {
            company_id:this.$store.state.userInfo.company.companyId,

            type:this.$route.query.type,
            urlFlagData:[],
            fileData:[],
            moduleObj:JSON.parse(JSON.stringify(this.moduleObj2.moduleObj)),
            videoObj:JSON.parse(JSON.stringify(this.moduleObj2.videoObj)),
            isUploadLoading:false,
            hasCover:false,
            resultArr:[]
        }
    },
    directives: {
        TransferDom
    },
     props:['moduleObj2'],
    created() {
        // this.$nextTick(function(){
        //     this.videoObj.pic=this.moduleObj2.videoObj.pic
        //     this.videoObj.videoFile=this.moduleObj2.videoObj.videoFile
        // })
    },
    methods: {
        ...mapActions({
            uploadattch_taskUploadAttch:'uploadattch/taskUploadAttch'
        }),
        ...mapMutations({
            UploadLoading:'UPDATE_LOADING'
        }),
        OnScroll(){
            this.$nextTick(() => {
                this.$refs.scroller.reset();
            })
        },
        hideCom(){
            
            let flag=false;
            if(this.videoObj.pic.length==0 && this.moduleObj.inputVal.length==0 && this.moduleObj.uploadData.length==0 ){
                flag=true;

            }
            
            if(flag){
                this.$vux.toast.show({
                    text: '任务详情未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:"20em"
                })    
                return
            };
            this.UploadLoading(true)
            this.isUploadLoading=true;
            // let _timer = null;
            // clearTimeout(_timer)
            
                  //图片数据重组            
                let fileData = [];
                let urlFlagData=[];
                if(this.moduleObj.uploadData.length>0){
                    this.moduleObj.uploadData.forEach((item,i) => {  
                        if(!item.name){
                            urlFlagData.push(item);
                        }else{
                            let objArr={origin_name:item.name,data:item.src}
                            fileData.push(objArr);
                        }
                    });
                }
                
                if(fileData.length>0){
                    this.fileData=fileData;
                    this.urlFlagData=urlFlagData;
                    let fileString = JSON.stringify(fileData)
                     this.$nextTick(function(){
                        setTimeout(()=>{
                            let obj={
                                img_type:'1',
                                type:this.type==1?'1':'5',
                                data_stream:fileString,                    
                            }
                            this.uploadattch_taskUploadAttch(obj);
                        },600)
                    })
                }else{
                    this.moduleObj2.videoObj= JSON.parse(JSON.stringify(this.videoObj)) ;
                    this.moduleObj2.moduleObj= JSON.parse(JSON.stringify(this.moduleObj)) ; 
                    this.moduleObj2.taskDetailFlag=false;
                    this.UploadLoading(false)
                    this.isUploadLoading=false;
                    this.$emit('toggle')
                }    
                // clearTimeout(_timer)  
           
            
            
                
        },
        //上传视频
        videoHand(){
            
            clearTimeout(taskTimer);
            taskTimer =setTimeout(() => {
                this.moduleObj2.videoPopupFlag=true;
                this.moduleObj2.moduleObj = this.moduleObj
            },200)
        },
       
    },
    computed: {
        ...mapState({
            taskUploadData:state => state.uploadattch.taskUploadData
        }),
        
    },
    watch:{
        'moduleObj2':{
            handler:function(newValue,oldValue){
                this.videoObj=newValue.videoObj
                this.moduleObj = newValue.moduleObj
            },
            deep:true,
        },
        taskUploadData(data){//编辑更新
            
            if(this.moduleObj2.taskDetailFlag && !this.moduleObj2.videoPopupFlag){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    this.isUploadLoading=false;
                    this.UploadLoading(false);
                }else{
                    // let fileData = [];
                    data.items.forEach((item,i) => {  
                        let obj={
                            src:item.url,
                            url:item.url,
                        }
                        this.resultArr.push(obj);
                    });
                    this.isUploadLoading=false;
                    this.UploadLoading(false);
                    let fileData = this.resultArr;
                    this.moduleObj.uploadData= this.urlFlagData.concat(fileData);
                    this.moduleObj2.videoObj= JSON.parse(JSON.stringify(this.videoObj)) ;
                    this.moduleObj2.moduleObj= JSON.parse(JSON.stringify(this.moduleObj)) ; 
                    this.moduleObj2.taskDetailFlag=false;
                    this.$emit('toggle')  
                    // if(this.resultArr.length>=this.fileData.length){
                    //     this.isUploadLoading=false;
                    //     this.UploadLoading(false);
                    //     let fileData = this.resultArr;
                    //     this.moduleObj.uploadData= this.urlFlagData.concat(fileData);
                    //     this.moduleObj2.videoObj= JSON.parse(JSON.stringify(this.videoObj)) ;
                    //     this.moduleObj2.moduleObj= JSON.parse(JSON.stringify(this.moduleObj)) ; 
                    //     this.moduleObj2.taskDetailFlag=false;
                    //     this.$emit('toggle')  
                    // }
                    
                }
            }
        },
    },
    components: {
        Scroller,
        XButton,
        Confirm ,
        Group,
        Popup,
        VideoPopup,
        FormA
    },
}
</script>
<style lang="less" scoped>
 @import './index.less';
</style>
