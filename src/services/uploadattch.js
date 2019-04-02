
/**
  * 发布任务详情
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
 export function taskUploadAttchSvr(obj) {
    return axios.post(ZSAPI_URL + '/uploadattch/uploadFile', API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
      });
 }
