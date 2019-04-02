import * as types from './mutation-types'

const mutations = {
    /**
     * 获取客户的拜访签到记录
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.CUSTOMERSIGNLIST](state, { data }) {
        state.customerSignListData = data
    },
    /**
     * 获取客户的拜访详情
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.CUSTOMERSIGNBYID](state, { data }) {
        state.signByIdData = data
    },
    /**
     * 拜访签退
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.VISITSIGNOUT](state, { data }) {
        state.signOutData = data
    },
    /**
     * 查看下属拜访记录列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.SUBWORKMATESIGNLIST](state, { data }) {
        state.subWorkmateSignListData = data
    },
    /**
     * 获取拜访次数
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.SIGNSTATIC](state, { data }) {
        state.visitStaticData = data
    },
    /**
     * 添加拜访记录
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.ADDSIGN](state, { data }) {
        state.addSignData = data
    },
    /**
     * 编辑拜访记录进行签退
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.EDITSIGNOUT](state, { data }) {
        state.editSignOutData = data
    },
    /**
     * 获取我的拜访记录列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/6
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.MYSIGNLIST](state, { data }) {
        state.mySignListData = data
    },
    /**
     * 查询是否you未签退的
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.HASSIGNOUT](state, { data }) {
        state.hasSignoutData = data
    },
    
}

export default mutations