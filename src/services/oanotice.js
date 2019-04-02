 /**
  * 公共资源,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

/**
  * 公告列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getNoticeList(obj) {
    return axios.post(XSAPI_URL + '/oanotice/getNoticeList', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}


 /**
  * 所属栏目列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function searchNoticeBoard(obj) {
    return axios.post(XSAPI_URL + '/oanotice/queryAllNoticeBoard' , API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}



/**
  * 发布公告
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function saveNotice(obj) {
    return axios.post(XSAPI_URL + '/oanotice/saveNotice', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}

/**
  * 发布公告
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getSysListSvr(obj) {
   return axios.post(XSAPI_URL + '/sysmessage/getSysMessageList', API_PARM_FUN_ALL(obj,0)).then(res => {
      
    return res.data.data
   });
}

/**
  * 获取公告详情
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/29
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function viewNoticeSvr(obj) {
   return axios.post(XSAPI_URL + '/oanotice/viewNotice', API_PARM_FUN_ALL(obj,0)).then(res => {
       return res.data.data
   });
}

/**
  * 获取是否有未读文件
  * @param Object [k=>v参数对象] obj
  * @since 2018/6/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function notViewNoticeSvr(obj) {
    return axios.post(XSAPI_URL + '/oanotice/notViewNotice', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
 }


 /**
  * 获取是否有权限栏目
  * @param Object [k=>v参数对象] obj
  * @since 2018/6/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function isJurisdictionSvr(obj) {
    return axios.post(XSAPI_URL + '/oanotice/queryAllNoticeBoard', API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
        
    });
 }