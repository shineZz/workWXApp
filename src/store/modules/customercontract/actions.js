import * as types from './mutation-types'

import {
  contractRecordSvr,
  contractListSvr,
  contractDetailSvr,
  contractDetailByNumSvr,
  addContractSvr,
  updateContractSvr,
} from '@/services/customercontract'

/**
 * 合同记录（合同数量，合同金额）
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function contractRecord ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await contractRecordSvr(obj)
  commit(
    {
      type: types.CONTRACT_RECORD,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 合同列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function contractList ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await contractListSvr(obj)
  commit(
    {
      type: types.CONTRACT_LIST,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 合同详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function contractDetail ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await contractDetailSvr(obj)
  commit(
    {
      type: types.CONTRACT_DETAIL,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 通过合同号获取合同基本信息
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function contractDetailByNum ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await contractDetailByNumSvr(obj)
  commit(
    {
      type: types.CONTRACT_DETAIL_BYNUM,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加合同
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function addContract ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await addContractSvr(obj)
  commit(
    {
      type: types.ADD_CONTRACT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 编辑合同
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateContract ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateContractSvr(obj)
  commit(
    {
      type: types.UPDATE_CONTRACT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}