
/**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL } from '@/constants/interface';

/**
 * 企业规模列表 
 * @param Object [参数对象{k:v}] obj`
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getCustomerScaleSvr(obj) {
    return axios.get(CRMAPI_URL+'/customerscale/getCustomerScale?'+API_PARM_FUN_ALL(obj,2)).then(res => {      
       return res.data.data
     });
}
