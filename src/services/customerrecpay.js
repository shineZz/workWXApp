 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';

/**
 * 回款记录金额合计
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function paymentSumSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customerrecpay/paymentSum?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 *  回款记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function paymentListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customerrecpay/paymentList?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 回款记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function paymentDetailSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customerrecpay/paymentDetail?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 添加回款记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function addPaymentSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customerrecpay/addPayment', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 编辑回款记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updatePaymentSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customerrecpay/updatePayment', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 回款操作
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function receivePaymentSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customerrecpay/receivePayment', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 *  分期回款期数列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export function installmentNumListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customerrecpay/installmentNumList?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}

