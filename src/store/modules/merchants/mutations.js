import * as types from './mutation-types'
// 同步方法
const mutations = {
    /**
     * 招商任务列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/23
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.MERCHANTLIST](state, { data }) {
        state.merchantListData = data
    },
    /**
     * 招商任务列表2
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/23
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.MERCHANTLIST2](state, { data }) {
        state.merchantListData2 = data
    },
    /**
     * 清除招商任务列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/23
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_MERCHANTLIST](state, type) {
        if (type) {
            state.merchantListData2 = {}
        } else {
            state.merchantListData = {}
        }

    },
    /**
     * 招商经销商进度列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/27
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.SCHEDULELIST](state, { data }) {
        state.scheduleListData = data
    },
    /**
     * 清除招商经销商进度列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/27
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_SCHEDULELIST](state) {
        state.scheduleListData = {}
    },
    /**
     * 选择地区和进程
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/27
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.AREAUDIT](state, { data }) {
        state.AreaAuditData = data
    },
    /**
     * 推广详细图表数据
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/27
     * @author jzq
     * @returns {Promise.<*>}
     */
    [types.PROSALES](state, {data}) {
        state.proSalesData = data
    },
    /**
     * 清空推广详细图表数据
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/27
     * @author jzq
     * @returns {Promise.<*>}
     */
    [types.CLEAR_PROSALES](state) {
        state.proSalesData = null
    },

    /**
     * 招商任务经销商中标和驳回
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.WINNINGREJECTED](state, { data }) {
        state.winningRejectedData = data
    },
}

export default mutations