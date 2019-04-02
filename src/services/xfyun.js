 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,XSAPI_URL,ZSAPI_URL, CRMAPI_URL} from '@/constants/interface';

/**
 * 语音听写上传文件
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getXfyunIatSvr(obj,commit) {
  return axios.get(CRMAPI_URL+'/xfyun/getWxXfyunIat?'+API_PARM_FUN_ALL(obj,2)).then(res => {
    return res.data.data
  });
}
/**
 * 语音听写上传文件(招商)
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export function getWxXfyunIatSvr(obj,commit) {
  return axios.get(ZSAPI_URL+'/xfyun/getWxXfyunIat?'+API_PARM_FUN_ALL(obj,1)).then(res => {
    return res.data.data
  });
}