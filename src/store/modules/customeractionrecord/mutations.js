import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 获取客户记录
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_CUSTOMER_RECORDLIST](state, data){
		state.getRecord = data.data
	},
	/**
	 * 添加客户记录
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.ADD_CUSTOMER_RECORD](state, data){
		state.addRecord = data.data
	},
	/**
	 * 添加拨打电话的记录
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.ADD_CALL_RECORD](state, data){
		state.addCall = data.data
	},
}

export default mutations
