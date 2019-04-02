
 /**
  * 企业通讯录
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 企业下面的所有员工
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getXsUserList(obj) {
    return axios.get(XSAPI_URL + '/user/getXsUserList?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}


 /**
  * 获取员工详情
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/31
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getUserDetail(obj) {
    return axios.get(XSAPI_URL + '/user/getXsBaseUserInfo?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}

 /**
  * 获取部门员工列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/31
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getUserListByDepartId(obj) {
    return axios.get(XSAPI_URL + '/company/getUserListByDepartId?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}

/**
 * 用户基本信息更新
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/25
 * @author jzq 
 * @returns {Promise.<*>}
 */
export function updateUserInfoSvr(obj) {
    return axios.post(XSAPI_URL + '/user/updateUserInfo', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
 }
 
 /**
  * 修改密码,需验证原密码
  * @param Object [k=>v参数对象] obj
  * @since 2018/6/25
  * @author jzq 
  * @returns {Promise.<*>}
  */
 export function XSChangePasswordSvr(obj) {
    return axios.post(XSAPI_URL + '/user/XSChangePassword', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
 }
 
 /**
  * 数据字典查询
  * @param Object [k=>v参数对象] obj
  * @since 2018/08/07
  * @author jzq 
  * @returns {Promise.<*>}
  */
 export function getDictSvr(obj) {
    return axios.post(XSAPI_URL + '/user/getDict', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
 }