import * as types from './mutation-types'
// 同步方法
const mutations = {
    /**
     * 获取预先定义的流程节点处理人
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.QUERYAPPROVAL](state, { data }) {
        state.queryApprovalData = data
    },  
    /**
     * 流程列表接口
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.PROCESSLIST](state, { data }) {
        state.processListData = data
    },
    /**
     * 清空流程列表接口
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_PROCESSLIST](state,) {
        state.processListData = {}
    },
    /**
     * 流程列表接口
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.VIEWPROCESS](state, { data }) {
        state.viewProcessData = data
    },
    /**
     * 流程节点审批(同意/拒绝/转发/ 撤销
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/1
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.BTNAPPROVAL](state, { data }) {
        state.btnApprovalData = data
    },
    [types.CLEAR_BTNAPPROVAL](state,) {
        state.btnApprovalData = {}
    },
    /**
     * 新增加流程
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/8
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.ADDAPPROVAL](state, { data }) {
        state.addApprovalData = data
    },

}

export default mutations