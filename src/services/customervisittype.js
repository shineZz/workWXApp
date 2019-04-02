
 /**
  * 拜访签到事件
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL } from '@/constants/interface';


 /**
 * 获取签到事件列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/7
 * @author hezd
 * @returns {Promise.<*>}
 */
export function visitTypeListSvr(obj) {
    return axios.get(CRMAPI_URL + '/customervisittype/visitTypeList?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data
    });
}

 