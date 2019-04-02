 /**
  * 企业服务层,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 获取我的仪表盘
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function resultsListSvr(obj) {
    return axios.get(XSAPI_URL + '/oadashboard/getMyDashboard?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
        return res.data.data
    });
 }
  /**
  * 根据仪表盘分类获取仪表盘
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function resultsAllSvr(obj) {
  return axios.get(XSAPI_URL + '/oadashboard/getDashboardByType?' + API_PARM_FUN_ALL(obj, 0)).then(res => {
      return res.data.data
  });
}
  /**
  * 添加我的仪表盘
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function resultsAddSvr(obj) {
    return axios.post(XSAPI_URL+'/oadashboard/addMyDashboard', API_PARM_FUN_ALL(obj,0)).then(res => {      
      return res.data.data
    });
}
  /**
  * 获取仪表盘类型
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function resultsTypeSvr(obj) {
  return axios.post(XSAPI_URL+'/oadashboard/getDashboardType', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}