    <template>
    <div class="tool">
        <group-title>日常应用</group-title>
        <grid :show-lr-borders="true">
            <grid-item v-for="(i,index) in dailyUse" :key="index" :link="i.link" class="myGrid">
                <img :src="i.icon" alt="">
                <span class="grid-center">{{i.title}}</span>
            </grid-item>
        </grid>
        <group-title>移动办公</group-title>
        <grid :show-lr-borders="true">
            <grid-item v-for="(i,index) in moveUse" :key="index" class="myGrid myMoveGrid"  @on-item-click="onItemClick(i)">
                <img :src="i.icon" alt="">
                <span class="grid-center">{{i.title}}</span>
            </grid-item>
        </grid>
        <div v-transfer-dom>
                <confirm
                v-model="btnModel"
                :show-cancel-button="false"
                title="提示"
                >
                    <p style="text-align:center;" v-html='text' />
                </confirm>
            </div>
    </div>
</template>

<script>
import { Grid, GridItem, GroupTitle ,Confirm,  TransferDom } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'tool',
    data() {
        return {
            btnModel:false,
            companyId:this.$store.state.userInfo.company.companyId,   
            userId:this.$store.state.userInfo.user.userId,  
            text:"AI秘书未开通<br/>请拨打<a href='tel:4008813609' style='color:#66AEF4' > 4008813609 </a>进行开通",
            dailyUse:[{
                title:'拜访签到',
                link:'sign?key=1',
                icon:require("@/images/tool/sign1.png")
            },
            {
                title:'工作报告',
                link:'wodkChild?child=1',
                icon:require("@/images/tool/work.png")
            },
            // {
            //     title:'销售计划',
            //     link:'',
            //     icon:require("@/images/tool/sign.png")
            // },
            // {
            //     title:'回款计划',
            //     link:'',
            //     icon:require("@/images/tool/sign.png")
            // }
            ],
            moveUse:[{
                title:'AI秘书',
                link:'AI',
                icon:require("@/images/tool/secretary.png")
            },
            {
                title:'短信助手',
                link:'messageHelp',
                icon:require("@/images/tool/msgHelp.png")
            },
            {
                title:'猎客',
                link:'generalize?type=2',
                icon:require("@/images/tool/zzzq.png")
            },
            {
                title:'推广',
                link:'generalize?type=1',
                icon:require("@/images/tool/zzzzzk.png")
            },
            // {
            //     title:'s',
            //     link:'selectedShare',
            //     icon:require("@/images/tool/zzzzzk.png")
            // }
            ]
        }
    },
    created() {
    },
    mounted(){
    },
    directives: {
        TransferDom
    },
    methods: {
        ...mapActions({
            aiIsHand: 'ai/aiIsHand',
        }),
        onItemClick(data){
            if(data.title=="AI秘书" &&　!(localStorage.getItem('aiIs'))){
                let obj={
                    company_id:this.companyId,
                }
                this.aiIsHand(obj);
            }else{
                this.$router.push({ path: data.link,})
            }
        },
    },
    watch: {        
        //当前AI企业有没有开通  
         aiIsData(data){  
            if( Object.keys(data).length >0 ){ 
                if(data.alert_msg){
                    this.$vux.toast.show({
                        text:data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:'20em'
                    }) 
                }else{  
                    if(data.items.code==0){
                        this.btnModel=true;
                    }else{
                        localStorage.setItem('aiIs',true);
                        this.$router.push({ path: 'AI',})
                    }
                }
                
            }
         },
     },
    computed: {
        ...mapState({
            aiIsData: state => state.ai.aiIsData,
        })
    },
    components: {
        Grid,
        GridItem,
        GroupTitle ,
        Confirm,  TransferDom
    },
}
</script>

<style lang="less">
.talent .weui-search-bar.weui-search-bar_focusing .weui-search-bar__cancel-btn {
    font-size: 14px;
}
.tool{
    .grid-center {
        display: block;
        text-align: center;
        color: #666;
    }
    .weui-grids {
        background-color: #fff;
    }
    .myGrid{
        width:25% !important;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        img{
            width:40px;
            height: 40px;
        }
        span{
            display: inline-block;
            margin-top: 5px;

        }
    }
    .myMoveGrid{
        width:25% !important;
    }
}
</style>

