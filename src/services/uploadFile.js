
 /**
  * 企业通讯录
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 上传附件
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function XSChangePasswordSvr(obj) {
    return axios.post(XSAPI_URL + '/user/XSChangePassword', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
 }