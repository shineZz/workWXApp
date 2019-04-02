<template>
    <div class="router-all">
        <div v-if="!isMaps" class="router-box">    
            <group>
                <div class="map-box vux-1px" @click="toVisitMap">
                    <img :src="imgUrl ? imgUrl :require('@/images/job/map.png')" alt="">
                    <div>
                        <p class="address-msg">{{initAddress.name}}</p>
                        <p class="address-detail">{{initAddress.address}}</p>
                        <p class="trimming">地点微调</p>
                    </div>
                </div>
            </group>
            <FormA :moduleObj="moduleObj" />
        </div>
       <div v-if="!isMaps">
           <x-button type="primary" :disabled="isDisabled" :show-loading='isDisabled' @click.native="addAddress">提交</x-button>
        </div>
        <CanvasMapImg v-if="isMaps" @toggleMap="toggleMap"  />
        <div v-transfer-dom>
            <loading :show="loadingShow" text=""></loading>
        </div>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Cell ,Group,XButton, ButtonTab,XTextarea, Scroller,TransferDom ,Loading } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import FormA from '@/components/formA'
import CanvasMapImg from '../visitMap'
import {XSAPI_URL,API_PARM_OBJ,LG_AES_XSAPI,LG_AES_SALT ,} from '@/constants/interface';
import * as aes from '@/util/lgaes';
import lrz from 'lrz';
import axios from 'axios';
export default {
    name: 'visitDetail',
    data() {
        return {
           
            moduleObj:{
               placeholder:'输入文字不超过500字' ,
               title:'签到备注',
               max:500,
               inputVal:'',
               uploadData:[],   
               
            },
            isMaps:false,
            imgUrl:"",
            lat:"",
            lng:"",
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            loadingShow:false,
            pushData:{},
            initAddress:{
                name:"",
                address:''
            },
            address:"",
            name:"",
            isDisabled:false,
        }
    },
    created() {
        
        
    },
    directives: {
        TransferDom
    },
    mounted() {
        let _this=this
        $.getScript('http://api.map.baidu.com/getscript?v=2.0&ak=CBiu8d6o1peWFBWqvzYGA7fy', function() {
            _this.getMsg()    
        }, this);
    },
    methods: {
        ...mapActions({
            ADDSign:'oasign/AddSign',
        }),
        ...mapMutations({
            handLoging:'UPDATE_LOADING',
            Isrefresh:'oasign/ISREFRESH',
            AddData:'oasign/ADDDATA',
        }),
        addAddress(){
            this.handLoging(true)
            let obj = {
                    userId:this.user_id,
                    companyId:this.company_id,
                    x:this.initAddress.location.lng.toString(),
                    y:this.initAddress.location.lat.toString(),
                    checkinType:'1',
                    type:'0',
                    note:this.moduleObj.inputVal,
                    name:this.initAddress.name,
                    address:this.initAddress.address,
                }
                let fileData = [];
                this.moduleObj.uploadData.forEach((item,i) => {  
                    let objArr={origin_name:item.name,data:item.src}
                    fileData.push(objArr);
                });
                if(fileData.length>0){
                        obj.fileData=JSON.stringify(fileData) 
                }
                this.isDisabled = true
                this.AddData(obj)
                this.ADDSign(obj)
                this.Isrefresh(true)
                // _this.$vux.toast.show({
                //     text: text,
                //     type: 'text',
                //     position: 'top',
                //     width:"20em"                                
                // })  
        },
        getMsg(){
            let that = this 
            let searchVal
            if(this.value){
                searchVal = that.value
            }else{
                searchVal = "公司"
            }
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    let myLocation = r.point.lat+","+r.point.lng
                    that.lng = r.point.lng;
                    that.lat = r.point.lat;
                    let obj = {
                        query:searchVal,
                        location:myLocation,
                        output:'json',
                        radius:"1000",
                        ak:'CBiu8d6o1peWFBWqvzYGA7fy' 
                    };
                    $.ajax({
                        type : 'GET',
                        dataType : 'jsonp',
                        data : obj,
                        url : "http://api.map.baidu.com/place/v2/search",
                        success : function (data){
                            
                            if(data.results.length==0){
                                that.$vux.toast.show({
                                    text: '未搜索到结果',
                                    type: 'text',
                                    position: 'middle',
                                    width:'15em'
                                })
                            }else{
                                that.initAddress = data.results[0]
                                that.imgUrl = 'http://api.map.baidu.com/staticimage?center=&width=400&height=300&zoom=15&markers='+data.results[0].location.lng+","+data.results[0].location.lat
                                that.name = data.results[0].name
                                that.address = data.results[0].address
                            }
                        }
                    });

                }
                else {
                    alert('failed'+this.getStatus());
                }        
            });
            
           
        },
        toggleMap(data){
            this.isMaps=!this.isMaps
            if(!this.isMaps){
                this.imgUrl='http://api.map.baidu.com/staticimage?center=&width=400&height=300&zoom=15&markers='+data.lng+","+data.lat
                this.lng = data.selectedData.location.lng
                this.lat = data.selectedData.location.lng
                this.pushData = data.selectedData
                this.initAddress.address = data.selectedData.province+data.selectedData.city+data.selectedData.area
                this.initAddress.name = data.selectedData.name
                this.initAddress = data.selectedData
                // console.log()
            }
            // console.log(this.lng)
             
        },
        toVisitMap(){
            this.toggleMap()
            document.title="拜访签到"
        },
        
    },
    computed: {
        ...mapState({
            signState:state=> state.oasign.signState
        })
    },
    watch: {
        signState:function(data){
            console.log(data,'00000')
            this.isDisabled = false
            this.handLoging(false)
            if(data.data.alert_msg){
                 this.$vux.toast.show({
                    text: data.data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:"20em"                                
                }) 
            }else{
                 this.$vux.toast.show({
                    text: '新增成功',
                    type: 'text',
                    position: 'top',
                    width:"20em"                                
                }) 
            }
            this.$router.go(-1)
        }
    },
    components: {
        CellBox,
        Cell,
        Group,
        ButtonTab, 
        Scroller,
        XTextarea,
        XButton,
        FormA,
        CanvasMapImg,
        Loading,
    },
}
</script>
<style lang="less">
html,body{
    overflow:hidden;
}
    #visitDetail{
        .vux-badge-dot{
            float: right !important;
            margin-right: 20px;
        }
    }
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
