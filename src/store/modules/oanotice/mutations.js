import * as types from './mutation-types'


// 通讯录
const mutations = {
  /**
     * 公告列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author hezd
     */
    [types.GETNOTICELIST](state, data) {
      state.noticeData = data.data
    },
   /**
     * 公告栏目
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author hezd
     */
    [types.SEARCHNOTICEBOARD](state, data) {
      data.data.items.filter(function(item){
        item.flag=false
      })
        state.noticeBoardData = data.data
    },
    /**
     * 发布公告
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author hezd
     */
    [types.SAVENOTICE](state, data) {
      
      state.isSuccess = data.data
    },
    /**
     * 系统通知
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/30
     * @author hezd
     */
    [types.GETSYSLIST](state, data) {
      
      state.sysMessageData = data.data
    },
    /**
     * 公告详情
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/31
     * @author hezd
     */
    [types.VIEWNOTICE](state, data) {
      state.noticeView = data.data.items
    },
    /**
     * 未读公告
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/6
     * @author hezd
     */
    [types.GETNOTVIEWNUMBER](state, data) {
      if(data.data.alert_msg){
        state.notViewNumber = '0'
      }else{
        state.notViewNumber = data.data.items.count
      }
    },
    /**
     * 是否有权限
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/7
     * @author hezd
     */
    [types.ISJURISDICTION](state, data) {
      // if(data.data.data.items){

      // }
      state.hasJurisdiction = data
    }
}

export default mutations
