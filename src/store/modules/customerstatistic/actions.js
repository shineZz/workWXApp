import * as types from './mutation-types'
import { getStatisticDetailsSvr } from '@/services/customerstatistic'

/**
 * 获取客户统计的小红点
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/06
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getStatisticDetails ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await getStatisticDetailsSvr(obj)
  commit(
    {
      type: types.GET_STATISTIC_DETAILS,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}