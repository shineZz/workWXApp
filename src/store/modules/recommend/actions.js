import * as types from './mutation-types'
import { getRecomListsSvr,
        getRecomTaskInfoSvr,
        taskRecomDetailsSvr,
        updateRecomTaskSvr,
        submitRecomTaskSvr,
        onLineRecomTaskSvr,
        uploadFileSvr,
        getFieldsSvr,
        getTaskFieldsSvr,
        getTasksStatusSvr,
        getRecommendServiceAuditPassListsSvr,
        addTaskRecommendAuditFlowSvr
      } from '@/services/recommend'

/**
 * 推荐任务列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getRecomLists({ commit }, obj) {
  let data = await getRecomListsSvr(obj)
  commit({
      type: types.RECOMLIST,
      data
  })
}
/**
 * 推荐任务基本详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getRecomTaskInfo({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getRecomTaskInfoSvr(obj)
  commit({
      type: types.RECOMTASKINFO,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 推荐任务详情预览
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function TaskRecomDetailsSvr({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await taskRecomDetailsSvr(obj)
  commit({
      type: types.RECOMTASKDETAIL,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 推荐任务新增或编辑
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function updateRecomTask({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateRecomTaskSvr(obj)
  commit({
      type: types.UPDATERECOM,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 更改提交状态
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function submitRecomTask({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await submitRecomTaskSvr(obj)
  commit({
      type: types.SUBRECOM,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 推荐任务上架
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function onLineRecomTask({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await onLineRecomTaskSvr(obj)
  commit({
      type: types.ONLINERECOM,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 上传任务详情文件
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function UploadFileSvr({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await uploadFileSvr(obj)
  commit({
      type: types.UPLOADFILE,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 推荐内容
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getFields({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getFieldsSvr(obj)
  commit({
      type: types.RECOMMENTFIELDS,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取推荐内容字段
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getTaskFields({ commit }, obj) {
  let data = await getTaskFieldsSvr(obj)
  commit({
      type: types.RECOMMENDTASKFIELDS,
      data
  })
}

/**
 * 获取推荐内容字段
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getTaskStatusLists({ commit }, obj) { 
  let data = await getTasksStatusSvr(obj);
  commit({
    type: types.GETTASKSTATUSLISTS,
    data
  })
}


/**
 * 根据task_id获取推荐客服审核过的经销商(不包含厂家采纳不通过的)的列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getRecommendServiceAuditPassLists({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await getRecommendServiceAuditPassListsSvr(obj);
  commit({
    type: types.GETRECOMMENDSERVICEAUDITPASSLISTS,
    data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
  

  /**
   * 厂家审核采纳与不采纳
   * @param Object [k=>v参数对象] obj
   * @since 2018/8/6
   * @author hezd
   * @returns {Promise.<*>}
   */

  export async function addTaskRecommendAuditFlow({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await addTaskRecommendAuditFlowSvr(obj);
    commit({
      type: types.ADDTASKRECOMMENDAUDITFLOW,
      data
    })
    commit('UPDATE_LOADING', false, { root: true })
  }
