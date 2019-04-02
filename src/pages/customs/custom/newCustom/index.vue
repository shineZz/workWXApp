<template>
    <div class="newCustom router-all">
        <div class="router-box">
            <!-- 头像姓名公司名 -->
            <group class="header-img">
                <div class="header" @click="UploadHead">
                    <span v-if="!headerImg">添加照片</span>
                    <img :src="headerImg.src" :alt="headerImg.name" v-else>
                    <input style="display:none" id="headerImg" name="file" type="file" accept="image/png,image/jpeg,image/gif" />
                </div>
                <x-input ref="nameInput" v-model="nameValue" :max="12" @on-change="valueChange(nameValue, 'nameInput', 'nameValue')" :disabled="changeFlag" placeholder="请填写姓名（必填）" />
                <x-textarea ref="companyInput" v-model="companyValue" :rows="1" autosize :show-counter="false" :max="30"
                 @on-change="valueChange(companyValue, 'companyInput', 'companyValue')" :disabled="changeFlag" placeholder="请填写公司名称" />
            </group>
            <!-- 关联 -->
            <group>
                <cell v-if="showOut" title="关联企业微信外部好友" :value="userObj?'已关联':'未关联'" @click.native="outHand" is-link class="width12">
                    <img slot="icon" src="@/images/analysis/weixin.png" class="img-kind">
                </cell>
                <cell title="名片" :value="cardImg?'':'未关联'" :is-link="!cardImg" :class="cardImg?'no-width':'width12'" @click.native="UploadCard">
                    <img slot="icon" src="@/images/custom/customer/newCustom/card.png" class="img-kind">
                    <div slot="child" class="card-box">
                        <img :src="cardImg.src" :alt="cardImg.name" class="card-img" v-if="cardImg">
                        <input style="display:none" id="cardImg" name="file" type="file" accept="image/png,image/jpeg,image/gif" />
                    </div>
                </cell>
            </group>
            <!-- 标签分组客户来源 -->
            <group>
                <cell title="标签：" :value="labelValue.length>0?'':'选择标签，分类客户'" is-link @click.native="toggleTrue('label')" value-align="left" :class="{'has': labelValue.length>0}">
                    <div slot="child" class="fd" v-if="labelValue.length>0">
                        <span v-for="item in labelValue" :key="item.id">{{item.name}}</span>
                    </div>
                </cell>
                <cell title="分组：" :value="groupValue.label?groupValue.label:'请选择分组'" is-link @click.native="group=true" value-align="left" :class="{'has': groupValue.label}">
                </cell>
                <cell title="客户来源：" :value="sourceValue.label?sourceValue.label:'请选择客户来源'" :is-link="!(customerId&&sourceValue.label)" @click.native="checkHand" value-align="left" :class="{'has': sourceValue.label}">
                </cell>
            </group>
            <!-- 联系方式 -->
            <group>
                <flexbox :gutter='0'>
                    <flexbox-item :span="5">
                        <cell title="手机：" :value="'+'+mobileValue.label" @click.native="mobile=true" is-link value-align="right" arrow-direction="down" :class="['no-width','vux-1px-r','has']"></cell>
                    </flexbox-item>
                    <flexbox-item>
                        <x-input ref="phoneInput" v-model="phoneValue" type="text" :disabled="changeFlag" :max="11" placeholder="请填写手机号（必填）"></x-input>
                    </flexbox-item>
                </flexbox>
                <cell title="座机：" :value="`${telValue.name}（${telValue.label}-）`" @click.native="toggleTrue('tel')" is-link value-align="left" :class="['vux-1px-b', 'has']"></cell>
                <flexbox :gutter='0' class="flex-right">
                    <flexbox-item>
                        <x-input ref="telInput1" v-model="telValue1" type="text" :disabled="changeFlag" :max="9" placeholder="请填写座机号" class="vux-1px-r"></x-input>
                    </flexbox-item>
                    <flexbox-item :span="5">
                        <x-input ref="telInput2" v-model="telValue2" type="text" :disabled="changeFlag" :max="9" placeholder="分机号"></x-input>
                    </flexbox-item>
                </flexbox>
                <!-- <x-input title="微信：" v-model="wechatValue" placeholder="请填写微信号码" :max="30"></x-input> -->
                <x-textarea ref="wechatInput" title="微信：" v-model="wechatValue" :rows="1" autosize :show-counter="false" :max="30"
                 @on-change="valueChange(wechatValue, 'wechatInput', 'wechatValue')" :disabled="changeFlag" placeholder="请填写微信号码" />
                <x-input ref="QQInput" v-model="QQValue" title="QQ：" type="text" :disabled="changeFlag" :max="15" placeholder="请填写QQ号码"></x-input>
                <!-- <x-input ref="emailInput" v-model="emailValue" title="邮箱：" :max="50" placeholder="请填写邮箱"></x-input> -->
                <x-textarea ref="emailInput" title="邮箱：" v-model="emailValue" :rows="1" autosize :show-counter="false" :max="50"
                 @on-change="valueChange(emailValue, 'emailInput', 'emailValue')" :disabled="changeFlag" placeholder="请填写邮箱" />
            </group>
            <!-- 个人信息 -->
            <group>
                <x-input ref="nickInput" v-model="nickValue" title="称呼：" :max="12" :disabled="changeFlag" @on-change="valueChange(nickValue, 'nickInput', 'nickValue')" placeholder="请填写客户称呼"></x-input>
                <popup-picker title="性别：" :data="sexList" v-model="sexValue" placeholder="请选择性别"></popup-picker>
                <datetime title="生日：" v-model="birthValue" :min-year=1970 :end-date="maxYear" placeholder="请选择生日"></datetime>
            </group>
            <!-- 工作信息 -->
            <group>
                <cell title="所属行业：" :value="industryValue.name?industryValue.name:'请选择行业'" @click.native="toggleTrue('industry')" is-link value-align="left" :class="{'has': industryValue.name}"></cell>
                <x-textarea ref="positionInput" title="职位：" v-model="positionValue" :rows="1" autosize :show-counter="false" :max="30"
                 @on-change="valueChange(positionValue, 'positionInput', 'positionValue')" :disabled="changeFlag" placeholder="请填写职位" />
                <cell title="传真：" :value="`${faxValue.name}（${faxValue.label}-）`" @click.native="toggleTrue('fax')" is-link value-align="left" :class="['vux-1px-b', 'has']"></cell>
                <flexbox :gutter='0' class="flex-right">
                    <flexbox-item>
                        <x-input ref="faxInput1" v-model="faxValue1" type="text" :disabled="changeFlag" :max="9" placeholder="请填写传真号" class="vux-1px-r"></x-input>
                    </flexbox-item>
                    <flexbox-item :span="5">
                        <x-input ref="faxInput2" v-model="faxValue2" type="text" :disabled="changeFlag" :max="9" placeholder="分机号"></x-input>
                    </flexbox-item>
                </flexbox>
                <x-textarea ref="webInput" title="官网地址：" v-model="webValue" :rows="1" autosize :show-counter="false" :max="64"
                 @on-change="valueChange(webValue, 'webInput', 'webValue')" :disabled="changeFlag" placeholder="请填写官网地址" />
            </group>
            <!-- 地址 -->
            <group>
                <popup-picker title="地区：" ref='ucArea' :data="areaList" v-model="areaValue" @on-change="areaChange" @on-hide="areaHide" :disabled="changeFlag" show-name :columns="3" placeholder="请选择地区"></popup-picker>
                <cell title="详细地址：" :value="addressData.address?addressData.address:'请从地图上选择'" @click.native="mapHand" value-align="left" :class="{'has': addressData.address}">
                    <img slot="child" src="@/images/custom/customer/newCustom/map.png" alt="" class="img-right">
                </cell>
            </group>
            <!-- 备注 -->
            <group>
                <cell title="备注：" :value="moduleObj.inputVal||moduleObj.uploadData.length||moduleObj.recordObj.url?'请点击查看或编辑备注':'请点击添加备注'" is-link value-align="left"  @click.native="remark=true" :class="{'has': moduleObj.inputVal||moduleObj.uploadData.length}"></cell>
            </group>
            <!-- 公司信息 -->
            <group>
                <x-input ref="legalInput" v-model="legalValue" title="法人代表：" :max="12" :disabled="changeFlag" @on-change="valueChange(legalValue, 'legalInput', 'legalValue')" placeholder="请填写法人代表姓名"></x-input>
                <cell :title="'评分：'+rangeValue" primary="content" class="width55">
                    <range v-model="rangeValue" :step="1" :min=-100 :max=100></range>
                </cell>
                <x-textarea ref="scopeInput" title="经营范围：" v-model="scopeValue" :rows="1" autosize :show-counter="false" :max="30"
                 @on-change="valueChange(scopeValue, 'scopeInput', 'scopeValue')" :disabled="changeFlag" placeholder="请填写经营范围" />
                <popup-picker title="规模：" :data="sizeList" v-model="sizeValue" show-name placeholder="请选择规模" class="vux-1px-b"></popup-picker>
                <flexbox :gutter='0' class="vux-1px-b flex-right">
                    <flexbox-item :span="6">
                        <cell title="注册资金：" :value="currencyValue1.label" is-link @click.native="toggleTrue('currency1')" arrow-direction="down" :class="['vux-1px-r', 'has']"></cell>
                    </flexbox-item>
                    <flexbox-item>
                        <x-input class="moneyF" ref="moneyInput1" :show-clear="false" v-model="moneyValue1" type="text" :disabled="changeFlag||moneyFlag1"
                         @on-focus="moneyFocus(moneyValue1, 1)" @on-change="moneyChange(moneyValue1, 1)" @on-blur="moneyBlur(moneyValue1, 1)" :max="16" placeholder="请填写金额" />
                    </flexbox-item>
                </flexbox>
                <flexbox :gutter='0' class="flex-right">
                    <flexbox-item :span="6">
                        <cell title="年营业额：" :value="currencyValue2.label" is-link @click.native="toggleTrue('currency2')" arrow-direction="down" :class="['vux-1px-r', 'has']">
                        </cell>
                    </flexbox-item>
                    <flexbox-item>
                        <x-input class="moneyF" ref="moneyInput2" :show-clear="false" v-model="moneyValue2" type="text" :disabled="changeFlag||moneyFlag2"
                         @on-focus="moneyFocus(moneyValue2, 2)" @on-change="moneyChange(moneyValue2, 2)" @on-blur="moneyBlur(moneyValue2, 2)" :max="16" placeholder="请填写金额" />
                    </flexbox-item>
                </flexbox>
            </group>
        </div>
        <div class="btn">
            <x-button type="primary" @click.native="submit" :show-loading="btnFlag" :disabled="btnFlag">完成</x-button>
        </div>
        <div v-transfer-dom>
            <div>
                <!-- 标签 -->
                <popup v-model="label" width="100%" position="right">
                    <div class="popup" v-if="label">
                        <labelPage :checkValue="labelValue" propState="1" @toggleLabel="togglePop"  ></labelPage>
                    </div>
                </popup>
                <!-- 分组 -->
                <popup v-model="group" width="100%" position="right" >
                    <div class="popup" v-if="group">
                        <checkers :checkValue="[groupValue.value]"  show="group" :save="true" @toggle="togglePop"/>
                    </div>
                </popup>
                <!-- 来源 -->
                <popup v-model="source" width="100%" position="right" >
                    <div class="popup" v-if="source">
                        <checkers :checkValue="[sourceValue.value]"  show="source" :save="true" @toggle="togglePop"/>
                    </div>
                </popup>
                <!-- 行业 -->
                <popup v-model="industry" width="100%" position="right" >
                    <div class="popup">
                        <Industry :industryValue="industryValue" @toggleIndustry="togglePop" v-if="industryFlag"/>
                    </div>
                </popup>
            </div>
            <div v-if="mount">
                <!-- 手机 -->
                <popup v-model="mobile" width="100%" position="right"  >
                    <div class="popup" v-if="mobile">
                    <checkers :checkValue="mobileValue.value" show="mobile" :save="true" @toggle="togglePop"/>
                    </div>
                </popup>
                <!-- 座机 -->
                <popup v-model="tel" width="100%" position="right" >
                    <div class="popup" v-if="tel">
                    <checkers :checkValue="telValue.value" show="tel"   :save="true" @toggle="togglePop"/>
                    </div>
                </popup>
                <!-- 传真 -->
                <popup v-model="fax" width="100%" position="right"  >
                    <div class="popup" v-if="fax">
                    <checkers :checkValue="faxValue.value" show="fax" :save="true" @toggle="togglePop"/>
                    </div>
                </popup>
                <!-- 币种 -->
                <popup v-model="currency1" width="100%" position="right"  >
                    <div class="popup" v-if="currency1">
                        <checkers :checkValue="[currencyValue1.value]" show="currency" :save="true" @toggle="togglePop"/>
                    </div>
                </popup>
                <popup v-model="currency2" width="100%" position="right">
                    <div class="popup" v-if="currency2">
                        <checkers :checkValue="[currencyValue2.value]"  show="currency" :save="true" @toggle="togglePop"/>
                    </div>
                </popup>
                <!-- 地图 -->
                <popup v-model="map" width="100%" position="right" >
                    <div class="popup">
                        <MyMap :addressData="addressData" :searchData="searchData" @toggleMap="togglePop" v-if="map"/>
                    </div>
                </popup>
                <!-- 备注 -->
                <popup v-model="remark" width="100%" position="right" should-scroll-top-on-show>
                    <div class="popup">
                        <FormA :moduleObj="moduleObj" @toggle="togglePop" ref="remark"/>
                    </div>
                </popup>
            </div>
        </div>
    </div>
</template>

<script>
import { trim, Group, Cell, XInput, XTextarea, PopupPicker, XButton, Flexbox, FlexboxItem, Datetime, TransferDom, Popup, Checklist, Range } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import { objDeepCopy, checkMobile, checkTel, checkEmail, checkWechat, checkWeb, checkPrice, checkEmoji, checkMoney, currentDate } from '@/util/index'
import labelPage from '@/components/labels'
import Industry from '@/components/industry'
import checkers from '@/components/checkers'
import MyMap from '@/components/mymap'
import FormA from '@/components/formA'
import lrz from 'lrz'
let _timer;
export default {
    name: 'newCustom',
    data() {
        return {
            changeFlag: true,
            customerId: 0,
            mount: false,
            userObj: null,
            maxYear: currentDate(),
            // 头像姓名公司名
            headerImg: null,
            nameValue: '',
            companyValue: '',
            // 关联
            showOut: true,
            cardImg: null,
            rotate: false,
            // 标签分组客户来源
            label: false,
            labelValue: [],
            group: false,
            groupValue: {label: '', value: ''},
            source: false,
            sourceValue: {label: '', value: ''},
            // 联系方式
            mobile: false,
            mobileValue: {label: '86', value: '86'},
            phoneValue: '',
            tel: false,
            telValue: {label: '0571', value: '0571', name: '杭州'},
            telValue1: '',
            telValue2: '',
            wechatValue: '',
            QQValue: '',
            emailValue: '',
            // 个人信息
            nickValue: '',
            sexList: [['男', '女']],
            sexValue: [],
            birthValue: '',
            // 工作信息
            industry: false,
            industryValue: {name: '', one: '', two: '', three: ''},
            positionValue: '',
            fax: false,
            faxValue: {label: '0571', value: '0571', name: '杭州'},
            faxValue1: '',
            faxValue2: '',
            webValue: '',
            // 地址
            areaList: JSON.parse(localStorage.getItem('pca')),
            areaValue: [],
            province: '',
            city: '',
            area: '',
            map: false,
            addressData: {
              name:"",
              address:'',
              location: {
                O:'',
                P:'',
                lat:'',
                lng:''
              }
            },
            // 备注
            remark: false,
            moduleObj: {
                title: '备注：',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '',
                uploadData: [],
                record: true,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 2,
                showBtn: true,
            },
            // 公司信息
            legalValue: '',
            // starValue: '',
            rangeValue: 0,
            scopeValue: '',
            sizeList: [JSON.parse(localStorage.getItem('scale'))],
            sizeValue: [],
            moneyFlag1: true,
            currency1: false,
            currencyValue1: {label: '人民币', value: 'CNY'},
            moneyFlag2: true,
            moneyValue1: '',
            currency2: false,
            currencyValue2: {label: '人民币', value: 'CNY'},
            moneyValue2: '',
            btnFlag: false,
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            searchData:'',
            industryFlag:false,
        }
    },
    created() {
        // 请求企业微信
        if (localStorage.getItem('phonePort') == 'qywx') {
            let obj_qywx = {
                crop_id: this.userInfo.wx_userDetail.corpid,
                url: location.href.split('#')[0]
            }
            this.$store.dispatch('qywxHand', obj_qywx)
        } else {
            this.showOut = false
        }
        // 名片-外部联系人导入
        let cardObj = JSON.parse(this.$route.params.cardObj?this.$route.params.cardObj:null)
        this.userObj = JSON.parse(this.$route.params.userObj?this.$route.params.userObj:null)
        if (cardObj) {
            let card = cardObj.items.card_rlt
            this.cardImg = {
                src: cardObj.items.all_orig_url,
                name: card.formatted_name
            }
            this.nameValue = card.formatted_name
            this.addressData.address = card.address
            this.phoneValue = card.telephone
            this.emailValue = card.email
            this.positionValue = card.title
            this.companyValue = card.organization
            // this.wechatValue = card.sns
            this.QQValue = card.im

            this.$nextTick(()=>{
                this.$refs.companyInput.updateAutosize()
                this.$refs.positionInput.updateAutosize()
                this.$refs.emailInput.updateAutosize()
            })
        } else if (this.userObj) {
            this.nameValue = this.userObj.name
            this.companyValue = this.userObj.company_name
            this.headerImg = this.userObj.avatar?{src: this.userObj.avatar}:null
            this.phoneValue = this.userObj.mobile
            this.sexValue = this.userObj.sex?this.userObj.sex==1?['男']:[]:['女']
        }
        // 编辑
        this.customerId = this.$route.query.id
        if (this.customerId) {
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                customer_id: this.customerId
            }
            this.customer_getCustomerDetail(obj)
        }
        let newAreaObj = localStorage.getItem('newAreaObj')
        if(!newAreaObj){
            let areaObj = JSON.parse(localStorage.getItem('pca'))
            let newArea = [[],[],[]]
            areaObj.forEach((item)=>{
                newArea[item.level].push(item)
            })
            localStorage.setItem('newAreaObj',JSON.stringify(newArea))
        }
    },
    mounted() {
        // 旋转图片
        this.$nextTick(() => {
            if (this.cardImg) {
                let img = new Image()
                img.src = this.cardImg.src
                img.onload = () => {
                    let width = img.width
                    let height = img.height
                    if (height > width) {
                        $('.card-img').addClass('rotated')
                        $('.rotated').css({'margin-right': $('.card-box').offset().left-$('.card-img').offset().left})
                    }
                }
            }
        })
        // 页面加载后加载popup, 加快页面载入速度
        this.$nextTick(() => {
            setTimeout(() => {
                this.mount = true
                // this.UPDATE_LOADING(false)
            }, 800)
        })
        if (this.customerId) {
            document.title = '编辑客户'
        } else {
            this.changeFlag = false
            this.moneyFlag1 = false
            this.moneyFlag2 = false
        }

        let boxH = $(".newCustom .router-box").height()
        // $(".newCustom .router-box").bind("click",function(e){
        //     let cY= e.clientY
        //     if(cY > boxH*0.8 && (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA' && e.target.className!=='moneyF')){
        //         $(e.target).blur();
        //         this.scrollTop = this.scrollTop+95
        //         window.setTimeout(function(){
        //             $(e.target).focus()
        //         },500)
        //     }
        // })
    },
    updated() {
        // 旋转图片
        this.$nextTick(() => {
            if (this.cardImg) {
                let img = new Image()
                img.src = this.cardImg.src
                img.onload = () => {
                    let width = img.width
                    let height = img.height
                    if (height > width) {
                        $('.card-img').addClass('rotated')
                        $('.rotated').css({'margin-right': $('.card-box').offset().left-$('.card-img').offset().left})
                    }
                }
            }
        })
    },
    methods: {
        ...mapActions({
            customer_getCCard: 'card/getCCard',
            customerattach_uploadFile: 'customerattach/uploadFile',
            customer_addOneCustomer: 'customer/addOneCustomer',
            customer_getCustomerDetail: 'customer/getCustomerDetail',
            customer_editCustomer: 'customer/editCustomer',
            customer_importWxExternalContact: 'customer/importWxExternalContact',
        }),
        ...mapMutations({
            UPDATE_LOADING: 'UPDATE_LOADING',
        }),
        //上传头像
        UploadHead(){
            let _this=this
            $('#headerImg').trigger("click").off('change').on('change', function (e) {
                let rFilter=/^(image\/jpg|image\/jpeg|image\/png)$/i
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
                    lrz(files)
                    .then(function (rst) {
                        _this.headerImg = {
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
                }
            })
        },
        //上传名片
        UploadCard(){
            let _this=this
            $('#cardImg').trigger("click").off('change').on('change', function (e) {
                let rFilter=/^(image\/jpg|image\/jpeg)$/i
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
                    lrz(files)
                    .then(function (rst) {
                        let obj = {
                            company_id: _this.companyId,
                            user_id: _this.userId,
                            data_stream: rst.base64
                        }
                        _this.customer_getCCard(obj)
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
            })
        },
        // 企业微信外部联系人
        outHand() {
            this.wx.invoke('selectExternalContact', {
                "filterType": 0, //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
            }, res => {
                if(res.err_msg == "selectExternalContact:ok"){
                    let userIds  = res.userIds ; //返回此次选择的外部联系人userId列表，数组类型
                    if (userIds.length>1) {
                        this.$vux.toast.show({
                            text: '只能选择一位微信外部好友关联',
                            type: 'text',
                            position: 'top',
                            width:"18em"
                        })
                        return
                    }
                    let obj = {
                        company_id: this.companyId,
                        user_id: this.userId,
                        crop_id: this.userInfo.wx_userDetail.corpid,
                        external_userids: JSON.stringify(userIds),
                    }
                    this.customer_importWxExternalContact(obj)
                }else {
                    if (res.err_msg.indexOf("permission") != -1) {
                        this.$vux.toast.show({
                            text: '请联系我们绑定企业ID',
                            type: 'text',
                            position: 'top',
                            width:"18em"      
                        })
                    }
                    console.log(res, 'userIdsERR')
                }
            });
        },
        // input改变
        valueChange(val, refStr, valuestr, max) {
            if (!val||this.changeFlag) {
                return
            }
            val = trim(val)
            val = val.replace("\r|\n", "")
            // 不能输入表情符
            val = checkEmoji(val)
            this.$nextTick(()=>{
                this[valuestr] = val
            })
        },
        // 千分符,两位小数
        money(val) {
            val = val.toString()
            val = val.replace(/\,/g, '')
            val = val.replace(/[^\d|\.]/g,"")
            val = isNaN(parseFloat(val))?0:parseFloat(val)
            val = Math.round(val*100)/100
            if (val < 0.01) {
                val = 0.00
            } else if (val > 9999999999) {
                val = 9999999999.99
            }
            let arr = val.toString().split('.')
            if (arr.length==1) {
                arr[1] = "00"
            } else if (arr.length>1) {
                if (arr[1].length<2) {
                    arr[1] = arr[1].toString()+"0"
                }
            }
            arr[0] = checkMoney(arr[0])
            val = arr.join('.')
            return val
        },
        // 金额获取焦点
        moneyFocus(val, i) {
            if (!val) {
                return
            }
            this['moneyFlag'+i] = false
            val = val.replace(/\,/g, '')
            this.$nextTick(()=>{
                this['moneyValue'+i] = val
            })
        },
        // 金额改变
        moneyChange(val, i) {
            if (this['moneyFlag'+i]) {
                return
            }
            if (!checkPrice(val)) {
                val = val.substring(0, val.length-1)
            } else {
                return
            }
            this.$nextTick(()=>{
                this['moneyValue'+i] = val
            })
        },
        // 金额失去焦点
        moneyBlur(val, i) {
            if (!val||this.changeFlag) {
                return
            }
            this['moneyFlag'+i] = true
            val = val.toString()
            val = this.money(val)
            this.$nextTick(()=>{
                this['moneyValue'+i] = val
                setTimeout(()=>{
                    this['moneyFlag'+i] = false
                }, 20)
            })
        },
        toggleTrue(type){
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                if(type=='label'){
                    this.label = true
                }else if(type=='industry'){
                    // this.UPDATE_LOADING(true)
                    this.industryFlag=true;
                    this.industry = true
                }else if(type=='tel'){
                    this.tel = true
                }else if(type=='fax'){
                    this.fax = true
                }else if(type=='currency1'){
                    this.currency1 = true
                }else if(type=='currency2'){
                    this.currency2 = true
                }
            },300)
            
        },
        // 来源
        checkHand() {
            if (this.customerId&&this.sourceValue.label) {
                return
            }
            clearTimeout(_timer)
            _timer = setTimeout(()=>{
                this.source = true
            },300)
            
        },
        // 关闭popup 行业分组来源手机座机
        togglePop(obj) {
            if (this.label) {
                this.labelValue = obj
                this.label = false
                return
            }
            if (this.group) {
                this.groupValue = obj
                this.group = false
                return
            }
            if (this.source) {
                this.sourceValue = obj
                this.source = false
                return
            }
            if (this.mobile) {
                this.mobileValue = obj
                this.mobile = false
                return
            }
            if (this.tel) {
                this.telValue = obj
                this.tel = false
                return
            }
            if (this.fax) {
                this.faxValue = obj
                this.fax = false
                return
            }
            if (this.industry) {
                this.industryValue = obj
                this.industry = false
                return
            }
            if (this.map) {
                if(obj.address) {
                    this.addressData = obj
                    let _arr =[]
                    JSON.parse(localStorage.getItem('newAreaObj'))[0].forEach((item)=>{
                        if(obj.pname==item.name){
                            _arr.push(item.value)
                        }
                    },this)
                    JSON.parse(localStorage.getItem('newAreaObj'))[1].forEach((item)=>{
                        if(obj.cityname==item.name){
                            console.log(item.value,item.name)
                            _arr.push(item.value)
                        }
                    },this)
                    JSON.parse(localStorage.getItem('newAreaObj'))[2].forEach((item)=>{
                        if(obj.aname==item.name||obj.adname==item.name){
                            console.log(item.value,item.name)
                            _arr.push(item.value)
                        }
                    },this)
                    //省市区解开为根据选择的地址
                    // this.areaValue = _arr
                }
                this.map = false
                return
            }
            if (this.currency1) {
                this.currencyValue1 = obj
                this.currency1 = false
                return
            }
            if (this.currency2) {
                this.currencyValue2 = obj
                this.currency2 = false
                return
            }
            if (this.remark) {
                this.remark = false
                return
            }
        },
        //地区选择
        areaChange(data){
            let _kk = this.$refs.ucArea.getNameValues()
            let _area = _kk.split(' ')
            if (_area.length === 3) {
                this.province = _area[0]
                this.city = _area[1]
                this.area = _area[2]
                this.searchData = _kk
            }
        },
        //不进行滑动，不能选择第一个地区bug
        areaHide(closeType) {
            if (closeType) {
                if (this.areaValue.length===0) {
                    this.areaValue = ["2", "36", "381"]
                } else {
                    if (!this.areaValue[1]&&!this.areaValue[0]) {
                        this.areaValue[0] = "2"
                        this.areaValue[1] = "36"
                        this.province = '北京市'
                        this.city = '北京市[市辖区]'
                        this.area = this.$refs.ucArea.getNameValues()
                    }
                    if (!this.areaValue[0]) {
                        this.areaValue[0] = "2"
                        let arr = this.$refs.ucArea.getNameValues().split(' ')
                        this.province = '北京市'
                        this.city = arr[0]
                        this.area = arr[1]
                    }
                }
            }
        },
        mapHand(value) {
            if (this.areaValue.length===0) {
                this.$vux.toast.show({
                    text: '地区未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            this.map = true
        },
        requsetHand() {
            let obj = {
                company_id: this.companyId,
                user_id: this.userId,
                // 头像姓名公司名
                data_logo_stream: this.headerImg?this.headerImg.src.match(/base64/i)?this.headerImg.src:'':'',
                customer_name: this.nameValue,
                customer_company_name: this.companyValue,
                // 关联
                import_from: 5,
                is_link_wx: this.userObj?1:0,
                link_wxcom_id: this.userObj?this.userObj.external_userid:'',
                link_wxcom_name: this.userObj?this.userObj.name:'',
                is_link_card: this.cardImg?1:0,
                link_card_url: this.cardImg?this.cardImg.src:'',
                // 标签分组客户来源
                label_id: this.labelValue.map(v=>v.id).join(),
                segment_id: this.groupValue.value,
                source_id: this.sourceValue.value,
                // 联系方式
                mobile_code: this.mobileValue.value,
                mobile: this.phoneValue,
                tel_code: this.telValue.value,
                telphone: this.telValue1,
                telphone_ext: this.telValue2,
                wx: this.wechatValue,
                qq: this.QQValue,
                email: this.emailValue,
                // 个人信息
                honor_name: this.nickValue,
                sex: this.sexValue[0]?this.sexValue[0]==='男'?1:0:2,
                birthday: this.birthValue,
                // 工作信息
                industry_id: this.industryValue.three,
                industry_sec_id: this.industryValue.two,
                industry_parent_id: this.industryValue.one,
                duty: this.positionValue,
                fax_code: this.faxValue.value,
                fax: this.faxValue1,
                fax_ext: this.faxValue2,
                website: this.webValue,
                // 地址
                province_id: this.areaValue[0]?this.areaValue[0]:'',
                city_id: this.areaValue[1]?this.areaValue[1]:'',
                area_id: this.areaValue[2]?this.areaValue[2]:'',
                province_name: this.province,
                city_name: this.city,
                area_name: this.area,
                address: this.addressData.address,
                is_locate: this.addressData.location.lng?1:0,
                longitude: this.addressData.location.lng,
                latitude: this.addressData.location.lat,
                // 备注
                note: this.moduleObj.inputVal,
                attach_ids: this.moduleObj.uploadData.map(v=>v.id).join(','),
                // 公司信息
                legal: this.legalValue,
                score: this.rangeValue,
                scope: this.scopeValue,
                scale: this.sizeValue[0]?parseInt(this.sizeValue[0]):'',
                reg_captical_unit: this.currencyValue1.value,
                reg_captical: this.moneyValue1?parseFloat(this.moneyValue1.replace(/\,/g, '')):'',
                annual_turnover_unit: this.currencyValue2.value,
                annual_turnover: this.moneyValue2?parseFloat(this.moneyValue2.replace(/\,/g, '')):'',
            }
            if (this.moduleObj.recordObj&&this.moduleObj.recordObj.id) {
                obj.attach_ids = obj.attach_ids + ',' + this.moduleObj.recordObj.id
            }

            if (this.customerId) {
                obj.customer_id = this.customerId
                this.customer_editCustomer(obj)
            } else {
                this.customer_addOneCustomer(obj)
            }
        },
        requsetImg() {
            let index = this.moduleObj.uploadData.findIndex(v=>!v.id)
            if (index !== -1) {
                let length = this.moduleObj.uploadData.length
                let arr = objDeepCopy(this.moduleObj.uploadData).splice(index, length)
                let obj = {
                    company_id: this.companyId,
                    user_id: this.userId,
                    source: 3,
                    // source_id: this.customerId,
                    upfile_base64: JSON.stringify(arr.map(v=>{
                        return {
                            origin_name: v.name,
                            data: v.src
                        }
                    })),
                }
                this.customerattach_uploadFile(obj)
            } else {
                this.requsetHand()
            }
        },
        // 提交
        submit() {
            if (!this.nameValue) {
                this.$vux.toast.show({
                    text: '客户姓名未填写，请完善',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.nameValue.length>12) {
                this.$vux.toast.show({
                    text: '客户姓名不能超过12个字符，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!this.phoneValue) {
                this.$vux.toast.show({
                    text: '客户手机未填写，请完善',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (!checkMobile(this.phoneValue)) {
                this.$vux.toast.show({
                    text: '客户手机格式不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.telValue1&&(!checkTel(this.telValue1)||this.telValue1.length<7||this.telValue1.length>9)) {
                this.$vux.toast.show({
                    text: '座机格式不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.telValue2&&!this.telValue1) {
                this.$vux.toast.show({
                    text: '请填写座机号',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.telValue2&&!checkTel(this.telValue2)) {
                this.$vux.toast.show({
                    text: '座机分机号格式不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.wechatValue&&(!checkWechat(this.wechatValue)||this.wechatValue.length<6||this.wechatValue.length>30)) {
                this.$vux.toast.show({
                    text: '微信号不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.QQValue&&(!checkTel(this.QQValue)||this.QQValue.length<5||this.QQValue.length>15)) {
                this.$vux.toast.show({
                    text: 'QQ不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.emailValue&&!checkEmail(this.emailValue)) {
                this.$vux.toast.show({
                    text: '客户邮箱不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.faxValue1&&(!checkTel(this.faxValue1)||this.faxValue1.length<7||this.faxValue1.length>9)) {
                this.$vux.toast.show({
                    text: '传真格式不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.faxValue2&&!this.faxValue1) {
                this.$vux.toast.show({
                    text: '请填写传真号',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.faxValue2&&!checkTel(this.faxValue2)) {
                this.$vux.toast.show({
                    text: '传真分机号格式不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.webValue&&!checkWeb(this.webValue)) {
                this.$vux.toast.show({
                    text: '网址不正确，请重新填写',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            if (this.addressData.address && this.areaValue.length===0) {
                this.$vux.toast.show({
                    text: '地区未选择，请选择',
                    type: 'text',
                    position: 'top',
                    width:"18em"
                })
                return
            }
            this.requsetImg()
            this.btnFlag = true
            this.UPDATE_LOADING(true)
        },
    },
    computed: {
        ...mapState({
            getCCard: state => state.card.getCCard,
            uploadFileData: state => state.customerattach.uploadFileData,
            addOneCustomer: state => state.customer.addOneCustomer,
            getDetail: state => state.customer.getDetail,
            editCustomer: state => state.customer.editCustomer,
            userInfo: state => state.userInfo,
            qywxData: state => state.qywxData,
            wx:state => state.wx,
            wxContact:state => state.customer.wxContact,
        })
    },
    watch: {
        //企业微信
        qywxData: function(data) {
            if(Object.keys(data).length > 0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"      
                    })
                }else{
                    this.wx.config({
                        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                        debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:this.userInfo.wx_userDetail.corpid, // 必填，企业微信的corpID
                        timestamp:data.items.timestamp , // 必填，生成签名的时间戳
                        nonceStr: data.items.noncestr, // 必填，生成签名的随机串
                        signature:data.items.signature,// 必填，签名，见附录1
                        jsApiList:['invoke']
                    })
                    // wx.ready(function(){                        
                    //     // wx.closeWindow();
                    // })
                    this.wx.error(function(res){
                       localStorage.setItem('phonePort', 'weixin') 
                       phonePort='weixin';
                    });
                }
            }
        },
        wxContact(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let item = this.userObj = data.items[0]
                    this.headerImg = item.avatar?{src: item.avatar}:null
                    this.nameValue = item.name?item.name:this.nameValue
                    this.companyValue = item.company_name?item.company_name:this.companyValue
                    this.sexValue = item.sex?item.sex==1?['男']:[]:['女']
                    this.cardImg = null
                }
            }
        },
        getCCard(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let card = data.items.card_rlt
                    this.cardImg = {
                        src: data.items.all_orig_url,
                        name: card.formatted_name,
                        upsrc: data.items.orig_url,
                    }
                    this.nameValue = card.formatted_name
                    this.addressData.address = card.address
                    this.phoneValue = card.telephone
                    this.emailValue = card.email
                    this.positionValue = card.title
                    this.companyValue = card.organization
                    // this.wechatValue = card.sns
                    this.QQValue = card.im
                    this.userObj = null

                    this.$nextTick(()=>{
                        this.$refs.companyInput.updateAutosize()
                        this.$refs.positionInput.updateAutosize()
                        this.$refs.webInput.updateAutosize()
                        this.$refs.scopeInput.updateAutosize()
                        this.$refs.emailInput.updateAutosize()
                    })
                }
            }
        },
        uploadFileData(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.UPDATE_LOADING(false)
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.btnFlag = false
                    return
                } else {
                    let arr = data.items.map(v=>{
                        return {
                            name: v.name,
                            src: v.url,
                            id: v.id,
                        }
                    })
                    let index = this.moduleObj.uploadData.findIndex(v=>!v.id)
                    if (index !==-1) {
                        this.moduleObj.uploadData = this.moduleObj.uploadData.slice(0, index).concat(arr)
                    }
                    this.requsetHand()
                }
            }
        },
        addOneCustomer(data) {
            if (Object.keys(data).length>0) {
                this.UPDATE_LOADING(false)
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.btnFlag = false
                    return
                } else {
                    this.$router.push({name: 'customPage', query: {id: data.items.customer_id, logo: data.items.logo_big, name: this.nameValue, company: this.companyValue, mobile: '+'+this.mobileValue.label+' '+this.phoneValue}})
                    setTimeout(()=>this.btnFlag = false, 3000)
                }
            }
        },
        getDetail(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    let item = data.items
                    // 头像姓名公司名
                    this.headerImg = item.logo_big?{src: item.logo_big}:null
                    this.nameValue = item.customer_name
                    this.companyValue = item.customer_company_name
                    // 关联
                    this.userObj = item.is_link_wx?{name: item.link_wxcom_name, id: item.link_wxcom_id}:null
                    this.cardImg = item.is_link_card?{src: item.link_card_url}:null
                    // 标签分组客户来源
                    this.labelValue = item.label_rlt.map(v=>{return {id: v.label_id, name: v.name}})
                    this.groupValue = {label: item.segment_name, value: item.segment_id}
                    this.sourceValue = {label: item.source_name, value: item.source_id}
                    // 联系方式
                    this.mobileValue = item.mobile_code?{label: item.mobile_code.substring(1), value: item.mobile_code.substring(1)}:{label: '86', value: '86'}
                    this.phoneValue = item.mobile
                    this.telValue = item.tel_code?{label: item.tel_code, value: item.tel_code, name: item.tel_code_name}:{label: '0571', value: '0571', name: '杭州'}
                    this.telValue1 = item.telphone
                    this.telValue2 = item.telphone_ext
                    this.wechatValue = item.wx
                    this.QQValue = item.qq
                    this.emailValue = item.email
                    // 个人信息
                    this.nickValue = item.honor_name
                    this.sexValue = item.sex?item.sex==1?['男']:[]:['女']
                    this.birthValue = item.birthday
                    // 工作信息
                    this.industryValue = {name: item.industry_name, one:item.industry_parent_id, two:  item.industry_sec_id, three:item.industry_id},
                    this.positionValue = item.duty
                    this.faxValue = item.fax_code?{label: item.fax_code, value: item.fax_code, name: item.fax_code_name}:{label: '0571', value: '0571', name: '杭州'}
                    this.faxValue1 = item.fax
                    this.faxValue2 = item.fax_ext
                    this.webValue = item.website
                    // 地址
                    this.areaValue = item.province_id?[`${item.province_id}`, `${item.city_id}`, `${item.area_id}`]:[]
                    this.province = item.province_name
                    this.city = item.city_name
                    this.area = item.area_name
                    // this.addressData = 
                    this.searchData = item.province_name+item.city_name+item.area_name
                    // 备注
                    this.moduleObj.inputVal = item.note
                    this.moduleObj.uploadData = item.attach_note_img.map(v=>{
                        return {
                            name: v.name,
                            src: v.url,
                            id: v.id
                        }
                    })
                    this.moduleObj.recordObj = item.attach_note_audio.length>0?item.attach_note_audio[0]:{
                        id: '',
                        url: '',
                        data: '',
                        duration: '',
                    }
                    // 公司信息
                    this.legalValue = item.legal
                    this.rangeValue = parseInt(item.score?item.score:0)
                    this.scopeValue = item.scope
                    this.sizeValue = item.scale?[item.scale.toString()]:[]
                    this.currencyValue1 = item.reg_captical_unit?{label: item.reg_captical_unit_name, value: item.reg_captical_unit}:{label: '人民币', value: 'CNY'}
                    this.moneyValue1 = item.reg_captical?this.money(item.reg_captical):''
                    this.currencyValue2 = item.annual_turnover_unit?{label: item.annual_turnover_unit_name, value: item.annual_turnover_unit}:{label: '人民币', value: 'CNY'}
                    this.moneyValue2 = item.annual_turnover?this.money(item.annual_turnover):''
                    //个人地址
                    this.addressData={
                        name:item.address,
                        address:item.address,
                        location: {
                            O:item.longitude,
                            P:item.latitude,
                            lat:item.latitude,
                            lng:item.longitude
                        }
                    }
                    this.$nextTick(()=>{
                        this.$refs.companyInput.updateAutosize()
                        this.$refs.positionInput.updateAutosize()
                        this.$refs.webInput.updateAutosize()
                        this.$refs.scopeInput.updateAutosize()
                        this.$refs.wechatInput.updateAutosize()
                        this.$refs.emailInput.updateAutosize()
                        this.changeFlag = false
                        this.moneyFlag1 = false
                        this.moneyFlag2 = false
                    })
                }
            }
        },
        editCustomer(data) {
            if (Object.keys(data).length>0) {
                this.UPDATE_LOADING(false)
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    this.btnFlag = false
                    return
                } else {
                    this.$router.push({name: 'customPage', query: {id: this.customerId, logo: data.items.logo_big, name: this.nameValue, company: this.companyValue, mobile: '+'+this.mobileValue.label+' '+this.phoneValue}})
                    setTimeout(()=>this.btnFlag = false, 3000)
                }
            }
        },
    },
    beforeRouteLeave (to, from, next) {
        // popup未关闭，不跳转
        if (this.out||this.group||this.source||this.label||this.mobile||this.tel||this.fax||this.industry||this.map||this.remark||this.currency1||this.currency2) {
            this.out = false
            this.label = false
            this.group = false
            this.source = false
            this.mobile = false
            this.tel = false
            this.fax = false
            this.industry = false
            this.map = false
            this.currency1 = false
            this.currency2 = false
            if (this.remark) {
                this.$refs.remark.voiceFlag = false
                if (this.moduleObj.record&&this.moduleObj.recordObj.url) {
                    this.$refs.remark.$refs.record.pause()
                    this.$refs.remark.$refs.record.load()
                }
                this.remark = false
            }
            next(false)
        } else if (
        // 新增时且非完成离开且有输入内容，不跳转离开
        !this.customerId&&!this.btnFlag&&((this.headerImg&&this.headerImg.src)||this.nameValue||this.companyValue||(this.cardImg&&this.cardImg.src)||this.phoneValue||this.telValue1||this.telValue2||this.QQValue
        ||this.emailValue||this.nickValue||this.sexValue.length||this.birthValue||this.industryValue.name||this.positionValue||this.faxValue1||this.faxValue2
        ||this.webValue||this.areaValue.length||this.addressData.address||this.moduleObj.inputVal||this.moduleObj.uploadData.length||this.legalValue
        ||this.rangeValue||this.scopeValue||this.sizeValue.length||this.moneyValue1||this.moneyValue2)) {
            this.$vux.confirm.show({
                content: `<i style="font-size: 50px;" class="weui-icon weui_icon_warn weui-icon-warn"></i>
                            <p style="margin-top: 10px;">有内容未保存, 确定返回?</p>`,
                onCancel() {
                  next(false)
                },
                onConfirm() {
                    next()
                }
            })
        } else {
            next()
        }
    },
    directives: {
        TransferDom
    },
    components: {
        Group, Cell, XInput, XTextarea, PopupPicker, XButton, Flexbox, FlexboxItem, Datetime, Popup, Checklist, Range, labelPage, checkers, Industry, MyMap, FormA
    },
}
</script>

<style lang="less">
.newCustom .down-arrow .weui-cell__ft {
    &::after {
        right: -3px;
        transform: rotate(135deg);
    }
}

.newCustom .weui-cell_access .weui-cell__ft.vux-cell-arrow-down:after {
    right: -4px;
}

.newCustom .weui-label,.newCustom .vux-label,.newCustom .vux-datetime p {
    width: 5em !important;
}

.newCustom .no-width .weui-label,.newCustom .no-width .vux-label {
    width: 3em !important;
}

.newCustom .width55 .vux-label {
    width: 5.5em !important;
}

.newCustom .width12 .vux-label {
    width: 12em !important;
}

.newCustom input,.newCustom .weui-cell__ft,.newCustom .vux-popup-picker-select {
    text-align: left !important;
    font-family: PingFangSC-Regular, Microsoft YaHei, Helvetica;
}

.newCustom .flex-right .weui-cell__bd input {
    text-align: right !important;
}

.newCustom .vux-1px-b::after {
    left: 15px;
}

.newCustom input:disabled,.newCustom input[disabled],.newCustom textarea:disabled {
    background: #fff !important;
    -webkit-text-fill-color: #888;
    opacity: 1;
}

.newCustom .has input:disabled,.newCustom .has input[disabled],.newCustom .has textarea:disabled,.newCustom .has.weui-cell .weui-cell__ft {
    color: #333;
    opacity: 1;
    -webkit-text-fill-color: #333;
    -webkit-opacity: 1;
    white-space:normal;
    word-break:break-all;

    .weui-icon-clear {
        color: #B2B2B2;
        -webkit-text-fill-color: #B2B2B2;
    }
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
