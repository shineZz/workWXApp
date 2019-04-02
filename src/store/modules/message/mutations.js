import * as types from './mutation-types'

const mutations = {
    /**
     * 获取短信列表
     * @param Object [k=>v参数对象] obj
     * @since 2018年8月11日
     * @author liuxz
     */
    [types.GETSMSLISTS](state,{ data }) {
        state.smsListsData = data
    },
    /**
     * 添加短信
     * @param Object [k=>v参数对象] obj
     * @since 2018年8月11日
     * @author liuxz
     */
    [types.ADDSMSRECORD](state,{ data }) {
      state.addSmsData = data
    },

   /**
   * 删除短信
   * @param Object [k=>v参数对象] obj
   * @since 2018年8月11日
   * @author liuxz
   */
    [types.DELETESMSRECORD](state,{ data }) {
    state.deleteSmsData = data
    },

    /**
     * 添加发送短信的动态记录接口
     * @param Object [k=>v参数对象] obj
     * @since 2018年8月11日
     * @author liuxz
     */
    [types.SENDSMS](state,{ data }) {
      state.sendSmsData = data
    },
    /**
     * 拆分短信
     * @param Object [k=>v参数对象] obj
     * @since 2018年8月21日
     * @author hezd
     */
    [types.ADDSMSFROMWEB](state,{ data }) {
      state.addSmsFromWebData = data
    },
};

export default mutations
