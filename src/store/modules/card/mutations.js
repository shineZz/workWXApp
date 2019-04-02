import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 名片扫描
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_CCARD](state, data){
		state.getCCard = data.data
	},
}

export default mutations
