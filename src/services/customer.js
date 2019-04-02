
/**
 * 企业服务层,获取后端数据
 */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL } from '@/constants/interface';


 /**
 * 查询附近得客户（个人客户或者共享给我的客户）
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function getNearCustomerListsSvr(obj) {
    return axios.get(CRMAPI_URL + '/customer/getNearCustomerLists?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}
 /**
 * 选择的客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function chooseCustomerListsSvr(obj) {
    return axios.get(CRMAPI_URL + '/customer/chooseCustomerLists?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data
    });
}
/**
 * 获取客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export function customersListsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/customersLists?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 获取搜索历史记录的列表取前十
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getCustomerSearchKeywordListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/getCustomerSearchKeywordList?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 删除搜索记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export function deleteCustomerSearchKeywordSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customer/deleteCustomerSearchKeyword', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 搜索客户或同事列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export function customerWorkerListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/customerWorkerList?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 手动添加客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function addOneCustomerSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customer/addOneCustomer', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 编辑客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function editCustomerSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customer/editCustomer', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 客户属性详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getCustomerPropertySvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/getCustomerProperty?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 客户资料详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getCustomerDetailSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/getCustomerDetail?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 修改客户阶段
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updateCustomerStageSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/updateCustomerStage?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 修改客户分组/转移客户分组
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updateCustomerSegmentSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/updateCustomerSegment?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 变更客户来源
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updateCustomerSourceSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/updateCustomerSource?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 修改客户个性标签
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updateCustomerLabelSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/updateCustomerLabel?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 修改客户共享关系
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updateCustomerShareSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/updateCustomerShare?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 删除客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export function deleteCustomersSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/deleteCustomers?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 添加共享客户（支持批量和单个）
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export function addShareCustomersSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customer/addShareCustomers', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 转移客户（支持批量和单个）
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export function changeCustomerBelongerSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customer/changeCustomerBelonger', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 我的客户列表(普通列表、地图模式)
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function myCustomerListsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/myCustomerLists?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 共享给我的客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function shareMyCustomerListsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/shareMyCustomerLists?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 待完善我的客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function unPerfectCustomerListsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/unPerfectCustomerLists?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 获取客户关键内容
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getCustomerKeyContentSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/getCustomerKeyContent?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 分组下的客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getAllCustomerListsBySegmentSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/getAllCustomerListsBySegment?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 企业微信外部联系人导入(单选、多选)
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/21
 * @author jzq
 * @returns {Promise.<*>}
 */
export function importWxExternalContactSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/importWxExternalContact?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 公海客户列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/23
 * @author jzq
 * @returns {Promise.<*>}
 */
export function seaCustomerListsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/seaCustomerLists?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 审核流程列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/23
 * @author jzq
 * @returns {Promise.<*>}
 */
export function seaCusAuditRecordListsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customer/seaCusAuditRecordLists?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 指派给我、指派给同事,提交审核
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/25
 * @author jzq
 * @returns {Promise.<*>}
 */
export function saveSeaCustomerAuditSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customer/saveSeaCustomerAudit', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 放弃客户
 * @param Object [k=>v参数对象] obj
 * @since 2018/10/25
 * @author jzq
 * @returns {Promise.<*>}
 */
export function giveUpCustomerSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customer/giveUpCustomer', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}

