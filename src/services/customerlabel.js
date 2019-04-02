/**
  * 客户标签
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL } from '@/constants/interface';

/**
 * 客户标签 
 * @param Object [参数对象{k:v}] obj`
 * @since 2018/8/9
 * @author jzq
 * @returns {Promise.<*>}
 */
export function labelListSvr(obj) {
    return axios.get(CRMAPI_URL + '/customerlabel/labelList?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}
