import * as types from './mutation-types'

const mutations = {
    /**
     * 拜访签到事件
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/7
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.VISITYTYPELIST](state, { data }) {
        state.visitTypeData = data
    },
}

export default mutations