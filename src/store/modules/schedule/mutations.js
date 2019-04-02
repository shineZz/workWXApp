import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 获取用户有日程数据的日
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SCHEDULEDAYLIST](state, data){
		state.scheduleDayList = data.data
	},
	/**
	 * 切换日期
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CHANGE_DAY](state, data){
		state.day = data
	},
	/**
	 * 获取日程列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SCHEDULELIST](state, data){
		state.scheduleList = data.data
	},
	/**
	 * 新增/编辑日程
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SAVESCHEDULE](state, data){
		state.saveSchedule = data.data
	},
	/**
	 * 查看日程详情
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.VIEWSCHEDULE](state, data){
		state.viewSchedule = data.data
	},
	/**
	 * 删除日程
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.DELSCHEDULE](state, data){
		state.delSchedule = data.data
	},
	/**
	 * 延期日程
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.DELAYSCHEDULE](state, data){
		state.delaySchedule = data.data
	},
	/**
	 * 执行日程
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/28
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.EXECUTESCHEDULE](state, data){
		state.executeSchedule = data.data
	},
	/**
	 * 按月统计日程
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/5/29
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.STATISTICSSCHEDULE](state, data){
		state.statisticsschedule = data.data
	},
}

export default mutations
