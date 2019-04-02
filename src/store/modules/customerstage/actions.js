import * as types from './mutation-types'

import { stageListSvr } from '@/services/customerstage'

/**
 * 客户阶段列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function stageList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await stageListSvr(obj)
  commit(
    {
      type: types.STAGE_LIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}