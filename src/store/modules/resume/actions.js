import * as types from './mutation-types'
import { resumeListSvr, wishListSvr, myTalentListSvr, resumeDetailSvr, addSubscribeSvr, removeSubscribeSvr, buySubscribeSvr } from '@/services/resume'
/**
 * 简历列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/16
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function resumeList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await resumeListSvr(obj)
  commit(
    {
      type: types.TALENTLIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 意愿列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/17
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function wishList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await wishListSvr(obj)
  commit(
    {
      type: types.TALENTLIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 我的人才列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/17
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function myTalentList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await myTalentListSvr(obj)
  commit(
    {
      type: types.TALENTLIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 简历详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/16
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function resumeDetail ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await resumeDetailSvr(obj)
  commit(
    {
      type: types.RESUMEDETAIL,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 加入意愿
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/19
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function addSubscribe ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await addSubscribeSvr(obj)
  commit(
    {
      type: types.ADDSUBSCRIBE,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 移除意愿
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/19
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function removeSubscribe ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await removeSubscribeSvr(obj)
  commit(
    {
      type: types.REMOVESUBSCRIBE,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 订阅简历
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/20
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function buySubscribe ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await buySubscribeSvr(obj)
  commit(
    {
      type: types.BUYSUBSCRIBE,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}