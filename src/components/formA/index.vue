<template>
            <div style="overflow: hidden;" class="form-a">
               <group :class="showVoice&&!moduleObj.disabledFlag&&moduleObj.record||showVoice&&moduleObj.disabledFlag&&moduleObj.recordObj.url?'record-box':''">
                    <x-textarea ref="inputVal" v-model="moduleObj.inputVal" :disabled="moduleObj.disabledFlag"  @on-change="textareaChange" :max="500" :class="['it-direction', {'has': moduleObj.inputVal}]" :title="moduleObj.title" :placeholder="moduleObj.placeholder"  :height="moduleObj.textareaHeight?moduleObj.textareaHeight:150" :rows="8" :cols="30"></x-textarea>
                    <div class="record" v-if="showVoice&&!moduleObj.disabledFlag&&moduleObj.record" @click="voiceHandS">
                        <!-- <img  src="~@/images/voice.png"  alt="点击录音"> -->
                        <span class="recordBtn"></span>
                    </div>
                    <div :class="showVoice&&!moduleObj.disabledFlag?'record-content-hasVoice':'record-content'" v-if="showVoice&&moduleObj.recordObj&&moduleObj.recordObj.url">
                        <span class="time">{{moduleObj.recordObj.duration}}''</span>
                        <i class="duration" @click="playHand"></i>
                        <audio ref="record" preload="auto" @ended="endHand" :src="moduleObj.recordObj&&moduleObj.recordObj.url?moduleObj.recordObj.url:''"></audio>
                    </div>
               </group>
               <group class="upload-all" v-if=" moduleObj.uploadFlag?false: !(moduleObj.disabledFlag && moduleObj.uploadData.length==0)">
                    <h5>{{moduleObj.uploadText || '附件图片'}}<span>(图片最多为5张)</span></h5>
                    <input style="display:none" id="task_log"  name="file" type="file" multiple accept="image/png,image/jpeg,image/gif" />
                    <div v-transfer-dom>
                        <previewer :list="moduleObj.uploadData" ref="previewer" :options="options" ></previewer>
                    </div>
                    <article>
                        <section  v-for="(item,index) in moduleObj.uploadData" :key="index">
                            <div class="gutter-box">
                                <div @click="viewPicHand(index)"><img :src="item.src" class="previewer-demo-img"></div>
                                <span v-if="!moduleObj.disabledFlag" @click="delPicHand(index)"><i></i></span>
                            </div>
                        </section>
                        <section v-if="moduleObj.disabledFlag?false: moduleObj.uploadData.length<5">
                            <div class="gutter-box" @click="UploadPic">
                                <x-icon type="ios-plus-empty" size="30"  class="upload-add"></x-icon>
                            </div>
                        </section>
                    </article>
               </group>
                <!-- <a class="vux-popup-mask vux-popup-show" href="javascript:void(0)" style="z-index: 501;" @click="voiceFlag = false"></a> -->
               <div v-transfer-dom >
                    <popup v-model="voiceFlag" :show-mask="false" :popup-style="{zIndex: 502}" class="popup" @click.native="voiceHand">    
                        <div  class="popup-voice"  ref='remove'>
                            <p class="record-img" @touchstart="touchstart"  @touchend="touchend"></p>
                            <p>{{voiceMsg}}</p>
                        </div>   
                    </popup>
                </div>
                <x-button type="primary" style="position:absolute;bottom:0;" :disabled="isLoading" :show-loading="isLoading" @click.native="toggle" v-if="moduleObj.showBtn">保存</x-button>
            </div>
</template>
<script>
import { XTextarea, Group,Previewer,TransferDom, XButton,  Popup, } from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';
import lrz from 'lrz';
let startTime,recordTimer;
export default {
    name: 'formA',
    
    // moduleObj.disabledFlag: true,传入为真的时候，为编辑状态
    // moduleObj.uploadFlag: true,不需要上传图片功能 
    // moduleObj.record: true      语音功能 
    // moduleObj.type: num         语音页面type 
    // moduleObj.recordObj: {      语音对象
    //      id: '',
    //      url: '',
    //      duration: '',
    //      sid: '',
    //      data: '',
    //  }
    // moduleObj.zs: true          语音招商api
    props:{        
        moduleObj:{
            required: true ,               
        },
    },
    data() {
        return {
            showVoice: true,    //显示录音键
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
            imgBtnFlag:true,
            voiceFlag: false, 
            voiceMsg:'按下开始录音',
            timeout:false,
            localId:'',//猎取企业微信录音id
            time:0,//多少秒录音 
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            //2018.8.30 dbj 调用 企业微信失败的时候
            qywxFlag:true,

        }
    },
    created() {
        // 请求企业微信         dbj 2018.8.30
        if (localStorage.getItem('phonePort') == 'qywx') {
            let obj_qywx = {
                crop_id: this.userInfo.wx_userDetail.corpid,
                url: location.href.split('#')[0]
            }
            this.$store.dispatch('qywxHand', obj_qywx)
        } else {
            this.showVoice = false            
        }
       
    },
    mounted() {
        document.activeElement.blur()
        if (this.moduleObj.record&&this.moduleObj.recordObj.duration) {
            let width = parseInt(this.moduleObj.recordObj.duration) * 6
            if (width<50) {
                width = 50
            }
            if (width>200) {
                width = 200
            }
            $('.duration').width(width)
        }
    },
    updated() {
        if (this.moduleObj.record&&this.moduleObj.recordObj.duration) {
            let width = parseInt(this.moduleObj.recordObj.duration) * 6
            if (width<50) {
                width = 50
            }
            if (width>200) {
                width = 200
            }
            $('.duration').width(width)
        }
    },
    methods: {
         ...mapActions({
            xfyun_getXfyunIat: 'xfyun/getXfyunIat',
            xfyun_getWxXfyunIat: 'xfyun/getWxXfyunIat',
        }),
         ...mapMutations({
            loadingHand: 'UPDATE_LOADING',            
        }),
        textareaChange(val){
            if (!val) {
                return
            }
            let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
            val = val.replace(reg,'')
            if(val.length>=500){
                val=val.substring(0,500)
            }
            this.$nextTick(()=>{
                this.moduleObj.inputVal = val
            })
            // this.moduleObj.inputVal = this.$refs.inputVal.currentValue = val
        },
        // 查看图片
        viewPicHand(index){
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
        // 删除图片
        delPicHand(index){
            this.moduleObj.uploadData=this.moduleObj.uploadData.filter((elem, i) => index !== i);
        },
        //上传图片
        UploadPic(id,index,num){
            let _this=this;
            $("#task_log").trigger("click").off('change').on('change', function (e) { 
                let num=_this.moduleObj.uploadData.length;
                let rFilter=/^(image\/jpg|image\/jpeg|image\/png)$/i;
                for (var files of this.files) {                       
                    if(!rFilter.test(files.type)){
                       
                        _this.$vux.toast.show({
                            text: '对不起，不支持此文件类型。',
                            type: 'text',
                            position: 'top',
                            width:"18em"
                        })
                         return
                    }
                    num++
                    if(num>5){
                        return
                    }
                    lrz(files,{width:1024})
                    .then(function (rst) {
                        // console.log("===============",rst.fileLen,"=================",rst.origin)
                        _this.moduleObj.uploadData.push({
                            src:rst.base64,
                            name:files.name,
                        })
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
                }
                
            });
           

        },
        toggle() {
            this.$emit('toggle',this.moduleObj)
        },
        voiceHand(ev){
            // ev = ev || event
            // console.log(ev)
            this.voiceFlag=false
        },
        //2018.8.30 dbj
        voiceHandS(){
            if(this.qywxFlag){
                this.voiceFlag=true; 
            }else{
                this.loadingHand(true);
                let obj_qywx = {
                    crop_id: this.userInfo.wx_userDetail.corpid,
                    url: location.href.split('#')[0]
                }
                this.$store.dispatch('qywxHand', obj_qywx);
            }
            
        },
        // hideHand(ev) { 
        //     ev = ev || event
        //     if ($(ev.target).attr('class')=='recordBtn') {
        //         return
        //     }
        //     this.voiceFlag = false
        // },
        touchstart(ev) {
            if (this.moduleObj.recordObj.duration&&!this.$refs.record.paused) {
                this.$refs.record.pause()
                this.$refs.record.load()
                $('.duration').removeClass('record-animate')
            }
            ev = ev || event
            ev.preventDefault()
            startTime = new Date().getTime()
                
            // 延时后录音，避免误操作
            recordTimer = setTimeout(() => {
                this.voiceMsg = '松开结束'
                this.timeout = false
                this.wx.startRecord({
                    success: function() {
                    },
                    cancel: function() {
                        alert('用户拒绝授权录音')
                        this.voiceFlag = false
                    }
                })

                //超过1分钟
                this.wx.onVoiceRecordEnd({
                    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                    complete: res => {
                        this.localId = res.localId
                        this.timeout = true
                        this.voiceFlag = false
                        this.touchend(ev)
                    }
                })
            }, 300)

        },
        touchend(ev) { 
            ev = ev || event
            ev.preventDefault()
            this.voiceMsg =' 按下开始录音'

            if (new Date().getTime() - startTime < 1000) {
                clearTimeout(recordTimer) //清除录音倒计时
                startTime = 0
                // 不录音
            }else if(this.timeout) {
                this.time = new Date().getTime() - startTime
                this.uploadVoice()
                // 超时
            } else { // 松手结束录音
                this.time = new Date().getTime() - startTime
                this.wx.stopRecord({
                    success: res => {
                        this.localId = res.localId;
                        // 上传到服务器
                        this.uploadVoice()
                    },
                    fail: res => {
                        this.voiceFlag = false
                        if (res.errMsg.indexOf("tooshort") != -1) {
                            this.$vux.toast.show({
                                text: '录音时间太短',
                                type: 'text',
                                position: 'top',
                                width:"18em"
                            })
                            return
                        }
                    }
                })
            }
        },
        //
        uploadVoice(){ 
            //调用微信的上传录音接口把本地录音先上传到微信的服务器
            //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
            this.wx.uploadVoice({
                localId: this.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: res => {
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        crop_id: this.userInfo.wx_userDetail.corpid,
                        media_id: res.serverId,
                        source: this.moduleObj.type
                    }
                    if (this.moduleObj.zs) {
                        this.xfyun_getWxXfyunIat(obj)
                    } else {
                        this.xfyun_getXfyunIat(obj)
                    }
                    // console.log(res,7777777777777)
                    // //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                    // $.ajax({
                    //     url: '后端处理上传录音的接口',
                    //     type: 'post',
                    //     data: JSON.stringify(data),
                    //     dataType: "json",
                    //     success: function (data) {
                    //         alert('文件已经保存到自己的服务器');
                    //     },
                    //     error: function (xhr, errorType, error) {
                    //         console.log(error);
                    //     }
                    // });
                }
            });
        },
        playHand() {
            if (this.$refs.record.paused) {
                this.$refs.record.play()
                $('.duration').addClass('record-animate')
                let time = this.moduleObj.recordObj.duration*1000
                setTimeout(() => {
                    if ($('.duration').hasClass('record-animate')) {
                        $('.duration').removeClass('record-animate')
                    }
                }, time);
            } else {
                this.$refs.record.pause()
                this.$refs.record.load()
                $('.duration').removeClass('record-animate')
            }
        },
        endHand() {
            $('.duration').removeClass('record-animate')
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            getXfyun: state => state.xfyun.getXfyun,
            userInfo: state => state.userInfo,
            qywxData: state => state.qywxData,
            wx:state => state.wx,
        })
    },
    watch: {
        //企业微信
        qywxData: function(data) {
            if(Object.keys(data).length > 0 && this.moduleObj.record) {
                this.loadingHand(false);
                this.qywxFlag=true; 
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"20em"      
                    })
                }else{
                    this.wx.config({
                        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                        debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:this.userInfo.wx_userDetail.corpid, // 必填，企业微信的corpID
                        timestamp:data.items.timestamp , // 必填，生成签名的时间戳
                        nonceStr: data.items.noncestr, // 必填，生成签名的随机串
                        signature:data.items.signature,// 必填，签名，见附录1
                        jsApiList:['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice']
                    })
                    // wx.ready(function(){                        
                    //     // wx.closeWindow();
                    // })
                    let _this=this;
                    this.wx.error(function(res){
                        //2018.8.30 dbj语音失败
                        var ua = window.navigator.userAgent.toLowerCase();
                        if(ua.match(/wxwork/i) == 'wxwork'){
                            _this.qywxFlag=false;       
                            _this.$vux.toast.show({
                                text: '点击重试语音录入功能',
                                type: 'text',
                                position: 'top',
                                width:"20em"
                            })        
                        }else{
                            localStorage.setItem('phonePort', 'weixin') ;
                            _this.showVoice = false
                        }
                        
                    });
                }
            }
        },
        getXfyun(data) {
            if(Object.keys(data).length > 0) {
                this.voiceFlag = false
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                }else{
                    this.moduleObj.recordObj = data.items
                    this.moduleObj.inputVal = this.moduleObj.inputVal + data.items.data
                    this.moduleObj.inputVal = this.moduleObj.inputVal.substring(0, 500)
                    let width = parseInt(this.moduleObj.recordObj.duration) * 6
                    if (width<50) {
                        width = 50
                    }
                    if (width>200) {
                        width = 200
                    }
                    this.$nextTick(()=>{
                        $('.duration').width(width)
                    })
                }
            }
        }
    },
    // beforeDestroyed() {
    //     this.$refs.record.pause()
    //     this.$refs.record.load()
    //     $('.duration').removeClass('record-animate')
    // },
    directives: {
        TransferDom
    },
    components: {        
        XTextarea,
        Group,
        Previewer,
        TransferDom,
        XButton,
         Popup,
    },  
    
}
</script>
<style lang="less">
.form-a .record-box .vux-no-group-title .weui-cell {
    padding: 10px 15px 43px;
}

.form-a input:disabled,.form-a input[disabled],.form-a textarea:disabled {
    background: #fff !important;
}

.form-a .has input:disabled,.form-a .has input[disabled],.form-a .has textarea:disabled {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
