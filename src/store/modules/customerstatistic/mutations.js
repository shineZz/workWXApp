import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 获取客户统计的小红点
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/06
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_STATISTIC_DETAILS](state, data){
		state.statisticDetails = data.data
	},
}

export default mutations
