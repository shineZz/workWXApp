import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
	 * 获取话术列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/15
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.TALKABOUT](state, { data }){
		 if(!data.alert_msg){
			data.items.forEach((it,i)=>{
				it.flag=false;
			}) 
		}
		state.talkAboutData = data
	},
	/**
	 * 获取主叫号码列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/15
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.PHONELIST](state, { data }){
		state.phoneListData = data
	},
	/**
	 * 查询全量的任务名称
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/16
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.QUERYNAMELIST](state, { data }){		
		state.queryNameListData = data
	},
	/**
	 * 添加通话记录到新的任务
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.ADDCUSTOMER](state, { data }){		
		state.addCustomerData = data
	},
	/**
	 * 创建ai任务
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/16
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.ADDAITASK](state, { data }){		
		state.addAiTaskData = data
	},
	/**
	 * 获取当前线路的席位
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/16
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.SEATS](state, { data }){		
		state.seatsData = data
	},
	/**
	 * 获取任务列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/17
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.QUERYLIST](state, { data }){		
		state.queryListData = data
	},
/**
	 * 获取全部启动/全部暂停 按钮状态
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/17
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.ALLTASKSTATUS](state, { data }){		
		state.allTaskStatusData = data
	},
	/**
	 * 启动全部任务
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/17
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.ALLTASKSTART](state, { data }){		
		state.allTaskStartData = data
	},
	/**
	 * 暂停全部任务
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/17
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.ALLTASKEND](state, { data }){		
		state.allTaskEndData = data
	},
	/**
	 * 获取话术的行业名称
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/17
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.INDUSTRYSCREENING](state, { data }){		
		state.industryScreeningData = data
	},
	/**
	 * 获取任务统计分析结果
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/17
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.STATISTIC](state, { data }){		
		state.statisticalData = data
	},
	/**
	 * 获取任务下的通话列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.TASKPHONELIST](state, { data }){		
		state.taskPhoneListData = data
	},
	/**
	 * 获取任务下的通话
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.TASKPHONEDETAIL](state, { data }){		
		state.taskPhoneDetaiData = data
	},

	/**
	 * 删除任务
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.DELTASK](state, { data }){		
		state.delTaskData = data
	},
	/**
	 * 启动任务
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.STARTTASK](state, { data }){		
		state.startTaskData = data
	},
	/**
	 * 暂停任务
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.PAUSETASK](state, { data }){		
		state.pauseTaskData = data
	},
	/**
	 * 提交已读状态
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.READTASK](state, { data }){		
		state.readTaskData = data
	},
	/**
	 * 提交人工意向等级
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.INTENTIONGRADE](state, { data }){		
		state.intentionGradeData = data
	},
	/**
	 * 外呼方式
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/20
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.OUTBOUNDWAY](state, { data }){		
		state.outboundWayData = data
	},
	/**
	 * 当前AI企业有没有开通
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/09/6
	 * @author dbj
	 * @returns {Promise.<*>}
	 */
	[types.AIIS](state, { data }){		
		state.aiIsData = data
	},
	/**
	 * 意向数据选择
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/09/11
	 * @author hezd
	 * @returns {Promise.<*>}
	 */
	[types.CUSTOMERRESULT](state, { data }){		
		state.customerResultData = data
	},
	
}

export default mutations
