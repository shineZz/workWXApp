import * as types from './mutation-types'

const mutations = {
    /**
     * 用户基本信息更新
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author jzq
     * @returns {Promise.<*>}
     */
    [types.DEPARTANDUSERLIST](state, { data }) {
        state.departAndUserData = data
    },
}

export default mutations