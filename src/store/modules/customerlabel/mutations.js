import * as types from './mutation-types'

const mutations = {
    /**
     * 客户标签（标签为分组样式）
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/7
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.LABELLIST](state, { data }) {
        state.labelListData = data
    },
}

export default mutations