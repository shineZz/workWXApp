import * as types from './mutation-types'
import { visitTypeListSvr} from '@/services/customervisittype'


/**
 * 获取客户的拜访记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/7
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function VisitTypeListSvr({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await visitTypeListSvr(obj)
  commit({
      type: types.VISITYTYPELIST,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}