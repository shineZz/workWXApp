<template>
    <div>
        <div class="member" v-show="!ifAddressBook">
            <h3><slot>参与人</slot><span v-if="!ifView">点击头像可删除</span></h3>
            <section>
                <div v-if="ifSelf">
                    <img :src="headLogo" alt="" :onerror="logo">
                    <p>{{userName}}</p>
                </div>
                <div v-for="(item, index) in staff" :key="index">
                    <img :src="item.headPortrait" :onerror="logo" :alt="item.userName" @click="deleteStaff(index,item.userId)">
                    <p>{{item.userName}}</p>
                </div>
                <div v-if="!ifView">
                    <x-icon type="ios-plus-empty" size="30"  class="addStaff-add"  @click="addStaff"></x-icon>
                </div> 
            </section>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name: 'addStaff',
    props: ['ifView', 'ifSelf'],
    data() {
        return {
            ifAddressBook: false,
            staff: [],
            headLogo:this.$store.state.userInfo.user.headLogo?this.$store.state.userInfo.user.headLogo:require('@/images/xsdefult.jpg'),
            userId: this.$store.state.userInfo.user.userId,
            userName:this.$store.state.userInfo.user.trueName,
            logo: 'this.src="' + require('@/images/xsdefult.jpg') + '"' ,
        }
    },
    created() {
        this.staff = this.selectedMember;
        if(/changePlan|newPlan/.test(this.$route.path)){
           this.SELECTED_MEMBER([{
                    userId:this.userId,
                    userName:this.$store.state.userInfo.user.trueName,
                    headPortrait:this.$store.state.userInfo.user.headLogo,
                }])
        }
        
    },
    methods: {
        ...mapMutations({
            SELECTED_MEMBER: 'addressBook/SELECTED_MEMBER',
            INITCOMPANYOBJ:'addressBook/INITCOMPANYOBJ',
            FLAGFORINIT:'addressBook/FLAGFORINIT'
        }),
        // 添加人员
        addStaff() {
            this.$emit('toggleAddress')

            let that = this
            let arr = this.$store.state.addressBook.storeUserList;
            let selectMember = this.$store.state.addressBook.selectedMember;
            
            for(let i=0;i<arr.length;i++){
                for(let j=0;j<arr[i].childrenList.length;j++){
                    for(let n=0;n<selectMember.length;n++){
                        if(arr[i].childrenList[j].userId == selectMember[n].userId){
                            arr[i].childrenList[j].flag = true
                            break ;
                        }else{
                            arr[i].childrenList[j].flag = false
                        }
                    }
                }
            }
            if(/approval/.test(this.$route.path)){
                arr.forEach(items => {
                    items.childrenList.forEach(item =>{
                        item.flag=false
                    })
                });
                this.INITCOMPANYOBJ(arr)
                
            }else if(/newPlan|changePlan/.test(this.$route.path)){
                arr.forEach(items => {
                    items.childrenList.forEach(item =>{
                        if(item.userId==that.userId){
                            item.flag = true
                        }
                    })
                });
                this.selectedMember.push({
                        userId:this.userId,
                        userName:this.$store.state.userInfo.user.trueName,
                        headPortrait:this.$store.state.userInfo.user.headLogo,
                    })
                this.INITCOMPANYOBJ(arr)
            }else{
                this.INITCOMPANYOBJ(arr)
            }
            this.FLAGFORINIT()
            
            
        },
        // 删除人员
        deleteStaff(index,userId) {
            if (this.ifView) {
                return
            }
            this.staff.splice(index, 1)
            let arr = this.$store.state.addressBook.storeUserList;
            for(let i=0;i<arr.length;i++){
                for(let j=0;j<arr[i].childrenList.length;j++){
                    if(arr[i].childrenList[j].userId == userId){
                        arr[i].childrenList[j].flag = false
                    }
                }
            }
            
            this.SELECTED_MEMBER(this.staff)
            this.INITCOMPANYOBJ(arr)
        },
    },
    computed: {
        ...mapState({
           selectedMember: state => state.addressBook.selectedMember,
           
        })
    },
    watch: {
        selectedMember: function(arr) {
            if (this.ifSelf) {
                this.staff = arr.filter(v => v.userId !== this.userId)
            } else {
                this.staff = arr
            }
        },        
    },
    components: {
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
