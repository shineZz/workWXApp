

/**
  * 客户标签
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL } from '@/constants/interface';

/**
 * 行业 
 * @param Object [参数对象{k:v}] obj`
 * @since 2018/8/8
 * @author hezd
 * @returns {Promise.<*>}
 */
export function findAllCustomerIndustrySvr(obj) {
    return axios.post(CRMAPI_URL+'/customerindustry/findAllCustomerIndustry', API_PARM_FUN_ALL(obj,2)).then(res => {      
       return res.data.data
     });
}
