<template>
    <div>
            <div v-if="Object.keys(AreaAuditArr).length >0 " >
                <popup v-model="screeningShow" :show-mask="false" class="screening-msg">
                    <div class="progress-hd-msg vux-1px-b">
                        <header class="progress-hd">
                            <div>进度：{{dealerHand(dealer_audit_status)}}</div>
                            <div>区域：{{AredName()}}</div>
                            <div  class="screening-btn"  :class="screeningShow ? 'vux-cell-arrow-up' : 'vux-cell-arrow-down'"   @click="screeningShowBtn">筛选</div>
                        </header>
                    </div>
                     <scroller lock-x height="-73" scrollbarY>
                         <group>
                            <cell
                                is-link
                                :arrow-direction="showContent0 ? 'up' : 'down'"
                                @click.native="showContent0 = !showContent0">
                                <span slot="title" >推广详情：<strong>{{dealerHand(dealer_audit_status_s)}}</strong></span>
                            </cell>
                            <div class="screening-bd screening-bd-20" :class="showContent0?'screening-animate':''">
                                <checker  class="screening-list" v-model="dealer_audit_status_s" radio-required  selected-item-class="cur">
                                    <checker-item  v-for="(item,index) in  audit_list(AreaAuditArr.items.audit)" :value="item.dealer_audit_status" :key="index"><span>{{item.name}}</span></checker-item>                               
                                </checker>
                            </div>
                            <cell
                                is-link
                                :arrow-direction="showContent1 ? 'up' : 'down'"
                                @click.native="showContent1 = !showContent1">
                                <span slot="title" >所在省市：
                                    <strong>{{provincesCities()}}</strong>
                                </span>
                            </cell>
                            <div class="region-box">
                                <ul class="screening-list-ul">
                                    <li @click="AreaSinaHand" :class="AreaIndex1==AreaSinaIndex1 &&  AreaIndex2==AreaSinaIndex2 ? 'cur':'' " v-if="againFlag"><span><img src="~@/images/positioning.png">{{AreaSinaCity}}</span></li>
                                    <li class="cur" v-else><span><inline-loading></inline-loading>定位中</span></li>
                                </ul>
                                <div @click="againHand"><img src="~@/images/refresh.png">重新定位</div>
                            </div>
                            <div class="screening-bd" :class="showContent1?'screening-animate':''">
                                <div class="weui-cell vux-tap-active weui-cell_access">
                                    <div class="vux-cell-bd vux-cell-primary">
                                        <p><label class="vux-label">
                                            <span >省份</span></label> 
                                        </p> 
                                    </div> 
                                </div>
                                <checker  class="screening-list" v-model="AreaIndex1" radio-required  selected-item-class="cur" @on-change="AreaHand">
                                    <checker-item  v-for="(item,index) in  audit_list(AreaAuditArr.items.regionInfo.info)" :value="index" :key="index"><span>{{item.region_name}}</span></checker-item>
                                </checker>
                                <div class="weui-cell vux-tap-active weui-cell_access" v-if="!(AreaIndex1 =='-1'|| AreaIndex1 =='0') ">
                                    <div class="vux-cell-bd vux-cell-primary">
                                        <p><label class="vux-label">
                                            <span >城市</span></label> 
                                        </p> 
                                    </div> 
                                </div>
                                <checker v-if="AreaIndex1!='-1'" class="screening-list" v-model="AreaIndex2" radio-required  selected-item-class="cur">
                                    <checker-item  v-for="(item,index) in  audit_list(AreaAuditArr.items.regionInfo.info[AreaIndex1].sonRegion)" :value="index" :key="index"><span>{{item.region_name}}</span></checker-item>
                                </checker>
                            </div>
                        </group>

                     </scroller>
                    
                    <footer><x-button :disabled="screeningShowLoad" @click.native="screeningShowHand" type="primary">确定</x-button></footer>
                </popup>
            </div>
            <div>
                <previewer :list="imgUrl" ref="previewer" ></previewer>
                <header class="progress-hd">
                    <div>进度：{{dealerHand(dealer_audit_status)}}</div>
                    <div>区域：{{AredName()}}</div>
                    <div  class="screening-btn"  :class="screeningShow ? 'vux-cell-arrow-up' : 'vux-cell-arrow-down'"   @click="screeningShowBtn">筛选</div>
                </header>
                <div v-if="Object.keys(scheduleData).length == 0 "></div>
                <div class="wu-all" v-else-if="scheduleData.num_items==0">
                    <section>
                        <div><img src="~@/images/wu-icon1.png"></div>
                        <p>暂无{{dealerHand(dealer_audit_status)}}信息</p>
                    </section>
                </div>
                <scroller lock-x v-else scrollbarY @on-scroll-bottom="loadMore" @on-pulldown-loading="refresh" v-model="status"  use-pulldown ref="scroller" height="-36" :scroll-bottom-offst="0">
                    <div>                    
                        <div class="progress-bd">
                            <input style="display:none" id="task_log"  name="file" type="file"  /> 
                            <ul>
                                <li v-for="(item,index) in scheduleData.items" :class="item.brands?'cur':''" :key="index">
                                    <h6 @click="CurHand(index)">招商任务：{{item.task_name}}</h6>
                                    <article>
                                        <header class="hd ">                            
                                            <p>推荐经销商：{{item.dealer_name}}</p>
                                            <p>推荐业务员：{{item.user_name}}</p>
                                            <p>业务员电话：{{item.user_phone}}</p>
                                        </header>
                                        <timeline v-if="item.flowlist.length>0" class="bd vux-1px-t">
                                            <timeline-item v-for="(it,i) in item.flowlist" :key="i">
                                                <p>
                                                    {{it.add_time}} <span 
                                                        @click="
                                                        (item.contract_url.length>0 && it.status_text=='上传合同')?upShow(index,1):
                                                            (item.pay_voucher_url.length>0 && it.status_text=='上传打款凭证')?upShow(index,2):
                                                            (item.receive_voucher_url.length>0 && it.status_text=='上传收货凭证')?upShow(index,3):''"   
                                                        :class="[ i== 0 ? it.status==2?'recent': 'orange-cor' :
                                                        (item.contract_url.length>0 && it.status_text=='上传合同') ||
                                                        (item.pay_voucher_url.length>0 && it.status_text=='上传打款凭证') ||
                                                        (item.receive_voucher_url.length>0 && it.status_text=='上传收货凭证')?'orange-cor':''
                                                        ]"
                                                    >
                                                        {{
                                                            (item.contract_url.length>0 && it.status_text=='上传合同')?'已上传合同':
                                                            (item.pay_voucher_url.length>0 && it.status_text=='上传打款凭证')?'已上传打款凭证':
                                                            (item.receive_voucher_url.length>0 && it.status_text=='上传收货凭证')?'已上传收货凭证':it.status_text 
                                                        }} 
                                                        {{it.tmaf_id==11?'(驳回:'+it.note+')':''}}
                                                    </span>
                                                </p>                                                
                                            </timeline-item>
                                        </timeline>
                                        <footer>
                                            <a v-if="item.audit_status==1 " @click="UploadContract(item.tub_dealer_id,index,1)"  href="javascript:void(0)"><img src="~@/images/upload.png"><span>上传合同</span></a>
                                            <a v-else-if="item.audit_status==2 && item.flow_audit_status==5" @click="UploadContract(item.tub_dealer_id,index,2)"  href="javascript:void(0)"><img src="~@/images/upload.png"><span>上传打款凭证</span></a>
                                            <a v-else-if="item.audit_status==2 && item.flow_audit_status==7 " @click="UploadContract(item.tub_dealer_id,index,3)"  href="javascript:void(0)"><img src="~@/images/upload.png"><span>上传收货凭证</span></a>
                                            <a @click="viewDetails(item)" href="javascript:void(0)" >查看详情</a>
                                        </footer> 
                                    </article>                                
                                </li>
                            </ul>
                        </div>
                        <load-more tip="加载中" v-if="loadFlag" ></load-more>  
                        <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div>   
                    </div>
                    <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                        <span v-show="status.pulldownStatus === 'default'"></span>
                        <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉刷新</span>
                        <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放刷新</span>
                        <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
                    </div>
                
                </scroller>
            </div>
    </div>
    
</template>

<script>
import { Scroller,TransferDom,Popup,Cell,Group,Checker,CheckerItem,Timeline, TimelineItem   ,LoadMore,XButton,InlineLoading,Previewer,Divider} from 'vux'
import { mapState,mapActions,mapMutations  } from 'vuex';
import lrz from 'lrz'; 
// let phonePort = localStorage.getItem('phonePort')=='weixin'?'':localStorage.getItem('phonePort'); 
let phonePort;
export default {
    name: 'Progress',
    directives: {
        TransferDom
    },
    data() {
        return { 
            page:1,
            count:5,
            task_id:JSON.parse(localStorage.getItem('progressOdbj')).task_id,
            dealer_audit_status:JSON.parse(localStorage.getItem('progressOdbj')).dealer.toString(),//进程在第几
            dealer_audit_status_s:JSON.parse(localStorage.getItem('progressOdbj')).dealer.toString(),//进程在第几
            company_id:this.$store.state.userInfo.company.companyId,
            province_id:'',
            city_id:'',
            province_name:'',
            city_name:'',
            loadFlag:true ,//加载图标 要不 要显示
            onFetching:false,//要不要滚动加载
            onload:true,//要不要滚动加载
            ArrData:[],
            scheduleData:{},//数据
            status: {
                pulldownStatus: 'default'
            },
            pulldown:false,
            //弹窗下拉
            showContent0:false,
            showContent1:false,
            screeningShow: false,//弹窗显示
            //地区ID
            AreaIndex1: '-1',
            AreaIndex2: '-1',
            AreaIndex_s1: '-1',
            AreaIndex_s2: '-1',
            AreaAuditArr:{},
            //获得现在省和市
            AreaSinaProvince:'',
            AreaSinaCity:'',
            AreaSinaIndex1:'',
            AreaSinaIndex2:'',            
            againFlag:true,//重新定位中
            AreaSinaIndexFlag:false,
            screeningShowLoad:false,
            imgUrl:[],
            imgBtn:true,
            AreaFlag:true,
            //上传图片
            listNum:0,
            listType:1,
            imgFlag:true,
        }
    },
    created() {
        let obj={
            page:this.page,
            count:this.count,
            dealer_audit_status:this.dealer_audit_status,
            company_id:this.company_id,
            task_id:this.task_id,
        }
        this.loadingHand(true)
        this.CLEAR_SCHEDULELIST();       
        this.merchant_ScheduleList(obj);
        //省市区
         this.merchant_AreaAudit();
        //新浪地址
        setTimeout(() => {            
            //端口 phonePort为undefined 代表不是企业微信 进来或者 是app进来
            // localStorage.removeItem('phonePort')
            if (!phonePort) {
                this.areaSinaHand()                 
            }else{
                if(phonePort=='qywx'){
                    let obj_qywx = {
                        crop_id: this.userInfo.wx_userDetail.corpid,
                        url:location.href.split('#')[0]
                    }
                    this.qywxHand(obj_qywx) 
                }else{
                    //app
                }                               
            }           
        },1000)
        
    },
    computed: {
        ...mapState({
            scheduleListData:state => state.merchants.scheduleListData, 
            AreaAuditData:state=>     state.merchants.AreaAuditData,      
            areaSinaData:state=>state.areaSinaData,
            uploadBtnData:state=>     state.task.uploadBtnData,     
            //企业微信     
            qywxData:state => state.qywxData,   
            userInfo:state => state.userInfo,   
            addressData:state=> state.addressData,
            wx:state => state.wx, 
 
        })       
    },
     watch: {
        scheduleListData(data) {
            if(Object.keys(data).length > 0) {
                if(this.onload){
                    this.onload=false
                    this.loadingHand(false)
                }
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                }else{    
                    let ArrObj= data; 
                    ArrObj.items.forEach(function(al){
                        al.brands=true
                        al.flowlist.reverse()
                    })   
                    if(this.pulldown){
                        this.ArrData=[]
                        this.ArrData= ArrObj.items
                        this.status.pulldownStatus = 'default'
                        this.loadFlag=true
                    }else{
                        this.ArrData= this.ArrData.concat(ArrObj.items)                  
                    }  
                    ArrObj.items=this.ArrData                    
                    if(data.has_more){
                        this.onFetching = false 
                    }else{
                        this.loadFlag=false
                        this.onFetching = true 
                    }
                    this.scheduleData = ArrObj     
                    this.screeningShowLoad=false              
                }
            }else{
                this.scheduleData = {}
            }
        },
        AreaAuditData(data){            
            if (data.alert_msg) {
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
            }else{      
                let Arr=data;
                let obj=[{
                    parent_id:'-1',
                    region_id:'-1',
                    region_name:"全国",
                    sonRegion:[],
                }]
                let ArrData= obj.concat(data.items.regionInfo.info)
                Arr.items.regionInfo.info=  ArrData;
                this.AreaAuditArr=Arr
            }
        },
        //新浪地址
        areaSinaData(data){
            this.AreaAuditArr.items.regionInfo.info.forEach(function(item,index){       
                let Flag=false         
                if(data.province  == item.region_name.substring(0,data.province.length)){
                    this.AreaSinaProvince=item.region_name
                    this.AreaSinaIndex1=index
                    Flag=true
                }
                if(Flag){
                    item.sonRegion.forEach(function(it,i){                
                        if(data.city  == it.region_name.substring(0,data.city.length)){
                            this.AreaSinaCity=it.region_name                           
                            this.AreaSinaIndex2=i
                        }                    
                    },this) 
                }            
            },this)                 
            
        },
        //企业微信
        qywxData: function(data) {
            if(Object.keys(data).length > 0 && this.$route.name=='progress') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                }else{ 
                    this.wx.config({
                        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                        debug:false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:this.userInfo.wx_userDetail.corpid, // 必填，企业微信的corpID
                        timestamp:data.items.timestamp , // 必填，生成签名的时间戳
                        nonceStr: data.items.noncestr, // 必填，生成签名的随机串
                        signature:data.items.signature,// 必填，签名，见附录1
                        jsApiList:['getLocation','previewImage']
                    });
                    let _this=this
                    this.wx.ready(function(){
                         _this.wxcheckJsApiHand()                        
                    });                       
                }
            }
        },
        //企业微信地理位置解析
        addressData: function(data){
            if(Object.keys(data).length > 0 && this.$route.name=='progress') {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top'
                    })
                }else{ 
                    this.AreaAuditArr.items.regionInfo.info.forEach(function(item,index){       
                        let Flag=false         
                        if(data.items.province  == item.region_name.substring(0,data.items.province.length)){
                            this.AreaSinaProvince=item.region_name
                            this.AreaSinaIndex1=index
                            Flag=true
                        }
                        if(Flag){
                            item.sonRegion.forEach(function(it,i){                
                                if(data.items.city  == it.region_name.substring(0,data.items.city.length)){
                                    this.AreaSinaCity=it.region_name                           
                                    this.AreaSinaIndex2=i
                                }                    
                            },this) 
                        }            
                    },this)  
                                          
                }
            }
        },
        //上传图片
        uploadBtnData(data){  
             this.showLoading=false;
             let text;  
             if(data.alert_msg){
                text=data.alert_msg;
            }else{ 
                
                if(this.listType==1){
                    this.scheduleData.items[this.listNum].contract_url=data.items.orig_url;
                    text= '上传合同成功';
                }else if(this.listType==2){
                    this.scheduleData.items[this.listNum].pay_voucher_url=data.items.orig_url;
                    text= '上传打款凭证成功';
                }else{
                    this.scheduleData.items[this.listNum].receive_voucher_url=data.items.orig_url;
                    text= '上传收货凭证成功';
                }
                this.scheduleData.items[this.listNum].audit_status=99;
                this.scheduleData.items[this.listNum].flowlist[0].status=1
            }
            this.$vux.toast.show({
                text: text,
                type: 'text',
                position: 'top',
                width:'20em'
            })
         },
     },
     mounted(){
    },
    methods: {
        ...mapActions({
            merchant_ScheduleList: 'merchants/ScheduleList',
            merchant_AreaAudit: 'merchants/AreaAudit',
            qywxHand : 'qywxHand',
            addressHand:'addressHand',
            uploadBtnHand:'task/uploadBtn',
        }),
        ...mapMutations({
            CLEAR_SCHEDULELIST: 'merchants/CLEAR_SCHEDULELIST',
            progressDetails: 'merchants/PROGRESSDETAILS',
            areaSinaHand: 'AREASINA',
            loadingHand: 'UPDATE_LOADING',
            
        }),
        //企业微信地理位置
        wxcheckJsApiHand(){   
            this.againFlag=true    
            let _this=this             
            this.wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    let obj={
                        position: res.longitude+','+res.latitude 
                    }
                   _this.addressHand(obj)                   
                }
            });
        },       
        wxPreviewImage(img){
            this.wx.previewImage({
                current: img, // 当前显示图片的http链接
                urls: [img] // 需要预览的图片http链接列表
            });
        },
        //所在省市
        provincesCities() {
            let text1=this.AreaIndex1=='-1'|| this.AreaIndex1=='0'?'所有省市':this.AreaAuditArr.items.regionInfo.info[this.AreaIndex1].region_name;
            let text2=this.AreaIndex2=='-1'?'':this.AreaAuditArr.items.regionInfo.info[this.AreaIndex1].sonRegion[this.AreaIndex2].region_name;
            let text =text1+' '+text2;
            return text
        },
      
        //显示隐藏
        CurHand(index){  
            if(this.ArrData[index].brands){
                this.ArrData[index].brands=false
            }else{
                this.ArrData[index].brands=true
               
            }   
            this.scheduleData.items=this.ArrData
        },
        AreaHand(){            
            if(this.AreaSinaIndexFlag){
                this.AreaSinaIndexFlag=false 
            }else{
                this.AreaIndex2='-1'
            }
           
        },
        //查看详情
        viewDetails(data){
            let obj={
                dealer_audit_status:this.dealer_audit_status,
                audit:this.AreaAuditArr.items.audit
            }
            localStorage.setItem('details',JSON.stringify(Object.assign(data,obj)))
            this.$router.push({ path: 'progressDetails' })
        },
        //过滤招商进度数据
        audit_list: function (data) {            
            return data.filter(function (data) {
                return data.name!='发货'
            })
        },
        //流程状态
        dealerHand(num){
            let text;
            switch (Number(num))
            {
                case 0:
                text="全部";
            break;
                case 1:
                text="应标";
            break;
                case 2:
                text="合同";
            break;
                case 3:
                text="打款";
            break;
                case 5:
                text="收货";
            break;
                default:
                text="结算";
            }
           return text
        },
        //地址文字
        AredName(){    
            if(this.province_id=='' ){
                return '所有省市'
            }else{
                let province_name =  this.AreaAuditArr.items.regionInfo.info[this.AreaIndex_s1].region_name                
                if(this.city_id==''){
                    return province_name
                }else{
                    return province_name+this.AreaAuditArr.items.regionInfo.info[this.AreaIndex_s1].sonRegion[this.AreaIndex_s2].region_name
                }                
            }
           
        },
        //重新定位
        againHand(){
            if(this.AreaSinaProvince==''){
                this.$vux.toast.show({
                    text: '请打开定位服务，并允许小宝销售使用定位服务。',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
            }else{
                if(this.againFlag){
                    this.againFlag=false;
                    setTimeout(() => {
                        if (!phonePort) {
                           this.againFlag=true
                        }else{
                            if(phonePort=='qywx'){
                                this.wxcheckJsApiHand();
                            }else{
                                //app
                            }                               
                        } 
                    },3000)
                    
                } 

            }
              
        },
        //点击当前现在省和市
        AreaSinaHand(){          
            if(this.AreaSinaProvince!=''){               
                this.AreaIndex1=this.AreaSinaIndex1 
                this.showContent1=true
                this.AreaSinaIndexFlag=true
                this.AreaIndex2=this.AreaSinaIndex2
            }      
            
        },
        //滚动加载
        loadMore () {
            this.$refs.scroller.reset()
            if (!this.onFetching) {
                this.onFetching = true
                this.pulldown=false
                this.page = this.page+1

                let obj={
                    page:this.page,
                    count:this.count,
                    dealer_audit_status:this.dealer_audit_status,
                    company_id:this.company_id,
                    task_id:this.task_id,
                }
                if(this.province_id !=''){
                    obj.province_id=this.province_id
                    if(this.city_id !=''){
                        obj.city_id=this.city_id
                        
                    }
                }
                this.merchant_ScheduleList(obj);                
            }
        },
        refresh(){
            if(this.status.pulldownStatus != 'default'){
                this.onFetching = false
                this.pulldown=true
                this.page = 1
                let obj={
                    page:this.page,
                    count:this.count,
                    dealer_audit_status:this.dealer_audit_status,
                    company_id:this.company_id,
                    task_id:this.task_id,
                }
                if(this.province_id !=''){
                    obj.province_id=this.province_id
                    if(this.city_id !=''){
                        obj.city_id=this.city_id
                        
                    }
                }
                this.merchant_ScheduleList(obj);
            }
        },
        //筛选弹窗
        screeningShowBtn(){         
            this.screeningShow = !this.screeningShow;
            if(this.screeningShow && this.AreaFlag){
                this.AreaFlag=false;
                this.AreaSinaHand();
            }
        },
        //筛选弹窗确定
        screeningShowHand: function () {     
            this.screeningShow = false ;
            this.page='1';
            this.dealer_audit_status=this.dealer_audit_status_s;
            this.province_id= this.AreaIndex1=='-1'||this.AreaIndex1=='0'?'':this.AreaAuditArr.items.regionInfo.info[this.AreaIndex1].region_id;
            this.city_id=this.AreaIndex1=='-1' || this.AreaIndex2=='-1'?'': this.AreaAuditArr.items.regionInfo.info[this.AreaIndex1].sonRegion[this.AreaIndex2].region_id;
             
            this.AreaIndex_s1=this.AreaIndex1;
            this.AreaIndex_s2=this.AreaIndex2;
            let obj={
                page:this.page,
                count:this.count,
                dealer_audit_status:this.dealer_audit_status,
                company_id:this.company_id,
                task_id:this.task_id,
            }
            if(this.province_id !=''){
                obj.province_id=this.province_id
                if(this.city_id !=''){
                    obj.city_id=this.city_id
                    
                }
            }
            this.ArrData=[]
            this.scheduleData = {}
            this.screeningShowLoad=true
            this.merchant_ScheduleList(obj);
            
        },
        //图片显示
        upShow(index,num){
            if(this.imgBtn){
                this.imgBtn=false;
                if(!phonePort){
                    this.loadingHand(true);
                    setTimeout(() => {
                        this.loadingHand(false);
                    },1500)
                }
                let imgUrl;
                if(num==1){
                    imgUrl=this.scheduleData.items[index].contract_url;
                }else if(num==2){
                    imgUrl=this.scheduleData.items[index].pay_voucher_url;
                }else{
                    imgUrl=this.scheduleData.items[index].receive_voucher_url;
                }
                this.imgUrl=[{src:imgUrl}];
                setTimeout(() => {
                    if(!phonePort){                        
                        this.$refs.previewer.show(0)
                    }else{
                       if(phonePort=='qywx'){
                            this.wxPreviewImage(imgUrl)
                       }else{

                       } 
                    }
                },500)            
                setTimeout(() => {
                    this.imgBtn=true;
                },2500)
                
            }
            
        },
        //上传合同
        UploadContract(id,index,num){
            if(this.imgFlag){
                this.imgFlag=false;
                setTimeout(() => {
                    this.imgFlag=true;
                },1500);
                 this.listNum=index;
                this.listType=num;
                let _this=this;
                $("#task_log").trigger("click").off('change').on('change', function (e) {    
                    let files=this.files[0];
                    let rFilter=/^(image\/jpg|image\/jpeg|image\/png)$/i;   
                    if(rFilter.test(files.type)){
                        lrz(files)
                        .then(function (rst) {
                            //图片数据重组            
                            let fileData = [{origin_name:files.name,data:rst.base64}];
                            let obj={
                                num,
                                 obj:{
                                     tub_dealer_id:id,
                                    fileData:JSON.stringify(fileData),
                                 }
                            }
                            _this.uploadBtnHand(obj);
                        })
                        .catch(function (err) {
                            // 处理失败会执行
                            _this.$vux.toast.show({
                                text: '对不起，上传失败',
                                type: 'text',
                                position: 'top',
                                width:"18em"
                                
                            })
                        })
                        // }
                    }else{
                        _this.$vux.toast.show({
                            text: '对不起，不支持此文件类型。',
                            type: 'text',
                            position: 'top',
                            width:"18em"
                        })
                    }
                });
                }
           
           

        }

    },
    components: {
        Scroller,        
        Popup,        
        Cell,
        Group,
        Checker,
        CheckerItem,
        Timeline, 
        TimelineItem,
        LoadMore,
        InlineLoading,
        XButton,
        Previewer,
        Divider
    },
}
</script>
<style lang="less" >
 @import './index.less';
</style>
// <p>{{it.add_time}} <span @click="item.audit_status==99?upShow(index):''" :class="[i === 0 ? item.audit_status==99?'orange-cor':it.status==1?'': 'recent' :'' ]">{{it.status_text}}{{it.tmaf_id==11?'(驳回:'+it.note+')':''}}</span></p>