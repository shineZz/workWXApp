 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';

/**
 * 客户分组列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function segmentListSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customersegment/segmentList?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
