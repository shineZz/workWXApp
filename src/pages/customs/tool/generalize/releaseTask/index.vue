<template>
    <div class="releaseTask">
                <div style="overflow:hidden;overflow-y:auto;position:absolute;top:0;bottom:36px;width:100%;" ref="my_scroll">
                    <group class="header-img form-has">
                        <div class="header" @click="UploadPic('#headerImg', 'headerImg')">
                            <span v-if="!headerImg">上传LOGO</span>
                            <img :src="headerImg.src" :alt="headerImg.name" v-else>
                            <input style="display:none" id="headerImg" name="file" type="file" accept="image/png,image/jpeg,image/gif" :disabled="changeFlag" />
                        </div>
                        <x-textarea 
                            v-model="taskTitle" 
                            :rows="1" 
                            autosize 
                            :show-counter="false" 
                            :max="30"
                            ref='taskTitle'
                            @on-change="changeVal" 
                            placeholder="任务标题（必填）" 
                            :disabled="changeFlag"/>
                        <cell  :value="moduleObj.inputVal?'请点击查看或编辑':'任务描述'"   is-link @click.native="titleHand" value-align="left" class="cell-word" :class="{'has': moduleObj.inputVal.length>0}"/>
                    </group>
                    <group>
                        <div class="myels" @click="toggleReleaseLabel" v-if="type==2">
                            <div class="myelsTitle">
                                推荐内容：
                            </div>
                            <div class="myelsContent">
                                <div class="mylistA">
                                    <section>
                                        <div class="myfd" v-if="releaseContent.length>1">
                                            <span v-for="(i,index) in releaseContent" :key="index">{{i.name}}</span>
                                        </div>
                                        <div v-if="releaseContent.length==1" class="noContent" >{{releaseContent[0]}}</div>
                                    </section>
                                </div>
                            </div>
                            <div class="myelsIcon ">
                                <x-icon type="ios-arrow-forward" class="vux-x-icon" size="18"></x-icon>
                            </div>
                        </div>
                        <datetime
                            v-model="startTime"
                            title="起始时间："
                            format="YYYY-MM-DD"
                            @on-change="startChange"
                            placeholder="请选择起始时间（必选）" 
                            :start-date="timingStartDate"
                            
                        />
                        <datetime
                            v-model="endTime"
                            title="终止时间："
                            format="YYYY-MM-DD"
                            @on-change="endChange"
                            placeholder="请选择终止时间（必选）"
                            :start-date="timingStartDate"
                            />
                        <cell 
                            v-if="type==2" 
                            v-model="industry" 
                            title="所属行业：" 
                            value-align="left" 
                            :class="industry&&industry!='请选择所属行业（必填）'?'hasVal':''"
                            is-link 
                            @click.native="toggleIndustry"
                        ></cell>
                    </group>
                    <group  class="form-has">
                        <group-title slot="title">                           
                             <x-icon type="ios-help" size="20" class="icon-help"  @click="markHand"></x-icon>
                        </group-title>                        
                        <x-input 
                            v-model="taskNum" 
                            title="任务总数：" 
                            type="text" 
                            value-align="left" 
                            :placeholder="type==1?'请填写份数最少1000份（必填）':'请填写份数最少100份（必填）'"
                            ref="taskNum"
                            :max="10"
                            @on-blur="taskNumBlur"
                            @on-change="taskChange" 
                             @on-focus="taskFocus"
                            :disabled="changeFlag ||inputFlag"
                           
                            >
                        </x-input>
                        <x-input 
                            v-model="taskOneMoney" 
                            title="单次奖励</br>佣金：" 
                            type="text" 
                            value-align="left" 
                            placeholder="请填写佣金（必填）"
                            @on-blur="oneMoneyBlur"
                            @on-focus="oneMoneyFocus"
                            @on-change="oneMoneyChange" 
                            :disabled="changeFlag ||inputFlag"
                            >
                        </x-input>
                        <cell  :value="taskOneIntegral"  v-if="type==1"   value-align="left" class="has">
                            <span slot="title" class="wh5">单次奖励<br />积分：</span>
                        </cell>
                        <cell  :value="taskTerraceMoney?taskTerraceMoney:'自动计算佣金'"   value-align="left" :class="{'has': taskTerraceMoney}">
                            <span slot="title" class="wh5">平台单次<br />服务佣金：</span>
                        </cell>
                        
                        <cell  :value="allMoney?allMoney:'自动计算总佣金'"    value-align="left" :class="{'has': allMoney}">
                            <span slot="title" class="wh5">总佣金：</span>
                        </cell>
                        <cell v-if="type==1"  :value="taskAllIntegral?taskAllIntegral:'自动计算总积分'"    value-align="left" :class="{'has': taskAllIntegral}">
                            <span slot="title" class="wh5">总积分：</span>
                        </cell>
                        <cell  
                            :value="moduleObj2.videoObj.pic.length==0 && moduleObj2.moduleObj.inputVal.length==0 && moduleObj2.moduleObj.uploadData.length==0?'请编写任务详情（必填）':'点击查看并编写任务详情'" 
                             is-link @click.native="DetailHand" value-align="left" class="cell-word" :class="{'has': !(moduleObj2.videoObj.pic.length==0 && moduleObj2.moduleObj.inputVal.length==0 && moduleObj2.moduleObj.uploadData.length==0)}">
                             <span slot="title" class="wh5">任务详情：</span>
                        </cell>
                    </group>
                    <group >
                        <x-input 
                            v-model="linkMan" 
                            title="联系人：" 
                            value-align="left" 
                            placeholder="请填写联系人"
                            :max="10"
                            @on-change="inputChange"
                            :disabled="changeFlag"
                            >
                        </x-input>
                        <x-input 
                            v-model="linkPhone" 
                            title="咨询电话：" 
                            value-align="left" 
                            placeholder="请填写电话"
                            type="text" 
                            :max="11"
                            @on-change="phoneChange"
                            @on-blur="phoneBlur"
                            :disabled="changeFlag"
                            >
                        </x-input>
                        <x-input 
                            v-model="couponCode" 
                            title="优惠券码：" 
                            value-align="left" 
                            placeholder="请填写优惠券码"
                            @on-change="couponCodeChange"
                            :max="30"
                            :disabled="changeFlag"
                        >
                        </x-input>
                    </group>
                </div>
            <!-- </scroller> -->
            <x-button v-if="!isDisabled" type="primary" class="submit-btn" :disabled="isLoading" :show-loading="isLoading" @click.native="releaseTask">立即提交</x-button>        
        <div v-transfer-dom>
            <popup v-show="isDescribe" position="right" width='100%'>
                 <FormA :moduleObj="moduleObj" @toggle="toggle" v-if="isDescribe"/>
            </popup>
            <popup v-show="isMark" position="right" width='100%' should-scroll-top-on-show>
                 <MarkMore :type="type" />
            </popup>
            <popup v-model="isIndustry" position="right" width='100%' v-if="isIndustry" should-scroll-top-on-show>
                 <MyIndustry :industryValue="industryInit" propsState="1"  @toggleIndustry="toggleIndustry" />
            </popup>
            <popup v-model="isReleaseLabel" v-if="isReleaseLabel" position="right" width='100%'>
                  <labels propState="5" propTitle="推荐内容" @toggleLabel="toggleReleaseLabel" :propsFields="recommedFields" />
            </popup>
            <popup v-show="moduleObj2.taskDetailFlag" position="right" width='100%' should-scroll-top-on-show>
                  <Detail  :moduleObj2="moduleObj2" @toggle="modelHand"  v-if="moduleObj2.taskDetailFlag" />
            </popup>
        </div>
        
    </div>
</template>

<script>
import { Scroller , XButton ,XInput,Group,Cell,Datetime,PopupPicker,GroupTitle,TransferDom,Popup,numberComma,trim,XTextarea} from 'vux';
import { mapState,mapActions,mapMutations } from 'vuex';
import {leaveData,timeDate} from '@/constants/approval';
import MyIndustry from '@/components/industry';
import labels from '@/components/labels';
import MarkMore from '@/components/mark';
import Describe from '../describe';
import Detail from '../taskDetail';
import FormA from '@/components/formA';
import lrz from 'lrz';
import {objDeepCopy,checkMobile,checkTel,checkEmoji,currentDate,checkEmojiRn} from '@/util/index';
let taskTimer;
export default {
    name: 'releaseTask',
    data() {
        return {
            changeFlag:'true',
            isLabel:false,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            taskTitle:'',
            headerImg:null,
            taskDescribe:'',
            describeVal:'任务描述',
            releaseContent:['请选择推荐内容（必填）'],
            validity:"请选择有效期（必填）", 
            industry:"请选择所属行业（必填）",
            recommedFields:[],
            taskDetail:"请编写任务详情（必填）",
            taskNum:"",//任务总数
            taskOneMoney:"",//任务单次奖励佣金
            taskTerraceMoney:"",//平台单次服务佣金
            taskOneIntegral:'3',//单次奖励积分
            taskAllIntegral:'',//奖励总积分
            
            allMoney:'',//总佣金
            linkMan:"",
            couponCode:'',
            isIndustry:false,
            //时间限制
            timeDate:timeDate,
            timeVal:['1'],
            startTime:"",
            endTime:"",
            //
            isReleaseLabel:false,
            isMark:false,
            type:1,//1位推广2为猎客
            subContent:'',
            isDescribe:false,
            isDisabled:false,
            linkPhone:this.$store.state.userInfo.user.mobile,
            height:"-36",
            industry_cat_id:'',//所属行业以及行业id
            sec_industry_cat_id:'',//二级行业id
            isDetail:false,
            moduleObj2:{
                moduleObj:{
                    placeholder:'最多填写500个字,语音录入可自动转换文字和保存录音' ,
                    max:500,
                    inputVal:'',
                    uploadData:[],
                    uploadText:'详情图片',
                    record: true,
                    zs:true,
                    recordObj: {
                        id: '',
                        url: '',
                        data: '',
                        duration: '',
                    },
                    type: 14, 
                },
                videoObj:{
                    pic:'',
                    videoFile:'',
                },
                videoPopupFlag:false,
                taskDetailFlag:false,
            },
            moduleObj3:{
                moduleObj:{
                    placeholder:'最多填写500个字,语音录入可自动转换文字和保存录音' ,
                    max:500,
                    inputVal:'',
                    uploadData:[],
                    uploadText:'详情图片',
                    record: true,
                    zs:true,
                    recordObj: {
                        id: '',
                        url: '',
                        data: '',
                        duration: '',
                    },
                    type: 14, 
                },
                videoObj:{
                    pic:'',
                    videoFile:'',
                },
                videoPopupFlag:false,
                taskDetailFlag:false,
            },
            moduleObj: {
                title: '备注',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                zs:true,
                max: 500,
                inputVal: '',
                uploadData:[],
                record: true,
                uploadFlag:true,
                showBtn:true,
                record: true,
                zs:true,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 3,
            },
            industryInit:{
                one:'',
                two:'',
                three:'',
                name:''
            },
            isEdit:'4',
            formDisabled:false,
            isLoading:false,

            numberCommaFlag:false,
            timingStartDate:'',
            inputFlag:false,
        }
    },
    created() {
        this.type = this.$route.query.type;
        this.timingStartDate=currentDate();
    
        if(this.type==2){
            this.moduleObj.type=6;
            this.moduleObj2.moduleObj.type=6;
            this.moduleObj3.moduleObj.type=6;
        }else{
            this.moduleObj.type=3;
            this.moduleObj2.moduleObj.type=3;
            this.moduleObj3.moduleObj.type=3;
        }
        if(this.$route.query.id){
            this.editRecommendTask()
            this.changeFlag=true
        }else{
            this.changeFlag = false
        }
    },
    directives: {
        TransferDom
    },
    mounted(){
        if(this.releaseContent.length==1){
            $('.myels .vux-cell-primary span').css('border','none')
        }else{
            $('.myels .vux-cell-primary span').css('background','#66aef4')
            $('.myels .vux-cell-primary span').css('color','#fff')
        }
        
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
            
        }),
        ...mapActions({
            recommend_updateRecomTask:'recommend/updateRecomTask',
            recommend_getRecomTaskInfo:'recommend/getRecomTaskInfo',
            recommend_getTaskFields:'recommend/getTaskFields',
            promotion_updateProTask:'promotion/updateProTask',
            promotion_getProTaskInfo:'promotion/getProTaskInfo',
            
        }),
        //获取任务详情
        editRecommendTask(){
            let obj = {
                company_id:this.company_id,
                task_id:this.$route.query.id
            }
            if(this.$route.query.type==2){
                this.recommend_getRecomTaskInfo(obj)
                let obj1 = {
                    task_id:this.$route.query.id
                }   
                this.recommend_getTaskFields(obj1)
            }else{
                this.promotion_getProTaskInfo(obj)
            }
        },
        //上传图片
        UploadPic(el, obj){
            let _this=this
            $(el).trigger("click").off('change').on('change', function (e) {
                let rFilter=/^(image\/jpg|image\/jpeg|image\/png)$/i;
                let files=this.files[0];
                if(!rFilter.test(files.type)){
                    _this.$vux.toast.show({
                        text: '对不起，不支持此文件类型。',
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                }
                lrz(files)
                .then(function (rst) {
                    _this[obj] = {
                        src: rst.base64,
                        name: files.name

                    }
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
            })
        },
        accMul(arg1,arg2){ 
            var m=0,s1=arg1.toString(),
            s2=arg2.toString(); 
            try{
                m+=s1.split(".")[1].length
            }catch(e){} 
            try{
                m+=s2.split(".")[1].length
            }catch(e){} 
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
        },
        //发布或编辑任务
        releaseTask(){
            if (this.formDisabled) {
                return
            }
            
            let title = trim(this.taskTitle);
            if(title.length==0){
                this.$vux.toast.show({
                    text: "任务标题未填写，请填写",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return;
            }
            if(this.$route.query.type=='2'){
                if(this.releaseContent.length<2){
                    this.$vux.toast.show({
                        text: '推荐内容未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return;
                }
            }
            let startTime = this.startTime;
            if(startTime.length==0){
                this.$vux.toast.show({
                    text: "任务开始时间未填写，请填写",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return false;
            }
            let currentTime=currentDate();
            var date = new Date();
            var getHours = date.getHours();
            var strDate = date.getMinutes();
            var seconds = date.getSeconds();
            if (getHours >= 0 && getHours <= 9) {
                getHours = "0" + getHours;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds;
            }

            currentTime= currentTime+' '+getHours+':'+ strDate+':'+seconds ;
            // currentTime=  Number(currentTime.replace(/-/g,'')+getHours+strDate) ;
            // let start_time=this.startTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
            // if(Number(start_time)<Number(currentTime)){
            //     this.$vux.toast.show({
            //         text: "任务开始时间不能小于当前时间",
            //         type: 'text',
            //         position: 'top',
            //         width:'20em'
            //     })
            //     this.startTime='';
            //     return false;
            // }
            let endTime = this.endTime;
            if(endTime.length==0){
                this.$vux.toast.show({
                    text: "任务终止时间未填写，请填写",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return false;
            }
            if(this.$route.query.type=='2'){
                if(this.industry=='请选择所属行业（必填）'){
                    this.$vux.toast.show({
                        text: '所属行业未选择，请选择',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    return false;
                }
            }
            let number = this.taskNum;
            if(number.length==0){
                this.$vux.toast.show({
                    text: "任务总数未填写，请填写",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return false;
            }
            if(this.taskOneMoney.length==0){
                this.$vux.toast.show({
                    text: '单次奖励佣金未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return ;
            }
            if(this.moduleObj2.videoObj.pic.length==0 && this.moduleObj2.moduleObj.inputVal.length==0 && this.moduleObj2.moduleObj.uploadData.length==0){
                this.$vux.toast.show({
                    text: '任务详情未填写，请填写',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                return false;
            }
            if(this.linkPhone.length>0&&!checkMobile(this.linkPhone)){
                this.$vux.toast.show({
                    text: '咨询电话格式不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"20em"
                })
                this.linkPhone =''
                return false;
            }
            if(!this.isLoading){
                 this.isLoading=true;
                 let obj={
                        company_id:this.company_id,                  //	true	int	企业ID
                        user_id:this.user_id, //用户ID
                        task_name:this.taskTitle,                  //	true	string	任务标题
                        task_desc:this.moduleObj.inputVal,                  //	false	string	任务描述
                        // start_time:this.startTime+':00',                  //	true	date	任务开始时间

                        
                        start_time:currentTime,
                        end_time:this.endTime+' 23:59:59',                  //	true	date	任务结束时间
                        link_man:this.linkMan,                  //	false	string	企业联系人姓名
                        link_phone:this.linkPhone,                  //	false	string	联系人电话
                        task_amount:this.taskNum,                  //	true	float	任务总量
                        gold_coin_amount:this.taskOneMoney.replace(/,/g,''),                  //	true	float	单次奖励佣金
                        total_gold_coin:this.allMoney.replace(/,/g,''),                  //	false	float	任务总佣金
                        note:this.moduleObj2.moduleObj.inputVal,
                        act:'addBaseInfo',
                        service_commission:this.taskTerraceMoney.replace(/,/g,''),//平台单次服务佣金
                        coupon_sn:this.couponCode,
                 }
                        
                  // 详情视频
                    if(this.moduleObj2.videoObj && this.moduleObj2.videoObj.pic.length>0){
                        obj.desc_video_img=this.moduleObj2.videoObj.pic
                        obj.desc_video_url=this.moduleObj2.videoObj.videoFile
                    }
                    let _arr =[]
                    let _str = ''
                    if(this.moduleObj2.moduleObj.uploadData.length>0){
                        let len=this.moduleObj2.moduleObj.uploadData.length
                        for(let i=0;i<len;i++){
                            _arr.push(this.moduleObj2.moduleObj.uploadData[i].url)
                        }
                        obj.desc_imgs = JSON.stringify(_arr)
                    }

                    let src=null;
                    if(this.headerImg){
                        obj.task_logo_data=this.headerImg.src
                    }
                    if(this.$route.query.id){
                        obj.task_id=this.$route.query.id
                    }
                    //音频
                    if (this.moduleObj.recordObj&&this.moduleObj.recordObj.url) {
                        obj.task_desc_video_url = this.moduleObj.recordObj.url
                        obj.task_desc_video_duration = this.moduleObj.recordObj.duration
                    }
                    if (this.moduleObj2.moduleObj.recordObj&&this.moduleObj2.moduleObj.recordObj.url) {
                        obj.note_audio_url = this.moduleObj2.moduleObj.recordObj.url;
                        obj.note_audio_time = this.moduleObj2.moduleObj.recordObj.duration;                        
                    }
                  if(this.$route.query.type==2){
                      obj.recommand_type_id=1;                  //	true	int	任务类型ID：1-招商任务；2-推荐任务；3-推荐任务
                      obj.industry_cat_id=this.industry_cat_id;  
                      obj.sec_industry_cat_id=this.sec_industry_cat_id;  
                      obj.recommand_fields=this.subContent;  

                      obj.desc_type='4';  
                        this.recommend_updateRecomTask(obj)

                  }else{
                      obj.task_type_id=1;                  //	true	int	任务类型ID：1-招商任务；2-推荐任务；3-推荐任务
                      obj.integral_amount='3';  
                      obj.total_integral=this.taskAllIntegral;   
                      obj.content_from='4'; 
                    this.promotion_updateProTask(obj)
                  }


            }
            
        },

        //标题
        changeVal(value){
            if(!value || this.formDisabled){
                return false;
            }
            let val = checkEmojiRn(value);
            this.$nextTick(()=>{
                this.taskTitle = val
            })
        },
        //请输入联系人
        inputChange(value){
            if (!value || this.formDisabled) {
                return
            }
            let val =checkEmoji(value);
            this.$nextTick(()=>{
                this.linkMan = val
            })
        },

        // 电话
        phoneChange(value) {
            if(!value || this.formDisabled){
                return false;
            }
            let val = value.replace(/[^0-9]/g,'');
            this.$nextTick(()=>{
                this.linkPhone = val
            })
           
        },
        phoneBlur(val){
            if(val.length>0 && !checkMobile(val)){
                this.formDisabled=true;
                 this.$vux.toast.show({
                    text: '咨询电话格式不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                clearTimeout(taskTimer);
                taskTimer =setTimeout(() => {
                    this.formDisabled=false;
                },1500)
            }            
        },
        // input改变
        couponCodeChange(value) {
            if(!value || this.formDisabled){
                return false;
            }
            let val =checkEmoji(value)
            this.$nextTick(function(){
                this.couponCode = val
            })
        },
        //了解更多 
        markHand(){
            if( this.formDisabled){
                return ;
            }
            this.isMark=true;
        },
        titleHand(){
            if( this.formDisabled){
                return ;
            }
            this.isDescribe=true;
        },
        // 行业
        toggleIndustry(res){
            clearTimeout(taskTimer);
            taskTimer =setTimeout(() => {
                this.isIndustry = !this.isIndustry
            },300)
            if(res.type!='click'){
                let _obj = JSON.parse(res)
                this.industryInit=_obj
                this.$nextTick(function(){
                    if(_obj.one){
                        this.industry_cat_id = _obj.one //	fasle	int	行业大类
                        this.sec_industry_cat_id =_obj.two	//fasle	int	行业小类
                        this.industry = _obj.name
                    }else{
                        this.industry='请选择所属行业（必填）'
                    }
                    
                    if(this.releaseContent[0]!=="请选择推荐内容（必填）"){
                        $('.myels .vux-cell-align-left').css('color',"#333")
                        $('.myels .vux-cell-align-left span').css('fontSize',"14px")
                    }else{
                        $('.myels .vux-cell-align-left span').css('border',"none")
                    }
                    $('.my-industry .vux-cell-align-left').css('color',"#333")
                })
                
            }
            this.$nextTick(function(){
                if(this.releaseContent[0]!=="请选择推荐内容（必填）"){
                    $('.myels .vux-cell-align-left').css('color',"#333")
                    $('.myels .vux-cell-align-left span').css('fontSize',"14px")
                }else{
                    $('.myels .vux-cell-align-left span').css('border',"none")
                }
            })
        },
        toggleReleaseLabel(labelContent){
            clearTimeout(taskTimer);
            taskTimer =setTimeout(() => {
                this.isReleaseLabel = !this.isReleaseLabel
            },300)
            if(typeof(labelContent)!=='undefined'&&labelContent.type!='click'){
                this.releaseContent = labelContent
                let _string=''
                labelContent.forEach(function(items){
                    _string += items.tr_filed_id+','
                })
                this.subContent = _string.substr(0,_string.length-1)
                let _arr = objDeepCopy(labelContent) 
                _arr.forEach(function(item){
                    item.tr_filed_id=item.value
                })
                this.recommedFields = _arr
            }
        },
        toggle(data){
            this.isDescribe=!this.isDescribe
        },
        //时间限制
        startChange(value) {
            let endTime=this.endTime;
            if(endTime.length>0){                
                endTime=endTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let startTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(Number(startTime)> Number(endTime) ){
                   this.$vux.toast.show({
                        text:'起始时间不能大于终止时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    })
                    this.$nextTick(function(){
                        this.startTime='';
                    })
                    
                }
            }
        },
        endChange(value){
            let startTime=this.startTime           
            if(startTime.length>0){                
                startTime=startTime.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                let endTime=value.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
                if(Number(endTime)< Number(startTime) ){
                   this.$vux.toast.show({
                        text:'起始时间不能大于终止时间',
                        type: 'text',
                        position: 'top',
                        width:"22em"                                
                    })
                    this.$nextTick(function(){
                        this.endTime='';
                    })
                }
            }
        },

        //任务总数 
        taskChange(value){           
            if(!value.length){
                return;
            }
            let text;
                if(value.length==1){
                    text = value.replace(/[^1-9]/g,''); 
                }else{
                    text = value.replace(/[^0-9]/g,''); 
                }          
            this.$nextTick(function(){
                this.taskNum=text
            })
            this.formDisabled=true;
        },
        taskFocus(value){
             this.formDisabled=true;
             this.inputFlag=false;
            if(!value){
                return;
            }
           
            
        },
        taskNumHand(num,flag){
            if(!flag){
                this.taskNum=num; 
                this.inputFlag=true;
            }   
            let taskNum=Number(this.taskNum);
            if(this.type==1){
                this.taskAllIntegral= taskNum*  Number(this.taskOneIntegral) ;   
            }                                     
            if(this.taskOneMoney.length>0){   
                             
                let taskOneMoney=Number(this.taskOneMoney.replace(/,/g,''))
                    
                let taskTerraceMoney= Math.floor(taskOneMoney*0.2 * 100) / 100 ; 
                this.allMoney= numberComma(Math.floor(taskNum*(taskOneMoney+taskTerraceMoney ) * 100) / 100) ;
                this.taskTerraceMoney=numberComma(taskTerraceMoney)
                

            }
            
            clearTimeout(taskTimer);
            taskTimer =setTimeout(() => {
                this.formDisabled=false;
                 this.inputFlag=false;
            },1000)
        },
        taskNumBlur(value){           
            let text = value
            let num;
                if(this.type==1){
                    num='1000';
                }else{
                    num='100';
                }
            if(text.length==0){
                this.$vux.toast.show({
                    text: '任务总数不能为空',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                this.taskNumHand(num)
                 return false;
            }else if(text.length>0&&Number(text)<Number(num)){
                this.$vux.toast.show({
                    text: "请填写份数最少"+num+"份",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                this.taskNumHand(num)
                return false;
            }else{
                 this.taskNumHand(text,true)
                
            }
          
        },
        //单次奖励
        oneMoneyHand(flag){
            let taskOneMoney=Math.floor(Number(this.taskOneMoney) * 10) / 10  ;
            let taskTerraceMoney= Math.floor(taskOneMoney*0.2 * 100) / 100;
            if(this.taskNum>0){
                let taskNum=Number(this.taskNum)
                if(this.type==1){                        
                    this.taskAllIntegral= taskNum*  Number(this.taskOneIntegral) ;   
                } 
                this.allMoney= numberComma( Math.floor(taskNum*(Number(taskOneMoney)+taskTerraceMoney ) * 100) / 100  );
              
            }
            this.taskOneMoney=numberComma(taskOneMoney);
             this.taskTerraceMoney=numberComma(taskTerraceMoney);
             
             this.inputFlag=true;
             clearTimeout(taskTimer);
            taskTimer =setTimeout(() => {
                this.formDisabled=false;
                 this.inputFlag=false;
            },1000)
        },
        oneMoneyBlur(value){
            let text =value;
            this.numberCommaFlag=false;
            if(text.length==0){
                this.$vux.toast.show({
                    text: '单次奖励佣金不能为空',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                });
                this.$nextTick(function(){
                    this.taskOneMoney=0.1;
                    this.oneMoneyHand()
                })
                
            }else if(text==0){
                this.$vux.toast.show({
                    text: "单次奖励佣金大于0",
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                this.$nextTick(function(){
                    this.taskOneMoney=0.1;
                    this.oneMoneyHand()
                })
            }else{
                this.$nextTick(function(){                    
                    this.oneMoneyHand();
                })
            }
        },
        oneMoneyFocus(value){
           
            this.formDisabled=true;   
            this.numberCommaFlag=true;
            this.inputFlag=false;
            let text =value.replace(/,/g,'');
            this.$nextTick(function(){                
                this.taskOneMoney=text
            })  
            
            if(!value){
                return;
            }       
               
        },
        oneMoneyChange(value){
            if(!value.length){
                return;
            }
            let text=value;
                if(this.numberCommaFlag){
                     text=value.replace(/[^\d.]/g, "");
                     
                    //必须保证第一个为数字而不是. 
                    text = text.replace(/^\./g, "");
                    //保证只有出现一个.而没有多个. 
                    text = text.replace(/\.{2,}/g, ".");
                    //保证.只出现一次，而不能出现两次以上 
                    text = text.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                    
                    text=text.substring(0,10)
                    var re = /([0-9]+\.[0-9]{1})[0-9]*/;
                    text = text.replace(re,"$1");
                }
            this.$nextTick(function(){
                this.taskOneMoney=text
            })
            this.formDisabled=true;  
        },
        DetailHand(){
            if(this.formDisabled){
                return
            }else  if(this.isEdit==4){
               this.moduleObj2.taskDetailFlag=true;
           }else{
               this.$vux.toast.show({
                    text: '不可编辑',
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
           }
            
        },
        
        modelHand(){
             this.moduleObj3= JSON.parse(JSON.stringify(this.moduleObj2));
        }
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            updateRecomData:state => state.recommend.updateRecomData,
            recomInfoData:state=>state.recommend.recomInfoData,
            recommendTaskFiledsData:state=>state.recommend.recommendTaskFiledsData,
            updateProData:state=>state.promotion.updateProData,
            proInfoData:state=>state.promotion.proInfoData,
        }),
        
    },
    watch:{
        //推广任务详情
        proInfoData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                let _data = data.items
                this.taskTitle=_data.taskInfo.task_name;
                this.taskDescribe='点击查看任务描述'
                this.moduleObj.inputVal=_data.taskInfo.task_desc
                this.taskNum=_data.taskInfo.task_amount;
                this.taskOneMoney=numberComma(Number(_data.taskInfo.gold_coin_amount));
                this.taskTerraceMoney=numberComma(Number(_data.taskInfo.service_commission));
                this.taskAllIntegral=Number(_data.taskInfo.total_integral);
              
                let allMoney=Number(_data.taskInfo.task_amount)*(Number(_data.taskInfo.gold_coin_amount)+Number(_data.taskInfo.service_commission))
                this.allMoney= numberComma(Math.floor(allMoney * 100) / 100)
                this.startTime=_data.taskInfo.start_time.substring(0,10);
                this.endTime=_data.taskInfo.end_time.substring(0,10);
                this.linkMan=_data.taskInfo.link_man;
                this.linkPhone=_data.taskInfo.link_phone;
                this.couponCode = _data.taskInfo.coupon_sn;
                this.moduleObj.disabledFlag=false;
                this.moduleObj2.disabledFlag=false;
                this.moduleObj.showBtn=true;
                let _imgArr = []
                for(let i=0;i<5;i++){
                    if(_data.taskInfo.proDetail['desc_img'+(i+1)]){
                        let obj = {
                            url:_data.taskInfo.proDetail['desc_img'+(i+1)],
                            src:_data.taskInfo.proDetail['desc_img'+(i+1)]
                        }
                        _imgArr.push(obj)
                    }
                }
                this.moduleObj2.videoObj.videoFile=_data.taskInfo.proDetail.desc_video_url
                this.moduleObj2.videoObj.pic=_data.taskInfo.proDetail.desc_video_img
                this.moduleObj2.moduleObj.inputVal=_data.taskInfo.proDetail.note
                this.moduleObj2.moduleObj.uploadData=_imgArr
                this.isEdit = _data.taskInfo.proDetail.content_from

                 this.moduleObj2.moduleObj.recordObj.url=_data.taskInfo.proDetail.note_audio_url
                this.moduleObj2.moduleObj.recordObj.duration=_data.taskInfo.proDetail.note_audio_time
                 this.moduleObj.recordObj.url=_data.taskInfo.task_desc_video_url;
                this.moduleObj.recordObj.duration=_data.taskInfo.task_desc_video_duration;
                if(_data.taskInfo.task_cover_org){
                    this.headerImg={
                        src:_data.taskInfo.task_cover_org
                    }
                    
                }                
                this.$nextTick(()=>{
                    this.$refs.taskTitle.updateAutosize()
                    this.changeFlag = false
                    this.moduleObj3= JSON.parse(JSON.stringify(this.moduleObj2));
                    
                        this.formDisabled=false
                })

            }
            document.title="编辑任务"
        },
        updateProData(data){    
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                setTimeout(() => {
                    this.isLoading=false;
                },1500)
            }else{
                if(this.$route.query.id){
                    this.$vux.toast.show({
                        text: '编辑成功',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                    
                }else{
                    this.$vux.toast.show({
                        text: '发布成功',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }
                this.$router.go(-1)
            }
        },
        recommendTaskFiledsData(data){//推荐内容
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                let _data =data.items
                _data.forEach(function(item){
                    item.value=item.tr_filed_id
                    item.name=item.field_name
                    
                })
            
                this.recommedFields=_data

                this.releaseContent=this.recommedFields
                let _string = ''
                _data.forEach(function(item){
                    _string+=item.tr_filed_id+','
                })
                _string = _string.substr(0,_string.length-1)
                this.subContent = _string
            }
        },
        recomInfoData(data){//推荐详情
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                let _data = objDeepCopy(data.items)
                this.taskTitle=_data.taskInfo.task_name;
                this.taskDescribe='点击查看任务描述'
                this.moduleObj.inputVal=_data.taskInfo.task_desc
                this.taskNum=_data.taskInfo.task_amount;
                this.taskOneMoney=numberComma(Number(_data.taskInfo.gold_coin_amount));
                this.taskTerraceMoney=numberComma(Number(_data.taskInfo.service_commission));
                this.taskAllIntegral=_data.taskInfo.task_amount;
                let allMoney=Number(_data.taskInfo.task_amount)*(Number(_data.taskInfo.gold_coin_amount)+Number(_data.taskInfo.service_commission))
                this.allMoney= numberComma(Math.floor(allMoney * 100) / 100)
                
                // this.startTime=_data.taskInfo.start_time.substring(0,_data.taskInfo.start_time.length-3);
                // this.endTime=_data.taskInfo.end_time.substring(0,_data.taskInfo.end_time.length-3);
                this.startTime=_data.taskInfo.start_time.substring(0,10);
                this.endTime=_data.taskInfo.end_time.substring(0,10);
                this.linkMan=_data.taskInfo.link_man;
                this.linkPhone=_data.taskInfo.link_phone;
                this.couponCode = _data.taskInfo.coupon_sn;
                this.moduleObj.disabledFlag=false;
                this.moduleObj2.disabledFlag=false;
                this.moduleObj.showBtn=true;
                this.industry_cat_id=_data.taskInfo.industry_cat_id;
                this.sec_industry_cat_id=_data.taskInfo.sec_industry_cat_id;
                this.isEdit = _data.taskInfo.recomDetail.desc_type;
                if(_data.taskInfo.task_cover_org){
                    this.headerImg={
                        src:_data.taskInfo.task_cover_org
                    }
                }
                let _imgArr = []
                for(let i=0;i<5;i++){
                    if(_data.taskInfo.recomDetail['desc_img'+(i+1)]){
                        let obj = {
                            url:_data.taskInfo.recomDetail['desc_img'+(i+1)],
                            src:_data.taskInfo.recomDetail['desc_img'+(i+1)]
                        }
                        _imgArr.push(obj)
                    }
                }
                this.moduleObj2.videoObj.videoFile=_data.taskInfo.recomDetail.desc_video_url
                this.moduleObj2.videoObj.pic=_data.taskInfo.recomDetail.desc_video_img
                this.moduleObj2.moduleObj.inputVal=_data.taskInfo.recomDetail.note
                this.moduleObj2.moduleObj.uploadData=_imgArr
                
                 this.moduleObj2.moduleObj.recordObj.url=_data.taskInfo.recomDetail.note_audio_url
                this.moduleObj2.moduleObj.recordObj.duration=_data.taskInfo.recomDetail.note_audio_time
                 this.moduleObj.recordObj.url=_data.taskInfo.task_desc_video_url;
                this.moduleObj.recordObj.duration=_data.taskInfo.task_desc_video_duration;
                this.industry = _data.taskInfo.sec_industry_cat_name
                this.industryInit={
                    one:_data.taskInfo.industry_cat_id,
                    two:_data.taskInfo.sec_industry_cat_id,
                    name:_data.taskInfo.sec_industry_cat_name
                }
                this.$nextTick(()=>{
                    this.$refs.taskTitle.updateAutosize()
                    this.changeFlag = false
                    this.moduleObj3= JSON.parse(JSON.stringify(this.moduleObj2));
                    this.formDisabled=false;
                })
            }
            document.title="编辑任务";
        },
        updateRecomData(data){//编辑更新
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
                setTimeout(() => {
                    this.isLoading=false;
                },1500)
            }else{
                if(this.$route.query.id){
                    this.$vux.toast.show({
                        text: '编辑成功',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }else{
                    this.$vux.toast.show({
                        text: '发布成功',
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    })
                }
                this.$router.go(-1)
            }
        },
        
    },
    beforeRouteLeave(to, from, next) {
        if(this.moduleObj2.taskDetailFlag){
            if(this.moduleObj2.videoPopupFlag){
              this.moduleObj2.videoPopupFlag=false;  
            }else{
                this.moduleObj2= JSON.parse(JSON.stringify(this.moduleObj3));
                
                // this.moduleObj2.taskDetailFlag=false;  
            }
             next(false);
        }else  if(this.isDescribe||this.isIndustry||this.isReleaseLabel||this.isDetail||this.isMark){
            this.isDescribe=false;
            this.isIndustry=false;
            this.isReleaseLabel=false
            this.isDetail=false
            this.isMark=false
            // return ;
            next(false);
        }else{
            next();
        }
        
    },
    components: {
        Scroller,
        XButton,
        XInput,
        Group,
        Cell,
        Datetime,
        PopupPicker,
        MyIndustry,
        GroupTitle,
        MarkMore,
        Describe,
        Detail,
        FormA,
        Popup,
        labels,
        XTextarea
    },
}
</script>

<style lang="less">
 @import './index.less';
</style>

<style lang="less" scoped>
 @import '../../../../../css/listA.less';
</style>
