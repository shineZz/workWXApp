import * as types from './mutation-types'

import { getCustomerScaleSvr } from '@/services/customerscale'

/**
 * 企业规模列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/08
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getCustomerScale ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await getCustomerScaleSvr(obj)
  commit(
    {
      type: types.GET_CUSTOMER_SCALE,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
