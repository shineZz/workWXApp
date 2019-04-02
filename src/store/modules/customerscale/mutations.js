import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 客户分组列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_CUSTOMER_SCALE](state, data){
		state.getScale = data.data
	},
}

export default mutations
