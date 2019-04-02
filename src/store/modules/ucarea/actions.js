import * as types from './mutation-types'
import { getAreaListSvr} from '@/services/ucarea'


/**
 * 用户基本信息更新
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/25
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getAreaList({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await getAreaListSvr(obj)
  commit({
      type: types.UCAREALIST,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
