/**
 * 短信服务层,获取后端数据
 */

import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,XSAPI_URL,CRMAPI_URL} from '@/constants/interface'

/**
 * 获取企业短信验证码
 * 验证用途: bind_mobile-绑定手机号、更换新手机号;
 *         current_mobile-检测当前绑定的手机号;
 *         register-注册用户;
 *         reset_password-重置密码;
 *         reset_withdraw-重置提现密码
 * 
 * @param Object [参数对象k=>v]
 * @since 2018/6/12
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getSmsTxtCodeSvr(obj) {
  return axios.get(XSAPI_URL+'/sms/xsTextCode?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}

/**
 * 获取企业语音验证码
 * 验证用途: bind_mobile-绑定手机号、更换新手机号;
 *         current_mobile-检测当前绑定的手机号;
 *         register-注册用户;
 *         reset_password-重置密码;
 *         reset_withdraw-重置提现密码
 * 
 * @param Object [参数对象k=>v]
 * @since 2018/6/12
 * @author jzq
 * @returns {Promise.<*>}
 */
export  function getSmsVoiceCodeSvr(obj) {
  return axios.get(XSAPI_URL+'/sms/xsVoiceCode?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}


/**
 * 检查企业验证码
 * 验证用途: bind_mobile-绑定手机号、更换新手机号;
 *         current_mobile-检测当前绑定的手机号;
 *         register-注册用户;
 *         reset_password-重置密码;
 *         reset_withdraw-重置提现密码
 *
 * @param Object [参数对象k=>v]
 * @since 2018/6/12
 * @author jzq
 * @returns {Promise.<*>}
 */
export  function smsCheckCodeSvr(obj) {
  return axios.get(XSAPI_URL+'/sms/smsCodeCheck?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}

/**
  * 添加短信记录
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function addSmsRecordSvr(obj) {
  return axios.get(CRMAPI_URL + '/sms/addSmsRecord?' + API_PARM_FUN_ALL(obj,2)).then(res => {
      return res.data.data
  });
}
/**
  * 添加发送短信记录
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function sendSmsSvr(obj) {
  return axios.get(CRMAPI_URL + '/sms/sendSms?' + API_PARM_FUN_ALL(obj,2)).then(res => {
      return res.data.data
  });
}
/**
  * 查看短信记录
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function smsListsSvr(obj) {
  return axios.get(CRMAPI_URL + '/sms/smsLists?' + API_PARM_FUN_ALL(obj,2)).then(res => {
      return res.data.data
  });
}
/**
  * 清空短信记录
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function deleteSmsSvr(obj) {
  return axios.get(CRMAPI_URL + '/sms/deleteSms?' + API_PARM_FUN_ALL(obj,2)).then(res => {
      return res.data.data
  });
}

