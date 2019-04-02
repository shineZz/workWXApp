import * as types from './mutation-types'

import {
  paymentSumSvr,
  paymentListSvr,
  paymentDetailSvr,
  addPaymentSvr,
  updatePaymentSvr,
  receivePaymentSvr,
  installmentNumListSvr,
} from '@/services/customerrecpay'

/**
 * 回款记录金额合计
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function paymentSum ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await paymentSumSvr(obj)
  commit(
    {
      type: types.PAYMENT_SUM,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 回款记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function paymentList ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await paymentListSvr(obj)
  commit(
    {
      type: types.PAYMENT_LIST,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 回款记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function paymentDetail ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await paymentDetailSvr(obj)
  commit(
    {
      type: types.PAYMENT_DETAIL,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加回款记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function addPayment ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await addPaymentSvr(obj)
  commit(
    {
      type: types.ADD_PAYMENT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 编辑回款记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updatePayment ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updatePaymentSvr(obj)
  commit(
    {
      type: types.UPDATE_PAYMENT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 回款操作
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function receivePayment ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await receivePaymentSvr(obj)
  commit(
    {
      type: types.RECEIVE_PAYMENT,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 分期回款期数列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function installmentNumList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await installmentNumListSvr(obj)
  commit(
    {
      type: types.PAY_INSTALL_LIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}