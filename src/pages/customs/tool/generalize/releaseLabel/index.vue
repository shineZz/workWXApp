<template>
    <div class="releaseLabel">
        <div class="releaseLabel-header vux-1px-b">
            推荐内容
        </div>
        <div class="label-md">
            <div class="screening-bd">
                <checker  type="checkBox"  v-model="arr"  selected-item-class="cur">
                    <checker-item class="screening-list" v-for="(item,index) in labelData" :value="item" :key="index" >{{item.field_name}}</checker-item>                               
                </checker>
            </div>
        </div>
        <x-button type="primary" style="position:absolute;bottom:0;" @click.native="saveLabel">保存</x-button>
    </div>
</template>

<script>
import { Scroller , XButton,XTextarea ,Group,Checker, CheckerItem,} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
export default {
    name: 'releaseLabel',
    data() {
        return {
            isLabel:false,
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            status:true,
            opinion:"",
            labelData:[],
            arr:[]
            
        }
    },
    created() {
        let obj={
            t_recommend_types_id:1,
            state:1,
        }
        this.recommend_getFields(obj)
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
        }),
        labelChange(id,index,title){
            let _data = this.labelData
            if(index==0||index==1){

            }else{
                for(let i=0;i<_data.length;i++){
                    if(_data[i].tr_filed_id == id){
                        _data[i].flag = !_data[i].flag
                    }
                }
            }
            this.labelData=_data
            // this.labelData = []
        },
        saveLabel(){
            let content = this.arr.join('、')
            this.$emit("toggleReleaseLabel",content)
        },
         ...mapActions({
            recommend_getFields:'recommend/getFields',
        }),
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
            recommentFiledsData:state=>state.recommend.recommentFiledsData,
        }),
        
    },
    watch:{
        recommentFiledsData(data){
            if(data.alert_msg){
                this.$vux.toast.show({
                    text: data.alert_msg,
                    type: 'text',
                    position: 'top',
                    width:'20em'
                })
            }else{
                let _data=data.items
                 _data.forEach(function(item){
                    item.value=item.tr_filed_id
                    item.name=item.field_name
                })
                this.labelData = _data
            }
        }
    },
    components: {
        Scroller,
        XButton,
        Group,
        XTextarea,
        Checker, CheckerItem,
    },
}
</script>


<style lang="less">
 @import './index.less';
</style>
