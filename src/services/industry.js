/**
 * 获取行业列表
 */
import axios from 'axios'
import { API_PARM_ALL, ZSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 行业列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/9
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getAllIndustrysSvr(obj) {
     return axios.get(ZSAPI_URL + '/industry/getAllIndustrys?' + API_PARM_FUN_ALL(obj, 1)).then(res => {
         return res.data.data
     });
 }