import * as types from './mutation-types'

import { segmentListSvr } from '@/services/customersegment'

/**
 * 客户分组列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function segmentList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await segmentListSvr(obj)
  commit(
    {
      type: types.SEGMENT_LIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
