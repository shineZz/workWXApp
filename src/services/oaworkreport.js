 /**
  * 企业服务层,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 查询工作报告审阅人 
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author dbj 
  * @returns {Promise.<*>}
  */

export function queryReviewSvr(obj) {
  return axios.get(XSAPI_URL + '/oaworkreport/getWorkSet?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
      return res.data.data
  });
}
  /**
  * 保存工作报告审阅人 
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function saveReviewSvr(obj) {
  return axios.post(XSAPI_URL+'/oaworkreport/saveWorkSet', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}
  /**
  * 我发起的 
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function initiateReportSvr(obj) {
  return axios.get(XSAPI_URL + '/oaworkreport/queryWorkReport?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
      return res.data.data
  });
}
  /**
  * 我收到的 
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function receivedReportSvr(obj) {
  return axios.get(XSAPI_URL + '/oaworkreport/getCheckWorkReportList?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
      return res.data.data
  });
}
  /**
  * 查看工作报告详情 
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function viewReportSvr(obj) {
  return axios.get(XSAPI_URL + '/oaworkreport/viewWorkReport?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
      return res.data.data
  });
}
  /**
  * 工作日报评论查看
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/31
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function reportCommentSvr(obj) {
  return axios.get(XSAPI_URL + '/oaworkreport/viewWorkReportComment?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
      return res.data.data
  });
}
  /**
  * 工作日报添加评论
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/31
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function reportCommentAddSvr(obj) {
  return axios.post(XSAPI_URL+'/oaworkreport/saveWorkReportComment', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}
  /**
  * 添加工作日报
  * @param Object [k=>v参数对象] obj
  * @since 2018/6/8
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function addReportSvr(obj) {
  return axios.post(XSAPI_URL+'/oaworkreport/operateWorkReport', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}
 /**
  * 查看我收到的列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/6/8
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function getMyReceiveReportUserList(obj) {
  return axios.post(XSAPI_URL+'/oaworkreport/getMyReceiveReprotUserList', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}
