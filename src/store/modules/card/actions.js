import * as types from './mutation-types'
import { getCCardSvr } from '@/services/card'

/**
 * 名片扫描
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function  getCCard ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getCCardSvr(obj)
  commit(
    {
      type: types.GET_CCARD,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}