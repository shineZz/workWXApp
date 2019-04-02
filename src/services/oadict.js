 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,XSAPI_URL} from '@/constants/interface';

/**
 * 根据条件获取数据字典
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getDictByConditionSvr(obj,commit) {
    return axios.get(XSAPI_URL+'/oadict/getDictByCondition?'+API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
    });
}