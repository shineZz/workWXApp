import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 合同记录（合同数量，合同金额）
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CONTRACT_RECORD](state, data){
		state.contractRecord = data.data
	},
	/**
	 * 合同列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CONTRACT_LIST](state, data){
		state.contractList = data.data
	},
	/**
	 * 合同详情
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CONTRACT_DETAIL](state, data){
		state.contractDetail = data.data
	},
	/**
	 * 通过合同号获取合同基本信息
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CONTRACT_DETAIL_BYNUM](state, data){
		state.contractDetailBynum = data.data
	},
	/**
	 * 添加合同
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.ADD_CONTRACT](state, data){
		state.addContract = data.data
	},
	/**
	 * 编辑合同
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UPDATE_CONTRACT](state, data){
		state.updateContract = data.data
	},
}

export default mutations
