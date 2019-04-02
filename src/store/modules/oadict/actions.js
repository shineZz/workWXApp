import * as types from './mutation-types'
import { getDictByConditionSvr } from '@/services/oadict'
/**
 * 获取用户有日程数据的日
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getDict ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await getDictByConditionSvr(obj)
  commit(
    {
      type: types.DICT,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}