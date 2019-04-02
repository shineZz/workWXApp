import * as types from './mutation-types'

const mutations = {
    /**
     * 获取发布任务全部行业
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/7
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.ALLINDUSTRY](state, { data }) {
        state.allIndustryData = data
    },
}

export default mutations