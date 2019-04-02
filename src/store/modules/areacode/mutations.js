import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 国际区号信息列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/09
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.FIND_ALL_AREA_CODE_BYPARENT](state, data){
		state.areaCodeByparent = data.data
	},
}

export default mutations
