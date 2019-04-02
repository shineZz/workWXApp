<template>
    <div class="msgEdit">
        <group class="text-edit" v-if='text_edit'>
            <input type="text" v-model="inputVal">
        </group>
        <group class="introduction-edit" v-else-if='introduction_edit'>
            <x-textarea v-model="introductionDetail" :height='200'></x-textarea>
        </group>
        <div class="list-edit" v-else>
            <scroller 
                lock-x  
                scrollbarY 
                @on-scroll-bottom="loadMore" 
                @on-pulldown-loading="refresh" 
                v-model="status" 
                height="-36" 
                use-pulldown 
                ref="scroller" 
                :scroll-bottom-offst="0"
                :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
                >
                
                <div>
                    <ul>
                        <group v-if='isEducation'>
                            <cell title="工作经历一"  value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="工作经历2" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="工作经历3" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="工作经历4" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="工作经历5" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="工作经历6" value="2011-2018" is-link>
                    
                            </cell>
                        </group>
                        <group v-else>
                            <cell title="教育经历一"  value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="教育经历2" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="教育经历3" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="教育经历4" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="教育经历5" value="2011-2018" is-link>
                    
                            </cell>
                            <cell title="教育经历6" value="2011-2018" is-link>
                    
                            </cell>
                        </group>
                    </ul>
                <load-more tip="加载中" v-if="loadFlag"></load-more>
                <!-- <div class="no-more"  v-if="!loadFlag && onFetching && page>1" >已到底部</div> -->
                </div>
            </scroller>
        </div>
        <x-button type="primary" v-if='text_edit||introduction_edit' @click.native="toEducationAdd">确定</x-button>
        <x-button type="primary" v-else @click.native="toEducationAdd">新增</x-button>
    </div>    
</template>

<script>
import { XButton, Group , XInput ,Scroller,Cell,XTextarea } from 'vux';
import { mapState, mapActions ,mapMutations} from 'vuex';

export default {
    name: 'msgEdit',
    data() {
        return{
            value1:'',
            text_edit:true,
            list_edit:false,
            introduction_edit:false,
            isEducation:true,
            status: {
                pulldownStatus: 'default'
            },
            loadFlag:false,
            onFetching:false,
            myVal:'',
            inputVal:'',
            inputId:"",
            introductionDetail:"",
        }
    },
    props:{
        val1:Number,
        val2:String,
    },
    created() {
        if(typeof(this.val1)!=='undefined'){
            this.inputVal = this.val2
            this.inputId = this.val1
        }
        let state = this.$route.query.state
        let id = this.$route.query.id
        // let title;
        // //state 为1的时候是编辑，为2的时候为列表（教育经历，工作经历）
        // title = id==0?'真实姓名':id==1?'邮箱':id==2?'微信':id==3?'QQ':id==4?'工作地点':id==5?'学校名称':id=="6"?'院系/专业':id==7?'学历':id==8?'公司名称':id==9?'职位名称':id==10?'我的工作经历':id==11?'我的教育经历':''
        // document.title=title
        console.log(state,'=====================')
        if(state==1){
            this.text_edit = true
            this.inputVal = this.$route.query.val
            this.inputId = this.$route.query.id
        }else if(state==2){
            this.list_edit = true
            this.introduction_edit = false
            this.text_edit = false
            if(id==10){
                this.isEducation = true
            }else if(id==11){
                this.isEducation = false
            }
        }else if(state==3){
            this.list_edit = false
            this.introduction_edit = true
            this.text_edit = false
            
        }
        if(typeof(this.val2)=='undefined'){
            console.log(this.$route.query.val)
            this.value1 = this.$route.query.val
        }
    },
    mounted(){
    },
    methods: {
        ...mapActions({
        }),
        ...mapMutations({
            UserChange:'user/USERCHANGE'
        }),
        sexChange(data){
            console.log(data)
        },
        loadMore () {
            // console.log('-----')
            if(this.onFetching){
                
            }else{
                // this.onFetching = true
                // let that = this
                // this.page++
                // let obj = {
                //     userId:this.user_id,
                //     companyId:this.company_id,
                //     page:this.page,
                //     count:this.count
                // }
                // this.QueryVisitList(obj)
            }
        },
        refresh () {
            let that = this
            // this.loadMore = false
            // this.loadingHand(true)
            if(this.status.pulldownStatus != 'default'){
                // let obj = {
                //     userId:this.user_id,
                //     companyId:this.company_id,
                //     page:1,
                //     count:this.count
                // }
                // this.QueryVisitList(obj)
                // setTimeout(function(){
                // that.$refs.scroller.donePulldown()
                //     that.loadingHand(false)
                // },500)
                that.$refs.scroller.donePulldown()
                this.onFetching = false
            }
        },
        toEducationAdd(){
            if(typeof(this.val1)=='undefined'&&typeof(this.$route.query.state)!=='undefined'&&this.$route.query.state==1){
                let obj = {
                            id:this.inputId,
                            value:this.inputVal
                        }
                this.UserChange(obj)
                console.log(obj)
                this.$router.go(-1)
            }
            console.log(this.val1,typeof(this.val1)!=='undefined','--------------')
            if(typeof(this.val1)!=='undefined'){
                console.log('ppppooooo')
                let obj = {
                        id:this.val1,
                        value:this.val2
                    }
                this.UserChange(obj)
                let title;
                let id = this.$route.query.id;
                //state 为1的时候是编辑，为2的时候为列表（教育经历，工作经历）
                title = id==0?'真实姓名':id==1?'邮箱':id==2?'微信':id==3?'QQ':id==4?'工作地点':id==5?'学校名称':id=="6"?'院系/专业':id==7?'学历':id==8?'公司名称':id==9?'职位名称':id==10?'我的工作经历':id==11?'我的教育经历':''
                document.title=title
                this.$emit("toggleMsgEdit",this.inputId,this.inputVal)
            }
            if(typeof(this.val1)=='undefined'&&this.$route.query.state==2){
                let id = this.$route.query.id;
                this.$router.push({path:'educationWork',query:{id:id}})

            }
            // if(typeof(this.$route.query.state)=='undefined'){
            //     let obj = {
            //                 id:this.inputId,
            //                 value:this.inputVal
            //             }
            //     this.UserChange(obj)
            //     this.$emit("toggleMsgEdit",this.inputId,this.inputVal)
            // }else{
            //     if(typeof(this.val1)=='undefined'){
            //         this.$router.push({path:'educationWork',query:{id:this.$route.query.id}})
            //     }else{
                    
            //         if(this.$route.query.state==2){
            //             this.$router.push({path:'educationWork'})
            //         }else{
            //             this.value1 = obj.value1
            //             this.$emit("toggleMsgEdit",obj.id,obj.value1)

            //         }
            //     }
            // }
            
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            storeSchool:state =>state.user.storeSchool,
            storeMajor:state =>state.user.storeMajor,
            userHasChange:state =>state.user.userHasChange,
            storeEmail:state =>state.user.storeEmail,
        })
    },
    watch: {
        storeSchool:function(data){
            console.log(data,'------')
            this.value1 = data
        },
        value1:function(data){
            console.log(data)
            this.value1 = data
        },
        userHasChange:function(data){
            console.log(data,'应该变了吧，曹尼玛的在不变劳斯弄死你')
        },
        storeEmail:function(data){
            console.log(data,'============email=======')
        },
        val3:function(data){
            console.log(data)
        },
        val4:function(data){
            console.log(data)
        }
    },
    components: {
        Group, XButton, XInput, Scroller,Cell,XTextarea
    }
}
</script>

<style lang="less">

</style>


<style lang="less" scoped>
 @import './index.less';
</style>