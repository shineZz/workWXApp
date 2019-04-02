import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 语音听写上传文件
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_XFYUN](state, data){
		state.getXfyun = data.data
	},
	/**
	 * 语音听写上传文件（招商）
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_XFYUN_ZS](state, data){
		state.getXfyun = data.data
	},
}

export default mutations
