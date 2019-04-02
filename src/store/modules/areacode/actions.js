import * as types from './mutation-types'

import { findAllAreaCodeByParentCodeSvr } from '@/services/areacode'

/**
 * 国际区号信息列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/09
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function findAllAreaCodeByParentCode ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await findAllAreaCodeByParentCodeSvr(obj)
  commit(
    {
      type: types.FIND_ALL_AREA_CODE_BYPARENT,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}
