import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 根据条件获取数据字典
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/31
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.DICT](state, data){
		state.dict = data.data
	},
}

export default mutations
