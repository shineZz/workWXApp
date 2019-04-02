
/**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL } from '@/constants/interface';


/**
 * 获取短信列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author liuxz
 * @returns {Promise.<*>}
 */
export function getSmsListsSvr(obj) {
  return axios.get(CRMAPI_URL + '/sms/smsLists?' + API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}

/**
 * 添加短信
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author liuxz
 * @returns {Promise.<*>}
 */
export function addSmsRecordSvr(obj) {
  return axios.post(CRMAPI_URL + '/sms/addSmsRecord', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}

/**
 * 清空短信
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author liuxz
 * @returns {Promise.<*>}
 */
export function deleteSmsSvr(obj) {
  return axios.post(CRMAPI_URL + '/sms/deleteSms', API_PARM_FUN_ALL(obj, 2)).then(res => {
    return res.data.data
  });
}

/**
 * 添加发送短信的动态记录接口
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author liuxz
 * @returns {Promise.<*>}
 */
export function sendSmsSvr(obj) {
  return axios.post(CRMAPI_URL + '/sms/sendSms', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}

/**
 * 拆分短信
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/21
 * @author hezd
 * @returns {Promise.<*>}
 */
export function addSmsRecordFromWebSvr(obj) {
  return axios.post(CRMAPI_URL + '/sms/addSmsRecordFromWeb', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}