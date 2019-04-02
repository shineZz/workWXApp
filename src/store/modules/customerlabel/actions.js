import * as types from './mutation-types'
import { labelListSvr } from '@/services/customerlabel'


/**
 * 客户标签
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/7
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function LabelListSvr({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await labelListSvr(obj)
  commit({
      type: types.LABELLIST,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
