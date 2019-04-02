<template>
    <div class="checkMessage">
        <group class="record-parent">
            <x-input title="客户：" v-model="name" disabled></x-input>
            <x-input title="类型：" v-model="type" disabled></x-input>
            <x-input title="时间：" v-model="date" disabled></x-input>
            <FormA :moduleObj='moduleObj' class="checkMssageGroup" />
        </group>
        <div class="btn-box">
            <x-button type="primary" @click.native="toReturn">转发</x-button>
            <x-button type="primary" @click.native="sendNext">再发一条</x-button>
        </div>
    </div>
</template>

<script>
import {  Popover , GroupTitle ,Scroller,Cell,XButton,XInput,Group,XTextarea} from 'vux'
import { mapState,mapActions,mapMutations, } from 'vuex'
import VueEmit from '@/util/vueEimt';
import FormA from '@/components/formA';
export default {
    name: 'messageHelp',
    data() {
        return {
            name:"",
            type:"发送短信",
            date:"",
            content:"",
            isDisabled:false,
            id:0, //短信记录id
             moduleObj: {
                title: '内容：',
                placeholder: '最多填写500字，语音录入可自动转换文字和保存录音。运营商规定单条70个字，如超出70个字将按多条计费。' ,
                max: 500,
                inputVal: '',
                uploadData: [],
                record: true,
                showBtn: false,
                disabledFlag:true,
                uploadFlag:true,
                textareaHeight:150,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                },
                type: 12,
            },
        }
    },
    props:['toggleCheckMessage','checkData'],
    created() {
        //父级传来的数据 短信数据
        this.name = this.checkData.send_names;
        this.date = this.checkData.add_time;
        this.moduleObj.inputVal = this.checkData.content;
        this.id= this.checkData.id;
        this.isDisabled=true;
        this.moduleObj.recordObj=this.checkData.attach.length>0?this.checkData.attach[0]:{}
        
    },
    methods: {
        //转发
        toReturn(){
            let obj={
              flag:false,
              res:{
                id:this.id,
                typeState:1, //转发
                checkData:this.checkData
              }
            };
            VueEmit.$emit('changeToggle',obj);
        },

        //再发一条
        sendNext(){
            let obj={
              flag:false,
              res:{
                id:this.id,
                typeState:2, //转发
                checkData:this.checkData
              }
            };
            VueEmit.$emit('changeToggle',obj);
        }
    },
    computed: {
    },
    components: {
        Popover,
        GroupTitle,
        Scroller,
        XButton,
        XInput,
        Group,
        XTextarea,
        FormA
    },
}
</script>

<style lang="less">
 @import './index.less';
</style>


