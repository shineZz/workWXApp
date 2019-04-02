<template>

    <div class="videoPopup">
        <scroller     
          lock-x  
          scrollbarY 
          height="-36"
           @on-scroll="OnScroll" 
           ref="scroller" 
          >
          <div style="overflow:hidden" >
             <group class="video-all   group-mt0">
                <h5>上传视频封面图</h5>
                <article>
                    <aside v-if="pic.length==0" @click="videoHand(1)"><x-icon type="ios-plus-empty" size="90"  class="upload-add"></x-icon></aside>                    
                    <section v-else class="video-he">
                        <span  @click="videoHand(1)">重新上传</span>
                        <img :src="pic"/>
                    </section>
                </article>
                 <input type="file" id="file1" style="display:none" accept="image/png,image/jpeg,image/gif">
             </group>
              <group class="video-all">
                <h5>上传视频文件</h5>
                <article class="fixArticle">
                    <aside v-if="videoFile.length==0" @click="videoHand(2)"><x-icon type="ios-plus-empty" size="90"  class="upload-add"></x-icon></aside>
                    <section v-else class="video-he">
                        <span  @click="videoHand(2)">重新上传</span>
                        <video :src="videoFile"  controls height="167"></video>
                    </section>
                </article>
                <input type="file" id="file2" name="video" accept="video/*" style="display:none"  >
             </group>
          </div>
        </scroller>
        <div class="buttn-more"><x-button type="primary"  @click.native="cancelHand">取消</x-button><x-button type="primary" @click.native="primaryHand">立即保存</x-button></div>
    </div>
</template>
<script>
import { Scroller , XButton,Group ,GroupTitle,Confirm,XTextarea,} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex';
import FormA from '@/components/formA';
import lrz from 'lrz';
import axios from 'axios';
import { API_PARM_OBJ, ZSAPI_URL,LG_AES_ZSAPI,LG_AES_SALT_ZS } from '@/constants/interface';
import * as aes from '@/util/lgaes';

export default {
    name: 'taskDetail',
    data() {
        return {
            
            pic:JSON.parse(JSON.stringify(this.videoObj.pic)),
            videoFile:JSON.parse(JSON.stringify(this.videoObj.videoFile)),
            typeNum:this.$route.query.type,
            company_id:this.$store.state.userInfo.company.companyId, 
            video_file:'',
        }
    },
    props:['videoObj','moduleObj2'],
    created() {
        // if(JSON.parse(JSON.stringify(this.videoObj.videoFile))){
        //     this.video_file = JSON.parse(JSON.stringify(this.videoObj.videoFile))
        // }
    },
    watch:{
        //上传封面
        taskUploadData(data){//编辑更新
            if(this.moduleObj2.videoPopupFlag){
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{
                    this.pic=data.items[0].url;
                }
            }
        },
    },
    methods: {
        ...mapMutations({
             loadingHand: 'UPDATE_LOADING',
        }),
        ...mapActions({
            uploadattch_taskUploadAttch:'uploadattch/taskUploadAttch'
        }),
        cancelHand(){
           this.moduleObj2.videoPopupFlag=false;
        },
        primaryHand(){
            if(this.pic.length==0){
                this.$vux.toast.show({
                            text: '封面图未上传，请上传',
                            type: 'text',
                            position: 'top',
                            width:"20em"
                        })    
                return
            }
            if(this.videoFile.length==0 ){
                this.$vux.toast.show({
                        text: '视频未上传，请上传',
                        type: 'text',
                        position: 'top',
                        width:"20em"
                    })    
                    return
            }
           
            this.moduleObj2.videoPopupFlag=false;
             this.videoObj.videoFile=JSON.parse(JSON.stringify(this.videoFile)) ;
            this.videoObj.pic = JSON.parse(JSON.stringify(this.pic)) ;
        },
        OnScroll(){
            this.$nextTick(() => {
                this.$refs.scroller.reset();
            })
        },
        getFileURL(file) {

            var getUrl = null;

            if (window.createObjectURL != undefined) { // basic

            getUrl = window.createObjectURL(file);

            } else if (window.URL != undefined) { // mozilla(firefox)

            getUrl = window.URL.createObjectURL(file);

            } else if (window.webkitURL != undefined) { // webkit or chrome

            getUrl = window.webkitURL.createObjectURL(file);

            }

            return getUrl;

        },
        videoHand(type){
            let _this=this;
            $("#file"+type).trigger("click").off('change').on('change', function (e) {
                let files=this.files[0];
                let _url = _this.getFileURL(files)
                let fileType = files.type
                if(type==2){
                    if(!/video/.test(files.type)){
                        _this.$vux.toast.show({
                            text: '请选择视频类型文件',
                            type: 'text',
                            position: 'top',
                            width:"20em"
                        }) 
                        return ;
                    }
                }
                
                if(files.size>64*1024*1024 && type==2){
                    
                     _this.$vux.toast.show({
                            text: '对不起，视频大小不能超过64MB的视频',
                            type: 'text',
                            position: 'top',
                            width:"20em"
                        })            
                }
                // else if(files.size>2*1024*1024 && type==1){
                //      _this.$vux.toast.show({
                //             text: '对不起，图片大小不能超过2MB的JPG/PNG图片',
                //             type: 'text',
                //             position: 'top',
                //             width:"20em"
                //         })
                // }
                else{
                    
                    if(type==1){
                        lrz(files).then(function (rst) {
                            //图片数据重组            
                            let fileData = [{
                                origin_name:files.name,data:rst.base64,
                            }];
                            let obj={
                                img_type:'1',
                                type:_this.typeNum==1?'3':'8',
                                data_stream:JSON.stringify(fileData),
                            
                            }
                            _this.uploadattch_taskUploadAttch(obj);
                            })
                        .catch(function (err) {
                            // 处理失败会执行
                            _this.$vux.toast.show({
                                text: '对不起，上传失败',
                                type: 'text',
                                position: 'top',
                                width:"18em"
                            })
                            return
                        })
                    }else{
                       //加密
                            if(LG_AES_ZSAPI){
                                aes.setCryptKey(LG_AES_SALT_ZS);
                            }
                            let obj={  
                                type:_this.typeNum==1?'2':'6',                          
                            }
                            let param = new FormData()  // 创建form对象   
                            param.append('app_key',LG_AES_ZSAPI?(aes.encrypt(API_PARM_OBJ.app_key)):API_PARM_OBJ.app_key);
                            param.append('v', LG_AES_ZSAPI?(aes.encrypt(API_PARM_OBJ.v)):API_PARM_OBJ.v);
                            param.append('company_id',LG_AES_ZSAPI?(aes.encrypt(_this.company_id)):_this.company_id);
                            param.append('sig', LG_AES_ZSAPI?(aes.encrypt(API_PARM_OBJ.sig)):API_PARM_OBJ.sig);
                            param.append('type', LG_AES_ZSAPI?(aes.encrypt(obj.type)):obj.type);
                            param.append('field_name',files);
                            param.append('files_name',LG_AES_ZSAPI?(aes.encrypt('field_name')):'field_name');
                            _this.loadingHand(true)        
                            $.ajax({
                                url:ZSAPI_URL+'/uploadattch/uploadFile',
                                type: 'POST',
                                data: param,
                                //async: false,
                                cache: false,
                                contentType: false,
                                processData: false,
                                success:function(res){
                                     _this.loadingHand(false)
                                    let data=$.parseJSON(res).data;  
                                    if(data.alert_msg){                        
                                         _this.$vux.toast.show({
                                            text:  data.alert_msg,
                                            type: 'text',
                                            position: 'top',
                                            width:"18em"                                            
                                        })
                                    }else{
                                        _this.videoFile=data.items[0].url;
                                    }

                                }
                            });
                            
                    }

                }
                
            });
        },


    },
    computed: {
        ...mapState({
            taskUploadData:state => state.uploadattch.taskUploadData
        }),
        
    },
    components: {
        Scroller,
        XButton,
        GroupTitle,
        Confirm ,
        XTextarea,
        FormA,
        Group,
    },
}
</script>

<style lang="less" scoped>
 @import '../taskDetail/index.less';
</style>
