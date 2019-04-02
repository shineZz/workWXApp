 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';

/**
 * 合同记录（合同数量，合同金额）
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function contractRecordSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customercontract/contractRecord?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 合同列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function contractListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customercontract/contractList?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 合同详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function contractDetailSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customercontract/contractDetail?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 通过合同号获取合同基本信息
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function contractDetailByNumSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customercontract/contractDetailByNum?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 添加合同
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function addContractSvr(obj,commit) {
  console.log(obj)
  return axios.post(CRMAPI_URL+'/customercontract/addContract', API_PARM_FUN_ALL(obj,2)).then(res => {
    console.log(res)
    return res.data.data
  });
}
/**
 * 编辑合同
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updateContractSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/customercontract/updateContract', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}

