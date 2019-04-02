import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 回款状态列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/14
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.PSTATUS_LIST](state, data){
		state.pStatusList = data.data
	},
}

export default mutations
