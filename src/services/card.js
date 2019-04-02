 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';
/**
 * 名片扫描
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getCCardSvr(obj,commit) {
  return axios.post(CRMAPI_URL+'/card/getCCard', API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}