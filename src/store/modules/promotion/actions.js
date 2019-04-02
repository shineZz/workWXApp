import * as types from './mutation-types'
import { getProListsSvr,getProTaskInfoSvr,taskProDetailsSvr,updateProTaskSvr,submitProTasksSvr,onLineProTaskSvr,uploadFileSvr,taskShareDetailSvr } from '@/services/promotion'


/**
 * 推广任务列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getProLists({ commit }, obj) {
  let data = await getProListsSvr(obj)
  commit({
      type: types.PROLIST,
      data
  })
}
/**
 * 推广任务基本详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getProTaskInfo({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getProTaskInfoSvr(obj)
  commit({
      type: types.PROTASKINFO,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 推广任务详情预览
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function TaskProDetailsSvr({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await taskProDetailsSvr(obj)
  commit({
      type: types.PROTASKDETAIL,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 推广任务新增或编辑
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function updateProTask({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateProTaskSvr(obj)
  commit({
      type: types.UPDATEPRO,
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
export async function submitProTasks({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await submitProTasksSvr(obj)
  commit({
      type: types.SUBPRO,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 推广任务上架
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function onLineProTask({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await onLineProTaskSvr(obj)
  commit({
      type: types.ONLINEPRO,
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
 * 推广任务分享详情报表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function TaskShareDetailSvr({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await taskShareDetailSvr(obj)
  commit({
      type: types.SHAREPRO,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}