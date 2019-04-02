import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 跳转列表页
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/23
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CHANGE_PAGETYPE](state, data){
		state.pageType = data
	},
  /**
	 * 简历列表数据
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/16
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.TALENTLIST](state, data){
		state.talentListData = data
	},
  /**
	 * 简历列表拼接
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/4/16
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.LIST](state, clear){
		if (state.talentListData.data.items) {
			if (clear) {
				state.list = []
			}
			state.list = state.list.concat(state.talentListData.data.items.list)
			localStorage.setItem("list",JSON.stringify(state.list))
		}
	},
	/**
	 * 修改简历列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/4/2
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CORRECT_TALENTLIST](state, {index, key, value}){
		state.list[index][key] = value
	},
	/**
	 * 清除简历列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/23
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CLEAR_TALENTLIST](state){
		state.talentListData = null
		state.list = []
	},
	/**
	 * 简历详情
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/16
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.RESUMEDETAIL](state, data){
		state.resumeDetailData = data
	},
	/**
	 * 清除简历详情
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/19
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CLEAR_RESUMEDETAIL](state){
		state.resumeDetailData = null
	},
	/**
	 * 加入意愿
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/19
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.ADDSUBSCRIBE](state, data){
		state.subscribeInfo = data
	},
	/**
	 * 移除意愿
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/19
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.REMOVESUBSCRIBE](state, data){
		state.subscribeInfo = data
	},
	/**
	 * 订阅简历
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/20
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.BUYSUBSCRIBE](state, data){
		state.subscribeInfo = data
	},
	/**
	 * 订阅简历数-1
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/4/12
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.REDUCE_RESUME_BALANCE](state){
		state.talentListData.data.items.resume_balance = state.talentListData.data.items.resume_balance - 1
	},
	/**
	 * 清除加入移除订阅信息
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/3/20
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CLEAR_SUBSCRIBE](state){
		state.subscribeInfo = null
	},
	/**
	 * 搜索信息
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/4/4
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SEARCH_VALUE](state, data){
		state.searchValue = data
	},
}

export default mutations
