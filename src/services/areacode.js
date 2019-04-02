 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';

/**
 * 根据父区域码获取子集列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export function findAllAreaCodeByParentCodeSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/areacode/findAllAreaCodeByParentCode?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
