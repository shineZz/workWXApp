
 /**
  * 推荐任务
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, XSAPI_URL, API_PARM_FUN_ALL} from '@/constants/interface';

 /**
  * 推荐任务列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getRecomListsSvr(obj) {
    return axios.get(ZSAPI_URL + '/recommend/getRecomLists?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}
 /**
  * 根据task_id获取推荐客服审核过的经销商(不包含厂家采纳不通过的)的列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getRecommendServiceAuditPassListsSvr(obj) {
    return axios.get(ZSAPI_URL + '/recommend/getRecommendServiceAuditPassLists?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}

 /**
  * 推荐任务基本详情
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getRecomTaskInfoSvr(obj) {
    return axios.get(ZSAPI_URL + '/recommend/getTaskInfo?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}
 /**
  * 推荐任务详情预览
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd
  * @returns {Promise.<*>}
  */
 export function taskRecomDetailsSvr(obj) {
    return axios.get(ZSAPI_URL + '/recommend/taskRecomDetails?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}
 /**
  * 推荐任务新增或编辑
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
export function updateRecomTaskSvr(obj) {
    return axios.post(ZSAPI_URL + '/recommend/updateRecomTask', API_PARM_FUN_ALL(obj,1)).then(res => {
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
export function submitRecomTaskSvr(obj) {
    return axios.post(ZSAPI_URL + '/recommend/submitRecomTask', API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
 }
  /**
  * 推荐任务上架
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
export function onLineRecomTaskSvr(obj) {
    return axios.post(ZSAPI_URL + '/recommend/onLineRecomTask', API_PARM_FUN_ALL(obj,1)).then(res => {
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
    return axios.get(ZSAPI_URL + '/uploadattch/uploadFile?' + API_PARM_FUN_ALL(obj,0)).then(res => {
        return res.data.data
    });
}
 /**
  * 推荐内容
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getFieldsSvr(obj) {
    return axios.get(ZSAPI_URL + '/recommend/getFields?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}
/**
  * 获取推荐内容字段
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getTaskFieldsSvr(obj) {
    return axios.get(ZSAPI_URL + '/recommend/getRecommendFields?' + API_PARM_FUN_ALL(obj,1)).then(res => {
        return res.data.data
    });
}

 /**
  * 获取任务状态列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author liuxz
  * @returns {Promise.<*>}
  */
 export function getTasksStatusSvr(obj) {
   return axios.get(ZSAPI_URL + '/task/getTaskStatusLists?' + API_PARM_FUN_ALL(obj,1)).then(res => {
     return res.data.data
   });
 }

 /**
  * 厂家审核采纳与不采纳
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author liuxz
  * @returns {Promise.<*>}
  */

 export function addTaskRecommendAuditFlowSvr(obj) {
   return axios.post(ZSAPI_URL + '/recommend/addTaskRecommendAuditFlow',API_PARM_FUN_ALL(obj,1)).then(res => {
     return res.data.data
   });
 }
