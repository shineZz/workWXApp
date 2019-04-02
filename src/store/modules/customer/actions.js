import * as types from './mutation-types'
import {
  getNearCustomerListsSvr,
  chooseCustomerListsSvr,
  customersListsSvr,
  getCustomerSearchKeywordListSvr,
  deleteCustomerSearchKeywordSvr,
  customerWorkerListSvr,
  addOneCustomerSvr,
  editCustomerSvr,
  getCustomerPropertySvr,
  getCustomerDetailSvr,
  updateCustomerStageSvr,
  updateCustomerSegmentSvr,
  updateCustomerSourceSvr,
  updateCustomerLabelSvr,
  updateCustomerShareSvr,
  deleteCustomersSvr,
  addShareCustomersSvr,
  changeCustomerBelongerSvr,
  myCustomerListsSvr,
  shareMyCustomerListsSvr,
  unPerfectCustomerListsSvr,
  getCustomerKeyContentSvr,
  getAllCustomerListsBySegmentSvr,
  importWxExternalContactSvr,
  seaCustomerListsSvr,
  seaCusAuditRecordListsSvr,
  saveSeaCustomerAuditSvr,
  giveUpCustomerSvr
} from '@/services/customer'


/**
 * 获取附近的客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getNearCustomerLists({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getNearCustomerListsSvr(obj)
  commit({
      type: types.NEARBYCUSTOMER,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 选择的客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function ChooseCustomerListsSvr({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await chooseCustomerListsSvr(obj,commit)
  commit({
      type: types.CHOOSECUSTOMER,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}

/**
 * 获取客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function customersLists ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await customersListsSvr(obj)
  commit(
    {
      type: types.CUSTOMERS_LISTS,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取搜索历史记录的列表取前十
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getCustomerSearchKeywordList ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getCustomerSearchKeywordListSvr(obj)
  commit(
    {
      type: types.GET_CUSTOMER_SEARCHKEYWORD_LIST,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 删除搜索记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function deleteCustomerSearchKeyword ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await deleteCustomerSearchKeywordSvr(obj)
  commit(
    {
      type: types.DEL_CUSTOMER_SEARCHKEYWORD,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 搜索客户或同事列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function customerWorkerList ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await customerWorkerListSvr(obj)
  commit(
    {
      type: types.CUSTOMER_WORKER_LIST,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 手动添加客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function addOneCustomer ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await addOneCustomerSvr(obj)
  commit(
    {
      type: types.ADD_ONE_CUSTOMER,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 编辑客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function editCustomer ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await editCustomerSvr(obj)
  commit(
    {
      type: types.EDIT_CUSTOMER,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取客户属性
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getCustomerProperty ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getCustomerPropertySvr(obj)
  commit(
    {
      type: types.GET_CUSTOMER_PROPERTY,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取客户详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getCustomerDetail ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getCustomerDetailSvr(obj)
  commit(
    {
      type: types.GET_CUSTOMER_DETAIL,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改客户阶段
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateCustomerStage ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateCustomerStageSvr(obj)
  commit(
    {
      type: types.UPDATE_CUSTOMER_STAGE,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改客户分组/转移客户分组
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateCustomerSegment ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateCustomerSegmentSvr(obj)
  commit(
    {
      type: types.UPDATE_CUSTOMER_SEGMENT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 变更客户来源
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateCustomerSource ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateCustomerSourceSvr(obj)
  commit(
    {
      type: types.UPDATE_CUSTOMER_SOURCE,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改客户个性标签
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateCustomerLabel ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateCustomerLabelSvr(obj)
  commit(
    {
      type: types.UPDATE_CUSTOMER_LABEL,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改客户共享关系
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateCustomerShare ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateCustomerShareSvr(obj)
  commit(
    {
      type: types.UPDATE_CUSTOMER_SHARE,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 删除客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function deleteCustomers ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await deleteCustomersSvr(obj)
  commit(
    {
      type: types.DELETE_CUSTOMERS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加共享客户（支持批量和单个）
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function addShareCustomers ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await addShareCustomersSvr(obj)
  commit(
    {
      type: types.ADD_SHARE_CUSTOMERS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 转移客户（支持批量和单个）
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function changeCustomerBelonger ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await changeCustomerBelongerSvr(obj)
  commit(
    {
      type: types.CHANGE_CUSTOMER_BELONGER,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 我的客户列表(普通列表、地图模式)
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function myCustomerLists ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await myCustomerListsSvr(obj)
  commit(
    {
      type: types.MY_CUSTOMER_LISTS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 共享给我的客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function shareMyCustomerLists ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await shareMyCustomerListsSvr(obj)
  commit(
    {
      type: types.SHARE_CUSTOMER_LISTS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 待完善我的客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function unPerfectCustomerLists ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await unPerfectCustomerListsSvr(obj)
  commit(
    {
      type: types.UNPERFECT_CUSTOMER_LISTS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取客户关键内容
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getCustomerKeyContent ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getCustomerKeyContentSvr(obj)
  commit(
    {
      type: types.GET_CUSTOMER_KEY_CONTENT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 分组下的客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getAllCustomerListsBySegment ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getAllCustomerListsBySegmentSvr(obj)
  commit(
    {
      type: types.GETCUSTOMERGROUP,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 企业微信外部联系人导入(单选、多选)
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/21
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function importWxExternalContact ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await importWxExternalContactSvr(obj)
  commit(
    {
      type: types.WX_EXTERNAL_CONTACT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 公海客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/23
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function seaCustomerLists ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await seaCustomerListsSvr(obj)
  commit(
    {
      type: types.SEA_CUSTOMER_LISTS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 审核流程列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/23
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function seaCusAuditRecordLists ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await seaCusAuditRecordListsSvr(obj)
  commit(
    {
      type: types.SEA_CUSAUDIT_RECORD_LISTS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 指派给我、指派给同事,提交审核
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/25
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function saveSeaCustomerAudit ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await saveSeaCustomerAuditSvr(obj)
  commit(
    {
      type: types.SAVE_SEA_CUSTOMER_AUDIT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 放弃客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/25
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function giveUpCustomer ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await giveUpCustomerSvr(obj)
  commit(
    {
      type: types.GIVEUP_CUSTOMER,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}

