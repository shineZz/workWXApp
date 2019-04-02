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
	[types.SEGMENT_LIST](state, data){
		state.segmentData = data.data
	},
}

export default mutations
