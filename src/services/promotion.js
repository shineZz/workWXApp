
 /**
  * 推广任务
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, XSAPI_URL, API_PARM_FUN_ALL} from '@/constants/interface';

 /**
  * 推广任务列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getProListsSvr(obj) {
    return axios.get(ZSAPI_URL + '/promotion/getProLists?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}
 /**
  * 推广任务基本详情
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getProTaskInfoSvr(obj) {
    return axios.get(ZSAPI_URL + '/promotion/getTaskInfo?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}
 /**
  * 推广任务详情预览
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function taskProDetailsSvr(obj) {
    return axios.get(ZSAPI_URL + '/promotion/taskProDetails?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}
 /**
  * 推广任务新增或编辑
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
export function updateProTaskSvr(obj) {
    return axios.post(ZSAPI_URL + '/promotion/updateProTask', API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
 }
 /**
  * 更改提交状态
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
export function submitProTasksSvr(obj) {
    return axios.post(ZSAPI_URL + '/promotion/submitProTask', API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
 }
  /**
  * 推广任务上架
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
export function onLineProTaskSvr(obj) {
    return axios.post(ZSAPI_URL + '/promotion/onLineProTask', API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
 }
 /**
  * 上传任务详情文件
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function uploadFileSvr(obj) {
    return axios.get(ZSAPI_URL + '/uploadattch/uploadFile?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}

 /**
  * 推广任务分享详情报表
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function taskShareDetailSvr(obj) {
    return axios.get(ZSAPI_URL + '/report/taskShareDetail?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}
