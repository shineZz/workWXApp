import * as types from './mutation-types'

// 同步方法
const mutations = {
	/**
     * 附近客户列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.NEARBYCUSTOMER](state, { data }) {
        state.nearbyCustomerListData = data
    },
    /**
     * 选择的客户列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.CHOOSECUSTOMER](state, { data }) {
        state.chooseCustomerListData = data
    },
	/**
	 * 获取客户列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/06
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CUSTOMERS_LISTS](state, { data }){
		state.customersLists = data
	},
	/**
	 * 获取搜索历史记录的列表取前十
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/06
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_CUSTOMER_SEARCHKEYWORD_LIST](state, { data }){
		state.searchKeyword = data
	},
	/**
	 * 删除搜索记录
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/06
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.DEL_CUSTOMER_SEARCHKEYWORD](state, { data }){
		state.delSearchKeyword = data
	},
	/**
	 * 搜索客户或同事列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/06
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CUSTOMER_WORKER_LIST](state, { data }){
		state.workList = data
	},
	/**
	 * 手动添加客户
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.ADD_ONE_CUSTOMER](state, { data }){
		state.addOneCustomer = data
	},
	/**
	 * 手动添加客户
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.EDIT_CUSTOMER](state, { data }){
		state.editCustomer = data
	},
	/**
	 * 获取客户属性
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_CUSTOMER_PROPERTY](state, { data }){
		state.getProperty = data
	},
	/**
	 * 获取客户详情
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_CUSTOMER_DETAIL](state, { data }){
		state.getDetail = data
	},
	/**
	 * 修改客户阶段
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UPDATE_CUSTOMER_STAGE](state, { data }){
		state.updateStage = data
	},
	/**
	 * 修改客户分组/转移客户分组
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UPDATE_CUSTOMER_SEGMENT](state, { data }){
		state.updateSegment = data
	},
	/**
	 * 变更客户来源
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UPDATE_CUSTOMER_SOURCE](state, { data }){
		state.updateSource = data
	},
	/**
	 * 修改客户个性标签
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/09
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UPDATE_CUSTOMER_LABEL](state, { data }){
		state.updatelabel = data
	},
	/**
	 * 修改客户共享关系
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/09
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UPDATE_CUSTOMER_SHARE](state, { data }){
		state.updateShare= data
	},
	/**
	 * 删除客户
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/09
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.DELETE_CUSTOMERS](state, { data }){
		state.deleteCustomers= data
	},
	/**
	 * 添加共享客户（支持批量和单个）
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/09
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.ADD_SHARE_CUSTOMERS](state, { data }){
		state.addShare= data
	},
	/**
	 * 转移客户（支持批量和单个）
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/09
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.CHANGE_CUSTOMER_BELONGER](state, { data }){
		state.changeBelong= data
	},
	/**
	 * 我的客户列表(普通列表、地图模式)
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.MY_CUSTOMER_LISTS](state, { data }){
		state.myCustomerLists = data
	},
	/**
	 * 共享给我的客户列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SHARE_CUSTOMER_LISTS](state, { data }){
		state.shareCustomerLists = data
	},
	/**
	 * 待完善我的客户列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.UNPERFECT_CUSTOMER_LISTS](state, { data }){
		state.unPerfectCustomerList = data
	},
	/**
	 * 获取客户关键内容
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/08
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_CUSTOMER_KEY_CONTENT](state, { data }){
		state.getKeyContent = data
	},
	/**
	 * 分组下的客户
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/10
	 * @author hezd
	 * @returns {Promise.<*>}
	 */
	[types.GETCUSTOMERGROUP](state, { data }){
		state.customerGroupData = data
	},
	/**
	 * 企业微信外部联系人导入(单选、多选)
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/21
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.WX_EXTERNAL_CONTACT](state, { data }){
		state.wxContact = data
	},
	/**
	 * 公海客户列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/10/23
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SEA_CUSTOMER_LISTS](state, { data }){
		state.seaCustomerLists = data
	},
	/**
	 * 审核流程列表
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/10/23
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SEA_CUSAUDIT_RECORD_LISTS](state, { data }){
		state.seaCusAuditRecordLists = data
	},
	/**
	 * 指派给我、指派给同事,提交审核
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/10/25
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.SAVE_SEA_CUSTOMER_AUDIT](state, { data }){
		state.saveSeaCustomerAudit = data
	},
	/**
	 * 放弃客户
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/10/25
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GIVEUP_CUSTOMER](state, { data }){
		state.giveupCustomer = data
	},
	
}

export default mutations
