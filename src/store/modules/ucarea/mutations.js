import * as types from './mutation-types'

const mutations = {
	/**
	 * 省市区
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/13
	 * @author hezd
	 * @returns {Promise.<*>}
	 */
	[types.UCAREALIST](state, { data }){
		state.ucareaData = data
	},
}

export default mutations