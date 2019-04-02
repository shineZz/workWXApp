<template>
    <div class="dutyRecord" id="dutyRecord">
        <div  v-if="listData.length==0" class="wu-all">
            <section>
                <div><img src="~@/images/wu-icon1.png"></div>
                <p>暂无打卡记录</p>
            </section>
        </div>
        <div style="width:100%;height:100%;" v-else>
            <scroller 
                lock-x 
                scrollbar-y 
                height="100%"
            >
                <ul class="record-signIn">
                    <li v-for="(items,index) in newListData" :key='index'>
                        <div class="point">
                            <img src="@/images/job/point.png" alt="">
                        </div>
                        <div class="up" v-if="items[0]&&items[0].checkinTime">
                            <!-- {{items[0].checkinTime}} -->
                            <div class="up-content">上班已打卡</div>
                            <div class="up-header"></div>
                            <p>{{items[0].checkinTime}}</p>
                        </div>
                        <div class="up-fail" v-if="items[0]&&!items[0].checkinTime">
                            <div class="up-content">
                                上班未打卡</div>
                            <div class="up-header"></div>
                            <p></p>
                        </div>
                        <div class="line">
                            
                        </div>
                        <div  class="turn" v-if="items[1]&&items[1].checkinTime">
                            
                            <div class="turn-content">
                                下班已打卡
                            </div>
                            <div class="turn-header"></div>
                            <p>{{items[1].checkinTime}}</p>
                        </div>
                        <div class="turn-fail" v-if="items[1]&&!items[1].checkinTime">
                            
                            <div class="turn-content">
                                下班未打卡
                            </div>
                            <div class="turn-header"></div>
                            <p></p>    
                        </div>
                    </li>
                </ul>
            </scroller>
        </div>
        
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox, Calendar,Group,Scroller,   } from 'vux'
import { mapState, mapActions } from 'vuex'


export default {
    name: 'dutyRecord',
    data() {
        return {
            value:"nnnn",
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            listData:[],
            newListData:[]
        }
    },
    created() {
        
        
    },
    mounted() {
        this.initList()
    },
    methods: {
        ...mapActions({
            GETWorkSignList:"oasign/GetWorkSignList"
        }),
        initData(){
            // console.log(this.listData,'---------------')
            // this.listData=[{
            //     checkinTime:"2018-06-12",
            //     gpsId:"123",
            //     checkinType:"5"
            // },{
            //     checkinTime:"2018-06012",
            //     gpsId:"123",
            //     checkinType:"4"
            // },{
            //     checkinTime:"2018-06012",
            //     gpsId:"123",
            //     checkinType:"4"
            // },{
            //     checkinTime:"2018-06012",
            //     gpsId:"123",
            //     checkinType:"5"
            // },{
            //     checkinTime:"2018-06012",
            //     gpsId:"123",
            //     checkinType:"4"
            // }]
            let arr = []
            // if(this.listData[0].checkinType==5){
            //     arr.push([this.listData[0]])
            // }
            for(let i=0;i<this.listData.length;i++){
                
                if(this.listData[i].checkinType==4){
                    let new_arr = []
                    new_arr.push(this.listData[i])
                    if(i+1==this.listData.length){
                        arr.push(new_arr)
                    }else{
                        if(this.listData[i+1].checkinType==5){
                            new_arr.push(this.listData[i+1])
                        }else{
                            let obj = {
                                checkinTime:"",
                                gpsId:"123",
                                checkinType:"5"
                            }
                            new_arr.push(obj)
                        }
                        arr.push(new_arr)
                    }
                    
                }else{
                    if(i==0&&this.listData[i].checkinType=='5'){

                        let new_arr = []
                        new_arr.push({
                                    checkinTime:"",
                                    gpsId:"123",
                                    checkinType:"4"
                                })
                        new_arr.push(this.listData[i])
                        arr.push(new_arr)
                    }else{
                        if(i>0&&this.listData[i-1].checkinType=='4'){

                        }else{
                            let new_arr = []
                            new_arr.push({
                                        checkinTime:"",
                                        gpsId:"123",
                                        checkinType:"5"
                                    })
                            new_arr.push(this.listData[i])
                            arr.push(new_arr)
                        }
                    }
                    
                }
            }
            arr.reverse()
            this.newListData = arr
        },
        initList(){
            let obj ={
                userId:this.user_id,
                companyId:this.company_id,
                page:"1",
                count:"10000"
            }
            this.GETWorkSignList(obj)
        }
    },
    computed: {
        ...mapState({
            signListData:state => state.oasign.signListData
        })
    },
    watch: {
        signListData:function(value,olderValu){
            console.log(value,olderValu)
            if(Object.keys(value).length>0){
                if(value.data.alert_msg){
                    this.$vux.toast.show({
                            text: value.data.alert_msg,
                            type: 'text',
                            position: 'top',
                            width:"20em"                                
                        }) 
                }else{
                    this.listData = value.data.items
                    this.initData()
                }
            }
            
        }
    },
    components: {
        CellBox,
        Calendar,
        Group,
        Scroller
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
