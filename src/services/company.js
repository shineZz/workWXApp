
 /**
  * 企业通讯录
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 
/**
 * 用户登陆
 * @param Object [参数对象{k:v}] obj
 * @since 2018/6/12
 * @author dbj
 * @returns {Promise.<*>}
 */
export function userLoginSvr(obj) {
    return axios.post(XSAPI_URL+'/company/companyLogin', API_PARM_FUN_ALL(obj,0)).then(res => {      
       return res.data.data
     });
}

/**
 * 修改企业用户密码
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export function updateWebUserPwdSvr(obj) {
   return axios.post(XSAPI_URL + '/company/updateWebUserPwd', API_PARM_FUN_ALL(obj,0)).then(res => {
       return res.data.data
   });
}
 
/**
 * 检查手机号码是否注册
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export function checkUserRegistSvr(obj) {
  return axios.post(XSAPI_URL + '/company/checkUserRegist', API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
  });
}
 
/**
 * 企业注册/加入企业
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/19
 * @author jzq
 * @returns {Promise.<*>}
 */
export function regCompanySvr(obj) {
  return axios.post(XSAPI_URL + '/company/regCompany', API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
  });
}

/**
 * 获取所有行业列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/22
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getDemoIndustrySvr(obj) {
    return axios.get(XSAPI_URL + '/demo/getDemoIndustry?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}

/**
 * 小宝销售立即体验登录
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/22
 * @author jzq
 * @returns {Promise.<*>}
 */
export function demoLoginSvr(obj) {
    return axios.get(XSAPI_URL + '/demo/demoLogin?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}

 /**
  * 企业下的所有部门
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getDepartMentList(obj) {
    
    return axios.get(XSAPI_URL + '/company/getDepartMentList?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}