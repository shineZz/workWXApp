import * as types from './mutation-types'

import { pstatusListSvr } from '@/services/customerrecpaystatus'

/**
 * 回款状态列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/14
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function pstatusList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await pstatusListSvr(obj)
  commit(
    {
      type: types.PSTATUS_LIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
