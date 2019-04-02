import * as types from './mutation-types'

import { customerRecordListsSvr, addCustomerRecordSvr, addCallPhoneRecordSvr } from '@/services/customeractionrecord'

/**
 * 获取客户记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function customerRecordLists ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await customerRecordListsSvr(obj)
  commit(
    {
      type: types.GET_CUSTOMER_RECORDLIST,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加客户记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function addCustomerRecord ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await addCustomerRecordSvr(obj)
  commit(
    {
      type: types.ADD_CUSTOMER_RECORD,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加拨打电话的记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function addCallPhoneRecord ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await addCallPhoneRecordSvr(obj)
  commit(
    {
      type: types.ADD_CALL_RECORD,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}