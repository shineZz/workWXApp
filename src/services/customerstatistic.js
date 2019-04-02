 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';
/**
 * 获取客户统计的小红点
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getStatisticDetailsSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/customerstatistic/getStatisticDetails?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}