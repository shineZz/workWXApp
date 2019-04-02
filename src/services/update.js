 /**
  * 企业服务层,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_FUN_ALL, API_PARM_ALL, XSAPI_URL } from '@/constants/interface';

 /**
  * 用户登录获得信息
  * @param Object [k=>v参数对象] obj
  * @since 2018/4/3
  * @author dbj
  * @returns {Promise.<*>}
  */
 export function userInfoSvr(obj) {
     return axios.get(XSAPI_URL + '/qywx/entWxLogin?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
         return res.data.data
     });
 }

 /**
  * 企业微信登录
  * @param Object [k=>v参数对象] obj
  * @since 2018/4/8
  * @author dbj
  * @returns {Promise.<*>}
  */
 export function qywxSvr(obj) {
     return axios.get(XSAPI_URL + '/qywx/getJsApiTicket?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
         return res.data.data
     });
 }
 /**
  * 位置
  * @param Object [k=>v参数对象] obj
  * @since 2018/4/10
  * @author dbj
  * @returns {Promise.<*>}
  */
 export function addressSvr(obj) {
     return axios.get(XSAPI_URL + '/address/getGeoPosition?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
         return res.data.data
     });
 }
 /**
 * 用户选中企业
 * @param Object [参数对象{k:v}] obj
 * @since 2018/6/13
 * @author dbj
 * @returns {Promise.<*>}
 */
export function getProfileSvr(obj) {
    return axios.post(XSAPI_URL+'/company/getListByCompanyIdAndMobile', API_PARM_FUN_ALL(obj,0)).then(res => {      
       return res.data.data
     });
  }
  