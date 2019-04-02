import * as types from './mutation-types'
import { sourceListSvr } from '@/services/customersource'

/**
 * 客户来源列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function sourceList ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await sourceListSvr(obj)
  commit(
    {
      type: types.SOURCE_LIST,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}