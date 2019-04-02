<template>
    <div class="signEvent">
        <scroller 
          lock-x 
          height='-37'
          ref="scroller"
          >
          <div style="overflow:hidden">
            <group>
              <cell title="大客户签到" v-for="(item,index) in signEvent" :key='index' @click.native="choiceEvent(item.id)">
                <x-icon slot="icon" type="ios-circle-outline" class="cell-x-icon" v-if="!item.flag"></x-icon>
                <x-icon slot="icon" type="ios-checkmark" class="cell-y-icon" v-if="item.flag"></x-icon>
              </cell>
            </group>
            <p class="explain">
              管理员可以在PC端管理添加自定义签到事件
            </p>
          </div>
        </scroller>
        <x-button type="primary" @click.native="goBack">确定</x-button>
    </div>
</template>

<script>
import {  Scroller,Cell,Group,GroupTitle,XButton} from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'

export default {
    name: 'signEvent',
    data() {
      let self = this;
        return {
            user_id:this.$store.state.userInfo.user.userId,
            company_id:this.$store.state.userInfo.company.companyId,
            signEvent:[
            {
              title:"大客户拜访",
              id:0,
              flag:false
            },{
              title:"大客户拜访1",
              id:1,
              flag:false
            },{
              title:"大客户拜访2",
              id:2,
              flag:false
            },{
              title:"大客户拜访3",
              id:3,
              flag:false
            }
          ],
          choiceResult:{}
        }
    },
    created() {
    },
    methods: {
        ...mapMutations({
            CHANGE_PAGETYPE: 'resume/CHANGE_PAGETYPE',
            SEARCH_VALUE: 'resume/SEARCH_VALUE',
        }),
        choiceEvent(id){
          this.signEvent.forEach(function(item){
            if(item.id==id){
              item.flag=true;
              this.choiceResult=item
            }else{
              item.flag=false
            }
          },this)
        },
        goBack(){
          this.$emit('toggleSignevent',this.choiceResult)
        }
    },
    computed: {
        ...mapState({
            pageType: state => state.resume.pageType,
        })
    },
    components: {
      Scroller,
      Cell,
      Group,
      GroupTitle,
      Scroller,
      XButton
    },
}
</script>
<style lang="less">
  .signEvent{
    .cell-x-icon {
      display: block;
      fill:#c8c8cd;
    }
    .cell-y-icon {
      display: block;
      fill:  #09bb07;
    }
    .explain{
      box-sizing:border-box;padding:@px10 @px15;color:#666
    }
    button{
      line-height: 36px;
    }
  }
</style>

<style lang="less" scoped>
 @import './index.less';
</style>
