import * as types from './mutation-types'

const mutations = {
    /**
     * 客户所属行业
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.CUSTOMERINDUSTRY](state, { data }) {
        state.customerIndustryData = data
    },

}

export default mutations