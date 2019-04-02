 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,XSAPI_URL,ZSAPI_URL} from '@/constants/interface';

/**
 * 查询全量省市区
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getAreaListSvr(obj,commit) {
  return axios.post(XSAPI_URL+'/ucarea/getAreaList',API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}