 /**
  * 企业服务层,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 获取预先定义的流程节点处理人 
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author dbj 
  * @returns {Promise.<*>}
  */

export function queryApprovalSvr(obj) {
  return axios.get(XSAPI_URL + '/oaprocess/getDefineProcessNodeList?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
      return res.data.data
  });
}
 
/**
 * 流程列表接口(我发起的流程/待我审核的流程/我已审批的流程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author dbj
 * @returns {Promise.<*>}
 */
export function processListSvr(obj) {
  return axios.post(XSAPI_URL + '/oaprocess/getProcessList' , API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
  });
}
/**
 * 查看流程详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author dbj
 * @returns {Promise.<*>}
 */
export function viewProcessSvr(obj){
    return axios.post(XSAPI_URL + '/oaprocess/viewProcessDetail' ,API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
  });
}
/**
 * 流程节点审批(同意/拒绝/转发/ 撤销
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/1
/ * @author dbj
 * @returns {Promise.<*>}
 */
export function btnApprovalSvr(obj){
    return axios.post(XSAPI_URL + '/oaprocess/processNodeApproval',API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
  });
}
/**
 * 新增加流程
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/8
/ * @author dbj
 * @returns {Promise.<*>}
 */

export function addApprovalSvr(obj) {
  return axios.post(XSAPI_URL+'/oaprocess/createProcess', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}


