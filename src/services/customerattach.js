 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,CRMAPI_URL} from '@/constants/interface';

/**
 * 上传附件 
 * @param Object [参数对象{k:v}] obj`
 * @since 2018/8/7
 * @author hezd
 * @returns {Promise.<*>}
 */
export function uploadFileSvr(obj) {
    return axios.post(CRMAPI_URL+'/customerattach/uploadFile', API_PARM_FUN_ALL(obj,2)).then(res => {      
       return res.data.data
     });
}
