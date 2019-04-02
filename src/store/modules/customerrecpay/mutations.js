import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 回款记录金额合计
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.PAYMENT_SUM](state, data){
		state.paymentSum = data.data
	},
	/**
	 * 回款记录列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.PAYMENT_LIST](state, data){
		state.paymentList = data.data
	},
	/**
	 * 回款记录详情
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.PAYMENT_DETAIL](state, data){
		state.paymentDetail = data.data
	},
	/**
	 * 添加回款记录
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.ADD_PAYMENT](state, data){
		state.addPayment = data.data
	},
	/**
	 * 编辑回款记录
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UPDATE_PAYMENT](state, data){
		state.updatePayment = data.data
	},
	/**
	 * 回款操作
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.RECEIVE_PAYMENT](state, data){
		state.receivePayment = data.data
	},
	/**
	 * 分期回款期数列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/13
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.PAY_INSTALL_LIST](state, data){
		state.payInstallList = data.data
	},
}

export default mutations
