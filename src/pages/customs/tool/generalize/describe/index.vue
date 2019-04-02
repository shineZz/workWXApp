<template>

    <div class="describe">
        <scroller     
          lock-x  
          scrollbarY 
          height="-36"
          >
          <div style="overflow:hidden">
            <!-- <group-title class="vux-1px-b">备注：</group-title>
            <x-textarea placeholder="最多填写500字,录音可自动转换为文字和保存录音" :height="150" v-model="content" class="vux-1px-b">
            </x-textarea> -->
            <FormA :moduleObj="moduleObj" />
          </div>
        </scroller>
        <x-button type="primary" @click.native="hideCom">保存</x-button>
    </div>
</template>

<script>
import { Scroller , XButton ,GroupTitle,Confirm,XTextarea} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import FormA from '@/components/formA'
export default {
    name: 'describe',
    data() {
        return {
            isLabel:false,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId, 
            loadFlag:false ,//加载图标 要不 要显示
            isPhoto:false,
            isViedo:false,
            content:'',
            moduleObj: {
                title: '备注',
                placeholder: '最多填写500个字，语音录入可自动转换文字和保存录音' ,
                max: 500,
                inputVal: '这里是任务描述这里是任务描述这里是任务描述这里是任务描述',
                uploadData: ['@/images/img/pic400-1.870fd02.jpg','@/images/img/pic400-1.870fd02.jpg'],
                record: true,
                showBtn: false,
                disabledFlag:false,
            },
        }
    },
    props:['describeData'],
    created() {
        
    },
    mounted(){
        if(this.describeData&&this.describeData.flag){
            this.moduleObj.disabledFlag=true;
        }
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
        }),
        uploadCover(e){
            this.isPhoto=true;
        },
        uploadViedo(e){
            this.isViedo=true;
        },
        hideCom(){
            this.$emit('toggleDescribe',this.moduleObj.inputVal)
        }
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
        }),
        
    },
    components: {
        Scroller,
        XButton,
        GroupTitle,
        Confirm ,
        XTextarea,
        FormA
    },
}
</script>

<style lang="less">
.describe{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .weui-cell:before{
        display: none;
    }
    textarea{
        font-size: 16px;
    }
    .weui-cells__title{
        font-size: 16px;
    }
}

</style>

