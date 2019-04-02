
 /**
  * 拜访记录
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL } from '@/constants/interface';


 /**
 * 获取客户的拜访记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function getCustomerVisitSignListsSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/getCustomerVisitSignLists?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}

 /**
 * 获取客户的拜访记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function getCustomerVisitByIdSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/getCustomerVisitById?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}

 /**
 * 拜访签退
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function updateCustomerVisitSignOutSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/updateCustomerVisitSignOut?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}

 /**
 * 查看下属拜访记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function getSubWorkmateVisitSignListsSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/getSubWorkmateVisitSignLists?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}

 /**
 * 获取拜访次数
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function customerVisitStaticSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/customerVisitStatic?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}
 /**
 * 添加拜访记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function addCustomerVisitSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/addCustomerVisit?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}
 /**
 * 编辑拜访记录进行签退
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function editCustomerVisitSignSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/editCustomerVisitSign?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}
 /**
 * 获取我的拜访记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export function getMyCustomerVisitSignListsSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/getMyCustomerVisitSignLists?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}
 /**
 * 查询是否有为签退的
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/25
 * @author hezd
 * @returns {Promise.<*>}
 */
export function getUnsignOutRecordSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisitsign/getUnsignOutRecord?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}

