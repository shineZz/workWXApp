 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,XSAPI_URL} from '@/constants/interface';

/**
 * 获取用户有日程数据的日
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function scheduleDayListSvr(obj) {
    return axios.get(XSAPI_URL+'/oaschedule/scheduleDayList?'+API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
    });
}
/**
 * 获取日程列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function scheduleListSvr(obj) {
  return axios.get(XSAPI_URL+'/oaschedule/getScheduleList?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 新增/编辑日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function saveScheduleSvr(obj) {
  return axios.post(XSAPI_URL+'/oaschedule/saveSchedule', API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 查看日程详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function viewScheduleSvr(obj) {
  return axios.get(XSAPI_URL+'/oaschedule/viewSchedule?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 删除日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function delScheduleSvr(obj) {
  return axios.get(XSAPI_URL+'/oaschedule/delSchedule?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 延期日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function delayScheduleSvr(obj) {
  return axios.get(XSAPI_URL+'/oaschedule/delaySchedule?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 执行日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function executeScheduleSvr(obj) {
  return axios.get(XSAPI_URL+'/oaschedule/executeSchedule?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 按月统计日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author jzq
 * @returns {Promise.<*>}
 */
export function statisticsScheduleSvr(obj) {
  return axios.get(XSAPI_URL+'/oaschedule/statisticsSchedule?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}