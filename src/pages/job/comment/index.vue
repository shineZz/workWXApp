<template>
    <div class="commentRouter">
        <scroller 
            lock-x 
            scrollbar-y 
            height="-36"
            >
            <div class="box1" style="overflow:hidden">
                <ul v-if="status==0 ? true : false">
                    <li v-for="(item,index) in sourceData" :key="index" @click="handleClick(index,item.title,sourceData)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                <ul v-if="status==1 ? true : false">
                    <li v-for="(item,index) in statusData" :key="index" @click="handleClick(index,item.title,statusData)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                <ul v-if="status==2 ? true : false">
                    <li v-for="(item,index) in patterData" :key="index" @click="handleClick(index,item.title,patterData)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                <ul v-if="status==3 ? true : false">
                    <li v-for="(item,index) in pushMoney" :key="index" @click="handleClick(index,item.title,pushMoney)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                <ul v-if="status==4 ? true : false">
                    <li v-for="(item,index) in addressList" :key="index" @click="handleClick(index,item.title,addressList)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                 <ul v-if="status==5 ? true : false">
                    <li v-for="(item,index) in scaleData" :key="index" @click="handleClick(index,item.title,scaleData)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                <ul v-if="status==6 ? true : false">
                    <li v-for="(item,index) in natureData" :key="index" @click="handleClick(index,item.title,natureData)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                <ul v-if="status==7 ? true : false">
                    <li v-for="(item,index) in industryData" :key="index" @click="handleClick(index,item.title,industryData)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.title}} </check-icon>
                    </li>
                </ul>
                <ul v-if="status==8 ? true : false">
                    <li v-for="(item,index) in columnData.items" :key="index" @click="handleClick(index,item.boardName,columnData.items)">
                        <check-icon :value.sync="item.flag" type="plain"> {{item.boardName}} </check-icon>
                    </li>
                </ul>
            </div>
        </scroller>
        <x-button type="primary" @click.native="selectKind">确定</x-button>
    </div>
</template>

<script>
import {   XButton ,Group,CheckIcon,Scroller   } from 'vux'
import { mapState, mapActions , mapMutations } from 'vuex'
import CommonData from '../../../constants/resources.js' 
export default {
    name: 'comment',
    data() {
        return {
           demo2:true,
           sourceData:CommonData.sourceData,
           statusData:CommonData.statusData,
           patterData:CommonData.patterData,
           pushMoney:CommonData.pushMoney,
           addressList:CommonData.addressList,
           scaleData:CommonData.scaleData,
           natureData:CommonData.natureData,
           industryData:CommonData.industryData,
           columnData:[],
           state:"",
           value:"",
           company_id:this.$store.state.userInfo.company.companyId,
           user_id:this.$store.state.userInfo.user.userId,
           boardId:''
        }
    },
    props:{
        status:Number,
    },
    created() {
        this.columnData = this.noticeBoardData
    },
    mounted() {
        if(this.status==0){
            document.title="商机来源"
        }else if(this.status==1){
            document.title="商机状态"
        }else if(this.status==2){
            document.title="拜访状态"
        }else if(this.status==3){
            document.title="汇款方式"
        }else if(this.status==4){
            document.title="区域"
        }else if(this.status==5){
            document.title="规模"
        }else if(this.status==6){
            document.title="性质"
        }else if(this.status==7){
            document.title="行业"
        }else if(this.status==8){
            document.title="所属栏目"
        }
    },
    methods: {
        ...mapMutations({
            SELECTED_STATE: 'addressBook/SELECTED_STATE',
        }),
        ...mapActions({
            
        }),
        handleClick(index,value,data){
            for(let i=0;i<data.length;i++){
                data[i].flag=false
            }
            data[index].flag=true
            
            if(this.status==0){
                this.sourceData = data
            }else if(this.status==1){
                this.statusData = data
            }else if(this.status==2){
                this.patterData = data
            }else if(this.status==3){
                this.pushMoney = data
            }else if(this.status==4){
                this.addressList = data
            }else if(this.status==5){
                this.scaleData = data
            }else if(this.status==6){
                this.natureData = data
            }else if(this.status==7){
                this.industryData = data
            }
            this.state=index
            this.value = value
            this.boardId = data[index].boardId
        },
        selectKind(){
            let obj = {
                id:this.status,
                value:this.value,
                boardId:this.boardId
            }
            this.SELECTED_STATE(obj)
            // this.$router.go(-1)
            this.$emit('toggleCommon')
            document.title="发布公告"
        }
    },
    computed: {
        ...mapState({
            noticeBoardData:state => state.oanotice.noticeBoardData
        })
    },
    watch: {
        
    },
    components: {
        Group,
        CheckIcon,
        Scroller,
        XButton,
    },
}
</script>
<style lang="less">
    .commentRouter{
        .vux-check-icon{
            width:100%;
            height: 100%;
            display: flex;
            align-items: center;
            span{
                display: block;
                height: 100%;
                line-height: 45px;
                flex: 1;
                box-sizing: border-box;
                border-bottom: 1px solid #f5f5f5;
                font-size: @fs15;
            }
        }
    }
</style>

<style lang="less" scoped>
 @import './index.less';


</style>
