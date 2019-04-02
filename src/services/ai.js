 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';
/**
 *  获取话术列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/15
 * @author dbj
 * @returns {Promise.<*>}
 */
export function talkAboutSvr(obj,commit) {
   return axios.get(CRMAPI_URL+'/ai/queryRobotDefs?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}

/**
 *  获取主叫号码列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/15
 * @author dbj
 * @returns {Promise.<*>}
 */
export function phoneListSvr(obj,commit) {
   return axios.get(CRMAPI_URL+'/ai/queryCallPhones?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 *  查询全量的任务名称
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/16
 * @author dbj
 * @returns {Promise.<*>}
 */
export function queryNameListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/queryAllTaskName?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  添加通话记录到新的任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export function addCustomerSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/addCustomerToTask', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
 }
/**
 *  创建ai任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/16
 * @author dbj
 * @returns {Promise.<*>}
 */
export function addAiTaskSvr(obj,commit) {
 return axios.post(CRMAPI_URL+'/ai/addTask', API_PARM_FUN_ALL(obj,2)).then(res => {
  return res.data.data
});
}
/**
 *  获取当前线路的席位
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/16
 * @author dbj
 * @returns {Promise.<*>}
 */
export function seatsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/queryConcurrencyQuota?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  获取任务列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export function queryListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/queryTasks?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  获取全部启动/全部暂停 按钮状态
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export function allTaskStatusSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/getAllTaskStatus?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  启动全部任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export function allTaskStartSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/startAllTask', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  暂停全部任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export function allTaskEndSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/pauseAllTask', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  获取话术的行业名称
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */

export function industryScreeningSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/queryRobotDefIndustries?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  获取任务统计分析结果
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */

export function statisticalSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/getTaskStatistic?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *  获取任务下的通话列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */

export function taskPhoneListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/queryPhoneRecords?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}


/**
 *   获取通话详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */

export function taskPhoneDetailSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/getPhoneRecordDetail?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *    删除任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */

export function delTaskSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/removeTask', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *    启动任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */

export function startTaskSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/startTask', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *    暂停任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export function pauseTaskSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/pauseTask', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 * 提交已读状态
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export function readTaskSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/redactPhoneRead', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 * 提交人工意向等级
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export function intentionGradeSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/ai/presentPhoneResult', API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *   外呼方式
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/21
 * @author dbj
 * @returns {Promise.<*>}
 */

export function outboundWaySvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/queryPhoneType?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}

/**
 *   当前AI企业有没有开通
 * @param Object [k=>v参数对象] obj
 * @since 2018/09/06
 * @author dbj
 * @returns {Promise.<*>}
 */

export function aiIsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/checkByrobotCompany?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}
/**
 *   意向选择数据
 * @param Object [k=>v参数对象] obj
 * @since 2018/09/11
 * @author hezd
 * @returns {Promise.<*>}
 */

export function customerResultSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/ai/getCustomerResultValues?'+API_PARM_FUN_ALL(obj,2)).then(res => {
   return res.data.data
 });
}