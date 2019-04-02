import * as types from './mutation-types'
import { scheduleDayListSvr, scheduleListSvr, saveScheduleSvr, viewScheduleSvr, delScheduleSvr, delayScheduleSvr, executeScheduleSvr, statisticsScheduleSvr } from '@/services/schedule'
/**
 * 获取用户有日程数据的日
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function scheduleDayList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await scheduleDayListSvr(obj)
  commit(
    {
      type: types.SCHEDULEDAYLIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取日程列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function scheduleList ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await scheduleListSvr(obj)
  commit(
    {
      type: types.SCHEDULELIST,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 新增/编辑日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function saveSchedule ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await saveScheduleSvr(obj)
  commit(
    {
      type: types.SAVESCHEDULE,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 查看日程详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function viewSchedule ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await viewScheduleSvr(obj)
  commit(
    {
      type: types.VIEWSCHEDULE,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 删除日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function delSchedule ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await delScheduleSvr(obj)
  commit(
    {
      type: types.DELSCHEDULE,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 延期日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function delaySchedule ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await delayScheduleSvr(obj)
  commit(
    {
      type: types.DELAYSCHEDULE,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 执行日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function executeSchedule ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await executeScheduleSvr(obj)
  commit(
    {
      type: types.EXECUTESCHEDULE,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 按月统计日程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function statisticsSchedule ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await statisticsScheduleSvr(obj)
  commit(
    {
      type: types.STATISTICSSCHEDULE,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}