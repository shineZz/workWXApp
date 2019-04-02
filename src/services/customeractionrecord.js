 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';

/**
 * 客户动态记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function customerRecordListsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customeractionrecord/customerRecordLists?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 编辑客户动态记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function editCustomerRecordSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customeractionrecord/editCustomerRecord?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 添加客户动态记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function addCustomerRecordSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customeractionrecord/addCustomerRecord', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 添加拨打电话的记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function addCallPhoneRecordSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customeractionrecord/addCallPhoneRecord?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}