
 /**
  * 考勤签到
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 签到地址列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function queryGPSTypeAddList(obj) {
    return axios.get(XSAPI_URL + '/oasign/getWorkSignAddressList?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}

/**
  * 新增签到
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function addSign(obj) {
    return axios.post(XSAPI_URL + '/oasign/addSign', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}




/**
  * 获取上下班签到列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getWorkSignList(obj) {
    return axios.get(XSAPI_URL + '/oasign/getWorkSignList?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        console.log(res,'==========ddddddddddddd=========')
        return res.data.data
    });
}


/**
  * 获取拜访签到列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function queryGPSList(obj) {
    return axios.get(XSAPI_URL + '/oasign/queryGPSList?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}

/**
  * 获取拜访签到详情
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/30
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function viewSignDetail(obj) {
    return axios.get(XSAPI_URL + '/oasign/viewSignDetail?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}



